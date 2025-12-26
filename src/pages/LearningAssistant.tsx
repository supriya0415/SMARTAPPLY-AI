import React, { useState } from 'react';
import { Upload, FileText, Brain, Zap, BookOpen, ArrowLeft, Clock, AlertCircle, Briefcase, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { DocumentProcessorService } from '../lib/services/documentProcessorService';
import { DocumentAnalysisResult, QuizQuestion } from '../lib/types/learningTypes';
import { DepartmentService, Department, Subdepartment, RelatedJob } from '../lib/services/departmentService';

interface StudyMaterial {
  analysis: DocumentAnalysisResult;
  quizQuestions: QuizQuestion[];
  originalText: string;
  fileName: string;
}

export const LearningAssistant: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState('');
  const [studyMaterial, setStudyMaterial] = useState<StudyMaterial | null>(null);
  const [activeTab, setActiveTab] = useState<'summary' | 'notes' | 'careers'>('summary');
  const [textInput, setTextInput] = useState('');
  const [uploadMethod, setUploadMethod] = useState<'file' | 'text'>('file');
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    await processDocument(file, file.name);
  };

  const handleTextSubmit = async () => {
    if (!textInput.trim()) return;
    
    await processDocument(textInput, 'Text Input');
  };

  const processDocument = async (input: File | string, fileName: string) => {
    setIsLoading(true);
    setLoadingStep('Extracting text from document...');
    setError(null);

    try {
      // Extract text
      let documentText: string;
      if (typeof input === 'string') {
        documentText = input;
      } else {
        documentText = await DocumentProcessorService.extractTextFromFile(input);
      }

      // Analyze document
      setLoadingStep('Analyzing document content...');
      const analysis = await DocumentProcessorService.analyzeDocument(documentText);

      // Generate quiz
      setLoadingStep('Generating quiz questions...');
      const quizQuestions = await DocumentProcessorService.generateQuiz(documentText, 5);

      const material: StudyMaterial = {
        analysis,
        quizQuestions,
        originalText: documentText,
        fileName
      };

      setStudyMaterial(material);
      setActiveTab('summary');
    } catch (error) {
      console.error('Error processing document:', error);
      setError(error instanceof Error ? error.message : 'Failed to process document. Please try again.');
    } finally {
      setIsLoading(false);
      setLoadingStep('');
    }
  };

  const syncWithSkillRoadmap = () => {
    // TODO: Implement skill roadmap sync
    alert('Skill roadmap sync coming soon!');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen pt-20">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="flex flex-col items-center justify-center py-20">
            <div className="relative mb-6">
              <Brain className="h-16 w-16 animate-pulse text-blue-600" />
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <Zap className="w-4 h-4 text-white animate-bounce" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Processing Your Document</h2>
            <p className="text-gray-600 mb-4">{loadingStep}</p>
            <div className="w-64 bg-gray-200 rounded-full h-2">
              <div className="bg-blue-600 h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!studyMaterial && !error) {
    return (
      <div className="min-h-screen pt-20">
        <div className="max-w-4xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            
            <div className="text-center">
              <div className="flex items-center justify-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900">Learning Assistant</h1>
              </div>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Upload documents or paste text to generate AI-powered study materials: summaries, flashcards, 
                quiz questions, and notes that sync with your skill roadmap.
              </p>
            </div>
          </div>

          {/* Upload Interface */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
            <div className="p-8">
              <div className="flex gap-2 mb-8">
                <button
                  onClick={() => setUploadMethod('file')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    uploadMethod === 'file'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Upload className="h-4 w-4 mr-2 inline" />
                  Upload File
                </button>
                <button
                  onClick={() => setUploadMethod('text')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    uploadMethod === 'text'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <FileText className="h-4 w-4 mr-2 inline" />
                  Paste Text
                </button>
              </div>

              {uploadMethod === 'file' ? (
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center hover:border-blue-400 transition-colors">
                  <input
                    type="file"
                    accept=".txt,.pdf"
                    onChange={handleFileUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="flex flex-col items-center space-y-4">
                    <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center">
                      <Upload className="w-8 h-8 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">Upload Learning Material</h3>
                      <p className="text-gray-500 mt-2">Drop your document here or click to browse</p>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <AlertCircle className="w-4 h-4" />
                      <span>Supports TXT and PDF files</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <textarea
                    value={textInput}
                    onChange={(e) => setTextInput(e.target.value)}
                    placeholder="Paste your learning content here... (notes, textbook chapters, articles, etc.)"
                    className="w-full h-64 p-4 bg-gray-50 border border-gray-300 rounded-xl resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-gray-900 placeholder-gray-500"
                  />
                  <button
                    onClick={handleTextSubmit}
                    disabled={!textInput.trim()}
                    className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center space-x-2"
                  >
                    <Brain className="w-5 h-5" />
                    <span>Generate Study Materials</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Features Preview */}
          <div className="grid md:grid-cols-3 gap-6 mt-8">
            <FeatureCard
              icon={FileText}
              title="Smart Summaries"
              description="AI-generated summaries with key points and concepts"
            />
            <FeatureCard
              icon={BookOpen}
              title="Key Points & Glossary"
              description="Important concepts and terminology extraction"
            />
            <FeatureCard
              icon={Briefcase}
              title="Career Exploration"
              description="Discover careers by department and specialization"
            />
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen pt-20">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="mb-8">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          </div>

          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-red-100 rounded-xl flex items-center justify-center mx-auto mb-6">
                <AlertCircle className="w-8 h-8 text-red-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Upload Error</h2>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <p className="text-red-800 text-left">{error}</p>
              </div>
              
              <div className="space-y-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="font-semibold text-blue-900 mb-2">💡 Quick Solutions:</h3>
                  <ul className="text-left text-blue-800 space-y-2 text-sm">
                    <li>• <strong>For PDF files:</strong> Make sure the PDF contains readable text (not just images)</li>
                    <li>• <strong>For Word documents:</strong> Save as a .txt file or copy the content</li>
                    <li>• <strong>For empty files:</strong> Make sure your file contains readable text content</li>
                    <li>• <strong>Alternative:</strong> Copy the text content and use the "Paste Text" option</li>
                  </ul>
                </div>
                
                <button
                  onClick={() => {
                    setError(null);
                    setTextInput('');
                  }}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Try Again
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{studyMaterial?.fileName || 'Document'}</h1>
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <span className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>{studyMaterial?.analysis.estimatedReadTime || 0} min read</span>
                </span>
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  studyMaterial?.analysis.difficulty === 'BEGINNER' ? 'bg-green-100 text-green-700' :
                  studyMaterial?.analysis.difficulty === 'INTERMEDIATE' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  {studyMaterial?.analysis.difficulty || 'UNKNOWN'}
                </span>
              </div>
            </div>
          </div>
          
          <button
            onClick={syncWithSkillRoadmap}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
          >
            Sync with Roadmap
          </button>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 mb-6 bg-gray-100 rounded-lg p-1">
          {[
            { id: 'summary' as const, label: 'Summary', icon: FileText },
            { id: 'notes' as const, label: 'Key Points', icon: BookOpen },
            { id: 'careers' as const, label: 'Explore Careers', icon: Briefcase }
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-md font-medium transition-colors ${
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

        {/* Content */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
          {activeTab === 'summary' && studyMaterial && (
            <SummaryView analysis={studyMaterial.analysis} />
          )}
          {activeTab === 'notes' && studyMaterial && (
            <NotesView keyPoints={studyMaterial.analysis.keyPoints} glossary={studyMaterial.analysis.glossary} />
          )}
          {activeTab === 'careers' && (
            <CareerExplorer />
          )}
        </div>
      </div>
    </div>
  );
};

const FeatureCard: React.FC<{ icon: React.ComponentType<any>, title: string, description: string }> = 
  ({ icon: Icon, title, description }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
      <Icon className="w-5 h-5 text-blue-600" />
    </div>
    <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
    <p className="text-sm text-gray-600">{description}</p>
  </div>
);

const SummaryView: React.FC<{ analysis: DocumentAnalysisResult }> = ({ analysis }) => (
  <div className="space-y-6">
    <div>
      <h2 className="text-xl font-bold text-gray-900 mb-4">Document Summary</h2>
      <div className="space-y-3">
        {analysis.summary.map((point, index) => (
          <div key={index} className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
            <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
            <p className="text-gray-800" dangerouslySetInnerHTML={{ __html: point }} />
          </div>
        ))}
      </div>
    </div>
    
    <div className="grid md:grid-cols-3 gap-6">
      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="text-2xl font-bold text-blue-600">{analysis.documentLength}</div>
        <div className="text-sm text-gray-600">Characters</div>
      </div>
      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="text-2xl font-bold text-green-600">{analysis.estimatedReadTime}</div>
        <div className="text-sm text-gray-600">Minutes to Read</div>
      </div>
      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="text-2xl font-bold text-purple-600">{analysis.glossary.length}</div>
        <div className="text-sm text-gray-600">Key Terms</div>
      </div>
    </div>
  </div>
);

const NotesView: React.FC<{ keyPoints: string[], glossary: Array<{ term: string; definition: string; context: string }> }> = 
  ({ keyPoints, glossary }) => (
  <div className="space-y-8">
    <div>
      <h2 className="text-xl font-bold text-gray-900 mb-4">Key Learning Points</h2>
      <div className="space-y-2">
        {keyPoints.map((point, index) => (
          <div key={index} className="p-3 border-l-4 border-blue-500 bg-blue-50">
            <p className="text-gray-800" dangerouslySetInnerHTML={{ __html: point }} />
          </div>
        ))}
      </div>
    </div>
    
    {glossary.length > 0 && (
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4">Glossary</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {glossary.map((item, index) => (
            <div key={index} className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">{item.term}</h3>
              <p className="text-gray-700 text-sm mb-2" dangerouslySetInnerHTML={{ __html: item.definition }} />
              <p className="text-gray-600 text-xs">{item.context}</p>
            </div>
          ))}
        </div>
      </div>
    )}
  </div>
);

const CareerExplorer: React.FC = () => {
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);
  const [selectedSubdepartment, setSelectedSubdepartment] = useState<Subdepartment | null>(null);
  
  const departments = DepartmentService.getDepartments();

  const handleDepartmentSelect = (department: Department) => {
    setSelectedDepartment(department);
    setSelectedSubdepartment(null);
  };

  const handleSubdepartmentSelect = (subdepartment: Subdepartment) => {
    setSelectedSubdepartment(subdepartment);
  };

  const handleBack = () => {
    if (selectedSubdepartment) {
      setSelectedSubdepartment(null);
    } else if (selectedDepartment) {
      setSelectedDepartment(null);
    }
  };

  // Show job details
  if (selectedSubdepartment) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <button
              onClick={handleBack}
              className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 mb-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to {selectedDepartment?.name}</span>
            </button>
            <h2 className="text-2xl font-bold text-gray-900">{selectedSubdepartment.name}</h2>
            <p className="text-gray-600">{selectedSubdepartment.description}</p>
          </div>
        </div>

        <div className="grid gap-6">
          {selectedSubdepartment.relatedJobs.map((job) => (
            <div key={job.id} className="bg-gray-50 rounded-xl p-6 border border-gray-200">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{job.title}</h3>
                  <p className="text-gray-600 mb-3">{job.description}</p>
                </div>
                <div className="text-right">
                  <div className="text-lg font-semibold text-green-600">{job.averageSalary}</div>
                  <div className="text-sm text-gray-500">Average Salary</div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Growth Outlook</h4>
                  <p className="text-sm text-gray-600">{job.growthOutlook}</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Education Level</h4>
                  <p className="text-sm text-gray-600">{job.educationLevel}</p>
                </div>
              </div>

              <div className="mb-4">
                <h4 className="font-medium text-gray-900 mb-2">Key Skills</h4>
                <div className="flex flex-wrap gap-2">
                  {job.keySkills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="text-sm text-gray-500">
                Experience Level: {job.experienceLevel}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Show subdepartments
  if (selectedDepartment) {
    return (
      <div className="space-y-6">
        <div>
          <button
            onClick={handleBack}
            className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 mb-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Departments</span>
          </button>
          <h2 className="text-2xl font-bold text-gray-900">{selectedDepartment.name}</h2>
          <p className="text-gray-600">{selectedDepartment.description}</p>
        </div>

        <div className="grid gap-4">
          {selectedDepartment.subdepartments.map((subdepartment) => (
            <button
              key={subdepartment.id}
              onClick={() => handleSubdepartmentSelect(subdepartment)}
              className="text-left p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">{subdepartment.name}</h3>
                  <p className="text-gray-600 text-sm">{subdepartment.description}</p>
                  <p className="text-blue-600 text-sm mt-2">
                    {subdepartment.relatedJobs.length} related jobs
                  </p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // Show departments
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Explore Career Departments</h2>
        <p className="text-gray-600">Choose a department to discover career opportunities and related jobs</p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {departments.map((department) => (
          <button
            key={department.id}
            onClick={() => handleDepartmentSelect(department)}
            className="text-left p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200 hover:shadow-md transition-all"
          >
            <div className="flex items-center space-x-4">
              <div className="text-3xl">{department.icon}</div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">{department.name}</h3>
                <p className="text-gray-600 text-sm">{department.description}</p>
                <p className="text-blue-600 text-sm mt-2">
                  {department.subdepartments.length} specializations
                </p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

const QuizView: React.FC<{ questions: QuizQuestion[] }> = ({ questions }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | number>>({});
  const [showResults, setShowResults] = useState(false);

  const handleAnswer = (questionId: string, answer: string | number) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }));
  };

  const calculateScore = () => {
    let correct = 0;
    questions.forEach(q => {
      if (answers[q.id] === q.correctAnswer) {
        correct++;
      }
    });
    return Math.round((correct / questions.length) * 100);
  };

  if (questions.length === 0) {
    return (
      <div className="text-center py-12">
        <Zap className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Quiz Questions Generated</h3>
        <p className="text-gray-600">Try uploading a different document with more content.</p>
      </div>
    );
  }

  if (showResults) {
    const score = calculateScore();
    return (
      <div className="max-w-2xl mx-auto text-center">
        <div className="mb-8">
          <div className={`text-6xl font-bold mb-4 ${
            score >= 80 ? 'text-green-600' : score >= 60 ? 'text-yellow-600' : 'text-red-600'
          }`}>
            {score}%
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Quiz Complete!</h2>
          <p className="text-gray-600">
            You got {questions.filter(q => answers[q.id] === q.correctAnswer).length} out of {questions.length} questions correct.
          </p>
        </div>
        
        <div className="space-y-4">
          {questions.map((q, index) => {
            const isCorrect = answers[q.id] === q.correctAnswer;
            return (
              <div key={q.id} className={`p-4 rounded-lg border-l-4 ${
                isCorrect ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'
              }`}>
                <div className="flex items-start space-x-3">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-medium ${
                    isCorrect ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                  }`}>
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900 mb-2">{q.question}</h3>
                    <p className="text-sm text-gray-600 mb-2">
                      <strong>Your answer:</strong> {
                        q.type === 'MCQ' && q.options 
                          ? q.options[answers[q.id] as number] 
                          : answers[q.id] as string
                      }
                    </p>
                    {!isCorrect && (
                      <p className="text-sm text-gray-600 mb-2">
                        <strong>Correct answer:</strong> {
                          q.type === 'MCQ' && q.options 
                            ? q.options[q.correctAnswer as number]
                            : q.correctAnswer as string
                        }
                      </p>
                    )}
                    <p className="text-sm text-gray-700">{q.explanation}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        <button
          onClick={() => {
            setCurrentQuestion(0);
            setAnswers({});
            setShowResults(false);
          }}
          className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          Retake Quiz
        </button>
      </div>
    );
  }

  const question = questions[currentQuestion];

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">Quiz</h2>
          <span className="text-gray-600">Question {currentQuestion + 1} of {questions.length}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
          ></div>
        </div>
      </div>
      
      <div className="bg-gray-50 rounded-xl p-6 mb-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">{question.question}</h3>
        
        {question.type === 'MCQ' && question.options && (
          <div className="space-y-3">
            {question.options.map((option, index) => (
              <label key={index} className="flex items-center space-x-3 p-3 bg-white rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                <input
                  type="radio"
                  name={question.id}
                  value={index}
                  checked={answers[question.id] === index}
                  onChange={() => handleAnswer(question.id, index)}
                  className="w-4 h-4 text-blue-600"
                />
                <span className="flex-1">{option}</span>
              </label>
            ))}
          </div>
        )}
        
        {question.type === 'SHORT_ANSWER' && (
          <textarea
            value={answers[question.id] as string || ''}
            onChange={(e) => handleAnswer(question.id, e.target.value)}
            placeholder="Type your answer here..."
            className="w-full p-3 bg-white border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={4}
          />
        )}
        
        {question.type === 'TRUE_FALSE' && (
          <div className="flex space-x-4">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                name={question.id}
                value="true"
                checked={answers[question.id] === 'true'}
                onChange={() => handleAnswer(question.id, 'true')}
                className="w-4 h-4 text-blue-600"
              />
              <span>True</span>
            </label>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                name={question.id}
                value="false"
                checked={answers[question.id] === 'false'}
                onChange={() => handleAnswer(question.id, 'false')}
                className="w-4 h-4 text-blue-600"
              />
              <span>False</span>
            </label>
          </div>
        )}
      </div>
      
      <div className="flex items-center justify-between">
        <button
          onClick={() => setCurrentQuestion(prev => Math.max(0, prev - 1))}
          disabled={currentQuestion === 0}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Previous
        </button>
        
        {currentQuestion < questions.length - 1 ? (
          <button
            onClick={() => setCurrentQuestion(prev => prev + 1)}
            disabled={!answers[question.id]}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors"
          >
            Next Question
          </button>
        ) : (
          <button
            onClick={() => setShowResults(true)}
            disabled={Object.keys(answers).length !== questions.length}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-green-300 disabled:cursor-not-allowed transition-colors"
          >
            Finish Quiz
          </button>
        )}
      </div>
    </div>
  );
};