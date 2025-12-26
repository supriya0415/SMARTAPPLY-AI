import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  ClipboardList, 
  FileText, 
  User,
  Home,
  Route,
  BookOpen,
  LogIn,
  LogOut
} from 'lucide-react';
import { cn } from '../lib/utils';
import { useUserStore } from '../lib/stores/userStore';
import { AuthService } from '../lib/services/authService';

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  path: string;
  description: string;
  requiresProfile?: boolean;
  requiresCareerPath?: boolean;
}

const navItems: NavItem[] = [
  {
    id: 'home',
    label: 'Home',
    icon: Home,
    path: '/',
    description: 'Get started with your career journey'
  },
  {
    id: 'career-discovery',
    label: 'Career Discovery',
    icon: ClipboardList,
    path: '/assessment', // Will be dynamically determined
    description: 'Discover and progress through your career journey'
  },
  {
    id: 'resume',
    label: 'Resume Optimizer',
    icon: FileText,
    path: '/resume-upload',
    description: 'AI-powered resume analysis'
  }
];

export const MainNavbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { enhancedProfile } = useUserStore();
  
  // Check if user is logged in using AuthService
  const isLoggedIn = AuthService.isAuthenticated();

  const handleLogout = async () => {
    console.log('=== MainNavbar Logout Initiated ===');
    
    try {
      // Use AuthService logout (Requirements 2.1, 2.2, 2.3)
      const success = await AuthService.logout();
      
      if (success) {
        console.log('✓ Logout successful from MainNavbar, redirecting to signin');
        
        // Clear user store state
        const { logout: storeLogout } = useUserStore.getState();
        await storeLogout();
        
        // Navigate to signin page
        navigate('/signin', { replace: true });
        
        console.log('✓ Logout process completed successfully');
      } else {
        console.log('ℹ Logout cancelled by user');
      }
    } catch (error) {
      console.error('❌ Logout error in MainNavbar:', error);
      
      // Fallback - still navigate to signin
      navigate('/signin', { replace: true });
    }
  };

  const handleProfileClick = () => {
    if (isLoggedIn) {
      // Logged in users go to their profile page
      navigate('/profile');
    } else {
      // Non-logged in users go to sign in
      navigate('/signin');
    }
  };

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
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-4 py-3">
      <div className="max-w-7xl mx-auto">
        {/* Enhanced glass navbar container */}
        <div className="relative glass-navbar rounded-2xl shadow-strong">
          <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-white/5 rounded-2xl"></div>
          
          <div className="relative px-6 py-3">
            <div className="flex items-center justify-between h-12">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div>
              <h1 className="text-xl font-bold text-gray-900" style={{fontFamily: 'Playfair Display, serif'}}>SmartApply AI</h1>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => handleNavigation(item)}
                  className={cn(
                    'flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-smooth focus-ring',
                    isActive
                      ? 'bg-primary/10 text-primary shadow-soft'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 btn-hover-lift'
                  )}
                  title={item.description}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <Icon className={cn(
                    'w-4 h-4',
                    isActive ? 'text-blue-600' : 'text-gray-500'
                  )} />
                  <span className="hidden lg:inline">{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* User Profile & Auth Buttons */}
          <div className="flex items-center space-x-3">
            {isLoggedIn ? (
              <>
                <button
                  onClick={handleProfileClick}
                  className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center btn-hover-lift focus-ring"
                  title="Go to Profile"
                  aria-label="Go to Profile"
                >
                  <User className="w-5 h-5 text-white" />
                </button>
                <button
                  onClick={handleLogout}
                  className="hidden md:flex items-center space-x-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-smooth text-sm font-medium btn-hover-lift focus-ring"
                  title="Logout"
                  aria-label="Logout from your account"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <button
                onClick={() => navigate('/signin')}
                className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-primary to-accent text-white rounded-lg btn-hover-lift focus-ring text-sm font-medium"
                title="Sign In"
                aria-label="Sign in to your account"
              >
                <LogIn className="w-4 h-4" />
                <span>Sign In</span>
              </button>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden pt-4 mt-4 border-t border-white/20">
          <div className="flex space-x-1 overflow-x-auto pb-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => handleNavigation(item)}
                  className={cn(
                    'flex flex-col items-center space-y-1 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 min-w-0 flex-shrink-0',
                    isActive
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  )}
                >
                  <Icon className="w-4 h-4" />
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
            {/* Mobile Auth Button */}
            {isLoggedIn ? (
              <button
                onClick={handleLogout}
                className="flex flex-col items-center space-y-1 px-3 py-2 rounded-lg text-xs font-medium bg-red-50 text-red-600 flex-shrink-0"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            ) : (
              <button
                onClick={() => navigate('/signin')}
                className="flex flex-col items-center space-y-1 px-3 py-2 rounded-lg text-xs font-medium bg-purple-50 text-purple-600 flex-shrink-0"
              >
                <LogIn className="w-4 h-4" />
                <span>Sign In</span>
              </button>
            )}
          </div>
        </div>
      </div>
      </div>
      </div>
    </nav>
  );
};