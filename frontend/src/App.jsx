import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

// Layouts
import RootLayout from './layouts/RootLayout';

// Pages - Marketing Site (Public)
import Home from './pages/Home';
import Placeholder from './pages/Placeholder';

// Pages - Auth (Existing)
import LoginForm from './LoginForm';
import RegistrationForm from './RegistrationForm';
import Dashboard from './Dashboard';

// Route Guards (Existing - keep as is)
import ProtectedRoute from './ProtectedRoute';
import PublicOnlyRoute from './PublicOnlyRoute'; // Modified version of PublicRoute
import OnboardingRoute from './OnboardingRoute';

// Import global styles
import './styles/globals.css';
import Showcasing from './pages/Showcasing';
import Gallery from './pages/Gallery';
import Contact from './pages/Contact';
import Collaborate from './pages/Collaborate';
import Story from './pages/Story';

/**
 * Main Application Component
 * 
 * @component
 * @description Root component managing routing and auth state
 * 
 * @architecture
 * - Marketing pages (/, /showcasing, /gallery, etc.) are PUBLIC - no auth required
 * - Auth pages (/login, /register) redirect to /dashboard if already logged in
 * - Protected pages (/dashboard, /onboarding, /forms/:id) require authentication
 * - RootLayout wraps all routes with Navbar (shows auth-aware links)
 * 
 * @future_extensibility
 * - Role-based routing: Add `role` to authState, wrap routes with RoleRoute component
 * - Permission-based: Add `permissions` array to user object
 * - Admin routes: Create AdminRoute guard checking user.role === 'admin'
 */
function App() {
  // Auth state management (keep existing pattern)
  const [authState, setAuthState] = useState({
    isAuthenticated: !!localStorage.getItem('token'),
    isOnboarding: !!localStorage.getItem('onboardingToken'),
    user: null // Will be populated on successful auth
  });

  /**
   * Check token validity on app load
   * This ensures users stay logged in across page refreshes
   */
  useEffect(() => {
    const token = localStorage.getItem('token');
    const onboardingToken = localStorage.getItem('onboardingToken');
    
    if (token || onboardingToken) {
      // TODO: Add token validation API call here in future
      setAuthState({
        isAuthenticated: !!token,
        isOnboarding: !!onboardingToken,
        user: null // Populate from API in future
      });
    }
  }, []);

  /**
   * Update auth state (used by login/logout flows)
   * @param {Object} newState - Partial state object to merge
   */
  const updateAuthState = (newState) => {
    setAuthState(prev => ({ ...prev, ...newState }));
  };

  return (
    <Router>
      <Routes>
        {/* ========== PUBLIC MARKETING ROUTES ========== */}
        {/* All visitors can access these pages, auth optional */}
        <Route element={<RootLayout authState={authState} updateAuthState={updateAuthState} />}>
          {/* Home Page - Full implementation */}
          <Route path="/" element={<Home />} />
          
          {/* Marketing Pages - Placeholder for now (Phase 2) */}
          <Route 
            path="/showcasing" 
            element={
              <Showcasing/>
            } 
          />
          <Route path="contact" element={<Contact />} />
          <Route path="collaborations" element={<Collaborate />} />
          <Route 
            path="/gallery" 
            element={
              <Gallery />
            } 
          />
          <Route
            path="/shop" 
            element={
              <Placeholder 
                title="Shop" 
                subtitle="Official Merch"
                message="Coming Soon"
              />
            } 
          />
          <Route 
            path="/contact" 
            element={
              <Placeholder 
                title="Contact & Links" 
                subtitle="Get In Touch"
                message="Coming Soon"
              />
            } 
          />

        <Route path="/story" element={<Story />} />
        </Route>


        {/* ========== AUTH ROUTES (Public Only) ========== */}
        {/* Redirect to dashboard if already authenticated */}
        <Route 
          path="/register" 
          element={
            <PublicOnlyRoute authState={authState}>
              <RegistrationForm />
            </PublicOnlyRoute>
          } 
        />
        
        <Route 
          path="/login" 
          element={
            <PublicOnlyRoute authState={authState}>
              <LoginForm setAuth={updateAuthState} />
            </PublicOnlyRoute>
          } 
        />

        {/* ========== ONBOARDING ROUTE ========== */}
        {/* Special case: pending_onboarding users only */}
        <Route 
          path="/onboarding" 
          element={
            <OnboardingRoute authState={authState}>
              <Placeholder 
                title="Onboarding" 
                subtitle="Complete Your Profile"
                message="Onboarding form coming soon"
              />
              {/* TODO: Uncomment when A1Form is ready */}
              {/* <A1Form updateAuthState={updateAuthState} /> */}
            </OnboardingRoute>
          } 
        />

        {/* ========== PROTECTED ROUTES ========== */}
        {/* Require full authentication (active account) */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute authState={authState}>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/forms/:formId" 
          element={
            <ProtectedRoute authState={authState}>
              <Placeholder 
                title="Form View" 
                subtitle="View Your Submission"
                message="Form viewer coming soon"
              />
              {/* TODO: Uncomment when FormView is ready */}
              {/* <FormView /> */}
            </ProtectedRoute>
          } 
        />

        {/* ========== 404 CATCH-ALL ========== */}
        {/* TODO: Create proper 404 page in Phase 3 */}
        <Route 
          path="*" 
          element={
            <Placeholder 
              title="404" 
              subtitle="Page Not Found"
              message="The page you're looking for doesn't exist."
            />
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;