import { useState, useEffect, useCallback } from 'react';
import { eventExplorerService } from '../services/eventExplorerService';

interface MetricsDataHookProps {
  startDate?: string;
  endDate?: string;
  companies: string[];
}

interface MetricsDataState {
  metrics: { totalEvents: number; uniqueUsers: number } | null;
  loading: boolean;
  error: string | null;
}

export const useMetricsData = ({ startDate, endDate, companies }: MetricsDataHookProps) => {
  const [state, setState] = useState<MetricsDataState>({
    metrics: null,
    loading: false,
    error: null,
  });

  // Fetch metrics based on current filters
  const fetchMetrics = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const apiParams = {
        startDate,
        endDate,
        companies,
      };
      const response = await eventExplorerService.getEventMetrics(apiParams);
      setState(prev => ({ 
        ...prev, 
        metrics: response, 
        loading: false 
      }));
    } catch (error) {
      console.error('Failed to fetch metrics:', error);
      setState(prev => ({ 
        ...prev, 
        error: 'Failed to fetch metrics', 
        loading: false 
      }));
    }
  }, [startDate, endDate, companies]);

  // Fetch metrics when filters change
  useEffect(() => {
    fetchMetrics();
  }, [fetchMetrics]);

  return {
    ...state,
    refetch: fetchMetrics,
  };
};
