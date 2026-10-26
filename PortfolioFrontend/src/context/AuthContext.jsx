import { useState, useEffect, useCallback } from 'react';
import { AuthContext } from './auth-context.js';
import authService from '../services/authService.js';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const verifySession = async () => {
      try {
        const res = await authService.getMe();
        if (isMounted && res?.success && res?.data?.user) {
          setUser(res.data.user);
          setIsAuthenticated(true);
        } else if (isMounted) {
          setUser(null);
          setIsAuthenticated(false);
        }
      } catch {
        if (isMounted) {
          setUser(null);
          setIsAuthenticated(false);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };
    verifySession();
    return () => {
      isMounted = false;
    };
  }, []);

  const checkAuth = useCallback(async () => {
    try {
      const res = await authService.getMe();
      if (res?.success && res?.data?.user) {
        setUser(res.data.user);
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch {
      setUser(null);
      setIsAuthenticated(false);
    }
  }, []);

  const login = async (email, password) => {
    setIsLoading(true);
    try {
      const res = await authService.login(email, password);
      if (res?.success && res?.data?.user) {
        setUser(res.data.user);
        setIsAuthenticated(true);
        return res;
      }
      throw new Error(res?.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await authService.logout();
    } finally {
      setUser(null);
      setIsAuthenticated(false);
      setIsLoading(false);
    }
  };

  const value = {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    checkAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
