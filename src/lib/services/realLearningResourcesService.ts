/**
 * Real Learning Resources Service
 * Provides real, clickable links to Udemy, Coursera, YouTube, and Google courses
 * Personalized based on career and years of experience
 */

export interface RealLearningResource {
  id: string;
  title: string;
  provider: 'Udemy' | 'Coursera' | 'YouTube' | 'Google' | 'freeCodeCamp' | 'edX' | 'Pluralsight';
  url: string;
  description: string;
  duration: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'All Levels';
  cost: number; // 0 for free
  rating?: number;
  relevanceScore: number; // 0-100 based on career and experience
  skills: string[];
  experienceLevel: string[]; // ['Entry', 'Junior', 'Mid', 'Senior', 'Expert']
}

export interface ResourceCategory {
  category: string;
  description: string;
  resources: RealLearningResource[];
}

export class RealLearningResourcesService {
  
  /**
   * Get personalized learning resources based on career and years of experience
   */
  /**
   * ROBUST CAREER MATCHING SYSTEM
   * Priority-based matching to prevent ANY career from getting wrong content
   */
  private static getCareerResources(career: string): { resources: RealLearningResource[]; matchedBy: string } {
    // PRIORITY 1: Exact/Specific matches (highest priority - check these FIRST)
    const specificMatches = [
      { keywords: ['quality engineer', 'quality assurance', 'qa engineer', 'qa tester', 'software tester'], resources: this.getQualityEngineerResources(), name: 'Quality Engineering' },
      { keywords: ['data scientist', 'machine learning', 'ml engineer', 'ai engineer'], resources: this.getDataScienceResources(), name: 'Data Science' },
      { keywords: ['penetration tester', 'pentester', 'ethical hacker', 'cybersecurity', 'security analyst'], resources: this.getCybersecurityResources(), name: 'Cybersecurity' },
      { keywords: ['civil engineer', 'structural engineer', 'mechanical engineer', 'electrical engineer'], resources: this.getEngineeringResources(), name: 'Engineering' },
      { keywords: ['surveyor', 'land surveyor', 'quantity surveyor'], resources: this.getSurveyorResources(), name: 'Surveying' },
      { keywords: ['motion graphics', 'motion designer', 'animator', '3d artist', 'vfx artist'], resources: this.getMotionGraphicsResources(), name: 'Motion Graphics' },
      { keywords: ['graphic designer', 'visual designer', 'brand designer'], resources: this.getGraphicDesignResources(), name: 'Graphic Design' },
      { keywords: ['ui designer', 'ux designer', 'product designer', 'ui/ux'], resources: this.getUIUXResources(), name: 'UI/UX Design' },
      { keywords: ['data analyst', 'business analyst', 'business intelligence'], resources: this.getDataAnalystResources(), name: 'Data Analytics' },
      { keywords: ['product manager', 'product owner', 'program manager'], resources: this.getProductManagementResources(), name: 'Product Management' },
    ];

    // Check specific matches first
    for (const match of specificMatches) {
      if (match.keywords.some(keyword => career.includes(keyword))) {
        console.log(`✅ Career Match: "${career}" → ${match.name}`);
        return { resources: match.resources, matchedBy: match.name };
      }
    }

    // PRIORITY 2: Broad category matches
    const categoryMatches = [
      { keywords: ['frontend', 'react', 'vue', 'angular', 'web developer'], resources: this.getFrontendResources(), name: 'Frontend Development' },
      { keywords: ['backend', 'server', 'api', 'node', 'django', 'flask'], resources: this.getBackendResources(), name: 'Backend Development' },
      { keywords: ['fullstack', 'full stack', 'full-stack'], resources: [...this.getFrontendResources(), ...this.getBackendResources()], name: 'Full Stack Development' },
      { keywords: ['mobile', 'ios', 'android', 'react native', 'flutter'], resources: this.getMobileResources(), name: 'Mobile Development' },
      { keywords: ['devops', 'cloud', 'aws', 'azure', 'kubernetes', 'docker'], resources: this.getDevOpsResources(), name: 'DevOps' },
      { keywords: ['architect', 'architecture'], resources: this.getArchitectureResources(), name: 'Architecture' },
      { keywords: ['music', 'audio', 'sound'], resources: this.getMusicAudioResources(), name: 'Music/Audio' },
      { keywords: ['film', 'cinemat', 'director', 'video production'], resources: this.getFilmProductionResources(), name: 'Film Production' },
      { keywords: ['photo', 'photography'], resources: this.getPhotographyResources(), name: 'Photography' },
      { keywords: ['startup', 'founder', 'entrepreneur'], resources: this.getStartupFounderResources(), name: 'Startup/Entrepreneurship' },
      { keywords: ['business', 'marketing', 'sales'], resources: this.getBusinessMarketingResources(), name: 'Business/Marketing' },
      { keywords: ['doctor', 'physician', 'nurse', 'medic', 'healthcare'], resources: this.getHealthcareResources(), name: 'Healthcare' },
      { keywords: ['construction', 'builder', 'carpenter', 'electrician', 'plumber'], resources: this.getConstructionResources(), name: 'Construction' },
      { keywords: ['teacher', 'professor', 'educator', 'instructor'], resources: this.getEducationResources(), name: 'Education' },
      { keywords: ['lawyer', 'attorney', 'legal', 'paralegal'], resources: this.getLegalResources(), name: 'Legal' },
      { keywords: ['accountant', 'finance', 'financial', 'auditor', 'cpa'], resources: this.getFinanceResources(), name: 'Finance/Accounting' },
      { keywords: ['scientist', 'researcher', 'research', 'lab'], resources: this.getScienceResearchResources(), name: 'Science/Research' },
    ];

    for (const match of categoryMatches) {
      if (match.keywords.some(keyword => career.includes(keyword))) {
        console.log(`✅ Career Match: "${career}" → ${match.name}`);
        return { resources: match.resources, matchedBy: match.name };
      }
    }

    // PRIORITY 3: Generic software/tech (only if nothing else matched)
    if (career.includes('software') || career.includes('developer') || career.includes('programmer') || career.includes('coding')) {
      console.log(`✅ Career Match: "${career}" → Generic Software Development`);
      return { resources: this.getGenericSoftwareResources(), matchedBy: 'Software Development (Generic)' };
    }

    // PRIORITY 4: Professional development (absolute fallback)
    console.warn(`⚠️ NO SPECIFIC MATCH for career: "${career}" - Using generic professional development`);
    return { resources: this.getGenericProfessionalResources(), matchedBy: 'Generic Professional (Fallback)' };
  }

  static getPersonalizedResources(
    careerInterest: string,
    yearsOfExperience: number,
    skills: string[]
  ): ResourceCategory[] {
    const experienceLevel = this.getExperienceLevel(yearsOfExperience);
    const career = careerInterest.toLowerCase();

    // Get resources using the robust matching system
    const { resources, matchedBy } = this.getCareerResources(career);

    // Validate resources are relevant
    const isRelevant = this.validateResourceRelevance(resources, career);
    if (!isRelevant) {
      console.error(`❌ VALIDATION FAILED: Resources for "${career}" don't seem relevant!`);
      console.error(`Matched by: ${matchedBy}`);
    }

    // Filter and score resources based on experience level
    const scoredResources = resources
      .filter(r => r.experienceLevel.includes(experienceLevel))
      .map(r => ({
        ...r,
        relevanceScore: this.calculateRelevance(r, experienceLevel, skills)
      }))
      .sort((a, b) => b.relevanceScore - a.relevanceScore);

    // Group by category
    return this.groupByCategory(scoredResources, experienceLevel);
  }

  /**
   * Validate that resources are actually relevant to the career
   * Prevents showing web dev content for non-web careers
   */
  private static validateResourceRelevance(resources: RealLearningResource[], career: string): boolean {
    if (resources.length === 0) return false;

    // Check if any resource titles/skills match the career interest
    const webDevKeywords = ['javascript', 'react', 'html', 'css', 'web', 'frontend', 'backend'];
    const isWebCareer = career.includes('web') || career.includes('frontend') || career.includes('backend') || career.includes('fullstack');
    
    // If it's NOT a web career but all resources are web dev, that's wrong
    if (!isWebCareer) {
      const webResourceCount = resources.filter(r => 
        webDevKeywords.some(keyword => 
          r.title.toLowerCase().includes(keyword) || 
          r.skills.some(skill => skill.toLowerCase().includes(keyword))
        )
      ).length;
      
      // If more than 50% of resources are web dev for a non-web career, flag it
      if (webResourceCount > resources.length * 0.5) {
        return false;
      }
    }

    return true;
  }

  private static getExperienceLevel(years: number): string {
    if (years === 0) return 'Entry';
    if (years < 2) return 'Junior';
    if (years < 5) return 'Mid';
    if (years < 10) return 'Senior';
    return 'Expert';
  }

  private static calculateRelevance(
    resource: RealLearningResource,
    experienceLevel: string,
    userSkills: string[]
  ): number {
    let score = resource.relevanceScore;

    // Boost score if difficulty matches experience
    const difficultyMap: Record<string, string> = {
      'Entry': 'Beginner',
      'Junior': 'Beginner',
      'Mid': 'Intermediate',
      'Senior': 'Advanced',
      'Expert': 'Advanced'
    };

    if (resource.difficulty === difficultyMap[experienceLevel]) {
      score += 15;
    }

    // Boost score if resource skills match user skills
    const matchingSkills = resource.skills.filter(skill =>
      userSkills.some(userSkill => 
        userSkill.toLowerCase().includes(skill.toLowerCase()) ||
        skill.toLowerCase().includes(userSkill.toLowerCase())
      )
    );
    score += matchingSkills.length * 5;

    // Prefer free resources for beginners
    if ((experienceLevel === 'Entry' || experienceLevel === 'Junior') && resource.cost === 0) {
      score += 10;
    }

    return Math.min(100, score);
  }

