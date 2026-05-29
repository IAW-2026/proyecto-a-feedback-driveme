"use server";

import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { analizarComentarios, type AnalisisComentarios } from "@/lib/ai";

export async function crearReporte(id_calificacion: string, motivo: string, descripcion?: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("No autorizado");

  const existing = await prisma.reporte.findFirst({ // Verificar si ya existe un reporte para esta calificación por el mismo usuario, si existe no creo el reporte
    where: { id_calificacion, id_reportante: userId }, 
  });
  if (existing) throw new Error("Ya existe un reporte para esta calificación");

  const calificacion = await prisma.calificacion.findUnique({ where: { id_calificacion } }); // Verificar que la calificación existe y está activa, si no existe o no está activa lanzo un error
  if (!calificacion || !calificacion.isActive) throw new Error("Calificación no encontrada");

  await prisma.reporte.create({ //Creas el reporte con los datos necesarios
    data: {
      id_calificacion,
      id_reportante: userId,
      id_reportado: calificacion.id_emisor,
      motivo,
      descripcion,
    },
  });

  revalidatePath("/dashboard");
}

export async function obtenerAnalisisIA(): Promise<AnalisisComentarios | null> {
  const { userId } = await auth();
  if (!userId) throw new Error("No autorizado");

  const calificaciones = await prisma.calificacion.findMany({
    where: {
      id_receptor: userId,
      isActive: true,
      isInappropriate: false,
      comentario: { not: null },
    },
    select: { comentario: true },
  });

  const comentarios = calificaciones
    .map((c) => c.comentario)
    .filter((c): c is string => c !== null && c.trim().length > 0);

  if (comentarios.length === 0) return null;

  return analizarComentarios(comentarios);
}
