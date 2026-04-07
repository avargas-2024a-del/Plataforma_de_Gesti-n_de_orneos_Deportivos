"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { partidosService, resultadosService, Partido, Resultado } from "@/services";

export default function PartidoDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = Number(params.id);
  const [partido, setPartido] = useState<Partido | null>(null);
  const [resultado, setResultado] = useState<Resultado | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [golesLocal, setGolesLocal] = useState(0);
  const [golesVisitante, setGolesVisitante] = useState(0);
  const [savingResultado, setSavingResultado] = useState(false);

  useEffect(() => {
    partidosService
      .findOne(id)
      .then(setPartido)
      .catch(() => setError("Error al cargar el partido"))
      .finally(() => setLoading(false));

    resultadosService
      .findAll()
      .then((resultados) => {
        const r = resultados.find((r) => r.partidoId === id);
        if (r) {
          setResultado(r);
          setGolesLocal(r.golesLocal);
          setGolesVisitante(r.golesVisitante);
        }
      });
  }, [id]);

  const handleDelete = async () => {
    if (!confirm("¿Eliminar este partido?")) return;
    try {
      await partidosService.remove(id);
      router.push("/partidos");
    } catch {
      alert("Error al eliminar el partido");
    }
  };

  const handleResultado = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingResultado(true);
    try {
      if (resultado) {
        await resultadosService.update(resultado.id, { golesLocal, golesVisitante });
      } else {
        const r = await resultadosService.create({ partidoId: id, golesLocal, golesVisitante });
        setResultado(r);
      }
      alert("Resultado guardado correctamente");
    } catch {
      alert("Error al guardar el resultado");
    } finally {
      setSavingResultado(false);
    }
  };

  const estadoColor = (estado: string) => {
    if (estado === "programado") return "bg-blue-100 text-blue-700";
    if (estado === "jugado") return "bg-green-100 text-green-700";
    return "bg-red-100 text-red-700";
  };

  if (loading) return <p className="p-8 text-center">Cargando...</p>;
  if (error) return <p className="p-8 text-center text-red-500">{error}</p>;
  if (!partido) return <p className="p-8 text-center">Partido no encontrado</p>;

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Detalle del Partido</h1>
        <Link href="/partidos" className="text-gray-500 hover:underline">← Volver</Link>
      </div>

      <div className="bg-white border rounded-lg p-6 space-y-3 mb-6">
        <p><span className="font-medium">Torneo:</span> {partido.torneo?.nombre ?? partido.torneoId}</p>
        <p><span className="font-medium">Local:</span> {partido.equipoLocal?.nombre ?? partido.equipoLocalId}</p>
        <p><span className="font-medium">Visitante:</span> {partido.equipoVisitante?.nombre ?? partido.equipoVisitanteId}</p>
        <p><span className="font-medium">Cancha:</span> {partido.cancha?.nombre ?? partido.canchaId}</p>
        <p><span className="font-medium">Fecha:</span> {partido.fecha}</p>
        <p><span className="font-medium">Hora:</span> {partido.hora}</p>
        <p>
          <span className="font-medium">Estado:</span>{" "}
          <span className={`px-2 py-1 rounded text-sm ${estadoColor(partido.estado)}`}>
            {partido.estado}
          </span>
        </p>
      </div>

      <div className="bg-gray-50 border rounded-lg p-6 mb-6">
        <h2 className="text-xl font-bold mb-4">Resultado</h2>
        <form onSubmit={handleResultado} className="space-y-3">
          <div className="flex gap-4 items-center">
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
            <span className="text-2xl font-bold mt-6">-</span>
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
          <button
            type="submit"
            disabled={savingResultado}
            className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 disabled:opacity-50"
          >
            {savingResultado ? "Guardando..." : resultado ? "Actualizar Resultado" : "Registrar Resultado"}
          </button>
        </form>
      </div>

      <div className="flex gap-3">
        <Link
          href={`/partidos/${partido.id}/edit`}
          className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
        >
          Editar
        </Link>
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