import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../features/auth/auth-context';

interface ProtectedRouteProps {
  allowedRoles?: string[];
}

export function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return null;
  }
  if (!user) {
    // Encoded in the URL, not router state: router `state` lives in
    // history.state, which survives a hard reload of the same URL - a
    // different user logging in after a reload could otherwise inherit the
    // previous session's stale redirect target.
    const from = encodeURIComponent(location.pathname);
    return <Navigate to={`/login?from=${from}`} replace />;
  }
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }
  return <Outlet />;
}
