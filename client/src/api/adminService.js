import api from "./client";

// جلب إحصائيات لوحة تحكم الأدمن
export const getAdminStats = async () => {
  try {
    const response = await api.get("/admin/stats");
    return response.data;
  } catch (error) {
    console.error("Error fetching admin stats:", error);
    throw error;
  }
};

// جلب الوحدات المعلقة
export const getPendingUnits = async () => {
  try {
    const response = await api.get("/admin/units/pending");
    return response.data;
  } catch (error) {
    console.error("Error fetching pending units:", error);
    throw error;
  }
};

// قبول وحدة سكنية
export const approveUnit = async (id) => {
  try {
    const response = await api.patch(`/admin/units/${id}/approve`);
    return response.data;
  } catch (error) {
    console.error("Error approving unit:", error);
    throw error;
  }
};

// رفض وحدة سكنية مع السبب
export const rejectUnit = async (id, reason) => {
  try {
    const response = await api.patch(`/admin/units/${id}/reject`, { reason });
    return response.data;
  } catch (error) {
    console.error("Error rejecting unit:", error);
    throw error;
  }
};

// تحديث الإعدادات العامة (الحد الأقصى للوحدات المجانية)
export const updateSettings = async (maxFreeUnitsPerOwner) => {
  try {
    const response = await api.patch("/admin/settings", { maxFreeUnitsPerOwner });
    return response.data;
  } catch (error) {
    console.error("Error updating settings:", error);
    throw error;
  }
};

// الحصول على الإعدادات الحالية
export const getSettings = async () => {
  try {
    const response = await api.get("/admin/settings");
    return response.data;
  } catch (error) {
    console.error("Error getting settings:", error);
    throw error;
  }
};

// جلب طلبات التميز المعلقة
export const getFeatureRequests = async () => {
  try {
    const response = await api.get("/admin/units/feature-requests");
    return response.data;
  } catch (error) {
    console.error("Error fetching feature requests:", error);
    throw error;
  }
};

// قبول تمييز وحدة
export const approveFeature = async (id) => {
  try {
    const response = await api.patch(`/admin/units/${id}/approve-feature`);
    return response.data;
  } catch (error) {
    console.error("Error approving feature request:", error);
    throw error;
  }
};

// رفض تمييز وحدة
export const rejectFeature = async (id) => {
  try {
    const response = await api.patch(`/admin/units/${id}/reject-feature`);
    return response.data;
  } catch (error) {
    console.error("Error rejecting feature request:", error);
    throw error;
  }
};

// جلب قائمة المستخدمين للأدمن
export const getUsers = async (params = {}) => {
  try {
    const response = await api.get("/admin/users", { params });
    return response.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

// حظر أو فك حظر مستخدم
export const toggleUserBan = async (id) => {
  try {
    const response = await api.post(`/admin/users/${id}/ban`);
    return response.data;
  } catch (error) {
    console.error("Error toggling user ban:", error);
    throw error;
  }
};

// وسم مستخدم مشبوه
export const flagUser = async (id) => {
  try {
    const response = await api.post(`/admin/users/${id}/flag`);
    return response.data;
  } catch (error) {
    console.error("Error flagging user:", error);
    throw error;
  }
};

// جلب المدفوعات المعلقة
export const getPendingPayments = async () => {
  try {
    const response = await api.get("/admin/pendings");
    return response.data;
  } catch (error) {
    console.error("Error fetching pending payments:", error);
    throw error;
  }
};

// قبول الدفع
export const approvePaymentAPI = async (id) => {
  try {
    const response = await api.post(`/admin/payments/${id}/approve`);
    return response.data;
  } catch (error) {
    console.error("Error approving payment:", error);
    throw error;
  }
};

// رفض الدفع
export const rejectPaymentAPI = async (id, reason) => {
  try {
    const response = await api.post(`/admin/payments/${id}/reject`, { reason });
    return response.data;
  } catch (error) {
    console.error("Error rejecting payment:", error);
    throw error;
  }
};

// جلب سجلات المراجعة
export const getAuditLogs = async (params = {}) => {
  try {
    const response = await api.get("/admin/audit-logs", { params });
    return response.data;
  } catch (error) {
    console.error("Error fetching audit logs:", error);
    throw error;
  }
};

// جلب البلاغات
export const getReports = async (params = {}) => {
  try {
    const response = await api.get("/admin/reports", { params });
    return response.data;
  } catch (error) {
    console.error("Error fetching reports:", error);
    throw error;
  }
};

// حل بلاغ
export const resolveReport = async (id, resolution) => {
  try {
    const response = await api.patch(`/admin/reports/${id}/resolve`, { resolution });
    return response.data;
  } catch (error) {
    console.error("Error resolving report:", error);
    throw error;
  }
};

// رفض بلاغ
export const dismissReport = async (id) => {
  try {
    const response = await api.patch(`/admin/reports/${id}/dismiss`);
    return response.data;
  } catch (error) {
    console.error("Error dismissing report:", error);
    throw error;
  }
};

// جلب الإعلانات للأدمن
export const getAds = async () => {
  try {
    const response = await api.get("/admin/ads");
    return response.data;
  } catch (error) {
    console.error("Error fetching ads:", error);
    throw error;
  }
};

// إنشاء إعلان جديد
export const createAd = async (formData) => {
  try {
    const response = await api.post("/admin/ads", formData, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    });
    return response.data;
  } catch (error) {
    console.error("Error creating ad:", error);
    throw error;
  }
};

// تحديث إعلان
export const updateAd = async (id, formData) => {
  try {
    const response = await api.patch(`/admin/ads/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    });
    return response.data;
  } catch (error) {
    console.error("Error updating ad:", error);
    throw error;
  }
};

// حذف إعلان
export const deleteAd = async (id) => {
  try {
    const response = await api.delete(`/admin/ads/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting ad:", error);
    throw error;
  }
};

// تفعيل/تعطيل الإعلان
export const toggleAdStatus = async (id) => {
  try {
    const response = await api.post(`/admin/ads/${id}/toggle`);
    return response.data;
  } catch (error) {
    console.error("Error toggling ad status:", error);
    throw error;
  }
};
