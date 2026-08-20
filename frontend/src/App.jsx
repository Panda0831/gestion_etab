import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Login from './components/Login';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const API_URL = 'http://localhost:3000';

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      fetchUserProfile(storedToken);
    }
  }, []);

  const fetchUserProfile = async (token) => {
    try {
      const res = await fetch(`${API_URL}/auth/profile`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (res.ok) {
        const profile = await res.json();
        setUser(profile);
      } else {
        localStorage.removeItem('token');
      }
    } catch (err) {
      console.error('Error fetching profile:', err);
    }
  };

  const handleLoginSuccess = async (token, mockUser = null) => {
    if (token) {
      await fetchUserProfile(token);
    } else if (mockUser) {
      setUser(mockUser);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <div className="app-container">
      <AnimatePresence mode="wait">
        {user ? (
          <motion.div
            key="home"
            className="home-page"
            style={{ padding: '2rem', textAlign: 'center' }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
            >
              Accueil
            </motion.h1>
            <motion.button
              onClick={handleLogout}
              style={{
                marginTop: '1.5rem',
                padding: '0.75rem 1.5rem',
                backgroundColor: '#e11d48',
                color: 'white',
                border: 'none',
                borderRadius: '0.375rem',
                cursor: 'pointer',
                fontWeight: '500',
                fontSize: '14px',
              }}
              whileHover={{ scale: 1.05, boxShadow: '0 4px 20px rgba(225,29,72,0.4)' }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            >
              Se déconnecter
            </motion.button>
          </motion.div>
        ) : (
          <motion.div
            key="login"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            <Login
              onLoginSuccess={handleLoginSuccess}
              onLogout={handleLogout}
              currentUser={user}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
