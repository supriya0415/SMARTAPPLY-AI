import { UserProfile, CareerRecommendation, AlternativeCareer, CareerAssessmentData } from '../types';
import { GeminiService } from './geminiService';
import { CareerRecommendationService } from './careerRecommendationService';

// Mock data for different career paths
const mockCareerPaths = {
  'software-developer': {
    nodes: [
      // Main career path - horizontal line
      { id: '1', type: 'course' as const, title: 'JavaScript Fundamentals', description: 'Learn JavaScript programming basics', duration: '2 months', difficulty: 'beginner' as const, position: { x: 100, y: 100 } },
      { id: '2', type: 'course' as const, title: 'React Development', description: 'Build modern web applications with React', duration: '3 months', difficulty: 'intermediate' as const, position: { x: 450, y: 100 } },
      { id: '3', type: 'internship' as const, title: 'Frontend Developer Intern', description: 'Gain hands-on experience building web applications', duration: '6 months', position: { x: 800, y: 100 } },
      { id: '4', type: 'job' as const, title: 'Junior Software Developer', description: 'Entry-level software development position', salary: '$60k-80k', position: { x: 1150, y: 100 } },
      { id: '5', type: 'job' as const, title: 'Senior Software Engineer', description: 'Lead development projects and mentor junior developers', salary: '$90k-130k', position: { x: 1500, y: 100 } },
      
      // Skills below main path
      { id: '7', type: 'skill' as const, title: 'HTML & CSS', description: 'Web markup and styling fundamentals', position: { x: 100, y: 350 } },
      { id: '8', type: 'skill' as const, title: 'API Integration', description: 'Working with REST APIs and databases', position: { x: 450, y: 350 } },
      { id: '9', type: 'skill' as const, title: 'Version Control', description: 'Git and collaborative development practices', position: { x: 800, y: 350 } },
      
      // Companies at the end
      { id: '6', type: 'company' as const, title: 'Microsoft', description: 'Work at leading technology companies', position: { x: 1150, y: 350 } },
    ],
    edges: [
      { id: 'e1-2', source: '1', target: '2', sourceHandle: 'right', targetHandle: 'left', type: 'smoothstep' as const, animated: true },
      { id: 'e2-3', source: '2', target: '3', sourceHandle: 'right', targetHandle: 'left', type: 'smoothstep' as const, animated: true },
      { id: 'e3-4', source: '3', target: '4', sourceHandle: 'right', targetHandle: 'left', type: 'smoothstep' as const, animated: true },
      { id: 'e4-5', source: '4', target: '5', sourceHandle: 'right', targetHandle: 'left', type: 'smoothstep' as const, animated: true },
      { id: 'e1-7', source: '1', target: '7', sourceHandle: 'bottom', targetHandle: 'top', type: 'smoothstep' as const },
      { id: 'e2-8', source: '2', target: '8', sourceHandle: 'bottom', targetHandle: 'top', type: 'smoothstep' as const },
      { id: 'e3-9', source: '3', target: '9', sourceHandle: 'bottom', targetHandle: 'top', type: 'smoothstep' as const },
      { id: 'e4-6', source: '4', target: '6', sourceHandle: 'bottom', targetHandle: 'top', type: 'smoothstep' as const },
    ]
  },
  'data-scientist': {
    nodes: [
      // Main career path
      { id: '1', type: 'course' as const, title: 'Python Basics', description: 'Learn Python programming fundamentals', duration: '2 months', difficulty: 'beginner' as const, position: { x: 100, y: 100 } },
      { id: '2', type: 'course' as const, title: 'Data Analysis', description: 'Pandas, NumPy, and data manipulation', duration: '3 months', difficulty: 'intermediate' as const, position: { x: 450, y: 100 } },
      { id: '3', type: 'course' as const, title: 'Machine Learning', description: 'Scikit-learn and ML algorithms', duration: '4 months', difficulty: 'advanced' as const, position: { x: 800, y: 100 } },
      { id: '4', type: 'internship' as const, title: 'Data Science Intern', description: 'Work on real-world data projects', duration: '6 months', position: { x: 1150, y: 100 } },
      { id: '5', type: 'job' as const, title: 'Data Scientist', description: 'Build ML models and analyze data', salary: '$80k-110k', position: { x: 1500, y: 100 } },
      
      // Skills
      { id: '7', type: 'skill' as const, title: 'SQL', description: 'Database querying and management', position: { x: 100, y: 350 } },
      { id: '8', type: 'skill' as const, title: 'TensorFlow', description: 'Deep learning framework', position: { x: 450, y: 350 } },
      { id: '9', type: 'skill' as const, title: 'Statistics', description: 'Statistical analysis and hypothesis testing', position: { x: 800, y: 350 } },
      
      // Company
      { id: '6', type: 'company' as const, title: 'Netflix', description: 'Recommendation systems and analytics', position: { x: 1150, y: 350 } },
    ],
    edges: [
      { id: 'e1-2', source: '1', target: '2', sourceHandle: 'right', targetHandle: 'left', type: 'smoothstep' as const, animated: true },
      { id: 'e2-3', source: '2', target: '3', sourceHandle: 'right', targetHandle: 'left', type: 'smoothstep' as const, animated: true },
      { id: 'e3-4', source: '3', target: '4', sourceHandle: 'right', targetHandle: 'left', type: 'smoothstep' as const, animated: true },
      { id: 'e4-5', source: '4', target: '5', sourceHandle: 'right', targetHandle: 'left', type: 'smoothstep' as const, animated: true },
      { id: 'e1-7', source: '1', target: '7', sourceHandle: 'bottom', targetHandle: 'top', type: 'smoothstep' as const },
      { id: 'e3-8', source: '3', target: '8', sourceHandle: 'bottom', targetHandle: 'top', type: 'smoothstep' as const },
      { id: 'e2-9', source: '2', target: '9', sourceHandle: 'bottom', targetHandle: 'top', type: 'smoothstep' as const },
      { id: 'e5-6', source: '5', target: '6', sourceHandle: 'bottom', targetHandle: 'top', type: 'smoothstep' as const },
    ]
  },
  'marketing-specialist': {
    nodes: [
      // Main career path
      { id: '1', type: 'course' as const, title: 'Digital Marketing Fundamentals', description: 'Learn SEO, SEM, and content marketing', duration: '2 months', difficulty: 'beginner' as const, position: { x: 100, y: 100 } },
      { id: '2', type: 'course' as const, title: 'Social Media Marketing', description: 'Master Facebook, Instagram, and LinkedIn ads', duration: '3 months', difficulty: 'intermediate' as const, position: { x: 450, y: 100 } },
      { id: '3', type: 'course' as const, title: 'Analytics & PPC', description: 'Google Analytics and pay-per-click advertising', duration: '2 months', difficulty: 'intermediate' as const, position: { x: 800, y: 100 } },
      { id: '4', type: 'internship' as const, title: 'Marketing Intern', description: 'Work on real marketing campaigns', duration: '6 months', position: { x: 1150, y: 100 } },
      { id: '5', type: 'job' as const, title: 'Digital Marketing Specialist', description: 'Create and manage online marketing campaigns', salary: '$50k-85k', position: { x: 1500, y: 100 } },
      
      // Skills
      { id: '7', type: 'skill' as const, title: 'SEO', description: 'Search engine optimization techniques', position: { x: 100, y: 350 } },
      { id: '8', type: 'skill' as const, title: 'Content Creation', description: 'Creating engaging marketing content', position: { x: 450, y: 350 } },
      { id: '9', type: 'skill' as const, title: 'PPC', description: 'Pay-per-click advertising management', position: { x: 800, y: 350 } },
      
      // Company
      { id: '6', type: 'company' as const, title: 'HubSpot', description: 'Marketing automation and CRM', position: { x: 1150, y: 350 } },
    ],
    edges: [
      { id: 'e1-2', source: '1', target: '2', sourceHandle: 'right', targetHandle: 'left', type: 'smoothstep' as const, animated: true },
      { id: 'e2-3', source: '2', target: '3', sourceHandle: 'right', targetHandle: 'left', type: 'smoothstep' as const, animated: true },
      { id: 'e3-4', source: '3', target: '4', sourceHandle: 'right', targetHandle: 'left', type: 'smoothstep' as const, animated: true },
      { id: 'e4-5', source: '4', target: '5', sourceHandle: 'right', targetHandle: 'left', type: 'smoothstep' as const, animated: true },
      { id: 'e1-7', source: '1', target: '7', sourceHandle: 'bottom', targetHandle: 'top', type: 'smoothstep' as const },
      { id: 'e2-8', source: '2', target: '8', sourceHandle: 'bottom', targetHandle: 'top', type: 'smoothstep' as const },
      { id: 'e3-9', source: '3', target: '9', sourceHandle: 'bottom', targetHandle: 'top', type: 'smoothstep' as const },
      { id: 'e5-6', source: '5', target: '6', sourceHandle: 'bottom', targetHandle: 'top', type: 'smoothstep' as const },
    ]
  },
  'ui-ux-designer': {
    nodes: [
      // Main career path
      { id: '1', type: 'course' as const, title: 'UI/UX Design Fundamentals', description: 'Learn design principles and user research', duration: '3 months', difficulty: 'beginner' as const, position: { x: 100, y: 100 } },
      { id: '2', type: 'course' as const, title: 'Figma & Prototyping', description: 'Master design tools and prototyping', duration: '2 months', difficulty: 'intermediate' as const, position: { x: 450, y: 100 } },
      { id: '3', type: 'course' as const, title: 'User Research & Testing', description: 'Conduct user interviews and usability testing', duration: '3 months', difficulty: 'intermediate' as const, position: { x: 800, y: 100 } },
      { id: '4', type: 'internship' as const, title: 'Design Intern', description: 'Work on real product design projects', duration: '6 months', position: { x: 1150, y: 100 } },
      { id: '5', type: 'job' as const, title: 'UI/UX Designer', description: 'Design user interfaces and experiences', salary: '$60k-100k', position: { x: 1500, y: 100 } },
      
      // Skills
      { id: '7', type: 'skill' as const, title: 'User Research', description: 'Understanding user needs and behaviors', position: { x: 100, y: 350 } },
      { id: '8', type: 'skill' as const, title: 'Prototyping', description: 'Creating interactive design prototypes', position: { x: 450, y: 350 } },
      { id: '9', type: 'skill' as const, title: 'Design Systems', description: 'Creating consistent design languages', position: { x: 800, y: 350 } },
      
      // Company
      { id: '6', type: 'company' as const, title: 'Adobe', description: 'Leading design software company', position: { x: 1150, y: 350 } },
    ],
    edges: [
      { id: 'e1-2', source: '1', target: '2', sourceHandle: 'right', targetHandle: 'left', type: 'smoothstep' as const, animated: true },
      { id: 'e2-3', source: '2', target: '3', sourceHandle: 'right', targetHandle: 'left', type: 'smoothstep' as const, animated: true },
      { id: 'e3-4', source: '3', target: '4', sourceHandle: 'right', targetHandle: 'left', type: 'smoothstep' as const, animated: true },
      { id: 'e4-5', source: '4', target: '5', sourceHandle: 'right', targetHandle: 'left', type: 'smoothstep' as const, animated: true },
      { id: 'e1-7', source: '1', target: '7', sourceHandle: 'bottom', targetHandle: 'top', type: 'smoothstep' as const },
      { id: 'e2-8', source: '2', target: '8', sourceHandle: 'bottom', targetHandle: 'top', type: 'smoothstep' as const },
      { id: 'e3-9', source: '3', target: '9', sourceHandle: 'bottom', targetHandle: 'top', type: 'smoothstep' as const },
      { id: 'e5-6', source: '5', target: '6', sourceHandle: 'bottom', targetHandle: 'top', type: 'smoothstep' as const },
    ]
  },
  'product-manager': {
    nodes: [
      // Main career path  
      { id: '1', type: 'course' as const, title: 'Product Management Fundamentals', description: 'Learn product strategy and roadmapping', duration: '3 months', difficulty: 'beginner' as const, position: { x: 100, y: 100 } },
      { id: '2', type: 'course' as const, title: 'User Research & Analytics', description: 'Understanding users and product metrics', duration: '2 months', difficulty: 'intermediate' as const, position: { x: 450, y: 100 } },
      { id: '3', type: 'course' as const, title: 'Agile & Scrum', description: 'Product development methodologies', duration: '1 month', difficulty: 'intermediate' as const, position: { x: 800, y: 100 } },
      { id: '4', type: 'internship' as const, title: 'Product Intern', description: 'Work with product teams on real products', duration: '6 months', position: { x: 1150, y: 100 } },
      { id: '5', type: 'job' as const, title: 'Product Manager', description: 'Lead product strategy and development', salary: '$80k-140k', position: { x: 1500, y: 100 } },
      
      // Skills
      { id: '7', type: 'skill' as const, title: 'Market Research', description: 'Understanding market opportunities', position: { x: 100, y: 350 } },
      { id: '8', type: 'skill' as const, title: 'Data Analysis', description: 'Analyzing product metrics and KPIs', position: { x: 450, y: 350 } },
      { id: '9', type: 'skill' as const, title: 'Stakeholder Management', description: 'Working with cross-functional teams', position: { x: 800, y: 350 } },
      
      // Company
      { id: '6', type: 'company' as const, title: 'Google', description: 'Leading tech product company', position: { x: 1150, y: 350 } },
    ],
    edges: [
      { id: 'e1-2', source: '1', target: '2', sourceHandle: 'right', targetHandle: 'left', type: 'smoothstep' as const, animated: true },
      { id: 'e2-3', source: '2', target: '3', sourceHandle: 'right', targetHandle: 'left', type: 'smoothstep' as const, animated: true },
      { id: 'e3-4', source: '3', target: '4', sourceHandle: 'right', targetHandle: 'left', type: 'smoothstep' as const, animated: true },
      { id: 'e4-5', source: '4', target: '5', sourceHandle: 'right', targetHandle: 'left', type: 'smoothstep' as const, animated: true },
      { id: 'e1-7', source: '1', target: '7', sourceHandle: 'bottom', targetHandle: 'top', type: 'smoothstep' as const },
      { id: 'e2-8', source: '2', target: '8', sourceHandle: 'bottom', targetHandle: 'top', type: 'smoothstep' as const },
      { id: 'e3-9', source: '3', target: '9', sourceHandle: 'bottom', targetHandle: 'top', type: 'smoothstep' as const },
      { id: 'e5-6', source: '5', target: '6', sourceHandle: 'bottom', targetHandle: 'top', type: 'smoothstep' as const },
    ]
  },
  'project-manager': {
    nodes: [
      // Main career path
      { id: '1', type: 'course' as const, title: 'Project Management Fundamentals', description: 'Learn project planning and execution', duration: '3 months', difficulty: 'beginner' as const, position: { x: 100, y: 100 } },
      { id: '2', type: 'course' as const, title: 'Agile & Scrum Certification', description: 'Master agile methodologies and frameworks', duration: '2 months', difficulty: 'intermediate' as const, position: { x: 450, y: 100 } },
      { id: '3', type: 'course' as const, title: 'PMP Certification', description: 'Prepare for Project Management Professional certification', duration: '4 months', difficulty: 'advanced' as const, position: { x: 800, y: 100 } },
      { id: '4', type: 'internship' as const, title: 'Project Coordinator Intern', description: 'Support project teams and learn best practices', duration: '6 months', position: { x: 1150, y: 100 } },
      { id: '5', type: 'job' as const, title: 'Senior Project Manager', description: 'Lead complex projects and mentor junior PMs', salary: '$85k-130k', position: { x: 1500, y: 100 } },
      
      // Skills
      { id: '7', type: 'skill' as const, title: 'Risk Management', description: 'Identify and mitigate project risks', position: { x: 100, y: 350 } },
      { id: '8', type: 'skill' as const, title: 'Team Leadership', description: 'Lead cross-functional teams effectively', position: { x: 450, y: 350 } },
      { id: '9', type: 'skill' as const, title: 'Budget Management', description: 'Plan and control project budgets', position: { x: 800, y: 350 } },
      
      // Company
      { id: '6', type: 'company' as const, title: 'Accenture', description: 'Leading consulting and project management firm', position: { x: 1150, y: 350 } },
    ],
    edges: [
      { id: 'e1-2', source: '1', target: '2', sourceHandle: 'right', targetHandle: 'left', type: 'smoothstep' as const, animated: true },
      { id: 'e2-3', source: '2', target: '3', sourceHandle: 'right', targetHandle: 'left', type: 'smoothstep' as const, animated: true },
      { id: 'e3-4', source: '3', target: '4', sourceHandle: 'right', targetHandle: 'left', type: 'smoothstep' as const, animated: true },
      { id: 'e4-5', source: '4', target: '5', sourceHandle: 'right', targetHandle: 'left', type: 'smoothstep' as const, animated: true },
      { id: 'e1-7', source: '1', target: '7', sourceHandle: 'bottom', targetHandle: 'top', type: 'smoothstep' as const },
      { id: 'e2-8', source: '2', target: '8', sourceHandle: 'bottom', targetHandle: 'top', type: 'smoothstep' as const },
      { id: 'e3-9', source: '3', target: '9', sourceHandle: 'bottom', targetHandle: 'top', type: 'smoothstep' as const },
      { id: 'e5-6', source: '5', target: '6', sourceHandle: 'bottom', targetHandle: 'top', type: 'smoothstep' as const },
    ]
  },
  'digital-marketer': {
    nodes: [
      // Main career path
      { id: '1', type: 'course' as const, title: 'Digital Marketing Basics', description: 'Learn fundamental marketing concepts', duration: '2 months', difficulty: 'beginner' as const, position: { x: 100, y: 100 } },
      { id: '2', type: 'course' as const, title: 'Google Ads & Analytics', description: 'Master Google advertising and analytics tools', duration: '3 months', difficulty: 'intermediate' as const, position: { x: 450, y: 100 } },
      { id: '3', type: 'course' as const, title: 'Social Media Marketing', description: 'Create effective social media campaigns', duration: '2 months', difficulty: 'intermediate' as const, position: { x: 800, y: 100 } },
      { id: '4', type: 'internship' as const, title: 'Marketing Intern', description: 'Work on real marketing campaigns', duration: '6 months', position: { x: 1150, y: 100 } },
      { id: '5', type: 'job' as const, title: 'Senior Digital Marketer', description: 'Lead marketing strategies and campaigns', salary: '$65k-100k', position: { x: 1500, y: 100 } },
      
      // Skills
      { id: '7', type: 'skill' as const, title: 'SEO/SEM', description: 'Search engine optimization and marketing', position: { x: 100, y: 350 } },
      { id: '8', type: 'skill' as const, title: 'Content Strategy', description: 'Develop engaging content strategies', position: { x: 450, y: 350 } },
      { id: '9', type: 'skill' as const, title: 'Campaign Analytics', description: 'Measure and optimize campaign performance', position: { x: 800, y: 350 } },
      
      // Company
      { id: '6', type: 'company' as const, title: 'HubSpot', description: 'Leading marketing automation platform', position: { x: 1150, y: 350 } },
    ],
    edges: [
      { id: 'e1-2', source: '1', target: '2', sourceHandle: 'right', targetHandle: 'left', type: 'smoothstep' as const, animated: true },
      { id: 'e2-3', source: '2', target: '3', sourceHandle: 'right', targetHandle: 'left', type: 'smoothstep' as const, animated: true },
      { id: 'e3-4', source: '3', target: '4', sourceHandle: 'right', targetHandle: 'left', type: 'smoothstep' as const, animated: true },
      { id: 'e4-5', source: '4', target: '5', sourceHandle: 'right', targetHandle: 'left', type: 'smoothstep' as const, animated: true },
      { id: 'e1-7', source: '1', target: '7', sourceHandle: 'bottom', targetHandle: 'top', type: 'smoothstep' as const },
      { id: 'e2-8', source: '2', target: '8', sourceHandle: 'bottom', targetHandle: 'top', type: 'smoothstep' as const },
      { id: 'e3-9', source: '3', target: '9', sourceHandle: 'bottom', targetHandle: 'top', type: 'smoothstep' as const },
      { id: 'e5-6', source: '5', target: '6', sourceHandle: 'bottom', targetHandle: 'top', type: 'smoothstep' as const },
    ]
  },
  'ux-designer': {
    nodes: [
      // Main career path
      { id: '1', type: 'course' as const, title: 'UX Design Fundamentals', description: 'Learn user experience design principles', duration: '3 months', difficulty: 'beginner' as const, position: { x: 100, y: 100 } },
      { id: '2', type: 'course' as const, title: 'User Research Methods', description: 'Master user interviews and usability testing', duration: '2 months', difficulty: 'intermediate' as const, position: { x: 450, y: 100 } },
      { id: '3', type: 'course' as const, title: 'Prototyping & Wireframing', description: 'Create prototypes with Figma and tools', duration: '3 months', difficulty: 'intermediate' as const, position: { x: 800, y: 100 } },
      { id: '4', type: 'internship' as const, title: 'UX Design Intern', description: 'Work on real product design projects', duration: '6 months', position: { x: 1150, y: 100 } },
      { id: '5', type: 'job' as const, title: 'Senior UX Designer', description: 'Lead user experience strategy and design', salary: '$80k-130k', position: { x: 1500, y: 100 } },
      
      // Skills
      { id: '7', type: 'skill' as const, title: 'User Research', description: 'Understand user needs and behaviors', position: { x: 100, y: 350 } },
      { id: '8', type: 'skill' as const, title: 'Information Architecture', description: 'Structure content and navigation', position: { x: 450, y: 350 } },
      { id: '9', type: 'skill' as const, title: 'Usability Testing', description: 'Test and validate design decisions', position: { x: 800, y: 350 } },
      
      // Company
      { id: '6', type: 'company' as const, title: 'Airbnb', description: 'Leading design-driven technology company', position: { x: 1150, y: 350 } },
    ],
    edges: [
      { id: 'e1-2', source: '1', target: '2', sourceHandle: 'right', targetHandle: 'left', type: 'smoothstep' as const, animated: true },
      { id: 'e2-3', source: '2', target: '3', sourceHandle: 'right', targetHandle: 'left', type: 'smoothstep' as const, animated: true },
      { id: 'e3-4', source: '3', target: '4', sourceHandle: 'right', targetHandle: 'left', type: 'smoothstep' as const, animated: true },
      { id: 'e4-5', source: '4', target: '5', sourceHandle: 'right', targetHandle: 'left', type: 'smoothstep' as const, animated: true },
      { id: 'e1-7', source: '1', target: '7', sourceHandle: 'bottom', targetHandle: 'top', type: 'smoothstep' as const },
      { id: 'e2-8', source: '2', target: '8', sourceHandle: 'bottom', targetHandle: 'top', type: 'smoothstep' as const },
      { id: 'e3-9', source: '3', target: '9', sourceHandle: 'bottom', targetHandle: 'top', type: 'smoothstep' as const },
      { id: 'e5-6', source: '5', target: '6', sourceHandle: 'bottom', targetHandle: 'top', type: 'smoothstep' as const },
    ]
  },
  'ui-designer': {
    nodes: [
      // Main career path
      { id: '1', type: 'course' as const, title: 'Visual Design Principles', description: 'Learn color, typography, and layout', duration: '2 months', difficulty: 'beginner' as const, position: { x: 100, y: 100 } },
      { id: '2', type: 'course' as const, title: 'Figma Mastery', description: 'Master design tools and workflows', duration: '2 months', difficulty: 'intermediate' as const, position: { x: 450, y: 100 } },
      { id: '3', type: 'course' as const, title: 'Design Systems', description: 'Create consistent design languages', duration: '3 months', difficulty: 'advanced' as const, position: { x: 800, y: 100 } },
      { id: '4', type: 'internship' as const, title: 'UI Design Intern', description: 'Design interfaces for real products', duration: '6 months', position: { x: 1150, y: 100 } },
      { id: '5', type: 'job' as const, title: 'Senior UI Designer', description: 'Lead visual design and interface creation', salary: '$75k-125k', position: { x: 1500, y: 100 } },
      
      // Skills
      { id: '7', type: 'skill' as const, title: 'Typography', description: 'Master typeface selection and hierarchy', position: { x: 100, y: 350 } },
      { id: '8', type: 'skill' as const, title: 'Color Theory', description: 'Understand color psychology and harmony', position: { x: 450, y: 350 } },
      { id: '9', type: 'skill' as const, title: 'Icon Design', description: 'Create scalable and meaningful icons', position: { x: 800, y: 350 } },
      
      // Company
      { id: '6', type: 'company' as const, title: 'Spotify', description: 'Design-focused music streaming platform', position: { x: 1150, y: 350 } },
    ],
    edges: [
      { id: 'e1-2', source: '1', target: '2', sourceHandle: 'right', targetHandle: 'left', type: 'smoothstep' as const, animated: true },
      { id: 'e2-3', source: '2', target: '3', sourceHandle: 'right', targetHandle: 'left', type: 'smoothstep' as const, animated: true },
      { id: 'e3-4', source: '3', target: '4', sourceHandle: 'right', targetHandle: 'left', type: 'smoothstep' as const, animated: true },
      { id: 'e4-5', source: '4', target: '5', sourceHandle: 'right', targetHandle: 'left', type: 'smoothstep' as const, animated: true },
      { id: 'e1-7', source: '1', target: '7', sourceHandle: 'bottom', targetHandle: 'top', type: 'smoothstep' as const },
      { id: 'e2-8', source: '2', target: '8', sourceHandle: 'bottom', targetHandle: 'top', type: 'smoothstep' as const },
      { id: 'e3-9', source: '3', target: '9', sourceHandle: 'bottom', targetHandle: 'top', type: 'smoothstep' as const },
      { id: 'e5-6', source: '5', target: '6', sourceHandle: 'bottom', targetHandle: 'top', type: 'smoothstep' as const },
    ]
  },
  'registered-nurse': {
    nodes: [
      // Main career path
      { id: '1', type: 'course' as const, title: 'Nursing Fundamentals', description: 'Basic nursing principles and patient care', duration: '6 months', difficulty: 'beginner' as const, position: { x: 100, y: 100 } },
      { id: '2', type: 'course' as const, title: 'Clinical Rotations', description: 'Hands-on experience in various specialties', duration: '12 months', difficulty: 'intermediate' as const, position: { x: 450, y: 100 } },
      { id: '3', type: 'course' as const, title: 'NCLEX-RN Preparation', description: 'Prepare for nursing license examination', duration: '3 months', difficulty: 'advanced' as const, position: { x: 800, y: 100 } },
      { id: '4', type: 'job' as const, title: 'Staff Nurse', description: 'Provide direct patient care in healthcare settings', salary: '$60k-80k', position: { x: 1150, y: 100 } },
      { id: '5', type: 'job' as const, title: 'Charge Nurse', description: 'Lead nursing teams and coordinate patient care', salary: '$75k-95k', position: { x: 1500, y: 100 } },
      
      // Skills
      { id: '7', type: 'skill' as const, title: 'Patient Assessment', description: 'Evaluate patient conditions and needs', position: { x: 100, y: 350 } },
      { id: '8', type: 'skill' as const, title: 'Medical Procedures', description: 'Perform nursing procedures safely', position: { x: 450, y: 350 } },
      { id: '9', type: 'skill' as const, title: 'Care Coordination', description: 'Coordinate with healthcare teams', position: { x: 800, y: 350 } },
      
      // Company
      { id: '6', type: 'company' as const, title: 'Kaiser Permanente', description: 'Leading healthcare organization', position: { x: 1150, y: 350 } },
    ],
    edges: [
      { id: 'e1-2', source: '1', target: '2', sourceHandle: 'right', targetHandle: 'left', type: 'smoothstep' as const, animated: true },
      { id: 'e2-3', source: '2', target: '3', sourceHandle: 'right', targetHandle: 'left', type: 'smoothstep' as const, animated: true },
      { id: 'e3-4', source: '3', target: '4', sourceHandle: 'right', targetHandle: 'left', type: 'smoothstep' as const, animated: true },
      { id: 'e4-5', source: '4', target: '5', sourceHandle: 'right', targetHandle: 'left', type: 'smoothstep' as const, animated: true },
      { id: 'e1-7', source: '1', target: '7', sourceHandle: 'bottom', targetHandle: 'top', type: 'smoothstep' as const },
      { id: 'e2-8', source: '2', target: '8', sourceHandle: 'bottom', targetHandle: 'top', type: 'smoothstep' as const },
      { id: 'e3-9', source: '3', target: '9', sourceHandle: 'bottom', targetHandle: 'top', type: 'smoothstep' as const },
      { id: 'e5-6', source: '5', target: '6', sourceHandle: 'bottom', targetHandle: 'top', type: 'smoothstep' as const },
    ]
  }
};

