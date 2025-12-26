/**
 * Test utilities for developer testing
 * These functions help test the complete user flow and localStorage functionality
 */

import { debugLogger } from './debugLogger';

export class TestUtils {
  /**
   * Test localStorage.clear() functionality
   * This ensures the F12 console localStorage.clear() works as expected
   */
  static testLocalStorageClear(): boolean {
    debugLogger.log('Testing localStorage.clear() functionality', {
      component: 'TestUtils',
      action: 'test_localStorage_clear'
    });

    try {
      // First, add some test data
      const testData = {
        testKey1: 'test value 1',
        testKey2: JSON.stringify({ nested: 'object' }),
        'career-mentor-store': JSON.stringify({
          profile: { name: 'Test User' },
          enhancedProfile: { id: 'test-123' }
        })
      };

      // Store test data
      Object.entries(testData).forEach(([key, value]) => {
        localStorage.setItem(key, value);
      });

      debugLogger.log('Test data added to localStorage', {
        component: 'TestUtils',
        action: 'test_data_added',
        metadata: { keysAdded: Object.keys(testData) }
      });

      // Verify data was stored
      const keysBeforeClear = Object.keys(localStorage);
      debugLogger.log('localStorage keys before clear', {
        component: 'TestUtils',
        action: 'keys_before_clear',
        metadata: { keys: keysBeforeClear }
      });

      // Clear localStorage
      localStorage.clear();

      // Verify clearing worked
      const keysAfterClear = Object.keys(localStorage);
      const isCleared = keysAfterClear.length === 0;

      debugLogger.log('localStorage.clear() test result', {
        component: 'TestUtils',
        action: 'clear_test_result',
        metadata: {
          keysBeforeClear: keysBeforeClear.length,
          keysAfterClear: keysAfterClear.length,
          isCleared,
          remainingKeys: keysAfterClear
        }
      });

      if (isCleared) {
        console.log('✅ localStorage.clear() test PASSED');
        console.log('💡 localStorage is properly cleared and ready for fresh testing');
      } else {
        console.warn('⚠️ localStorage.clear() test FAILED - some keys remain:', keysAfterClear);
      }

      return isCleared;

    } catch (error) {
      debugLogger.error('localStorage.clear() test failed', error as Error, {
        component: 'TestUtils',
        action: 'clear_test_error'
      });
      console.error('❌ localStorage.clear() test ERROR:', error);
      return false;
    }
  }

  /**
   * Verify F12 console access to debug utilities
   */
  static verifyConsoleAccess(): boolean {
    debugLogger.log('Verifying F12 console access to debug utilities', {
      component: 'TestUtils',
      action: 'verify_console_access'
    });

    try {
      const hasDebugUtils = !!(window as any).debugUtils;
      const availableMethods = hasDebugUtils ? Object.keys((window as any).debugUtils) : [];

      debugLogger.log('Console access verification result', {
        component: 'TestUtils',
        action: 'console_access_result',
        metadata: {
          hasDebugUtils,
          availableMethods
        }
      });

      if (hasDebugUtils) {
        console.log('✅ Debug utilities are available in F12 console');
        console.log('Available methods:', availableMethods);
        console.log('💡 Try: debugUtils.inspectState() or debugUtils.clearStorage()');
      } else {
        console.warn('⚠️ Debug utilities not found in console');
        console.log('💡 Make sure you are in development mode');
      }

      return hasDebugUtils;

    } catch (error) {
      debugLogger.error('Console access verification failed', error as Error, {
        component: 'TestUtils',
        action: 'console_access_error'
      });
      return false;
    }
  }

  /**
   * Run comprehensive flow test
   */
  static runFlowTest(): void {
    debugLogger.log('Running comprehensive flow test', {
      component: 'TestUtils',
      action: 'run_flow_test'
    });

    console.log('🧪 COMPREHENSIVE FLOW TEST');
    console.log('==========================');
    
    // Test 1: localStorage functionality
    console.log('\n1. Testing localStorage.clear() functionality...');
    const localStorageWorks = this.testLocalStorageClear();
    
    // Test 2: Console access
    console.log('\n2. Testing F12 console access...');
    const consoleAccessWorks = this.verifyConsoleAccess();
    
    // Test 3: Current state inspection
    console.log('\n3. Inspecting current application state...');
    if ((window as any).debugUtils?.inspectState) {
      (window as any).debugUtils.inspectState();
    } else {
      console.warn('⚠️ debugUtils.inspectState not available');
    }
    
    // Summary
    console.log('\n📊 TEST SUMMARY');
    console.log('================');
    console.log(`localStorage.clear(): ${localStorageWorks ? '✅ PASS' : '❌ FAIL'}`);
    console.log(`Console Access: ${consoleAccessWorks ? '✅ PASS' : '❌ FAIL'}`);
    
    if (localStorageWorks && consoleAccessWorks) {
      console.log('\n🎉 All tests PASSED! The debugging system is working correctly.');
      console.log('\n📋 Next Steps for Manual Testing:');
      console.log('1. Navigate to /signup and create account (test1/test123)');
      console.log('2. Complete career assessment');
      console.log('3. Monitor console for enhanced profile creation logs');
      console.log('4. Navigate to dashboard');
      console.log('5. Test logout and re-login flow');
    } else {
      console.log('\n❌ Some tests FAILED. Check the issues above.');
    }

    debugLogger.log('Flow test completed', {
      component: 'TestUtils',
      action: 'flow_test_complete',
      metadata: {
        localStorageWorks,
        consoleAccessWorks,
        overallSuccess: localStorageWorks && consoleAccessWorks
      }
    });
  }
}

// Make test utilities available globally in development
if (import.meta.env.DEV || import.meta.env.MODE === 'development') {
  (window as any).testUtils = TestUtils;
  console.log('🔧 Test utilities loaded. Access via window.testUtils');
  console.log('Available commands:');
  console.log('  - testUtils.runFlowTest() - Run comprehensive test suite');
  console.log('  - testUtils.testLocalStorageClear() - Test localStorage.clear()');
  console.log('  - testUtils.verifyConsoleAccess() - Verify F12 console access');
}

export default TestUtils;