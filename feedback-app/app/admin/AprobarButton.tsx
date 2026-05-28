"use client";

import { aprobarComentario } from "./actions";

export function AprobarButton({ id_calificacion }: { id_calificacion: string }) {
  return (
    <button
      onClick={() => aprobarComentario(id_calificacion)}
      className="px-3 py-1 bg-green-100 text-green-700 rounded text-sm hover:bg-green-200 transition-colors"
    >
      El comentario es válido
    </button>
  );
}
