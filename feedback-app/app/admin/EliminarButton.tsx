"use client";

import { eliminarComentario } from "./actions";

export function EliminarButton({ id_calificacion }: { id_calificacion: string }) {
  return (
    <button
      onClick={() => eliminarComentario(id_calificacion)} // Llama a la función de eliminación al hacer clic
      className="px-3 py-1 bg-red-100 text-red-700 rounded text-sm hover:bg-red-200 transition-colors"
    >
      Eliminar comentario
    </button>
  );
}
