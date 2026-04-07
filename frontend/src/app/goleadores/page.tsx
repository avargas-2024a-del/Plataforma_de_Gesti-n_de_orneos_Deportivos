"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { goleadoresService, Goleador } from "@/services";

export default function GoleadoresPage() {
  const [goleadores, setGoleadores] = useState<Goleador[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    goleadoresService
      .findAll()
      .then(setGoleadores)
      .catch(() => setError("Error al cargar goleadores"))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("¿Eliminar este goleador?")) return;
    try {
      await goleadoresService.remove(id);
      setGoleadores(goleadores.filter((g) => g.id !== id));
    } catch {
      alert("Error al eliminar el goleador");
    }
  };

  if (loading) return <p className="p-8 text-center">Cargando goleadores...</p>;
  if (error) return <p className="p-8 text-center text-red-500">{error}</p>;

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Goleadores</h1>
        <Link href="/goleadores/new" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          + Nuevo Goleador
        </Link>
      </div>

      {goleadores.length === 0 ? (
        <p className="text-center text-gray-500">No hay goleadores registrados.</p>
      ) : (
        <table className="w-full border-collapse border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-3 text-left">Jugador</th>
              <th className="border p-3 text-left">Resultado ID</th>
              <th className="border p-3 text-left">Cantidad de Goles</th>
              <th className="border p-3 text-left">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {goleadores.map((goleador) => (
              <tr key={goleador.id} className="hover:bg-gray-50">
                <td className="border p-3">
                  {goleador.jugador
                    ? `${goleador.jugador.nombres} ${goleador.jugador.apellidos}`
                    : `Jugador #${goleador.jugadorId}`}
                </td>
                <td className="border p-3">Resultado #{goleador.resultadoId}</td>
                <td className="border p-3 text-center font-bold">{goleador.cantidad}</td>
                <td className="border p-3 space-x-2">
                  <Link href={`/goleadores/${goleador.id}`} className="text-blue-600 hover:underline">Ver</Link>
                  <button onClick={() => handleDelete(goleador.id)} className="text-red-600 hover:underline">Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}