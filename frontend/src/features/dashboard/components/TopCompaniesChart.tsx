import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Building } from 'lucide-react';
import type { CompanyActivity } from '@/shared/types/api';

interface TopCompaniesChartProps {
  data: CompanyActivity[];
  loading: boolean;
}

const TopCompaniesChart: React.FC<TopCompaniesChartProps> = ({ data, loading }) => {
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="h-5 w-5" />
            Top 5 Most Active Companies
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[300px] w-full" />
        </CardContent>
      </Card>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="h-5 w-5" />
            Top 5 Most Active Companies
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-[300px] text-muted-foreground">
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
        <CardTitle className="flex items-center gap-2">
          <Building className="h-5 w-5" />
          Top 5 Most Active Companies
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="name" 
              tick={{ fontSize: 12 }}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip 
              formatter={(value: number, name: string) => [
                value.toLocaleString(), 
                name === 'events' ? 'Events' : name === 'users' ? 'Users' : name === 'endpoints' ? 'Endpoints' : name
              ]}
              labelFormatter={(label: string) => `Company: ${label}`}
            />
            <Legend />
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
