// Share / Unshare a note
import api from './api';
import { API_ROUTES } from '../utils/constants';

export const shareService = {
  shareNote: (id) => api.post(`/notes/notes/${id}/share/`),
  unshareNote: (id) => api.post(`/notes/notes/${id}/unshare/`),
  getSharedNote: (shareId) => api.get(API_ROUTES.SHARED(shareId)),
};
