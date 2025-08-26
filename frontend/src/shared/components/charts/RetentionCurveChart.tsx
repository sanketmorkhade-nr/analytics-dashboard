import React from 'react';
import { LineChart, Line, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useChartTheme } from '../../hooks/useChartTheme';
import { ChartTooltip } from './ChartTooltip';
import { ChartXAxis, ChartYAxis } from './ChartAxis';
import type { Cohort } from '@/features/retention/services/retentionService';

interface RetentionCurveChartProps {
  cohorts: Cohort[];
  loading?: boolean;
}

interface ChartDataPoint {
  days: number;
  [cohortDate: string]: number | string;
}

interface RetentionDataPoint {
  days: number;
  retentionRate: number;
}

export const RetentionCurveChart: React.FC<RetentionCurveChartProps> = ({ cohorts, loading = false }) => {
  const chartColors = useChartTheme();
  
  // Generate colors for each cohort
  const cohortColors = [
    '#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#ff0000',
    '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'
  ];

  // Transform data for Recharts
  const chartData = React.useMemo(() => {
    if (!cohorts || cohorts.length === 0) return [];

    // Get all unique days from all cohorts
    const allDays = new Set<number>();
    cohorts.forEach(cohort => {
      cohort.retentionData.forEach(data => {
        allDays.add(data.days);
      });
    });

    const sortedDays = Array.from(allDays).sort((a, b) => a - b);

    // Create data points for each day
    return sortedDays.map(days => {
      const dataPoint: ChartDataPoint = { days };
      
      cohorts.forEach((cohort) => {
        const retentionData = cohort.retentionData.find((d: RetentionDataPoint) => d.days === days);
        if (retentionData) {
          dataPoint[cohort.cohortDate] = retentionData.retentionRate;
        }
      });
      
      return dataPoint;
    });
  }, [cohorts]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[400px]">
        <div className="text-muted-foreground">Loading retention data...</div>
      </div>
    );
  }

  if (!cohorts || cohorts.length === 0) {
    return (
      <div className="flex items-center justify-center h-[400px]">
        <div className="text-muted-foreground">No retention data available</div>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} />
        <ChartXAxis 
          chartColors={chartColors}
          xAxisDataKey="days"
        />
        <ChartYAxis 
          chartColors={chartColors}
        />
        <Tooltip 
          content={<ChartTooltip />}
          formatter={(value: number) => [`${value.toFixed(1)}%`, 'Retention Rate']}
          labelFormatter={(label) => `Day ${label}`}
        />
        <Legend 
          wrapperStyle={{ 
            color: chartColors.text,
            fontSize: '12px'
          }}
        />
        {cohorts.map((cohort, index) => (
          <Line
            key={cohort.cohortDate}
            type="monotone"
            dataKey={cohort.cohortDate}
            stroke={cohortColors[index % cohortColors.length]}
            strokeWidth={2}
            dot={{ r: 3 }}
            activeDot={{ r: 5 }}
            name={`Cohort ${cohort.cohortDate} (${cohort.totalUsers} users)`}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
};
