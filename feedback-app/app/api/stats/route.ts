import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const apiKey = request.headers.get("x-api-key")
    ?? request.headers.get("authorization")?.replace("Bearer ", "");
  const keysValidas = [process.env.CONTROL_PLANE_SECRET, process.env.ANALYTICS_DASHBOARD_SECRET];
  if (!apiKey || !keysValidas.includes(apiKey)) {
    return Response.json({ error: "No autorizado" }, { status: 403 });
  }

  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);

  const hace14Dias = new Date();
  hace14Dias.setDate(hace14Dias.getDate() - 14);
  hace14Dias.setHours(0, 0, 0, 0);

  const [totalCalificaciones, reportesPendientes, calificacionesHoy, todas, reportesAprobados, reportesRechazados] =
    await Promise.all([
      prisma.calificacion.count({ where: { isActive: true } }),
      prisma.reporte.count({ where: { estado: "PENDIENTE", isActive: true } }),
      prisma.calificacion.count({
        where: { isActive: true, fecha: { gte: hoy } },
      }),
      prisma.calificacion.findMany({
        where: { isActive: true },
        select: { puntaje: true, fecha: true },
      }),
      prisma.reporte.count({ where: { estado: "APROBADO", isActive: true } }),
      prisma.reporte.count({ where: { estado: "RECHAZADO", isActive: true } }),
    ]);

  const promedioGeneral =
    todas.length > 0
      ? Math.round(
          (todas.reduce((sum, c) => sum + c.puntaje, 0) / todas.length) * 10
        ) / 10
      : 0;

  const distribucionPuntajes: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  todas.forEach((c) => { distribucionPuntajes[c.puntaje] = (distribucionPuntajes[c.puntaje] ?? 0) + 1; });

  const conteosPorDia: Record<string, number> = {};
  todas
    .filter((c) => c.fecha >= hace14Dias)
    .forEach((c) => {
      const dia = c.fecha.toISOString().split("T")[0];
      conteosPorDia[dia] = (conteosPorDia[dia] ?? 0) + 1;
    });
  const calificacionesPorDia = Object.entries(conteosPorDia)
    .map(([fecha, cantidad]) => ({ fecha, cantidad }))
    .sort((a, b) => a.fecha.localeCompare(b.fecha));

  const totalResueltos = reportesAprobados + reportesRechazados;
  const tasaAprobacion = totalResueltos > 0 ? Math.round((reportesAprobados / totalResueltos) * 100) / 100 : 0;

  return Response.json({
    total_calificaciones: totalCalificaciones,
    promedio_general: promedioGeneral,
    reportes_pendientes: reportesPendientes,
    calificaciones_hoy: calificacionesHoy,
    distribucion_puntajes: distribucionPuntajes,
    calificaciones_por_dia: calificacionesPorDia,
    reportes_aprobados: reportesAprobados,
    reportes_rechazados: reportesRechazados,
    tasa_aprobacion: tasaAprobacion,
  });
}
