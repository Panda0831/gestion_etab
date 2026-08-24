import { useState, useEffect, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence, useMotionValueEvent, useScroll } from "framer-motion";
import { User } from "../types/auth";

interface NavbarProps {
  user: User | null;
  onLogout: () => void;
}

/* SVG Icons */

function HomeIcon({ active }: { active: boolean }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={active ? "var(--primary)" : "currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );
}

function UsersIcon({ active }: { active: boolean }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={active ? "var(--primary)" : "currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function CalendarNavIcon({ active }: { active: boolean }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={active ? "var(--primary)" : "currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}

function SettingsIcon({ active }: { active: boolean }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={active ? "var(--primary)" : "currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
    </svg>
  );
}


interface NavLink {
  to: string;
  label: string;
  icon: (active: boolean) => React.ReactNode;
}

const navLinks: NavLink[] = [
  { to: "/", label: "Accueil", icon: (a) => <HomeIcon active={a} /> },
  { to: "/eleves", label: "Élèves", icon: (a) => <UsersIcon active={a} /> },
  { to: "/emploi-du-temps", label: "Emploi du temps", icon: (a) => <CalendarNavIcon active={a} /> },
  { to: "/parametres", label: "Paramètres", icon: (a) => <SettingsIcon active={a} /> },
];


function Navbar({ user, onLogout }: NavbarProps) {
  const location = useLocation();
  const { scrollY } = useScroll();

  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Track scroll direction
  const handleScroll = useCallback(
    (_latest: number, prev: number) => {
      const direction = _latest > prev ? "down" : "up";
      if (_latest < 60) {
        setHidden(false);
      } else {
        setHidden(direction === "down");
      }
      setScrolled(_latest > 10);
    },
    [],
  );

  useMotionValueEvent(scrollY, "change", handleScroll);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  return (
    <>
      <motion.nav
        className={`scroll-navbar ${scrolled ? "scrolled" : ""}`}
        variants={{
          visible: { y: 0 },
          hidden: { y: -100 },
        }}
        animate={hidden ? "hidden" : "visible"}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="scroll-navbar-inner">
          {/* ── Brand ── */}
          <Link to="/" className="scroll-nav-brand">
            <motion.div
              className="scroll-nav-logo"
              whileHover={{ rotate: [0, -8, 8, -4, 0], scale: 1.05 }}
              transition={{ duration: 0.4 }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z" />
                <path d="M6 6h10" />
                <path d="M6 10h10" />
              </svg>
            </motion.div>
            <motion.span
              className="scroll-nav-brand-text"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              EduGest
            </motion.span>
          </Link>

          {/* ── Desktop Links ── */}
          {user && (
            <div className="scroll-nav-links">
              {navLinks.map((link) => {
                const active = isActive(link.to);
                return (
                  <Link key={link.to} to={link.to} className={`scroll-nav-link ${active ? "active" : ""}`}>
                    {link.icon(active)}
                    <span>{link.label}</span>
                    {active && (
                      <motion.div
                        className="scroll-nav-indicator"
                        layoutId="nav-indicator"
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      />
                    )}
                  </Link>
                );
              })}
            </div>
          )}

          {/* ── Right side ── */}
          <div className="scroll-nav-right">
            {user ? (
              <>
                {/* User pill */}
                <motion.div
                  className="scroll-nav-user"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ scale: 1.03 }}
                >
                  <div className="scroll-nav-avatar">
                    {user.prenom?.[0]}{user.nom?.[0]}
                  </div>
                  <div className="scroll-nav-user-info">
                    <span className="scroll-nav-user-name">{user.prenom} {user.nom}</span>
                    <span className="scroll-nav-user-role">{user.role}</span>
                  </div>
                </motion.div>

                {/* Logout */}
                <motion.button
                  className="scroll-nav-logout"
                  onClick={onLogout}
                  whileHover={{ scale: 1.04, backgroundColor: "#fef2f2", color: "#ef4444" }}
                  whileTap={{ scale: 0.96 }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                    <polyline points="16 17 21 12 16 7" />
                    <line x1="21" y1="12" x2="9" y2="12" />
                  </svg>
                </motion.button>
              </>
            ) : (
              <Link to="/inscription" className="scroll-nav-cta">
                Inscription
              </Link>
            )}

            {/* ── Mobile hamburger ── */}
            {user && (
              <button
                className={`scroll-nav-hamburger ${mobileOpen ? "open" : ""}`}
                onClick={() => setMobileOpen(!mobileOpen)}
                aria-label="Menu"
              >
                <span />
                <span />
                <span />
              </button>
            )}
          </div>
        </div>
      </motion.nav>

      {/* ── Mobile menu overlay ── */}
      <AnimatePresence>
        {mobileOpen && user && (
          <motion.div
            className="scroll-nav-mobile-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setMobileOpen(false)}
          >
            <motion.div
              className="scroll-nav-mobile-menu"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="scroll-nav-mobile-user">
                <div className="scroll-nav-avatar large">
                  {user.prenom?.[0]}{user.nom?.[0]}
                </div>
                <span className="scroll-nav-user-name">{user.prenom} {user.nom}</span>
                <span className="scroll-nav-user-role">{user.role}</span>
              </div>

              <div className="scroll-nav-mobile-links">
                {navLinks.map((link, i) => {
                  const active = isActive(link.to);
                  return (
                    <motion.div
                      key={link.to}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 + i * 0.05 }}
                    >
                      <Link
                        to={link.to}
                        className={`scroll-nav-mobile-link ${active ? "active" : ""}`}
                      >
                        {link.icon(active)}
                        <span>{link.label}</span>
                      </Link>
                    </motion.div>
                  );
                })}
              </div>

              <motion.button
                className="scroll-nav-mobile-logout"
                onClick={onLogout}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.35 }}
                whileTap={{ scale: 0.96 }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
                Se déconnecter
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default Navbar;
