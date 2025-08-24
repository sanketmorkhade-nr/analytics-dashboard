import { useState, useEffect } from 'react';

export interface ChartColors {
  grid: string;
  axis: string;
  axisLine: string;
  text: string;
}

export const useChartTheme = () => {
  const [chartColors, setChartColors] = useState<ChartColors>({
    grid: '#e5e7eb',
    axis: '#6b7280',
    axisLine: '#d1d5db',
    text: '#374151'
  });

  useEffect(() => {
    const updateChartColors = () => {
      const isDark = document.documentElement.classList.contains('dark');
      setChartColors({
        grid: isDark ? '#374151' : '#e5e7eb',
        axis: isDark ? '#9ca3af' : '#6b7280',
        axisLine: isDark ? '#4b5563' : '#d1d5db',
        text: isDark ? '#f9fafb' : '#374151'
      });
    };

    // Initial update
    updateChartColors();

    // Watch for theme changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
          updateChartColors();
        }
      });
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });

    return () => observer.disconnect();
  }, []);

  return chartColors;
};
