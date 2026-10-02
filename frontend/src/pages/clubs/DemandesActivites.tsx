import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { get, post } from "../../services/api";

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

  const input =
    "w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500";

  return (
    <div className="p-6 max-w-2xl mx-auto">
        <Link to={`/club/${id}/bureau`} className="text-sm text-blue-600 hover:underline">
            &larr; Retour à l'Espace Bureau
        </Link>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Activités du club</h1>
        <button
          onClick={() => setFormOuvert((o) => !o)}
          className="px-3 py-1.5 rounded bg-blue-600 text-white text-sm"
        >
          {formOuvert ? "Annuler" : "+ Créer une activité"}
        </button>
      </div>

      {error && <p className="text-red-600 mb-3">{error}</p>}

      {formOuvert && (
        <form onSubmit={creer} className="border rounded p-4 mb-4 flex flex-col gap-3">
          <input name="titre" value={form.titre} onChange={changer}
            placeholder="Titre *" maxLength={255} required className={input} />
          <textarea name="description" value={form.description} onChange={changer}
            placeholder="Description" rows={3} className={input} />
          <input type="datetime-local" name="dateActivite" value={form.dateActivite}
            onChange={changer} required className={input} />
          <input name="lieu" value={form.lieu} onChange={changer}
            placeholder="Lieu" maxLength={255} className={input} />
          <button type="submit" disabled={envoi}
            className="self-end px-3 py-1.5 rounded bg-green-600 text-white text-sm disabled:opacity-50">
            {envoi ? "Création..." : "Créer l'activité"}
          </button>
        </form>
      )}

      {activites.length === 0 ? (
        <p>Aucune activité pour ce club.</p>
      ) : (
        <ul className="flex flex-col gap-3">
          {activites.map((a) => (
            <li key={a.id} className="border rounded p-4">
              <h3 className="font-semibold">{a.titre}</h3>
              {a.description && <p>{a.description}</p>}
              <p className="text-sm text-gray-600">
                {new Date(a.dateActivite).toLocaleString("fr-FR")}
                {a.lieu && ` · ${a.lieu}`}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}