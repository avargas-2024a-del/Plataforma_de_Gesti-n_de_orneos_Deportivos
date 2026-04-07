"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { canchasService, UpdateCanchaDto } from "@/services";

export default function EditCanchaPage() {
  const params = useParams();
  const router = useRouter();
  const id = Number(params.id);
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<UpdateCanchaDto>({
    nombre: "",
    direccion: "",
    tipoSuperficie: "",
    capacidad: 0,
  });

  useEffect(() => {
    canchasService
      .findOne(id)
      .then((cancha) => setForm(cancha))
      .catch(() => setError("Error al cargar la cancha"))
      .finally(() => setLoadingData(false));
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await canchasService.update(id, form);
      router.push(`/canchas/${id}`);
    } catch {
      setError("Error al actualizar la cancha");
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) return <p className="p-8 text-center">Cargando...</p>;

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Editar Cancha</h1>
        <Link href={`/canchas/${id}`} className="text-gray-500 hover:underline">← Volver</Link>
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
          <label className="block font-medium mb-1">Dirección</label>
          <input
            type="text"
            required
            value={form.direccion ?? ""}
            onChange={(e) => setForm({ ...form, direccion: e.target.value })}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Tipo de Superficie</label>
          <select
            value={form.tipoSuperficie ?? ""}
            onChange={(e) => setForm({ ...form, tipoSuperficie: e.target.value })}
            className="w-full border rounded px-3 py-2"
            required
          >
            <option value="">Seleccionar...</option>
            <option value="césped natural">Césped natural</option>
            <option value="césped sintético">Césped sintético</option>
            <option value="parquet">Parquet</option>
            <option value="cemento">Cemento</option>
          </select>
        </div>

        <div>
          <label className="block font-medium mb-1">Capacidad</label>
          <input
            type="number"
            required
            min={0}
            value={form.capacidad ?? 0}
            onChange={(e) => setForm({ ...form, capacidad: Number(e.target.value) })}
            className="w-full border rounded px-3 py-2"
          />
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