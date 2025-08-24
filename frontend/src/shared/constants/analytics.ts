// Analytics constants for consistent date ranges and parameters
export const ANALYTICS_CONSTANTS = {
  DEFAULT_DATE_RANGE: {
    startDate: '2025-06-01',
    endDate: '2025-07-22',
  },
  DEFAULT_LIMIT: 10,
  DEFAULT_TIMEFRAME: 'daily' as const,
} as const;

// Common analytics parameters
export const getDefaultAnalyticsParams = () => ({
  startDate: ANALYTICS_CONSTANTS.DEFAULT_DATE_RANGE.startDate,
  endDate: ANALYTICS_CONSTANTS.DEFAULT_DATE_RANGE.endDate,
  limit: ANALYTICS_CONSTANTS.DEFAULT_LIMIT,
});

// Chart configuration
export const CHART_CONFIG = {
  COLORS: {
    PRIMARY: '#8884d8',
    SECONDARY: '#82ca9d',
    TERTIARY: '#ffc658',
    SUCCESS: '#4ade80',
    WARNING: '#fbbf24',
    ERROR: '#f87171',
  },
  HEIGHTS: {
    DEFAULT: 300,
    LARGE: 400,
    SMALL: 200,
  },
} as const;
