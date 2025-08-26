import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { Alert, AlertDescription } from '@/shared/components/ui/alert';
import { LineChart, Line, BarChart, Bar, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, BarChart3, RefreshCw } from 'lucide-react';
import { useDashboardData } from '../hooks/useDashboardData';
import { useTrendsData } from '../hooks/useTrendsData';
import { useChartFormatting } from '../hooks/useChartFormatting';
import { useAnalyticsParams } from '@/shared/hooks/useAnalyticsParams';
import { useTopEventsData } from '../hooks/useTopEventsData';
import { useActiveUsersData } from '../hooks/useActiveUsersData';
import { useEndpointsData } from '../hooks/useEndpointsData';
import { useCompaniesData } from '../hooks/useCompaniesData';
import { useChartTheme } from '@/shared/hooks/useChartTheme';
import { ChartTooltip } from '@/shared/components/charts/ChartTooltip';
import { ChartXAxis, ChartYAxis } from '@/shared/components/charts/ChartAxis';
import MetricsGrid from './MetricsGrid';
import TopUsersInsights from './TopUsersInsights';
import TopEndpointsInsights from './TopEndpointsInsights';
import TopEventsChart from './TopEventsChart';
import TopCompaniesChart from './TopCompaniesChart';

const Dashboard: React.FC = () => {
  const { metrics, loading, error } = useDashboardData();
  const [chartType, setChartType] = useState<'line' | 'bar'>('line');
  const chartColors = useChartTheme();
  
  // Use custom hooks for data management
  const { trendsData, timeframe, handleTimeframeChange, loading: trendsLoading } = useTrendsData();
  const { formatDate, formatTooltipDate } = useChartFormatting(timeframe);

  // Common parameters for analytics data
  const analyticsParams = useAnalyticsParams();

  // Get additional analytics data
  const { topEvents, loading: topEventsLoading } = useTopEventsData(analyticsParams);
  const { activeUsers, loading: activeUsersLoading } = useActiveUsersData(analyticsParams);
  const { endpoints, loading: endpointsLoading } = useEndpointsData(analyticsParams);
  const { companies, loading: companiesLoading } = useCompaniesData(analyticsParams);

  if (error) {
    return (
      <div className="space-y-6">
        <Alert variant="destructive">
          <RefreshCw className="h-4 w-4" />
          <AlertDescription>
            {error}. Please try refreshing the page.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-base sm:text-lg text-muted-foreground">
          Overview of usage analytics and trends
        </p>
      </div>

      {/* Metrics Grid */}
      <MetricsGrid metrics={metrics} loading={loading} />

      {/* Top Users and Endpoints Insights */}
      <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-2">
        <TopUsersInsights 
          data={activeUsers} 
          loading={activeUsersLoading} 
        />
        <TopEndpointsInsights 
          data={endpoints} 
          loading={endpointsLoading} 
        />
      </div>

      {/* Top Events Chart and Top Companies Chart */}
      <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-2">
        <TopEventsChart 
          data={topEvents} 
          loading={topEventsLoading} 
        />
        <TopCompaniesChart 
          data={companies} 
          loading={companiesLoading} 
        />
      </div>

      {/* Time Period Filter and Chart Type Toggle */}
      <div className="flex flex-col sm:flex-row justify-end items-start sm:items-center gap-4">
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
            variant={chartType === 'bar' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setChartType('bar')}
            className="h-8 w-8 p-0"
          >
            <BarChart3 className="h-4 w-4" />
            <span className="sr-only">Bar Chart</span>
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-foreground">Time Period:</span>
          <Select value={timeframe} onValueChange={handleTimeframeChange}>
            <SelectTrigger className="w-[140px] h-10 bg-background border-2 border-input hover:border-primary/50 focus:border-primary">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">Daily</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Usage Trends Chart (Line or Bar) */}
      <Card>
        <CardHeader>
          <CardTitle>Usage Trends Over Time</CardTitle>
        </CardHeader>
        <CardContent>
          {trendsLoading && (
            <Skeleton className="h-[300px] sm:h-[400px] w-full" />
          )}
          {!trendsLoading && trendsData && trendsData.length !== 0 ? (
            <ResponsiveContainer width="100%" height={300} className="sm:h-[400px]">
              {chartType === 'line' ? (
                <LineChart data={trendsData}>
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
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#8884d8" 
                    strokeWidth={2}
                    dot={{ r: 3 }}
                    activeDot={{ r: 5 }}
                  />
                </LineChart>
              ) : (
                <BarChart data={trendsData}>
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
                  <Bar dataKey="value" fill="#82ca9d" />
                </BarChart>
              )}
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[300px] sm:h-[400px] text-muted-foreground">
              No data available for the selected time period
            </div>
          )}
        </CardContent>
      </Card>

      {/* Summary Statistics */}
      {trendsData && trendsData.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl sm:text-3xl font-bold">
                {Math.round(trendsData.reduce((sum, item) => sum + item.value, 0) / trendsData.length)}
              </div>
              <div className="text-sm sm:text-base text-muted-foreground">Average per Period</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl sm:text-3xl font-bold">
                {Math.max(...trendsData.map(item => item.value))}
              </div>
              <div className="text-sm sm:text-base text-muted-foreground">Peak Events</div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
