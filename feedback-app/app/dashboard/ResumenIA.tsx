"use client";

import { useState } from "react";
import { obtenerAnalisisIA } from "./actions";

type Analisis = {
  tendenciasPositivas: string;
  puntosAMejorar: string;
  recurrenciaDeTemas: string;
  resumenGeneral: string;
};

export function ResumenIA() {
  const [analisis, setAnalisis] = useState<Analisis | null>(null);
  const [visible, setVisible] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [sinComentarios, setSinComentarios] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleClick() {
    if (visible) {
      setVisible(false);
      return;
    }

    // Si ya tenemos el análisis en memoria, solo mostrarlo
    if (analisis || sinComentarios) {
      setVisible(true);
      return;
    }

    setCargando(true);
    setError(null);
    try {
      const resultado = await obtenerAnalisisIA();
      if (!resultado) {
        setSinComentarios(true);
      } else {
        setAnalisis(resultado);
      }
      setVisible(true);
    } catch {
      setError("No se pudo generar el análisis. Intentá de nuevo.");
    } finally {
      setCargando(false);
    }
  }

  return (
    <div className="mt-4">
      <button
        onClick={handleClick}
        disabled={cargando}
        className="flex items-center gap-2 text-sm text-gray-400 hover:text-white border border-white/10 hover:border-white/25 px-4 py-2 rounded-full transition-all disabled:opacity-50"
      >
        {cargando ? (
          <>
            <span className="inline-block w-3.5 h-3.5 border-2 border-white/20 border-t-white/70 rounded-full animate-spin" />
            Analizando...
          </>
        ) : visible ? (
          "Ocultar resumen"
        ) : (
          <>
            <span className="text-base leading-none">✦</span>
            Ver mi resumen de comentarios
          </>
        )}
      </button>

      {error && (
        <p className="mt-3 text-sm text-red-400">{error}</p>
      )}

      {visible && sinComentarios && (
        <p className="mt-3 text-sm text-gray-500">
          No tenés comentarios suficientes para generar un análisis.
        </p>
      )}

      {visible && analisis && (
        <div className="mt-4 border border-white/10 rounded-lg bg-white/[0.02] p-5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-500 mb-1.5">
                Tendencias Positivas
              </p>
              <p className="text-sm text-gray-300 leading-relaxed">
                {analisis.tendenciasPositivas}
              </p>
            </div>

            <div>
              <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-500 mb-1.5">
                Puntos a Mejorar
              </p>
              <p className="text-sm text-gray-300 leading-relaxed">
                {analisis.puntosAMejorar}
              </p>
            </div>

            <div>
              <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-500 mb-1.5">
                Recurrencia de Temas
              </p>
              <p className="text-sm text-gray-300 leading-relaxed">
                {analisis.recurrenciaDeTemas}
              </p>
            </div>
          </div>

          <div className="border-t border-white/8 pt-4">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-500 mb-1.5">
              Resumen General
            </p>
            <p className="text-sm text-gray-400 leading-relaxed">
              {analisis.resumenGeneral}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
