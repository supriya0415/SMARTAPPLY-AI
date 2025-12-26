// Simple interface for the page-level LearningResource to avoid conflicts
interface SimpleLearningResource {
  id: string;
  title: string;
  description: string;
  url: string;
  provider: string;
  duration: string;
  cost: number;
  rating: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  type: 'course' | 'tutorial' | 'certification' | 'book' | 'video';
  skills: string[];
  isCompleted?: boolean;
}

export interface CareerResourceTemplate {
  profession: string;
  keywords: string[];
  certifications: string[];
  skills: string[];
  providers: string[];
  specializations: string[];
}

export class CareerResourceGenerator {
  private static careerTemplates: Record<string, CareerResourceTemplate> = {
    nursing: {
      profession: 'Nursing',
      keywords: ['nursing', 'nurse', 'healthcare', 'medical', 'patient care'],
      certifications: ['NCLEX-RN', 'CCRN', 'CEN', 'ACLS', 'BLS', 'PALS'],
      skills: ['Patient Care', 'Medical Assessment', 'Medication Administration', 'Critical Thinking', 'Communication'],
      providers: ['American Nurses Association', 'Coursera', 'Medscape', 'NursingCE', 'ATI Nursing'],
      specializations: ['ICU', 'Emergency', 'Pediatric', 'Oncology', 'Cardiac', 'Mental Health']
    },
    engineering: {
      profession: 'Engineering',
      keywords: ['engineering', 'engineer', 'technical', 'design', 'systems'],
      certifications: ['PE License', 'FE Exam', 'PMP', 'Six Sigma', 'LEED AP'],
      skills: ['Problem Solving', 'Technical Design', 'Project Management', 'CAD', 'Analysis'],
      providers: ['IEEE', 'ASME', 'Coursera', 'edX', 'Udemy'],
      specializations: ['Mechanical', 'Electrical', 'Civil', 'Software', 'Chemical', 'Aerospace']
    },
    marketing: {
      profession: 'Marketing',
      keywords: ['marketing', 'digital marketing', 'advertising', 'brand', 'promotion'],
      certifications: ['Google Ads', 'Facebook Blueprint', 'HubSpot', 'Google Analytics', 'Hootsuite'],
      skills: ['Digital Marketing', 'Content Creation', 'Analytics', 'SEO', 'Social Media'],
      providers: ['Google', 'Facebook', 'HubSpot', 'Coursera', 'Udemy'],
      specializations: ['Digital', 'Content', 'Social Media', 'Email', 'PPC', 'Brand Management']
    },
    business: {
      profession: 'Business',
      keywords: ['business', 'management', 'leadership', 'strategy', 'operations'],
      certifications: ['MBA', 'PMP', 'Six Sigma', 'CPA', 'SHRM'],
      skills: ['Leadership', 'Strategic Planning', 'Financial Analysis', 'Team Management', 'Communication'],
      providers: ['Harvard Business School', 'Wharton', 'Coursera', 'LinkedIn Learning', 'edX'],
      specializations: ['Strategy', 'Operations', 'Finance', 'HR', 'Consulting', 'Entrepreneurship']
    },
    education: {
      profession: 'Education',
      keywords: ['teaching', 'education', 'curriculum', 'pedagogy', 'learning'],
      certifications: ['Teaching License', 'TESOL', 'CELTA', 'Google for Education', 'Microsoft Educator'],
      skills: ['Curriculum Development', 'Classroom Management', 'Assessment', 'Technology Integration', 'Communication'],
      providers: ['Coursera', 'edX', 'Teachers Pay Teachers', 'Khan Academy', 'Google for Education'],
      specializations: ['Elementary', 'Secondary', 'Special Education', 'ESL', 'STEM', 'Online Learning']
    },
    finance: {
      profession: 'Finance',
      keywords: ['finance', 'accounting', 'investment', 'banking', 'financial'],
      certifications: ['CPA', 'CFA', 'FRM', 'CFP', 'CAIA'],
      skills: ['Financial Analysis', 'Risk Management', 'Investment Strategy', 'Accounting', 'Excel'],
      providers: ['CFA Institute', 'Coursera', 'Wharton', 'edX', 'Udemy'],
      specializations: ['Investment Banking', 'Corporate Finance', 'Risk Management', 'Wealth Management', 'Accounting']
    },
    healthcare: {
      profession: 'Healthcare',
      keywords: ['healthcare', 'medical', 'clinical', 'patient', 'health'],
      certifications: ['HIPAA', 'BLS', 'ACLS', 'Medical License', 'Board Certification'],
      skills: ['Patient Care', 'Medical Knowledge', 'Clinical Skills', 'Communication', 'Ethics'],
      providers: ['Medscape', 'Coursera', 'Mayo Clinic', 'Johns Hopkins', 'AMA'],
      specializations: ['Primary Care', 'Surgery', 'Radiology', 'Cardiology', 'Pediatrics', 'Psychiatry']
    },
    technology: {
      profession: 'Technology',
      keywords: ['programming', 'software', 'development', 'coding', 'tech'],
      certifications: ['AWS', 'Google Cloud', 'Microsoft Azure', 'Cisco', 'CompTIA'],
      skills: ['Programming', 'System Design', 'Database Management', 'Cloud Computing', 'DevOps'],
      providers: ['Coursera', 'Udemy', 'Pluralsight', 'freeCodeCamp', 'edX'],
      specializations: ['Frontend', 'Backend', 'Full Stack', 'DevOps', 'Data Science', 'Cybersecurity']
    },
    trades: {
      profession: 'Skilled Trades',
      keywords: ['trades', 'skilled', 'construction', 'electrical', 'plumbing'],
      certifications: ['Journeyman License', 'Master License', 'OSHA 30', 'EPA Certification', 'NATE'],
      skills: ['Technical Skills', 'Safety Protocols', 'Problem Solving', 'Manual Dexterity', 'Blueprint Reading'],
      providers: ['Trade Schools', 'Apprenticeship Programs', 'OSHA', 'Local Unions', 'Coursera'],
      specializations: ['Electrical', 'Plumbing', 'HVAC', 'Carpentry', 'Welding', 'Automotive']
    },
    sales: {
      profession: 'Sales',
      keywords: ['sales', 'selling', 'customer', 'revenue', 'business development'],
      certifications: ['Salesforce', 'HubSpot Sales', 'Google Ads', 'LinkedIn Sales Navigator', 'Challenger Sale'],
      skills: ['Communication', 'Negotiation', 'Customer Relationship', 'Lead Generation', 'Closing'],
      providers: ['Salesforce', 'HubSpot', 'LinkedIn Learning', 'Coursera', 'Udemy'],
      specializations: ['B2B', 'B2C', 'Inside Sales', 'Field Sales', 'Account Management', 'Business Development']
    }
  };

