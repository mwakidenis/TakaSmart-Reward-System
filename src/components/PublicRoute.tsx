
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import LandingPage from '@/pages/LandingPage';

const PublicRoute = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  // If user is authenticated, redirect to dashboard
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  // Show landing page for non-authenticated users
  return <LandingPage />;
};

export default PublicRoute;
