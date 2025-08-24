import React from 'react';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface MetricsCardProps {
  title: string;
  value: number | string;
  subtitle?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  icon?: React.ReactNode;
}

const MetricsCard: React.FC<MetricsCardProps> = ({ 
  title, 
  value, 
  subtitle, 
  trend, 
  icon 
}) => {
  return (
    <Card className="p-4 sm:p-6">
      <CardContent className="p-0">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              {icon && <div className="text-primary">{icon}</div>}
              <p className="text-sm sm:text-base font-medium text-muted-foreground">{title}</p>
            </div>
            <p className="text-2xl sm:text-4xl font-bold text-foreground">{value.toLocaleString()}</p>
            {subtitle && (
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">{subtitle}</p>
            )}
          </div>
          {trend && (
            <div className="flex items-center space-x-1">
              {trend.isPositive ? (
                <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-600 dark:text-red-400" />
              )}
              <Badge 
                variant={trend.isPositive ? "default" : "destructive"}
                className="text-xs sm:text-sm"
              >
                {trend.isPositive ? "+" : "-"}{Math.abs(trend.value)}%
              </Badge>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default MetricsCard;
