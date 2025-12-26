import { toast } from 'sonner';
import axios from '@/utility/axiosInterceptor';
import { authenticate, getToken, getUser } from '@/utility/helper';
import { ErrorHandlingService } from './errorHandlingService';
import { LogoutService } from './logoutService';
import { debugLogger } from '@/lib/utils/debugLogger';

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface SignUpCredentials {
  username: string;
  password: string;
  confirm?: string;
}

export interface AuthResult {
  success: boolean;
  user?: any;
  token?: string;
  message?: string;
}

export interface User {
  id: string;
  username: string;
  accessLevel?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * Enhanced Authentication Service
 * Implements requirements 1.1, 1.2, 1.3, 1.4, 2.1, 2.2, 2.3
 */
export class AuthService {
  private static readonly TOKEN_KEY = 'jwt';
  private static readonly USER_KEY = 'user';
  private static readonly EXPIRATION_KEY = 'expirationDate';

  /**
   * Check if user is currently authenticated
   * Requirement 1.1: Authentication check for protected routes
   */
  static isAuthenticated(): boolean {
    try {
      const token = this.getStoredToken();
      const user = this.getStoredUser();
      
      // Debug: Log what we found in storage
      debugLogger.log('Authentication check - storage contents', {
        component: 'AuthService',
        action: 'auth_check_debug',
        metadata: { 
          hasToken: !!token, 
          hasUser: !!user,
          tokenValue: token ? token.substring(0, 10) + '...' : null,
          userValue: user ? user.username : null,
          allLocalStorageKeys: Object.keys(localStorage)
        }
      });
      
      if (!token || !user) {
        debugLogger.log('Authentication check failed: missing token or user', {
          component: 'AuthService',
          action: 'auth_check',
          metadata: { hasToken: !!token, hasUser: !!user }
        });
        return false;
      }

      // Check token expiration
      const expirationDate = localStorage.getItem(this.EXPIRATION_KEY);
      if (expirationDate) {
        const expDate = new Date(expirationDate);
        const now = new Date();
        
        if (now > expDate) {
          debugLogger.log('Authentication check failed: token expired', {
            component: 'AuthService',
            action: 'auth_check',
            metadata: { expiredAt: expDate.toISOString() }
          });
          this.clearAuthData();
          return false;
        }
      }

      debugLogger.log('Authentication check passed', {
        component: 'AuthService',
        action: 'auth_check',
        metadata: { userId: user.id }
      });
      return true;
    } catch (error) {
      debugLogger.error('Authentication check error', error as Error, {
        component: 'AuthService',
        action: 'auth_check'
      });
      return false;
    }
  }

  /**
   * Get current authenticated user
   */
  static getCurrentUser(): User | null {
    try {
      return this.getStoredUser();
    } catch (error) {
      debugLogger.error('Error getting current user', error as Error, {
        component: 'AuthService',
        action: 'get_current_user'
      });
      return null;
    }
  }

  /**
   * Get stored authentication token
   */
  static getStoredToken(): string | null {
    return getToken();
  }

  /**
   * Get stored user data
   */
  static getStoredUser(): User | null {
    return getUser();
  }

  /**
   * Require authentication - redirect if not authenticated
   * Requirement 1.1: Mandatory authentication for protected features
   */
  static requireAuth(): void {
    if (!this.isAuthenticated()) {
      debugLogger.log('Authentication required - redirecting to login', {
        component: 'AuthService',
        action: 'require_auth',
        metadata: { currentPath: window.location.pathname }
      });
      
      // Store current path for redirect after login
      sessionStorage.setItem('redirectAfterLogin', window.location.pathname);
      
      // Redirect to login
      window.location.href = '/signin';
    }
  }

