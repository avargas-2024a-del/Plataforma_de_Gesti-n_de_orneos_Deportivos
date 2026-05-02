"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { torneosService, UpdateTorneoDto } from "@/services";

export default function EditTorneoPage() {
  const params = useParams();
  const router = useRouter();
  const id = Number(params.id);
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<UpdateTorneoDto>({
    nombre: "",
    deporte: "",
    fechaInicio: "",
    fechaFin: "",
    formato: "liga",
    activo: true,
  });

  useEffect(() => {
    torneosService
      .findOne(id)
      .then((torneo) => setForm({
        ...torneo,
        deporte: torneo.deporte?.toLowerCase(),
        formato: torneo.formato?.toLowerCase() as "liga" | "eliminacion",
        fechaInicio: torneo.fechaInicio ? torneo.fechaInicio.toString().split('T')[0] : "",
        fechaFin: torneo.fechaFin ? torneo.fechaFin.toString().split('T')[0] : "",
      }))
      .catch(() => setError("Error al cargar el torneo"))
      .finally(() => setLoadingData(false));
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await torneosService.update(id, {
        ...form,
        deporte: form.deporte?.toLowerCase(),
        formato: form.formato?.toLowerCase() as "liga" | "eliminacion",
      });
      router.push(`/torneos/${id}`);
    } catch {
      setError("Error al actualizar el torneo");
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) return <p className="p-8 text-center">Cargando...</p>;

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Editar Torneo</h1>
        <Link href={`/torneos/${id}`} className="text-gray-500 hover:underline">← Volver</Link>
      </div>

      {error && <p className="mb-4 text-red-500">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium mb-1">Nombre</label>
          <input
            type="text"
            required
            value={form.nombre ?? ""}
            onChange={(e) => setForm({ ...form, nombre: e.target.value })}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Deporte</label>
          <select
            value={form.deporte ?? ""}
            onChange={(e) => setForm({ ...form, deporte: e.target.value })}
            className="w-full border rounded px-3 py-2"
            required
          >
            <option value="">Seleccionar...</option>
            <option value="futbol">Fútbol</option>
            <option value="baloncesto">Baloncesto</option>
            <option value="voleibol">Voleibol</option>
          </select>
        </div>

        <div>
          <label className="block font-medium mb-1">Formato</label>
          <select
            value={form.formato ?? "liga"}
            onChange={(e) => setForm({ ...form, formato: e.target.value as "liga" | "eliminacion" })}
            className="w-full border rounded px-3 py-2"
          >
            <option value="liga">Liga</option>
            <option value="eliminacion">Eliminación</option>
          </select>
        </div>

        <div>
          <label className="block font-medium mb-1">Fecha de Inicio</label>
          <input
            type="date"
            required
            value={form.fechaInicio ?? ""}
            onChange={(e) => setForm({ ...form, fechaInicio: e.target.value })}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Fecha de Fin</label>
          <input
            type="date"
            required
            value={form.fechaFin ?? ""}
            onChange={(e) => setForm({ ...form, fechaFin: e.target.value })}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="activo"
            checked={form.activo ?? true}
            onChange={(e) => setForm({ ...form, activo: e.target.checked })}
          />
          <label htmlFor="activo" className="font-medium">Activo</label>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Guardando..." : "Guardar Cambios"}
        </button>
      </form>
    </div>
  );
}