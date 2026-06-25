"use client";

import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-[#0a0a0a] via-[#1a0808] to-[#0a0505] text-foreground px-4">
      <div className="text-center max-w-md">
        <div className="flex justify-center mb-6">
          <div className="p-4 rounded-full bg-destructive/10 border border-destructive/20">
            <AlertTriangle className="w-12 h-12 text-destructive" />
          </div>
        </div>

        <h1 className="text-4xl font-bold text-destructive mb-2">Algo salió mal</h1>
        <p className="text-muted-foreground mb-8">
          Ocurrió un error inesperado. Podés intentar de nuevo o volver al inicio.
        </p>

        <div className="flex gap-3 justify-center">
          <button
            onClick={reset}
            className="px-6 py-3 rounded-lg bg-destructive/20 text-destructive border border-destructive/30 hover:bg-destructive/30 transition-colors font-medium"
          >
            Intentar de nuevo
          </button>
          <a
            href="/"
            className="px-6 py-3 rounded-lg bg-muted text-muted-foreground border border-border hover:bg-muted/80 transition-colors font-medium"
          >
            Ir al inicio
          </a>
        </div>
      </div>
    </div>
  );
}
