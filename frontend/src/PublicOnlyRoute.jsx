import { Navigate } from 'react-router-dom';

/**
 * PublicOnlyRoute - Route guard for auth pages (login/register)
 * 
 * @description
 * Redirects authenticated users to dashboard.
 * This is ONLY for login/register pages where authenticated users shouldn't be.
 * 
 * @difference_from_public_route
 * Old PublicRoute redirected ALL authenticated users from ANY page.
 * This only redirects from auth pages (/login, /register).
 * Marketing pages don't use this guard at all.
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Component to render if not authenticated
 * @param {Object} props.authState - Current authentication state
 * 
 * @example
 * <PublicOnlyRoute authState={authState}>
 *   <LoginForm />
 * </PublicOnlyRoute>
 */
const PublicOnlyRoute = ({ children, authState }) => {
  // If user is authenticated, they don't need login/register pages
  if (authState.isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  // Not authenticated - show the auth page (login/register)
  return children;
};

export default PublicOnlyRoute;