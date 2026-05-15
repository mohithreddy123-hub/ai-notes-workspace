/**
 * AI Feature Service — wraps all AI API calls.
 */
import api from './api';
import { API_ROUTES } from '../utils/constants';

const aiService = {
  generateSummary: (noteId) =>
    api.post(API_ROUTES.AI.SUMMARY(noteId)),

  extractActionItems: (noteId) =>
    api.post(API_ROUTES.AI.ACTIONS(noteId)),

  suggestTitle: (noteId) =>
    api.post(API_ROUTES.AI.TITLE(noteId)),

  getHistory: () =>
    api.get(API_ROUTES.AI.HISTORY),
};

export default aiService;
