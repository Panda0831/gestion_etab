// CoursEleves.tsx
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { User } from "../../types/auth";
import { Classe } from "../../types/structure";
import { getEleveByUserId } from "../../services/eleveService";

interface CoursEleveProps {
  user: User;
  onLogout?: () => void;
}

export default function CoursEleve({ user }: CoursEleveProps) {
  const [classe, setClasse] = useState<Classe | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    getEleveByUserId(user.id)
      .then((eleve) => !cancelled && setClasse(eleve.classe ?? null))
      .catch(() => !cancelled && setError("Impossible de charger votre classe."))
      .finally(() => !cancelled && setLoading(false));

    return () => {
      cancelled = true;
    };
  }, [user.id]);

  if (loading) return <p>Chargement...</p>;
  if (error) return <p>{error}</p>;
  if (!classe) return <p>Vous n'êtes affecté à aucune classe pour le moment.</p>;

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <h1>Mes cours</h1>
      <div>
        <h2>{classe.niveau ? `${classe.niveau.nom} - ${classe.nom}` : classe.nom}</h2>
        <p>Année scolaire : {classe.anneeScolaire}</p>
        <p>Effectif : {classe.effectif} élèves</p>
      </div>
    </motion.div>
  );
}