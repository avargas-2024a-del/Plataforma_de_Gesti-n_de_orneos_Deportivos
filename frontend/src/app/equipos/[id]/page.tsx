"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { equiposService, Equipo } from "@/services";

export default function EquipoDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = Number(params.id);
  const [equipo, setEquipo] = useState<Equipo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    equiposService
      .findOne(id)
      .then(setEquipo)
      .catch(() => setError("Error al cargar el equipo"))
      .finally(() => setLoading(false));
  }, [id]);

  const handleDelete = async () => {
    if (!confirm("¿Eliminar este equipo?")) return;
    try {
      await equiposService.remove(id);
      router.push("/equipos");
    } catch {
      alert("Error al eliminar el equipo");
    }
  };

  if (loading) return <p className="p-8 text-center">Cargando...</p>;
  if (error) return <p className="p-8 text-center text-red-500">{error}</p>;
  if (!equipo) return <p className="p-8 text-center">Equipo no encontrado</p>;

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">{equipo.nombre}</h1>
        <Link href="/equipos" className="text-gray-500 hover:underline">← Volver</Link>
      </div>

      <div className="bg-white border rounded-lg p-6 space-y-3 mb-6">
        {equipo.escudo && (
          <img src={equipo.escudo} alt="Escudo" className="w-24 h-24 object-contain mb-2" />
        )}
        <p><span className="font-medium">Director Técnico:</span> {equipo.directorTecnico}</p>
        <p><span className="font-medium">Torneo:</span> {equipo.torneo?.nombre ?? equipo.torneoId}</p>
      </div>

      <div className="flex gap-3">
        <Link
          href={`/equipos/${equipo.id}/edit`}
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