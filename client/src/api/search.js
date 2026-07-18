import api from './client';

export const searchUnitsAPI = (params) =>
  api.get('/search', { params }).then((res) => res.data);

export const getStatsAPI = () =>
  api.get('/search/stats').then((res) => res.data);

export const getRecommendedUnitsAPI = () =>
  api.get('/search/recommended').then((res) => res.data);

export const getUnitByIdAPI = (id) =>
  api.get(`/units/${id}`).then((res) => res.data);

export const getActiveAdAPI = () =>
  api.get('/search/active-ad').then((res) => res.data);
