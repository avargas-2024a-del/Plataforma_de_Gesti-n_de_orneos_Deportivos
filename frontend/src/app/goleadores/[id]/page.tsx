"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { goleadoresService, Goleador } from "@/services";

export default function GoleadorDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = Number(params.id);
  const [goleador, setGoleador] = useState<Goleador | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    goleadoresService
      .findOne(id)
      .then(setGoleador)
      .catch(() => setError("Error al cargar el goleador"))
      .finally(() => setLoading(false));
  }, [id]);

  const handleDelete = async () => {
    if (!confirm("¿Eliminar este goleador?")) return;
    try {
      await goleadoresService.remove(id);
      router.push("/goleadores");
    } catch {
      alert("Error al eliminar el goleador");
    }
  };

  if (loading) return <p className="p-8 text-center">Cargando...</p>;
  if (error) return <p className="p-8 text-center text-red-500">{error}</p>;
  if (!goleador) return <p className="p-8 text-center">Goleador no encontrado</p>;

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Detalle Goleador</h1>
        <Link href="/goleadores" className="text-gray-500 hover:underline">← Volver</Link>
      </div>

      <div className="bg-white border rounded-lg p-6 space-y-3 mb-6">
        <p>
          <span className="font-medium">Jugador:</span>{" "}
          {goleador.jugador
            ? `${goleador.jugador.nombres} ${goleador.jugador.apellidos}`
            : `Jugador #${goleador.jugadorId}`}
        </p>
        <p>
          <span className="font-medium">Resultado:</span>{" "}
          <Link href={`/resultados/${goleador.resultadoId}`} className="text-blue-600 hover:underline">
            Resultado #{goleador.resultadoId}
          </Link>
        </p>
        <p><span className="font-medium">Goles anotados:</span> {goleador.cantidad}</p>
      </div>

      <button
        onClick={handleDelete}
        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
      >
        Eliminar
      </button>
    </div>
  );
}