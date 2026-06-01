import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { CalificacionesTabs } from "./CalificacionesTabs";

const PAGE_SIZE = 10;

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { userId } = await auth();
  if (!userId) redirect("/");

  const { page: pageParam = "1" } = await searchParams;

  const where = {
    OR: [{ id_emisor: userId }, { id_receptor: userId }],
    isActive: true,
    isInappropriate: false,
  };

  const total = await prisma.calificacion.count({ where });

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const currentPage = Math.min(Math.max(1, parseInt(pageParam, 10)), totalPages);

  const calificaciones = await prisma.calificacion.findMany({
    where,
    orderBy: { fecha: "desc" },
    skip: (currentPage - 1) * PAGE_SIZE,
    take: PAGE_SIZE,
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
        totalPages={totalPages}
        currentPage={currentPage}
      />
    </main>
  );
}
