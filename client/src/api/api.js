import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api', // تأكد إن ده بورت الباك إيند بتاعك
  withCredentials: true, // عشان لو الباك إيند بيتعامل بالكوكيز للـ Refresh Token
});

// interceptor لحقن التوكن تلقائياً في الـ Headers قبل أي طلب ما يخرج
api.interceptors.request.use(
  (config) => {
    // اسحب التوكن اللي اتحفظ عندك وقت الـ Login (تأكد من الاسم المحفوظ به في الـ localStorage)
    const token = localStorage.getItem('token') || localStorage.getItem('accessToken');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;