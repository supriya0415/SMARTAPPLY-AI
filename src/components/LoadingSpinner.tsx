import React from 'react';
import { Loader2, RefreshCw } from 'lucide-react';
import { cn } from '../lib/utils';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'spinner' | 'refresh';
  message?: string;
  description?: string;
  className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  variant = 'spinner',
  message,
  description,
  className
}) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8'
  };

  const Icon = variant === 'refresh' ? RefreshCw : Loader2;

  return (
    <div className={cn('flex flex-col items-center justify-center', className)}>
      <Icon className={cn('animate-spin text-purple-500', sizeClasses[size])} />
      {message && (
        <p className="mt-2 text-sm font-medium text-gray-700">{message}</p>
      )}
      {description && (
        <p className="mt-1 text-xs text-gray-500 text-center max-w-xs">{description}</p>
      )}
    </div>
  );
};

interface LoadingOverlayProps {
  isLoading: boolean;
  message?: string;
  description?: string;
  children: React.ReactNode;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  isLoading,
  message = 'Loading...',
  description,
  children
}) => {
  return (
    <div className="relative">
      {children}
      {isLoading && (
        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50 rounded-lg">
          <LoadingSpinner
            size="lg"
            message={message}
            description={description}
          />
        </div>
      )}
    </div>
  );
};

interface LoadingStateProps {
  isLoading: boolean;
  error?: string | null;
  retry?: () => void;
  loadingMessage?: string;
  errorMessage?: string;
  children: React.ReactNode;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  isLoading,
  error,
  retry,
  loadingMessage = 'Loading...',
  errorMessage = 'Something went wrong',
  children
}) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner
          size="lg"
          message={loadingMessage}
          description="Please wait while we fetch your data"
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="text-red-500 mb-4">
          <svg className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{errorMessage}</h3>
        <p className="text-gray-600 mb-4 max-w-md">{error}</p>
        {retry && (
          <button
            onClick={retry}
            className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
          >
            Try Again
          </button>
        )}
      </div>
    );
  }

  return <>{children}</>;
};