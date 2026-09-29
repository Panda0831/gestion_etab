import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { post } from "../../services/api";
import { User } from "../../types/auth";
import DemandesClubs from "./DemandesClubs";
import MesClubs from "./MesClubs";

const vide = { nom: "", description: "" };

export default function Clubs({ user }: { user: User | null }) {
  const [ouvert, setOuvert] = useState(false);
  const [form, setForm] = useState(vide);
  const [envoi, setEnvoi] = useState(false);
  const [message, setMessage] = useState<{ ok: boolean; texte: string } | null>(null);

  // 1. Sécurité : si l'utilisateur n'est pas connecté ou en cours de chargement
  if (!user) {
    return (
      <div className="p-6 max-w-xl mx-auto text-center text-gray-500">
        Connexion requise pour accéder à cette page.
      </div>
    );
  }

  // Soumission de la demande de création de club (pour les non-secrétaires)
  const soumettre = async (e: React.FormEvent) => {
    e.preventDefault();
    setEnvoi(true);
    setMessage(null);
    try {
      await post("/club-evenement", {
        nom: form.nom,
        description: form.description || undefined,
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

  // 2. Si l'utilisateur est SECRETAIRE -> Affiche la gestion des demandes
  if (user.role === "SECRETAIRE") {
    return <DemandesClubs />;
  } 
  // 3. SINON (Élève, Étudiant, etc.) -> Affiche MesClubs + Option de création
  else {
    return (
      <div className="p-6 max-w-4xl mx-auto space-y-6">
        {/* En-tête avec bouton de demande */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Clubs</h1>

          <button
            type="button"
            onClick={() => setOuvert(!ouvert)}
            className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
          >
            {ouvert ? "Annuler" : "Demander la création d'un club"}
          </button>
        </div>

        {/* Message de confirmation ou d'erreur */}
        {message && (
          <div
            className={`p-3 rounded-md ${
              message.ok
                ? "bg-green-50 text-green-700 border border-green-200"
                : "bg-red-50 text-red-700 border border-red-200"
            }`}
          >
            {message.texte}
          </div>
        )}

        {/* Formulaire animé de demande de création */}
        <AnimatePresence>
          {ouvert && (
            <motion.form
              onSubmit={soumettre}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="p-4 border rounded-lg bg-gray-50 flex flex-col gap-3 overflow-hidden shadow-sm"
            >
              <h2 className="text-lg font-semibold text-gray-700">
                Nouvelle demande de création
              </h2>
              <input
                required
                placeholder="Nom du club"
                value={form.nom}
                onChange={(e) => setForm({ ...form, nom: e.target.value })}
                className="border rounded p-2 bg-white focus:outline-blue-500"
              />
              <textarea
                placeholder="Description du club..."
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="border rounded p-2 bg-white focus:outline-blue-500"
                rows={3}
              />
              <button
                type="submit"
                disabled={envoi}
                className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700 disabled:opacity-50 transition self-start"
              >
                {envoi ? "Envoi..." : "Envoyer la demande"}
              </button>
            </motion.form>
          )}
        </AnimatePresence>

        {/* Affichage des clubs de l'élève/utilisateur */}
        <div className="pt-4 border-t">
          <MesClubs user={user} />
        </div>
      </div>
    );
  }
}