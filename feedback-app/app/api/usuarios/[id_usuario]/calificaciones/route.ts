import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id_usuario: string }> }
) {
  const apiKey = request.headers.get("x-api-key");
  const keysValidas = [
    process.env.DRIVER_SERVICE_SECRET,
    process.env.RIDER_SERVICE_SECRET,
  ];
  if (!apiKey || !keysValidas.includes(apiKey)) {
    return Response.json({ error: "No autorizado" }, { status: 403 });
  }

  const { id_usuario } = await params;

  const calificaciones = await prisma.calificacion.findMany({
    where: {
      id_receptor: id_usuario,
      isActive: true,
      isInappropriate: false,
    },
    select: {
      id_calificacion: true,
      id_viaje: true,
      puntaje: true,
      comentario: true,
      id_emisor: true,
      fecha: true,
    },
  });

  const total = calificaciones.length;
  // Calculo el promedio de las calificaciones y lo redondeo a un decimal. Si no hay calificaciones, el promedio es 0.
  const promedio = 
    total > 0
      ? calificaciones.reduce((sum, c) => sum + c.puntaje, 0) / total 
      : 0;

  return Response.json({
    id_usuario,
    calificacion_promedio: Math.round(promedio * 10) / 10,
    total_calificaciones: total,
    detalles: calificaciones.map((c) => ({ //c es cada calificacion
      id_calificacion: c.id_calificacion,
      id_viaje: c.id_viaje,
      puntaje: c.puntaje,
      comentario: c.comentario,
      id_emisor: c.id_emisor,
      timestamp: c.fecha,
    })),
  });
}
