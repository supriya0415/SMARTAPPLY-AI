import { Link } from 'react-router-dom';
import { NBCard } from '../components/NBCard';
import { NBButton } from '../components/NBButton';
import { BGPattern } from '../components/ui/bg-pattern';
import { ArrowRight, Target, Map, Zap, ChevronDown, ChevronUp, Sparkles, TrendingUp, Users, Award, BookOpen, FileText, BarChart } from 'lucide-react';
import { useState, useCallback } from 'react';
import SplitText from '../components/SplitText';
import ReactFlow, { 
  Node, 
  Edge, 
  Controls, 
  Background,
  useNodesState,
  useEdgesState,
  MarkerType
} from 'reactflow';
import 'reactflow/dist/style.css';

// React Flow nodes for the career path example
const initialNodes: Node[] = [
  {
    id: '1',
    type: 'default',
    data: { label: '🚀 Start Your Journey' },
    position: { x: 50, y: 150 },
    style: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      border: '2px solid #667eea',
      borderRadius: '12px',
      padding: '15px 20px',
      fontSize: '14px',
      fontWeight: 'bold',
      width: 180,
    },
  },
  {
    id: '2',
    data: { label: '💻 Master DSA\n3 months' },
    position: { x: 300, y: 150 },
    style: {
      background: 'white',
      border: '3px solid #9333ea',
      borderRadius: '12px',
      padding: '15px 20px',
      fontSize: '14px',
      fontWeight: 'bold',
      width: 160,
      textAlign: 'center',
    },
  },
  {
    id: '3',
    data: { label: '📚 LeetCode Practice' },
    position: { x: 300, y: 50 },
    style: {
      background: '#f3e8ff',
      border: '2px solid #9333ea',
      borderRadius: '8px',
      padding: '10px 15px',
      fontSize: '12px',
      width: 160,
      textAlign: 'center',
    },
  },
  {
    id: '4',
    data: { label: '🛠️ Build Projects' },
    position: { x: 300, y: 250 },
    style: {
      background: '#fce7f3',
      border: '2px solid #ec4899',
      borderRadius: '8px',
      padding: '10px 15px',
      fontSize: '12px',
      width: 160,
      textAlign: 'center',
    },
  },
  {
    id: '5',
    data: { label: '🏗️ System Design\n6 months' },
    position: { x: 550, y: 150 },
    style: {
      background: 'white',
      border: '3px solid #ec4899',
      borderRadius: '12px',
      padding: '15px 20px',
      fontSize: '14px',
      fontWeight: 'bold',
      width: 160,
      textAlign: 'center',
    },
  },
  {
    id: '6',
    data: { label: '🎯 SDE Role Ready\n9 months' },
    position: { x: 800, y: 150 },
    style: {
      background: 'linear-gradient(135deg, #ec4899 0%, #f97316 100%)',
      color: 'white',
      border: '2px solid #ec4899',
      borderRadius: '12px',
      padding: '15px 20px',
      fontSize: '14px',
      fontWeight: 'bold',
      width: 180,
      textAlign: 'center',
    },
  },
];

const initialEdges: Edge[] = [
  {
    id: 'e1-2',
    source: '1',
    target: '2',
    animated: true,
    style: { stroke: '#9333ea', strokeWidth: 3 },
    markerEnd: { type: MarkerType.ArrowClosed, color: '#9333ea' },
  },
  {
    id: 'e2-3',
    source: '2',
    target: '3',
    animated: true,
    style: { stroke: '#9333ea', strokeWidth: 2, strokeDasharray: '5 5' },
  },
  {
    id: 'e2-4',
    source: '2',
    target: '4',
    animated: true,
    style: { stroke: '#ec4899', strokeWidth: 2, strokeDasharray: '5 5' },
  },
  {
    id: 'e2-5',
    source: '2',
    target: '5',
    animated: true,
    style: { stroke: '#ec4899', strokeWidth: 3 },
    markerEnd: { type: MarkerType.ArrowClosed, color: '#ec4899' },
  },
  {
    id: 'e5-6',
    source: '5',
    target: '6',
    animated: true,
    style: { stroke: '#f97316', strokeWidth: 3 },
    markerEnd: { type: MarkerType.ArrowClosed, color: '#f97316' },
  },
];

