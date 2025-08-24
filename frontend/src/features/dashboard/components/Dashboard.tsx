import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { Button } from '@/shared/components/ui/button';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { BarChart3, TrendingUp } from 'lucide-react';
import { useDashboardData } from '../hooks/useDashboardData';
import { useTrendsData } from '../hooks/useTrendsData';
import { useChartFormatting } from '../hooks/useChartFormatting';
import { useTopEventsData } from '../hooks/useTopEventsData';
import { useActiveUsersData } from '../hooks/useActiveUsersData';
import { useEndpointsData } from '../hooks/useEndpointsData';
import { useCompaniesData } from '../hooks/useCompaniesData';
import MetricsGrid from './MetricsGrid';
import { useAnalyticsParams } from '@/shared/hooks/useAnalyticsParams';
import TopEventsChart from './TopEventsChart';
import TopUsersInsights from './TopUsersInsights';
import TopEndpointsInsights from './TopEndpointsInsights';
import TopCompaniesChart from './TopCompaniesChart';
import { Alert, AlertDescription } from '@/shared/components/ui/alert';
import { RefreshCw } from 'lucide-react';
import { Skeleton } from '@/shared/components/ui/skeleton';

const Dashboard: React.FC = () => {
  const { metrics, loading, error } = useDashboardData();
  const [chartType, setChartType] = useState<'line' | 'bar'>('line');
  
  // Use custom hooks for data management
  const { trendsData, timeframe, handleTimeframeChange } = useTrendsData();
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
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-lg text-muted-foreground">
          Overview of usage analytics and trends
        </p>
      </div>

      {/* Metrics Grid */}
      <MetricsGrid metrics={metrics} loading={loading} />

      {/* Top Users and Endpoints Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
          {loading ? (
            <Skeleton className="h-[400px] w-full" />
          ) : !trendsData || trendsData.length === 0 ? (
            <div className="flex items-center justify-center h-[400px] text-muted-foreground">
              No data available for the selected time period
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={400}>
              {chartType === 'line' ? (
                <LineChart data={trendsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="timestamp" 
                    tickFormatter={formatDate}
                    tick={{ fontSize: 14 }}
                  />
                  <YAxis tick={{ fontSize: 14 }} />
                  <Tooltip 
                    labelFormatter={formatTooltipDate}
                    formatter={(value: number) => [value.toLocaleString(), 'Events']}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#8884d8" 
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              ) : (
                <BarChart data={trendsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="timestamp" 
                    tickFormatter={formatDate}
                    tick={{ fontSize: 14 }}
                  />
                  <YAxis tick={{ fontSize: 14 }} />
                  <Tooltip 
                    labelFormatter={formatTooltipDate}
                    formatter={(value: number) => [value.toLocaleString(), 'Events']}
                  />
                  <Legend />
                  <Bar dataKey="value" fill="#82ca9d" />
                </BarChart>
              )}
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      {/* Summary Statistics */}
      {trendsData && trendsData.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="text-3xl font-bold">
                {Math.round(trendsData.reduce((sum, item) => sum + item.value, 0) / trendsData.length)}
              </div>
              <div className="text-base text-muted-foreground">Average per Period</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-3xl font-bold">
                {Math.max(...trendsData.map(item => item.value))}
              </div>
              <div className="text-base text-muted-foreground">Peak Events</div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
