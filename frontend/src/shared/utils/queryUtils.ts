import { ANALYTICS_CONSTANTS } from '@/shared/constants/analytics';

// Utility function to get default date range
export const getDefaultDateRange = () => ({
  startDate: ANALYTICS_CONSTANTS.DEFAULT_DATE_RANGE.startDate,
  endDate: ANALYTICS_CONSTANTS.DEFAULT_DATE_RANGE.endDate,
});

// Utility function to validate date parameters
export const hasValidDateRange = (startDate?: string, endDate?: string): boolean => {
  return !!(startDate && endDate);
};

// Utility function to get date parameters with defaults
export const getDateParams = (startDate?: string, endDate?: string) => {
  const defaultRange = getDefaultDateRange();
  return {
    startDate: startDate || defaultRange.startDate,
    endDate: endDate || defaultRange.endDate,
  };
};

// Utility function for consistent error handling
export const formatQueryError = (error: unknown, defaultMessage: string): string | null => {
  return error ? (error instanceof Error ? error.message : defaultMessage) : null;
};

// Utility function to build query keys consistently
export const buildQueryKey = (baseKey: string, ...params: unknown[]): unknown[] => {
  return [baseKey, ...params];
};

// Common query configurations
export const QUERY_CONFIGS = {
  // Standard query config for data fetching
  standard: {
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 2,
    refetchOnWindowFocus: false,
  },
  
  // Config for frequently changing data
  frequent: {
    staleTime: 1 * 60 * 1000, // 1 minute
    gcTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
    refetchOnWindowFocus: true,
  },
  
  // Config for static data
  static: {
    staleTime: 30 * 60 * 1000, // 30 minutes
    gcTime: 60 * 60 * 1000, // 1 hour
    retry: 1,
    refetchOnWindowFocus: false,
  },
} as const;
