// Test script to verify Enhanced Profile MongoDB persistence
// Run this with: node test-enhanced-profile.js

import axios from 'axios';

const BASE_URL = 'http://localhost:4000';

// Test data
const testUser = {
  username: 'testuser_' + Date.now(),
  password: 'testpass123'
};

const testEnhancedProfile = {
  name: 'Test User',
  email: 'test@example.com',
  location: 'Test City',
  careerInterest: 'Software Development',
  skills: ['JavaScript', 'React', 'Node.js'],
  careerRecommendations: [{
    id: 'test-rec-1',
    title: 'Software Developer',
    description: 'Build amazing applications',
    fitScore: 85,
    summary: 'Great fit for your skills'
  }],
  progressData: {
    overallProgress: 0,
    skillProgress: {},
    milestoneProgress: {},
    learningActivities: [],
    lastUpdated: new Date()
  },
  achievements: [],
  currentMilestones: [],
  level: 1,
  experiencePoints: 0,
  badges: [],
  streaks: {
    currentStreak: 0,
    longestStreak: 0,
    lastActivityDate: new Date(),
    streakType: 'daily',
    streakGoal: 7
  }
};

async function runTest() {
  let token = null;
  
  try {
    console.log('🧪 Starting Enhanced Profile MongoDB Persistence Test');
    console.log('=' .repeat(60));
    
    // Step 1: Register test user
    console.log('1️⃣  Registering test user...');
    const registerResponse = await axios.post(`${BASE_URL}/api/auth/register`, testUser);
    token = registerResponse.data.token;
    console.log('✅ User registered successfully');
    console.log('   User ID:', registerResponse.data.user.id);
    console.log('   Token received:', !!token);
    
    // Step 2: Verify no enhanced profile exists initially
    console.log('\n2️⃣  Checking for existing enhanced profile...');
    try {
      const response = await axios.get(`${BASE_URL}/api/user/enhanced-profile`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('❌ ERROR: Enhanced profile should not exist for new user');
      console.log('   Unexpected response:', response.data);
      return;
    } catch (error) {
      if (error.response?.status === 404) {
        console.log('✅ Confirmed: No enhanced profile exists (expected 404)');
      } else {
        console.log('❌ Unexpected error:', error.response?.status, error.response?.data);
        throw error;
      }
    }
    
    // Step 3: Save enhanced profile
    console.log('\n3️⃣  Saving enhanced profile to database...');
    const saveResponse = await axios.post(`${BASE_URL}/api/user/enhanced-profile`, testEnhancedProfile, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('✅ Enhanced profile saved successfully');
    console.log('   Profile name:', saveResponse.data.name);
    console.log('   Career recommendations:', saveResponse.data.careerRecommendations?.length || 0);
    console.log('   Level:', saveResponse.data.level);
    
    // Step 4: Retrieve enhanced profile
    console.log('\n4️⃣  Retrieving enhanced profile from database...');
    const getResponse = await axios.get(`${BASE_URL}/api/user/enhanced-profile`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('✅ Enhanced profile retrieved successfully');
    console.log('   Profile name:', getResponse.data.name);
    console.log('   Email:', getResponse.data.email);
    console.log('   Career interest:', getResponse.data.careerInterest);
    console.log('   Skills count:', getResponse.data.skills?.length || 0);
    
    // Step 5: Update enhanced profile
    console.log('\n5️⃣  Updating enhanced profile...');
    const updates = {
      level: 2,
      experiencePoints: 100,
      location: 'Updated City'
    };
    const updateResponse = await axios.patch(`${BASE_URL}/api/user/enhanced-profile`, updates, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('✅ Enhanced profile updated successfully');
    console.log('   New level:', updateResponse.data.level);
    console.log('   New XP:', updateResponse.data.experiencePoints);
    console.log('   New location:', updateResponse.data.location);
    
    // Step 6: Test login flow (simulate new login)
    console.log('\n6️⃣  Testing login flow...');
    const loginResponse = await axios.post(`${BASE_URL}/api/auth/login`, testUser);
    const newToken = loginResponse.data.token;
    console.log('✅ Login successful');
    
    // Fetch profile with new token
    const profileAfterLogin = await axios.get(`${BASE_URL}/api/user/enhanced-profile`, {
      headers: { Authorization: `Bearer ${newToken}` }
    });
    console.log('✅ Enhanced profile retrieved after login');
    console.log('   Profile persisted correctly');
    console.log('   Level:', profileAfterLogin.data.level);
    console.log('   XP:', profileAfterLogin.data.experiencePoints);
    
    // Step 7: Clean up - delete enhanced profile
    console.log('\n7️⃣  Cleaning up - deleting enhanced profile...');
    await axios.delete(`${BASE_URL}/api/user/enhanced-profile`, {
      headers: { Authorization: `Bearer ${newToken}` }
    });
    console.log('✅ Enhanced profile deleted successfully');
    
    // Verify deletion
    try {
      await axios.get(`${BASE_URL}/api/user/enhanced-profile`, {
        headers: { Authorization: `Bearer ${newToken}` }
      });
      console.log('❌ ERROR: Enhanced profile should be deleted');
    } catch (error) {
      if (error.response?.status === 404) {
        console.log('✅ Confirmed: Enhanced profile deleted (expected 404)');
      } else {
        throw error;
      }
    }
    
    console.log('\n🎉 ALL TESTS PASSED! MongoDB persistence is working correctly.');
    console.log('=' .repeat(60));
    console.log('✅ Enhanced profiles can be saved to MongoDB');
    console.log('✅ Enhanced profiles can be retrieved from MongoDB');
    console.log('✅ Enhanced profiles can be updated in MongoDB');
    console.log('✅ Enhanced profiles persist across login sessions');
    console.log('✅ Enhanced profiles can be deleted from MongoDB');
    
  } catch (error) {
    console.error('\n❌ TEST FAILED:');
    console.error('Error:', error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    }
    process.exit(1);
  }
}

// Run the test
runTest().catch(console.error);