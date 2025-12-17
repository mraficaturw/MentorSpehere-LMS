import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import authAPI from '../api/auth';

export const useAuth = () => {
  const navigate = useNavigate();
  const { 
    user, 
    token, 
    role, 
    isAuthenticated, 
    isLoading, 
    error,
    login: storeLogin,
    logout: storeLogout,
    setLoading,
    setError,
  } = useAuthStore();

  const login = useCallback(async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const { user, token } = await authAPI.login(email, password);
      storeLogin(user, token);
      
      // Redirect based on role
      if (user.role === 'mentor') {
        navigate('/mentor/dashboard');
      } else {
        navigate('/student/dashboard');
      }
      
      return { user, token };
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [navigate, storeLogin, setLoading, setError]);

  const register = useCallback(async (name, email, password, role = 'student') => {
    setLoading(true);
    setError(null);
    try {
      const { user, token } = await authAPI.register(name, email, password, role);
      storeLogin(user, token);
      
      if (role === 'mentor') {
        navigate('/mentor/dashboard');
      } else {
        navigate('/student/dashboard');
      }
      
      return { user, token };
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [navigate, storeLogin, setLoading, setError]);

  const logout = useCallback(() => {
    storeLogout();
    navigate('/login');
  }, [navigate, storeLogout]);

  return {
    user,
    token,
    role,
    isAuthenticated,
    isLoading,
    error,
    login,
    register,
    logout,
    isStudent: role === 'student',
    isMentor: role === 'mentor',
  };
};

export default useAuth;
