import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { CalificacionesTabs } from "./CalificacionesTabs";

export default async function DashboardPage() {
  const { userId } = await auth();
  if (!userId) redirect("/");

  const calificaciones = await prisma.calificacion.findMany({
    where: {
      OR: [{ id_emisor: userId }, { id_receptor: userId }],
      isActive: true,
      isInappropriate: false,
    },
    orderBy: { fecha: "desc" },
  });

  const idsRecibidas = calificaciones
    .filter((c) => c.id_receptor === userId)
    .map((c) => c.id_calificacion);

  const reportesExistentes = await prisma.reporte.findMany({
    where: { id_reportante: userId, id_calificacion: { in: idsRecibidas } },
    select: { id_calificacion: true, estado: true },
  });

  const estadoReporteMap = Object.fromEntries(
    reportesExistentes.map((r) => [r.id_calificacion, r.estado])
  ) as Record<string, "PENDIENTE" | "APROBADO" | "RECHAZADO">;

  return (
    <main>
      <CalificacionesTabs
        calificaciones={calificaciones}
        userId={userId}
        estadoReporteMap={estadoReporteMap}
      />
    </main>
  );
}
