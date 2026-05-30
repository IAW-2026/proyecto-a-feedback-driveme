"use client";

import { useState } from "react";
import { obtenerAnalisisIA } from "./actions";
import { HologramCard, GalacticButton } from "@/components/star-wars/ui-elements";
import { Sparkles, TrendingUp, AlertTriangle, CheckCircle, XCircle, ChevronDown, ChevronUp } from "lucide-react";

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
      <GalacticButton
        variant="green"
        size="sm"
        onClick={handleClick}
        disabled={cargando}
      >
        <span className="flex items-center gap-2">
          {cargando ? (
            <>
              <span className="inline-block w-3.5 h-3.5 border-2 border-white/20 border-t-white/70 rounded-full animate-spin" />
              Analizando...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              {visible ? "Ocultar resumen IA" : "Ver mi resumen IA"}
              {visible ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </>
          )}
        </span>
      </GalacticButton>

      {error && (
        <p className="mt-3 text-sm text-red-400">{error}</p>
      )}

      {visible && sinComentarios && (
        <HologramCard variant="green" className="mt-4 p-4">
          <p className="text-sm text-muted-foreground">
            No tenés comentarios suficientes para generar un análisis.
          </p>
        </HologramCard>
      )}

      {visible && analisis && (
        <HologramCard variant="green" className="p-6 mt-4 animate-in slide-in-from-top-4 duration-300">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-green-500" />
            <h2 className="text-lg font-semibold">Análisis de IA</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="w-4 h-4 text-green-400" />
                <h3 className="font-medium text-green-400">Tendencias Positivas</h3>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 shrink-0" />
                <p className="text-sm text-muted-foreground">{analisis.tendenciasPositivas}</p>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <h3 className="font-medium text-amber-400">Puntos a Mejorar</h3>
              </div>
              <div className="flex items-start gap-2">
                <XCircle className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
                <p className="text-sm text-muted-foreground">{analisis.puntosAMejorar}</p>
              </div>
            </div>

            <div className="md:col-span-2">
              <h3 className="font-medium text-green-500 mb-3">Recurrencia de Temas</h3>
              <div className="flex flex-wrap gap-2">
                {analisis.recurrenciaDeTemas.split(",").map((tema, i) => (
                  <span key={i} className="px-3 py-1 bg-green-500/10 rounded-full text-xs text-green-400 border border-green-500/30">
                    {tema.trim()}
                  </span>
                ))}
              </div>
            </div>

            <div className="md:col-span-2 pt-4 border-t border-border/50">
              <h3 className="font-medium mb-2">Resumen General</h3>
              <p className="text-sm text-muted-foreground">{analisis.resumenGeneral}</p>
            </div>
          </div>
        </HologramCard>
      )}
    </div>
  );
}
