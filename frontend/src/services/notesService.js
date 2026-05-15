import api from './api';
import { API_ROUTES } from '../utils/constants';

// ── Notes ─────────────────────────────────────────────────────────────────

export const notesService = {
  list: (params = {}) => api.get(API_ROUTES.NOTES.BASE, { params }),
  get: (id) => api.get(`${API_ROUTES.NOTES.BASE}${id}/`),
  create: (data) => api.post(API_ROUTES.NOTES.BASE, data),
  update: (id, data) => api.patch(`${API_ROUTES.NOTES.BASE}${id}/`, data),
  delete: (id) => api.delete(`${API_ROUTES.NOTES.BASE}${id}/`),

  // Actions
  pin: (id) => api.post(`${API_ROUTES.NOTES.BASE}${id}/pin/`),
  archive: (id) => api.post(`${API_ROUTES.NOTES.BASE}${id}/archive/`),
  restore: (id) => api.post(`${API_ROUTES.NOTES.BASE}${id}/restore/`),
  share: (id) => api.post(`${API_ROUTES.NOTES.BASE}${id}/share/`),
  unshare: (id) => api.post(`${API_ROUTES.NOTES.BASE}${id}/unshare/`),

  // Filtered views
  pinned: () => api.get(API_ROUTES.NOTES.PINNED),
  archived: () => api.get(API_ROUTES.NOTES.ARCHIVED),
};

// ── Tags ─────────────────────────────────────────────────────────────────

export const tagsService = {
  list: () => api.get(API_ROUTES.NOTES.TAGS),
  create: (data) => api.post(API_ROUTES.NOTES.TAGS, data),
  update: (id, data) => api.patch(`${API_ROUTES.NOTES.TAGS}${id}/`, data),
  delete: (id) => api.delete(`${API_ROUTES.NOTES.TAGS}${id}/`),
};
