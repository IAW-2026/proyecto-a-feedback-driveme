"use client";

import { useState } from "react";
import Link from "next/link";
import { HologramCard } from "@/components/star-wars/ui-elements";
import { StarRating } from "@/components/star-wars/ui-elements";
import { SpaceshipAvatar } from "@/components/star-wars/ui-elements";
import { Navbar } from "@/components/star-wars/navbar";
import { Users, Search, ArrowLeft, MessageSquare, Star } from "lucide-react";

type Calificacion = { puntaje: number; comentario: string | null; fecha: string };
type Usuario = {
  id: string;
  nombre: string;
  promedio: number;
  total: number;
  calificaciones: Calificacion[];
};

export function UsuarioFilter({ usuarios }: { usuarios: Usuario[] }) {
  const [query, setQuery] = useState("");
  const [expandedUser, setExpandedUser] = useState<string | null>(null);

  const filtrados = usuarios.filter(
    (u) =>
      u.nombre.toLowerCase().includes(query.toLowerCase()) ||
      u.id.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <main className="dark-side min-h-screen">
      {/* Dark side background */}
      <div className="fixed inset-0 bg-gradient-to-b from-[#0a0a0a] via-[#1a0808] to-[#0a0505]" />
      <div className="fixed inset-0 opacity-30 pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 50% 50%, transparent 0%, #0a0505 70%),
            radial-gradient(1px 1px at 10% 20%, rgba(255,100,100,0.3), transparent),
            radial-gradient(1px 1px at 30% 40%, rgba(255,150,150,0.2), transparent),
            radial-gradient(1px 1px at 50% 60%, rgba(255,100,100,0.3), transparent),
            radial-gradient(1px 1px at 70% 80%, rgba(255,150,150,0.2), transparent),
            radial-gradient(1px 1px at 90% 30%, rgba(255,100,100,0.3), transparent)`,
          backgroundSize: '100% 100%',
        }} />
      </div>

      <Navbar variant="dark" />

      <div className="relative z-10 pt-24 pb-12 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Link
              href="/admin"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Volver al Panel
            </Link>

            <div className="flex items-center gap-3 mb-2">
              <Users className="w-8 h-8 text-destructive" />
              <h1 className="text-3xl font-bold text-glow-red">
                Usuarios del Sistema
              </h1>
            </div>
            <p className="text-muted-foreground">
              Todos los usuarios con calificaciones recibidas
            </p>
          </div>

          {/* Search */}
          <div className="mb-8">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Buscar por nombre o ID..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-input border border-destructive/30 rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-destructive/50 focus:border-destructive/50 transition-all"
              />
            </div>
          </div>

          {/* Users list */}
          <div className="space-y-4">
            {filtrados.length === 0 ? (
              <HologramCard variant="dark" className="p-12 text-center">
                <Users className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground">No se encontraron usuarios</p>
              </HologramCard>
            ) : (
              filtrados.map((u) => (
                <HologramCard key={u.id} variant="dark" className="overflow-hidden">
                  {/* User header */}
                  <div
                    className="p-4 cursor-pointer hover:bg-destructive/5 transition-colors"
                    onClick={() => setExpandedUser(expandedUser === u.id ? null : u.id)}
                  >
                    <div className="flex items-center gap-4">
                      <SpaceshipAvatar name={u.nombre} variant="dark" size="lg" />

                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="font-semibold text-lg">{u.nombre}</h3>
                          {u.nombre !== u.id && (
                            <span className="text-xs text-muted-foreground bg-muted/20 px-2 py-0.5 rounded">
                              {u.id.slice(0, 12)}...
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-6">
                        <div className="text-center">
                          <div className="flex items-center gap-1 justify-center">
                            <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                            <span className="text-xl font-bold text-amber-500">{u.promedio}</span>
                          </div>
                          <span className="text-xs text-muted-foreground">Promedio</span>
                        </div>

                        <div className="text-center">
                          <div className="flex items-center gap-1 justify-center">
                            <MessageSquare className="w-4 h-4 text-destructive" />
                            <span className="text-xl font-bold text-destructive">{u.total}</span>
                          </div>
                          <span className="text-xs text-muted-foreground">Total</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Expanded comments */}
                  {expandedUser === u.id && (
                    <div className="border-t border-destructive/20 p-4 bg-destructive/5 animate-in slide-in-from-top-2 duration-200">
                      <h4 className="text-sm font-medium mb-3 text-muted-foreground">
                        Últimas calificaciones recibidas
                      </h4>
                      <div className="space-y-3">
                        {u.calificaciones.map((c, i) => (
                          <div
                            key={i}
                            className="flex items-start gap-3 p-3 bg-background/50 rounded-lg border border-destructive/10"
                          >
                            <div className="flex-1">
                              {c.comentario && (
                                <p className="text-sm text-foreground/80 mb-2">
                                  &ldquo;{c.comentario}&rdquo;
                                </p>
                              )}
                              <div className="flex items-center gap-3">
                                <StarRating rating={c.puntaje} variant="dark" size="sm" />
                                <span className="text-xs text-muted-foreground">
                                  {new Date(c.fecha).toLocaleDateString("es-AR")}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </HologramCard>
              ))
            )}
          </div>

          {/* Stats footer */}
          <div className="mt-8 flex items-center justify-center gap-2 text-muted-foreground">
            <Users className="w-4 h-4" />
            <span className="text-sm">
              Mostrando {filtrados.length} de {usuarios.length} usuarios
            </span>
          </div>
        </div>
      </div>
    </main>
  );
}
