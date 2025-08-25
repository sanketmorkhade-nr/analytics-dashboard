import { useState, useEffect } from 'react';
import { retentionService, type RetentionRequest, type RetentionResponse } from '../services/retentionService';

export const useRetentionData = (params: RetentionRequest) => {
  const [data, setData] = useState<RetentionResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRetentionData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const response = await retentionService.getRetentionAnalytics(params);
        setData(response);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch retention data');
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchRetentionData();
  }, [params.company, params.startDate, params.endDate, params.cohortPeriod, params.minCohortSize]);

  return { data, loading, error };
};
