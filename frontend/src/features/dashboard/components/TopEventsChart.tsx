import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { BarChart, Bar, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { BarChart3 } from 'lucide-react';
import { useChartTheme } from '@/shared/hooks/useChartTheme';
import { ChartTooltip } from '@/shared/components/charts/ChartTooltip';
import { ChartXAxis, ChartYAxis } from '@/shared/components/charts/ChartAxis';

interface TopEventsChartProps {
  data: Array<{ type: string; count: number }>;
  loading: boolean;
}

const TopEventsChart: React.FC<TopEventsChartProps> = ({ data, loading }) => {
  const chartColors = useChartTheme();

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
            <BarChart3 className="h-4 w-4 sm:h-5 sm:w-5" />
            Top Events by Volume
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
            <BarChart3 className="h-4 w-4 sm:h-5 sm:w-5" />
            Top Events by Volume
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-[250px] sm:h-[300px] text-muted-foreground">
            No event data available
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
          <BarChart3 className="h-4 w-4 sm:h-5 sm:w-5" />
          Top Events by Volume
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={250} className="sm:h-[300px]">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} />
            <ChartXAxis 
              chartColors={chartColors}
              xAxisDataKey="type"
              fontSize={10}
              height={60}
            />
            <ChartYAxis 
              chartColors={chartColors}
              fontSize={10}
            />
            <Tooltip content={<ChartTooltip labelFormatter={(label) => `Event Type: ${label}`} />} />
            <Legend 
              wrapperStyle={{ 
                color: chartColors.text,
                fontSize: '12px'
              }}
            />
            <Bar 
              dataKey="count" 
              fill="#8884d8" 
              name="Event Count"
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default TopEventsChart;
