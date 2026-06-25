import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const apiKey = request.headers.get("x-api-key")
    ?? request.headers.get("authorization")?.replace("Bearer ", "");
  if (!apiKey || apiKey !== process.env.CONTROL_PLANE_SECRET) {
    return Response.json({ error: "No autorizado" }, { status: 403 });
  }

  const reportes = await prisma.reporte.findMany({
    where: { estado: "PENDIENTE", isActive: true },
    orderBy: { fecha: "desc" },
  });

  return Response.json(
    reportes.map((r) => ({
      id_reporte: r.id_reporte,
      id_calificacion: r.id_calificacion,
      id_reportante: r.id_reportante,
      id_reportado: r.id_reportado,
      motivo: r.motivo,
      descripcion: r.descripcion,
      estado: r.estado,
      fecha: r.fecha,
    }))
  );
}
