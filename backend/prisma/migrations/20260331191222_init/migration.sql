-- =========================================================
-- CREACIÓN DE TABLAS
-- Prisma genera estas instrucciones a partir del schema.prisma
-- Cada CREATE TABLE corresponde a un modelo definido en el schema
-- =========================================================

-- CreateTable
-- Tabla principal del sistema: almacena los torneos deportivos
-- SERIAL = autoincremento automático del id
CREATE TABLE "torneos" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "deporte" TEXT NOT NULL,
    "fechaInicio" TIMESTAMP(3) NOT NULL,
    "fechaFin" TIMESTAMP(3) NOT NULL,
    "formato" TEXT NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "torneos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
-- Almacena los equipos participantes en un torneo
-- Cada equipo pertenece a UN torneo (relación N a 1 con torneos)
CREATE TABLE "equipos" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "escudo" TEXT NOT NULL,
    "directorTecnico" TEXT NOT NULL,
    "torneoId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "equipos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
-- Almacena los jugadores de cada equipo
-- Cada jugador pertenece a UN equipo (relación N a 1 con equipos)
CREATE TABLE "jugadores" (
    "id" SERIAL NOT NULL,
    "nombres" TEXT NOT NULL,
    "apellidos" TEXT NOT NULL,
    "dorsal" INTEGER NOT NULL,
    "posicion" TEXT NOT NULL,
    "fechaNacimiento" TIMESTAMP(3) NOT NULL,
    "equipoId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "jugadores_pkey" PRIMARY KEY ("id")
);

-- CreateTable
-- Almacena las canchas donde se juegan los partidos
-- No tiene FK porque es una entidad independiente
CREATE TABLE "canchas" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "direccion" TEXT NOT NULL,
    "tipoSuperficie" TEXT NOT NULL,
    "capacidad" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "canchas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
-- Almacena los partidos programados dentro de un torneo
-- Es la entidad mas relacionada: conecta torneo, dos equipos y una cancha
CREATE TABLE "partidos" (
    "id" SERIAL NOT NULL,
    "torneoId" INTEGER NOT NULL,
    "equipoLocalId" INTEGER NOT NULL,
    "equipoVisitanteId" INTEGER NOT NULL,
    "canchaId" INTEGER NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL,
    "hora" TEXT NOT NULL,
    "estado" TEXT NOT NULL DEFAULT 'programado',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "partidos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
-- Almacena el resultado final de un partido
-- Relacion 1 a 1 con partidos: cada partido tiene maximo UN resultado
CREATE TABLE "resultados" (
    "id" SERIAL NOT NULL,
    "partidoId" INTEGER NOT NULL,
    "golesLocal" INTEGER NOT NULL,
    "golesVisitante" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "resultados_pkey" PRIMARY KEY ("id")
);

-- CreateTable
-- Almacena los goleadores de cada partido
-- Un resultado puede tener varios goleadores (relacion 1 a N con resultados)
CREATE TABLE "goleadores" (
    "id" SERIAL NOT NULL,
    "resultadoId" INTEGER NOT NULL,
    "jugadorId" INTEGER NOT NULL,
    "cantidad" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "goleadores_pkey" PRIMARY KEY ("id")
);

-- =========================================================
-- INDICES UNICOS
-- Evitan duplicados en combinaciones de campos especificas
-- =========================================================

-- CreateIndex
-- Garantiza que dentro de un mismo equipo no haya dos jugadores con el mismo dorsal
-- Si puede haber dorsal 10 en equipo A y dorsal 10 en equipo B
CREATE UNIQUE INDEX "jugadores_dorsal_equipoId_key" ON "jugadores"("dorsal", "equipoId");

-- CreateIndex
-- Garantiza la relacion 1 a 1 entre partido y resultado
-- Un partido no puede tener dos resultados registrados
CREATE UNIQUE INDEX "resultados_partidoId_key" ON "resultados"("partidoId");

-- =========================================================
-- LLAVES FORANEAS (Foreign Keys)
-- Establecen las relaciones entre tablas
-- ON DELETE RESTRICT = no permite borrar el registro padre si tiene hijos
-- ON UPDATE CASCADE = si cambia el id padre, se actualiza en los hijos
-- =========================================================

-- AddForeignKey
-- Un equipo pertenece a un torneo
-- No se puede borrar el torneo si tiene equipos registrados
ALTER TABLE "equipos" ADD CONSTRAINT "equipos_torneoId_fkey" FOREIGN KEY ("torneoId") REFERENCES "torneos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
-- Un jugador pertenece a un equipo
-- No se puede borrar el equipo si tiene jugadores registrados
ALTER TABLE "jugadores" ADD CONSTRAINT "jugadores_equipoId_fkey" FOREIGN KEY ("equipoId") REFERENCES "equipos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
-- Un partido pertenece a un torneo
ALTER TABLE "partidos" ADD CONSTRAINT "partidos_torneoId_fkey" FOREIGN KEY ("torneoId") REFERENCES "torneos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
-- Un partido tiene un equipo local
ALTER TABLE "partidos" ADD CONSTRAINT "partidos_equipoLocalId_fkey" FOREIGN KEY ("equipoLocalId") REFERENCES "equipos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
-- Un partido tiene un equipo visitante
-- Tanto equipoLocalId como equipoVisitanteId apuntan a la misma tabla equipos
ALTER TABLE "partidos" ADD CONSTRAINT "partidos_equipoVisitanteId_fkey" FOREIGN KEY ("equipoVisitanteId") REFERENCES "equipos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
-- Un partido se juega en una cancha
ALTER TABLE "partidos" ADD CONSTRAINT "partidos_canchaId_fkey" FOREIGN KEY ("canchaId") REFERENCES "canchas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
-- Un resultado pertenece a un partido
ALTER TABLE "resultados" ADD CONSTRAINT "resultados_partidoId_fkey" FOREIGN KEY ("partidoId") REFERENCES "partidos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
-- Un goleador esta asociado a un resultado de partido
ALTER TABLE "goleadores" ADD CONSTRAINT "goleadores_resultadoId_fkey" FOREIGN KEY ("resultadoId") REFERENCES "resultados"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
-- Un goleador esta asociado a un jugador especifico
ALTER TABLE "goleadores" ADD CONSTRAINT "goleadores_jugadorId_fkey" FOREIGN KEY ("jugadorId") REFERENCES "jugadores"("id") ON DELETE RESTRICT ON UPDATE CASCADE;