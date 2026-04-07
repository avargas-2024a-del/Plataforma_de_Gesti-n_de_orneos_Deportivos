import { api } from "@/lib/api";

export interface Cancha {
  id: number;
  nombre: string;
  direccion: string;
  tipoSuperficie: string;
  capacidad: number;
}

export type CreateCanchaDto = Omit<Cancha, "id">;
export type UpdateCanchaDto = Partial<CreateCanchaDto>;

export const canchasService = {
  findAll: () => api.get<Cancha[]>("/cancha"),
  findOne: (id: number) => api.get<Cancha>(`/cancha/${id}`),
  create: (data: CreateCanchaDto) => api.post<Cancha>("/cancha", data),
  update: (id: number, data: UpdateCanchaDto) => api.put<Cancha>(`/cancha/${id}`, data),
  remove: (id: number) => api.delete<void>(`/cancha/${id}`),
};