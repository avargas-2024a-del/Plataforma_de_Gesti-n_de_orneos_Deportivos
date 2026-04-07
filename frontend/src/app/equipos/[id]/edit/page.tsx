"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { equiposService, torneosService, UpdateEquipoDto, Torneo } from "@/services";

export default function EditEquipoPage() {
  const params = useParams();
  const router = useRouter();
  const id = Number(params.id);
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [torneos, setTorneos] = useState<Torneo[]>([]);
  const [form, setForm] = useState<UpdateEquipoDto>({
    nombre: "",
    escudo: "",
    directorTecnico: "",
    torneoId: 0,
  });

  useEffect(() => {
    Promise.all([
      equiposService.findOne(id),
      torneosService.findAll(),
    ])
      .then(([equipo, torneos]) => {
        setForm(equipo);
        setTorneos(torneos);
      })
      .catch(() => setError("Error al cargar datos"))
      .finally(() => setLoadingData(false));
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await equiposService.update(id, form);
      router.push(`/equipos/${id}`);
    } catch {
      setError("Error al actualizar el equipo");
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) return <p className="p-8 text-center">Cargando...</p>;

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Editar Equipo</h1>
        <Link href={`/equipos/${id}`} className="text-gray-500 hover:underline">← Volver</Link>
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
          <label className="block font-medium mb-1">Escudo (URL)</label>
          <input
            type="text"
            value={form.escudo ?? ""}
            onChange={(e) => setForm({ ...form, escudo: e.target.value })}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Director Técnico</label>
          <input
            type="text"
            required
            value={form.directorTecnico ?? ""}
            onChange={(e) => setForm({ ...form, directorTecnico: e.target.value })}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Torneo</label>
          <select
            required
            value={form.torneoId ?? 0}
            onChange={(e) => setForm({ ...form, torneoId: Number(e.target.value) })}
            className="w-full border rounded px-3 py-2"
          >
            <option value={0}>Seleccionar torneo...</option>
            {torneos.map((t) => (
              <option key={t.id} value={t.id}>{t.nombre}</option>
            ))}
          </select>
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