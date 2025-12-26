import { CareerDomain, ExperienceLevel, SalaryRange } from '../types/careerDomainTypes';

// Comprehensive Career Domains Data Store with 15+ Major Categories
export const CAREER_DOMAINS: CareerDomain[] = [
  // 1. Technology & Computer Science
  {
    id: 'technology-computer-science',
    name: 'Technology & Computer Science',
    description: 'Design, develop, and maintain software systems, applications, and digital solutions that power the modern world.',
    icon: '💻',
    color: '#3B82F6',
    subfields: [
      {
        id: 'software-development',
        name: 'Software Development',
        description: 'Create applications, websites, and software systems using various programming languages and frameworks.',
        requiredSkills: ['Programming', 'Problem Solving', 'Version Control', 'Testing'],
        averageSalary: { min: 60000, max: 150000, currency: 'USD', period: 'yearly' },
        jobRoles: ['Software Developer', 'Frontend Developer', 'Backend Developer', 'Full Stack Developer'],
        keywords: ['coding', 'programming', 'web development', 'mobile development', 'software engineering']
      },
      {
        id: 'data-science-analytics',
        name: 'Data Science & Analytics',
        description: 'Extract insights from data using statistical methods, machine learning, and data visualization.',
        requiredSkills: ['Statistics', 'Python/R', 'SQL', 'Machine Learning', 'Data Visualization'],
        averageSalary: { min: 70000, max: 160000, currency: 'USD', period: 'yearly' },
        jobRoles: ['Data Scientist', 'Data Analyst', 'Machine Learning Engineer', 'Business Intelligence Analyst'],
        keywords: ['data science', 'analytics', 'machine learning', 'statistics', 'big data']
      },
      {
        id: 'cybersecurity',
        name: 'Cybersecurity',
        description: 'Protect digital systems, networks, and data from cyber threats and security breaches.',
        requiredSkills: ['Network Security', 'Risk Assessment', 'Incident Response', 'Security Tools'],
        averageSalary: { min: 65000, max: 140000, currency: 'USD', period: 'yearly' },
        jobRoles: ['Security Analyst', 'Penetration Tester', 'Security Engineer', 'CISO'],
        keywords: ['cybersecurity', 'information security', 'network security', 'ethical hacking']
      }
    ],
    careerExamples: [
      {
        id: 'software-developer-entry',
        title: 'Junior Software Developer',
        description: 'Develop and maintain software applications under senior guidance.',
        subfieldId: 'software-development',
        experienceLevel: 'entry',
        salaryRange: { min: 60000, max: 85000, currency: 'USD', period: 'yearly' },
        requiredSkills: ['JavaScript', 'HTML/CSS', 'Git', 'Problem Solving'],
        preferredSkills: ['React', 'Node.js', 'SQL'],
        workEnvironment: {
          remote: true,
          hybrid: true,
          onsite: true,
          teamSize: '3-8 people',
          workStyle: ['collaborative', 'analytical', 'creative'],
          travelRequirement: 'none'
        },
        careerPath: ['Junior Developer', 'Software Developer', 'Senior Developer', 'Tech Lead'],
        keywords: ['junior developer', 'entry level', 'programming', 'web development']
      }
    ],
    internshipOpportunities: [
      {
        id: 'software-dev-intern',
        title: 'Software Development Intern',
        description: 'Gain hands-on experience in software development while working on real projects.',
        subfieldId: 'software-development',
        duration: '3-6 months',
        stipend: { min: 20, max: 35, currency: 'USD', period: 'hourly' },
        requiredSkills: ['Basic Programming', 'Problem Solving', 'Communication'],
        learningOutcomes: ['Full-stack development', 'Version control', 'Agile methodologies', 'Code review'],
        typicalCompanies: ['Google', 'Microsoft', 'Amazon', 'Meta', 'Startups'],
        applicationPeriod: 'Fall/Spring semesters',
        keywords: ['internship', 'software development', 'programming', 'tech']
      }
    ],
    experienceLevels: [
      {
        level: 'entry',
        title: 'Junior Technology Professional',
        description: 'Starting career in technology with foundational skills and supervised work.',
        yearsOfExperience: '0-2 years',
        typicalRoles: ['Junior Developer', 'Associate Data Analyst', 'IT Support Specialist'],
        salaryRange: { min: 50000, max: 80000, currency: 'USD', period: 'yearly' },
        keyResponsibilities: ['Code development', 'Bug fixing', 'Testing', 'Documentation'],
        requiredSkills: ['Programming languages', 'Version control', 'Basic algorithms', 'Debugging'],
        careerProgression: ['Junior', 'Mid-level', 'Senior', 'Lead']
      }
    ],
    keywords: ['technology', 'programming', 'software', 'development', 'coding', 'IT', 'computer science'],
    industryTrends: {
      demand: 'high',
      growth: 22,
      competitiveness: 'high',
      emergingRoles: ['AI Engineer', 'Cloud Architect', 'DevOps Engineer', 'Cybersecurity Specialist']
    },
    relatedDomains: ['engineering-manufacturing', 'science-research', 'design-creative']
  },

  // 2. Engineering & Manufacturing
  {
    id: 'engineering-manufacturing',
    name: 'Engineering & Manufacturing',
    description: 'Design, build, and optimize physical systems, products, and manufacturing processes.',
    icon: '⚙️',
    color: '#F59E0B',
    subfields: [
      {
        id: 'mechanical-engineering',
        name: 'Mechanical Engineering',
        description: 'Design and develop mechanical systems, machines, and manufacturing processes.',
        requiredSkills: ['CAD Design', 'Thermodynamics', 'Materials Science', 'Project Management'],
        averageSalary: { min: 65000, max: 120000, currency: 'USD', period: 'yearly' },
        jobRoles: ['Mechanical Engineer', 'Design Engineer', 'Manufacturing Engineer', 'Product Engineer'],
        keywords: ['mechanical engineering', 'CAD', 'manufacturing', 'design', 'machinery']
      }
    ],
    careerExamples: [],
    internshipOpportunities: [],
    experienceLevels: [],
    keywords: ['engineering', 'manufacturing', 'design', 'mechanical', 'electrical', 'civil', 'industrial'],
    industryTrends: {
      demand: 'medium',
      growth: 8,
      competitiveness: 'medium',
      emergingRoles: ['Robotics Engineer', 'Sustainability Engineer', 'Automation Engineer']
    },
    relatedDomains: ['technology-computer-science', 'science-research']
  },

  // 3. Science & Research
  {
    id: 'science-research',
    name: 'Science & Research',
    description: 'Conduct scientific research, analyze data, and advance knowledge in various scientific fields.',
    icon: '🔬',
    color: '#10B981',
    subfields: [
      {
        id: 'biological-sciences',
        name: 'Biological Sciences',
        description: 'Study living organisms, their behavior, and biological processes.',
        requiredSkills: ['Research Methods', 'Laboratory Techniques', 'Data Analysis', 'Scientific Writing'],
        averageSalary: { min: 50000, max: 100000, currency: 'USD', period: 'yearly' },
        jobRoles: ['Research Scientist', 'Biologist', 'Laboratory Technician', 'Research Associate'],
        keywords: ['biology', 'research', 'laboratory', 'life sciences', 'biotechnology']
      }
    ],
    careerExamples: [],
    internshipOpportunities: [],
    experienceLevels: [],
    keywords: ['science', 'research', 'laboratory', 'biology', 'chemistry', 'physics', 'scientific method'],
    industryTrends: {
      demand: 'medium',
      growth: 6,
      competitiveness: 'high',
      emergingRoles: ['Bioinformatics Specialist', 'Data Scientist', 'Computational Biologist']
    },
    relatedDomains: ['healthcare-medicine', 'technology-computer-science']
  },

  // 4. Design & Creative Industries
  {
    id: 'design-creative',
    name: 'Design & Creative Industries',
    description: 'Create visual content, user experiences, and artistic solutions for digital and physical media.',
    icon: '🎨',
    color: '#8B5CF6',
    subfields: [
      {
        id: 'user-experience-design',
        name: 'User Experience Design',
        description: 'Design intuitive and user-centered digital experiences and interfaces.',
        requiredSkills: ['User Research', 'Wireframing', 'Prototyping', 'Design Thinking'],
        averageSalary: { min: 60000, max: 120000, currency: 'USD', period: 'yearly' },
        jobRoles: ['UX Designer', 'UI Designer', 'Product Designer', 'Interaction Designer'],
        keywords: ['UX design', 'UI design', 'user experience', 'prototyping', 'user research']
      }
    ],
    careerExamples: [],
    internshipOpportunities: [],
    experienceLevels: [],
    keywords: ['design', 'creative', 'UX', 'UI', 'graphic design', 'visual', 'multimedia', 'branding'],
    industryTrends: {
      demand: 'high',
      growth: 13,
      competitiveness: 'medium',
      emergingRoles: ['Voice UI Designer', 'AR/VR Designer', 'Service Designer']
    },
    relatedDomains: ['technology-computer-science', 'media-communication']
  },

  // 5. Business & Management
  {
    id: 'business-management',
    name: 'Business & Management',
    description: 'Lead organizations, manage teams, and drive business strategy and operations.',
    icon: '💼',
    color: '#EF4444',
    subfields: [
      {
        id: 'business-analysis',
        name: 'Business Analysis',
        description: 'Analyze business processes and requirements to improve organizational efficiency.',
        requiredSkills: ['Business Analysis', 'Requirements Gathering', 'Process Mapping', 'Stakeholder Management'],
        averageSalary: { min: 60000, max: 110000, currency: 'USD', period: 'yearly' },
        jobRoles: ['Business Analyst', 'Systems Analyst', 'Process Improvement Specialist', 'Product Owner'],
        keywords: ['business analysis', 'requirements', 'process improvement', 'stakeholder management']
      }
    ],
    careerExamples: [],
    internshipOpportunities: [],
    experienceLevels: [],
    keywords: ['business', 'management', 'analysis', 'strategy', 'operations', 'leadership', 'marketing'],
    industryTrends: {
      demand: 'high',
      growth: 10,
      competitiveness: 'medium',
      emergingRoles: ['Digital Transformation Manager', 'Customer Success Manager', 'Growth Hacker']
    },
    relatedDomains: ['technology-computer-science', 'finance-economics']
  },

  // 6. Healthcare & Medicine
  {
    id: 'healthcare-medicine',
    name: 'Healthcare & Medicine',
    description: 'Provide medical care, support patient health, and advance medical knowledge.',
    icon: '🏥',
    color: '#DC2626',
    subfields: [
      {
        id: 'nursing',
        name: 'Nursing',
        description: 'Provide direct patient care and support medical treatments.',
        requiredSkills: ['Patient Care', 'Medical Knowledge', 'Clinical Assessment', 'Communication'],
        averageSalary: { min: 60000, max: 100000, currency: 'USD', period: 'yearly' },
        jobRoles: ['Registered Nurse', 'Nurse Practitioner', 'Clinical Nurse', 'Nurse Manager'],
        keywords: ['nursing', 'patient care', 'clinical', 'healthcare', 'medical']
      }
    ],
    careerExamples: [],
    internshipOpportunities: [],
    experienceLevels: [],
    keywords: ['healthcare', 'medicine', 'nursing', 'patient care', 'clinical', 'medical', 'health informatics'],
    industryTrends: {
      demand: 'high',
      growth: 16,
      competitiveness: 'medium',
      emergingRoles: ['Telehealth Coordinator', 'Health Data Analyst', 'Digital Health Specialist']
    },
    relatedDomains: ['science-research', 'technology-computer-science']
  },

  // 7. Education & Training
  {
    id: 'education-training',
    name: 'Education & Training',
    description: 'Educate, train, and develop individuals across various learning environments.',
    icon: '📚',
    color: '#059669',
    subfields: [
      {
        id: 'k12-education',
        name: 'K-12 Education',
        description: 'Teach and support students in elementary, middle, and high school settings.',
        requiredSkills: ['Curriculum Development', 'Classroom Management', 'Student Assessment', 'Educational Technology'],
        averageSalary: { min: 40000, max: 70000, currency: 'USD', period: 'yearly' },
        jobRoles: ['Elementary Teacher', 'High School Teacher', 'Special Education Teacher', 'School Counselor'],
        keywords: ['teaching', 'K-12', 'education', 'curriculum', 'classroom management']
      }
    ],
    careerExamples: [],
    internshipOpportunities: [],
    experienceLevels: [],
    keywords: ['education', 'teaching', 'training', 'learning', 'curriculum', 'instruction', 'academic'],
    industryTrends: {
      demand: 'medium',
      growth: 5,
      competitiveness: 'low',
      emergingRoles: ['Online Learning Specialist', 'Educational Technology Coordinator', 'Learning Experience Designer']
    },
    relatedDomains: ['technology-computer-science', 'social-sciences']
  },

  // 8. Finance & Economics
  {
    id: 'finance-economics',
    name: 'Finance & Economics',
    description: 'Manage financial resources, analyze economic trends, and provide financial services.',
    icon: '💰',
    color: '#F59E0B',
    subfields: [
      {
        id: 'financial-analysis',
        name: 'Financial Analysis',
        description: 'Analyze financial data and provide investment recommendations.',
        requiredSkills: ['Financial Modeling', 'Excel', 'Financial Analysis', 'Accounting Principles'],
        averageSalary: { min: 60000, max: 120000, currency: 'USD', period: 'yearly' },
        jobRoles: ['Financial Analyst', 'Investment Analyst', 'Budget Analyst', 'Credit Analyst'],
        keywords: ['financial analysis', 'investment', 'budgeting', 'financial modeling']
      }
    ],
    careerExamples: [],
    internshipOpportunities: [],
    experienceLevels: [],
    keywords: ['finance', 'economics', 'investment', 'banking', 'financial analysis', 'money management'],
    industryTrends: {
      demand: 'medium',
      growth: 7,
      competitiveness: 'high',
      emergingRoles: ['Fintech Analyst', 'Cryptocurrency Specialist', 'ESG Investment Analyst']
    },
    relatedDomains: ['business-management', 'technology-computer-science']
  },

  // 9. Law & Public Policy
  {
    id: 'law-public-policy',
    name: 'Law & Public Policy',
    description: 'Practice law, develop policy, and work within legal and governmental systems.',
    icon: '⚖️',
    color: '#6B7280',
    subfields: [
      {
        id: 'legal-practice',
        name: 'Legal Practice',
        description: 'Provide legal services and representation to clients.',
        requiredSkills: ['Legal Research', 'Legal Writing', 'Client Communication', 'Case Analysis'],
        averageSalary: { min: 60000, max: 180000, currency: 'USD', period: 'yearly' },
        jobRoles: ['Attorney', 'Paralegal', 'Legal Assistant', 'Corporate Counsel'],
        keywords: ['law', 'attorney', 'legal research', 'litigation', 'legal services']
      }
    ],
    careerExamples: [],
    internshipOpportunities: [],
    experienceLevels: [],
    keywords: ['law', 'legal', 'policy', 'government', 'attorney', 'paralegal', 'public service'],
    industryTrends: {
      demand: 'medium',
      growth: 4,
      competitiveness: 'high',
      emergingRoles: ['Legal Technology Specialist', 'Compliance Officer', 'Privacy Attorney']
    },
    relatedDomains: ['business-management', 'social-sciences']
  },

  // 10. Arts, Culture & Humanities
  {
    id: 'arts-culture-humanities',
    name: 'Arts, Culture & Humanities',
    description: 'Create, preserve, and share artistic and cultural works that enrich society.',
    icon: '🎭',
    color: '#EC4899',
    subfields: [
      {
        id: 'performing-arts',
        name: 'Performing Arts',
        description: 'Create and perform in theater, music, dance, and other live entertainment.',
        requiredSkills: ['Performance Skills', 'Artistic Expression', 'Collaboration', 'Stage Presence'],
        averageSalary: { min: 25000, max: 80000, currency: 'USD', period: 'yearly' },
        jobRoles: ['Actor', 'Musician', 'Dancer', 'Theater Director', 'Music Teacher'],
        keywords: ['performing arts', 'theater', 'music', 'dance', 'performance']
      }
    ],
    careerExamples: [],
    internshipOpportunities: [],
    experienceLevels: [],
    keywords: ['arts', 'culture', 'humanities', 'creative', 'museum', 'theater', 'music', 'cultural preservation'],
    industryTrends: {
      demand: 'low',
      growth: 2,
      competitiveness: 'high',
      emergingRoles: ['Digital Curator', 'Virtual Experience Designer', 'Cultural Data Analyst']
    },
    relatedDomains: ['design-creative', 'education-training', 'media-communication']
  },

  // 11. Social Sciences & Community Services
  {
    id: 'social-sciences-community',
    name: 'Social Sciences & Community Services',
    description: 'Study human behavior and society while providing support services to communities.',
    icon: '🤝',
    color: '#7C3AED',
    subfields: [
      {
        id: 'social-work',
        name: 'Social Work',
        description: 'Provide support and advocacy for individuals and families in need.',
        requiredSkills: ['Counseling', 'Case Management', 'Crisis Intervention', 'Community Resources'],
        averageSalary: { min: 40000, max: 70000, currency: 'USD', period: 'yearly' },
        jobRoles: ['Social Worker', 'Case Manager', 'Community Outreach Coordinator', 'Family Therapist'],
        keywords: ['social work', 'counseling', 'community services', 'case management']
      }
    ],
    careerExamples: [],
    internshipOpportunities: [],
    experienceLevels: [],
    keywords: ['social sciences', 'psychology', 'social work', 'community services', 'human behavior'],
    industryTrends: {
      demand: 'medium',
      growth: 12,
      competitiveness: 'medium',
      emergingRoles: ['Digital Mental Health Specialist', 'Community Data Analyst', 'Social Impact Coordinator']
    },
    relatedDomains: ['healthcare-medicine', 'education-training']
  },

  // 12. Media & Communication
  {
    id: 'media-communication',
    name: 'Media & Communication',
    description: 'Create, distribute, and manage content across various media platforms and channels.',
    icon: '📺',
    color: '#F97316',
    subfields: [
      {
        id: 'journalism',
        name: 'Journalism',
        description: 'Research, write, and report news and information to the public.',
        requiredSkills: ['Writing', 'Research', 'Interviewing', 'Media Ethics', 'Digital Publishing'],
        averageSalary: { min: 35000, max: 75000, currency: 'USD', period: 'yearly' },
        jobRoles: ['Journalist', 'Reporter', 'Editor', 'News Producer', 'Content Writer'],
        keywords: ['journalism', 'reporting', 'news', 'writing', 'media']
      }
    ],
    careerExamples: [],
    internshipOpportunities: [],
    experienceLevels: [],
    keywords: ['media', 'communication', 'journalism', 'digital media', 'content creation', 'broadcasting'],
    industryTrends: {
      demand: 'medium',
      growth: 6,
      competitiveness: 'high',
      emergingRoles: ['Podcast Producer', 'Influencer Marketing Manager', 'Digital Storyteller']
    },
    relatedDomains: ['design-creative', 'business-management']
  },

  // 13. Environment, Agriculture & Sustainability
  {
    id: 'environment-sustainability',
    name: 'Environment, Agriculture & Sustainability',
    description: 'Protect the environment, develop sustainable practices, and advance agricultural innovation.',
    icon: '🌱',
    color: '#16A34A',
    subfields: [
      {
        id: 'environmental-science',
        name: 'Environmental Science',
        description: 'Study environmental problems and develop solutions for sustainability.',
        requiredSkills: ['Environmental Science', 'Data Analysis', 'Field Research', 'Environmental Regulations'],
        averageSalary: { min: 50000, max: 90000, currency: 'USD', period: 'yearly' },
        jobRoles: ['Environmental Scientist', 'Environmental Consultant', 'Conservation Specialist', 'Sustainability Coordinator'],
        keywords: ['environmental science', 'sustainability', 'conservation', 'climate change']
      }
    ],
    careerExamples: [],
    internshipOpportunities: [],
    experienceLevels: [],
    keywords: ['environment', 'sustainability', 'agriculture', 'conservation', 'climate', 'renewable energy'],
    industryTrends: {
      demand: 'high',
      growth: 18,
      competitiveness: 'medium',
      emergingRoles: ['Climate Data Analyst', 'Renewable Energy Specialist', 'Sustainable Supply Chain Manager']
    },
    relatedDomains: ['science-research', 'engineering-manufacturing']
  },

  // 14. Defense, Security & Law Enforcement
  {
    id: 'defense-security-law-enforcement',
    name: 'Defense, Security & Law Enforcement',
    description: 'Protect communities and national security through military, police, and security services.',
    icon: '🛡️',
    color: '#1F2937',
    subfields: [
      {
        id: 'law-enforcement',
        name: 'Law Enforcement',
        description: 'Maintain public safety and enforce laws at local, state, and federal levels.',
        requiredSkills: ['Law Enforcement Training', 'Crisis Management', 'Investigation', 'Community Relations'],
        averageSalary: { min: 45000, max: 85000, currency: 'USD', period: 'yearly' },
        jobRoles: ['Police Officer', 'Detective', 'Federal Agent', 'Security Guard'],
        keywords: ['law enforcement', 'police', 'security', 'investigation', 'public safety']
      }
    ],
    careerExamples: [],
    internshipOpportunities: [],
    experienceLevels: [],
    keywords: ['defense', 'security', 'law enforcement', 'military', 'public safety', 'national security'],
    industryTrends: {
      demand: 'medium',
      growth: 3,
      competitiveness: 'medium',
      emergingRoles: ['Cybersecurity Specialist', 'Intelligence Analyst', 'Drone Operator']
    },
    relatedDomains: ['technology-computer-science', 'law-public-policy']
  },

  // 15. Hospitality, Tourism & Aviation
  {
    id: 'hospitality-tourism-aviation',
    name: 'Hospitality, Tourism & Aviation',
    description: 'Provide services in travel, hospitality, and aviation industries.',
    icon: '✈️',
    color: '#0EA5E9',
    subfields: [
      {
        id: 'hospitality-management',
        name: 'Hospitality Management',
        description: 'Manage hotels, restaurants, and other hospitality businesses.',
        requiredSkills: ['Customer Service', 'Operations Management', 'Revenue Management', 'Staff Leadership'],
        averageSalary: { min: 40000, max: 80000, currency: 'USD', period: 'yearly' },
        jobRoles: ['Hotel Manager', 'Restaurant Manager', 'Event Coordinator', 'Guest Services Manager'],
        keywords: ['hospitality', 'hotel management', 'customer service', 'tourism']
      }
    ],
    careerExamples: [],
    internshipOpportunities: [],
    experienceLevels: [],
    keywords: ['hospitality', 'tourism', 'aviation', 'travel', 'customer service', 'hotel management'],
    industryTrends: {
      demand: 'medium',
      growth: 8,
      competitiveness: 'medium',
      emergingRoles: ['Sustainable Tourism Specialist', 'Digital Experience Manager', 'Aviation Data Analyst']
    },
    relatedDomains: ['business-management', 'technology-computer-science']
  },

  // 16. Emerging Interdisciplinary Fields
  {
    id: 'emerging-interdisciplinary',
    name: 'Emerging Interdisciplinary Fields',
    description: 'Work in cutting-edge fields that combine multiple disciplines and emerging technologies.',
    icon: '🚀',
    color: '#A855F7',
    subfields: [
      {
        id: 'ai-ethics',
        name: 'AI Ethics & Policy',
        description: 'Develop ethical frameworks and policies for artificial intelligence applications.',
        requiredSkills: ['AI Knowledge', 'Ethics', 'Policy Development', 'Stakeholder Engagement'],
        averageSalary: { min: 80000, max: 150000, currency: 'USD', period: 'yearly' },
        jobRoles: ['AI Ethics Specialist', 'AI Policy Researcher', 'Algorithmic Auditor', 'AI Governance Manager'],
        keywords: ['AI ethics', 'artificial intelligence policy', 'algorithmic fairness', 'responsible AI']
      }
    ],
    careerExamples: [],
    internshipOpportunities: [],
    experienceLevels: [],
    keywords: ['emerging fields', 'interdisciplinary', 'AI ethics', 'climate tech', 'space technology', 'innovation'],
    industryTrends: {
      demand: 'high',
      growth: 35,
      competitiveness: 'high',
      emergingRoles: ['Quantum Computing Specialist', 'Biotech Data Scientist', 'Virtual Reality Designer']
    },
    relatedDomains: ['technology-computer-science', 'science-research', 'engineering-manufacturing']
  }
];

// Export utility functions
export const getDomainById = (id: string): CareerDomain | undefined => {
  return CAREER_DOMAINS.find(domain => domain.id === id);
};

export const getSubfieldById = (domainId: string, subfieldId: string) => {
  const domain = getDomainById(domainId);
  return domain?.subfields.find(subfield => subfield.id === subfieldId);
};

export const getAllDomainNames = (): string[] => {
  return CAREER_DOMAINS.map(domain => domain.name);
};

export const getAllJobRoles = (): string[] => {
  const roles: string[] = [];
  CAREER_DOMAINS.forEach(domain => {
    domain.subfields.forEach(subfield => {
      roles.push(...subfield.jobRoles);
    });
  });
  return [...new Set(roles)]; // Remove duplicates
};