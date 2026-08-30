import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../hooks/useAuth";
import { FadeIn } from "./ui/Motion";
import AnimatedInput from "./ui/AnimatedInput";
import AnimatedSelect from "./ui/AnimatedSelect";
import AlertBanner from "./ui/AlertBanner";
import FloatingParticle, { particles } from "./ui/FloatingParticle";
import { MailIcon, LockIcon, PhoneIcon, UserIcon, EyeIcon, EyeOffIcon, CalendarIcon } from "./icons";
import { Role, User } from "../types/auth";

interface Feature {
  title: string;
  desc: string;
  icon: React.ReactNode;
}

interface LoginProps {
  onLoginSuccess: (token: string) => void;
  onLogout: () => void;
  currentUser: User | null;
}

function Login({ onLoginSuccess, onLogout, currentUser }: LoginProps) {
  const [isRegister, setIsRegister] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { loading, error, success, etablissements, login, register, setError, setSuccess } =
    useAuth(onLoginSuccess);

  // Login fields
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Register fields
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regNom, setRegNom] = useState("");
  const [regPrenom, setRegPrenom] = useState("");
  const [regTelephone, setRegTelephone] = useState("");
  const [regRole, setRegRole] = useState<Role>("PROFESSEUR");
  const [regEtablissement, setRegEtablissement] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    await login({
      email: loginEmail,
      password: loginPassword,
    });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    const ok = await register({
      email: regEmail,
      password: regPassword,
      nom: regNom,
      prenom: regPrenom,
      telephone: regTelephone,
      role: regRole,
      etablissementId: regEtablissement,
    });
    if (ok) {
      setIsRegister(false);
      setLoginEmail(regEmail);
    }
  };

  const switchToRegister = () => {
    setIsRegister(true);
    setError("");
    setSuccess("");
  };

  const switchToLogin = () => {
    setIsRegister(false);
    setError("");
    setSuccess("");
  };

  const features: Feature[] = [
    {
      title: "Espace Multi-Rôles",
      desc: "Accès dédié pour Directeurs, Professeurs, Secrétaires, Parents et Élèves.",
      icon: <UserIcon size={16} />,
    },
    {
      title: "Suivi du Calendrier",
      desc: "Gestion en temps réel des emplois du temps et des événements.",
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
            <h2>Gestion administrative &amp; pédagogique simplifiée</h2>
          </FadeIn>
          <FadeIn delay={0.3}>
            <p>
              Bienvenue sur le portail d&apos;administration de votre établissement.
              Connectez-vous pour accéder à vos classes, votre emploi du temps et
              vos outils de communication.
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
          {currentUser ? (
            <motion.div
              key="profile"
              className="profile-card"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              <motion.div
                className="profile-avatar"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}
              >
                <UserIcon size={40} />
              </motion.div>
              <FadeIn delay={0.15}>
                <h3 className="profile-name">{currentUser.prenom} {currentUser.nom}</h3>
              </FadeIn>
              <FadeIn delay={0.2}>
                <motion.span
                  className="profile-role"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", delay: 0.25 }}
                >
                  {currentUser.role}
                </motion.span>
              </FadeIn>
              <FadeIn delay={0.3}>
                <div className="profile-details">
                  <div className="detail-row">
                    <span className="detail-label">Email</span>
                    <span className="detail-value">{currentUser.email}</span>
                  </div>
                  {currentUser.etablissement && (
                    <div className="detail-row">
                      <span className="detail-label">Établissement</span>
                      <span className="detail-value">
                        {typeof currentUser.etablissement === "object"
                          ? currentUser.etablissement.nom
                          : currentUser.etablissement}
                      </span>
                    </div>
                  )}
                  {currentUser.id && (
                    <div className="detail-row">
                      <span className="detail-label">Identifiant</span>
                      <span className="detail-value" style={{ fontSize: "12px", fontFamily: "monospace" }}>
                        {currentUser.id}
                      </span>
                    </div>
                  )}
                </div>
              </FadeIn>
              <FadeIn delay={0.4}>
                <motion.button
                  className="btn-secondary"
                  onClick={onLogout}
                  whileHover={{ scale: 1.02, backgroundColor: "#e2e8f0" }}
                  whileTap={{ scale: 0.98 }}
                >
                  Se déconnecter
                </motion.button>
              </FadeIn>
            </motion.div>
          ) : !isRegister ? (
            <motion.div
              key="login"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              <FadeIn delay={0.05}>
                <div className="form-header">
                  <h3>Espace de Connexion</h3>
                  <p>
                    Pas encore de compte ?{" "}
                    <motion.span
                      className="form-toggle-link"
                      onClick={switchToRegister}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Créer un compte
                    </motion.span>
                  </p>
                </div>
              </FadeIn>

              {error && <AlertBanner type="error" message={error} />}
              {success && <AlertBanner type="success" message={success} />}

              <form onSubmit={handleLogin}>
                <AnimatedInput
                  id="login-email"
                  type="email"
                  placeholder="Adresse Email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  required
                  icon={<MailIcon />}
                  delay={0.1}
                />

                <AnimatedInput
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Mot de passe"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  required
                  icon={<LockIcon />}
                  delay={0.15}
                  rightElement={
                    <motion.button
                      type="button"
                      className="input-toggle-password"
                      onClick={() => setShowPassword(!showPassword)}
                      whileHover={{ scale: 1.15 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                    </motion.button>
                  }
                />

                <FadeIn delay={0.2}>
                  <div className="form-actions">
                    <label className="remember-me">
                      <input type="checkbox" />
                      Se souvenir de moi
                    </label>
                    <a href="#forgot" className="forgot-password-link">
                      Mot de passe oublié ?
                    </a>
                  </div>
                </FadeIn>

                <FadeIn delay={0.3}>
                  <motion.button
                    type="submit"
                    className="btn-submit"
                    disabled={loading}
                    whileHover={!loading ? { scale: 1.02, boxShadow: "0 8px 24px rgba(37,99,235,0.3)" } : {}}
                    whileTap={!loading ? { scale: 0.98 } : {}}
                    transition={{ type: "spring", stiffness: 400, damping: 20 }}
                  >
                    {loading ? (
                      <motion.span
                        className="spinner"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                      />
                    ) : (
                      "Se connecter"
                    )}
                  </motion.button>
                </FadeIn>
              </form>
            </motion.div>
          ) : (
            <motion.div
              key="register"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              <FadeIn delay={0.05}>
                <div className="form-header">
                  <h3>Créer un Compte</h3>
                  <p>
                    Déjà inscrit ?{" "}
                    <motion.span
                      className="form-toggle-link"
                      onClick={switchToLogin}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Se connecter
                    </motion.span>
                  </p>
                </div>
              </FadeIn>

              {error && <AlertBanner type="error" message={error} />}

              <form onSubmit={handleRegister}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                  <AnimatedInput
                    id="reg-prenom"
                    placeholder="Prénom"
                    value={regPrenom}
                    onChange={(e) => setRegPrenom(e.target.value)}
                    required
                    icon={<UserIcon />}
                    delay={0.1}
                  />
                  <AnimatedInput
                    id="reg-nom"
                    placeholder="Nom"
                    value={regNom}
                    onChange={(e) => setRegNom(e.target.value)}
                    required
                    icon={<UserIcon />}
                    delay={0.15}
                  />
                </div>

                <AnimatedInput
                  id="reg-email"
                  type="email"
                  placeholder="Adresse Email"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  required
                  icon={<MailIcon />}
                  delay={0.2}
                />

                <AnimatedInput
                  id="reg-password"
                  type="password"
                  placeholder="Mot de passe"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  required
                  icon={<LockIcon />}
                  delay={0.25}
                />

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                  <AnimatedSelect
                    id="reg-role"
                    value={regRole}
                    onChange={(e) => setRegRole(e.target.value as Role)}
                    required
                    delay={0.3}
                    label="Rôle"
                  >
                    <option value="DIRECTEUR">Directeur</option>
                    <option value="SECRETAIRE">Secrétaire</option>
                    <option value="COMPTABLE">Comptable</option>
                    <option value="PROFESSEUR">Professeur</option>
                    <option value="ELEVE">Élève</option>
                    <option value="PARENT">Parent</option>
                  </AnimatedSelect>

                  <AnimatedSelect
                    id="reg-etablissement"
                    value={regEtablissement}
                    onChange={(e) => setRegEtablissement(e.target.value)}
                    required
                    delay={0.35}
                    label="Établissement"
                  >
                    <option value="">Sélectionnez...</option>
                    {etablissements.map((etab) => (
                      <option key={etab.id} value={etab.id}>{etab.nom}</option>
                    ))}
                  </AnimatedSelect>
                </div>

                <AnimatedInput
                  id="reg-tel"
                  type="tel"
                  placeholder="Téléphone"
                  value={regTelephone}
                  onChange={(e) => setRegTelephone(e.target.value)}
                  icon={<PhoneIcon />}
                  delay={0.4}
                />

                <FadeIn delay={0.45}>
                  <motion.button
                    type="submit"
                    className="btn-submit"
                    disabled={loading}
                    whileHover={!loading ? { scale: 1.02, boxShadow: "0 8px 24px rgba(37,99,235,0.3)" } : {}}
                    whileTap={!loading ? { scale: 0.98 } : {}}
                    transition={{ type: "spring", stiffness: 400, damping: 20 }}
                  >
                    {loading ? (
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
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

export default Login;