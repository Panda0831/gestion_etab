import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { FadeIn } from "../components/ui/Motion";
import AnimatedInput from "../components/ui/AnimatedInput";
import AnimatedSelect from "../components/ui/AnimatedSelect";
import AlertBanner from "../components/ui/AlertBanner";
import FloatingParticle, { particles } from "../components/ui/FloatingParticle";
import {
  MailIcon,
  UserIcon,
  PhoneIcon,
  BriefcaseIcon,
  CalendarIcon,
  MapPinIcon,
  LockIcon,
} from "../components/icons";
import { post, get } from "../services/api";
import { RegisterPayload, User, ParentPayload, ElevePayload } from "../types/auth";
import { Classe } from "../types/structureScolaire";

interface Feature {
  title: string;
  desc: string;
  icon: React.ReactNode;
}

// Les rôles disponibles dans la liste déroulante (SANS eleve et parent)
type RoleSelection = "DIRECTEUR" | "SECRETAIRE" | "COMPTABLE" | "PROFESSEUR";
type InscriptionType = RoleSelection | "eleve_parent" | null;

function Inscription() {
  const navigate = useNavigate();
  const { error, success, setError, setSuccess } = useAuth(() => {});

  const [type, setType] = useState<InscriptionType>(null);
  const etablissementId = localStorage.getItem("etablissementId");

  // ───────── Formulaire Personnel (Directeur, Secrétaire, Comptable, Professeur) ─────────
  const [roleSelection, setRoleSelection] = useState<RoleSelection | "">("");
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [email, setEmail] = useState("");
  const [telephone, setTelephone] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const [confirmMotDePasse, setConfirmMotDePasse] = useState("");
  const [staffLoading, setStaffLoading] = useState(false);
  const [staffError, setStaffError] = useState("");

  // ───────── Parcours Élève / Parent ─────────
  const [step, setStep] = useState<"parent" | "eleve">("parent");
  const [parentId, setParentId] = useState<string | null>(null);

  // Champs Parent
  const [parentNom, setParentNom] = useState("");
  const [parentPrenom, setParentPrenom] = useState("");
  const [parentEmail, setParentEmail] = useState("");
  const [parentTelephone, setParentTelephone] = useState("");
  const [parentProfession, setParentProfession] = useState("");
  const [parentMotDePasse, setParentMotDePasse] = useState("");
  const [parentConfirmMotDePasse, setParentConfirmMotDePasse] = useState("");
  const [parentLoading, setParentLoading] = useState(false);
  const [parentError, setParentError] = useState("");

  // Champs Élève
  const [eleveNom, setEleveNom] = useState("");
  const [elevePrenom, setElevePrenom] = useState("");
  const [eleveEmail, setEleveEmail] = useState("");
  const [eleveTelephone, setEleveTelephone] = useState("");
  const [eleveMotDePasse, setEleveMotDePasse] = useState("");
  const [eleveConfirmMotDePasse, setEleveConfirmMotDePasse] = useState("");
  const [dateNaissance, setDateNaissance] = useState("");
  const [lieuNaissance, setLieuNaissance] = useState("");
  const [sexe, setSexe] = useState<"M" | "F">("M");
  const [classe, setClasse] = useState("");
  const [eleveLoading, setEleveLoading] = useState(false);
  const [eleveError, setEleveError] = useState("");

  const [classes, setClasses] = useState<Classe[]>([]);
  const [classesLoading, setClassesLoading] = useState(true);
  const [classesError, setClassesError] = useState("");

  useEffect(() => {
    if (type !== "eleve_parent") return;
    const fetchClasses = async () => {
      try {
        const data = await get<Classe[]>("/classe", false);
        setClasses(data);
      } catch (err) {
        setClassesError(err instanceof Error ? err.message : "Impossible de charger les classes.");
      } finally {
        setClassesLoading(false);
      }
    };
    fetchClasses();
  }, [type]);

  // ───────── Soumission Personnel ─────────
  const handleSubmitStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!etablissementId || !roleSelection) {
      setStaffError("Établissement ou rôle manquant.");
      return;
    }
    if (motDePasse.length < 6) {
      setStaffError("Le mot de passe doit contenir au moins 6 caractères.");
      return;
    }
    if (motDePasse !== confirmMotDePasse) {
      setStaffError("Les mots de passe ne correspondent pas.");
      return;
    }

    setStaffError("");
    setStaffLoading(true);
    try {
      const registerPayload: RegisterPayload = {
        email,
        password: motDePasse,
        motDePasse,
        nom,
        prenom,
        telephone,
        role: roleSelection,
        etablissementId,
      };
      await post<RegisterPayload, User>("/auth/register", registerPayload, false);

      setSuccess("Compte créé avec succès !");
      setTimeout(() => navigate("/"), 2000);
    } catch (err) {
      setStaffError(err instanceof Error ? err.message : "Serveur injoignable.");
    } finally {
      setStaffLoading(false);
    }
  };

  // ───────── Soumission Parent ─────────
  const handleSubmitParent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!etablissementId) {
      setParentError("Établissement ID manquant.");
      return;
    }
    if (parentMotDePasse.length < 6) {
      setParentError("Le mot de passe doit contenir au moins 6 caractères.");
      return;
    }
    if (parentMotDePasse !== parentConfirmMotDePasse) {
      setParentError("Les mots de passe ne correspondent pas.");
      return;
    }

    setParentError("");
    setParentLoading(true);
    try {
      const registerPayload: RegisterPayload = {
        email: parentEmail,
        password: parentMotDePasse,
        motDePasse: parentMotDePasse,
        nom: parentNom,
        prenom: parentPrenom,
        telephone: parentTelephone,
        role: "PARENT",
        etablissementId,
      };
      const createdUser = await post<RegisterPayload, User>("/auth/register", registerPayload, false);

      const createdParent = await post<ParentPayload, { id: string }>(
        "/parent",
        { utilisateurId: createdUser.utilisateur.id, profession: parentProfession },
        false
      );
      setParentId(createdParent.id);
      setStep("eleve");
    } catch (err) {
      setParentError(err instanceof Error ? err.message : "Serveur injoignable.");
    } finally {
      setParentLoading(false);
    }
  };

  // ───────── Soumission Élève ─────────
  const handleSubmitEleve = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!parentId || !etablissementId) {
      setEleveError("Informations parent ou établissement manquantes.");
      return;
    }
    if (eleveMotDePasse.length < 6) {
      setEleveError("Le mot de passe de l'élève doit contenir au moins 6 caractères.");
      return;
    }
    if (eleveMotDePasse !== eleveConfirmMotDePasse) {
      setEleveError("Les mots de passe de l'élève ne correspondent pas.");
      return;
    }

    setEleveError("");
    setEleveLoading(true);
    try {
      const matriculeTemp = "3350";
      const createdEleveUser = await post<any, User>(
        "/utilisateur",
        {
          email: eleveEmail,
          nom: eleveNom,
          prenom: elevePrenom,
          telephone: eleveTelephone || undefined,
          role: "ELEVE",
          etablissementId,
          motDePasse: eleveMotDePasse,
        },
        false
      );

      const elevePayload: ElevePayload = {
        utilisateurId: createdEleveUser.id,
        classeId: classe,
        parentId: parentId,
        dateNaissance,
        lieuNaissance,
        sexe,
        matricule: matriculeTemp,
      };
      await post<ElevePayload, any>("/eleve", elevePayload, false);

      setSuccess("Inscription de l'élève et du parent terminée avec succès !");
      setTimeout(() => navigate("/"), 2000);
    } catch (err) {
      setEleveError(err instanceof Error ? err.message : "Serveur injoignable.");
    } finally {
      setEleveLoading(false);
    }
  };

  // ───────── Panneau gauche ─────────
  const featuresByType: Record<RoleSelection, Feature[]> = {
    DIRECTEUR: [
      {
        title: "Gestion Complète",
        desc: "Supervisez l'ensemble de l'établissement depuis un tableau de bord centralisé.",
        icon: <BriefcaseIcon />,
      },
      {
        title: "Statistiques",
        desc: "Accédez aux statistiques détaillées de votre établissement.",
        icon: <CalendarIcon />,
      },
    ],
    SECRETAIRE: [
      {
        title: "Gestion Administrative",
        desc: "Gérez les inscriptions, les dossiers élèves et le personnel.",
        icon: <BriefcaseIcon />,
      },
      {
        title: "Documents Officiels",
        desc: "Émettez certificats, attestations et documents administratifs.",
        icon: <CalendarIcon />,
      },
    ],
    COMPTABLE: [
      {
        title: "Gestion Financière",
        desc: "Suivez les paiements, les factures et les bourses.",
        icon: <BriefcaseIcon />,
      },
      {
        title: "Rapports",
        desc: "Générez des rapports financiers détaillés.",
        icon: <CalendarIcon />,
      },
    ],
    PROFESSEUR: [
      {
        title: "Publication de Cours",
        desc: "Partagez vos supports de cours, vidéos et documents avec vos classes.",
        icon: <BriefcaseIcon />,
      },
      {
        title: "Suivi du Calendrier",
        desc: "Gérez vos classes et votre emploi du temps en un seul endroit.",
        icon: <CalendarIcon />,
      },
    ],
  };

  const features =
    type && type !== "eleve_parent" && type !== null
      ? featuresByType[type as RoleSelection]
      : [
          {
            title: "Suivi Personnalisé",
            desc: "Accédez aux cours, aux notes et à l'emploi du temps en temps réel.",
            icon: <UserIcon size={16} />,
          },
          {
            title: "Lien Parent-École",
            desc: "Le parent reste informé de la scolarité de son enfant au quotidien.",
            icon: <CalendarIcon />,
          },
        ];

  return (
    <motion.div
      className="portal-card"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* ═══════ LEFT PANEL – Branding ═══════ */}
      <div className="portal-info-panel">
        {particles.map((p, i) => (
          <FloatingParticle key={i} {...p} />
        ))}

        <FadeIn delay={0.1} className="info-header">
          <motion.div
            className="logo-crest"
            whileHover={{ rotate: [0, -8, 8, -4, 0], scale: 1.05 }}
            transition={{ duration: 0.5 }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z" />
              <path d="M6 6h10" />
              <path d="M6 10h10" />
            </svg>
          </motion.div>
          <span className="brand-name">EduGest</span>
        </FadeIn>

        <div className="info-main">
          <FadeIn delay={0.2}>
            <h2>
              {type === "eleve_parent"
                ? "Espace Élève & Parent"
                : type === "PROFESSEUR"
                ? "Espace Enseignant"
                : type === "DIRECTEUR"
                ? "Espace Direction"
                : type === "SECRETAIRE"
                ? "Espace Secrétariat"
                : type === "COMPTABLE"
                ? "Espace Comptabilité"
                : "Rejoignez votre établissement"}
            </h2>
          </FadeIn>
          <FadeIn delay={0.3}>
            <p>
              {type === "eleve_parent"
                ? "Créez le compte parent et élève pour accéder aux cours et au suivi pédagogique."
                : "Créez votre compte sécurisé pour accéder à votre espace de travail."}
            </p>
          </FadeIn>

          <div className="info-features">
            {features.map((f, i) => (
              <FadeIn key={f.title} delay={0.4 + i * 0.15}>
                <motion.div
                  className="feature-item"
                  whileHover={{ x: 6 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <div className="feature-icon-wrapper">{f.icon}</div>
                  <div className="feature-text">
                    <h4>{f.title}</h4>
                    <p>{f.desc}</p>
                  </div>
                </motion.div>
              </FadeIn>
            ))}
          </div>
        </div>

        <FadeIn delay={0.7} className="info-footer">
          <span>© {new Date().getFullYear()} EduGest Inc.</span>
          <span>v1.0.0</span>
        </FadeIn>
      </div>

      {/* ═══════ RIGHT PANEL – Form ═══════ */}
      <div className="portal-form-panel">
        <AnimatePresence mode="wait">
          {/* ── Choix initial ── */}
          {type === null && (
            <motion.div
              key="choix"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <FadeIn delay={0.05}>
                <div className="form-header">
                  <h3>Créer un compte</h3>
                  <p>Sélectionnez votre profil pour commencer l'inscription.</p>
                </div>
              </FadeIn>

              {/* Sélection du rôle administratif ou enseignant */}
              <FadeIn delay={0.1}>
                <AnimatedSelect
                  id="role-select"
                  value={roleSelection}
                  onChange={(e) => {
                    const val = e.target.value as RoleSelection;
                    setRoleSelection(val);
                    setType(val);
                  }}
                  required
                  delay={0.15}
                  label="Personnel & Enseignants"
                >
                  <option value="" disabled>
                    Choisir un rôle professionnel
                  </option>
                  <option value="DIRECTEUR">Directeur</option>
                  <option value="SECRETAIRE">Secrétaire</option>
                  <option value="COMPTABLE">Comptable</option>
                  <option value="PROFESSEUR">Professeur</option>
                </AnimatedSelect>
              </FadeIn>

              <div style={{ margin: "20px 0", textAlign: "center", color: "#94a3b8", fontSize: "14px" }}>
                ── OU ──
              </div>

              <FadeIn delay={0.2}>
                <motion.button
                  type="button"
                  className="btn-submit"
                  onClick={() => setType("eleve_parent")}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Inscription Élève & Parent
                </motion.button>
              </FadeIn>
            </motion.div>
          )}

          {/* ── Formulaire Personnel (Directeur, Secrétaire, Comptable, Professeur) ── */}
          {type !== null && type !== "eleve_parent" && (
            <motion.div
              key="staff-form"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <FadeIn delay={0.05}>
                <div className="form-header">
                  <h3>Inscription {type.charAt(0) + type.slice(1).toLowerCase()}</h3>
                  <p>
                    Déja inscrit(e) ?{" "}
                    <motion.span
                      className="form-toggle-link"
                      onClick={() => navigate("/inscription")}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Se connecter
                    </motion.span>
                  </p>
                  <p>Renseignez vos informations et choisissez un mot de passe.</p>
                </div>
              </FadeIn>

              {staffError && <AlertBanner type="error" message={staffError} />}
              {error && <AlertBanner type="error" message={error} />}
              {success && <AlertBanner type="success" message={success} />}

              <form onSubmit={handleSubmitStaff}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                  <AnimatedInput
                    id="staff-prenom"
                    placeholder="Prénom"
                    value={prenom}
                    onChange={(e) => setPrenom(e.target.value)}
                    required
                    icon={<UserIcon />}
                    delay={0.1}
                    style={{ paddingLeft: "36px" }}
                  />
                  <AnimatedInput
                    id="staff-nom"
                    placeholder="Nom"
                    value={nom}
                    onChange={(e) => setNom(e.target.value)}
                    required
                    icon={<UserIcon />}
                    delay={0.15}
                    style={{ paddingLeft: "36px" }}
                  />
                </div>

                <AnimatedInput
                  id="staff-email"
                  type="email"
                  placeholder="Adresse Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  icon={<MailIcon />}
                  delay={0.2}
                />

                <AnimatedInput
                  id="staff-tel"
                  type="tel"
                  placeholder="Téléphone"
                  value={telephone}
                  onChange={(e) => setTelephone(e.target.value)}
                  icon={<PhoneIcon />}
                  delay={0.25}
                />

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                  <AnimatedInput
                    id="staff-password"
                    type="password"
                    placeholder="Mot de passe"
                    value={motDePasse}
                    onChange={(e) => setMotDePasse(e.target.value)}
                    required
                    icon={<LockIcon />}
                    delay={0.3}
                    style={{ paddingLeft: "36px" }}
                  />
                  <AnimatedInput
                    id="staff-confirm-password"
                    type="password"
                    placeholder="Confirmer"
                    value={confirmMotDePasse}
                    onChange={(e) => setConfirmMotDePasse(e.target.value)}
                    required
                    icon={<LockIcon />}
                    delay={0.35}
                    style={{ paddingLeft: "36px" }}
                  />
                </div>

                <FadeIn delay={0.4}>
                  <motion.span
                    className="form-toggle-link"
                    onClick={() => {
                      setType(null);
                      setRoleSelection("");
                      setNom("");
                      setPrenom("");
                      setEmail("");
                      setTelephone("");
                      setMotDePasse("");
                      setConfirmMotDePasse("");
                      setStaffError("");
                    }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    style={{ display: "inline-block", marginBottom: "12px", cursor: "pointer" }}
                  >
                    ← Changer de profil
                  </motion.span>
                </FadeIn>

                <FadeIn delay={0.45}>
                  <motion.button
                    type="submit"
                    className="btn-submit"
                    disabled={staffLoading}
                    whileHover={!staffLoading ? { scale: 1.02 } : {}}
                    whileTap={!staffLoading ? { scale: 0.98 } : {}}
                  >
                    {staffLoading ? (
                      <motion.span
                        className="spinner"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                      />
                    ) : (
                      "Créer mon compte"
                    )}
                  </motion.button>
                </FadeIn>
              </form>
            </motion.div>
          )}

          {/* ── Parcours Élève / Parent ── */}
          {type === "eleve_parent" && (
            <motion.div
              key={step === "parent" ? "parent-step" : "eleve-step"}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <FadeIn delay={0.05}>
                
                <div className="form-header">
                  <h3>{step === "parent" ? "Étape 1 : Compte Parent" : "Étape 2 : Compte Élève"}</h3>
                  <p>
                    Déja inscrit(e) ?{" "}
                    <motion.span
                      className="form-toggle-link"
                      onClick={() => navigate("/")}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Se connecter
                    </motion.span>
                  </p>
                  <p>
                    {step === "parent"
                      ? "Renseignez les informations et le mot de passe du parent."
                      : "Renseignez les informations et le mot de passe de l'élève."}
                  </p>
                </div>
              </FadeIn>

              {/* Étape 1 : Parent */}
              {step === "parent" ? (
                <>
                  {parentError && <AlertBanner type="error" message={parentError} />}

                  <form onSubmit={handleSubmitParent}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                      <AnimatedInput
                        id="parent-prenom"
                        placeholder="Prénom"
                        value={parentPrenom}
                        onChange={(e) => setParentPrenom(e.target.value)}
                        required
                        icon={<UserIcon />}
                        delay={0.1}
                        style={{ paddingLeft: "36px" }}
                      />
                      <AnimatedInput
                        id="parent-nom"
                        placeholder="Nom"
                        value={parentNom}
                        onChange={(e) => setParentNom(e.target.value)}
                        required
                        icon={<UserIcon />}
                        delay={0.15}
                        style={{ paddingLeft: "36px" }}
                      />
                    </div>

                    <AnimatedInput
                      id="parent-email"
                      type="email"
                      placeholder="Adresse Email du Parent"
                      value={parentEmail}
                      onChange={(e) => setParentEmail(e.target.value)}
                      required
                      icon={<MailIcon />}
                      delay={0.2}
                    />

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                      <AnimatedInput
                        id="parent-tel"
                        type="tel"
                        placeholder="Téléphone"
                        value={parentTelephone}
                        onChange={(e) => setParentTelephone(e.target.value)}
                        icon={<PhoneIcon />}
                        delay={0.25}
                        style={{ paddingLeft: "36px" }}
                      />
                      <AnimatedInput
                        id="parent-profession"
                        type="text"
                        placeholder="Profession"
                        value={parentProfession}
                        onChange={(e) => setParentProfession(e.target.value)}
                        icon={<BriefcaseIcon />}
                        delay={0.25}
                        style={{ paddingLeft: "36px" }}
                      />
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                      <AnimatedInput
                        id="parent-pass"
                        type="password"
                        placeholder="Mot de passe"
                        value={parentMotDePasse}
                        onChange={(e) => setParentMotDePasse(e.target.value)}
                        required
                        icon={<LockIcon />}
                        delay={0.3}
                        style={{ paddingLeft: "36px" }}
                      />
                      <AnimatedInput
                        id="parent-confirm-pass"
                        type="password"
                        placeholder="Confirmer"
                        value={parentConfirmMotDePasse}
                        onChange={(e) => setParentConfirmMotDePasse(e.target.value)}
                        required
                        icon={<LockIcon />}
                        delay={0.35}
                        style={{ paddingLeft: "36px" }}
                      />
                    </div>

                    <FadeIn delay={0.4}>
                      <motion.span
                        className="form-toggle-link"
                        onClick={() => {
                          setType(null);
                          setStep("parent");
                          setParentError("");
                        }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        style={{ display: "inline-block", marginBottom: "12px", cursor: "pointer" }}
                      >
                        ← Retour au choix du profil
                      </motion.span>
                    </FadeIn>

                    <FadeIn delay={0.45}>
                      <motion.button
                        type="submit"
                        className="btn-submit"
                        disabled={parentLoading}
                        whileHover={!parentLoading ? { scale: 1.02 } : {}}
                        whileTap={!parentLoading ? { scale: 0.98 } : {}}
                      >
                        {parentLoading ? (
                          <motion.span
                            className="spinner"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                          />
                        ) : (
                          "Suivant : Informations de l'élève"
                        )}
                      </motion.button>
                    </FadeIn>
                  </form>
                </>
              ) : (
                /* Étape 2 : Élève */
                <>
                  {eleveError && <AlertBanner type="error" message={eleveError} />}
                  {classesError && <AlertBanner type="error" message={classesError} />}
                  {success && <AlertBanner type="success" message={success} />}

                  <form onSubmit={handleSubmitEleve}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                      <AnimatedInput
                        id="eleve-prenom"
                        placeholder="Prénom de l'élève"
                        value={elevePrenom}
                        onChange={(e) => setElevePrenom(e.target.value)}
                        required
                        icon={<UserIcon />}
                        delay={0.1}
                        style={{ paddingLeft: "36px" }}
                      />
                      <AnimatedInput
                        id="eleve-nom"
                        placeholder="Nom de l'élève"
                        value={eleveNom}
                        onChange={(e) => setEleveNom(e.target.value)}
                        required
                        icon={<UserIcon />}
                        delay={0.15}
                        style={{ paddingLeft: "36px" }}
                      />
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                      <AnimatedInput
                        id="eleve-email"
                        type="email"
                        placeholder="Email de l'élève"
                        value={eleveEmail}
                        onChange={(e) => setEleveEmail(e.target.value)}
                        required
                        icon={<MailIcon />}
                        delay={0.2}
                        style={{ paddingLeft: "36px" }}
                      />
                      <AnimatedInput
                        id="eleve-tel"
                        type="tel"
                        placeholder="Téléphone (optionnel)"
                        value={eleveTelephone}
                        onChange={(e) => setEleveTelephone(e.target.value)}
                        icon={<PhoneIcon />}
                        delay={0.25}
                        style={{ paddingLeft: "36px" }}
                      />
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                      <AnimatedInput
                        id="eleve-pass"
                        type="password"
                        placeholder="Mot de passe élève"
                        value={eleveMotDePasse}
                        onChange={(e) => setEleveMotDePasse(e.target.value)}
                        required
                        icon={<LockIcon />}
                        delay={0.3}
                        style={{ paddingLeft: "36px" }}
                      />
                      <AnimatedInput
                        id="eleve-confirm-pass"
                        type="password"
                        placeholder="Confirmer mot de passe"
                        value={eleveConfirmMotDePasse}
                        onChange={(e) => setEleveConfirmMotDePasse(e.target.value)}
                        required
                        icon={<LockIcon />}
                        delay={0.35}
                        style={{ paddingLeft: "36px" }}
                      />
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                      <AnimatedInput
                        id="eleve-date-naissance"
                        type="date"
                        placeholder="Date de naissance"
                        value={dateNaissance}
                        onChange={(e) => setDateNaissance(e.target.value)}
                        required
                        icon={<CalendarIcon />}
                        delay={0.4}
                        style={{ paddingLeft: "36px" }}
                      />
                      <AnimatedInput
                        id="eleve-lieu-naissance"
                        placeholder="Lieu de naissance"
                        value={lieuNaissance}
                        onChange={(e) => setLieuNaissance(e.target.value)}
                        required
                        icon={<MapPinIcon />}
                        delay={0.45}
                        style={{ paddingLeft: "36px" }}
                      />
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                      <AnimatedSelect
                        id="eleve-sexe"
                        value={sexe}
                        onChange={(e) => setSexe(e.target.value as "M" | "F")}
                        required
                        delay={0.5}
                        label="Sexe"
                      >
                        <option value="M">Masculin</option>
                        <option value="F">Féminin</option>
                      </AnimatedSelect>

                      <AnimatedSelect
                        id="eleve-classe"
                        value={classe}
                        onChange={(e) => setClasse(e.target.value)}
                        required
                        delay={0.55}
                        label="Classe"
                      >
                        <option value="" disabled>
                          {classesLoading ? "Chargement..." : "Sélectionner la classe"}
                        </option>
                        {classes.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.nom} ({c.anneeScolaire})
                          </option>
                        ))}
                      </AnimatedSelect>
                    </div>

                    <FadeIn delay={0.6}>
                      <motion.button
                        type="submit"
                        className="btn-submit"
                        disabled={eleveLoading}
                        whileHover={!eleveLoading ? { scale: 1.02 } : {}}
                        whileTap={!eleveLoading ? { scale: 0.98 } : {}}
                      >
                        {eleveLoading ? (
                          <motion.span
                            className="spinner"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                          />
                        ) : (
                          "Finaliser l'inscription"
                        )}
                      </motion.button>
                    </FadeIn>
                  </form>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

export default Inscription;