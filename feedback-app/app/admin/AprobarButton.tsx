"use client";

import { aprobarComentario } from "./actions";
import { Check } from "lucide-react";

export function AprobarButton({ id_calificacion }: { id_calificacion: string }) {
  return (
    <button
      onClick={() => aprobarComentario(id_calificacion)}
      className="px-4 py-2 text-sm text-green-500 hover:text-green-400 border border-green-500/30 rounded-lg hover:bg-green-500/10 transition-colors flex items-center gap-2"
    >
      <Check className="w-4 h-4" />
      Aprobar
    </button>
  );
}
