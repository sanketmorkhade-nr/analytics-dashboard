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
          <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
            <Users className="h-4 w-4 sm:h-5 sm:w-5" />
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
          <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
            <Users className="h-4 w-4 sm:h-5 sm:w-5" />
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
        <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
          <Users className="h-4 w-4 sm:h-5 sm:w-5" />
          Top 5 Most Active Users
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 sm:space-y-4">
          {top5Users.map((user, index) => (
            <div key={user.user} className="p-3 sm:p-4 border border-border rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
              {/* User Header */}
              <div className="flex items-center justify-between mb-2 sm:mb-3">
                <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                  <div className="flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 bg-primary/10 text-primary rounded-full font-semibold text-xs sm:text-sm flex-shrink-0">
                    {index + 1}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-semibold text-xs sm:text-sm text-foreground truncate">
                      {user.user}
                    </div>
                    <div className="text-xs text-muted-foreground truncate">
                      Rank #{index + 1} • {user.companyNames.length > 0 ? user.companyNames.join(', ') : 'No company'}
                    </div>
                  </div>
                </div>
                <div className="text-right flex-shrink-0 ml-2">
                  <div className="flex items-center gap-1 text-sm sm:text-lg font-bold text-green-600 dark:text-green-400">
                    <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4" />
                    {user.eventCount.toLocaleString()}
                  </div>
                  <div className="text-xs text-muted-foreground">total events</div>
                </div>
              </div>
              
              {/* User Details */}
              <div className="grid grid-cols-1 gap-1 sm:gap-2 text-xs">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Building className="h-3 w-3 flex-shrink-0" />
                  <span className="font-medium">Companies:</span>
                  <span className="truncate">{user.companyNames.length > 0 ? user.companyNames.join(', ') : 'No company'}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="h-3 w-3 flex-shrink-0" />
                  <span className="font-medium">Last Active:</span>
                  <span className="truncate">
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
          <div className="mt-4 sm:mt-6 text-center text-xs text-muted-foreground bg-muted/50 p-2 rounded-lg">
            Showing top 5 of {data.length} active users
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TopUsersInsights;
