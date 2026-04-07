"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { resultadosService, Resultado } from "@/services";

export default function ResultadoDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = Number(params.id);
  const [resultado, setResultado] = useState<Resultado | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [golesLocal, setGolesLocal] = useState(0);
  const [golesVisitante, setGolesVisitante] = useState(0);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    resultadosService
      .findOne(id)
      .then((r) => {
        setResultado(r);
        setGolesLocal(r.golesLocal);
        setGolesVisitante(r.golesVisitante);
      })
      .catch(() => setError("Error al cargar el resultado"))
      .finally(() => setLoading(false));
  }, [id]);

  const handleDelete = async () => {
    if (!confirm("¿Eliminar este resultado?")) return;
    try {
      await resultadosService.remove(id);
      router.push("/resultados");
    } catch {
      alert("Error al eliminar el resultado");
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const updated = await resultadosService.update(id, { golesLocal, golesVisitante });
      setResultado(updated);
      setEditing(false);
    } catch {
      alert("Error al actualizar el resultado");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="p-8 text-center">Cargando...</p>;
  if (error) return <p className="p-8 text-center text-red-500">{error}</p>;
  if (!resultado) return <p className="p-8 text-center">Resultado no encontrado</p>;

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Resultado</h1>
        <Link href="/resultados" className="text-gray-500 hover:underline">← Volver</Link>
      </div>

      <div className="bg-white border rounded-lg p-6 mb-6">
        <p className="mb-3">
          <span className="font-medium">Partido:</span>{" "}
          <Link href={`/partidos/${resultado.partidoId}`} className="text-blue-600 hover:underline">
            Partido #{resultado.partidoId}
          </Link>
        </p>
        <div className="flex justify-center items-center gap-8 py-4">
          <div className="text-center">
            <p className="text-gray-500 text-sm">Local</p>
            <p className="text-5xl font-bold">{resultado.golesLocal}</p>
          </div>
          <p className="text-3xl font-bold text-gray-400">-</p>
          <div className="text-center">
            <p className="text-gray-500 text-sm">Visitante</p>
            <p className="text-5xl font-bold">{resultado.golesVisitante}</p>
          </div>
        </div>
      </div>

      {editing && (
        <form onSubmit={handleUpdate} className="bg-gray-50 border rounded-lg p-6 mb-6 space-y-4">
          <h2 className="text-xl font-bold">Editar Resultado</h2>
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block font-medium mb-1">Goles Local</label>
              <input
                type="number"
                min={0}
                value={golesLocal}
                onChange={(e) => setGolesLocal(Number(e.target.value))}
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div className="flex-1">
              <label className="block font-medium mb-1">Goles Visitante</label>
              <input
                type="number"
                min={0}
                value={golesVisitante}
                onChange={(e) => setGolesVisitante(Number(e.target.value))}
                className="w-full border rounded px-3 py-2"
              />
            </div>
          </div>
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={saving}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
            >
              {saving ? "Guardando..." : "Guardar"}
            </button>
            <button
              type="button"
              onClick={() => setEditing(false)}
              className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
            >
              Cancelar
            </button>
          </div>
        </form>
      )}

      <div className="flex gap-3">
        <button
          onClick={() => setEditing(true)}
          className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
        >
          Editar
        </button>
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