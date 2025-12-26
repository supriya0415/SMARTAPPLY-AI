import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BookOpen, 
  Clock, 
  Target, 
  CheckCircle, 
  Circle,
  ChevronRight,
  ChevronDown,
  GraduationCap,
  FileText,
  Award
} from 'lucide-react';
import { 
  StudyGuide, 
  PreparationMaterial, 
  StudyGuideSection 
} from '@/lib/types/learningResourceTypes';
import { LearningResourcesService } from '@/lib/services/learningResourcesService';

interface StudyGuidesProps {
  domain: string;
  subfield?: string;
  targetRole?: string;
  className?: string;
}

export const StudyGuides: React.FC<StudyGuidesProps> = ({
  domain,
  subfield,
  targetRole,
  className = ''
}) => {
  const [studyGuides, setStudyGuides] = useState<StudyGuide[]>([]);
  const [preparationMaterials, setPreparationMaterials] = useState<PreparationMaterial[]>([]);
  const [expandedGuides, setExpandedGuides] = useState<Set<string>>(new Set());
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStudyContent();
  }, [domain, subfield, targetRole]);

  const loadStudyContent = async () => {
    try {
      setLoading(true);
      
      const guides = LearningResourcesService.getStudyGuides(domain, subfield, targetRole);
      const materials = LearningResourcesService.getPreparationMaterials(domain, subfield, targetRole);
      
      setStudyGuides(guides);
      setPreparationMaterials(materials);
    } catch (error) {
      console.error('Error loading study content:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleGuideExpansion = (guideId: string) => {
    const newExpanded = new Set(expandedGuides);
    if (newExpanded.has(guideId)) {
      newExpanded.delete(guideId);
    } else {
      newExpanded.add(guideId);
    }
    setExpandedGuides(newExpanded);
  };

  const toggleSectionExpansion = (sectionId: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
  };

  const handleSectionToggle = (guideId: string, sectionId: string, completed: boolean) => {
    // In a real app, this would update the backend
    setStudyGuides(prev => prev.map(guide => {
      if (guide.id === guideId) {
        return {
          ...guide,
          sections: guide.sections.map(section => {
            if (section.id === sectionId) {
              return {
                ...section,
                completed,
                completedAt: completed ? new Date() : undefined
              };
            }
            return section;
          })
        };
      }
      return guide;
    }));
  };

  const handleMaterialToggle = (materialId: string, completed: boolean) => {
    // In a real app, this would update the backend
    setPreparationMaterials(prev => prev.map(material => {
      if (material.id === materialId) {
        return {
          ...material,
          completed,
          completedAt: completed ? new Date() : undefined
        };
      }
      return material;
    }));
  };

  const calculateGuideProgress = (guide: StudyGuide): number => {
    if (guide.sections.length === 0) return 0;
    const completedSections = guide.sections.filter(section => section.completed).length;
    return Math.round((completedSections / guide.sections.length) * 100);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getMaterialTypeIcon = (type: string) => {
    switch (type) {
      case 'checklist': return <CheckCircle className="h-4 w-4" />;
      case 'template': return <FileText className="h-4 w-4" />;
      case 'guide': return <BookOpen className="h-4 w-4" />;
      case 'practice-test': return <Target className="h-4 w-4" />;
      case 'interview-prep': return <Award className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <div className={`space-y-4 ${className}`}>
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-4"></div>
          <div className="space-y-3">
            {[1, 2].map(i => (
              <div key={i} className="h-48 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      <Tabs defaultValue="study-guides" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="study-guides">Study Guides</TabsTrigger>
          <TabsTrigger value="preparation">Preparation Materials</TabsTrigger>
        </TabsList>

        {/* Study Guides Tab */}
        <TabsContent value="study-guides" className="mt-6">
          {studyGuides.length > 0 ? (
            <div className="space-y-4">
              {studyGuides.map((guide) => {
                const progress = calculateGuideProgress(guide);
                const isExpanded = expandedGuides.has(guide.id);
                
                return (
                  <Card key={guide.id} className="overflow-hidden">
                    <CardHeader className="cursor-pointer" onClick={() => toggleGuideExpansion(guide.id)}>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="flex items-center gap-2">
                            <GraduationCap className="h-5 w-5" />
                            {guide.title}
                            <Badge className={getDifficultyColor(guide.difficulty)}>
                              {guide.difficulty}
                            </Badge>
                          </CardTitle>
                          <CardDescription className="mt-2">
                            {guide.description}
                          </CardDescription>
                        </div>
                        
                        <div className="flex items-center gap-2 ml-4">
                          <div className="text-right">
                            <div className="text-sm font-medium">{progress}%</div>
                            <div className="text-xs text-gray-500">Complete</div>
                          </div>
                          {isExpanded ? (
                            <ChevronDown className="h-5 w-5" />
                          ) : (
                            <ChevronRight className="h-5 w-5" />
                          )}
                        </div>
                      </div>
                      
                      <div className="mt-4">
                        <Progress value={progress} className="h-2" />
                      </div>
                    </CardHeader>

                    {isExpanded && (
                      <CardContent>
                        {/* Guide Overview */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
                          <div className="text-center">
                            <Clock className="h-5 w-5 mx-auto mb-1 text-gray-600" />
                            <div className="text-sm font-medium">{guide.estimatedDuration}</div>
                            <div className="text-xs text-gray-500">Duration</div>
                          </div>
                          <div className="text-center">
                            <Target className="h-5 w-5 mx-auto mb-1 text-gray-600" />
                            <div className="text-sm font-medium">{guide.sections.length}</div>
                            <div className="text-xs text-gray-500">Sections</div>
                          </div>
                          <div className="text-center">
                            <BookOpen className="h-5 w-5 mx-auto mb-1 text-gray-600" />
                            <div className="text-sm font-medium">{guide.resources.length}</div>
                            <div className="text-xs text-gray-500">Resources</div>
                          </div>
                        </div>

                        {/* Prerequisites */}
                        {guide.prerequisites.length > 0 && (
                          <div className="mb-6">
                            <h4 className="font-semibold mb-2">Prerequisites</h4>
                            <div className="flex flex-wrap gap-2">
                              {guide.prerequisites.map((prereq, index) => (
                                <Badge key={index} variant="outline">
                                  {prereq}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Learning Objectives */}
                        {guide.learningObjectives.length > 0 && (
                          <div className="mb-6">
                            <h4 className="font-semibold mb-2">Learning Objectives</h4>
                            <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                              {guide.learningObjectives.map((objective, index) => (
                                <li key={index}>{objective}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Sections */}
                        <div className="space-y-3">
                          <h4 className="font-semibold">Study Sections</h4>
                          {guide.sections.map((section) => (
                            <div key={section.id} className="border rounded-lg p-4">
                              <div className="flex items-start gap-3">
                                <button
                                  onClick={() => handleSectionToggle(guide.id, section.id, !section.completed)}
                                  className="mt-1"
                                >
                                  {section.completed ? (
                                    <CheckCircle className="h-5 w-5 text-green-500" />
                                  ) : (
                                    <Circle className="h-5 w-5 text-gray-400" />
                                  )}
                                </button>
                                
                                <div className="flex-1">
                                  <div className="flex items-start justify-between">
                                    <div>
                                      <h5 className={`font-medium ${section.completed ? 'line-through text-gray-500' : ''}`}>
                                        {section.order}. {section.title}
                                      </h5>
                                      <p className="text-sm text-gray-600 mt-1">
                                        {section.description}
                                      </p>
                                    </div>
                                    
                                    <div className="flex items-center gap-2 ml-4">
                                      <div className="flex items-center gap-1 text-xs text-gray-500">
                                        <Clock className="h-3 w-3" />
                                        {section.estimatedDuration}
                                      </div>
                                      
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => toggleSectionExpansion(section.id)}
                                      >
                                        {expandedSections.has(section.id) ? (
                                          <ChevronDown className="h-4 w-4" />
                                        ) : (
                                          <ChevronRight className="h-4 w-4" />
                                        )}
                                      </Button>
                                    </div>
                                  </div>

                                  {/* Expanded Section Content */}
                                  {expandedSections.has(section.id) && (
                                    <div className="mt-3 pt-3 border-t space-y-3">
                                      {/* Topics */}
                                      {section.topics.length > 0 && (
                                        <div>
                                          <h6 className="text-sm font-medium mb-2">Topics Covered</h6>
                                          <div className="flex flex-wrap gap-1">
                                            {section.topics.map((topic, index) => (
                                              <Badge key={index} variant="secondary" className="text-xs">
                                                {topic}
                                              </Badge>
                                            ))}
                                          </div>
                                        </div>
                                      )}

                                      {/* Resources */}
                                      {section.resources.length > 0 && (
                                        <div>
                                          <h6 className="text-sm font-medium mb-2">Resources</h6>
                                          <div className="space-y-1">
                                            {section.resources.map((resourceId, index) => (
                                              <div key={index} className="text-sm text-blue-600 hover:underline cursor-pointer">
                                                {resourceId}
                                              </div>
                                            ))}
                                          </div>
                                        </div>
                                      )}

                                      {/* Completion Date */}
                                      {section.completed && section.completedAt && (
                                        <div className="text-xs text-gray-500">
                                          Completed on {new Date(section.completedAt).toLocaleDateString()}
                                        </div>
                                      )}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Assessment Criteria */}
                        {guide.assessmentCriteria.length > 0 && (
                          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                            <h4 className="font-semibold mb-2 text-blue-900">Assessment Criteria</h4>
                            <ul className="list-disc list-inside space-y-1 text-sm text-blue-800">
                              {guide.assessmentCriteria.map((criteria, index) => (
                                <li key={index}>{criteria}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </CardContent>
                    )}
                  </Card>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <GraduationCap className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">
                No study guides available
              </h3>
              <p className="text-gray-500">
                Study guides for this domain and role are coming soon.
              </p>
            </div>
          )}
        </TabsContent>

        {/* Preparation Materials Tab */}
        <TabsContent value="preparation" className="mt-6">
          {preparationMaterials.length > 0 ? (
            <div className="grid gap-4">
              {preparationMaterials.map((material) => (
                <Card key={material.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="flex items-center gap-2">
                          {getMaterialTypeIcon(material.type)}
                          {material.title}
                          <Badge className={getDifficultyColor(material.difficulty)}>
                            {material.difficulty}
                          </Badge>
                        </CardTitle>
                        <CardDescription className="mt-2">
                          {material.description}
                        </CardDescription>
                      </div>
                      
                      <div className="flex items-center gap-2 ml-4">
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                          <Clock className="h-4 w-4" />
                          {material.estimatedTime}
                        </div>
                        
                        <Button
                          variant={material.completed ? "default" : "outline"}
                          size="sm"
                          onClick={() => handleMaterialToggle(material.id, !material.completed)}
                        >
                          {material.completed ? (
                            <>
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Completed
                            </>
                          ) : (
                            'Mark Complete'
                          )}
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    {/* Content Sections */}
                    {material.content.sections.map((section, index) => (
                      <div key={section.id} className="mb-4 last:mb-0">
                        <h4 className="font-medium mb-2">{section.title}</h4>
                        <p className="text-sm text-gray-600 mb-3">{section.description}</p>
                        
                        <div className="space-y-2">
                          {section.items.map((item) => (
                            <div key={item.id} className="flex items-start gap-2 p-2 bg-gray-50 rounded">
                              <input
                                type="checkbox"
                                checked={item.completed}
                                onChange={() => {
                                  // Handle item completion
                                }}
                                className="mt-1"
                              />
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <span className={`text-sm ${item.completed ? 'line-through text-gray-500' : ''}`}>
                                    {item.title}
                                  </span>
                                  <Badge 
                                    variant="outline" 
                                    className={`text-xs ${
                                      item.priority === 'critical' ? 'border-red-300 text-red-700' :
                                      item.priority === 'important' ? 'border-yellow-300 text-yellow-700' :
                                      'border-green-300 text-green-700'
                                    }`}
                                  >
                                    {item.priority}
                                  </Badge>
                                </div>
                                {item.description && (
                                  <p className="text-xs text-gray-500 mt-1">{item.description}</p>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}

                    {/* Tips and Common Mistakes */}
                    <div className="grid md:grid-cols-2 gap-4 mt-6">
                      {material.content.tips.length > 0 && (
                        <div className="p-3 bg-green-50 rounded-lg">
                          <h5 className="font-medium text-green-900 mb-2">💡 Tips</h5>
                          <ul className="text-sm text-green-800 space-y-1">
                            {material.content.tips.map((tip, index) => (
                              <li key={index}>• {tip}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {material.content.commonMistakes.length > 0 && (
                        <div className="p-3 bg-red-50 rounded-lg">
                          <h5 className="font-medium text-red-900 mb-2">⚠️ Common Mistakes</h5>
                          <ul className="text-sm text-red-800 space-y-1">
                            {material.content.commonMistakes.map((mistake, index) => (
                              <li key={index}>• {mistake}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">
                No preparation materials available
              </h3>
              <p className="text-gray-500">
                Preparation materials for this domain and role are coming soon.
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};