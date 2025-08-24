import { useMemo } from 'react';
import { getDefaultAnalyticsParams } from '@/shared/constants/analytics';

export interface AnalyticsParams {
  startDate?: string;
  endDate?: string;
  companies?: string[];
  limit?: number;
}

export const useAnalyticsParams = (customParams?: Partial<AnalyticsParams>) => {
  const params = useMemo(() => {
    const defaultParams = getDefaultAnalyticsParams();
    return {
      ...defaultParams,
      ...customParams,
    };
  }, [customParams]);

  return params;
};
