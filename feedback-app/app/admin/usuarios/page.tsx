import { currentUser, clerkClient } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { UsuarioFilter } from "./UsuarioFilter";

export default async function AdminUsuariosPage() {
  const user = await currentUser();
  if (!user || user.publicMetadata?.role !== "moderator") redirect("/");

  const calificaciones = await prisma.calificacion.findMany({
    where: { isActive: true },
    select: {
      id_receptor: true,
      puntaje: true,
      comentario: true,
      fecha: true,
    },
  });

  const usuariosMap = new Map<
    string,
    { puntajes: number[]; calificaciones: { puntaje: number; comentario: string | null; fecha: string }[] }
  >();

  for (const c of calificaciones) {
    if (!usuariosMap.has(c.id_receptor)) {
      usuariosMap.set(c.id_receptor, { puntajes: [], calificaciones: [] });
    }
    const entry = usuariosMap.get(c.id_receptor)!;
    entry.puntajes.push(c.puntaje);
    entry.calificaciones.push({
      puntaje: c.puntaje,
      comentario: c.comentario,
      fecha: c.fecha.toISOString(),
    });
  }

  const ids = [...usuariosMap.keys()];
  const clerkNombres: Record<string, string> = {};
  const clerkBanned: Record<string, boolean> = {};
  const clerkIsAdmin: Record<string, boolean> = {};

  if (ids.length > 0) {
    try {
      const client = await clerkClient();
      const response = await client.users.getUserList({ userId: ids, limit: 100 });
      for (const u of response.data) {
        const nombre =
          u.username ||
          `${u.firstName ?? ""} ${u.lastName ?? ""}`.trim() ||
          u.id;
        clerkNombres[u.id] = nombre;
        clerkBanned[u.id] = u.banned ?? false;
        clerkIsAdmin[u.id] = u.publicMetadata?.role === "moderator";
      }
    } catch {
      // si Clerk falla, los usuarios se muestran con su ID
    }
  }

  const usuarios = ids.map((id) => {
    const data = usuariosMap.get(id)!;
    const promedio =
      data.puntajes.reduce((sum, p) => sum + p, 0) / data.puntajes.length;
    return {
      id,
      nombre: clerkNombres[id] ?? id,
      promedio: Math.round(promedio * 10) / 10,
      total: data.puntajes.length,
      calificaciones: data.calificaciones,
      banned: clerkBanned[id] ?? false,
      isAdmin: clerkIsAdmin[id] ?? false,
    };
  });

  return <UsuarioFilter usuarios={usuarios} />;
}
