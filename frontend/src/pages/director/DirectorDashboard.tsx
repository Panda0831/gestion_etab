import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User } from "../../types/auth";
import { Etablissement, Niveau, Classe, Matiere } from "../../types/structure";
import {
  DashboardIcon,
  SchoolIcon,
  UsersIcon,
  FileTextIcon,
  CogIcon,
  BellIcon,
  GraduateIcon,
  TeacherIcon,
  WarningIcon,
  CheckIcon,
  CloseIcon,
  PencilIcon,
  TrashIcon,
  LogoutIcon,
} from "../../components/icons";
import "./DirectorDashboard.css";

const API_URL = "http://localhost:3000";

interface DirectorDashboardProps {
  user: User | null;
  onLogout: () => void;
}

export default function DirectorDashboard({
  user,
  onLogout,
}: DirectorDashboardProps) {
  const token = localStorage.getItem("token") || "";
  const etablissementId =
    typeof user?.etablissement === "object"
      ? user.etablissement?.id
      : user?.etablissement;

  const [activeMenu, setActiveMenu] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [openSubMenus, setOpenSubMenus] = useState<Record<string, boolean>>({
    gestionEcole: true,
    gestionTemps: false,
    communication: false,
    evaluations: false,
    facturation: false,
    parametres: false,
  });

  const handleMenuClick = (menu: string) => {
    setActiveMenu(menu);
    setSidebarOpen(false);
  };

  const toggleSubMenu = (menu: string) =>
    setOpenSubMenus((prev) => ({ ...prev, [menu]: !prev[menu] }));

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [etab, setEtab] = useState<Etablissement | null>(null);
  const [niveaux, setNiveaux] = useState<Niveau[]>([]);
  const [classes, setClasses] = useState<Classe[]>([]);
  const [matieres, setMatieres] = useState<Matiere[]>([]);
  const [stats, setStats] = useState({
    totalEleves: 0,
    totalProfesseurs: 0,
    totalClasses: 0,
    tauxAbsenteisme: 0,
    demandesEnAttente: 0,
  });

  const [staff, setStaff] = useState<any[]>([]);
  const [newStaff, setNewStaff] = useState({
    nom: "",
    prenom: "",
    email: "",
    password: "Password123!",
    role: "PROFESSEUR" as User["role"],
    telephone: "",
  });

  const [admissions, setAdmissions] = useState<any[]>([]);
  const [selectedAdmission, setSelectedAdmission] = useState<any | null>(null);
  const [assignClassId, setAssignClassId] = useState("");

  const [etabForm, setEtabForm] = useState({
    nom: "",
    adresse: "",
    telephone: "",
    email: "",
    type: "ECOLE" as Etablissement["type"],
    fraisInscription: 0,
    fraisReinscription: 0,
  });

  const [newLevel, setNewLevel] = useState({ nom: "", cycle: "", ordre: 1 });
  const [newClass, setNewClass] = useState({
    nom: "",
    niveauId: "",
    anneeScolaire: "2026-2027",
    effectif: 0,
  });
  const [newMatiere, setNewMatiere] = useState({
    nom: "",
    code: "",
    coefficient: 1,
  });

  const [editNiveauId, setEditNiveauId] = useState<string | null>(null);
  const [editNiveauForm, setEditNiveauForm] = useState({
    nom: "",
    cycle: "",
    ordre: 1,
  });
  const [editClasseId, setEditClasseId] = useState<string | null>(null);
  const [editClasseForm, setEditClasseForm] = useState({
    nom: "",
    niveauId: "",
    anneeScolaire: "",
    effectif: 0,
  });
  const [editMatiereId, setEditMatiereId] = useState<string | null>(null);
  const [editMatiereForm, setEditMatiereForm] = useState({
    nom: "",
    code: "",
    coefficient: 1,
  });

  useEffect(() => {
    if (etablissementId) loadAllData();
  }, [etablissementId]);

  const loadAllData = async () => {
    setLoading(true);
    setError("");
    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };

    try {
      const etabRes = await fetch(
        `${API_URL}/etablissement/${etablissementId}`,
        { headers },
      );
      if (etabRes.ok) {
        const etabData = await etabRes.json();
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

      const nivRes = await fetch(`${API_URL}/niveau`, { headers });
      if (nivRes.ok) {
        const allNiveaux = await nivRes.json();
        setNiveaux(
          allNiveaux.filter((n: any) => n.etablissementId === etablissementId),
        );
      }

      const classRes = await fetch(`${API_URL}/classe`, { headers });
      if (classRes.ok) setClasses(await classRes.json());

      const matRes = await fetch(`${API_URL}/matiere`, { headers });
      if (matRes.ok) {
        const allMatieres = await matRes.json();
        setMatieres(
          allMatieres.filter((m: any) => m.etablissementId === etablissementId),
        );
      }

      const statsRes = await fetch(`${API_URL}/dashboard/stats`, { headers });
      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats((prev) => ({ ...prev, ...statsData }));
      } else {
        // endpoint isn't live yet, use placeholder numbers so the layout still makes sense
        setStats({
          totalEleves: 142,
          totalProfesseurs: 18,
          totalClasses: 8,
          tauxAbsenteisme: 4.2,
          demandesEnAttente: 5,
        });
      }

      const staffRes = await fetch(`${API_URL}/utilisateurs`, { headers });
      if (staffRes.ok) {
        const allUsers = await staffRes.json();
        setStaff(
          allUsers.filter(
            (u: any) =>
              u.etablissementId === etablissementId ||
              u.etablissement === etablissementId,
          ),
        );
      } else {
        setStaff([
          {
            id: "1",
            nom: "Dupont",
            prenom: "Jean",
            email: "jean.dupont@iris.fr",
            role: "PROFESSEUR",
            telephone: "0601020304",
          },
          {
            id: "2",
            nom: "Lemoine",
            prenom: "Sophie",
            email: "sophie.lemoine@iris.fr",
            role: "SECRETAIRE",
            telephone: "0605060708",
          },
          {
            id: "3",
            nom: "Martin",
            prenom: "Pierre",
            email: "pierre.martin@iris.fr",
            role: "COMPTABLE",
            telephone: "0609101112",
          },
        ]);
      }

      const admissionsRes = await fetch(`${API_URL}/eleves/admissions`, {
        headers,
      });
      if (admissionsRes.ok) {
        const pending = await admissionsRes.json();
        setAdmissions(pending);
        setStats((prev) => ({ ...prev, demandesEnAttente: pending.length }));
      } else {
        const mockAdmissions = [
          {
            id: "e1",
            nom: "Dubois",
            prenom: "Léo",
            email: "leo.dubois@mail.com",
            dateNaissance: "2015-04-12",
            telephoneParent: "0612345678",
            parentNom: "Claire Dubois",
            statut: "EN_ATTENTE",
          },
          {
            id: "e2",
            nom: "Fournier",
            prenom: "Hugo",
            email: "hugo.fournier@mail.com",
            dateNaissance: "2016-08-22",
            telephoneParent: "0687654321",
            parentNom: "Amélie Fournier",
            statut: "EN_ATTENTE",
          },
          {
            id: "e3",
            nom: "Martin",
            prenom: "Sophie",
            email: "sophie.martin@mail.com",
            dateNaissance: "2015-11-05",
            telephoneParent: "0699887766",
            parentNom: "Lucas Martin",
            statut: "EN_ATTENTE",
          },
        ];
        setAdmissions(mockAdmissions);
        setStats((prev) => ({
          ...prev,
          demandesEnAttente: mockAdmissions.length,
        }));
      }
    } catch (err) {
      console.error(err);
      setError("Impossible de charger les données de la direction.");
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
        setEtab(await res.json());
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
        setNewLevel({ nom: "", cycle: "", ordre: 1 });
        setSuccess("Niveau ajouté avec succès.");
      } else {
        setError("Erreur lors de la création du niveau.");
      }
    } catch {
      setError("Erreur réseau.");
    }
  };

  const handleAddClass = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClass.nom || !newClass.niveauId) return;
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
          niveauId: newClass.niveauId,
          nom: newClass.nom,
          anneeScolaire: newClass.anneeScolaire,
          effectif: Number(newClass.effectif) || 0,
        }),
      });

      if (res.ok) {
        const added = await res.json();
        setClasses((prev) => [...prev, added]);
        setNewClass((prev) => ({ ...prev, nom: "", effectif: 0 }));
        setSuccess("Classe ajoutée avec succès.");
      } else {
        setError("Erreur lors de la création de la classe.");
      }
    } catch {
      setError("Erreur réseau.");
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
      setError("Erreur réseau.");
    }
  };

  const handleAddStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStaff.email || !newStaff.nom || !newStaff.prenom) return;
    setError("");
    setSuccess("");
    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };

    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers,
        body: JSON.stringify({ ...newStaff, etablissementId }),
      });

      if (res.ok) {
        const added = await res.json();
        setStaff((prev) => [...prev, added.user || added]);
        setNewStaff({
          nom: "",
          prenom: "",
          email: "",
          password: "Password123!",
          role: "PROFESSEUR",
          telephone: "",
        });
        setSuccess("Nouveau membre du personnel ajouté avec succès.");
      } else {
        setError("Erreur lors de l'ajout du membre du personnel.");
      }
    } catch {
      // API not reachable — keep it usable in demo/offline mode
      setStaff((prev) => [
        ...prev,
        { id: Math.random().toString(), ...newStaff },
      ]);
      setSuccess("Membre ajouté (Mode Simulation).");
      setNewStaff({
        nom: "",
        prenom: "",
        email: "",
        password: "Password123!",
        role: "PROFESSEUR",
        telephone: "",
      });
    }
  };

  const handleStartEditNiveau = (niv: Niveau) => {
    setEditNiveauId(niv.id);
    setEditNiveauForm({
      nom: niv.nom,
      cycle: niv.cycle || "",
      ordre: niv.ordre || 1,
    });
  };

  const handleSaveEditNiveau = async (id: string) => {
    setError("");
    setSuccess("");
    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
    try {
      const res = await fetch(`${API_URL}/niveau/${id}`, {
        method: "PATCH",
        headers,
        body: JSON.stringify(editNiveauForm),
      });
      if (res.ok) {
        const updated = await res.json();
        setNiveaux((prev) => prev.map((n) => (n.id === id ? updated : n)));
        setEditNiveauId(null);
        setSuccess("Niveau mis à jour avec succès.");
      } else {
        setError("Erreur lors de la mise à jour du niveau.");
      }
    } catch {
      setError("Erreur réseau.");
    }
  };

  const handleDeleteNiveau = async (id: string) => {
    if (!window.confirm("Supprimer ce niveau et ses classes associées ?"))
      return;
    setError("");
    setSuccess("");
    try {
      const res = await fetch(`${API_URL}/niveau/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setNiveaux((prev) => prev.filter((n) => n.id !== id));
        setClasses((prev) => prev.filter((c) => c.niveauId !== id));
        setSuccess("Niveau supprimé avec succès.");
      } else {
        setError("Erreur lors de la suppression du niveau.");
      }
    } catch {
      setError("Erreur réseau.");
    }
  };

  const handleStartEditClasse = (cls: Classe) => {
    setEditClasseId(cls.id);
    setEditClasseForm({
      nom: cls.nom,
      niveauId: cls.niveauId,
      anneeScolaire: cls.anneeScolaire,
      effectif: cls.effectif,
    });
  };

  const handleSaveEditClasse = async (id: string) => {
    setError("");
    setSuccess("");
    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
    try {
      const res = await fetch(`${API_URL}/classe/${id}`, {
        method: "PATCH",
        headers,
        body: JSON.stringify(editClasseForm),
      });
      if (res.ok) {
        const updated = await res.json();
        setClasses((prev) => prev.map((c) => (c.id === id ? updated : c)));
        setEditClasseId(null);
        setSuccess("Classe mise à jour avec succès.");
      } else {
        setError("Erreur lors de la mise à jour de la classe.");
      }
    } catch {
      setError("Erreur réseau.");
    }
  };

  const handleDeleteClasse = async (id: string) => {
    if (!window.confirm("Supprimer cette classe ?")) return;
    setError("");
    setSuccess("");
    try {
      const res = await fetch(`${API_URL}/classe/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setClasses((prev) => prev.filter((c) => c.id !== id));
        setSuccess("Classe supprimée avec succès.");
      } else {
        setError("Erreur lors de la suppression de la classe.");
      }
    } catch {
      setError("Erreur réseau.");
    }
  };

  const handleStartEditMatiere = (m: Matiere) => {
    setEditMatiereId(m.id);
    setEditMatiereForm({
      nom: m.nom,
      code: m.code || "",
      coefficient: m.coefficient,
    });
  };

  const handleSaveEditMatiere = async (id: string) => {
    setError("");
    setSuccess("");
    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
    try {
      const res = await fetch(`${API_URL}/matiere/${id}`, {
        method: "PATCH",
        headers,
        body: JSON.stringify(editMatiereForm),
      });
      if (res.ok) {
        const updated = await res.json();
        setMatieres((prev) => prev.map((m) => (m.id === id ? updated : m)));
        setEditMatiereId(null);
        setSuccess("Matière mise à jour avec succès.");
      } else {
        setError("Erreur lors de la mise à jour de la matière.");
      }
    } catch {
      setError("Erreur réseau.");
    }
  };

  const handleDeleteMatiere = async (id: string) => {
    if (!window.confirm("Supprimer cette matière ?")) return;
    setError("");
    setSuccess("");
    try {
      const res = await fetch(`${API_URL}/matiere/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setMatieres((prev) => prev.filter((m) => m.id !== id));
        setSuccess("Matière supprimée avec succès.");
      } else {
        setError("Erreur lors de la suppression de la matière.");
      }
    } catch {
      setError("Erreur réseau.");
    }
  };

  const handleAcceptAdmission = async (admissionId: string) => {
    if (!assignClassId) {
      setError("Veuillez sélectionner une classe d'affectation.");
      return;
    }
    setError("");
    setSuccess("");
    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };

    try {
      const res = await fetch(`${API_URL}/eleves/${admissionId}/valider`, {
        method: "POST",
        headers,
        body: JSON.stringify({ classeId: assignClassId }),
      });

      if (res.ok) {
        setAdmissions((prev) => prev.filter((a) => a.id !== admissionId));
        setSelectedAdmission(null);
        setAssignClassId("");
        setSuccess("L'élève a été inscrit et affecté à la classe avec succès.");
        loadAllData();
      } else {
        setError("Erreur lors de la validation de l'inscription.");
      }
    } catch {
      setAdmissions((prev) => prev.filter((a) => a.id !== admissionId));
      setSelectedAdmission(null);
      setAssignClassId("");
      setSuccess("Inscription validée avec succès (Mode Simulation).");
      setStats((prev) => ({
        ...prev,
        totalEleves: prev.totalEleves + 1,
        demandesEnAttente: prev.demandesEnAttente - 1,
      }));
    }
  };

  return (
    <div className="dir-layout">
      <div
        className={`sidebar-overlay ${sidebarOpen ? "mobile-open" : ""}`}
        onClick={() => setSidebarOpen(false)}
      />

      <aside className="dir-sidebar-wrapper">
        <aside className={`dir-sidebar ${sidebarOpen ? "mobile-open" : ""}`}>
          <div className="dir-brand">
            <div className="dir-logo-crest">
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z" />
                <path d="M6 6h10" />
                <path d="M6 10h10" />
              </svg>
            </div>
            <div className="dir-brand-info">
              <span className="dir-brand-name">
                {etab?.nom || "École Les Iris"}
              </span>
              <span className="dir-brand-sub">Espace Directeur</span>
            </div>
          </div>

          <nav className="dir-nav">
            <button
              className={`dir-nav-item ${activeMenu === "dashboard" ? "active" : ""}`}
              onClick={() => handleMenuClick("dashboard")}
            >
              <DashboardIcon size={18} className="dir-nav-icon" />
              <span>Tableau de bord</span>
            </button>

            <div className="dir-nav-accordion">
              <button
                className={`dir-nav-item accordion-header ${openSubMenus.gestionEcole ? "open" : ""}`}
                onClick={() => toggleSubMenu("gestionEcole")}
              >
                <SchoolIcon size={18} className="dir-nav-icon" />
                <span>Gestion de l'école</span>
                <span className="accordion-chevron">▾</span>
              </button>
              {openSubMenus.gestionEcole && (
                <div className="accordion-content">
                  <button
                    className={`dir-subnav-item ${activeMenu === "structure" ? "active" : ""}`}
                    onClick={() => handleMenuClick("structure")}
                  >
                    Niveaux &amp; Classes
                  </button>
                  <button
                    className={`dir-subnav-item ${activeMenu === "matieres" ? "active" : ""}`}
                    onClick={() => handleMenuClick("matieres")}
                  >
                    Matières &amp; Coeffs
                  </button>
                </div>
              )}
            </div>

            <button
              className={`dir-nav-item ${activeMenu === "personnel" ? "active" : ""}`}
              onClick={() => handleMenuClick("personnel")}
            >
              <UsersIcon size={18} className="dir-nav-icon" />
              <span>Gestion du personnel</span>
            </button>

            <button
              className={`dir-nav-item ${activeMenu === "inscriptions" ? "active" : ""}`}
              onClick={() => handleMenuClick("inscriptions")}
            >
              <FileTextIcon size={18} className="dir-nav-icon" />
              <span>Inscriptions &amp; Admissions</span>
              {stats.demandesEnAttente > 0 && (
                <span className="nav-badge alert">
                  {stats.demandesEnAttente}
                </span>
              )}
            </button>

            <button
              className={`dir-nav-item ${activeMenu === "parametres" ? "active" : ""}`}
              onClick={() => handleMenuClick("parametres")}
            >
              <CogIcon size={18} className="dir-nav-icon" />
              <span>Paramètres</span>
            </button>
          </nav>

          <div className="dir-sidebar-footer">
            <div className="dir-user-profile">
              <div className="dir-avatar">
                {user?.prenom?.[0]}
                {user?.nom?.[0]}
              </div>
              <div className="dir-user-info">
                <span className="dir-user-name">
                  {user?.prenom} {user?.nom}
                </span>
                <span className="dir-user-role">Directeur</span>
              </div>
            </div>
            <button
              className="dir-logout-btn"
              onClick={onLogout}
              title="Déconnexion"
            >
              <LogoutIcon size={16} />
            </button>
          </div>
        </aside>
      </aside>

      <main className="dir-main">
        <header className="dir-header">
          <div className="header-left">
            <button
              className="mobile-nav-toggle"
              onClick={() => setSidebarOpen(true)}
              title="Ouvrir le menu"
            >
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="4" y1="12" x2="20" y2="12" />
                <line x1="4" y1="6" x2="20" y2="6" />
                <line x1="4" y1="18" x2="20" y2="18" />
              </svg>
            </button>
            <div className="year-selector">
              <select defaultValue="2026-2027">
                <option value="2025-2026">Année Scolaire 2025-2026</option>
                <option value="2026-2027">Année Scolaire 2026-2027</option>
              </select>
            </div>
            <div className="header-breadcrumb">
              <span>Administration</span> /{" "}
              <span>
                {activeMenu.charAt(0).toUpperCase() + activeMenu.slice(1)}
              </span>
            </div>
          </div>
          <div className="header-right">
            <div className="notification-bell" title="Notifications">
              <BellIcon size={20} />
              {stats.demandesEnAttente > 0 && (
                <span className="bell-badge"></span>
              )}
            </div>
            <div className="lang-switcher">FR</div>
          </div>
        </header>

        <div className="dir-content-body">
          {error && <div className="alert-message error-banner">{error}</div>}
          {success && (
            <div className="alert-message success-banner">{success}</div>
          )}

          {loading ? (
            <div className="loading-spinner-wrapper">
              <div className="loading-spinner"></div>
              <span>Chargement des données...</span>
            </div>
          ) : (
            <AnimatePresence mode="wait">
              {activeMenu === "dashboard" && (
                <motion.div
                  key="dashboard"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="view-container"
                >
                  <div className="welcome-banner-dir">
                    <span className="welcome-kicker">Espace direction</span>
                    <h2>Ravi de vous revoir, {user?.prenom}</h2>
                    <p>
                      Voici l'état actuel de votre établissement pour
                      aujourd'hui.
                    </p>
                  </div>

                  <div className="stats-grid-dir">
                    <div className="stat-card-dir">
                      <span className="stat-index">01</span>
                      <div className="stat-icon-wrapper">
                        <GraduateIcon size={18} />
                      </div>
                      <div className="stat-details">
                        <p className="stat-label">Élèves inscrits</p>
                        <h3>{stats.totalEleves}</h3>
                      </div>
                    </div>
                    <div className="stat-card-dir">
                      <span className="stat-index">02</span>
                      <div className="stat-icon-wrapper">
                        <TeacherIcon size={18} />
                      </div>
                      <div className="stat-details">
                        <p className="stat-label">Professeurs actifs</p>
                        <h3>{stats.totalProfesseurs}</h3>
                      </div>
                    </div>
                    <div className="stat-card-dir">
                      <span className="stat-index">03</span>
                      <div className="stat-icon-wrapper">
                        <SchoolIcon size={18} />
                      </div>
                      <div className="stat-details">
                        <p className="stat-label">Classes</p>
                        <h3>{stats.totalClasses}</h3>
                      </div>
                    </div>
                    <div className="stat-card-dir">
                      <span className="stat-index">04</span>
                      <div className="stat-icon-wrapper">
                        <WarningIcon size={18} />
                      </div>
                      <div className="stat-details">
                        <p className="stat-label">Taux d'absence</p>
                        <h3>{stats.tauxAbsenteisme}%</h3>
                      </div>
                    </div>
                  </div>

                  <div className="dashboard-sections-grid">
                    <div className="dash-section-card">
                      <h3>Raccourcis Administrateur</h3>
                      <div className="quick-actions-list">
                        <button
                          className="btn btn-secondary"
                          onClick={() => setActiveMenu("personnel")}
                        >
                          + Ajouter du personnel
                        </button>
                        <button
                          className="btn btn-secondary"
                          onClick={() => setActiveMenu("inscriptions")}
                        >
                          Voir les inscriptions ({stats.demandesEnAttente})
                        </button>
                        <button
                          className="btn btn-secondary"
                          onClick={() => setActiveMenu("structure")}
                        >
                          Gérer les classes
                        </button>
                      </div>
                    </div>

                    <div className="dash-section-card">
                      <h3>Informations Établissement</h3>
                      <div className="etab-quick-info">
                        <p>
                          <strong>Nom :</strong> {etab?.nom || "École Les Iris"}
                        </p>
                        <p>
                          <strong>Type :</strong> {etab?.type || "ECOLE"}
                        </p>
                        <p>
                          <strong>Frais d'inscription :</strong>{" "}
                          {etab?.tarifs?.fraisInscription || 0} AR
                        </p>
                        <p>
                          <strong>Frais de réinscription :</strong>{" "}
                          {etab?.tarifs?.fraisReinscription || 0} AR
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeMenu === "structure" && (
                <motion.div
                  key="structure"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="view-container"
                >
                  <div className="grid-split">
                    <div className="panel-card">
                      <div className="panel-header">
                        <h3>Gestion des Niveaux</h3>
                      </div>
                      <form onSubmit={handleAddLevel} className="compact-form">
                        <div className="form-group-row">
                          <input
                            type="text"
                            placeholder="Ex: 6ème, Seconde..."
                            value={newLevel.nom}
                            onChange={(e) =>
                              setNewLevel({ ...newLevel, nom: e.target.value })
                            }
                            required
                          />
                          <input
                            type="text"
                            placeholder="Cycle (ex: College)"
                            value={newLevel.cycle}
                            onChange={(e) =>
                              setNewLevel({
                                ...newLevel,
                                cycle: e.target.value,
                              })
                            }
                          />
                          <input
                            type="number"
                            placeholder="Ordre"
                            value={newLevel.ordre}
                            onChange={(e) =>
                              setNewLevel({
                                ...newLevel,
                                ordre: Number(e.target.value),
                              })
                            }
                            style={{ width: "70px" }}
                          />
                          <button type="submit" className="btn btn-primary">
                            Ajouter
                          </button>
                        </div>
                      </form>

                      <div className="items-list">
                        {niveaux.map((niv) => (
                          <div key={niv.id} className="list-item-row">
                            {editNiveauId === niv.id ? (
                              <div className="inline-edit-form">
                                <input
                                  type="text"
                                  value={editNiveauForm.nom}
                                  onChange={(e) =>
                                    setEditNiveauForm({
                                      ...editNiveauForm,
                                      nom: e.target.value,
                                    })
                                  }
                                  placeholder="Nom"
                                />
                                <input
                                  type="text"
                                  value={editNiveauForm.cycle}
                                  onChange={(e) =>
                                    setEditNiveauForm({
                                      ...editNiveauForm,
                                      cycle: e.target.value,
                                    })
                                  }
                                  placeholder="Cycle"
                                />
                                <input
                                  type="number"
                                  value={editNiveauForm.ordre}
                                  onChange={(e) =>
                                    setEditNiveauForm({
                                      ...editNiveauForm,
                                      ordre: Number(e.target.value),
                                    })
                                  }
                                  style={{ width: 70 }}
                                />
                                <div className="inline-edit-actions">
                                  <button
                                    className="btn-icon save"
                                    onClick={() => handleSaveEditNiveau(niv.id)}
                                    title="Enregistrer"
                                  >
                                    <CheckIcon size={14} />
                                  </button>
                                  <button
                                    className="btn-icon cancel"
                                    onClick={() => setEditNiveauId(null)}
                                    title="Annuler"
                                  >
                                    <CloseIcon size={14} />
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <>
                                <div className="item-main">
                                  <strong>{niv.nom}</strong>
                                  <span className="badge-sub">
                                    {niv.cycle || "Général"}
                                  </span>
                                </div>
                                <div className="item-actions">
                                  <span className="badge-item">
                                    Ordre: {niv.ordre || 1}
                                  </span>
                                  <button
                                    className="btn-icon edit"
                                    onClick={() => handleStartEditNiveau(niv)}
                                    title="Modifier"
                                  >
                                    <PencilIcon size={14} />
                                  </button>
                                  <button
                                    className="btn-icon delete"
                                    onClick={() => handleDeleteNiveau(niv.id)}
                                    title="Supprimer"
                                  >
                                    <TrashIcon size={14} />
                                  </button>
                                </div>
                              </>
                            )}
                          </div>
                        ))}
                        {niveaux.length === 0 && (
                          <p className="empty-text">Aucun niveau enregistré.</p>
                        )}
                      </div>
                    </div>

                    <div className="panel-card">
                      <div className="panel-header">
                        <h3>Gestion des Classes</h3>
                      </div>
                      <form onSubmit={handleAddClass} className="compact-form">
                        <div className="form-group-row">
                          <input
                            type="text"
                            placeholder="Nom de classe (ex: 6ème A)"
                            value={newClass.nom}
                            onChange={(e) =>
                              setNewClass({ ...newClass, nom: e.target.value })
                            }
                            required
                          />
                          <select
                            value={newClass.niveauId}
                            onChange={(e) =>
                              setNewClass({
                                ...newClass,
                                niveauId: e.target.value,
                              })
                            }
                            required
                          >
                            <option value="">Sélectionner Niveau</option>
                            {niveaux.map((niv) => (
                              <option key={niv.id} value={niv.id}>
                                {niv.nom}
                              </option>
                            ))}
                          </select>
                          <button type="submit" className="btn btn-primary">
                            Ajouter
                          </button>
                        </div>
                      </form>

                      <div className="items-list">
                        {classes.map((cls) => {
                          const levelName =
                            niveaux.find((n) => n.id === cls.niveauId)?.nom ||
                            "Inconnu";
                          return (
                            <div key={cls.id} className="list-item-row">
                              {editClasseId === cls.id ? (
                                <div className="inline-edit-form">
                                  <input
                                    type="text"
                                    value={editClasseForm.nom}
                                    onChange={(e) =>
                                      setEditClasseForm({
                                        ...editClasseForm,
                                        nom: e.target.value,
                                      })
                                    }
                                    placeholder="Nom"
                                  />
                                  <select
                                    value={editClasseForm.niveauId}
                                    onChange={(e) =>
                                      setEditClasseForm({
                                        ...editClasseForm,
                                        niveauId: e.target.value,
                                      })
                                    }
                                  >
                                    <option value="">Niveau</option>
                                    {niveaux.map((n) => (
                                      <option key={n.id} value={n.id}>
                                        {n.nom}
                                      </option>
                                    ))}
                                  </select>
                                  <input
                                    type="text"
                                    value={editClasseForm.anneeScolaire}
                                    onChange={(e) =>
                                      setEditClasseForm({
                                        ...editClasseForm,
                                        anneeScolaire: e.target.value,
                                      })
                                    }
                                    placeholder="Année"
                                    style={{ width: 110 }}
                                  />
                                  <input
                                    type="number"
                                    value={editClasseForm.effectif}
                                    onChange={(e) =>
                                      setEditClasseForm({
                                        ...editClasseForm,
                                        effectif: Number(e.target.value),
                                      })
                                    }
                                    placeholder="Effectif"
                                    style={{ width: 80 }}
                                  />
                                  <div className="inline-edit-actions">
                                    <button
                                      className="btn-icon save"
                                      onClick={() =>
                                        handleSaveEditClasse(cls.id)
                                      }
                                      title="Enregistrer"
                                    >
                                      <CheckIcon size={14} />
                                    </button>
                                    <button
                                      className="btn-icon cancel"
                                      onClick={() => setEditClasseId(null)}
                                      title="Annuler"
                                    >
                                      <CloseIcon size={14} />
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                <>
                                  <div className="item-main">
                                    <strong>{cls.nom}</strong>
                                    <span className="badge-sub">
                                      Niveau: {levelName}
                                    </span>
                                  </div>
                                  <div className="item-actions">
                                    <span className="badge-item">
                                      Année: {cls.anneeScolaire}
                                    </span>
                                    <button
                                      className="btn-icon edit"
                                      onClick={() => handleStartEditClasse(cls)}
                                      title="Modifier"
                                    >
                                      <PencilIcon size={14} />
                                    </button>
                                    <button
                                      className="btn-icon delete"
                                      onClick={() => handleDeleteClasse(cls.id)}
                                      title="Supprimer"
                                    >
                                      <TrashIcon size={14} />
                                    </button>
                                  </div>
                                </>
                              )}
                            </div>
                          );
                        })}
                        {classes.length === 0 && (
                          <p className="empty-text">
                            Aucune classe enregistrée.
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeMenu === "matieres" && (
                <motion.div
                  key="matieres"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="view-container panel-card"
                >
                  <div className="panel-header">
                    <h3>Catalogue des Matières</h3>
                  </div>
                  <form onSubmit={handleAddMatiere} className="inline-add-form">
                    <div className="form-grid-three">
                      <div className="form-field">
                        <label>Nom de la matière</label>
                        <input
                          type="text"
                          placeholder="Ex: Mathématiques, Français..."
                          value={newMatiere.nom}
                          onChange={(e) =>
                            setNewMatiere({
                              ...newMatiere,
                              nom: e.target.value,
                            })
                          }
                          required
                        />
                      </div>
                      <div className="form-field">
                        <label>Code matière</label>
                        <input
                          type="text"
                          placeholder="Ex: MATH, FR"
                          value={newMatiere.code}
                          onChange={(e) =>
                            setNewMatiere({
                              ...newMatiere,
                              code: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="form-field">
                        <label>Coefficient</label>
                        <input
                          type="number"
                          value={newMatiere.coefficient}
                          onChange={(e) =>
                            setNewMatiere({
                              ...newMatiere,
                              coefficient: Number(e.target.value),
                            })
                          }
                          min="1"
                          required
                        />
                      </div>
                      <div className="form-action-btn">
                        <button type="submit" className="btn btn-primary">
                          Ajouter la matière
                        </button>
                      </div>
                    </div>
                  </form>

                  <div className="subjects-table-wrapper">
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>Code</th>
                          <th>Nom de la matière</th>
                          <th>Coefficient</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {matieres.map((m) => (
                          <tr key={m.id}>
                            {editMatiereId === m.id ? (
                              <>
                                <td>
                                  <input
                                    type="text"
                                    value={editMatiereForm.code}
                                    onChange={(e) =>
                                      setEditMatiereForm({
                                        ...editMatiereForm,
                                        code: e.target.value,
                                      })
                                    }
                                    placeholder="Code"
                                    className="inline-input"
                                  />
                                </td>
                                <td>
                                  <input
                                    type="text"
                                    value={editMatiereForm.nom}
                                    onChange={(e) =>
                                      setEditMatiereForm({
                                        ...editMatiereForm,
                                        nom: e.target.value,
                                      })
                                    }
                                    placeholder="Nom"
                                    className="inline-input"
                                  />
                                </td>
                                <td>
                                  <input
                                    type="number"
                                    value={editMatiereForm.coefficient}
                                    onChange={(e) =>
                                      setEditMatiereForm({
                                        ...editMatiereForm,
                                        coefficient: Number(e.target.value),
                                      })
                                    }
                                    min={1}
                                    className="inline-input"
                                    style={{ width: 70 }}
                                  />
                                </td>
                                <td>
                                  <div className="inline-edit-actions">
                                    <button
                                      className="btn-icon save"
                                      onClick={() =>
                                        handleSaveEditMatiere(m.id)
                                      }
                                      title="Enregistrer"
                                    >
                                      <CheckIcon size={14} />
                                    </button>
                                    <button
                                      className="btn-icon cancel"
                                      onClick={() => setEditMatiereId(null)}
                                      title="Annuler"
                                    >
                                      <CloseIcon size={14} />
                                    </button>
                                  </div>
                                </td>
                              </>
                            ) : (
                              <>
                                <td>
                                  <span className="code-badge">
                                    {m.code || "N/A"}
                                  </span>
                                </td>
                                <td>
                                  <strong>{m.nom}</strong>
                                </td>
                                <td>{m.coefficient}</td>
                                <td>
                                  <div className="inline-edit-actions">
                                    <button
                                      className="btn-icon edit"
                                      onClick={() => handleStartEditMatiere(m)}
                                      title="Modifier"
                                    >
                                      <PencilIcon size={14} />
                                    </button>
                                    <button
                                      className="btn-icon delete"
                                      onClick={() => handleDeleteMatiere(m.id)}
                                      title="Supprimer"
                                    >
                                      <TrashIcon size={14} />
                                    </button>
                                  </div>
                                </td>
                              </>
                            )}
                          </tr>
                        ))}
                        {matieres.length === 0 && (
                          <tr>
                            <td colSpan={4} className="text-center">
                              Aucune matière enregistrée.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </motion.div>
              )}

              {activeMenu === "personnel" && (
                <motion.div
                  key="personnel"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="view-container"
                >
                  <div className="grid-split-large">
                    <div className="panel-card">
                      <div className="panel-header">
                        <h3>Ajouter un collaborateur</h3>
                      </div>
                      <form onSubmit={handleAddStaff} className="vertical-form">
                        <div className="form-field">
                          <label>Nom</label>
                          <input
                            type="text"
                            value={newStaff.nom}
                            onChange={(e) =>
                              setNewStaff({ ...newStaff, nom: e.target.value })
                            }
                            required
                          />
                        </div>
                        <div className="form-field">
                          <label>Prénom</label>
                          <input
                            type="text"
                            value={newStaff.prenom}
                            onChange={(e) =>
                              setNewStaff({
                                ...newStaff,
                                prenom: e.target.value,
                              })
                            }
                            required
                          />
                        </div>
                        <div className="form-field">
                          <label>Email professionnel</label>
                          <input
                            type="email"
                            value={newStaff.email}
                            onChange={(e) =>
                              setNewStaff({
                                ...newStaff,
                                email: e.target.value,
                              })
                            }
                            required
                          />
                        </div>
                        <div className="form-field">
                          <label>Téléphone</label>
                          <input
                            type="text"
                            value={newStaff.telephone}
                            onChange={(e) =>
                              setNewStaff({
                                ...newStaff,
                                telephone: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div className="form-field">
                          <label>Rôle</label>
                          <select
                            value={newStaff.role}
                            onChange={(e) =>
                              setNewStaff({
                                ...newStaff,
                                role: e.target.value as User["role"],
                              })
                            }
                          >
                            <option value="PROFESSEUR">Professeur</option>
                            <option value="SECRETAIRE">Secrétaire</option>
                            <option value="COMPTABLE">Comptable</option>
                          </select>
                        </div>
                        <button
                          type="submit"
                          className="btn btn-primary w-full mt-4"
                        >
                          Enregistrer le collaborateur
                        </button>
                      </form>
                    </div>

                    <div className="panel-card">
                      <div className="panel-header">
                        <h3>Membres du personnel</h3>
                      </div>
                      <div className="staff-grid-list">
                        {staff.map((member) => (
                          <div key={member.id} className="staff-card-row">
                            <div className="staff-avatar-circle">
                              {member.prenom?.[0]}
                              {member.nom?.[0]}
                            </div>
                            <div className="staff-details-info">
                              <h4>
                                {member.prenom} {member.nom}
                              </h4>
                              <p className="staff-email">{member.email}</p>
                              <span
                                className={`role-pill ${member.role.toLowerCase()}`}
                              >
                                {member.role}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeMenu === "inscriptions" && (
                <motion.div
                  key="inscriptions"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="view-container"
                >
                  <div className="grid-split-large">
                    <div className="panel-card">
                      <div className="panel-header">
                        <h3>Demandes en attente de validation</h3>
                      </div>
                      <div className="admission-list-flow">
                        {admissions.map((adm) => (
                          <div
                            key={adm.id}
                            className={`admission-card-row ${selectedAdmission?.id === adm.id ? "selected" : ""}`}
                            onClick={() => setSelectedAdmission(adm)}
                          >
                            <div className="adm-avatar-circle">
                              {adm.prenom?.[0]}
                              {adm.nom?.[0]}
                            </div>
                            <div className="adm-meta">
                              <h4>
                                {adm.prenom} {adm.nom}
                              </h4>
                              <p>Parent: {adm.parentNom}</p>
                              <span className="status-badge-pending">
                                En attente
                              </span>
                            </div>
                          </div>
                        ))}
                        {admissions.length === 0 && (
                          <p className="empty-text">
                            Aucune inscription en attente.
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="panel-card">
                      <div className="panel-header">
                        <h3>Détails de la demande</h3>
                      </div>
                      {selectedAdmission ? (
                        <div className="admission-details-view">
                          <div className="details-header-large">
                            <div className="large-avatar">
                              {selectedAdmission.prenom?.[0]}
                              {selectedAdmission.nom?.[0]}
                            </div>
                            <h2>
                              {selectedAdmission.prenom} {selectedAdmission.nom}
                            </h2>
                          </div>

                          <div className="details-fields-list">
                            <p>
                              <strong>Né(e) le :</strong>{" "}
                              {selectedAdmission.dateNaissance}
                            </p>
                            <p>
                              <strong>Parent :</strong>{" "}
                              {selectedAdmission.parentNom}
                            </p>
                            <p>
                              <strong>Email :</strong> {selectedAdmission.email}
                            </p>
                            <p>
                              <strong>Téléphone :</strong>{" "}
                              {selectedAdmission.telephoneParent}
                            </p>
                          </div>

                          <div className="validation-box-action">
                            <label>Affecter à une classe pour valider :</label>
                            <select
                              value={assignClassId}
                              onChange={(e) => setAssignClassId(e.target.value)}
                              required
                            >
                              <option value="">Sélectionner une classe</option>
                              {classes.map((cls) => {
                                const lName =
                                  niveaux.find((n) => n.id === cls.niveauId)
                                    ?.nom || "";
                                return (
                                  <option key={cls.id} value={cls.id}>
                                    {cls.nom} ({lName})
                                  </option>
                                );
                              })}
                            </select>

                            <div className="action-buttons-row">
                              <button
                                className="btn btn-primary"
                                onClick={() =>
                                  handleAcceptAdmission(selectedAdmission.id)
                                }
                              >
                                <CheckIcon
                                  size={16}
                                  style={{ marginRight: "6px" }}
                                />{" "}
                                Valider l'inscription
                              </button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <p className="empty-text">
                          Sélectionnez une demande dans la liste pour voir les
                          détails et la valider.
                        </p>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}

              {activeMenu === "parametres" && (
                <motion.div
                  key="parametres"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="view-container panel-card"
                >
                  <div className="panel-header">
                    <h3>Paramètres généraux de l'établissement</h3>
                  </div>

                  <form
                    onSubmit={handleUpdateEtab}
                    className="large-form-settings"
                  >
                    <div className="form-grid-two">
                      <div className="form-field">
                        <label>Nom de l'établissement</label>
                        <input
                          type="text"
                          value={etabForm.nom}
                          onChange={(e) =>
                            setEtabForm({ ...etabForm, nom: e.target.value })
                          }
                          required
                        />
                      </div>
                      <div className="form-field">
                        <label>Type d'établissement</label>
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
                          <option value="UNIVERSITE">
                            Université / Enseignement Supérieur
                          </option>
                        </select>
                      </div>
                      <div className="form-field">
                        <label>Adresse physique</label>
                        <input
                          type="text"
                          value={etabForm.adresse}
                          onChange={(e) =>
                            setEtabForm({
                              ...etabForm,
                              adresse: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="form-field">
                        <label>Numéro de téléphone</label>
                        <input
                          type="text"
                          value={etabForm.telephone}
                          onChange={(e) =>
                            setEtabForm({
                              ...etabForm,
                              telephone: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="form-field">
                        <label>Email de contact</label>
                        <input
                          type="email"
                          value={etabForm.email}
                          onChange={(e) =>
                            setEtabForm({ ...etabForm, email: e.target.value })
                          }
                        />
                      </div>
                    </div>

                    <div className="settings-section-divider">
                      <h4>Grille de Tarification</h4>
                    </div>

                    <div className="form-grid-two">
                      <div className="form-field">
                        <label>Frais de première inscription (AR / €)</label>
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
                      <div className="form-field">
                        <label>Frais de réinscription (annuels)</label>
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

                    <div className="form-submit-row-right">
                      <button type="submit" className="btn btn-primary">
                        Enregistrer les paramètres
                      </button>
                    </div>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </div>
      </main>
    </div>
  );
}
