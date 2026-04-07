"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { canchasService, Cancha } from "@/services";

export default function CanchasPage() {
  const [canchas, setCanchas] = useState<Cancha[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    canchasService
      .findAll()
      .then(setCanchas)
      .catch(() => setError("Error al cargar canchas"))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("¿Eliminar esta cancha?")) return;
    try {
      await canchasService.remove(id);
      setCanchas(canchas.filter((c) => c.id !== id));
    } catch {
      alert("Error al eliminar la cancha");
    }
  };

  if (loading) return <p className="p-8 text-center">Cargando canchas...</p>;
  if (error) return <p className="p-8 text-center text-red-500">{error}</p>;

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Canchas</h1>
        <Link href="/canchas/new" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          + Nueva Cancha
        </Link>
      </div>

      {canchas.length === 0 ? (
        <p className="text-center text-gray-500">No hay canchas registradas.</p>
      ) : (
        <table className="w-full border-collapse border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-3 text-left">Nombre</th>
              <th className="border p-3 text-left">Dirección</th>
              <th className="border p-3 text-left">Superficie</th>
              <th className="border p-3 text-left">Capacidad</th>
              <th className="border p-3 text-left">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {canchas.map((cancha) => (
              <tr key={cancha.id} className="hover:bg-gray-50">
                <td className="border p-3">{cancha.nombre}</td>
                <td className="border p-3">{cancha.direccion}</td>
                <td className="border p-3">{cancha.tipoSuperficie}</td>
                <td className="border p-3">{cancha.capacidad}</td>
                <td className="border p-3 space-x-2">
                  <Link href={`/canchas/${cancha.id}`} className="text-blue-600 hover:underline">Ver</Link>
                  <Link href={`/canchas/${cancha.id}/edit`} className="text-yellow-600 hover:underline">Editar</Link>
                  <button onClick={() => handleDelete(cancha.id)} className="text-red-600 hover:underline">Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}