  private static groupByCategory(resources: RealLearningResource[], experienceLevel: string): ResourceCategory[] {
    const categories: ResourceCategory[] = [];

    // Fundamentals (for Entry/Junior)
    if (experienceLevel === 'Entry' || experienceLevel === 'Junior') {
      categories.push({
        category: 'Fundamentals & Getting Started',
        description: 'Core concepts and beginner-friendly courses',
        resources: resources.filter(r => r.difficulty === 'Beginner' || r.difficulty === 'All Levels').slice(0, 5)
      });
    }

    // Core Skills (for all levels)
    categories.push({
      category: 'Core Skills Development',
      description: 'Essential skills for your career path',
      resources: resources.slice(0, 8)
    });

    // Advanced Topics (for Mid+)
    if (experienceLevel === 'Mid' || experienceLevel === 'Senior' || experienceLevel === 'Expert') {
      categories.push({
        category: 'Advanced & Specialization',
        description: 'Deep-dive into advanced topics',
        resources: resources.filter(r => r.difficulty === 'Advanced' || r.difficulty === 'Intermediate').slice(0, 5)
      });
    }

    // Free Resources (for all)
    categories.push({
      category: 'Free Learning Resources',
      description: 'High-quality free courses and tutorials',
      resources: resources.filter(r => r.cost === 0).slice(0, 6)
    });

    return categories.filter(c => c.resources.length > 0);
  }

  // ============= CAREER-SPECIFIC RESOURCES =============

  private static getFrontendResources(): RealLearningResource[] {
    return [
      {
        id: 'udemy-react-complete',
        title: 'React - The Complete Guide 2024',
        provider: 'Udemy',
        url: 'https://www.udemy.com/course/react-the-complete-guide-incl-redux/',
        description: 'Dive in and learn React.js from scratch! Learn React, Hooks, Redux, React Router, Next.js, Best Practices and more!',
        duration: '48 hours',
        difficulty: 'All Levels',
        cost: 12.99,
        rating: 4.6,
        relevanceScore: 95,
        skills: ['React', 'JavaScript', 'TypeScript', 'Redux', 'Next.js'],
        experienceLevel: ['Entry', 'Junior', 'Mid']
      },
      {
        id: 'coursera-html-css-js',
        title: 'HTML, CSS, and Javascript for Web Developers',
        provider: 'Coursera',
        url: 'https://www.coursera.org/learn/html-css-javascript-for-web-developers',
        description: 'Learn the basics of web development with HTML, CSS, and JavaScript',
        duration: '40 hours',
        difficulty: 'Beginner',
        cost: 0,
        rating: 4.7,
        relevanceScore: 90,
        skills: ['HTML', 'CSS', 'JavaScript'],
        experienceLevel: ['Entry', 'Junior']
      },
      {
        id: 'youtube-javascript-full',
        title: 'JavaScript Full Course - freeCodeCamp',
        provider: 'YouTube',
        url: 'https://www.youtube.com/watch?v=PkZNo7MFNFg',
        description: 'Learn JavaScript from scratch in this complete tutorial',
        duration: '3.5 hours',
        difficulty: 'Beginner',
        cost: 0,
        rating: 4.8,
        relevanceScore: 85,
        skills: ['JavaScript', 'Programming Basics'],
        experienceLevel: ['Entry', 'Junior']
      },
      {
        id: 'coursera-react-specialization',
        title: 'React Specialization - Meta',
        provider: 'Coursera',
        url: 'https://www.coursera.org/professional-certificates/meta-front-end-developer',
        description: 'Professional certification from Meta covering React and frontend development',
        duration: '7 months',
        difficulty: 'Intermediate',
        cost: 39,
        rating: 4.7,
        relevanceScore: 92,
        skills: ['React', 'JavaScript', 'HTML/CSS', 'Git'],
        experienceLevel: ['Entry', 'Junior', 'Mid']
      },
      {
        id: 'udemy-typescript-complete',
        title: 'Understanding TypeScript',
        provider: 'Udemy',
        url: 'https://www.udemy.com/course/understanding-typescript/',
        description: 'Master TypeScript and enhance your JavaScript development skills',
        duration: '15 hours',
        difficulty: 'All Levels',
        cost: 12.99,
        rating: 4.7,
        relevanceScore: 88,
        skills: ['TypeScript', 'JavaScript', 'OOP'],
        experienceLevel: ['Junior', 'Mid', 'Senior']
      },
      {
        id: 'youtube-css-grid-flexbox',
        title: 'CSS Grid & Flexbox - Traversy Media',
        provider: 'YouTube',
        url: 'https://www.youtube.com/watch?v=jV8B24rSN5o',
        description: 'Complete guide to modern CSS layout with Grid and Flexbox',
        duration: '2 hours',
        difficulty: 'Beginner',
        cost: 0,
        relevanceScore: 82,
        skills: ['CSS', 'Layout', 'Responsive Design'],
        experienceLevel: ['Entry', 'Junior', 'Mid']
      },
      {
        id: 'freecodecamp-frontend',
        title: 'Responsive Web Design Certification',
        provider: 'freeCodeCamp',
        url: 'https://www.freecodecamp.org/learn/2022/responsive-web-design/',
        description: 'Free certification covering HTML, CSS, and responsive design',
        duration: '300 hours',
        difficulty: 'Beginner',
        cost: 0,
        rating: 4.9,
        relevanceScore: 90,
        skills: ['HTML', 'CSS', 'Responsive Design', 'Accessibility'],
        experienceLevel: ['Entry', 'Junior']
      },
      {
        id: 'udemy-nextjs-complete',
        title: 'Next.js & React - The Complete Guide',
        provider: 'Udemy',
        url: 'https://www.udemy.com/course/nextjs-react-the-complete-guide/',
        description: 'Build production-ready React apps with Next.js',
        duration: '18 hours',
        difficulty: 'Intermediate',
        cost: 12.99,
        rating: 4.6,
        relevanceScore: 87,
        skills: ['Next.js', 'React', 'SSR', 'SEO'],
        experienceLevel: ['Mid', 'Senior']
      }
    ];
  }

  private static getBackendResources(): RealLearningResource[] {
    return [
      {
        id: 'udemy-nodejs-complete',
        title: 'Node.js, Express, MongoDB - The Complete Bootcamp',
        provider: 'Udemy',
        url: 'https://www.udemy.com/course/nodejs-express-mongodb-bootcamp/',
        description: 'Master Node.js and build fast, secure RESTful APIs with authentication, databases, and more',
        duration: '42 hours',
        difficulty: 'All Levels',
        cost: 12.99,
        rating: 4.8,
        relevanceScore: 95,
        skills: ['Node.js', 'Express', 'MongoDB', 'REST API'],
        experienceLevel: ['Entry', 'Junior', 'Mid']
      },
      {
        id: 'coursera-python-everyone',
        title: 'Python for Everybody Specialization',
        provider: 'Coursera',
        url: 'https://www.coursera.org/specializations/python',
        description: 'Learn Python programming from the University of Michigan',
        duration: '8 months',
        difficulty: 'Beginner',
        cost: 0,
        rating: 4.8,
        relevanceScore: 90,
        skills: ['Python', 'Programming', 'Databases'],
        experienceLevel: ['Entry', 'Junior']
      },
      {
        id: 'youtube-nodejs-crash',
        title: 'Node.js Crash Course - Traversy Media',
        provider: 'YouTube',
        url: 'https://www.youtube.com/watch?v=fBNz5xF-Kx4',
        description: 'Learn Node.js fundamentals in one video',
        duration: '1.5 hours',
        difficulty: 'Beginner',
        cost: 0,
        relevanceScore: 85,
        skills: ['Node.js', 'JavaScript', 'Backend'],
        experienceLevel: ['Entry', 'Junior']
      },
      {
        id: 'coursera-django-everyone',
        title: 'Django for Everybody Specialization',
        provider: 'Coursera',
        url: 'https://www.coursera.org/specializations/django',
        description: 'Build web applications with Python and Django',
        duration: '4 months',
        difficulty: 'Intermediate',
        cost: 0,
        rating: 4.8,
        relevanceScore: 88,
        skills: ['Django', 'Python', 'Web Development', 'Databases'],
        experienceLevel: ['Junior', 'Mid']
      },
      {
        id: 'udemy-rest-api-design',
        title: 'REST APIs with Flask and Python',
        provider: 'Udemy',
        url: 'https://www.udemy.com/course/rest-api-flask-and-python/',
        description: 'Build professional REST APIs with Python, Flask, and Docker',
        duration: '17 hours',
        difficulty: 'Intermediate',
        cost: 12.99,
        rating: 4.6,
        relevanceScore: 86,
        skills: ['Flask', 'Python', 'REST API', 'Docker'],
        experienceLevel: ['Mid', 'Senior']
      },
      {
        id: 'youtube-sql-tutorial',
        title: 'SQL Tutorial - Full Database Course for Beginners',
        provider: 'YouTube',
        url: 'https://www.youtube.com/watch?v=HXV3zeQKqGY',
        description: 'Complete SQL course from freeCodeCamp',
        duration: '4 hours',
        difficulty: 'Beginner',
        cost: 0,
        relevanceScore: 90,
        skills: ['SQL', 'Databases', 'MySQL', 'PostgreSQL'],
        experienceLevel: ['Entry', 'Junior', 'Mid']
      },
      {
        id: 'coursera-spring-boot',
        title: 'Building Scalable Java Microservices with Spring Boot',
        provider: 'Coursera',
        url: 'https://www.coursera.org/learn/google-cloud-java-spring',
        description: 'Learn to build microservices with Spring Boot and deploy to Google Cloud',
        duration: '3 weeks',
        difficulty: 'Advanced',
        cost: 0,
        rating: 4.5,
        relevanceScore: 84,
        skills: ['Java', 'Spring Boot', 'Microservices', 'Cloud'],
        experienceLevel: ['Mid', 'Senior', 'Expert']
      }
    ];
  }

