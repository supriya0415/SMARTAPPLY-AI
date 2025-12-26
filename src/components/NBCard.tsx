import React from 'react';
import { cn } from '../lib/utils';

interface NBCardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'accent' | 'warn' | 'error' | 'ok' | 'glass';
  onClick?: () => void;
  interactive?: boolean;
  role?: string;
  ariaLabel?: string;
  tabIndex?: number;
}

export const NBCard: React.FC<NBCardProps> = ({ 
  children, 
  className, 
  variant = 'default',
  onClick,
  interactive = false,
  role,
  ariaLabel,
  tabIndex
}) => {
  const variantStyles = {
    default: 'bg-gradient-to-br from-white/95 to-gray-50/80 border-gray-200',
    accent: 'bg-gradient-to-br from-blue-50/90 to-purple-50/90 border-blue-200',
    warn: 'bg-gradient-to-br from-yellow-50/90 to-orange-50/90 border-yellow-300 text-orange-700',
    error: 'bg-gradient-to-br from-red-50/90 to-pink-50/90 border-red-300 text-red-700',
    ok: 'bg-gradient-to-br from-green-50/90 to-emerald-50/90 border-green-300 text-green-700',
    glass: 'glass-card'
  };

  const Component = onClick ? 'button' : 'div';
  const isInteractive = onClick || interactive;

  return (
    <Component
      className={cn(
        'rounded-2xl border-2 p-6 transition-smooth backdrop-blur-sm',
        variantStyles[variant],
        isInteractive && [
          'card-hover cursor-pointer focus-ring',
          'hover:shadow-medium active:scale-[0.98]'
        ],
        !isInteractive && 'shadow-soft',
        className
      )}
      onClick={onClick}
      role={role || (onClick ? 'button' : undefined)}
      aria-label={ariaLabel}
      tabIndex={tabIndex || (onClick ? 0 : undefined)}
      onKeyDown={onClick ? (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      } : undefined}
    >
      {children}
    </Component>
  );
};
