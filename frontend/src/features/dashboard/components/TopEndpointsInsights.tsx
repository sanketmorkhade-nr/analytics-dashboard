import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { Globe, TrendingUp, Users, Building } from 'lucide-react';
import type { EndpointActivity } from '@/shared/types/api';

interface TopEndpointsInsightsProps {
  data: EndpointActivity[];
  loading: boolean;
}

const TopEndpointsInsights: React.FC<TopEndpointsInsightsProps> = ({ data, loading }) => {
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
            <Globe className="h-4 w-4 sm:h-5 sm:w-5" />
            Most Used Endpoints
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(5)].map((_, index) => (
              <div key={index} className="flex items-center justify-between">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-16" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
            <Globe className="h-4 w-4 sm:h-5 sm:w-5" />
            Most Used Endpoints
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground py-4">
            No endpoint data available
          </div>
        </CardContent>
      </Card>
    );
  }

  // Take top 5 endpoints
  const top5Endpoints = data.slice(0, 5);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
          <Globe className="h-4 w-4 sm:h-5 sm:w-5" />
          Most Used Endpoints
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 sm:space-y-4">
          {top5Endpoints.map((endpoint, index) => (
            <div key={endpoint.endpoint} className="p-3 sm:p-4 border border-border rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
              {/* Endpoint Header */}
              <div className="flex items-center justify-between mb-2 sm:mb-3">
                <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                  <div className="flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 bg-primary/10 text-primary rounded-full font-semibold text-xs sm:text-sm flex-shrink-0">
                    {index + 1}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-semibold text-xs sm:text-sm text-foreground truncate">
                      {endpoint.endpoint}
                    </div>
                    <div className="text-xs text-muted-foreground truncate">
                      Rank #{index + 1} • {endpoint.percentage.toFixed(1)}% of total
                    </div>
                  </div>
                </div>
                <div className="text-right flex-shrink-0 ml-2">
                  <div className="flex items-center gap-1 text-sm sm:text-lg font-bold text-green-600 dark:text-green-400">
                    <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4" />
                    {endpoint.eventCount.toLocaleString()}
                  </div>
                  <div className="text-xs text-muted-foreground">total events</div>
                </div>
              </div>
              
              {/* Endpoint Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 text-xs">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Users className="h-3 w-3 flex-shrink-0" />
                  <span className="font-medium">Users:</span>
                  <span>{endpoint.userCount}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Building className="h-3 w-3 flex-shrink-0" />
                  <span className="font-medium">Companies:</span>
                  <span>{endpoint.companyCount}</span>
                </div>
              </div>
              
              {/* Progress Bar */}
              <div className="mt-2 sm:mt-3">
                <div className="flex justify-between text-xs text-muted-foreground mb-1">
                  <span>Usage</span>
                  <span>{endpoint.percentage.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className="bg-green-500 dark:bg-green-400 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(endpoint.percentage, 100)}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {data.length > 5 && (
          <div className="mt-4 sm:mt-6 text-center text-xs text-muted-foreground bg-muted/50 p-2 rounded-lg">
            Showing top 5 of {data.length} endpoints
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TopEndpointsInsights;
