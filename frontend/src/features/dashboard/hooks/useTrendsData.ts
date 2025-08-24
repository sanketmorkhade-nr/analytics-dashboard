import { useState, useEffect, useCallback } from 'react';
import { dashboardService } from '../services/dashboardService';
import type { TimeSeriesData } from '@/shared/types/api';

export const useTrendsData = () => {
  const [trendsData, setTrendsData] = useState<TimeSeriesData[] | null>(null);
  const [timeframe, setTimeframe] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch trends data with current timeframe
  const fetchTrendsData = useCallback(async (selectedTimeframe: 'daily' | 'weekly' | 'monthly') => {
    setLoading(true);
    setError(null);
    try {
      const endDate = '2025-07-22';
      const startDate = '2025-06-01';
      
      const response = await dashboardService.getTrends({ 
        timeframe: selectedTimeframe,
        startDate,
        endDate
      });
      setTrendsData(response.data);
    } catch (err) {
      console.error('Failed to fetch trends data:', err);
      setError('Failed to fetch trends data');
    } finally {
      setLoading(false);
    }
  }, []);

  // Update trends data when timeframe changes
  useEffect(() => {
    fetchTrendsData(timeframe);
  }, [timeframe, fetchTrendsData]);

  // Handle timeframe change
  const handleTimeframeChange = (value: string) => {
    const newTimeframe = value as 'daily' | 'weekly' | 'monthly';
    setTimeframe(newTimeframe);
  };

  return {
    trendsData,
    timeframe,
    loading,
    error,
    handleTimeframeChange,
    refetch: () => fetchTrendsData(timeframe),
  };
};
