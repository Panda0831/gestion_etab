export interface Etablissement {
  id: string;
  nom: string;
  adresse?: string;
  telephone?: string;
  email?: string;
  logo?: string;
  type: "ECOLE" | "COLLEGE" | "LYCEE" | "UNIVERSITE";
  tarifs?: Record<string, any>;
  actif: boolean;
}

export interface Niveau {
  id: string;
  etablissementId: string;
  nom: string;
  cycle?: string;
  ordre?: number;
  classes?: Classe[];
}

export interface Classe {
  id: string;
  niveauId: string;
  nom: string;
  anneeScolaire: string;
  effectif: number;
  niveau?: Niveau;
}

export interface Matiere {
  id: string;
  etablissementId: string;
  nom: string;
  code?: string;
  coefficient: number;
}
