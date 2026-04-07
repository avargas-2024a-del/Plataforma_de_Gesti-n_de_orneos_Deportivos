"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { canchasService, Cancha } from "@/services";

export default function CanchaDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = Number(params.id);
  const [cancha, setCancha] = useState<Cancha | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    canchasService
      .findOne(id)
      .then(setCancha)
      .catch(() => setError("Error al cargar la cancha"))
      .finally(() => setLoading(false));
  }, [id]);

  const handleDelete = async () => {
    if (!confirm("¿Eliminar esta cancha?")) return;
    try {
      await canchasService.remove(id);
      router.push("/canchas");
    } catch {
      alert("Error al eliminar la cancha");
    }
  };

  if (loading) return <p className="p-8 text-center">Cargando...</p>;
  if (error) return <p className="p-8 text-center text-red-500">{error}</p>;
  if (!cancha) return <p className="p-8 text-center">Cancha no encontrada</p>;

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">{cancha.nombre}</h1>
        <Link href="/canchas" className="text-gray-500 hover:underline">← Volver</Link>
      </div>

      <div className="bg-white border rounded-lg p-6 space-y-3 mb-6">
        <p><span className="font-medium">Dirección:</span> {cancha.direccion}</p>
        <p><span className="font-medium">Tipo de Superficie:</span> {cancha.tipoSuperficie}</p>
        <p><span className="font-medium">Capacidad:</span> {cancha.capacidad}</p>
      </div>

      <div className="flex gap-3">
        <Link
          href={`/canchas/${cancha.id}/edit`}
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