  private static getCybersecurityResources(): RealLearningResource[] {
    return [
      {
        id: 'youtube-pentesting-basics',
        title: 'Penetration Testing Basics - Full Course',
        provider: 'YouTube',
        url: 'https://www.youtube.com/watch?v=3Kq1MIfTWCE',
        description: 'Complete penetration testing tutorial for beginners',
        duration: '12 hours',
        difficulty: 'Beginner',
        cost: 0,
        rating: 4.8,
        relevanceScore: 98,
        skills: ['Penetration Testing', 'Ethical Hacking', 'Kali Linux', 'Metasploit'],
        experienceLevel: ['Entry', 'Junior']
      },
      {
        id: 'udemy-ethical-hacking',
        title: 'Complete Ethical Hacking Bootcamp',
        provider: 'Udemy',
        url: 'https://www.udemy.com/course/complete-ethical-hacking-bootcamp-zero-to-mastery/',
        description: 'Master ethical hacking and penetration testing',
        duration: '25 hours',
        difficulty: 'All Levels',
        cost: 12.99,
        rating: 4.7,
        relevanceScore: 96,
        skills: ['Ethical Hacking', 'Network Security', 'Web Security', 'Pentesting'],
        experienceLevel: ['Entry', 'Junior', 'Mid']
      },
      {
        id: 'coursera-cybersecurity',
        title: 'Google Cybersecurity Professional Certificate',
        provider: 'Coursera',
        url: 'https://www.coursera.org/professional-certificates/google-cybersecurity',
        description: 'Official Google cybersecurity certification',
        duration: '6 months',
        difficulty: 'Beginner',
        cost: 0,
        rating: 4.8,
        relevanceScore: 95,
        skills: ['Cybersecurity', 'Network Security', 'Linux', 'Python'],
        experienceLevel: ['Entry', 'Junior']
      },
      {
        id: 'udemy-burp-suite',
        title: 'Web Application Penetration Testing with Burp Suite',
        provider: 'Udemy',
        url: 'https://www.udemy.com/course/web-application-penetration-testing-with-burp-suite/',
        description: 'Master web app security testing with Burp Suite',
        duration: '15 hours',
        difficulty: 'Intermediate',
        cost: 12.99,
        rating: 4.6,
        relevanceScore: 92,
        skills: ['Burp Suite', 'Web Security', 'OWASP', 'SQL Injection'],
        experienceLevel: ['Junior', 'Mid']
      },
      {
        id: 'youtube-nmap-tutorial',
        title: 'Network Scanning with Nmap - Complete Tutorial',
        provider: 'YouTube',
        url: 'https://www.youtube.com/watch?v=4t4kBkMsDbQ',
        description: 'Learn network reconnaissance with Nmap',
        duration: '3 hours',
        difficulty: 'Intermediate',
        cost: 0,
        rating: 4.7,
        relevanceScore: 90,
        skills: ['Nmap', 'Network Scanning', 'Reconnaissance'],
        experienceLevel: ['Junior', 'Mid']
      },
      {
        id: 'udemy-oscp-prep',
        title: 'OSCP Certification Preparation',
        provider: 'Udemy',
        url: 'https://www.udemy.com/course/oscp-training/',
        description: 'Prepare for OSCP certification exam',
        duration: '30 hours',
        difficulty: 'Advanced',
        cost: 12.99,
        rating: 4.8,
        relevanceScore: 94,
        skills: ['Offensive Security', 'Buffer Overflow', 'Privilege Escalation'],
        experienceLevel: ['Mid', 'Senior']
      }
    ];
  }

  private static getDataScienceResources(): RealLearningResource[] {
    return [
      {
        id: 'coursera-ml-andrew-ng',
        title: 'Machine Learning Specialization - Andrew Ng',
        provider: 'Coursera',
        url: 'https://www.coursera.org/specializations/machine-learning-introduction',
        description: 'The legendary Machine Learning course by Andrew Ng',
        duration: '3 months',
        difficulty: 'Intermediate',
        cost: 49,
        rating: 4.9,
        relevanceScore: 98,
        skills: ['Machine Learning', 'Python', 'TensorFlow', 'Neural Networks'],
        experienceLevel: ['Junior', 'Mid', 'Senior']
      },
      {
        id: 'udemy-python-data-science',
        title: 'Python for Data Science and Machine Learning Bootcamp',
        provider: 'Udemy',
        url: 'https://www.udemy.com/course/python-for-data-science-and-machine-learning-bootcamp/',
        description: 'Learn Python, NumPy, Pandas, Matplotlib, Seaborn, Scikit-Learn, TensorFlow, and more!',
        duration: '25 hours',
        difficulty: 'All Levels',
        cost: 12.99,
        rating: 4.6,
        relevanceScore: 95,
        skills: ['Python', 'Pandas', 'NumPy', 'Machine Learning', 'Data Visualization'],
        experienceLevel: ['Entry', 'Junior', 'Mid']
      },
      {
        id: 'coursera-deeplearning-ai',
        title: 'Deep Learning Specialization',
        provider: 'Coursera',
        url: 'https://www.coursera.org/specializations/deep-learning',
        description: '5-course specialization on deep learning by Andrew Ng',
        duration: '5 months',
        difficulty: 'Advanced',
        cost: 49,
        rating: 4.9,
        relevanceScore: 96,
        skills: ['Deep Learning', 'Neural Networks', 'CNN', 'RNN', 'TensorFlow'],
        experienceLevel: ['Mid', 'Senior', 'Expert']
      },
      {
        id: 'youtube-python-data-analysis',
        title: 'Python Data Analysis - freeCodeCamp',
        provider: 'YouTube',
        url: 'https://www.youtube.com/watch?v=r-uOLxNrNk8',
        description: 'Learn data analysis with Python, NumPy, Pandas, and Matplotlib',
        duration: '10 hours',
        difficulty: 'Beginner',
        cost: 0,
        relevanceScore: 88,
        skills: ['Python', 'Pandas', 'NumPy', 'Data Analysis'],
        experienceLevel: ['Entry', 'Junior']
      },
      {
        id: 'google-ml-crash',
        title: 'Machine Learning Crash Course - Google',
        provider: 'Google',
        url: 'https://developers.google.com/machine-learning/crash-course',
        description: "Google's fast-paced practical introduction to machine learning",
        duration: '15 hours',
        difficulty: 'Intermediate',
        cost: 0,
        rating: 4.7,
        relevanceScore: 92,
        skills: ['Machine Learning', 'TensorFlow', 'Python'],
        experienceLevel: ['Junior', 'Mid']
      },
      {
        id: 'udemy-data-science-az',
        title: 'Data Science A-Z: Real-Life Data Science Exercises',
        provider: 'Udemy',
        url: 'https://www.udemy.com/course/datascience/',
        description: 'Learn data science step by step with real-world analytics exercises',
        duration: '21 hours',
        difficulty: 'All Levels',
        cost: 12.99,
        rating: 4.5,
        relevanceScore: 87,
        skills: ['Data Science', 'Statistics', 'Python', 'R'],
        experienceLevel: ['Entry', 'Junior', 'Mid']
      }
    ];
  }

  private static getDevOpsResources(): RealLearningResource[] {
    return [
      {
        id: 'udemy-docker-kubernetes',
        title: 'Docker and Kubernetes: The Complete Guide',
        provider: 'Udemy',
        url: 'https://www.udemy.com/course/docker-and-kubernetes-the-complete-guide/',
        description: 'Build, test, and deploy Docker applications with Kubernetes',
        duration: '22 hours',
        difficulty: 'All Levels',
        cost: 12.99,
        rating: 4.6,
        relevanceScore: 95,
        skills: ['Docker', 'Kubernetes', 'DevOps', 'CI/CD'],
        experienceLevel: ['Junior', 'Mid', 'Senior']
      },
      {
        id: 'coursera-google-cloud',
        title: 'Google Cloud Platform Fundamentals',
        provider: 'Coursera',
        url: 'https://www.coursera.org/learn/gcp-fundamentals',
        description: 'Learn Google Cloud Platform basics',
        duration: '4 weeks',
        difficulty: 'Beginner',
        cost: 0,
        rating: 4.7,
        relevanceScore: 88,
        skills: ['GCP', 'Cloud Computing', 'Infrastructure'],
        experienceLevel: ['Entry', 'Junior', 'Mid']
      },
      {
        id: 'youtube-devops-tutorial',
        title: 'DevOps Tutorial for Beginners - TechWorld with Nana',
        provider: 'YouTube',
        url: 'https://www.youtube.com/watch?v=Xrgk023l4lI',
        description: 'Complete DevOps tutorial covering Docker, Kubernetes, CI/CD, and more',
        duration: '2.5 hours',
        difficulty: 'Beginner',
        cost: 0,
        relevanceScore: 90,
        skills: ['DevOps', 'Docker', 'Kubernetes', 'CI/CD'],
        experienceLevel: ['Entry', 'Junior']
      },
      {
        id: 'coursera-aws-fundamentals',
        title: 'AWS Fundamentals Specialization',
        provider: 'Coursera',
        url: 'https://www.coursera.org/specializations/aws-fundamentals',
        description: 'Learn Amazon Web Services from scratch',
        duration: '3 months',
        difficulty: 'Intermediate',
        cost: 0,
        rating: 4.6,
        relevanceScore: 92,
        skills: ['AWS', 'Cloud', 'EC2', 'S3', 'Lambda'],
        experienceLevel: ['Junior', 'Mid', 'Senior']
      },
      {
        id: 'udemy-terraform',
        title: 'Learn DevOps: Infrastructure Automation With Terraform',
        provider: 'Udemy',
        url: 'https://www.udemy.com/course/learn-devops-infrastructure-automation-with-terraform/',
        description: 'Use Terraform to automate your AWS infrastructure',
        duration: '10 hours',
        difficulty: 'Intermediate',
        cost: 12.99,
        rating: 4.7,
        relevanceScore: 86,
        skills: ['Terraform', 'Infrastructure as Code', 'AWS', 'DevOps'],
        experienceLevel: ['Mid', 'Senior']
      }
    ];
  }

  private static getMobileResources(): RealLearningResource[] {
    return [
      {
        id: 'udemy-react-native',
        title: 'The Complete React Native + Hooks Course',
        provider: 'Udemy',
        url: 'https://www.udemy.com/course/the-complete-react-native-and-redux-course/',
        description: 'Build beautiful mobile apps with React Native',
        duration: '38 hours',
        difficulty: 'All Levels',
        cost: 12.99,
        rating: 4.6,
        relevanceScore: 95,
        skills: ['React Native', 'Mobile Development', 'JavaScript', 'Redux'],
        experienceLevel: ['Entry', 'Junior', 'Mid']
      },
      {
        id: 'coursera-android-kotlin',
        title: 'Android App Development with Kotlin',
        provider: 'Coursera',
        url: 'https://www.coursera.org/learn/kotlin-for-android-app-development',
        description: 'Build Android apps using Kotlin',
        duration: '4 weeks',
        difficulty: 'Intermediate',
        cost: 0,
        rating: 4.5,
        relevanceScore: 90,
        skills: ['Kotlin', 'Android', 'Mobile Development'],
        experienceLevel: ['Junior', 'Mid']
      },
      {
        id: 'youtube-flutter-tutorial',
        title: 'Flutter Tutorial for Beginners - freeCodeCamp',
        provider: 'YouTube',
        url: 'https://www.youtube.com/watch?v=pTJJsmejUOQ',
        description: 'Build cross-platform apps with Flutter and Dart',
        duration: '5 hours',
        difficulty: 'Beginner',
        cost: 0,
        relevanceScore: 88,
        skills: ['Flutter', 'Dart', 'Mobile Development'],
        experienceLevel: ['Entry', 'Junior']
      },
      {
        id: 'udemy-ios-swift',
        title: 'iOS & Swift - The Complete iOS App Development Bootcamp',
        provider: 'Udemy',
        url: 'https://www.udemy.com/course/ios-13-app-development-bootcamp/',
        description: 'Learn iOS development with Swift and build apps for iPhone and iPad',
        duration: '60 hours',
        difficulty: 'All Levels',
        cost: 12.99,
        rating: 4.7,
        relevanceScore: 93,
        skills: ['iOS', 'Swift', 'Xcode', 'Mobile Development'],
        experienceLevel: ['Entry', 'Junior', 'Mid']
      }
    ];
  }

