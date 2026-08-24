import { useEffect, useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { User } from "../types/auth";
import { useDashboard } from "../hooks/useDashboard";

interface HomeProps {
  user: User | null;
}

/* ═══════════════════════════════════════════
   Animated Counter (0 → value)
   ═══════════════════════════════════════════ */

function AnimatedCounter({
  target,
  duration = 1.2,
}: {
  target: number;
  duration?: number;
}) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView || target === 0) {
      setCount(target);
      return;
    }
    let start = 0;
    const startTime = performance.now();
    const step = (now: number) => {
      const elapsed = (now - startTime) / (duration * 1000);
      const progress = Math.min(elapsed, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(eased * target);
      setCount(current);
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration, inView]);

  return <span ref={ref}>{count}</span>;
}

/* ═══════════════════════════════════════════
   Animation variants
   ═══════════════════════════════════════════ */

const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.15 },
  },
};

const cardVariant = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
};

const slideFromLeft = {
  hidden: { opacity: 0, x: -40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  },
};

const slideFromRight = {
  hidden: { opacity: 0, x: 40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  },
};

const listItem = {
  hidden: { opacity: 0, x: -12 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { delay: i * 0.07, duration: 0.4, ease: [0.22, 1, 0.36, 1] },
  }),
};

const eventItem = {
  hidden: { opacity: 0, y: 14 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.07, duration: 0.4, ease: [0.22, 1, 0.36, 1] },
  }),
};

/* ═══════════════════════════════════════════
   Icon SVGs
   ═══════════════════════════════════════════ */

function UserGroupIcon() {
  return (
    <svg
      width="22"
      height="22"
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
  );
}

function GraduationIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
      <path d="M6 12v5c3 3 6 3 12 0v-5" />
    </svg>
  );
}

function ClassIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="2" y="3" width="20" height="14" rx="2" />
      <path d="M8 21h8" />
      <path d="M12 17v4" />
    </svg>
  );
}

function AlertIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  );
}

