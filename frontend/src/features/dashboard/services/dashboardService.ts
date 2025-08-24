import { apiService } from '@/shared/services/api';
import type { MetricsResponse, TimeSeriesResponse, UserActivity, EndpointActivity, CompanyActivity } from '@/shared/types/api';

export interface MetricsParams {
  dateRange?: {
    start: string;
    end: string;
  };
  companies?: string[];
  eventTypes?: string[];
}

export interface TrendsParams {
  timeframe: 'daily' | 'weekly' | 'monthly';
  startDate: string;
  endDate: string;
  eventTypes?: string[];
}

export interface AnalyticsParams {
  startDate?: string;
  endDate?: string;
  companies?: string[];
  limit?: number;
}

class DashboardService {
  async getMetrics(params?: MetricsParams): Promise<MetricsResponse> {
    return apiService.get<MetricsResponse>('/metrics', params);
  }

  async getTrends(params: TrendsParams): Promise<TimeSeriesResponse> {
    return apiService.get<TimeSeriesResponse>('/trends', params);
  }

  async getTopCompanies(): Promise<{ data: Array<{ name: string; eventCount: number }> }> {
    return apiService.get('/analytics/companies');
  }

  async getEventDistribution(): Promise<{ data: Array<{ eventType: string; count: number }> }> {
    return apiService.get('/analytics/event-distribution');
  }

  async getTopEventsByVolume(params?: AnalyticsParams): Promise<{ data: Array<{ type: string; count: number }>; total: number }> {
    return apiService.get('/analytics/top-events', params);
  }

  async getMostActiveUsers(params?: AnalyticsParams): Promise<{ data: UserActivity[]; total: number }> {
    return apiService.get('/analytics/active-users', params);
  }

  async getTopEndpointsByUsage(params?: AnalyticsParams): Promise<{ data: EndpointActivity[]; total: number }> {
    return apiService.get('/analytics/top-endpoints', params);
  }

  async getTopActiveCompanies(params?: AnalyticsParams): Promise<{ data: CompanyActivity[]; total: number }> {
    return apiService.get('/analytics/top-companies', params);
  }
}

export const dashboardService = new DashboardService();
