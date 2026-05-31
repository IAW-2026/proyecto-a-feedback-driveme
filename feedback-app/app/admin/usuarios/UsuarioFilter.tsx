"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { HologramCard } from "@/components/star-wars/ui-elements";
import { StarRating } from "@/components/star-wars/ui-elements";
import { SpaceshipAvatar } from "@/components/star-wars/ui-elements";
import { Navbar } from "@/components/star-wars/navbar";
import { Users, Search, ArrowLeft, MessageSquare, Star, AlertTriangle, ChevronLeft, ChevronRight } from "lucide-react";
import { BanearButton } from "./BanearButton";

type Calificacion = { puntaje: number; comentario: string | null; fecha: string };
type Usuario = {
  id: string;
  nombre: string;
  promedio: number;
  total: number;
  calificaciones: Calificacion[];
  banned: boolean;
  isAdmin: boolean;
};

interface Props {
  usuarios: Usuario[];
  total: number;
  totalPages: number;
  currentPage: number;
  query: string;
}

export function UsuarioFilter({ usuarios, total, totalPages, currentPage, query }: Props) {
  const [expandedUser, setExpandedUser] = useState<string | null>(null);
  const [modal, setModal] = useState<{ id: string; banned: boolean } | null>(null);
  const [loading, setLoading] = useState(false);
  const [inputValue, setInputValue] = useState(query);
  const router = useRouter();
  const searchParams = useSearchParams();

  function buildUrl(q: string, page: number) {
    const params = new URLSearchParams(searchParams.toString());
    if (q) params.set("q", q);
    else params.delete("q");
    params.set("page", String(page));
    return `/admin/usuarios?${params.toString()}`;
  }

  function handleSearch(e: { preventDefault(): void }) {
    e.preventDefault();
    router.push(buildUrl(inputValue, 1));
  }

  async function confirmarBan() {
    if (!modal) return;
    setLoading(true);
    try {
      await fetch(`/api/admin/usuarios/${modal.id}/${modal.banned ? "desbanear" : "banear"}`, { method: "POST" });
      router.refresh();
    } finally {
      setLoading(false);
      setModal(null);
    }
  }

  return (
    <main className="dark-side min-h-screen bg-background">
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
          <form onSubmit={handleSearch} className="mb-8">
            <div className="relative max-w-md flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Buscar por nombre o ID..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-input border border-destructive/30 rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-destructive/50 focus:border-destructive/50 transition-all"
                />
              </div>
              <button
                type="submit"
                className="px-4 py-3 rounded-lg bg-destructive/20 text-red-300 border border-destructive/30 hover:bg-destructive/30 transition-colors font-medium"
              >
                Buscar
              </button>
            </div>
          </form>

          {/* Users list */}
          <div className="space-y-4">
            {usuarios.length === 0 ? (
              <HologramCard variant="dark" className="p-12 text-center">
                <Users className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground">No se encontraron usuarios</p>
              </HologramCard>
            ) : (
              usuarios.map((u) => (
                <HologramCard key={u.id} variant="dark" className="overflow-hidden">
                  <div
                    className="p-4 cursor-pointer hover:bg-destructive/5 transition-colors"
                    onClick={() => setExpandedUser(expandedUser === u.id ? null : u.id)}
                  >
                    <div className="flex items-center gap-4">
                      <SpaceshipAvatar name={u.nombre} variant="dark" size="lg" />

                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <h2 className="font-semibold text-lg">{u.nombre}</h2>
                          {u.nombre !== u.id && (
                            <span className="text-xs text-muted-foreground bg-muted/20 px-2 py-0.5 rounded">
                              {u.id.slice(0, 12)}...
                            </span>
                          )}
                          {u.banned && (
                            <span className="text-xs font-medium text-red-400 bg-red-500/20 border border-red-500/30 px-2 py-0.5 rounded">
                              Baneado
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
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

                        {!u.isAdmin && (
                          <BanearButton
                            id={u.id}
                            banned={u.banned}
                            onBanClick={(id, banned) => setModal({ id, banned })}
                          />
                        )}
                      </div>
                    </div>
                  </div>

                  {expandedUser === u.id && (
                    <div className="border-t border-destructive/20 p-4 bg-destructive/5 animate-in slide-in-from-top-2 duration-200">
                      <h3 className="text-sm font-medium mb-3 text-muted-foreground">
                        Últimas calificaciones recibidas
                      </h3>
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

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-8 flex items-center justify-center gap-2">
              <Link
                href={buildUrl(query, currentPage - 1)}
                aria-disabled={currentPage === 1}
                className={`p-2 rounded-lg border transition-colors ${
                  currentPage === 1
                    ? "border-destructive/10 text-muted-foreground/30 pointer-events-none"
                    : "border-destructive/30 text-destructive hover:bg-destructive/10"
                }`}
              >
                <ChevronLeft className="w-5 h-5" />
              </Link>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <Link
                  key={p}
                  href={buildUrl(query, p)}
                  className={`w-9 h-9 flex items-center justify-center rounded-lg border text-sm font-medium transition-colors ${
                    p === currentPage
                      ? "bg-destructive/30 text-destructive border-destructive/50"
                      : "border-destructive/20 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                  }`}
                >
                  {p}
                </Link>
              ))}

              <Link
                href={buildUrl(query, currentPage + 1)}
                aria-disabled={currentPage === totalPages}
                className={`p-2 rounded-lg border transition-colors ${
                  currentPage === totalPages
                    ? "border-destructive/10 text-muted-foreground/30 pointer-events-none"
                    : "border-destructive/30 text-destructive hover:bg-destructive/10"
                }`}
              >
                <ChevronRight className="w-5 h-5" />
              </Link>
            </div>
          )}

          {/* Stats footer */}
          <div className="mt-6 flex items-center justify-center gap-2 text-muted-foreground">
            <Users className="w-4 h-4" />
            <span className="text-sm">
              Mostrando {usuarios.length} de {total} usuarios
              {totalPages > 1 && ` — página ${currentPage} de ${totalPages}`}
            </span>
          </div>
        </div>
      </div>

      {/* Confirmation modal */}
      {modal && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black/75"
          style={{ zIndex: 99999 }}
          onClick={() => setModal(null)}
        >
          <div
            className="w-full max-w-sm mx-4 rounded-xl border border-destructive/40 bg-[#1a0808] p-6 shadow-2xl shadow-destructive/20"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 mb-3">
              <AlertTriangle className="w-5 h-5 text-destructive shrink-0" />
              <h2 className="text-base font-semibold text-foreground">
                {modal.banned ? "¿Desbanear usuario?" : "¿Banear usuario?"}
              </h2>
            </div>
            <p className="text-sm text-muted-foreground mb-6">
              {modal.banned
                ? "El usuario podrá volver a iniciar sesión en la aplicación."
                : "El usuario no podrá iniciar sesión hasta que sea desbaneado."}
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setModal(null)}
                disabled={loading}
                className="px-4 py-2 text-sm rounded-lg border border-destructive/20 text-muted-foreground hover:text-foreground hover:bg-destructive/10 transition-colors disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                onClick={confirmarBan}
                disabled={loading}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors disabled:opacity-50 ${
                  modal.banned
                    ? "bg-green-500/20 text-green-400 border border-green-500/40 hover:bg-green-500/30"
                    : "bg-destructive/30 text-destructive border border-destructive/50 hover:bg-destructive/40"
                }`}
              >
                {loading ? "..." : modal.banned ? "Desbanear" : "Banear"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
