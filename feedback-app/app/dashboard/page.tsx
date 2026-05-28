import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ReportarButton } from "./ReportarButton";

export default async function DashboardPage() {
  const { userId } = await auth();
  if (!userId) redirect("/");

  const calificaciones = await prisma.calificacion.findMany({
    where: {
      OR: [{ id_emisor: userId }, { id_receptor: userId }], //Calificaciones donde el usuario es emisor o receptor
      isActive: true,
      isInappropriate: false,
    },
    orderBy: { fecha: "desc" },
  });

  const idsRecibidas = calificaciones 
    .filter((c) => c.id_receptor === userId)
    .map((c) => c.id_calificacion);

  const reportesExistentes = await prisma.reporte.findMany({ // Busco los reportes existentes para las calificaciones recibidas por el usuario, para mostrar el estado del reporte en el botón de reportar
    where: { id_reportante: userId, id_calificacion: { in: idsRecibidas } },
    select: { id_calificacion: true, estado: true },
  });
  const estadoReporteMap = new Map(reportesExistentes.map((r) => [r.id_calificacion, r.estado]));

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <p className="text-gray-500 mt-2">Tus calificaciones</p>

      {calificaciones.length === 0 ? (
        <p className="mt-6 text-gray-400">No tenés calificaciones todavía.</p>
      ) : (
        <ul className="mt-6 space-y-4">
          {calificaciones.map((c) => (
            <li key={c.id_calificacion} className="border rounded p-4">
              <div className="flex justify-between">
                <span className="font-semibold">Puntaje: {c.puntaje} / 5</span>
                <span className="text-sm text-gray-400">
                  {new Date(c.fecha).toLocaleDateString("es-AR")}
                </span>
              </div>
              <p className="text-sm mt-1">
                {c.id_emisor === userId ? "Enviaste esta calificación" : "Recibiste esta calificación"}
              </p>
              {c.comentario && (
                <p className="mt-2 text-gray-600 italic">&ldquo;{c.comentario}&rdquo;</p>
              )}
              {c.id_receptor === userId && (
                <ReportarButton
                  id_calificacion={c.id_calificacion}
                  estadoReporte={estadoReporteMap.get(c.id_calificacion) as "PENDIENTE" | "APROBADO" | "RECHAZADO" | undefined}
                />
              )}
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
