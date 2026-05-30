"use client";

import { resolverReporte } from "./actions";
import { GalacticButton } from "@/components/star-wars/ui-elements";
import { Trash2 } from "lucide-react";

export function ResolverButtons({ id_reporte }: { id_reporte: string }) {
  return (
    <div className="flex gap-2">
      <GalacticButton
        variant="dark"
        size="sm"
        onClick={() => resolverReporte(id_reporte, "APROBADO")}
      >
        <span className="flex items-center gap-2">
          <Trash2 className="w-4 h-4" />
          Eliminar Calificación
        </span>
      </GalacticButton>
      <button
        onClick={() => resolverReporte(id_reporte, "RECHAZADO")}
        className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground border border-border rounded-lg hover:bg-muted/20 transition-colors"
      >
        Mantener
      </button>
    </div>
  );
}
