import { useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../hooks/useAuth";
import { FadeIn } from "../components/ui/Motion";
import AnimatedInput from "../components/ui/AnimatedInput";
import AnimatedSelect from "../components/ui/AnimatedSelect";
import AlertBanner from "../components/ui/AlertBanner";
import FloatingParticle, { particles } from "../components/ui/FloatingParticle";
import { MailIcon, LockIcon, PhoneIcon, UserIcon } from "../components/icons";
import { Role } from "../types/auth";

interface InscriptionProps {
  onLoginSuccess: (token: string) => void;
}

function Inscription({ onLoginSuccess }: InscriptionProps) {
  const [showPassword, setShowPassword] = useState(false);

  const { loading, error, etablissements, register, setError } =
    useAuth(onLoginSuccess);

  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regNom, setRegNom] = useState("");
  const [regPrenom, setRegPrenom] = useState("");
  const [regTelephone, setRegTelephone] = useState("");
  const [regRole, setRegRole] = useState<Role>("ELEVE");
  const [regEtablissement, setRegEtablissement] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    await register({
      email: regEmail,
      password: regPassword,
      nom: regNom,
      prenom: regPrenom,
      telephone: regTelephone,
      role: regRole,
      etablissementId: regEtablissement,
    });
  };

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
          </motion.div>
          <span className="brand-name">EduGest</span>
        </FadeIn>

        <div className="info-main">
          <FadeIn delay={0.2}>
            <h2>Rejoignez votre établissement</h2>
          </FadeIn>
          <FadeIn delay={0.3}>
            <p>
              Créez votre compte pour accéder au portail pédagogique. Les élèves
              et parents peuvent s&apos;inscrire directement ici.
            </p>
          </FadeIn>
        </div>

        <FadeIn delay={0.7} className="info-footer">
          <span>© {new Date().getFullYear()} EduGest Inc.</span>
          <span>v1.0.0</span>
        </FadeIn>
      </div>

      {/* ═══════ RIGHT PANEL – Register Form ═══════ */}
      <div className="portal-form-panel">
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        >
          <FadeIn delay={0.05}>
            <div className="form-header">
              <h3>Inscription Élève / Parent</h3>
              <p>
                Déjà inscrit ?{" "}
                <motion.span
                  className="form-toggle-link"
                  onClick={() => (window.location.href = "/")}
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
              type={showPassword ? "text" : "password"}
              placeholder="Mot de passe"
              value={regPassword}
              onChange={(e) => setRegPassword(e.target.value)}
              required
              icon={<LockIcon />}
              delay={0.25}
              rightElement={
                <motion.button
                  type="button"
                  className="input-toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                  whileHover={{ scale: 1.15 }}
                  whileTap={{ scale: 0.9 }}
                >
                  {showPassword ? "🙈" : "👁"}
                </motion.button>
              }
            />

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <AnimatedSelect
                id="reg-role"
                value={regRole}
                onChange={(e) => setRegRole(e.target.value as Role)}
                required
                delay={0.3}
                label="Rôle"
                style={{ paddingLeft: "14px" }}
              >
                <option value="ELEVE">Élève</option>
                <option value="PARENT">Parent</option>
                <option value="PROFESSEUR">Professeur</option>
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
      </div>
    </motion.div>
  );
}

export default Inscription;
