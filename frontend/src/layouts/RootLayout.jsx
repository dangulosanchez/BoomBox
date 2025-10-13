import { Outlet } from 'react-router-dom';
import Navbar from '../components/navigation/Navbar';

/**
 * RootLayout - Main layout wrapper for all routes
 * 
 * @component
 * @description Wraps all pages with persistent Navbar and main content area
 * 
 * @param {Object} props
 * @param {Object} props.authState - Current authentication state
 * @param {Function} props.updateAuthState - Function to update auth state
 * 
 * @structure
 * - Navbar (fixed at top, always visible)
 * - Main content area (Outlet renders child routes)
 * - Padding top to account for fixed navbar
 * 
 * @future_enhancements
 * - Add Footer component (Phase 3)
 * - Add scroll-to-top button
 * - Add loading state/progress bar for route changes
 * - Add breadcrumbs for nested routes
 */
const RootLayout = ({ authState, updateAuthState }) => {
  return (
    <>
      {/* Persistent Navbar */}
      <Navbar authState={authState} updateAuthState={updateAuthState} />
      
      {/* Main Content Area */}
      <main style={{ paddingTop: 'var(--nav-height)' }}>
        <Outlet />
      </main>

      {/* TODO: Add Footer in Phase 3 */}
      {/* <Footer /> */}
    </>
  );
};

export default RootLayout;