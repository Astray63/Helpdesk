import React, { createContext, useState, useContext, useEffect } from 'react';
import authService from '../services/authService';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth doit être utilisé dans un AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token');
      
      if (token) {
        try {
          const response = await authService.getCurrentUserFromAPI();
          setUser(response.data.user);
        } catch (error) {
          console.error('Erreur token:', error);
          authService.logout();
          setUser(null);
        }
      } else {
        setUser(null);
      }
      
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (credentials) => {
    const response = await authService.login(credentials);
    setUser(response.data.user);
    return response;
  };

  const register = async (userData) => {
    const response = await authService.register(userData);
    setUser(response.data.user);
    return response;
  };

  const refreshUser = async () => {
    try {
      const response = await authService.getCurrentUserFromAPI();
      setUser(response.data.user);
      return response;
    } catch (error) {
      authService.logout();
      setUser(null);
      throw error;
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const isAdmin = () => {
    return user && user.role === 'admin';
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    refreshUser,
    isAdmin,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
