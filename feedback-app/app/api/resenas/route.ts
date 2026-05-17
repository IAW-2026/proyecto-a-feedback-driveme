import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

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

  // Los dos // TODO — marcan dónde irán las llamadas a Driver App y Rider App cuando los demas tengan
  // sus endpoints listos.

  // TODO: verificar que el viaje finalizó (GET /api/viajes/{id_viaje}/estado en Driver App)

  const calificacion = await prisma.calificacion.create({ 
    data: {
      id_viaje,
      id_emisor,
      id_receptor,
      puntaje,
      comentario,
    },
  });

  // TODO: notificar reputación actualizada (Driver App / Rider App)

  return Response.json(
    {
      id_calificacion: calificacion.id_calificacion,
      estado: "REGISTRADA",
      timestamp: calificacion.fecha,
    },
    { status: 201 }
  );
}