const mockAlternatives = {
  'software-developer': [
    { id: 'alt1', title: 'DevOps Engineer', description: 'Focus on deployment and infrastructure', matchScore: 85, salary: '$70k-100k', requirements: ['Docker', 'Kubernetes', 'AWS'], growth: 'high' as const },
    { id: 'alt2', title: 'UI/UX Designer', description: 'Design user interfaces and experiences', matchScore: 75, salary: '$60k-90k', requirements: ['Figma', 'User Research', 'Prototyping'], growth: 'medium' as const },
    { id: 'alt3', title: 'Technical Writer', description: 'Create technical documentation', matchScore: 70, salary: '$50k-80k', requirements: ['Writing', 'Technical Knowledge', 'Tools'], growth: 'medium' as const }
  ],
  'data-scientist': [
    { id: 'alt1', title: 'Business Analyst', description: 'Analyze business data and processes', matchScore: 80, salary: '$60k-90k', requirements: ['Excel', 'SQL', 'Business Acumen'], growth: 'medium' as const },
    { id: 'alt2', title: 'Research Scientist', description: 'Conduct research in academia or industry', matchScore: 90, salary: '$70k-120k', requirements: ['PhD', 'Research Skills', 'Publications'], growth: 'high' as const },
    { id: 'alt3', title: 'Data Engineer', description: 'Build and maintain data pipelines', matchScore: 85, salary: '$80k-110k', requirements: ['Python', 'SQL', 'Cloud Platforms'], growth: 'high' as const }
  ],
  'product-manager': [
    { id: 'alt1', title: 'Project Manager', description: 'Manage projects and timelines', matchScore: 85, salary: '$70k-100k', requirements: ['PMP', 'Agile', 'Leadership'], growth: 'medium' as const },
    { id: 'alt2', title: 'Business Analyst', description: 'Analyze business requirements', matchScore: 80, salary: '$60k-90k', requirements: ['Analysis', 'Communication', 'Tools'], growth: 'medium' as const },
    { id: 'alt3', title: 'Marketing Manager', description: 'Lead marketing strategies and campaigns', matchScore: 75, salary: '$65k-95k', requirements: ['Marketing', 'Analytics', 'Creativity'], growth: 'high' as const }
  ],
  'marketing-specialist': [
    { id: 'alt1', title: 'Content Marketing Manager', description: 'Lead content strategy and creation', matchScore: 90, salary: '$55k-85k', requirements: ['Content Creation', 'SEO', 'Strategy'], growth: 'high' as const },
    { id: 'alt2', title: 'Social Media Manager', description: 'Manage social media presence and campaigns', matchScore: 85, salary: '$45k-70k', requirements: ['Social Media', 'Analytics', 'Creativity'], growth: 'high' as const },
    { id: 'alt3', title: 'Marketing Coordinator', description: 'Support marketing campaigns and events', matchScore: 75, salary: '$40k-60k', requirements: ['Organization', 'Communication', 'Marketing Tools'], growth: 'medium' as const }
  ],
  'ui-ux-designer': [
    { id: 'alt1', title: 'Graphic Designer', description: 'Create visual designs for brands and products', matchScore: 85, salary: '$45k-75k', requirements: ['Adobe Creative Suite', 'Creativity', 'Brand Design'], growth: 'medium' as const },
    { id: 'alt2', title: 'Product Designer', description: 'Design digital products and experiences', matchScore: 90, salary: '$70k-110k', requirements: ['Design Systems', 'Prototyping', 'User Research'], growth: 'high' as const },
    { id: 'alt3', title: 'Front-end Developer', description: 'Build user interfaces with code', matchScore: 80, salary: '$60k-95k', requirements: ['HTML/CSS', 'JavaScript', 'React'], growth: 'high' as const }
  ],
  'project-manager': [
    { id: 'alt1', title: 'Product Manager', description: 'Lead product strategy and development', matchScore: 85, salary: '$80k-130k', requirements: ['Strategy', 'Analytics', 'Product Development'], growth: 'high' as const },
    { id: 'alt2', title: 'Business Analyst', description: 'Analyze business processes and requirements', matchScore: 80, salary: '$65k-95k', requirements: ['Analysis', 'Documentation', 'Process Improvement'], growth: 'medium' as const },
    { id: 'alt3', title: 'Operations Manager', description: 'Oversee business operations and efficiency', matchScore: 75, salary: '$70k-110k', requirements: ['Operations', 'Leadership', 'Process Management'], growth: 'medium' as const }
  ],
  'digital-marketer': [
    { id: 'alt1', title: 'Content Creator', description: 'Create engaging content for various platforms', matchScore: 85, salary: '$45k-75k', requirements: ['Content Creation', 'Social Media', 'Storytelling'], growth: 'high' as const },
    { id: 'alt2', title: 'SEO Specialist', description: 'Optimize websites for search engines', matchScore: 90, salary: '$50k-80k', requirements: ['SEO', 'Analytics', 'Technical Knowledge'], growth: 'high' as const },
    { id: 'alt3', title: 'Brand Manager', description: 'Develop and maintain brand identity', matchScore: 80, salary: '$65k-100k', requirements: ['Brand Strategy', 'Marketing', 'Creative Direction'], growth: 'medium' as const }
  ],
  'ux-designer': [
    { id: 'alt1', title: 'UI Designer', description: 'Focus on visual interface design', matchScore: 90, salary: '$60k-105k', requirements: ['Visual Design', 'Figma', 'Design Systems'], growth: 'high' as const },
    { id: 'alt2', title: 'Product Designer', description: 'Design end-to-end product experiences', matchScore: 95, salary: '$75k-125k', requirements: ['Product Thinking', 'User Research', 'Prototyping'], growth: 'high' as const },
    { id: 'alt3', title: 'User Researcher', description: 'Conduct research to understand user needs', matchScore: 85, salary: '$70k-115k', requirements: ['Research Methods', 'Data Analysis', 'Psychology'], growth: 'high' as const }
  ],
  'ui-designer': [
    { id: 'alt1', title: 'UX Designer', description: 'Focus on user experience and research', matchScore: 90, salary: '$65k-110k', requirements: ['User Research', 'Wireframing', 'Usability Testing'], growth: 'high' as const },
    { id: 'alt2', title: 'Visual Designer', description: 'Create visual brand and marketing materials', matchScore: 85, salary: '$55k-90k', requirements: ['Graphic Design', 'Branding', 'Adobe Creative Suite'], growth: 'medium' as const },
    { id: 'alt3', title: 'Frontend Developer', description: 'Build interfaces with design skills', matchScore: 80, salary: '$65k-105k', requirements: ['HTML/CSS', 'JavaScript', 'Design Sense'], growth: 'high' as const }
  ],
  'registered-nurse': [
    { id: 'alt1', title: 'Nurse Practitioner', description: 'Advanced practice nursing with prescriptive authority', matchScore: 90, salary: '$95k-130k', requirements: ['Masters Degree', 'Clinical Experience', 'Certification'], growth: 'very high' as const },
    { id: 'alt2', title: 'Healthcare Administrator', description: 'Manage healthcare facilities and operations', matchScore: 75, salary: '$80k-120k', requirements: ['Healthcare Knowledge', 'Management', 'Administration'], growth: 'medium' as const },
    { id: 'alt3', title: 'Public Health Nurse', description: 'Focus on community health and prevention', matchScore: 85, salary: '$60k-85k', requirements: ['Public Health', 'Community Outreach', 'Health Education'], growth: 'high' as const }
  ]
};

