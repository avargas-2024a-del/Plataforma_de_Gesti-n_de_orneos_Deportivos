import { api } from "@/lib/api";

export interface Equipo {
  id: number;
  nombre: string;
  escudo: string;
  directorTecnico: string;
  torneoId: number;
  torneo?: { id: number; nombre: string };
}

export type CreateEquipoDto = Omit<Equipo, "id" | "torneo">;
export type UpdateEquipoDto = Partial<CreateEquipoDto>;

export const equiposService = {
  findAll: () => api.get<Equipo[]>("/equipo"),
  findOne: (id: number) => api.get<Equipo>(`/equipo/${id}`),
  create: (data: CreateEquipoDto) => api.post<Equipo>("/equipo", data),
  update: (id: number, data: UpdateEquipoDto) => api.put<Equipo>(`/equipo/${id}`, data),
  remove: (id: number) => api.delete<void>(`/equipo/${id}`),
};