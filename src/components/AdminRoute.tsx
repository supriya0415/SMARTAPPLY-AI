import { Navigate } from 'react-router-dom';
import { useUserStore } from '../lib/stores/userStore';
import { toast } from 'sonner';
import { useEffect, useState } from 'react';

interface AdminRouteProps {
  children: React.ReactNode;
}

export const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const { profile, enhancedProfile } = useUserStore();
  const [isChecking, setIsChecking] = useState(true);
  
  // Helper function to get role from token
  const getRoleFromToken = (token: string): string | null => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.role || null;
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  };
  
  useEffect(() => {
    // Check if user is authenticated - AuthService uses 'jwt' key, not 'token'
    const token = localStorage.getItem('jwt') || localStorage.getItem('token');
    if (!token) {
      toast.error('Please sign in to access admin panel');
      setIsChecking(false);
      return;
    }

    // Check if user has admin role (check token first, then profile)
    const tokenRole = getRoleFromToken(token);
    const userRole = tokenRole || profile?.role || enhancedProfile?.role;
    
    console.log('Admin check:', { tokenRole, profileRole: profile?.role, userRole });
    
    if (userRole !== 'admin') {
      toast.error('Access denied. Admin privileges required.');
      setIsChecking(false);
      return;
    }

    setIsChecking(false);
  }, [profile, enhancedProfile]);

  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Verifying admin access...</p>
        </div>
      </div>
    );
  }

  // Check authentication - AuthService uses 'jwt' key, not 'token'
  const token = localStorage.getItem('jwt') || localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/signin" replace />;
  }

  // Check admin role (check token first, then profile)
  const tokenRole = getRoleFromToken(token);
  const userRole = tokenRole || profile?.role || enhancedProfile?.role;
  
  if (userRole !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

