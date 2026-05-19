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
