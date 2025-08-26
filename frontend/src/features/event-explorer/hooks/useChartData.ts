import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { eventExplorerService } from '../services/eventExplorerService';
import { QUERY_KEYS, ERROR_MESSAGES, CHART_CONFIG } from '@/shared/constants/analytics';
import { 
  buildQueryKey,
  formatQueryError,
  getDateParams
} from '@/shared/utils/queryUtils';

interface ChartDataHookProps {
  startDate?: string;
  endDate?: string;
  companies: string[];
}

export const useChartData = ({ startDate, endDate, companies }: ChartDataHookProps) => {
  const { startDate: startDateParam, endDate: endDateParam } = getDateParams(startDate, endDate);

  // Fetch chart data
  const {
    data: chartDataResponse,
    isLoading: chartLoading,
    error: chartError,
    refetch: refetchChartData,
  } = useQuery({
    queryKey: buildQueryKey(QUERY_KEYS.CHART_DATA, startDateParam, endDateParam, companies),
    queryFn: () => eventExplorerService.getMultiCompanyTrends({
      startDate: startDateParam,
      endDate: endDateParam,
      companies,
      eventTypes: []
    }),
    enabled: !!(startDateParam && endDateParam),
  });

  // Fetch companies
  const {
    data: companiesResponse,
    isLoading: companiesLoading,
    error: companiesError,
  } = useQuery({
    queryKey: buildQueryKey(QUERY_KEYS.COMPANIES),
    queryFn: () => eventExplorerService.getCompanies(),
  });

  // Transform API data for multi-line chart
  const transformChartData = (apiData: Array<{ timestamp: string; [key: string]: number | string }>) => {
    // The API now returns data with company names as keys directly
    // Each item has: { timestamp: "2025-06-01", "Assembly": 45, "Facebook": 14, ... }
    
    // Create a copy of the array before sorting to avoid mutating the original
    return [...apiData].sort((a, b) => 
      new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );
  };

  // Transform data for pie chart
  const transformPieChartData = (apiData: Array<{ timestamp: string; [key: string]: number | string }>, selectedCompanies: string[]) => {
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
  };

  const chartData = useMemo(() => 
    transformChartData(chartDataResponse?.data || []), 
    [chartDataResponse?.data]
  );

  // Memoized pie chart data
  const pieChartData = useMemo(() => 
    transformPieChartData(chartData, companies), 
    [chartData, companies]
  );

  const error = chartError || companiesError;
  const errorMessage = formatQueryError(error, ERROR_MESSAGES.CHART_DATA);

  return {
    chartData,
    companies: companiesResponse?.data || [],
    loading: chartLoading || companiesLoading,
    error: errorMessage,
    pieChartData,
    companyColors: CHART_CONFIG.COMPANY_COLORS,
    refetch: refetchChartData,
  };
};
