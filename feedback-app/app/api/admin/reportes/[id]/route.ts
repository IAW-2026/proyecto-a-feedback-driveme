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

  if (decision !== "APROBADO" && decision !== "RECHAZADO") {
    return Response.json(
      { error: "decision debe ser APROBADO o RECHAZADO" },
      { status: 400 }
    );
  }

  const reporte = await prisma.reporte.findUnique({
    where: { id_reporte: id },
  });

  if (!reporte || !reporte.isActive) {
    return Response.json({ error: "Reporte no encontrado" }, { status: 404 });
  }

  if (reporte.estado !== "PENDIENTE") {
    return Response.json(
      { error: "El reporte ya fue resuelto" },
      { status: 409 }
    );
  }

  const reporteActualizado = await prisma.reporte.update({
    where: { id_reporte: id },
    data: { estado: decision },
  });

  if (decision === "APROBADO") {
    const calificacion = await prisma.calificacion.update({
      where: { id_calificacion: reporte.id_calificacion },
      data: { isActive: false },
    });

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
      // La calificación ya fue desactivada — si falla la notificación de reputación no se revierte
    }
  }

  return Response.json({
    id_reporte: reporteActualizado.id_reporte,
    estado: reporteActualizado.estado,
    fecha: reporteActualizado.fecha,
  });
}
