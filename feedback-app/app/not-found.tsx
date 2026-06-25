import Link from "next/link";
import { Rocket, AlertTriangle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-[#0a0a0a] via-[#080a1a] to-[#050a0a] text-foreground px-4">
      <div className="text-center max-w-md">
        <div className="flex justify-center mb-6">
          <div className="p-4 rounded-full bg-primary/10 border border-primary/20">
            <Rocket className="w-12 h-12 text-primary" />
          </div>
        </div>

        <h1 className="text-8xl font-bold text-primary mb-2 tracking-wider">404</h1>
        <p className="text-xl font-semibold mb-2">Página no encontrada</p>
        <p className="text-muted-foreground mb-8">
          Esta ruta no existe en la galaxia. Puede que el hiperespacío te haya llevado al lugar equivocado.
        </p>

        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary/20 text-primary border border-primary/30 hover:bg-primary/30 transition-colors font-medium"
        >
          Volver al inicio
        </Link>
      </div>
    </div>
  );
}