export class CareerService {
  static async generatePath(profile: UserProfile, assessmentData?: CareerAssessmentData): Promise<CareerRecommendation> {
    try {
      // Use new recommendation service if assessment data is available
      if (assessmentData) {
        const recommendations = await CareerRecommendationService.generateRecommendations(profile, assessmentData);
        return recommendations[0]; // Return the top recommendation
      }
      
      // Fallback to original Gemini API method
      return await GeminiService.generateCareerPath(profile);
    } catch (error) {
      console.error('Error with career generation, falling back to mock data:', error);
      // Fallback to mock data if API fails
      return this.getMockRecommendation(profile);
    }
  }

  static async generateRecommendations(profile: UserProfile, assessmentData?: CareerAssessmentData): Promise<CareerRecommendation[]> {
    try {
      return await CareerRecommendationService.generateRecommendations(profile, assessmentData);
    } catch (error) {
      console.error('Error generating recommendations:', error);
      // Return single recommendation as array for consistency
      const singleRec = await this.generatePath(profile, assessmentData);
      return [singleRec];
    }
  }

  static async suggestAlternatives(profile: UserProfile): Promise<AlternativeCareer[]> {
    try {
      // Try to use Gemini API first
      return await GeminiService.suggestAlternatives(profile);
    } catch (error) {
      console.error('Error with Gemini API, falling back to mock data:', error);
      // Fallback to mock data if API fails
      const recommendation = this.getMockRecommendation(profile);
      return recommendation.alternatives;
    }
  }

