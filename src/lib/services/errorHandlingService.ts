import { toast } from 'sonner';
import { AxiosError } from 'axios';

export interface ErrorDetails {
  code?: string;
  message: string;
  details?: any;
  timestamp: Date;
  context?: string;
}

export interface ValidationError {
  field: string;
  message: string;
  value?: any;
}

export class ErrorHandlingService {
  /**
   * Handle authentication errors with user-friendly messages
   */
  static handleAuthenticationError(error: any, context: string = 'Authentication'): void {
    console.error(`❌ ${context} Error:`, error);
    
    if (error instanceof AxiosError) {
      const status = error.response?.status;
      const serverMessage = error.response?.data?.error || error.response?.data?.message;
      
      switch (status) {
        case 401:
          toast.error('Invalid username or password. Please check your credentials and try again.', {
            id: 'auth-error',
            duration: 5000,
            description: 'Make sure your username and password are correct.'
          });
          break;
          
        case 403:
          toast.error('Access denied. You don\'t have permission to access this resource.', {
            id: 'auth-error',
            duration: 5000
          });
          break;
          
        case 429:
          toast.error('Too many login attempts. Please wait a few minutes before trying again.', {
            id: 'auth-error',
            duration: 8000,
            description: 'This helps protect your account from unauthorized access.'
          });
          break;
          
        case 500:
          toast.error('Server error occurred. Please try again in a few moments.', {
            id: 'auth-error',
            duration: 6000,
            description: 'Our team has been notified of this issue.'
          });
          break;
          
        default:
          if (serverMessage) {
            toast.error(`Login failed: ${serverMessage}`, {
              id: 'auth-error',
              duration: 5000
            });
          } else {
            toast.error('Login failed. Please check your connection and try again.', {
              id: 'auth-error',
              duration: 5000
            });
          }
      }
    } else if (error.message?.includes('Network Error')) {
      toast.error('Network connection error. Please check your internet connection.', {
        id: 'auth-error',
        duration: 6000,
        description: 'Make sure you\'re connected to the internet and try again.'
      });
    } else {
      toast.error('An unexpected error occurred during login. Please try again.', {
        id: 'auth-error',
        duration: 5000,
        description: error.message || 'Unknown error'
      });
    }
  }

  /**
   * Handle API errors with appropriate user feedback
   */
  static handleApiError(error: any, operation: string = 'Operation'): void {
    console.error(`❌ API Error during ${operation}:`, error);
    
    if (error instanceof AxiosError) {
      const status = error.response?.status;
      const serverMessage = error.response?.data?.error || error.response?.data?.message;
      
      switch (status) {
        case 400:
          toast.error(`Invalid request: ${serverMessage || 'Please check your input and try again.'}`, {
            duration: 5000
          });
          break;
          
        case 404:
          toast.error(`Resource not found: ${serverMessage || 'The requested data could not be found.'}`, {
            duration: 5000
          });
          break;
          
        case 500:
          toast.error('Server error occurred. Please try again later.', {
            duration: 6000,
            description: 'Our team has been notified of this issue.'
          });
          break;
          
        default:
          toast.error(`${operation} failed: ${serverMessage || 'Please try again.'}`, {
            duration: 5000
          });
      }
    } else {
      toast.error(`${operation} failed: ${error.message || 'An unexpected error occurred.'}`, {
        duration: 5000
      });
    }
  }

  /**
   * Handle form validation errors
   */
  static handleValidationErrors(errors: ValidationError[]): void {
    console.warn('⚠️ Validation Errors:', errors);
    
    if (errors.length === 1) {
      const error = errors[0];
      toast.error(`${error.field}: ${error.message}`, {
        id: 'validation-error',
        duration: 4000
      });
    } else {
      toast.error(`Please fix ${errors.length} validation errors:`, {
        id: 'validation-error',
        duration: 6000,
        description: errors.map(e => `• ${e.field}: ${e.message}`).join('\n')
      });
    }
  }

  /**
   * Handle localStorage errors with fallback mechanisms
   */
  static handleStorageError(error: any, operation: string = 'Storage operation'): void {
    console.error(`❌ Storage Error during ${operation}:`, error);
    
    if (error.name === 'QuotaExceededError') {
      toast.error('Storage quota exceeded. Please clear some browser data.', {
        duration: 8000,
        description: 'Go to browser settings and clear site data, then try again.'
      });
    } else if (error.name === 'SecurityError') {
      toast.error('Storage access denied. Please check your browser settings.', {
        duration: 6000,
        description: 'Make sure cookies and local storage are enabled.'
      });
    } else {
      toast.warning(`${operation} failed. Some features may not work properly.`, {
        duration: 5000,
        description: 'Your progress may not be saved automatically.'
      });
    }
  }

