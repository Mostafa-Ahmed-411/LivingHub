import api from './client';

export const getNotificationsAPI = async (page = 1, limit = 20) => {
  const response = await api.get('/notifications', {
    params: { page, limit }
  });
  return response.data;
};

export const markAsReadAPI = async (id) => {
  const response = await api.put(`/notifications/${id}/read`);
  return response.data;
};

export const markAllAsReadAPI = async () => {
  const response = await api.put('/notifications/mark-all-read');
  return response.data;
};
