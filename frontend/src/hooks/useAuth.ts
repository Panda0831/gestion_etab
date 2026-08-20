import { useState, useEffect } from "react";
import { Etablissement, LoginPayload, RegisterPayload } from "../types/auth";

const API_URL = "http://localhost:3000";

interface UseAuthReturn {
  loading: boolean;
  error: string;
  success: string;
  etablissements: Etablissement[];
  login: (payload: LoginPayload) => Promise<boolean>;
  register: (payload: RegisterPayload) => Promise<{ id: string } | null>;
  setError: (msg: string) => void;
  setSuccess: (msg: string) => void;
}

export function useAuth(onLoginSuccess: (token: string) => void): UseAuthReturn {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [etablissements, setEtablissements] = useState<Etablissement[]>([]);

  useEffect(() => {
    fetchEtablissements();
  }, []);

  const fetchEtablissements = async () => {
    try {
      const res = await fetch(`${API_URL}/etablissement`);
      if (res.ok) {
        const data = await res.json();
        setEtablissements(data || []);
      }
    } catch (err) {
      console.log("Unable to connect to NestJS.", err);
    }
  };

  const login = async ({ email, password, etablissementId }: LoginPayload): Promise<boolean> => {
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      const payload: Record<string, string> = { email, motDePasse: password };
      if (etablissementId) payload.etablissementId = etablissementId;

      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Échec de la connexion");

      setSuccess("Connexion réussie !");
      localStorage.setItem("token", data.accessToken);
      onLoginSuccess(data.accessToken);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Serveur injoignable.");
      return false;
    } finally {
      setLoading(false);
    }
  };

    const register = async (formData: RegisterPayload): Promise<{ id: string } | null> => {
        setError("");
        setSuccess("");

        if (!formData.etablissementId) {
            setError("Veuillez sélectionner un établissement");
            return null;
        }

        setLoading(true);
        try {
            const payload: Record<string, string> = {
            email: formData.email,
            motDePasse: formData.password,
            nom: formData.nom,
            prenom: formData.prenom,
            role: formData.role,
            etablissementId: formData.etablissementId,
            };
            if (formData.telephone) payload.telephone = formData.telephone;

            const res = await fetch(`${API_URL}/auth/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Échec de l'inscription");

            setSuccess("Parent inscrit avec succès !");
            return data; // { id, nom, prenom, email, ... }
        } catch (err) {
            setError(err instanceof Error ? err.message : "Serveur injoignable.");
            return null;
        } finally {
            setLoading(false);
        }
    };

  return { loading, error, success, etablissements, login, register, setError, setSuccess };
}