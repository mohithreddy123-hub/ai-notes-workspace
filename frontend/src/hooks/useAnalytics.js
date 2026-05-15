import { useQuery } from '@tanstack/react-query';
import analyticsService from '../services/analyticsService';

export const useDashboardStats = () => {
  return useQuery({
    queryKey: ['analytics-dashboard'],
    queryFn: () => analyticsService.getDashboard().then((r) => r.data),
    staleTime: 5 * 60 * 1000, // 5 minutes cache
  });
};
