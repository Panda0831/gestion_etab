import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { get } from "../services/api";
import { Eleve } from "../types/auth";

const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05, delayChildren: 0.1 },
  },
};

const row = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] },
  },
};

const statutColors: Record<string, { color: string; bg: string }> = {
  INSCRIT: { color: "#10b981", bg: "#ecfdf5" },
  EN_ATTENTE: { color: "#f59e0b", bg: "#fffbeb" },
  RADIE: { color: "#ef4444", bg: "#fef2f2" },
};

function ListeEleves() {
  const [eleves, setEleves] = useState<Eleve[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchEleves = async () => {
      try {
        const data = await get<Eleve[]>("/eleve", true);
        setEleves(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Impossible de charger les élèves.");
      } finally {
        setLoading(false);
      }
    };
    fetchEleves();
  }, []);

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  return (
    <motion.div
      className="dash-container"
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.div
        className="dash-welcome"
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <h1>Élèves</h1>
        <p>Liste des élèves inscrits dans l&apos;établissement.</p>
      </motion.div>

      <motion.div
        className="dash-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        style={{ width: "100%", overflowX: "auto" }}
      >
        <div className="dash-card-header">
          <h3>Liste des élèves</h3>
          <motion.span
            className="dash-card-badge"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.4, type: "spring", stiffness: 400, damping: 15 }}
          >
            {eleves.length}
          </motion.span>
        </div>

        {loading ? (
          <div className="dash-empty">
            <motion.div
              className="dash-spinner"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
            <span>Chargement...</span>
          </div>
        ) : error ? (
          <div className="dash-empty">
            <span>{error}</span>
          </div>
        ) : eleves.length === 0 ? (
          <div className="dash-empty">
            <span>Aucun élève inscrit</span>
          </div>
        ) : (
          <table className="eleves-table">
            <thead>
              <tr>
                <th>Élève</th>
                <th>Matricule</th>
                <th>Classe</th>
                <th>Date de naissance</th>
                <th>Lieu de naissance</th>
                <th>Sexe</th>
                <th>Statut</th>
              </tr>
            </thead>
            <motion.tbody variants={container} initial="hidden" animate="visible">
              {eleves.map((eleve) => {
                const statut = statutColors[eleve.statutInscription] || statutColors.EN_ATTENTE;
                return (
                  <motion.tr key={eleve.id} variants={row} whileHover={{ backgroundColor: "#f8fafc" }}>
                    <td>
                      <div className="eleve-cell-name">
                        <span className="eleve-avatar">
                          {eleve.utilisateur?.prenom?.[0]}
                          {eleve.utilisateur?.nom?.[0]}
                        </span>
                        <div>
                          <div className="eleve-nom">
                            {eleve.utilisateur?.prenom} {eleve.utilisateur?.nom}
                          </div>
                          <div className="eleve-email">{eleve.utilisateur?.email}</div>
                        </div>
                      </div>
                    </td>
                    <td>{eleve.matricule}</td>
                    <td>{eleve.classe?.nom ?? "—"}</td>
                    <td>{formatDate(eleve.dateNaissance)}</td>
                    <td>{eleve.lieuNaissance}</td>
                    <td>{eleve.sexe === "M" ? "Masculin" : "Féminin"}</td>
                    <td>
                      <span
                        className="eleve-statut-badge"
                        style={{ color: statut.color, backgroundColor: statut.bg }}
                      >
                        {eleve.statutInscription}
                      </span>
                    </td>
                  </motion.tr>
                );
              })}
            </motion.tbody>
          </table>
        )}
      </motion.div>
    </motion.div>
  );
}

export default ListeEleves;