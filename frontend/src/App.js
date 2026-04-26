import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import HealthCompassAuth from './HealthCompassAuth';
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import Dashboard from './pages/Dashboard';
import GlobalTest from './pages/tests/GlobalTest';
import EpisodicMemoryTest from './pages/tests/EpisodicMemoryTest';
import ExecutiveTest from './pages/tests/ExecutiveTest';
import LanguageTest from './pages/tests/LanguageTest';
import FunctionalTest from './pages/tests/FunctionalTest';
import AdaptiveTest from './pages/tests/AdaptiveTest';
import Results from './pages/tests/Results';
import ClinicalRiskAssessment from './pages/tests/ClinicalRiskAssessment';
import History from './pages/History';
import Subscription from './pages/Subscription';
import AdminFeedback from './pages/AdminFeedback';
import Phase4FeedbackModal from './components/Phase4FeedbackModal';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setIsAuthenticated(false);
      setLoading(false);
      return;
    }

    fetch(`${process.env.REACT_APP_API_URL || `${process.env.REACT_APP_API_URL || "http://localhost:5000"}`}/api/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setUser(data.user);
          setIsAuthenticated(true);
        } else {
          localStorage.removeItem('token');
          setIsAuthenticated(false);
        }
      })
      .catch(() => {
        localStorage.removeItem('token');
        setIsAuthenticated(false);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const refreshUser = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || `${process.env.REACT_APP_API_URL || "http://localhost:5000"}`}/api/auth/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setUser(data.user);
      }
    } catch (err) {
      console.error('Error refreshing user:', err);
    }
  };

  const handleLogin = (userData, token) => {
    localStorage.setItem('token', token);
    setUser(userData);
    setIsAuthenticated(true);
    navigate('/home');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setIsAuthenticated(false);
    navigate('/login');
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '1.1rem',
        color: '#0ea5e9',
      }}>
        Loading...
      </div>
    );
  }

  return (
    <div className="App" style={{ minHeight: '100vh' }}>
      <Routes>
        <Route
          path="/login"
          element={
            isAuthenticated ? (
              <Navigate to="/home" replace />
            ) : (
              <HealthCompassAuth onLogin={handleLogin} initialView="login" />
            )
          }
        />
        <Route
          path="/signup"
          element={
            isAuthenticated ? (
              <Navigate to="/home" replace />
            ) : (
              <HealthCompassAuth onLogin={handleLogin} initialView="signup" />
            )
          }
        />
        <Route
          path="/verify"
          element={
            isAuthenticated ? (
              <Navigate to="/home" replace />
            ) : (
              <HealthCompassAuth onLogin={handleLogin} initialView="otp" />
            )
          }
        />
        <Route
          path="/forgot-password"
          element={
            isAuthenticated ? (
              <Navigate to="/home" replace />
            ) : (
              <HealthCompassAuth onLogin={handleLogin} initialView="forgot-password" />
            )
          }
        />
        <Route
          path="/reset-password"
          element={
            isAuthenticated ? (
              <Navigate to="/home" replace />
            ) : (
              <HealthCompassAuth onLogin={handleLogin} initialView="reset-password" />
            )
          }
        />

        <Route
          path="/home"
          element={<Home user={user} onLogout={handleLogout} />}
        />

        <Route
          path="/about"
          element={<About user={user} onLogout={handleLogout} />}
        />

        <Route
          path="/services"
          element={<Services user={user} onLogout={handleLogout} />}
        />

        <Route
          path="/dashboard"
          element={
            isAuthenticated ? (
              <Dashboard user={user} onLogout={handleLogout} refreshUser={refreshUser} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route
          path="/tests/global"
          element={
            isAuthenticated ? (
              <GlobalTest user={user} onLogout={handleLogout} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/tests/episodic-memory"
          element={
            isAuthenticated ? (
              <EpisodicMemoryTest user={user} onLogout={handleLogout} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/tests/executive"
          element={
            isAuthenticated ? (
              <ExecutiveTest user={user} onLogout={handleLogout} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/tests/language"
          element={
            isAuthenticated ? (
              <LanguageTest user={user} onLogout={handleLogout} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/tests/functional"
          element={
            isAuthenticated ? (
              <FunctionalTest user={user} onLogout={handleLogout} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/tests/adaptive"
          element={
            isAuthenticated ? (
              <AdaptiveTest user={user} onLogout={handleLogout} refreshUser={refreshUser} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/tests/results"
          element={
            isAuthenticated ? (
              <Results user={user} onLogout={handleLogout} refreshUser={refreshUser} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/tests/clinical-risk"
          element={
            isAuthenticated ? (
              <ClinicalRiskAssessment user={user} onLogout={handleLogout} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route
          path="/history"
          element={
            isAuthenticated ? (
              <History user={user} onLogout={handleLogout} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/pricing"
          element={
            isAuthenticated ? (
              <Subscription user={user} onLogout={handleLogout} refreshUser={refreshUser} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* Admin Route */}
        <Route
          path="/admin/feedback"
          element={
            isAuthenticated ? (
              <AdminFeedback user={user} onLogout={handleLogout} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route path="/" element={<Home user={user} onLogout={handleLogout} />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      
      {/* Global Phase 4A Feedback Modal (visible on /tests routes) */}
      <Phase4FeedbackModal />
    </div>
  );
}

export default App;