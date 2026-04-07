"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { jugadoresService, Jugador } from "@/services";

export default function JugadorDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = Number(params.id);
  const [jugador, setJugador] = useState<Jugador | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    jugadoresService
      .findOne(id)
      .then(setJugador)
      .catch(() => setError("Error al cargar el jugador"))
      .finally(() => setLoading(false));
  }, [id]);

  const handleDelete = async () => {
    if (!confirm("¿Eliminar este jugador?")) return;
    try {
      await jugadoresService.remove(id);
      router.push("/jugadores");
    } catch {
      alert("Error al eliminar el jugador");
    }
  };

  if (loading) return <p className="p-8 text-center">Cargando...</p>;
  if (error) return <p className="p-8 text-center text-red-500">{error}</p>;
  if (!jugador) return <p className="p-8 text-center">Jugador no encontrado</p>;

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">{jugador.nombres} {jugador.apellidos}</h1>
        <Link href="/jugadores" className="text-gray-500 hover:underline">← Volver</Link>
      </div>

      <div className="bg-white border rounded-lg p-6 space-y-3 mb-6">
        <p><span className="font-medium">Dorsal:</span> #{jugador.dorsal}</p>
        <p><span className="font-medium">Posición:</span> {jugador.posicion}</p>
        <p><span className="font-medium">Fecha de Nacimiento:</span> {jugador.fechaNacimiento}</p>
        <p><span className="font-medium">Equipo:</span> {jugador.equipo?.nombre ?? jugador.equipoId}</p>
      </div>

      <div className="flex gap-3">
        <Link
          href={`/jugadores/${jugador.id}/edit`}
          className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
        >
          Editar
        </Link>
        <button
          onClick={handleDelete}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Eliminar
        </button>
      </div>
    </div>
  );
}