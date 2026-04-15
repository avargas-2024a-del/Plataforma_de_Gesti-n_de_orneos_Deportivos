import Link from "next/link";
import {
  Trophy,
  Users,
  User,
  Calendar,
  ClipboardList,
  Target,
  MapPin,
} from "lucide-react";

// Definicion de los modulos del sistema con icono, titulo, descripcion y ruta
const modulos = [
  {
    icono: Trophy,
    titulo: "Torneos",
    descripcion: "Gestionar torneos deportivos",
    ruta: "/torneos",
    color: "bg-yellow-500",
  },
  {
    icono: MapPin,
    titulo: "Canchas",
    descripcion: "Administrar canchas disponibles",
    ruta: "/canchas",
    color: "bg-green-500",
  },
  {
    icono: Users,
    titulo: "Equipos",
    descripcion: "Registrar y consultar equipos",
    ruta: "/equipos",
    color: "bg-blue-500",
  },
  {
    icono: User,
    titulo: "Jugadores",
    descripcion: "Gestionar plantillas de jugadores",
    ruta: "/jugadores",
    color: "bg-purple-500",
  },
  {
    icono: Calendar,
    titulo: "Partidos",
    descripcion: "Programar y consultar partidos",
    ruta: "/partidos",
    color: "bg-orange-500",
  },
  {
    icono: ClipboardList,
    titulo: "Resultados",
    descripcion: "Registrar resultados de partidos",
    ruta: "/resultados",
    color: "bg-red-500",
  },
  {
    icono: Target,
    titulo: "Goleadores",
    descripcion: "Ranking de goleadores del torneo",
    ruta: "/goleadores",
    color: "bg-pink-500",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Encabezado de la pagina de inicio */}
      <div className="bg-blue-700 py-10 px-6 text-center text-white">
        <h1 className="text-4xl font-bold mb-2">
          🏆 Plataforma de Gestión de Torneos Deportivos
        </h1>
        <p className="text-blue-100 text-lg">
          Gestiona torneos, equipos, partidos y resultados en un solo lugar
        </p>
      </div>

      {/* Seccion de modulos del sistema */}
      <div className="max-w-5xl mx-auto px-6 py-10">
        <h2 className="text-2xl font-semibold text-gray-700 mb-6">
          Módulos del Sistema
        </h2>

        {/* Grid de tarjetas: 2 columnas en movil, 3 en pantallas medianas */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {modulos.map((modulo) => {
            const Icono = modulo.icono;
            return (
              <Link href={modulo.ruta} key={modulo.titulo}>
                <div className="bg-white rounded-xl shadow hover:shadow-md transition-shadow p-6 flex flex-col items-start gap-4 cursor-pointer hover:bg-blue-50">
                  {/* Icono con fondo de color */}
                  <div
                    className={`${modulo.color} text-white rounded-lg p-3`}
                  >
                    <Icono size={28} />
                  </div>
                  {/* Titulo y descripcion del modulo */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      {modulo.titulo}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {modulo.descripcion}
                    </p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}