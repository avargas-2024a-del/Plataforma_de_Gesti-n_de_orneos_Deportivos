"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { equiposService, Equipo } from "@/services";

export default function EquiposPage() {
  const [equipos, setEquipos] = useState<Equipo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    equiposService
      .findAll()
      .then(setEquipos)
      .catch(() => setError("Error al cargar equipos"))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("¿Eliminar este equipo?")) return;
    try {
      await equiposService.remove(id);
      setEquipos(equipos.filter((e) => e.id !== id));
    } catch {
      alert("Error al eliminar el equipo");
    }
  };

  if (loading) return <p className="p-8 text-center">Cargando equipos...</p>;
  if (error) return <p className="p-8 text-center text-red-500">{error}</p>;

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Equipos</h1>
        <Link href="/equipos/new" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          + Nuevo Equipo
        </Link>
      </div>

      {equipos.length === 0 ? (
        <p className="text-center text-gray-500">No hay equipos registrados.</p>
      ) : (
        <table className="w-full border-collapse border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-3 text-left">Nombre</th>
              <th className="border p-3 text-left">Director Técnico</th>
              <th className="border p-3 text-left">Torneo</th>
              <th className="border p-3 text-left">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {equipos.map((equipo) => (
              <tr key={equipo.id} className="hover:bg-gray-50">
                <td className="border p-3">{equipo.nombre}</td>
                <td className="border p-3">{equipo.directorTecnico}</td>
                <td className="border p-3">{equipo.torneo?.nombre ?? equipo.torneoId}</td>
                <td className="border p-3 space-x-2">
                  <Link href={`/equipos/${equipo.id}`} className="text-blue-600 hover:underline">Ver</Link>
                  <Link href={`/equipos/${equipo.id}/edit`} className="text-yellow-600 hover:underline">Editar</Link>
                  <button onClick={() => handleDelete(equipo.id)} className="text-red-600 hover:underline">Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}