"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { partidosService, Partido } from "@/services";

export default function PartidosPage() {
  const [partidos, setPartidos] = useState<Partido[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    partidosService
      .findAll()
      .then(setPartidos)
      .catch(() => setError("Error al cargar partidos"))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("¿Eliminar este partido?")) return;
    try {
      await partidosService.remove(id);
      setPartidos(partidos.filter((p) => p.id !== id));
    } catch {
      alert("Error al eliminar el partido");
    }
  };

  const estadoColor = (estado: string) => {
    if (estado === "programado") return "bg-blue-100 text-blue-700";
    if (estado === "jugado") return "bg-green-100 text-green-700";
    return "bg-red-100 text-red-700";
  };

  if (loading) return <p className="p-8 text-center">Cargando partidos...</p>;
  if (error) return <p className="p-8 text-center text-red-500">{error}</p>;

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Partidos</h1>
        <Link href="/partidos/new" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          + Nuevo Partido
        </Link>
      </div>

      {partidos.length === 0 ? (
        <p className="text-center text-gray-500">No hay partidos registrados.</p>
      ) : (
        <table className="w-full border-collapse border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-3 text-left">Local</th>
              <th className="border p-3 text-left">Visitante</th>
              <th className="border p-3 text-left">Cancha</th>
              <th className="border p-3 text-left">Fecha</th>
              <th className="border p-3 text-left">Hora</th>
              <th className="border p-3 text-left">Estado</th>
              <th className="border p-3 text-left">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {partidos.map((partido) => (
              <tr key={partido.id} className="hover:bg-gray-50">
                <td className="border p-3">{partido.equipoLocal?.nombre ?? partido.equipoLocalId}</td>
                <td className="border p-3">{partido.equipoVisitante?.nombre ?? partido.equipoVisitanteId}</td>
                <td className="border p-3">{partido.cancha?.nombre ?? partido.canchaId}</td>
                <td className="border p-3">{partido.fecha}</td>
                <td className="border p-3">{partido.hora}</td>
                <td className="border p-3">
                  <span className={`px-2 py-1 rounded text-sm ${estadoColor(partido.estado)}`}>
                    {partido.estado}
                  </span>
                </td>
                <td className="border p-3 space-x-2">
                  <Link href={`/partidos/${partido.id}`} className="text-blue-600 hover:underline">Ver</Link>
                  <Link href={`/partidos/${partido.id}/edit`} className="text-yellow-600 hover:underline">Editar</Link>
                  <button onClick={() => handleDelete(partido.id)} className="text-red-600 hover:underline">Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}