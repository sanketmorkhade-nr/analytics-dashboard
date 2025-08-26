import { useQuery } from '@tanstack/react-query';
import { dashboardService } from '../services/dashboardService';
import { QUERY_KEYS, ERROR_MESSAGES } from '@/shared/constants/analytics';
import { 
  buildQueryKey,
  formatQueryError,
} from '@/shared/utils/queryUtils';

export interface TopEventsParams {
  startDate?: string;
  endDate?: string;
  companies?: string[];
  limit?: number;
}

export const useTopEventsData = (params: TopEventsParams = {}) => {
  const {
    data,
    isLoading: loading,
    error,
    refetch,
  } = useQuery({
    queryKey: buildQueryKey(QUERY_KEYS.TOP_EVENTS, params),
    queryFn: () => dashboardService.getTopEventsByVolume(params),
  });

  return {
    topEvents: data?.data || [],
    loading,
    error: formatQueryError(error, ERROR_MESSAGES.TOP_EVENTS_DATA),
    refetch,
  };
};
