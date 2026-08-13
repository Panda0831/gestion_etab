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
      <Login 
        onLoginSuccess={handleLoginSuccess} 
        onLogout={handleLogout} 
        currentUser={user} 
      />
    </div>
  );
}

export default App;