  /**
   * Handle network connectivity issues
   */
  static handleNetworkError(error: any, operation: string = 'Network operation'): void {
    console.error(`❌ Network Error during ${operation}:`, error);
    
    if (!navigator.onLine) {
      toast.error('You appear to be offline. Please check your internet connection.', {
        id: 'network-error',
        duration: 0, // Don't auto-dismiss
        description: 'Some features may not work until you\'re back online.'
      });
    } else {
      toast.error('Network connection issue. Please try again.', {
        id: 'network-error',
        duration: 6000,
        description: 'Check your internet connection and refresh the page if needed.'
      });
    }
  }

  /**
   * Handle generic errors with fallback
   */
  static handleGenericError(error: any, context: string = 'Operation', showToUser: boolean = true): ErrorDetails {
    const errorDetails: ErrorDetails = {
      code: error.code || error.name || 'UNKNOWN_ERROR',
      message: error.message || 'An unexpected error occurred',
      details: error,
      timestamp: new Date(),
      context
    };
    
    console.error(`❌ ${context} Error:`, errorDetails);
    
    if (showToUser) {
      toast.error(`${context} failed: ${errorDetails.message}`, {
        duration: 5000,
        description: 'Please try again or contact support if the issue persists.'
      });
    }
    
    return errorDetails;
  }

  /**
   * Show loading state with error handling
   */
  static async withLoadingAndErrorHandling<T>(
    operation: () => Promise<T>,
    loadingMessage: string,
    successMessage?: string,
    context: string = 'Operation'
  ): Promise<T | null> {
    const toastId = `${context.toLowerCase()}-loading`;
    
    try {
      toast.loading(loadingMessage, { id: toastId });
      
      const result = await operation();
      
      if (successMessage) {
        toast.success(successMessage, { id: toastId });
      } else {
        toast.dismiss(toastId);
      }
      
      return result;
    } catch (error) {
      toast.dismiss(toastId);
      this.handleGenericError(error, context);
      return null;
    }
  }

  /**
   * Validate form data and return errors
   */
  static validateFormData(data: Record<string, any>, rules: Record<string, any>): ValidationError[] {
    const errors: ValidationError[] = [];
    
    Object.entries(rules).forEach(([field, rule]) => {
      const value = data[field];
      
      // Required field validation
      if (rule.required && (!value || (typeof value === 'string' && value.trim() === ''))) {
        errors.push({
          field: rule.label || field,
          message: 'This field is required',
          value
        });
        return;
      }
      
      // Skip other validations if field is empty and not required
      if (!value) return;
      
      // Min length validation
      if (rule.minLength && typeof value === 'string' && value.length < rule.minLength) {
        errors.push({
          field: rule.label || field,
          message: `Must be at least ${rule.minLength} characters long`,
          value
        });
      }
      
      // Max length validation
      if (rule.maxLength && typeof value === 'string' && value.length > rule.maxLength) {
        errors.push({
          field: rule.label || field,
          message: `Must be no more than ${rule.maxLength} characters long`,
          value
        });
      }
      
      // Email validation
      if (rule.email && typeof value === 'string') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          errors.push({
            field: rule.label || field,
            message: 'Please enter a valid email address',
            value
          });
        }
      }
      
      // Number validation
      if (rule.number && isNaN(Number(value))) {
        errors.push({
          field: rule.label || field,
          message: 'Must be a valid number',
          value
        });
      }
      
      // Min/Max value validation
      if (rule.min && Number(value) < rule.min) {
        errors.push({
          field: rule.label || field,
          message: `Must be at least ${rule.min}`,
          value
        });
      }
      
      if (rule.max && Number(value) > rule.max) {
        errors.push({
          field: rule.label || field,
          message: `Must be no more than ${rule.max}`,
          value
        });
      }
      
      // Custom validation
      if (rule.custom && typeof rule.custom === 'function') {
        const customError = rule.custom(value);
        if (customError) {
          errors.push({
            field: rule.label || field,
            message: customError,
            value
          });
        }
      }
    });
    
    return errors;
  }

  /**
   * Monitor network status and show appropriate messages
   */
  static initializeNetworkMonitoring(): (() => void) | void {
    if (typeof window === 'undefined') return;
    
    const handleOnline = () => {
      toast.success('Connection restored! You\'re back online.', {
        id: 'network-status',
        duration: 3000
      });
    };
    
    const handleOffline = () => {
      toast.error('Connection lost. You\'re currently offline.', {
        id: 'network-status',
        duration: 0, // Don't auto-dismiss
        description: 'Some features may not work until connection is restored.'
      });
    };
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    // Return cleanup function
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }
}