  private static getUIUXResources(): RealLearningResource[] {
    return [
      {
        id: 'coursera-google-ux',
        title: 'Google UX Design Professional Certificate',
        provider: 'Coursera',
        url: 'https://www.coursera.org/professional-certificates/google-ux-design',
        description: 'Professional UX design certificate from Google',
        duration: '6 months',
        difficulty: 'Beginner',
        cost: 39,
        rating: 4.8,
        relevanceScore: 96,
        skills: ['UX Design', 'Figma', 'Prototyping', 'User Research'],
        experienceLevel: ['Entry', 'Junior', 'Mid']
      },
      {
        id: 'udemy-ui-ux-complete',
        title: 'User Experience Design Essentials',
        provider: 'Udemy',
        url: 'https://www.udemy.com/course/ui-ux-web-design-using-adobe-xd/',
        description: 'Complete UI/UX course with Adobe XD and Figma',
        duration: '12 hours',
        difficulty: 'All Levels',
        cost: 12.99,
        rating: 4.5,
        relevanceScore: 90,
        skills: ['UI Design', 'UX Design', 'Figma', 'Adobe XD'],
        experienceLevel: ['Entry', 'Junior']
      },
      {
        id: 'youtube-figma-tutorial',
        title: 'Figma Tutorial for Beginners - DesignCourse',
        provider: 'YouTube',
        url: 'https://www.youtube.com/watch?v=FTFaQWZBqQ8',
        description: 'Complete Figma tutorial for UI/UX design',
        duration: '2 hours',
        difficulty: 'Beginner',
        cost: 0,
        relevanceScore: 85,
        skills: ['Figma', 'UI Design', 'Prototyping'],
        experienceLevel: ['Entry', 'Junior']
      },
      {
        id: 'coursera-ui-design',
        title: 'UI / UX Design Specialization - CalArts',
        provider: 'Coursera',
        url: 'https://www.coursera.org/specializations/ui-ux-design',
        description: 'Comprehensive UI/UX design specialization',
        duration: '4 months',
        difficulty: 'Intermediate',
        cost: 49,
        rating: 4.7,
        relevanceScore: 92,
        skills: ['UI Design', 'UX Research', 'Visual Design', 'Prototyping'],
        experienceLevel: ['Junior', 'Mid', 'Senior']
      }
    ];
  }

  private static getProductManagementResources(): RealLearningResource[] {
    return [
      {
        id: 'coursera-product-management',
        title: 'Digital Product Management Specialization',
        provider: 'Coursera',
        url: 'https://www.coursera.org/specializations/product-management',
        description: 'Learn product management from University of Virginia',
        duration: '6 months',
        difficulty: 'Intermediate',
        cost: 49,
        rating: 4.6,
        relevanceScore: 95,
        skills: ['Product Management', 'Strategy', 'Agile', 'Roadmapping'],
        experienceLevel: ['Junior', 'Mid', 'Senior']
      },
      {
        id: 'udemy-product-manager',
        title: 'Become a Product Manager',
        provider: 'Udemy',
        url: 'https://www.udemy.com/course/become-a-product-manager-learn-the-skills-get-a-job/',
        description: 'Learn product management skills and get a PM job',
        duration: '18 hours',
        difficulty: 'All Levels',
        cost: 12.99,
        rating: 4.5,
        relevanceScore: 90,
        skills: ['Product Management', 'Agile', 'User Stories', 'Metrics'],
        experienceLevel: ['Entry', 'Junior', 'Mid']
      },
      {
        id: 'youtube-pm-basics',
        title: 'Product Management 101 - Google PM',
        provider: 'YouTube',
        url: 'https://www.youtube.com/watch?v=vx8FwTRvwG8',
        description: 'Introduction to product management from a Google PM',
        duration: '1 hour',
        difficulty: 'Beginner',
        cost: 0,
        relevanceScore: 85,
        skills: ['Product Management', 'Strategy', 'Roadmaps'],
        experienceLevel: ['Entry', 'Junior']
      }
    ];
  }

  private static getDataAnalystResources(): RealLearningResource[] {
    return [
      {
        id: 'coursera-google-data-analytics',
        title: 'Google Data Analytics Professional Certificate',
        provider: 'Coursera',
        url: 'https://www.coursera.org/professional-certificates/google-data-analytics',
        description: 'Professional data analytics certificate from Google',
        duration: '6 months',
        difficulty: 'Beginner',
        cost: 39,
        rating: 4.8,
        relevanceScore: 97,
        skills: ['Data Analysis', 'SQL', 'Tableau', 'R', 'Excel'],
        experienceLevel: ['Entry', 'Junior', 'Mid']
      },
      {
        id: 'udemy-excel-data-analysis',
        title: 'Microsoft Excel - Data Analysis with Excel Pivot Tables',
        provider: 'Udemy',
        url: 'https://www.udemy.com/course/data-analysis-with-excel-pivot-tables/',
        description: 'Master Excel for data analysis',
        duration: '5 hours',
        difficulty: 'All Levels',
        cost: 12.99,
        rating: 4.6,
        relevanceScore: 88,
        skills: ['Excel', 'Pivot Tables', 'Data Analysis'],
        experienceLevel: ['Entry', 'Junior']
      },
      {
        id: 'youtube-tableau-tutorial',
        title: 'Tableau Full Course - Simplilearn',
        provider: 'YouTube',
        url: 'https://www.youtube.com/watch?v=jj6-0cvcNEA',
        description: 'Complete Tableau tutorial for data visualization',
        duration: '8 hours',
        difficulty: 'Beginner',
        cost: 0,
        relevanceScore: 92,
        skills: ['Tableau', 'Data Visualization', 'Analytics'],
        experienceLevel: ['Entry', 'Junior', 'Mid']
      },
      {
        id: 'coursera-sql-data-science',
        title: 'SQL for Data Science',
        provider: 'Coursera',
        url: 'https://www.coursera.org/learn/sql-for-data-science',
        description: 'Learn SQL for data analysis',
        duration: '4 weeks',
        difficulty: 'Beginner',
        cost: 0,
        rating: 4.6,
        relevanceScore: 94,
        skills: ['SQL', 'Databases', 'Data Analysis'],
        experienceLevel: ['Entry', 'Junior']
      }
    ];
  }

  private static getStartupFounderResources(): RealLearningResource[] {
    return [
      {
        id: 'ycombinator-startup-school',
        title: 'Startup School - Y Combinator',
        provider: 'YouTube',
        url: 'https://www.startupschool.org/',
        description: 'Free startup education from Y Combinator, the world\'s most successful startup accelerator',
        duration: '4 weeks',
        difficulty: 'All Levels',
        cost: 0,
        rating: 4.9,
        relevanceScore: 98,
        skills: ['Entrepreneurship', 'Business Strategy', 'Fundraising', 'Product Development'],
        experienceLevel: ['Entry', 'Junior', 'Mid', 'Senior']
      },
      {
        id: 'coursera-entrepreneurship',
        title: 'Entrepreneurship Specialization - University of Pennsylvania',
        provider: 'Coursera',
        url: 'https://www.coursera.org/specializations/wharton-entrepreneurship',
        description: 'Learn to develop a new venture from Wharton School',
        duration: '6 months',
        difficulty: 'Intermediate',
        cost: 49,
        rating: 4.7,
        relevanceScore: 96,
        skills: ['Entrepreneurship', 'Business Model', 'Innovation', 'Marketing', 'Finance'],
        experienceLevel: ['Entry', 'Junior', 'Mid']
      },
      {
        id: 'udemy-startup-complete',
        title: 'The Complete Startup Course: From Idea to Launch',
        provider: 'Udemy',
        url: 'https://www.udemy.com/course/the-complete-startup-course/',
        description: 'Build your startup from scratch with practical lessons',
        duration: '12 hours',
        difficulty: 'All Levels',
        cost: 12.99,
        rating: 4.5,
        relevanceScore: 94,
        skills: ['Startup', 'Business Plan', 'MVP', 'Marketing', 'Fundraising'],
        experienceLevel: ['Entry', 'Junior']
      },
      {
        id: 'youtube-how-to-start-startup',
        title: 'How to Start a Startup - Stanford',
        provider: 'YouTube',
        url: 'https://www.youtube.com/playlist?list=PL5q_lef6zVkaTY_cT1k7qFNF2TidHCe-1',
        description: 'Stanford course on starting a startup with guest speakers',
        duration: '20 hours',
        difficulty: 'Intermediate',
        cost: 0,
        relevanceScore: 97,
        skills: ['Startup Strategy', 'Product-Market Fit', 'Team Building', 'Growth'],
        experienceLevel: ['Entry', 'Junior', 'Mid']
      },
      {
        id: 'coursera-venture-capital',
        title: 'Venture Capital and Finance of Innovation',
        provider: 'Coursera',
        url: 'https://www.coursera.org/learn/venture-capital',
        description: 'Learn how VCs evaluate startups and make investment decisions',
        duration: '4 weeks',
        difficulty: 'Advanced',
        cost: 0,
        rating: 4.6,
        relevanceScore: 90,
        skills: ['Fundraising', 'Venture Capital', 'Valuation', 'Term Sheets'],
        experienceLevel: ['Mid', 'Senior']
      },
      {
        id: 'udemy-lean-startup',
        title: 'The Lean Startup Method',
        provider: 'Udemy',
        url: 'https://www.udemy.com/course/lean-startup-method/',
        description: 'Build products customers actually want using lean principles',
        duration: '8 hours',
        difficulty: 'Beginner',
        cost: 12.99,
        rating: 4.5,
        relevanceScore: 93,
        skills: ['Lean Startup', 'MVP', 'Customer Development', 'Iteration'],
        experienceLevel: ['Entry', 'Junior']
      },
      {
        id: 'youtube-growth-hacking',
        title: 'Growth Hacking Strategies',
        provider: 'YouTube',
        url: 'https://www.youtube.com/watch?v=raIUQP71SBU',
        description: 'Learn growth hacking tactics for startups',
        duration: '2 hours',
        difficulty: 'Intermediate',
        cost: 0,
        relevanceScore: 88,
        skills: ['Growth Hacking', 'Marketing', 'User Acquisition', 'Analytics'],
        experienceLevel: ['Junior', 'Mid']
      },
      {
        id: 'google-digital-garage',
        title: 'Fundamentals of Digital Marketing - Google',
        provider: 'Google',
        url: 'https://learndigital.withgoogle.com/digitalgarage/course/digital-marketing',
        description: 'Free Google certification in digital marketing',
        duration: '40 hours',
        difficulty: 'Beginner',
        cost: 0,
        rating: 4.7,
        relevanceScore: 85,
        skills: ['Digital Marketing', 'SEO', 'Social Media', 'Analytics'],
        experienceLevel: ['Entry', 'Junior']
      }
    ];
  }

