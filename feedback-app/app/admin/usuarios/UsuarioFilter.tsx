"use client";

import { useState } from "react";
import Link from "next/link";

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

  const filtrados = usuarios.filter(
    (u) =>
      u.nombre.toLowerCase().includes(query.toLowerCase()) ||
      u.id.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <main className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Usuarios</h1>
          <p className="text-gray-500 mt-1">
            Todos los usuarios con calificaciones recibidas
          </p>
        </div>
        <Link href="/admin" className="text-sm text-gray-500 hover:underline">
          ← Volver al panel
        </Link>
      </div>

      <input
        type="text"
        placeholder="Buscar por nombre o ID..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full border rounded px-4 py-2 mb-6 text-sm"
      />

      {filtrados.length === 0 ? (
        <p className="text-gray-400">No se encontraron usuarios.</p>
      ) : (
        <ul className="space-y-6">
          {filtrados.map((u) => (
            <li key={u.id} className="border rounded p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-semibold">{u.nombre}</p>
                  {u.nombre !== u.id && (
                    <p className="text-xs text-gray-400">{u.id}</p>
                  )}
                </div>
                <div className="text-right">
                  <p className="font-semibold">{u.promedio} / 5</p>
                  <p className="text-xs text-gray-400">{u.total} calificaciones</p>
                </div>
              </div>
              <ul className="mt-3 space-y-2">
                {u.calificaciones.map((c, i) => (
                  <li key={i} className="text-sm text-gray-600 border-t pt-2">
                    <span className="font-medium">Puntaje: {c.puntaje}</span>
                    {c.comentario && (
                      <span className="ml-2 italic">&ldquo;{c.comentario}&rdquo;</span>
                    )}
                    <span className="ml-2 text-gray-400 text-xs">
                      {new Date(c.fecha).toLocaleDateString("es-AR")}
                    </span>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
