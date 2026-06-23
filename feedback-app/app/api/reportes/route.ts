import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const apiKey = request.headers.get("x-api-key")
    ?? request.headers.get("authorization")?.replace("Bearer ", "");

  const keysValidas = [process.env.FEEDBACK_SERVICE_SECRET];
  if (!apiKey || !keysValidas.includes(apiKey)) {
    return Response.json({ error: "No autorizado" }, { status: 403 });
  }

  const body = await request.json();
  const { id_reportante, id_calificacion, motivo, descripcion } = body;

  if (!id_reportante || !id_calificacion || !motivo) {
    return Response.json({ error: "Faltan campos obligatorios" }, { status: 400 });
  }

  const calificacion = await prisma.calificacion.findUnique({
    where: { id_calificacion },
  });

  if (!calificacion || !calificacion.isActive) {
    return Response.json({ error: "Calificación no encontrada o inactiva" }, { status: 404 });
  }

  const reporte = await prisma.reporte.create({
    data: {
      id_calificacion,
      id_reportante,
      id_reportado: calificacion.id_emisor,
      motivo,
      descripcion,
    },
  });

  return Response.json(
    {
      id_reporte: reporte.id_reporte,
      estado: reporte.estado,
      timestamp: reporte.fecha,
    },
    { status: 201 }
  );
}
