import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { NBCard } from '@/components/NBCard';
import { NBButton } from '@/components/NBButton';
import { useUserStore } from '@/lib/stores/userStore';
import { LogoutService } from '@/lib/services/logoutService';
import { User, Mail, Lock, Calendar, Award, LogOut } from 'lucide-react';

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const enhancedProfile = useUserStore((state) => state.enhancedProfile);
  const setEnhancedProfile = useUserStore((state) => state.setEnhancedProfile);
  
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: enhancedProfile?.name || '',
    email: '',
    location: enhancedProfile?.location || '',
    phone: '',
    bio: '',
  });

  useEffect(() => {
    if (!enhancedProfile) {
      navigate('/signin');
    }
  }, [enhancedProfile, navigate]);

  const handleLogout = async () => {
    console.log('=== Profile Page Logout Initiated ===');
    
    try {
      // Show confirmation and perform logout
      const success = await LogoutService.logoutWithConfirmation();
      
      if (success) {
        console.log('✓ Logout successful from Profile page, redirecting to signin');
        
        // Navigate to signin page
        navigate('/signin');
        
        // Force page reload to ensure complete state reset
        setTimeout(() => {
          console.log('🔄 Forcing page reload for complete state reset');
          window.location.reload();
        }, 500); // Increased delay to allow navigation to complete
      } else {
        console.log('ℹ Logout cancelled by user from Profile page');
      }
    } catch (error) {
      console.error('❌ Logout error in Profile page:', error);
      
      // Emergency fallback logout
      try {
        await LogoutService.emergencyLogout();
        navigate('/signin');
        window.location.reload();
      } catch (emergencyError) {
        console.error('❌ Emergency logout also failed in Profile page:', emergencyError);
        // Last resort - manual cleanup
        localStorage.clear();
        sessionStorage.clear();
        navigate('/signin');
        window.location.reload();
      }
    }
  };

  const handleSave = () => {
    // TODO: Implement API call to update profile
    if (enhancedProfile) {
      setEnhancedProfile({
        ...enhancedProfile,
        name: profileData.name,
        location: profileData.location,
      });
    }
    setIsEditing(false);
    alert('Profile updated successfully!');
  };

  if (!enhancedProfile) return null;

  return (
    <Layout>
      <div className="min-h-screen py-12 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Profile Header */}
          <NBCard className="p-8 mb-6">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center space-x-4">
                <div className="h-20 w-20 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center shadow-lg">
                  <User className="h-10 w-10 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-800">
                    {profileData.name}
                  </h1>
                  <p className="text-gray-600 flex items-center mt-1">
                    <Award className="h-4 w-4 mr-2" />
                    User
                  </p>
                </div>
              </div>
              <NBButton
                variant="secondary"
                onClick={handleLogout}
                className="flex items-center space-x-2"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </NBButton>
            </div>

            {profileData.bio && (
              <p className="text-gray-600 mb-4">{profileData.bio}</p>
            )}

            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                <span>Joined {new Date().toLocaleDateString()}</span>
              </div>
            </div>
          </NBCard>

          {/* Profile Information */}
          <NBCard className="p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                Profile Information
              </h2>
              {!isEditing ? (
                <NBButton onClick={() => setIsEditing(true)}>
                  Edit Profile
                </NBButton>
              ) : (
                <div className="flex space-x-2">
                  <NBButton onClick={handleSave}>Save Changes</NBButton>
                  <NBButton
                    variant="secondary"
                    onClick={() => setIsEditing(false)}
                  >
                    Cancel
                  </NBButton>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name */}
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <User className="h-4 w-4 mr-2" />
                  Name
                </label>
                <input
                  type="text"
                  value={profileData.name}
                  onChange={(e) =>
                    setProfileData({ ...profileData, name: e.target.value })
                  }
                  disabled={!isEditing}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                />
              </div>

              {/* Email */}
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <Mail className="h-4 w-4 mr-2" />
                  Email
                </label>
                <input
                  type="email"
                  value={profileData.email}
                  onChange={(e) =>
                    setProfileData({ ...profileData, email: e.target.value })
                  }
                  disabled={!isEditing}
                  placeholder="your.email@example.com"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <Mail className="h-4 w-4 mr-2" />
                  Phone
                </label>
                <input
                  type="tel"
                  value={profileData.phone}
                  onChange={(e) =>
                    setProfileData({ ...profileData, phone: e.target.value })
                  }
                  disabled={!isEditing}
                  placeholder="+1 (555) 000-0000"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                />
              </div>

              {/* Location */}
              <div className="md:col-span-2">
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="h-4 w-4 mr-2" />
                  Location
                </label>
                <input
                  type="text"
                  value={profileData.location}
                  onChange={(e) =>
                    setProfileData({ ...profileData, location: e.target.value })
                  }
                  disabled={!isEditing}
                  placeholder="City, Country"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                />
              </div>

              {/* Bio */}
              <div className="md:col-span-2">
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <User className="h-4 w-4 mr-2" />
                  Bio
                </label>
                <textarea
                  value={profileData.bio}
                  onChange={(e) =>
                    setProfileData({ ...profileData, bio: e.target.value })
                  }
                  disabled={!isEditing}
                  placeholder="Tell us about yourself..."
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500 resize-none"
                />
              </div>
            </div>
          </NBCard>

          {/* Security Section */}
          <NBCard className="p-8 mt-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Security Settings
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Lock className="h-5 w-5 text-gray-600" />
                  <div>
                    <p className="font-medium text-gray-800">Password</p>
                    <p className="text-sm text-gray-600">
                      Last changed 30 days ago
                    </p>
                  </div>
                </div>
                <NBButton variant="secondary" size="sm">
                  Change Password
                </NBButton>
              </div>
            </div>
          </NBCard>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
