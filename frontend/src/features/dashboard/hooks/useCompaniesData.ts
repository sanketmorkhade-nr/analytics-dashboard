import { useState, useEffect, useCallback } from 'react';
import { dashboardService } from '../services/dashboardService';
import type { CompanyActivity } from '@/shared/types/api';

export interface CompaniesParams {
  startDate?: string;
  endDate?: string;
  companies?: string[];
  limit?: number;
}

export const useCompaniesData = (params: CompaniesParams = {}) => {
  const [companies, setCompanies] = useState<CompanyActivity[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCompanies = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await dashboardService.getTopActiveCompanies(params);
      setCompanies(response.data);
    } catch (err) {
      console.error('Failed to fetch companies data:', err);
      setError('Failed to fetch companies data');
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => {
    fetchCompanies();
  }, [fetchCompanies]);

  return {
    companies,
    loading,
    error,
    refetch: fetchCompanies,
  };
};