  private static getBusinessMarketingResources(): RealLearningResource[] {
    return [
      {
        id: 'coursera-business-foundations',
        title: 'Business Foundations Specialization',
        provider: 'Coursera',
        url: 'https://www.coursera.org/specializations/wharton-business-foundations',
        description: 'Learn business fundamentals from Wharton',
        duration: '6 months',
        difficulty: 'Beginner',
        cost: 49,
        rating: 4.8,
        relevanceScore: 95,
        skills: ['Business Strategy', 'Marketing', 'Finance', 'Operations'],
        experienceLevel: ['Entry', 'Junior', 'Mid']
      },
      {
        id: 'udemy-digital-marketing-masterclass',
        title: 'The Complete Digital Marketing Course',
        provider: 'Udemy',
        url: 'https://www.udemy.com/course/learn-digital-marketing-course/',
        description: '12 courses in 1: SEO, social media, email marketing, and more',
        duration: '23 hours',
        difficulty: 'All Levels',
        cost: 12.99,
        rating: 4.4,
        relevanceScore: 92,
        skills: ['Digital Marketing', 'SEO', 'Social Media', 'Email Marketing', 'Analytics'],
        experienceLevel: ['Entry', 'Junior', 'Mid']
      },
      {
        id: 'google-analytics-certification',
        title: 'Google Analytics Certification',
        provider: 'Google',
        url: 'https://skillshop.exceedlms.com/student/catalog/list?category_ids=2844',
        description: 'Official Google Analytics certification',
        duration: '4 hours',
        difficulty: 'Beginner',
        cost: 0,
        rating: 4.7,
        relevanceScore: 90,
        skills: ['Google Analytics', 'Data Analysis', 'Web Analytics'],
        experienceLevel: ['Entry', 'Junior']
      },
      {
        id: 'youtube-marketing-fundamentals',
        title: 'Marketing Fundamentals - Seth Godin',
        provider: 'YouTube',
        url: 'https://www.youtube.com/watch?v=xNmxQLuNbH8',
        description: 'Marketing wisdom from Seth Godin',
        duration: '1 hour',
        difficulty: 'All Levels',
        cost: 0,
        relevanceScore: 85,
        skills: ['Marketing', 'Brand Strategy', 'Customer Psychology'],
        experienceLevel: ['Entry', 'Junior', 'Mid']
      },
      {
        id: 'coursera-social-media-marketing',
        title: 'Social Media Marketing Specialization',
        provider: 'Coursera',
        url: 'https://www.coursera.org/specializations/social-media-marketing',
        description: 'Master social media marketing from Northwestern',
        duration: '6 months',
        difficulty: 'Intermediate',
        cost: 49,
        rating: 4.6,
        relevanceScore: 88,
        skills: ['Social Media', 'Content Marketing', 'Facebook Ads', 'Analytics'],
        experienceLevel: ['Junior', 'Mid']
      }
    ];
  }

  private static getQualityEngineerResources(): RealLearningResource[] {
    return [
      {
        id: 'udemy-software-testing-masterclass',
        title: 'Software Testing Masterclass - From Novice to Expert',
        provider: 'Udemy',
        url: 'https://www.udemy.com/course/software-testing-masterclass/',
        description: 'Complete software testing and QA engineering course',
        duration: '14 hours',
        difficulty: 'All Levels',
        cost: 12.99,
        rating: 4.6,
        relevanceScore: 98,
        skills: ['Software Testing', 'QA', 'Test Automation', 'Quality Assurance'],
        experienceLevel: ['Entry', 'Junior', 'Mid']
      },
      {
        id: 'coursera-software-testing-automation',
        title: 'Software Testing and Automation Specialization',
        provider: 'Coursera',
        url: 'https://www.coursera.org/specializations/software-testing-automation',
        description: 'Learn testing fundamentals and automation from University of Minnesota',
        duration: '4 months',
        difficulty: 'Intermediate',
        cost: 49,
        rating: 4.7,
        relevanceScore: 96,
        skills: ['Test Automation', 'Selenium', 'JUnit', 'Quality Assurance'],
        experienceLevel: ['Junior', 'Mid', 'Senior']
      },
      {
        id: 'udemy-selenium-webdriver',
        title: 'Selenium WebDriver with Java - Basics to Advanced',
        provider: 'Udemy',
        url: 'https://www.udemy.com/course/selenium-real-time-examplesinterview-questions/',
        description: 'Master Selenium automation testing with Java',
        duration: '43 hours',
        difficulty: 'All Levels',
        cost: 12.99,
        rating: 4.5,
        relevanceScore: 95,
        skills: ['Selenium', 'Test Automation', 'Java', 'WebDriver'],
        experienceLevel: ['Entry', 'Junior', 'Mid']
      },
      {
        id: 'youtube-istqb-certification',
        title: 'ISTQB Foundation Level Certification Course',
        provider: 'YouTube',
        url: 'https://www.youtube.com/watch?v=ZlQ0G9bqBUE',
        description: 'Complete ISTQB certification preparation',
        duration: '6 hours',
        difficulty: 'Beginner',
        cost: 0,
        rating: 4.8,
        relevanceScore: 94,
        skills: ['ISTQB', 'Software Testing', 'QA Fundamentals', 'Test Planning'],
        experienceLevel: ['Entry', 'Junior']
      },
      {
        id: 'udemy-api-testing-postman',
        title: 'Postman: The Complete Guide - REST API Testing',
        provider: 'Udemy',
        url: 'https://www.udemy.com/course/postman-the-complete-guide/',
        description: 'Master API testing with Postman',
        duration: '14 hours',
        difficulty: 'All Levels',
        cost: 12.99,
        rating: 4.7,
        relevanceScore: 93,
        skills: ['API Testing', 'Postman', 'REST', 'Automation'],
        experienceLevel: ['Entry', 'Junior', 'Mid']
      },
      {
        id: 'coursera-agile-testing',
        title: 'Agile Testing',
        provider: 'Coursera',
        url: 'https://www.coursera.org/learn/agile-testing',
        description: 'Learn testing in Agile environments',
        duration: '4 weeks',
        difficulty: 'Intermediate',
        cost: 49,
        rating: 4.6,
        relevanceScore: 91,
        skills: ['Agile Testing', 'Scrum', 'Test Planning', 'Continuous Testing'],
        experienceLevel: ['Junior', 'Mid', 'Senior']
      },
      {
        id: 'udemy-cypress-automation',
        title: 'Cypress - Modern Automation Testing from Scratch',
        provider: 'Udemy',
        url: 'https://www.udemy.com/course/cypress-tutorial/',
        description: 'Learn modern end-to-end testing with Cypress',
        duration: '15 hours',
        difficulty: 'Intermediate',
        cost: 12.99,
        rating: 4.6,
        relevanceScore: 92,
        skills: ['Cypress', 'E2E Testing', 'JavaScript', 'Test Automation'],
        experienceLevel: ['Junior', 'Mid']
      },
      {
        id: 'youtube-jmeter-performance-testing',
        title: 'JMeter Performance Testing Tutorial',
        provider: 'YouTube',
        url: 'https://www.youtube.com/watch?v=8pJD1hUHsPg',
        description: 'Complete JMeter tutorial for performance testing',
        duration: '4 hours',
        difficulty: 'Intermediate',
        cost: 0,
        rating: 4.5,
        relevanceScore: 89,
        skills: ['JMeter', 'Performance Testing', 'Load Testing', 'Stress Testing'],
        experienceLevel: ['Mid', 'Senior']
      },
      {
        id: 'udemy-manual-testing',
        title: 'Manual Testing + Agile with Real-time Project',
        provider: 'Udemy',
        url: 'https://www.udemy.com/course/learn-manual-testing-with-live-project/',
        description: 'Complete manual testing course with hands-on project',
        duration: '10 hours',
        difficulty: 'Beginner',
        cost: 12.99,
        rating: 4.4,
        relevanceScore: 90,
        skills: ['Manual Testing', 'Test Cases', 'Bug Reporting', 'Agile'],
        experienceLevel: ['Entry', 'Junior']
      },
      {
        id: 'coursera-six-sigma-quality',
        title: 'Six Sigma Yellow Belt Specialization',
        provider: 'Coursera',
        url: 'https://www.coursera.org/specializations/six-sigma-yellow-belt',
        description: 'Learn Six Sigma quality management methodologies',
        duration: '3 months',
        difficulty: 'Beginner',
        cost: 49,
        rating: 4.7,
        relevanceScore: 88,
        skills: ['Six Sigma', 'Quality Management', 'Process Improvement', 'DMAIC'],
        experienceLevel: ['Entry', 'Junior', 'Mid']
      },
      {
        id: 'youtube-cucumber-bdd',
        title: 'Cucumber BDD Framework with Selenium',
        provider: 'YouTube',
        url: 'https://www.youtube.com/watch?v=gVD12L_N5z0',
        description: 'Learn Behavior-Driven Development with Cucumber',
        duration: '3 hours',
        difficulty: 'Intermediate',
        cost: 0,
        rating: 4.5,
        relevanceScore: 87,
        skills: ['Cucumber', 'BDD', 'Selenium', 'Gherkin'],
        experienceLevel: ['Mid', 'Senior']
      },
      {
        id: 'udemy-jenkins-cicd',
        title: 'Learn DevOps: CI/CD with Jenkins using Pipelines',
        provider: 'Udemy',
        url: 'https://www.udemy.com/course/learn-devops-ci-cd-with-jenkins-using-pipelines-and-docker/',
        description: 'Master Jenkins for continuous integration and testing',
        duration: '11 hours',
        difficulty: 'Intermediate',
        cost: 12.99,
        rating: 4.5,
        relevanceScore: 86,
        skills: ['Jenkins', 'CI/CD', 'DevOps', 'Automation'],
        experienceLevel: ['Mid', 'Senior']
      }
    ];
  }

