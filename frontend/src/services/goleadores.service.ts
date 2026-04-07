import { api } from "@/lib/api";

export interface Goleador {
  id: number;
  resultadoId: number;
  jugadorId: number;
  cantidad: number;
  jugador?: { id: number; nombres: string; apellidos: string };
}

export type CreateGoleadorDto = Omit<Goleador, "id" | "jugador">;
export type UpdateGoleadorDto = Partial<CreateGoleadorDto>;

export const goleadoresService = {
  findAll: () => api.get<Goleador[]>("/goleador"),
  findOne: (id: number) => api.get<Goleador>(`/goleador/${id}`),
  create: (data: CreateGoleadorDto) => api.post<Goleador>("/goleador", data),
  update: (id: number, data: UpdateGoleadorDto) => api.put<Goleador>(`/goleador/${id}`, data),
  remove: (id: number) => api.delete<void>(`/goleador/${id}`),
};