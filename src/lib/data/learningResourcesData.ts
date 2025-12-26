import { LearningResource, StudyGuide, PreparationMaterial, LearningResourceCategory } from '../types/learningResourceTypes';

// Comprehensive Learning Resources Database
export const LEARNING_RESOURCES: LearningResource[] = [
  // Technology & Computer Science Resources
  {
    id: 'js-fundamentals-course',
    title: 'JavaScript Fundamentals',
    description: 'Complete introduction to JavaScript programming language covering syntax, functions, objects, and DOM manipulation.',
    type: 'course',
    provider: 'freeCodeCamp',
    url: 'https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures/',
    duration: '300 hours',
    cost: 0,
    rating: 4.8,
    difficulty: 'beginner',
    skills: ['JavaScript', 'Programming', 'Web Development', 'Problem Solving'],
    domain: 'technology-computer-science',
    subfield: 'software-development',
    prerequisites: ['Basic Computer Skills'],
    learningOutcomes: ['Write JavaScript programs', 'Understand programming concepts', 'Build interactive web pages'],
    tags: ['programming', 'web development', 'frontend', 'free'],
    completed: false,
    progress: 0,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: 'react-complete-guide',
    title: 'React - The Complete Guide',
    description: 'Comprehensive React course covering hooks, context, routing, and modern React patterns.',
    type: 'course',
    provider: 'Udemy',
    url: 'https://www.udemy.com/course/react-the-complete-guide-incl-redux/',
    duration: '48 hours',
    cost: 89.99,
    rating: 4.6,
    difficulty: 'intermediate',
    skills: ['React', 'JavaScript', 'Frontend Development', 'Component Architecture'],
    domain: 'technology-computer-science',
    subfield: 'software-development',
    prerequisites: ['JavaScript Fundamentals', 'HTML/CSS'],
    learningOutcomes: ['Build React applications', 'Manage state effectively', 'Implement routing'],
    tags: ['react', 'frontend', 'javascript', 'web development'],
    completed: false,
    progress: 0,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: 'python-data-science',
    title: 'Python for Data Science and Machine Learning',
    description: 'Learn Python programming for data analysis, visualization, and machine learning applications.',
    type: 'course',
    provider: 'Coursera',
    url: 'https://www.coursera.org/specializations/python-data-science',
    duration: '120 hours',
    cost: 49.00,
    rating: 4.7,
    difficulty: 'intermediate',
    skills: ['Python', 'Data Analysis', 'Machine Learning', 'Statistics', 'Pandas', 'NumPy'],
    domain: 'technology-computer-science',
    subfield: 'data-science-analytics',
    prerequisites: ['Basic Programming', 'Mathematics'],
    learningOutcomes: ['Analyze data with Python', 'Build ML models', 'Create visualizations'],
    tags: ['python', 'data science', 'machine learning', 'analytics'],
    completed: false,
    progress: 0,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: 'cybersecurity-fundamentals',
    title: 'Cybersecurity Fundamentals',
    description: 'Introduction to cybersecurity principles, threat analysis, and security best practices.',
    type: 'course',
    provider: 'edX',
    url: 'https://www.edx.org/course/cybersecurity-fundamentals',
    duration: '60 hours',
    cost: 0,
    rating: 4.5,
    difficulty: 'beginner',
    skills: ['Network Security', 'Risk Assessment', 'Security Protocols', 'Incident Response'],
    domain: 'technology-computer-science',
    subfield: 'cybersecurity',
    prerequisites: ['Basic Computer Knowledge'],
    learningOutcomes: ['Understand security threats', 'Implement security measures', 'Assess risks'],
    tags: ['cybersecurity', 'security', 'networking', 'free'],
    completed: false,
    progress: 0,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },

  // Engineering & Manufacturing Resources
  {
    id: 'autocad-mechanical-design',
    title: 'AutoCAD for Mechanical Design',
    description: 'Master AutoCAD for creating precise mechanical drawings and 3D models.',
    type: 'course',
    provider: 'LinkedIn Learning',
    url: 'https://www.linkedin.com/learning/autocad-mechanical-design',
    duration: '25 hours',
    cost: 29.99,
    rating: 4.4,
    difficulty: 'intermediate',
    skills: ['AutoCAD', 'CAD Design', 'Technical Drawing', 'Mechanical Design'],
    domain: 'engineering-manufacturing',
    subfield: 'mechanical-engineering',
    prerequisites: ['Basic Engineering Concepts'],
    learningOutcomes: ['Create technical drawings', 'Design mechanical parts', 'Use CAD software'],
    tags: ['autocad', 'mechanical', 'design', 'engineering'],
    completed: false,
    progress: 0,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },

  // Healthcare & Medicine Resources
  {
    id: 'medical-terminology',
    title: 'Medical Terminology Fundamentals',
    description: 'Learn essential medical terminology used in healthcare settings.',
    type: 'course',
    provider: 'Khan Academy',
    url: 'https://www.khanacademy.org/science/health-and-medicine',
    duration: '40 hours',
    cost: 0,
    rating: 4.6,
    difficulty: 'beginner',
    skills: ['Medical Terminology', 'Healthcare Communication', 'Anatomy Basics'],
    domain: 'healthcare-medicine',
    subfield: 'nursing',
    prerequisites: ['High School Biology'],
    learningOutcomes: ['Understand medical terms', 'Communicate in healthcare', 'Read medical documents'],
    tags: ['medical', 'terminology', 'healthcare', 'free'],
    completed: false,
    progress: 0,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },

  // Business & Management Resources
  {
    id: 'business-analysis-fundamentals',
    title: 'Business Analysis Fundamentals',
    description: 'Learn core business analysis techniques and methodologies.',
    type: 'course',
    provider: 'Coursera',
    url: 'https://www.coursera.org/learn/business-analysis',
    duration: '35 hours',
    cost: 39.00,
    rating: 4.5,
    difficulty: 'beginner',
    skills: ['Business Analysis', 'Requirements Gathering', 'Process Mapping', 'Stakeholder Management'],
    domain: 'business-management',
    subfield: 'business-analysis',
    prerequisites: ['Basic Business Knowledge'],
    learningOutcomes: ['Analyze business processes', 'Gather requirements', 'Create process maps'],
    tags: ['business analysis', 'requirements', 'process improvement'],
    completed: false,
    progress: 0,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },

  // Design & Creative Resources
  {
    id: 'ux-design-fundamentals',
    title: 'UX Design Fundamentals',
    description: 'Introduction to user experience design principles and methodologies.',
    type: 'course',
    provider: 'Google',
    url: 'https://www.coursera.org/professional-certificates/google-ux-design',
    duration: '180 hours',
    cost: 49.00,
    rating: 4.8,
    difficulty: 'beginner',
    skills: ['UX Design', 'User Research', 'Wireframing', 'Prototyping', 'Design Thinking'],
    domain: 'design-creative',
    subfield: 'user-experience-design',
    prerequisites: ['Basic Computer Skills'],
    learningOutcomes: ['Design user experiences', 'Conduct user research', 'Create prototypes'],
    tags: ['ux design', 'user research', 'prototyping', 'google'],
    completed: false,
    progress: 0,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },

  // Practice Projects
  {
    id: 'portfolio-website-project',
    title: 'Build a Professional Portfolio Website',
    description: 'Create a responsive portfolio website to showcase your skills and projects.',
    type: 'project',
    provider: 'Self-guided',
    duration: '20 hours',
    cost: 0,
    rating: 4.7,
    difficulty: 'intermediate',
    skills: ['HTML', 'CSS', 'JavaScript', 'Responsive Design', 'Portfolio Development'],
    domain: 'technology-computer-science',
    subfield: 'software-development',
    prerequisites: ['HTML/CSS Basics', 'JavaScript Fundamentals'],
    learningOutcomes: ['Build responsive websites', 'Showcase projects', 'Deploy to web'],
    tags: ['portfolio', 'web development', 'project', 'free'],
    completed: false,
    progress: 0,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  }
];

