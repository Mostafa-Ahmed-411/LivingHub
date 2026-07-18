import React, { createContext, useState, useEffect } from 'react';
import { loginAPI, signupAPI, verifyOTPAPI, resendOTPAPI } from '../api/auth';
import api from '../api/client';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('clientData');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [loading, setLoading] = useState(true);

  // تحديث الـ localStorage والـ State معاً عند جلب بيانات البروفايل تلقائياً
  useEffect(() => {
    const checkAuth = async () => {
      if (localStorage.getItem('accessToken')) {
        try {
          const res = await api.get('/user/dashboard/profile');
          if (res.data && res.data.user) {
            setUser(res.data.user);
            // حفظ وتحديث الكائن الكامل في الـ clientData لتقرأ منه صفحة البروفايل
            localStorage.setItem('clientData', JSON.stringify(res.data.user));
          }
        } catch (err) {
          console.error('Failed to auto-authenticate user:', err);
          // Don't log the user out immediately on a failed profile fetch unless it's a 401/403
          // The interceptor will handle token refresh, and if that fails, the interceptor will clear the token.
          if (err.response && (err.response.status === 401 || err.response.status === 403)) {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('clientData');
            setUser(null);
          }
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    };
    checkAuth();
  }, []);

  const login = async (email, password) => {
    const data = await loginAPI(email, password);
    localStorage.setItem('accessToken', data.accessToken);
    
    if (data.user) {
      setUser(data.user);
      // حقن كائن المستخدم الكامل المليء ببيانات التسجيل داخل الـ clientData فوراً
      localStorage.setItem('clientData', JSON.stringify(data.user));
    }
    
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
      localStorage.removeItem('clientData'); // تنظيف الداتا عند الخروج تماماً
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