import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { LineChart, Line, Bar, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart as RechartsPieChart, Pie, Cell, ComposedChart } from 'recharts';
import { TrendingUp, BarChart3, PieChart, Activity, Users } from 'lucide-react';
import { useEventExplorer } from '../hooks/useEventExplorer';
import { useMetricsData } from '../hooks/useMetricsData';
import { useChartData } from '../hooks/useChartData';
import { useChartFormatting } from '../hooks/useChartFormatting';
import { useChartTheme } from '@/shared/hooks/useChartTheme';
import { ChartTooltip } from '@/shared/components/charts/ChartTooltip';
import { ChartXAxis, ChartYAxis } from '@/shared/components/charts/ChartAxis';
import AdvancedFilters from './AdvancedFilters';
import DataTable from './DataTable';
import MetricsCard from '@/features/dashboard/components/MetricsCard';
import type { ExportData } from '@/shared/utils/exportUtils';

const EventExplorerPage: React.FC = () => {
  const {
    query,
    filters: searchFilters,
    data,
    loading,
    error,
    setQuery,
    setFilters: setSearchFilters,
    setPage,
    setPageSize,
    resetAll,
  } = useEventExplorer();

  const [chartType, setChartType] = useState<'line' | 'stacked-bar' | 'pie'>('line');
  const [localFilters, setLocalFilters] = useState({
    startDate: searchFilters.startDate || '',
    endDate: searchFilters.endDate || '',
    companies: searchFilters.company ? [searchFilters.company] : [],
  });
  const chartColors = useChartTheme();

  // Use custom hooks for data management
  const { metrics, loading: metricsLoading } = useMetricsData({
    startDate: localFilters.startDate,
    endDate: localFilters.endDate,
    companies: localFilters.companies,
  });

  const { chartData, companies, loading: chartLoading, pieChartData, companyColors } = useChartData({
    startDate: localFilters.startDate,
    endDate: localFilters.endDate,
    companies: localFilters.companies,
  });

  const { formatDate, formatTooltipDate } = useChartFormatting();

  // Handle filter changes from AdvancedFilters
  const handleFiltersChange = (newFilters: { startDate: string; endDate: string; companies: string[] }) => {
    setLocalFilters(newFilters);
    
    // Use companies array directly for the search filters
    setSearchFilters({
      startDate: newFilters.startDate,
      endDate: newFilters.endDate,
      companies: newFilters.companies,
    });
  };

  const handleSearchChangeWrapper = (query: string) => {
    setQuery(query);
  };

  const handleReset = () => {
    resetAll();
  };

  // Get unique users from metrics API
  const uniqueUsers = metrics?.uniqueUsers || 0;

  // Prepare export data
  const exportData: ExportData = {
    events: data?.events || [],
    filters: {
      startDate: localFilters.startDate,
      endDate: localFilters.endDate,
      companies: localFilters.companies,
      query: query
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Event Explorer</h1>
        <p className="text-base sm:text-lg text-muted-foreground">
          Search and explore usage events with advanced filtering
        </p>
      </div>

      {/* Filters Section */}
      <Card>
        <CardContent>
            <AdvancedFilters
            filters={localFilters}
            onFiltersChange={handleFiltersChange}
              onReset={handleReset}
            />
        </CardContent>
      </Card>

      {/* Error Display */}
      {error && (
        <Card className="border-destructive">
          <CardContent className="pt-6">
            <div className="text-destructive text-center">
              {error}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Events Metrics */}
      {metricsLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          <div className="h-24 sm:h-32 bg-muted animate-pulse rounded-lg" />
          <div className="h-24 sm:h-32 bg-muted animate-pulse rounded-lg" />
        </div>
      ) : metrics && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          <MetricsCard 
            title="Total Events" 
            value={metrics.totalEvents || 0} 
            subtitle="All events in current filter"
            icon={<Activity className="h-5 w-5 text-blue-500" />}
          />
          <MetricsCard 
            title="Active Users" 
            value={uniqueUsers} 
            subtitle="Unique users in current filter"
            icon={<Users className="h-5 w-5 text-green-500" />}
          />
        </div>
      )}

      {/* Chart Type Toggle */}
      <div className="flex justify-end items-center gap-4">
        <div className="flex items-center gap-1 border rounded-md p-1">
          <Button
            variant={chartType === 'line' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setChartType('line')}
            className="h-8 w-8 p-0"
          >
            <TrendingUp className="h-4 w-4" />
            <span className="sr-only">Line Chart</span>
          </Button>
          <Button
            variant={chartType === 'stacked-bar' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setChartType('stacked-bar')}
            className="h-8 w-8 p-0"
          >
            <BarChart3 className="h-4 w-4" />
            <span className="sr-only">Stacked Bar Chart</span>
          </Button>
          <Button
            variant={chartType === 'pie' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setChartType('pie')}
            className="h-8 w-8 p-0"
          >
            <PieChart className="h-4 w-4" />
            <span className="sr-only">Pie Chart</span>
          </Button>
        </div>
      </div>

      {/* Event Trends Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Event Trends Over Time</CardTitle>
        </CardHeader>
        <CardContent>
          {chartLoading ? (
            <Skeleton className="h-[300px] sm:h-[400px] w-full" />
          ) : !chartData || chartData.length === 0 ? (
            <div className="flex items-center justify-center h-[300px] sm:h-[400px] text-muted-foreground">
              No data available for the selected filters
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={chartType === 'pie' ? 500 : 300} className={chartType === 'pie' ? 'sm:h-[600px]' : 'sm:h-[400px]'}>
              {chartType === 'line' ? (
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} />
                  <ChartXAxis 
                    chartColors={chartColors}
                    tickFormatter={formatDate}
                  />
                  <ChartYAxis chartColors={chartColors} />
                  <Tooltip content={<ChartTooltip labelFormatter={formatTooltipDate} />} />
                  <Legend 
                    wrapperStyle={{ 
                      color: chartColors.text,
                      fontSize: '12px'
                    }}
                  />
                  {companies
                    .filter(company => localFilters.companies.length === 0 || localFilters.companies.includes(company.name))
                    .map((company, index) => (
                      <Line 
                        key={company.name}
                        type="monotone" 
                        dataKey={company.name} 
                        stroke={companyColors[index % companyColors.length]} 
                        strokeWidth={2}
                        dot={{ r: 3 }}
                        activeDot={{ r: 5 }}
                        name={company.name}
                      />
                    ))}
                </LineChart>
              ) : chartType === 'stacked-bar' ? (
                <ComposedChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} />
                  <ChartXAxis 
                    chartColors={chartColors}
                    tickFormatter={formatDate}
                  />
                  <ChartYAxis chartColors={chartColors} />
                  <Tooltip content={<ChartTooltip labelFormatter={formatTooltipDate} />} />
                  <Legend 
                    wrapperStyle={{ 
                      color: chartColors.text,
                      fontSize: '12px'
                    }}
                  />
                  {companies
                    .filter(company => localFilters.companies.length === 0 || localFilters.companies.includes(company.name))
                    .map((company, index) => (
                      <Bar 
                        key={company.name}
                        dataKey={company.name} 
                        fill={companyColors[index % companyColors.length]}
                        name={company.name}
                        stackId="stack"
                      />
                    ))}
                </ComposedChart>
              ) : (
                <RechartsPieChart>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}\n${((percent || 0) * 100).toFixed(1)}%`}
                    outerRadius={150}
                    innerRadius={60}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieChartData.map((_, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={companyColors[index % companyColors.length]} 
                      />
                    ))}
                  </Pie>
                  <Tooltip 
                    content={<ChartTooltip />}
                  />
                  <Legend 
                    wrapperStyle={{ 
                      color: chartColors.text,
                      fontSize: '14px',
                      paddingTop: '20px'
                    }}
                  />
                </RechartsPieChart>
              )}
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      {/* Data Table Wrapper */}
      <Card>
        <CardContent>
                  <DataTable
          events={data?.events || []}
          pagination={data?.pagination || null}
          loading={loading}
          query={query}
          onPageChange={setPage}
          onPageSizeChange={setPageSize}
          onSearchChange={handleSearchChangeWrapper}
          filters={localFilters}
          exportData={exportData}
        />
        </CardContent>
      </Card>
    </div>
  );
};

export default EventExplorerPage;
