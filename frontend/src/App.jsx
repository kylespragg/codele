import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useState, useEffect } from 'react';
import CodeConsole from './components/CodeConsole';
import LoginModal from './components/LoginModal';
import AdminDashboard from './components/AdminDashboard';
import UserDashboard from './components/UserDashboard';
import CreateAccount from './components/CreateAccount'; // New component for creating an account
import ForgotPassword from './components/ForgotPassword'; // New component for forgot password
import './styles/App.css';
import codleLogo from './assets/codele.jpg';

function App() {
  const [showModal, setShowModal] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    document.title = "Codele";
    const link = document.createElement('link');
    link.rel = 'icon';
    link.href = codleLogo;
    document.head.appendChild(link);

    // Check if user is logged in
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    // Check if the modal has been shown before
    const modalShown = localStorage.getItem('modalShown');
    if (!modalShown) {
      setShowModal(true); // Show modal if it hasn't been shown
      localStorage.setItem('modalShown', 'true'); // Set the flag in local storage
    }
  }, []);

  const handleLogin = () => {
    setIsLoginModalOpen(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
    setShowModal(true); // Show modal again on logout
  };

  // Function to render the correct component based on user state
  const renderMainContent = () => {
    if (!user) {
      // No user logged in - show basic CodeConsole
      return <CodeConsole />;
    } else if (user.role === 'admin') {
      // Admin logged in - show AdminDashboard
      return <AdminDashboard />;
    } else {
      // Regular user logged in - show UserDashboard
      return <UserDashboard user={user} />;
    }
  };

  return (
    <Router>
      <div className="app">
        {showModal && !user && (
          <div className="modal-overlay">
            <div className="modal">
              <h2>Welcome to Codele! 👾</h2>
              <p>Codele is a Wordle-like game for programmers where you solve a daily coding challenge.</p>
              <button className="modal-button" onClick={() => setShowModal(false)}>
                Let's Code!
              </button>
            </div>
          </div>
        )}
        
        <header className="app-header fade-in">
          <h1 className="logo-text">
            <span className="orange">C</span>
            <span className="blue">o</span>
            <span className="white">d</span>
            <span className="white">e</span>
            <span className="white">l</span>
            <span className="white">e</span>
          </h1>
          {user ? (
            <div className="user-menu">
              <span>Welcome, {user.username}!</span>
              {user.role === 'admin' && (
                <span className="admin-badge">Admin</span>
              )}
              <button className="logout-button" onClick={handleLogout}>
                Logout
              </button>
            </div>
          ) : (
            <button className="login-button" onClick={handleLogin}>
              Login
            </button>
          )}
        </header>

        <main className="fade-in">
          <Routes>
            <Route path="/create-account" element={<CreateAccount />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/" element={renderMainContent()} />
          </Routes>
        </main>

        <LoginModal 
          isOpen={isLoginModalOpen} 
          onClose={() => setIsLoginModalOpen(false)} 
        />
      </div>
    </Router>
  );
}

export default App;