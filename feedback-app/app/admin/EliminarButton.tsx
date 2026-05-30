"use client";

import { eliminarComentario } from "./actions";
import { GalacticButton } from "@/components/star-wars/ui-elements";
import { Trash2 } from "lucide-react";

export function EliminarButton({ id_calificacion }: { id_calificacion: string }) {
  return (
    <GalacticButton
      variant="dark"
      size="sm"
      onClick={() => eliminarComentario(id_calificacion)}
    >
      <span className="flex items-center gap-2">
        <Trash2 className="w-4 h-4" />
        Eliminar
      </span>
    </GalacticButton>
  );
}
