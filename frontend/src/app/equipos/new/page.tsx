"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { equiposService, torneosService, CreateEquipoDto, Torneo } from "@/services";

export default function NewEquipoPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [torneos, setTorneos] = useState<Torneo[]>([]);
  const [form, setForm] = useState<CreateEquipoDto>({
    nombre: "",
    escudo: "",
    directorTecnico: "",
    torneoId: 0,
  });

  useEffect(() => {
    torneosService.findAll().then(setTorneos);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await equiposService.create(form);
      router.push("/equipos");
    } catch {
      setError("Error al crear el equipo");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Nuevo Equipo</h1>
        <Link href="/equipos" className="text-gray-500 hover:underline">← Volver</Link>
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
          <label className="block font-medium mb-1">Escudo (URL)</label>
          <input
            type="text"
            value={form.escudo}
            onChange={(e) => setForm({ ...form, escudo: e.target.value })}
            className="w-full border rounded px-3 py-2"
            placeholder="https://ejemplo.com/escudo.png"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Director Técnico</label>
          <input
            type="text"
            required
            value={form.directorTecnico}
            onChange={(e) => setForm({ ...form, directorTecnico: e.target.value })}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Torneo</label>
          <select
            required
            value={form.torneoId}
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
          {loading ? "Creando..." : "Crear Equipo"}
        </button>
      </form>
    </div>
  );
}