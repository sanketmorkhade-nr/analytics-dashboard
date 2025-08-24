import { useState, useCallback, useEffect } from 'react';
import { dashboardService } from '../services/dashboardService';
import type { MetricsResponse, TimeSeriesResponse } from '@/shared/types/api';

export interface DashboardData {
  metrics: MetricsResponse | null;
  trends: TimeSeriesResponse | null;
  loading: boolean;
  error: string | null;
}

export const useDashboardData = () => {
  const [data, setData] = useState<DashboardData>({
    metrics: null,
    trends: null,
    loading: true,
    error: null,
  });

  const fetchData = useCallback(async () => {
    setData(prev => ({ ...prev, loading: true, error: null }));
    try {
      // Use the correct date range for the 2025 data
      // Data range is from 2025-05-30 to 2025-07-22
      const endDate = '2025-07-22';
      const startDate = '2025-06-01'; // Start from June 1st for a good sample
      
      const [metricsRes, trendsRes] = await Promise.all([
        dashboardService.getMetrics(),
        dashboardService.getTrends({ 
          timeframe: 'daily',
          startDate,
          endDate
        })
      ]);
      setData({
        metrics: metricsRes,
        trends: trendsRes,
        loading: false,
        error: null,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch dashboard data';
      setData(prev => ({ ...prev, error: errorMessage, loading: false }));
    }
  }, []);

  const refreshData = useCallback(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    ...data,
    refreshData,
  };
};
