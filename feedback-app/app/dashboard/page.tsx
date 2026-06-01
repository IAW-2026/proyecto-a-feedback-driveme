import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { CalificacionesTabs } from "./CalificacionesTabs";

const PAGE_SIZE = 10;
type Tab = "todas" | "recibidas" | "enviadas";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string; page?: string }>;
}) {
  const { userId } = await auth();
  if (!userId) redirect("/");

  const { tab: tabParam = "todas", page: pageParam = "1" } = await searchParams;
  const activeTab: Tab = ["todas", "recibidas", "enviadas"].includes(tabParam)
    ? (tabParam as Tab)
    : "todas";

  const whereBase = { isActive: true, isInappropriate: false };
  const whereTab =
    activeTab === "recibidas"
      ? { id_receptor: userId, ...whereBase }
      : activeTab === "enviadas"
      ? { id_emisor: userId, ...whereBase }
      : { OR: [{ id_emisor: userId }, { id_receptor: userId }], ...whereBase };

  const [totalTodas, totalRecibidas, totalEnviadas, avgResult] = await Promise.all([
    prisma.calificacion.count({ where: { OR: [{ id_emisor: userId }, { id_receptor: userId }], ...whereBase } }),
    prisma.calificacion.count({ where: { id_receptor: userId, ...whereBase } }),
    prisma.calificacion.count({ where: { id_emisor: userId, ...whereBase } }),
    prisma.calificacion.aggregate({
      where: { id_receptor: userId, ...whereBase },
      _avg: { puntaje: true },
    }),
  ]);

  const promedioRecibidas = Math.round((avgResult._avg.puntaje ?? 0) * 10) / 10;

  const totalForTab =
    activeTab === "recibidas" ? totalRecibidas :
    activeTab === "enviadas" ? totalEnviadas :
    totalTodas;
  const totalPages = Math.max(1, Math.ceil(totalForTab / PAGE_SIZE));
  const currentPage = Math.min(Math.max(1, parseInt(pageParam, 10)), totalPages);

  const calificaciones = await prisma.calificacion.findMany({
    where: whereTab,
    orderBy: { fecha: "desc" },
    skip: (currentPage - 1) * PAGE_SIZE,
    take: PAGE_SIZE,
  });

  const idsRecibidas = calificaciones
    .filter((c) => c.id_receptor === userId)
    .map((c) => c.id_calificacion);

  const reportesExistentes = idsRecibidas.length > 0
    ? await prisma.reporte.findMany({
        where: { id_reportante: userId, id_calificacion: { in: idsRecibidas } },
        select: { id_calificacion: true, estado: true },
      })
    : [];

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
        activeTab={activeTab}
        totalTodas={totalTodas}
        totalRecibidas={totalRecibidas}
        totalEnviadas={totalEnviadas}
        promedioRecibidas={promedioRecibidas}
      />
    </main>
  );
}
