"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { partidosService, torneosService, equiposService, canchasService, UpdatePartidoDto, Torneo, Equipo, Cancha } from "@/services";

export default function EditPartidoPage() {
  const params = useParams();
  const router = useRouter();
  const id = Number(params.id);
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [torneos, setTorneos] = useState<Torneo[]>([]);
  const [equipos, setEquipos] = useState<Equipo[]>([]);
  const [canchas, setCanchas] = useState<Cancha[]>([]);
  const [form, setForm] = useState<UpdatePartidoDto>({
    torneoId: 0,
    equipoLocalId: 0,
    equipoVisitanteId: 0,
    canchaId: 0,
    fecha: "",
    hora: "",
  });

  useEffect(() => {
    Promise.all([
      partidosService.findOne(id),
      torneosService.findAll(),
      equiposService.findAll(),
      canchasService.findAll(),
    ])
      .then(([partido, torneos, equipos, canchas]) => {
        setForm(partido);
        setTorneos(torneos);
        setEquipos(equipos);
        setCanchas(canchas);
      })
      .catch(() => setError("Error al cargar datos"))
      .finally(() => setLoadingData(false));
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await partidosService.update(id, form);
      router.push(`/partidos/${id}`);
    } catch {
      setError("Error al actualizar el partido");
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) return <p className="p-8 text-center">Cargando...</p>;

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Editar Partido</h1>
        <Link href={`/partidos/${id}`} className="text-gray-500 hover:underline">← Volver</Link>
      </div>

      {error && <p className="mb-4 text-red-500">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
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

        <div>
          <label className="block font-medium mb-1">Equipo Local</label>
          <select
            required
            value={form.equipoLocalId ?? 0}
            onChange={(e) => setForm({ ...form, equipoLocalId: Number(e.target.value) })}
            className="w-full border rounded px-3 py-2"
          >
            <option value={0}>Seleccionar equipo...</option>
            {equipos.map((e) => (
              <option key={e.id} value={e.id}>{e.nombre}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block font-medium mb-1">Equipo Visitante</label>
          <select
            required
            value={form.equipoVisitanteId ?? 0}
            onChange={(e) => setForm({ ...form, equipoVisitanteId: Number(e.target.value) })}
            className="w-full border rounded px-3 py-2"
          >
            <option value={0}>Seleccionar equipo...</option>
            {equipos.map((e) => (
              <option key={e.id} value={e.id}>{e.nombre}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block font-medium mb-1">Cancha</label>
          <select
            required
            value={form.canchaId ?? 0}
            onChange={(e) => setForm({ ...form, canchaId: Number(e.target.value) })}
            className="w-full border rounded px-3 py-2"
          >
            <option value={0}>Seleccionar cancha...</option>
            {canchas.map((c) => (
              <option key={c.id} value={c.id}>{c.nombre}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block font-medium mb-1">Fecha</label>
          <input
            type="date"
            required
            value={form.fecha ?? ""}
            onChange={(e) => setForm({ ...form, fecha: e.target.value })}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Hora</label>
          <input
            type="time"
            required
            value={form.hora ?? ""}
            onChange={(e) => setForm({ ...form, hora: e.target.value })}
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