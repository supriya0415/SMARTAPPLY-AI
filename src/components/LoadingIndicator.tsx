/**
 * Loading Indicator Components
 * Implements requirements 10.3, 10.4
 * 
 * Provides various loading indicators with progress tracking
 */

import React from 'react';
import { useLoading } from '@/lib/hooks/useLoading';

export interface LoadingIndicatorProps {
  operationId?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'spinner' | 'progress' | 'skeleton' | 'dots';
  showProgress?: boolean;
  showMessage?: boolean;
  showStage?: boolean;
  className?: string;
}

export interface ProgressBarProps {
  progress: number;
  message?: string;
  stage?: string;
  showPercentage?: boolean;
  animated?: boolean;
  className?: string;
}

export interface SkeletonLoaderProps {
  lines?: number;
  width?: string | number;
  height?: string | number;
  className?: string;
}

/**
 * Main loading indicator component
 */
export const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({
  operationId,
  size = 'md',
  variant = 'spinner',
  showProgress = true,
  showMessage = true,
  showStage = false,
  className = ''
}) => {
  const loading = operationId ? useLoading({ operationId }) : null;

  if (operationId && !loading?.isLoading) {
    return null;
  }

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  const renderSpinner = () => (
    <div className={`animate-spin rounded-full border-2 border-gray-300 border-t-blue-600 ${sizeClasses[size]}`} />
  );

  const renderDots = () => (
    <div className="flex space-x-1">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className={`bg-blue-600 rounded-full animate-pulse ${
            size === 'sm' ? 'w-1 h-1' : size === 'md' ? 'w-2 h-2' : 'w-3 h-3'
          }`}
          style={{
            animationDelay: `${i * 0.2}s`,
            animationDuration: '1s'
          }}
        />
      ))}
    </div>
  );

  const renderProgress = () => {
    if (!loading) return null;
    
    return (
      <ProgressBar
        progress={loading.progress}
        message={showMessage ? loading.message : undefined}
        stage={showStage ? loading.stage : undefined}
        animated
      />
    );
  };

  const renderSkeleton = () => (
    <SkeletonLoader lines={3} />
  );

  const renderIndicator = () => {
    switch (variant) {
      case 'spinner':
        return renderSpinner();
      case 'progress':
        return renderProgress();
      case 'skeleton':
        return renderSkeleton();
      case 'dots':
        return renderDots();
      default:
        return renderSpinner();
    }
  };

  return (
    <div className={`flex flex-col items-center justify-center space-y-2 ${className}`}>
      {renderIndicator()}
      {loading && showMessage && loading.message && variant !== 'progress' && (
        <p className="text-sm text-gray-600 text-center">{loading.message}</p>
      )}
      {loading && showStage && loading.stage && (
        <p className="text-xs text-gray-500 text-center">Stage: {loading.stage}</p>
      )}
    </div>
  );
};

/**
 * Progress bar component
 */
export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  message,
  stage,
  showPercentage = true,
  animated = true,
  className = ''
}) => {
  const clampedProgress = Math.min(100, Math.max(0, progress));

  return (
    <div className={`w-full space-y-2 ${className}`}>
      {(message || stage) && (
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-700">{message}</span>
          {stage && <span className="text-gray-500 text-xs">{stage}</span>}
        </div>
      )}
      
      <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
        <div
          className={`h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-300 ${
            animated ? 'ease-out' : ''
          }`}
          style={{ width: `${clampedProgress}%` }}
        />
      </div>
      
      {showPercentage && (
        <div className="text-right text-xs text-gray-600">
          {Math.round(clampedProgress)}%
        </div>
      )}
    </div>
  );
};

/**
 * Skeleton loader component
 */
export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  lines = 3,
  width = '100%',
  height = '1rem',
  className = ''
}) => {
  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, index) => (
        <div
          key={index}
          className="bg-gray-200 rounded animate-pulse"
          style={{
            width: index === lines - 1 ? '75%' : width,
            height
          }}
        />
      ))}
    </div>
  );
};

/**
 * Card skeleton loader
 */
export const CardSkeleton: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`border rounded-lg p-4 space-y-3 ${className}`}>
    <div className="flex items-center space-x-3">
      <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse" />
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
        <div className="h-3 bg-gray-200 rounded animate-pulse w-1/2" />
      </div>
    </div>
    <div className="space-y-2">
      <div className="h-3 bg-gray-200 rounded animate-pulse" />
      <div className="h-3 bg-gray-200 rounded animate-pulse w-5/6" />
    </div>
  </div>
);

/**
 * List skeleton loader
 */
export const ListSkeleton: React.FC<{ 
  items?: number; 
  showAvatar?: boolean;
  className?: string;
}> = ({ 
  items = 5, 
  showAvatar = false,
  className = '' 
}) => (
  <div className={`space-y-3 ${className}`}>
    {Array.from({ length: items }).map((_, index) => (
      <div key={index} className="flex items-center space-x-3 p-3 border rounded">
        {showAvatar && (
          <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse" />
        )}
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
          <div className="h-3 bg-gray-200 rounded animate-pulse w-1/2" />
        </div>
      </div>
    ))}
  </div>
);

/**
 * Loading overlay component
 */
export const LoadingOverlay: React.FC<{
  isLoading: boolean;
  message?: string;
  progress?: number;
  children: React.ReactNode;
  className?: string;
}> = ({ 
  isLoading, 
  message = 'Loading...', 
  progress,
  children, 
  className = '' 
}) => (
  <div className={`relative ${className}`}>
    {children}
    {isLoading && (
      <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full mx-4">
          <div className="text-center space-y-4">
            <div className="w-8 h-8 mx-auto animate-spin rounded-full border-2 border-gray-300 border-t-blue-600" />
            <p className="text-gray-700">{message}</p>
            {typeof progress === 'number' && (
              <ProgressBar progress={progress} showPercentage />
            )}
          </div>
        </div>
      </div>
    )}
  </div>
);

/**
 * Inline loading component
 */
export const InlineLoading: React.FC<{
  size?: 'sm' | 'md';
  message?: string;
  className?: string;
}> = ({ 
  size = 'sm', 
  message,
  className = '' 
}) => (
  <div className={`flex items-center space-x-2 ${className}`}>
    <div className={`animate-spin rounded-full border-2 border-gray-300 border-t-blue-600 ${
      size === 'sm' ? 'w-4 h-4' : 'w-6 h-6'
    }`} />
    {message && (
      <span className={`text-gray-600 ${size === 'sm' ? 'text-sm' : 'text-base'}`}>
        {message}
      </span>
    )}
  </div>
);

/**
 * Button loading state
 */
export const LoadingButton: React.FC<{
  isLoading: boolean;
  children: React.ReactNode;
  disabled?: boolean;
  className?: string;
  onClick?: () => void;
}> = ({ 
  isLoading, 
  children, 
  disabled = false,
  className = '',
  onClick 
}) => (
  <button
    onClick={onClick}
    disabled={disabled || isLoading}
    className={`relative flex items-center justify-center space-x-2 ${className} ${
      (disabled || isLoading) ? 'opacity-50 cursor-not-allowed' : ''
    }`}
  >
    {isLoading && (
      <div className="w-4 h-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
    )}
    <span className={isLoading ? 'opacity-75' : ''}>{children}</span>
  </button>
);

export default LoadingIndicator;