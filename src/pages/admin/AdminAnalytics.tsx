import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AdminService } from '../../lib/services/adminService';
import { NBCard } from '../../components/NBCard';
import { BarChart, TrendingUp, Users, FileText, Calendar } from 'lucide-react';
import { toast } from 'sonner';

export const AdminAnalytics = () => {
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

  const getMaxValue = (data: any[]) => {
    return Math.max(...data.map(d => d.count), 1);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 border-b">
        <div className="max-w-7xl mx-auto px-4 pt-24 pb-8">
          <h1 className="text-4xl font-bold mb-2 text-gray-800">Analytics Dashboard</h1>
          <p className="text-gray-600">Platform statistics and insights</p>
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex space-x-6">
            <Link to="/admin" className="py-4 px-2 border-b-2 border-transparent hover:border-gray-300 text-gray-600 hover:text-gray-900">
              Dashboard
            </Link>
            <Link to="/admin/users" className="py-4 px-2 border-b-2 border-transparent hover:border-gray-300 text-gray-600 hover:text-gray-900">
              Users
            </Link>
            <Link to="/admin/careers" className="py-4 px-2 border-b-2 border-transparent hover:border-gray-300 text-gray-600 hover:text-gray-900">
              Job Management
            </Link>
            <Link to="/admin/analytics" className="py-4 px-2 border-b-2 border-purple-600 text-purple-600 font-medium">
              Analytics
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 pt-16 pb-8">
        {loading ? (
          <div className="text-center py-12">
            <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading analytics...</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Key Metrics */}
            <div className="grid md:grid-cols-4 gap-6">
              <NBCard className="p-6 bg-gradient-to-br from-purple-50 to-purple-100">
                <Users className="w-8 h-8 text-purple-600 mb-2" />
                <div className="text-3xl font-bold text-purple-900">
                  {analytics?.totalUsers || 0}
                </div>
                <div className="text-sm text-purple-600">Total Users</div>
              </NBCard>

              <NBCard className="p-6 bg-gradient-to-br from-pink-50 to-pink-100">
                <FileText className="w-8 h-8 text-pink-600 mb-2" />
                <div className="text-3xl font-bold text-pink-900">
                  {analytics?.totalResumes || 0}
                </div>
                <div className="text-sm text-pink-600">Resumes Analyzed</div>
              </NBCard>

              <NBCard className="p-6 bg-gradient-to-br from-blue-50 to-blue-100">
                <TrendingUp className="w-8 h-8 text-blue-600 mb-2" />
                <div className="text-3xl font-bold text-blue-900">
                  {analytics?.usersThisWeek || 0}
                </div>
                <div className="text-sm text-blue-600">Users This Week</div>
              </NBCard>

              <NBCard className="p-6 bg-gradient-to-br from-green-50 to-green-100">
                <BarChart className="w-8 h-8 text-green-600 mb-2" />
                <div className="text-3xl font-bold text-green-900">
                  {analytics?.averageResumeScore || 0}%
                </div>
                <div className="text-sm text-green-600">Avg Resume Score</div>
              </NBCard>
            </div>

            {/* User Growth Chart */}
            <NBCard className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-foreground">User Growth (Last 30 Days)</h2>
                  <p className="text-sm text-muted-foreground">Daily sign-ups</p>
                </div>
                <Calendar className="w-6 h-6 text-muted-foreground" />
              </div>

              {analytics?.userGrowth && analytics.userGrowth.length > 0 ? (
                <div className="space-y-2">
                  {analytics.userGrowth.map((day: any, index: number) => {
                    const maxCount = getMaxValue(analytics.userGrowth);
                    const percentage = (day.count / maxCount) * 100;
                    
                    return (
                      <div key={index} className="flex items-center space-x-4">
                        <div className="w-24 text-sm text-gray-600 flex-shrink-0">
                          {new Date(day.date).toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric' 
                          })}
                        </div>
                        <div className="flex-1">
                          <div className="h-8 bg-gray-100 rounded-lg overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg transition-all duration-500 flex items-center justify-end px-3"
                              style={{ width: `${Math.max(percentage, 5)}%` }}
                            >
                              <span className="text-white text-sm font-medium">
                                {day.count}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No growth data available yet
                </div>
              )}
            </NBCard>

            {/* Popular Careers */}
            <NBCard className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-foreground">Most Popular Careers</h2>
                  <p className="text-sm text-muted-foreground">Top 10 career choices</p>
                </div>
                <BarChart className="w-6 h-6 text-muted-foreground" />
              </div>

              {analytics?.popularCareers && analytics.popularCareers.length > 0 ? (
                <div className="space-y-3">
                  {analytics.popularCareers.map((career: any, index: number) => {
                    const maxCount = getMaxValue(analytics.popularCareers);
                    const percentage = (career.count / maxCount) * 100;
                    const colors = [
                      'from-purple-500 to-purple-700',
                      'from-pink-500 to-pink-700',
                      'from-blue-500 to-blue-700',
                      'from-green-500 to-green-700',
                      'from-orange-500 to-orange-700',
                      'from-red-500 to-red-700',
                      'from-indigo-500 to-indigo-700',
                      'from-yellow-500 to-yellow-700',
                      'from-teal-500 to-teal-700',
                      'from-cyan-500 to-cyan-700',
                    ];
                    
                    return (
                      <div key={index} className="flex items-center space-x-4">
                        <div className={`w-10 h-10 bg-gradient-to-br ${colors[index % colors.length]} rounded-full flex items-center justify-center text-white font-bold flex-shrink-0`}>
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm font-medium text-foreground">
                              {career.name}
                            </span>
                            <span className="text-sm text-muted-foreground">
                              {career.count} users
                            </span>
                          </div>
                          <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className={`h-full bg-gradient-to-r ${colors[index % colors.length]} rounded-full transition-all duration-500`}
                              style={{ width: `${Math.max(percentage, 5)}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No career data available yet
                </div>
              )}
            </NBCard>
          </div>
        )}
      </div>
    </div>
  );
};

