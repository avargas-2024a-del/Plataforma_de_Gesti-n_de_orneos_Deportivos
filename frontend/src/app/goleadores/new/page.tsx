"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { goleadoresService, resultadosService, jugadoresService, CreateGoleadorDto, Resultado, Jugador } from "@/services";

export default function NewGoleadorPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resultados, setResultados] = useState<Resultado[]>([]);
  const [jugadores, setJugadores] = useState<Jugador[]>([]);
  const [form, setForm] = useState<CreateGoleadorDto>({
    resultadoId: 0,
    jugadorId: 0,
    cantidad: 1,
  });

  useEffect(() => {
    Promise.all([
      resultadosService.findAll(),
      jugadoresService.findAll(),
    ]).then(([resultados, jugadores]) => {
      setResultados(resultados);
      setJugadores(jugadores);
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await goleadoresService.create(form);
      router.push("/goleadores");
    } catch {
      setError("Error al registrar el goleador");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Nuevo Goleador</h1>
        <Link href="/goleadores" className="text-gray-500 hover:underline">← Volver</Link>
      </div>

      {error && <p className="mb-4 text-red-500">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium mb-1">Resultado</label>
          <select
            required
            value={form.resultadoId}
            onChange={(e) => setForm({ ...form, resultadoId: Number(e.target.value) })}
            className="w-full border rounded px-3 py-2"
          >
            <option value={0}>Seleccionar resultado...</option>
            {resultados.map((r) => (
              <option key={r.id} value={r.id}>
                Resultado #{r.id} — Partido #{r.partidoId} ({r.golesLocal}-{r.golesVisitante})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block font-medium mb-1">Jugador</label>
          <select
            required
            value={form.jugadorId}
            onChange={(e) => setForm({ ...form, jugadorId: Number(e.target.value) })}
            className="w-full border rounded px-3 py-2"
          >
            <option value={0}>Seleccionar jugador...</option>
            {jugadores.map((j) => (
              <option key={j.id} value={j.id}>
                #{j.dorsal} {j.nombres} {j.apellidos}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block font-medium mb-1">Cantidad de Goles</label>
          <input
            type="number"
            required
            min={1}
            value={form.cantidad}
            onChange={(e) => setForm({ ...form, cantidad: Number(e.target.value) })}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Registrando..." : "Registrar Goleador"}
        </button>
      </form>
    </div>
  );
}