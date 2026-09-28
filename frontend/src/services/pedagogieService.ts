import { get } from "./api";
import { Cours } from "../types/cours";

export const getCoursByClasse = (classeId: string): Promise<Cours[]> =>
  get<Cours[]>(`/cours/classe/${classeId}`);

export const getCoursByProfesseur = (professeurId: string): Promise<Cours[]> =>
  get<Cours[]>(`/cours/professeur/${professeurId}`);