  static detectCareerFromProfile(profile: any): string {
    const careerRole = profile?.careerRecommendations?.[0]?.title || 
                       profile?.careerInterest || 
                       profile?.selectedJobRole || 
                       '';
    
    return this.detectCareerFromText(careerRole);
  }

  static detectCareerFromText(text: string): string {
    const lowerText = text.toLowerCase();
    
    // Check each career template for keyword matches
    for (const [career, template] of Object.entries(this.careerTemplates)) {
      if (template.keywords.some(keyword => lowerText.includes(keyword))) {
        return career;
      }
    }
    
    // Default fallback
    return 'technology';
  }

  static generateCareerSpecificResources(
    career: string, 
    experienceLevel: 'beginner' | 'intermediate' | 'advanced',
    count: number = 15
  ): SimpleLearningResource[] {
    const template = this.careerTemplates[career] || this.careerTemplates.technology;
    const resources: SimpleLearningResource[] = [];
    
    // Generate resources based on experience level
    const levelConfig = this.getLevelConfiguration(experienceLevel);
    
    // Add certification resources
    const certResources = this.generateCertificationResources(template, levelConfig, Math.floor(count * 0.3));
    resources.push(...certResources);
    
    // Add skill-based courses
    const skillResources = this.generateSkillBasedResources(template, levelConfig, Math.floor(count * 0.4));
    resources.push(...skillResources);
    
    // Add specialization resources
    const specResources = this.generateSpecializationResources(template, levelConfig, Math.floor(count * 0.3));
    resources.push(...specResources);
    
    return resources.slice(0, count);
  }

  private static getLevelConfiguration(level: 'beginner' | 'intermediate' | 'advanced') {
    return {
      beginner: {
        focus: 'Fundamentals and basic concepts',
        duration: ['2-4 weeks', '1-2 months', '20-40 hours'],
        difficulty: 'beginner',
        costRange: [0, 99]
      },
      intermediate: {
        focus: 'Advanced concepts and specialization',
        duration: ['1-3 months', '40-80 hours', '6-12 weeks'],
        difficulty: 'intermediate',
        costRange: [0, 199]
      },
      advanced: {
        focus: 'Leadership and cutting-edge practices',
        duration: ['3-6 months', '80-200 hours', '12-24 weeks'],
        difficulty: 'advanced',
        costRange: [0, 299]
      }
    }[level];
  }

