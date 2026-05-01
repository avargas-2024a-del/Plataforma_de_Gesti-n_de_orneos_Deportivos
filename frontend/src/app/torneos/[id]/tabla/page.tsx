"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { torneosService, Torneo } from "@/services";

interface FilaTabla {
  equipo: string;
  PJ: number;
  PG: number;
  PE: number;
  PP: number;
  GF: number;
  GC: number;
  DG: number;
  PTS: number;
}

export default function TablaPosicionesPage() {
  const params = useParams();
  const id = Number(params.id);
  const [tabla, setTabla] = useState<FilaTabla[]>([]);
  const [torneo, setTorneo] = useState<Torneo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      torneosService.findOne(id),
      torneosService.tablaPosiciones(id),
    ])
      .then(([torneo, tabla]) => {
        setTorneo(torneo);
        setTabla(tabla);
      })
      .catch(() => setError("Error al cargar la tabla de posiciones"))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p className="p-8 text-center">Cargando tabla...</p>;
  if (error) return <p className="p-8 text-center text-red-500">{error}</p>;

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">
          Tabla de Posiciones — {torneo?.nombre}
        </h1>
        <Link href="/torneos" className="text-gray-500 hover:underline">← Volver</Link>
      </div>

      {tabla.length === 0 ? (
        <p className="text-center text-gray-500">No hay partidos jugados aún.</p>
      ) : (
        <table className="w-full border-collapse border border-gray-300">
          <thead className="bg-blue-700 text-white">
            <tr>
              <th className="border p-3 text-left">#</th>
              <th className="border p-3 text-left">Equipo</th>
              <th className="border p-3 text-center">PJ</th>
              <th className="border p-3 text-center">PG</th>
              <th className="border p-3 text-center">PE</th>
              <th className="border p-3 text-center">PP</th>
              <th className="border p-3 text-center">GF</th>
              <th className="border p-3 text-center">GC</th>
              <th className="border p-3 text-center">DG</th>
              <th className="border p-3 text-center font-bold">PTS</th>
            </tr>
          </thead>
          <tbody>
            {tabla.map((fila, index) => (
              <tr key={fila.equipo} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                <td className="border p-3 text-center font-bold">{index + 1}</td>
                <td className="border p-3 font-medium">{fila.equipo}</td>
                <td className="border p-3 text-center">{fila.PJ}</td>
                <td className="border p-3 text-center">{fila.PG}</td>
                <td className="border p-3 text-center">{fila.PE}</td>
                <td className="border p-3 text-center">{fila.PP}</td>
                <td className="border p-3 text-center">{fila.GF}</td>
                <td className="border p-3 text-center">{fila.GC}</td>
                <td className="border p-3 text-center">{fila.DG}</td>
                <td className="border p-3 text-center font-bold text-blue-700">{fila.PTS}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}