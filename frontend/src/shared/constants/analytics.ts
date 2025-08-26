// Analytics constants for consistent date ranges and parameters
export const ANALYTICS_CONSTANTS = {
  DEFAULT_DATE_RANGE: {
    startDate: '2025-06-01',
    endDate: '2025-07-22',
  },
  DEFAULT_LIMIT: 10,
  DEFAULT_TIMEFRAME: 'daily' as const,
  DEFAULT_PAGE_SIZE: 10,
  DEFAULT_PAGE: 1,
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
  COMPANY_COLORS: [
    '#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#ff0000', 
    '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'
  ],
} as const;

// Query key prefixes for consistent naming
export const QUERY_KEYS = {
  DASHBOARD: 'dashboard',
  TRENDS: 'trends',
  TOP_EVENTS: 'topEvents',
  ACTIVE_USERS: 'activeUsers',
  ENDPOINTS: 'endpoints',
  COMPANIES: 'companies',
  EVENT_EXPLORER: 'eventExplorer',
  EVENT_METRICS: 'eventMetrics',
  CHART_DATA: 'chartData',
  RETENTION: 'retention',
} as const;

// Error messages for consistent error handling
export const ERROR_MESSAGES = {
  DASHBOARD_DATA: 'Failed to fetch dashboard data',
  TRENDS_DATA: 'Failed to fetch trends data',
  TOP_EVENTS_DATA: 'Failed to fetch top events data',
  ACTIVE_USERS_DATA: 'Failed to fetch active users data',
  ENDPOINTS_DATA: 'Failed to fetch endpoints data',
  COMPANIES_DATA: 'Failed to fetch companies data',
  EVENT_EXPLORER_DATA: 'Failed to fetch data',
  EVENT_METRICS: 'Failed to fetch metrics',
  CHART_DATA: 'Failed to fetch chart data',
  RETENTION_DATA: 'Failed to fetch retention data',
  GENERIC: 'An error occurred',
} as const;