  private static getMockRecommendation(profile: UserProfile): CareerRecommendation {
    // Check if user has selected a career from our department system
    let careerType = 'software-developer'; // default
    let careerTitle = 'Software Developer';
    
    // First, check if there's a selectedCareer from our department browsing
    if (profile.selectedCareer) {
      careerTitle = profile.selectedCareer.title;
      // Map selected career to our career types
      if (careerTitle.toLowerCase().includes('data') || 
          careerTitle.toLowerCase().includes('analytics') ||
          careerTitle.toLowerCase().includes('scientist')) {
        careerType = 'data-scientist';
      } else if (careerTitle.toLowerCase().includes('project') && 
                 careerTitle.toLowerCase().includes('manager')) {
        careerType = 'project-manager';
      } else if (careerTitle.toLowerCase().includes('digital') && 
                 careerTitle.toLowerCase().includes('market')) {
        careerType = 'digital-marketer';
      } else if (careerTitle.toLowerCase().includes('ux') && 
                 careerTitle.toLowerCase().includes('designer')) {
        careerType = 'ux-designer';
      } else if (careerTitle.toLowerCase().includes('ui') && 
                 careerTitle.toLowerCase().includes('designer')) {
        careerType = 'ui-designer';
      } else if (careerTitle.toLowerCase().includes('nurse') || 
                 careerTitle.toLowerCase().includes('nursing')) {
        careerType = 'registered-nurse';
      } else if (careerTitle.toLowerCase().includes('product') ||
                 careerTitle.toLowerCase().includes('management')) {
        careerType = 'product-manager';
      } else if (careerTitle.toLowerCase().includes('marketing') ||
                 careerTitle.toLowerCase().includes('sales')) {
        careerType = 'marketing-specialist';
      } else if (careerTitle.toLowerCase().includes('design') ||
                 careerTitle.toLowerCase().includes('ui') ||
                 careerTitle.toLowerCase().includes('ux')) {
        careerType = 'ui-ux-designer';
      }
    } else {
      // Fallback to analyzing career interest text
      if (profile.careerInterest?.toLowerCase().includes('data') || 
          profile.careerInterest?.toLowerCase().includes('analytics') ||
          profile.careerInterest?.toLowerCase().includes('machine learning')) {
        careerType = 'data-scientist';
        careerTitle = 'Data Scientist';
      } else if (profile.careerInterest?.toLowerCase().includes('project') && 
                 profile.careerInterest?.toLowerCase().includes('manager')) {
        careerType = 'project-manager';
        careerTitle = 'Project Manager';
      } else if (profile.careerInterest?.toLowerCase().includes('digital') && 
                 profile.careerInterest?.toLowerCase().includes('market')) {
        careerType = 'digital-marketer';
        careerTitle = 'Digital Marketer';
      } else if (profile.careerInterest?.toLowerCase().includes('ux') && 
                 profile.careerInterest?.toLowerCase().includes('designer')) {
        careerType = 'ux-designer';
        careerTitle = 'UX Designer';
      } else if (profile.careerInterest?.toLowerCase().includes('ui') && 
                 profile.careerInterest?.toLowerCase().includes('designer')) {
        careerType = 'ui-designer';
        careerTitle = 'UI Designer';
      } else if (profile.careerInterest?.toLowerCase().includes('nurse') || 
                 profile.careerInterest?.toLowerCase().includes('nursing')) {
        careerType = 'registered-nurse';
        careerTitle = 'Registered Nurse';
      } else if (profile.careerInterest?.toLowerCase().includes('product') ||
                 profile.careerInterest?.toLowerCase().includes('management') ||
                 profile.careerInterest?.toLowerCase().includes('strategy')) {
        careerType = 'product-manager';
        careerTitle = 'Product Manager';
      } else if (profile.careerInterest?.toLowerCase().includes('marketing') ||
                 profile.careerInterest?.toLowerCase().includes('sales')) {
        careerType = 'marketing-specialist';
        careerTitle = 'Marketing Specialist';
      } else if (profile.careerInterest?.toLowerCase().includes('design')) {
        careerType = 'ui-ux-designer';
        careerTitle = 'UI/UX Designer';
      }
    }

    const pathData = mockCareerPaths[careerType as keyof typeof mockCareerPaths] || mockCareerPaths['software-developer'];
    const alternatives = mockAlternatives[careerType as keyof typeof mockAlternatives] || mockAlternatives['software-developer'];

    return {
      id: `career_${careerType}_${Date.now()}`,
      title: careerTitle,
      description: `A career path in ${careerTitle} based on your interests and skills.`,
      fitScore: 75, // Default fit score for mock data
      salaryRange: { min: 60000, max: 120000, currency: 'USD', period: 'yearly' },
      growthProspects: 'high' as const,
      requiredSkills: [],
      recommendedPath: {
        id: `path_${careerType}`,
        title: `${careerTitle} Learning Path`,
        description: `Comprehensive learning path for ${careerTitle}`,
        totalDuration: '6-12 months',
        phases: [],
        estimatedCost: 2000,
        difficulty: 'intermediate' as const,
        prerequisites: [],
        outcomes: []
      },
      jobMarketData: {
        demand: 'high' as const,
        competitiveness: 'medium' as const,
        locations: ['Remote', 'Major Cities'],
        industryGrowth: 10,
        averageSalary: 90000
      },
      primaryCareer: careerTitle,
      relatedRoles: this.getRelatedRoles(careerType),
      careerPath: {
        nodes: pathData.nodes,
        edges: pathData.edges
      },
      alternatives: alternatives,
      summary: this.generateSummary(profile, careerType)
    };
  }

