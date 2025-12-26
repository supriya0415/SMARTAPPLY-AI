import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useUserStore } from '../lib/stores/userStore';
import { ResumeSummary } from '../components/resume/ResumeSummary';
import { ATSScore } from '../components/resume/ATSScore';
import { DetailedFeedback } from '../components/resume/DetailedFeedback';
import { MissingSkillsSection } from '../components/resume/MissingSkillsSection';
import { JobMatchingSection } from '../components/resume/JobMatchingSection';
import { ImprovedBulletsSection } from '../components/resume/ImprovedBulletsSection';
import { ResumeOptimizerService } from '../lib/services/resumeOptimizerService';
import { EnhancedResumeService } from '../lib/services/enhancedResumeService';
import { NBButton } from '../components/NBButton';
import { NBCard } from '../components/NBCard';
import { ArrowLeft, Download, FileText, Building, Briefcase, Sparkles, History } from 'lucide-react';
import { toast } from 'sonner';
import { EnhancedResumeVersion } from '../lib/types';

export const ResumeAnalysisResults: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { enhancedProfile } = useUserStore();
  const [isGeneratingOptimized, setIsGeneratingOptimized] = useState(false);
  const [analysisHistory, setAnalysisHistory] = useState<any[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  // Load analysis history on mount
  useEffect(() => {
    const loadHistory = async () => {
      if (enhancedProfile?.userId) {
        try {
          const history = await EnhancedResumeService.getAnalysisHistory(
            enhancedProfile.userId
          );
          setAnalysisHistory(history);
          console.log(`✅ Loaded ${history.length} resume versions`);
        } catch (error) {
          console.log('Could not load analysis history');
        }
      }
    };
    loadHistory();
  }, [enhancedProfile?.userId]);

  // Find the resume analysis
  const resumeAnalysis = enhancedProfile?.resumeVersions?.find(
    version => version.id === id
  ) as EnhancedResumeVersion | undefined;

  if (!resumeAnalysis) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <NBCard className="p-8 text-center max-w-md">
          <FileText className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <h2 className="text-xl font-semibold text-foreground mb-2">
            Resume Analysis Not Found
          </h2>
          <p className="text-muted-foreground mb-4">
            The requested resume analysis could not be found.
          </p>
          <NBButton onClick={() => navigate('/dashboard')}>
            Back to Dashboard
          </NBButton>
        </NBCard>
      </div>
    );
  }

  if (!resumeAnalysis.feedback) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <NBCard className="p-8 text-center max-w-md">
          <FileText className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <h2 className="text-xl font-semibold text-foreground mb-2">
            Analysis In Progress
          </h2>
          <p className="text-muted-foreground mb-4">
            Your resume is still being analyzed. Please check back in a few moments.
          </p>
          <NBButton onClick={() => navigate('/dashboard')}>
            Back to Dashboard
          </NBButton>
        </NBCard>
      </div>
    );
  }

  const handleDownloadResume = () => {
    if (resumeAnalysis.resumeUrl) {
      const link = document.createElement('a');
      link.href = resumeAnalysis.resumeUrl;
      link.download = `${resumeAnalysis.companyName}_${resumeAnalysis.jobTitle}_Resume.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success('Resume downloaded successfully!');
    }
  };

  const handleDownloadOptimizedResume = async () => {
    if (!resumeAnalysis.feedback) {
      toast('No feedback available to optimize resume');
      return;
    }

    setIsGeneratingOptimized(true);
    try {
      toast.loading('Generating optimized resume...', { id: 'optimize' });
      
      // Generate improved resume using enhanced service
      const pdfBlob = await EnhancedResumeService.generateImprovedResume(
        resumeAnalysis.resumeData,
        resumeAnalysis.feedback as any,
        enhancedProfile || {}
      );

      // Download the PDF
      const link = document.createElement('a');
      link.href = URL.createObjectURL(pdfBlob);
      link.download = `${resumeAnalysis.companyName || 'Improved'}_${resumeAnalysis.jobTitle || 'Resume'}_Optimized.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success('Optimized resume downloaded successfully!', { id: 'optimize' });
    } catch (error) {
      console.log('Error generating optimized resume');
      toast('Please try again', { id: 'optimize' });
    } finally {
      setIsGeneratingOptimized(false);
    }
  };


  return (
    <div className="min-h-screen bg-background">
      {/* Page Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Resume Analysis Results</h1>
              <div className="flex items-center space-x-4 mt-1">
                {resumeAnalysis.companyName && (
                  <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                    <Building className="w-4 h-4" />
                    <span>{resumeAnalysis.companyName}</span>
                  </div>
                )}
                {resumeAnalysis.jobTitle && (
                  <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                    <Briefcase className="w-4 h-4" />
                    <span>{resumeAnalysis.jobTitle}</span>
                  </div>
                )}
              </div>
            </div>
            <div className="flex gap-3">
              <NBButton
                onClick={() => window.open('https://github.com/jakegut/resume', '_blank')}
                className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-none hover:from-blue-600 hover:to-cyan-600 flex items-center space-x-2"
              >
                <FileText className="w-4 h-4" />
                <span>Jake's Resume Template</span>
              </NBButton>
              <NBButton
                onClick={handleDownloadOptimizedResume}
                disabled={isGeneratingOptimized}
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-none hover:from-purple-600 hover:to-pink-600 flex items-center space-x-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>{isGeneratingOptimized ? 'Generating...' : 'Download Optimized Resume'}</span>
              </NBButton>
              <NBButton
                variant="secondary"
                onClick={handleDownloadResume}
                className="flex items-center space-x-2"
              >
                <Download className="w-4 h-4" />
                <span>Download Original</span>
              </NBButton>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Resume Preview */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <NBCard className="p-4">
                <h3 className="font-semibold text-foreground mb-4">Resume Preview</h3>
                {resumeAnalysis.resumeUrl ? (
                  <div className="aspect-[8.5/11] bg-gray-100 rounded-lg overflow-hidden">
                    <iframe
                      src={resumeAnalysis.resumeUrl}
                      className="w-full h-full"
                      title="Resume Preview"
                    />
                  </div>
                ) : (
                  <div className="aspect-[8.5/11] bg-gray-100 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <FileText className="w-12 h-12 mx-auto text-gray-400 mb-2" />
                      <p className="text-sm text-gray-500">Resume preview not available</p>
                    </div>
                  </div>
                )}
              </NBCard>
            </div>
          </div>

          {/* Analysis Results */}
          <div className="lg:col-span-2 space-y-8">
            {/* Overall Summary */}
            <ResumeSummary feedback={resumeAnalysis.feedback} />

            {/* ATS Score Highlight */}
            <ATSScore 
              score={resumeAnalysis.feedback.ATS.score}
              suggestions={resumeAnalysis.feedback.ATS.tips}
            />

            {/* Detailed Feedback */}
            <DetailedFeedback feedback={resumeAnalysis.feedback} />

            {/* Recommended Action - Jake's Template */}
            <NBCard className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-300">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center flex-shrink-0 font-bold text-lg">1</div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-foreground mb-2">Use Jake's Professional Resume Template</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    The #1 recommended resume format by recruiters - clean, ATS-friendly, and proven successful.
                  </p>
                  <a
                    href="https://github.com/jakegut/resume"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    <span>Get Jake's Resume Template</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </div>
              </div>
            </NBCard>

            {/* Improved Bullet Points */}
            <ImprovedBulletsSection 
              weaknesses={resumeAnalysis.feedback.weaknesses || []}
              jobTitle={resumeAnalysis.jobTitle || 'Your Role'}
            />

            {/* Missing Skills with Learning Resources */}
            {resumeAnalysis.feedback.missingSkills && (
              <MissingSkillsSection missingSkills={resumeAnalysis.feedback.missingSkills} />
            )}

            {/* Job Matching and Next Level Advice */}
            {(resumeAnalysis.feedback.jobMatches || resumeAnalysis.feedback.nextLevelAdvice) && (
              <JobMatchingSection 
                jobMatches={resumeAnalysis.feedback.jobMatches || []}
                nextLevelAdvice={resumeAnalysis.feedback.nextLevelAdvice || []}
              />
            )}

            {/* Resume Version History with Scores */}
            <NBCard className="p-6 bg-gradient-to-br from-purple-50 to-pink-50">
              <div className="flex items-center space-x-3 mb-4">
                <History className="w-6 h-6 text-purple-600" />
                <div>
                  <h3 className="text-xl font-semibold text-foreground">Resume Analysis History</h3>
                  <p className="text-sm text-muted-foreground">Track your progress over time</p>
                </div>
              </div>

              {analysisHistory.length > 0 ? (
                <div className="space-y-3 mt-6">
                  {/* Current Version */}
                  <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-4 rounded-lg shadow-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium opacity-90">Current Version</p>
                        <p className="text-xs opacity-75">{new Date(resumeAnalysis.createdAt).toLocaleDateString()}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-3xl font-bold">{resumeAnalysis.feedback.overallScore}%</p>
                        <p className="text-xs opacity-90">Overall Score</p>
                      </div>
                    </div>
                  </div>

                  {/* Previous Versions */}
                  {analysisHistory.slice(0, 5).map((version, index) => {
                    const scoreDiff = resumeAnalysis.feedback.overallScore - version.score;
                    const isImprovement = scoreDiff > 0;
                    
                    return (
                      <div key={version.id} className="bg-white border border-gray-200 p-4 rounded-lg hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <p className="text-sm font-medium text-foreground">
                                Version #{analysisHistory.length - index}
                              </p>
                              {version.fileName && (
                                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                                  {version.fileName}
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground">
                              {new Date(version.date).toLocaleDateString()} at {new Date(version.date).toLocaleTimeString()}
                            </p>
                          </div>
                          <div className="flex items-center space-x-3">
                            <div className="text-right">
                              <p className="text-2xl font-bold text-gray-700">{version.score}%</p>
                              <p className="text-xs text-muted-foreground">Score</p>
                            </div>
                            {index === 0 && (
                              <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-semibold ${
                                isImprovement 
                                  ? 'bg-green-100 text-green-700' 
                                  : scoreDiff < 0 
                                  ? 'bg-red-100 text-red-700'
                                  : 'bg-gray-100 text-gray-700'
                              }`}>
                                {isImprovement && <span>↑</span>}
                                {scoreDiff < 0 && <span>↓</span>}
                                <span>{Math.abs(scoreDiff)}%</span>
                              </div>
                            )}
                            {version.resumeContent && (
                              <NBButton
                                size="sm"
                                variant="secondary"
                                onClick={() => EnhancedResumeService.downloadResumeVersion(version)}
                                className="flex items-center space-x-1"
                              >
                                <Download className="w-3 h-3" />
                                <span className="text-xs">Download</span>
                              </NBButton>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  {analysisHistory.length > 5 && (
                    <NBButton
                      variant="secondary"
                      size="sm"
                      onClick={() => setShowHistory(!showHistory)}
                      className="w-full"
                    >
                      {showHistory ? 'Show Less' : `Show All ${analysisHistory.length} Versions`}
                    </NBButton>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <History className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground">This is your first analysis!</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Upload updated versions to track your improvement over time
                  </p>
                </div>
              )}
            </NBCard>
          </div>
        </div>
      </main>
    </div>
  );
};