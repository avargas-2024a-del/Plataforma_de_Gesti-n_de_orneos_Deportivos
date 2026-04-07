import { api } from "@/lib/api";

export interface Resultado {
  id: number;
  partidoId: number;
  golesLocal: number;
  golesVisitante: number;
}

export type CreateResultadoDto = Omit<Resultado, "id">;
export type UpdateResultadoDto = Partial<CreateResultadoDto>;

export const resultadosService = {
  findAll: () => api.get<Resultado[]>("/resultado"),
  findOne: (id: number) => api.get<Resultado>(`/resultado/${id}`),
  create: (data: CreateResultadoDto) => api.post<Resultado>("/resultado", data),
  update: (id: number, data: UpdateResultadoDto) => api.put<Resultado>(`/resultado/${id}`, data),
  remove: (id: number) => api.delete<void>(`/resultado/${id}`),
};