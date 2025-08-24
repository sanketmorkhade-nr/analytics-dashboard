import React from 'react';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { Alert, AlertDescription } from '@/shared/components/ui/alert';
import { RefreshCw } from 'lucide-react';

interface LoadingSkeletonProps {
  height?: string;
  className?: string;
}

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({ 
  height = 'h-[300px]', 
  className = '' 
}) => (
  <Skeleton className={`w-full ${height} ${className}`} />
);

interface ErrorAlertProps {
  error: string;
  onRetry?: () => void;
}

export const ErrorAlert: React.FC<ErrorAlertProps> = ({ error, onRetry }) => (
  <Alert variant="destructive">
    <RefreshCw className="h-4 w-4" />
    <AlertDescription>
      {error}. {onRetry && (
        <button 
          onClick={onRetry}
          className="underline hover:no-underline ml-1"
        >
          Try again
        </button>
      )}
    </AlertDescription>
  </Alert>
);

interface EmptyStateProps {
  message: string;
  height?: string;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ 
  message, 
  height = 'h-[300px]', 
  className = '' 
}) => (
  <div className={`flex items-center justify-center ${height} text-muted-foreground ${className}`}>
    {message}
  </div>
);
