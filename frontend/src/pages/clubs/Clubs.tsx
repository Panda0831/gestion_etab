import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { post } from "../../services/api";
import { User } from "../../types/auth";
import DemandesClubs from "./DemandesClubs";
import MesClubs from "./MesClubs";
import "./Clubs.css";

const vide = { nom: "", description: "" };

export default function Clubs({ user }: { user: User | null }) {
  const [ouvert, setOuvert] = useState(false);
  const [form, setForm] = useState(vide);
  const [envoi, setEnvoi] = useState(false);
  const [message, setMessage] = useState<{
    ok: boolean;
    texte: string;
  } | null>(null);

  /* ---------- 1. Utilisateur non connecté ---------- */
  if (!user) {
    return (
      <div className="clubs-auth-required">
        <div className="clubs-auth-required-icon" aria-hidden="true">
          🔒
        </div>
        <p className="clubs-auth-required-title">Connexion requise</p>
        <p>Connectez-vous pour accéder à la gestion des clubs.</p>
      </div>
    );
  }

  /* ---------- Soumission du formulaire ---------- */
  const soumettre = async (e: React.FormEvent) => {
    e.preventDefault();
    setEnvoi(true);
    setMessage(null);
    try {
      await post("/club-evenement", {
        nom: form.nom.trim(),
        description: form.description.trim() || undefined,
        responsableId: user.id,
      });
      setMessage({ ok: true, texte: "Demande envoyée." });
      setForm(vide);
      setOuvert(false);
    } catch {
      setMessage({ ok: false, texte: "Échec de l'envoi de la demande." });
    } finally {
      setEnvoi(false);
    }
  };

  /* ---------- 2. Secrétaire → délègue à DemandesClubs ---------- */
  if (user.role === "SECRETAIRE") {
    return <DemandesClubs />;
  }

  /* ---------- 3. Utilisateur standard → header + form + MesClubs ---------- */
  return (
    <div className="clubs-page">
      {/* En-tête */}
      <header className="clubs-header">
        <div>
          <h1 className="clubs-title">Clubs</h1>
          <p className="clubs-subtitle">
            Rejoignez un club existant ou proposez-en un nouveau.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setOuvert(!ouvert)}
          className="clubs-btn clubs-btn--primary"
        >
          {ouvert ? "Annuler" : "Demander la création d'un club"}
        </button>
      </header>

      {/* Message succès / erreur */}
      {message && (
        <div
          className={`clubs-alert ${
            message.ok ? "clubs-alert--success" : "clubs-alert--error"
          }`}
          role={message.ok ? "status" : "alert"}
        >
          {message.texte}
        </div>
      )}

      {/* Formulaire animé */}
      <AnimatePresence initial={false}>
        {ouvert && (
          <motion.form
            key="clubs-form"
            onSubmit={soumettre}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="clubs-form"
          >
            <h2 className="clubs-form-title">
              Nouvelle demande de création
            </h2>

            <div className="clubs-field">
              <label className="clubs-label" htmlFor="clubs-nom">
                Nom du club *
              </label>
              <input
                id="clubs-nom"
                required
                placeholder="Ex. Club de robotique"
                value={form.nom}
                onChange={(e) =>
                  setForm({ ...form, nom: e.target.value })
                }
                className="clubs-input"
                maxLength={255}
              />
            </div>

            <div className="clubs-field">
              <label className="clubs-label" htmlFor="clubs-description">
                Description
              </label>
              <textarea
                id="clubs-description"
                placeholder="Décrivez brièvement l'objet du club…"
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                className="clubs-textarea"
                rows={3}
              />
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <button
                type="submit"
                disabled={envoi}
                className="clubs-btn clubs-btn--success"
              >
                {envoi ? "Envoi…" : "Envoyer la demande"}
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {/* Zone MesClubs embarquée */}
      <div className="clubs-embedded">
        <MesClubs user={user} />
      </div>
    </div>
  );
}