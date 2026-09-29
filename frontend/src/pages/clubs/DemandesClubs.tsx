import { useEffect, useState } from "react";
import { get, patch } from "../../services/api";

export default function DemandesClubs() {
  const [demandes, setDemandes] = useState<
    { id: string; nom: string; description?: string; responsable?: { nom: string; prenom: string } }[]
  >([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    get<typeof demandes>("/club-evenement/demandes")
      .then(setDemandes)
      .catch(() => setError("Impossible de charger les demandes."));
  }, []);

  const traiter = async (id: string, statut: "VALIDE" | "ANNULE") => {
    setError(null);
    try {
      await patch(`/club-evenement/${id}/statut`, { statut });
      setDemandes((d) => d.filter((x) => x.id !== id));
    } catch {
      setError("Échec de la mise à jour du statut.");
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Demandes de clubs</h1>
      {error && <p className="text-red-600 mb-3">{error}</p>}
      {demandes.length === 0 ? (
        <p>Aucune demande en attente.</p>
      ) : (
        <ul className="flex flex-col gap-3">
          {demandes.map((d) => (
            <li key={d.id} className="border rounded p-4">
              <h3 className="font-semibold">{d.nom}</h3>
              <p>{d.description}</p>
              <p className="text-sm text-gray-600">
                Responsable : {d.responsable ? `${d.responsable.prenom} ${d.responsable.nom}` : "—"}
              </p>
              <div className="flex gap-2 mt-3">
                <button
                  onClick={() => traiter(d.id, "VALIDE")}
                  className="px-3 py-1 rounded bg-green-600 text-white"
                >
                  Valider
                </button>
                <button
                  onClick={() => traiter(d.id, "ANNULE")}
                  className="px-3 py-1 rounded bg-red-600 text-white"
                >
                  Refuser
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}