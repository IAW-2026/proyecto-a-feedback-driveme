import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { moderarComentario, generarResumen } from "@/lib/ai";

export async function POST(request: Request) {
  const { userId } = await auth();
  if (!userId) {
    return Response.json({ error: "No autorizado" }, { status: 401 });
  }

  const body = await request.json();
  const { id_viaje, id_emisor, id_receptor, puntaje, comentario } = body;

  if (!id_viaje || !id_emisor || !id_receptor || puntaje == null) {
    return Response.json({ error: "Faltan campos obligatorios" }, { status: 400 });
  }

  // TODO: verificar que el viaje finalizó (GET /api/viajes/{id_viaje}/estado en Driver App)

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
    where: { id_receptor, isActive: true },
    select: { puntaje: true, comentario: true, isInappropriate: true, id_calificacion: true },
  });

  const promedio =
    todasLasCalificaciones.reduce((sum, c) => sum + c.puntaje, 0) /
    todasLasCalificaciones.length;

  // El comentario inapropiado recién creado se excluye del resumen
  const comentariosParaResumen = todasLasCalificaciones
    .filter((c) => c.comentario && !c.isInappropriate)
    .map((c) => c.comentario as string);

  const resumen =
    comentariosParaResumen.length > 0
      ? await generarResumen(comentariosParaResumen)
      : null;

  // TODO (integración futura): POST /api/conductor/reputacion o /api/pasajero/reputacion con { promedio }
  // TODO (integración futura): enviar { resumen } cuando el endpoint esté definido en las otras apps
  console.log("[reputación]", { id_receptor, promedio, resumen }); // Por ahora solo muestra por consola el resumen, pero en el futuro se enviará a la app correspondiente.

  return Response.json(
    {
      id_calificacion: calificacion.id_calificacion,
      estado: "REGISTRADA",
      timestamp: calificacion.fecha,
    },
    { status: 201 }
  );
}
