"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { jugadoresService, Jugador } from "@/services";

export default function JugadoresPage() {
  const [jugadores, setJugadores] = useState<Jugador[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    jugadoresService
      .findAll()
      .then(setJugadores)
      .catch(() => setError("Error al cargar jugadores"))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("¿Eliminar este jugador?")) return;
    try {
      await jugadoresService.remove(id);
      setJugadores(jugadores.filter((j) => j.id !== id));
    } catch {
      alert("Error al eliminar el jugador");
    }
  };

  if (loading) return <p className="p-8 text-center">Cargando jugadores...</p>;
  if (error) return <p className="p-8 text-center text-red-500">{error}</p>;

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Jugadores</h1>
        <Link href="/jugadores/new" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          + Nuevo Jugador
        </Link>
      </div>

      {jugadores.length === 0 ? (
        <p className="text-center text-gray-500">No hay jugadores registrados.</p>
      ) : (
        <table className="w-full border-collapse border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-3 text-left">Nombre</th>
              <th className="border p-3 text-left">Dorsal</th>
              <th className="border p-3 text-left">Posición</th>
              <th className="border p-3 text-left">Equipo</th>
              <th className="border p-3 text-left">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {jugadores.map((jugador) => (
              <tr key={jugador.id} className="hover:bg-gray-50">
                <td className="border p-3">{jugador.nombres} {jugador.apellidos}</td>
                <td className="border p-3">{jugador.dorsal}</td>
                <td className="border p-3">{jugador.posicion}</td>
                <td className="border p-3">{jugador.equipo?.nombre ?? jugador.equipoId}</td>
                <td className="border p-3 space-x-2">
                  <Link href={`/jugadores/${jugador.id}`} className="text-blue-600 hover:underline">Ver</Link>
                  <Link href={`/jugadores/${jugador.id}/edit`} className="text-yellow-600 hover:underline">Editar</Link>
                  <button onClick={() => handleDelete(jugador.id)} className="text-red-600 hover:underline">Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}