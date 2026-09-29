import { useEffect, useState } from "react";
import { getClubsEvenementByUtilisateur } from "../../services/ClubEvenementService"; 
import { User } from "../../types/auth";

interface Club {
  id: string;
  nom: string;
  description?: string;
  responsableId: string;
  membres: { role: string }[];
}

export default function MesClubs({ user }: { user: User }) {
  const [clubs, setClubs] = useState<Club[]>([]);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState<string | null>(null);

  useEffect(() => {
    const chargerClubs = async () => {
      try {
        // Utilisation de votre fonction personnalisée
        const donnees = await getClubsEvenementByUtilisateur(user.id, "CLUB");
        setClubs(donnees);
      } catch (err) {
        setErreur("Impossible de charger vos clubs.");
      } finally {
        setChargement(false);
      }
    };

    chargerClubs();
  }, [user.id]);

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Mes Clubs</h1>

      {erreur && (
        <div className="p-3 mb-4 text-red-600 bg-red-50 rounded border border-red-200">
          {erreur}
        </div>
      )}

      {chargement ? (
        <p className="text-gray-500 text-center py-4">Chargement de vos clubs...</p>
      ) : clubs.length === 0 ? (
        <div className="bg-gray-50 border rounded-lg p-8 text-center">
          <p className="text-gray-500">Vous ne faites partie d'aucun club pour le moment.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {clubs.map((club) => {
            // Déterminer le badge de rôle
            const estResponsable = club.responsableId === user.id;
            const roleMembre = club.membres[0]?.role || "MEMBRE";

            return (
              <div
                key={club.id}
                className="p-4 border rounded-lg shadow-sm hover:shadow-md transition bg-white flex justify-between items-center"
              >
                <div>
                  <h2 className="text-lg font-semibold text-gray-800">{club.nom}</h2>
                  {club.description && (
                    <p className="text-gray-600 text-sm mt-1">{club.description}</p>
                  )}
                </div>

                {estResponsable ? (
                  <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                    Responsable
                  </span>
                ) : (
                  <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                    {roleMembre === "BUREAU" ? "Bureau" : "Membre"}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}