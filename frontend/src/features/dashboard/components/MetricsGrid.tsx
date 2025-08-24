import React from 'react';
import MetricsCard from './MetricsCard';
import { Activity, Users } from 'lucide-react';
import type { MetricsData } from '@/shared/types/api';

interface MetricsGridProps {
  metrics: MetricsData | null;
  loading?: boolean;
}

const MetricsGrid: React.FC<MetricsGridProps> = ({ metrics, loading = false }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[...Array(2)].map((_, index) => (
          <div key={index} className="h-32 bg-muted animate-pulse rounded-lg" />
        ))}
      </div>
    );
  }

  if (!metrics) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <MetricsCard title="Total Events" value={0} icon={<Activity className="h-5 w-5 text-blue-500" />} />
        <MetricsCard title="Active Companies" value={0} icon={<Users className="h-5 w-5 text-green-500" />} />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <MetricsCard 
        title="Total Events" 
        value={metrics.totalEvents} 
        subtitle="All time"
        icon={<Activity className="h-5 w-5 text-blue-500" />}
      />
      <MetricsCard 
        title="Active Companies" 
        value={metrics.activeCompanies} 
        subtitle="Unique companies"
        icon={<Users className="h-5 w-5 text-green-500" />}
      />
    </div>
  );
};

export default MetricsGrid;
