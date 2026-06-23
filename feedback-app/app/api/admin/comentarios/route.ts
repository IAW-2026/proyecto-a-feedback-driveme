import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const apiKey = request.headers.get("x-api-key")
    ?? request.headers.get("authorization")?.replace("Bearer ", "");
  if (!apiKey || apiKey !== process.env.FEEDBACK_SERVICE_SECRET) {
    return Response.json({ error: "No autorizado" }, { status: 403 });
  }

  const comentarios = await prisma.calificacion.findMany({
    where: { isInappropriate: true, isActive: true },
    orderBy: { fecha: "asc" },
    select: {
      id_calificacion: true,
      id_viaje: true,
      id_emisor: true,
      id_receptor: true,
      puntaje: true,
      comentario: true,
      fecha: true,
    },
  });

  return Response.json(comentarios);
}
