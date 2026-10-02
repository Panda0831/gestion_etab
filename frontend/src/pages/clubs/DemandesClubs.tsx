import { useEffect, useState } from "react";
import { get, patch, post } from "../../services/api";
import "./DemandesClubs.css";

type Demandeur = {
  id: string;
  nom: string;
  prenom: string;
};

type Demande = {
  id: string;
  nom: string;
  description?: string;
  responsable?: Demandeur;
};

/** Initiales d'un nom de club (max 2 lettres). */
function getInitiales(nom: string): string {
  return nom
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((m) => m[0]?.toUpperCase() ?? "")
    .join("") || "?";
}

export default function DemandesClubs() {
  const [demandes, setDemandes] = useState<Demande[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [actionId, setActionId] = useState<string | null>(null);

  useEffect(() => {
    get<Demande[]>("/club-evenement/demandes")
      .then(setDemandes)
      .catch(() => setError("Impossible de charger les demandes."));
  }, []);

  const traiter = async (id: string, statut: "VALIDE" | "ANNULE") => {
    setError(null);
    setActionId(id);
    try {
      if (statut === "VALIDE") {
        const demande = demandes.find((d) => d.id === id);

        await post("/club-evenement-membre", {
          clubEvenementId: id,
          utilisateurId: demande?.responsable?.id,
          role: "BUREAU",
          dateAdhesion: new Date().toISOString(),
        });
      }

      await patch(`/club-evenement/${id}/statut`, { statut });
      setDemandes((d) => d.filter((x) => x.id !== id));
    } catch {
      setError("Échec de la mise à jour du statut.");
    } finally {
      setActionId(null);
    }
  };

  return (
    <div className="dc-page">
      {/* ---------- En-tête ---------- */}
      <header className="dc-header">
        <div>
          <h1 className="dc-title">Demandes de clubs</h1>
          <p className="dc-subtitle">
            {demandes.length > 0
              ? `${demandes.length} demande${demandes.length > 1 ? "s" : ""} en attente de validation`
              : "Aucune demande en attente de validation"}
          </p>
        </div>

        {demandes.length > 0 && (
          <span className="dc-count" aria-label={`${demandes.length} demandes`}>
            {demandes.length}
          </span>
        )}
      </header>

      {/* ---------- Alerte erreur ---------- */}
      {error && (
        <div className="dc-alert dc-alert--error" role="alert">
          {error}
        </div>
      )}

      {/* ---------- Liste ou état vide ---------- */}
      {demandes.length === 0 ? (
        <div className="dc-empty">
          Aucune demande en attente. Revenez plus tard.
        </div>
      ) : (
        <ul className="dc-list">
          {demandes.map((d, index) => {
            const nomComplet = d.responsable
              ? `${d.responsable.prenom} ${d.responsable.nom}`
              : "—";

            return (
              <li
                key={d.id}
                className="dc-card"
                style={{ animationDelay: `${index * 0.04}s` }}
              >
                {/* En-tête de carte */}
                <div className="dc-card-head">
                  <div className="dc-avatar" aria-hidden="true">
                    {getInitiales(d.nom)}
                  </div>
                  <div className="dc-card-head-text">
                    <h3 className="dc-card-name" title={d.nom}>
                      {d.nom}
                    </h3>
                    <span className="dc-badge dc-badge--attente">
                      En attente
                    </span>
                  </div>
                </div>

                {/* Description */}
                {d.description && (
                  <p className="dc-card-desc">{d.description}</p>
                )}

                {/* Responsable */}
                <div className="dc-responsable">
                  <span className="dc-responsable-label">Responsable</span>
                  <span className="dc-responsable-nom">{nomComplet}</span>
                </div>

                {/* Actions */}
                <div className="dc-actions">
                  <button
                    type="button"
                    onClick={() => traiter(d.id, "ANNULE")}
                    disabled={actionId !== null}
                    className="dc-btn dc-btn--danger"
                  >
                    Refuser
                  </button>
                  <button
                    type="button"
                    onClick={() => traiter(d.id, "VALIDE")}
                    disabled={actionId !== null}
                    className="dc-btn dc-btn--success"
                  >
                    {actionId === d.id ? "Validation…" : "Valider"}
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}