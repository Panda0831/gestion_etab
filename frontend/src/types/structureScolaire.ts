export interface Classe {
  id: string;
  niveauId: string;
  nom: string;
  anneeScolaire: string;
  effectif: number;
}

export interface ClasseList {
    data: Classe[];
    total: number;
}