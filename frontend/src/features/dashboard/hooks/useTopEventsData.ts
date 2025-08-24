import { useState, useEffect, useCallback } from 'react';
import { dashboardService } from '../services/dashboardService';

export interface TopEventsParams {
  startDate?: string;
  endDate?: string;
  companies?: string[];
  limit?: number;
}

export const useTopEventsData = (params: TopEventsParams = {}) => {
  const [topEvents, setTopEvents] = useState<Array<{ type: string; count: number }>>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTopEvents = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await dashboardService.getTopEventsByVolume(params);
      setTopEvents(response.data);
    } catch (err) {
      console.error('Failed to fetch top events data:', err);
      setError('Failed to fetch top events data');
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => {
    fetchTopEvents();
  }, [fetchTopEvents]);

  return {
    topEvents,
    loading,
    error,
    refetch: fetchTopEvents,
  };
};
