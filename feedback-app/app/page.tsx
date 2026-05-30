import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { Starfield } from "@/components/star-wars/starfield"
import { Navbar } from "@/components/star-wars/navbar"
import { HologramCard, GalacticButton, MessageBubble } from "@/components/star-wars/ui-elements"
import { Rocket, Star, Shield, Users, MessageSquare, Zap, ChevronRight } from "lucide-react"
import Link from "next/link"

const sampleReviews = [
  {
    avatar: "",
    name: "Ana G.",
    message: "Conductor muy amable y puntual. El auto estaba impecable y llegamos antes de lo previsto.",
    timestamp: "Hace 2h",
    rating: 5,
  },
  {
    avatar: "",
    name: "Marcos P.",
    message: "Buen servicio, aunque el viaje fue un poco largo por el tráfico.",
    timestamp: "Hace 5h",
    rating: 4,
  },
  {
    avatar: "",
    name: "Sofía R.",
    message: "Rápido y seguro. Llegamos antes de lo esperado. Muy recomendado.",
    timestamp: "Hace 1d",
    rating: 5,
  },
]

export default async function LandingPage() {
  const { userId } = await auth()
  if (userId) redirect("/dashboard")

  return (
    <main className="relative min-h-screen overflow-hidden">
      <Starfield />
      <Navbar variant="light" />

      {/* Hero Section */}
      <section className="relative z-10 pt-32 pb-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 mb-8">
            <Zap className="w-4 h-4 text-primary" />
            <span className="text-sm text-primary font-medium">Sistema de Feedback DriveMe</span>
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 text-glow-yellow">
            <span className="text-foreground">Calificá tu</span>
            <br />
            <span className="text-primary">Viaje con DriveMe</span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
            Conectá con conductores y pasajeros. Compartí tu experiencia y
            ayudá a mejorar el transporte urbano.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/dashboard">
              <GalacticButton variant="light" size="lg">
                <span className="flex items-center gap-2">
                  Ver mis calificaciones
                  <ChevronRight className="w-5 h-5" />
                </span>
              </GalacticButton>
            </Link>
            <Link href="/sign-up">
              <GalacticButton variant="outline" size="lg">
                Crear Cuenta
              </GalacticButton>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 py-20 px-4">
        <div className="max-w-6xl mx-auto">

          <div className="grid md:grid-cols-3 gap-6">
            <HologramCard variant="light" className="p-6">
              <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center mb-4 jedi-glow">
                <Star className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Calificaciones en Tiempo Real</h3>
              <p className="text-muted-foreground text-sm">
                Recibí y enviá calificaciones instantáneamente después de cada viaje.
              </p>
            </HologramCard>

            <HologramCard variant="light" className="p-6">
              <div className="w-12 h-12 rounded-lg bg-accent/20 flex items-center justify-center mb-4 hologram-glow">
                <Shield className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Moderación con IA</h3>
              <p className="text-muted-foreground text-sm">
                Nuestra IA analiza comentarios automáticamente para mantener un ambiente seguro.
              </p>
            </HologramCard>

            <HologramCard variant="light" className="p-6">
              <div className="w-12 h-12 rounded-lg bg-chart-3/20 flex items-center justify-center mb-4">
                <MessageSquare className="w-6 h-6 text-chart-3" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Análisis de Tendencias</h3>
              <p className="text-muted-foreground text-sm">
                Obtené resúmenes inteligentes de tus comentarios para mejorar continuamente.
              </p>
            </HologramCard>
          </div>
        </div>
      </section>

      {/* Live Reviews Section */}
      <section className="relative z-10 py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center gap-3 mb-8">
            <Users className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-bold">Calificaciones Recientes</h2>
          </div>

          <HologramCard variant="light" className="p-6">
            <div className="space-y-6">
              {sampleReviews.map((review, index) => (
                <MessageBubble
                  key={index}
                  avatar={review.avatar}
                  name={review.name}
                  message={review.message}
                  timestamp={review.timestamp}
                  rating={review.rating}
                  type={index % 2 === 0 ? "received" : "sent"}
                  variant="light"
                />
              ))}
            </div>
          </HologramCard>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative z-10 py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { value: "50K+", label: "Conductores Activos", icon: Rocket },
              { value: "200K+", label: "Pasajeros", icon: Users },
              { value: "1M+", label: "Viajes Calificados", icon: Star },
              { value: "4.8", label: "Rating Promedio", icon: Zap },
            ].map((stat, index) => (
              <HologramCard key={index} variant="light" className="p-6 text-center">
                <stat.icon className="w-8 h-8 text-primary mx-auto mb-3" />
                <div className="text-3xl font-bold text-primary text-glow-yellow mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </HologramCard>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <HologramCard variant="light" className="p-8 md:p-12">
            <Rocket className="w-16 h-16 text-primary mx-auto mb-6 animate-float" />
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              ¿Listo para empezar?
            </h2>
            <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
              Unite a la comunidad de conductores y pasajeros que están transformando
              el transporte urbano, un viaje a la vez.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/dashboard">
                <GalacticButton variant="light" size="lg">
                  Acceder al Sistema
                </GalacticButton>
              </Link>
            </div>
          </HologramCard>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-8 px-4 border-t border-primary/20">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Rocket className="w-5 h-5 text-primary" />
            <span className="font-bold text-glow-yellow">DRIVEME</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © 2026 DriveMe Feedback. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </main>
  )
}
