import { CareerRecommendation } from '../types'

export interface CareerProfile {
  id: string
  title: string
  description: string
  category: string
  subcategory: string
  requiredSkills: SkillRequirement[]
  preferredSkills: SkillRequirement[]
  experienceLevel: 'entry' | 'mid' | 'senior'
  salaryRange: {
    min: number
    max: number
    currency: string
    period: string
  }
  growthProspects: 'high' | 'medium' | 'low'
  workEnvironment: {
    remote: boolean
    hybrid: boolean
    onsite: boolean
    teamSize: string
    workStyle: string[]
  }
  industryTrends: {
    demand: 'high' | 'medium' | 'low'
    growth: number
    competitiveness: 'high' | 'medium' | 'low'
  }
  relatedCareers: string[]
  keywords: string[]
}

export interface SkillRequirement {
  skill: string
  importance: 'critical' | 'important' | 'nice-to-have'
  proficiencyLevel: 'beginner' | 'intermediate' | 'advanced' | 'expert'
  category: 'technical' | 'soft' | 'domain' | 'certification'
}

export const CAREER_DATABASE: CareerProfile[] = [
  // Technology & Software Development
  {
    id: 'software-developer',
    title: 'Software Developer',
    description: 'Design, develop, and maintain software applications using various programming languages and frameworks. Work on web applications, mobile apps, or desktop software.',
    category: 'Technology',
    subcategory: 'Software Development',
    requiredSkills: [
      { skill: 'JavaScript', importance: 'critical', proficiencyLevel: 'intermediate', category: 'technical' },
      { skill: 'HTML/CSS', importance: 'critical', proficiencyLevel: 'intermediate', category: 'technical' },
      { skill: 'Git', importance: 'important', proficiencyLevel: 'beginner', category: 'technical' },
      { skill: 'Problem Solving', importance: 'critical', proficiencyLevel: 'intermediate', category: 'soft' }
    ],
    preferredSkills: [
      { skill: 'React', importance: 'important', proficiencyLevel: 'intermediate', category: 'technical' },
      { skill: 'Node.js', importance: 'important', proficiencyLevel: 'beginner', category: 'technical' },
      { skill: 'TypeScript', importance: 'nice-to-have', proficiencyLevel: 'beginner', category: 'technical' }
    ],
    experienceLevel: 'entry',
    salaryRange: { min: 60000, max: 120000, currency: 'USD', period: 'yearly' },
    growthProspects: 'high',
    workEnvironment: {
      remote: true,
      hybrid: true,
      onsite: true,
      teamSize: '3-8 people',
      workStyle: ['collaborative', 'analytical', 'creative']
    },
    industryTrends: { demand: 'high', growth: 15, competitiveness: 'medium' },
    relatedCareers: ['Frontend Developer', 'Backend Developer', 'Full Stack Developer'],
    keywords: ['programming', 'coding', 'web development', 'software engineering', 'frontend', 'backend']
  },
  
  {
    id: 'data-scientist',
    title: 'Data Scientist',
    description: 'Analyze complex data to extract insights and build predictive models. Use statistical methods, machine learning, and data visualization to solve business problems.',
    category: 'Technology',
    subcategory: 'Data & Analytics',
    requiredSkills: [
      { skill: 'Python', importance: 'critical', proficiencyLevel: 'intermediate', category: 'technical' },
      { skill: 'Statistics', importance: 'critical', proficiencyLevel: 'intermediate', category: 'technical' },
      { skill: 'SQL', importance: 'critical', proficiencyLevel: 'intermediate', category: 'technical' },
      { skill: 'Data Analysis', importance: 'critical', proficiencyLevel: 'intermediate', category: 'technical' }
    ],
    preferredSkills: [
      { skill: 'Machine Learning', importance: 'important', proficiencyLevel: 'intermediate', category: 'technical' },
      { skill: 'R', importance: 'nice-to-have', proficiencyLevel: 'beginner', category: 'technical' },
      { skill: 'Tableau', importance: 'important', proficiencyLevel: 'beginner', category: 'technical' }
    ],
    experienceLevel: 'mid',
    salaryRange: { min: 80000, max: 150000, currency: 'USD', period: 'yearly' },
    growthProspects: 'high',
    workEnvironment: {
      remote: true,
      hybrid: true,
      onsite: true,
      teamSize: '2-6 people',
      workStyle: ['analytical', 'research-oriented', 'detail-oriented']
    },
    industryTrends: { demand: 'high', growth: 20, competitiveness: 'high' },
    relatedCareers: ['Data Analyst', 'Machine Learning Engineer', 'Business Intelligence Analyst'],
    keywords: ['data science', 'machine learning', 'analytics', 'statistics', 'python', 'modeling']
  },

  {
    id: 'ux-designer',
    title: 'UX/UI Designer',
    description: 'Design user-centered digital experiences by researching user needs, creating wireframes, prototypes, and visual designs for websites and applications.',
    category: 'Design',
    subcategory: 'User Experience',
    requiredSkills: [
      { skill: 'User Research', importance: 'critical', proficiencyLevel: 'intermediate', category: 'domain' },
      { skill: 'Wireframing', importance: 'critical', proficiencyLevel: 'intermediate', category: 'technical' },
      { skill: 'Prototyping', importance: 'critical', proficiencyLevel: 'intermediate', category: 'technical' },
      { skill: 'Design Thinking', importance: 'critical', proficiencyLevel: 'intermediate', category: 'soft' }
    ],
    preferredSkills: [
      { skill: 'Figma', importance: 'important', proficiencyLevel: 'intermediate', category: 'technical' },
      { skill: 'Adobe Creative Suite', importance: 'important', proficiencyLevel: 'beginner', category: 'technical' },
      { skill: 'HTML/CSS', importance: 'nice-to-have', proficiencyLevel: 'beginner', category: 'technical' }
    ],
    experienceLevel: 'entry',
    salaryRange: { min: 55000, max: 110000, currency: 'USD', period: 'yearly' },
    growthProspects: 'high',
    workEnvironment: {
      remote: true,
      hybrid: true,
      onsite: true,
      teamSize: '2-5 people',
      workStyle: ['creative', 'user-focused', 'collaborative']
    },
    industryTrends: { demand: 'high', growth: 12, competitiveness: 'medium' },
    relatedCareers: ['Product Designer', 'Visual Designer', 'Interaction Designer'],
    keywords: ['ux design', 'ui design', 'user experience', 'design', 'prototyping', 'user research']
  },

  {
    id: 'product-manager',
    title: 'Product Manager',
    description: 'Lead product development from conception to launch. Define product strategy, work with cross-functional teams, and ensure products meet user needs and business goals.',
    category: 'Business',
    subcategory: 'Product Management',
    requiredSkills: [
      { skill: 'Product Strategy', importance: 'critical', proficiencyLevel: 'intermediate', category: 'domain' },
      { skill: 'Market Research', importance: 'critical', proficiencyLevel: 'intermediate', category: 'domain' },
      { skill: 'Project Management', importance: 'critical', proficiencyLevel: 'intermediate', category: 'soft' },
      { skill: 'Communication', importance: 'critical', proficiencyLevel: 'advanced', category: 'soft' }
    ],
    preferredSkills: [
      { skill: 'Agile/Scrum', importance: 'important', proficiencyLevel: 'intermediate', category: 'domain' },
      { skill: 'Data Analysis', importance: 'important', proficiencyLevel: 'beginner', category: 'technical' },
      { skill: 'User Experience', importance: 'important', proficiencyLevel: 'beginner', category: 'domain' }
    ],
    experienceLevel: 'mid',
    salaryRange: { min: 90000, max: 160000, currency: 'USD', period: 'yearly' },
    growthProspects: 'high',
    workEnvironment: {
      remote: true,
      hybrid: true,
      onsite: true,
      teamSize: '5-15 people',
      workStyle: ['strategic', 'collaborative', 'leadership']
    },
    industryTrends: { demand: 'high', growth: 18, competitiveness: 'high' },
    relatedCareers: ['Business Analyst', 'Program Manager', 'Strategy Consultant'],
    keywords: ['product management', 'strategy', 'leadership', 'business', 'agile', 'roadmap']
  },

  {
    id: 'cybersecurity-analyst',
    title: 'Cybersecurity Analyst',
    description: 'Protect organizations from cyber threats by monitoring security systems, investigating incidents, implementing security measures, and ensuring compliance.',
    category: 'Technology',
    subcategory: 'Security',
    requiredSkills: [
      { skill: 'Network Security', importance: 'critical', proficiencyLevel: 'intermediate', category: 'technical' },
      { skill: 'Risk Assessment', importance: 'critical', proficiencyLevel: 'intermediate', category: 'domain' },
      { skill: 'Incident Response', importance: 'critical', proficiencyLevel: 'intermediate', category: 'domain' },
      { skill: 'Security Tools', importance: 'critical', proficiencyLevel: 'intermediate', category: 'technical' }
    ],
    preferredSkills: [
      { skill: 'Penetration Testing', importance: 'important', proficiencyLevel: 'beginner', category: 'technical' },
      { skill: 'CISSP', importance: 'nice-to-have', proficiencyLevel: 'beginner', category: 'certification' },
      { skill: 'Python', importance: 'important', proficiencyLevel: 'beginner', category: 'technical' }
    ],
    experienceLevel: 'entry',
    salaryRange: { min: 65000, max: 120000, currency: 'USD', period: 'yearly' },
    growthProspects: 'high',
    workEnvironment: {
      remote: true,
      hybrid: true,
      onsite: true,
      teamSize: '3-8 people',
      workStyle: ['analytical', 'detail-oriented', 'problem-solving']
    },
    industryTrends: { demand: 'high', growth: 25, competitiveness: 'medium' },
    relatedCareers: ['Information Security Specialist', 'Security Engineer', 'Penetration Tester'],
    keywords: ['cybersecurity', 'security', 'network security', 'incident response', 'risk management']
  },

  {
    id: 'digital-marketing-specialist',
    title: 'Digital Marketing Specialist',
    description: 'Develop and execute digital marketing campaigns across various channels including social media, email, content marketing, and paid advertising.',
    category: 'Marketing',
    subcategory: 'Digital Marketing',
    requiredSkills: [
      { skill: 'Digital Marketing', importance: 'critical', proficiencyLevel: 'intermediate', category: 'domain' },
      { skill: 'Content Creation', importance: 'critical', proficiencyLevel: 'intermediate', category: 'soft' },
      { skill: 'Social Media Marketing', importance: 'critical', proficiencyLevel: 'intermediate', category: 'domain' },
      { skill: 'Analytics', importance: 'important', proficiencyLevel: 'intermediate', category: 'technical' }
    ],
    preferredSkills: [
      { skill: 'Google Ads', importance: 'important', proficiencyLevel: 'intermediate', category: 'technical' },
      { skill: 'SEO', importance: 'important', proficiencyLevel: 'beginner', category: 'technical' },
      { skill: 'Email Marketing', importance: 'important', proficiencyLevel: 'beginner', category: 'domain' }
    ],
    experienceLevel: 'entry',
    salaryRange: { min: 45000, max: 85000, currency: 'USD', period: 'yearly' },
    growthProspects: 'high',
    workEnvironment: {
      remote: true,
      hybrid: true,
      onsite: true,
      teamSize: '2-6 people',
      workStyle: ['creative', 'data-driven', 'fast-paced']
    },
    industryTrends: { demand: 'high', growth: 10, competitiveness: 'medium' },
    relatedCareers: ['Content Marketing Manager', 'Social Media Manager', 'SEO Specialist'],
    keywords: ['digital marketing', 'social media', 'content marketing', 'advertising', 'seo', 'analytics']
  },

  {
    id: 'business-analyst',
    title: 'Business Analyst',
    description: 'Bridge the gap between business needs and technology solutions by analyzing processes, gathering requirements, and recommending improvements.',
    category: 'Business',
    subcategory: 'Analysis',
    requiredSkills: [
      { skill: 'Business Analysis', importance: 'critical', proficiencyLevel: 'intermediate', category: 'domain' },
      { skill: 'Requirements Gathering', importance: 'critical', proficiencyLevel: 'intermediate', category: 'domain' },
      { skill: 'Process Mapping', importance: 'critical', proficiencyLevel: 'intermediate', category: 'technical' },
      { skill: 'Communication', importance: 'critical', proficiencyLevel: 'advanced', category: 'soft' }
    ],
    preferredSkills: [
      { skill: 'SQL', importance: 'important', proficiencyLevel: 'beginner', category: 'technical' },
      { skill: 'Excel', importance: 'important', proficiencyLevel: 'intermediate', category: 'technical' },
      { skill: 'Agile', importance: 'important', proficiencyLevel: 'beginner', category: 'domain' }
    ],
    experienceLevel: 'entry',
    salaryRange: { min: 55000, max: 95000, currency: 'USD', period: 'yearly' },
    growthProspects: 'medium',
    workEnvironment: {
      remote: true,
      hybrid: true,
      onsite: true,
      teamSize: '4-10 people',
      workStyle: ['analytical', 'collaborative', 'detail-oriented']
    },
    industryTrends: { demand: 'medium', growth: 8, competitiveness: 'medium' },
    relatedCareers: ['Systems Analyst', 'Product Owner', 'Process Improvement Specialist'],
    keywords: ['business analysis', 'requirements', 'process improvement', 'stakeholder management']
  },

  {
    id: 'cloud-architect',
    title: 'Cloud Solutions Architect',
    description: 'Design and implement cloud infrastructure solutions, migrate applications to cloud platforms, and optimize cloud environments for performance and cost.',
    category: 'Technology',
    subcategory: 'Cloud Computing',
    requiredSkills: [
      { skill: 'Cloud Platforms', importance: 'critical', proficiencyLevel: 'advanced', category: 'technical' },
      { skill: 'System Architecture', importance: 'critical', proficiencyLevel: 'advanced', category: 'technical' },
      { skill: 'DevOps', importance: 'critical', proficiencyLevel: 'intermediate', category: 'technical' },
      { skill: 'Security', importance: 'critical', proficiencyLevel: 'intermediate', category: 'domain' }
    ],
    preferredSkills: [
      { skill: 'AWS', importance: 'important', proficiencyLevel: 'advanced', category: 'technical' },
      { skill: 'Docker', importance: 'important', proficiencyLevel: 'intermediate', category: 'technical' },
      { skill: 'Kubernetes', importance: 'important', proficiencyLevel: 'intermediate', category: 'technical' }
    ],
    experienceLevel: 'senior',
    salaryRange: { min: 120000, max: 200000, currency: 'USD', period: 'yearly' },
    growthProspects: 'high',
    workEnvironment: {
      remote: true,
      hybrid: true,
      onsite: true,
      teamSize: '3-8 people',
      workStyle: ['strategic', 'technical', 'problem-solving']
    },
    industryTrends: { demand: 'high', growth: 22, competitiveness: 'high' },
    relatedCareers: ['DevOps Engineer', 'Infrastructure Engineer', 'Site Reliability Engineer'],
    keywords: ['cloud computing', 'aws', 'azure', 'architecture', 'devops', 'infrastructure']
  },

  {
    id: 'healthcare-data-analyst',
    title: 'Healthcare Data Analyst',
    description: 'Analyze healthcare data to improve patient outcomes, reduce costs, and support clinical decision-making using statistical methods and healthcare informatics.',
    category: 'Healthcare',
    subcategory: 'Health Informatics',
    requiredSkills: [
      { skill: 'Healthcare Knowledge', importance: 'critical', proficiencyLevel: 'intermediate', category: 'domain' },
      { skill: 'Data Analysis', importance: 'critical', proficiencyLevel: 'intermediate', category: 'technical' },
      { skill: 'SQL', importance: 'critical', proficiencyLevel: 'intermediate', category: 'technical' },
      { skill: 'Statistics', importance: 'critical', proficiencyLevel: 'intermediate', category: 'technical' }
    ],
    preferredSkills: [
      { skill: 'Python', importance: 'important', proficiencyLevel: 'beginner', category: 'technical' },
      { skill: 'Tableau', importance: 'important', proficiencyLevel: 'beginner', category: 'technical' },
      { skill: 'HIPAA Compliance', importance: 'important', proficiencyLevel: 'beginner', category: 'domain' }
    ],
    experienceLevel: 'mid',
    salaryRange: { min: 65000, max: 110000, currency: 'USD', period: 'yearly' },
    growthProspects: 'high',
    workEnvironment: {
      remote: false,
      hybrid: true,
      onsite: true,
      teamSize: '3-7 people',
      workStyle: ['analytical', 'detail-oriented', 'healthcare-focused']
    },
    industryTrends: { demand: 'high', growth: 18, competitiveness: 'medium' },
    relatedCareers: ['Clinical Data Manager', 'Health Informatics Specialist', 'Epidemiologist'],
    keywords: ['healthcare', 'medical data', 'health informatics', 'clinical analysis', 'patient outcomes']
  },

  {
    id: 'financial-analyst',
    title: 'Financial Analyst',
    description: 'Analyze financial data, create financial models, prepare reports, and provide recommendations to support business decisions and investment strategies.',
    category: 'Finance',
    subcategory: 'Financial Analysis',
    requiredSkills: [
      { skill: 'Financial Modeling', importance: 'critical', proficiencyLevel: 'intermediate', category: 'technical' },
      { skill: 'Excel', importance: 'critical', proficiencyLevel: 'advanced', category: 'technical' },
      { skill: 'Financial Analysis', importance: 'critical', proficiencyLevel: 'intermediate', category: 'domain' },
      { skill: 'Accounting Principles', importance: 'critical', proficiencyLevel: 'intermediate', category: 'domain' }
    ],
    preferredSkills: [
      { skill: 'SQL', importance: 'important', proficiencyLevel: 'beginner', category: 'technical' },
      { skill: 'PowerBI', importance: 'nice-to-have', proficiencyLevel: 'beginner', category: 'technical' },
      { skill: 'CFA', importance: 'nice-to-have', proficiencyLevel: 'beginner', category: 'certification' }
    ],
    experienceLevel: 'entry',
    salaryRange: { min: 55000, max: 95000, currency: 'USD', period: 'yearly' },
    growthProspects: 'medium',
    workEnvironment: {
      remote: true,
      hybrid: true,
      onsite: true,
      teamSize: '3-8 people',
      workStyle: ['analytical', 'detail-oriented', 'deadline-driven']
    },
    industryTrends: { demand: 'medium', growth: 5, competitiveness: 'medium' },
    relatedCareers: ['Investment Analyst', 'Budget Analyst', 'Risk Analyst'],
    keywords: ['finance', 'financial analysis', 'modeling', 'investment', 'budgeting', 'forecasting']
  },

  // Additional careers to reach 50+ diverse options
  {
    id: 'mobile-app-developer',
    title: 'Mobile App Developer',
    description: 'Develop mobile applications for iOS and Android platforms using native or cross-platform technologies.',
    category: 'Technology',
    subcategory: 'Mobile Development',
    requiredSkills: [
      { skill: 'Mobile Development', importance: 'critical', proficiencyLevel: 'intermediate', category: 'technical' },
      { skill: 'Programming', importance: 'critical', proficiencyLevel: 'intermediate', category: 'technical' },
      { skill: 'UI/UX Design', importance: 'important', proficiencyLevel: 'beginner', category: 'technical' }
    ],
    preferredSkills: [
      { skill: 'React Native', importance: 'important', proficiencyLevel: 'intermediate', category: 'technical' },
      { skill: 'Swift', importance: 'nice-to-have', proficiencyLevel: 'beginner', category: 'technical' },
      { skill: 'Kotlin', importance: 'nice-to-have', proficiencyLevel: 'beginner', category: 'technical' }
    ],
    experienceLevel: 'entry',
    salaryRange: { min: 65000, max: 125000, currency: 'USD', period: 'yearly' },
    growthProspects: 'high',
    workEnvironment: {
      remote: true,
      hybrid: true,
      onsite: true,
      teamSize: '2-6 people',
      workStyle: ['creative', 'technical', 'user-focused']
    },
    industryTrends: { demand: 'high', growth: 15, competitiveness: 'medium' },
    relatedCareers: ['iOS Developer', 'Android Developer', 'Frontend Developer'],
    keywords: ['mobile development', 'ios', 'android', 'react native', 'app development']
  },

  {
    id: 'content-creator',
    title: 'Content Creator',
    description: 'Create engaging content across various digital platforms including video, podcasts, blogs, and social media to build audiences and drive engagement.',
    category: 'Creative',
    subcategory: 'Content Creation',
    requiredSkills: [
      { skill: 'Content Creation', importance: 'critical', proficiencyLevel: 'intermediate', category: 'soft' },
      { skill: 'Storytelling', importance: 'critical', proficiencyLevel: 'intermediate', category: 'soft' },
      { skill: 'Social Media', importance: 'critical', proficiencyLevel: 'intermediate', category: 'domain' },
      { skill: 'Video Editing', importance: 'important', proficiencyLevel: 'beginner', category: 'technical' }
    ],
    preferredSkills: [
      { skill: 'Photography', importance: 'important', proficiencyLevel: 'beginner', category: 'technical' },
      { skill: 'Adobe Creative Suite', importance: 'important', proficiencyLevel: 'beginner', category: 'technical' },
      { skill: 'SEO', importance: 'nice-to-have', proficiencyLevel: 'beginner', category: 'technical' }
    ],
    experienceLevel: 'entry',
    salaryRange: { min: 35000, max: 75000, currency: 'USD', period: 'yearly' },
    growthProspects: 'medium',
    workEnvironment: {
      remote: true,
      hybrid: true,
      onsite: false,
      teamSize: '1-3 people',
      workStyle: ['creative', 'independent', 'audience-focused']
    },
    industryTrends: { demand: 'high', growth: 12, competitiveness: 'high' },
    relatedCareers: ['Social Media Manager', 'Video Producer', 'Blogger'],
    keywords: ['content creation', 'social media', 'video', 'blogging', 'influencer', 'digital content']
  },

  {
    id: 'sustainability-consultant',
    title: 'Sustainability Consultant',
    description: 'Help organizations develop and implement sustainable practices, reduce environmental impact, and achieve sustainability goals.',
    category: 'Consulting',
    subcategory: 'Environmental',
    requiredSkills: [
      { skill: 'Sustainability Knowledge', importance: 'critical', proficiencyLevel: 'intermediate', category: 'domain' },
      { skill: 'Environmental Science', importance: 'critical', proficiencyLevel: 'intermediate', category: 'domain' },
      { skill: 'Project Management', importance: 'important', proficiencyLevel: 'intermediate', category: 'soft' },
      { skill: 'Data Analysis', importance: 'important', proficiencyLevel: 'beginner', category: 'technical' }
    ],
    preferredSkills: [
      { skill: 'LEED Certification', importance: 'nice-to-have', proficiencyLevel: 'beginner', category: 'certification' },
      { skill: 'Carbon Accounting', importance: 'important', proficiencyLevel: 'beginner', category: 'domain' },
      { skill: 'Stakeholder Engagement', importance: 'important', proficiencyLevel: 'intermediate', category: 'soft' }
    ],
    experienceLevel: 'mid',
    salaryRange: { min: 60000, max: 110000, currency: 'USD', period: 'yearly' },
    growthProspects: 'high',
    workEnvironment: {
      remote: true,
      hybrid: true,
      onsite: true,
      teamSize: '2-5 people',
      workStyle: ['analytical', 'mission-driven', 'collaborative']
    },
    industryTrends: { demand: 'high', growth: 20, competitiveness: 'medium' },
    relatedCareers: ['Environmental Consultant', 'ESG Analyst', 'Climate Change Analyst'],
    keywords: ['sustainability', 'environmental', 'green technology', 'climate', 'renewable energy']
  },

  {
    id: 'ai-engineer',
    title: 'AI/Machine Learning Engineer',
    description: 'Design, develop, and deploy artificial intelligence and machine learning systems to solve complex problems and automate processes.',
    category: 'Technology',
    subcategory: 'Artificial Intelligence',
    requiredSkills: [
      { skill: 'Machine Learning', importance: 'critical', proficiencyLevel: 'advanced', category: 'technical' },
      { skill: 'Python', importance: 'critical', proficiencyLevel: 'advanced', category: 'technical' },
      { skill: 'Deep Learning', importance: 'critical', proficiencyLevel: 'intermediate', category: 'technical' },
      { skill: 'Statistics', importance: 'critical', proficiencyLevel: 'intermediate', category: 'technical' }
    ],
    preferredSkills: [
      { skill: 'TensorFlow', importance: 'important', proficiencyLevel: 'intermediate', category: 'technical' },
      { skill: 'PyTorch', importance: 'important', proficiencyLevel: 'intermediate', category: 'technical' },
      { skill: 'MLOps', importance: 'important', proficiencyLevel: 'beginner', category: 'technical' }
    ],
    experienceLevel: 'mid',
    salaryRange: { min: 100000, max: 180000, currency: 'USD', period: 'yearly' },
    growthProspects: 'high',
    workEnvironment: {
      remote: true,
      hybrid: true,
      onsite: true,
      teamSize: '3-8 people',
      workStyle: ['research-oriented', 'technical', 'innovative']
    },
    industryTrends: { demand: 'high', growth: 30, competitiveness: 'high' },
    relatedCareers: ['Data Scientist', 'Research Scientist', 'Computer Vision Engineer'],
    keywords: ['artificial intelligence', 'machine learning', 'deep learning', 'ai', 'neural networks']
  },

  {
    id: 'technical-writer',
    title: 'Technical Writer',
    description: 'Create clear, concise documentation for technical products, APIs, software, and complex systems to help users understand and use technology effectively.',
    category: 'Communication',
    subcategory: 'Technical Writing',
    requiredSkills: [
      { skill: 'Technical Writing', importance: 'critical', proficiencyLevel: 'advanced', category: 'soft' },
      { skill: 'Documentation', importance: 'critical', proficiencyLevel: 'intermediate', category: 'domain' },
      { skill: 'Communication', importance: 'critical', proficiencyLevel: 'advanced', category: 'soft' },
      { skill: 'Research Skills', importance: 'important', proficiencyLevel: 'intermediate', category: 'soft' }
    ],
    preferredSkills: [
      { skill: 'Markdown', importance: 'important', proficiencyLevel: 'intermediate', category: 'technical' },
      { skill: 'Git', importance: 'nice-to-have', proficiencyLevel: 'beginner', category: 'technical' },
      { skill: 'API Documentation', importance: 'important', proficiencyLevel: 'beginner', category: 'domain' }
    ],
    experienceLevel: 'entry',
    salaryRange: { min: 50000, max: 90000, currency: 'USD', period: 'yearly' },
    growthProspects: 'medium',
    workEnvironment: {
      remote: true,
      hybrid: true,
      onsite: true,
      teamSize: '1-4 people',
      workStyle: ['detail-oriented', 'collaborative', 'user-focused']
    },
    industryTrends: { demand: 'medium', growth: 8, competitiveness: 'low' },
    relatedCareers: ['Content Strategist', 'UX Writer', 'Documentation Specialist'],
    keywords: ['technical writing', 'documentation', 'api docs', 'user guides', 'technical communication']
  },

  // Healthcare & Medical
  {
    id: 'nurse-practitioner',
    title: 'Nurse Practitioner',
    description: 'Provide advanced nursing care, diagnose conditions, prescribe treatments, and educate patients in various healthcare settings.',
    category: 'Healthcare',
    subcategory: 'Nursing',
    requiredSkills: [
      { skill: 'Clinical Assessment', importance: 'critical', proficiencyLevel: 'advanced', category: 'domain' },
      { skill: 'Patient Care', importance: 'critical', proficiencyLevel: 'advanced', category: 'domain' },
      { skill: 'Medical Knowledge', importance: 'critical', proficiencyLevel: 'advanced', category: 'domain' },
      { skill: 'Communication', importance: 'critical', proficiencyLevel: 'advanced', category: 'soft' }
    ],
    preferredSkills: [
      { skill: 'Electronic Health Records', importance: 'important', proficiencyLevel: 'intermediate', category: 'technical' },
      { skill: 'Leadership', importance: 'important', proficiencyLevel: 'intermediate', category: 'soft' },
      { skill: 'Research', importance: 'nice-to-have', proficiencyLevel: 'beginner', category: 'soft' }
    ],
    experienceLevel: 'senior',
    salaryRange: { min: 90000, max: 130000, currency: 'USD', period: 'yearly' },
    growthProspects: 'high',
    workEnvironment: {
      remote: false,
      hybrid: false,
      onsite: true,
      teamSize: '5-15 people',
      workStyle: ['patient-focused', 'collaborative', 'detail-oriented']
    },
    industryTrends: { demand: 'high', growth: 28, competitiveness: 'medium' },
    relatedCareers: ['Registered Nurse', 'Physician Assistant', 'Clinical Specialist'],
    keywords: ['healthcare', 'nursing', 'patient care', 'clinical', 'medical', 'diagnosis']
  },

  {
    id: 'physical-therapist',
    title: 'Physical Therapist',
    description: 'Help patients recover from injuries and improve mobility through therapeutic exercises and treatment plans.',
    category: 'Healthcare',
    subcategory: 'Rehabilitation',
    requiredSkills: [
      { skill: 'Anatomy Knowledge', importance: 'critical', proficiencyLevel: 'advanced', category: 'domain' },
      { skill: 'Therapeutic Techniques', importance: 'critical', proficiencyLevel: 'advanced', category: 'domain' },
      { skill: 'Patient Assessment', importance: 'critical', proficiencyLevel: 'intermediate', category: 'domain' },
      { skill: 'Empathy', importance: 'critical', proficiencyLevel: 'advanced', category: 'soft' }
    ],
    preferredSkills: [
      { skill: 'Manual Therapy', importance: 'important', proficiencyLevel: 'intermediate', category: 'domain' },
      { skill: 'Exercise Prescription', importance: 'important', proficiencyLevel: 'intermediate', category: 'domain' }
    ],
    experienceLevel: 'mid',
    salaryRange: { min: 75000, max: 95000, currency: 'USD', period: 'yearly' },
    growthProspects: 'high',
    workEnvironment: {
      remote: false,
      hybrid: false,
      onsite: true,
      teamSize: '3-8 people',
      workStyle: ['hands-on', 'patient-focused', 'encouraging']
    },
    industryTrends: { demand: 'high', growth: 21, competitiveness: 'medium' },
    relatedCareers: ['Occupational Therapist', 'Sports Medicine Specialist', 'Rehabilitation Counselor'],
    keywords: ['physical therapy', 'rehabilitation', 'mobility', 'injury recovery', 'therapeutic exercise']
  },

  // Education
  {
    id: 'elementary-teacher',
    title: 'Elementary School Teacher',
    description: 'Educate and nurture young students in foundational subjects while fostering social and emotional development.',
    category: 'Education',
    subcategory: 'K-12 Education',
    requiredSkills: [
      { skill: 'Classroom Management', importance: 'critical', proficiencyLevel: 'intermediate', category: 'soft' },
      { skill: 'Curriculum Development', importance: 'critical', proficiencyLevel: 'intermediate', category: 'domain' },
      { skill: 'Child Psychology', importance: 'important', proficiencyLevel: 'intermediate', category: 'domain' },
      { skill: 'Communication', importance: 'critical', proficiencyLevel: 'advanced', category: 'soft' }
    ],
    preferredSkills: [
      { skill: 'Technology Integration', importance: 'important', proficiencyLevel: 'beginner', category: 'technical' },
      { skill: 'Special Education', importance: 'nice-to-have', proficiencyLevel: 'beginner', category: 'domain' }
    ],
    experienceLevel: 'entry',
    salaryRange: { min: 40000, max: 65000, currency: 'USD', period: 'yearly' },
    growthProspects: 'low',
    workEnvironment: {
      remote: false,
      hybrid: false,
      onsite: true,
      teamSize: '20-30 students',
      workStyle: ['nurturing', 'organized', 'creative']
    },
    industryTrends: { demand: 'medium', growth: 4, competitiveness: 'low' },
    relatedCareers: ['Middle School Teacher', 'Special Education Teacher', 'Curriculum Specialist'],
    keywords: ['education', 'teaching', 'elementary', 'classroom', 'child development', 'learning']
  },

  {
    id: 'instructional-designer',
    title: 'Instructional Designer',
    description: 'Design and develop educational programs, courses, and training materials using learning theory and technology.',
    category: 'Education',
    subcategory: 'Educational Technology',
    requiredSkills: [
      { skill: 'Learning Theory', importance: 'critical', proficiencyLevel: 'intermediate', category: 'domain' },
      { skill: 'Curriculum Design', importance: 'critical', proficiencyLevel: 'intermediate', category: 'domain' },
      { skill: 'E-Learning Tools', importance: 'critical', proficiencyLevel: 'intermediate', category: 'technical' },
      { skill: 'Assessment Design', importance: 'important', proficiencyLevel: 'intermediate', category: 'domain' }
    ],
    preferredSkills: [
      { skill: 'Articulate Storyline', importance: 'important', proficiencyLevel: 'intermediate', category: 'technical' },
      { skill: 'Adobe Captivate', importance: 'nice-to-have', proficiencyLevel: 'beginner', category: 'technical' },
      { skill: 'LMS Administration', importance: 'important', proficiencyLevel: 'beginner', category: 'technical' }
    ],
    experienceLevel: 'mid',
    salaryRange: { min: 55000, max: 90000, currency: 'USD', period: 'yearly' },
    growthProspects: 'high',
    workEnvironment: {
      remote: true,
      hybrid: true,
      onsite: true,
      teamSize: '2-6 people',
      workStyle: ['creative', 'analytical', 'learner-focused']
    },
    industryTrends: { demand: 'high', growth: 15, competitiveness: 'medium' },
    relatedCareers: ['Training Specialist', 'Educational Consultant', 'Learning Experience Designer'],
    keywords: ['instructional design', 'e-learning', 'training', 'curriculum', 'educational technology']
  },

  // Creative & Arts
  {
    id: 'graphic-designer',
    title: 'Graphic Designer',
    description: 'Create visual concepts and designs for print, digital media, branding, and marketing materials.',
    category: 'Creative',
    subcategory: 'Visual Design',
    requiredSkills: [
      { skill: 'Adobe Creative Suite', importance: 'critical', proficiencyLevel: 'advanced', category: 'technical' },
      { skill: 'Visual Design', importance: 'critical', proficiencyLevel: 'intermediate', category: 'technical' },
      { skill: 'Typography', importance: 'critical', proficiencyLevel: 'intermediate', category: 'technical' },
      { skill: 'Color Theory', importance: 'important', proficiencyLevel: 'intermediate', category: 'domain' }
    ],
    preferredSkills: [
      { skill: 'Branding', importance: 'important', proficiencyLevel: 'beginner', category: 'domain' },
      { skill: 'Web Design', importance: 'nice-to-have', proficiencyLevel: 'beginner', category: 'technical' },
      { skill: 'Print Design', importance: 'important', proficiencyLevel: 'intermediate', category: 'domain' }
    ],
    experienceLevel: 'entry',
    salaryRange: { min: 40000, max: 70000, currency: 'USD', period: 'yearly' },
    growthProspects: 'medium',
    workEnvironment: {
      remote: true,
      hybrid: true,
      onsite: true,
      teamSize: '2-5 people',
      workStyle: ['creative', 'visual', 'client-focused']
    },
    industryTrends: { demand: 'medium', growth: 3, competitiveness: 'high' },
    relatedCareers: ['UI Designer', 'Brand Designer', 'Art Director'],
    keywords: ['graphic design', 'visual design', 'branding', 'print design', 'digital design', 'creativity']
  },

  {
    id: 'video-editor',
    title: 'Video Editor',
    description: 'Edit and produce video content for various media including films, commercials, social media, and online content.',
    category: 'Creative',
    subcategory: 'Video Production',
    requiredSkills: [
      { skill: 'Video Editing', importance: 'critical', proficiencyLevel: 'advanced', category: 'technical' },
      { skill: 'Storytelling', importance: 'critical', proficiencyLevel: 'intermediate', category: 'soft' },
      { skill: 'Audio Editing', importance: 'important', proficiencyLevel: 'intermediate', category: 'technical' },
      { skill: 'Color Correction', importance: 'important', proficiencyLevel: 'intermediate', category: 'technical' }
    ],
    preferredSkills: [
      { skill: 'After Effects', importance: 'important', proficiencyLevel: 'intermediate', category: 'technical' },
      { skill: 'Premiere Pro', importance: 'important', proficiencyLevel: 'advanced', category: 'technical' },
      { skill: 'Motion Graphics', importance: 'nice-to-have', proficiencyLevel: 'beginner', category: 'technical' }
    ],
    experienceLevel: 'entry',
    salaryRange: { min: 35000, max: 75000, currency: 'USD', period: 'yearly' },
    growthProspects: 'high',
    workEnvironment: {
      remote: true,
      hybrid: true,
      onsite: true,
      teamSize: '1-4 people',
      workStyle: ['creative', 'detail-oriented', 'deadline-driven']
    },
    industryTrends: { demand: 'high', growth: 18, competitiveness: 'medium' },
    relatedCareers: ['Motion Graphics Designer', 'Videographer', 'Post-Production Specialist'],
    keywords: ['video editing', 'post-production', 'motion graphics', 'storytelling', 'multimedia']
  },

  // Sales & Customer Service
  {
    id: 'sales-representative',
    title: 'Sales Representative',
    description: 'Build relationships with customers, identify sales opportunities, and drive revenue growth through effective sales strategies.',
    category: 'Sales',
    subcategory: 'B2B Sales',
    requiredSkills: [
      { skill: 'Sales Techniques', importance: 'critical', proficiencyLevel: 'intermediate', category: 'domain' },
      { skill: 'Relationship Building', importance: 'critical', proficiencyLevel: 'advanced', category: 'soft' },
      { skill: 'Communication', importance: 'critical', proficiencyLevel: 'advanced', category: 'soft' },
      { skill: 'Negotiation', importance: 'critical', proficiencyLevel: 'intermediate', category: 'soft' }
    ],
    preferredSkills: [
      { skill: 'CRM Software', importance: 'important', proficiencyLevel: 'beginner', category: 'technical' },
      { skill: 'Lead Generation', importance: 'important', proficiencyLevel: 'beginner', category: 'domain' },
      { skill: 'Product Knowledge', importance: 'important', proficiencyLevel: 'intermediate', category: 'domain' }
    ],
    experienceLevel: 'entry',
    salaryRange: { min: 40000, max: 80000, currency: 'USD', period: 'yearly' },
    growthProspects: 'high',
    workEnvironment: {
      remote: true,
      hybrid: true,
      onsite: true,
      teamSize: '3-10 people',
      workStyle: ['persuasive', 'goal-oriented', 'relationship-focused']
    },
    industryTrends: { demand: 'high', growth: 8, competitiveness: 'medium' },
    relatedCareers: ['Account Manager', 'Business Development Representative', 'Sales Manager'],
    keywords: ['sales', 'business development', 'revenue growth', 'client relationships', 'negotiation']
  },

  {
    id: 'customer-success-manager',
    title: 'Customer Success Manager',
    description: 'Ensure customer satisfaction, drive product adoption, and reduce churn by building strong customer relationships.',
    category: 'Customer Service',
    subcategory: 'Customer Success',
    requiredSkills: [
      { skill: 'Customer Relationship Management', importance: 'critical', proficiencyLevel: 'advanced', category: 'domain' },
      { skill: 'Problem Solving', importance: 'critical', proficiencyLevel: 'intermediate', category: 'soft' },
      { skill: 'Communication', importance: 'critical', proficiencyLevel: 'advanced', category: 'soft' },
      { skill: 'Data Analysis', importance: 'important', proficiencyLevel: 'beginner', category: 'technical' }
    ],
    preferredSkills: [
      { skill: 'SaaS Knowledge', importance: 'important', proficiencyLevel: 'beginner', category: 'domain' },
      { skill: 'Project Management', importance: 'important', proficiencyLevel: 'beginner', category: 'soft' },
      { skill: 'Salesforce', importance: 'nice-to-have', proficiencyLevel: 'beginner', category: 'technical' }
    ],
    experienceLevel: 'mid',
    salaryRange: { min: 55000, max: 95000, currency: 'USD', period: 'yearly' },
    growthProspects: 'high',
    workEnvironment: {
      remote: true,
      hybrid: true,
      onsite: true,
      teamSize: '3-8 people',
      workStyle: ['customer-focused', 'proactive', 'analytical']
    },
    industryTrends: { demand: 'high', growth: 15, competitiveness: 'medium' },
    relatedCareers: ['Account Manager', 'Customer Support Specialist', 'Implementation Manager'],
    keywords: ['customer success', 'customer retention', 'saas', 'client relationships', 'account management']
  },

  // Engineering & Manufacturing
  {
    id: 'mechanical-engineer',
    title: 'Mechanical Engineer',
    description: 'Design, develop, and test mechanical systems and products including engines, machines, and manufacturing equipment.',
    category: 'Engineering',
    subcategory: 'Mechanical Engineering',
    requiredSkills: [
      { skill: 'CAD Software', importance: 'critical', proficiencyLevel: 'advanced', category: 'technical' },
      { skill: 'Engineering Principles', importance: 'critical', proficiencyLevel: 'advanced', category: 'domain' },
      { skill: 'Problem Solving', importance: 'critical', proficiencyLevel: 'advanced', category: 'soft' },
      { skill: 'Mathematics', importance: 'critical', proficiencyLevel: 'advanced', category: 'technical' }
    ],
    preferredSkills: [
      { skill: 'SolidWorks', importance: 'important', proficiencyLevel: 'intermediate', category: 'technical' },
      { skill: 'Project Management', importance: 'important', proficiencyLevel: 'beginner', category: 'soft' },
      { skill: 'Manufacturing Processes', importance: 'important', proficiencyLevel: 'intermediate', category: 'domain' }
    ],
    experienceLevel: 'mid',
    salaryRange: { min: 65000, max: 105000, currency: 'USD', period: 'yearly' },
    growthProspects: 'medium',
    workEnvironment: {
      remote: false,
      hybrid: true,
      onsite: true,
      teamSize: '4-12 people',
      workStyle: ['analytical', 'detail-oriented', 'hands-on']
    },
    industryTrends: { demand: 'medium', growth: 7, competitiveness: 'medium' },
    relatedCareers: ['Design Engineer', 'Manufacturing Engineer', 'Project Engineer'],
    keywords: ['mechanical engineering', 'design', 'manufacturing', 'cad', 'product development']
  },

  {
    id: 'electrical-engineer',
    title: 'Electrical Engineer',
    description: 'Design, develop, and test electrical systems, components, and equipment for various applications.',
    category: 'Engineering',
    subcategory: 'Electrical Engineering',
    requiredSkills: [
      { skill: 'Circuit Design', importance: 'critical', proficiencyLevel: 'advanced', category: 'technical' },
      { skill: 'Electrical Systems', importance: 'critical', proficiencyLevel: 'advanced', category: 'domain' },
      { skill: 'Mathematics', importance: 'critical', proficiencyLevel: 'advanced', category: 'technical' },
      { skill: 'Testing & Troubleshooting', importance: 'critical', proficiencyLevel: 'intermediate', category: 'technical' }
    ],
    preferredSkills: [
      { skill: 'AutoCAD', importance: 'important', proficiencyLevel: 'intermediate', category: 'technical' },
      { skill: 'Power Systems', importance: 'nice-to-have', proficiencyLevel: 'beginner', category: 'domain' },
      { skill: 'Programming', importance: 'nice-to-have', proficiencyLevel: 'beginner', category: 'technical' }
    ],
    experienceLevel: 'mid',
    salaryRange: { min: 70000, max: 115000, currency: 'USD', period: 'yearly' },
    growthProspects: 'medium',
    workEnvironment: {
      remote: false,
      hybrid: true,
      onsite: true,
      teamSize: '3-10 people',
      workStyle: ['analytical', 'precise', 'technical']
    },
    industryTrends: { demand: 'medium', growth: 5, competitiveness: 'medium' },
    relatedCareers: ['Electronics Engineer', 'Power Engineer', 'Control Systems Engineer'],
    keywords: ['electrical engineering', 'circuits', 'power systems', 'electronics', 'automation']
  },

  // Legal & Government
  {
    id: 'paralegal',
    title: 'Paralegal',
    description: 'Assist lawyers by conducting legal research, preparing documents, and supporting case preparation.',
    category: 'Legal',
    subcategory: 'Legal Support',
    requiredSkills: [
      { skill: 'Legal Research', importance: 'critical', proficiencyLevel: 'intermediate', category: 'domain' },
      { skill: 'Document Preparation', importance: 'critical', proficiencyLevel: 'intermediate', category: 'domain' },
      { skill: 'Legal Writing', importance: 'critical', proficiencyLevel: 'intermediate', category: 'soft' },
      { skill: 'Attention to Detail', importance: 'critical', proficiencyLevel: 'advanced', category: 'soft' }
    ],
    preferredSkills: [
      { skill: 'Case Management Software', importance: 'important', proficiencyLevel: 'beginner', category: 'technical' },
      { skill: 'Court Procedures', importance: 'important', proficiencyLevel: 'beginner', category: 'domain' },
      { skill: 'Client Communication', importance: 'important', proficiencyLevel: 'intermediate', category: 'soft' }
    ],
    experienceLevel: 'entry',
    salaryRange: { min: 35000, max: 60000, currency: 'USD', period: 'yearly' },
    growthProspects: 'medium',
    workEnvironment: {
      remote: false,
      hybrid: true,
      onsite: true,
      teamSize: '2-8 people',
      workStyle: ['detail-oriented', 'organized', 'deadline-driven']
    },
    industryTrends: { demand: 'medium', growth: 12, competitiveness: 'medium' },
    relatedCareers: ['Legal Assistant', 'Court Reporter', 'Legal Secretary'],
    keywords: ['paralegal', 'legal research', 'law', 'litigation support', 'legal documents']
  },

  {
    id: 'policy-analyst',
    title: 'Policy Analyst',
    description: 'Research and analyze policies, evaluate their effectiveness, and provide recommendations for government or organizational decision-making.',
    category: 'Government',
    subcategory: 'Policy & Research',
    requiredSkills: [
      { skill: 'Policy Analysis', importance: 'critical', proficiencyLevel: 'intermediate', category: 'domain' },
      { skill: 'Research Methods', importance: 'critical', proficiencyLevel: 'intermediate', category: 'domain' },
      { skill: 'Data Analysis', importance: 'critical', proficiencyLevel: 'intermediate', category: 'technical' },
      { skill: 'Report Writing', importance: 'critical', proficiencyLevel: 'advanced', category: 'soft' }
    ],
    preferredSkills: [
      { skill: 'Statistical Analysis', importance: 'important', proficiencyLevel: 'beginner', category: 'technical' },
      { skill: 'Public Administration', importance: 'important', proficiencyLevel: 'beginner', category: 'domain' },
      { skill: 'Economics', importance: 'nice-to-have', proficiencyLevel: 'beginner', category: 'domain' }
    ],
    experienceLevel: 'mid',
    salaryRange: { min: 55000, max: 90000, currency: 'USD', period: 'yearly' },
    growthProspects: 'medium',
    workEnvironment: {
      remote: true,
      hybrid: true,
      onsite: true,
      teamSize: '3-8 people',
      workStyle: ['analytical', 'research-focused', 'detail-oriented']
    },
    industryTrends: { demand: 'medium', growth: 8, competitiveness: 'medium' },
    relatedCareers: ['Research Analyst', 'Program Analyst', 'Legislative Assistant'],
    keywords: ['policy analysis', 'government', 'public policy', 'research', 'analysis', 'legislation']
  },

  // Science & Research
  {
    id: 'research-scientist',
    title: 'Research Scientist',
    description: 'Conduct scientific research, design experiments, analyze data, and publish findings to advance knowledge in specific fields.',
    category: 'Science',
    subcategory: 'Research',
    requiredSkills: [
      { skill: 'Scientific Method', importance: 'critical', proficiencyLevel: 'advanced', category: 'domain' },
      { skill: 'Data Analysis', importance: 'critical', proficiencyLevel: 'advanced', category: 'technical' },
      { skill: 'Laboratory Techniques', importance: 'critical', proficiencyLevel: 'advanced', category: 'technical' },
      { skill: 'Scientific Writing', importance: 'critical', proficiencyLevel: 'advanced', category: 'soft' }
    ],
    preferredSkills: [
      { skill: 'Statistics', importance: 'important', proficiencyLevel: 'intermediate', category: 'technical' },
      { skill: 'Grant Writing', importance: 'important', proficiencyLevel: 'beginner', category: 'soft' },
      { skill: 'Collaboration', importance: 'important', proficiencyLevel: 'intermediate', category: 'soft' }
    ],
    experienceLevel: 'senior',
    salaryRange: { min: 70000, max: 120000, currency: 'USD', period: 'yearly' },
    growthProspects: 'medium',
    workEnvironment: {
      remote: false,
      hybrid: true,
      onsite: true,
      teamSize: '3-10 people',
      workStyle: ['analytical', 'methodical', 'innovative']
    },
    industryTrends: { demand: 'medium', growth: 6, competitiveness: 'high' },
    relatedCareers: ['Laboratory Technician', 'Clinical Research Coordinator', 'Biostatistician'],
    keywords: ['research', 'science', 'laboratory', 'experiments', 'data analysis', 'publications']
  },

  {
    id: 'environmental-scientist',
    title: 'Environmental Scientist',
    description: 'Study environmental problems and develop solutions to protect human health and the natural environment.',
    category: 'Science',
    subcategory: 'Environmental Science',
    requiredSkills: [
      { skill: 'Environmental Science', importance: 'critical', proficiencyLevel: 'advanced', category: 'domain' },
      { skill: 'Data Collection', importance: 'critical', proficiencyLevel: 'intermediate', category: 'technical' },
      { skill: 'Field Work', importance: 'critical', proficiencyLevel: 'intermediate', category: 'technical' },
      { skill: 'Report Writing', importance: 'critical', proficiencyLevel: 'intermediate', category: 'soft' }
    ],
    preferredSkills: [
      { skill: 'GIS Software', importance: 'important', proficiencyLevel: 'beginner', category: 'technical' },
      { skill: 'Environmental Regulations', importance: 'important', proficiencyLevel: 'intermediate', category: 'domain' },
      { skill: 'Chemistry', importance: 'nice-to-have', proficiencyLevel: 'beginner', category: 'domain' }
    ],
    experienceLevel: 'mid',
    salaryRange: { min: 55000, max: 85000, currency: 'USD', period: 'yearly' },
    growthProspects: 'medium',
    workEnvironment: {
      remote: false,
      hybrid: true,
      onsite: true,
      teamSize: '3-8 people',
      workStyle: ['outdoor', 'analytical', 'mission-driven']
    },
    industryTrends: { demand: 'medium', growth: 8, competitiveness: 'medium' },
    relatedCareers: ['Environmental Consultant', 'Conservation Scientist', 'Hydrologist'],
    keywords: ['environmental science', 'ecology', 'conservation', 'sustainability', 'field research']
  },

  // Hospitality & Tourism
  {
    id: 'hotel-manager',
    title: 'Hotel Manager',
    description: 'Oversee hotel operations including guest services, staff management, budgeting, and ensuring high standards of hospitality.',
    category: 'Hospitality',
    subcategory: 'Hotel Management',
    requiredSkills: [
      { skill: 'Operations Management', importance: 'critical', proficiencyLevel: 'advanced', category: 'domain' },
      { skill: 'Customer Service', importance: 'critical', proficiencyLevel: 'advanced', category: 'soft' },
      { skill: 'Staff Management', importance: 'critical', proficiencyLevel: 'intermediate', category: 'soft' },
      { skill: 'Budgeting', importance: 'critical', proficiencyLevel: 'intermediate', category: 'technical' }
    ],
    preferredSkills: [
      { skill: 'Hotel Management Systems', importance: 'important', proficiencyLevel: 'intermediate', category: 'technical' },
      { skill: 'Marketing', importance: 'important', proficiencyLevel: 'beginner', category: 'domain' },
      { skill: 'Problem Solving', importance: 'important', proficiencyLevel: 'intermediate', category: 'soft' }
    ],
    experienceLevel: 'senior',
    salaryRange: { min: 50000, max: 80000, currency: 'USD', period: 'yearly' },
    growthProspects: 'medium',
    workEnvironment: {
      remote: false,
      hybrid: false,
      onsite: true,
      teamSize: '10-50 people',
      workStyle: ['service-oriented', 'fast-paced', 'people-focused']
    },
    industryTrends: { demand: 'medium', growth: 12, competitiveness: 'medium' },
    relatedCareers: ['Restaurant Manager', 'Event Coordinator', 'Tourism Manager'],
    keywords: ['hospitality', 'hotel management', 'guest services', 'tourism', 'operations']
  },

  {
    id: 'event-coordinator',
    title: 'Event Coordinator',
    description: 'Plan, organize, and execute events including conferences, weddings, corporate meetings, and social gatherings.',
    category: 'Hospitality',
    subcategory: 'Event Planning',
    requiredSkills: [
      { skill: 'Event Planning', importance: 'critical', proficiencyLevel: 'intermediate', category: 'domain' },
      { skill: 'Project Management', importance: 'critical', proficiencyLevel: 'intermediate', category: 'soft' },
      { skill: 'Vendor Management', importance: 'critical', proficiencyLevel: 'intermediate', category: 'domain' },
      { skill: 'Budget Management', importance: 'critical', proficiencyLevel: 'intermediate', category: 'technical' }
    ],
    preferredSkills: [
      { skill: 'Marketing', importance: 'important', proficiencyLevel: 'beginner', category: 'domain' },
      { skill: 'Customer Service', importance: 'important', proficiencyLevel: 'intermediate', category: 'soft' },
      { skill: 'Social Media', importance: 'nice-to-have', proficiencyLevel: 'beginner', category: 'technical' }
    ],
    experienceLevel: 'entry',
    salaryRange: { min: 35000, max: 65000, currency: 'USD', period: 'yearly' },
    growthProspects: 'medium',
    workEnvironment: {
      remote: false,
      hybrid: true,
      onsite: true,
      teamSize: '2-8 people',
      workStyle: ['organized', 'creative', 'detail-oriented']
    },
    industryTrends: { demand: 'medium', growth: 10, competitiveness: 'medium' },
    relatedCareers: ['Wedding Planner', 'Meeting Planner', 'Marketing Coordinator'],
    keywords: ['event planning', 'coordination', 'meetings', 'conferences', 'project management']
  },

  // Manufacturing & Operations
  {
    id: 'operations-manager',
    title: 'Operations Manager',
    description: 'Oversee daily operations, optimize processes, manage resources, and ensure efficient production and service delivery.',
    category: 'Operations',
    subcategory: 'Operations Management',
    requiredSkills: [
      { skill: 'Operations Management', importance: 'critical', proficiencyLevel: 'advanced', category: 'domain' },
      { skill: 'Process Improvement', importance: 'critical', proficiencyLevel: 'intermediate', category: 'domain' },
      { skill: 'Team Leadership', importance: 'critical', proficiencyLevel: 'advanced', category: 'soft' },
      { skill: 'Budget Management', importance: 'critical', proficiencyLevel: 'intermediate', category: 'technical' }
    ],
    preferredSkills: [
      { skill: 'Lean Manufacturing', importance: 'important', proficiencyLevel: 'beginner', category: 'domain' },
      { skill: 'Supply Chain', importance: 'important', proficiencyLevel: 'beginner', category: 'domain' },
      { skill: 'Data Analysis', importance: 'important', proficiencyLevel: 'beginner', category: 'technical' }
    ],
    experienceLevel: 'senior',
    salaryRange: { min: 75000, max: 120000, currency: 'USD', period: 'yearly' },
    growthProspects: 'medium',
    workEnvironment: {
      remote: false,
      hybrid: true,
      onsite: true,
      teamSize: '15-50 people',
      workStyle: ['leadership', 'strategic', 'results-oriented']
    },
    industryTrends: { demand: 'medium', growth: 6, competitiveness: 'medium' },
    relatedCareers: ['Production Manager', 'Supply Chain Manager', 'Quality Manager'],
    keywords: ['operations', 'management', 'process improvement', 'manufacturing', 'logistics']
  },

  {
    id: 'quality-assurance-specialist',
    title: 'Quality Assurance Specialist',
    description: 'Ensure products and services meet quality standards through testing, inspection, and process monitoring.',
    category: 'Operations',
    subcategory: 'Quality Control',
    requiredSkills: [
      { skill: 'Quality Control', importance: 'critical', proficiencyLevel: 'intermediate', category: 'domain' },
      { skill: 'Testing Procedures', importance: 'critical', proficiencyLevel: 'intermediate', category: 'technical' },
      { skill: 'Attention to Detail', importance: 'critical', proficiencyLevel: 'advanced', category: 'soft' },
      { skill: 'Documentation', importance: 'critical', proficiencyLevel: 'intermediate', category: 'soft' }
    ],
    preferredSkills: [
      { skill: 'Statistical Analysis', importance: 'important', proficiencyLevel: 'beginner', category: 'technical' },
      { skill: 'ISO Standards', importance: 'important', proficiencyLevel: 'beginner', category: 'domain' },
      { skill: 'Problem Solving', importance: 'important', proficiencyLevel: 'intermediate', category: 'soft' }
    ],
    experienceLevel: 'entry',
    salaryRange: { min: 45000, max: 75000, currency: 'USD', period: 'yearly' },
    growthProspects: 'medium',
    workEnvironment: {
      remote: false,
      hybrid: true,
      onsite: true,
      teamSize: '3-10 people',
      workStyle: ['methodical', 'detail-oriented', 'systematic']
    },
    industryTrends: { demand: 'medium', growth: 7, competitiveness: 'low' },
    relatedCareers: ['QA Tester', 'Compliance Specialist', 'Audit Specialist'],
    keywords: ['quality assurance', 'testing', 'quality control', 'compliance', 'standards']
  },

  // Real Estate & Construction
  {
    id: 'real-estate-agent',
    title: 'Real Estate Agent',
    description: 'Help clients buy, sell, and rent properties while providing market expertise and negotiation services.',
    category: 'Real Estate',
    subcategory: 'Real Estate Sales',
    requiredSkills: [
      { skill: 'Sales Skills', importance: 'critical', proficiencyLevel: 'intermediate', category: 'domain' },
      { skill: 'Market Knowledge', importance: 'critical', proficiencyLevel: 'intermediate', category: 'domain' },
      { skill: 'Negotiation', importance: 'critical', proficiencyLevel: 'intermediate', category: 'soft' },
      { skill: 'Customer Service', importance: 'critical', proficiencyLevel: 'advanced', category: 'soft' }
    ],
    preferredSkills: [
      { skill: 'Real Estate License', importance: 'critical', proficiencyLevel: 'beginner', category: 'certification' },
      { skill: 'Marketing', importance: 'important', proficiencyLevel: 'beginner', category: 'domain' },
      { skill: 'Technology Tools', importance: 'important', proficiencyLevel: 'beginner', category: 'technical' }
    ],
    experienceLevel: 'entry',
    salaryRange: { min: 30000, max: 100000, currency: 'USD', period: 'yearly' },
    growthProspects: 'medium',
    workEnvironment: {
      remote: false,
      hybrid: true,
      onsite: true,
      teamSize: '1-5 people',
      workStyle: ['entrepreneurial', 'people-focused', 'flexible']
    },
    industryTrends: { demand: 'medium', growth: 5, competitiveness: 'high' },
    relatedCareers: ['Property Manager', 'Real Estate Appraiser', 'Mortgage Broker'],
    keywords: ['real estate', 'property sales', 'housing market', 'negotiation', 'client service']
  },

  {
    id: 'construction-manager',
    title: 'Construction Manager',
    description: 'Oversee construction projects from planning to completion, managing budgets, schedules, and coordinating with various trades.',
    category: 'Construction',
    subcategory: 'Project Management',
    requiredSkills: [
      { skill: 'Construction Knowledge', importance: 'critical', proficiencyLevel: 'advanced', category: 'domain' },
      { skill: 'Project Management', importance: 'critical', proficiencyLevel: 'advanced', category: 'soft' },
      { skill: 'Budget Management', importance: 'critical', proficiencyLevel: 'intermediate', category: 'technical' },
      { skill: 'Safety Management', importance: 'critical', proficiencyLevel: 'intermediate', category: 'domain' }
    ],
    preferredSkills: [
      { skill: 'Building Codes', importance: 'important', proficiencyLevel: 'intermediate', category: 'domain' },
      { skill: 'AutoCAD', importance: 'nice-to-have', proficiencyLevel: 'beginner', category: 'technical' },
      { skill: 'Contract Management', importance: 'important', proficiencyLevel: 'beginner', category: 'domain' }
    ],
    experienceLevel: 'senior',
    salaryRange: { min: 70000, max: 120000, currency: 'USD', period: 'yearly' },
    growthProspects: 'medium',
    workEnvironment: {
      remote: false,
      hybrid: false,
      onsite: true,
      teamSize: '10-30 people',
      workStyle: ['leadership', 'hands-on', 'problem-solving']
    },
    industryTrends: { demand: 'medium', growth: 8, competitiveness: 'medium' },
    relatedCareers: ['Site Supervisor', 'Project Engineer', 'Estimator'],
    keywords: ['construction', 'project management', 'building', 'contracting', 'safety']
  },

  // Transportation & Logistics
  {
    id: 'logistics-coordinator',
    title: 'Logistics Coordinator',
    description: 'Coordinate transportation, warehousing, and distribution activities to ensure efficient movement of goods.',
    category: 'Logistics',
    subcategory: 'Supply Chain',
    requiredSkills: [
      { skill: 'Supply Chain Management', importance: 'critical', proficiencyLevel: 'intermediate', category: 'domain' },
      { skill: 'Inventory Management', importance: 'critical', proficiencyLevel: 'intermediate', category: 'domain' },
      { skill: 'Transportation Planning', importance: 'critical', proficiencyLevel: 'intermediate', category: 'domain' },
      { skill: 'Problem Solving', importance: 'critical', proficiencyLevel: 'intermediate', category: 'soft' }
    ],
    preferredSkills: [
      { skill: 'ERP Systems', importance: 'important', proficiencyLevel: 'beginner', category: 'technical' },
      { skill: 'Data Analysis', importance: 'important', proficiencyLevel: 'beginner', category: 'technical' },
      { skill: 'Vendor Management', importance: 'important', proficiencyLevel: 'beginner', category: 'domain' }
    ],
    experienceLevel: 'entry',
    salaryRange: { min: 40000, max: 70000, currency: 'USD', period: 'yearly' },
    growthProspects: 'medium',
    workEnvironment: {
      remote: false,
      hybrid: true,
      onsite: true,
      teamSize: '3-10 people',
      workStyle: ['organized', 'detail-oriented', 'fast-paced']
    },
    industryTrends: { demand: 'high', growth: 12, competitiveness: 'medium' },
    relatedCareers: ['Supply Chain Analyst', 'Procurement Specialist', 'Warehouse Manager'],
    keywords: ['logistics', 'supply chain', 'transportation', 'inventory', 'distribution']
  },

  // Agriculture & Food
  {
    id: 'food-scientist',
    title: 'Food Scientist',
    description: 'Research and develop food products, improve food safety and nutrition, and solve food-related problems.',
    category: 'Science',
    subcategory: 'Food Science',
    requiredSkills: [
      { skill: 'Food Science', importance: 'critical', proficiencyLevel: 'advanced', category: 'domain' },
      { skill: 'Laboratory Skills', importance: 'critical', proficiencyLevel: 'intermediate', category: 'technical' },
      { skill: 'Food Safety', importance: 'critical', proficiencyLevel: 'intermediate', category: 'domain' },
      { skill: 'Research Methods', importance: 'critical', proficiencyLevel: 'intermediate', category: 'domain' }
    ],
    preferredSkills: [
      { skill: 'Statistics', importance: 'important', proficiencyLevel: 'beginner', category: 'technical' },
      { skill: 'Nutrition', importance: 'important', proficiencyLevel: 'beginner', category: 'domain' },
      { skill: 'Regulatory Knowledge', importance: 'important', proficiencyLevel: 'beginner', category: 'domain' }
    ],
    experienceLevel: 'mid',
    salaryRange: { min: 55000, max: 90000, currency: 'USD', period: 'yearly' },
    growthProspects: 'medium',
    workEnvironment: {
      remote: false,
      hybrid: false,
      onsite: true,
      teamSize: '3-8 people',
      workStyle: ['analytical', 'methodical', 'innovative']
    },
    industryTrends: { demand: 'medium', growth: 6, competitiveness: 'medium' },
    relatedCareers: ['Quality Control Analyst', 'Product Developer', 'Nutritionist'],
    keywords: ['food science', 'product development', 'food safety', 'nutrition', 'research']
  },

  // Mental Health & Social Work
  {
    id: 'mental-health-counselor',
    title: 'Mental Health Counselor',
    description: 'Provide therapeutic services to individuals and groups dealing with mental health issues, addiction, and life challenges.',
    category: 'Healthcare',
    subcategory: 'Mental Health',
    requiredSkills: [
      { skill: 'Counseling Techniques', importance: 'critical', proficiencyLevel: 'advanced', category: 'domain' },
      { skill: 'Active Listening', importance: 'critical', proficiencyLevel: 'advanced', category: 'soft' },
      { skill: 'Empathy', importance: 'critical', proficiencyLevel: 'advanced', category: 'soft' },
      { skill: 'Assessment Skills', importance: 'critical', proficiencyLevel: 'intermediate', category: 'domain' }
    ],
    preferredSkills: [
      { skill: 'Group Therapy', importance: 'important', proficiencyLevel: 'beginner', category: 'domain' },
      { skill: 'Crisis Intervention', importance: 'important', proficiencyLevel: 'intermediate', category: 'domain' },
      { skill: 'Documentation', importance: 'important', proficiencyLevel: 'intermediate', category: 'soft' }
    ],
    experienceLevel: 'mid',
    salaryRange: { min: 45000, max: 75000, currency: 'USD', period: 'yearly' },
    growthProspects: 'high',
    workEnvironment: {
      remote: true,
      hybrid: true,
      onsite: true,
      teamSize: '2-8 people',
      workStyle: ['empathetic', 'patient', 'supportive']
    },
    industryTrends: { demand: 'high', growth: 25, competitiveness: 'medium' },
    relatedCareers: ['Clinical Social Worker', 'Marriage Therapist', 'Substance Abuse Counselor'],
    keywords: ['mental health', 'counseling', 'therapy', 'psychology', 'behavioral health']
  },

  {
    id: 'social-worker',
    title: 'Social Worker',
    description: 'Help individuals, families, and communities overcome challenges and improve their well-being through advocacy and support services.',
    category: 'Social Services',
    subcategory: 'Social Work',
    requiredSkills: [
      { skill: 'Case Management', importance: 'critical', proficiencyLevel: 'intermediate', category: 'domain' },
      { skill: 'Counseling Skills', importance: 'critical', proficiencyLevel: 'intermediate', category: 'domain' },
      { skill: 'Community Resources', importance: 'critical', proficiencyLevel: 'intermediate', category: 'domain' },
      { skill: 'Cultural Competency', importance: 'critical', proficiencyLevel: 'intermediate', category: 'soft' }
    ],
    preferredSkills: [
      { skill: 'Crisis Intervention', importance: 'important', proficiencyLevel: 'beginner', category: 'domain' },
      { skill: 'Documentation', importance: 'important', proficiencyLevel: 'intermediate', category: 'soft' },
      { skill: 'Advocacy', importance: 'important', proficiencyLevel: 'intermediate', category: 'soft' }
    ],
    experienceLevel: 'entry',
    salaryRange: { min: 40000, max: 65000, currency: 'USD', period: 'yearly' },
    growthProspects: 'medium',
    workEnvironment: {
      remote: false,
      hybrid: true,
      onsite: true,
      teamSize: '3-10 people',
      workStyle: ['compassionate', 'advocacy-focused', 'community-oriented']
    },
    industryTrends: { demand: 'medium', growth: 12, competitiveness: 'low' },
    relatedCareers: ['Community Outreach Coordinator', 'Program Manager', 'Family Therapist'],
    keywords: ['social work', 'community services', 'case management', 'advocacy', 'human services']
  },

  // Emerging Technology Fields
  {
    id: 'blockchain-developer',
    title: 'Blockchain Developer',
    description: 'Develop blockchain-based applications, smart contracts, and decentralized systems using various blockchain technologies.',
    category: 'Technology',
    subcategory: 'Blockchain',
    requiredSkills: [
      { skill: 'Blockchain Technology', importance: 'critical', proficiencyLevel: 'intermediate', category: 'technical' },
      { skill: 'Smart Contracts', importance: 'critical', proficiencyLevel: 'intermediate', category: 'technical' },
      { skill: 'Solidity', importance: 'critical', proficiencyLevel: 'intermediate', category: 'technical' },
      { skill: 'Cryptography', importance: 'important', proficiencyLevel: 'beginner', category: 'technical' }
    ],
    preferredSkills: [
      { skill: 'JavaScript', importance: 'important', proficiencyLevel: 'intermediate', category: 'technical' },
      { skill: 'Web3', importance: 'important', proficiencyLevel: 'beginner', category: 'technical' },
      { skill: 'DeFi Protocols', importance: 'nice-to-have', proficiencyLevel: 'beginner', category: 'domain' }
    ],
    experienceLevel: 'mid',
    salaryRange: { min: 80000, max: 150000, currency: 'USD', period: 'yearly' },
    growthProspects: 'high',
    workEnvironment: {
      remote: true,
      hybrid: true,
      onsite: true,
      teamSize: '2-8 people',
      workStyle: ['innovative', 'technical', 'cutting-edge']
    },
    industryTrends: { demand: 'high', growth: 35, competitiveness: 'high' },
    relatedCareers: ['Cryptocurrency Analyst', 'DeFi Developer', 'Smart Contract Auditor'],
    keywords: ['blockchain', 'cryptocurrency', 'smart contracts', 'defi', 'web3', 'ethereum']
  },

  {
    id: 'iot-engineer',
    title: 'IoT Engineer',
    description: 'Design and develop Internet of Things systems, connecting devices and sensors to create smart, interconnected solutions.',
    category: 'Technology',
    subcategory: 'Internet of Things',
    requiredSkills: [
      { skill: 'IoT Architecture', importance: 'critical', proficiencyLevel: 'intermediate', category: 'technical' },
      { skill: 'Embedded Systems', importance: 'critical', proficiencyLevel: 'intermediate', category: 'technical' },
      { skill: 'Sensor Technology', importance: 'critical', proficiencyLevel: 'intermediate', category: 'technical' },
      { skill: 'Network Protocols', importance: 'critical', proficiencyLevel: 'intermediate', category: 'technical' }
    ],
    preferredSkills: [
      { skill: 'Arduino/Raspberry Pi', importance: 'important', proficiencyLevel: 'intermediate', category: 'technical' },
      { skill: 'Cloud Platforms', importance: 'important', proficiencyLevel: 'beginner', category: 'technical' },
      { skill: 'Data Analytics', importance: 'nice-to-have', proficiencyLevel: 'beginner', category: 'technical' }
    ],
    experienceLevel: 'mid',
    salaryRange: { min: 70000, max: 130000, currency: 'USD', period: 'yearly' },
    growthProspects: 'high',
    workEnvironment: {
      remote: true,
      hybrid: true,
      onsite: true,
      teamSize: '3-10 people',
      workStyle: ['technical', 'innovative', 'problem-solving']
    },
    industryTrends: { demand: 'high', growth: 22, competitiveness: 'medium' },
    relatedCareers: ['Embedded Software Engineer', 'Systems Engineer', 'Automation Engineer'],
    keywords: ['internet of things', 'iot', 'embedded systems', 'sensors', 'smart devices', 'connectivity']
  }
]

