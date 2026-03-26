# 🏆 Plataforma de Gestión de Torneos Deportivos

> Equipos, partidos y tabla de posiciones — Trabajo en Clase · Nivel Intermedio

[![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)](https://nestjs.com/)
[![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-336791?style=for-the-badge&logo=postgresql&logoColor=white)](http://www.postgresql.org/)
[![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)
[![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://www.prisma.io/)

**Autoras:** Paula Ximena Romero Villegas · Angélica Vargas Zambrano

---

## 📋 Tabla de Contenidos

- [Descripción del Proyecto](#-descripción-del-proyecto)
- [Stack Tecnológico](#-stack-tecnológico)
- [Modelo de Datos](#-modelo-de-datos)
- [Plan de Releases](#-plan-de-releases)
- [Sprints e Historias de Usuario](#-sprints-e-historias-de-usuario)
- [Cronograma](#-cronograma)
- [Definition of Done (DoD)](#-definition-of-done-dod)
- [Instalación y Ejecución](#-instalación-y-ejecución)

---

## 📖 Descripción del Proyecto

La **Plataforma de Gestión de Torneos Deportivos** es una aplicación web full-stack que permite a ligas deportivas barriales administrar torneos de fútbol, baloncesto y voleibol: registro de equipos y jugadores, programación de partidos, registro de resultados y actualización automática de la tabla de posiciones.

### Contexto

Una liga deportiva barrial organiza torneos cada semestre, pero el registro de equipos, la programación de partidos y la tabla de posiciones se manejan en hojas de cálculo que frecuentemente se desactualizan. Esta plataforma permite que los organizadores gestionen torneos, registren equipos y jugadores, programen encuentros y que la tabla de posiciones se actualice automáticamente al ingresar los resultados.

### Alcance

| Aspecto | Detalle |
|---|---|
| **Tipo** | Trabajo en clase — Nivel Intermedio |
| **Entidades** | 7 entidades con relaciones (ver modelo de datos) |
| **Historias de Usuario** | 10 HUs organizadas en 4 sprints |
| **Releases** | 2 releases alineados con los cortes académicos |
| **Casos de Uso** | 5 CUs (torneos, equipos, partidos, resultados, tabla) |

### Casos de Uso

| # | Descripción |
|---|---|
| **CU-01** | Crear torneo con nombre, deporte, fecha de inicio, fecha de fin y formato (liga, eliminación). |
| **CU-02** | Registrar equipos con nombre, escudo, director técnico y lista de jugadores. |
| **CU-03** | Programar partidos con equipos enfrentados, fecha, hora y cancha asignada. |
| **CU-04** | Registrar resultado de un partido con marcador y goleadores. |
| **CU-05** | Consultar tabla de posiciones del torneo con puntos, goles a favor y en contra. |

### Funcionalidades Principales

- ✅ CRUD completo de Torneos, Equipos, Jugadores y Canchas
- ✅ Programación de Partidos con validación de conflictos de horario y cancha
- ✅ Registro de Resultados con actualización automática de la tabla de posiciones
- ✅ Registro de Goleadores por partido con validación de coherencia con el marcador
- ✅ Tabla de Posiciones calculada en tiempo real (puntos, GF, GC, diferencia)
- ✅ Ranking de Goleadores del torneo
- ✅ Common Module: Filtros de excepción, Interceptores y Pipes globales
- ✅ Integración completa Frontend ↔ Backend con Docker Compose

---

## 🛠 Stack Tecnológico

| Capa | Tecnología | Propósito |
|---|---|---|
| **Backend** | NestJS (Node.js + TypeScript) | API REST con arquitectura en capas |
| **Frontend** | Next.js 14+ (React + TypeScript) | Interfaz de usuario con App Router |
| **Base de Datos** | PostgreSQL 16 | Almacenamiento relacional |
| **ORM** | Prisma | Modelado de datos, migraciones y queries |
| **Contenedores** | Docker + Docker Compose | Orquestación de servicios |
| **Validación** | class-validator + class-transformer | DTOs y validación de entrada |

---

## 📊 Modelo de Datos

### Diagrama de Relaciones
```
Torneo       1 ──── N  Equipo
Torneo       1 ──── N  Partido
Equipo       1 ──── N  Jugador
Equipo       1 ──── N  Partido  (local)
Equipo       1 ──── N  Partido  (visitante)
Cancha       1 ──── N  Partido
Partido      1 ──── 1  Resultado
Jugador      1 ──── N  Goleador
```

### Entidades

| Entidad | Campos Principales |
|---|---|
| **Torneo** | id, nombre, deporte, fechaInicio, fechaFin, formato (liga \| eliminación), activo |
| **Equipo** | id, nombre, escudo (URL), directorTecnico, torneoId |
| **Jugador** | id, nombres, apellidos, dorsal (unique por equipo), posicion, fechaNacimiento, equipoId |
| **Cancha** | id, nombre, direccion, tipoSuperficie, capacidad |
| **Partido** | id, torneoId, equipoLocalId, equipoVisitanteId, canchaId, fecha, hora, estado (programado \| jugado \| cancelado) |
| **Resultado** | id, partidoId (unique), golesLocal, golesVisitante |
| **Goleador** | id, resultadoId, jugadorId, cantidad |

---

## 🚀 Plan de Releases

### Release 1 — Segundo Corte: Backend + Frontend Base

> **📅 Cierre: 15 de Abril de 2026** · Sprints 1 y 2

**Objetivo:** Entregar la API REST completa con arquitectura en capas (Controller → Service → Repository) y el frontend con las vistas de CRUD para todas las entidades base.

| Sprint | Período | HUs | Alcance |
|---|---|---|---|
| [Sprint 1](#sprint-1--infraestructura-y-entidades-base) | Mar 25 → Abr 3 | HU-01, HU-02, HU-03 | Docker, Prisma, Torneo, Equipo, Jugador |
| [Sprint 2](#sprint-2--entidades-de-competencia-y-cross-cutting) | Abr 4 → Abr 15 | HU-04, HU-05, HU-06 | Cancha, Partido, Resultado, Common Module |

### Release 2 — Tercer Corte: Integración y Despliegue

> **📅 Cierre: 15 de Mayo de 2026** · Sprints 3 y 4

**Objetivo:** Integración completa frontend ↔ backend, formularios avanzados con relaciones, registro de resultados desde la interfaz y despliegue funcional con Docker.

| Sprint | Período | HUs | Alcance |
|---|---|---|---|
| [Sprint 3](#sprint-3--resultados-goleadores-y-frontend-base) | Abr 16 → May 1 | HU-07, HU-08 | Registro de Resultados, Goleadores, Frontend base |
| [Sprint 4](#sprint-4--tabla-de-posiciones-integración-y-despliegue) | May 2 → May 15 | HU-09, HU-10 | Tabla de Posiciones, Ranking, integración y despliegue |

---

## 📌 Sprints e Historias de Usuario

### Sprint 1 — Infraestructura y entidades base

> 📅 **Mar 25 → Abr 3** · 📝 Entrega: 3 de Abril

| # | Historia de Usuario | Labels | Issue |
|---|---|---|---|
| HU-01 | Crear Torneo | `user-story` `backend` `frontend` | <!-- TODO --> |
| HU-02 | Editar y Eliminar Torneo | `user-story` `backend` `frontend` | <!-- TODO --> |
| HU-03 | Registrar Equipo con Jugadores | `user-story` `backend` `frontend` | <!-- TODO --> |

**Entregables:**
- Docker Compose con PostgreSQL, NestJS y Next.js
- Prisma schema con entidades Torneo, Equipo y Jugador
- Migraciones ejecutadas
- CRUD completo (Controller → Service → Repository) para las 3 entidades
- Frontend: listados y formularios básicos

---

#### HU-01 — Crear Torneo (CU-01)

> Como organizador, quiero crear un torneo con nombre, deporte, fechas y formato, para registrar oficialmente la competencia en la plataforma.

**Criterios de Aceptación**
- [ ] Se puede crear un torneo con: nombre, deporte (fútbol/baloncesto/voleibol), fecha de inicio, fecha de fin y formato (liga o eliminación).
- [ ] El nombre del torneo es único por deporte y temporada; si se duplica, el sistema retorna un error claro.
- [ ] La fecha de fin debe ser posterior a la fecha de inicio; caso contrario, el sistema retorna error.
- [ ] Se puede consultar la lista de todos los torneos con paginación y filtro por deporte.
- [ ] Se puede consultar un torneo por su ID con todos sus datos completos.

**Tareas Técnicas**
- Backend: `CreateTorneoDto`, `UpdateTorneoDto` con class-validator
- Backend: `TorneoRepository` (Prisma queries)
- Backend: `TorneoService` (lógica de negocio + validaciones de fechas y formato)
- Backend: `TorneoController` (GET, GET/:id, POST, PUT/:id, DELETE/:id)
- Frontend: Página de listado `/torneos`
- Frontend: Formulario de creación `/torneos/new`

---

#### HU-02 — Editar y Eliminar Torneo (CU-01)

> Como organizador, quiero editar o eliminar un torneo existente, para corregir datos incorrectos o retirar torneos que no se llevarán a cabo.

**Criterios de Aceptación**
- [ ] Se puede editar el nombre, deporte, fechas y formato de un torneo mientras no tenga partidos registrados.
- [ ] Si se intenta editar un torneo con partidos ya jugados, el sistema retorna un error descriptivo.
- [ ] Se puede eliminar un torneo que no tenga equipos ni partidos asociados.
- [ ] Si se intenta eliminar un torneo con equipos o partidos, el sistema retorna un error claro.
- [ ] Tras editar o eliminar exitosamente, el listado de torneos se actualiza de inmediato.

**Tareas Técnicas**
- Backend: Validación de dependencias (partidos/equipos) antes de eliminar en `TorneoService`
- Frontend: Página de detalle `/torneos/[id]` con botones Editar y Eliminar
- Frontend: Formulario de edición con datos precargados y confirmación de eliminación

---

#### HU-03 — Registrar Equipo con Jugadores (CU-02)

> Como director técnico, quiero registrar mi equipo con escudo, datos del cuerpo técnico y la lista de jugadores, para participar oficialmente en el torneo.

**Criterios de Aceptación**
- [ ] Se puede crear un equipo con: nombre, escudo (URL de imagen), director técnico y lista de jugadores (nombres, dorsales y posición).
- [ ] El nombre del equipo es único dentro del torneo; si se duplica, el sistema retorna error.
- [ ] El número de dorsal de cada jugador es único dentro del equipo.
- [ ] Se puede consultar la lista de equipos inscritos en un torneo con sus jugadores.
- [ ] Se puede consultar un equipo por ID con su plantilla completa.

**Tareas Técnicas**
- Backend: `CreateEquipoDto` con array anidado de jugadores y validaciones
- Backend: `EquipoRepository` y `JugadorRepository` (Prisma queries)
- Backend: `EquipoService` con creación transaccional de equipo + jugadores
- Backend: `EquipoController` (GET, GET/:id, POST, PUT/:id, DELETE/:id)
- Frontend: Formulario de creación de equipo con sección dinámica de jugadores

---

### Sprint 2 — Entidades de competencia y cross-cutting

> 📅 **Abr 4 → Abr 15** · 📝 Entrega: 15 de Abril

| # | Historia de Usuario | Labels | Issue |
|---|---|---|---|
| HU-04 | Editar Plantilla del Equipo | `user-story` `backend` `frontend` | <!-- TODO --> |
| HU-05 | Programar Partido | `user-story` `backend` `frontend` | <!-- TODO --> |
| HU-06 | Editar y Cancelar Partido | `user-story` `backend` `frontend` | <!-- TODO --> |

**Entregables:**
- CRUD de Cancha y Partido con validación de conflictos de horario
- Lógica de estados del partido (programado, jugado, cancelado)
- Common module: Filters, Interceptors, Pipes

---

#### HU-04 — Editar Plantilla del Equipo (CU-02)

> Como director técnico, quiero editar la información del equipo y agregar o retirar jugadores de la plantilla, para mantener los datos actualizados durante el torneo.

**Criterios de Aceptación**
- [ ] Se puede editar el nombre, escudo y director técnico de un equipo existente.
- [ ] Se pueden agregar nuevos jugadores al equipo mientras el torneo esté activo.
- [ ] Se puede eliminar un jugador de la plantilla si no tiene goles ni tarjetas registrados.
- [ ] Si el jugador tiene estadísticas registradas, el sistema retorna un error descriptivo al intentar eliminarlo.
- [ ] El dorsal editado o nuevo no debe duplicarse con otro jugador del mismo equipo.

**Tareas Técnicas**
- Backend: `UpdateEquipoDto`, `AddJugadorDto` con validación de dorsal único
- Backend: Verificación de estadísticas antes de eliminar jugador en `JugadorService`
- Frontend: Página de detalle del equipo `/equipos/[id]` con gestión de plantilla
- Frontend: Modal de agregar/editar jugador con validación de dorsal en tiempo real

---

#### HU-05 — Programar Partido (CU-03)

> Como organizador, quiero programar un partido indicando los equipos, fecha, hora y cancha, para establecer el calendario oficial de la competencia.

**Criterios de Aceptación**
- [ ] Se puede programar un partido seleccionando: torneo, equipo local, equipo visitante, fecha, hora y cancha asignada.
- [ ] No se puede enfrentar un equipo contra sí mismo.
- [ ] No se puede programar dos partidos en la misma cancha en la misma fecha y hora.
- [ ] Los equipos y la cancha deben existir previamente y pertenecer al torneo.
- [ ] Se puede consultar el calendario de partidos filtrado por torneo, fecha o equipo.

**Tareas Técnicas**
- Backend: `CreatePartidoDto` con validación de FKs y unicidad de cancha/fecha/hora
- Backend: `PartidoRepository` con query de verificación de conflicto de horario
- Backend: `PartidoController` (GET, GET/:id, POST, PUT/:id, DELETE/:id)
- Frontend: Formulario de partido con selects dinámicos (torneo → equipos → cancha)
- Frontend: Calendario visual `/partidos` con vista por fecha

---

#### HU-06 — Editar y Cancelar Partido (CU-03)

> Como organizador, quiero poder modificar o cancelar un partido programado, para ajustar el calendario ante imprevistos como lluvia o indisponibilidad de cancha.

**Criterios de Aceptación**
- [ ] Se puede editar la fecha, hora y cancha de un partido que aún no tenga resultado registrado.
- [ ] Si se cambia la cancha o el horario, el sistema verifica que no haya conflicto con otro partido.
- [ ] Se puede cancelar un partido que no tenga resultado registrado; el partido queda en estado 'cancelado'.
- [ ] Si el partido ya tiene resultado, no se puede editar ni cancelar; el sistema retorna error descriptivo.
- [ ] Los partidos cancelados no afectan la tabla de posiciones.

**Tareas Técnicas**
- Backend: Validación de estado del partido en `PartidoService` antes de editar/cancelar
- Backend: Enum de estado: `programado`, `jugado`, `cancelado` en modelo Partido
- Frontend: Botones de Editar y Cancelar visibles solo si el partido no tiene resultado
- Frontend: Modal de confirmación antes de cancelar un partido

---

### Sprint 3 — Resultados, Goleadores y Frontend base

> 📅 **Abr 16 → May 1** · 📝 Entrega: 1 de Mayo

| # | Historia de Usuario | Labels | Issue |
|---|---|---|---|
| HU-07 | Registrar Resultado con Marcador | `user-story` `backend` `frontend` | <!-- TODO --> |
| HU-08 | Registrar Goleadores del Partido | `user-story` `backend` `frontend` | <!-- TODO --> |

**Entregables:**
- Módulo de Resultado con actualización automática de tabla de posiciones
- Módulo de Goleadores con validación de coherencia de marcador
- Common Module global (filtros, interceptores, pipes)
- Frontend: estructura Next.js, listados y formularios de entidades base

---

#### HU-07 — Registrar Resultado con Marcador (CU-04)

> Como árbitro o administrador, quiero registrar el resultado de un partido con el marcador final, para que la tabla de posiciones se actualice automáticamente.

**Criterios de Aceptación**
- [ ] Se puede registrar un resultado indicando: goles del equipo local y goles del equipo visitante.
- [ ] Solo se puede registrar resultado en partidos con estado 'programado' (no cancelados ni ya con resultado).
- [ ] Al registrar el resultado, la tabla de posiciones se actualiza automáticamente (puntos, goles a favor/contra, diferencia).
- [ ] Un empate suma 1 punto a cada equipo; una victoria suma 3 puntos al ganador y 0 al perdedor.
- [ ] Se puede editar el resultado mientras el torneo esté activo; la tabla se recalcula automáticamente.

**Tareas Técnicas**
- Backend: `CreateResultadoDto` con validación de marcadores >= 0
- Backend: Lógica de actualización de tabla de posiciones en `ResultadoService` (transacción Prisma)
- Backend: `ResultadoController` (POST `/partidos/:id/resultado`, PUT `/partidos/:id/resultado`)
- Frontend: Formulario de resultado accesible desde la vista del partido

---

#### HU-08 — Registrar Goleadores del Partido (CU-04)

> Como árbitro o administrador, quiero registrar qué jugadores anotaron en el partido, para llevar el control estadístico de goles por jugador en el torneo.

**Criterios de Aceptación**
- [ ] Se pueden registrar uno o más goleadores por partido, indicando jugador y cantidad de goles.
- [ ] Cada goleador debe pertenecer a uno de los dos equipos que participaron en el partido.
- [ ] La suma de goles de los goleadores de cada equipo debe coincidir con el marcador registrado.
- [ ] Se puede registrar autogol indicando el jugador del equipo contrario como anotador.
- [ ] Se puede editar la lista de goleadores mientras el torneo esté activo.

**Tareas Técnicas**
- Backend: Entidad `Goleador` con relación a `Resultado` y `Jugador`
- Backend: Validación de coherencia entre goles y marcador en `ResultadoService`
- Frontend: Sección de goleadores dentro del formulario de resultado con selects por equipo
- Frontend: Validación en tiempo real de suma de goles vs. marcador ingresado

---

### Sprint 4 — Tabla de Posiciones, integración y despliegue

> 📅 **May 2 → May 15** · 📝 Entrega: 15 de Mayo

| # | Historia de Usuario | Labels | Issue |
|---|---|---|---|
| HU-09 | Consultar Tabla de Posiciones | `user-story` `backend` `frontend` | <!-- TODO --> |
| HU-10 | Consultar Estadísticas y Ranking de Goleadores | `user-story` `backend` `frontend` | <!-- TODO --> |

**Entregables:**
- Tabla de posiciones responsiva con columnas ordenables
- Ranking de goleadores con estadísticas individuales
- Formularios con selects dinámicos encadenados (torneo → equipos → cancha)
- Integración de flujos completos (crear torneo → registrar partidos → consultar tabla)
- Pruebas de integración y Docker Compose validación final
- README y documentación

---

#### HU-09 — Consultar Tabla de Posiciones (CU-05)

> Como usuario, quiero consultar la tabla de posiciones actualizada del torneo, para conocer el ranking de equipos en tiempo real.

**Criterios de Aceptación**
- [ ] La tabla muestra por equipo: posición, nombre, partidos jugados, ganados, empatados, perdidos, goles a favor, goles en contra, diferencia de goles y puntos.
- [ ] La tabla se ordena por puntos; en caso de empate, por diferencia de goles; luego por goles a favor.
- [ ] La tabla se actualiza de inmediato al registrar un nuevo resultado.
- [ ] Se puede filtrar la tabla por torneo desde un selector desplegable.
- [ ] La tabla es pública y no requiere autenticación para consultarse.

**Tareas Técnicas**
- Backend: Query agregada de Prisma para calcular estadísticas por equipo y torneo
- Backend: Endpoint `GET /torneos/:id/tabla-posiciones` con ordenamiento en base de datos
- Frontend: Página `/torneos/[id]/tabla` con tabla responsiva y columnas ordenables
- Frontend: Selector de torneo con actualización dinámica de la tabla

---

#### HU-10 — Consultar Estadísticas y Ranking de Goleadores (CU-05)

> Como usuario, quiero consultar el ranking de goleadores y las estadísticas del torneo, para conocer el desempeño individual de los jugadores en la competencia.

**Criterios de Aceptación**
- [ ] Se puede ver un ranking de goleadores del torneo ordenado de mayor a menor cantidad de goles.
- [ ] El ranking muestra: posición, nombre del jugador, equipo y total de goles anotados.
- [ ] Se pueden consultar las estadísticas completas de un jugador: goles, partidos jugados y equipo.
- [ ] El ranking se actualiza automáticamente al registrar nuevos goleadores en un resultado.
- [ ] El ranking es público y accesible sin autenticación desde la página del torneo.

**Tareas Técnicas**
- Backend: Query de Prisma con `GROUP BY jugadorId` y `SUM` de goles para ranking
- Backend: Endpoint `GET /torneos/:id/goleadores` con paginación
- Frontend: Sección de goleadores dentro de la página del torneo con tabla responsiva
- Frontend: Enlace a perfil de jugador con sus métricas individuales

---

## 📅 Cronograma
```
┌─────────────────────────────────────────────────────────────────────────────┐
│              RELEASE 1 — Segundo Corte · Sprints 1 y 2                     │
├──────────────────────────────┬──────────────────────────────────────────────┤
│          Sprint 1            │              Sprint 2                        │
│       Mar 25 → Abr 3        │           Abr 4 → Abr 15                    │
│    📝 Entrega: 3 Abr        │        📝 Entrega: 15 Abr                   │
│                              │                                              │
│  • Docker + Prisma           │  • Cancha                                   │
│  • Torneo (HU-01, HU-02)    │  • Partido (HU-05, HU-06)                  │
│  • Equipo + Jugador (HU-03) │  • Resultado + Common Module (HU-04)        │
├──────────────────────────────┴──────────────────────────────────────────────┤
│              RELEASE 2 — Tercer Corte · Sprints 3 y 4                      │
├──────────────────────────────┬──────────────────────────────────────────────┤
│          Sprint 3            │              Sprint 4                        │
│      Abr 16 → May 1         │           May 2 → May 15                    │
│    📝 Entrega: 1 May        │        📝 Entrega: 15 May                   │
│                              │                                              │
│  • Resultado marcador (HU-07)│  • Tabla Posiciones (HU-09)               │
│  • Goleadores (HU-08)        │  • Ranking Goleadores (HU-10)             │
│  • Frontend base             │  • Integración flujos completos            │
│                              │  • Docker Compose + README                 │
└──────────────────────────────┴──────────────────────────────────────────────┘
```

### Fechas de Entrega 2026

| Fecha | Sprint |
|---|---|
| Viernes 3 de Abril | Sprint 1 |
| Miércoles 15 de Abril | Sprint 2 |
| Viernes 1 de Mayo | Sprint 3 |
| Viernes 15 de Mayo | Sprint 4 |

---

## ✅ Definition of Done (DoD)

Cada Historia de Usuario se considera **terminada** cuando cumple **todos** los siguientes criterios:

### Backend
- [ ] Endpoint(s) implementados con arquitectura en capas: Controller → Service → Repository
- [ ] DTOs con validaciones usando `class-validator` y `class-transformer`
- [ ] Manejo de errores con excepciones HTTP apropiadas (`NotFoundException`, `ConflictException`, `BadRequestException`)
- [ ] Respuestas con formato uniforme (interceptor aplicado)
- [ ] Endpoint probado manualmente con Postman/Thunder Client

### Frontend
- [ ] Página(s) implementada(s) con componentes reutilizables
- [ ] Consumo del API a través de la capa de `services/`
- [ ] Manejo de estados: carga (loading), éxito y error
- [ ] Formularios con validación del lado del cliente
- [ ] Diseño responsivo y navegable

### Infraestructura y Código
- [ ] Código versionado en GitHub con commits descriptivos
- [ ] El servicio funciona correctamente con `docker compose up`
- [ ] No hay errores de consola ni advertencias críticas
- [ ] Las migraciones de Prisma están aplicadas y el esquema es consistente

---

## ⚙ Instalación y Ejecución

### Prerrequisitos

- [Docker](https://www.docker.com/products/docker-desktop/) y Docker Compose instalados
- [Git](https://git-scm.com/downloads)

### Clonar el repositorio
```bash
https://github.com/avargas-2024a-del/Plataforma_de_Gesti-n_de_orneos_Deportivos.git
```

### Configurar variables de entorno
```bash
cp .env.example .env
```
```env
# .env.example
DB_USER=admin
DB_PASSWORD=admin123
DB_NAME=torneos_deportivos_db
```

### Levantar los servicios
```bash
# Levantar todos los servicios con Docker Compose
docker compose up

# O en modo detached (segundo plano)
docker compose up -d
```

### Acceder a los servicios

| Servicio | URL |
|---|---|
| **Frontend (Next.js)** | http://localhost:3000 |
| **Backend (NestJS)** | http://localhost:3001 |
| **PostgreSQL** | `localhost:5432` |

---

## 📊 Estado del Proyecto

- [x] Plan de releases revisado y aprobado
- [x] Historias de Usuario revisadas y aprobadas
- [x] Criterios de Aceptación revisados y aprobados
- [x] Definition of Done revisado y aprobado
- [x] Modelo de datos revisado y aprobado
- [x] Repositorio GitHub creado con Issues y Milestones
