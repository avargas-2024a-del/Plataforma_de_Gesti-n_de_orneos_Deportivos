import { api } from "@/lib/api";

export interface Torneo {
  id: number;
  nombre: string;
  deporte: string;
  fechaInicio: string;
  fechaFin: string;
  formato: "liga" | "eliminacion";
  activo: boolean;
}

export type CreateTorneoDto = Omit<Torneo, "id">;
export type UpdateTorneoDto = Partial<CreateTorneoDto>;

export const torneosService = {
  findAll: () => api.get<Torneo[]>("/torneo"),
  findOne: (id: number) => api.get<Torneo>(`/torneo/${id}`),
  create: (data: CreateTorneoDto) => api.post<Torneo>("/torneo", data),
  update: (id: number, data: UpdateTorneoDto) => api.put<Torneo>(`/torneo/${id}`, data),
  remove: (id: number) => api.delete<void>(`/torneo/${id}`),
};