"use client"

import { SignOutButton } from "@clerk/nextjs"
import { ShieldX } from "lucide-react"
import { HologramCard, GalacticButton } from "@/components/star-wars/ui-elements"

export default function NoAccesoPage() {
  return (
    <main className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-b from-[#0a0a0a] via-[#1a0808] to-[#0a0505]">
      <HologramCard variant="dark" className="p-10 max-w-md w-full text-center">
        <ShieldX className="w-16 h-16 text-destructive mx-auto mb-6" />
        <h1 className="text-2xl font-bold text-glow-red mb-3">Acceso denegado</h1>
        <p className="text-muted-foreground mb-8">
          No tiene acceso permitido. Loguearse con una cuenta con acceso correcto.
        </p>
        <SignOutButton redirectUrl="/">
          <GalacticButton variant="dark" className="w-full">
            Cerrar sesión
          </GalacticButton>
        </SignOutButton>
      </HologramCard>
    </main>
  )
}
