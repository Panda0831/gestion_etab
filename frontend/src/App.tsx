import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Navbar from "./components/NavBar";
import Login from "./components/Login";
import Home from "./pages/Home";
import Inscription from "./pages/Inscription";
import { User } from "./types/auth";
import "./App.css";

const API_URL = "http://localhost:3000";

interface AnimatedRoutesProps {
  user: User | null;
  onLoginSuccess: (token: string, mockUser?: User | null) => Promise<void>;
  onLogout: () => void;
}

// Composant interne pour pouvoir utiliser useLocation
// (obligatoire d'être A L'INTERIEUR du BrowserRouter)
function AnimatedRoutes({
  user,
  onLoginSuccess,
  onLogout,
}: AnimatedRoutesProps) {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route
          path="/"
          element={
            user ? (
              <Home user={user} />
            ) : (
              <Login
                onLoginSuccess={onLoginSuccess}
                onLogout={onLogout}
                currentUser={user}
              />
            )
          }
        />
        <Route
          path="/inscription"
          element={<Inscription onLoginSuccess={onLoginSuccess} />}
        />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      fetchUserProfile(storedToken);
    }
  }, []);

  const fetchUserProfile = async (token: string): Promise<void> => {
    try {
      const res = await fetch(`${API_URL}/auth/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const profile: User = await res.json();
        setUser(profile);
      } else {
        localStorage.removeItem("token");
      }
    } catch (err) {
      console.error("Error fetching profile:", err);
    }
  };

  const handleLoginSuccess = async (
    token: string,
    mockUser: User | null = null,
  ): Promise<void> => {
    if (token) {
      await fetchUserProfile(token);
    } else if (mockUser) {
      setUser(mockUser);
    }
  };

  const handleLogout = (): void => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <BrowserRouter>
      <div className={`app-container ${user ? "app-logged-in" : "app-guest"}`}>
        <Navbar user={user} onLogout={handleLogout} />
        <AnimatedRoutes
          user={user}
          onLoginSuccess={handleLoginSuccess}
          onLogout={handleLogout}
        />
      </div>
    </BrowserRouter>
  );
}

export default App;
