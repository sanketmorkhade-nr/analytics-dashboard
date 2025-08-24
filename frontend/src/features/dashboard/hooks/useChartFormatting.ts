import { useMemo } from 'react';
import { format, parseISO } from 'date-fns';

export const useChartFormatting = (timeframe: 'daily' | 'weekly' | 'monthly') => {
  // Format date for chart display
  const formatDate = useMemo(() => (timestamp: string) => {
    try {
      const date = parseISO(timestamp);
      switch (timeframe) {
        case 'daily':
          return format(date, 'MMM dd');
        case 'weekly':
          return format(date, 'MMM dd');
        case 'monthly':
          return format(date, 'MMM yyyy');
        default:
          return format(date, 'MMM dd');
      }
    } catch {
      return timestamp;
    }
  }, [timeframe]);

  // Format date for tooltips
  const formatTooltipDate = useMemo(() => (timestamp: string) => {
    try {
      const date = parseISO(timestamp);
      return format(date, 'MMM dd, yyyy');
    } catch {
      return timestamp;
    }
  }, []);

  return {
    formatDate,
    formatTooltipDate,
  };
};