// Study Guides for Different Domains
export const STUDY_GUIDES: StudyGuide[] = [
  {
    id: 'software-developer-guide',
    title: 'Software Developer Career Preparation Guide',
    description: 'Comprehensive guide to becoming a professional software developer.',
    domain: 'technology-computer-science',
    subfield: 'software-development',
    targetRole: 'Software Developer',
    difficulty: 'intermediate',
    estimatedDuration: '6-12 months',
    sections: [
      {
        id: 'programming-fundamentals',
        title: 'Programming Fundamentals',
        description: 'Master core programming concepts and languages.',
        order: 1,
        estimatedDuration: '2-3 months',
        topics: ['Variables and Data Types', 'Control Structures', 'Functions', 'Object-Oriented Programming'],
        resources: ['js-fundamentals-course'],
        completed: false
      },
      {
        id: 'web-development',
        title: 'Web Development Skills',
        description: 'Learn frontend and backend web development.',
        order: 2,
        estimatedDuration: '3-4 months',
        topics: ['HTML/CSS', 'JavaScript', 'React/Vue', 'Node.js', 'Databases'],
        resources: ['react-complete-guide'],
        completed: false
      },
      {
        id: 'practical-projects',
        title: 'Build Real Projects',
        description: 'Apply skills through hands-on projects.',
        order: 3,
        estimatedDuration: '2-3 months',
        topics: ['Portfolio Website', 'Full-Stack Application', 'API Development'],
        resources: ['portfolio-website-project'],
        completed: false
      }
    ],
    resources: LEARNING_RESOURCES.filter(r => 
      ['js-fundamentals-course', 'react-complete-guide', 'portfolio-website-project'].includes(r.id)
    ),
    prerequisites: ['Basic Computer Skills', 'Problem-Solving Mindset'],
    learningObjectives: [
      'Master at least one programming language',
      'Build full-stack web applications',
      'Understand software development lifecycle',
      'Create a professional portfolio'
    ],
    assessmentCriteria: [
      'Complete coding challenges',
      'Build and deploy projects',
      'Pass technical interviews',
      'Demonstrate problem-solving skills'
    ],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  }
];

