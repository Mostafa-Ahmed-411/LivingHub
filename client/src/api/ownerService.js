import api from './api';

// جلب بيانات الـ Overview الخاصة بالـ Owner
export const getOwnerOverviewData = async () => {
  try {
    // السطر المظبوط بالملي بناءً على الـ app.js والـ routes
    const response = await api.get('/owner/dashboard/stats'); 
    return response.data;
  } catch (error) {
    console.error("Error fetching owner overview:", error);
    throw error;
  }
};