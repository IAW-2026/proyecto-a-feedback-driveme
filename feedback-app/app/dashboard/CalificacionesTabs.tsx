"use client";

import { useState } from "react";
import { Starfield } from "@/components/star-wars/starfield";
import { Navbar } from "@/components/star-wars/navbar";
import { HologramCard, NavTabs, MessageBubble, StarRating } from "@/components/star-wars/ui-elements";
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

function formatFecha(fecha: Date): string {
  const ahora = new Date();
  const diff = ahora.getTime() - new Date(fecha).getTime();
  const horas = Math.floor(diff / (1000 * 60 * 60));
  if (horas < 1) return "Hace menos de 1h";
  if (horas < 24) return `Hace ${horas}h`;
  const dias = Math.floor(horas / 24);
  if (dias < 7) return `Hace ${dias}d`;
  return new Date(fecha).toLocaleDateString("es-AR");
}

function mapEstado(estado?: EstadoReporte): "pending" | "approved" | "rejected" | undefined {
  if (!estado) return undefined;
  if (estado === "PENDIENTE") return "pending";
  if (estado === "APROBADO") return "approved";
  return "rejected";
}

export function CalificacionesTabs({ calificaciones, userId, estadoReporteMap }: Props) {
  const [tab, setTab] = useState<Tab>("todas");

  const recibidas = calificaciones.filter((c) => c.id_receptor === userId);
  const enviadas = calificaciones.filter((c) => c.id_emisor === userId);

  const lista =
    tab === "todas" ? calificaciones : tab === "recibidas" ? recibidas : enviadas;

  const tabs = [
    { id: "todas", label: `Todas (${calificaciones.length})` },
    { id: "recibidas", label: `Recibidas (${recibidas.length})` },
    { id: "enviadas", label: `Enviadas (${enviadas.length})` },
  ];

  const promedioRecibidas = recibidas.length > 0
    ? Math.round((recibidas.reduce((sum, c) => sum + c.puntaje, 0) / recibidas.length) * 10) / 10
    : 0;

  return (
    <main className="relative min-h-screen overflow-hidden">
      <Starfield />
      <Navbar variant="light" />

      <div className="relative z-10 pt-24 pb-12 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2 text-glow-green text-green-400">
              Mis Calificaciones
            </h1>
            <p className="text-muted-foreground">
              Revisá todas las calificaciones de tus viajes
            </p>
          </div>

          {/* Controls */}
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center mb-4">
            <NavTabs
              tabs={tabs}
              activeTab={tab}
              onTabChange={(id) => setTab(id as Tab)}
              variant="green"
            />
            <HologramCard variant="green" className="p-4 text-center">
              <div className="text-sm text-muted-foreground mb-1">Promedio puntaje</div>
              <div className="flex items-center justify-center gap-1">
                <span className="text-2xl font-bold text-green-400">{promedioRecibidas}</span>
                <StarRating rating={Math.round(promedioRecibidas)} size="sm" variant="green" />
              </div>
            </HologramCard>
          </div>

          {/* AI Summary */}
          <ResumenIA />

          {/* Reviews List */}
          <div className="space-y-4 mt-6">
            {lista.length === 0 ? (
              <HologramCard variant="green" className="p-12 text-center">
                <p className="text-muted-foreground">
                  {tab === "recibidas"
                    ? "No recibiste calificaciones todavía."
                    : tab === "enviadas"
                    ? "No enviaste calificaciones todavía."
                    : "No tenés calificaciones todavía."}
                </p>
              </HologramCard>
            ) : (
              lista.map((c) => {
                const type = c.id_emisor === userId ? "sent" : "received";
                const estado = c.id_receptor === userId ? estadoReporteMap[c.id_calificacion] : undefined;
                const statusMapped = mapEstado(estado);

                return (
                  <HologramCard key={c.id_calificacion} variant="green" className="p-4">
                    <div className="flex flex-col gap-4">
                      <MessageBubble
                        name={type === "sent" ? "Yo" : c.id_emisor.slice(0, 12) + "..."}
                        message={c.comentario || "(Sin comentario)"}
                        timestamp={formatFecha(c.fecha)}
                        rating={c.puntaje}
                        type={type}
                        variant="green"
                        status={statusMapped}
                      />

                      {type === "received" && !estado && (
                        <div className="flex justify-end">
                          <ReportarButton
                            id_calificacion={c.id_calificacion}
                            estadoReporte={estadoReporteMap[c.id_calificacion]}
                          />
                        </div>
                      )}
                    </div>
                  </HologramCard>
                );
              })
            )}
          </div>

        </div>
      </div>
    </main>
  );
}