  private static generateCertificationResources(
    template: CareerResourceTemplate,
    levelConfig: any,
    count: number
  ): SimpleLearningResource[] {
    return template.certifications.slice(0, count).map((cert, index) => ({
      id: `cert_${template.profession.toLowerCase()}_${index}`,
      title: `${cert} Certification Preparation`,
      description: `Comprehensive preparation course for ${cert} certification. Master the essential skills and knowledge required for ${template.profession.toLowerCase()} professionals.`,
      url: this.generateRealisticUrl(cert, template.providers[0]),
      provider: template.providers[Math.floor(Math.random() * template.providers.length)],
      duration: levelConfig.duration[Math.floor(Math.random() * levelConfig.duration.length)],
      cost: Math.random() > 0.6 ? 0 : Math.floor(Math.random() * (levelConfig.costRange[1] - levelConfig.costRange[0]) + levelConfig.costRange[0]),
      rating: 4.2 + Math.random() * 0.8,
      difficulty: levelConfig.difficulty,
      type: 'certification' as const,
      skills: template.skills.slice(0, 3),
      isCompleted: false
    }));
  }

  private static generateSkillBasedResources(
    template: CareerResourceTemplate,
    levelConfig: any,
    count: number
  ): SimpleLearningResource[] {
    return template.skills.slice(0, count).map((skill, index) => ({
      id: `skill_${template.profession.toLowerCase()}_${index}`,
      title: `Master ${skill} for ${template.profession}`,
      description: `Develop expertise in ${skill} with hands-on projects and real-world applications. Essential for ${template.profession.toLowerCase()} professionals at all levels.`,
      url: this.generateRealisticUrl(skill, template.providers[1] || 'Coursera'),
      provider: template.providers[Math.floor(Math.random() * template.providers.length)],
      duration: levelConfig.duration[Math.floor(Math.random() * levelConfig.duration.length)],
      cost: Math.random() > 0.5 ? 0 : Math.floor(Math.random() * (levelConfig.costRange[1] - levelConfig.costRange[0]) + levelConfig.costRange[0]),
      rating: 4.0 + Math.random() * 1.0,
      difficulty: levelConfig.difficulty,
      type: 'course' as const,
      skills: [skill, ...template.skills.filter(s => s !== skill).slice(0, 2)],
      isCompleted: false
    }));
  }

  private static generateSpecializationResources(
    template: CareerResourceTemplate,
    levelConfig: any,
    count: number
  ): SimpleLearningResource[] {
    return template.specializations.slice(0, count).map((spec, index) => ({
      id: `spec_${template.profession.toLowerCase()}_${index}`,
      title: `${spec} ${template.profession} Specialization`,
      description: `Specialized training in ${spec} for ${template.profession.toLowerCase()} professionals. Learn advanced techniques and industry best practices.`,
      url: this.generateRealisticUrl(`${spec} ${template.profession}`, template.providers[2] || 'edX'),
      provider: template.providers[Math.floor(Math.random() * template.providers.length)],
      duration: levelConfig.duration[Math.floor(Math.random() * levelConfig.duration.length)],
      cost: Math.random() > 0.4 ? 0 : Math.floor(Math.random() * (levelConfig.costRange[1] - levelConfig.costRange[0]) + levelConfig.costRange[0]),
      rating: 4.1 + Math.random() * 0.9,
      difficulty: levelConfig.difficulty,
      type: Math.random() > 0.7 ? 'certification' : 'course' as const,
      skills: template.skills.slice(0, 4),
      isCompleted: false
    }));
  }

  private static generateRealisticUrl(searchTerm: string, provider: string): string {
    const encodedTerm = encodeURIComponent(searchTerm.toLowerCase());
    
    switch (provider.toLowerCase()) {
      case 'coursera':
        return `https://www.coursera.org/search?query=${encodedTerm}`;
      case 'udemy':
        return `https://www.udemy.com/courses/search/?q=${encodedTerm}`;
      case 'edx':
        return `https://www.edx.org/search?q=${encodedTerm}`;
      case 'linkedin learning':
        return `https://www.linkedin.com/learning/search?keywords=${encodedTerm}`;
      case 'pluralsight':
        return `https://www.pluralsight.com/search?q=${encodedTerm}`;
      case 'google':
      case 'google for education':
        return `https://skillshop.exceedlms.com/student/catalog/list?category_ids=53-google-ads`;
      case 'hubspot':
        return `https://academy.hubspot.com/courses`;
      case 'salesforce':
        return `https://trailhead.salesforce.com/`;
      case 'medscape':
        return `https://www.medscape.org/education`;
      case 'american nurses association':
      case 'nursingce':
        return `https://www.nursingworld.org/education-events/`;
      default:
        return `https://www.coursera.org/search?query=${encodedTerm}`;
    }
  }

  static getAllSupportedCareers(): string[] {
    return Object.keys(this.careerTemplates);
  }

  static getCareerTemplate(career: string): CareerResourceTemplate | null {
    return this.careerTemplates[career] || null;
  }
}