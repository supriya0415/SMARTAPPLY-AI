import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ChevronRight, Briefcase, TrendingUp, DollarSign, X, LayoutDashboard } from 'lucide-react';
import { NBCard } from './NBCard';
import { NBButton } from './NBButton';
import { 
  UniversalCareerSearch, 
  CareerDomain, 
  CareerSubdomain, 
  CareerRole 
} from '../lib/data/universalCareerTaxonomy';
import { cn } from '../lib/utils';
import { useUserStore } from '../lib/stores/userStore';
import { toast } from 'sonner';

interface CareerDomainSearchProps {
  onRoleSelect?: (role: CareerRole, domain: CareerDomain, subdomain: CareerSubdomain) => void;
}

export const CareerDomainSearch: React.FC<CareerDomainSearchProps> = ({ onRoleSelect }) => {
  const navigate = useNavigate();
  const { profile, enhancedProfile } = useUserStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDomain, setSelectedDomain] = useState<CareerDomain | null>(null);
  const [selectedSubdomain, setSelectedSubdomain] = useState<CareerSubdomain | null>(null);
  const [searchResults, setSearchResults] = useState<CareerRole[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const allDomains = UniversalCareerSearch.getAllDomains();
  const totalRolesCount = UniversalCareerSearch.getTotalRolesCount();

  // Check if user already has a completed profile - multiple ways to detect
  const hasCompletedAssessment = Boolean(
    (enhancedProfile && enhancedProfile.careerInterest) ||
    (enhancedProfile && enhancedProfile.careerRecommendations && enhancedProfile.careerRecommendations.length > 0) ||
    (profile && profile.careerInterest)
  );

  // Debug logging
  useEffect(() => {
    console.log('🔍 Career Assessment Check:');
    console.log('  - profile:', profile);
    console.log('  - enhancedProfile:', enhancedProfile);
    console.log('  - hasCompletedAssessment:', hasCompletedAssessment);
    console.log('  - Button should show:', hasCompletedAssessment ? '✅ YES' : '❌ NO');
    
    // Also check localStorage directly
    const storedData = localStorage.getItem('career-mentor-store');
    if (storedData) {
      try {
        const parsed = JSON.parse(storedData);
        console.log('📦 LocalStorage data:', parsed);
        console.log('  - Has enhancedProfile in storage:', !!parsed.enhancedProfile);
        console.log('  - Career interest in storage:', parsed.enhancedProfile?.careerInterest);
      } catch (e) {
        console.error('Failed to parse localStorage:', e);
      }
    } else {
      console.log('❌ NO DATA in localStorage');
    }
  }, [profile, enhancedProfile, hasCompletedAssessment]);

  const handleGoToDashboard = () => {
    console.log('🎯 Navigating to dashboard...');
    toast.success('Taking you to your dashboard!');
    navigate('/dashboard');
  };

  // Handle search
  useEffect(() => {
    if (searchQuery.trim().length >= 2) {
      setIsSearching(true);
      const results = UniversalCareerSearch.searchRoles(searchQuery);
      setSearchResults(results);
    } else {
      setIsSearching(false);
      setSearchResults([]);
    }
  }, [searchQuery]);

  const handleDomainSelect = (domain: CareerDomain) => {
    setSelectedDomain(domain);
    setSelectedSubdomain(null);
    setSearchQuery('');
    setIsSearching(false);
  };

  const handleSubdomainSelect = (subdomain: CareerSubdomain) => {
    setSelectedSubdomain(subdomain);
  };

  const handleRoleSelect = (role: CareerRole) => {
    // Find the domain and subdomain for this role
    let foundDomain: CareerDomain | null = null;
    let foundSubdomain: CareerSubdomain | null = null;

    allDomains.forEach(domain => {
      domain.subdomains.forEach(subdomain => {
        if (subdomain.roles.some(r => r.id === role.id)) {
          foundDomain = domain;
          foundSubdomain = subdomain;
        }
      });
    });

    if (foundDomain && foundSubdomain) {
      const careerData = {
        ...role,
        department: (foundDomain as CareerDomain).name,
        departmentId: (foundDomain as CareerDomain).id,
        subdepartment: (foundSubdomain as CareerSubdomain).name,
        subdepartmentId: (foundSubdomain as CareerSubdomain).id
      };

      // Store in localStorage for the assessment form
      localStorage.setItem('selectedCareer', JSON.stringify(careerData));

      // Call the callback if provided
      if (onRoleSelect) {
        onRoleSelect(role, foundDomain, foundSubdomain);
      }

      // Navigate to assessment details page
      navigate('/details');
    }
  };

  const handleBack = () => {
    if (selectedSubdomain) {
      setSelectedSubdomain(null);
    } else if (selectedDomain) {
      setSelectedDomain(null);
    } else {
      navigate('/');
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setIsSearching(false);
    setSearchResults([]);
  };

  // Render search results
  if (isSearching && searchResults.length > 0) {
  return (
      <div 
        className="min-h-screen pt-20 pb-12"
        style={{
          backgroundImage: "url('/bg-image.svg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed'
        }}
      >
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Dashboard Button for Returning Users */}
          {hasCompletedAssessment && (
            <div className="mb-6 flex justify-end">
              <NBButton
                onClick={handleGoToDashboard}
                className="bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700 shadow-lg flex items-center gap-2"
              >
                <LayoutDashboard className="w-4 h-4" />
                Go to My Dashboard
              </NBButton>
      </div>
          )}

          <NBCard className="p-8 animate-slide-up" variant="glass">
            <button
              onClick={clearSearch}
              className="mb-6 text-sm text-gray-600 hover:text-gray-900 flex items-center"
            >
              ← Clear search
            </button>

            <div className="mb-8">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search careers by title, skills, or domain..."
                  className="w-full pl-12 pr-12 py-4 text-lg border-2 border-gray-300 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                  autoFocus
                />
                {searchQuery && (
                  <button
                    onClick={clearSearch}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
        </div>

            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Found {searchResults.length} careers matching "{searchQuery}"
              </h2>
              <p className="text-gray-600">Click on any career to start your personalized assessment</p>
        </div>

            <div className="grid gap-4">
              {searchResults.map((role) => (
                <NBCard
                  key={role.id}
                  onClick={() => handleRoleSelect(role)}
                  interactive
                  className="p-6 hover:shadow-lg transition-all"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">{role.title}</h3>
                      <p className="text-gray-600 mb-4">{role.description}</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div className="flex items-center text-sm">
                          <DollarSign className="w-4 h-4 text-green-600 mr-2" />
                          <span className="text-gray-700">{role.averageSalary}</span>
                        </div>
                        <div className="flex items-center text-sm">
                          <TrendingUp className="w-4 h-4 text-blue-600 mr-2" />
                          <span className="text-gray-700">{role.growthOutlook}</span>
                        </div>
                        <div className="flex items-center text-sm">
                          <Briefcase className="w-4 h-4 text-purple-600 mr-2" />
                          <span className="text-gray-700">{role.experienceLevel}</span>
        </div>
      </div>

                      <div className="flex flex-wrap gap-2">
                        {role.keySkills.slice(0, 5).map((skill) => (
                          <span
                            key={skill}
                            className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium"
                          >
                            {skill}
                          </span>
                        ))}
                        {role.keySkills.length > 5 && (
                          <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">
                            +{role.keySkills.length - 5} more
                          </span>
                        )}
                      </div>
                    </div>
                    <ChevronRight className="w-6 h-6 text-gray-400 ml-4 flex-shrink-0" />
                  </div>
                </NBCard>
              ))}
            </div>
          </NBCard>
          </div>
          </div>
    );
  }

  // Render subdomain roles
  if (selectedSubdomain) {
    return (
      <div 
        className="min-h-screen pt-20 pb-12"
        style={{
          backgroundImage: "url('/bg-image.svg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed'
        }}
      >
        <div className="max-w-7xl mx-auto px-4 py-8">
          <NBCard className="p-8 animate-slide-up" variant="glass">
            <button
              onClick={handleBack}
              className="mb-6 text-sm text-gray-600 hover:text-gray-900 flex items-center"
            >
              ← Back to {selectedDomain?.name}
            </button>

            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                {selectedSubdomain.name}
              </h1>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                {selectedSubdomain.description}
              </p>
              <p className="text-sm text-gray-500 mt-2">
                {selectedSubdomain.roles.length} career paths available
              </p>
          </div>

            <div className="grid gap-4">
              {selectedSubdomain.roles.map((role) => (
                <NBCard
                  key={role.id}
                  onClick={() => handleRoleSelect(role)}
                  interactive
                  className="p-6 hover:shadow-lg transition-all"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">{role.title}</h3>
                      <p className="text-gray-600 mb-4">{role.description}</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div className="flex items-center text-sm">
                          <DollarSign className="w-4 h-4 text-green-600 mr-2" />
                          <span className="text-gray-700">{role.averageSalary}</span>
                        </div>
                        <div className="flex items-center text-sm">
                          <TrendingUp className="w-4 h-4 text-blue-600 mr-2" />
                          <span className="text-gray-700">{role.growthOutlook}</span>
                        </div>
                        <div className="flex items-center text-sm">
                          <Briefcase className="w-4 h-4 text-purple-600 mr-2" />
                          <span className="text-gray-700">{role.experienceLevel}</span>
                        </div>
                  </div>

                      <div className="flex flex-wrap gap-2">
                        {role.keySkills.map((skill) => (
                          <span
                            key={skill}
                            className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                    <ChevronRight className="w-6 h-6 text-gray-400 ml-4 flex-shrink-0" />
                </div>
                </NBCard>
              ))}
            </div>
          </NBCard>
            </div>
          </div>
    );
  }

  // Render domain subdomains
  if (selectedDomain) {
    return (
      <div 
        className="min-h-screen pt-20 pb-12"
        style={{
          backgroundImage: "url('/bg-image.svg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed'
        }}
      >
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Dashboard Button for Returning Users */}
          {hasCompletedAssessment && (
            <div className="mb-6">
              <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-green-100 p-2 rounded-full">
                    <LayoutDashboard className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-green-900">Welcome Back!</h3>
                    <p className="text-sm text-green-700">You've already completed your career assessment</p>
                  </div>
                </div>
                <NBButton
                  onClick={handleGoToDashboard}
                  className="bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700 shadow-lg flex items-center gap-2 px-6 py-3"
                >
                  <LayoutDashboard className="w-5 h-5" />
                  Go to My Dashboard
                </NBButton>
            </div>
          </div>
        )}

          <NBCard className="p-8 animate-slide-up" variant="glass">
                    <button
              onClick={handleBack}
              className="mb-6 text-sm text-gray-600 hover:text-gray-900 flex items-center"
            >
              ← Back to all domains
                    </button>

            <div className="text-center mb-8">
              <div className="text-6xl mb-4">{selectedDomain.icon}</div>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                {selectedDomain.name}
              </h1>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                {selectedDomain.description}
              </p>
              <p className="text-sm text-gray-500 mt-2">
                {selectedDomain.subdomains.length} specializations available
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {selectedDomain.subdomains.map((subdomain, index) => (
                <NBCard
                  key={subdomain.id}
                  onClick={() => handleSubdomainSelect(subdomain)}
                  interactive
                  className={cn(
                    'p-6 text-left animate-slide-up',
                    `animate-stagger-${Math.min(index + 1, 4)}`
                  )}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold text-gray-900">{subdomain.name}</h3>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </div>
                  <p className="text-gray-600 mb-4">{subdomain.description}</p>
                  <div className="flex items-center space-x-2 text-primary">
                    <Briefcase className="w-4 h-4" />
                    <span className="text-sm font-medium">
                      {subdomain.roles.length} career paths
                    </span>
                  </div>
                </NBCard>
                  ))}
                </div>
          </NBCard>
                </div>
              </div>
    );
  }

  // Render all domains with search
  return (
    <div 
      className="min-h-screen pt-20 pb-12"
      style={{
        backgroundImage: "url('/bg-image.svg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed'
      }}
    >
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Dashboard Button for Returning Users */}
        {hasCompletedAssessment ? (
          <div className="mb-6">
            <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-green-100 p-2 rounded-full">
                  <LayoutDashboard className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-green-900">Welcome Back!</h3>
                  <p className="text-sm text-green-700">You've already completed your career assessment</p>
                </div>
              </div>
              <NBButton
                onClick={handleGoToDashboard}
                className="bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700 shadow-lg flex items-center gap-2 px-6 py-3"
              >
                <LayoutDashboard className="w-5 h-5" />
                Go to My Dashboard
              </NBButton>
            </div>
          </div>
        ) : (
          <div className="mb-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-700">
              💡 <strong>New here?</strong> Select a career below to get started with your personalized assessment
              </div>
          </div>
        )}

        <NBCard className="p-8 animate-slide-up" variant="glass">
          <div className="text-center mb-8">
            <h1 className="text-5xl font-bold text-gray-900 mb-4">
              Career Discovery
            </h1>
            <p className="text-gray-600 text-lg max-w-3xl mx-auto mb-6">
              Explore {totalRolesCount}+ career paths across all industries. Search by role, skill, or browse by domain to find your perfect career match.
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto mb-8">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search careers by title, skills, or domain (e.g., Frontend Developer, Python, AI)..."
                  className="w-full pl-12 pr-4 py-4 text-lg border-2 border-gray-300 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all shadow-sm"
            />
          </div>
              <p className="text-sm text-gray-500 mt-2">
                Or browse {allDomains.length} career domains below
              </p>
              {/* Manual dashboard link for debugging */}
              <div className="mt-4 text-xs text-gray-500">
                Already completed? <button onClick={handleGoToDashboard} className="text-blue-600 hover:underline">Go to Dashboard</button>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {allDomains.map((domain, index) => {
              const totalRoles = domain.subdomains.reduce((acc, sub) => acc + sub.roles.length, 0);
              
              return (
                <NBCard
                  key={domain.id}
                  onClick={() => handleDomainSelect(domain)}
                  interactive
                  className={cn(
                    'p-6 text-center animate-slide-up hover:scale-105 transition-transform',
                    `animate-stagger-${Math.min(index + 1, 4)}`
                  )}
                >
                  <div className="text-5xl mb-4">{domain.icon}</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{domain.name}</h3>
                  <p className="text-gray-600 text-sm mb-4">{domain.description}</p>
                  <div className="flex items-center justify-center space-x-4 text-xs text-gray-500">
                    <div className="flex items-center">
                      <Briefcase className="w-3 h-3 mr-1" />
                      <span>{domain.subdomains.length} specializations</span>
                    </div>
                    <div>
                      <span>{totalRoles} roles</span>
              </div>
            </div>
                </NBCard>
              );
            })}
          </div>
        </NBCard>
        </div>
    </div>
  );
};
