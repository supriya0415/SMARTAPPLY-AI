import React from 'react';
import { User, LogOut, Settings } from 'lucide-react';
import { NBButton } from '@/components/NBButton';
import { NBCard } from '@/components/NBCard';
import { EnhancedUserProfile } from '@/lib/types';

interface DashboardHeaderProps {
  profile: EnhancedUserProfile;
  onLogout: () => void;
  onSettings: () => void;
}

/**
 * Dashboard header component with user info and navigation
 * Requirements: 6.1, 6.2 - Clean dashboard interface with user profile display
 */
export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  profile,
  onLogout,
  onSettings
}) => {
  return (
    <NBCard className="mb-8 bg-gradient-to-r from-white/95 to-blue-50/80 border-blue-200">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
              <User className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                Welcome back, {profile.name}!
              </h1>
              <p className="text-gray-600">
                Continue your career development journey
              </p>
            </div>
          </div>
          
          {profile.careerInterest && (
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                {profile.careerInterest}
              </span>
              {profile.location && (
                <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                  📍 {profile.location}
                </span>
              )}
              <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
                Level {profile.level}
              </span>
            </div>
          )}
        </div>
        
        <div className="flex gap-2 mt-4 md:mt-0">
          <NBButton
            variant="ghost"
            onClick={onSettings}
            className="text-gray-600 hover:text-gray-900"
          >
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </NBButton>
        </div>
      </div>
    </NBCard>
  );
};