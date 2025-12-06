import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { authService } from '../../services/authService';
import { Briefcase, Mail, Lock, AlertCircle } from 'lucide-react';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const LoginPage = () => {
  const { isAuthenticated, login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loginType, setLoginType] = useState('student'); // 'student', 'hr', 'admin'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Check for error or success in URL params
  useEffect(() => {
    const errorParam = searchParams.get('error');
    const registeredParam = searchParams.get('registered');
    
    if (errorParam) {
      const errorMessages = {
        auth_failed: 'Authentication failed. Please try again.',
        google_login_students_only: 'Google login is only available for students. Please use email/password login.',
        account_inactive: 'Your account is inactive. Please contact administrator.',
        company_pending: 'Your company registration is pending approval. Please wait for admin approval before logging in.'
      };
      setError(errorMessages[errorParam] || 'An error occurred. Please try again.');
    }
    
    if (registeredParam === 'true') {
      setError('Company registration successful! Your account is pending admin approval. You will receive an email once approved.');
    }
  }, [searchParams]);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleStudentLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (email && password) {
        // Email/password login
        const response = await authService.studentLogin(email, password);
        console.log('Student login response:', response);
        if (response && response.success && response.data && response.data.token && response.data.user) {
          login(response.data.token, response.data.user);
          // AuthContext login function will handle redirect
        } else {
          console.error('Invalid response structure:', response);
          setError('Login failed. Invalid response from server.');
          setLoading(false);
        }
      } else {
        // Google OAuth
        authService.googleLogin();
      }
    } catch (err) {
      console.error('Student login error:', err);
      const errorMsg = err.response?.data?.error?.message || err.message || 'Login failed. Please try again.';
      setError(errorMsg);
      setLoading(false);
    }
  };

  const handleHRLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authService.hrLogin(email, password);
      console.log('HR login response:', response);
      if (response && response.success && response.data && response.data.token && response.data.user) {
        login(response.data.token, response.data.user);
        // AuthContext login function will handle redirect
      } else {
        console.error('Invalid response structure:', response);
        setError('Login failed. Invalid response from server.');
        setLoading(false);
      }
    } catch (err) {
      console.error('HR login error:', err);
      const errorMsg = err.response?.data?.error?.message || err.message || 'Login failed. Please try again.';
      setError(errorMsg);
      setLoading(false);
    }
  };

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authService.adminLogin(email, password);
      console.log('Admin login response:', response);
      if (response && response.success && response.data && response.data.token && response.data.user) {
        login(response.data.token, response.data.user);
        // AuthContext login function will handle redirect
      } else {
        console.error('Invalid response structure:', response);
        setError('Login failed. Invalid response from server.');
        setLoading(false);
      }
    } catch (err) {
      console.error('Admin login error:', err);
      const errorMsg = err.response?.data?.error?.message || err.message || 'Login failed. Please try again.';
      setError(errorMsg);
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    if (loginType === 'student') {
      handleStudentLogin(e);
    } else if (loginType === 'hr') {
      handleHRLogin(e);
    } else if (loginType === 'admin') {
      handleAdminLogin(e);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-light to-white flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="card">
          <div className="text-center mb-6">
            <Briefcase className="w-16 h-16 text-primary mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Dakshath</h1>
            <p className="text-gray-600">Job & Internship Platform</p>
          </div>

          {/* Login Type Tabs */}
          <div className="flex gap-2 mb-6 border-b border-gray-200">
            <button
              onClick={() => {
                setLoginType('student');
                setError('');
                setEmail('');
                setPassword('');
              }}
              className={`flex-1 py-2 text-sm font-medium border-b-2 transition-colors ${
                loginType === 'student'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Student
            </button>
            <button
              onClick={() => {
                setLoginType('hr');
                setError('');
                setEmail('');
                setPassword('');
              }}
              className={`flex-1 py-2 text-sm font-medium border-b-2 transition-colors ${
                loginType === 'hr'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              HR
            </button>
            <button
              onClick={() => {
                setLoginType('admin');
                setError('');
                setEmail('');
                setPassword('');
              }}
              className={`flex-1 py-2 text-sm font-medium border-b-2 transition-colors ${
                loginType === 'admin'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Admin
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-error-light border border-error rounded-lg flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-error mt-0.5 flex-shrink-0" />
              <p className="text-sm text-error">{error}</p>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field pl-10"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field pl-10"
                  placeholder="Enter your password"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <LoadingSpinner size="sm" />
                  <span className="ml-2">Logging in...</span>
                </span>
              ) : (
                'Login'
              )}
            </button>
          </form>

          {/* Google Login for Students */}
          {loginType === 'student' && (
            <div className="mt-4">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Or</span>
                </div>
              </div>
              <button
                onClick={() => authService.googleLogin()}
                className="mt-4 w-full btn-secondary flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Sign in with Google
              </button>
              <p className="text-xs text-gray-500 mt-2 text-center">
                Students can use their LMS credentials or Google account
              </p>
            </div>
          )}

          {/* Info Messages */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            {loginType === 'student' && (
              <p className="text-sm text-gray-600 text-center">
                Use your LMS account credentials to login
              </p>
            )}
            {loginType === 'hr' && (
              <p className="text-sm text-gray-600 text-center">
                HR users: Use your company-provided credentials
              </p>
            )}
            {loginType === 'admin' && (
              <p className="text-sm text-gray-600 text-center">
                Admin: Use your shared LMS/Dakshath credentials
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
