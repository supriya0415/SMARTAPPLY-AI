import React, { useState } from 'react';
import { cn } from '../lib/utils';
import { LoadingSpinner } from './ui/LoadingSpinner';

interface NBButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'accent' | 'warn' | 'error' | 'ok' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  children: React.ReactNode;
  loading?: boolean;
  loadingText?: string;
  fullWidth?: boolean;
}

export const NBButton: React.FC<NBButtonProps> = ({ 
  children, 
  className, 
  variant = 'primary', 
  size = 'md',
  onClick,
  loading = false,
  loadingText,
  fullWidth = false,
  disabled,
  ...props 
}) => {
  const [isClicked, setIsClicked] = useState(false);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (loading || disabled) return;
    
    // Add click effect
    setIsClicked(true);
    
    // Reset after animation
    setTimeout(() => setIsClicked(false), 1500);
    
    // Call original onClick if provided
    if (onClick) {
      onClick(e);
    }
  };

  const variantStyles = {
    primary: isClicked 
      ? 'bg-green-500 text-white shadow-medium scale-105' 
      : 'bg-primary text-primary-foreground hover:bg-primary/90 btn-hover-lift shadow-soft',
    secondary: isClicked
      ? 'bg-green-500 text-white shadow-medium scale-105'
      : 'bg-secondary text-secondary-foreground hover:bg-secondary/80 btn-hover-lift shadow-soft',
    accent: isClicked
      ? 'bg-green-500 text-white shadow-medium scale-105'
      : 'bg-accent text-accent-foreground hover:bg-accent/80 btn-hover-lift shadow-soft',
    warn: isClicked
      ? 'bg-green-500 text-white shadow-medium scale-105'
      : 'bg-yellow-500 text-white hover:bg-yellow-600 btn-hover-lift shadow-soft',
    error: isClicked
      ? 'bg-green-500 text-white shadow-medium scale-105'
      : 'bg-red-500 text-white hover:bg-red-600 btn-hover-lift shadow-soft',
    ok: isClicked
      ? 'bg-green-600 text-white shadow-medium scale-105'
      : 'bg-green-500 text-white hover:bg-green-600 btn-hover-lift shadow-soft',
    ghost: isClicked
      ? 'bg-gray-100 text-gray-900 shadow-medium scale-105'
      : 'bg-transparent text-gray-700 hover:bg-gray-100 btn-hover-lift',
    outline: isClicked
      ? 'bg-primary text-white shadow-medium scale-105'
      : 'bg-transparent border-2 border-primary text-primary hover:bg-primary hover:text-white btn-hover-lift'
  };

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm h-8',
    md: 'px-4 py-2 text-base h-10',
    lg: 'px-6 py-3 text-lg h-12',
    xl: 'px-8 py-4 text-xl h-14'
  };

  const isDisabled = disabled || loading;

  return (
    <button
      className={cn(
        'inline-flex items-center justify-center rounded-lg font-medium transition-smooth transform focus-ring disabled:pointer-events-none disabled:opacity-50 relative overflow-hidden',
        variantStyles[variant],
        sizeStyles[size],
        fullWidth && 'w-full',
        isDisabled && 'cursor-not-allowed',
        className
      )}
      onClick={handleClick}
      disabled={isDisabled}
      aria-disabled={isDisabled}
      {...props}
    >
      {loading && (
        <LoadingSpinner 
          size="sm" 
          className="mr-2" 
          label="Loading"
        />
      )}
      
      <span className={loading ? 'opacity-70' : ''}>
        {loading && loadingText ? loadingText : children}
      </span>
      
      {/* Success ripple effect */}
      {isClicked && (
        <div className="absolute inset-0 bg-green-400 opacity-30 animate-ping rounded-lg"></div>
      )}
    </button>
  );
};
