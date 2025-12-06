import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = authService.getToken();
      const savedUser = authService.getUser();

      if (token && savedUser) {
        try {
          const currentUser = await authService.getCurrentUser();
          setUser(currentUser);
          authService.setUser(currentUser);
        } catch (error) {
          console.error('Auth error:', error);
          authService.logout();
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = (token, userData) => {
    authService.setToken(token);
    authService.setUser(userData);
    setUser(userData);
    
    // Redirect based on role
    if (userData.role === 'student') {
      window.location.href = '/dashboard';
    } else if (userData.role === 'hr') {
      window.location.href = '/hr/dashboard';
    } else if (userData.role === 'admin') {
      window.location.href = '/admin/dashboard';
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const updateUser = (userData) => {
    setUser(userData);
    authService.setUser(userData);
  };

  const value = {
    user,
    loading,
    login,
    logout,
    updateUser,
    isAuthenticated: !!user
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

