"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { torneosService, Torneo } from "@/services";

export default function TorneoDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = Number(params.id);
  const [torneo, setTorneo] = useState<Torneo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    torneosService
      .findOne(id)
      .then(setTorneo)
      .catch(() => setError("Error al cargar el torneo"))
      .finally(() => setLoading(false));
  }, [id]);

  const handleDelete = async () => {
    if (!confirm("¿Eliminar este torneo?")) return;
    try {
      await torneosService.remove(id);
      router.push("/torneos");
    } catch {
      alert("Error al eliminar el torneo");
    }
  };

  if (loading) return <p className="p-8 text-center">Cargando...</p>;
  if (error) return <p className="p-8 text-center text-red-500">{error}</p>;
  if (!torneo) return <p className="p-8 text-center">Torneo no encontrado</p>;

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">{torneo.nombre}</h1>
        <Link href="/torneos" className="text-gray-500 hover:underline">← Volver</Link>
      </div>

      <div className="bg-white border rounded-lg p-6 space-y-3 mb-6">
        <p><span className="font-medium">Deporte:</span> {torneo.deporte}</p>
        <p><span className="font-medium">Formato:</span> {torneo.formato}</p>
        <p><span className="font-medium">Fecha Inicio:</span> {torneo.fechaInicio}</p>
        <p><span className="font-medium">Fecha Fin:</span> {torneo.fechaFin}</p>
        <p>
          <span className="font-medium">Estado:</span>{" "}
          <span className={`px-2 py-1 rounded text-sm ${torneo.activo ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
            {torneo.activo ? "Activo" : "Inactivo"}
          </span>
        </p>
      </div>

      <div className="flex gap-3">
        <Link
          href={`/torneos/${torneo.id}/edit`}
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