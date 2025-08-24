import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { BarChart, Bar, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Building } from 'lucide-react';
import { useChartTheme } from '@/shared/hooks/useChartTheme';
import { ChartTooltip } from '@/shared/components/charts/ChartTooltip';
import { ChartXAxis, ChartYAxis } from '@/shared/components/charts/ChartAxis';
import type { CompanyActivity } from '@/shared/types/api';

interface TopCompaniesChartProps {
  data: CompanyActivity[];
  loading: boolean;
}

const TopCompaniesChart: React.FC<TopCompaniesChartProps> = ({ data, loading }) => {
  const chartColors = useChartTheme();

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
            <Building className="h-4 w-4 sm:h-5 sm:w-5" />
            Top 5 Most Active Companies
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[250px] sm:h-[300px] w-full" />
        </CardContent>
      </Card>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
            <Building className="h-4 w-4 sm:h-5 sm:w-5" />
            Top 5 Most Active Companies
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-[250px] sm:h-[300px] text-muted-foreground">
            No company data available
          </div>
        </CardContent>
      </Card>
    );
  }

  // Take top 5 companies and prepare chart data
  const top5Companies = data.slice(0, 5);
  const chartData = top5Companies.map((company, index) => ({
    name: company.companyName,
    events: company.eventCount,
    users: company.userCount,
    endpoints: company.endpointCount,
    rank: index + 1,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
          <Building className="h-4 w-4 sm:h-5 sm:w-5" />
          Top 5 Most Active Companies
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={250} className="sm:h-[300px]">
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} />
            <ChartXAxis 
              chartColors={chartColors}
              xAxisDataKey="name"
              fontSize={10}
              height={60}
            />
            <ChartYAxis 
              chartColors={chartColors}
              fontSize={10}
            />
            <Tooltip content={<ChartTooltip labelFormatter={(label) => `Company: ${label}`} />} />
            <Legend 
              wrapperStyle={{ 
                color: chartColors.text,
                fontSize: '12px'
              }}
            />
            <Bar dataKey="events" fill="#8884d8" name="Events" />
            <Bar dataKey="users" fill="#82ca9d" name="Users" />
            <Bar dataKey="endpoints" fill="#ffc658" name="Endpoints" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default TopCompaniesChart;
