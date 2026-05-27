"use client";

import { resolverReporte } from "./actions";

export function ResolverButtons({ id_reporte }: { id_reporte: string }) {
  return (
    <div className="mt-3 flex gap-2">
      <button
        onClick={() => resolverReporte(id_reporte, "APROBADO")}
        className="px-3 py-1 bg-green-100 text-green-700 rounded text-sm hover:bg-green-200 transition-colors"
      >
        Aprobar
      </button>
      <button
        onClick={() => resolverReporte(id_reporte, "RECHAZADO")}
        className="px-3 py-1 bg-red-100 text-red-700 rounded text-sm hover:bg-red-200 transition-colors"
      >
        Rechazar
      </button>
    </div>
  );
}
