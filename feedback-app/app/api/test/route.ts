import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const calificaciones = await prisma.calificacion.findMany(); //Le pide a la BD que le traiga todas las filas de la tabla (Calificaciones)
  return NextResponse.json({ ok: true, calificaciones }); //Le responde al cliente con un JSON que contiene un objeto con una propiedad "ok" que es true y otra propiedad "calificaciones" que contiene el resultado de la consulta a la BD.
}
