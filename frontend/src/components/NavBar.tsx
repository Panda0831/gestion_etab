import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

interface NavbarProps {
  onLogout: () => void;
}

function Navbar({ onLogout }: NavbarProps) {
  const location = useLocation();

  return (
    <nav
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '1rem 2rem',
        borderBottom: '1px solid #e5e7eb',
      }}
    >
      <Link to="/" style={{ fontWeight: 'bold', fontSize: '18px', textDecoration: 'none', color: '#111' }}>
        MonApp
      </Link>

      <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
        <Link
          to="/inscription"
          style={{
            textDecoration: 'none',
            color: location.pathname === '/inscription' ? '#e11d48' : '#333',
            fontWeight: location.pathname === '/inscription' ? '600' : '400',
          }}
        >
          Inscription élève
        </Link>

        <motion.button
          onClick={onLogout}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#e11d48',
            color: 'white',
            border: 'none',
            borderRadius: '0.375rem',
            cursor: 'pointer',
            fontWeight: '500',
            fontSize: '14px',
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Se déconnecter
        </motion.button>
      </div>
    </nav>
  );
}

export default Navbar;