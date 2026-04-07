"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { torneosService, CreateTorneoDto } from "@/services";

export default function NewTorneoPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<CreateTorneoDto>({
    nombre: "",
    deporte: "",
    fechaInicio: "",
    fechaFin: "",
    formato: "liga",
    activo: true,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await torneosService.create(form);
      router.push("/torneos");
    } catch {
      setError("Error al crear el torneo");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Nuevo Torneo</h1>
        <Link href="/torneos" className="text-gray-500 hover:underline">← Volver</Link>
      </div>

      {error && <p className="mb-4 text-red-500">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium mb-1">Nombre</label>
          <input
            type="text"
            required
            value={form.nombre}
            onChange={(e) => setForm({ ...form, nombre: e.target.value })}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Deporte</label>
          <select
            value={form.deporte}
            onChange={(e) => setForm({ ...form, deporte: e.target.value })}
            className="w-full border rounded px-3 py-2"
            required
          >
            <option value="">Seleccionar...</option>
            <option value="fútbol">Fútbol</option>
            <option value="baloncesto">Baloncesto</option>
            <option value="voleibol">Voleibol</option>
          </select>
        </div>

        <div>
          <label className="block font-medium mb-1">Formato</label>
          <select
            value={form.formato}
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
            value={form.fechaInicio}
            onChange={(e) => setForm({ ...form, fechaInicio: e.target.value })}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Fecha de Fin</label>
          <input
            type="date"
            required
            value={form.fechaFin}
            onChange={(e) => setForm({ ...form, fechaFin: e.target.value })}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="activo"
            checked={form.activo}
            onChange={(e) => setForm({ ...form, activo: e.target.checked })}
          />
          <label htmlFor="activo" className="font-medium">Activo</label>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Creando..." : "Crear Torneo"}
        </button>
      </form>
    </div>
  );
}