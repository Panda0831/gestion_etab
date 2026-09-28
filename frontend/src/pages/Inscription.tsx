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
} from "../components/icons"; // adaptez le chemin
import { post, get } from "../services/api";
import { RegisterPayload, User, ParentPayload, ElevePayload } from "../types/auth";
import { Classe } from "../types/structureScolaire";

interface Feature {
  title: string;
  desc: string;
  icon: React.ReactNode;
}

function Inscription() {
  const navigate = useNavigate();
  const { error, success, setError, setSuccess } = useAuth(() => {});

  const [step, setStep] = useState<"parent" | "eleve">("parent");
  const [parentId, setParentId] = useState<string | null>(null);
  const etablissementId = localStorage.getItem("etablissementId");

  const [classes, setClasses] = useState<Classe[]>([]);
  const [classesLoading, setClassesLoading] = useState(true);
  const [classesError, setClassesError] = useState("");
  useEffect(() => {
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
  }, []);

  // Champs parent (utilisateur)
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [email, setEmail] = useState("");
  const [telephone, setTelephone] = useState("");
  const [profession, setProfession] = useState("");
  const [parentLoading, setParentLoading] = useState(false);
  const [parentError, setParentError] = useState("");

  // Champs élève (utilisateur + entité)
  const [eleveNom, setEleveNom] = useState("");
  const [elevePrenom, setElevePrenom] = useState("");
  const [eleveEmail, setEleveEmail] = useState("");
  const [eleveTelephone, setEleveTelephone] = useState("");
  const [dateNaissance, setDateNaissance] = useState("");
  const [lieuNaissance, setLieuNaissance] = useState("");
  const [sexe, setSexe] = useState<"M" | "F">("M");
  const [classe, setClasse] = useState("");
  const [eleveLoading, setEleveLoading] = useState(false);
  const [eleveError, setEleveError] = useState("");

  // Étape 1 : création du parent (utilisateur + entité parent)
  const handleSubmitParent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!etablissementId) {
      setParentError("Etablissement ID manquant.");
      return;
    }

    setParentError("");
    setParentLoading(true);
    try {
      const generatedPassword = crypto.randomUUID();

      const registerPayload: RegisterPayload = {
        email,
        password: generatedPassword,
        motDePasse: generatedPassword,
        nom,
        prenom,
        telephone,
        role: "PARENT",
        etablissementId,
      };
      const createdUser = await post<RegisterPayload, User>("/auth/register", registerPayload, false);

      const createdParent = await post<ParentPayload, { id: string }>(
        "/parent",
        { utilisateurId: createdUser.utilisateur.id, profession },
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

  // Étape 2 : création de l'élève (utilisateur + entité élève)
  const handleSubmitEleve = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!parentId || !etablissementId) {
      setEleveError("Informations parent ou établissement manquantes");
      return;
    }

    setEleveError("");
    setEleveLoading(true);
    try {
      const matriculeTemp = "3350";
      const createdEleveUser = await post<RegisterPayload, User>(
        "/utilisateur",
        {
          email: eleveEmail,
          nom: eleveNom,
          prenom: elevePrenom,
          telephone: eleveTelephone || undefined,
          role: "ELEVE",
          etablissementId,
          motDePasse: crypto.randomUUID(),
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

      navigate("/");
    } catch (err) {
      setEleveError(err instanceof Error ? err.message : "Serveur injoignable.");
    } finally {
      setEleveLoading(false);
    }
  };

  const features: Feature[] = [
    {
      title: "Suivi Personnalisé",
      desc: "Chaque élève dispose d'un espace dédié à ses cours, ses notes et son emploi du temps.",
      icon: <UserIcon size={16} />,
    },
    {
      title: "Lien Parent-École",
      desc: "Le parent reste informé de la scolarité de son enfant en temps réel.",
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
            <h2>Rejoignez l&apos;espace élève</h2>
          </FadeIn>
          <FadeIn delay={0.3}>
            <p>
              Créez le compte du parent puis celui de l&apos;élève pour accéder
              aux cours, à l&apos;emploi du temps et au suivi pédagogique de
              votre établissement.
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
        <FadeIn delay={0.05}>
          <div className="form-header">
            <h3>Inscription Élève</h3>
            <p>
                    Déja inscrit ?{" "}
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
                ? "Renseignez d'abord les informations du parent."
                : "Renseignez maintenant les informations de l'élève."}
            </p>
          </div>
        </FadeIn>

        <AnimatePresence mode="wait">
          {step === "parent" ? (
            <motion.div
              key="parent-step"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {error && <AlertBanner type="error" message={error} />}
              {success && <AlertBanner type="success" message={success} />}
              {parentError && <AlertBanner type="error" message={parentError} />}
              {classesError && <AlertBanner type="error" message={classesError} />}

              <form onSubmit={handleSubmitParent}>
                <FadeIn delay={0.05}>
                  <div className="form-header">
                    <h4>Informations Parent</h4>
                  </div>
                </FadeIn>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                  <AnimatedInput
                    id="reg-prenom"
                    placeholder="Prénom"
                    value={prenom}
                    onChange={(e) => setPrenom(e.target.value)}
                    required
                    icon={<UserIcon />}
                    delay={0.1}
                    style={{ paddingLeft: "36px" }}
                  />
                  <AnimatedInput
                    id="reg-nom"
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
                  id="reg-email"
                  type="email"
                  placeholder="Adresse Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  icon={<MailIcon />}
                  delay={0.2}
                />

                <AnimatedInput
                  id="reg-tel"
                  type="tel"
                  placeholder="Téléphone"
                  value={telephone}
                  onChange={(e) => setTelephone(e.target.value)}
                  icon={<PhoneIcon />}
                  delay={0.25}
                />

                <AnimatedInput
                  id="reg-profession"
                  type="text"
                  placeholder="Profession"
                  value={profession}
                  onChange={(e) => setProfession(e.target.value)}
                  icon={<BriefcaseIcon />}
                  delay={0.25}
                />

                <FadeIn delay={0.35}>
                  <motion.button
                    type="submit"
                    className="btn-submit"
                    disabled={parentLoading}
                    whileHover={!parentLoading ? { scale: 1.02, boxShadow: "0 8px 24px rgba(37,99,235,0.3)" } : {}}
                    whileTap={!parentLoading ? { scale: 0.98 } : {}}
                    transition={{ type: "spring", stiffness: 400, damping: 20 }}
                  >
                    {parentLoading ? (
                      <motion.span
                        className="spinner"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                      />
                    ) : (
                      "Suivant"
                    )}
                  </motion.button>
                </FadeIn>
              </form>
            </motion.div>
          ) : (
            <motion.div
              key="eleve-step"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {eleveError && <AlertBanner type="error" message={eleveError} />}

              <form onSubmit={handleSubmitEleve}>
                <FadeIn delay={0.05}>
                  <div className="form-header">
                    <h4>Informations Élève</h4>
                  </div>
                </FadeIn>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                  <AnimatedInput
                    id="eleve-prenom"
                    placeholder="Prénom"
                    value={elevePrenom}
                    onChange={(e) => setElevePrenom(e.target.value)}
                    required
                    icon={<UserIcon />}
                    delay={0.1}
                    style={{ paddingLeft: "36px" }}
                  />
                  <AnimatedInput
                    id="eleve-nom"
                    placeholder="Nom"
                    value={eleveNom}
                    onChange={(e) => setEleveNom(e.target.value)}
                    required
                    icon={<UserIcon />}
                    delay={0.15}
                    style={{ paddingLeft: "36px" }}
                  />
                </div>

                <AnimatedInput
                  id="eleve-email"
                  type="email"
                  placeholder="Email de l'élève"
                  value={eleveEmail}
                  onChange={(e) => setEleveEmail(e.target.value)}
                  required
                  icon={<MailIcon />}
                  delay={0.2}
                />

                <AnimatedInput
                  id="eleve-tel"
                  type="tel"
                  placeholder="Téléphone (optionnel)"
                  value={eleveTelephone}
                  onChange={(e) => setEleveTelephone(e.target.value)}
                  icon={<PhoneIcon />}
                  delay={0.25}
                />

                <AnimatedInput
                  id="eleve-date-naissance"
                  type="date"
                  placeholder="Date de naissance"
                  value={dateNaissance}
                  onChange={(e) => setDateNaissance(e.target.value)}
                  required
                  icon={<CalendarIcon />}
                  delay={0.2}
                />

                <AnimatedInput
                  id="eleve-lieu-naissance"
                  placeholder="Lieu de naissance"
                  value={lieuNaissance}
                  onChange={(e) => setLieuNaissance(e.target.value)}
                  required
                  icon={<MapPinIcon />}
                  delay={0.25}
                />

                <AnimatedSelect
                  id="eleve-sexe"
                  value={sexe}
                  onChange={(e) => setSexe(e.target.value as "M" | "F")}
                  required
                  delay={0.3}
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
                  delay={0.35}
                  label="Classe"
                >
                  <option value="" disabled>
                    {classesLoading ? "Chargement des classes..." : "Sélectionnez une classe"}
                  </option>
                  {classes.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.nom} ({c.anneeScolaire})
                    </option>
                  ))}
                </AnimatedSelect>

                <FadeIn delay={0.4}>
                  <motion.button
                    type="submit"
                    className="btn-submit"
                    disabled={eleveLoading}
                    whileHover={!eleveLoading ? { scale: 1.02, boxShadow: "0 8px 24px rgba(37,99,235,0.3)" } : {}}
                    whileTap={!eleveLoading ? { scale: 0.98 } : {}}
                    transition={{ type: "spring", stiffness: 400, damping: 20 }}
                  >
                    {eleveLoading ? (
                      <motion.span
                        className="spinner"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                      />
                    ) : (
                      "Inscrire l'élève"
                    )}
                  </motion.button>
                </FadeIn>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

export default Inscription;