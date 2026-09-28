import { Matiere } from "./structure";

export interface CoursMedia {
  id: string;
  nomFichier: string;
  type: "VIDEO" | "PDF" | "IMAGE" | "AUDIO";
  url: string;
  taille?: number;
}

export interface Cours {
  id: string;
  titre: string;
  contenu?: string;
  type: "COURS" | "TD" | "TP";
  datePublication: string;
  matiere: Matiere;
  professeur: { nom: string; prenom: string };
  medias: CoursMedia[];
}