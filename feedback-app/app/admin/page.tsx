import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { EliminarButton } from "./EliminarButton";
import { AprobarButton } from "./AprobarButton";

export default async function AdminPage() {
  const user = await currentUser();

  if (!user || user.publicMetadata?.role !== "admin") {
    redirect("/");
  }

  const reportes = await prisma.reporte.findMany({
    where: { estado: "PENDIENTE", isActive: true },
    orderBy: { fecha: "asc" },
  });

  const inapropiados = await prisma.calificacion.findMany({
    where: { isInappropriate: true, isActive: true },
    orderBy: { fecha: "asc" },
  });

  return (
    <main className="p-8 space-y-12">
      <section>
        <h1 className="text-2xl font-bold">Panel de Moderación</h1>
        <p className="text-gray-500 mt-2">Reportes pendientes de revisión</p>

        {reportes.length === 0 ? (
          <p className="mt-6 text-gray-400">No hay reportes pendientes.</p>
        ) : (
          <ul className="mt-6 space-y-4">
            {reportes.map((r) => (
              <li key={r.id_reporte} className="border rounded p-4">
                <div className="flex justify-between">
                  <span className="font-semibold">{r.motivo}</span>
                  <span className="text-sm text-gray-400">
                    {new Date(r.fecha).toLocaleDateString("es-AR")}
                  </span>
                </div>
                {r.descripcion && (
                  <p className="mt-1 text-gray-600 italic">&ldquo;{r.descripcion}&rdquo;</p>
                )}
                <p className="text-sm text-gray-500 mt-1">
                  Reportante: {r.id_reportante} · Reportado: {r.id_reportado}
                </p>
                {/* TODO: conectar al PATCH /api/reportes/[id]/resolver cuando el endpoint esté definido */}
                <div className="mt-3 flex gap-2">
                  <button disabled className="px-3 py-1 bg-green-100 text-green-700 rounded text-sm opacity-50 cursor-not-allowed">
                    Aprobar
                  </button>
                  <button disabled className="px-3 py-1 bg-red-100 text-red-700 rounded text-sm opacity-50 cursor-not-allowed">
                    Rechazar
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2 className="text-xl font-bold">Comentarios inapropiados</h2>
        <p className="text-gray-500 mt-2">Detectados automáticamente por IA — pendientes de revisión</p>

        {inapropiados.length === 0 ? (
          <p className="mt-6 text-gray-400">No hay comentarios inapropiados.</p>
        ) : (
          <ul className="mt-6 space-y-4">
            {inapropiados.map((c) => (
              <li key={c.id_calificacion} className="border border-red-200 rounded p-4">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">
                    Emisor: {c.id_emisor} · Receptor: {c.id_receptor}
                  </span>
                  <span className="text-sm text-gray-400">
                    {new Date(c.fecha).toLocaleDateString("es-AR")}
                  </span>
                </div>
                <p className="mt-2 text-gray-800 italic">&ldquo;{c.comentario}&rdquo;</p>
                <div className="mt-3 flex gap-2">
                  <AprobarButton id_calificacion={c.id_calificacion} />
                  <EliminarButton id_calificacion={c.id_calificacion} />
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
