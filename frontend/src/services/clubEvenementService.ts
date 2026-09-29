import { get } from "./api";

export const getClubsEvenementByUtilisateur = (utilisateurId: string, type: "CLUB" | "EVENEMENT") => {
  return get(`/club-evenement/utilisateur/${utilisateurId}?type=${type}`);
};