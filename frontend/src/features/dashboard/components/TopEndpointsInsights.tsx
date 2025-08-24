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
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
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
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
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
        <CardTitle className="flex items-center gap-2">
          <Globe className="h-5 w-5" />
          Most Used Endpoints
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {top5Endpoints.map((endpoint, index) => (
            <div key={endpoint.endpoint} className="p-4 border border-gray-100 rounded-lg bg-gray-50/50 hover:bg-gray-50 transition-colors">
              {/* Endpoint Header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-8 h-8 bg-purple-100 text-purple-700 rounded-full font-semibold text-sm">
                    {index + 1}
                  </div>
                  <div>
                    <div className="font-semibold text-sm text-gray-900">
                      {endpoint.endpoint}
                    </div>
                    <div className="text-xs text-gray-500">
                      Rank #{index + 1} • {endpoint.percentage.toFixed(1)}% of total
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 text-lg font-bold text-green-600">
                    <TrendingUp className="h-4 w-4" />
                    {endpoint.eventCount.toLocaleString()}
                  </div>
                  <div className="text-xs text-gray-500">total events</div>
                </div>
              </div>
              
              {/* Endpoint Details */}
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="flex items-center gap-2 text-gray-600">
                  <Users className="h-3 w-3" />
                  <span className="font-medium">Users:</span>
                  <span>{endpoint.userCount}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Building className="h-3 w-3" />
                  <span className="font-medium">Companies:</span>
                  <span>{endpoint.companyCount}</span>
                </div>
              </div>
              
              {/* Progress Bar */}
              <div className="mt-3">
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>Usage</span>
                  <span>{endpoint.percentage.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(endpoint.percentage, 100)}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {data.length > 5 && (
          <div className="mt-6 text-center text-xs text-gray-500 bg-gray-50 p-2 rounded-lg">
            Showing top 5 of {data.length} endpoints
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TopEndpointsInsights;
