import React, { createContext, useState, useEffect, useContext } from 'react';
import API from '../api/axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const DEFAULT_THEME = '#ea580c';

  // Apply Brand Theme
  const applyTheme = (color) => {
    const themeColor = color || DEFAULT_THEME;
    const root = document.documentElement;
    root.style.setProperty('--primary-base', themeColor);
    root.style.setProperty('--primary-hover', themeColor + 'dd');
    root.style.setProperty('--primary-shadow', `${themeColor}33`);
  };

  useEffect(() => {
    if (user?.companyId?.themeColor) {
      applyTheme(user.companyId.themeColor);
    } else {
      applyTheme(DEFAULT_THEME);
    }
  }, [user]);

  // Check if user is logged in on mount
  useEffect(() => {
    const checkUser = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setLoading(false);
          return;
        }

        const response = await API.get('/auth/getMe');
        if (response.data.status === 'success') {
          setUser(response.data.data.user);
        }
      } catch (err) {
        // Token might be invalid, clear it
        localStorage.removeItem('token');
      } finally {
        setLoading(false);
      }
    };
    checkUser();
  }, []);

  const login = async (email, password) => {
    try {
      setError(null);
      const response = await API.post('/auth/login', {
        email,
        password,
      });

      if (response.data.status === 'password-reset-required') {
          return 'password-reset-required';
      }

      const { data, token } = response.data;
      
      // Store token in localStorage for cross-domain auth
      if (token) {
        localStorage.setItem('token', token);
      }

      setUser(data.user);
      return data.user;
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
      throw err;
    }
  };

  const logout = async () => {
    try {
      await API.get('/auth/logout');
      localStorage.removeItem('token');
      setUser(null);
      window.location.href = '/login';
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout, loading, error }}>
      {children}
    </AuthContext.Provider>
  );
};
