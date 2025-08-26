import { useQuery } from '@tanstack/react-query';
import { dashboardService } from '../services/dashboardService';
import { QUERY_KEYS, ERROR_MESSAGES } from '@/shared/constants/analytics';
import { 
  buildQueryKey,
  formatQueryError,
} from '@/shared/utils/queryUtils';

export interface EndpointsParams {
  startDate?: string;
  endDate?: string;
  companies?: string[];
  limit?: number;
}

export const useEndpointsData = (params: EndpointsParams = {}) => {
  const {
    data,
    isLoading: loading,
    error,
    refetch,
  } = useQuery({
    queryKey: buildQueryKey(QUERY_KEYS.ENDPOINTS, params),
    queryFn: () => dashboardService.getTopEndpointsByUsage(params),
  });

  return {
    endpoints: data?.data || [],
    loading,
    error: formatQueryError(error, ERROR_MESSAGES.ENDPOINTS_DATA),
    refetch,
  };
};
