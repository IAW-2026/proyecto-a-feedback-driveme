"use client";

import { resolverReporte } from "./actions";

export function ResolverButtons({ id_reporte }: { id_reporte: string }) {
  return (
    <div className="mt-3 flex gap-2">
      <button
        onClick={() => resolverReporte(id_reporte, "APROBADO")}
        className="px-3 py-1 bg-red-100 text-red-700 rounded text-sm hover:bg-red-200 transition-colors"
      >
        Eliminar calificación
      </button>
      <button
        onClick={() => resolverReporte(id_reporte, "RECHAZADO")}
        className="px-3 py-1 bg-gray-100 text-gray-600 rounded text-sm hover:bg-gray-200 transition-colors"
      >
        Mantener calificación
      </button>
    </div>
  );
}
