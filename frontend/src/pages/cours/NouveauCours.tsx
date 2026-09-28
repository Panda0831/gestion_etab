import { useState, useEffect, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Classe, Matiere } from "../../types/structure";
import { getClasses, getMatieres, createCours } from "../../services/pedagogieService";
import Combobox from "../../components/Combobox";
import "./CoursEleve.css";
import "./NouveauCours.css";

const TYPES = ["COURS", "TD", "TP"] as const;

const classeLabel = (c: Classe) => (c.niveau ? `${c.niveau.nom} - ${c.nom}` : c.nom);
const matiereLabel = (m: Matiere) => m.nom;
const matiereHint = (m: Matiere) => m.code ?? "";
const classeHint = (c: Classe) => c.anneeScolaire;

export default function NouveauCours() {
  const navigate = useNavigate();

  const [classes, setClasses] = useState<Classe[]>([]);
  const [matieres, setMatieres] = useState<Matiere[]>([]);

  const [classe, setClasse] = useState<Classe | null>(null);
  const [matiere, setMatiere] = useState<Matiere | null>(null);
  const [titre, setTitre] = useState("");
  const [contenu, setContenu] = useState("");
  const [type, setType] = useState<(typeof TYPES)[number]>("COURS");

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([getClasses(), getMatieres()])
      .then(([c, m]) => {
        // années récentes d'abord, puis ordre alphabétique
        setClasses([...c].sort((a, b) => b.anneeScolaire.localeCompare(a.anneeScolaire) || a.nom.localeCompare(b.nom)));
        setMatieres([...m].sort((a, b) => a.nom.localeCompare(b.nom)));
      })
      .catch(() => setError("Impossible de charger les classes et les matières."));
  }, []);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!classe || !matiere) return setError("Choisissez une classe et une matière dans la liste.");
    if (!titre.trim()) return setError("Le titre est obligatoire.");

    setSubmitting(true);
    setError(null);
    try {
      await createCours({
        classeId: classe.id,
        matiereId: matiere.id,
        titre: titre.trim(),
        contenu: contenu.trim() || undefined,
        type,
      });
      navigate("/coursProf");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Échec de la création du cours.");
      setSubmitting(false);
    }
  };

  return (
    <motion.div className="cours-page" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <header className="cours-header">
        <h1>Nouveau cours</h1>
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

        {error && <p className="form-error">{error}</p>}

        <div className="form-actions">
          <button type="button" className="cours-chip" onClick={() => navigate("/cours")}>
            Annuler
          </button>
          <button type="submit" className="cours-chip active" disabled={submitting}>
            {submitting ? "Publication..." : "Publier le cours"}
          </button>
        </div>
      </form>
    </motion.div>
  );
}