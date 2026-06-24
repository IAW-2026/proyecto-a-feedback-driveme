import { prisma } from "@/lib/prisma";

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

  return Response.json({ id_calificacion: id, decision });
}
