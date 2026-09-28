import { del, get, patch, post, upload } from "./api";
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

export const uploadMedias = (coursId: string, files: File[]) => {
  const fd = new FormData();
  files.forEach((f) => fd.append("files", f)); // "files" = nom attendu par FilesInterceptor
  return upload<CoursMedia[]>(`/cours/${coursId}/medias`, fd);
};

export const getCoursById = (id: string) => get<Cours>(`/cours/${id}`);

export const updateCours = (
  id: string,
  payload: Partial<{ classeId: string; matiereId: string; titre: string; contenu?: string; type: string }>,
) => patch<typeof payload, Cours>(`/cours/${id}`, payload);

export const deleteCours = (id: string) => del<void>(`/cours/${id}`);

export const deleteMedia = (coursId: string, mediaId: string) => del<void>(`/cours/${coursId}/medias/${mediaId}`);