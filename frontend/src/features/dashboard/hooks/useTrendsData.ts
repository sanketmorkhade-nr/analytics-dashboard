import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { dashboardService } from '../services/dashboardService';
import { QUERY_KEYS, ERROR_MESSAGES } from '@/shared/constants/analytics';
import { 
  getDefaultDateRange,
  buildQueryKey,
  formatQueryError 
} from '@/shared/utils/queryUtils';

export const useTrendsData = () => {
  const [timeframe, setTimeframe] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const { startDate, endDate } = getDefaultDateRange();

  const {
    data: trendsData,
    isLoading: loading,
    error,
    refetch,
  } = useQuery({
    queryKey: buildQueryKey(QUERY_KEYS.TRENDS, timeframe, startDate, endDate),
    queryFn: () => dashboardService.getTrends({ 
      timeframe,
      startDate,
      endDate
    }),
  });

  // Handle timeframe change
  const handleTimeframeChange = (value: string) => {
    const newTimeframe = value as 'daily' | 'weekly' | 'monthly';
    setTimeframe(newTimeframe);
  };

  return {
    trendsData: trendsData?.data || null,
    timeframe,
    loading,
    error: formatQueryError(error, ERROR_MESSAGES.TRENDS_DATA),
    handleTimeframeChange,
    refetch: () => refetch(),
  };
};
