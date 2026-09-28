import { get, post } from "./api";
import { Cours } from "../types/cours";
import { Classe, Matiere } from "../types/structure";

export const getCoursByClasse = (classeId: string): Promise<Cours[]> =>
  get<Cours[]>(`/cours/classe/${classeId}`);

export const getCoursByProfesseur = (professeurId: string): Promise<Cours[]> =>
  get<Cours[]>(`/cours/professeur/${professeurId}`);


export const getClasses = () => get<Classe[]>("/classe");
export const getMatieres = () => get<Matiere[]>("/matiere");

export const createCours = (payload: {
  classeId: string;
  matiereId: string;
  titre: string;
  contenu?: string;
  type: "COURS" | "TD" | "TP";
}) => post<typeof payload, Cours>("/cours", payload);