import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User } from "../types/auth";
import { Etablissement, Niveau, Classe, Matiere } from "../types/structure";
import "./Configuration.css";

const API_URL = "http://localhost:3000";

interface ConfigurationProps {
  user: User | null;
}

export default function Configuration({ user }: ConfigurationProps) {
  const token = localStorage.getItem("token") || "";
  const etablissementId =
    typeof user?.etablissement === "object"
      ? user.etablissement?.id
      : user?.etablissement;

  const [activeTab, setActiveTab] = useState<
    "etablissement" | "niveaux_classes" | "matieres"
  >("etablissement");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Data states
  const [etab, setEtab] = useState<Etablissement | null>(null);
  const [niveaux, setNiveaux] = useState<Niveau[]>([]);
  const [classes, setClasses] = useState<Classe[]>([]);
  const [matieres, setMatieres] = useState<Matiere[]>([]);

  // Selected state for Levels tab
  const [selectedNiveauId, setSelectedNiveauId] = useState<string | null>(null);

  // Form states - Etablissement
  const [etabForm, setEtabForm] = useState({
    nom: "",
    adresse: "",
    telephone: "",
    email: "",
    type: "ECOLE" as Etablissement["type"],
    fraisInscription: 0,
    fraisReinscription: 0,
  });

  // Form states - New Level
  const [newLevel, setNewLevel] = useState({ nom: "", cycle: "", ordre: 1 });
  // Form states - New Class
  const [newClass, setNewClass] = useState({
    nom: "",
    anneeScolaire: "2026-2027",
    effectif: 0,
  });
  // Form states - New Subject
  const [newMatiere, setNewMatiere] = useState({
    nom: "",
    code: "",
    coefficient: 1,
  });

  // Load configuration data
  useEffect(() => {
    if (etablissementId) {
      loadData();
    }
  }, [etablissementId]);

  const loadData = async () => {
    setLoading(true);
    setError("");
    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };

    try {
      // 1. Fetch Etablissement
      const etabRes = await fetch(
        `${API_URL}/etablissement/${etablissementId}`,
        { headers },
      );
      if (etabRes.ok) {
        const etabData: Etablissement = await etabRes.json();
        setEtab(etabData);
        setEtabForm({
          nom: etabData.nom || "",
          adresse: etabData.adresse || "",
          telephone: etabData.telephone || "",
          email: etabData.email || "",
          type: etabData.type || "ECOLE",
          fraisInscription: etabData.tarifs?.fraisInscription || 0,
          fraisReinscription: etabData.tarifs?.fraisReinscription || 0,
        });
      }

      // 2. Fetch Niveaux
      const nivRes = await fetch(`${API_URL}/niveau`, { headers });
      if (nivRes.ok) {
        const allNiveaux: Niveau[] = await nivRes.json();
        const filtered = allNiveaux.filter(
          (n) => n.etablissementId === etablissementId,
        );
        setNiveaux(filtered);
        if (filtered.length > 0) {
          setSelectedNiveauId(filtered[0].id);
        }
      }

      // 3. Fetch Classes
      const classRes = await fetch(`${API_URL}/classe`, { headers });
      if (classRes.ok) {
        const allClasses: Classe[] = await classRes.json();
        setClasses(allClasses);
      }

      // 4. Fetch Matieres
      const matRes = await fetch(`${API_URL}/matiere`, { headers });
      if (matRes.ok) {
        const allMatieres: Matiere[] = await matRes.json();
        const filtered = allMatieres.filter(
          (m) => m.etablissementId === etablissementId,
        );
        setMatieres(filtered);
      }
    } catch (err) {
      console.error(err);
      setError("Impossible de charger les paramètres de l'établissement.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateEtab = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };

    try {
      const res = await fetch(`${API_URL}/etablissement/${etablissementId}`, {
        method: "PATCH",
        headers,
        body: JSON.stringify({
          nom: etabForm.nom,
          adresse: etabForm.adresse,
          telephone: etabForm.telephone,
          email: etabForm.email,
          type: etabForm.type,
          tarifs: {
            fraisInscription: Number(etabForm.fraisInscription),
            fraisReinscription: Number(etabForm.fraisReinscription),
          },
        }),
      });

      if (res.ok) {
        setSuccess("L'établissement a été mis à jour avec succès.");
        const updated = await res.json();
        setEtab(updated);
      } else {
        setError("Erreur lors de la mise à jour de l'établissement.");
      }
    } catch {
      setError("Erreur de connexion.");
    }
  };

  const handleAddLevel = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLevel.nom) return;
    setError("");
    setSuccess("");
    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };

    try {
      const res = await fetch(`${API_URL}/niveau`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          etablissementId,
          nom: newLevel.nom,
          cycle: newLevel.cycle || undefined,
          ordre: Number(newLevel.ordre),
        }),
      });

      if (res.ok) {
        const added = await res.json();
        setNiveaux((prev) => [...prev, added]);
        if (!selectedNiveauId) setSelectedNiveauId(added.id);
        setNewLevel({ nom: "", cycle: "", ordre: 1 });
        setSuccess("Niveau ajouté avec succès.");
      } else {
        const errData = await res.json();
        setError(errData.message || "Erreur lors de la création du niveau.");
      }
    } catch {
      setError("Erreur de connexion.");
    }
  };

  const handleDeleteLevel = async (id: string) => {
    if (
      !confirm(
        "Voulez-vous vraiment supprimer ce niveau ? Toutes les classes associées seront également supprimées.",
      )
    )
      return;
    setError("");
    setSuccess("");
    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };

    try {
      const res = await fetch(`${API_URL}/niveau/${id}`, {
        method: "DELETE",
        headers,
      });

      if (res.ok) {
        setNiveaux((prev) => prev.filter((n) => n.id !== id));
        if (selectedNiveauId === id) {
          const remaining = niveaux.filter((n) => n.id !== id);
          setSelectedNiveauId(remaining.length > 0 ? remaining[0].id : null);
        }
        setSuccess("Niveau supprimé avec succès.");
      } else {
        setError("Impossible de supprimer le niveau.");
      }
    } catch {
      setError("Erreur de connexion.");
    }
  };

  const handleAddClass = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClass.nom || !selectedNiveauId) return;
    setError("");
    setSuccess("");
    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };

    try {
      const res = await fetch(`${API_URL}/classe`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          niveauId: selectedNiveauId,
          nom: newClass.nom,
          anneeScolaire: newClass.anneeScolaire,
          effectif: Number(newClass.effectif),
        }),
      });

      if (res.ok) {
        const added = await res.json();
        setClasses((prev) => [...prev, added]);
        setNewClass({ nom: "", anneeScolaire: "2026-2027", effectif: 0 });
        setSuccess("Classe ajoutée avec succès.");
      } else {
        setError("Erreur lors de la création de la classe.");
      }
    } catch {
      setError("Erreur de connexion.");
    }
  };

  const handleDeleteClass = async (id: string) => {
    if (!confirm("Voulez-vous supprimer cette classe ?")) return;
    setError("");
    setSuccess("");
    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };

    try {
      const res = await fetch(`${API_URL}/classe/${id}`, {
        method: "DELETE",
        headers,
      });

      if (res.ok) {
        setClasses((prev) => prev.filter((c) => c.id !== id));
        setSuccess("Classe supprimée.");
      } else {
        setError("Impossible de supprimer la classe.");
      }
    } catch {
      setError("Erreur de connexion.");
    }
  };

  const handleAddMatiere = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMatiere.nom) return;
    setError("");
    setSuccess("");
    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };

    try {
      const res = await fetch(`${API_URL}/matiere`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          etablissementId,
          nom: newMatiere.nom,
          code: newMatiere.code || undefined,
          coefficient: Number(newMatiere.coefficient),
        }),
      });

      if (res.ok) {
        const added = await res.json();
        setMatieres((prev) => [...prev, added]);
        setNewMatiere({ nom: "", code: "", coefficient: 1 });
        setSuccess("Matière ajoutée avec succès.");
      } else {
        setError("Erreur lors de la création de la matière.");
      }
    } catch {
      setError("Erreur de connexion.");
    }
  };

  const handleDeleteMatiere = async (id: string) => {
    if (!confirm("Supprimer cette matière ?")) return;
    setError("");
    setSuccess("");
    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };

    try {
      const res = await fetch(`${API_URL}/matiere/${id}`, {
        method: "DELETE",
        headers,
      });

      if (res.ok) {
        setMatieres((prev) => prev.filter((m) => m.id !== id));
        setSuccess("Matière supprimée.");
      } else {
        setError("Impossible de supprimer la matière.");
      }
    } catch {
      setError("Erreur de connexion.");
    }
  };

  if (loading) {
    return (
      <div className="config-loading">
        <div className="dash-spinner"></div>
        <p>Chargement de la configuration scolaire...</p>
      </div>
    );
  }

  return (
    <div className="config-container">
      {/* Header Banner */}
      <div className="config-header">
        <div className="config-header-titles">
          <h1>Configuration de l&apos;Établissement</h1>
          <p>
            Configurez la structure scolaire de votre établissement : Niveaux,
            Classes, Matières et Tarifs.
          </p>
        </div>
        <div className="config-etab-badge">
          <span>{etab?.nom}</span>
          <span className="type-pill">{etab?.type}</span>
        </div>
      </div>

      {/* Notifications */}
      <AnimatePresence>
        {error && (
          <motion.div
            className="config-notification error"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            {error}
          </motion.div>
        )}
        {success && (
          <motion.div
            className="config-notification success"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            {success}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tabs Layout */}
      <div className="config-tabs-nav">
        <button
          className={activeTab === "etablissement" ? "active" : ""}
          onClick={() => {
            setActiveTab("etablissement");
            setError("");
            setSuccess("");
          }}
        >
          ⚙️ Établissement
        </button>
        <button
          className={activeTab === "niveaux_classes" ? "active" : ""}
          onClick={() => {
            setActiveTab("niveaux_classes");
            setError("");
            setSuccess("");
          }}
        >
          Niveaux & Classes
        </button>
        <button
          className={activeTab === "matieres" ? "active" : ""}
          onClick={() => {
            setActiveTab("matieres");
            setError("");
            setSuccess("");
          }}
        >
          Matières
        </button>
      </div>

      <div className="config-tab-content">
        {/* Tab 1: Etablissement */}
        {activeTab === "etablissement" && (
          <motion.div
            className="config-card glass-panel"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h3>Informations générales</h3>
            <form onSubmit={handleUpdateEtab} className="config-form">
              <div className="form-grid">
                <div className="form-group">
                  <label>Nom de l&apos;établissement</label>
                  <input
                    type="text"
                    value={etabForm.nom}
                    onChange={(e) =>
                      setEtabForm({ ...etabForm, nom: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Type d&apos;établissement</label>
                  <select
                    value={etabForm.type}
                    onChange={(e) =>
                      setEtabForm({
                        ...etabForm,
                        type: e.target.value as Etablissement["type"],
                      })
                    }
                  >
                    <option value="ECOLE">École Primaire</option>
                    <option value="COLLEGE">Collège</option>
                    <option value="LYCEE">Lycée</option>
                    <option value="UNIVERSITE">Université</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Adresse physique</label>
                  <input
                    type="text"
                    value={etabForm.adresse}
                    onChange={(e) =>
                      setEtabForm({ ...etabForm, adresse: e.target.value })
                    }
                  />
                </div>
                <div className="form-group">
                  <label>Numéro de téléphone</label>
                  <input
                    type="text"
                    value={etabForm.telephone}
                    onChange={(e) =>
                      setEtabForm({ ...etabForm, telephone: e.target.value })
                    }
                  />
                </div>
                <div className="form-group">
                  <label>Adresse email</label>
                  <input
                    type="email"
                    value={etabForm.email}
                    onChange={(e) =>
                      setEtabForm({ ...etabForm, email: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="form-divider" />

              <h3>Configuration Financière (Frais d&apos;inscription)</h3>
              <div className="form-grid">
                <div className="form-group">
                  <label>Droit d&apos;inscription (MGA)</label>
                  <input
                    type="number"
                    value={etabForm.fraisInscription}
                    onChange={(e) =>
                      setEtabForm({
                        ...etabForm,
                        fraisInscription: Number(e.target.value),
                      })
                    }
                    min="0"
                  />
                </div>
                <div className="form-group">
                  <label>Frais de réinscription (MGA)</label>
                  <input
                    type="number"
                    value={etabForm.fraisReinscription}
                    onChange={(e) =>
                      setEtabForm({
                        ...etabForm,
                        fraisReinscription: Number(e.target.value),
                      })
                    }
                    min="0"
                  />
                </div>
              </div>

              <div className="form-actions">
                <button type="submit" className="config-btn primary">
                  Enregistrer les modifications
                </button>
              </div>
            </form>
          </motion.div>
        )}

        {/* Tab 2: Niveaux & Classes */}
        {activeTab === "niveaux_classes" && (
          <motion.div
            className="config-split-layout"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {/* Left: Niveaux */}
            <div className="config-sidebar glass-panel">
              <div className="sidebar-header">
                <h3>Niveaux</h3>
              </div>

              <ul className="level-list">
                {niveaux.map((n) => (
                  <li
                    key={n.id}
                    className={selectedNiveauId === n.id ? "active" : ""}
                    onClick={() => setSelectedNiveauId(n.id)}
                  >
                    <div className="level-info">
                      <span className="level-name">{n.nom}</span>
                      {n.cycle && (
                        <span className="level-cycle">{n.cycle}</span>
                      )}
                    </div>
                    <button
                      className="delete-icon-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteLevel(n.id);
                      }}
                    ></button>
                  </li>
                ))}
                {niveaux.length === 0 && (
                  <p className="empty-text">Aucun niveau défini.</p>
                )}
              </ul>

              <form onSubmit={handleAddLevel} className="sidebar-form">
                <h4>Nouveau Niveau</h4>
                <div className="form-group">
                  <input
                    type="text"
                    placeholder="Ex: Seconde, 6ème..."
                    value={newLevel.nom}
                    onChange={(e) =>
                      setNewLevel({ ...newLevel, nom: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="form-group">
                  <input
                    type="text"
                    placeholder="Cycle (Ex: LYCEE, COLLEGE)"
                    value={newLevel.cycle}
                    onChange={(e) =>
                      setNewLevel({ ...newLevel, cycle: e.target.value })
                    }
                  />
                </div>
                <div className="form-group">
                  <input
                    type="number"
                    placeholder="Ordre (ex: 1)"
                    value={newLevel.ordre}
                    onChange={(e) =>
                      setNewLevel({
                        ...newLevel,
                        ordre: Number(e.target.value),
                      })
                    }
                    min="1"
                  />
                </div>
                <button type="submit" className="config-btn secondary w-full">
                  Ajouter le Niveau
                </button>
              </form>
            </div>

            {/* Right: Classes under selected Niveau */}
            <div className="config-main glass-panel">
              <h3>
                Classes du niveau{" "}
                <span className="selected-level-title">
                  {niveaux.find((n) => n.id === selectedNiveauId)?.nom ||
                    "sélectionné"}
                </span>
              </h3>

              {selectedNiveauId ? (
                <>
                  <div className="classes-grid">
                    {classes
                      .filter((c) => c.niveauId === selectedNiveauId)
                      .map((c) => (
                        <div key={c.id} className="class-card">
                          <div className="class-card-header">
                            <h4>{c.nom}</h4>
                            <button
                              className="delete-icon-btn"
                              onClick={() => handleDeleteClass(c.id)}
                            ></button>
                          </div>
                          <div className="class-details">
                            <p>
                              <strong>Année :</strong> {c.anneeScolaire}
                            </p>
                            <p>
                              <strong>Effectif Max :</strong>{" "}
                              {c.effectif || "Non défini"}
                            </p>
                          </div>
                        </div>
                      ))}
                    {classes.filter((c) => c.niveauId === selectedNiveauId)
                      .length === 0 && (
                      <div className="empty-state">
                        <p>
                          Aucune classe dans ce niveau. Ajoutez-en une
                          ci-dessous.
                        </p>
                      </div>
                    )}
                  </div>

                  <form onSubmit={handleAddClass} className="class-form-inline">
                    <h4>Ajouter une classe</h4>
                    <div className="form-row">
                      <div className="form-group">
                        <input
                          type="text"
                          placeholder="Nom (Ex: Terminale S1)"
                          value={newClass.nom}
                          onChange={(e) =>
                            setNewClass({ ...newClass, nom: e.target.value })
                          }
                          required
                        />
                      </div>
                      <div className="form-group">
                        <input
                          type="text"
                          placeholder="Année (Ex: 2026-2027)"
                          value={newClass.anneeScolaire}
                          onChange={(e) =>
                            setNewClass({
                              ...newClass,
                              anneeScolaire: e.target.value,
                            })
                          }
                          required
                        />
                      </div>
                      <div className="form-group">
                        <input
                          type="number"
                          placeholder="Effectif maximum"
                          value={newClass.effectif || ""}
                          onChange={(e) =>
                            setNewClass({
                              ...newClass,
                              effectif: Number(e.target.value),
                            })
                          }
                          min="0"
                        />
                      </div>
                      <button type="submit" className="config-btn primary">
                        Ajouter
                      </button>
                    </div>
                  </form>
                </>
              ) : (
                <div className="empty-state">
                  <p>
                    Veuillez sélectionner ou créer un niveau sur la gauche pour
                    gérer ses classes.
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Tab 3: Matieres */}
        {activeTab === "matieres" && (
          <motion.div
            className="config-card glass-panel"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h3>Matières d&apos;enseignement</h3>

            <div className="matieres-container">
              <div className="matieres-list-pane">
                <table className="config-table">
                  <thead>
                    <tr>
                      <th>Code</th>
                      <th>Nom de la matière</th>
                      <th>Coefficient</th>
                      <th style={{ width: "80px", textAlign: "center" }}>
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {matieres.map((m) => (
                      <tr key={m.id}>
                        <td>
                          <span className="code-badge">{m.code || "-"}</span>
                        </td>
                        <td>
                          <strong>{m.nom}</strong>
                        </td>
                        <td>{m.coefficient}</td>
                        <td style={{ textAlign: "center" }}>
                          <button
                            className="delete-icon-btn"
                            onClick={() => handleDeleteMatiere(m.id)}
                          ></button>
                        </td>
                      </tr>
                    ))}
                    {matieres.length === 0 && (
                      <tr>
                        <td colSpan={4} className="empty-table-text">
                          Aucune matière configurée pour cet établissement.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <div className="matieres-form-pane">
                <form onSubmit={handleAddMatiere} className="sidebar-form">
                  <h4>Nouvelle Matière</h4>
                  <div className="form-group">
                    <label>Nom de la matière</label>
                    <input
                      type="text"
                      placeholder="Ex: Mathématiques, Histoire..."
                      value={newMatiere.nom}
                      onChange={(e) =>
                        setNewMatiere({ ...newMatiere, nom: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Code matière</label>
                    <input
                      type="text"
                      placeholder="Ex: MATH, HIST"
                      value={newMatiere.code}
                      onChange={(e) =>
                        setNewMatiere({
                          ...newMatiere,
                          code: e.target.value.toUpperCase(),
                        })
                      }
                    />
                  </div>
                  <div className="form-group">
                    <label>Coefficient</label>
                    <input
                      type="number"
                      placeholder="Ex: 2"
                      value={newMatiere.coefficient}
                      onChange={(e) =>
                        setNewMatiere({
                          ...newMatiere,
                          coefficient: Number(e.target.value),
                        })
                      }
                      min="0.5"
                      step="0.5"
                      required
                    />
                  </div>
                  <button type="submit" className="config-btn primary w-full">
                    Ajouter la Matière
                  </button>
                </form>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
