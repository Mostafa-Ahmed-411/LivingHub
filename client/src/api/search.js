import api from './client';

export const searchUnitsAPI = (params) =>
  api.get('/search', { params }).then((res) => res.data);
