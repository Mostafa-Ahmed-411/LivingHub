import React, { createContext, useState, useEffect } from 'react';
import { loginAPI, signupAPI, verifyOTPAPI, resendOTPAPI } from '../api/auth';
import api from '../api/client';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Auto-fetch profile on application load if accessToken exists
  useEffect(() => {
    const checkAuth = async () => {
      if (localStorage.getItem('accessToken')) {
        try {
          const res = await api.get('/user/dashboard/profile');
          setUser(res.data.user);
        } catch (err) {
          console.error('Failed to auto-authenticate user:', err);
          localStorage.removeItem('accessToken');
        }
      }
      setLoading(false);
    };
    checkAuth();
  }, []);

  const login = async (email, password) => {
    const data = await loginAPI(email, password);
    localStorage.setItem('accessToken', data.accessToken);
    setUser(data.user);
    return data.user;
  };

  const signup = async (payload) => {
    const data = await signupAPI(payload);
    return data;
  };

  const verifyOTP = async (email, code) => {
    const data = await verifyOTPAPI(email, code);
    return data;
  };

  const resendOTP = async (email) => {
    const data = await resendOTPAPI(email);
    return data;
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (err) {
      console.error('Failed logging out on server:', err);
    } finally {
      localStorage.removeItem('accessToken');
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        signup,
        verifyOTP,
        resendOTP,
        logout,
        setUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
