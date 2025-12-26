import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '../lib/stores/userStore';
import { FileUploader } from '../components/resume/FileUploader';
import { NBButton } from '../components/NBButton';
import { NBCard } from '../components/NBCard';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { EnhancedResumeVersion } from '../lib/types';
import { GeminiService } from '../lib/services/geminiService';
import { DepartmentService } from '../lib/services/departmentService';
import { EnhancedResumeService } from '../lib/services/enhancedResumeService';
import { AuthService } from '../lib/services/authService';

export const ResumeUpload: React.FC = () => {
  const navigate = useNavigate();
  const { enhancedProfile, setEnhancedProfile } = useUserStore();

  const [file, setFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [statusText, setStatusText] = useState('');
  const [useDefaultJobDescription, setUseDefaultJobDescription] = useState(false);
  const [selectedJobRole, setSelectedJobRole] = useState('');
  const [availableJobs, setAvailableJobs] = useState<any[]>([]);

  // Check authentication on component mount
  useEffect(() => {
    if (!enhancedProfile) {
      toast.info('Please complete your career assessment first');
      navigate('/assessment');
      return;
    }

    // Load available job roles
    const allJobs = DepartmentService.searchJobs('');
    setAvailableJobs(allJobs);

    // Auto-fill job title from user's career recommendation
    const userCareerRole = enhancedProfile.careerRecommendations?.[0]?.title;
    if (userCareerRole) {
      setSelectedJobRole(userCareerRole);
    }
  }, [enhancedProfile, navigate]);

  const extractTextFromFile = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = async (event) => {
        try {
          const text = event.target?.result as string;
          // Basic text extraction - in production, use a proper PDF parser like pdf-parse
          resolve(text || 'Resume content');
        } catch (error) {
          reject(error);
        }
      };
      
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsText(file);
    });
  };

  const generateJobDescription = async (jobTitle: string): Promise<string> => {
    try {
      const prompt = `Generate a comprehensive, industry-standard job description for a ${jobTitle} position. 

Include:
1. Job Summary (2-3 sentences)
2. Key Responsibilities (5-7 bullet points)
3. Required Skills and Qualifications (technical and soft skills)
4. Preferred Qualifications
5. Experience Level requirements

Make it realistic and based on current industry standards. Format it as a professional job posting.`;

      const response = await GeminiService.generateContent(prompt);
      return response;
    } catch (error) {
      console.log('Using fallback job description');
      return `Job Description for ${jobTitle}

We are seeking a talented ${jobTitle} to join our dynamic team. The ideal candidate will have strong technical skills and experience in relevant technologies.

Key Responsibilities:
• Develop and maintain high-quality software solutions
• Collaborate with cross-functional teams
• Participate in code reviews and technical discussions
• Contribute to system architecture and design decisions
• Stay updated with industry best practices

Required Skills:
• Strong programming skills
• Problem-solving abilities
• Team collaboration
• Communication skills
• Attention to detail

Experience: 2+ years of relevant experience preferred.`;
    }
  };

  const handleJobRoleChange = async (jobTitle: string) => {
    setSelectedJobRole(jobTitle);
    
    if (useDefaultJobDescription && jobTitle) {
      setStatusText('Generating job description...');
      try {
        const generatedDescription = await generateJobDescription(jobTitle);
        const jobDescriptionTextarea = document.getElementById('jobDescription') as HTMLTextAreaElement;
        if (jobDescriptionTextarea) {
          jobDescriptionTextarea.value = generatedDescription;
        }
      } catch (error) {
        toast.error('Failed to generate job description');
      } finally {
        setStatusText('');
      }
    }
  };

  const handleUseDefaultToggle = async (checked: boolean) => {
    setUseDefaultJobDescription(checked);
    
    if (checked && selectedJobRole) {
      setStatusText('Generating job description...');
      try {
        const generatedDescription = await generateJobDescription(selectedJobRole);
        const jobDescriptionTextarea = document.getElementById('jobDescription') as HTMLTextAreaElement;
        if (jobDescriptionTextarea) {
          jobDescriptionTextarea.value = generatedDescription;
        }
      } catch (error) {
        toast.error('Failed to generate job description');
      } finally {
        setStatusText('');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!file) {
      toast.error('Please select a resume file');
      return;
    }

    const formData = new FormData(e.currentTarget);
    const companyName = formData.get('companyName') as string;
    const jobTitle = formData.get('jobTitle') as string;
    let jobDescription = formData.get('jobDescription') as string;

    if (!companyName || !jobTitle) {
      toast.error('Please fill in company name and job title');
      return;
    }

    // Generate job description if using default and not provided
    if (useDefaultJobDescription && !jobDescription) {
      try {
        jobDescription = await generateJobDescription(jobTitle);
      } catch (error) {
        toast.error('Failed to generate job description');
        return;
      }
    }

    if (!jobDescription) {
      toast.error('Please provide a job description or use the default option');
      return;
    }

    setIsAnalyzing(true);
    setStatusText('Preparing analysis...');

    try {
      // Create resume analysis object
      const analysisId = `resume_${Date.now()}`;
      const resumeAnalysis: EnhancedResumeVersion = {
        id: analysisId,
        name: `${companyName} - ${jobTitle}`,
        description: `Resume analysis for ${jobTitle} at ${companyName}`,
        resumeData: {
          file: file,
          extractedText: '', // Will be populated by AI
          extractedInfo: {
            skills: [],
            experience: [],
            education: []
          }
        },
        companyName,
        jobTitle,
        jobDescription,
        resumeUrl: URL.createObjectURL(file),
        createdAt: new Date(),
        isActive: true,
        status: 'analyzing'
      };

      setStatusText('Extracting text from resume...');
      
      // Extract text from PDF (using FileReader for basic text extraction)
      const resumeText = await extractTextFromFile(file);
      
      resumeAnalysis.resumeData.extractedText = resumeText;

      setStatusText('Analyzing resume with AI...');

      // Use Enhanced Resume Service for real AI analysis
      // Handle skills - can be array of strings or array of objects with name property
      const skillsList = enhancedProfile?.skills 
        ? (typeof enhancedProfile.skills[0] === 'string' 
          ? enhancedProfile.skills as string[]
          : (enhancedProfile.skills as any[]).map((s: any) => s.name || s))
        : [];
      
      const aiAnalysis = await EnhancedResumeService.analyzeResume(
        resumeText,
        jobDescription,
        jobTitle,
        skillsList,
        enhancedProfile?.careerInterest || jobTitle
      );

      // Convert to feedback format - ensure all tips have explanation
      const feedback = {
        overallScore: aiAnalysis.overallScore,
        strengths: aiAnalysis.strengths,
        weaknesses: aiAnalysis.weaknesses,
        missingSkills: aiAnalysis.missingSkills,
        matchedSkills: aiAnalysis.matchedSkills,
        nextLevelAdvice: aiAnalysis.nextLevelAdvice,
        jobMatches: aiAnalysis.jobMatches,
        ATS: aiAnalysis.ATS,
        toneAndStyle: {
          score: aiAnalysis.toneAndStyle.score,
          tips: aiAnalysis.toneAndStyle.tips.map(tip => ({
            type: tip.type,
            tip: tip.tip,
            explanation: tip.explanation ?? ''
          }))
        },
        content: aiAnalysis.content,
        structure: aiAnalysis.structure,
        skills: aiAnalysis.skills
      } as any; // Type assertion to bypass strict type checking

      resumeAnalysis.feedback = feedback;
      resumeAnalysis.status = 'completed';

      // Save analysis version for history tracking (with resume content)
      const currentUser = AuthService.getCurrentUser();
      if (currentUser?.id && file) {
        await EnhancedResumeService.saveAnalysisVersion(
          currentUser.id,
          aiAnalysis,
          resumeText, // Store the actual resume content
          file.name // Store the file name
        );
      }

      // Update user profile with resume analysis
      const currentProfile = enhancedProfile || {
        id: `profile_${Date.now()}`,
        resumeVersions: [],
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const updatedProfile = {
        ...currentProfile,
        resumeVersions: [...(currentProfile.resumeVersions || []), resumeAnalysis],
        updatedAt: new Date()
      };
      // ensure the object matches EnhancedUserProfile shape
      const { ensureEnhancedProfile } = await import('../lib/utils/profileHelpers')
      setEnhancedProfile(ensureEnhancedProfile(updatedProfile));

      setStatusText('Analysis complete! Redirecting...');
      toast.success('Resume analysis completed successfully!');

      // Navigate to results page
      setTimeout(() => {
        navigate(`/resume-analysis/${analysisId}`);
      }, 1000);

    } catch (error) {
      console.error('Resume analysis failed:', error);
      setStatusText('');
      setIsAnalyzing(false);
      toast.error('Failed to analyze resume. Please try again.');
    }
  };

  return (
    <div className="min-h-screen">
      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 py-24">{/* Added more top padding to account for navbar */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground mb-2">AI Resume Analyzer</h1>
          <p className="text-muted-foreground">
            Get instant feedback and ATS optimization suggestions
          </p>
        </div>

        {isAnalyzing ? (
          <NBCard className="p-8 text-center">
            <div className="space-y-6">
              <Loader2 className="w-16 h-16 mx-auto text-primary animate-spin" />
              <div>
                <h2 className="text-xl font-semibold text-foreground mb-2">
                  Analyzing Your Resume
                </h2>
                <p className="text-muted-foreground">{statusText}</p>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-primary h-2 rounded-full animate-pulse" style={{ width: '60%' }} />
              </div>
            </div>
          </NBCard>
        ) : (
          <NBCard className="p-8">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-foreground mb-2">
                Upload Your Resume for Analysis
              </h2>
              <p className="text-muted-foreground">
                Get AI-powered feedback on your resume's ATS compatibility, content quality,
                and optimization suggestions tailored to your target job.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Job Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="companyName" className="block text-sm font-medium text-foreground mb-2">
                    Company Name
                  </label>
                  <input
                    type="text"
                    id="companyName"
                    name="companyName"
                    placeholder="e.g., Google, Microsoft, Apple"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="jobTitle" className="block text-sm font-medium text-foreground mb-2">
                    Job Title
                    {enhancedProfile?.careerRecommendations?.[0]?.title && (
                      <span className="text-sm text-gray-500 ml-2">
                        (Auto-filled from your assessment)
                      </span>
                    )}
                  </label>
                  <input
                    type="text"
                    id="jobTitle"
                    name="jobTitle"
                    placeholder="e.g., Software Developer, Product Manager"
                    value={selectedJobRole}
                    onChange={(e) => handleJobRoleChange(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label htmlFor="jobDescription" className="block text-sm font-medium text-foreground">
                    Job Description
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="useDefault"
                      checked={useDefaultJobDescription}
                      onChange={(e) => handleUseDefaultToggle(e.target.checked)}
                      className="rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <label htmlFor="useDefault" className="text-sm text-gray-600">
                      Use AI-generated default
                    </label>
                  </div>
                </div>
                <textarea
                  id="jobDescription"
                  name="jobDescription"
                  rows={8}
                  placeholder={useDefaultJobDescription 
                    ? "AI will generate a job description based on the selected role..." 
                    : "Paste the specific job description here for more targeted feedback..."
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                  disabled={useDefaultJobDescription}
                />
                {statusText && (
                  <p className="text-sm text-blue-600 mt-1">{statusText}</p>
                )}
              </div>

              {/* File Upload */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Resume File
                </label>
                <FileUploader onFileSelect={setFile} />
              </div>

              {/* Submit Button */}
              <div className="flex justify-end">
                <NBButton
                  type="submit"
                  disabled={!file}
                >
                  Analyze Resume
                </NBButton>
              </div>
            </form>
          </NBCard>
        )}
      </main>
    </div>
  );
};