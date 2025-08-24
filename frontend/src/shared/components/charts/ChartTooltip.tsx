import React from 'react';

interface TooltipPayload {
  name: string;
  value: number;
  color: string;
}

interface ChartTooltipProps {
  active?: boolean;
  payload?: TooltipPayload[];
  label?: string;
  labelFormatter?: (label: string) => string;
}

export const ChartTooltip: React.FC<ChartTooltipProps> = ({ 
  active, 
  payload, 
  label, 
  labelFormatter 
}) => {
  if (!active || !payload || !payload.length) {
    return null;
  }

  const displayLabel = labelFormatter ? labelFormatter(label || '') : label;

  return (
    <div className="bg-background border border-border rounded-lg shadow-lg p-3">
      <p className="text-foreground font-medium mb-2">{displayLabel}</p>
      {payload.map((entry: TooltipPayload, index: number) => (
        <p key={index} className="text-sm" style={{ color: entry.color }}>
          {`${entry.name}: ${entry.value.toLocaleString()}`}
        </p>
      ))}
    </div>
  );
};
