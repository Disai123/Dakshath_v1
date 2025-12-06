import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, useAuth } from './context/AuthContext';

// Pages
import LandingPage from './pages/common/LandingPage';
import LoginPage from './pages/auth/LoginPage';
import AuthCallbackPage from './pages/auth/AuthCallbackPage';
import CompanyRegistrationPage from './pages/common/CompanyRegistrationPage';
import StudentDashboard from './pages/student/StudentDashboard';
import JobSearchPage from './pages/student/JobSearchPage';
import JobDetailPage from './pages/student/JobDetailPage';
import ApplicationsPage from './pages/student/ApplicationsPage';
import ProfilePage from './pages/student/ProfilePage';
import HRDashboard from './pages/hr/HRDashboard';
import CreateJobPage from './pages/hr/CreateJobPage';
import JobManagementPage from './pages/hr/JobManagementPage';
import HRApplicationsPage from './pages/hr/HRApplicationsPage';
import CompanyProfilePage from './pages/hr/CompanyProfilePage';
import AdminDashboard from './pages/admin/AdminDashboard';
import CompanyApprovalPage from './pages/admin/CompanyApprovalPage';
import UserManagementPage from './pages/admin/UserManagementPage';
import HRRequestsPage from './pages/admin/HRRequestsPage';
import NotificationsPage from './pages/common/NotificationsPage';
import NotFoundPage from './pages/common/NotFoundPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1
    }
  }
});

const PrivateRoute = ({ children, allowedRoles = [] }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register/company" element={<CompanyRegistrationPage />} />
      <Route path="/auth/callback" element={<AuthCallbackPage />} />
      
      {/* Public Job Routes */}
      <Route path="/jobs" element={<JobSearchPage />} />
      <Route path="/jobs/:id" element={<JobDetailPage />} />
      
      {/* Notifications (Protected) */}
      <Route
        path="/notifications"
        element={
          <PrivateRoute>
            <NotificationsPage />
          </PrivateRoute>
        }
      />

      {/* Student Routes */}
      <Route
        path="/dashboard"
        element={
          <PrivateRoute allowedRoles={['student']}>
            <StudentDashboard />
          </PrivateRoute>
        }
      />
      <Route
        path="/applications"
        element={
          <PrivateRoute allowedRoles={['student']}>
            <ApplicationsPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <PrivateRoute allowedRoles={['student']}>
            <ProfilePage />
          </PrivateRoute>
        }
      />

      {/* HR Routes */}
      <Route
        path="/hr/dashboard"
        element={
          <PrivateRoute allowedRoles={['hr']}>
            <HRDashboard />
          </PrivateRoute>
        }
      />
      <Route
        path="/hr/jobs/create"
        element={
          <PrivateRoute allowedRoles={['hr']}>
            <CreateJobPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/hr/jobs"
        element={
          <PrivateRoute allowedRoles={['hr']}>
            <JobManagementPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/hr/applications"
        element={
          <PrivateRoute allowedRoles={['hr']}>
            <HRApplicationsPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/hr/company"
        element={
          <PrivateRoute allowedRoles={['hr']}>
            <CompanyProfilePage />
          </PrivateRoute>
        }
      />

      {/* Admin Routes */}
      <Route
        path="/admin/dashboard"
        element={
          <PrivateRoute allowedRoles={['admin']}>
            <AdminDashboard />
          </PrivateRoute>
        }
      />
      <Route
        path="/admin/companies"
        element={
          <PrivateRoute allowedRoles={['admin']}>
            <CompanyApprovalPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/admin/users"
        element={
          <PrivateRoute allowedRoles={['admin']}>
            <UserManagementPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/admin/requests"
        element={
          <PrivateRoute allowedRoles={['admin']}>
            <HRRequestsPage />
          </PrivateRoute>
        }
      />

      {/* 404 */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <AppRoutes />
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;

