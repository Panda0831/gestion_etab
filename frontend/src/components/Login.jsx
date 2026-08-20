import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ───────────────────── tiny reusable wrappers ───────────────────── */

const FadeIn = ({ children, delay = 0, className, style }) => (
  <motion.div
    initial={{ opacity: 0, y: 18 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.45, delay, ease: [0.22, 1, 0.36, 1] }}
    className={className}
    style={style}
  >
    {children}
  </motion.div>
);

const ScaleIn = ({ children, delay = 0, className, style }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.85 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
    className={className}
    style={style}
  >
    {children}
  </motion.div>
);

/* ───────────────────── floating background particles ────────────── */

const FloatingParticle = ({ delay, x, y, size, duration }) => (
  <motion.div
    style={{
      position: "absolute",
      left: `${x}%`,
      top: `${y}%`,
      width: size,
      height: size,
      borderRadius: "50%",
      background: "rgba(255,255,255,0.06)",
      pointerEvents: "none",
    }}
    animate={{
      y: [0, -30, 0],
      x: [0, 15, 0],
      scale: [1, 1.3, 1],
      opacity: [0.3, 0.7, 0.3],
    }}
    transition={{
      duration,
      delay,
      repeat: Infinity,
      ease: "easeInOut",
    }}
  />
);

const particles = [
  { delay: 0, x: 15, y: 20, size: 80, duration: 8 },
  { delay: 1.5, x: 70, y: 60, size: 120, duration: 10 },
  { delay: 0.8, x: 40, y: 80, size: 60, duration: 7 },
  { delay: 2, x: 85, y: 15, size: 90, duration: 9 },
  { delay: 0.3, x: 55, y: 40, size: 50, duration: 6 },
  { delay: 1.2, x: 25, y: 55, size: 70, duration: 11 },
];

/* ───────────────────── icon components ─────────────────────────── */

const MailIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="16" x="2" y="4" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);

const LockIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

const HomeIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);

const PhoneIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);

const UserIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const EyeIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const EyeOffIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
    <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
    <path d="M6.61 6.61A13.52 13.52 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
    <line x1="2" y1="2" x2="22" y2="22" />
  </svg>
);

const AlertCircleIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
);

const CheckCircleIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);

/* ───────────────────── Animated Input ──────────────────────────── */

const AnimatedInput = ({
  id, type = "text", placeholder, value, onChange, required,
  icon, rightElement, delay = 0, style,
}) => (
  <motion.div
    className="form-group"
    initial={{ opacity: 0, x: -12 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.35, delay, ease: [0.22, 1, 0.36, 1] }}
  >
    <label className="form-label" htmlFor={id}>{placeholder}</label>
    <motion.div
      className="input-wrapper"
      whileFocus={{ scale: 1.01 }}
    >
      {icon && <span className="input-icon-left">{icon}</span>}
      <motion.input
        id={id}
        type={type}
        className="input-control"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        style={style}
        whileFocus={{
          boxShadow: "0 0 0 4px rgba(37, 99, 235, 0.2), 0 4px 12px rgba(37, 99, 235, 0.1)",
        }}
        transition={{ duration: 0.2 }}
      />
      {rightElement}
    </motion.div>
  </motion.div>
);

/* ───────────────────── Animated Select ─────────────────────────── */

const AnimatedSelect = ({
  id, value, onChange, required, children, delay = 0, label, optional, style,
}) => (
  <motion.div
    className="form-group"
    initial={{ opacity: 0, x: -12 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.35, delay, ease: [0.22, 1, 0.36, 1] }}
  >
    <label className="form-label" htmlFor={id}>
      {label}
      {optional && <span className="form-label-optional">(Optionnel)</span>}
    </label>
    <div className="input-wrapper">
      <motion.select
        id={id}
        className="input-control select-control"
        value={value}
        onChange={onChange}
        required={required}
        style={style}
        whileFocus={{
          boxShadow: "0 0 0 4px rgba(37, 99, 235, 0.2)",
        }}
        transition={{ duration: 0.2 }}
      >
        {children}
      </motion.select>
    </div>
  </motion.div>
);

/* ═══════════════════════ MAIN COMPONENT ═══════════════════════════ */

