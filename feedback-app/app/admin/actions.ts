"use server";

import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function eliminarComentario(id_calificacion: string) { // Funcion donde solo un admin puede eliminar un comentario
  const user = await currentUser();
  if (!user || user.publicMetadata?.role !== "admin") {
    throw new Error("No autorizado");
  }

  await prisma.calificacion.update({
    where: { id_calificacion },
    data: { isActive: false },
  });

  revalidatePath("/admin");
}

export async function aprobarComentario(id_calificacion: string) {
  const user = await currentUser();
  if (!user || user.publicMetadata?.role !== "admin") {
    throw new Error("No autorizado");
  }

  await prisma.calificacion.update({
    where: { id_calificacion },
    data: { isInappropriate: false },
  });

  revalidatePath("/admin");
}

export async function resolverReporte(id_reporte: string, decision: "APROBADO" | "RECHAZADO") {
  const user = await currentUser();
  if (!user || user.publicMetadata?.role !== "admin") {
    throw new Error("No autorizado");
  }

  const reporte = await prisma.reporte.update({
    where: { id_reporte },
    data: { estado: decision },
    select: { id_calificacion: true },
  });

  if (decision === "APROBADO") {
    await prisma.calificacion.update({
      where: { id_calificacion: reporte.id_calificacion },
      data: { isActive: false },
    });
  }

  revalidatePath("/admin");
}
