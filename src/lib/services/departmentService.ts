export interface Department {
  id: string;
  name: string;
  description: string;
  icon: string;
  subdepartments: Subdepartment[];
}

export interface Subdepartment {
  id: string;
  name: string;
  description: string;
  relatedJobs: RelatedJob[];
}

export interface RelatedJob {
  id: string;
  title: string;
  description: string;
  averageSalary: string;
  growthOutlook: string;
  keySkills: string[];
  educationLevel: string;
  experienceLevel: string;
}

export class DepartmentService {
  /**
   * Get all available departments
   */
  static getDepartments(): Department[] {
    return [
      {
        id: 'technology',
        name: 'Technology',
        description: 'Software, hardware, and digital innovation',
        icon: '',
        subdepartments: [
          {
            id: 'software-development',
            name: 'Software Development',
            description: 'Building applications and systems',
            relatedJobs: [
              {
                id: 'frontend-developer',
                title: 'Frontend Developer',
                description: 'Create user interfaces and web experiences',
                averageSalary: '$70k - $120k',
                growthOutlook: 'High (22% growth)',
                keySkills: ['React', 'JavaScript', 'CSS', 'HTML', 'TypeScript'],
                educationLevel: 'Bachelor\'s or Bootcamp',
                experienceLevel: 'Entry to Senior'
              },
              {
                id: 'backend-developer',
                title: 'Backend Developer',
                description: 'Build server-side logic and databases',
                averageSalary: '$75k - $130k',
                growthOutlook: 'High (22% growth)',
                keySkills: ['Node.js', 'Python', 'Java', 'SQL', 'APIs'],
                educationLevel: 'Bachelor\'s or Bootcamp',
                experienceLevel: 'Entry to Senior'
              },
              {
                id: 'fullstack-developer',
                title: 'Full Stack Developer',
                description: 'Work on both frontend and backend systems',
                averageSalary: '$80k - $140k',
                growthOutlook: 'High (22% growth)',
                keySkills: ['React', 'Node.js', 'Databases', 'DevOps', 'Cloud'],
                educationLevel: 'Bachelor\'s or Bootcamp',
                experienceLevel: 'Mid to Senior'
              }
            ]
          },
          {
            id: 'data-science',
            name: 'Data Science & Analytics',
            description: 'Extract insights from data',
            relatedJobs: [
              {
                id: 'data-scientist',
                title: 'Data Scientist',
                description: 'Analyze data to drive business decisions',
                averageSalary: '$95k - $165k',
                growthOutlook: 'Very High (35% growth)',
                keySkills: ['Python', 'Machine Learning', 'Statistics', 'SQL', 'Visualization'],
                educationLevel: 'Bachelor\'s to Master\'s',
                experienceLevel: 'Entry to Senior'
              },
              {
                id: 'data-analyst',
                title: 'Data Analyst',
                description: 'Interpret data and create reports',
                averageSalary: '$60k - $95k',
                growthOutlook: 'High (25% growth)',
                keySkills: ['Excel', 'SQL', 'Tableau', 'Python', 'Statistics'],
                educationLevel: 'Bachelor\'s',
                experienceLevel: 'Entry to Mid'
              }
            ]
          },
          {
            id: 'cybersecurity',
            name: 'Cybersecurity',
            description: 'Protect systems and data',
            relatedJobs: [
              {
                id: 'security-analyst',
                title: 'Security Analyst',
                description: 'Monitor and protect computer networks',
                averageSalary: '$85k - $125k',
                growthOutlook: 'Very High (33% growth)',
                keySkills: ['Network Security', 'Risk Assessment', 'Incident Response', 'SIEM'],
                educationLevel: 'Bachelor\'s + Certifications',
                experienceLevel: 'Entry to Senior'
              }
            ]
          }
        ]
      },
      {
        id: 'business',
        name: 'Business & Management',
        description: 'Strategy, operations, and leadership',
        icon: '',
        subdepartments: [
          {
            id: 'project-management',
            name: 'Project Management',
            description: 'Plan and execute projects',
            relatedJobs: [
              {
                id: 'project-manager',
                title: 'Project Manager',
                description: 'Lead teams to deliver projects on time and budget',
                averageSalary: '$75k - $120k',
                growthOutlook: 'High (20% growth)',
                keySkills: ['Agile', 'Scrum', 'Leadership', 'Communication', 'Risk Management'],
                educationLevel: 'Bachelor\'s + PMP',
                experienceLevel: 'Mid to Senior'
              }
            ]
          },
          {
            id: 'marketing',
            name: 'Marketing & Sales',
            description: 'Promote products and drive revenue',
            relatedJobs: [
              {
                id: 'digital-marketer',
                title: 'Digital Marketing Specialist',
                description: 'Create and manage online marketing campaigns',
                averageSalary: '$50k - $85k',
                growthOutlook: 'High (18% growth)',
                keySkills: ['SEO', 'Social Media', 'Analytics', 'Content Creation', 'PPC'],
                educationLevel: 'Bachelor\'s',
                experienceLevel: 'Entry to Mid'
              }
            ]
          }
        ]
      },
      {
        id: 'design',
        name: 'Design & Creative',
        description: 'Visual design and user experience',
        icon: '',
        subdepartments: [
          {
            id: 'ux-design',
            name: 'UX/UI Design',
            description: 'Design user experiences and interfaces',
            relatedJobs: [
              {
                id: 'ux-designer',
                title: 'UX Designer',
                description: 'Research and design user experiences',
                averageSalary: '$65k - $110k',
                growthOutlook: 'High (13% growth)',
                keySkills: ['User Research', 'Wireframing', 'Prototyping', 'Figma', 'Usability Testing'],
                educationLevel: 'Bachelor\'s or Portfolio',
                experienceLevel: 'Entry to Senior'
              },
              {
                id: 'ui-designer',
                title: 'UI Designer',
                description: 'Design beautiful and functional interfaces',
                averageSalary: '$60k - $105k',
                growthOutlook: 'High (13% growth)',
                keySkills: ['Visual Design', 'Figma', 'Design Systems', 'Typography', 'Color Theory'],
                educationLevel: 'Bachelor\'s or Portfolio',
                experienceLevel: 'Entry to Senior'
              }
            ]
          }
        ]
      },
      {
        id: 'healthcare',
        name: 'Healthcare',
        description: 'Medical and health services',
        icon: '',
        subdepartments: [
          {
            id: 'nursing',
            name: 'Nursing',
            description: 'Patient care and medical support',
            relatedJobs: [
              {
                id: 'registered-nurse',
                title: 'Registered Nurse',
                description: 'Provide patient care and medical support',
                averageSalary: '$70k - $90k',
                growthOutlook: 'High (15% growth)',
                keySkills: ['Patient Care', 'Medical Knowledge', 'Communication', 'Critical Thinking'],
                educationLevel: 'Nursing Degree + License',
                experienceLevel: 'Entry to Senior'
              }
            ]
          }
        ]
      }
    ];
  }

  /**
   * Get department by ID
   */
  static getDepartmentById(id: string): Department | undefined {
    return this.getDepartments().find(dept => dept.id === id);
  }

  /**
   * Get subdepartment by department and subdepartment ID
   */
  static getSubdepartment(departmentId: string, subdepartmentId: string): Subdepartment | undefined {
    const department = this.getDepartmentById(departmentId);
    return department?.subdepartments.find(sub => sub.id === subdepartmentId);
  }

  /**
   * Search jobs across all departments
   */
  static searchJobs(query: string): RelatedJob[] {
    const departments = this.getDepartments();
    const allJobs: RelatedJob[] = [];
    
    departments.forEach(dept => {
      dept.subdepartments.forEach(sub => {
        allJobs.push(...sub.relatedJobs);
      });
    });

    if (!query.trim()) return allJobs;

    return allJobs.filter(job => 
      job.title.toLowerCase().includes(query.toLowerCase()) ||
      job.description.toLowerCase().includes(query.toLowerCase()) ||
      job.keySkills.some(skill => skill.toLowerCase().includes(query.toLowerCase()))
    );
  }
}