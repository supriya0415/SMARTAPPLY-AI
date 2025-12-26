import React from 'react';
import { cn } from '@/lib/utils';
import { LoadingSpinner } from './LoadingSpinner';

interface LoadingStateProps {
  title?: string;
  description?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  variant?: 'card' | 'overlay' | 'inline';
}

/**
 * Enhanced Loading State Component
 * Provides consistent loading UI across the application
 */
export const LoadingState: React.FC<LoadingStateProps> = ({
  title = 'Loading',
  description = 'Please wait while we load your content...',
  size = 'md',
  className,
  variant = 'card'
}) => {
  const variantClasses = {
    card: 'bg-white/90 backdrop-blur-sm border border-gray-200 rounded-xl p-8 shadow-soft',
    overlay: 'fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center',
    inline: 'py-8'
  };

  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  };

  return (
    <div 
      className={cn(
        'flex flex-col items-center justify-center text-center',
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      role="status"
      aria-live="polite"
    >
      <LoadingSpinner 
        size={size === 'sm' ? 'md' : size === 'lg' ? 'xl' : 'lg'} 
        className="mb-4"
        label={title}
      />
      
      <h3 className="font-semibold text-gray-900 mb-2">
        {title}
      </h3>
      
      {description && (
        <p className="text-gray-600 max-w-md">
          {description}
        </p>
      )}
    </div>
  );
};