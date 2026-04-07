"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { equiposService, torneosService, jugadoresService, UpdateEquipoDto, Torneo, Jugador } from "@/services";

export default function EditEquipoPage() {
  const params = useParams();
  const router = useRouter();
  const id = Number(params.id);
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [torneos, setTorneos] = useState<Torneo[]>([]);
  const [jugadores, setJugadores] = useState<Jugador[]>([]);
  const [form, setForm] = useState<UpdateEquipoDto>({
    nombre: "",
    escudo: "",
    directorTecnico: "",
    torneoId: 0,
  });
  const [nuevoJugador, setNuevoJugador] = useState({
    nombres: "",
    apellidos: "",
    dorsal: 0,
    posicion: "",
    fechaNacimiento: "",
  });
  const [addingJugador, setAddingJugador] = useState(false);

  useEffect(() => {
    Promise.all([
      equiposService.findOne(id),
      torneosService.findAll(),
      jugadoresService.findAll(),
    ])
      .then(([equipo, torneos, todosJugadores]) => {
        setForm(equipo);
        setTorneos(torneos);
        setJugadores(todosJugadores.filter((j) => j.equipoId === id));
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

  const handleAddJugador = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddingJugador(true);
    try {
      const nuevo = await jugadoresService.create({ ...nuevoJugador, equipoId: id });
      setJugadores([...jugadores, nuevo]);
      setNuevoJugador({ nombres: "", apellidos: "", dorsal: 0, posicion: "", fechaNacimiento: "" });
    } catch {
      alert("Error al agregar jugador");
    } finally {
      setAddingJugador(false);
    }
  };

  const handleRemoveJugador = async (jugadorId: number) => {
    if (!confirm("¿Eliminar este jugador de la plantilla?")) return;
    try {
      await jugadoresService.remove(jugadorId);
      setJugadores(jugadores.filter((j) => j.id !== jugadorId));
    } catch {
      alert("Error al eliminar jugador");
    }
  };

  if (loadingData) return <p className="p-8 text-center">Cargando...</p>;

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Editar Equipo</h1>
        <Link href={`/equipos/${id}`} className="text-gray-500 hover:underline">← Volver</Link>
      </div>

      {error && <p className="mb-4 text-red-500">{error}</p>}

      {/* Formulario datos del equipo */}
      <form onSubmit={handleSubmit} className="space-y-4 mb-8">
        <h2 className="text-xl font-bold">Datos del Equipo</h2>
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

      {/* Plantilla de jugadores */}
      <div className="border-t pt-6">
        <h2 className="text-xl font-bold mb-4">Plantilla de Jugadores</h2>
        {jugadores.length === 0 ? (
          <p className="text-gray-500 mb-4">No hay jugadores en este equipo.</p>
        ) : (
          <table className="w-full border-collapse border border-gray-300 mb-6">
            <thead className="bg-gray-100">
              <tr>
                <th className="border p-2 text-left">Dorsal</th>
                <th className="border p-2 text-left">Nombre</th>
                <th className="border p-2 text-left">Posición</th>
                <th className="border p-2 text-left">Acción</th>
              </tr>
            </thead>
            <tbody>
              {jugadores.map((j) => (
                <tr key={j.id} className="hover:bg-gray-50">
                  <td className="border p-2">#{j.dorsal}</td>
                  <td className="border p-2">{j.nombres} {j.apellidos}</td>
                  <td className="border p-2">{j.posicion}</td>
                  <td className="border p-2">
                    <button
                      onClick={() => handleRemoveJugador(j.id)}
                      className="text-red-600 hover:underline"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* Agregar jugador */}
        <h3 className="text-lg font-bold mb-3">Agregar Jugador</h3>
        <form onSubmit={handleAddJugador} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-medium mb-1">Nombres</label>
              <input
                type="text"
                required
                value={nuevoJugador.nombres}
                onChange={(e) => setNuevoJugador({ ...nuevoJugador, nombres: e.target.value })}
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block font-medium mb-1">Apellidos</label>
              <input
                type="text"
                required
                value={nuevoJugador.apellidos}
                onChange={(e) => setNuevoJugador({ ...nuevoJugador, apellidos: e.target.value })}
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
                value={nuevoJugador.dorsal}
                onChange={(e) => setNuevoJugador({ ...nuevoJugador, dorsal: Number(e.target.value) })}
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block font-medium mb-1">Posición</label>
              <select
                required
                value={nuevoJugador.posicion}
                onChange={(e) => setNuevoJugador({ ...nuevoJugador, posicion: e.target.value })}
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
            <div className="col-span-2">
              <label className="block font-medium mb-1">Fecha de Nacimiento</label>
              <input
                type="date"
                required
                value={nuevoJugador.fechaNacimiento}
                onChange={(e) => setNuevoJugador({ ...nuevoJugador, fechaNacimiento: e.target.value })}
                className="w-full border rounded px-3 py-2"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={addingJugador}
            className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 disabled:opacity-50"
          >
            {addingJugador ? "Agregando..." : "+ Agregar Jugador"}
          </button>
        </form>
      </div>
    </div>
  );
}