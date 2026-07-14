import api from "./api";

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
