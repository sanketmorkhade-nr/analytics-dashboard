import React from 'react';
import { Retention } from '@/features/retention';

const RetentionPage: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Retention Analytics</h1>
        <p className="text-lg text-muted-foreground">
          Analyze user retention patterns through cohort-based retention curves
        </p>
      </div>

      <Retention />
    </div>
  );
};

export default RetentionPage;
