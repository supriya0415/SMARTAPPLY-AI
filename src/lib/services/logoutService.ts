import { toast } from 'sonner';

export class LogoutService {
  /**
   * Perform complete logout with comprehensive state cleanup
   */
  static async performLogout(): Promise<void> {
    console.log('=== Starting Complete Logout Process ===');
    
    try {
      // Step 1: Clear user store state first
      console.log('1. Clearing user store state...');
      try {
        const { useUserStore } = await import('../stores/userStore');
        const store = useUserStore.getState();
        store.clearData();
        console.log('✓ User store state cleared successfully');
      } catch (error) {
        console.warn('Could not clear user store state:', error);
      }
      
      // Step 2: Clear all localStorage data
      console.log('2. Clearing localStorage...');
      const keysBeforeClearing = Object.keys(localStorage);
      console.log('Keys in localStorage before clearing:', keysBeforeClearing);
      
      localStorage.clear();
      
      const keysAfterClearing = Object.keys(localStorage);
      console.log('Keys in localStorage after clearing:', keysAfterClearing);
      console.log('✓ localStorage cleared successfully');
      
      // Step 3: Clear sessionStorage as well
      console.log('3. Clearing sessionStorage...');
      sessionStorage.clear();
      console.log('✓ sessionStorage cleared successfully');
      
      // Step 4: Clear any cookies (if any)
      console.log('4. Clearing cookies...');
      document.cookie.split(";").forEach((c) => {
        const eqPos = c.indexOf("=");
        const name = eqPos > -1 ? c.substr(0, eqPos) : c;
        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
      });
      console.log('✓ Cookies cleared successfully');
      
      // Step 5: Clear any cached data
      console.log('5. Clearing browser cache (if supported)...');
      if ('caches' in window) {
        try {
          const cacheNames = await caches.keys();
          await Promise.all(
            cacheNames.map(cacheName => caches.delete(cacheName))
          );
          console.log('✓ Browser cache cleared successfully');
        } catch (error) {
          console.warn('Could not clear browser cache:', error);
        }
      }
      
      // Step 6: Log completion
      console.log('=== Logout Process Complete ===');
      console.log('All user data has been cleared from:');
      console.log('- User store state ✓');
      console.log('- localStorage ✓');
      console.log('- sessionStorage ✓');
      console.log('- cookies ✓');
      console.log('- browser cache ✓');
      
      return Promise.resolve();
      
    } catch (error) {
      console.error('Error during logout process:', error);
      throw error;
    }
  }
  
  /**
   * Verify that all user data has been cleared
   */
  static verifyDataCleared(): boolean {
    console.log('=== Verifying Data Cleanup ===');
    
    // Check localStorage
    const localStorageKeys = Object.keys(localStorage);
    console.log('localStorage keys remaining:', localStorageKeys);
    
    // Check sessionStorage
    const sessionStorageKeys = Object.keys(sessionStorage);
    console.log('sessionStorage keys remaining:', sessionStorageKeys);
    
    // Check for specific user-related keys
    const userDataKeys = [
      'jwt',
      'user',
      'career-mentor-store',
      'expirationDate'
    ];
    
    const remainingUserData = userDataKeys.filter(key => 
      localStorage.getItem(key) !== null || sessionStorage.getItem(key) !== null
    );
    
    if (remainingUserData.length > 0) {
      console.warn('⚠ Some user data still exists:', remainingUserData);
      return false;
    }
    
    console.log('✓ All user data successfully cleared');
    return true;
  }
  
  /**
   * Show logout confirmation dialog
   */
  static showLogoutConfirmation(): Promise<boolean> {
    return new Promise((resolve) => {
      // Create a more user-friendly confirmation dialog
      const message = [
        'Are you sure you want to logout?',
        '',
        '⚠️  This will:',
        '• Clear all your session data',
        '• Remove saved preferences',
        '• Redirect you to the login page',
        '',
        'Your profile and assessment data will be saved and available when you log back in.'
      ].join('\n');
      
      const confirmed = window.confirm(message);
      
      if (confirmed) {
        console.log('✓ User confirmed logout');
        toast.loading('Logging out...', { id: 'logout-process' });
      } else {
        console.log('ℹ User cancelled logout');
        toast.info('Logout cancelled');
      }
      
      resolve(confirmed);
    });
  }
  
  /**
   * Complete logout flow with confirmation
   */
  static async logoutWithConfirmation(): Promise<boolean> {
    try {
      // Show confirmation dialog
      const confirmed = await this.showLogoutConfirmation();
      
      if (!confirmed) {
        return false;
      }
      
      // Perform logout with progress feedback
      console.log('🚀 Starting logout process...');
      await this.performLogout();
      
      // Verify cleanup
      const isCleared = this.verifyDataCleared();
      
      if (isCleared) {
        console.log('✅ Logout completed successfully');
        toast.success('Logged out successfully! Redirecting...', { id: 'logout-process' });
        return true;
      } else {
        console.warn('⚠️ Logout completed but some data may remain');
        toast.warning('Logout completed but some data may remain', { id: 'logout-process' });
        return true;
      }
      
    } catch (error) {
      console.error('❌ Logout failed:', error);
      toast.error('Logout failed. Please try again.', { id: 'logout-process' });
      return false;
    }
  }
  
  /**
   * Emergency logout without confirmation (for error scenarios)
   */
  static async emergencyLogout(): Promise<void> {
    console.log('🚨 Emergency logout initiated');
    toast.loading('Performing emergency logout...', { id: 'emergency-logout' });
    
    try {
      await this.performLogout();
      toast.success('Emergency logout completed', { id: 'emergency-logout' });
    } catch (error) {
      console.error('Emergency logout failed:', error);
      // Force clear everything as fallback
      localStorage.clear();
      sessionStorage.clear();
      toast.warning('Emergency logout completed with fallback method', { id: 'emergency-logout' });
    }
  }
}