import { useQuery } from '@tanstack/react-query';
import { dashboardService } from '../services/dashboardService';
import { QUERY_KEYS, ERROR_MESSAGES } from '@/shared/constants/analytics';
import { 
  buildQueryKey,
  formatQueryError,
} from '@/shared/utils/queryUtils';

export interface ActiveUsersParams {
  startDate?: string;
  endDate?: string;
  companies?: string[];
  limit?: number;
}

export const useActiveUsersData = (params: ActiveUsersParams = {}) => {
  const {
    data,
    isLoading: loading,
    error,
    refetch,
  } = useQuery({
    queryKey: buildQueryKey(QUERY_KEYS.ACTIVE_USERS, params),
    queryFn: () => dashboardService.getMostActiveUsers(params),
  });

  return {
    activeUsers: data?.data || [],
    loading,
    error: formatQueryError(error, ERROR_MESSAGES.ACTIVE_USERS_DATA),
    refetch,
  };
};
