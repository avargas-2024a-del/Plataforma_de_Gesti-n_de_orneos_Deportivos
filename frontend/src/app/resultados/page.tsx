"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { resultadosService, Resultado } from "@/services";

export default function ResultadosPage() {
  const [resultados, setResultados] = useState<Resultado[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    resultadosService
      .findAll()
      .then(setResultados)
      .catch(() => setError("Error al cargar resultados"))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("¿Eliminar este resultado?")) return;
    try {
      await resultadosService.remove(id);
      setResultados(resultados.filter((r) => r.id !== id));
    } catch {
      alert("Error al eliminar el resultado");
    }
  };

  if (loading) return <p className="p-8 text-center">Cargando resultados...</p>;
  if (error) return <p className="p-8 text-center text-red-500">{error}</p>;

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Resultados</h1>
        <Link href="/resultados/new" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          + Nuevo Resultado
        </Link>
      </div>

      {resultados.length === 0 ? (
        <p className="text-center text-gray-500">No hay resultados registrados.</p>
      ) : (
        <table className="w-full border-collapse border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-3 text-left">Partido ID</th>
              <th className="border p-3 text-left">Goles Local</th>
              <th className="border p-3 text-left">Goles Visitante</th>
              <th className="border p-3 text-left">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {resultados.map((resultado) => (
              <tr key={resultado.id} className="hover:bg-gray-50">
                <td className="border p-3">
                  <Link href={`/partidos/${resultado.partidoId}`} className="text-blue-600 hover:underline">
                    Partido #{resultado.partidoId}
                  </Link>
                </td>
                <td className="border p-3 text-center font-bold">{resultado.golesLocal}</td>
                <td className="border p-3 text-center font-bold">{resultado.golesVisitante}</td>
                <td className="border p-3 space-x-2">
                  <Link href={`/resultados/${resultado.id}`} className="text-blue-600 hover:underline">Ver</Link>
                  <button onClick={() => handleDelete(resultado.id)} className="text-red-600 hover:underline">Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}