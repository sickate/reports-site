import { Link, useLocation } from 'react-router-dom';

function Navbar() {
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <Link to="/" className="navbar-brand">
          <span className="brand-icon">R</span>
          <span className="brand-text">Instap Research</span>
        </Link>
        <div className="navbar-links">
          <Link to="/" className={isHome ? 'active' : ''}>
            Home
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
