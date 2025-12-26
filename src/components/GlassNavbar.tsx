import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, User, Home, ClipboardList, FileText } from 'lucide-react';
import { cn } from '../lib/utils';
import { useUserStore } from '../lib/stores/userStore';

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  path: string;
  requiresProfile?: boolean;
  requiresCareerPath?: boolean;
}

const navItems: NavItem[] = [
  {
    id: 'home',
    label: 'Home',
    icon: Home,
    path: '/'
  },
  {
    id: 'career-discovery',
    label: 'Career Discovery',
    icon: ClipboardList,
    path: '/assessment' // Will be dynamically determined
  },
  {
    id: 'resume',
    label: 'Resume',
    icon: FileText,
    path: '/resume-upload'
  }
];

interface GlassNavbarProps {
  onGetStarted?: () => void;
}

export const GlassNavbar: React.FC<GlassNavbarProps> = ({ onGetStarted }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { enhancedProfile } = useUserStore();

  const getCareerDiscoveryPath = () => {
    if (!enhancedProfile) {
      return '/assessment'; // Start with assessment for new users
    }
    
    // Always go to dashboard for returning users (those with a profile)
    return '/dashboard';
  };

  const getActiveTab = () => {
    const currentPath = location.pathname;
    
    // Handle career discovery related routes
    if (currentPath.startsWith('/assessment') || 
        currentPath.startsWith('/dashboard') || 
        currentPath.startsWith('/career-details') || 
        currentPath.startsWith('/learning-roadmap') || 
        currentPath.startsWith('/achievements')) {
      return 'career-discovery';
    }
    
    // Handle resume routes
    if (currentPath.startsWith('/resume-upload') || currentPath.startsWith('/resume-analysis')) {
      return 'resume';
    }
    
    // Home route
    if (currentPath === '/') return 'home';
    
    return '';
  };

  const activeTab = getActiveTab();

  const handleNavigation = (item: NavItem) => {
    if (item.id === 'career-discovery') {
      navigate(getCareerDiscoveryPath());
    } else {
      navigate(item.path);
    }
    setIsMenuOpen(false);
  };

  const handleGetStarted = () => {
    if (onGetStarted) {
      onGetStarted();
    } else {
      navigate('/assessment');
    }
    setIsMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4">
      <div className="max-w-7xl mx-auto">
        {/* Glass navbar container with full glass effect */}
        <div className="relative backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl shadow-2xl">
          {/* Additional glass overlay for enhanced effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-white/10 rounded-3xl"></div>

          <div className="relative px-6 py-4">
            <div className="flex items-center justify-between">
              {/* Logo */}
              <div
                className="flex items-center space-x-3 cursor-pointer"
                onClick={() => navigate('/')}
              >
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-sm">EN</span>
                </div>
                <div>
                  <span className="text-xl font-bold text-black tracking-tight">
                    SmartApply AI
                  </span>
                </div>
              </div>

              {/* Desktop Navigation */}
              <div className="hidden lg:flex items-center space-x-6">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;

                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNavigation(item)}
                      className={cn(
                        'flex items-center space-x-2 px-3 py-2 rounded-xl font-medium transition-all duration-200',
                        isActive
                          ? 'bg-white/20 text-black shadow-sm backdrop-blur-sm border border-white/30'
                          : 'text-black/80 hover:text-black hover:bg-white/10 hover:backdrop-blur-sm'
                      )}
                      title={item.label}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="text-sm">{item.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* User Profile & CTA */}
              <div className="hidden md:flex items-center space-x-4">
                {enhancedProfile ? (
                  <div className="flex items-center space-x-3">
                    <div className="text-right">
                      <p className="text-sm font-medium text-black">{enhancedProfile.name}</p>
                      <p className="text-xs text-black/70">Level {enhancedProfile.level}</p>
                    </div>
                    <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center shadow-lg">
                      <User className="w-4 h-4 text-white" />
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={handleGetStarted}
                    className="relative group px-6 py-2.5 bg-black text-white hover:text-blue-200 font-medium rounded-2xl border border-white/20 transition-all duration-300 shadow-lg hover:shadow-xl cursor-pointer hover:scale-105"
                  >
                    <span className="relative z-10">Get Started</span>
                  </button>
                )}
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-black hover:bg-white/20 transition-colors duration-200"
              >
                {isMenuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </button>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
              <div className="md:hidden mt-4 pt-4 border-t border-white/20">
                <div className="flex flex-col space-y-2">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;

                    return (
                      <button
                        key={item.id}
                        onClick={() => handleNavigation(item)}
                        className={cn(
                          'flex items-center space-x-3 text-left py-3 px-4 rounded-xl transition-colors duration-200 font-medium',
                          isActive
                            ? 'bg-white/20 text-black backdrop-blur-sm border border-white/30'
                            : 'text-black/80 hover:text-black hover:bg-white/10'
                        )}
                      >
                        <Icon className="w-5 h-5" />
                        <span>{item.label}</span>
                      </button>
                    );
                  })}

                  {/* Mobile User Profile */}
                  {enhancedProfile ? (
                    <div className="mt-4 pt-4 border-t border-white/20">
                      <div className="flex items-center space-x-3 px-4 py-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="font-medium text-black">{enhancedProfile.name}</p>
                          <p className="text-sm text-black/70">Level {enhancedProfile.level}</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={handleGetStarted}
                      className="mt-4 px-4 py-3 bg-black text-white font-medium rounded-xl border border-white/20 transition-all duration-300 text-center hover:bg-gray-800"
                    >
                      Get Started
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};