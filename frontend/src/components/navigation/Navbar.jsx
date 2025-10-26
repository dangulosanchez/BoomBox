// Navbar.jsx - Save to: BoomBox/frontend/src/components/navigation/Navbar.jsx
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import styles from './Navbar.module.css';

/**
 * Navbar Component - Fixed navigation with auth integration
 * 
 * @component
 * @param {Object} props
 * @param {Object} props.authState - Authentication state from App.js
 * @param {boolean} props.authState.isAuthenticated - User logged in status
 * @param {Function} props.updateAuthState - Function to update auth state
 * 
 * @features
 * - Responsive mobile menu
 * - Auto-closes on route change
 * - Shows Login/Register when not authenticated
 * - Shows Account/Logout when authenticated
 * - Active link highlighting
 * - Scroll-based background opacity (optional enhancement)
 */
const Navbar = ({ authState, updateAuthState }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Auto-close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  // Track scroll for navbar background opacity
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('onboardingToken');
    updateAuthState({ 
      isAuthenticated: false, 
      isOnboarding: false, 
      user: null 
    });
    navigate('/');
  };

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Check if link is active
  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav 
      className={`${styles.navbar} ${isScrolled ? styles.scrolled : ''}`}
      role="navigation"
      aria-label="Main navigation"
    >
      <div className={styles.navbarContainer}>
        {/* Logo */}
        <Link 
          to="/" 
          className={styles.brand}
          aria-label="The Boombox - Home"
        >
          <img 
            src="/images/new logo.png" 
            alt="The Boombox Logo" 
            className={styles.logo}
            width="30"
            height="30"
          />
        </Link>

        {/* Mobile Menu Toggle */}
        <button
          className={styles.mobileToggle}
          onClick={toggleMobileMenu}
          aria-expanded={isMobileMenuOpen}
          aria-controls="navbar-menu"
          aria-label="Toggle navigation menu"
        >
          <span className={styles.toggleIcon}>
            {isMobileMenuOpen ? '✕' : '☰'}
          </span>
        </button>

        {/* Navigation Links */}
        <div 
          id="navbar-menu"
          className={`${styles.navMenu} ${isMobileMenuOpen ? styles.open : ''}`}
        >
          <ul className={styles.navList}>
            <li className={styles.navItem}>
              <Link 
                to="/" 
                className={`${styles.navLink} ${isActive('/') ? styles.active : ''}`}
              >
                Home
              </Link>
            </li>
            <li className={styles.navItem}>
              <Link 
                to="/showcasing" 
                className={`${styles.navLink} ${isActive('/showcasing') ? styles.active : ''}`}
              >
                Showcasing
              </Link>
            </li>
            <li className={styles.navItem}>
              <Link 
                to="/gallery" 
                className={`${styles.navLink} ${isActive('/gallery') ? styles.active : ''}`}
              >
                Gallery
              </Link>
            </li>
            <li className={styles.navItem}>
              <Link 
                to="/events" 
                className={`${styles.navLink} ${isActive('/events') ? styles.active : ''}`}
              >
                Events
              </Link>
            </li>
            <li className={styles.navItem}>
              <Link 
                to="/shop" 
                className={`${styles.navLink} ${isActive('/shop') ? styles.active : ''}`}
              >
                Shop
              </Link>
            </li>
            <li className={styles.navItem}>
              <Link 
                to="/blog" 
                className={`${styles.navLink} ${isActive('/blog') ? styles.active : ''}`}
              >
                Blog
              </Link>
            </li>
            <li className={styles.navItem}>
              <Link to="/story" className={styles.navLink}>Story</Link>
            </li>
            <li className={styles.navItem}>
              <Link 
                to="/contact" 
                className={`${styles.navLink} ${isActive('/contact') ? styles.active : ''}`}
              >
                Contact
              </Link>
            </li>

            {/* Auth Links */}
            {authState.isAuthenticated ? (
              <>
                <li className={styles.navItem}>
                  <Link 
                    to="/dashboard" 
                    className={`${styles.navLink} ${isActive('/dashboard') ? styles.active : ''}`}
                  >
                    Dashboard
                  </Link>
                </li>
                <li className={styles.navItem}>
                  <button 
                    onClick={handleLogout}
                    className={`${styles.navLink} ${styles.logoutBtn}`}
                  >
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li className={styles.navItem}>
                  <Link 
                    to="/login" 
                    className={`${styles.navLink} ${isActive('/login') ? styles.active : ''}`}
                  >
                    Login
                  </Link>
                </li>
                <li className={styles.navItem}>
                  <Link 
                    to="/register" 
                    className={`${styles.navLink} ${styles.registerLink} ${isActive('/register') ? styles.active : ''}`}
                  >
                    Register
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className={styles.overlay}
          onClick={toggleMobileMenu}
          aria-hidden="true"
        />
      )}
    </nav>
  );
};

export default Navbar;