export const Landing = () => {
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const toggleFAQ = (index: number) => {
    setExpandedFAQ(expandedFAQ === index ? null : index);
  };

  const handleAnimationComplete = () => {
    console.log('SmartApply AI animation complete!');
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  };

  return (
    <div className="min-h-screen light-rays-bg">
      <style>{`
        .custom-button {
          width: 200px;
          height: 60px;
          background-color: white;
          color: #568fa6;
          position: relative;
          overflow: hidden;
          font-size: 16px;
          letter-spacing: 1px;
          font-weight: 500;
          text-transform: uppercase;
          transition: all 0.3s ease;
          cursor: pointer;
          border: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 8px;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
        }
        
        .custom-button:before, .custom-button:after {
          content: "";
          position: absolute;
          width: 0;
          height: 2px;
          background-color: #44d8a4;
          transition: all 0.3s cubic-bezier(0.35, 0.1, 0.25, 1);
        }
        
        .custom-button:before {
          right: 0;
          top: 0;
          transition: all 0.5s cubic-bezier(0.35, 0.1, 0.25, 1);
        }
        
        .custom-button:after {
          left: 0;
          bottom: 0;
        }
        
        .custom-button .button-span {
          width: 100%;
          height: 100%;
          position: absolute;
          left: 0;
          top: 0;
          margin: 0;
          padding: 0;
          z-index: 1;
        }
        
        .custom-button .button-span:before, .custom-button .button-span:after {
          content: "";
          position: absolute;
          width: 2px;
          height: 0;
          background-color: #44d8a4;
          transition: all 0.3s cubic-bezier(0.35, 0.1, 0.25, 1);
        }
        
        .custom-button .button-span:before {
          right: 0;
          top: 0;
          transition: all 0.5s cubic-bezier(0.35, 0.1, 0.25, 1);
        }
        
        .custom-button .button-span:after {
          left: 0;
          bottom: 0;
        }
        
        .custom-button .button-text {
          padding: 0;
          margin: 0;
          transition: all 0.4s cubic-bezier(0.35, 0.1, 0.25, 1);
          position: absolute;
          width: 100%;
          height: 100%;
        }
        
        .custom-button .button-text:before, .custom-button .button-text:after {
          position: absolute;
          width: 100%;
          transition: all 0.4s cubic-bezier(0.35, 0.1, 0.25, 1);
          z-index: 1;
          left: 0;
        }
        
        .custom-button .button-text:before {
          content: "Start Journey";
          top: 50%;
          transform: translateY(-50%);
        }
        
        .custom-button .button-text:after {
          content: "Let's Go!";
          top: 150%;
          color: #44d8a4;
        }
        
        .custom-button:hover:before, .custom-button:hover:after {
          width: 100%;
        }
        
        .custom-button:hover .button-span {
          z-index: 1;
        }
        
        .custom-button:hover .button-span:before, .custom-button:hover .button-span:after {
          height: 100%;
        }
        
        .custom-button:hover .button-text:before {
          top: -50%;
          transform: rotate(5deg);
        }
        
        .custom-button:hover .button-text:after {
          top: 50%;
          transform: translateY(-50%);
        }
      `}</style>
      {/* Hero Section */}
      <section className="py-32 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10"></div>
        <BGPattern variant="grid" mask="fade-edges" size={40} fill="rgba(139, 92, 246, 0.08)" />
        <BGPattern variant="dots" mask="fade-center" size={60} fill="rgba(34, 197, 94, 0.05)" />
        <div className="max-w-7xl mx-auto text-center relative">
          
          {/* Main Title */}
          <div className="mb-12">
            <div className="mb-6" style={{fontFamily: 'Playfair Display, serif'}}>
              <SplitText
                text="SmartApply AI"
                className="text-6xl md:text-8xl font-bold text-gray-800"
                delay={100}
                duration={0.6}
                ease="power3.out"
                splitType="chars"
                from={{ opacity: 0, y: 40 }}
                to={{ opacity: 1, y: 0 }}
                threshold={0.1}
                rootMargin="-100px"
                textAlign="center"
                onLetterAnimationComplete={handleAnimationComplete}
              />
            </div>
            <p className="text-2xl md:text-3xl text-gray-600 font-light mb-8" style={{fontFamily: 'Playfair Display, serif'}}>
              Your AI-Powered Career Mentor
            </p>
          </div>
          <p className="text-xl text-gray-700 mb-8 max-w-3xl mx-auto leading-relaxed">
            Get personalized career advice powered by AI. Upload your resume for automatic 
            skill extraction, visualize your career path, discover new opportunities, and 
            bridge skill gaps with our interactive flowchart.
          </p>
          <div className="flex justify-center">
            <Link to="/assessment">
              <button className="custom-button">
                <span className="button-span"></span>
                <div className="button-text"></div>
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="about" className="py-20 px-4 light-rays-bg relative border-t border-border/20">
        <BGPattern variant="dots" mask="fade-y" size={24} fill="rgba(34, 197, 94, 0.06)" />
        <div className="max-w-6xl mx-auto relative">
          <h2 className="text-4xl font-bold text-foreground text-center mb-16" style={{fontFamily: 'Playfair Display, serif'}}>
            How It Works
          </h2>
          <div className="grid md:grid-cols-3 gap-8 justify-items-center">
            <NBCard className="text-center group hover:scale-105 transition-all duration-300 hover:shadow-xl border-border/50 bg-card/50 backdrop-blur-sm p-8">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-600 to-purple-800 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                <span className="text-3xl font-bold text-white">1</span>
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-4 group-hover:text-primary transition-colors" style={{fontFamily: 'Playfair Display, serif'}}>
                Enter Your Details
              </h3>
              <p className="text-muted-foreground">
                Tell us about your skills, education, interests, and career goals. 
                Upload your resume for automatic skill extraction and experience analysis. 
                The more details you provide, the better our recommendations.
              </p>
            </NBCard>

            <NBCard className="text-center group hover:scale-105 transition-all duration-300 hover:shadow-xl border-border/50 bg-card/50 backdrop-blur-sm p-8">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-600 to-purple-800 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                <span className="text-3xl font-bold text-white">2</span>
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-4 group-hover:text-primary transition-colors" style={{fontFamily: 'Playfair Display, serif'}}>
                See Your Career Path
              </h3>
              <p className="text-muted-foreground">
                Get a personalized flowchart showing your recommended career journey, 
                including courses, internships, and job opportunities.
              </p>
            </NBCard>

            <NBCard className="text-center group hover:scale-105 transition-all duration-300 hover:shadow-xl border-border/50 bg-card/50 backdrop-blur-sm p-8">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-600 to-purple-800 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                <span className="text-3xl font-bold text-white">3</span>
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-4 group-hover:text-primary transition-colors" style={{fontFamily: 'Playfair Display, serif'}}>
                Explore Opportunities
              </h3>
              <p className="text-muted-foreground">
                Discover alternative career paths, skill requirements, and real-world 
                opportunities that match your profile and interests.
              </p>
            </NBCard>
          </div>
        </div>
      </section>

      {/* Visual Career Roadmap Section */}
      <section className="py-20 px-4 light-rays-bg relative">
        <BGPattern variant="dots" mask="fade-y" size={32} fill="rgba(139, 92, 246, 0.06)" />
        <div className="max-w-7xl mx-auto relative">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-full text-sm font-medium mb-8 shadow-lg">
              <Sparkles className="w-4 h-4" />
              AI-POWERED VISUALIZATIONS
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4" style={{fontFamily: 'Playfair Display, serif'}}>
              See Your Career Path Come to Life
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Interactive career roadmaps powered by React Flow, showing you exactly where to go next
            </p>
          </div>

          {/* React Flow Visual Example */}
          <div className="max-w-6xl mx-auto">
            <NBCard className="p-8 bg-white/90 backdrop-blur-sm shadow-2xl border-2 border-purple-200">
              <h3 className="text-2xl font-bold text-center mb-8 text-purple-900">Example: Software Engineer Career Path</h3>
              
              {/* React Flow Component */}
              <div style={{ height: '400px', width: '100%' }}>
                <ReactFlow
                  nodes={nodes}
                  edges={edges}
                  onNodesChange={onNodesChange}
                  onEdgesChange={onEdgesChange}
                  fitView
                  attributionPosition="bottom-left"
                  nodesDraggable={false}
                  nodesConnectable={false}
                  elementsSelectable={false}
                  panOnDrag={false}
                  zoomOnScroll={false}
                  zoomOnPinch={false}
                  zoomOnDoubleClick={false}
                >
                  <Background color="#e0e7ff" gap={16} />
                  <Controls showInteractive={false} />
                </ReactFlow>
              </div>
              
              <div className="mt-8 text-center text-sm text-gray-600">
                ✨ <strong>Your personalized roadmap</strong> adapts to your experience level, skills, and career goals
              </div>
            </NBCard>
          </div>
        </div>
      </section>

      {/* Why Choose SmartApply AI Section */}
      <section className="py-20 px-4 light-rays-bg relative">
        <BGPattern variant="grid" mask="fade-center" size={40} fill="rgba(34, 197, 94, 0.04)" />
        <div className="max-w-7xl mx-auto relative">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground text-center mb-16" style={{fontFamily: 'Playfair Display, serif'}}>
            Why Choose SmartApply AI?
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <NBCard className="p-6 hover:scale-105 transition-all duration-300 hover:shadow-xl bg-gradient-to-br from-white to-purple-50 border-purple-200">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-700 rounded-lg flex items-center justify-center mb-4">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">AI-Powered Insights</h3>
              <p className="text-muted-foreground">
                Google Gemini 1.5 Flash analyzes your profile and generates personalized career recommendations
              </p>
            </NBCard>

            {/* Feature 2 */}
            <NBCard className="p-6 hover:scale-105 transition-all duration-300 hover:shadow-xl bg-gradient-to-br from-white to-pink-50 border-pink-200">
              <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-pink-700 rounded-lg flex items-center justify-center mb-4">
                <Map className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">Interactive Roadmaps</h3>
              <p className="text-muted-foreground">
                Visual career paths with React Flow showing exactly what to learn and when
              </p>
            </NBCard>

            {/* Feature 3 */}
            <NBCard className="p-6 hover:scale-105 transition-all duration-300 hover:shadow-xl bg-gradient-to-br from-white to-blue-50 border-blue-200">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg flex items-center justify-center mb-4">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">Resume Optimizer</h3>
              <p className="text-muted-foreground">
                AI-powered resume analysis with ATS scoring and version tracking
              </p>
            </NBCard>

            {/* Feature 4 */}
            <NBCard className="p-6 hover:scale-105 transition-all duration-300 hover:shadow-xl bg-gradient-to-br from-white to-green-50 border-green-200">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-700 rounded-lg flex items-center justify-center mb-4">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">Curated Resources</h3>
              <p className="text-muted-foreground">
                Udemy, Coursera, YouTube, and Google courses tailored to your career path
              </p>
            </NBCard>

            {/* Feature 5 */}
            <NBCard className="p-6 hover:scale-105 transition-all duration-300 hover:shadow-xl bg-gradient-to-br from-white to-orange-50 border-orange-200">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-700 rounded-lg flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">Progress Tracking</h3>
              <p className="text-muted-foreground">
                Track your learning journey and see improvements in real-time
              </p>
            </NBCard>

            {/* Feature 6 */}
            <NBCard className="p-6 hover:scale-105 transition-all duration-300 hover:shadow-xl bg-gradient-to-br from-white to-indigo-50 border-indigo-200">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-lg flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">150+ Career Paths</h3>
              <p className="text-muted-foreground">
                Comprehensive career taxonomy covering technology, healthcare, creative arts, and more
              </p>
            </NBCard>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 px-4 light-rays-bg relative">
        <BGPattern variant="grid" mask="fade-center" size={32} fill="rgba(139, 92, 246, 0.05)" />
        <div className="max-w-7xl mx-auto relative">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-accent/10 to-primary/10 border border-accent/20 px-6 py-3 rounded-full text-sm font-medium text-accent mb-8">
              🙋 FREQUENTLY ASKED QUESTIONS
            </div>
            <h2 className="text-4xl font-bold text-foreground mb-4" style={{fontFamily: 'Playfair Display, serif'}}>
              Got Questions? We've Got Answers
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Everything you need to know about SmartApply AI
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-4">
            {[
              {
                question: "How does SmartApply AI help me find the right career path?",
                answer: "SmartApply AI uses AI-powered analysis to understand your skills, interests, and goals. Through an interactive career assessment, it matches you with personalized career recommendations from our database of 1000+ career paths across technology, healthcare, creative arts, and more. You'll get detailed roadmaps showing the exact steps to reach your career goals."
              },
              {
                question: "What information do I need to get started?", 
                answer: "You can start with just your basic details, skills, and interests. For the best results, upload your resume - our AI will automatically extract your skills, experience, and education. You can also complete a career assessment to help us understand your preferences and goals better."
              },
              {
                question: "How accurate are the career recommendations?",
                answer: "Our recommendations are powered by Google Gemini 1.5 Flash AI, which analyzes your profile against comprehensive career data. We consider your skills, experience level, education, interests, and career goals. The more information you provide, the more personalized and accurate your recommendations will be."
              },
              {
                question: "Can I use SmartApply AI if I'm just starting my career?",
                answer: "Absolutely! SmartApply AI is perfect for students, recent graduates, and career changers. Our platform provides detailed learning roadmaps, recommends courses from Udemy and Coursera, and shows you exactly what skills to develop and in what order. It's designed to guide you from beginner to job-ready."
              },
              {
                question: "Is my data secure and private?",
                answer: "Yes, your privacy is our priority. Your resume, profile data, and career assessments are stored securely and are never shared with third parties. We use industry-standard encryption and security practices to protect your information."
              },
              {
                question: "Is SmartApply AI free to use?",
                answer: "Yes! SmartApply AI is completely free to use. You can create an account, complete career assessments, get personalized recommendations, access learning roadmaps, and use our resume optimization features - all at no cost. Start your career journey today!"
              }
            ].map((faq, index) => (
              <NBCard key={index} className="border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden">
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full flex items-center justify-between p-6 text-left hover:bg-primary/5 transition-colors"
                >
                  <h3 className="text-lg font-bold text-foreground">{faq.question}</h3>
                  <div className="ml-4 flex-shrink-0">
                    {expandedFAQ === index ? (
                      <ChevronUp className="w-5 h-5 text-primary" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-muted-foreground" />
                    )}
                  </div>
                </button>
                {expandedFAQ === index && (
                  <div className="px-6 pb-6">
                    <p className="text-muted-foreground leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </NBCard>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
