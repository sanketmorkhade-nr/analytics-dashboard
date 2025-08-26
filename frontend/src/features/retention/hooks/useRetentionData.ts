import { useQuery } from '@tanstack/react-query';
import { retentionService, type RetentionRequest } from '../services/retentionService';
import { ERROR_MESSAGES, ANALYTICS_CONSTANTS } from '@/shared/constants/analytics';
import { formatQueryError } from '@/shared/utils/queryUtils';

export const useRetentionData = (params: RetentionRequest) => {
  const {
    data,
    isLoading: loading,
    error,
  } = useQuery({
    queryKey: ['retention', params],
    queryFn: () => retentionService.getRetentionAnalytics({
      ...params,
      startDate: params.startDate || ANALYTICS_CONSTANTS.DEFAULT_DATE_RANGE.startDate,
      endDate: params.endDate || ANALYTICS_CONSTANTS.DEFAULT_DATE_RANGE.endDate,
    }),
  });

  return { 
    data, 
    loading, 
    error: formatQueryError(error, ERROR_MESSAGES.RETENTION_DATA)
  };
};
