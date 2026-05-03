import { Link, useLocation } from 'react-router-dom';

function Navbar() {
  const location = useLocation();
  const isHome = location.pathname === '/';

  const handleBooksClick = (e) => {
    if (isHome) {
      e.preventDefault();
      const booksEl = document.getElementById('books');
      // The 'books' subsection now lives inside a <details> that may be closed.
      // Open all ancestor <details> first so scrollIntoView lands on visible content.
      let parent = booksEl?.parentElement;
      while (parent) {
        if (parent.tagName === 'DETAILS') parent.open = true;
        parent = parent.parentElement;
      }
      booksEl?.scrollIntoView({ behavior: 'smooth' });
    }
  };

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
          <Link
            to="/#books"
            onClick={handleBooksClick}
          >
            Books
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