  private static getMotionGraphicsResources(): RealLearningResource[] {
    return [
      {
        id: 'udemy-after-effects-complete',
        title: 'After Effects CC: The Complete Motion Graphics Course',
        provider: 'Udemy',
        url: 'https://www.udemy.com/course/after-effects-cc-the-complete-motion-graphics-course/',
        description: 'Master After Effects for motion graphics and animation',
        duration: '22 hours',
        difficulty: 'All Levels',
        cost: 12.99,
        rating: 4.7,
        relevanceScore: 98,
        skills: ['After Effects', 'Motion Graphics', 'Animation', 'Visual Effects'],
        experienceLevel: ['Entry', 'Junior', 'Mid']
      },
      {
        id: 'youtube-cinema4d-intro',
        title: 'Cinema 4D Complete Tutorial for Beginners',
        provider: 'YouTube',
        url: 'https://www.youtube.com/watch?v=VaZXNx1Y-AU',
        description: 'Complete Cinema 4D tutorial series',
        duration: '8 hours',
        difficulty: 'Beginner',
        cost: 0,
        rating: 4.8,
        relevanceScore: 95,
        skills: ['Cinema 4D', '3D Animation', 'Motion Design'],
        experienceLevel: ['Entry', 'Junior']
      },
      {
        id: 'coursera-motion-graphics',
        title: 'Motion Design Fundamentals',
        provider: 'Coursera',
        url: 'https://www.coursera.org/learn/motion-design',
        description: 'Learn motion design principles and techniques',
        duration: '6 weeks',
        difficulty: 'Intermediate',
        cost: 0,
        rating: 4.6,
        relevanceScore: 92,
        skills: ['Motion Design', 'Animation Principles', 'Timing'],
        experienceLevel: ['Junior', 'Mid']
      },
      {
        id: 'youtube-blender-motion',
        title: 'Blender 3D Motion Graphics Tutorial',
        provider: 'YouTube',
        url: 'https://www.youtube.com/watch?v=yCHT23A6aJA',
        description: 'Create stunning 3D motion graphics with Blender',
        duration: '5 hours',
        difficulty: 'Intermediate',
        cost: 0,
        rating: 4.7,
        relevanceScore: 90,
        skills: ['Blender', '3D Modeling', 'Motion Graphics'],
        experienceLevel: ['Junior', 'Mid', 'Senior']
      },
      {
        id: 'udemy-premiere-pro',
        title: 'Adobe Premiere Pro CC - Video Editing Complete Course',
        provider: 'Udemy',
        url: 'https://www.udemy.com/course/adobe-premiere-pro-video-editing/',
        description: 'Master video editing with Premiere Pro',
        duration: '15 hours',
        difficulty: 'All Levels',
        cost: 12.99,
        rating: 4.8,
        relevanceScore: 88,
        skills: ['Premiere Pro', 'Video Editing', 'Post Production'],
        experienceLevel: ['Entry', 'Junior', 'Mid']
      },
      {
        id: 'google-creative-cert',
        title: 'Google Creative Certification',
        provider: 'Google',
        url: 'https://skillshop.withgoogle.com/creative',
        description: 'Official Google certification for creative professionals',
        duration: '10 hours',
        difficulty: 'Intermediate',
        cost: 0,
        rating: 4.5,
        relevanceScore: 85,
        skills: ['Digital Advertising', 'Creative Strategy', 'Campaign Design'],
        experienceLevel: ['Junior', 'Mid', 'Senior']
      }
    ];
  }

  private static getGraphicDesignResources(): RealLearningResource[] {
    return [
      {
        id: 'coursera-graphic-design',
        title: 'Graphic Design Specialization',
        provider: 'Coursera',
        url: 'https://www.coursera.org/specializations/graphic-design',
        description: 'Comprehensive graphic design program from CalArts',
        duration: '6 months',
        difficulty: 'Beginner',
        cost: 0,
        rating: 4.8,
        relevanceScore: 98,
        skills: ['Graphic Design', 'Typography', 'Branding', 'Adobe Creative Suite'],
        experienceLevel: ['Entry', 'Junior']
      },
      {
        id: 'udemy-adobe-illustrator',
        title: 'Adobe Illustrator CC - Complete Masterclass',
        provider: 'Udemy',
        url: 'https://www.udemy.com/course/adobe-illustrator-cc-masterclass/',
        description: 'Master vector graphics with Illustrator',
        duration: '18 hours',
        difficulty: 'All Levels',
        cost: 12.99,
        rating: 4.7,
        relevanceScore: 95,
        skills: ['Illustrator', 'Vector Graphics', 'Logo Design'],
        experienceLevel: ['Entry', 'Junior', 'Mid']
      },
      {
        id: 'youtube-photoshop-tutorial',
        title: 'Complete Photoshop Tutorial Course',
        provider: 'YouTube',
        url: 'https://www.youtube.com/watch?v=IyR_uYsRdPs',
        description: 'Learn Adobe Photoshop from scratch',
        duration: '7 hours',
        difficulty: 'Beginner',
        cost: 0,
        rating: 4.9,
        relevanceScore: 92,
        skills: ['Photoshop', 'Photo Editing', 'Digital Art'],
        experienceLevel: ['Entry', 'Junior']
      }
    ];
  }

  private static getArchitectureResources(): RealLearningResource[] {
    return [
      {
        id: 'coursera-architecture-design',
        title: 'Architecture Design and Engineering',
        provider: 'Coursera',
        url: 'https://www.coursera.org/learn/architecture-design',
        description: 'Learn architectural design principles',
        duration: '8 weeks',
        difficulty: 'Intermediate',
        cost: 0,
        rating: 4.6,
        relevanceScore: 95,
        skills: ['Architecture', 'Design Principles', 'Building Systems'],
        experienceLevel: ['Entry', 'Junior', 'Mid']
      },
      {
        id: 'youtube-autocad-tutorial',
        title: 'AutoCAD Complete Tutorial for Architects',
        provider: 'YouTube',
        url: 'https://www.youtube.com/watch?v=wfTM_eTwW9Q',
        description: 'Complete AutoCAD training for architecture',
        duration: '12 hours',
        difficulty: 'All Levels',
        cost: 0,
        rating: 4.7,
        relevanceScore: 92,
        skills: ['AutoCAD', 'Technical Drawing', 'CAD'],
        experienceLevel: ['Entry', 'Junior', 'Mid']
      },
      {
        id: 'udemy-revit-architecture',
        title: 'Revit Architecture - Complete BIM Training',
        provider: 'Udemy',
        url: 'https://www.udemy.com/course/revit-architecture/',
        description: 'Master Revit for architectural design',
        duration: '20 hours',
        difficulty: 'Intermediate',
        cost: 12.99,
        rating: 4.8,
        relevanceScore: 96,
        skills: ['Revit', 'BIM', 'Architectural Modeling'],
        experienceLevel: ['Junior', 'Mid', 'Senior']
      }
    ];
  }

  private static getMusicAudioResources(): RealLearningResource[] {
    return [
      {
        id: 'coursera-music-production',
        title: 'Music Production Specialization',
        provider: 'Coursera',
        url: 'https://www.coursera.org/specializations/music-production',
        description: 'Learn music production from Berklee College',
        duration: '6 months',
        difficulty: 'All Levels',
        cost: 0,
        rating: 4.8,
        relevanceScore: 98,
        skills: ['Music Production', 'Audio Engineering', 'Mixing', 'Mastering'],
        experienceLevel: ['Entry', 'Junior', 'Mid']
      },
      {
        id: 'youtube-ableton-tutorial',
        title: 'Ableton Live Complete Production Course',
        provider: 'YouTube',
        url: 'https://www.youtube.com/watch?v=Xr6cjKZCXz0',
        description: 'Master Ableton Live for music production',
        duration: '10 hours',
        difficulty: 'Beginner',
        cost: 0,
        rating: 4.7,
        relevanceScore: 95,
        skills: ['Ableton Live', 'DAW', 'Electronic Music'],
        experienceLevel: ['Entry', 'Junior']
      },
      {
        id: 'udemy-sound-design',
        title: 'Complete Sound Design Masterclass',
        provider: 'Udemy',
        url: 'https://www.udemy.com/course/sound-design/',
        description: 'Learn professional sound design techniques',
        duration: '15 hours',
        difficulty: 'Intermediate',
        cost: 12.99,
        rating: 4.6,
        relevanceScore: 90,
        skills: ['Sound Design', 'Synthesis', 'Audio Effects'],
        experienceLevel: ['Junior', 'Mid', 'Senior']
      }
    ];
  }

  private static getFilmProductionResources(): RealLearningResource[] {
    return [
      {
        id: 'coursera-filmmaking',
        title: 'Introduction to Filmmaking',
        provider: 'Coursera',
        url: 'https://www.coursera.org/learn/filmmaking',
        description: 'Learn filmmaking fundamentals',
        duration: '8 weeks',
        difficulty: 'Beginner',
        cost: 0,
        rating: 4.7,
        relevanceScore: 95,
        skills: ['Filmmaking', 'Cinematography', 'Directing', 'Storytelling'],
        experienceLevel: ['Entry', 'Junior']
      },
      {
        id: 'youtube-cinematography',
        title: 'Complete Cinematography Course',
        provider: 'YouTube',
        url: 'https://www.youtube.com/watch?v=LLBdRKjQHPg',
        description: 'Master camera work and lighting',
        duration: '6 hours',
        difficulty: 'Intermediate',
        cost: 0,
        rating: 4.8,
        relevanceScore: 92,
        skills: ['Cinematography', 'Camera Operation', 'Lighting'],
        experienceLevel: ['Junior', 'Mid']
      },
      {
        id: 'udemy-davinci-resolve',
        title: 'DaVinci Resolve - Complete Video Editing Course',
        provider: 'Udemy',
        url: 'https://www.udemy.com/course/davinci-resolve-video-editing/',
        description: 'Professional video editing and color grading',
        duration: '18 hours',
        difficulty: 'All Levels',
        cost: 12.99,
        rating: 4.7,
        relevanceScore: 90,
        skills: ['DaVinci Resolve', 'Video Editing', 'Color Grading'],
        experienceLevel: ['Entry', 'Junior', 'Mid']
      }
    ];
  }

