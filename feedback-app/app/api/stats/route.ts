import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const apiKey = request.headers.get("x-api-key")
    ?? request.headers.get("authorization")?.replace("Bearer ", "");
  const keysValidas = [
    process.env.FEEDBACK_SERVICE_SECRET,
  ];
  if (!apiKey || !keysValidas.includes(apiKey)) {
    return Response.json({ error: "No autorizado" }, { status: 403 });
  }

  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);

  const [totalCalificaciones, reportesPendientes, calificacionesHoy, todas] =
    await Promise.all([
      prisma.calificacion.count({ where: { isActive: true } }),
      prisma.reporte.count({ where: { estado: "PENDIENTE", isActive: true } }),
      prisma.calificacion.count({
        where: { isActive: true, fecha: { gte: hoy } },
      }),
      prisma.calificacion.findMany({
        where: { isActive: true },
        select: { puntaje: true },
      }),
    ]);

  const promedioGeneral =
    todas.length > 0
      ? Math.round(
          (todas.reduce((sum, c) => sum + c.puntaje, 0) / todas.length) * 10
        ) / 10
      : 0;

  return Response.json({
    total_calificaciones: totalCalificaciones,
    promedio_general: promedioGeneral,
    reportes_pendientes: reportesPendientes,
    calificaciones_hoy: calificacionesHoy,
  });
}
