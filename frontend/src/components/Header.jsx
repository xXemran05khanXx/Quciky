import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';

function Header() {
  const [user, setUser] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      console.log('User data:', parsedUser); // Debug log
      console.log('User tier:', parsedUser.tier); // Debug log
      setUser(parsedUser);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/');
    setIsMenuOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const isActivePage = (path) => {
    return location.pathname === path;
  };

  return (
    <header className="header">
      <div className="container header-content">
        <Link to="/" className="logo" onClick={closeMenu}>
          <div className="logo-icon">
            <svg viewBox="0 0 24 24" fill="currentColor" className="logo-svg">
              <path d="M13 10V3L4 14h7v7l9-11h-7z"/>
            </svg>
          </div>
          <span className="logo-text">Quicky</span>
        </Link>

        {/* Mobile-only: Tier Badge and Logout Icon next to Menu */}
        <div className="mobile-header-actions">
          {/* Mobile Tier Icon - positioned left of menu button */}
          <div className={`mobile-tier-icon header-tier-icon ${
            user ? (
              (user?.tier?.toLowerCase() === 'premium' || user?.tier?.toLowerCase() === 'paid') ? 'tier-icon-premium' : 
              (user?.tier?.toLowerCase() === 'pro' || user?.tier?.toLowerCase() === 'signed') ? 'tier-icon-pro' : 
              'tier-icon-anonymous'
            ) : 'tier-icon-anonymous'
          }`}>
            {user ? (
              (user?.tier?.toLowerCase() === 'premium' || user?.tier?.toLowerCase() === 'paid') ? (
                <svg viewBox="0 0 24 24" fill="currentColor" className="tier-svg">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
              ) : (user?.tier?.toLowerCase() === 'pro' || user?.tier?.toLowerCase() === 'signed') ? (
                <svg viewBox="0 0 24 24" fill="currentColor" className="tier-svg">
                  <path d="M12 2l2.39 7.26h7.61l-6.16 4.47 2.39 7.27L12 16.53 5.77 21l2.39-7.27L2 9.26h7.61z"/>
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="currentColor" className="tier-svg">
                  <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                </svg>
              )
            ) : (
              <svg viewBox="0 0 24 24" fill="currentColor" className="tier-svg">
                <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
              </svg>
            )}
          </div>

        </div>

        {/* Mobile Menu Button */}
        <button 
          className="mobile-menu-btn"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          <div className={`hamburger ${isMenuOpen ? 'active' : ''}`}>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </button>

        {/* Mobile Logout Icon - rightmost position, only show if user is logged in */}
        {user && (
          <button 
            onClick={handleLogout} 
            className="mobile-logout-icon mobile-logout-rightmost"
            aria-label="Logout"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="logout-svg">
              <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.59L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/>
            </svg>
          </button>
        )}

        <nav className={`nav-links ${isMenuOpen ? 'active' : ''}`}>
          <Link 
            to="/" 
            className={`nav-button ${isActivePage('/') ? 'active' : ''}`}
            onClick={closeMenu}
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="nav-icon">
              <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
            </svg>
            <span>Home</span>
          </Link>
          
          {user && (
            <Link 
              to="/dashboard" 
              className={`nav-button ${isActivePage('/dashboard') ? 'active' : ''}`}
              onClick={closeMenu}
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="nav-icon">
                <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/>
              </svg>
              <span>Dashboard</span>
            </Link>
          )}
          
          {/* Mobile-only auth buttons */}
          <div className="mobile-auth-buttons">
            {!user ? (
              <>
                <Link 
                  to="/login" 
                  className={`nav-button auth-button ${isActivePage('/login') ? 'active' : ''}`}
                  onClick={closeMenu}
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" className="nav-icon">
                    <path d="M11 7L9.6 8.4l2.6 2.6H2v2h10.2l-2.6 2.6L11 17l5-5-5-5zm9 12h-8v2h8c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-8v2h8v14z"/>
                  </svg>
                  <span>Login</span>
                </Link>
                <Link 
                  to="/register" 
                  className={`nav-button auth-button ${isActivePage('/register') ? 'active' : ''}`}
                  onClick={closeMenu}
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" className="nav-icon">
                    <path d="M15 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm-9-2V7H4v3H1v2h3v3h2v-3h3v-2H6zm9 4c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                  </svg>
                  <span>Sign Up</span>
                </Link>
              </>
            ) : (
              <button 
                onClick={handleLogout} 
                className="nav-button auth-button mobile-logout-btn"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="nav-icon">
                  <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.59L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/>
                </svg>
                <span>Logout</span>
              </button>
            )}
          </div>
        </nav>

        {/* Header Actions (Auth Buttons + User Actions) */}
        <div className="header-actions">
          {/* Desktop Tier Icon */}
          <div className={`desktop-tier-icon header-tier-icon ${
            user ? (
              (user?.tier?.toLowerCase() === 'premium' || user?.tier?.toLowerCase() === 'paid') ? 'tier-icon-premium' : 
              (user?.tier?.toLowerCase() === 'pro' || user?.tier?.toLowerCase() === 'signed') ? 'tier-icon-pro' : 
              'tier-icon-anonymous'
            ) : 'tier-icon-anonymous'
          }`}>
            {user ? (
              (user?.tier?.toLowerCase() === 'premium' || user?.tier?.toLowerCase() === 'paid') ? (
                <svg viewBox="0 0 24 24" fill="currentColor" className="tier-svg">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
              ) : (user?.tier?.toLowerCase() === 'pro' || user?.tier?.toLowerCase() === 'signed') ? (
                <svg viewBox="0 0 24 24" fill="currentColor" className="tier-svg">
                  <path d="M12 2l2.39 7.26h7.61l-6.16 4.47 2.39 7.27L12 16.53 5.77 21l2.39-7.27L2 9.26h7.61z"/>
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="currentColor" className="tier-svg">
                  <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                </svg>
              )
            ) : (
              <svg viewBox="0 0 24 24" fill="currentColor" className="tier-svg">
                <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
              </svg>
            )}
          </div>

          {!user ? (
            <>
              <Link 
                to="/login" 
                className={`nav-button auth-button ${isActivePage('/login') ? 'active' : ''}`}
                onClick={closeMenu}
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="nav-icon">
                  <path d="M11 7L9.6 8.4l2.6 2.6H2v2h10.2l-2.6 2.6L11 17l5-5-5-5zm9 12h-8v2h8c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-8v2h8v14z"/>
                </svg>
                <span>Login</span>
              </Link>
              <Link 
                to="/register" 
                className={`nav-button auth-button ${isActivePage('/register') ? 'active' : ''}`}
                onClick={closeMenu}
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="nav-icon">
                  <path d="M15 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm-9-2V7H4v3H1v2h3v3h2v-3h3v-2H6zm9 4c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                </svg>
                <span>Sign Up</span>
              </Link>
            </>
          ) : (
            <>
              <button 
                onClick={handleLogout} 
                className="btn-logout"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="btn-icon">
                  <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.59L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/>
                </svg>
                <span>Logout</span>
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