// Preparation Materials
export const PREPARATION_MATERIALS: PreparationMaterial[] = [
  {
    id: 'tech-interview-prep',
    title: 'Technical Interview Preparation Checklist',
    description: 'Complete checklist for preparing for technical interviews in software development.',
    type: 'checklist',
    domain: 'technology-computer-science',
    subfield: 'software-development',
    targetRole: 'Software Developer',
    content: {
      sections: [
        {
          id: 'coding-skills',
          title: 'Coding Skills Preparation',
          description: 'Essential coding skills and practice areas.',
          order: 1,
          items: [
            {
              id: 'data-structures',
              title: 'Master Data Structures',
              description: 'Arrays, linked lists, stacks, queues, trees, graphs',
              type: 'knowledge',
              priority: 'critical',
              estimatedTime: '40 hours',
              completed: false
            },
            {
              id: 'algorithms',
              title: 'Practice Algorithms',
              description: 'Sorting, searching, dynamic programming, recursion',
              type: 'practice',
              priority: 'critical',
              estimatedTime: '60 hours',
              completed: false
            }
          ],
          completed: false
        },
        {
          id: 'system-design',
          title: 'System Design Knowledge',
          description: 'Understanding of system architecture and design patterns.',
          order: 2,
          items: [
            {
              id: 'scalability',
              title: 'Learn Scalability Concepts',
              description: 'Load balancing, caching, database sharding',
              type: 'knowledge',
              priority: 'important',
              estimatedTime: '20 hours',
              completed: false
            }
          ],
          completed: false
        }
      ],
      resources: ['js-fundamentals-course'],
      tips: [
        'Practice coding problems daily',
        'Explain your thought process clearly',
        'Ask clarifying questions',
        'Test your code thoroughly'
      ],
      commonMistakes: [
        'Not asking questions about requirements',
        'Jumping to code without planning',
        'Not considering edge cases',
        'Poor time management'
      ],
      successCriteria: [
        'Solve coding problems efficiently',
        'Communicate clearly during interviews',
        'Demonstrate problem-solving approach',
        'Show understanding of best practices'
      ]
    },
    difficulty: 'intermediate',
    estimatedTime: '2-3 months',
    completed: false,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  }
];

// Learning Resource Categories
export const LEARNING_RESOURCE_CATEGORIES: LearningResourceCategory[] = [
  {
    id: 'beginner-programming',
    name: 'Beginner Programming',
    description: 'Essential programming courses for beginners.',
    domain: 'technology-computer-science',
    subfield: 'software-development',
    skillLevel: 'beginner',
    resources: LEARNING_RESOURCES.filter(r => 
      r.domain === 'technology-computer-science' && 
      r.difficulty === 'beginner'
    ),
    estimatedDuration: '3-6 months',
    totalCost: 0,
    completionRate: 0
  },
  {
    id: 'web-development-intermediate',
    name: 'Intermediate Web Development',
    description: 'Advanced web development skills and frameworks.',
    domain: 'technology-computer-science',
    subfield: 'software-development',
    skillLevel: 'intermediate',
    resources: LEARNING_RESOURCES.filter(r => 
      r.domain === 'technology-computer-science' && 
      r.difficulty === 'intermediate' &&
      r.skills.some(skill => skill.toLowerCase().includes('web') || skill.toLowerCase().includes('react'))
    ),
    estimatedDuration: '4-8 months',
    totalCost: 139.98,
    completionRate: 0
  }
];

// Utility functions
export const getResourcesByDomain = (domain: string): LearningResource[] => {
  return LEARNING_RESOURCES.filter(resource => resource.domain === domain);
};

export const getResourcesBySubfield = (domain: string, subfield: string): LearningResource[] => {
  return LEARNING_RESOURCES.filter(resource => 
    resource.domain === domain && resource.subfield === subfield
  );
};

export const getResourcesByDifficulty = (difficulty: 'beginner' | 'intermediate' | 'advanced'): LearningResource[] => {
  return LEARNING_RESOURCES.filter(resource => resource.difficulty === difficulty);
};

export const getFreeResources = (): LearningResource[] => {
  return LEARNING_RESOURCES.filter(resource => resource.cost === 0);
};

export const getResourcesByType = (type: string): LearningResource[] => {
  return LEARNING_RESOURCES.filter(resource => resource.type === type);
};

export const searchResources = (query: string): LearningResource[] => {
  const lowercaseQuery = query.toLowerCase();
  return LEARNING_RESOURCES.filter(resource =>
    resource.title.toLowerCase().includes(lowercaseQuery) ||
    resource.description.toLowerCase().includes(lowercaseQuery) ||
    resource.skills.some(skill => skill.toLowerCase().includes(lowercaseQuery)) ||
    resource.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
  );
};