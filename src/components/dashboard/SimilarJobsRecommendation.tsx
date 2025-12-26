import React, { useState, useEffect } from 'react';
import { Briefcase, TrendingUp, MapPin, DollarSign, ExternalLink, Bookmark } from 'lucide-react';
import { NBCard } from '@/components/NBCard';
import { NBButton } from '@/components/NBButton';
import { AlternativeCareer, EnhancedUserProfile } from '@/lib/types';
import { toast } from 'sonner';

interface SimilarJobsRecommendationProps {
  profile: EnhancedUserProfile;
  onViewJobDetails: (jobId: string, job?: AlternativeCareer) => void;
  onSaveJob: (jobId: string) => void;
  onViewAllJobs: () => void;
}

type ExperienceFilter = 'all' | 'entry' | 'mid' | 'senior' | 'internships';

/**
 * Similar jobs recommendation section showing related career opportunities
 * Requirements: 8.1, 8.2, 8.3, 8.4 - Display similar job roles with different experience levels and internships
 */
export const SimilarJobsRecommendation: React.FC<SimilarJobsRecommendationProps> = ({
  profile,
  onViewJobDetails,
  onSaveJob,
  onViewAllJobs
}) => {
  const [experienceFilter, setExperienceFilter] = useState<ExperienceFilter>('all');
  const [allAvailableJobs, setAllAvailableJobs] = useState<AlternativeCareer[]>([]);

  // Get similar jobs from career recommendations
  useEffect(() => {
    console.log('🔍 Loading similar jobs for:', profile.careerInterest);
    console.log('📊 Career recommendations:', profile.careerRecommendations);
    
    // Get alternatives from career recommendations
    const jobsFromRecommendations = profile.careerRecommendations
      ?.flatMap(rec => rec.alternatives || []) || [];
    
    console.log('💼 Jobs from recommendations:', jobsFromRecommendations);
    
    // If we have jobs, use them
    if (jobsFromRecommendations.length > 0) {
      setAllAvailableJobs(jobsFromRecommendations);
    } else {
      // Otherwise, create relevant jobs based on career interest
      const relevantJobs = generateRelevantJobs(profile.careerInterest || '');
      console.log('🎯 Generated relevant jobs:', relevantJobs);
      setAllAvailableJobs(relevantJobs);
    }
  }, [profile]);

  // Generate relevant jobs based on career interest
  const generateRelevantJobs = (careerInterest: string): AlternativeCareer[] => {
    const career = careerInterest.toLowerCase();
    
    // ===== TECHNOLOGY & COMPUTER SCIENCE =====
    
    // Cybersecurity / Penetration Testing
    if (career.includes('penetration') || career.includes('pentester') || 
        career.includes('security') || career.includes('ethical hack') || career.includes('cybersec')) {
      return [
        { id: 'sec1', title: 'Security Analyst', description: 'Monitor and respond to security threats', matchScore: 90, salary: '$70k-100k', requirements: ['Security Monitoring', 'Incident Response', 'SIEM'], growth: 'high', experienceLevel: 'mid' },
        { id: 'sec2', title: 'Ethical Hacker', description: 'Identify vulnerabilities through authorized hacking', matchScore: 92, salary: '$80k-120k', requirements: ['Penetration Testing', 'Vulnerability Assessment', 'Exploits'], growth: 'high', experienceLevel: 'mid' },
        { id: 'sec3', title: 'SOC Analyst', description: 'Work in Security Operations Center', matchScore: 85, salary: '$65k-95k', requirements: ['Threat Detection', 'Log Analysis', 'Security Tools'], growth: 'high', experienceLevel: 'entry' },
        { id: 'sec4', title: 'Security Engineer', description: 'Design and implement security systems', matchScore: 88, salary: '$90k-130k', requirements: ['Security Architecture', 'Firewalls', 'Encryption'], growth: 'high', experienceLevel: 'senior' },
        { id: 'sec5', title: 'Security Intern', description: 'Gain hands-on experience in ethical hacking', matchScore: 80, salary: '$15-25/hour', requirements: ['Basic security', 'Networking', 'Linux'], growth: 'high', experienceLevel: 'internship' },
      ];
    }
    
    // Data Science
    if (career.includes('data scien') || career.includes('ml engineer') || career.includes('machine learning')) {
      return [
        { id: 'ds1', title: 'Data Analyst', description: 'Analyze data to drive business decisions', matchScore: 88, salary: '$65k-90k', requirements: ['SQL', 'Python', 'Data Visualization'], growth: 'high', experienceLevel: 'entry' },
        { id: 'ds2', title: 'ML Engineer', description: 'Build and deploy machine learning models', matchScore: 92, salary: '$110k-150k', requirements: ['Python', 'TensorFlow', 'MLOps'], growth: 'very high', experienceLevel: 'mid' },
        { id: 'ds3', title: 'AI Research Scientist', description: 'Research and develop AI algorithms', matchScore: 90, salary: '$120k-180k', requirements: ['Deep Learning', 'Research', 'Python'], growth: 'very high', experienceLevel: 'senior' },
        { id: 'ds4', title: 'Data Engineer', description: 'Build data pipelines and infrastructure', matchScore: 85, salary: '$90k-130k', requirements: ['SQL', 'Spark', 'AWS'], growth: 'high', experienceLevel: 'mid' },
        { id: 'ds5', title: 'Data Science Intern', description: 'Learn data analysis and ML basics', matchScore: 82, salary: '$18-30/hour', requirements: ['Python', 'Statistics', 'Pandas'], growth: 'high', experienceLevel: 'internship' },
      ];
    }
    
    // Software Developer
    if (career.includes('software') || career.includes('developer') || career.includes('programmer') || 
        career.includes('frontend') || career.includes('backend') || career.includes('fullstack')) {
      return [
        { id: 'dev1', title: 'Frontend Developer', description: 'Build user interfaces with React/Vue', matchScore: 90, salary: '$70k-110k', requirements: ['JavaScript', 'React', 'CSS'], growth: 'high', experienceLevel: 'mid' },
        { id: 'dev2', title: 'Backend Developer', description: 'Build server-side applications', matchScore: 88, salary: '$80k-120k', requirements: ['Node.js', 'Python', 'Databases'], growth: 'high', experienceLevel: 'mid' },
        { id: 'dev3', title: 'Full Stack Developer', description: 'Work on both frontend and backend', matchScore: 92, salary: '$90k-140k', requirements: ['JavaScript', 'Node.js', 'React'], growth: 'very high', experienceLevel: 'senior' },
        { id: 'dev4', title: 'Junior Developer', description: 'Entry-level programming role', matchScore: 85, salary: '$50k-70k', requirements: ['JavaScript', 'HTML/CSS', 'Git'], growth: 'high', experienceLevel: 'entry' },
        { id: 'dev5', title: 'Software Engineering Intern', description: 'Learn software development', matchScore: 80, salary: '$20-35/hour', requirements: ['Programming basics', 'Git', 'Problem solving'], growth: 'high', experienceLevel: 'internship' },
      ];
    }
    
    // ===== HEALTHCARE =====
    
    if (career.includes('doctor') || career.includes('physician')) {
      return [
        { id: 'med1', title: 'Medical Specialist', description: 'Specialize in specific medical field', matchScore: 92, salary: '$200k-350k', requirements: ['Medical Degree', 'Residency', 'Board Certification'], growth: 'high', experienceLevel: 'senior' },
        { id: 'med2', title: 'General Practitioner', description: 'Provide primary care services', matchScore: 90, salary: '$150k-220k', requirements: ['MD/DO', 'Medical License', 'Patient Care'], growth: 'high', experienceLevel: 'mid' },
        { id: 'med3', title: 'Resident Physician', description: 'Complete medical residency training', matchScore: 88, salary: '$55k-70k', requirements: ['Medical Degree', 'Residency Program'], growth: 'high', experienceLevel: 'entry' },
        { id: 'med4', title: 'Medical Director', description: 'Lead medical teams and programs', matchScore: 85, salary: '$250k-400k', requirements: ['MD', 'Leadership', 'Healthcare Management'], growth: 'medium', experienceLevel: 'senior' },
      ];
    }
    
    if (career.includes('nurse') || career.includes('nursing')) {
      return [
        { id: 'nur1', title: 'Registered Nurse', description: 'Provide direct patient care', matchScore: 92, salary: '$60k-85k', requirements: ['Nursing Degree', 'RN License', 'Patient Care'], growth: 'high', experienceLevel: 'mid' },
        { id: 'nur2', title: 'Nurse Practitioner', description: 'Advanced practice nursing role', matchScore: 90, salary: '$95k-120k', requirements: ['MSN', 'NP License', 'Clinical Skills'], growth: 'very high', experienceLevel: 'senior' },
        { id: 'nur3', title: 'LPN/LVN', description: 'Licensed practical nursing', matchScore: 85, salary: '$40k-55k', requirements: ['LPN Certificate', 'Basic Care', 'Compassion'], growth: 'medium', experienceLevel: 'entry' },
        { id: 'nur4', title: 'Nursing Supervisor', description: 'Lead nursing teams and units', matchScore: 88, salary: '$75k-100k', requirements: ['RN', 'Leadership', 'Management'], growth: 'high', experienceLevel: 'senior' },
        { id: 'nur5', title: 'Nursing Intern', description: 'Clinical nursing student placement', matchScore: 80, salary: '$15-22/hour', requirements: ['Nursing Student', 'Basic Care', 'Learning'], growth: 'high', experienceLevel: 'internship' },
      ];
    }
    
    // ===== CONSTRUCTION =====
    
    if (career.includes('construction') || career.includes('builder') || career.includes('contractor')) {
      return [
        { id: 'con1', title: 'Project Manager', description: 'Oversee construction projects', matchScore: 90, salary: '$65k-95k', requirements: ['Project Management', 'Scheduling', 'Budgeting'], growth: 'high', experienceLevel: 'senior' },
        { id: 'con2', title: 'Site Supervisor', description: 'Manage on-site construction operations', matchScore: 88, salary: '$55k-80k', requirements: ['Site Management', 'Safety', 'Coordination'], growth: 'medium', experienceLevel: 'mid' },
        { id: 'con3', title: 'Assistant Project Manager', description: 'Support construction projects', matchScore: 85, salary: '$45k-65k', requirements: ['Construction Knowledge', 'Organization', 'Communication'], growth: 'high', experienceLevel: 'entry' },
        { id: 'con4', title: 'Construction Estimator', description: 'Calculate project costs', matchScore: 82, salary: '$60k-85k', requirements: ['Cost Analysis', 'Blueprints', 'Math'], growth: 'medium', experienceLevel: 'mid' },
        { id: 'con5', title: 'Construction Intern', description: 'Learn construction management', matchScore: 80, salary: '$14-20/hour', requirements: ['Basic Construction', 'Safety', 'Teamwork'], growth: 'high', experienceLevel: 'internship' },
      ];
    }
    
    // ===== ENGINEERING =====
    
    if (career.includes('civil engineer')) {
      return [
        { id: 'civ1', title: 'Structural Engineer', description: 'Design building structures', matchScore: 92, salary: '$70k-105k', requirements: ['Structural Analysis', 'AutoCAD', 'PE License'], growth: 'high', experienceLevel: 'senior' },
        { id: 'civ2', title: 'Transportation Engineer', description: 'Design roads and transit systems', matchScore: 88, salary: '$65k-95k', requirements: ['Civil Engineering', 'Traffic Analysis', 'CAD'], growth: 'medium', experienceLevel: 'mid' },
        { id: 'civ3', title: 'Project Engineer', description: 'Manage engineering projects', matchScore: 90, salary: '$75k-110k', requirements: ['Engineering', 'Project Management', 'Technical Skills'], growth: 'high', experienceLevel: 'mid' },
        { id: 'civ4', title: 'Junior Civil Engineer', description: 'Entry-level engineering work', matchScore: 85, salary: '$55k-75k', requirements: ['Civil Engineering Degree', 'CAD', 'Math'], growth: 'high', experienceLevel: 'entry' },
        { id: 'civ5', title: 'Engineering Intern', description: 'Learn civil engineering practices', matchScore: 80, salary: '$18-28/hour', requirements: ['Engineering Student', 'AutoCAD', 'Problem Solving'], growth: 'high', experienceLevel: 'internship' },
      ];
    }
    
    if (career.includes('mechanical engineer')) {
      return [
        { id: 'mech1', title: 'Design Engineer', description: 'Design mechanical systems and products', matchScore: 92, salary: '$70k-100k', requirements: ['CAD', 'Mechanical Design', 'Engineering'], growth: 'high', experienceLevel: 'mid' },
        { id: 'mech2', title: 'Manufacturing Engineer', description: 'Optimize production processes', matchScore: 88, salary: '$65k-95k', requirements: ['Manufacturing', 'Process Improvement', 'Quality'], growth: 'high', experienceLevel: 'mid' },
        { id: 'mech3', title: 'Robotics Engineer', description: 'Design and build robotic systems', matchScore: 90, salary: '$80k-120k', requirements: ['Robotics', 'Programming', 'Mechanical Design'], growth: 'very high', experienceLevel: 'senior' },
        { id: 'mech4', title: 'Junior Mechanical Engineer', description: 'Entry-level mechanical engineering', matchScore: 85, salary: '$58k-78k', requirements: ['Mechanical Engineering', 'CAD', 'Thermodynamics'], growth: 'high', experienceLevel: 'entry' },
        { id: 'mech5', title: 'Mechanical Engineering Intern', description: 'Hands-on engineering experience', matchScore: 80, salary: '$18-30/hour', requirements: ['Engineering Student', 'CAD', 'Mechanics'], growth: 'high', experienceLevel: 'internship' },
      ];
    }
    
    if (career.includes('electrical engineer')) {
      return [
        { id: 'elec1', title: 'Power Systems Engineer', description: 'Design electrical power systems', matchScore: 92, salary: '$75k-110k', requirements: ['Power Systems', 'Circuit Design', 'PE License'], growth: 'high', experienceLevel: 'senior' },
        { id: 'elec2', title: 'Electronics Engineer', description: 'Design electronic circuits and devices', matchScore: 90, salary: '$70k-100k', requirements: ['Circuit Design', 'PCB', 'Electronics'], growth: 'high', experienceLevel: 'mid' },
        { id: 'elec3', title: 'Controls Engineer', description: 'Design automation and control systems', matchScore: 88, salary: '$72k-105k', requirements: ['PLC', 'Automation', 'Control Systems'], growth: 'high', experienceLevel: 'mid' },
        { id: 'elec4', title: 'Junior Electrical Engineer', description: 'Entry-level electrical engineering', matchScore: 85, salary: '$60k-80k', requirements: ['Electrical Engineering', 'Circuit Analysis', 'Math'], growth: 'high', experienceLevel: 'entry' },
        { id: 'elec5', title: 'Electrical Engineering Intern', description: 'Learn electrical engineering', matchScore: 80, salary: '$19-32/hour', requirements: ['Engineering Student', 'Circuits', 'Problem Solving'], growth: 'high', experienceLevel: 'internship' },
      ];
    }
    
    // ===== EDUCATION =====
    
    if (career.includes('teacher') || career.includes('educator')) {
      return [
        { id: 'teach1', title: 'Lead Teacher', description: 'Senior classroom teaching position', matchScore: 90, salary: '$55k-80k', requirements: ['Teaching License', 'Curriculum Design', 'Leadership'], growth: 'medium', experienceLevel: 'senior' },
        { id: 'teach2', title: 'Department Head', description: 'Lead subject department', matchScore: 88, salary: '$65k-95k', requirements: ['Teaching Experience', 'Leadership', 'Administration'], growth: 'medium', experienceLevel: 'senior' },
        { id: 'teach3', title: 'Instructional Designer', description: 'Design educational content', matchScore: 85, salary: '$58k-85k', requirements: ['Instructional Design', 'E-Learning', 'Curriculum'], growth: 'high', experienceLevel: 'mid' },
        { id: 'teach4', title: 'Elementary Teacher', description: 'Teach K-5 students', matchScore: 92, salary: '$40k-65k', requirements: ['Teaching License', 'Classroom Management', 'Patience'], growth: 'medium', experienceLevel: 'entry' },
        { id: 'teach5', title: 'Student Teacher', description: 'Complete teaching practicum', matchScore: 80, salary: '$0-15/hour', requirements: ['Education Student', 'Observation', 'Lesson Planning'], growth: 'high', experienceLevel: 'internship' },
      ];
    }
    
    if (career.includes('professor')) {
      return [
        { id: 'prof1', title: 'Associate Professor', description: 'Tenured university faculty', matchScore: 90, salary: '$70k-110k', requirements: ['PhD', 'Research', 'Teaching'], growth: 'medium', experienceLevel: 'senior' },
        { id: 'prof2', title: 'Assistant Professor', description: 'Entry-level tenure track', matchScore: 92, salary: '$60k-90k', requirements: ['PhD', 'Research', 'Publications'], growth: 'medium', experienceLevel: 'mid' },
        { id: 'prof3', title: 'Research Scientist', description: 'Academic research position', matchScore: 88, salary: '$65k-100k', requirements: ['PhD', 'Research', 'Grants'], growth: 'high', experienceLevel: 'mid' },
        { id: 'prof4', title: 'Adjunct Professor', description: 'Part-time teaching role', matchScore: 85, salary: '$30k-50k', requirements: ['Graduate Degree', 'Teaching', 'Subject Expertise'], growth: 'low', experienceLevel: 'entry' },
      ];
    }
    
    // ===== LEGAL =====
    
    if (career.includes('lawyer') || career.includes('attorney')) {
      return [
        { id: 'law1', title: 'Senior Partner', description: 'Lead law firm partnership', matchScore: 90, salary: '$150k-300k', requirements: ['Law Degree', 'Bar License', 'Leadership'], growth: 'medium', experienceLevel: 'senior' },
        { id: 'law2', title: 'Corporate Counsel', description: 'In-house legal advisor', matchScore: 88, salary: '$100k-180k', requirements: ['Law Degree', 'Bar License', 'Business Law'], growth: 'high', experienceLevel: 'senior' },
        { id: 'law3', title: 'Attorney', description: 'Represent clients in legal matters', matchScore: 92, salary: '$80k-150k', requirements: ['JD', 'Bar License', 'Legal Research'], growth: 'medium', experienceLevel: 'mid' },
        { id: 'law4', title: 'Associate Attorney', description: 'Entry-level lawyer position', matchScore: 85, salary: '$60k-100k', requirements: ['Law Degree', 'Bar Exam', 'Research'], growth: 'high', experienceLevel: 'entry' },
        { id: 'law5', title: 'Legal Intern', description: 'Law student internship', matchScore: 80, salary: '$15-25/hour', requirements: ['Law Student', 'Research', 'Writing'], growth: 'high', experienceLevel: 'internship' },
      ];
    }
    
    if (career.includes('paralegal')) {
      return [
        { id: 'para1', title: 'Senior Paralegal', description: 'Experienced legal support professional', matchScore: 90, salary: '$55k-75k', requirements: ['Paralegal Certificate', 'Legal Research', 'Experience'], growth: 'medium', experienceLevel: 'senior' },
        { id: 'para2', title: 'Litigation Paralegal', description: 'Support litigation attorneys', matchScore: 88, salary: '$45k-65k', requirements: ['Legal Knowledge', 'Court Procedures', 'Organization'], growth: 'medium', experienceLevel: 'mid' },
        { id: 'para3', title: 'Legal Assistant', description: 'Assist lawyers with legal work', matchScore: 92, salary: '$35k-50k', requirements: ['Legal Knowledge', 'Research', 'Documentation'], growth: 'medium', experienceLevel: 'entry' },
        { id: 'para4', title: 'Compliance Officer', description: 'Ensure regulatory compliance', matchScore: 85, salary: '$60k-95k', requirements: ['Compliance', 'Regulations', 'Risk Management'], growth: 'high', experienceLevel: 'mid' },
      ];
    }
    
    // ===== FINANCE =====
    
    if (career.includes('accountant') || career.includes('cpa')) {
      return [
        { id: 'acc1', title: 'Senior Accountant', description: 'Manage accounting operations', matchScore: 90, salary: '$65k-90k', requirements: ['CPA', 'Accounting', 'Financial Reporting'], growth: 'medium', experienceLevel: 'senior' },
        { id: 'acc2', title: 'Tax Accountant', description: 'Specialize in tax preparation', matchScore: 88, salary: '$55k-80k', requirements: ['Accounting', 'Tax Law', 'CPA'], growth: 'medium', experienceLevel: 'mid' },
        { id: 'acc3', title: 'Staff Accountant', description: 'General accounting duties', matchScore: 92, salary: '$45k-65k', requirements: ['Accounting Degree', 'Excel', 'Bookkeeping'], growth: 'medium', experienceLevel: 'entry' },
        { id: 'acc4', title: 'Auditor', description: 'Examine financial records', matchScore: 85, salary: '$60k-85k', requirements: ['Accounting', 'Auditing', 'CPA'], growth: 'medium', experienceLevel: 'mid' },
        { id: 'acc5', title: 'Accounting Intern', description: 'Learn accounting practices', matchScore: 80, salary: '$15-25/hour', requirements: ['Accounting Student', 'Excel', 'Math'], growth: 'high', experienceLevel: 'internship' },
      ];
    }
    
    if (career.includes('financial analyst') || career.includes('finance')) {
      return [
        { id: 'fin1', title: 'Investment Banker', description: 'Facilitate financial transactions', matchScore: 90, salary: '$100k-200k', requirements: ['Finance', 'M&A', 'Client Relations'], growth: 'high', experienceLevel: 'senior' },
        { id: 'fin2', title: 'Portfolio Manager', description: 'Manage investment portfolios', matchScore: 88, salary: '$90k-150k', requirements: ['Investment', 'Portfolio Management', 'CFA'], growth: 'high', experienceLevel: 'senior' },
        { id: 'fin3', title: 'Financial Analyst', description: 'Analyze financial data', matchScore: 92, salary: '$60k-90k', requirements: ['Financial Analysis', 'Excel', 'Modeling'], growth: 'high', experienceLevel: 'mid' },
        { id: 'fin4', title: 'Junior Financial Analyst', description: 'Entry-level financial analysis', matchScore: 85, salary: '$50k-70k', requirements: ['Finance Degree', 'Excel', 'Math'], growth: 'high', experienceLevel: 'entry' },
        { id: 'fin5', title: 'Finance Intern', description: 'Learn financial analysis', matchScore: 80, salary: '$18-30/hour', requirements: ['Finance Student', 'Excel', 'Analytics'], growth: 'high', experienceLevel: 'internship' },
      ];
    }
    
    // ===== CREATIVE & DESIGN =====
    
    if (career.includes('motion graphics') || career.includes('motion designer')) {
      return [
        { id: 'mg1', title: '3D Animator', description: 'Create 3D animations and visual effects', matchScore: 90, salary: '$55k-85k', requirements: ['Cinema 4D', 'Blender', '3D Animation'], growth: 'high', experienceLevel: 'mid' },
        { id: 'mg2', title: 'VFX Artist', description: 'Create visual effects for film/TV', matchScore: 92, salary: '$60k-95k', requirements: ['After Effects', 'Compositing', 'VFX'], growth: 'high', experienceLevel: 'mid' },
        { id: 'mg3', title: 'Video Editor', description: 'Edit and produce video content', matchScore: 88, salary: '$45k-75k', requirements: ['Premiere Pro', 'Editing', 'Storytelling'], growth: 'medium', experienceLevel: 'entry' },
        { id: 'mg4', title: 'Creative Director', description: 'Lead creative teams and projects', matchScore: 85, salary: '$80k-130k', requirements: ['Creative Leadership', 'Strategy', 'Design'], growth: 'medium', experienceLevel: 'senior' },
        { id: 'mg5', title: 'Motion Design Intern', description: 'Learn motion graphics', matchScore: 80, salary: '$15-25/hour', requirements: ['After Effects', 'Animation basics', 'Creativity'], growth: 'high', experienceLevel: 'internship' },
      ];
    }
    
    if (career.includes('graphic design') || career.includes('graphic designer')) {
      return [
        { id: 'gd1', title: 'Brand Designer', description: 'Create brand identities', matchScore: 90, salary: '$55k-85k', requirements: ['Branding', 'Adobe Suite', 'Typography'], growth: 'medium', experienceLevel: 'mid' },
        { id: 'gd2', title: 'Art Director', description: 'Lead creative visual direction', matchScore: 88, salary: '$70k-110k', requirements: ['Creative Direction', 'Leadership', 'Design'], growth: 'medium', experienceLevel: 'senior' },
        { id: 'gd3', title: 'Visual Designer', description: 'Create visual designs for digital/print', matchScore: 92, salary: '$50k-75k', requirements: ['Photoshop', 'Illustrator', 'Design Principles'], growth: 'high', experienceLevel: 'mid' },
        { id: 'gd4', title: 'Junior Graphic Designer', description: 'Entry-level design work', matchScore: 85, salary: '$35k-55k', requirements: ['Adobe Suite', 'Creativity', 'Portfolio'], growth: 'high', experienceLevel: 'entry' },
        { id: 'gd5', title: 'Graphic Design Intern', description: 'Learn graphic design', matchScore: 80, salary: '$12-20/hour', requirements: ['Design basics', 'Adobe Suite', 'Creativity'], growth: 'high', experienceLevel: 'internship' },
      ];
    }
    
    if (career.includes('ui') || career.includes('ux') || (career.includes('design') && (career.includes('product') || career.includes('user')))) {
      return [
        { id: 'ux1', title: 'Product Designer', description: 'Design end-to-end product experiences', matchScore: 92, salary: '$80k-130k', requirements: ['UX/UI Design', 'Figma', 'User Research'], growth: 'very high', experienceLevel: 'senior' },
        { id: 'ux2', title: 'UX Researcher', description: 'Conduct user research studies', matchScore: 88, salary: '$70k-110k', requirements: ['User Research', 'Data Analysis', 'UX Methods'], growth: 'high', experienceLevel: 'mid' },
        { id: 'ux3', title: 'UI Designer', description: 'Design user interfaces', matchScore: 90, salary: '$60k-95k', requirements: ['UI Design', 'Figma', 'Design Systems'], growth: 'high', experienceLevel: 'mid' },
        { id: 'ux4', title: 'Junior UX Designer', description: 'Entry-level UX/UI design', matchScore: 85, salary: '$50k-70k', requirements: ['Figma', 'Design basics', 'User-centered design'], growth: 'very high', experienceLevel: 'entry' },
        { id: 'ux5', title: 'UX Design Intern', description: 'Learn UX/UI design', matchScore: 80, salary: '$18-28/hour', requirements: ['Design interest', 'Figma basics', 'Research'], growth: 'high', experienceLevel: 'internship' },
      ];
    }
    
    // ===== BUSINESS =====
    
    if (career.includes('business analyst')) {
      return [
        { id: 'ba1', title: 'Senior Business Analyst', description: 'Lead business analysis projects', matchScore: 90, salary: '$80k-110k', requirements: ['Business Analysis', 'Requirements', 'Strategy'], growth: 'high', experienceLevel: 'senior' },
        { id: 'ba2', title: 'Product Manager', description: 'Manage product development lifecycle', matchScore: 88, salary: '$90k-140k', requirements: ['Product Strategy', 'Roadmapping', 'Leadership'], growth: 'very high', experienceLevel: 'senior' },
        { id: 'ba3', title: 'Business Systems Analyst', description: 'Analyze and improve business systems', matchScore: 85, salary: '$65k-95k', requirements: ['Analysis', 'Documentation', 'Process Improvement'], growth: 'high', experienceLevel: 'mid' },
        { id: 'ba4', title: 'Junior Business Analyst', description: 'Entry-level business analysis', matchScore: 92, salary: '$50k-70k', requirements: ['Analysis', 'Communication', 'Problem Solving'], growth: 'high', experienceLevel: 'entry' },
        { id: 'ba5', title: 'Business Analyst Intern', description: 'Learn business analysis', matchScore: 80, salary: '$16-25/hour', requirements: ['Analytical thinking', 'Excel', 'Communication'], growth: 'high', experienceLevel: 'internship' },
      ];
    }
    
    if (career.includes('product manager') || career.includes('product management')) {
      return [
        { id: 'pm1', title: 'Senior Product Manager', description: 'Lead product strategy and teams', matchScore: 92, salary: '$120k-180k', requirements: ['Product Strategy', 'Leadership', 'Analytics'], growth: 'very high', experienceLevel: 'senior' },
        { id: 'pm2', title: 'Product Owner', description: 'Own product backlog and priorities', matchScore: 88, salary: '$85k-125k', requirements: ['Agile', 'Backlog Management', 'Stakeholder Management'], growth: 'high', experienceLevel: 'mid' },
        { id: 'pm3', title: 'Associate Product Manager', description: 'Entry-level product management', matchScore: 90, salary: '$70k-100k', requirements: ['Product thinking', 'Analytics', 'Communication'], growth: 'very high', experienceLevel: 'entry' },
        { id: 'pm4', title: 'Product Marketing Manager', description: 'Market and promote products', matchScore: 85, salary: '$80k-120k', requirements: ['Marketing', 'Product', 'Go-to-Market'], growth: 'high', experienceLevel: 'mid' },
        { id: 'pm5', title: 'Product Management Intern', description: 'Learn product management', matchScore: 80, salary: '$20-35/hour', requirements: ['Product interest', 'Analytics', 'Communication'], growth: 'high', experienceLevel: 'internship' },
      ];
    }
    
    // ===== SCIENCE & RESEARCH =====
    
    if (career.includes('research scientist') || (career.includes('scientist') && career.includes('research'))) {
      return [
        { id: 'rs1', title: 'Principal Scientist', description: 'Lead research programs', matchScore: 90, salary: '$110k-160k', requirements: ['PhD', 'Research Leadership', 'Publications'], growth: 'medium', experienceLevel: 'senior' },
        { id: 'rs2', title: 'Senior Research Scientist', description: 'Conduct advanced research', matchScore: 92, salary: '$90k-135k', requirements: ['PhD', 'Research Methods', 'Expertise'], growth: 'high', experienceLevel: 'senior' },
        { id: 'rs3', title: 'Postdoctoral Researcher', description: 'Post-PhD research position', matchScore: 88, salary: '$45k-65k', requirements: ['PhD', 'Research', 'Publications'], growth: 'high', experienceLevel: 'mid' },
        { id: 'rs4', title: 'Research Associate', description: 'Support research projects', matchScore: 85, salary: '$40k-60k', requirements: ['Research Skills', 'Lab Techniques', 'Data Analysis'], growth: 'medium', experienceLevel: 'entry' },
        { id: 'rs5', title: 'Research Intern', description: 'Learn research methods', matchScore: 80, salary: '$15-25/hour', requirements: ['Science background', 'Curiosity', 'Lab basics'], growth: 'high', experienceLevel: 'internship' },
      ];
    }
    
    if (career.includes('climate') || career.includes('environmental')) {
      return [
        { id: 'env1', title: 'Environmental Scientist', description: 'Study environmental issues', matchScore: 90, salary: '$60k-90k', requirements: ['Environmental Science', 'Research', 'Data Analysis'], growth: 'high', experienceLevel: 'mid' },
        { id: 'env2', title: 'Sustainability Consultant', description: 'Advise on sustainability practices', matchScore: 88, salary: '$70k-110k', requirements: ['Sustainability', 'Consulting', 'Environmental Policy'], growth: 'very high', experienceLevel: 'senior' },
        { id: 'env3', title: 'Conservation Biologist', description: 'Protect endangered species and habitats', matchScore: 85, salary: '$55k-80k', requirements: ['Biology', 'Ecology', 'Conservation'], growth: 'medium', experienceLevel: 'mid' },
        { id: 'env4', title: 'Environmental Technician', description: 'Collect and analyze environmental data', matchScore: 92, salary: '$35k-55k', requirements: ['Environmental Science', 'Field Work', 'Lab Skills'], growth: 'medium', experienceLevel: 'entry' },
        { id: 'env5', title: 'Environmental Intern', description: 'Gain environmental science experience', matchScore: 80, salary: '$14-22/hour', requirements: ['Science background', 'Field work', 'Data collection'], growth: 'high', experienceLevel: 'internship' },
      ];
    }
    
    // Default fallback
    return [
      { id: 'def1', title: `Senior ${careerInterest}`, description: `Lead role in ${careerInterest}`, matchScore: 88, salary: '$90k-130k', requirements: ['Leadership', 'Expertise', 'Management'], growth: 'medium', experienceLevel: 'senior' },
      { id: 'def2', title: `Mid-Level ${careerInterest}`, description: `Experienced professional in ${careerInterest}`, matchScore: 90, salary: '$65k-95k', requirements: ['Experience', 'Skills', 'Knowledge'], growth: 'high', experienceLevel: 'mid' },
      { id: 'def3', title: `Junior ${careerInterest}`, description: `Entry-level position in ${careerInterest}`, matchScore: 85, salary: '$45k-65k', requirements: ['Education', 'Eagerness', 'Basic Skills'], growth: 'high', experienceLevel: 'entry' },
      { id: 'def4', title: `${careerInterest} Intern`, description: `Learn and grow in ${careerInterest}`, matchScore: 80, salary: '$15-25/hour', requirements: ['Student', 'Willingness to learn', 'Interest'], growth: 'high', experienceLevel: 'internship' },
    ];
  };

  // Filter jobs based on experience level
  const getFilteredJobs = (): AlternativeCareer[] => {
    let filtered = [...allAvailableJobs];
    
    if (experienceFilter === 'entry') {
      filtered = filtered.filter(job => 
        job.experienceLevel === 'entry' || 
        job.title?.toLowerCase().includes('junior') ||
        job.title?.toLowerCase().includes('entry')
      );
    } else if (experienceFilter === 'mid') {
      filtered = filtered.filter(job => 
        job.experienceLevel === 'mid' || 
        (!job.title?.toLowerCase().includes('senior') && 
         !job.title?.toLowerCase().includes('junior') &&
         !job.title?.toLowerCase().includes('intern'))
      );
    } else if (experienceFilter === 'senior') {
      filtered = filtered.filter(job => 
        job.experienceLevel === 'senior' || 
        job.title?.toLowerCase().includes('senior') ||
        job.title?.toLowerCase().includes('lead')
      );
    } else if (experienceFilter === 'internships') {
      filtered = filtered.filter(job => 
        job.experienceLevel === 'internship' || 
        job.title?.toLowerCase().includes('intern')
      );
    }
    
    return filtered.slice(0, 4); // Show max 4 jobs
  };

  const filteredJobs = getFilteredJobs();

  const getGrowthColor = (growth: string) => {
    switch (growth) {
      case 'high': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getMatchScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const handleFilterChange = (filter: ExperienceFilter) => {
    setExperienceFilter(filter);
    toast.success(`Showing ${filter === 'all' ? 'all' : filter} level opportunities`);
  };

  const handleViewAllJobs = () => {
    toast.info('Opening job board with personalized recommendations...');
    // You can integrate with a real job board API here
    window.open(`https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(profile.careerInterest || '')}`, '_blank');
  };

  if (filteredJobs.length === 0 && allAvailableJobs.length === 0) {
    return (
      <NBCard className="p-6 bg-gradient-to-r from-orange-50/90 to-red-50/90 border-orange-200">
        <div className="text-center">
          <Briefcase className="h-12 w-12 mx-auto mb-4 text-orange-500" />
          <h3 className="text-lg font-semibold text-orange-700 mb-2">
            No Similar Jobs Found
          </h3>
          <p className="text-orange-600 mb-4">
            Complete your career assessment to discover similar job opportunities
          </p>
          <NBButton 
            variant="primary"
            onClick={handleViewAllJobs}
            className="bg-orange-500 text-white hover:bg-orange-600"
          >
            Explore Jobs
          </NBButton>
        </div>
      </NBCard>
    );
  }

  return (
    <NBCard className="p-6 bg-gradient-to-r from-cyan-50/90 to-blue-50/90 border-cyan-200">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-xl font-semibold text-cyan-900 mb-1">
            Similar Job Opportunities
          </h3>
          <p className="text-cyan-700">
            Related roles in {profile.careerInterest || 'your domain'}
            {experienceFilter !== 'all' && (
              <span className="ml-2 text-xs bg-cyan-100 text-cyan-700 px-2 py-1 rounded-full">
                {experienceFilter === 'internships' ? 'Internships' : `${experienceFilter.charAt(0).toUpperCase() + experienceFilter.slice(1)} Level`}
              </span>
            )}
          </p>
        </div>
        <NBButton
          variant="ghost"
          onClick={handleViewAllJobs}
          className="text-cyan-600 hover:bg-cyan-100"
        >
          View All Jobs
        </NBButton>
      </div>

      {/* Jobs Grid */}
      <div className="space-y-4">
        {filteredJobs.map((job) => (
          <div
            key={job.id}
            className="p-4 bg-white/80 rounded-lg border border-cyan-200 hover:border-cyan-300 transition-all"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Briefcase className="h-4 w-4 text-cyan-600" />
                  <h4 className="font-semibold text-gray-900">{job.title}</h4>
                  {(job as any).type === 'internship' && (
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                      Internship
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600 mb-2">{job.description}</p>
                
                {/* Job Details */}
                <div className="flex items-center gap-4 text-sm text-gray-500 mb-2">
                  <div className="flex items-center gap-1">
                    <DollarSign className="h-3 w-3" />
                    {job.salary}
                  </div>
                  <div className="flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" />
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getGrowthColor(job.growth)}`}>
                      {job.growth} growth
                    </span>
                  </div>
                  <div className={`font-medium ${getMatchScoreColor(job.matchScore)}`}>
                    {job.matchScore}% match
                  </div>
                </div>

                {/* Required Skills */}
                <div className="flex flex-wrap gap-1 mb-3">
                  {job.requirements.slice(0, 3).map((skill, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-cyan-100 text-cyan-700 rounded-full text-xs"
                    >
                      {skill}
                    </span>
                  ))}
                  {job.requirements.length > 3 && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                      +{job.requirements.length - 3} more
                    </span>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 ml-4">
                <NBButton
                  variant="ghost"
                  onClick={() => onSaveJob(job.id)}
                  className="text-cyan-600 hover:bg-cyan-100 p-2"
                >
                  <Bookmark className="h-4 w-4" />
                </NBButton>
                <NBButton
                  variant="primary"
                  onClick={() => onViewJobDetails(job.id, job)}
                  className="bg-cyan-500 text-white hover:bg-cyan-600 text-sm px-3 py-1"
                >
                  View Details
                </NBButton>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Experience Level Filter */}
      <div className="mt-6 pt-4 border-t border-cyan-200">
        <div className="flex items-center justify-between">
          <div className="flex flex-wrap gap-2">
            <NBButton
              variant="ghost"
              onClick={() => handleFilterChange('entry')}
              className={`text-sm ${experienceFilter === 'entry' ? 'bg-cyan-100 text-cyan-700 font-semibold' : 'text-cyan-600 hover:bg-cyan-100'}`}
            >
              Entry Level
            </NBButton>
            <NBButton
              variant="ghost"
              onClick={() => handleFilterChange('mid')}
              className={`text-sm ${experienceFilter === 'mid' ? 'bg-cyan-100 text-cyan-700 font-semibold' : 'text-cyan-600 hover:bg-cyan-100'}`}
            >
              Mid Level
            </NBButton>
            <NBButton
              variant="ghost"
              onClick={() => handleFilterChange('senior')}
              className={`text-sm ${experienceFilter === 'senior' ? 'bg-cyan-100 text-cyan-700 font-semibold' : 'text-cyan-600 hover:bg-cyan-100'}`}
            >
              Senior Level
            </NBButton>
            <NBButton
              variant="ghost"
              onClick={() => handleFilterChange('internships')}
              className={`text-sm ${experienceFilter === 'internships' ? 'bg-cyan-100 text-cyan-700 font-semibold' : 'text-cyan-600 hover:bg-cyan-100'}`}
            >
              Internships
            </NBButton>
            <NBButton
              variant="ghost"
              onClick={() => handleFilterChange('all')}
              className={`text-sm ${experienceFilter === 'all' ? 'bg-cyan-100 text-cyan-700 font-semibold' : 'text-cyan-600 hover:bg-cyan-100'}`}
            >
              View All Skills
            </NBButton>
          </div>
          <NBButton
            variant="ghost"
            onClick={handleViewAllJobs}
            className="text-cyan-600 hover:bg-cyan-100 text-sm"
          >
            <ExternalLink className="h-3 w-3 mr-1" />
            Browse All
          </NBButton>
        </div>
      </div>
    </NBCard>
  );
};