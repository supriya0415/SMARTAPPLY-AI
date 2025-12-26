/**
 * Unit Tests for Authentication Service
 * Tests requirements 1.1, 1.2, 1.3, 1.4, 2.1, 2.2, 2.3
 */

import { AuthService, LoginCredentials, SignUpCredentials } from '../authService';
import { toast } from 'sonner';

// Mock dependencies
jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

jest.mock('@/utility/axiosInterceptor', () => ({
  post: jest.fn(),
}));

jest.mock('@/utility/helper', () => ({
  authenticate: jest.fn(),
  getToken: jest.fn(),
  getUser: jest.fn(),
}));

jest.mock('../errorHandlingService', () => ({
  ErrorHandlingService: {
    validateFormData: jest.fn(),
    handleValidationErrors: jest.fn(),
    handleAuthenticationError: jest.fn(),
  },
}));

jest.mock('../logoutService', () => ({
  LogoutService: {
    performLogout: jest.fn(),
  },
}));

// Mock window.confirm
Object.defineProperty(window, 'confirm', {
  writable: true,
  value: jest.fn(),
});

// Mock window.location
Object.defineProperty(window, 'location', {
  writable: true,
  value: {
    href: '',
    pathname: '/test',
  },
});

describe('AuthService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
    sessionStorage.clear();
  });

  describe('Authentication Check (Requirements 1.1)', () => {
    test('should return true when user is authenticated with valid token', () => {
      const mockUser = { id: '1', username: 'testuser' };
      const mockToken = 'valid-token';
      
      localStorage.setItem('jwt', mockToken);
      localStorage.setItem('user', JSON.stringify(mockUser));
      
      const isAuth = AuthService.isAuthenticated();
      expect(isAuth).toBe(true);
    });

    test('should return false when no token exists', () => {
      const isAuth = AuthService.isAuthenticated();
      expect(isAuth).toBe(false);
    });

    test('should return false when no user data exists', () => {
      localStorage.setItem('jwt', 'token');
      
      const isAuth = AuthService.isAuthenticated();
      expect(isAuth).toBe(false);
    });

    test('should return false when token is expired', () => {
      const mockUser = { id: '1', username: 'testuser' };
      const mockToken = 'expired-token';
      const expiredDate = new Date(Date.now() - 1000).toISOString();
      
      localStorage.setItem('jwt', mockToken);
      localStorage.setItem('user', JSON.stringify(mockUser));
      localStorage.setItem('expirationDate', expiredDate);
      
      const isAuth = AuthService.isAuthenticated();
      expect(isAuth).toBe(false);
    });
  });

  describe('Login Functionality (Requirements 1.2, 1.3)', () => {
    test('should login successfully with valid credentials', async () => {
      const credentials: LoginCredentials = {
        username: 'testuser',
        password: 'password123',
      };

      const mockResponse = {
        data: {
          user: { id: '1', username: 'testuser' },
          token: 'jwt-token',
        },
      };

      const axios = require('@/utility/axiosInterceptor');
      axios.post.mockResolvedValue(mockResponse);

      const result = await AuthService.login(credentials);

      expect(result.success).toBe(true);
      expect(result.user).toEqual(mockResponse.data.user);
      expect(result.token).toBe(mockResponse.data.token);
    });

    test('should handle demo login with correct password', async () => {
      const credentials: LoginCredentials = {
        username: 'demo',
        password: 'Demo123!@',
      };

      const result = await AuthService.login(credentials);

      expect(result.success).toBe(true);
      expect(result.user?.username).toBe('demo');
      expect(toast.success).toHaveBeenCalledWith('Demo login successful!');
    });

    test('should reject demo login with incorrect password', async () => {
      const credentials: LoginCredentials = {
        username: 'demo',
        password: 'wrongpassword',
      };

      const result = await AuthService.login(credentials);

      expect(result.success).toBe(false);
      expect(toast.error).toHaveBeenCalledWith('Demo password must be: Demo123!@');
    });

    test('should handle login validation errors', async () => {
      const credentials: LoginCredentials = {
        username: '',
        password: '',
      };

      const { ErrorHandlingService } = require('../errorHandlingService');
      ErrorHandlingService.validateFormData.mockReturnValue(['Username is required']);

      const result = await AuthService.login(credentials);

      expect(result.success).toBe(false);
      expect(ErrorHandlingService.handleValidationErrors).toHaveBeenCalled();
    });

    test('should handle network errors gracefully', async () => {
      const credentials: LoginCredentials = {
        username: 'testuser',
        password: 'password123',
      };

      const axios = require('@/utility/axiosInterceptor');
      axios.post.mockRejectedValue(new Error('Network error'));

      const result = await AuthService.login(credentials);

      expect(result.success).toBe(false);
      expect(result.message).toContain('Network error');
    });
  });

  describe('Sign Up Functionality (Requirements 1.2, 1.3)', () => {
    test('should sign up successfully with valid credentials', async () => {
      const credentials: SignUpCredentials = {
        username: 'newuser',
        password: 'Password123!',
        confirm: 'Password123!',
      };

      const mockResponse = {
        data: {
          user: { id: '2', username: 'newuser' },
          token: 'new-jwt-token',
        },
      };

      const axios = require('@/utility/axiosInterceptor');
      axios.post.mockResolvedValue(mockResponse);

      const result = await AuthService.signUp(credentials);

      expect(result.success).toBe(true);
      expect(result.user).toEqual(mockResponse.data.user);
    });

    test('should handle password mismatch', async () => {
      const credentials: SignUpCredentials = {
        username: 'newuser',
        password: 'Password123!',
        confirm: 'DifferentPassword',
      };

      const { ErrorHandlingService } = require('../errorHandlingService');
      ErrorHandlingService.validateFormData.mockReturnValue(['Passwords do not match']);

      const result = await AuthService.signUp(credentials);

      expect(result.success).toBe(false);
    });

    test('should handle username already exists error', async () => {
      const credentials: SignUpCredentials = {
        username: 'existinguser',
        password: 'Password123!',
      };

      const axios = require('@/utility/axiosInterceptor');
      axios.post.mockRejectedValue({
        response: { status: 409, data: { message: 'Username already exists' } },
      });

      const result = await AuthService.signUp(credentials);

      expect(result.success).toBe(false);
      expect(toast.error).toHaveBeenCalledWith('Username already exists', expect.any(Object));
    });
  });

  describe('Logout Functionality (Requirements 2.1, 2.2, 2.3)', () => {
    test('should logout successfully with confirmation', async () => {
      (window.confirm as jest.Mock).mockReturnValue(true);
      
      const { LogoutService } = require('../logoutService');
      LogoutService.performLogout.mockResolvedValue(undefined);

      const result = await AuthService.logout();

      expect(window.confirm).toHaveBeenCalledWith('Do you want to log out?');
      expect(LogoutService.performLogout).toHaveBeenCalled();
      expect(result).toBe(true);
      expect(toast.success).toHaveBeenCalledWith('Logged out successfully!', { duration: 2000 });
    });

    test('should cancel logout when user declines confirmation', async () => {
      (window.confirm as jest.Mock).mockReturnValue(false);

      const result = await AuthService.logout();

      expect(window.confirm).toHaveBeenCalledWith('Do you want to log out?');
      expect(result).toBe(false);
    });

    test('should handle logout errors gracefully', async () => {
      (window.confirm as jest.Mock).mockReturnValue(true);
      
      const { LogoutService } = require('../logoutService');
      LogoutService.performLogout.mockRejectedValue(new Error('Logout failed'));

      const result = await AuthService.logout();

      expect(result).toBe(true); // Should still return true as fallback clears data
      expect(toast.error).toHaveBeenCalledWith('Logout completed with errors', { duration: 3000 });
    });
  });

  describe('Protected Route Requirements (Requirements 1.1)', () => {
    test('should redirect unauthenticated users', () => {
      const originalHref = window.location.href;
      
      AuthService.requireAuth();

      expect(sessionStorage.getItem('redirectAfterLogin')).toBe('/test');
      expect(window.location.href).toBe('/signin');
    });

    test('should not redirect authenticated users', () => {
      const mockUser = { id: '1', username: 'testuser' };
      localStorage.setItem('jwt', 'valid-token');
      localStorage.setItem('user', JSON.stringify(mockUser));

      const originalHref = window.location.href;
      
      AuthService.requireAuth();

      expect(window.location.href).toBe(originalHref);
    });
  });

  describe('Session Management (Requirements 1.3, 1.4)', () => {
    test('should get current user when authenticated', () => {
      const mockUser = { id: '1', username: 'testuser' };
      localStorage.setItem('user', JSON.stringify(mockUser));

      const user = AuthService.getCurrentUser();
      expect(user).toEqual(mockUser);
    });

    test('should return null when no user data', () => {
      const user = AuthService.getCurrentUser();
      expect(user).toBeNull();
    });

    test('should clear authentication data', () => {
      localStorage.setItem('jwt', 'token');
      localStorage.setItem('user', '{"id":"1"}');
      localStorage.setItem('expirationDate', new Date().toISOString());

      AuthService.clearAuthData();

      expect(localStorage.getItem('jwt')).toBeNull();
      expect(localStorage.getItem('user')).toBeNull();
      expect(localStorage.getItem('expirationDate')).toBeNull();
    });

    test('should get redirect path after login', () => {
      sessionStorage.setItem('redirectAfterLogin', '/dashboard');

      const path = AuthService.getRedirectPath();
      expect(path).toBe('/dashboard');
      expect(sessionStorage.getItem('redirectAfterLogin')).toBeNull();
    });

    test('should return default path when no redirect stored', () => {
      const path = AuthService.getRedirectPath();
      expect(path).toBe('/dashboard');
    });
  });

  describe('Admin Access', () => {
    test('should identify admin users correctly', () => {
      const adminUser = { id: '1', username: 'admin', accessLevel: 'Admin' };
      localStorage.setItem('user', JSON.stringify(adminUser));

      const isAdmin = AuthService.isAdmin();
      expect(isAdmin).toBe(true);
    });

    test('should identify non-admin users correctly', () => {
      const regularUser = { id: '1', username: 'user', accessLevel: 'User' };
      localStorage.setItem('user', JSON.stringify(regularUser));

      const isAdmin = AuthService.isAdmin();
      expect(isAdmin).toBe(false);
    });
  });

  describe('Token Refresh', () => {
    test('should refresh token when near expiration', async () => {
      const mockUser = { id: '1', username: 'testuser' };
      const nearExpirationDate = new Date(Date.now() + 30 * 60 * 1000).toISOString(); // 30 minutes
      
      localStorage.setItem('jwt', 'old-token');
      localStorage.setItem('user', JSON.stringify(mockUser));
      localStorage.setItem('expirationDate', nearExpirationDate);

      const axios = require('@/utility/axiosInterceptor');
      axios.post.mockResolvedValue({
        data: { token: 'new-token' },
      });

      const result = await AuthService.refreshToken();

      expect(result).toBe(true);
      expect(axios.post).toHaveBeenCalledWith('/auth/refresh', { token: 'old-token' });
    });

    test('should handle token refresh failure', async () => {
      localStorage.setItem('jwt', 'old-token');

      const axios = require('@/utility/axiosInterceptor');
      axios.post.mockRejectedValue(new Error('Refresh failed'));

      const result = await AuthService.refreshToken();

      expect(result).toBe(false);
      expect(localStorage.getItem('jwt')).toBeNull(); // Should clear data on failure
    });
  });
});