function ClockIcon() {
  return (
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
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function CalendarIcon() {
  return (
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
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}

function ChevronIcon() {
  return (
    <motion.svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      initial={{ x: 0 }}
      whileHover={{ x: 3 }}
    >
      <polyline points="9 18 15 12 9 6" />
    </motion.svg>
  );
}

function SparkleIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2l2.09 6.26L20.18 10l-6.09 1.74L12 18l-2.09-6.26L3.82 10l6.09-1.74z" />
    </svg>
  );
}

/* ═══════════════════════════════════════════
   Color maps
   ═══════════════════════════════════════════ */

const activityMeta: Record<
  string,
  { color: string; bg: string; label: string }
> = {
  inscription: { color: "#2563eb", bg: "#eff6ff", label: "Inscription" },
  absence: { color: "#ef4444", bg: "#fef2f2", label: "Absence" },
  note: { color: "#10b981", bg: "#ecfdf5", label: "Note" },
  evenement: { color: "#f59e0b", bg: "#fffbeb", label: "Événement" },
};

const eventColors: Record<string, string> = {
  cours: "#2563eb",
  reunion: "#8b5cf6",
  examen: "#ef4444",
  evenement: "#f59e0b",
};

/* ═══════════════════════════════════════════
   StatCard with animated counter + glow
   ═══════════════════════════════════════════ */

interface StatCardProps {
  label: string;
  value: number;
  icon: React.ReactNode;
  color: string;
  bg: string;
  suffix?: string;
  delay?: number;
}

function StatCard({ label, value, icon, color, bg, suffix }: StatCardProps) {
  return (
    <motion.div
      className="dash-stat-card"
      variants={cardVariant}
      whileHover={{
        y: -6,
        boxShadow: `0 16px 32px ${color}18`,
        transition: { duration: 0.25, ease: "easeOut" },
      }}
      whileTap={{ scale: 0.98 }}
    >
      <motion.div
        className="stat-icon"
        style={{ color, backgroundColor: bg }}
        whileHover={{ rotate: [0, -10, 10, -5, 0], scale: 1.1 }}
        transition={{ duration: 0.4 }}
      >
        {icon}
      </motion.div>
      <div className="stat-info">
        <span className="stat-value" style={{ color }}>
          <AnimatedCounter target={value} />
          {suffix && <span className="stat-suffix">{suffix}</span>}
        </span>
        <span className="stat-label">{label}</span>
      </div>
      <motion.div
        className="stat-sparkle"
        style={{ color }}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 0.3, scale: 1 }}
        transition={{ delay: 0.8, duration: 0.4 }}
      >
        <SparkleIcon />
      </motion.div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════
   Main Dashboard
   ═══════════════════════════════════════════ */

function Home({ user }: HomeProps) {
  const token = localStorage.getItem("token") || "";
  const { stats, activities, events, loading } = useDashboard(token);

  const now = new Date();
  const greeting =
    now.getHours() < 12
      ? "Bonjour"
      : now.getHours() < 18
        ? "Bon après-midi"
        : "Bonsoir";

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    const diff = Math.ceil(
      (d.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
    );
    if (diff === 0) return "Aujourd'hui";
    if (diff === 1) return "Demain";
    if (diff === -1) return "Hier";
    return d.toLocaleDateString("fr-FR", {
      weekday: "short",
      day: "numeric",
      month: "short",
    });
  };

  const formatActivityDate = (dateStr: string) => {
    const d = new Date(dateStr);
    const diffMs = now.getTime() - d.getTime();
    const diffMin = Math.floor(diffMs / 60000);
    if (diffMin < 1) return "À l'instant";
    if (diffMin < 60) return `Il y a ${diffMin} min`;
    const diffH = Math.floor(diffMin / 60);
    if (diffH < 24) return `Il y a ${diffH}h`;
    const diffD = Math.floor(diffH / 24);
    return `Il y a ${diffD}j`;
  };

  return (
    <motion.div
      className="dash-container"
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98, transition: { duration: 0.2 } }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* ═══ WELCOME BANNER ═══ */}
      <motion.div
        className="dash-welcome"
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <motion.h1
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          {greeting}, {user?.prenom}{' '}
          <motion.span
            initial={{ scale: 0, rotate: -30 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.5, type: 'spring', stiffness: 300, damping: 12 }}
            style={{ display: 'inline-block', originX: 0.7, originY: 0.7 }}
          >
            👋
          </motion.span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          Voici un aperçu de votre établissement aujourd&apos;hui.
        </motion.p>
      </motion.div>

      {/* ═══ STATS CARDS ═══ */}
      <motion.div
        className="dash-stats"
        variants={container}
        initial="hidden"
        animate="visible"
      >
        <StatCard
          label="Élèves"
          value={stats.totalEleves}
          icon={<GraduationIcon />}
          color="#2563eb"
          bg="#eff6ff"
        />
        <StatCard
          label="Professeurs"
          value={stats.totalProfesseurs}
          icon={<UserGroupIcon />}
          color="#8b5cf6"
          bg="#f5f3ff"
        />
        <StatCard
          label="Classes"
          value={stats.totalClasses}
          icon={<ClassIcon />}
          color="#10b981"
          bg="#ecfdf5"
        />
        <StatCard
          label="Absentéisme"
          value={stats.tauxAbsenteisme}
          suffix="%"
          icon={<AlertIcon />}
          color="#ef4444"
          bg="#fef2f2"
        />
      </motion.div>

      {/* ═══ BOTTOM GRID: Activity + Calendar ═══ */}
      <div className="dash-grid">
        {/* ── Recent Activity ── */}
        <motion.div
          className="dash-card dash-activity"
          variants={slideFromLeft}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.4 }}
        >
          <div className="dash-card-header">
            <h3>Activité récente</h3>
            <motion.span
              className="dash-card-badge"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                delay: 0.7,
                type: "spring",
                stiffness: 400,
                damping: 15,
              }}
            >
              {activities.length}
            </motion.span>
          </div>

          {loading ? (
            <div className="dash-empty">
              <motion.div
                className="dash-spinner"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                Chargement...
              </motion.span>
            </div>
          ) : activities.length === 0 ? (
            <motion.div
              className="dash-empty"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
            >
              <span>Aucune activité récente</span>
            </motion.div>
          ) : (
            <div className="dash-activity-list">
              {activities.map((act, i) => {
                const meta = activityMeta[act.type] || activityMeta.evenement;
                return (
                  <motion.div
                    key={act.id}
                    className="dash-activity-item"
                    custom={i}
                    variants={listItem}
                    initial="hidden"
                    animate="visible"
                    whileHover={{ backgroundColor: "#f8fafc", x: 4 }}
                    transition={{ duration: 0.15 }}
                  >
                    <motion.div
                      className="activity-dot"
                      style={{ backgroundColor: meta.color }}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{
                        delay: 0.5 + i * 0.07,
                        type: "spring",
                        stiffness: 500,
                        damping: 15,
                      }}
                    />
                    <div className="activity-content">
                      <span
                        className="activity-type"
                        style={{ color: meta.color, backgroundColor: meta.bg }}
                      >
                        {meta.label}
                      </span>
                      <p className="activity-msg">{act.message}</p>
                      <span className="activity-time">
                        <ClockIcon /> {formatActivityDate(act.date)}
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </motion.div>

        {/* ── Calendar / Upcoming Events ── */}
        <motion.div
          className="dash-card dash-calendar"
          variants={slideFromRight}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.5 }}
        >
          <div className="dash-card-header">
            <h3>
              <motion.span
                initial={{ rotate: -20, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                transition={{ delay: 0.6, type: "spring", stiffness: 200 }}
                style={{ display: "inline-flex" }}
              >
                <CalendarIcon />
              </motion.span>{" "}
              Événements à venir
            </h3>
          </div>

          {loading ? (
            <div className="dash-empty">
              <motion.div
                className="dash-spinner"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                Chargement...
              </motion.span>
            </div>
          ) : events.length === 0 ? (
            <motion.div
              className="dash-empty"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 }}
            >
              <span>Aucun événement prévu</span>
            </motion.div>
          ) : (
            <div className="dash-event-list">
              {events.map((evt, i) => (
                <motion.div
                  key={evt.id}
                  className="dash-event-item"
                  custom={i}
                  variants={eventItem}
                  initial="hidden"
                  animate="visible"
                  whileHover={{ x: 6, backgroundColor: "#f8fafc" }}
                >
                  <motion.div
                    className="event-color-bar"
                    style={{
                      backgroundColor: eventColors[evt.type] || "#94a3b8",
                    }}
                    initial={{ scaleY: 0 }}
                    animate={{ scaleY: 1 }}
                    transition={{
                      delay: 0.6 + i * 0.07,
                      duration: 0.3,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    style={{
                      backgroundColor: eventColors[evt.type] || "#94a3b8",
                      transformOrigin: "top",
                    }}
                  />
                  <div className="event-info">
                    <span className="event-title">{evt.title}</span>
                    <span className="event-meta">
                      {formatDate(evt.date)} · {evt.time}
                    </span>
                  </div>
                  <motion.span
                    className="event-type-badge"
                    style={{
                      color: eventColors[evt.type] || "#94a3b8",
                      backgroundColor: `${eventColors[evt.type] || "#94a3b8"}15`,
                    }}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{
                      delay: 0.8 + i * 0.07,
                      type: "spring",
                      stiffness: 400,
                      damping: 15,
                    }}
                  >
                    {evt.type}
                  </motion.span>
                  <ChevronIcon />
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}

export default Home;