function Login({ onLoginSuccess, onLogout, currentUser }) {
  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [etablissements, setEtablissements] = useState([]);

  // Login fields
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginEtablissement, setLoginEtablissement] = useState("");

  // Register fields
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regNom, setRegNom] = useState("");
  const [regPrenom, setRegPrenom] = useState("");
  const [regTelephone, setRegTelephone] = useState("");
  const [regRole, setRegRole] = useState("PROFESSEUR");
  const [regEtablissement, setRegEtablissement] = useState("");

  const API_URL = "http://localhost:3000";

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

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      const payload = { email: loginEmail, motDePasse: loginPassword };
      if (loginEtablissement) payload.etablissementId = loginEtablissement;
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
    } catch (err) {
      setError(err.message || "Serveur injoignable.");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    if (!regEtablissement) {
      setError("Veuillez sélectionner un établissement");
      setLoading(false);
      return;
    }
    try {
      const payload = {
        email: regEmail,
        motDePasse: regPassword,
        nom: regNom,
        prenom: regPrenom,
        role: regRole,
        etablissementId: regEtablissement,
      };
      if (regTelephone) payload.telephone = regTelephone;
      const res = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Échec de l'inscription");
      setSuccess("Inscription réussie ! Vous pouvez maintenant vous connecter.");
      setIsRegister(false);
      setLoginEmail(regEmail);
    } catch (err) {
      setError(err.message || "Serveur injoignable.");
    } finally {
      setLoading(false);
    }
  };

  /* ─── Left panel feature items ─── */
  const features = [
    {
      title: "Espace Multi-Rôles",
      desc: "Accès dédié pour Directeurs, Professeurs, Secrétaires, Parents et Élèves.",
      icon: <UserIcon size={16} />,
    },
    {
      title: "Suivi du Calendrier",
      desc: "Gestion en temps réel des emplois du temps et des événements.",
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
      ),
    },
  ];

  /* ─── Alert banner (animated) ─── */
  const AlertBanner = ({ type, message }) => (
    <AnimatePresence>
      <motion.div
        className={`alert alert-${type}`}
        initial={{ opacity: 0, y: -10, height: 0, marginBottom: 0 }}
        animate={{ opacity: 1, y: 0, height: "auto", marginBottom: 24 }}
        exit={{ opacity: 0, y: -10, height: 0, marginBottom: 0 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      >
        {type === "error" ? <AlertCircleIcon /> : <CheckCircleIcon />}
        <span>{message}</span>
      </motion.div>
    </AnimatePresence>
  );

  return (
    <motion.div
      className="portal-card"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* ═══════ LEFT PANEL – Branding ═══════ */}
      <div className="portal-info-panel">
        {/* Floating particles */}
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
            /* ──── Connected Profile ──── */
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
                <h3 className="profile-name">
                  {currentUser.prenom} {currentUser.nom}
                </h3>
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
            /* ──── Login Form ──── */
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
                      onClick={() => { setIsRegister(true); setError(""); setSuccess(""); }}
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

                <AnimatedSelect
                  id="login-etablissement"
                  value={loginEtablissement}
                  onChange={(e) => setLoginEtablissement(e.target.value)}
                  delay={0.2}
                  label="Établissement"
                  optional
                >
                  <option value="">Sélectionnez un établissement...</option>
                  {etablissements.map((etab) => (
                    <option key={etab.id} value={etab.id}>{etab.nom}</option>
                  ))}
                </AnimatedSelect>

                <FadeIn delay={0.25}>
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
            /* ──── Register Form ──── */
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
                      onClick={() => { setIsRegister(false); setError(""); setSuccess(""); }}
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
                    style={{ paddingLeft: "36px" }}
                  />
                  <AnimatedInput
                    id="reg-nom"
                    placeholder="Nom"
                    value={regNom}
                    onChange={(e) => setRegNom(e.target.value)}
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
                    onChange={(e) => setRegRole(e.target.value)}
                    required
                    delay={0.3}
                    label="Rôle"
                    style={{ paddingLeft: "14px" }}
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
                    style={{ paddingLeft: "14px" }}
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
