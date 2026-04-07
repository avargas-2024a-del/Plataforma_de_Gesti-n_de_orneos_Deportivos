import { api } from "@/lib/api";

export interface Partido {
  id: number;
  torneoId: number;
  equipoLocalId: number;
  equipoVisitanteId: number;
  canchaId: number;
  fecha: string;
  hora: string;
  estado: "programado" | "jugado" | "cancelado";
  torneo?: { id: number; nombre: string };
  equipoLocal?: { id: number; nombre: string };
  equipoVisitante?: { id: number; nombre: string };
  cancha?: { id: number; nombre: string };
}

export type CreatePartidoDto = Omit<Partido, "id" | "estado" | "torneo" | "equipoLocal" | "equipoVisitante" | "cancha">;
export type UpdatePartidoDto = Partial<CreatePartidoDto>;

export const partidosService = {
  findAll: (torneoId?: number) =>
    api.get<Partido[]>(torneoId ? `/partido?torneoId=${torneoId}` : "/partido"),
  findOne: (id: number) => api.get<Partido>(`/partido/${id}`),
  create: (data: CreatePartidoDto) => api.post<Partido>("/partido", data),
  update: (id: number, data: UpdatePartidoDto) => api.put<Partido>(`/partido/${id}`, data),
  remove: (id: number) => api.delete<void>(`/partido/${id}`),
};