  /**
   * Login user with credentials
   * Requirements 1.2, 1.3: Login functionality with session management
   */
  static async login(credentials: LoginCredentials): Promise<AuthResult> {
    try {
      debugLogger.logAuthStart(credentials.username);
      
      // Validate credentials
      const validationRules = {
        username: {
          required: true,
          label: 'Username',
          minLength: 2
        },
        password: {
          required: true,
          label: 'Password',
          minLength: 3
        }
      };
      
      const validationErrors = ErrorHandlingService.validateFormData(credentials, validationRules);
      if (validationErrors.length > 0) {
        ErrorHandlingService.handleValidationErrors(validationErrors);
        return { success: false, message: 'Validation failed' };
      }



      // Make login request to real API
      const response = await axios.post('/auth/login', {
        username: credentials.username,
        password: credentials.password
      });

      const { user, token } = response.data;
      
      if (!user || !token) {
        throw new Error('Invalid response from server');
      }

      // Store authentication data
      this.setAuthData(user, token);
      
      debugLogger.logAuthSuccess(user);
      
      return {
        success: true,
        user,
        token,
        message: 'Login successful'
      };

    } catch (error: any) {
      debugLogger.logAuthFailure(error);
      
      ErrorHandlingService.handleAuthenticationError(error, 'Login');
      
      return {
        success: false,
        message: error.response?.data?.message || error.message || 'Login failed'
      };
    }
  }

  /**
   * Sign up new user
   * Requirements 1.2, 1.3: Registration with session management
   */
  static async signUp(credentials: SignUpCredentials): Promise<AuthResult> {
    try {
      debugLogger.log('Sign up process started', {
        component: 'AuthService',
        action: 'signup_start',
        metadata: { username: credentials.username }
      });
      
      // Validate credentials
      const validationRules = {
        username: {
          required: true,
          label: 'Username',
          minLength: 3,
          maxLength: 20,
          custom: (value: string) => {
            if (!/^[a-zA-Z0-9_]+$/.test(value)) {
              return 'Username can only contain letters, numbers, and underscores';
            }
            return null;
          }
        },
        password: {
          required: true,
          label: 'Password',
          minLength: 6,
          custom: (value: string) => {
            if (!/(?=.*[a-z])(?=.*[A-Z])|(?=.*\d)/.test(value)) {
              return 'Password should contain at least one uppercase letter or number';
            }
            return null;
          }
        }
      };

      // Add confirm password validation if provided
      if (credentials.confirm !== undefined) {
        (validationRules as any).confirm = {
          required: true,
          label: 'Confirm Password',
          custom: (value: string) => {
            if (value !== credentials.password) {
              return 'Passwords do not match';
            }
            return null;
          }
        };
      }
      
      const validationErrors = ErrorHandlingService.validateFormData(credentials, validationRules);
      if (validationErrors.length > 0) {
        ErrorHandlingService.handleValidationErrors(validationErrors);
        return { success: false, message: 'Validation failed' };
      }

      // Make registration request
      const response = await axios.post('/auth/register', {
        username: credentials.username,
        password: credentials.password
      });

      const { user, token } = response.data;
      
      if (!user || !token) {
        throw new Error('Invalid response from server');
      }

      // Store authentication data
      authenticate({ token, data: user } as any);
      
      debugLogger.log('Sign up successful', {
        component: 'AuthService',
        action: 'signup_success',
        metadata: { userId: user.id }
      });
      
      return {
        success: true,
        user,
        token,
        message: 'Account created successfully'
      };

    } catch (error: any) {
      debugLogger.error('Sign up failed', error as Error, {
        component: 'AuthService',
        action: 'signup_error'
      });
      
      if (error.response?.status === 409) {
        toast('Username already exists - please choose a different one', {
          duration: 4000
        });
      } else {
        ErrorHandlingService.handleAuthenticationError(error, 'Sign Up');
      }
      
      return {
        success: false,
        message: error.response?.data?.message || error.message || 'Sign up failed'
      };
    }
  }

  /**
   * Logout user with clean confirmation dialog
   * Requirements 2.1, 2.2, 2.3: Simple logout confirmation without warnings
   */
  static async logout(): Promise<boolean> {
    try {
      debugLogger.logLogoutStart();
      
      // Show simple confirmation dialog as per requirement 2.1, 2.2
      const confirmed = window.confirm('Do you want to log out?');
      
      if (!confirmed) {
        debugLogger.log('Logout cancelled by user', {
          component: 'AuthService',
          action: 'logout_cancelled'
        });
        return false;
      }

      // Perform logout immediately without additional warnings (requirement 2.2)
      await LogoutService.performLogout();
      
      debugLogger.logLogoutComplete(true);
      
      // Show success message
      toast.success('Logged out successfully!', {
        duration: 2000
      });
      
      return true;

    } catch (error) {
      debugLogger.error('Logout failed', error as Error, {
        component: 'AuthService',
        action: 'logout_error'
      });
      
      // Fallback - clear data anyway
      this.clearAuthData();
      
      toast.success('Logged out successfully', {
        duration: 2000
      });
      
      debugLogger.logLogoutComplete(false);
      return true; // Still return true since we cleared the data
    }
  }

