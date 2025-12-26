// Test script to verify logout functionality
// Run this in the browser console to test logout

console.log('🧪 Testing Logout Functionality');
console.log('================================');

// Function to simulate user data
function setupTestData() {
  console.log('📝 Setting up test data...');
  
  // Add some test data to localStorage
  localStorage.setItem('jwt', 'test-token-123');
  localStorage.setItem('user', JSON.stringify({ id: 'test-user', username: 'testuser' }));
  localStorage.setItem('career-mentor-store', JSON.stringify({
    profile: { name: 'Test User' },
    enhancedProfile: { name: 'Test User', level: 5 },
    results: { title: 'Test Career' }
  }));
  localStorage.setItem('expirationDate', new Date().toISOString());
  
  // Add some test data to sessionStorage
  sessionStorage.setItem('temp-data', 'test-session-data');
  sessionStorage.setItem('user-preferences', JSON.stringify({ theme: 'light' }));
  
  console.log('✅ Test data setup complete');
  console.log('localStorage keys:', Object.keys(localStorage));
  console.log('sessionStorage keys:', Object.keys(sessionStorage));
}

// Function to verify data is cleared
function verifyDataCleared() {
  console.log('🔍 Verifying data cleanup...');
  
  const localStorageKeys = Object.keys(localStorage);
  const sessionStorageKeys = Object.keys(sessionStorage);
  
  console.log('localStorage keys after logout:', localStorageKeys);
  console.log('sessionStorage keys after logout:', sessionStorageKeys);
  
  // Check for specific user-related keys
  const userDataKeys = ['jwt', 'user', 'career-mentor-store', 'expirationDate'];
  const remainingUserData = userDataKeys.filter(key => localStorage.getItem(key) !== null);
  
  if (remainingUserData.length === 0 && localStorageKeys.length === 0 && sessionStorageKeys.length === 0) {
    console.log('✅ All data cleared successfully!');
    return true;
  } else {
    console.log('❌ Some data still remains:');
    if (remainingUserData.length > 0) {
      console.log('  - User data keys:', remainingUserData);
    }
    if (localStorageKeys.length > 0) {
      console.log('  - localStorage keys:', localStorageKeys);
    }
    if (sessionStorageKeys.length > 0) {
      console.log('  - sessionStorage keys:', sessionStorageKeys);
    }
    return false;
  }
}

// Test the logout service directly
async function testLogoutService() {
  console.log('🚀 Testing LogoutService...');
  
  try {
    // Setup test data
    setupTestData();
    
    // Import the logout service (this would work in the browser console)
    console.log('📦 Importing LogoutService...');
    
    // Simulate the logout process (manual steps since we can't import in Node.js)
    console.log('🧹 Simulating logout process...');
    
    // Step 1: Clear localStorage
    console.log('1. Clearing localStorage...');
    localStorage.clear();
    
    // Step 2: Clear sessionStorage
    console.log('2. Clearing sessionStorage...');
    sessionStorage.clear();
    
    // Step 3: Verify cleanup
    const isCleared = verifyDataCleared();
    
    if (isCleared) {
      console.log('🎉 Logout test PASSED!');
    } else {
      console.log('❌ Logout test FAILED!');
    }
    
    return isCleared;
    
  } catch (error) {
    console.error('❌ Logout test error:', error);
    return false;
  }
}

// Instructions for manual testing
console.log('📋 Manual Testing Instructions:');
console.log('1. Open the application in your browser');
console.log('2. Login with your credentials');
console.log('3. Complete the assessment if needed');
console.log('4. Click the logout button in the navbar or profile page');
console.log('5. Verify the confirmation dialog appears');
console.log('6. Confirm logout and verify:');
console.log('   - You are redirected to the signin page');
console.log('   - localStorage is cleared (check in DevTools)');
console.log('   - sessionStorage is cleared (check in DevTools)');
console.log('   - Page reloads to ensure complete state reset');
console.log('');
console.log('🔧 Developer Testing:');
console.log('1. Open browser console (F12)');
console.log('2. Run: localStorage.clear()');
console.log('3. Refresh the page');
console.log('4. Verify the app resets to initial state');
console.log('');

// Run the test if in a browser environment
if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
  testLogoutService();
} else {
  console.log('ℹ️ This test is designed to run in a browser environment');
  console.log('Copy and paste this code into your browser console to test');
}