import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AdminService } from '../../lib/services/adminService';
import { NBCard } from '../../components/NBCard';
import { NBButton } from '../../components/NBButton';
import { Users, FileText, BarChart, Briefcase, TrendingUp, Calendar } from 'lucide-react';
import { toast } from 'sonner';

export const AdminDashboard = () => {
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      const data = await AdminService.getAnalytics();
      setAnalytics(data);
    } catch (error) {
      toast.error('Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 border-b">
        <div className="max-w-7xl mx-auto px-4 pt-24 pb-8">
          <h1 className="text-4xl font-bold mb-2 text-gray-800">Admin Dashboard</h1>
          <p className="text-gray-600">SmartApply AI Management Panel</p>
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex space-x-6">
            <Link to="/admin" className="py-4 px-2 border-b-2 border-purple-600 text-purple-600 font-medium">
              Dashboard
            </Link>
            <Link to="/admin/users" className="py-4 px-2 border-b-2 border-transparent hover:border-gray-300 text-gray-600 hover:text-gray-900">
              Users
            </Link>
            <Link to="/admin/careers" className="py-4 px-2 border-b-2 border-transparent hover:border-gray-300 text-gray-600 hover:text-gray-900">
              Job Management
            </Link>
            <Link to="/admin/analytics" className="py-4 px-2 border-b-2 border-transparent hover:border-gray-300 text-gray-600 hover:text-gray-900">
              Analytics
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 pt-16 pb-8">
        {/* Stats Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          <NBCard className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <div className="flex items-center justify-between mb-4">
              <Users className="w-10 h-10 text-purple-600" />
              <span className="text-sm text-purple-600 font-medium">Total</span>
            </div>
            <div className="text-3xl font-bold text-purple-900">{analytics?.totalUsers || 0}</div>
            <div className="text-sm text-purple-600">Registered Users</div>
            <div className="mt-2 text-xs text-purple-500">
              +{analytics?.usersThisWeek || 0} this week
            </div>
          </NBCard>

          <NBCard className="p-6 bg-gradient-to-br from-pink-50 to-pink-100 border-pink-200">
            <div className="flex items-center justify-between mb-4">
              <FileText className="w-10 h-10 text-pink-600" />
              <span className="text-sm text-pink-600 font-medium">Resumes</span>
            </div>
            <div className="text-3xl font-bold text-pink-900">{analytics?.totalResumes || 0}</div>
            <div className="text-sm text-pink-600">Analyzed</div>
            <div className="mt-2 text-xs text-pink-500">
              Avg Score: {analytics?.averageResumeScore || 0}%
            </div>
          </NBCard>

          <NBCard className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <div className="flex items-center justify-between mb-4">
              <TrendingUp className="w-10 h-10 text-blue-600" />
              <span className="text-sm text-blue-600 font-medium">Today</span>
            </div>
            <div className="text-3xl font-bold text-blue-900">{analytics?.usersToday || 0}</div>
            <div className="text-sm text-blue-600">New Sign-ups</div>
          </NBCard>

          <NBCard className="p-6 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <div className="flex items-center justify-between mb-4">
              <Briefcase className="w-10 h-10 text-green-600" />
              <span className="text-sm text-green-600 font-medium">Top Career</span>
            </div>
            <div className="text-xl font-bold text-green-900 line-clamp-1">
              {analytics?.popularCareers?.[0]?.name || 'N/A'}
            </div>
            <div className="text-sm text-green-600">
              {analytics?.popularCareers?.[0]?.count || 0} users
            </div>
          </NBCard>
        </div>

        {/* Recent Activity Grid */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Popular Careers */}
          <NBCard className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-foreground">Popular Careers</h2>
            </div>
            <div className="space-y-4">
              {analytics?.popularCareers?.slice(0, 5).map((career: any, index: number) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {index + 1}
                    </div>
                    <span className="text-foreground font-medium">{career.name}</span>
                  </div>
                  <span className="text-muted-foreground">{career.count} users</span>
                </div>
              ))}
            </div>
            <Link to="/admin/analytics">
              <NBButton variant="secondary" className="w-full mt-4">
                View Full Analytics
              </NBButton>
            </Link>
          </NBCard>

          {/* Quick Actions */}
          <NBCard className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-foreground">Quick Actions</h2>
            </div>
            <div className="space-y-3">
              <Link to="/admin/users">
                <NBButton className="w-full bg-gradient-to-r from-purple-500 to-purple-700 text-white border-none hover:from-purple-600 hover:to-purple-800">
                  Manage Users
                </NBButton>
              </Link>
              <Link to="/admin/careers">
                <NBButton className="w-full bg-gradient-to-r from-pink-500 to-pink-700 text-white border-none hover:from-pink-600 hover:to-pink-800">
                  Manage Careers/Jobs
                </NBButton>
              </Link>
              <Link to="/admin/analytics">
                <NBButton className="w-full bg-gradient-to-r from-blue-500 to-blue-700 text-white border-none hover:from-blue-600 hover:to-blue-800">
                  View Analytics
                </NBButton>
              </Link>
              <Link to="/">
                <NBButton variant="secondary" className="w-full">
                  Back to Main Site
                </NBButton>
              </Link>
            </div>
          </NBCard>
        </div>
      </div>
    </div>
  );
};

