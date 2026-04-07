"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { jugadoresService, equiposService, UpdateJugadorDto, Equipo } from "@/services";

export default function EditJugadorPage() {
  const params = useParams();
  const router = useRouter();
  const id = Number(params.id);
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [equipos, setEquipos] = useState<Equipo[]>([]);
  const [form, setForm] = useState<UpdateJugadorDto>({
    nombres: "",
    apellidos: "",
    dorsal: 0,
    posicion: "",
    fechaNacimiento: "",
    equipoId: 0,
  });

  useEffect(() => {
    Promise.all([
      jugadoresService.findOne(id),
      equiposService.findAll(),
    ])
      .then(([jugador, equipos]) => {
        setForm(jugador);
        setEquipos(equipos);
      })
      .catch(() => setError("Error al cargar datos"))
      .finally(() => setLoadingData(false));
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await jugadoresService.update(id, form);
      router.push(`/jugadores/${id}`);
    } catch {
      setError("Error al actualizar el jugador");
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) return <p className="p-8 text-center">Cargando...</p>;

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Editar Jugador</h1>
        <Link href={`/jugadores/${id}`} className="text-gray-500 hover:underline">← Volver</Link>
      </div>

      {error && <p className="mb-4 text-red-500">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium mb-1">Nombres</label>
          <input
            type="text"
            required
            value={form.nombres ?? ""}
            onChange={(e) => setForm({ ...form, nombres: e.target.value })}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Apellidos</label>
          <input
            type="text"
            required
            value={form.apellidos ?? ""}
            onChange={(e) => setForm({ ...form, apellidos: e.target.value })}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Dorsal</label>
          <input
            type="number"
            required
            min={1}
            max={99}
            value={form.dorsal ?? 0}
            onChange={(e) => setForm({ ...form, dorsal: Number(e.target.value) })}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Posición</label>
          <select
            required
            value={form.posicion ?? ""}
            onChange={(e) => setForm({ ...form, posicion: e.target.value })}
            className="w-full border rounded px-3 py-2"
          >
            <option value="">Seleccionar...</option>
            <option value="portero">Portero</option>
            <option value="defensa">Defensa</option>
            <option value="mediocampista">Mediocampista</option>
            <option value="delantero">Delantero</option>
            <option value="base">Base</option>
            <option value="escolta">Escolta</option>
            <option value="alero">Alero</option>
            <option value="líbero">Líbero</option>
          </select>
        </div>

        <div>
          <label className="block font-medium mb-1">Fecha de Nacimiento</label>
          <input
            type="date"
            required
            value={form.fechaNacimiento ?? ""}
            onChange={(e) => setForm({ ...form, fechaNacimiento: e.target.value })}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Equipo</label>
          <select
            required
            value={form.equipoId ?? 0}
            onChange={(e) => setForm({ ...form, equipoId: Number(e.target.value) })}
            className="w-full border rounded px-3 py-2"
          >
            <option value={0}>Seleccionar equipo...</option>
            {equipos.map((e) => (
              <option key={e.id} value={e.id}>{e.nombre}</option>
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