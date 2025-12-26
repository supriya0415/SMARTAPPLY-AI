import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { 
  CheckCircle2, 
  Circle, 
  Clock, 
  Target, 
  BookOpen, 
  Code, 
  Trophy,
  AlertCircle,
  ChevronDown,
  ChevronRight,
  Plus
} from 'lucide-react';
import { 
  LearningChecklist as ChecklistType, 
  ChecklistItem,
  ProgressStats
} from '@/lib/services/progressTrackingService';
import { ProgressTrackingService } from '@/lib/services/progressTrackingService';

interface LearningChecklistProps {
  domain: string;
  subfield?: string;
  targetRole: string;
  userId: string;
  className?: string;
}

export const LearningChecklist: React.FC<LearningChecklistProps> = ({
  domain,
  subfield,
  targetRole,
  userId,
  className = ''
}) => {
  const [checklist, setChecklist] = useState<ChecklistType | null>(null);
  const [progressStats, setProgressStats] = useState<ProgressStats | null>(null);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrCreateChecklist();
    loadProgressStats();
  }, [domain, subfield, targetRole, userId]);

  const loadOrCreateChecklist = async () => {
    try {
      setLoading(true);
      
      // Try to find existing checklist
      const existingChecklists = ProgressTrackingService.getUserChecklists(userId, domain);
      let userChecklist = existingChecklists.find(c => 
        c.domain === domain && 
        c.subfield === subfield && 
        c.targetRole === targetRole
      );

      // Create new checklist if none exists
      if (!userChecklist) {
        userChecklist = ProgressTrackingService.createLearningChecklist(
          domain, 
          subfield || '', 
          targetRole
        );
      }

      setChecklist(userChecklist);
    } catch (error) {
      console.error('Error loading checklist:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadProgressStats = async () => {
    try {
      const stats = await ProgressTrackingService.getProgressStats(userId, domain);
      setProgressStats(stats);
    } catch (error) {
      console.error('Error loading progress stats:', error);
    }
  };

  const handleItemToggle = (itemId: string, completed: boolean) => {
    if (!checklist) return;

    try {
      const updatedChecklist = ProgressTrackingService.updateChecklistItem(
        checklist.id,
        itemId,
        { 
          completed,
          progress: completed ? 100 : 0,
          completedAt: completed ? new Date() : undefined
        }
      );

      setChecklist(updatedChecklist);
      
      // Reload progress stats to reflect changes
      loadProgressStats();
    } catch (error) {
      console.error('Error updating checklist item:', error);
    }
  };

  const handleItemProgressUpdate = (itemId: string, progress: number) => {
    if (!checklist) return;

    try {
      const updatedChecklist = ProgressTrackingService.updateChecklistItem(
        checklist.id,
        itemId,
        { progress }
      );

      setChecklist(updatedChecklist);
    } catch (error) {
      console.error('Error updating item progress:', error);
    }
  };

  const handleItemNotesUpdate = (itemId: string, notes: string) => {
    if (!checklist) return;

    try {
      const updatedChecklist = ProgressTrackingService.updateChecklistItem(
        checklist.id,
        itemId,
        { notes }
      );

      setChecklist(updatedChecklist);
    } catch (error) {
      console.error('Error updating item notes:', error);
    }
  };

  const toggleItemExpansion = (itemId: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(itemId)) {
      newExpanded.delete(itemId);
    } else {
      newExpanded.add(itemId);
    }
    setExpandedItems(newExpanded);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'skill': return <Target className="h-4 w-4" />;
      case 'resource': return <BookOpen className="h-4 w-4" />;
      case 'project': return <Code className="h-4 w-4" />;
      case 'milestone': return <Trophy className="h-4 w-4" />;
      default: return <Circle className="h-4 w-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'important': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'nice-to-have': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getCompletionStats = () => {
    if (!checklist) return { completed: 0, total: 0, percentage: 0 };
    
    const completed = checklist.items.filter(item => item.completed).length;
    const total = checklist.items.length;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    
    return { completed, total, percentage };
  };

  const groupItemsByCategory = () => {
    if (!checklist) return {};
    
    return checklist.items.reduce((groups, item) => {
      const category = item.category;
      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category].push(item);
      return groups;
    }, {} as Record<string, ChecklistItem[]>);
  };

  if (loading) {
    return (
      <div className={`space-y-4 ${className}`}>
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!checklist) {
    return (
      <div className={`text-center py-8 ${className}`}>
        <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-600 mb-2">
          Unable to load checklist
        </h3>
        <p className="text-gray-500">
          There was an error loading your learning checklist. Please try again.
        </p>
      </div>
    );
  }

  const stats = getCompletionStats();
  const groupedItems = groupItemsByCategory();

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header with Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5" />
              {checklist.title}
            </div>
            <Badge variant="outline" className="text-sm">
              {stats.completed}/{stats.total} Complete
            </Badge>
          </CardTitle>
          <CardDescription>
            {checklist.description}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Overall Progress */}
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Overall Progress</span>
                <span>{stats.percentage}%</span>
              </div>
              <Progress value={stats.percentage} className="h-3" />
            </div>

            {/* Quick Stats */}
            {progressStats && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t">
                <div className="text-center">
                  <div className="text-lg font-semibold text-blue-600">
                    {progressStats.totalResourcesCompleted}
                  </div>
                  <div className="text-xs text-gray-600">Resources</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold text-green-600">
                    {progressStats.skillsAcquired}
                  </div>
                  <div className="text-xs text-gray-600">Skills</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold text-purple-600">
                    {Math.floor(progressStats.totalTimeSpent / 60)}h
                  </div>
                  <div className="text-xs text-gray-600">Time Spent</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold text-orange-600">
                    {progressStats.currentStreak}
                  </div>
                  <div className="text-xs text-gray-600">Day Streak</div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Checklist Items by Category */}
      {Object.entries(groupedItems).map(([category, items]) => (
        <Card key={category}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              {getCategoryIcon(category)}
              {category.charAt(0).toUpperCase() + category.slice(1)}s
              <Badge variant="secondary" className="ml-auto">
                {items.filter(item => item.completed).length}/{items.length}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="border rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    {/* Checkbox */}
                    <Checkbox
                      checked={item.completed}
                      onCheckedChange={(checked: boolean) => 
                        handleItemToggle(item.id, checked)
                      }
                      className="mt-1"
                    />

                    {/* Item Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex-1">
                          <h4 className={`font-medium ${item.completed ? 'line-through text-gray-500' : ''}`}>
                            {item.title}
                          </h4>
                          {item.description && (
                            <p className="text-sm text-gray-600 mt-1">
                              {item.description}
                            </p>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Badge className={getPriorityColor(item.priority)}>
                            {item.priority}
                          </Badge>
                          
                          {item.estimatedTime && (
                            <div className="flex items-center gap-1 text-xs text-gray-500">
                              <Clock className="h-3 w-3" />
                              {item.estimatedTime}
                            </div>
                          )}
                          
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleItemExpansion(item.id)}
                          >
                            {expandedItems.has(item.id) ? (
                              <ChevronDown className="h-4 w-4" />
                            ) : (
                              <ChevronRight className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </div>

                      {/* Progress Bar for Partial Completion */}
                      {item.progress > 0 && item.progress < 100 && (
                        <div className="mb-3">
                          <div className="flex justify-between text-xs mb-1">
                            <span>Progress</span>
                            <span>{item.progress}%</span>
                          </div>
                          <Progress value={item.progress} className="h-2" />
                        </div>
                      )}

                      {/* Dependencies */}
                      {item.dependencies && item.dependencies.length > 0 && (
                        <div className="mb-2">
                          <div className="text-xs text-gray-500 mb-1">Dependencies:</div>
                          <div className="flex flex-wrap gap-1">
                            {item.dependencies.map((depId) => {
                              const depItem = checklist.items.find(i => i.id === depId);
                              return depItem ? (
                                <Badge 
                                  key={depId} 
                                  variant="outline" 
                                  className={`text-xs ${depItem.completed ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}
                                >
                                  {depItem.title}
                                </Badge>
                              ) : null;
                            })}
                          </div>
                        </div>
                      )}

                      {/* Expanded Content */}
                      {expandedItems.has(item.id) && (
                        <div className="mt-3 pt-3 border-t space-y-3">
                          {/* Progress Slider */}
                          {!item.completed && (
                            <div>
                              <label className="text-sm font-medium mb-2 block">
                                Progress: {item.progress}%
                              </label>
                              <input
                                type="range"
                                min="0"
                                max="100"
                                value={item.progress}
                                onChange={(e) => 
                                  handleItemProgressUpdate(item.id, parseInt(e.target.value))
                                }
                                className="w-full"
                              />
                            </div>
                          )}

                          {/* Notes */}
                          <div>
                            <label className="text-sm font-medium mb-2 block">
                              Notes
                            </label>
                            <Textarea
                              placeholder="Add notes about your progress..."
                              value={item.notes || ''}
                              onChange={(e) => 
                                handleItemNotesUpdate(item.id, e.target.value)
                              }
                              className="min-h-[80px]"
                            />
                          </div>

                          {/* Related Resources */}
                          {item.relatedResourceIds && item.relatedResourceIds.length > 0 && (
                            <div>
                              <div className="text-sm font-medium mb-2">Related Resources:</div>
                              <div className="flex flex-wrap gap-2">
                                {item.relatedResourceIds.map((resourceId) => (
                                  <Badge key={resourceId} variant="outline" className="text-xs">
                                    {resourceId}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Completion Date */}
                          {item.completed && item.completedAt && (
                            <div className="text-xs text-gray-500">
                              Completed on {new Date(item.completedAt).toLocaleDateString()}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Estimated Completion */}
      <Card>
        <CardContent className="pt-6">
          <div className="text-center">
            <Clock className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <h3 className="font-semibold mb-1">Estimated Completion</h3>
            <p className="text-gray-600">
              Based on your current progress, you're estimated to complete this checklist in{' '}
              <span className="font-semibold text-blue-600">{checklist.estimatedCompletion}</span>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};