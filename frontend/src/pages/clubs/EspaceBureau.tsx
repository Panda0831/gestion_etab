import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { get, patch, del } from "../../services/api";
import "./EspaceBureau.css";

interface Membre {
  id: string;
  role: "MEMBRE" | "BUREAU";
  dateAdhesion: string;
  utilisateur: {
    id: string;
    nom: string;
    prenom: string;
  };
}

interface ClubDetails {
  id: string;
  nom: string;
  description?: string;
  responsableId: string;
  responsable: {
    id: string;
    nom: string;
    prenom: string;
  };
  membres: Membre[];
}

/** Initiales à partir d'un prénom + nom (max 2 lettres). */
function getInitiales(prenom: string, nom: string): string {
  const p = prenom?.trim()?.[0] ?? "";
  const n = nom?.trim()?.[0] ?? "";
  return (p + n).toUpperCase() || "?";
}

export default function EspaceBureau() {
  const { id } = useParams<{ id: string }>();
  const [club, setClub] = useState<ClubDetails | null>(null);
  const [chargement, setChargement] = useState(true);
  const [actionId, setActionId] = useState<string | null>(null);
  const [erreur, setErreur] = useState<string | null>(null);

  useEffect(() => {
    const chargerClub = async () => {
      try {
        const donnees = await get(`/club-evenement/${id}`);
        setClub(donnees);
      } catch {
        setErreur("Impossible de charger les informations du club.");
      } finally {
        setChargement(false);
      }
    };
    chargerClub();
  }, [id]);

  const basculerRole = async (
    membreId: string,
    roleActuel: "MEMBRE" | "BUREAU"
  ) => {
    setActionId(membreId);
    setErreur(null);
    const nouveauRole = roleActuel === "MEMBRE" ? "BUREAU" : "MEMBRE";

    try {
      await patch(`/club-evenement-membre/${membreId}`, { role: nouveauRole });
      setClub((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          membres: prev.membres.map((m) =>
            m.id === membreId ? { ...m, role: nouveauRole } : m
          ),
        };
      });
    } catch {
      setErreur("Erreur lors de la modification du rôle.");
    } finally {
      setActionId(null);
    }
  };

  const renvoyerMembre = async (membreId: string, nomMembre: string) => {
    if (
      window.confirm(
        `⚠️ Êtes-vous sûr de vouloir exclure définitivement "${nomMembre}" de ce club ?`
      )
    ) {
      setActionId(membreId);
      setErreur(null);
      try {
        await del(`/club-evenement-membre/${membreId}`);
        setClub((prev) => {
          if (!prev) return null;
          return {
            ...prev,
            membres: prev.membres.filter((m) => m.id !== membreId),
          };
        });
      } catch {
        setErreur("Impossible d'exclure ce membre.");
      } finally {
        setActionId(null);
      }
    }
  };

  /* ---------- Chargement ---------- */
  if (chargement) {
    return (
      <div className="eb-page">
        <div className="eb-loading">
          <span className="eb-spinner" aria-hidden="true" />
          Chargement de l'Espace Bureau…
        </div>
      </div>
    );
  }

  /* ---------- Erreur / club introuvable ---------- */
  if (!club) {
    return (
      <div className="eb-page">
        <div className="eb-alert eb-alert--error" role="alert">
          Club introuvable ou accès refusé.
        </div>
        <Link to="/club" className="eb-back">
          ← Retour à mes clubs
        </Link>
      </div>
    );
  }

  /* ---------- Rendu principal ---------- */
  return (
    <div className="eb-page">
      {/* ---------- En-tête (unique, plus de doublon) ---------- */}
      <header className="eb-header">
        <div className="eb-header-left">
          <Link to="/club" className="eb-back">
            ← Retour à mes clubs
          </Link>
          <h1 className="eb-title">
            Espace Bureau · <span className="eb-title-club">{club.nom}</span>
          </h1>
          <p className="eb-subtitle">
            Créateur &amp; Responsable :{" "}
            <strong>
              {club.responsable.prenom} {club.responsable.nom}
            </strong>
          </p>
        </div>

        <Link
          to={`/club/${club.id}/activites`}
          className="eb-btn eb-btn--primary"
        >
          Gérer les activités
        </Link>
      </header>

      {/* ---------- Alerte erreur ---------- */}
      {erreur && (
        <div className="eb-alert eb-alert--error" role="alert">
          {erreur}
        </div>
      )}

      {/* ---------- Tableau des membres ---------- */}
      <section className="eb-card">
        <div className="eb-card-header">
          <h2 className="eb-card-title">
            Membres du club
            <span className="eb-card-count">{club.membres.length}</span>
          </h2>
        </div>

        {club.membres.length === 0 ? (
          <p className="eb-empty">
            Aucun membre n'a encore rejoint ce club.
          </p>
        ) : (
          <div className="eb-table-wrapper">
            <table className="eb-table">
              <thead>
                <tr>
                  <th>Membre</th>
                  <th>Date d'adhésion</th>
                  <th className="eb-th-center">Rôle actuel</th>
                  <th className="eb-th-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {club.membres.map((membre) => {
                  const estResponsableLegal =
                    membre.utilisateur.id === club.responsableId;
                  const nomComplet = `${membre.utilisateur.prenom} ${membre.utilisateur.nom}`;
                  const initiales = getInitiales(
                    membre.utilisateur.prenom,
                    membre.utilisateur.nom
                  );

                  return (
                    <tr key={membre.id}>
                      {/* Membre */}
                      <td>
                        <div className="eb-membre-cell">
                          <div className="eb-avatar" aria-hidden="true">
                            {initiales}
                          </div>
                          <div className="eb-membre-info">
                            <span className="eb-membre-nom">{nomComplet}</span>
                            {estResponsableLegal && (
                              <span className="eb-membre-tag">
                                Fondateur principal
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Date d'adhésion */}
                      <td>
                        <span className="eb-date">
                          {new Date(membre.dateAdhesion).toLocaleDateString(
                            "fr-FR"
                          )}
                        </span>
                      </td>

                      {/* Badge rôle */}
                      <td style={{ textAlign: "center" }}>
                        {estResponsableLegal ? (
                          <span className="eb-badge eb-badge--createur">
                            Créateur
                          </span>
                        ) : membre.role === "BUREAU" ? (
                          <span className="eb-badge eb-badge--bureau">
                            Bureau
                          </span>
                        ) : (
                          <span className="eb-badge eb-badge--membre">
                            Membre
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td>
                        {estResponsableLegal ? (
                          <div className="eb-actions">
                            <span className="eb-locked">
                              Rôle verrouillé (créateur)
                            </span>
                          </div>
                        ) : (
                          <div className="eb-actions">
                            <button
                              type="button"
                              onClick={() =>
                                basculerRole(membre.id, membre.role)
                              }
                              disabled={actionId !== null}
                              className={`eb-btn ${
                                membre.role === "BUREAU"
                                  ? "eb-btn--ghost"
                                  : "eb-btn--bureau"
                              }`}
                            >
                              {actionId === membre.id
                                ? "Mise à jour…"
                                : membre.role === "BUREAU"
                                ? "Rétrograder"
                                : "Nommer au Bureau"}
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                renvoyerMembre(membre.id, nomComplet)
                              }
                              disabled={actionId !== null}
                              className="eb-btn eb-btn--danger"
                            >
                              Renvoyer
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}