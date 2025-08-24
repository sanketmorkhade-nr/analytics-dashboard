import { apiService } from '@/shared/services/api';
import type { SearchResponse } from '@/shared/types/api';

export interface EventSearchParams {
  query?: string;
  startDate?: string;
  endDate?: string;
  company?: string;
  companies?: string[];
  page?: number;
  pageSize?: number;
}

export interface TrendsParams {
  timeframe?: string;
  startDate: string;
  endDate: string;
  companies: string[];
  eventTypes: string[];
}

export interface Company {
  id: string;
  name: string;
  eventCount: number;
}

export const eventExplorerService = {
  async searchEvents(params: EventSearchParams): Promise<SearchResponse> {
    const queryParams = new URLSearchParams();
    
    if (params.query) queryParams.append('query', params.query);
    if (params.startDate) queryParams.append('startDate', params.startDate);
    if (params.endDate) queryParams.append('endDate', params.endDate);
    
    // Use companies parameter if available, otherwise fall back to company
    if (params.companies && params.companies.length > 0) {
      queryParams.append('companies', params.companies.join(','));
    } else if (params.company) {
      queryParams.append('company', params.company);
    }
    
    if (params.page) queryParams.append('page', params.page.toString());
    if (params.pageSize) queryParams.append('pageSize', params.pageSize.toString());
    
    const queryString = queryParams.toString();
    const url = `/events${queryString ? `?${queryString}` : ''}`;
    
    return apiService.get<SearchResponse>(url);
  },

  async getEventMetrics(params: EventSearchParams = {}): Promise<{ totalEvents: number; uniqueUsers: number }> {
    const queryParams = new URLSearchParams();
    
    if (params.startDate) queryParams.append('startDate', params.startDate);
    if (params.endDate) queryParams.append('endDate', params.endDate);
    
    // Use companies parameter if available, otherwise fall back to company
    if (params.companies && params.companies.length > 0) {
      queryParams.append('companies', params.companies.join(','));
    } else if (params.company) {
      queryParams.append('company', params.company);
    }
    
    const queryString = queryParams.toString();
    const url = `/events/metrics${queryString ? `?${queryString}` : ''}`;
    
    return apiService.get(url);
  },

  async getCompanies(): Promise<{ data: Company[] }> {
    return apiService.get<{ data: Company[] }>('/companies');
  },

  async getTrends(params: TrendsParams): Promise<{ data: Array<{ timestamp: string; [key: string]: number | string }> }> {
    const queryParams = new URLSearchParams();
    
    if (params.timeframe) {
      queryParams.append('timeframe', params.timeframe);
    }
    queryParams.append('startDate', params.startDate);
    queryParams.append('endDate', params.endDate);
    
    if (params.companies.length > 0) {
      params.companies.forEach(company => queryParams.append('companies', company));
    }
    
    if (params.eventTypes.length > 0) {
      params.eventTypes.forEach(type => queryParams.append('eventTypes', type));
    }
    
    const queryString = queryParams.toString();
    const url = `/trends?${queryString}`;
    
    return apiService.get(url);
  },

  async getMultiCompanyTrends(params: TrendsParams): Promise<{ data: Array<{ timestamp: string; [key: string]: number | string }> }> {
    const queryParams = new URLSearchParams();
    
    if (params.timeframe) {
      queryParams.append('timeframe', params.timeframe);
    }
    queryParams.append('startDate', params.startDate);
    queryParams.append('endDate', params.endDate);
    
    if (params.companies.length > 0) {
      queryParams.append('companies', params.companies.join(','));
    }
    
    if (params.eventTypes.length > 0) {
      queryParams.append('eventTypes', params.eventTypes.join(','));
    }
    
    const queryString = queryParams.toString();
    const url = `/trends/multi-company?${queryString}`;
    
    return apiService.get(url);
  }
};
