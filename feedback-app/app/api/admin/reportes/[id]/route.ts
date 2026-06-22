import { prisma } from "@/lib/prisma";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const apiKey = request.headers.get("x-api-key");
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
    await prisma.calificacion.update({
      where: { id_calificacion: reporte.id_calificacion },
      data: { isActive: false },
    });
  }

  return Response.json({
    id_reporte: reporteActualizado.id_reporte,
    estado: reporteActualizado.estado,
    fecha: reporteActualizado.fecha,
  });
}
