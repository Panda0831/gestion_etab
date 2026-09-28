import { useState, useEffect, FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Classe, Matiere } from "../../types/structure";
import { CoursMedia } from "../../types/cours";
import {
  getClasses, getMatieres, createCours, updateCours,
  getCoursById, uploadMedias, deleteMedia,
} from "../../services/pedagogieService";
import Combobox from "../../components/Combobox";
import FilePicker from "../../components/FilePicker";
import MediaViewer from "../../components/MediaViewer";
import "./CoursEleve.css";
import "./NouveauCours.css";

const TYPES = ["COURS", "TD", "TP"] as const;

const classeLabel = (c: Classe) => (c.niveau ? `${c.niveau.nom} - ${c.nom}` : c.nom);
const matiereLabel = (m: Matiere) => m.nom;
const matiereHint = (m: Matiere) => m.code ?? "";
const classeHint = (c: Classe) => c.anneeScolaire;

export default function CoursForm() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);

  const [classes, setClasses] = useState<Classe[]>([]);
  const [matieres, setMatieres] = useState<Matiere[]>([]);

  const [classe, setClasse] = useState<Classe | null>(null);
  const [matiere, setMatiere] = useState<Matiere | null>(null);
  const [titre, setTitre] = useState("");
  const [contenu, setContenu] = useState("");
  const [type, setType] = useState<(typeof TYPES)[number]>("COURS");
  const [files, setFiles] = useState<File[]>([]);
  const [existingMedias, setExistingMedias] = useState<CoursMedia[]>([]);

  const [coursId, setCoursId] = useState<string | null>(id ?? null);
  const [loading, setLoading] = useState(isEdit);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Listes de classes et matières
  useEffect(() => {
    Promise.all([getClasses(), getMatieres()])
      .then(([c, m]) => {
        setClasses([...c].sort((a, b) => b.anneeScolaire.localeCompare(a.anneeScolaire) || a.nom.localeCompare(b.nom)));
        setMatieres([...m].sort((a, b) => a.nom.localeCompare(b.nom)));
      })
      .catch(() => setError("Impossible de charger les classes et les matières."));
  }, []);

  // Pré-remplissage en mode édition, une fois les listes chargées
  useEffect(() => {
    if (!isEdit || !id || classes.length === 0 || matieres.length === 0) return;

    getCoursById(id)
      .then((c) => {
        setTitre(c.titre);
        setContenu(c.contenu ?? "");
        setType(c.type);
        setExistingMedias(c.medias);
        setClasse(classes.find((cl) => cl.id === c.classe?.id) ?? null);
        setMatiere(matieres.find((m) => m.id === c.matiere.id) ?? null);
      })
      .catch(() => setError("Impossible de charger ce cours."))
      .finally(() => setLoading(false));
  }, [isEdit, id, classes, matieres]);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!coursId) {
      if (!classe || !matiere) return setError("Choisissez une classe et une matière dans la liste.");
      if (!titre.trim()) return setError("Le titre est obligatoire.");
    }

    setSubmitting(true);
    setError(null);

    let cid = coursId;
    try {
      const payload = {
        classeId: classe?.id,
        matiereId: matiere?.id,
        titre: titre.trim(),
        contenu: contenu.trim() || undefined,
        type,
      };

      if (isEdit && cid) {
        await updateCours(cid, payload);
      } else if (!cid) {
        const created = await createCours({
          classeId: classe!.id,
          matiereId: matiere!.id,
          titre: titre.trim(),
          contenu: contenu.trim() || undefined,
          type,
        });
        cid = created.id;
        setCoursId(cid);
      }

      if (files.length > 0) {
        const added = await uploadMedias(cid!, files);
        setExistingMedias((prev) => [...prev, ...added]);
        setFiles([]);
      }

      navigate("/coursProf");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Échec de la publication.";
      setError(
        !isEdit && cid
          ? `Le cours est créé, mais l'envoi des fichiers a échoué : ${msg}. Cliquez sur « Publier » pour réessayer.`
          : msg,
      );
      setSubmitting(false);
    }
  };

  const onRemoveMedia = async (mediaId: string) => {
    if (!coursId) return;
    try {
      await deleteMedia(coursId, mediaId);
      setExistingMedias((prev) => prev.filter((m) => m.id !== mediaId));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Échec de la suppression du fichier.");
    }
  };

  if (loading) return <p>Chargement...</p>;

  return (
    <motion.div className="cours-page" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <header className="cours-header">
        <h1>{isEdit ? "Modifier le cours" : "Nouveau cours"}</h1>
      </header>

      <form className="cours-form" onSubmit={onSubmit}>
        <Combobox
          label="Classe"
          placeholder="Tapez pour rechercher (ex. term)"
          options={classes}
          value={classe}
          onChange={setClasse}
          getKey={(c) => c.id}
          getLabel={classeLabel}
          getHint={classeHint}
        />

        <Combobox
          label="Matière"
          placeholder="Tapez pour rechercher (ex. math)"
          options={matieres}
          value={matiere}
          onChange={setMatiere}
          getKey={(m) => m.id}
          getLabel={matiereLabel}
          getHint={matiereHint}
        />

        <div>
          <label className="form-label">Type</label>
          <div className="cours-matieres">
            {TYPES.map((t) => (
              <button
                type="button"
                key={t}
                className={`cours-chip ${type === t ? "active" : ""}`}
                onClick={() => setType(t)}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="form-label">Titre</label>
          <input
            className="form-input"
            value={titre}
            onChange={(e) => setTitre(e.target.value)}
            maxLength={255}
            placeholder="Ex. Les fractions"
          />
        </div>

        <div>
          <label className="form-label">Contenu</label>
          <textarea
            className="form-input"
            rows={8}
            value={contenu}
            onChange={(e) => setContenu(e.target.value)}
            placeholder="Le contenu du cours..."
          />
        </div>

        {/* Fichiers déjà publiés, avec suppression individuelle */}
        {existingMedias.length > 0 && (
          <div>
            <label className="form-label">Fichiers publiés</label>
            <ul className="file-list">
              {existingMedias.map((m) => (
                <li key={m.id} className="file-item">
                  <MediaViewer media={m} />
                  <button
                    type="button"
                    className="file-remove"
                    onClick={() => onRemoveMedia(m.id)}
                    aria-label={`Supprimer ${m.nomFichier}`}
                  >
                    ✕
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        <FilePicker files={files} onChange={setFiles} disabled={submitting} />

        {error && <p className="form-error">{error}</p>}

        <div className="form-actions">
          <button type="button" className="cours-chip" onClick={() => navigate("/coursProf")}>
            Annuler
          </button>
          <button type="submit" className="cours-chip active" disabled={submitting}>
            {submitting ? "Enregistrement..." : isEdit ? "Enregistrer" : "Publier le cours"}
          </button>
        </div>
      </form>
    </motion.div>
  );
}