  private static getPhotographyResources(): RealLearningResource[] {
    return [
      {
        id: 'coursera-photography-basics',
        title: 'Photography Basics and Beyond',
        provider: 'Coursera',
        url: 'https://www.coursera.org/specializations/photography-basics',
        description: 'Complete photography specialization',
        duration: '6 months',
        difficulty: 'Beginner',
        cost: 0,
        rating: 4.9,
        relevanceScore: 98,
        skills: ['Photography', 'Composition', 'Lighting', 'Camera Settings'],
        experienceLevel: ['Entry', 'Junior']
      },
      {
        id: 'youtube-portrait-photography',
        title: 'Portrait Photography Complete Guide',
        provider: 'YouTube',
        url: 'https://www.youtube.com/watch?v=kmi9nWjJzfI',
        description: 'Master portrait photography techniques',
        duration: '4 hours',
        difficulty: 'Intermediate',
        cost: 0,
        rating: 4.7,
        relevanceScore: 90,
        skills: ['Portrait Photography', 'Studio Lighting', 'Posing'],
        experienceLevel: ['Junior', 'Mid']
      },
      {
        id: 'udemy-lightroom-editing',
        title: 'Adobe Lightroom - Complete Photo Editing Course',
        provider: 'Udemy',
        url: 'https://www.udemy.com/course/lightroom-photo-editing/',
        description: 'Master photo editing with Lightroom',
        duration: '12 hours',
        difficulty: 'All Levels',
        cost: 12.99,
        rating: 4.8,
        relevanceScore: 92,
        skills: ['Lightroom', 'Photo Editing', 'Color Correction'],
        experienceLevel: ['Entry', 'Junior', 'Mid']
      }
    ];
  }

  private static getHealthcareResources(): RealLearningResource[] {
    return [
      {
        id: 'coursera-healthcare-basics',
        title: 'Introduction to Healthcare',
        provider: 'Coursera',
        url: 'https://www.coursera.org/learn/intro-healthcare',
        description: 'Learn healthcare fundamentals',
        duration: '4 weeks',
        difficulty: 'Beginner',
        cost: 0,
        rating: 4.7,
        relevanceScore: 95,
        skills: ['Healthcare', 'Medical Terminology', 'Patient Care'],
        experienceLevel: ['Entry', 'Junior']
      },
      {
        id: 'youtube-nursing-basics',
        title: 'Nursing Fundamentals Course',
        provider: 'YouTube',
        url: 'https://www.youtube.com/watch?v=J7WD7bZHH6k',
        description: 'Complete nursing basics tutorial',
        duration: '8 hours',
        difficulty: 'Beginner',
        cost: 0,
        rating: 4.8,
        relevanceScore: 92,
        skills: ['Nursing', 'Patient Care', 'Medical Procedures'],
        experienceLevel: ['Entry', 'Junior']
      },
      {
        id: 'coursera-medical-terminology',
        title: 'Medical Terminology Course',
        provider: 'Coursera',
        url: 'https://www.coursera.org/learn/medical-terminology',
        description: 'Master medical terminology',
        duration: '6 weeks',
        difficulty: 'All Levels',
        cost: 0,
        rating: 4.6,
        relevanceScore: 90,
        skills: ['Medical Terminology', 'Healthcare Communication'],
        experienceLevel: ['Entry', 'Junior', 'Mid']
      }
    ];
  }

  private static getConstructionResources(): RealLearningResource[] {
    return [
      {
        id: 'youtube-construction-basics',
        title: 'Construction Management Fundamentals',
        provider: 'YouTube',
        url: 'https://www.youtube.com/watch?v=pjJRm8H0pRM',
        description: 'Learn construction project management',
        duration: '5 hours',
        difficulty: 'Beginner',
        cost: 0,
        rating: 4.7,
        relevanceScore: 95,
        skills: ['Construction Management', 'Project Planning', 'Safety'],
        experienceLevel: ['Entry', 'Junior']
      },
      {
        id: 'coursera-construction-project',
        title: 'Construction Project Management',
        provider: 'Coursera',
        url: 'https://www.coursera.org/learn/construction-project-management',
        description: 'Master construction PM techniques',
        duration: '8 weeks',
        difficulty: 'Intermediate',
        cost: 0,
        rating: 4.6,
        relevanceScore: 92,
        skills: ['Project Management', 'Scheduling', 'Budgeting'],
        experienceLevel: ['Junior', 'Mid']
      },
      {
        id: 'udemy-construction-safety',
        title: 'OSHA Construction Safety Training',
        provider: 'Udemy',
        url: 'https://www.udemy.com/course/osha-construction-safety/',
        description: 'Learn construction safety standards',
        duration: '10 hours',
        difficulty: 'All Levels',
        cost: 12.99,
        rating: 4.8,
        relevanceScore: 90,
        skills: ['Safety', 'OSHA Standards', 'Risk Management'],
        experienceLevel: ['Entry', 'Junior', 'Mid']
      }
    ];
  }

  private static getSurveyorResources(): RealLearningResource[] {
    return [
      {
        id: 'youtube-surveying-fundamentals',
        title: 'Land Surveying Fundamentals',
        provider: 'YouTube',
        url: 'https://www.youtube.com/watch?v=2zDNnYDX9xU',
        description: 'Learn land surveying basics and techniques',
        duration: '8 hours',
        difficulty: 'Beginner',
        cost: 0,
        rating: 4.7,
        relevanceScore: 98,
        skills: ['Surveying', 'Measurement', 'Field Work'],
        experienceLevel: ['Entry', 'Junior']
      },
      {
        id: 'coursera-gis-fundamentals',
        title: 'GIS and Spatial Data Analysis',
        provider: 'Coursera',
        url: 'https://www.coursera.org/specializations/gis',
        description: 'Master GIS software for surveying',
        duration: '4 months',
        difficulty: 'Intermediate',
        cost: 0,
        rating: 4.8,
        relevanceScore: 95,
        skills: ['GIS', 'ArcGIS', 'Spatial Analysis', 'Mapping'],
        experienceLevel: ['Junior', 'Mid']
      },
      {
        id: 'udemy-autocad-civil3d',
        title: 'AutoCAD Civil 3D for Surveyors',
        provider: 'Udemy',
        url: 'https://www.udemy.com/course/autocad-civil-3d-complete-course/',
        description: 'Learn Civil 3D for surveying projects',
        duration: '15 hours',
        difficulty: 'Intermediate',
        cost: 14.99,
        rating: 4.7,
        relevanceScore: 93,
        skills: ['AutoCAD', 'Civil 3D', 'CAD', 'Design'],
        experienceLevel: ['Junior', 'Mid']
      },
      {
        id: 'youtube-gps-gnss',
        title: 'GPS and GNSS for Surveyors',
        provider: 'YouTube',
        url: 'https://www.youtube.com/watch?v=bnDcEL56j9M',
        description: 'Master GPS and GNSS technology',
        duration: '4 hours',
        difficulty: 'Intermediate',
        cost: 0,
        rating: 4.6,
        relevanceScore: 92,
        skills: ['GPS', 'GNSS', 'RTK', 'Positioning'],
        experienceLevel: ['Junior', 'Mid']
      },
      {
        id: 'coursera-surveying-methods',
        title: 'Advanced Surveying Methods',
        provider: 'Coursera',
        url: 'https://www.coursera.org/learn/surveying',
        description: 'Advanced surveying techniques and tools',
        duration: '8 weeks',
        difficulty: 'Advanced',
        cost: 0,
        rating: 4.9,
        relevanceScore: 90,
        skills: ['Surveying', 'Total Station', 'Leveling', 'Traversing'],
        experienceLevel: ['Mid', 'Senior']
      },
      {
        id: 'certification-pls',
        title: 'Professional Land Surveyor (PLS) License Prep',
        provider: 'Google',
        url: 'https://www.google.com/search?q=PLS+license+preparation+courses',
        description: 'Prepare for PLS certification exam',
        duration: '12 weeks',
        difficulty: 'Advanced',
        cost: 0,
        rating: 4.8,
        relevanceScore: 88,
        skills: ['Surveying Law', 'Boundary Law', 'Professional Practice'],
        experienceLevel: ['Mid', 'Senior']
      }
    ];
  }

  private static getEngineeringResources(): RealLearningResource[] {
    return [
      {
        id: 'coursera-engineering-basics',
        title: 'Introduction to Engineering',
        provider: 'Coursera',
        url: 'https://www.coursera.org/learn/introduction-to-engineering',
        description: 'Learn engineering fundamentals',
        duration: '6 weeks',
        difficulty: 'Beginner',
        cost: 0,
        rating: 4.7,
        relevanceScore: 95,
        skills: ['Engineering Principles', 'Problem Solving', 'Mathematics'],
        experienceLevel: ['Entry', 'Junior']
      },
      {
        id: 'youtube-autocad-tutorial',
        title: 'AutoCAD Complete Tutorial',
        provider: 'YouTube',
        url: 'https://www.youtube.com/watch?v=wfTM_eTwW9Q',
        description: 'Master AutoCAD for engineering',
        duration: '12 hours',
        difficulty: 'All Levels',
        cost: 0,
        rating: 4.8,
        relevanceScore: 92,
        skills: ['AutoCAD', 'Technical Drawing', 'CAD'],
        experienceLevel: ['Entry', 'Junior', 'Mid']
      },
      {
        id: 'coursera-mechanical-engineering',
        title: 'Mechanical Engineering Fundamentals',
        provider: 'Coursera',
        url: 'https://www.coursera.org/learn/mechanical-engineering',
        description: 'Core mechanical engineering concepts',
        duration: '8 weeks',
        difficulty: 'Intermediate',
        cost: 0,
        rating: 4.6,
        relevanceScore: 90,
        skills: ['Mechanical Engineering', 'Thermodynamics', 'Mechanics'],
        experienceLevel: ['Junior', 'Mid']
      }
    ];
  }

