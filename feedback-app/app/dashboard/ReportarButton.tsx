"use client";

import { useState } from "react";
import { crearReporte } from "./actions";

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
    return <p className="mt-3 text-sm text-gray-400">Reporte en revisión</p>;
  }

  if (estadoReporte === "APROBADO") {
    return <p className="mt-3 text-sm text-green-600">Reporte aprobado</p>;
  }

  if (estadoReporte === "RECHAZADO") {
    return <p className="mt-3 text-sm text-red-400">Reporte rechazado</p>;
  }

  async function handleSubmit() { // Lógica para enviar el reporte
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

  if (!abierto) { // Botón para abrir el formulario de reporte
    return (
      <button
        onClick={() => setAbierto(true)}
        className="mt-3 text-sm text-gray-400 hover:text-red-500 transition-colors"
      >
        Reportar
      </button>
    );
  }

  return ( // Formulario para crear el reporte, con un select para elegir el motivo y un textarea para agregar una descripción opcional, además de botones para enviar o cancelar el reporte
    <div className="mt-3 border border-gray-200 rounded p-3 space-y-2">
      <div>
        <label className="block text-xs text-gray-500 mb-1">Motivo</label>
        <select
          value={motivo}
          onChange={(e) => setMotivo(e.target.value)}
          className="w-full text-sm border rounded px-2 py-1"
        >
          {MOTIVOS.map((m) => (
            <option key={m.value} value={m.value}>
              {m.label}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-xs text-gray-500 mb-1">Descripción (opcional)</label>
        <textarea
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          rows={2}
          className="w-full text-sm border rounded px-2 py-1 resize-none"
          placeholder="Contanos más sobre el problema..."
        />
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
      <div className="flex gap-2">
        <button
          onClick={handleSubmit}
          disabled={enviando}
          className="px-3 py-1 bg-red-100 text-red-700 rounded text-sm hover:bg-red-200 transition-colors disabled:opacity-50"
        >
          {enviando ? "Enviando..." : "Enviar reporte"}
        </button>
        <button
          onClick={() => setAbierto(false)}
          className="px-3 py-1 text-sm text-gray-500 hover:text-gray-700 transition-colors"
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}
