import { useEffect, useState } from "react";
import { Link } from "react-router-dom"; 
import { getClubsEvenementByUtilisateur } from "../../services/ClubEvenementService"; 
import { get, post, del } from "../../services/api"; // Import de 'del' pour supprimer l'adhésion
import { User } from "../../types/auth";

interface Club {
  id: string;
  nom: string;
  description?: string;
  responsableId: string;
  statut: string;
  membres: { id: string; role: string; utilisateurId: string }[]; // Ajout de l'ID d'adhésion
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
    } catch (err) {
      setErreur("Impossible de charger les clubs.");
    } finally {
      setChargement(false);
    }
  };

  useEffect(() => {
    chargerDonnees();
  }, [user.id]);

  const rejoindre = async (clubId: string) => {
    setActionEnCours(clubId);
    setErreur(null);
    setSucces(null);
    try {
      await post('/club-evenement-membre', {
        clubEvenementId: clubId,
        utilisateurId: user.id,
        role: "MEMBRE",
        dateAdhesion: new Date().toISOString()
      });
      setSucces("Vous avez rejoint le club !");
      await chargerDonnees();
    } catch {
      setErreur("Impossible de rejoindre ce club.");
    } finally {
      setActionEnCours(null);
    }
  };

  // Fonction pour QUITTER le club
  const quitterClub = async (club: Club) => {
    setErreur(null);
    setSucces(null);

    // SECURITÉ : Si l'utilisateur est le responsable principal
    if (club.responsableId === user.id) {
      alert("❌ Action impossible : Vous êtes le responsable de ce club. Vous devez nommer un nouveau responsable (depuis l'Espace Bureau) avant de pouvoir quitter le club.");
      return;
    }

    const membreId = club.membres[0]?.id; // Récupère l'ID d'adhésion
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
    <div className="p-6 max-w-3xl mx-auto space-y-8">
      
      {/* Messages d'alerte */}
      {erreur && <div className="p-3 text-red-600 bg-red-50 rounded border border-red-200 text-sm">{erreur}</div>}
      {succes && <div className="p-3 text-green-600 bg-green-50 rounded border border-green-200 text-sm">{succes}</div>}

      {/* SECTION 1 : MES CLUBS */}
      <div>
        <h1 className="text-2xl font-bold mb-4">Mes Clubs</h1>
        {chargement ? (
          <p className="text-gray-500 text-sm">Chargement...</p>
        ) : myClubs.length === 0 ? (
          <div className="bg-gray-50 border border-dashed rounded-lg p-6 text-center">
            <p className="text-gray-500 text-sm">Vous ne faites partie d'aucun club pour le moment.</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {myClubs.map((club) => {
              const estResponsable = club.responsableId === user.id;
              const roleMembre = club.membres[0]?.role || "MEMBRE";
              const accesBureau = estResponsable || roleMembre === "BUREAU";

              return (
                <div
                  key={club.id}
                  className="p-4 border rounded-lg bg-white flex justify-between items-center shadow-sm"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="font-semibold text-gray-800 text-lg">{club.nom}</h2>
                      
                      {estResponsable ? (
                        <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-blue-100 text-blue-800 uppercase">
                          Responsable
                        </span>
                      ) : (
                        <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full uppercase ${
                          roleMembre === "BUREAU" ? "bg-purple-100 text-purple-800" : "bg-green-100 text-green-800"
                        }`}>
                          {roleMembre === "BUREAU" ? "Bureau" : "Membre"}
                        </span>
                      )}
                    </div>
                    {club.description && (
                      <p className="text-gray-500 text-xs mt-1">{club.description}</p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    {accesBureau && (
                      <Link
                        to={`/club/bureau/${club.id}`}
                        className="px-3 py-2 text-xs font-semibold text-white bg-purple-600 rounded-md hover:bg-purple-700 transition"
                      >
                        Espace Bureau
                      </Link>
                    )}
                    
                    <button
                      onClick={() => quitterClub(club)}
                      disabled={actionEnCours !== null}
                      className="px-3 py-2 text-xs font-semibold text-red-600 bg-red-50 rounded-md hover:bg-red-100 transition disabled:opacity-50"
                    >
                      Quitter
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* SECTION 2 : CLUBS À REJOINDRE */}
      <div className="border-t pt-6">
        <h2 className="text-xl font-bold mb-4 text-gray-800">Clubs à rejoindre</h2>
        
        {chargement ? (
          <p className="text-gray-500 text-sm">Recherche...</p>
        ) : availableClubs.length === 0 ? (
          <p className="text-gray-500 text-sm bg-gray-50 p-4 rounded-lg text-center border">
            Aucun autre club n'est disponible pour le moment.
          </p>
        ) : (
          <div className="grid gap-3">
            {availableClubs.map((club) => (
              <div
                key={club.id}
                className="p-4 border rounded-lg bg-white flex justify-between items-center shadow-sm hover:border-blue-300 transition"
              >
                <div className="flex-1 pr-4">
                  <h3 className="font-semibold text-gray-800">{club.nom}</h3>
                  {club.description && (
                    <p className="text-gray-500 text-xs mt-0.5 line-clamp-2">{club.description}</p>
                  )}
                </div>

                <button
                  onClick={() => rejoindre(club.id)}
                  disabled={actionEnCours !== null}
                  className="px-4 py-1.5 text-xs font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition"
                >
                  {actionEnCours === club.id ? "Adhésion..." : "Rejoindre"}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}