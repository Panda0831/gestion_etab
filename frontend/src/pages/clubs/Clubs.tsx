import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { post } from "../../services/api";
import { User } from "../../types/auth";
import DemandesClubs from "./DemandesClubs";

const vide = { nom: "", description: "" };

// 1. Accepter 'User | null'
export default function Clubs({ user }: { user: User | null }) {
  const [ouvert, setOuvert] = useState(false);
  const [form, setForm] = useState(vide);
  const [envoi, setEnvoi] = useState(false);
  const [message, setMessage] = useState<{ ok: boolean; texte: string } | null>(null);

  // 2. Sécurité : si l'utilisateur est null, on affiche un message ou un loader
  if (!user) {
    return (
      <div className="p-6 max-w-xl mx-auto text-center text-gray-500">
        Connexion requise pour accéder à cette page.
      </div>
    );
  }

  // 3. Ici, user est garanti d'être non-null
  if (user.role === "SECRETAIRE") return <DemandesClubs />;

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

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Clubs</h1>

      <button
        type="button"
        onClick={() => setOuvert(!ouvert)}
        className="px-4 py-2 rounded bg-blue-600 text-white"
      >
        {ouvert ? "Annuler" : "Demande de création de club"}
      </button>

      {message && (
        <p className={`mt-3 ${message.ok ? "text-green-600" : "text-red-600"}`}>
          {message.texte}
        </p>
      )}

      <AnimatePresence>
        {ouvert && (
          <motion.form
            onSubmit={soumettre}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 flex flex-col gap-3 overflow-hidden"
          >
            <input
              required
              placeholder="Nom du club"
              value={form.nom}
              onChange={(e) => setForm({ ...form, nom: e.target.value })}
              className="border rounded p-2"
            />
            <textarea
              placeholder="Description"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="border rounded p-2"
            />
            <button
              type="submit"
              disabled={envoi}
              className="px-4 py-2 rounded bg-green-600 text-white disabled:opacity-50"
            >
              {envoi ? "Envoi..." : "Envoyer la demande"}
            </button>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}