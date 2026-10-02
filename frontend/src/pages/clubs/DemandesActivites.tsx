import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { get, post } from "../../services/api";
import "./DemandesActivites.css";

type Activite = {
  id: string;
  titre: string;
  description?: string;
  dateActivite: string;
  lieu?: string;
};

const FORM_VIDE = { titre: "", description: "", dateActivite: "", lieu: "" };

export default function DemandesActivites() {
  const { id } = useParams<{ id: string }>(); // id du club
  const [activites, setActivites] = useState<Activite[]>([]);
  const [formOuvert, setFormOuvert] = useState(false);
  const [form, setForm] = useState(FORM_VIDE);
  const [envoi, setEnvoi] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    get<Activite[]>(`/activite?clubEvenementId=${id}`)
      .then(setActivites)
      .catch(() => setError("Impossible de charger les activités."));
  }, [id]);

  const changer = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const creer = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setEnvoi(true);
    try {
      const nouvelle = await post<unknown, Activite>("/activite", {
        clubEvenementId: id,
        titre: form.titre.trim(),
        description: form.description.trim() || undefined,
        dateActivite: new Date(form.dateActivite).toISOString(),
        lieu: form.lieu.trim() || undefined,
      });
      setActivites((a) => [...a, nouvelle]);
      setForm(FORM_VIDE);
      setFormOuvert(false);
    } catch {
      setError("Impossible de créer l'activité.");
    } finally {
      setEnvoi(false);
    }
  };

  return (
    <div className="da-page">
      {/* ---------- Lien retour ---------- */}
      <Link to={`/club/bureau/${id}`} className="da-back">
        ← Retour à l'Espace Bureau
      </Link>

      {/* ---------- En-tête ---------- */}
      <header className="da-header">
        <div>
          <h1 className="da-title">Activités du club</h1>
          <p className="da-subtitle">
            {activites.length > 0
              ? `${activites.length} activité${activites.length > 1 ? "s" : ""} programmée${activites.length > 1 ? "s" : ""}`
              : "Aucune activité programmée"}
          </p>
        </div>

        <button
          type="button"
          onClick={() => setFormOuvert((o) => !o)}
          className="da-btn da-btn--primary"
        >
          {formOuvert ? "Annuler" : "+ Créer une activité"}
        </button>
      </header>

      {/* ---------- Alerte erreur ---------- */}
      {error && (
        <div className="da-alert da-alert--error" role="alert">
          {error}
        </div>
      )}

      {/* ---------- Formulaire ---------- */}
      {formOuvert && (
        <form onSubmit={creer} className="da-form">
          <h2 className="da-form-title">Nouvelle activité</h2>

          <div className="da-field">
            <label className="da-label" htmlFor="da-titre">
              Titre *
            </label>
            <input
              id="da-titre"
              name="titre"
              value={form.titre}
              onChange={changer}
              placeholder="Ex. Réunion hebdomadaire"
              maxLength={255}
              required
              className="da-input"
            />
          </div>

          <div className="da-field">
            <label className="da-label" htmlFor="da-description">
              Description
            </label>
            <textarea
              id="da-description"
              name="description"
              value={form.description}
              onChange={changer}
              placeholder="Détails de l'activité (optionnel)"
              rows={3}
              className="da-textarea"
            />
          </div>

          <div className="da-field">
            <label className="da-label" htmlFor="da-date">
              Date et heure *
            </label>
            <input
              id="da-date"
              type="datetime-local"
              name="dateActivite"
              value={form.dateActivite}
              onChange={changer}
              required
              className="da-input"
            />
          </div>

          <div className="da-field">
            <label className="da-label" htmlFor="da-lieu">
              Lieu
            </label>
            <input
              id="da-lieu"
              name="lieu"
              value={form.lieu}
              onChange={changer}
              placeholder="Ex. Salle B12"
              maxLength={255}
              className="da-input"
            />
          </div>

          <div className="da-form-actions">
            <button
              type="submit"
              disabled={envoi}
              className="da-btn da-btn--success"
            >
              {envoi ? "Création…" : "Créer l'activité"}
            </button>
          </div>
        </form>
      )}

      {/* ---------- Liste des activités ---------- */}
      {activites.length === 0 ? (
        <div className="da-empty">
          Aucune activité pour ce club. Créez-en une pour commencer.
        </div>
      ) : (
        <ul className="da-list">
          {activites.map((a, index) => (
            <li
              key={a.id}
              className="da-card"
              style={{ animationDelay: `${index * 0.04}s` }}
            >
              <h3 className="da-card-title">{a.titre}</h3>

              {a.description && (
                <p className="da-card-desc">{a.description}</p>
              )}

              <div className="da-card-meta">
                <span className="da-meta-pill da-meta-pill--date">
                  🗓 {new Date(a.dateActivite).toLocaleString("fr-FR", {
                    dateStyle: "long",
                    timeStyle: "short",
                  })}
                </span>

                {a.lieu && (
                  <span className="da-meta-pill">📍 {a.lieu}</span>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}