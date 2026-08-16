import { useState, useEffect } from 'react';
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
        headers: {
          'Authorization': `Bearer ${token}`
        }
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
      {user ? (
        <div className="home-page" style={{ padding: '2rem', textAlign: 'center' }}>
          <h1>Accueil</h1>
          <button 
            onClick={handleLogout} 
            style={{
              marginTop: '1.5rem',
              padding: '0.75rem 1.5rem',
              backgroundColor: '#e11d48',
              color: 'white',
              border: 'none',
              borderRadius: '0.375rem',
              cursor: 'pointer',
              fontWeight: '500'
            }}
          >
            Se déconnecter
          </button>
        </div>
      ) : (
        <Login 
          onLoginSuccess={handleLoginSuccess} 
          onLogout={handleLogout} 
          currentUser={user} 
        />
      )}
    </div>
  );
}

export default App;
