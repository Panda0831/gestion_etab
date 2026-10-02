import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { get, patch, del } from "../../services/api"; // Import de 'del'


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
      } catch (err) {
        setErreur("Impossible de charger les informations du club.");
      } finally {
        setChargement(false);
      }
    };
    chargerClub();
  }, [id]);

  const basculerRole = async (membreId: string, roleActuel: "MEMBRE" | "BUREAU") => {
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

  // Fonction pour RENVOYER (Exclure) un membre du club
  const renvoyerMembre = async (membreId: string, nomMembre: string) => {
    if (window.confirm(`⚠️ Êtes-vous sûr de vouloir exclure définitivement "${nomMembre}" de ce club ?`)) {
      setActionId(membreId);
      setErreur(null);
      try {
        await del(`/club-evenement-membre/${membreId}`);
        // Mettre à jour l'interface locale en retirant le membre
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

  if (chargement) {
    return <p className="text-center py-10 text-gray-500">Chargement de l'Espace Bureau...</p>;
  }

  if (!club) {
    return <div className="p-6 text-center text-red-600">Club introuvable ou accès refusé.</div>;
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      
      {/* En-tête */}
        <div className="flex justify-between items-center border-b pb-4">
        <div>
            <Link to="/club" className="text-sm text-blue-600 hover:underline">
            &larr; Retour à mes clubs
            </Link>
            <h1 className="text-3xl font-extrabold text-gray-900 mt-2">
            Espace Bureau - {club.nom}
            </h1>
            <p className="text-gray-500 text-sm mt-1">
            Créateur & Responsable :{" "}
            <span className="font-semibold text-blue-600">
                {club.responsable.prenom} {club.responsable.nom}
            </span>
            </p>
        </div>

        <Link
            to={`/club/${club.id}/activites`}
            className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-semibold shadow-sm hover:bg-blue-700 transition"
        >
            Gérer les activités
        </Link>
        </div>
      <div className="flex justify-between items-center border-b pb-4">
        <div>
          <Link to="/club" className="text-sm text-blue-600 hover:underline">
            &larr; Retour à mes clubs
          </Link>
          <h1 className="text-3xl font-extrabold text-gray-900 mt-2">
            Espace Bureau - {club.nom}
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Créateur & Responsable : <span className="font-semibold text-blue-600">{club.responsable.prenom} {club.responsable.nom}</span>
          </p>
        </div>
      </div>

      {erreur && <div className="p-3 text-red-600 bg-red-50 rounded border border-red-200 text-sm">{erreur}</div>}

      {/* Tableau des membres */}
      <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b bg-gray-50">
          <h2 className="text-lg font-bold text-gray-800">Membres du club</h2>
        </div>

        {club.membres.length === 0 ? (
          <p className="p-8 text-center text-gray-500">Aucun membre n'a encore rejoint ce club.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-semibold">
                <tr>
                  <th className="px-6 py-3 text-left">Nom & Prénom</th>
                  <th className="px-6 py-3 text-left">Date d'adhésion</th>
                  <th className="px-6 py-3 text-center">Rôle Actuel</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {club.membres.map((membre) => {
                  const estResponsableLegal = membre.utilisateur.id === club.responsableId;
                  const nomComplet = `${membre.utilisateur.prenom} ${membre.utilisateur.nom}`;

                  return (
                    <tr key={membre.id} className="hover:bg-gray-50 transition">
                      
                      {/* Nom & Prénom */}
                      <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                        <div className="flex flex-col">
                          <span>{nomComplet}</span>
                          {estResponsableLegal && (
                            <span className="text-[10px] text-blue-600 font-medium">Fondateur principal</span>
                          )}
                        </div>
                      </td>

                      {/* Date d'adhésion */}
                      <td className="px-6 py-4 text-gray-500">
                        {new Date(membre.dateAdhesion).toLocaleDateString("fr-FR")}
                      </td>

                      {/* Badge Rôle */}
                      <td className="px-6 py-4 text-center whitespace-nowrap">
                        {estResponsableLegal ? (
                          <span className="px-2.5 py-1 text-xs font-bold rounded-full uppercase bg-blue-100 text-blue-800 border border-blue-200">
                            Créateur (Bureau)
                          </span>
                        ) : (
                          <span className={`px-2.5 py-1 text-xs font-bold rounded-full uppercase ${
                            membre.role === "BUREAU" 
                              ? "bg-purple-100 text-purple-800 border border-purple-200" 
                              : "bg-green-100 text-green-800 border border-green-200"
                          }`}>
                            {membre.role === "BUREAU" ? "Bureau" : "Membre"}
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 text-right whitespace-nowrap">
                        {estResponsableLegal ? (
                          <span className="text-xs text-gray-400 italic font-medium mr-2">
                            Rôle Verrouillé (Créateur)
                          </span>
                        ) : (
                          <div className="flex items-center justify-end gap-2">
                            {/* Nommer/Rétrograder */}
                            <button
                              onClick={() => basculerRole(membre.id, membre.role)}
                              disabled={actionId !== null}
                              className={`px-3 py-1.5 rounded text-xs font-semibold shadow-sm transition disabled:opacity-50 ${
                                membre.role === "BUREAU"
                                  ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                  : "bg-purple-600 text-white hover:bg-purple-700"
                              }`}
                            >
                              {actionId === membre.id 
                                ? "Mise à jour..." 
                                : membre.role === "BUREAU" 
                                  ? "Rétrograder" 
                                  : "Nommer au Bureau"
                              }
                            </button>

                            {/* EXCLURE (Renvoyer) */}
                            <button
                              onClick={() => renvoyerMembre(membre.id, nomComplet)}
                              disabled={actionId !== null}
                              className="px-3 py-1.5 rounded text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 transition disabled:opacity-50"
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
      </div>

    </div>
  );
}