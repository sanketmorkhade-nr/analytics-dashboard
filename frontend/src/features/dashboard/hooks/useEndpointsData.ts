import { useState, useEffect, useCallback } from 'react';
import { dashboardService } from '../services/dashboardService';
import type { EndpointActivity } from '@/shared/types/api';

export interface EndpointsParams {
  startDate?: string;
  endDate?: string;
  companies?: string[];
  limit?: number;
}

export const useEndpointsData = (params: EndpointsParams = {}) => {
  const [endpoints, setEndpoints] = useState<EndpointActivity[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchEndpoints = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await dashboardService.getTopEndpointsByUsage(params);
      setEndpoints(response.data);
    } catch (err) {
      console.error('Failed to fetch endpoints data:', err);
      setError('Failed to fetch endpoints data');
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => {
    fetchEndpoints();
  }, [fetchEndpoints]);

  return {
    endpoints,
    loading,
    error,
    refetch: fetchEndpoints,
  };
};
