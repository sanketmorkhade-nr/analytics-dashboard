import { useState, useEffect, useCallback } from 'react';
import { dashboardService } from '../services/dashboardService';
import type { UserActivity } from '@/shared/types/api';

export interface ActiveUsersParams {
  startDate?: string;
  endDate?: string;
  companies?: string[];
  limit?: number;
}

export const useActiveUsersData = (params: ActiveUsersParams = {}) => {
  const [activeUsers, setActiveUsers] = useState<UserActivity[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchActiveUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await dashboardService.getMostActiveUsers(params);
      setActiveUsers(response.data);
    } catch (err) {
      console.error('Failed to fetch active users data:', err);
      setError('Failed to fetch active users data');
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => {
    fetchActiveUsers();
  }, [fetchActiveUsers]);

  return {
    activeUsers,
    loading,
    error,
    refetch: fetchActiveUsers,
  };
};
