export type Role = "DIRECTEUR" | "SECRETAIRE" | "COMPTABLE" | "PROFESSEUR" | "ELEVE" | "PARENT";

export interface Etablissement {
  id: string;
  nom: string;
}

export interface User {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  role: Role;
  etablissement?: Etablissement | string;
}

export interface LoginPayload {
  email: string;
  password: string;
  etablissementId?: string;
}

export interface RegisterPayload {
  email: string;
  password: string;
  nom: string;
  prenom: string;
  telephone?: string;
  role: Role;
  etablissementId: string;
}