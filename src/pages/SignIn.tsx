import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Layout } from '@/components/Layout'
import { NBCard } from '@/components/NBCard'
import { NBButton } from '@/components/NBButton'
import { BGPattern } from '@/components/ui/bg-pattern'
import { useUserStore } from '@/lib/stores/userStore'
import { EnhancedProfileService } from '@/lib/services/enhancedProfileService'
import { AuthService } from '@/lib/services/authService'
import { debugLogger } from '@/lib/utils/debugLogger'

const SignIn: React.FC = () => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()
    const { enhancedProfile, setEnhancedProfile } = useUserStore()

    // Force reload enhanced profile from localStorage on component mount
    useEffect(() => {
        debugLogger.log('SignIn component mounted', {
            component: 'SignIn',
            action: 'component_mount',
            metadata: { hasEnhancedProfile: !!enhancedProfile }
        });
        
        // Force reload from localStorage to ensure we have the latest data
        try {
            const storedData = localStorage.getItem('career-mentor-store')
            if (storedData) {
                const parsed = JSON.parse(storedData)
                if (parsed.enhancedProfile && !enhancedProfile) {
                    debugLogger.log('Found enhanced profile in localStorage, loading into store', {
                        component: 'SignIn',
                        action: 'profile_reload',
                        metadata: { profileId: parsed.enhancedProfile?.id }
                    });
                    setEnhancedProfile(parsed.enhancedProfile)
                }
            }
        } catch (error) {
            debugLogger.error('Error loading enhanced profile from localStorage', error as Error, {
                component: 'SignIn',
                action: 'profile_reload'
            });
        }
    }, [])

    const submit = async (e: React.FormEvent) => {
        e.preventDefault()
        
        setLoading(true)
        
        try {
            // Use AuthService for login (Requirements 1.2, 1.3)
            const result = await AuthService.login({ username, password });
            
            if (!result.success) {
                return; // Error handling is done in AuthService
            }
            
            // Check if user is admin IMMEDIATELY from the login result
            if (result.user?.role === 'admin') {
                console.log('✅ ADMIN DETECTED from login response! Redirecting to /admin');
                debugLogger.logNavigation(window.location.pathname, '/admin', 'Admin user detected');
                navigate('/admin');
                return;
            }
            
            // Fetch enhanced profile from database after authentication
            const checkEnhancedProfile = async () => {
                
                debugLogger.log('Enhanced profile detection process started', {
                    component: 'SignIn',
                    action: 'profile_detection_start'
                });
                
                // Function to check if a profile is complete
                const isProfileComplete = (profile: any) => {
                    if (!profile) return false
                    
                    // NEW: Less strict check - only look for actual career data, not gamification fields
                    // A complete profile has EITHER:
                    // 1. Career recommendations (generated roadmap)
                    // 2. Career interest (at minimum)
                    const hasCareerRecommendations = !!(
                        profile.careerRecommendations && 
                        profile.careerRecommendations.length > 0
                    )
                    
                    const hasCareerInterest = !!(
                        profile.careerInterest && 
                        profile.careerInterest.trim().length > 0
                    )
                    
                    // Profile is complete if it has recommendations OR at least a career interest
                    return hasCareerRecommendations || hasCareerInterest
                }
                
                let hasEnhancedProfile = false
                let profileData = null
                
                try {
                    // First, try to fetch enhanced profile from database
                    debugLogger.log('Fetching enhanced profile from database', {
                        component: 'SignIn',
                        action: 'profile_fetch_db'
                    });
                    const databaseProfile = await EnhancedProfileService.loadEnhancedProfile()
                    
                    if (databaseProfile && isProfileComplete(databaseProfile)) {
                        debugLogger.log('Complete enhanced profile found in database', {
                            component: 'SignIn',
                            action: 'profile_found_db',
                            metadata: { profileName: databaseProfile.name }
                        });
                        hasEnhancedProfile = true
                        profileData = databaseProfile
                        
                        // Load into store
                        setEnhancedProfile(databaseProfile)
                        debugLogger.log('Enhanced profile loaded into store from database', {
                            component: 'SignIn',
                            action: 'profile_loaded_store'
                        });
                    } else if (databaseProfile) {
                        debugLogger.warn('Enhanced profile found in database but incomplete', {
                            component: 'SignIn',
                            action: 'profile_incomplete_db',
                            metadata: {
                                hasCareerInterest: !!databaseProfile.careerInterest,
                                careerInterest: databaseProfile.careerInterest,
                                hasRecommendations: !!databaseProfile.careerRecommendations,
                                recommendationsCount: databaseProfile.careerRecommendations?.length || 0
                            }
                        });
                    } else {
                        debugLogger.log('No enhanced profile found in database', {
                            component: 'SignIn',
                            action: 'profile_not_found_db'
                        });
                    }
                } catch (error) {
                    debugLogger.error('Error fetching enhanced profile from database', error as Error, {
                        component: 'SignIn',
                        action: 'profile_fetch_db'
                    });
                    
                    // Fallback to localStorage check
                    debugLogger.log('Falling back to localStorage check', {
                        component: 'SignIn',
                        action: 'profile_fallback_localStorage'
                    });
                    const storedProfile = localStorage.getItem('career-mentor-store')
                    
                    if (storedProfile) {
                        try {
                            const parsed = JSON.parse(storedProfile)
                            const enhancedProfileData = parsed?.enhancedProfile
                            
                            hasEnhancedProfile = isProfileComplete(enhancedProfileData)
                            profileData = enhancedProfileData
                            
                            if (hasEnhancedProfile) {
                                debugLogger.log('Complete enhanced profile found in localStorage', {
                                    component: 'SignIn',
                                    action: 'profile_found_localStorage',
                                    metadata: { profileName: profileData?.name }
                                });
                                // Load into store
                                setEnhancedProfile(enhancedProfileData)
                            } else {
                                debugLogger.log('Enhanced profile incomplete in localStorage', {
                                    component: 'SignIn',
                                    action: 'profile_incomplete_localStorage'
                                });
                            }
                        } catch (parseError) {
                            debugLogger.error('Error parsing localStorage data', parseError as Error, {
                                component: 'SignIn',
                                action: 'profile_parse_localStorage'
                            });
                            hasEnhancedProfile = false
                        }
                    }
                }
                
                // Also check Zustand store as final fallback
                if (!hasEnhancedProfile && enhancedProfile) {
                    debugLogger.log('Checking Zustand store as final fallback', {
                        component: 'SignIn',
                        action: 'profile_fallback_zustand'
                    });
                    hasEnhancedProfile = isProfileComplete(enhancedProfile)
                    
                    if (hasEnhancedProfile) {
                        debugLogger.log('Complete enhanced profile found in Zustand store', {
                            component: 'SignIn',
                            action: 'profile_found_zustand',
                            metadata: { profileName: enhancedProfile?.name }
                        });
                        profileData = enhancedProfile
                    }
                }
                
                // Make routing decision based on enhanced profile existence
                debugLogger.logProfileDetection(hasEnhancedProfile, profileData);
                
                if (hasEnhancedProfile) {
                    debugLogger.logNavigation(window.location.pathname, '/dashboard', 'Enhanced profile detected - Requirements 4.3, 4.5');
                    navigate('/dashboard')
                } else {
                    debugLogger.logNavigation(window.location.pathname, '/assessment', 'No enhanced profile - Requirements 4.3, 4.5');
                    navigate('/assessment')
                }
            }
            
            // Small delay to ensure localStorage is updated, then check profile
            setTimeout(checkEnhancedProfile, 100)
        } catch (error) {
            debugLogger.error('Sign in process failed', error as Error, {
                component: 'SignIn',
                action: 'signin_error'
            });
        } finally {
            setLoading(false)
            debugLogger.log('Authentication process complete', {
                component: 'SignIn',
                action: 'auth_complete'
            });
        }
    }

    return (
        <Layout showNavbar={false} showFooter={false}>
            <div className="min-h-screen light-rays-bg relative overflow-hidden">
                <BGPattern variant="grid" mask="fade-edges" size={40} fill="rgba(139, 92, 246, 0.06)" />
                <BGPattern variant="dots" mask="fade-center" size={60} fill="rgba(34, 197, 94, 0.03)" />
                <div className="min-h-screen flex items-center justify-center">
                    <NBCard className="w-full max-w-lg p-8">
                        <div className="mb-6 text-center">
                            <h2 className="text-3xl font-bold" style={{ fontFamily: 'Playfair Display, serif' }}>Welcome back</h2>
                            <p className="text-sm text-muted-foreground">Sign in to continue to SmartApply AI</p>
                        </div>

                        <form onSubmit={submit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium">Username</label>
                                <input required value={username} onChange={(e) => setUsername(e.target.value)} className="w-full mt-1 px-3 py-2 border rounded-md" />
                            </div>

                            <div>
                                <label className="block text-sm font-medium">Password</label>
                                <input required type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full mt-1 px-3 py-2 border rounded-md" />
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="text-sm">
                                    <Link to="/signup" className="text-primary hover:underline">Create account</Link>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <NBButton type="submit" className="w-full" disabled={loading}>{loading ? 'Signing in...' : 'Sign In'}</NBButton>
                                

                            </div>
                        </form>
                    </NBCard>
                </div>
            </div>
        </Layout>
    )
}

export default SignIn

