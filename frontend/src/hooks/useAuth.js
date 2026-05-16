import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { authService } from '../services/authService';
import { setUser, setLoading, clearAuth } from '../store/slices/authSlice';

export const useAuth = () => {
  const dispatch = useDispatch();
  const { user, isLoading, error } = useSelector((state) => state.auth);
  // const hasChecked = useRef(false);

  const checkAuth = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      dispatch(setLoading(false));
      return;
    }
    try {
      dispatch(setLoading(true));
      const response = await authService.getCurrentUser();
      dispatch(setUser(response));
    }
    catch (err) {
      console.error('Auth check failed:', err);
      localStorage.removeItem('token');
      dispatch(clearAuth());
    } finally {
      dispatch(setLoading(false));
    }
  };



  //   useEffect(() => {
  //     // Only check auth once on mount
  //     if (hasChecked.current) return;
  //     hasChecked.current = true;

  //     const checkAuth = async () => {
  //       // Check if token exists in localStorage
  //       const token = localStorage.getItem('token');

  //       if (!token) {
  //         // No token, so not logged in
  //         dispatch(setLoading(false));
  //         return;
  //       }

  //       try {
  //         dispatch(setLoading(true));

  //         // Set a timeout to avoid hanging
  //         const timeoutPromise = new Promise((_, reject) => 
  //           setTimeout(() => reject(new Error('Auth check timeout')), 5000)
  //         );

  //         const response = await Promise.race([
  //           authService.getCurrentUser(),
  //           timeoutPromise
  //         ]);

  //         dispatch(setUser(response));
  //       } catch (err) {
  //         console.error('Auth check failed:', err);
  //         // Token is invalid, expired, or timeout - clear it
  //         localStorage.removeItem('token');
  //         dispatch(clearAuth());
  //       } finally {
  //         dispatch(setLoading(false));
  //       }
  //     };

  //     checkAuth();
  //   }, [dispatch]);

  const login = async (email, password) => {
    try {
      dispatch(setLoading(true));
      const response = await authService.login(email, password);
      dispatch(setUser(response.user));
      return response;
    } catch (err) {
      dispatch(clearAuth());
      throw err;
    } finally {
      dispatch(setLoading(false));
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      dispatch(clearAuth());
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  return {
    user,
    isLoading,
    error,
    login,
    logout,
    isAuthenticated: !!user,
    checkAuth,
  };
};
