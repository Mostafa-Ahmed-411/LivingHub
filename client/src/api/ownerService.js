import api from './api';

// جلب بيانات الـ Overview الخاصة بالـ Owner
export const getOwnerOverviewData = async () => {
  try {
    const response = await api.get('/owner/dashboard/stats'); 
    return response.data;
  } catch (error) {
    console.error("Error fetching owner overview:", error);
    throw error;
  }
};

// جلب قائمة العقارات الخاصة بالمالك
export const getOwnerListings = async () => {
  try {
    const response = await api.get('/owner/dashboard/units');
    return response.data.units;
  } catch (error) {
    console.error("Error fetching owner listings:", error);
    throw error;
  }
};

// إلغاء تنشيط عقار (القديم)
export const deleteOwnerListing = async (id) => {
  try {
    const response = await api.delete(`/units/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting owner listing:", error);
    throw error;
  }
};

// 👇 الدالة الجديدة: حذف العقار نهائياً من الـ Database 👇
export const deleteOwnerUnit = async (id) => {
  try {
    // إرسال طلب DELETE إلى مسار الحذف الذي قمنا بحقنه في الـ routes والـ controller
    const response = await api.delete(`/user/dashboard/units/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting property permanently:", error);
    throw error;
  }
};

// جلب تاريخ الإيجارات/العمليات
export const getOwnerHistory = async () => {
  try {
    const response = await api.get('/owner/dashboard/history');
    return response.data.history;
  } catch (error) {
    console.error("Error fetching owner history:", error);
    throw error;
  }
};

// إضافة وحدة جديدة
export const createUnit = async (formData) => {
  try {
    const response = await api.post('/units', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error) {
    console.error("Error creating unit:", error);
    throw error;
  }
};

// تفعيل أو تعطيل العقار
export const toggleUnitActive = async (id, isActive) => {
  try {
    const response = await api.put(`/units/${id}`, { isActive });
    return response.data;
  } catch (error) {
    console.error("Error toggling unit active status:", error);
    throw error;
  }
};

// تعديل العقار
export const updateUnit = async (id, formData) => {
  try {
    const response = await api.put(`/units/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error) {
    console.error("Error updating unit:", error);
    throw error;
  }
};