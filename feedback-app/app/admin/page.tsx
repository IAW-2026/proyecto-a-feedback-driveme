import { currentUser, clerkClient } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { EliminarButton } from "./EliminarButton";
import { AprobarButton } from "./AprobarButton";
import { ResolverButtons } from "./ResolverButtons";
import { Navbar } from "@/components/star-wars/navbar";
import { HologramCard } from "@/components/star-wars/ui-elements";
import { StarRating } from "@/components/star-wars/ui-elements";
import { SpaceshipAvatar } from "@/components/star-wars/ui-elements";
import { AlertTriangle, Eye, Check, Users, Shield, Skull, ChevronLeft, ChevronRight } from "lucide-react";

const PAGE_SIZE = 5;

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ pReportes?: string; pInapropiados?: string }>;
}) {
  const user = await currentUser();

  if (!user || user.publicMetadata?.role !== "admin") {
    redirect("/");
  }

  const { pReportes = "1", pInapropiados = "1" } = await searchParams;

  const [totalReportes, totalInapropiados] = await Promise.all([
    prisma.reporte.count({ where: { estado: "PENDIENTE", isActive: true } }),
    prisma.calificacion.count({ where: { isInappropriate: true, isActive: true } }),
  ]);

  const totalPagesReportes = Math.max(1, Math.ceil(totalReportes / PAGE_SIZE));
  const totalPagesInapropiados = Math.max(1, Math.ceil(totalInapropiados / PAGE_SIZE));

  const pageReportes = Math.min(Math.max(1, parseInt(pReportes, 10)), totalPagesReportes);
  const pageInapropiados = Math.min(Math.max(1, parseInt(pInapropiados, 10)), totalPagesInapropiados);

  const [reportes, inapropiados] = await Promise.all([
    prisma.reporte.findMany({
      where: { estado: "PENDIENTE", isActive: true },
      orderBy: { fecha: "asc" },
      include: { calificacion: true },
      skip: (pageReportes - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.calificacion.findMany({
      where: { isInappropriate: true, isActive: true },
      orderBy: { fecha: "asc" },
      skip: (pageInapropiados - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
  ]);

  const allIds = [...new Set([
    ...reportes.flatMap((r) => [r.calificacion.id_emisor, r.calificacion.id_receptor, r.id_reportante]),
    ...inapropiados.flatMap((c) => [c.id_emisor, c.id_receptor]),
  ])];

  const nombres: Record<string, string> = {};
  if (allIds.length > 0) {
    try {
      const client = await clerkClient();
      const response = await client.users.getUserList({ userId: allIds, limit: 100 });
      for (const u of response.data) {
        nombres[u.id] =
          u.username ||
          `${u.firstName ?? ""} ${u.lastName ?? ""}`.trim() ||
          u.id;
      }
    } catch {
      // si Clerk falla, se usa el ID como fallback
    }
  }

  const nombre = (id: string) => nombres[id] ?? id;

  function paginationUrl(section: "reportes" | "inapropiados", page: number) {
    const pR = section === "reportes" ? page : pageReportes;
    const pI = section === "inapropiados" ? page : pageInapropiados;
    return `/admin?pReportes=${pR}&pInapropiados=${pI}`;
  }

  return (
    <main className="dark-side min-h-screen bg-background">
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
          <div className="mb-8 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Skull className="w-8 h-8 text-destructive" />
                <h1 className="text-3xl font-bold text-glow-red">
                  Panel de Moderación
                </h1>
              </div>
              <p className="text-muted-foreground">
                Centro de comando para la moderación de calificaciones
              </p>
            </div>

            <Link href="/admin/usuarios">
              <div className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border border-destructive/30 text-muted-foreground hover:text-foreground hover:bg-destructive/10 transition-colors">
                <Users className="w-4 h-4" />
                Ver Usuarios
              </div>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <HologramCard variant="dark" className="p-4 text-center">
              <AlertTriangle className="w-6 h-6 text-destructive mx-auto mb-2" />
              <div className="text-2xl font-bold text-destructive">{totalReportes}</div>
              <div className="text-xs text-muted-foreground">Reportes Pendientes</div>
            </HologramCard>
            <HologramCard variant="dark" className="p-4 text-center">
              <Eye className="w-6 h-6 text-destructive mx-auto mb-2" />
              <div className="text-2xl font-bold text-destructive">{totalInapropiados}</div>
              <div className="text-xs text-muted-foreground">Marcados por IA</div>
            </HologramCard>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Section 1: Pending Reports */}
            <section>
              <div className="flex items-center gap-2 mb-4">
                <AlertTriangle className="w-5 h-5 text-destructive" />
                <h2 className="text-xl font-semibold text-glow-red">Reportes Pendientes</h2>
              </div>

              <div className="space-y-4">
                {reportes.length === 0 ? (
                  <HologramCard variant="dark" className="p-8 text-center">
                    <Check className="w-12 h-12 text-green-500 mx-auto mb-3" />
                    <p className="text-muted-foreground">No hay reportes pendientes</p>
                  </HologramCard>
                ) : (
                  reportes.map((r) => (
                    <HologramCard key={r.id_reporte} variant="dark" className="p-4">
                      <div className="mb-4 pb-4 border-b border-destructive/20">
                        <div className="flex items-start gap-3 mb-3">
                          <SpaceshipAvatar name={nombre(r.calificacion.id_emisor)} variant="dark" size="sm" />
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium text-sm">{nombre(r.calificacion.id_emisor)}</span>
                              <span className="text-xs text-muted-foreground">→</span>
                              <span className="text-sm text-muted-foreground">{nombre(r.calificacion.id_receptor)}</span>
                            </div>
                            <StarRating rating={r.calificacion.puntaje} variant="dark" size="sm" />
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {new Date(r.calificacion.fecha).toLocaleDateString("es-AR")}
                          </span>
                        </div>
                        {r.calificacion.comentario ? (
                          <p className="text-sm text-foreground/80 bg-destructive/5 p-3 rounded-lg border border-destructive/20">
                            &ldquo;{r.calificacion.comentario}&rdquo;
                          </p>
                        ) : (
                          <p className="text-sm text-muted-foreground italic bg-destructive/5 p-3 rounded-lg border border-destructive/20">
                            (Sin comentario)
                          </p>
                        )}
                      </div>

                      <div className="mb-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Shield className="w-4 h-4 text-amber-500" />
                          <span className="text-sm font-medium text-amber-500">
                            Reporte de {nombre(r.id_reportante)}
                          </span>
                        </div>
                        <div className="text-xs text-muted-foreground mb-2">
                          Motivo: <span className="text-foreground">{r.motivo.replace(/_/g, " ")}</span>
                        </div>
                        {r.descripcion && (
                          <p className="text-sm text-muted-foreground italic">
                            &ldquo;{r.descripcion}&rdquo;
                          </p>
                        )}
                      </div>

                      <ResolverButtons id_reporte={r.id_reporte} />
                    </HologramCard>
                  ))
                )}
              </div>

              {totalPagesReportes > 1 && (
                <div className="mt-4 flex items-center justify-center gap-2">
                  <Link
                    href={paginationUrl("reportes", pageReportes - 1)}
                    aria-disabled={pageReportes === 1}
                    aria-label="Página anterior de reportes"
                    className={`p-2 rounded-lg border transition-colors ${pageReportes === 1 ? "border-destructive/10 text-muted-foreground/30 pointer-events-none" : "border-destructive/30 text-destructive hover:bg-destructive/10"}`}
                  >
                    <ChevronLeft className="w-4 h-4" aria-hidden="true" />
                  </Link>
                  <span className="text-sm text-muted-foreground px-2">
                    {pageReportes} / {totalPagesReportes}
                  </span>
                  <Link
                    href={paginationUrl("reportes", pageReportes + 1)}
                    aria-disabled={pageReportes === totalPagesReportes}
                    aria-label="Página siguiente de reportes"
                    className={`p-2 rounded-lg border transition-colors ${pageReportes === totalPagesReportes ? "border-destructive/10 text-muted-foreground/30 pointer-events-none" : "border-destructive/30 text-destructive hover:bg-destructive/10"}`}
                  >
                    <ChevronRight className="w-4 h-4" aria-hidden="true" />
                  </Link>
                </div>
              )}
            </section>

            {/* Section 2: AI Flagged Comments */}
            <section>
              <div className="flex items-center gap-2 mb-4">
                <Eye className="w-5 h-5 text-destructive" />
                <h2 className="text-xl font-semibold text-glow-red">Comentarios Marcados por IA</h2>
              </div>

              <div className="space-y-4">
                {inapropiados.length === 0 ? (
                  <HologramCard variant="dark" className="p-8 text-center">
                    <Check className="w-12 h-12 text-green-500 mx-auto mb-3" />
                    <p className="text-muted-foreground">No hay comentarios marcados</p>
                  </HologramCard>
                ) : (
                  inapropiados.map((c) => (
                    <HologramCard key={c.id_calificacion} variant="dark" className="p-4">
                      <div className="mb-4">
                        <div className="flex items-start gap-3 mb-3">
                          <SpaceshipAvatar name={nombre(c.id_emisor)} variant="dark" size="sm" />
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium text-sm">{nombre(c.id_emisor)}</span>
                              <span className="text-xs text-muted-foreground">→</span>
                              <span className="text-sm text-muted-foreground">{nombre(c.id_receptor)}</span>
                            </div>
                            <StarRating rating={c.puntaje} variant="dark" size="sm" />
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {new Date(c.fecha).toLocaleDateString("es-AR")}
                          </span>
                        </div>
                        {c.comentario && (
                          <p className="text-sm text-foreground/80 bg-destructive/5 p-3 rounded-lg border border-destructive/20">
                            &ldquo;{c.comentario}&rdquo;
                          </p>
                        )}
                      </div>

                      <div className="flex items-center gap-2 mb-4 px-3 py-2 bg-destructive/10 rounded-lg border border-destructive/30">
                        <Eye className="w-4 h-4 text-red-300" />
                        <span className="text-xs text-red-300">Marcado automáticamente por IA como inapropiado</span>
                      </div>

                      <div className="flex gap-2">
                        <AprobarButton id_calificacion={c.id_calificacion} />
                        <EliminarButton id_calificacion={c.id_calificacion} />
                      </div>
                    </HologramCard>
                  ))
                )}
              </div>

              {totalPagesInapropiados > 1 && (
                <div className="mt-4 flex items-center justify-center gap-2">
                  <Link
                    href={paginationUrl("inapropiados", pageInapropiados - 1)}
                    aria-disabled={pageInapropiados === 1}
                    aria-label="Página anterior de comentarios marcados"
                    className={`p-2 rounded-lg border transition-colors ${pageInapropiados === 1 ? "border-destructive/10 text-muted-foreground/30 pointer-events-none" : "border-destructive/30 text-destructive hover:bg-destructive/10"}`}
                  >
                    <ChevronLeft className="w-4 h-4" aria-hidden="true" />
                  </Link>
                  <span className="text-sm text-muted-foreground px-2">
                    {pageInapropiados} / {totalPagesInapropiados}
                  </span>
                  <Link
                    href={paginationUrl("inapropiados", pageInapropiados + 1)}
                    aria-disabled={pageInapropiados === totalPagesInapropiados}
                    aria-label="Página siguiente de comentarios marcados"
                    className={`p-2 rounded-lg border transition-colors ${pageInapropiados === totalPagesInapropiados ? "border-destructive/10 text-muted-foreground/30 pointer-events-none" : "border-destructive/30 text-destructive hover:bg-destructive/10"}`}
                  >
                    <ChevronRight className="w-4 h-4" aria-hidden="true" />
                  </Link>
                </div>
              )}
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
