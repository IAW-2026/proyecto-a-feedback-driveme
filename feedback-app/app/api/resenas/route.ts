import { prisma } from "@/lib/prisma";
import { moderarComentario, generarResumen } from "@/lib/ai";

export async function POST(request: Request) {
  const apiKey = request.headers.get("x-api-key")
    ?? request.headers.get("authorization")?.replace("Bearer ", "");

  const keysValidas = [process.env.DRIVER_SERVICE_SECRET, process.env.RIDER_SERVICE_SECRET];
  if (!apiKey || !keysValidas.includes(apiKey)) {
    return Response.json({ error: "No autorizado" }, { status: 403 });
  }

  const body = await request.json();
  const { id_viaje, id_emisor, id_receptor, puntaje, comentario } = body;

  if (!id_viaje || !id_emisor || !id_receptor || puntaje == null) {
    return Response.json({ error: "Faltan campos obligatorios" }, { status: 400 });
  }

  if (puntaje < 1 || puntaje > 5) {
    return Response.json({ error: "El puntaje debe estar entre 1 y 5" }, { status: 400 });
  }

  try {
    const driverRes = await fetch(
      `${process.env.DRIVER_APP_URL}/api/viajes/${id_viaje}/estado`,
      { headers: { "x-api-key": process.env.FEEDBACK_SERVICE_SECRET! } }
    );
    if (!driverRes.ok) {
      return Response.json({ error: "Viaje no encontrado" }, { status: 404 });
    }
    const viaje = await driverRes.json();
    if (viaje.estado_actual !== "FINALIZADO") {
      return Response.json({ error: "El viaje no ha finalizado aún" }, { status: 400 });
    }
    
    // Determinamos el rol en base al id_emisor
    const role = (viaje.id_conductor === id_emisor || viaje.conductor?.id_conductor === id_emisor) ? "driver" : "rider";
    (request as any).inferredRole = role; // Guardamos el rol para usarlo luego
  } catch {
    return Response.json({ error: "No se pudo verificar el viaje" }, { status: 503 });
  }

  const esInapropiado = comentario ? await moderarComentario(comentario) : false;

  const calificacion = await prisma.calificacion.create({
    data: {
      id_viaje,
      id_emisor,
      id_receptor,
      puntaje,
      comentario,
      isInappropriate: esInapropiado, // Crea la calificación con isInappropriate según el resultado.
    },
  });

  // Calcular promedio y resumen para notificar a la app correspondiente
  const todasLasCalificaciones = await prisma.calificacion.findMany({
    where: { id_receptor, isActive: true, isInappropriate: false },
    select: { puntaje: true, comentario: true, isInappropriate: true, id_calificacion: true },
  });

  const promedio =
    todasLasCalificaciones.length > 0
      ? Math.round(
          (todasLasCalificaciones.reduce((sum, c) => sum + c.puntaje, 0) /
            todasLasCalificaciones.length) *
            10
        ) / 10
      : 0;

  // El comentario inapropiado recién creado se excluye del resumen
  const comentariosParaResumen = todasLasCalificaciones
    .filter((c) => c.comentario && !c.isInappropriate)
    .map((c) => c.comentario as string);

  const resumen =
    comentariosParaResumen.length > 0
      ? await generarResumen(comentariosParaResumen)
      : null;

  try {
    const role = (request as any).inferredRole || "rider";
    if (role === "driver") {
      // Conductor calificó al pasajero → actualizar reputación en Rider App
      await fetch(`${process.env.RIDER_APP_URL}/api/pasajeros/${id_receptor}/reputacion`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", "x-api-key": process.env.FEEDBACK_SERVICE_SECRET! },
        body: JSON.stringify({ puntaje: promedio, comentario_promedio: resumen }),
      });
    } else {
      // Pasajero calificó al conductor → actualizar reputación en Driver App
      await fetch(`${process.env.DRIVER_APP_URL}/api/conductores/${id_receptor}/reputacion`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", "x-api-key": process.env.FEEDBACK_SERVICE_SECRET! },
        body: JSON.stringify({ puntaje: promedio, comentario_promedio: resumen }),
      });
    }
  } catch {
    // La calificación ya fue guardada — si falla la notificación de reputación no se revierte
  }

  return Response.json(
    {
      id_calificacion: calificacion.id_calificacion,
      estado: "REGISTRADA",
      timestamp: calificacion.fecha,
    },
    { status: 201 }
  );
}
