import { apiService } from '@/shared/services/api';

export interface RetentionData {
  days: number;
  retentionRate: number;
  activeUsers: number;
  totalUsers: number;
}

export interface Cohort {
  cohortDate: string;
  totalUsers: number;
  retentionData: RetentionData[];
}

export interface RetentionResponse {
  cohorts: Cohort[];
  timePeriods: number[];
  totalCohorts: number;
  averageRetention: number;
}

export interface RetentionRequest {
  company?: string;
  startDate?: string;
  endDate?: string;
  cohortPeriod?: 'daily' | 'weekly' | 'monthly';
  minCohortSize?: number;
}

export interface Company {
  id: string;
  name: string;
  eventCount: number;
}

export interface CompaniesResponse {
  data: Company[];
  total: number;
}

export const retentionService = {
  async getRetentionAnalytics(params: RetentionRequest): Promise<RetentionResponse> {
    const queryParams = new URLSearchParams();
    
    if (params.company) {
      queryParams.append('company', params.company);
    }
    if (params.startDate) {
      queryParams.append('startDate', params.startDate);
    }
    if (params.endDate) {
      queryParams.append('endDate', params.endDate);
    }
    if (params.cohortPeriod) {
      queryParams.append('cohortPeriod', params.cohortPeriod);
    }
    if (params.minCohortSize) {
      queryParams.append('minCohortSize', params.minCohortSize.toString());
    }

    const response = await apiService.get<RetentionResponse>(`/analytics/retention?${queryParams.toString()}`);
    return response;
  },

  async getCompanies(): Promise<CompaniesResponse> {
    const response = await apiService.get<CompaniesResponse>('/companies');
    return response;
  }
};
