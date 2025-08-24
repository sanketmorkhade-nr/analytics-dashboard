import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { Users, TrendingUp, Building, Clock } from 'lucide-react';
import type { UserActivity } from '@/shared/types/api';

interface TopUsersInsightsProps {
  data: UserActivity[];
  loading: boolean;
}

const TopUsersInsights: React.FC<TopUsersInsightsProps> = ({ data, loading }) => {
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Top 5 Most Active Users
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
            <Users className="h-5 w-5" />
            Top 5 Most Active Users
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground py-4">
            No user data available
          </div>
        </CardContent>
      </Card>
    );
  }

  // Take top 5 users
  const top5Users = data.slice(0, 5);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Top 5 Most Active Users
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {top5Users.map((user, index) => (
            <div key={user.user} className="p-4 border border-gray-100 rounded-lg bg-gray-50/50 hover:bg-gray-50 transition-colors">
              {/* User Header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-700 rounded-full font-semibold text-sm">
                    {index + 1}
                  </div>
                  <div>
                    <div className="font-semibold text-sm text-gray-900">
                      {user.user}
                    </div>
                    <div className="text-xs text-gray-500">
                      Rank #{index + 1} • {user.companyNames.length > 0 ? user.companyNames.join(', ') : 'No company'}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 text-lg font-bold text-green-600">
                    <TrendingUp className="h-4 w-4" />
                    {user.eventCount.toLocaleString()}
                  </div>
                  <div className="text-xs text-gray-500">total events</div>
                </div>
              </div>
              
              {/* User Details */}
              <div className="grid grid-cols-1 gap-2 text-xs">
                <div className="flex items-center gap-2 text-gray-600">
                  <Building className="h-3 w-3" />
                  <span className="font-medium">Companies:</span>
                  <span className="truncate">{user.companyNames.length > 0 ? user.companyNames.join(', ') : 'No company'}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Clock className="h-3 w-3" />
                  <span className="font-medium">Last Active:</span>
                  <span>
                    {new Date(user.lastActivity).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })} {new Date(user.lastActivity).toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: false
                    })}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {data.length > 5 && (
          <div className="mt-6 text-center text-xs text-gray-500 bg-gray-50 p-2 rounded-lg">
            Showing top 5 of {data.length} active users
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TopUsersInsights;
