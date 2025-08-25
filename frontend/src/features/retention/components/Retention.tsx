import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { TrendingUp, Users, BarChart3 } from 'lucide-react';
import { useRetentionData, RetentionFilters, type RetentionRequest } from '@/features/retention';
import { RetentionCurveChart } from '@/shared/components/charts/RetentionCurveChart';
import MetricsCard from '@/features/dashboard/components/MetricsCard';

const Retention: React.FC = () => {
  const [filters, setFilters] = useState<RetentionRequest>({
    cohortPeriod: 'daily',
    minCohortSize: 5,
  });

  const { data, loading, error } = useRetentionData(filters);

  const handleFiltersChange = (newFilters: RetentionRequest) => {
    setFilters(newFilters);
  };

  // Calculate metrics
  const totalCohorts = data?.totalCohorts || 0;
  const averageRetention = data?.averageRetention || 0;
  const totalUsers = data?.cohorts?.reduce((sum, cohort) => sum + cohort.totalUsers, 0) || 0;

  return (
    <div className="space-y-6">
      {/* Filters Section */}
      <Card>
        <CardContent>
          <RetentionFilters
            filters={filters}
            onFiltersChange={handleFiltersChange}
          />
        </CardContent>
      </Card>

      {/* Error Display */}
      {error && (
        <Card className="border-destructive">
          <CardContent className="pt-6">
            <div className="text-destructive text-center">
              {error}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Metrics Cards */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <MetricsCard
            title="Total Cohorts"
            value={totalCohorts}
            subtitle={totalCohorts === 0 ? "No cohorts match current filters" : "Number of user cohorts analyzed"}
            icon={<BarChart3 className="h-5 w-5 text-blue-500" />}
          />
          <MetricsCard
            title="Average Retention"
            value={totalCohorts === 0 ? "N/A" : `${averageRetention.toFixed(1)}%`}
            subtitle={totalCohorts === 0 ? "No data available" : "30-day retention rate"}
            icon={<TrendingUp className="h-5 w-5 text-green-500" />}
          />
          <MetricsCard
            title="Total Users"
            value={totalUsers}
            subtitle={totalUsers === 0 ? "No users in filtered cohorts" : "Users across all cohorts"}
            icon={<Users className="h-5 w-5 text-purple-500" />}
          />
        </div>
      )}

      {/* Retention Curve Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Cohort Retention Curves</CardTitle>
        </CardHeader>
        <CardContent>
          {!loading && (!data?.cohorts || data.cohorts.length === 0) ? (
            <div className="text-center py-12">
              <div className="text-muted-foreground mb-2">
                <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-semibold mb-2">No Cohorts Found</h3>
                <p className="text-sm">
                  No cohorts match the current filter criteria. Try reducing the minimum cohort size or adjusting other filters.
                </p>
              </div>
            </div>
          ) : (
            <RetentionCurveChart 
              cohorts={data?.cohorts || []} 
              loading={loading} 
            />
          )}
        </CardContent>
      </Card>

      {/* Cohort Details */}
      {data?.cohorts && data.cohorts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Cohort Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {data.cohorts.map((cohort) => (
                <div key={cohort.cohortDate} className="border border-border/50 rounded-xl p-6 bg-card/50 hover:bg-card/80 transition-colors">
                  {/* Cohort Header */}
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-2">
                    <div>
                      <h3 className="text-xl font-bold text-foreground">
                        Cohort: {cohort.cohortDate}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        Users who first engaged on this date
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1 px-3 py-1 bg-primary/10 rounded-full">
                        <Users className="h-4 w-4 text-primary" />
                        <span className="text-sm font-semibold text-primary">
                          {cohort.totalUsers} users
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Retention Metrics Grid */}
                  <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
                    {cohort.retentionData.map((retention) => {
                      const isHighRetention = retention.retentionRate >= 80;
                      const isMediumRetention = retention.retentionRate >= 50 && retention.retentionRate < 80;
                      
                      return (
                        <div key={retention.days} className="text-center group">
                          <div className="p-3 rounded-lg border border-border/50 bg-background/50 hover:bg-background transition-colors">
                            <div className="text-lg font-bold text-foreground mb-1">
                              {retention.days}d
                            </div>
                            <div className={`text-2xl font-bold mb-1 ${
                              isHighRetention ? 'text-green-600' : 
                              isMediumRetention ? 'text-yellow-600' : 
                              'text-red-600'
                            }`}>
                              {retention.retentionRate.toFixed(1)}%
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {retention.activeUsers} of {retention.totalUsers} users
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Retention Summary */}
                  <div className="mt-6 pt-4 border-t border-border/50">
                    <div className="flex flex-col sm:flex-row sm:justify-between gap-4">
                      <div className="flex flex-wrap gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-green-600"></div>
                          <span className="text-muted-foreground">High retention (≥80%)</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-yellow-600"></div>
                          <span className="text-muted-foreground">Medium retention (50-79%)</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-red-600"></div>
                          <span className="text-muted-foreground">Low retention (&lt;50%)</span>
                        </div>
                      </div>
                      
                      {/* Cohort Performance Summary */}
                      <div className="flex items-center gap-4 text-sm">
                        {(() => {
                          const day1Retention = cohort.retentionData.find(d => d.days === 1)?.retentionRate || 0;
                          const day30Retention = cohort.retentionData.find(d => d.days === 30)?.retentionRate || 0;
                          const retentionChange = day30Retention - day1Retention;
                          
                          return (
                            <>
                              <div className="flex items-center gap-2">
                                <span className="text-muted-foreground">Day 1:</span>
                                <span className={`font-semibold ${
                                  day1Retention >= 80 ? 'text-green-600' : 
                                  day1Retention >= 50 ? 'text-yellow-600' : 
                                  'text-red-600'
                                }`}>
                                  {day1Retention.toFixed(1)}%
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-muted-foreground">Day 30:</span>
                                <span className={`font-semibold ${
                                  day30Retention >= 80 ? 'text-green-600' : 
                                  day30Retention >= 50 ? 'text-yellow-600' : 
                                  'text-red-600'
                                }`}>
                                  {day30Retention.toFixed(1)}%
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-muted-foreground">Growth:</span>
                                <span className={`font-semibold ${
                                  retentionChange > 0 ? 'text-green-600' : 
                                  retentionChange < 0 ? 'text-red-600' : 
                                  'text-muted-foreground'
                                }`}>
                                  {retentionChange > 0 ? '+' : ''}{retentionChange.toFixed(1)}%
                                </span>
                              </div>
                            </>
                          );
                        })()}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Retention;
