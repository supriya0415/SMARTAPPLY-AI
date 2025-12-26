import React, { useState, useEffect } from 'react';
import { cn } from '../../lib/utils';

interface GamificationNotificationProps {
  type: 'achievement' | 'levelup' | 'streak' | 'milestone';
  title: string;
  message: string;
  icon: string;
  xp?: number;
  level?: number;
  streak?: number;
  onClose?: () => void;
  autoClose?: boolean;
  duration?: number;
}

export const GamificationNotification: React.FC<GamificationNotificationProps> = ({
  type,
  title,
  message,
  icon,
  xp,
  level,
  streak,
  onClose,
  autoClose = true,
  duration = 5000
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    // Trigger entrance animation
    setTimeout(() => setIsAnimating(true), 100);

    if (autoClose) {
      const timer = setTimeout(() => {
        handleClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [autoClose, duration]);

  const handleClose = () => {
    setIsAnimating(false);
    setTimeout(() => {
      setIsVisible(false);
      onClose?.();
    }, 300);
  };

  if (!isVisible) return null;

  const getTypeStyles = () => {
    switch (type) {
      case 'achievement':
        return 'bg-gradient-to-r from-yellow-400 to-orange-500 border-yellow-300';
      case 'levelup':
        return 'bg-gradient-to-r from-purple-500 to-blue-500 border-purple-300';
      case 'streak':
        return 'bg-gradient-to-r from-red-500 to-orange-500 border-red-300';
      case 'milestone':
        return 'bg-gradient-to-r from-green-500 to-blue-500 border-green-300';
      default:
        return 'bg-gradient-to-r from-gray-500 to-gray-600 border-gray-300';
    }
  };

  return (
    <div
      className={cn(
        'fixed top-4 right-4 z-50 max-w-sm w-full transform transition-all duration-300 ease-out',
        isAnimating 
          ? 'translate-x-0 opacity-100 scale-100' 
          : 'translate-x-full opacity-0 scale-95'
      )}
    >
      <div
        className={cn(
          'rounded-lg border-2 shadow-lg text-white p-4 relative overflow-hidden',
          getTypeStyles()
        )}
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent" />
        </div>

        {/* Content */}
        <div className="relative z-10">
          <div className="flex items-start space-x-3">
            {/* Icon */}
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-2xl">
                {icon}
              </div>
            </div>

            {/* Text Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-white truncate">
                  {title}
                </h3>
                <button
                  onClick={handleClose}
                  className="flex-shrink-0 ml-2 text-white/80 hover:text-white transition-colors"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
              
              <p className="text-white/90 text-sm mt-1">
                {message}
              </p>

              {/* Additional Info */}
              <div className="flex items-center space-x-4 mt-2">
                {xp && (
                  <div className="flex items-center space-x-1 text-yellow-200">
                    <span className="text-xs">⭐</span>
                    <span className="text-sm font-medium">+{xp} XP</span>
                  </div>
                )}
                
                {level && (
                  <div className="flex items-center space-x-1 text-blue-200">
                    <span className="text-xs">🎯</span>
                    <span className="text-sm font-medium">Level {level}</span>
                  </div>
                )}
                
                {streak && (
                  <div className="flex items-center space-x-1 text-orange-200">
                    <span className="text-xs">🔥</span>
                    <span className="text-sm font-medium">{streak} days</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Progress Bar for Auto-close */}
        {autoClose && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
            <div
              className="h-full bg-white/40 transition-all ease-linear"
              style={{
                width: '100%',
                animation: `shrink ${duration}ms linear forwards`
              }}
            />
          </div>
        )}
      </div>

      <style>{`
        @keyframes shrink {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>
    </div>
  );
};

// Container component for managing multiple notifications
interface GamificationNotificationContainerProps {
  notifications: Array<{
    id: string;
    type: 'achievement' | 'levelup' | 'streak' | 'milestone';
    title: string;
    message: string;
    icon: string;
    xp?: number;
    level?: number;
    streak?: number;
  }>;
  onDismiss: (id: string) => void;
}

export const GamificationNotificationContainer: React.FC<GamificationNotificationContainerProps> = ({
  notifications,
  onDismiss
}) => {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {notifications.map((notification, index) => (
        <div
          key={notification.id}
          style={{ 
            transform: `translateY(${index * 10}px)`,
            zIndex: 50 - index
          }}
        >
          <GamificationNotification
            {...notification}
            onClose={() => onDismiss(notification.id)}
          />
        </div>
      ))}
    </div>
  );
};