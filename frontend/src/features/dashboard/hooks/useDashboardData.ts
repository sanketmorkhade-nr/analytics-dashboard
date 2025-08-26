import { useQuery } from '@tanstack/react-query';
import { dashboardService } from '../services/dashboardService';
import type { MetricsResponse, TimeSeriesResponse } from '@/shared/types/api';
import { QUERY_KEYS, ERROR_MESSAGES } from '@/shared/constants/analytics';
import { 
  getDefaultDateRange,
  buildQueryKey,
  formatQueryError 
} from '@/shared/utils/queryUtils';

export interface DashboardData {
  metrics: MetricsResponse | null;
  trends: TimeSeriesResponse | null;
  loading: boolean;
  error: string | null;
}

export const useDashboardData = () => {
  const { startDate, endDate } = getDefaultDateRange();

  const {
    data: metrics,
    isLoading: metricsLoading,
    error: metricsError,
    refetch: refetchMetrics,
  } = useQuery({
    queryKey: buildQueryKey(QUERY_KEYS.DASHBOARD, 'metrics'),
    queryFn: () => dashboardService.getMetrics(),
  });

  const {
    data: trends,
    isLoading: trendsLoading,
    error: trendsError,
    refetch: refetchTrends,
  } = useQuery({
    queryKey: buildQueryKey(QUERY_KEYS.DASHBOARD, 'trends', 'daily', startDate, endDate),
    queryFn: () => dashboardService.getTrends({ 
      timeframe: 'daily',
      startDate,
      endDate
    }),
  });

  const loading = metricsLoading || trendsLoading;
  const error = metricsError || trendsError;

  const refreshData = () => {
    refetchMetrics();
    refetchTrends();
  };

  return {
    metrics: metrics || null,
    trends: trends || null,
    loading,
    error: formatQueryError(error, ERROR_MESSAGES.DASHBOARD_DATA),
    refreshData,
  };
};
