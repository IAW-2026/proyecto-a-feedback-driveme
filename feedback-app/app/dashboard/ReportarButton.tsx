"use client";

import { useState } from "react";
import { crearReporte } from "./actions";
import { GalacticButton } from "@/components/star-wars/ui-elements";
import { Flag } from "lucide-react";

const MOTIVOS = [
  { value: "COMENTARIO_INAPROPIADO", label: "Comentario inapropiado" },
  { value: "INFORMACION_FALSA", label: "Información falsa" },
  { value: "ACOSO", label: "Acoso" },
  { value: "OTRO", label: "Otro" },
];

export function ReportarButton({
  id_calificacion,
  estadoReporte,
}: {
  id_calificacion: string;
  estadoReporte?: "PENDIENTE" | "APROBADO" | "RECHAZADO";
}) {
  const [abierto, setAbierto] = useState(false);
  const [motivo, setMotivo] = useState(MOTIVOS[0].value);
  const [descripcion, setDescripcion] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (estadoReporte === "PENDIENTE") {
    return (
      <span className="px-3 py-1 rounded-full text-xs font-medium bg-amber-500/20 text-amber-400">
        Reporte en revisión
      </span>
    );
  }

  if (estadoReporte === "APROBADO") {
    return (
      <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-400">
        Reporte aprobado
      </span>
    );
  }

  if (estadoReporte === "RECHAZADO") {
    return (
      <span className="px-3 py-1 rounded-full text-xs font-medium bg-red-500/20 text-red-400">
        Reporte rechazado
      </span>
    );
  }

  async function handleSubmit() {
    setEnviando(true);
    setError(null);
    try {
      await crearReporte(id_calificacion, motivo, descripcion || undefined);
      setAbierto(false);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al enviar el reporte");
    } finally {
      setEnviando(false);
    }
  }

  if (!abierto) {
    return (
      <button
        onClick={() => setAbierto(true)}
        className="flex items-center gap-2 px-3 py-1.5 text-sm text-muted-foreground hover:text-destructive transition-colors"
      >
        <Flag className="w-4 h-4" />
        Reportar
      </button>
    );
  }

  return (
    <div className="flex flex-col gap-3 w-full max-w-md animate-in slide-in-from-right-4 duration-200">
      <select
        value={motivo}
        onChange={(e) => setMotivo(e.target.value)}
        className="bg-input border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/50 text-foreground"
      >
        {MOTIVOS.map((m) => (
          <option key={m.value} value={m.value}>
            {m.label}
          </option>
        ))}
      </select>
      <textarea
        value={descripcion}
        onChange={(e) => setDescripcion(e.target.value)}
        placeholder="Descripción opcional..."
        className="bg-input border border-border rounded-lg px-3 py-2 text-sm resize-none h-20 focus:outline-none focus:ring-2 focus:ring-green-500/50 text-foreground placeholder:text-muted-foreground"
      />
      {error && <p className="text-xs text-red-400">{error}</p>}
      <div className="flex gap-2 justify-end">
        <button
          onClick={() => setAbierto(false)}
          className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          Cancelar
        </button>
        <GalacticButton variant="green" size="sm" onClick={handleSubmit} disabled={enviando}>
          {enviando ? "Enviando..." : "Enviar Reporte"}
        </GalacticButton>
      </div>
    </div>
  );
}
