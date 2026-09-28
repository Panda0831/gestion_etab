import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User } from "../../types/auth";
import { Classe } from "../../types/structure";
import { Cours, CoursMedia } from "../../types/cours";
import { getEleveByUserId } from "../../services/eleveService";
import { getCoursByClasse } from "../../services/pedagogieService";
import "./CoursEleve.css";

interface CoursEleveProps {
  user: User;
  onLogout?: () => void;
}

function MediaViewer({ media }: { media: CoursMedia }) {
  switch (media.type) {
    case "VIDEO":
      return <video src={media.url} controls className="cours-media-player" />;
    case "AUDIO":
      return <audio src={media.url} controls />;
    case "IMAGE":
      return <img src={media.url} alt={media.nomFichier} className="cours-media-image" />;
    default:
      return (
        <a href={media.url} target="_blank" rel="noreferrer" className="cours-media-link">
          📄 {media.nomFichier}
        </a>
      );
  }
}

export default function CoursEleve({ user }: CoursEleveProps) {
  const [classe, setClasse] = useState<Classe | null>(null);
  const [cours, setCours] = useState<Cours[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [matiereId, setMatiereId] = useState<string | null>(null); // null = toutes
  const [selected, setSelected] = useState<Cours | null>(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const eleve = await getEleveByUserId(user.id);
        if (cancelled) return;
        setClasse(eleve.classe ?? null);

        if (eleve.classeId) {
          const data = await getCoursByClasse(eleve.classeId);
          if (!cancelled) setCours(data);
        }
      } catch {
        if (!cancelled) setError("Impossible de charger vos cours.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [user.id]);

  // Matières distinctes, avec le nombre de cours de chacune
  const matieres = useMemo(() => {
    const map = new Map<string, { id: string; nom: string; count: number }>();
    cours.forEach((c) => {
      const m = map.get(c.matiere.id) ?? { id: c.matiere.id, nom: c.matiere.nom, count: 0 };
      m.count++;
      map.set(c.matiere.id, m);
    });
    return [...map.values()].sort((a, b) => a.nom.localeCompare(b.nom));
  }, [cours]);

  const filtered = matiereId ? cours.filter((c) => c.matiere.id === matiereId) : cours;

  if (loading) return <p>Chargement...</p>;
  if (error) return <p>{error}</p>;
  if (!classe) return <p>Vous n'êtes affecté à aucune classe pour le moment.</p>;

  return (
    <motion.div className="cours-page" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <header className="cours-header">
        <h1>Mes cours</h1>
        <p>
          {classe.niveau ? `${classe.niveau.nom} - ${classe.nom}` : classe.nom} · {classe.anneeScolaire}
        </p>
      </header>

      {/* Filtre par matière */}
      <div className="cours-matieres">
        <button
          className={`cours-chip ${matiereId === null ? "active" : ""}`}
          onClick={() => setMatiereId(null)}
        >
          Toutes ({cours.length})
        </button>
        {matieres.map((m) => (
          <button
            key={m.id}
            className={`cours-chip ${matiereId === m.id ? "active" : ""}`}
            onClick={() => setMatiereId(m.id)}
          >
            {m.nom} ({m.count})
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p>Aucun cours publié pour le moment.</p>
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
              <span className="cours-prof">
                    {c.professeur.prenom} {c.professeur.nom}
                </span>
              <h3>{c.titre}</h3>
              <p className="cours-meta">
                {c.matiere.nom} · {c.professeur.prenom} {c.professeur.nom}
              </p>
              <p className="cours-meta">
                {new Date(c.datePublication).toLocaleDateString("fr-FR")}
                {c.medias.length > 0 && ` · ${c.medias.length} fichier(s)`}
              </p>
            </motion.button>
          ))}
        </div>
      )}

      {/* Détail du cours */}
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
              <button className="cours-close" onClick={() => setSelected(null)} aria-label="Fermer">
                ✕
              </button>
              <span className={`cours-badge ${selected.type.toLowerCase()}`}>{selected.type}</span>
              <span className="cours-prof">
                    {selected.professeur.prenom} {selected.professeur.nom}
                </span>
              <h2>{selected.titre}</h2>
              <p className="cours-meta">
                {new Date(selected.datePublication).toLocaleDateString("fr-FR")}
              </p>

              {selected.contenu && <div className="cours-contenu">{selected.contenu}</div>}

              {selected.medias.length > 0 && (
                <div className="cours-medias">
                  <h4>Fichiers</h4>
                  {selected.medias.map((m) => (
                    <MediaViewer key={m.id} media={m} />
                  ))}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}