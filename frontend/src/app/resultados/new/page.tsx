"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { resultadosService, CreateResultadoDto } from "@/services";

export default function NewResultadoPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<CreateResultadoDto>({
    partidoId: 0,
    golesLocal: 0,
    golesVisitante: 0,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await resultadosService.create(form);
      router.push("/resultados");
    } catch {
      setError("Error al crear el resultado");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Nuevo Resultado</h1>
        <Link href="/resultados" className="text-gray-500 hover:underline">← Volver</Link>
      </div>

      {error && <p className="mb-4 text-red-500">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium mb-1">ID del Partido</label>
          <input
            type="number"
            required
            min={1}
            value={form.partidoId || ""}
            onChange={(e) => setForm({ ...form, partidoId: Number(e.target.value) })}
            className="w-full border rounded px-3 py-2"
            placeholder="Ingresa el ID del partido"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Goles Local</label>
          <input
            type="number"
            required
            min={0}
            value={form.golesLocal}
            onChange={(e) => setForm({ ...form, golesLocal: Number(e.target.value) })}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Goles Visitante</label>
          <input
            type="number"
            required
            min={0}
            value={form.golesVisitante}
            onChange={(e) => setForm({ ...form, golesVisitante: Number(e.target.value) })}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Guardando..." : "Registrar Resultado"}
        </button>
      </form>
    </div>
  );
}