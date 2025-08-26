import { useQuery } from '@tanstack/react-query';
import { eventExplorerService } from '../services/eventExplorerService';
import { QUERY_KEYS, ERROR_MESSAGES } from '@/shared/constants/analytics';
import { 
  buildQueryKey,
  formatQueryError,
} from '@/shared/utils/queryUtils';

interface MetricsDataHookProps {
  startDate?: string;
  endDate?: string;
  companies: string[];
}

export const useMetricsData = ({ startDate, endDate, companies }: MetricsDataHookProps) => {
  const {
    data: metrics,
    isLoading: loading,
    error,
    refetch,
  } = useQuery({
    queryKey: buildQueryKey(QUERY_KEYS.EVENT_METRICS, startDate, endDate, companies),
    queryFn: () => {
      const apiParams = {
        startDate,
        endDate,
        companies,
      };
      return eventExplorerService.getEventMetrics(apiParams);
    },
  });

  return {
    metrics,
    loading,
    error: formatQueryError(error, ERROR_MESSAGES.EVENT_METRICS),
    refetch,
  };
};
