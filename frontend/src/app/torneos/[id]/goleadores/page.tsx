"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { torneosService, goleadoresService, Torneo } from "@/services";

interface RankingGoleador {
  posicion: number;
  jugador: string;
  equipo: string;
  goles: number;
}

export default function RankingGoleadoresPage() {
  const params = useParams();
  const id = Number(params.id);
  const [ranking, setRanking] = useState<RankingGoleador[]>([]);
  const [torneo, setTorneo] = useState<Torneo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      torneosService.findOne(id),
      goleadoresService.rankingByTorneo(id),
    ])
      .then(([torneo, ranking]) => {
        setTorneo(torneo);
        setRanking(ranking);
      })
      .catch(() => setError("Error al cargar el ranking"))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p className="p-8 text-center">Cargando ranking...</p>;
  if (error) return <p className="p-8 text-center text-red-500">{error}</p>;

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">
          Ranking de Goleadores — {torneo?.nombre}
        </h1>
        <Link href="/torneos" className="text-gray-500 hover:underline">← Volver</Link>
      </div>

      {ranking.length === 0 ? (
        <p className="text-center text-gray-500">No hay goleadores registrados aún.</p>
      ) : (
        <table className="w-full border-collapse border border-gray-300">
          <thead className="bg-blue-700 text-white">
            <tr>
              <th className="border p-3 text-center">#</th>
              <th className="border p-3 text-left">Jugador</th>
              <th className="border p-3 text-left">Equipo</th>
              <th className="border p-3 text-center">⚽ Goles</th>
            </tr>
          </thead>
          <tbody>
            {ranking.map((fila) => (
              <tr key={fila.posicion} className={fila.posicion % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                <td className="border p-3 text-center font-bold">
                  {fila.posicion === 1 ? "🥇" : fila.posicion === 2 ? "🥈" : fila.posicion === 3 ? "🥉" : fila.posicion}
                </td>
                <td className="border p-3 font-medium">{fila.jugador}</td>
                <td className="border p-3">{fila.equipo}</td>
                <td className="border p-3 text-center font-bold text-blue-700">{fila.goles}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}