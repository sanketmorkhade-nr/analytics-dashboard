import { useQuery } from '@tanstack/react-query';
import { dashboardService } from '../services/dashboardService';
import { QUERY_KEYS, ERROR_MESSAGES } from '@/shared/constants/analytics';
import { 
  buildQueryKey,
  formatQueryError,
} from '@/shared/utils/queryUtils';

export interface CompaniesParams {
  startDate?: string;
  endDate?: string;
  companies?: string[];
  limit?: number;
}

export const useCompaniesData = (params: CompaniesParams = {}) => {
  const {
    data,
    isLoading: loading,
    error,
    refetch,
  } = useQuery({
    queryKey: buildQueryKey(QUERY_KEYS.COMPANIES, params),
    queryFn: () => dashboardService.getTopActiveCompanies(params),
  });

  return {
    companies: data?.data || [],
    loading,
    error: formatQueryError(error, ERROR_MESSAGES.COMPANIES_DATA),
    refetch,
  };
};
