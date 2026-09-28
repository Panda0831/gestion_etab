import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User } from "../../types/auth";
import { Cours } from "../../types/cours";
import { getCoursByProfesseur } from "../../services/pedagogieService";
import MediaViewer from "../../components/MediaViewer";
import "./CoursEleve.css";
import { Link } from "react-router-dom";

interface CoursProfesseurProps {
  user: User;
  onLogout?: () => void;
}

const ALL = "all";

const classeLabel = (c: Cours, withAnnee = false) => {
  if (!c.classe) return "";
  const base = c.classe.niveau ? `${c.classe.niveau.nom} - ${c.classe.nom}` : c.classe.nom;
  return withAnnee ? `${base} · ${c.classe.anneeScolaire}` : base;
};

export default function CoursProfesseur({ user }: CoursProfesseurProps) {
  const [cours, setCours] = useState<Cours[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [annee, setAnnee] = useState<string | null>(null); // null = pas encore choisi
  const [classeId, setClasseId] = useState<string | null>(null);
  const [selected, setSelected] = useState<Cours | null>(null);

  useEffect(() => {
    let cancelled = false;

    getCoursByProfesseur(user.id)
      .then((data) => !cancelled && setCours(data))
      .catch(() => !cancelled && setError("Impossible de charger vos cours."))
      .finally(() => !cancelled && setLoading(false));

    return () => {
      cancelled = true;
    };
  }, [user.id]);

  // Années scolaires distinctes, la plus récente d'abord
  const annees = useMemo(() => {
    const set = new Set<string>();
    cours.forEach((c) => c.classe && set.add(c.classe.anneeScolaire));
    return [...set].sort().reverse();
  }, [cours]);

  // Par défaut : l'année la plus récente
  const anneeActive = annee ?? annees[0] ?? ALL;

  const coursAnnee = useMemo(
    () => (anneeActive === ALL ? cours : cours.filter((c) => c.classe?.anneeScolaire === anneeActive)),
    [cours, anneeActive],
  );

  // Classes distinctes de l'année choisie
  const classes = useMemo(() => {
    const map = new Map<string, { id: string; label: string; count: number }>();
    coursAnnee.forEach((c) => {
      if (!c.classe) return;
      const k = map.get(c.classe.id) ?? {
        id: c.classe.id,
        label: classeLabel(c, anneeActive === ALL), // année affichée seulement si on mélange les années
        count: 0,
      };
      k.count++;
      map.set(c.classe.id, k);
    });
    return [...map.values()].sort((a, b) => a.label.localeCompare(b.label));
  }, [coursAnnee, anneeActive]);

  const filtered = classeId ? coursAnnee.filter((c) => c.classe?.id === classeId) : coursAnnee;

  const changeAnnee = (a: string) => {
    setAnnee(a);
    setClasseId(null); // la classe sélectionnée n'existe peut-être pas dans cette année
  };

  if (loading) return <p>Chargement...</p>;
  if (error) return <p>{error}</p>;

  return (
    <motion.div className="cours-page" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <header className="cours-header">
        <h1>Mes cours publiés</h1> 
        <Link to="/coursProf/Nouveau">Créer un nouveau cours</Link>

        <p>
          {coursAnnee.length} cours
          {anneeActive !== ALL && ` · ${anneeActive}`}
        </p>
      </header>
      

      {/* Filtre année scolaire */}
      {annees.length > 0 && (
        <div className="cours-matieres">
          {annees.map((a) => (
            <button
              key={a}
              className={`cours-chip ${anneeActive === a ? "active" : ""}`}
              onClick={() => changeAnnee(a)}
            >
              {a}
            </button>
          ))}
          {annees.length > 1 && (
            <button
              className={`cours-chip ${anneeActive === ALL ? "active" : ""}`}
              onClick={() => changeAnnee(ALL)}
            >
              Toutes les années
            </button>
          )}
        </div>
      )}

      {/* Filtre classe */}
      <div className="cours-matieres">
        <button className={`cours-chip ${classeId === null ? "active" : ""}`} onClick={() => setClasseId(null)}>
          Toutes les classes ({coursAnnee.length})
        </button>
        {classes.map((k) => (
          <button
            key={k.id}
            className={`cours-chip ${classeId === k.id ? "active" : ""}`}
            onClick={() => setClasseId(k.id)}
          >
            {k.label} ({k.count})
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p>Vous n'avez publié aucun cours pour cette sélection.</p>
      ) : (
        <div className="cours-list">
          {filtered.map((c) => (
            <motion.button
              key={c.id}
              className="cours-card"
              onClick={() => setSelected(c)}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className={`cours-badge ${c.type.toLowerCase()}`}>{c.type}</span>
              <span className="cours-prof">{classeLabel(c, true)}</span>
              <h3>{c.titre}</h3>
              <p className="cours-meta">{c.matiere.nom}</p>
              <p className="cours-meta">
                {new Date(c.datePublication).toLocaleDateString("fr-FR")}
                {c.medias.length > 0 && ` · ${c.medias.length} fichier(s)`}
              </p>
            </motion.button>
          ))}
        </div>
      )}

      <AnimatePresence>
        {selected && (
          <motion.div
            className="cours-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelected(null)}
          >
            <motion.div
              className="cours-modal"
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 40, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button className="cours-close" onClick={() => setSelected(null)} aria-label="Fermer">✕</button>
              <div className="cours-modal-top">
                <span className={`cours-badge ${selected.type.toLowerCase()}`}>{selected.type}</span>
                <span className="cours-prof">{classeLabel(selected, true)}</span>
              </div>
              <h2>{selected.titre}</h2>
              <p className="cours-meta">
                {selected.matiere.nom} · {new Date(selected.datePublication).toLocaleDateString("fr-FR")}
              </p>

              {selected.contenu && <div className="cours-contenu">{selected.contenu}</div>}

              {selected.medias.length > 0 && (
                <div className="cours-medias">
                  <h4>Fichiers</h4>
                  {selected.medias.map((m) => <MediaViewer key={m.id} media={m} />)}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}