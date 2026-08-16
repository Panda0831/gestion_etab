import { useState, useEffect } from "react";

function Login({ onLoginSuccess, onLogout, currentUser }) {
  // Navigation & Authentication states
  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Etablissements list
  const [etablissements, setEtablissements] = useState([]);

  // Form Fields
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginEtablissement, setLoginEtablissement] = useState("");

  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regNom, setRegNom] = useState("");
  const [regPrenom, setRegPrenom] = useState("");
  const [regTelephone, setRegTelephone] = useState("");
  const [regRole, setRegRole] = useState("PROFESSEUR");
  const [regEtablissement, setRegEtablissement] = useState("");

  const API_URL = "http://localhost:3000";

  // Load establishments on mount
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
      console.log(
        "Unable to connect to NestJS.",
        err,
      );
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const payload = {
        email: loginEmail,
        motDePasse: loginPassword,
      };
      if (loginEtablissement) {
        payload.etablissementId = loginEtablissement;
      }

      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Échec de la connexion");
      }

      setSuccess("Connexion réussie !");
      localStorage.setItem("token", data.accessToken);
      onLoginSuccess(data.accessToken);
    } catch (err) {
      setError(
        err.message || "Serveur injoignable.",
      );
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
      if (regTelephone) {
        payload.telephone = regTelephone;
      }

      const res = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Échec de l'inscription");
      }

      setSuccess(
        "Inscription réussie ! Vous pouvez maintenant vous connecter.",
      );
      setIsRegister(false);
      setLoginEmail(regEmail);
    } catch (err) {
      setError(
        err.message || "Serveur injoignable.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="portal-card">
      {/* Left branding & information panel */}
      <div className="portal-info-panel">
        <div className="info-header">
          <div className="logo-crest">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z" />
              <path d="M6 6h10" />
              <path d="M6 10h10" />
            </svg>
          </div>
          <span className="brand-name">EduGest</span>
        </div>

        <div className="info-main">
          <h2>Gestion administrative & pédagogique simplifiée</h2>
          <p>
            Bienvenue sur le portail d'administration de votre établissement.
            Connectez-vous pour accéder à vos classes, votre emploi du temps et
            vos outils de communication.
          </p>

          <div className="info-features">
            <div className="feature-item">
              <div className="feature-icon-wrapper">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </div>
              <div className="feature-text">
                <h4>Espace Multi-Rôles</h4>
                <p>
                  Accès dédié pour Directeurs, Professeurs, Secrétaires, Parents
                  et Élèves.
                </p>
              </div>
            </div>

            <div className="feature-item">
              <div className="feature-icon-wrapper">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
              </div>
              <div className="feature-text">
                <h4>Suivi du Calendrier</h4>
                <p>
                  Gestion en temps réel des emplois du temps et des événements.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="info-footer">
          <span>© {new Date().getFullYear()} EduGest Inc.</span>
          <span>v1.0.0</span>
        </div>
      </div>

      {/* Right form panel */}
      <div className="portal-form-panel">
        {currentUser ? (
          /* Connected State */
          <div className="profile-card">
            <div className="profile-avatar">
              <svg
                width="40"
                height="40"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </div>
            <h3 className="profile-name">
              {currentUser.prenom} {currentUser.nom}
            </h3>
            <span className="profile-role">{currentUser.role}</span>

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
                  <span
                    className="detail-value"
                    style={{ fontSize: "12px", fontFamily: "monospace" }}
                  >
                    {currentUser.id}
                  </span>
                </div>
              )}
            </div>

            <button className="btn-secondary" onClick={onLogout}>
              Se déconnecter
            </button>
          </div>
        ) : !isRegister ? (
          /* Login Form */
          <div>
            <div className="form-header">
              <h3>Espace de Connexion</h3>
              <p>
                Pas encore de compte ?
                <span
                  className="form-toggle-link"
                  onClick={() => {
                    setIsRegister(true);
                    setError("");
                    setSuccess("");
                  }}
                >
                  Créer un compte
                </span>
              </p>
            </div>

            {error && (
              <div className="alert alert-error">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="alert alert-success">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
                <span>{success}</span>
              </div>
            )}

            <form onSubmit={handleLogin}>
              <div className="form-group">
                <label className="form-label" htmlFor="login-email">
                  Adresse Email
                </label>
                <div className="input-wrapper">
                  <span className="input-icon-left">
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect width="20" height="16" x="2" y="4" rx="2" />
                      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                    </svg>
                  </span>
                  <input
                    id="login-email"
                    type="email"
                    className="input-control"
                    placeholder="nom.prenom@ecole.com"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="login-password">
                  Mot de passe
                </label>
                <div className="input-wrapper">
                  <span className="input-icon-left">
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                  </span>
                  <input
                    id="login-password"
                    type={showPassword ? "text" : "password"}
                    className="input-control"
                    placeholder="••••••••"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="input-toggle-password"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
                        <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
                        <path d="M6.61 6.61A13.52 13.52 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
                        <line x1="2" y1="2" x2="22" y2="22" />
                      </svg>
                    ) : (
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="login-etablissement">
                  Établissement
                  <span className="form-label-optional">(Optionnel)</span>
                </label>
                <div className="input-wrapper">
                  <span className="input-icon-left">
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                      <polyline points="9 22 9 12 15 12 15 22" />
                    </svg>
                  </span>
                  <select
                    id="login-etablissement"
                    className="input-control select-control"
                    value={loginEtablissement}
                    onChange={(e) => setLoginEtablissement(e.target.value)}
                  >
                    <option value="">Sélectionnez un établissement...</option>
                    {etablissements.map((etab) => (
                      <option key={etab.id} value={etab.id}>
                        {etab.nom}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-actions">
                <label className="remember-me">
                  <input type="checkbox" />
                  Se souvenir de moi
                </label>
                <a href="#forgot" className="forgot-password-link">
                  Mot de passe oublié ?
                </a>
              </div>

              <button type="submit" className="btn-submit" disabled={loading}>
                {loading ? <span className="spinner"></span> : "Se connecter"}
              </button>
            </form>
          </div>
        ) : (
          /* Register Form */
          <div>
            <div className="form-header">
              <h3>Créer un Compte</h3>
              <p>
                Déjà inscrit ?
                <span
                  className="form-toggle-link"
                  onClick={() => {
                    setIsRegister(false);
                    setError("");
                    setSuccess("");
                  }}
                >
                  Se connecter
                </span>
              </p>
            </div>

            {error && (
              <div className="alert alert-error">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleRegister}>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "16px",
                }}
              >
                <div className="form-group">
                  <label className="form-label" htmlFor="reg-prenom">
                    Prénom
                  </label>
                  <div className="input-wrapper">
                    <span className="input-icon-left" style={{ left: "12px" }}>
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                      </svg>
                    </span>
                    <input
                      id="reg-prenom"
                      type="text"
                      className="input-control"
                      style={{ paddingLeft: "36px" }}
                      placeholder="Jean"
                      value={regPrenom}
                      onChange={(e) => setRegPrenom(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="reg-nom">
                    Nom
                  </label>
                  <div className="input-wrapper">
                    <span className="input-icon-left" style={{ left: "12px" }}>
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                      </svg>
                    </span>
                    <input
                      id="reg-nom"
                      type="text"
                      className="input-control"
                      style={{ paddingLeft: "36px" }}
                      placeholder="Dupont"
                      value={regNom}
                      onChange={(e) => setRegNom(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="reg-email">
                  Adresse Email
                </label>
                <div className="input-wrapper">
                  <span className="input-icon-left">
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect width="20" height="16" x="2" y="4" rx="2" />
                      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                    </svg>
                  </span>
                  <input
                    id="reg-email"
                    type="email"
                    className="input-control"
                    placeholder="jean.dupont@ecole.com"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="reg-password">
                  Mot de passe
                </label>
                <div className="input-wrapper">
                  <span className="input-icon-left">
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                  </span>
                  <input
                    id="reg-password"
                    type="password"
                    className="input-control"
                    placeholder="Min. 6 caractères"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    minLength={6}
                    required
                  />
                </div>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "16px",
                }}
              >
                <div className="form-group">
                  <label className="form-label" htmlFor="reg-role">
                    Rôle
                  </label>
                  <div className="input-wrapper">
                    <select
                      id="reg-role"
                      className="input-control select-control"
                      style={{ paddingLeft: "14px" }}
                      value={regRole}
                      onChange={(e) => setRegRole(e.target.value)}
                      required
                    >
                      <option value="DIRECTEUR">Directeur</option>
                      <option value="SECRETAIRE">Secrétaire</option>
                      <option value="COMPTABLE">Comptable</option>
                      <option value="PROFESSEUR">Professeur</option>
                      <option value="ELEVE">Élève</option>
                      <option value="PARENT">Parent</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="reg-etablissement">
                    Établissement
                  </label>
                  <div className="input-wrapper">
                    <select
                      id="reg-etablissement"
                      className="input-control select-control"
                      style={{ paddingLeft: "14px" }}
                      value={regEtablissement}
                      onChange={(e) => setRegEtablissement(e.target.value)}
                      required
                    >
                      <option value="">Sélectionnez...</option>
                      {etablissements.map((etab) => (
                        <option key={etab.id} value={etab.id}>
                          {etab.nom}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: "28px" }}>
                <label className="form-label" htmlFor="reg-tel">
                  Téléphone
                  <span className="form-label-optional">(Optionnel)</span>
                </label>
                <div className="input-wrapper">
                  <span className="input-icon-left">
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                    </svg>
                  </span>
                  <input
                    id="reg-tel"
                    type="tel"
                    className="input-control"
                    placeholder="034 93 224 31"
                    value={regTelephone}
                    onChange={(e) => setRegTelephone(e.target.value)}
                  />
                </div>
              </div>

              <button type="submit" className="btn-submit" disabled={loading}>
                {loading ? (
                  <span className="spinner"></span>
                ) : (
                  "Créer mon compte"
                )}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

export default Login;
