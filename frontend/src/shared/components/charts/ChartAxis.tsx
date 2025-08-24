import React from 'react';
import { XAxis, YAxis } from 'recharts';
import type { ChartColors } from '@/shared/hooks/useChartTheme';

interface ChartAxisProps {
  chartColors: ChartColors;
  xAxisDataKey?: string;
  tickFormatter?: (value: string) => string;
  angle?: number;
  textAnchor?: 'end' | 'start' | 'middle' | 'inherit';
  height?: number;
  fontSize?: number;
}

export const ChartXAxis: React.FC<ChartAxisProps> = ({
  chartColors,
  xAxisDataKey = "timestamp",
  tickFormatter,
  angle = -45,
  textAnchor = "end",
  height = 60,
  fontSize = 12
}) => (
  <XAxis 
    dataKey={xAxisDataKey}
    tickFormatter={tickFormatter}
    tick={{ 
      fontSize,
      fill: chartColors.text,
      stroke: 'none'
    }}
    axisLine={{ stroke: chartColors.axisLine }}
    angle={angle}
    textAnchor={textAnchor}
    height={height}
  />
);

export const ChartYAxis: React.FC<Omit<ChartAxisProps, 'xAxisDataKey' | 'tickFormatter' | 'angle' | 'textAnchor' | 'height'>> = ({
  chartColors,
  fontSize = 12
}) => (
  <YAxis 
    tick={{ 
      fontSize,
      fill: chartColors.text,
      stroke: 'none'
    }}
    axisLine={{ stroke: chartColors.axisLine }}
  />
);
