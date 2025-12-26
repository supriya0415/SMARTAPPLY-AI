import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  BookOpen, 
  Clock, 
  DollarSign, 
  Star, 
  CheckCircle, 
  PlayCircle,
  Filter,
  Search,
  Trophy,
  Target,
  TrendingUp
} from 'lucide-react';
import { 
  LearningResource, 
  ResourceFilterOptions, 
  LearningResourcesResponse,
  ResourceRecommendation,
  LearningProgress
} from '@/lib/types/learningResourceTypes';
import { LearningResourcesService } from '@/lib/services/learningResourcesService';
import { ProgressTrackingService } from '@/lib/services/progressTrackingService';
import { useUserStore } from '@/lib/stores/userStore';

interface LearningResourcesPanelProps {
  domain?: string;
  subfield?: string;
  className?: string;
}

export const LearningResourcesPanel: React.FC<LearningResourcesPanelProps> = ({
  domain,
  subfield,
  className = ''
}) => {
  const { profile } = useUserStore();
  const [resources, setResources] = useState<LearningResource[]>([]);
  const [recommendations, setRecommendations] = useState<ResourceRecommendation[]>([]);
  const [progress, setProgress] = useState<LearningProgress | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<ResourceFilterOptions>({
    domain,
    subfield,
    cost: 'all',
    difficulty: [],
    type: []
  });
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    loadLearningResources();
  }, [domain, subfield, filters]);

  const loadLearningResources = async () => {
    try {
      setLoading(true);
      
      const response = await LearningResourcesService.getResources({
        ...filters,
        query: searchQuery,
        domain,
        subfield,
        sortBy: 'rating',
        sortOrder: 'desc'
      });

      setResources(response.resources);
      setProgress(response.progress);

      // Load recommendations if user profile exists
      if (profile) {
        const recs = await LearningResourcesService.getRecommendations(profile, domain, 5);
        setRecommendations(recs);
      }
    } catch (error) {
      console.error('Error loading learning resources:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleResourceComplete = async (resourceId: string, completed: boolean) => {
    try {
      await LearningResourcesService.updateResourceProgress({
        resourceId,
        completed,
        progress: completed ? 100 : 0,
        timeSpent: completed ? 30 : 0, // Placeholder time
        skillsPracticed: []
      });

      // Reload resources to reflect changes
      await loadLearningResources();
    } catch (error) {
      console.error('Error updating resource progress:', error);
    }
  };

  const handleStartResource = (resource: LearningResource) => {
    if (resource.url) {
      window.open(resource.url, '_blank');
    }
    
    // Mark as in progress
    handleResourceComplete(resource.id, false);
  };

  const filteredResources = resources.filter(resource => {
    if (activeTab === 'completed') return resource.completed;
    if (activeTab === 'in-progress') return resource.progress > 0 && !resource.completed;
    if (activeTab === 'recommended') return recommendations.some(rec => rec.resource.id === resource.id);
    return true;
  });

  const getResourceTypeIcon = (type: string) => {
    switch (type) {
      case 'course': return <BookOpen className="h-4 w-4" />;
      case 'video': return <PlayCircle className="h-4 w-4" />;
      case 'project': return <Target className="h-4 w-4" />;
      case 'certification': return <Trophy className="h-4 w-4" />;
      default: return <BookOpen className="h-4 w-4" />;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className={`space-y-4 ${className}`}>
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header with Progress Overview */}
      {progress && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Learning Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {progress.completedResources.length}
                </div>
                <div className="text-sm text-gray-600">Resources Completed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {progress.skillsAcquired.length}
                </div>
                <div className="text-sm text-gray-600">Skills Acquired</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {Math.floor(progress.timeSpent / 60)}h
                </div>
                <div className="text-sm text-gray-600">Time Invested</div>
              </div>
            </div>
            <div className="mt-4">
              <div className="flex justify-between text-sm mb-2">
                <span>Overall Progress</span>
                <span>{progress.overallProgress}%</span>
              </div>
              <Progress value={progress.overallProgress} className="h-2" />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search learning resources..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Select
                value={filters.cost}
                onValueChange={(value: string) => setFilters(prev => ({ ...prev, cost: value as 'all' | 'free' | 'paid' }))}
              >
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Cost" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="free">Free</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                </SelectContent>
              </Select>
              
              <Select
                value={filters.difficulty?.[0] || 'all'}
                onValueChange={(value: string) => setFilters(prev => ({ 
                  ...prev, 
                  difficulty: value === 'all' ? [] : [value]
                }))}
              >
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Difficulty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Resource Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">All Resources</TabsTrigger>
          <TabsTrigger value="recommended">Recommended</TabsTrigger>
          <TabsTrigger value="in-progress">In Progress</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          {/* Recommendations Section */}
          {activeTab === 'recommended' && recommendations.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-4">Personalized Recommendations</h3>
              <div className="grid gap-4">
                {recommendations.map((rec) => (
                  <Card key={rec.resource.id} className="border-blue-200 bg-blue-50">
                    <CardContent className="pt-4">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                          {getResourceTypeIcon(rec.resource.type)}
                          <h4 className="font-semibold">{rec.resource.title}</h4>
                          <Badge className="bg-blue-100 text-blue-800">
                            {Math.round(rec.score)}% match
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          {rec.resource.rating && (
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                              <span className="text-sm">{rec.resource.rating}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-3">{rec.resource.description}</p>
                      
                      <div className="flex flex-wrap gap-2 mb-3">
                        {rec.reasons.slice(0, 2).map((reason, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {reason}
                          </Badge>
                        ))}
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {rec.resource.duration}
                          </div>
                          <div className="flex items-center gap-1">
                            <DollarSign className="h-4 w-4" />
                            {rec.resource.cost === 0 ? 'Free' : `$${rec.resource.cost}`}
                          </div>
                        </div>
                        
                        <Button 
                          onClick={() => handleStartResource(rec.resource)}
                          size="sm"
                        >
                          Start Learning
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Resources Grid */}
          <div className="grid gap-4">
            {filteredResources.map((resource) => (
              <Card key={resource.id} className="hover:shadow-md transition-shadow">
                <CardContent className="pt-4">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      {getResourceTypeIcon(resource.type)}
                      <h4 className="font-semibold">{resource.title}</h4>
                      <Badge className={getDifficultyColor(resource.difficulty)}>
                        {resource.difficulty}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {resource.rating && (
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm">{resource.rating}</span>
                        </div>
                      )}
                      
                      {resource.completed && (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      )}
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-3">{resource.description}</p>
                  
                  {/* Skills Tags */}
                  <div className="flex flex-wrap gap-1 mb-3">
                    {resource.skills.slice(0, 4).map((skill) => (
                      <Badge key={skill} variant="secondary" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                    {resource.skills.length > 4 && (
                      <Badge variant="secondary" className="text-xs">
                        +{resource.skills.length - 4} more
                      </Badge>
                    )}
                  </div>
                  
                  {/* Progress Bar for In-Progress Resources */}
                  {resource.progress > 0 && !resource.completed && (
                    <div className="mb-3">
                      <div className="flex justify-between text-sm mb-1">
                        <span>Progress</span>
                        <span>{resource.progress}%</span>
                      </div>
                      <Progress value={resource.progress} className="h-2" />
                    </div>
                  )}
                  
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {resource.duration}
                      </div>
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-4 w-4" />
                        {resource.cost === 0 ? 'Free' : `$${resource.cost}`}
                      </div>
                      <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                        {resource.provider}
                      </span>
                    </div>
                    
                    <div className="flex gap-2">
                      {!resource.completed && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleResourceComplete(resource.id, true)}
                        >
                          Mark Complete
                        </Button>
                      )}
                      
                      <Button 
                        onClick={() => handleStartResource(resource)}
                        size="sm"
                        disabled={!resource.url}
                      >
                        {resource.completed ? 'Review' : 'Start'}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredResources.length === 0 && (
            <div className="text-center py-12">
              <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">
                No resources found
              </h3>
              <p className="text-gray-500">
                Try adjusting your filters or search terms to find learning resources.
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};