export const SKILL_TAXONOMY = {
  categories: [
    {
      id: 'programming',
      name: 'Programming Languages',
      skills: ['JavaScript', 'Python', 'Java', 'C++', 'TypeScript', 'Go', 'Rust', 'Swift', 'Kotlin']
    },
    {
      id: 'web-development',
      name: 'Web Development',
      skills: ['HTML', 'CSS', 'React', 'Vue.js', 'Angular', 'Node.js', 'Express', 'Django', 'Flask']
    },
    {
      id: 'data-science',
      name: 'Data Science & Analytics',
      skills: ['SQL', 'R', 'Pandas', 'NumPy', 'Tableau', 'Power BI', 'Statistics', 'Machine Learning']
    },
    {
      id: 'cloud-platforms',
      name: 'Cloud Platforms',
      skills: ['AWS', 'Azure', 'Google Cloud', 'Docker', 'Kubernetes', 'Terraform', 'Jenkins']
    },
    {
      id: 'design',
      name: 'Design & Creative',
      skills: ['Figma', 'Adobe Creative Suite', 'Sketch', 'InVision', 'Canva', 'Photography', 'Video Editing']
    },
    {
      id: 'business',
      name: 'Business & Management',
      skills: ['Project Management', 'Agile', 'Scrum', 'Leadership', 'Strategy', 'Business Analysis']
    },
    {
      id: 'marketing',
      name: 'Marketing & Sales',
      skills: ['Digital Marketing', 'SEO', 'SEM', 'Social Media Marketing', 'Content Marketing', 'Email Marketing']
    }
  ],
  synonyms: [
    { canonical: 'JavaScript', synonyms: ['JS', 'ECMAScript', 'Node.js', 'Frontend Development'] },
    { canonical: 'Python', synonyms: ['Python3', 'Data Science', 'Machine Learning', 'AI'] },
    { canonical: 'React', synonyms: ['ReactJS', 'React.js', 'Frontend Framework'] },
    { canonical: 'SQL', synonyms: ['Database', 'MySQL', 'PostgreSQL', 'Data Querying'] },
    { canonical: 'Machine Learning', synonyms: ['ML', 'AI', 'Artificial Intelligence', 'Data Science'] },
    { canonical: 'User Experience', synonyms: ['UX', 'User Research', 'Usability', 'Design Thinking'] },
    { canonical: 'Digital Marketing', synonyms: ['Online Marketing', 'Internet Marketing', 'Web Marketing'] },
    { canonical: 'Project Management', synonyms: ['PM', 'Program Management', 'Agile', 'Scrum'] }
  ]
}