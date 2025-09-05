import { Link, useLocation } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';
import Logo from './Logo';

export default function Navbar() {
  const location = useLocation();
  return (
    <div className="navbar">
      <div className="nav-inner">
        <div className="brand">
          <Logo size={20} />
          Quizzer
        </div>
        <div className="spacer" />
        <nav className="nav-links">
          <Link to="/quiz" className={location.pathname === '/quiz' ? 'active' : ''}>Quiz</Link>
          <Link to="/results#best" className={location.pathname === '/results' ? 'active' : ''}>Scores</Link>
          <ThemeToggle />
        </nav>
      </div>
    </div>
  );
}


