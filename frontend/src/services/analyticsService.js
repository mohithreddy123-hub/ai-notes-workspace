/**
 * Analytics Service — wraps the dashboard API call.
 */
import api from './api';
import { API_ROUTES } from '../utils/constants';

const analyticsService = {
  getDashboard: () => api.get(API_ROUTES.ANALYTICS.DASHBOARD),
};

export default analyticsService;
