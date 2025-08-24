// API Response Types
export interface MetricsResponse {
  totalEvents: number;
  activeCompanies: number;
  topEventType: string;
  topEventCount: number;
  avgEventsPerCompany: number;
  topEventTypes: Array<{
    type: string;
    count: number;
    percentage?: number;
  }>;
  timeRange: {
    start: string;
    end: string;
  };
}

export interface TimeSeriesData {
  timestamp: string;
  value: number;
  eventType: string;
}

export interface TimeSeriesResponse {
  data: TimeSeriesData[];
  timeframe: string;
  totalPoints: number;
}

// Event Explorer Types
export interface UsageEvent {
  id: string;
  created_at: string; // Match backend field name
  type: string; // Match backend field name
  companyName: string;
  user: string;
  content: string;
  endpoint: string;
  value?: number;
  attribute?: string;
  updated_at?: string;
  original_timestamp?: string;
}

export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface SearchResponse {
  events: UsageEvent[];
  pagination: PaginationInfo;
  metrics?: {
    totalEvents: number;
    uniqueCompanies: number;
    topEventType: string;
    topEventCount: number;
    avgEventsPerCompany: number;
  };
}

export interface SearchRequest {
  query?: string;
  filters?: {
    startDate?: string;
    endDate?: string;
    company?: string;
    eventType?: string;
  };
  pagination?: {
    page: number;
    pageSize: number;
  };
}

// Legacy types for backward compatibility
export type MetricsData = MetricsResponse;

export interface CompanyActivity {
  companyName: string;
  eventCount: number;
  userCount: number;
  endpointCount: number;
  lastActivity: string;
}

export interface EndpointActivity {
  endpoint: string;
  eventCount: number;
  userCount: number;
  companyCount: number;
  percentage: number;
}

export interface UserActivity {
  user: string;
  eventCount: number;
  companies: number;
  companyNames: string[];
  lastActivity: string;
}

export interface UserActivityResponse {
  data: UserActivity[];
  total: number;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  error?: string;
}
