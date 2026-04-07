"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { torneosService, Torneo } from "@/services";

export default function TorneosPage() {
  const [torneos, setTorneos] = useState<Torneo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    torneosService
      .findAll()
      .then(setTorneos)
      .catch(() => setError("Error al cargar torneos"))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("¿Eliminar este torneo?")) return;
    try {
      await torneosService.remove(id);
      setTorneos(torneos.filter((t) => t.id !== id));
    } catch {
      alert("Error al eliminar el torneo");
    }
  };

  if (loading) return <p className="p-8 text-center">Cargando torneos...</p>;
  if (error) return <p className="p-8 text-center text-red-500">{error}</p>;

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Torneos</h1>
        <Link
          href="/torneos/new"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          + Nuevo Torneo
        </Link>
      </div>

      {torneos.length === 0 ? (
        <p className="text-center text-gray-500">No hay torneos registrados.</p>
      ) : (
        <table className="w-full border-collapse border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-3 text-left">Nombre</th>
              <th className="border p-3 text-left">Deporte</th>
              <th className="border p-3 text-left">Formato</th>
              <th className="border p-3 text-left">Fecha Inicio</th>
              <th className="border p-3 text-left">Fecha Fin</th>
              <th className="border p-3 text-left">Estado</th>
              <th className="border p-3 text-left">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {torneos.map((torneo) => (
              <tr key={torneo.id} className="hover:bg-gray-50">
                <td className="border p-3">{torneo.nombre}</td>
                <td className="border p-3">{torneo.deporte}</td>
                <td className="border p-3 capitalize">{torneo.formato}</td>
                <td className="border p-3">{torneo.fechaInicio}</td>
                <td className="border p-3">{torneo.fechaFin}</td>
                <td className="border p-3">
                  <span className={`px-2 py-1 rounded text-sm ${torneo.activo ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                    {torneo.activo ? "Activo" : "Inactivo"}
                  </span>
                </td>
                <td className="border p-3 space-x-2">
                  <Link href={`/torneos/${torneo.id}`} className="text-blue-600 hover:underline">Ver</Link>
                  <Link href={`/torneos/${torneo.id}/edit`} className="text-yellow-600 hover:underline">Editar</Link>
                  <button onClick={() => handleDelete(torneo.id)} className="text-red-600 hover:underline">Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}