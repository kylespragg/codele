import { useState, useEffect } from 'react'
import CodeConsole from './components/CodeConsole'
import LoginModal from './components/LoginModal'; // Import the LoginModal
import './styles/App.css'
import codleLogo from './assets/codle.png'
function App() {
  const [showModal, setShowModal] = useState(true);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  useEffect(() => {
    document.title = "Codele"; 
    const link = document.createElement('link');
    link.rel = 'icon';
    link.href = codleLogo; 
    document.head.appendChild(link); 
  }, []);

  const handleLogin = () => {
    setIsLoginModalOpen(true); 
  };

  return (
    <div className="app">
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Welcome to Codele! 👾</h2>
            <p>Codle is a Wordle-like game for programmers where you solve a daily coding challenge.</p>
            <div className="instructions">  
              <h3>How to Play:</h3>
              <ul>
                <li>Write your solution in the code editor</li>
                <li>Submit your answer to check if it's correct</li>
                <li>Get hints if you're stuck</li>
                <li>After 5 hints a solution is revealed</li>
                <li>There can be multiple solutions to the problem</li>
                <li>Try to solve it with as few hints as possible!</li>
  
              </ul>
            </div>
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
      <button className="login-button" onClick={handleLogin}>
        Login
      </button>
      </header>
      <main className="fade-in">
        <CodeConsole />
      </main>
      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} /> {/* Render the modal */}
    </div>
  )
}

export default App