import { useState, useEffect, useCallback, useMemo } from 'react';
import { eventExplorerService } from '../services/eventExplorerService';

interface ChartDataHookProps {
  startDate?: string;
  endDate?: string;
  companies: string[];
}

interface ChartDataState {
  chartData: Array<{ timestamp: string; [key: string]: number | string }>;
  companies: Array<{ id: string; name: string; eventCount: number }>;
  loading: boolean;
  error: string | null;
}

export const useChartData = ({ startDate, endDate, companies }: ChartDataHookProps) => {
  const [state, setState] = useState<ChartDataState>({
    chartData: [],
    companies: [],
    loading: false,
    error: null,
  });

  // Fetch chart data based on current filters
  const fetchChartData = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const endDateParam = endDate || '2025-07-22';
      const startDateParam = startDate || '2025-06-01';
      
      const response = await eventExplorerService.getMultiCompanyTrends({
        startDate: startDateParam,
        endDate: endDateParam,
        companies,
        eventTypes: []
      });
      
      // Transform data for multi-line chart
      const transformedData = transformChartData(response.data || []);
      setState(prev => ({ 
        ...prev, 
        chartData: transformedData, 
        loading: false 
      }));
    } catch (error) {
      console.error('Failed to fetch chart data:', error);
      setState(prev => ({ 
        ...prev, 
        chartData: [], 
        loading: false, 
        error: 'Failed to fetch chart data' 
      }));
    }
  }, [startDate, endDate, companies]);

  // Fetch companies for chart
  const fetchCompanies = useCallback(async () => {
    try {
      const response = await eventExplorerService.getCompanies();
      setState(prev => ({ 
        ...prev, 
        companies: response.data || [] 
      }));
    } catch (error) {
      console.error('Failed to fetch companies:', error);
      setState(prev => ({ 
        ...prev, 
        error: 'Failed to fetch companies' 
      }));
    }
  }, []);

  // Transform API data for multi-line chart
  const transformChartData = (apiData: Array<{ timestamp: string; [key: string]: number | string }>) => {
    // The API now returns data with company names as keys directly
    // Each item has: { timestamp: "2025-06-01", "Assembly": 45, "Facebook": 14, ... }
    
    // Sort by timestamp
    return apiData.sort((a, b) => 
      new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );
  };

  // Transform data for pie chart
  const transformPieChartData = useCallback((apiData: Array<{ timestamp: string; [key: string]: number | string }>, selectedCompanies: string[]) => {
    if (!apiData || apiData.length === 0) return [];
    
    // Calculate total events per company across all time periods
    const companyTotals: { [key: string]: number } = {};
    
    apiData.forEach((dataPoint) => {
      Object.keys(dataPoint).forEach((key) => {
        if (key !== 'timestamp' && typeof dataPoint[key] === 'number') {
          companyTotals[key] = (companyTotals[key] || 0) + dataPoint[key];
        }
      });
    });
    
    // Filter companies based on selected companies (if any are selected)
    const filteredCompanies = selectedCompanies.length === 0 
      ? Object.keys(companyTotals) 
      : Object.keys(companyTotals).filter(company => selectedCompanies.includes(company));
    
    // Convert to pie chart format
    return filteredCompanies.map((name) => ({
      name,
      value: companyTotals[name] || 0,
    }));
  }, []);

  // Fetch chart data when filters change
  useEffect(() => {
    fetchChartData();
  }, [fetchChartData]);

  // Fetch companies on initial load
  useEffect(() => {
    fetchCompanies();
  }, [fetchCompanies]);

  // Memoized pie chart data
  const pieChartData = useMemo(() => 
    transformPieChartData(state.chartData, companies), 
    [state.chartData, companies, transformPieChartData]
  );

  // Define colors for different companies
  const companyColors = [
    '#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#ff0000', 
    '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'
  ];

  return {
    ...state,
    pieChartData,
    companyColors,
    refetch: fetchChartData,
  };
};
