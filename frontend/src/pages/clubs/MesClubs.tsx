import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getClubsEvenementByUtilisateur } from "../../services/ClubEvenementService";
import { get, post, del } from "../../services/api";
import { User } from "../../types/auth";
import "./MesClubs.css";

interface Club {
  id: string;
  nom: string;
  description?: string;
  responsableId: string;
  statut: string;
  membres: { id: string; role: string; utilisateurId: string }[];
}

/** Renvoie les initiales d'un nom de club (max 2 lettres). */
function getInitiales(nom: string): string {
  return nom
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((m) => m[0]?.toUpperCase() ?? "")
    .join("");
}

export default function MesClubs({ user }: { user: User }) {
  const [myClubs, setMyClubs] = useState<Club[]>([]);
  const [availableClubs, setAvailableClubs] = useState<Club[]>([]);
  const [chargement, setChargement] = useState(true);
  const [actionEnCours, setActionEnCours] = useState<string | null>(null);
  const [erreur, setErreur] = useState<string | null>(null);
  const [succes, setSucces] = useState<string | null>(null);

  const chargerDonnees = async () => {
    setChargement(true);
    setErreur(null);
    try {
      const mesClubsDonnees: Club[] = await getClubsEvenementByUtilisateur(user.id, "CLUB");
      setMyClubs(mesClubsDonnees);

      const tousLesClubs: Club[] = await get("/club-evenement?type=CLUB");
      const mesClubsIds = new Set(mesClubsDonnees.map((c) => c.id));
      const dispo = tousLesClubs.filter(
        (club) =>
          club.statut === "VALIDE" &&
          club.responsableId !== user.id &&
          !mesClubsIds.has(club.id)
      );
      setAvailableClubs(dispo);
    } catch {
      setErreur("Impossible de charger les clubs.");
    } finally {
      setChargement(false);
    }
  };

  useEffect(() => {
    chargerDonnees();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user.id]);

  const rejoindre = async (clubId: string) => {
    setActionEnCours(clubId);
    setErreur(null);
    setSucces(null);
    try {
      await post("/club-evenement-membre", {
        clubEvenementId: clubId,
        utilisateurId: user.id,
        role: "MEMBRE",
        dateAdhesion: new Date().toISOString(),
      });
      setSucces("Vous avez rejoint le club !");
      await chargerDonnees();
    } catch {
      setErreur("Impossible de rejoindre ce club.");
    } finally {
      setActionEnCours(null);
    }
  };

  const quitterClub = async (club: Club) => {
    setErreur(null);
    setSucces(null);

    if (club.responsableId === user.id) {
      alert(
        "❌ Action impossible : Vous êtes le responsable de ce club. Vous devez nommer un nouveau responsable (depuis l'Espace Bureau) avant de pouvoir quitter le club."
      );
      return;
    }

    const membreId = club.membres[0]?.id;
    if (!membreId) return;

    if (window.confirm(`Êtes-vous sûr de vouloir quitter le club "${club.nom}" ?`)) {
      setActionEnCours(club.id);
      try {
        await del(`/club-evenement-membre/${membreId}`);
        setSucces(`Vous avez quitté le club "${club.nom}".`);
        await chargerDonnees();
      } catch {
        setErreur("Impossible de quitter le club.");
      } finally {
        setActionEnCours(null);
      }
    }
  };

  return (
    <div className="mc-page">
      {/* ---------- Header ---------- */}
      <header className="mc-header">
        <h1 className="mc-title">Mes clubs</h1>
        <p className="mc-subtitle">
          Gérez vos adhésions et découvrez les clubs disponibles.
        </p>
      </header>

      {/* ---------- Alertes ---------- */}
      {erreur && (
        <div className="mc-alert mc-alert--error" role="alert">
          {erreur}
        </div>
      )}
      {succes && (
        <div className="mc-alert mc-alert--success" role="status">
          {succes}
        </div>
      )}

      {/* ---------- SECTION 1 : Mes clubs ---------- */}
      <section className="mc-section">
        <h2 className="mc-section-title">
          Mes clubs
          {!chargement && myClubs.length > 0 && (
            <span className="mc-section-count">{myClubs.length}</span>
          )}
        </h2>

        {chargement ? (
          <div className="mc-loading">
            <span className="mc-spinner" aria-hidden="true" />
            Chargement de vos clubs…
          </div>
        ) : myClubs.length === 0 ? (
          <div className="mc-empty">
            Vous ne faites partie d'aucun club pour le moment.
          </div>
        ) : (
          <div className="mc-grid">
            {myClubs.map((club, index) => {
              const estResponsable = club.responsableId === user.id;
              const roleMembre = club.membres[0]?.role || "MEMBRE";
              const accesBureau = estResponsable || roleMembre === "BUREAU";

              return (
                <article
                  key={club.id}
                  className="mc-card"
                  style={{ animationDelay: `${index * 0.04}s` }}
                >
                  <div className="mc-card-head">
                    <div className="mc-avatar" aria-hidden="true">
                      {getInitiales(club.nom)}
                    </div>
                    <div className="mc-card-head-text">
                      <h3 className="mc-card-name" title={club.nom}>
                        {club.nom}
                      </h3>
                      {estResponsable ? (
                        <span className="mc-badge mc-badge--responsable">
                          Responsable
                        </span>
                      ) : roleMembre === "BUREAU" ? (
                        <span className="mc-badge mc-badge--bureau">Bureau</span>
                      ) : (
                        <span className="mc-badge mc-badge--membre">Membre</span>
                      )}
                    </div>
                  </div>

                  {club.description && (
                    <p className="mc-card-desc">{club.description}</p>
                  )}

                  <div className="mc-card-actions">
                    {accesBureau && (
                      <Link
                        to={`/club/bureau/${club.id}`}
                        className="mc-btn mc-btn--bureau"
                      >
                        Espace Bureau
                      </Link>
                    )}
                    <button
                      type="button"
                      onClick={() => quitterClub(club)}
                      disabled={actionEnCours !== null}
                      className="mc-btn mc-btn--danger"
                    >
                      Quitter
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      {/* ---------- SECTION 2 : Clubs à rejoindre ---------- */}
      <section className="mc-section">
        <h2 className="mc-section-title">
          Clubs à rejoindre
          {!chargement && availableClubs.length > 0 && (
            <span className="mc-section-count">{availableClubs.length}</span>
          )}
        </h2>

        {chargement ? (
          <div className="mc-loading">
            <span className="mc-spinner" aria-hidden="true" />
            Recherche des clubs disponibles…
          </div>
        ) : availableClubs.length === 0 ? (
          <div className="mc-empty">
            Aucun autre club n'est disponible pour le moment.
          </div>
        ) : (
          <div className="mc-grid">
            {availableClubs.map((club, index) => (
              <article
                key={club.id}
                className="mc-card mc-card--joinable"
                style={{ animationDelay: `${index * 0.04}s` }}
              >
                <div className="mc-card-head">
                  <div className="mc-avatar" aria-hidden="true">
                    {getInitiales(club.nom)}
                  </div>
                  <div className="mc-card-head-text">
                    <h3 className="mc-card-name" title={club.nom}>
                      {club.nom}
                    </h3>
                  </div>
                </div>

                {club.description && (
                  <p className="mc-card-desc">{club.description}</p>
                )}

                <div className="mc-card-actions">
                  <button
                    type="button"
                    onClick={() => rejoindre(club.id)}
                    disabled={actionEnCours !== null}
                    className="mc-btn mc-btn--primary"
                  >
                    {actionEnCours === club.id ? "Adhésion…" : "Rejoindre"}
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}