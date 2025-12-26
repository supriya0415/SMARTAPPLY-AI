import { Landing } from '@/pages/Landing'
import { Details } from '@/pages/Details'
import { Results } from '@/pages/Results'
import { CareerAssessment } from '@/pages/CareerAssessment'
import { CareerDashboard } from '@/pages/CareerDashboard'
import { CareerDetails } from '@/pages/CareerDetails'
import { CareerPathGenerator } from '@/pages/CareerPathGenerator'
import { LearningRoadmap } from '@/pages/LearningRoadmap'
import { LearningResourcesPage } from '@/pages/LearningResourcesPage'
import SignIn from '@/pages/SignIn'
import SignUp from '@/pages/SignUp'
import Profile from '@/pages/Profile'
import ProtectedRoute from '@/components/ProtectedRoute'
import { AdminRoute } from '@/components/AdminRoute'

// Admin Pages
import { AdminDashboard } from '@/pages/admin/AdminDashboard'
import { AdminUsers } from '@/pages/admin/AdminUsers'
import { AdminCareers } from '@/pages/admin/AdminCareers'
import { AdminAnalytics } from '@/pages/admin/AdminAnalytics'

import { AchievementsPage } from '@/pages/AchievementsPage'
import { ResumeUpload } from '@/pages/ResumeUpload'
import { ResumeAnalysisResults } from '@/pages/ResumeAnalysisResults'
import { ProgressDashboard } from '@/components/ProgressDashboard'
import PlatformLinksDemo from '@/pages/PlatformLinksDemo'
import { Route, Routes } from 'react-router-dom'

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/signin" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      
      {/* Admin Routes */}
      <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
      <Route path="/admin/users" element={<AdminRoute><AdminUsers /></AdminRoute>} />
      <Route path="/admin/careers" element={<AdminRoute><AdminCareers /></AdminRoute>} />
      <Route path="/admin/analytics" element={<AdminRoute><AdminAnalytics /></AdminRoute>} />
      
      <Route path="/details" element={<Details />} />
      <Route path="/assessment" element={<ProtectedRoute><CareerAssessment /></ProtectedRoute>} />
      <Route path="/dashboard" element={<ProtectedRoute requiresEnhancedProfile={true}><CareerDashboard /></ProtectedRoute>} />
      <Route path="/career-dashboard" element={<CareerDashboard />} />
      <Route path="/progress-dashboard" element={<ProtectedRoute requiresEnhancedProfile={true}><ProgressDashboard /></ProtectedRoute>} />
      <Route path="/career-details/:id" element={<CareerDetails />} />
      <Route path="/career-path-generator" element={<CareerPathGenerator />} />
      <Route path="/learning-roadmap" element={<LearningRoadmap />} />
      <Route path="/learning-resources" element={<ProtectedRoute requiresEnhancedProfile={true}><LearningResourcesPage /></ProtectedRoute>} />

      <Route path="/achievements" element={<ProtectedRoute><AchievementsPage /></ProtectedRoute>} />
      <Route path="/resume-upload" element={<ProtectedRoute><ResumeUpload /></ProtectedRoute>} />
      <Route path="/resume-analysis/:id" element={<ProtectedRoute><ResumeAnalysisResults /></ProtectedRoute>} />
      <Route path="/platform-links-demo" element={<PlatformLinksDemo />} />
      <Route path="/results" element={<Results />} />
      <Route path="*" element={<Landing />} />
    </Routes>
  )
}

export default AppRoutes