  /**
   * Set authentication data manually (for testing/demo purposes)
   */
  static setAuthData(user: User, token: string): void {
    try {
      localStorage.setItem(this.TOKEN_KEY, token);
      localStorage.setItem(this.USER_KEY, JSON.stringify(user));
      
      const expirationDate = new Date(new Date().getTime() + 60 * 60 * 24 * 10 * 1000);
      localStorage.setItem(this.EXPIRATION_KEY, expirationDate.toISOString());
      
      debugLogger.log('Authentication data set manually', {
        component: 'AuthService',
        action: 'set_auth_data',
        metadata: { userId: user.id, username: user.username }
      });
    } catch (error) {
      debugLogger.error('Error setting authentication data', error as Error, {
        component: 'AuthService',
        action: 'set_auth_data'
      });
    }
  }

  /**
   * Clear authentication data
   */
  static clearAuthData(): void {
    try {
      localStorage.removeItem(this.TOKEN_KEY);
      localStorage.removeItem(this.USER_KEY);
      localStorage.removeItem(this.EXPIRATION_KEY);
      
      // Also clear user profile data
      try {
        const { UserProfileService } = require('./userProfileService');
        UserProfileService.clearUserData();
      } catch (error) {
        // UserProfileService might not be available in all contexts
        debugLogger.log('UserProfileService not available during auth clear', {
          component: 'AuthService',
          action: 'clear_auth_data'
        });
      }
      
      debugLogger.log('Authentication data cleared', {
        component: 'AuthService',
        action: 'clear_auth_data'
      });
    } catch (error) {
      debugLogger.error('Error clearing auth data', error as Error, {
        component: 'AuthService',
        action: 'clear_auth_data'
      });
    }
  }

  /**
   * Refresh authentication token if needed
   */
  static async refreshToken(): Promise<boolean> {
    try {
      const token = this.getStoredToken();
      if (!token) {
        return false;
      }

      // Check if token needs refresh (e.g., expires in next hour)
      const expirationDate = localStorage.getItem(this.EXPIRATION_KEY);
      if (expirationDate) {
        const expDate = new Date(expirationDate);
        const oneHourFromNow = new Date(Date.now() + 60 * 60 * 1000);
        
        if (expDate > oneHourFromNow) {
          // Token is still valid for more than an hour
          return true;
        }
      }

      // Attempt to refresh token
      const response = await axios.post('/auth/refresh', { token });
      
      if (response.data.token) {
        // Update stored token
        localStorage.setItem(this.TOKEN_KEY, response.data.token);
        
        // Update expiration
        const newExpirationDate = new Date(new Date().getTime() + 60 * 60 * 24 * 10 * 1000);
        localStorage.setItem(this.EXPIRATION_KEY, newExpirationDate.toDateString());
        
        debugLogger.log('Token refreshed successfully', {
          component: 'AuthService',
          action: 'token_refresh'
        });
        
        return true;
      }
      
      return false;

    } catch (error) {
      debugLogger.error('Token refresh failed', error as Error, {
        component: 'AuthService',
        action: 'token_refresh'
      });
      
      // If refresh fails, user needs to login again
      this.clearAuthData();
      return false;
    }
  }

  /**
   * Get redirect path after login
   */
  static getRedirectPath(): string {
    const stored = sessionStorage.getItem('redirectAfterLogin');
    sessionStorage.removeItem('redirectAfterLogin');
    return stored || '/dashboard';
  }

  /**
   * Check if user has admin access
   */
  static isAdmin(): boolean {
    const user = this.getCurrentUser();
    return user?.accessLevel === 'Admin';
  }

  /**
   * Initialize authentication system
   */
  static initialize(): void {
    debugLogger.log('Authentication system initialized', {
      component: 'AuthService',
      action: 'initialize',
      metadata: { 
        isAuthenticated: this.isAuthenticated(),
        hasUser: !!this.getCurrentUser()
      }
    });

    // Set up automatic token refresh
    if (this.isAuthenticated()) {
      // Check token every 30 minutes
      setInterval(() => {
        this.refreshToken().catch(error => {
          debugLogger.error('Automatic token refresh failed', error as Error, {
            component: 'AuthService',
            action: 'auto_refresh'
          });
        });
      }, 30 * 60 * 1000);
    }
  }
}