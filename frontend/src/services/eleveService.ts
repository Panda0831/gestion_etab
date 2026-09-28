import { get } from "./api";
import { Classe } from "../types/structure";

export interface Eleve {
  id: string;
  utilisateurId: string;
  classeId?: string;
  classe?: Classe;
}

export const getEleveByUserId = (userId: string): Promise<Eleve> =>
  get<Eleve>(`/eleve/user/${userId}`);