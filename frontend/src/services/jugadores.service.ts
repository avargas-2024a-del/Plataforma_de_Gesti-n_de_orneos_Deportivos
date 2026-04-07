import { api } from "@/lib/api";

export interface Jugador {
  id: number;
  nombres: string;
  apellidos: string;
  dorsal: number;
  posicion: string;
  fechaNacimiento: string;
  equipoId: number;
  equipo?: { id: number; nombre: string };
}

export type CreateJugadorDto = Omit<Jugador, "id" | "equipo">;
export type UpdateJugadorDto = Partial<CreateJugadorDto>;

export const jugadoresService = {
  findAll: () => api.get<Jugador[]>("/jugador"),
  findOne: (id: number) => api.get<Jugador>(`/jugador/${id}`),
  create: (data: CreateJugadorDto) => api.post<Jugador>("/jugador", data),
  update: (id: number, data: UpdateJugadorDto) => api.put<Jugador>(`/jugador/${id}`, data),
  remove: (id: number) => api.delete<void>(`/jugador/${id}`),
};