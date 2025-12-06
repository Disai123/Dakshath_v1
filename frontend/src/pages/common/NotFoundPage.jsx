import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Home } from 'lucide-react';

const NotFoundPage = () => {
  const { user } = useAuth();

  const getHomePath = () => {
    if (user?.role === 'student') return '/dashboard';
    if (user?.role === 'hr') return '/hr/dashboard';
    if (user?.role === 'admin') return '/admin/dashboard';
    return '/login';
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Page Not Found</h2>
        <p className="text-gray-600 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link to={getHomePath()} className="btn-primary inline-flex items-center gap-2">
          <Home className="w-5 h-5" />
          Go Home
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;