  private static getCareerTitle(careerType: string): string {
    const titles = {
      'software-developer': 'Software Developer',
      'data-scientist': 'Data Scientist',
      'product-manager': 'Product Manager',
      'marketing-specialist': 'Marketing Specialist',
      'ui-ux-designer': 'UI/UX Designer'
    };
    return titles[careerType as keyof typeof titles] || 'Software Developer';
  }

  private static getRelatedRoles(careerType: string): string[] {
    const roles = {
      'software-developer': ['Frontend Developer', 'Backend Developer', 'Full Stack Developer', 'DevOps Engineer'],
      'data-scientist': ['Data Analyst', 'Machine Learning Engineer', 'Business Intelligence Analyst', 'Research Scientist'],
      'product-manager': ['Project Manager', 'Business Analyst', 'Strategy Manager', 'Program Manager'],
      'marketing-specialist': ['Content Marketing Manager', 'Social Media Manager', 'Digital Marketing Coordinator', 'SEO Specialist'],
      'ui-ux-designer': ['Product Designer', 'Visual Designer', 'User Researcher', 'Interaction Designer']
    };
    return roles[careerType as keyof typeof roles] || ['Frontend Developer', 'Backend Developer'];
  }

  private static generateSummary(profile: UserProfile, careerType: string): string {
    const resumeSkills = profile.resume?.extractedInfo.skills || [];
    const allSkills = [...new Set([...profile.skills, ...resumeSkills])];
    const experienceCount = profile.resume?.extractedInfo.experience.length || 0;
    
    // Use selected career information if available
    const careerInterest = profile.selectedCareer?.title || profile.careerInterest;
    const relevantSkills = profile.selectedCareer?.keySkills || allSkills.slice(0, 3);
    
    const summaries = {
      'software-developer': `Based on your interest in ${careerInterest}, a career in software development would be perfect for you. Your skills in ${relevantSkills.join(', ')} provide a strong foundation for building modern applications.${experienceCount > 0 ? ` Your ${experienceCount} years of experience will give you an advantage in the job market.` : ''}`,
      'data-scientist': `Your interest in ${careerInterest} and skills in ${relevantSkills.join(', ')} make you an excellent candidate for data science. This field offers great opportunities to work with data and analytics.${experienceCount > 0 ? ` Your professional experience will be valuable in this analytical field.` : ''}`,
      'product-manager': `With your interest in ${careerInterest} and skills in ${relevantSkills.join(', ')}, product management could be your ideal career path. You'll bridge technical and business worlds effectively.${experienceCount > 0 ? ` Your industry experience will help you understand user needs and market dynamics.` : ''}`,
      'marketing-specialist': `Your interest in ${careerInterest} and skills in ${relevantSkills.join(', ')} position you well for digital marketing. This dynamic field offers opportunities to drive business growth through creative campaigns.${experienceCount > 0 ? ` Your professional background will enhance your understanding of market strategies.` : ''}`,
      'ui-ux-designer': `Based on your interest in ${careerInterest} and skills in ${relevantSkills.join(', ')}, UI/UX design is an excellent fit. You'll create meaningful user experiences and solve design challenges.${experienceCount > 0 ? ` Your work experience will inform your design decisions and user empathy.` : ''}`
    };
    return summaries[careerType as keyof typeof summaries] || `Based on your interest in ${careerInterest}, this career path leverages your skills in ${relevantSkills.join(', ')} and offers excellent growth opportunities.`;
  }
}
