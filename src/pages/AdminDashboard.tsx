import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { NBCard } from '../components/NBCard';
import { NBButton } from '../components/NBButton';
import { LoadingState } from '../components/ui/LoadingState';
import { toast } from 'sonner';
import { 
  Users, 
  TrendingUp, 
  BookOpen, 
  Award,
  Plus,
  Edit,
  Trash2,
  BarChart3,
  Settings,
  ArrowLeft
} from 'lucide-react';
import { DepartmentService } from '../lib/services/departmentService';

interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  completedAssessments: number;
  popularRoles: Array<{ role: string; count: number }>;
  topSkillGaps: Array<{ skill: string; count: number }>;
  userGrowth: Array<{ month: string; users: number }>;
}

interface CareerDomain {
  id: string;
  name: string;
  description: string;
  subdepartments: Array<{
    id: string;
    name: string;
    jobCount: number;
  }>;
}

export const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'domains' | 'users'>('overview');
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [domains, setDomains] = useState<CareerDomain[]>([]);
  const [isAddingDomain, setIsAddingDomain] = useState(false);

  useEffect(() => {
    loadAdminData();
  }, []);

  const loadAdminData = async () => {
    setIsLoading(true);
    try {
      // Load mock admin statistics
      const mockStats: AdminStats = {
        totalUsers: 1247,
        activeUsers: 892,
        completedAssessments: 1089,
        popularRoles: [
          { role: 'Full Stack Developer', count: 234 },
          { role: 'Data Scientist', count: 189 },
          { role: 'UX Designer', count: 156 },
          { role: 'Product Manager', count: 134 },
          { role: 'Software Engineer', count: 123 }
        ],
        topSkillGaps: [
          { skill: 'System Design', count: 456 },
          { skill: 'Machine Learning', count: 389 },
          { skill: 'Cloud Computing', count: 345 },
          { skill: 'React', count: 298 },
          { skill: 'Python', count: 267 }
        ],
        userGrowth: [
          { month: 'Jan', users: 45 },
          { month: 'Feb', users: 67 },
          { month: 'Mar', users: 89 },
          { month: 'Apr', users: 123 },
          { month: 'May', users: 156 },
          { month: 'Jun', users: 189 }
        ]
      };

      // Load career domains from service
      const departments = DepartmentService.getDepartments();
      const domainData: CareerDomain[] = departments.map(dept => ({
        id: dept.id,
        name: dept.name,
        description: dept.description,
        subdepartments: dept.subdepartments.map(sub => ({
          id: sub.id,
          name: sub.name,
          jobCount: sub.relatedJobs.length
        }))
      }));

      setStats(mockStats);
      setDomains(domainData);
    } catch (error) {
      console.error('Error loading admin data:', error);
      toast.error('Failed to load admin data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddDomain = () => {
    setIsAddingDomain(true);
    // In a real implementation, this would open a modal or form
    toast.info('Add domain functionality would be implemented here');
    setIsAddingDomain(false);
  };

  const handleEditDomain = (domainId: string) => {
    toast.info(`Edit domain ${domainId} functionality would be implemented here`);
  };

  const handleDeleteDomain = (domainId: string) => {
    const confirmed = window.confirm('Are you sure you want to delete this domain? This action cannot be undone.');
    if (confirmed) {
      toast.success('Domain deleted successfully');
      // In a real implementation, this would call an API to delete the domain
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <LoadingState
          title="Loading Admin Dashboard"
          description="Fetching analytics and system data..."
          size="lg"
          variant="card"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 bg-gradient-to-br from-slate-50 to-blue-50/30">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <NBButton
                onClick={() => navigate('/dashboard')}
                variant="outline"
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </NBButton>
              
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Admin Dashboard
                </h1>
                <p className="text-gray-600 text-lg">
                  System analytics and management
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <NBButton
                variant="outline"
                className="flex items-center space-x-2"
              >
                <Settings className="w-4 h-4" />
                <span>Settings</span>
              </NBButton>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 mb-8 bg-gray-100 p-1 rounded-lg w-fit">
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'domains', label: 'Career Domains', icon: BookOpen },
            { id: 'users', label: 'User Management', icon: Users }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
                  activeTab === tab.id
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && stats && (
          <div className="space-y-8">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <NBCard className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Users</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalUsers.toLocaleString()}</p>
                  </div>
                  <Users className="w-8 h-8 text-blue-600" />
                </div>
              </NBCard>

              <NBCard className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Active Users</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.activeUsers.toLocaleString()}</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-green-600" />
                </div>
              </NBCard>

              <NBCard className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Assessments</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.completedAssessments.toLocaleString()}</p>
                  </div>
                  <Award className="w-8 h-8 text-purple-600" />
                </div>
              </NBCard>

              <NBCard className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Career Domains</p>
                    <p className="text-2xl font-bold text-gray-900">{domains.length}</p>
                  </div>
                  <BookOpen className="w-8 h-8 text-orange-600" />
                </div>
              </NBCard>
            </div>

            {/* Popular Roles and Skill Gaps */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <NBCard className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Most Popular Roles</h3>
                <div className="space-y-3">
                  {stats.popularRoles.map((role, index) => (
                    <div key={role.role} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <span className="text-sm font-medium text-gray-500">#{index + 1}</span>
                        <span className="text-sm text-gray-900">{role.role}</span>
                      </div>
                      <span className="text-sm font-medium text-blue-600">{role.count} users</span>
                    </div>
                  ))}
                </div>
              </NBCard>

              <NBCard className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Skill Gaps</h3>
                <div className="space-y-3">
                  {stats.topSkillGaps.map((skill, index) => (
                    <div key={skill.skill} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <span className="text-sm font-medium text-gray-500">#{index + 1}</span>
                        <span className="text-sm text-gray-900">{skill.skill}</span>
                      </div>
                      <span className="text-sm font-medium text-red-600">{skill.count} users need this</span>
                    </div>
                  ))}
                </div>
              </NBCard>
            </div>

            {/* User Growth Chart */}
            <NBCard className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">User Growth (Last 6 Months)</h3>
              <div className="flex items-end space-x-2 h-32">
                {stats.userGrowth.map((month) => (
                  <div key={month.month} className="flex flex-col items-center flex-1">
                    <div 
                      className="bg-blue-500 rounded-t w-full"
                      style={{ height: `${(month.users / 200) * 100}%` }}
                    />
                    <span className="text-xs text-gray-600 mt-2">{month.month}</span>
                    <span className="text-xs font-medium text-gray-900">{month.users}</span>
                  </div>
                ))}
              </div>
            </NBCard>
          </div>
        )}

        {/* Career Domains Tab */}
        {activeTab === 'domains' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Career Domains Management</h2>
              <NBButton
                onClick={handleAddDomain}
                disabled={isAddingDomain}
                className="flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Add Domain</span>
              </NBButton>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {domains.map((domain) => (
                <NBCard key={domain.id} className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {domain.name}
                      </h3>
                      <p className="text-sm text-gray-600 mb-3">
                        {domain.description}
                      </p>
                    </div>
                    <div className="flex space-x-1">
                      <button
                        onClick={() => handleEditDomain(domain.id)}
                        className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteDomain(domain.id)}
                        className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="text-sm font-medium text-gray-700">
                      Subdepartments ({domain.subdepartments.length})
                    </div>
                    {domain.subdepartments.slice(0, 3).map((sub) => (
                      <div key={sub.id} className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">{sub.name}</span>
                        <span className="text-gray-500">{sub.jobCount} jobs</span>
                      </div>
                    ))}
                    {domain.subdepartments.length > 3 && (
                      <div className="text-sm text-gray-500">
                        +{domain.subdepartments.length - 3} more
                      </div>
                    )}
                  </div>
                </NBCard>
              ))}
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">User Management</h2>
              <div className="flex space-x-2">
                <NBButton variant="outline">Export Users</NBButton>
                <NBButton>Send Notification</NBButton>
              </div>
            </div>

            <NBCard className="p-6">
              <div className="text-center py-12">
                <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  User Management Coming Soon
                </h3>
                <p className="text-gray-600 mb-4">
                  Advanced user management features will be available in the next update.
                </p>
                <div className="space-y-2 text-sm text-gray-500">
                  <p>• View and manage user accounts</p>
                  <p>• Send bulk notifications</p>
                  <p>• Export user data</p>
                  <p>• User activity analytics</p>
                </div>
              </div>
            </NBCard>
          </div>
        )}
      </div>
    </div>
  );
};