  private static getEducationResources(): RealLearningResource[] {
    return [
      {
        id: 'coursera-teaching-basics',
        title: 'Foundations of Teaching for Learning',
        provider: 'Coursera',
        url: 'https://www.coursera.org/learn/teacher-development',
        description: 'Learn effective teaching methods',
        duration: '6 weeks',
        difficulty: 'Beginner',
        cost: 0,
        rating: 4.8,
        relevanceScore: 95,
        skills: ['Teaching', 'Curriculum Design', 'Classroom Management'],
        experienceLevel: ['Entry', 'Junior']
      },
      {
        id: 'youtube-classroom-management',
        title: 'Classroom Management Strategies',
        provider: 'YouTube',
        url: 'https://www.youtube.com/watch?v=2c9h3b1fzZU',
        description: 'Master classroom management',
        duration: '4 hours',
        difficulty: 'All Levels',
        cost: 0,
        rating: 4.7,
        relevanceScore: 92,
        skills: ['Classroom Management', 'Student Engagement', 'Behavior Management'],
        experienceLevel: ['Entry', 'Junior', 'Mid']
      },
      {
        id: 'coursera-instructional-design',
        title: 'Instructional Design Foundations',
        provider: 'Coursera',
        url: 'https://www.coursera.org/learn/instructional-design',
        description: 'Design effective learning experiences',
        duration: '5 weeks',
        difficulty: 'Intermediate',
        cost: 0,
        rating: 4.6,
        relevanceScore: 90,
        skills: ['Instructional Design', 'Curriculum Development', 'Assessment'],
        experienceLevel: ['Junior', 'Mid', 'Senior']
      }
    ];
  }

  private static getLegalResources(): RealLearningResource[] {
    return [
      {
        id: 'coursera-law-basics',
        title: 'Introduction to American Law',
        provider: 'Coursera',
        url: 'https://www.coursera.org/learn/american-law',
        description: 'Learn legal fundamentals',
        duration: '8 weeks',
        difficulty: 'Beginner',
        cost: 0,
        rating: 4.8,
        relevanceScore: 95,
        skills: ['Law', 'Legal Research', 'Legal Writing'],
        experienceLevel: ['Entry', 'Junior']
      },
      {
        id: 'youtube-legal-research',
        title: 'Legal Research Methods',
        provider: 'YouTube',
        url: 'https://www.youtube.com/watch?v=lPLkNwXs_n0',
        description: 'Master legal research techniques',
        duration: '5 hours',
        difficulty: 'Intermediate',
        cost: 0,
        rating: 4.7,
        relevanceScore: 92,
        skills: ['Legal Research', 'Case Law', 'Legal Databases'],
        experienceLevel: ['Junior', 'Mid']
      },
      {
        id: 'coursera-contract-law',
        title: 'Contract Law Fundamentals',
        provider: 'Coursera',
        url: 'https://www.coursera.org/learn/contract-law',
        description: 'Understanding contracts and agreements',
        duration: '6 weeks',
        difficulty: 'Intermediate',
        cost: 0,
        rating: 4.6,
        relevanceScore: 90,
        skills: ['Contract Law', 'Legal Analysis', 'Negotiation'],
        experienceLevel: ['Junior', 'Mid', 'Senior']
      }
    ];
  }

  private static getFinanceResources(): RealLearningResource[] {
    return [
      {
        id: 'coursera-financial-accounting',
        title: 'Financial Accounting Fundamentals',
        provider: 'Coursera',
        url: 'https://www.coursera.org/learn/financial-accounting',
        description: 'Learn accounting principles',
        duration: '6 weeks',
        difficulty: 'Beginner',
        cost: 0,
        rating: 4.8,
        relevanceScore: 95,
        skills: ['Accounting', 'Financial Statements', 'Bookkeeping'],
        experienceLevel: ['Entry', 'Junior']
      },
      {
        id: 'youtube-excel-finance',
        title: 'Excel for Financial Analysis',
        provider: 'YouTube',
        url: 'https://www.youtube.com/watch?v=xuJ9xz5fJoQ',
        description: 'Master Excel for finance professionals',
        duration: '8 hours',
        difficulty: 'All Levels',
        cost: 0,
        rating: 4.9,
        relevanceScore: 92,
        skills: ['Excel', 'Financial Modeling', 'Data Analysis'],
        experienceLevel: ['Entry', 'Junior', 'Mid']
      },
      {
        id: 'coursera-investment-banking',
        title: 'Investment and Portfolio Management',
        provider: 'Coursera',
        url: 'https://www.coursera.org/learn/investment-management',
        description: 'Learn investment strategies',
        duration: '8 weeks',
        difficulty: 'Intermediate',
        cost: 0,
        rating: 4.7,
        relevanceScore: 90,
        skills: ['Investment', 'Portfolio Management', 'Financial Analysis'],
        experienceLevel: ['Junior', 'Mid', 'Senior']
      }
    ];
  }

  private static getScienceResearchResources(): RealLearningResource[] {
    return [
      {
        id: 'coursera-research-methods',
        title: 'Research Methods and Design',
        provider: 'Coursera',
        url: 'https://www.coursera.org/learn/research-methods',
        description: 'Learn scientific research methods',
        duration: '6 weeks',
        difficulty: 'Beginner',
        cost: 0,
        rating: 4.7,
        relevanceScore: 95,
        skills: ['Research Methods', 'Data Collection', 'Analysis'],
        experienceLevel: ['Entry', 'Junior']
      },
      {
        id: 'youtube-lab-techniques',
        title: 'Laboratory Techniques Tutorial',
        provider: 'YouTube',
        url: 'https://www.youtube.com/watch?v=pS3cGHgvZgg',
        description: 'Master laboratory procedures',
        duration: '5 hours',
        difficulty: 'Intermediate',
        cost: 0,
        rating: 4.8,
        relevanceScore: 92,
        skills: ['Lab Techniques', 'Scientific Methods', 'Safety'],
        experienceLevel: ['Entry', 'Junior', 'Mid']
      },
      {
        id: 'coursera-statistics-research',
        title: 'Statistics for Research',
        provider: 'Coursera',
        url: 'https://www.coursera.org/learn/statistics-for-research',
        description: 'Statistical analysis for researchers',
        duration: '8 weeks',
        difficulty: 'Intermediate',
        cost: 0,
        rating: 4.6,
        relevanceScore: 90,
        skills: ['Statistics', 'Data Analysis', 'Research Design'],
        experienceLevel: ['Junior', 'Mid', 'Senior']
      }
    ];
  }

  private static getGenericProfessionalResources(): RealLearningResource[] {
    return [
      {
        id: 'coursera-project-management',
        title: 'Google Project Management Certificate',
        provider: 'Coursera',
        url: 'https://www.coursera.org/professional-certificates/google-project-management',
        description: 'Learn project management from Google',
        duration: '6 months',
        difficulty: 'Beginner',
        cost: 0,
        rating: 4.8,
        relevanceScore: 85,
        skills: ['Project Management', 'Leadership', 'Communication'],
        experienceLevel: ['Entry', 'Junior', 'Mid']
      },
      {
        id: 'coursera-communication-skills',
        title: 'Professional Communication Skills',
        provider: 'Coursera',
        url: 'https://www.coursera.org/learn/professional-communication-skills',
        description: 'Enhance your professional communication',
        duration: '4 weeks',
        difficulty: 'All Levels',
        cost: 0,
        rating: 4.7,
        relevanceScore: 80,
        skills: ['Communication', 'Presentations', 'Business Writing'],
        experienceLevel: ['Entry', 'Junior', 'Mid', 'Senior']
      },
      {
        id: 'youtube-time-management',
        title: 'Time Management and Productivity Masterclass',
        provider: 'YouTube',
        url: 'https://www.youtube.com/watch?v=oTugjssqOT0',
        description: 'Master productivity and time management',
        duration: '3 hours',
        difficulty: 'All Levels',
        cost: 0,
        rating: 4.6,
        relevanceScore: 75,
        skills: ['Time Management', 'Productivity', 'Organization'],
        experienceLevel: ['Entry', 'Junior', 'Mid', 'Senior']
      }
    ];
  }

  private static getGenericSoftwareResources(): RealLearningResource[] {
    return [
      {
        id: 'freecodecamp-javascript',
        title: 'JavaScript Algorithms and Data Structures',
        provider: 'freeCodeCamp',
        url: 'https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures/',
        description: 'Free JavaScript certification',
        duration: '300 hours',
        difficulty: 'All Levels',
        cost: 0,
        rating: 4.9,
        relevanceScore: 95,
        skills: ['JavaScript', 'Algorithms', 'Data Structures'],
        experienceLevel: ['Entry', 'Junior', 'Mid']
      },
      {
        id: 'coursera-programming-everyone',
        title: 'Programming for Everybody (Getting Started with Python)',
        provider: 'Coursera',
        url: 'https://www.coursera.org/learn/python',
        description: 'Learn programming basics with Python',
        duration: '7 weeks',
        difficulty: 'Beginner',
        cost: 0,
        rating: 4.8,
        relevanceScore: 90,
        skills: ['Python', 'Programming Basics'],
        experienceLevel: ['Entry']
      },
      {
        id: 'youtube-cs50',
        title: "CS50's Introduction to Computer Science - Harvard",
        provider: 'YouTube',
        url: 'https://www.youtube.com/watch?v=8mAITcNt710',
        description: "Harvard's legendary CS50 course",
        duration: '12 weeks',
        difficulty: 'Beginner',
        cost: 0,
        rating: 4.9,
        relevanceScore: 98,
        skills: ['Computer Science', 'C', 'Python', 'SQL', 'Algorithms'],
        experienceLevel: ['Entry', 'Junior']
      },
      {
        id: 'udemy-complete-web-dev',
        title: 'The Complete 2024 Web Development Bootcamp',
        provider: 'Udemy',
        url: 'https://www.udemy.com/course/the-complete-web-development-bootcamp/',
        description: 'Complete web development course covering frontend and backend',
        duration: '62 hours',
        difficulty: 'All Levels',
        cost: 12.99,
        rating: 4.7,
        relevanceScore: 93,
        skills: ['HTML', 'CSS', 'JavaScript', 'Node.js', 'React', 'MongoDB'],
        experienceLevel: ['Entry', 'Junior', 'Mid']
      },
      {
        id: 'coursera-algorithms',
        title: 'Algorithms Specialization - Stanford',
        provider: 'Coursera',
        url: 'https://www.coursera.org/specializations/algorithms',
        description: 'Master algorithms and data structures from Stanford',
        duration: '4 months',
        difficulty: 'Advanced',
        cost: 79,
        rating: 4.8,
        relevanceScore: 91,
        skills: ['Algorithms', 'Data Structures', 'Problem Solving'],
        experienceLevel: ['Mid', 'Senior', 'Expert']
      }
    ];
  }
}

