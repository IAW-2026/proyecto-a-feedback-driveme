import { prisma } from "@/lib/prisma";
import { generarResumen } from "@/lib/ai";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const apiKey = request.headers.get("x-api-key")
    ?? request.headers.get("authorization")?.replace("Bearer ", "");
  if (!apiKey || apiKey !== process.env.CONTROL_PLANE_SECRET) {
    return Response.json({ error: "No autorizado" }, { status: 403 });
  }

  const { id } = await params;
  const body = await request.json();
  const { decision } = body;

  if (decision !== "APROBAR" && decision !== "ELIMINAR") {
    return Response.json(
      { error: "decision debe ser APROBAR o ELIMINAR" },
      { status: 400 }
    );
  }

  const calificacion = await prisma.calificacion.findUnique({
    where: { id_calificacion: id },
  });

  if (!calificacion || !calificacion.isActive) {
    return Response.json({ error: "Calificación no encontrada" }, { status: 404 });
  }

  if (!calificacion.isInappropriate) {
    return Response.json(
      { error: "La calificación no está marcada como inapropiada" },
      { status: 409 }
    );
  }

  if (decision === "APROBAR") {
    await prisma.calificacion.update({
      where: { id_calificacion: id },
      data: { isInappropriate: false },
    });
  } else {
    await prisma.calificacion.update({
      where: { id_calificacion: id },
      data: { isActive: false },
    });
  }

  try {
    const driverRes = await fetch(
      `${process.env.DRIVER_APP_URL}/api/viajes/${calificacion.id_viaje}/estado`,
      { headers: { "x-api-key": process.env.FEEDBACK_SERVICE_SECRET! } }
    );
    if (driverRes.ok) {
      const viaje = await driverRes.json();
      const id_receptor = calificacion.id_receptor;
      const role = viaje.id_conductor === id_receptor ? "driver" : "rider";

      const calificaciones = await prisma.calificacion.findMany({
        where: { id_receptor, isActive: true, isInappropriate: false },
        select: { puntaje: true, comentario: true },
      });

      const promedio =
        calificaciones.length > 0
          ? Math.round(
              (calificaciones.reduce((sum, c) => sum + c.puntaje, 0) /
                calificaciones.length) *
                10
            ) / 10
          : 0;

      const comentariosParaResumen = calificaciones
        .filter((c) => c.comentario)
        .map((c) => c.comentario as string);

      const resumen =
        comentariosParaResumen.length > 0
          ? await generarResumen(comentariosParaResumen)
          : null;

      if (role === "driver") {
        await fetch(
          `${process.env.RIDER_APP_URL}/api/pasajeros/${id_receptor}/reputacion`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              "x-api-key": process.env.FEEDBACK_SERVICE_SECRET!,
            },
            body: JSON.stringify({ puntaje: promedio, comentario_promedio: resumen }),
          }
        );
      } else {
        await fetch(
          `${process.env.DRIVER_APP_URL}/api/conductores/${id_receptor}/reputacion`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              "x-api-key": process.env.FEEDBACK_SERVICE_SECRET!,
            },
            body: JSON.stringify({ puntaje: promedio, comentario_promedio: resumen }),
          }
        );
      }
    }
  } catch {
    // La calificación ya fue actualizada — si falla la notificación de reputación no se revierte
  }

  return Response.json({ id_calificacion: id, decision });
}
