import { useMemo } from 'react';
import { format, parseISO } from 'date-fns';

export const useChartFormatting = () => {
  // Format date for chart display
  const formatDate = useMemo(() => (timestamp: string) => {
    try {
      const date = parseISO(timestamp);
      return format(date, 'MMM dd');
    } catch {
      return timestamp;
    }
  }, []);

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
