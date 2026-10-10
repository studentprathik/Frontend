import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('ptf_user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch (e) {
      return null;
    }
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      localStorage.setItem('ptf_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('ptf_user');
    }
  }, [user]);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const response = await api.post('/auth/login', { email, password });
      if (response.success && response.data) {
        setUser(response.data);
        return { success: true, message: response.message };
      }
      throw new Error(response.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setLoading(true);
    try {
      const response = await api.post('/auth/register', userData);
      return response;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('ptf_user');
  };

  const updateUser = (updatedFields) => {
    setUser((prev) => {
      const next = { ...prev, ...updatedFields };
      localStorage.setItem('ptf_user', JSON.stringify(next));
      return next;
    });
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, updateUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
