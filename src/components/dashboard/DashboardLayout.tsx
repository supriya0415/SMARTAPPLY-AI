import React from 'react';
import { cn } from '@/lib/utils';

interface DashboardLayoutProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Main dashboard layout component providing the structure for the clean dashboard interface
 * Requirements: 6.1, 6.4, 6.5 - Clean, organized interface with responsive design
 */
export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ 
  children, 
  className 
}) => {
  return (
    <div className={cn(
      "min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 pt-20",
      className
    )}>
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        {children}
      </div>
    </div>
  );
};