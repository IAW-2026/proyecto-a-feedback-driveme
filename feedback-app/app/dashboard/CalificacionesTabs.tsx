"use client";

import { useState } from "react";
import { ReportarButton } from "./ReportarButton";
import { ResumenIA } from "./ResumenIA";

type Calificacion = {
  id_calificacion: string;
  puntaje: number;
  comentario: string | null;
  fecha: Date;
  id_emisor: string;
  id_receptor: string;
};

type EstadoReporte = "PENDIENTE" | "APROBADO" | "RECHAZADO";
type Tab = "todas" | "recibidas" | "enviadas";

type Props = {
  calificaciones: Calificacion[];
  userId: string;
  estadoReporteMap: Record<string, EstadoReporte>;
};

export function CalificacionesTabs({ calificaciones, userId, estadoReporteMap }: Props) {
  const [tab, setTab] = useState<Tab>("todas");

  const recibidas = calificaciones.filter((c) => c.id_receptor === userId);
  const enviadas = calificaciones.filter((c) => c.id_emisor === userId);

  const lista =
    tab === "todas" ? calificaciones : tab === "recibidas" ? recibidas : enviadas;

  const tabs: { key: Tab; label: string; count: number }[] = [
    { key: "todas",     label: "Todas",     count: calificaciones.length },
    { key: "recibidas", label: "Recibidas", count: recibidas.length },
    { key: "enviadas",  label: "Enviadas",  count: enviadas.length },
  ];

  return (
    <div className="p-8">
      {/* Fila superior: título a la izq, segmented control a la der */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Mis calificaciones</h1>
        </div>

        {/* Segmented control */}
        <div className="flex items-center bg-[#1e1e20] rounded-full p-1 gap-0.5 w-full sm:w-auto">
          {tabs.map(({ key, label, count }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`
                flex-1 sm:flex-none
                flex items-center justify-center gap-1.5
                px-4 py-1.5 rounded-full
                text-sm font-medium
                transition-colors duration-150
                ${tab === key
                  ? "bg-white text-black"
                  : "bg-transparent text-gray-400 hover:text-white"}
              `}
            >
              {label}
              <span className={`text-xs ${tab === key ? "text-gray-500" : "text-gray-600"}`}>
                ({count})
              </span>
            </button>
          ))}
        </div>
      </div>

      <ResumenIA />

      {/* Lista de calificaciones */}
      {lista.length === 0 ? (
        <p className="mt-6 text-gray-400">
          {tab === "recibidas"
            ? "No recibiste calificaciones todavía."
            : tab === "enviadas"
            ? "No enviaste calificaciones todavía."
            : "No tenés calificaciones todavía."}
        </p>
      ) : (
        <ul className="mt-6 space-y-4">
          {lista.map((c) => (
            <li key={c.id_calificacion} className="border rounded p-4">
              <div className="flex justify-between">
                <span className="font-semibold">Puntaje: {c.puntaje} / 5</span>
                <span className="text-sm text-gray-400">
                  {new Date(c.fecha).toLocaleDateString("es-AR")}
                </span>
              </div>
              <p className="text-sm mt-1">
                {c.id_emisor === userId
                  ? "Enviaste esta calificación"
                  : "Recibiste esta calificación"}
              </p>
              {c.comentario && (
                <p className="mt-2 text-gray-600 italic">&ldquo;{c.comentario}&rdquo;</p>
              )}
              {c.id_receptor === userId && (
                <ReportarButton
                  id_calificacion={c.id_calificacion}
                  estadoReporte={estadoReporteMap[c.id_calificacion]}
                />
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
