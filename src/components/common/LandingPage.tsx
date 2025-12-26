import { useState, useEffect, useRef } from "react";
import {
  FileText,
  Brain,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  TrendingUp,
  Award,
  Target,
  BookOpen,
  BarChart3,
  Zap,
  MessageCircle,
} from "lucide-react";
import { Button } from "../ui/button";

interface LandingPageProps {
  onGetStarted: () => void;
}

interface FAQ {
  question: string;
  answer: string;
}

export function LandingPage({ onGetStarted }: LandingPageProps) {
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);

  // Custom hook for scroll animations
  const useScrollAnimation = () => {
    const [isVisible, setIsVisible] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          }
        },
        { threshold: 0.3 }
      );

      if (ref.current) {
        observer.observe(ref.current);
      }

      return () => {
        if (ref.current) {
          observer.unobserve(ref.current);
        }
      };
    }, []);

    return [ref, isVisible] as const;
  };

  const [aboutRef, aboutVisible] = useScrollAnimation();

  const features = [
    {
      icon: <Target className="h-8 w-8" />,
      title: "Personalized Career Recommendations",
      description: "AI-powered suggestions based on interests, academics, and market trends.",
      color: "bg-pink-100 text-pink-600",
    },
    {
      icon: <TrendingUp className="h-8 w-8" />,
      title: "Skill Gap Analysis & Roadmaps", 
      description: "Actionable learning plan with courses, projects, and certifications.",
      color: "bg-purple-100 text-purple-600",
    },
    {
      icon: <BarChart3 className="h-8 w-8" />,
      title: "Progress Tracker & Gamification",
      description: "Visual charts, badges, and milestones to track growth.",
      color: "bg-blue-100 text-blue-600",
    },
    {
      icon: <FileText className="h-8 w-8" />,
      title: "AI Resume Optimizer",
      description: "Upload your resume + job description → get ATS-friendly tailored resumes with match scores.",
      color: "bg-green-100 text-green-600",
    },
    {
      icon: <BookOpen className="h-8 w-8" />,
      title: "Notes Summarizer & Learning Assistant",
      description: "Upload lectures or PDFs → get summaries, flashcards, and quizzes.",
      color: "bg-orange-100 text-orange-600",
    },
    {
      icon: <MessageCircle className="h-8 w-8" />,
      title: "AI Career Chatbot",
      description: "Ask questions and get personalized guidance anytime.",
      color: "bg-cyan-100 text-cyan-600",
    },
  ];

  const whatWeDo = [
    {
      icon: <Target className="h-6 w-6" />,
      title: "Discover Career Paths",
      description: "Find careers aligned with your skills and interests.",
      color: "bg-pink-50 border-pink-200",
    },
    {
      icon: <TrendingUp className="h-6 w-6" />,
      title: "Identify Skill Gaps",
      description: "Generate actionable learning roadmaps tailored to your goals.",
      color: "bg-purple-50 border-purple-200",
    },
    {
      icon: <Award className="h-6 w-6" />,
      title: "Optimize Resumes",
      description: "Create ATS-friendly resumes for specific job roles.",
      color: "bg-blue-50 border-blue-200",
    },
    {
      icon: <Brain className="h-6 w-6" />,
      title: "Enhanced Learning",
      description: "AI-powered summaries, flashcards, and quizzes for better learning.",
      color: "bg-green-50 border-green-200",
    },
    {
      icon: <MessageCircle className="h-6 w-6" />,
      title: "Real-time Guidance",
      description: "Get instant advice from your AI career mentor.",
      color: "bg-orange-50 border-orange-200",
    },
  ];

  const faqs: FAQ[] = [
    {
      question: "Who can use SmartApply AI?",
      answer: "Any student looking to discover careers, build skills, or prepare for job applications can benefit from SmartApply AI.",
    },
    {
      question: "Does it cost anything?",
      answer: "SmartApply AI offers a free basic version with key features; advanced career insights and resume optimization may be premium.",
    },
    {
      question: "Can I upload notes in regional languages?",
      answer: "Yes! Our Notes Summarizer supports multiple Indian languages along with English.",
    },
    {
      question: "How is the resume optimized?",
      answer: "The AI analyzes your resume against job descriptions, highlights gaps, rewrites sections, and provides an ATS match score.",
    },
    {
      question: "Do I need prior experience to use the platform?",
      answer: "No. SmartApply AI is designed for students at any stage – beginner, intermediate, or advanced.",
    },
    {
      question: "Is my data secure?",
      answer: "Absolutely. All student data, resumes, and uploaded materials are securely stored with encryption and privacy safeguards.",
    },
  ];

  const toggleFAQ = (index: number) => {
    setExpandedFAQ(expandedFAQ === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      {/* Hero Section */}
      <section id="hero" className="relative py-16 px-4 overflow-hidden">
        <div className="container mx-auto max-w-6xl relative">
          <div className="text-center space-y-8 mb-16">
            <div className="inline-flex items-center gap-3 bg-gradient-to-r from-pink-100 to-purple-100 border border-pink-200 px-6 py-3 rounded-full text-sm font-medium text-purple-700">
              <Zap className="h-4 w-4" />
              AI-POWERED CAREER & SKILLS MENTOR
            </div>

            <div className="space-y-4">
              <h1 className="text-5xl md:text-7xl font-bold text-gray-800 leading-tight">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600">
                  SmartApply AI
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-700 font-medium">
                Your AI-Powered Career & Skills Mentor
              </p>
              <p className="text-lg text-gray-600 max-w-4xl mx-auto leading-relaxed">
                "Discover the right career path, build the skills you need, and get job-ready with personalized AI guidance, all in one platform."
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={onGetStarted}
                size="lg"
                className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white px-8 py-4 rounded-full text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Start Your Journey
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-2 border-purple-300 text-purple-600 hover:bg-purple-50 px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300"
              >
                Explore Features
              </Button>
            </div>
          </div>

          {/* Feature Preview Cards */}
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-pink-100">
              <div className="w-16 h-16 bg-gradient-to-r from-pink-400 to-pink-500 rounded-2xl flex items-center justify-center mb-6">
                <Target className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Career Discovery</h3>
              <p className="text-gray-600">Find your perfect career path with AI-powered recommendations</p>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-purple-100">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-400 to-purple-500 rounded-2xl flex items-center justify-center mb-6">
                <TrendingUp className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Skill Building</h3>
              <p className="text-gray-600">Get personalized learning roadmaps and track your progress</p>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-blue-100">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-400 to-blue-500 rounded-2xl flex items-center justify-center mb-6">
                <FileText className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Resume Optimization</h3>
              <p className="text-gray-600">Create ATS-friendly resumes with AI-powered optimization</p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div
            ref={aboutRef}
            className={`bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 rounded-3xl p-16 text-center transition-all duration-1000 relative overflow-hidden shadow-2xl ${
              aboutVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
          >
            <div className="relative z-10">
              <div className="text-center">
                <div className="inline-flex items-center gap-2 bg-white/90 text-purple-700 px-6 py-3 rounded-full text-sm font-semibold mb-8">
                  ABOUT SMARTAPPLY AI
                </div>
                <h2
                  className={`text-4xl md:text-5xl font-bold text-white mb-8 transition-all duration-1000 delay-300 ${
                    aboutVisible
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-10"
                  }`}
                >
                  About SmartApply AI
                </h2>
                <p
                  className={`text-xl text-white/90 max-w-4xl mx-auto leading-relaxed transition-all duration-1000 delay-500 ${
                    aboutVisible
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-10"
                  }`}
                >
                  SmartApply AI is an AI-driven education platform designed to empower students with personalized career guidance, skill-building roadmaps, and job readiness tools. By combining Generative AI, resume optimization, and learning support, SmartApply AI ensures students are prepared for the ever-evolving job market while making learning efficient, engaging, and goal-oriented.
                </p>
              </div>
            </div>
          </div>

          {/* Who Are We */}
          <div className="mt-20 text-center">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-100 to-pink-100 border border-orange-200 px-6 py-3 rounded-full text-sm font-semibold text-orange-700 mb-8">
              WHO ARE WE
            </div>
            <h3 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
              We are <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-pink-500">education enthusiasts</span> and AI innovators
            </h3>
            <p className="text-lg text-gray-600 max-w-4xl mx-auto leading-relaxed">
              We are committed to bridging the gap between learning and career opportunities. Our mission is to empower students in India and beyond by providing personalized, actionable, and future-ready guidance that transforms ambition into success.
            </p>
          </div>
        </div>
      </section>

      {/* What We Do Section */}
      <section id="what-we-do" className="py-16 px-4 bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-100 to-purple-100 border border-blue-200 px-6 py-3 rounded-full text-sm font-semibold text-blue-700 mb-8">
              WHAT WE DO
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">SmartApply AI</span> helps students
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Comprehensive support for every step of your educational and career journey
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {whatWeDo.map((item, index) => (
              <div
                key={index}
                className={`${item.color} rounded-2xl p-6 hover:shadow-lg transition-all duration-300 border-2`}
              >
                <div className="flex items-start gap-4">
                  <div className="bg-white rounded-xl p-3 shadow-sm">
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-2">
                      {item.title}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {item.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-green-100 to-cyan-100 border border-green-200 px-6 py-3 rounded-full text-sm font-semibold text-green-700 mb-8">
              FEATURES
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
              Everything you need for{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-cyan-600">
                career success
              </span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Comprehensive AI-powered tools designed to guide you from learning to landing your dream job
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
              >
                <div className={`${feature.color} w-16 h-16 rounded-2xl flex items-center justify-center mb-6`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 px-4 bg-gradient-to-r from-pink-50 to-orange-50">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-100 to-orange-100 border border-pink-200 px-6 py-3 rounded-full text-sm font-semibold text-pink-700 mb-8">
              FREQUENTLY ASKED QUESTIONS
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
              Common questions
            </h2>
            <p className="text-lg text-gray-600">
              Find answers to frequently asked questions about SmartApply AI
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="border-2 border-pink-100 rounded-2xl overflow-hidden bg-white hover:shadow-lg transition-all duration-300"
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full flex items-center justify-between p-6 text-left hover:bg-pink-50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="bg-gradient-to-r from-pink-500 to-orange-500 text-white w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </div>
                    <span className="font-semibold text-gray-800 text-lg">
                      {faq.question}
                    </span>
                  </div>
                  {expandedFAQ === index ? (
                    <ChevronUp className="h-6 w-6 text-gray-600" />
                  ) : (
                    <ChevronDown className="h-6 w-6 text-gray-600" />
                  )}
                </button>
                {expandedFAQ === index && (
                  <div className="px-6 pb-6">
                    <div className="pl-14">
                      <p className="text-gray-600 leading-relaxed text-lg">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 rounded-3xl p-16 relative overflow-hidden shadow-2xl">
            <div className="relative z-10 text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Ready to start your{" "}
                <span className="text-purple-100">
                  career journey?
                </span>
              </h2>
              <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                Join thousands of students who are already building their future with SmartApply AI's AI-powered guidance
              </p>
              <Button
                onClick={onGetStarted}
                size="lg"
                className="bg-white hover:bg-gray-100 text-purple-600 px-10 py-4 rounded-full text-lg font-bold transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Get Started Today
                <ArrowRight className="h-6 w-6 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-gray-50 to-blue-50 py-12 px-4 border-t border-gray-200">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center space-y-6">
            <div className="flex items-center justify-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-purple-500 rounded-xl flex items-center justify-center">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-gray-800">SmartApply AI</span>
            </div>
            <p className="text-lg font-medium text-gray-600">
              Empowering Students, Enabling Careers
            </p>
            <div className="border-t border-gray-300 pt-6">
              <p className="text-gray-500">
                © 2025 SmartApply AI. All Rights Reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}