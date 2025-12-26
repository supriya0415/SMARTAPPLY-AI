/**
 * Universal Career & Domain Classification System
 * Comprehensive taxonomy covering 15+ macro-domains with representative roles
 */

export interface CareerRole {
  id: string;
  title: string;
  description: string;
  averageSalary: string;
  growthOutlook: string;
  keySkills: string[];
  educationLevel: string;
  experienceLevel: string;
}

export interface CareerSubdomain {
  id: string;
  name: string;
  description: string;
  roles: CareerRole[];
}

export interface CareerDomain {
  id: string;
  name: string;
  description: string;
  icon: string;
  subdomains: CareerSubdomain[];
}

export const UNIVERSAL_CAREER_TAXONOMY: CareerDomain[] = [
  {
    id: 'technology',
    name: 'Technology & Computer Science',
    description: 'Software, hardware, AI, and digital innovation',
    icon: '💻',
    subdomains: [
      {
        id: 'software-engineering',
        name: 'Software Engineering',
        description: 'Building applications and systems',
        roles: [
          {
            id: 'frontend-developer',
            title: 'Frontend Developer',
            description: 'Create user interfaces and web experiences',
            averageSalary: '$70k - $120k',
            growthOutlook: 'High (22% growth)',
            keySkills: ['React', 'JavaScript', 'CSS', 'HTML', 'TypeScript'],
            educationLevel: "Bachelor's or Bootcamp",
            experienceLevel: 'Entry to Senior'
          },
          {
            id: 'backend-developer',
            title: 'Backend Developer',
            description: 'Build server-side logic and databases',
            averageSalary: '$75k - $130k',
            growthOutlook: 'High (22% growth)',
            keySkills: ['Node.js', 'Python', 'Java', 'SQL', 'APIs'],
            educationLevel: "Bachelor's or Bootcamp",
            experienceLevel: 'Entry to Senior'
          },
          {
            id: 'fullstack-developer',
            title: 'Full Stack Developer',
            description: 'Work on both frontend and backend systems',
            averageSalary: '$80k - $140k',
            growthOutlook: 'High (22% growth)',
            keySkills: ['React', 'Node.js', 'Databases', 'DevOps', 'Cloud'],
            educationLevel: "Bachelor's or Bootcamp",
            experienceLevel: 'Mid to Senior'
          },
          {
            id: 'devops-engineer',
            title: 'DevOps Engineer',
            description: 'Automate and optimize development workflows',
            averageSalary: '$90k - $150k',
            growthOutlook: 'Very High (25% growth)',
            keySkills: ['Docker', 'Kubernetes', 'CI/CD', 'AWS', 'Terraform'],
            educationLevel: "Bachelor's",
            experienceLevel: 'Mid to Senior'
          },
          {
            id: 'cloud-engineer',
            title: 'Cloud Engineer',
            description: 'Design and manage cloud infrastructure',
            averageSalary: '$95k - $160k',
            growthOutlook: 'Very High (30% growth)',
            keySkills: ['AWS', 'Azure', 'GCP', 'Networking', 'Security'],
            educationLevel: "Bachelor's + Certifications",
            experienceLevel: 'Mid to Senior'
          }
        ]
      },
      {
        id: 'ai-ml-data',
        name: 'AI / ML / Data Science',
        description: 'Machine learning, data analysis, and AI systems',
        roles: [
          {
            id: 'ml-engineer',
            title: 'ML Engineer',
            description: 'Build and deploy machine learning models',
            averageSalary: '$100k - $180k',
            growthOutlook: 'Very High (40% growth)',
            keySkills: ['Python', 'TensorFlow', 'PyTorch', 'Deep Learning', 'MLOps'],
            educationLevel: "Bachelor's to Master's",
            experienceLevel: 'Mid to Senior'
          },
          {
            id: 'data-scientist',
            title: 'Data Scientist',
            description: 'Extract insights from data to drive decisions',
            averageSalary: '$95k - $165k',
            growthOutlook: 'Very High (35% growth)',
            keySkills: ['Python', 'Statistics', 'SQL', 'Machine Learning', 'Visualization'],
            educationLevel: "Bachelor's to Master's",
            experienceLevel: 'Entry to Senior'
          },
          {
            id: 'data-analyst',
            title: 'Data Analyst',
            description: 'Interpret data and create actionable reports',
            averageSalary: '$60k - $95k',
            growthOutlook: 'High (25% growth)',
            keySkills: ['Excel', 'SQL', 'Tableau', 'Python', 'Statistics'],
            educationLevel: "Bachelor's",
            experienceLevel: 'Entry to Mid'
          },
          {
            id: 'mlops-engineer',
            title: 'MLOps Engineer',
            description: 'Operationalize and scale ML systems',
            averageSalary: '$105k - $175k',
            growthOutlook: 'Very High (35% growth)',
            keySkills: ['ML Pipelines', 'Docker', 'Kubernetes', 'Python', 'Cloud'],
            educationLevel: "Bachelor's to Master's",
            experienceLevel: 'Mid to Senior'
          }
        ]
      },
      {
        id: 'cybersecurity',
        name: 'Cybersecurity',
        description: 'Protect systems, networks, and data',
        roles: [
          {
            id: 'security-analyst',
            title: 'Security Analyst',
            description: 'Monitor and protect computer networks',
            averageSalary: '$85k - $125k',
            growthOutlook: 'Very High (33% growth)',
            keySkills: ['Network Security', 'Risk Assessment', 'Incident Response', 'SIEM'],
            educationLevel: "Bachelor's + Certifications",
            experienceLevel: 'Entry to Senior'
          },
          {
            id: 'penetration-tester',
            title: 'Penetration Tester',
            description: 'Test systems for security vulnerabilities',
            averageSalary: '$90k - $140k',
            growthOutlook: 'High (30% growth)',
            keySkills: ['Ethical Hacking', 'Network Security', 'Metasploit', 'Linux', 'Scripting'],
            educationLevel: "Bachelor's + Certifications",
            experienceLevel: 'Mid to Senior'
          },
          {
            id: 'ethical-hacker',
            title: 'Ethical Hacker',
            description: 'Find and fix security vulnerabilities',
            averageSalary: '$95k - $150k',
            growthOutlook: 'Very High (35% growth)',
            keySkills: ['Penetration Testing', 'Vulnerability Assessment', 'Security Tools', 'Compliance'],
            educationLevel: "Bachelor's + CEH",
            experienceLevel: 'Mid to Expert'
          }
        ]
      },
      {
        id: 'hardware-iot',
        name: 'Hardware / IoT',
        description: 'Embedded systems, robotics, and IoT devices',
        roles: [
          {
            id: 'embedded-engineer',
            title: 'Embedded Systems Engineer',
            description: 'Design firmware and embedded software',
            averageSalary: '$85k - $135k',
            growthOutlook: 'High (15% growth)',
            keySkills: ['C/C++', 'Microcontrollers', 'RTOS', 'Hardware Debugging'],
            educationLevel: "Bachelor's in Engineering",
            experienceLevel: 'Mid to Senior'
          },
          {
            id: 'robotics-engineer',
            title: 'Robotics Engineer',
            description: 'Build and program robotic systems',
            averageSalary: '$90k - $145k',
            growthOutlook: 'High (20% growth)',
            keySkills: ['Robotics', 'Control Systems', 'ROS', 'Python', 'Computer Vision'],
            educationLevel: "Bachelor's to Master's",
            experienceLevel: 'Mid to Senior'
          },
          {
            id: 'iot-specialist',
            title: 'IoT Specialist',
            description: 'Design connected IoT solutions',
            averageSalary: '$80k - $130k',
            growthOutlook: 'Very High (25% growth)',
            keySkills: ['IoT Protocols', 'Sensors', 'Cloud Integration', 'Security', 'Networking'],
            educationLevel: "Bachelor's",
            experienceLevel: 'Mid to Senior'
          }
        ]
      },
      {
        id: 'blockchain-web3',
        name: 'Blockchain / Web3',
        description: 'Decentralized applications and smart contracts',
        roles: [
          {
            id: 'smart-contract-developer',
            title: 'Smart Contract Developer',
            description: 'Build blockchain-based smart contracts',
            averageSalary: '$100k - $180k',
            growthOutlook: 'Very High (45% growth)',
            keySkills: ['Solidity', 'Ethereum', 'Web3.js', 'Smart Contracts', 'DeFi'],
            educationLevel: "Bachelor's or Self-taught",
            experienceLevel: 'Mid to Senior'
          },
          {
            id: 'blockchain-architect',
            title: 'Blockchain Architect',
            description: 'Design blockchain infrastructure',
            averageSalary: '$120k - $200k',
            growthOutlook: 'Very High (40% growth)',
            keySkills: ['Blockchain Architecture', 'Cryptography', 'Distributed Systems', 'Consensus'],
            educationLevel: "Bachelor's to Master's",
            experienceLevel: 'Senior to Expert'
          }
        ]
      },
      {
        id: 'game-development',
        name: 'Game Development',
        description: 'Video game creation and interactive media',
        roles: [
          {
            id: 'unity-developer',
            title: 'Unity Developer',
            description: 'Create games using Unity engine',
            averageSalary: '$70k - $120k',
            growthOutlook: 'High (16% growth)',
            keySkills: ['Unity', 'C#', 'Game Design', '3D Math', 'Physics'],
            educationLevel: "Bachelor's or Portfolio",
            experienceLevel: 'Entry to Senior'
          },
          {
            id: 'game-designer',
            title: 'Game Designer',
            description: 'Design game mechanics and experiences',
            averageSalary: '$65k - $110k',
            growthOutlook: 'High (14% growth)',
            keySkills: ['Game Design', 'Level Design', 'Prototyping', 'Storytelling'],
            educationLevel: "Bachelor's or Portfolio",
            experienceLevel: 'Entry to Senior'
          },
          {
            id: '3d-artist',
            title: '3D Artist',
            description: 'Create 3D models and assets for games',
            averageSalary: '$60k - $105k',
            growthOutlook: 'High (12% growth)',
            keySkills: ['3D Modeling', 'Blender', 'Maya', 'Texturing', 'Animation'],
            educationLevel: "Bachelor's or Portfolio",
            experienceLevel: 'Entry to Senior'
          }
        ]
      },
      {
        id: 'ar-vr-metaverse',
        name: 'AR / VR / Metaverse',
        description: 'Extended reality and immersive experiences',
        roles: [
          {
            id: 'xr-developer',
            title: 'XR Developer',
            description: 'Build AR/VR experiences',
            averageSalary: '$85k - $145k',
            growthOutlook: 'Very High (30% growth)',
            keySkills: ['Unity', 'Unreal', 'AR/VR SDKs', 'C#', '3D Graphics'],
            educationLevel: "Bachelor's",
            experienceLevel: 'Mid to Senior'
          },
          {
            id: 'metaverse-designer',
            title: 'Metaverse Experience Designer',
            description: 'Design immersive virtual worlds',
            averageSalary: '$80k - $140k',
            growthOutlook: 'Very High (35% growth)',
            keySkills: ['3D Design', 'UX', 'Unity/Unreal', 'Social Platforms', 'Storytelling'],
            educationLevel: "Bachelor's or Portfolio",
            experienceLevel: 'Mid to Senior'
          }
        ]
      }
    ]
  },
  {
    id: 'engineering',
    name: 'Engineering & Manufacturing',
    description: 'Physical systems, production, and industrial engineering',
    icon: '⚙️',
    subdomains: [
      {
        id: 'mechanical',
        name: 'Mechanical Engineering',
        description: 'Design and build mechanical systems',
        roles: [
          {
            id: 'design-engineer',
            title: 'Design Engineer',
            description: 'Design mechanical components and systems',
            averageSalary: '$70k - $110k',
            growthOutlook: 'Moderate (7% growth)',
            keySkills: ['CAD', 'SolidWorks', 'Manufacturing', 'Materials', 'Thermodynamics'],
            educationLevel: "Bachelor's in Engineering",
            experienceLevel: 'Entry to Senior'
          },
          {
            id: 'quality-engineer',
            title: 'Quality Engineer',
            description: 'Ensure product quality and compliance',
            averageSalary: '$65k - $105k',
            growthOutlook: 'Moderate (6% growth)',
            keySkills: ['Quality Assurance', 'Six Sigma', 'ISO Standards', 'Testing', 'Statistics'],
            educationLevel: "Bachelor's in Engineering",
            experienceLevel: 'Entry to Senior'
          },
          {
            id: 'product-developer',
            title: 'Product Developer',
            description: 'Develop new mechanical products',
            averageSalary: '$75k - $120k',
            growthOutlook: 'Moderate (8% growth)',
            keySkills: ['Product Development', 'Prototyping', 'CAD', 'Testing', 'Project Management'],
            educationLevel: "Bachelor's in Engineering",
            experienceLevel: 'Mid to Senior'
          }
        ]
      },
      {
        id: 'electrical-electronics',
        name: 'Electrical / Electronics',
        description: 'Electrical systems and circuit design',
        roles: [
          {
            id: 'circuit-designer',
            title: 'Circuit Designer',
            description: 'Design electronic circuits and PCBs',
            averageSalary: '$75k - $120k',
            growthOutlook: 'Moderate (7% growth)',
            keySkills: ['Circuit Design', 'PCB Layout', 'Altium', 'Electronics', 'Testing'],
            educationLevel: "Bachelor's in EE",
            experienceLevel: 'Mid to Senior'
          },
          {
            id: 'power-engineer',
            title: 'Power Engineer',
            description: 'Design power systems and distribution',
            averageSalary: '$80k - $125k',
            growthOutlook: 'Moderate (6% growth)',
            keySkills: ['Power Systems', 'Electrical Design', 'Transformers', 'Grid Systems'],
            educationLevel: "Bachelor's in EE",
            experienceLevel: 'Mid to Senior'
          }
        ]
      },
      {
        id: 'civil-structural',
        name: 'Civil / Structural',
        description: 'Infrastructure, buildings, and construction',
        roles: [
          {
            id: 'structural-engineer',
            title: 'Structural Engineer',
            description: 'Design safe and stable structures',
            averageSalary: '$70k - $115k',
            growthOutlook: 'Moderate (8% growth)',
            keySkills: ['Structural Analysis', 'AutoCAD', 'Building Codes', 'Concrete', 'Steel'],
            educationLevel: "Bachelor's + PE License",
            experienceLevel: 'Mid to Senior'
          },
          {
            id: 'construction-manager',
            title: 'Construction Manager',
            description: 'Oversee construction projects',
            averageSalary: '$80k - $130k',
            growthOutlook: 'High (11% growth)',
            keySkills: ['Project Management', 'Construction', 'Scheduling', 'Budgeting', 'Safety'],
            educationLevel: "Bachelor's",
            experienceLevel: 'Mid to Senior'
          },
          {
            id: 'surveyor',
            title: 'Surveyor',
            description: 'Measure land and create maps',
            averageSalary: '$55k - $85k',
            growthOutlook: 'Moderate (6% growth)',
            keySkills: ['Surveying', 'GPS', 'CAD', 'GIS', 'Mapping'],
            educationLevel: "Associate's to Bachelor's",
            experienceLevel: 'Entry to Mid'
          }
        ]
      },
      {
        id: 'chemical',
        name: 'Chemical Engineering',
        description: 'Chemical processes and materials',
        roles: [
          {
            id: 'process-engineer',
            title: 'Process Engineer',
            description: 'Optimize chemical manufacturing processes',
            averageSalary: '$75k - $120k',
            growthOutlook: 'Moderate (9% growth)',
            keySkills: ['Chemical Engineering', 'Process Design', 'Safety', 'Optimization'],
            educationLevel: "Bachelor's in ChemE",
            experienceLevel: 'Entry to Senior'
          },
          {
            id: 'materials-scientist',
            title: 'Materials Scientist',
            description: 'Research and develop new materials',
            averageSalary: '$80k - $130k',
            growthOutlook: 'Moderate (7% growth)',
            keySkills: ['Materials Science', 'Research', 'Testing', 'Chemistry', 'Lab Skills'],
            educationLevel: "Bachelor's to PhD",
            experienceLevel: 'Entry to Expert'
          }
        ]
      },
      {
        id: 'industrial',
        name: 'Industrial / Manufacturing',
        description: 'Production systems and automation',
        roles: [
          {
            id: 'production-planner',
            title: 'Production Planner',
            description: 'Plan and schedule manufacturing',
            averageSalary: '$60k - $95k',
            growthOutlook: 'Moderate (5% growth)',
            keySkills: ['Production Planning', 'ERP', 'Lean Manufacturing', 'Supply Chain'],
            educationLevel: "Bachelor's",
            experienceLevel: 'Entry to Mid'
          },
          {
            id: 'plant-engineer',
            title: 'Plant Engineer',
            description: 'Maintain manufacturing facilities',
            averageSalary: '$70k - $110k',
            growthOutlook: 'Moderate (6% growth)',
            keySkills: ['Manufacturing', 'Maintenance', 'Safety', 'Process Improvement'],
            educationLevel: "Bachelor's in Engineering",
            experienceLevel: 'Mid to Senior'
          },
          {
            id: 'automation-specialist',
            title: 'Automation Specialist',
            description: 'Implement industrial automation',
            averageSalary: '$75k - $120k',
            growthOutlook: 'High (12% growth)',
            keySkills: ['PLCs', 'SCADA', 'Robotics', 'Automation', 'Programming'],
            educationLevel: "Bachelor's or Technical",
            experienceLevel: 'Mid to Senior'
          }
        ]
      },
      {
        id: 'aerospace-automotive',
        name: 'Aerospace / Automotive',
        description: 'Aircraft, spacecraft, and vehicle engineering',
        roles: [
          {
            id: 'aeronautical-engineer',
            title: 'Aeronautical Engineer',
            description: 'Design aircraft and aerospace systems',
            averageSalary: '$85k - $140k',
            growthOutlook: 'Moderate (8% growth)',
            keySkills: ['Aerodynamics', 'CAD', 'Flight Systems', 'Materials', 'Testing'],
            educationLevel: "Bachelor's to Master's",
            experienceLevel: 'Mid to Senior'
          },
          {
            id: 'vehicle-design-engineer',
            title: 'Vehicle Design Engineer',
            description: 'Design automotive systems',
            averageSalary: '$75k - $125k',
            growthOutlook: 'Moderate (7% growth)',
            keySkills: ['Automotive Engineering', 'CAD', 'Mechanical Design', 'Testing'],
            educationLevel: "Bachelor's in Engineering",
            experienceLevel: 'Mid to Senior'
          }
        ]
      }
    ]
  },
  {
    id: 'science-research',
    name: 'Science & Research',
    description: 'Scientific research and discovery',
    icon: '🔬',
    subdomains: [
      {
        id: 'physical-sciences',
        name: 'Physical Sciences',
        description: 'Physics, chemistry, and astronomy',
        roles: [
          {
            id: 'physicist',
            title: 'Physicist',
            description: 'Study matter, energy, and the universe',
            averageSalary: '$85k - $155k',
            growthOutlook: 'Moderate (8% growth)',
            keySkills: ['Physics', 'Mathematics', 'Research', 'Lab Skills', 'Programming'],
            educationLevel: "Master's to PhD",
            experienceLevel: 'Entry to Expert'
          },
          {
            id: 'chemist',
            title: 'Chemist',
            description: 'Research chemical compounds and reactions',
            averageSalary: '$65k - $110k',
            growthOutlook: 'Moderate (6% growth)',
            keySkills: ['Chemistry', 'Lab Techniques', 'Analysis', 'Research', 'Safety'],
            educationLevel: "Bachelor's to PhD",
            experienceLevel: 'Entry to Senior'
          },
          {
            id: 'astronomer',
            title: 'Astronomer',
            description: 'Study celestial objects and phenomena',
            averageSalary: '$90k - $160k',
            growthOutlook: 'Low (5% growth)',
            keySkills: ['Astronomy', 'Physics', 'Data Analysis', 'Programming', 'Research'],
            educationLevel: "Master's to PhD",
            experienceLevel: 'Mid to Expert'
          }
        ]
      },
      {
        id: 'life-sciences',
        name: 'Life Sciences',
        description: 'Biology, microbiology, and biotechnology',
        roles: [
          {
            id: 'biologist',
            title: 'Biologist',
            description: 'Study living organisms and ecosystems',
            averageSalary: '$60k - $100k',
            growthOutlook: 'Moderate (5% growth)',
            keySkills: ['Biology', 'Research', 'Lab Skills', 'Data Analysis', 'Field Work'],
            educationLevel: "Bachelor's to PhD",
            experienceLevel: 'Entry to Senior'
          },
          {
            id: 'microbiologist',
            title: 'Microbiologist',
            description: 'Study microorganisms',
            averageSalary: '$65k - $110k',
            growthOutlook: 'Moderate (5% growth)',
            keySkills: ['Microbiology', 'Lab Techniques', 'Research', 'Analysis'],
            educationLevel: "Bachelor's to Master's",
            experienceLevel: 'Entry to Senior'
          },
          {
            id: 'biotechnologist',
            title: 'Biotechnologist',
            description: 'Apply biology to develop products',
            averageSalary: '$70k - $120k',
            growthOutlook: 'High (15% growth)',
            keySkills: ['Biotechnology', 'Genetic Engineering', 'Lab Skills', 'Research'],
            educationLevel: "Bachelor's to Master's",
            experienceLevel: 'Entry to Senior'
          }
        ]
      },
      {
        id: 'environmental',
        name: 'Environmental Science',
        description: 'Ecology, climate, and sustainability',
        roles: [
          {
            id: 'ecologist',
            title: 'Ecologist',
            description: 'Study ecosystems and conservation',
            averageSalary: '$55k - $95k',
            growthOutlook: 'High (11% growth)',
            keySkills: ['Ecology', 'Field Research', 'Data Analysis', 'Conservation', 'GIS'],
            educationLevel: "Bachelor's to Master's",
            experienceLevel: 'Entry to Senior'
          },
          {
            id: 'climate-scientist',
            title: 'Climate Scientist',
            description: 'Research climate patterns and change',
            averageSalary: '$70k - $120k',
            growthOutlook: 'High (13% growth)',
            keySkills: ['Climate Science', 'Data Analysis', 'Modeling', 'Research', 'Statistics'],
            educationLevel: "Master's to PhD",
            experienceLevel: 'Mid to Expert'
          },
          {
            id: 'sustainability-researcher',
            title: 'Sustainability Researcher',
            description: 'Study sustainable practices',
            averageSalary: '$60k - $105k',
            growthOutlook: 'High (12% growth)',
            keySkills: ['Sustainability', 'Research', 'Analysis', 'Policy', 'Systems Thinking'],
            educationLevel: "Bachelor's to Master's",
            experienceLevel: 'Entry to Senior'
          }
        ]
      },
      {
        id: 'mathematics-statistics',
        name: 'Mathematics / Statistics',
        description: 'Mathematical modeling and statistical analysis',
        roles: [
          {
            id: 'statistician',
            title: 'Statistician',
            description: 'Analyze data using statistical methods',
            averageSalary: '$75k - $125k',
            growthOutlook: 'Very High (33% growth)',
            keySkills: ['Statistics', 'R', 'Python', 'Data Analysis', 'Research Design'],
            educationLevel: "Master's",
            experienceLevel: 'Entry to Senior'
          },
          {
            id: 'operations-research-analyst',
            title: 'Operations Research Analyst',
            description: 'Use math to solve complex problems',
            averageSalary: '$70k - $120k',
            growthOutlook: 'Very High (25% growth)',
            keySkills: ['Operations Research', 'Optimization', 'Statistics', 'Programming', 'Modeling'],
            educationLevel: "Bachelor's to Master's",
            experienceLevel: 'Entry to Senior'
          }
        ]
      },
      {
        id: 'research-academia',
        name: 'Research & Academia',
        description: 'Academic research and teaching',
        roles: [
          {
            id: 'research-scientist',
            title: 'Research Scientist',
            description: 'Conduct scientific research',
            averageSalary: '$75k - $130k',
            growthOutlook: 'Moderate (7% growth)',
            keySkills: ['Research', 'Scientific Method', 'Analysis', 'Publishing', 'Lab Skills'],
            educationLevel: "Master's to PhD",
            experienceLevel: 'Mid to Expert'
          },
          {
            id: 'lab-technician',
            title: 'Lab Technician',
            description: 'Support laboratory research',
            averageSalary: '$40k - $65k',
            growthOutlook: 'High (11% growth)',
            keySkills: ['Lab Techniques', 'Equipment Operation', 'Safety', 'Documentation'],
            educationLevel: "Associate's to Bachelor's",
            experienceLevel: 'Entry to Mid'
          },
          {
            id: 'academic-professor',
            title: 'Academic Professor',
            description: 'Teach and conduct research',
            averageSalary: '$70k - $140k',
            growthOutlook: 'Moderate (9% growth)',
            keySkills: ['Teaching', 'Research', 'Subject Expertise', 'Publishing', 'Mentoring'],
            educationLevel: 'PhD',
            experienceLevel: 'Senior to Expert'
          }
        ]
      }
    ]
  },
  {
    id: 'design-creative',
    name: 'Design, Art & Creative Industries',
    description: 'Visual design, art, and creative expression',
    icon: '🎨',
    subdomains: [
      {
        id: 'graphic-visual',
        name: 'Graphic / Visual Design',
        description: 'Visual communication and branding',
        roles: [
          {
            id: 'graphic-designer',
            title: 'Graphic Designer',
            description: 'Create visual content for brands',
            averageSalary: '$45k - $75k',
            growthOutlook: 'Moderate (3% growth)',
            keySkills: ['Adobe Creative Suite', 'Typography', 'Layout', 'Branding', 'Color Theory'],
            educationLevel: "Bachelor's or Portfolio",
            experienceLevel: 'Entry to Senior'
          },
          {
            id: 'illustrator',
            title: 'Illustrator',
            description: 'Create illustrations and artwork',
            averageSalary: '$40k - $70k',
            growthOutlook: 'Moderate (4% growth)',
            keySkills: ['Illustration', 'Drawing', 'Digital Art', 'Adobe Illustrator', 'Creativity'],
            educationLevel: 'Portfolio-based',
            experienceLevel: 'Entry to Senior'
          },
          {
            id: 'brand-designer',
            title: 'Brand Designer',
            description: 'Design brand identities',
            averageSalary: '$55k - $95k',
            growthOutlook: 'Moderate (5% growth)',
            keySkills: ['Branding', 'Identity Design', 'Strategy', 'Adobe Suite', 'Typography'],
            educationLevel: "Bachelor's or Portfolio",
            experienceLevel: 'Mid to Senior'
          }
        ]
      },
      {
        id: 'ui-ux',
        name: 'UI / UX Design',
        description: 'User experience and interface design',
        roles: [
          {
            id: 'product-designer',
            title: 'Product Designer',
            description: 'Design end-to-end product experiences',
            averageSalary: '$75k - $130k',
            growthOutlook: 'High (16% growth)',
            keySkills: ['Product Design', 'UX Research', 'Figma', 'Prototyping', 'User Testing'],
            educationLevel: "Bachelor's or Portfolio",
            experienceLevel: 'Mid to Senior'
          },
          {
            id: 'ux-designer',
            title: 'UX Designer',
            description: 'Research and design user experiences',
            averageSalary: '$65k - $110k',
            growthOutlook: 'High (13% growth)',
            keySkills: ['User Research', 'Wireframing', 'Prototyping', 'Figma', 'Usability Testing'],
            educationLevel: "Bachelor's or Portfolio",
            experienceLevel: 'Entry to Senior'
          },
          {
            id: 'interaction-designer',
            title: 'Interaction Designer',
            description: 'Design interactive experiences',
            averageSalary: '$70k - $120k',
            growthOutlook: 'High (14% growth)',
            keySkills: ['Interaction Design', 'Prototyping', 'Animation', 'UX', 'Design Systems'],
            educationLevel: "Bachelor's or Portfolio",
            experienceLevel: 'Mid to Senior'
          }
        ]
      },
      {
        id: 'industrial-product',
        name: 'Industrial / Product Design',
        description: 'Physical product design',
        roles: [
          {
            id: 'industrial-designer',
            title: 'Industrial Designer',
            description: 'Design consumer products',
            averageSalary: '$60k - $100k',
            growthOutlook: 'Moderate (4% growth)',
            keySkills: ['Product Design', 'CAD', 'Prototyping', 'Manufacturing', 'Sketching'],
            educationLevel: "Bachelor's",
            experienceLevel: 'Entry to Senior'
          },
          {
            id: 'packaging-designer',
            title: 'Packaging Designer',
            description: 'Design product packaging',
            averageSalary: '$45k - $75k',
            growthOutlook: 'Moderate (3% growth)',
            keySkills: ['Packaging Design', 'Adobe Suite', 'Dielines', 'Printing', 'Branding'],
            educationLevel: "Bachelor's or Portfolio",
            experienceLevel: 'Entry to Mid'
          }
        ]
      },
      {
        id: 'fashion',
        name: 'Fashion Design',
        description: 'Clothing and textile design',
        roles: [
          {
            id: 'fashion-designer',
            title: 'Fashion Designer',
            description: 'Design clothing and accessories',
            averageSalary: '$50k - $90k',
            growthOutlook: 'Low (3% growth)',
            keySkills: ['Fashion Design', 'Sketching', 'Textiles', 'Pattern Making', 'Sewing'],
            educationLevel: "Bachelor's or Portfolio",
            experienceLevel: 'Entry to Senior'
          },
          {
            id: 'textile-designer',
            title: 'Textile Designer',
            description: 'Design fabric patterns and textiles',
            averageSalary: '$45k - $75k',
            growthOutlook: 'Low (2% growth)',
            keySkills: ['Textile Design', 'Pattern Design', 'Color Theory', 'Printing'],
            educationLevel: "Bachelor's or Portfolio",
            experienceLevel: 'Entry to Mid'
          },
          {
            id: 'stylist',
            title: 'Stylist',
            description: 'Coordinate fashion and styling',
            averageSalary: '$40k - $80k',
            growthOutlook: 'Moderate (6% growth)',
            keySkills: ['Styling', 'Fashion Trends', 'Color Coordination', 'Photography'],
            educationLevel: 'Portfolio-based',
            experienceLevel: 'Entry to Mid'
          }
        ]
      },
      {
        id: 'interior-architecture',
        name: 'Interior / Architecture',
        description: 'Space and architectural design',
        roles: [
          {
            id: 'interior-designer',
            title: 'Interior Designer',
            description: 'Design interior spaces',
            averageSalary: '$50k - $85k',
            growthOutlook: 'Moderate (5% growth)',
            keySkills: ['Interior Design', 'AutoCAD', 'Space Planning', '3D Rendering', 'Materials'],
            educationLevel: "Bachelor's",
            experienceLevel: 'Entry to Senior'
          },
          {
            id: 'architect',
            title: 'Architect',
            description: 'Design buildings and structures',
            averageSalary: '$70k - $120k',
            growthOutlook: 'Moderate (3% growth)',
            keySkills: ['Architecture', 'AutoCAD', 'Revit', 'Building Codes', 'Design'],
            educationLevel: "Bachelor's + License",
            experienceLevel: 'Mid to Senior'
          },
          {
            id: 'landscape-designer',
            title: 'Landscape Designer',
            description: 'Design outdoor spaces',
            averageSalary: '$45k - $75k',
            growthOutlook: 'High (11% growth)',
            keySkills: ['Landscape Design', 'Horticulture', 'CAD', 'Sustainability', 'Plants'],
            educationLevel: "Bachelor's",
            experienceLevel: 'Entry to Mid'
          }
        ]
      },
      {
        id: 'animation-media',
        name: 'Animation / Media',
        description: 'Motion graphics and animation',
        roles: [
          {
            id: '2d-animator',
            title: '2D Animator',
            description: 'Create 2D animations',
            averageSalary: '$50k - $85k',
            growthOutlook: 'High (10% growth)',
            keySkills: ['2D Animation', 'Adobe After Effects', 'Character Design', 'Storytelling'],
            educationLevel: "Bachelor's or Portfolio",
            experienceLevel: 'Entry to Senior'
          },
          {
            id: '3d-animator',
            title: '3D Animator',
            description: 'Create 3D animations',
            averageSalary: '$55k - $95k',
            growthOutlook: 'High (12% growth)',
            keySkills: ['3D Animation', 'Maya', 'Blender', 'Rigging', 'Character Animation'],
            educationLevel: "Bachelor's or Portfolio",
            experienceLevel: 'Entry to Senior'
          },
          {
            id: 'motion-graphics-artist',
            title: 'Motion Graphics Artist',
            description: 'Design animated graphics',
            averageSalary: '$50k - $90k',
            growthOutlook: 'High (10% growth)',
            keySkills: ['Motion Graphics', 'After Effects', 'Cinema 4D', 'Design', 'Animation'],
            educationLevel: "Bachelor's or Portfolio",
            experienceLevel: 'Entry to Mid'
          }
        ]
      },
      {
        id: 'fine-arts',
        name: 'Fine Arts',
        description: 'Traditional and contemporary art',
        roles: [
          {
            id: 'painter',
            title: 'Painter',
            description: 'Create paintings and visual art',
            averageSalary: '$30k - $70k',
            growthOutlook: 'Moderate (4% growth)',
            keySkills: ['Painting', 'Color Theory', 'Composition', 'Art History', 'Technique'],
            educationLevel: 'Portfolio-based',
            experienceLevel: 'Entry to Expert'
          },
          {
            id: 'sculptor',
            title: 'Sculptor',
            description: 'Create three-dimensional artworks',
            averageSalary: '$35k - $75k',
            growthOutlook: 'Moderate (4% growth)',
            keySkills: ['Sculpting', 'Materials', '3D Form', 'Casting', 'Installation'],
            educationLevel: 'Portfolio-based',
            experienceLevel: 'Entry to Expert'
          },
          {
            id: 'installation-artist',
            title: 'Installation Artist',
            description: 'Create site-specific art installations',
            averageSalary: '$35k - $80k',
            growthOutlook: 'Moderate (5% growth)',
            keySkills: ['Installation Art', 'Concept Development', 'Fabrication', 'Curation'],
            educationLevel: 'Portfolio-based',
            experienceLevel: 'Mid to Expert'
          }
        ]
      }
    ]
  },
  {
    id: 'business-management',
    name: 'Business, Management & Entrepreneurship',
    description: 'Strategy, operations, leadership, and business development',
    icon: '💼',
    subdomains: [
      {
        id: 'business-strategy',
        name: 'Business Strategy',
        description: 'Strategic planning and business operations',
        roles: [
          {
            id: 'consultant',
            title: 'Management Consultant',
            description: 'Advise organizations on strategy',
            averageSalary: '$75k - $140k',
            growthOutlook: 'High (11% growth)',
            keySkills: ['Strategy', 'Analysis', 'Problem Solving', 'Presentations', 'Consulting'],
            educationLevel: "Bachelor's to MBA",
            experienceLevel: 'Mid to Senior'
          },
          {
            id: 'business-analyst',
            title: 'Business Analyst',
            description: 'Analyze business processes and needs',
            averageSalary: '$65k - $105k',
            growthOutlook: 'High (14% growth)',
            keySkills: ['Business Analysis', 'Requirements Gathering', 'SQL', 'Documentation', 'Agile'],
            educationLevel: "Bachelor's",
            experienceLevel: 'Entry to Senior'
          },
          {
            id: 'operations-manager',
            title: 'Operations Manager',
            description: 'Manage business operations',
            averageSalary: '$70k - $120k',
            growthOutlook: 'Moderate (6% growth)',
            keySkills: ['Operations', 'Process Improvement', 'Leadership', 'Project Management'],
            educationLevel: "Bachelor's to MBA",
            experienceLevel: 'Mid to Senior'
          }
        ]
      },
      {
        id: 'marketing-sales',
        name: 'Marketing & Sales',
        description: 'Brand promotion and revenue generation',
        roles: [
          {
            id: 'marketing-manager',
            title: 'Marketing Manager',
            description: 'Lead marketing campaigns and strategy',
            averageSalary: '$70k - $120k',
            growthOutlook: 'High (10% growth)',
            keySkills: ['Marketing Strategy', 'Campaign Management', 'Analytics', 'Leadership', 'Branding'],
            educationLevel: "Bachelor's",
            experienceLevel: 'Mid to Senior'
          },
          {
            id: 'growth-hacker',
            title: 'Growth Hacker',
            description: 'Drive rapid user and revenue growth',
            averageSalary: '$75k - $130k',
            growthOutlook: 'Very High (20% growth)',
            keySkills: ['Growth Marketing', 'Analytics', 'A/B Testing', 'Product', 'Experimentation'],
            educationLevel: "Bachelor's or Self-taught",
            experienceLevel: 'Mid to Senior'
          },
          {
            id: 'brand-strategist',
            title: 'Brand Strategist',
            description: 'Develop brand positioning and strategy',
            averageSalary: '$65k - $115k',
            growthOutlook: 'High (8% growth)',
            keySkills: ['Brand Strategy', 'Marketing', 'Research', 'Creative', 'Positioning'],
            educationLevel: "Bachelor's to MBA",
            experienceLevel: 'Mid to Senior'
          },
          {
            id: 'sales-executive',
            title: 'Sales Executive',
            description: 'Drive sales and client relationships',
            averageSalary: '$50k - $120k',
            growthOutlook: 'Moderate (5% growth)',
            keySkills: ['Sales', 'Negotiation', 'CRM', 'Communication', 'Closing'],
            educationLevel: "Bachelor's",
            experienceLevel: 'Entry to Senior'
          }
        ]
      },
      {
        id: 'product-management',
        name: 'Product Management',
        description: 'Product strategy and development',
        roles: [
          {
            id: 'product-manager',
            title: 'Product Manager',
            description: 'Drive product vision and execution',
            averageSalary: '$90k - $160k',
            growthOutlook: 'Very High (19% growth)',
            keySkills: ['Product Strategy', 'Roadmapping', 'Agile', 'Analytics', 'Leadership'],
            educationLevel: "Bachelor's to MBA",
            experienceLevel: 'Mid to Senior'
          },
          {
            id: 'product-strategist',
            title: 'Product Strategist',
            description: 'Define long-term product strategy',
            averageSalary: '$95k - $170k',
            growthOutlook: 'Very High (20% growth)',
            keySkills: ['Strategy', 'Market Research', 'Product Vision', 'Analytics', 'Innovation'],
            educationLevel: "Bachelor's to MBA",
            experienceLevel: 'Senior to Expert'
          }
        ]
      },
      {
        id: 'entrepreneurship',
        name: 'Entrepreneurship',
        description: 'Building and scaling businesses',
        roles: [
          {
            id: 'startup-founder',
            title: 'Startup Founder',
            description: 'Create and lead new ventures',
            averageSalary: 'Varies widely',
            growthOutlook: 'High',
            keySkills: ['Entrepreneurship', 'Leadership', 'Fundraising', 'Vision', 'Execution'],
            educationLevel: 'Any',
            experienceLevel: 'Entry to Expert'
          },
          {
            id: 'business-development',
            title: 'Business Development Lead',
            description: 'Identify and pursue growth opportunities',
            averageSalary: '$70k - $130k',
            growthOutlook: 'High (10% growth)',
            keySkills: ['Business Development', 'Partnerships', 'Sales', 'Strategy', 'Networking'],
            educationLevel: "Bachelor's to MBA",
            experienceLevel: 'Mid to Senior'
          }
        ]
      },
      {
        id: 'human-resources',
        name: 'Human Resources',
        description: 'Talent management and organizational development',
        roles: [
          {
            id: 'hr-manager',
            title: 'HR Manager',
            description: 'Manage human resources functions',
            averageSalary: '$65k - $110k',
            growthOutlook: 'Moderate (9% growth)',
            keySkills: ['HR Management', 'Recruitment', 'Employee Relations', 'Compliance', 'Leadership'],
            educationLevel: "Bachelor's",
            experienceLevel: 'Mid to Senior'
          },
          {
            id: 'recruiter',
            title: 'Recruiter',
            description: 'Source and hire talent',
            averageSalary: '$50k - $85k',
            growthOutlook: 'Moderate (7% growth)',
            keySkills: ['Recruiting', 'Sourcing', 'Interviewing', 'ATS', 'Networking'],
            educationLevel: "Bachelor's",
            experienceLevel: 'Entry to Mid'
          },
          {
            id: 'talent-partner',
            title: 'Talent Partner',
            description: 'Strategic talent acquisition',
            averageSalary: '$70k - $120k',
            growthOutlook: 'High (10% growth)',
            keySkills: ['Talent Strategy', 'Recruiting', 'Employer Branding', 'Analytics', 'Partnership'],
            educationLevel: "Bachelor's",
            experienceLevel: 'Mid to Senior'
          }
        ]
      },
      {
        id: 'finance-accounting',
        name: 'Finance & Accounting',
        description: 'Financial management and analysis',
        roles: [
          {
            id: 'financial-analyst',
            title: 'Financial Analyst',
            description: 'Analyze financial data and trends',
            averageSalary: '$65k - $105k',
            growthOutlook: 'Moderate (6% growth)',
            keySkills: ['Financial Analysis', 'Excel', 'Modeling', 'Forecasting', 'Reporting'],
            educationLevel: "Bachelor's",
            experienceLevel: 'Entry to Senior'
          },
          {
            id: 'auditor',
            title: 'Auditor',
            description: 'Examine financial records',
            averageSalary: '$60k - $100k',
            growthOutlook: 'Moderate (7% growth)',
            keySkills: ['Auditing', 'Accounting', 'Compliance', 'Analysis', 'Reporting'],
            educationLevel: "Bachelor's + CPA",
            experienceLevel: 'Entry to Senior'
          },
          {
            id: 'investment-banker',
            title: 'Investment Banker',
            description: 'Advise on mergers, acquisitions, and capital',
            averageSalary: '$100k - $200k+',
            growthOutlook: 'Moderate (6% growth)',
            keySkills: ['Finance', 'Valuation', 'M&A', 'Modeling', 'Client Relations'],
            educationLevel: "Bachelor's to MBA",
            experienceLevel: 'Mid to Expert'
          },
          {
            id: 'cfo',
            title: 'Chief Financial Officer (CFO)',
            description: 'Lead financial strategy and operations',
            averageSalary: '$150k - $300k+',
            growthOutlook: 'Moderate (6% growth)',
            keySkills: ['Financial Strategy', 'Leadership', 'Accounting', 'Planning', 'Governance'],
            educationLevel: 'MBA + CPA',
            experienceLevel: 'Expert'
          }
        ]
      },
      {
        id: 'supply-chain-logistics',
        name: 'Supply Chain & Logistics',
        description: 'Supply chain management and logistics',
        roles: [
          {
            id: 'procurement-specialist',
            title: 'Procurement Specialist',
            description: 'Source and purchase materials',
            averageSalary: '$55k - $90k',
            growthOutlook: 'Moderate (5% growth)',
            keySkills: ['Procurement', 'Negotiation', 'Supply Chain', 'Vendor Management', 'ERP'],
            educationLevel: "Bachelor's",
            experienceLevel: 'Entry to Mid'
          },
          {
            id: 'supply-chain-analyst',
            title: 'Supply Chain Analyst',
            description: 'Optimize supply chain operations',
            averageSalary: '$60k - $95k',
            growthOutlook: 'High (11% growth)',
            keySkills: ['Supply Chain', 'Analytics', 'Forecasting', 'Inventory', 'Optimization'],
            educationLevel: "Bachelor's",
            experienceLevel: 'Entry to Mid'
          }
        ]
      }
    ]
  }
,
  {
    id: 'communication-media',
    name: 'Communication, Media & Marketing',
    description: 'Digital content, journalism, advertising, and media',
    icon: '📢',
    subdomains: [
      {
        id: 'digital-marketing',
        name: 'Digital Marketing',
        description: 'Online marketing and growth strategies',
        roles: [
          {
            id: 'seo-specialist',
            title: 'SEO Specialist',
            description: 'Optimize websites for search engines',
            averageSalary: '$50k - $85k',
            growthOutlook: 'High (10% growth)',
            keySkills: ['SEO', 'Google Analytics', 'Keyword Research', 'Content Strategy', 'Link Building'],
            educationLevel: "Bachelor's or Certification",
            experienceLevel: 'Entry to Mid'
          },
          {
            id: 'performance-marketer',
            title: 'Performance Marketer',
            description: 'Drive measurable marketing results',
            averageSalary: '$60k - $100k',
            growthOutlook: 'Very High (15% growth)',
            keySkills: ['PPC', 'Analytics', 'A/B Testing', 'Facebook Ads', 'Google Ads'],
            educationLevel: "Bachelor's",
            experienceLevel: 'Mid to Senior'
          },
          {
            id: 'social-media-manager',
            title: 'Social Media Manager',
            description: 'Manage social media presence',
            averageSalary: '$45k - $75k',
            growthOutlook: 'High (12% growth)',
            keySkills: ['Social Media', 'Content Creation', 'Community Management', 'Analytics', 'Copywriting'],
            educationLevel: "Bachelor's",
            experienceLevel: 'Entry to Mid'
          }
        ]
      },
      {
        id: 'advertising',
        name: 'Advertising',
        description: 'Creative campaigns and media planning',
        roles: [
          {
            id: 'copywriter',
            title: 'Copywriter',
            description: 'Write compelling advertising copy',
            averageSalary: '$45k - $80k',
            growthOutlook: 'Moderate (8% growth)',
            keySkills: ['Copywriting', 'Creativity', 'Storytelling', 'Brand Voice', 'Research'],
            educationLevel: "Bachelor's or Portfolio",
            experienceLevel: 'Entry to Senior'
          },
          {
            id: 'art-director',
            title: 'Art Director',
            description: 'Lead creative visual direction',
            averageSalary: '$70k - $120k',
            growthOutlook: 'Moderate (6% growth)',
            keySkills: ['Art Direction', 'Design', 'Creative Strategy', 'Leadership', 'Adobe Suite'],
            educationLevel: "Bachelor's",
            experienceLevel: 'Senior to Expert'
          },
          {
            id: 'media-planner',
            title: 'Media Planner',
            description: 'Plan advertising media strategy',
            averageSalary: '$50k - $85k',
            growthOutlook: 'Moderate (5% growth)',
            keySkills: ['Media Planning', 'Analytics', 'Budgeting', 'Research', 'Strategy'],
            educationLevel: "Bachelor's",
            experienceLevel: 'Entry to Mid'
          }
        ]
      },
      {
        id: 'pr-communications',
        name: 'PR & Communications',
        description: 'Public relations and corporate communications',
        roles: [
          {
            id: 'pr-officer',
            title: 'Public Relations Officer',
            description: 'Manage public image and media relations',
            averageSalary: '$50k - $90k',
            growthOutlook: 'Moderate (8% growth)',
            keySkills: ['PR', 'Media Relations', 'Crisis Management', 'Writing', 'Strategy'],
            educationLevel: "Bachelor's",
            experienceLevel: 'Entry to Senior'
          },
          {
            id: 'corporate-communicator',
            title: 'Corporate Communicator',
            description: 'Manage internal and external communications',
            averageSalary: '$55k - $95k',
            growthOutlook: 'Moderate (7% growth)',
            keySkills: ['Communications', 'Writing', 'Strategy', 'Employee Engagement', 'Brand'],
            educationLevel: "Bachelor's",
            experienceLevel: 'Mid to Senior'
          }
        ]
      },
      {
        id: 'journalism',
        name: 'Journalism',
        description: 'News reporting and investigative journalism',
        roles: [
          {
            id: 'reporter',
            title: 'Reporter',
            description: 'Research and report news stories',
            averageSalary: '$40k - $70k',
            growthOutlook: 'Low (-3% decline)',
            keySkills: ['Journalism', 'Writing', 'Research', 'Interviewing', 'Ethics'],
            educationLevel: "Bachelor's",
            experienceLevel: 'Entry to Senior'
          },
          {
            id: 'news-anchor',
            title: 'News Anchor',
            description: 'Present news on television',
            averageSalary: '$50k - $120k',
            growthOutlook: 'Low (-2% decline)',
            keySkills: ['Broadcasting', 'Public Speaking', 'Journalism', 'Communication', 'Presence'],
            educationLevel: "Bachelor's",
            experienceLevel: 'Mid to Senior'
          },
          {
            id: 'investigative-journalist',
            title: 'Investigative Journalist',
            description: 'Deep-dive investigative reporting',
            averageSalary: '$45k - $85k',
            growthOutlook: 'Low (-3% decline)',
            keySkills: ['Investigative Journalism', 'Research', 'Ethics', 'Writing', 'Critical Thinking'],
            educationLevel: "Bachelor's to Master's",
            experienceLevel: 'Mid to Expert'
          }
        ]
      },
      {
        id: 'film-tv',
        name: 'Film & TV',
        description: 'Film production and television',
        roles: [
          {
            id: 'director',
            title: 'Director',
            description: 'Direct films and television shows',
            averageSalary: '$60k - $150k+',
            growthOutlook: 'High (24% growth)',
            keySkills: ['Directing', 'Storytelling', 'Vision', 'Leadership', 'Cinematography'],
            educationLevel: "Bachelor's or Portfolio",
            experienceLevel: 'Senior to Expert'
          },
          {
            id: 'screenwriter',
            title: 'Screenwriter',
            description: 'Write scripts for film and TV',
            averageSalary: '$50k - $120k',
            growthOutlook: 'High (24% growth)',
            keySkills: ['Screenwriting', 'Storytelling', 'Dialogue', 'Structure', 'Creativity'],
            educationLevel: "Bachelor's or Portfolio",
            experienceLevel: 'Entry to Expert'
          },
          {
            id: 'cinematographer',
            title: 'Cinematographer',
            description: 'Direct photography for film',
            averageSalary: '$55k - $110k',
            growthOutlook: 'High (24% growth)',
            keySkills: ['Cinematography', 'Lighting', 'Camera Operation', 'Composition', 'Technical'],
            educationLevel: "Bachelor's or Portfolio",
            experienceLevel: 'Mid to Senior'
          },
          {
            id: 'producer',
            title: 'Producer',
            description: 'Oversee film/TV production',
            averageSalary: '$70k - $180k+',
            growthOutlook: 'High (24% growth)',
            keySkills: ['Production', 'Budgeting', 'Management', 'Networking', 'Business'],
            educationLevel: "Bachelor's",
            experienceLevel: 'Senior to Expert'
          }
        ]
      },
      {
        id: 'music-performing',
        name: 'Music & Performing Arts',
        description: 'Music, dance, and performance',
        roles: [
          {
            id: 'composer',
            title: 'Composer',
            description: 'Create original music compositions',
            averageSalary: '$40k - $90k',
            growthOutlook: 'Moderate (5% growth)',
            keySkills: ['Music Composition', 'Theory', 'Orchestration', 'DAW', 'Creativity'],
            educationLevel: "Bachelor's or Portfolio",
            experienceLevel: 'Entry to Expert'
          },
          {
            id: 'singer',
            title: 'Singer',
            description: 'Perform vocal music',
            averageSalary: '$30k - $80k+',
            growthOutlook: 'Moderate (4% growth)',
            keySkills: ['Singing', 'Performance', 'Music Theory', 'Stage Presence', 'Interpretation'],
            educationLevel: 'Conservatory or Self-taught',
            experienceLevel: 'Entry to Expert'
          },
          {
            id: 'dancer',
            title: 'Dancer',
            description: 'Perform choreographed dance',
            averageSalary: '$30k - $70k',
            growthOutlook: 'Moderate (8% growth)',
            keySkills: ['Dance', 'Choreography', 'Performance', 'Technique', 'Fitness'],
            educationLevel: 'Conservatory or Self-taught',
            experienceLevel: 'Entry to Expert'
          },
          {
            id: 'sound-engineer',
            title: 'Sound Engineer',
            description: 'Record and mix audio',
            averageSalary: '$45k - $85k',
            growthOutlook: 'High (11% growth)',
            keySkills: ['Audio Engineering', 'Mixing', 'Recording', 'DAW', 'Acoustics'],
            educationLevel: "Bachelor's or Technical",
            experienceLevel: 'Entry to Senior'
          }
        ]
      }
    ]
  },
  {
    id: 'humanities-social',
    name: 'Humanities & Social Sciences',
    description: 'Study of human culture, society, and behavior',
    icon: '📚',
    subdomains: [
      {
        id: 'history-philosophy',
        name: 'History / Philosophy / Literature',
        description: 'Humanities and liberal arts',
        roles: [
          {
            id: 'historian',
            title: 'Historian',
            description: 'Research and analyze historical events',
            averageSalary: '$50k - $85k',
            growthOutlook: 'Moderate (5% growth)',
            keySkills: ['Research', 'Analysis', 'Writing', 'Archival Work', 'Critical Thinking'],
            educationLevel: "Master's to PhD",
            experienceLevel: 'Mid to Expert'
          },
          {
            id: 'philosopher',
            title: 'Philosopher',
            description: 'Study fundamental questions of existence',
            averageSalary: '$45k - $80k',
            growthOutlook: 'Low (3% growth)',
            keySkills: ['Philosophy', 'Logic', 'Critical Thinking', 'Ethics', 'Writing'],
            educationLevel: 'PhD',
            experienceLevel: 'Expert'
          },
          {
            id: 'literary-critic',
            title: 'Literary Critic',
            description: 'Analyze and critique literature',
            averageSalary: '$40k - $75k',
            growthOutlook: 'Moderate (4% growth)',
            keySkills: ['Literary Analysis', 'Writing', 'Critical Theory', 'Research', 'Publishing'],
            educationLevel: "Master's to PhD",
            experienceLevel: 'Mid to Expert'
          }
        ]
      },
      {
        id: 'psychology-sociology',
        name: 'Psychology / Sociology / Anthropology',
        description: 'Study of human behavior and society',
        roles: [
          {
            id: 'psychologist',
            title: 'Psychologist',
            description: 'Study and treat mental health',
            averageSalary: '$70k - $110k',
            growthOutlook: 'High (14% growth)',
            keySkills: ['Psychology', 'Counseling', 'Research', 'Assessment', 'Empathy'],
            educationLevel: "Master's to PhD + License",
            experienceLevel: 'Mid to Expert'
          },
          {
            id: 'social-researcher',
            title: 'Social Researcher',
            description: 'Conduct social science research',
            averageSalary: '$55k - $90k',
            growthOutlook: 'High (13% growth)',
            keySkills: ['Research Methods', 'Statistics', 'Analysis', 'Survey Design', 'Writing'],
            educationLevel: "Master's",
            experienceLevel: 'Entry to Senior'
          },
          {
            id: 'behavioral-analyst',
            title: 'Behavioral Analyst',
            description: 'Analyze human behavior patterns',
            averageSalary: '$60k - $95k',
            growthOutlook: 'Very High (25% growth)',
            keySkills: ['Behavioral Analysis', 'ABA', 'Data Collection', 'Intervention', 'Ethics'],
            educationLevel: "Master's + Certification",
            experienceLevel: 'Mid to Senior'
          }
        ]
      },
      {
        id: 'political-science',
        name: 'Political Science / International Relations',
        description: 'Study of politics and global affairs',
        roles: [
          {
            id: 'policy-analyst',
            title: 'Policy Analyst',
            description: 'Analyze and develop public policy',
            averageSalary: '$60k - $105k',
            growthOutlook: 'Moderate (6% growth)',
            keySkills: ['Policy Analysis', 'Research', 'Writing', 'Economics', 'Politics'],
            educationLevel: "Master's",
            experienceLevel: 'Entry to Senior'
          },
          {
            id: 'diplomat',
            title: 'Diplomat',
            description: 'Represent country in foreign affairs',
            averageSalary: '$70k - $140k',
            growthOutlook: 'Moderate (4% growth)',
            keySkills: ['Diplomacy', 'Languages', 'Negotiation', 'Politics', 'Cultural Awareness'],
            educationLevel: "Master's",
            experienceLevel: 'Senior to Expert'
          },
          {
            id: 'political-consultant',
            title: 'Political Consultant',
            description: 'Advise political campaigns',
            averageSalary: '$55k - $110k',
            growthOutlook: 'Moderate (6% growth)',
            keySkills: ['Politics', 'Strategy', 'Communications', 'Research', 'Campaigns'],
            educationLevel: "Bachelor's to Master's",
            experienceLevel: 'Mid to Senior'
          }
        ]
      },
      {
        id: 'education-teaching',
        name: 'Education & Teaching',
        description: 'Teaching and educational development',
        roles: [
          {
            id: 'school-teacher',
            title: 'School Teacher',
            description: 'Teach K-12 students',
            averageSalary: '$45k - $70k',
            growthOutlook: 'Moderate (8% growth)',
            keySkills: ['Teaching', 'Curriculum', 'Classroom Management', 'Communication', 'Patience'],
            educationLevel: "Bachelor's + Teaching License",
            experienceLevel: 'Entry to Senior'
          },
          {
            id: 'professor',
            title: 'Professor',
            description: 'Teach and research at university level',
            averageSalary: '$70k - $140k',
            growthOutlook: 'Moderate (9% growth)',
            keySkills: ['Teaching', 'Research', 'Subject Expertise', 'Publishing', 'Mentoring'],
            educationLevel: 'PhD',
            experienceLevel: 'Senior to Expert'
          },
          {
            id: 'curriculum-designer',
            title: 'Curriculum Designer',
            description: 'Design educational curricula',
            averageSalary: '$55k - $90k',
            growthOutlook: 'High (11% growth)',
            keySkills: ['Curriculum Design', 'Instructional Design', 'Education', 'Assessment', 'Technology'],
            educationLevel: "Master's",
            experienceLevel: 'Mid to Senior'
          }
        ]
      },
      {
        id: 'languages',
        name: 'Languages & Linguistics',
        description: 'Language study and translation',
        roles: [
          {
            id: 'translator',
            title: 'Translator',
            description: 'Translate written content between languages',
            averageSalary: '$45k - $75k',
            growthOutlook: 'Moderate (6% growth)',
            keySkills: ['Translation', 'Language Proficiency', 'Cultural Knowledge', 'Writing', 'Research'],
            educationLevel: "Bachelor's",
            experienceLevel: 'Entry to Senior'
          },
          {
            id: 'interpreter',
            title: 'Interpreter',
            description: 'Interpret spoken language',
            averageSalary: '$50k - $85k',
            growthOutlook: 'High (20% growth)',
            keySkills: ['Interpretation', 'Language Fluency', 'Listening', 'Quick Thinking', 'Cultural'],
            educationLevel: "Bachelor's + Certification",
            experienceLevel: 'Entry to Senior'
          },
          {
            id: 'language-teacher',
            title: 'Language Teacher',
            description: 'Teach foreign languages',
            averageSalary: '$40k - $70k',
            growthOutlook: 'Moderate (7% growth)',
            keySkills: ['Teaching', 'Language Expertise', 'Pedagogy', 'Communication', 'Culture'],
            educationLevel: "Bachelor's + Teaching License",
            experienceLevel: 'Entry to Senior'
          }
        ]
      }
    ]
  },
  {
    id: 'law-governance',
    name: 'Law, Governance & Public Policy',
    description: 'Legal practice, government, and public administration',
    icon: '⚖️',
    subdomains: [
      {
        id: 'legal-practice',
        name: 'Legal Practice',
        description: 'Law practice and legal services',
        roles: [
          {
            id: 'lawyer',
            title: 'Lawyer',
            description: 'Practice law and represent clients',
            averageSalary: '$80k - $160k',
            growthOutlook: 'Moderate (10% growth)',
            keySkills: ['Legal Research', 'Litigation', 'Negotiation', 'Writing', 'Analysis'],
            educationLevel: 'JD + Bar License',
            experienceLevel: 'Entry to Expert'
          },
          {
            id: 'legal-analyst',
            title: 'Legal Analyst',
            description: 'Analyze legal issues and research',
            averageSalary: '$55k - $90k',
            growthOutlook: 'Moderate (7% growth)',
            keySkills: ['Legal Research', 'Analysis', 'Writing', 'Databases', 'Critical Thinking'],
            educationLevel: "Bachelor's or JD",
            experienceLevel: 'Entry to Mid'
          },
          {
            id: 'corporate-counsel',
            title: 'Corporate Counsel',
            description: 'Provide legal advice to corporations',
            averageSalary: '$100k - $200k',
            growthOutlook: 'Moderate (10% growth)',
            keySkills: ['Corporate Law', 'Compliance', 'Contracts', 'Negotiation', 'Business'],
            educationLevel: 'JD + Bar License',
            experienceLevel: 'Senior to Expert'
          }
        ]
      },
      {
        id: 'judiciary',
        name: 'Judiciary / Courts',
        description: 'Judicial system and court operations',
        roles: [
          {
            id: 'judge',
            title: 'Judge',
            description: 'Preside over court proceedings',
            averageSalary: '$100k - $200k',
            growthOutlook: 'Moderate (2% growth)',
            keySkills: ['Law', 'Judgment', 'Impartiality', 'Analysis', 'Ethics'],
            educationLevel: 'JD + Extensive Experience',
            experienceLevel: 'Expert'
          },
          {
            id: 'law-clerk',
            title: 'Law Clerk',
            description: 'Assist judges with research',
            averageSalary: '$50k - $80k',
            growthOutlook: 'Moderate (5% growth)',
            keySkills: ['Legal Research', 'Writing', 'Analysis', 'Organization', 'Procedures'],
            educationLevel: 'JD',
            experienceLevel: 'Entry'
          },
          {
            id: 'legal-researcher',
            title: 'Legal Researcher',
            description: 'Conduct legal research',
            averageSalary: '$50k - $85k',
            growthOutlook: 'Moderate (6% growth)',
            keySkills: ['Legal Research', 'Writing', 'Analysis', 'Databases', 'Citations'],
            educationLevel: "Bachelor's or JD",
            experienceLevel: 'Entry to Mid'
          }
        ]
      },
      {
        id: 'public-policy',
        name: 'Public Policy',
        description: 'Policy development and analysis',
        roles: [
          {
            id: 'policy-researcher',
            title: 'Policy Researcher',
            description: 'Research and analyze public policy',
            averageSalary: '$55k - $95k',
            growthOutlook: 'Moderate (7% growth)',
            keySkills: ['Policy Research', 'Analysis', 'Writing', 'Statistics', 'Economics'],
            educationLevel: "Master's",
            experienceLevel: 'Entry to Senior'
          },
          {
            id: 'government-advisor',
            title: 'Government Advisor',
            description: 'Advise government officials',
            averageSalary: '$70k - $130k',
            growthOutlook: 'Moderate (6% growth)',
            keySkills: ['Policy', 'Government', 'Strategy', 'Communication', 'Politics'],
            educationLevel: "Master's",
            experienceLevel: 'Senior to Expert'
          }
        ]
      },
      {
        id: 'civil-services',
        name: 'Civil Services / Administration',
        description: 'Government administration and public service',
        roles: [
          {
            id: 'civil-servant',
            title: 'Civil Servant / IAS Officer',
            description: 'Administer government programs',
            averageSalary: '$50k - $120k',
            growthOutlook: 'Moderate (5% growth)',
            keySkills: ['Administration', 'Leadership', 'Policy', 'Management', 'Public Service'],
            educationLevel: "Bachelor's + Exam",
            experienceLevel: 'Entry to Expert'
          },
          {
            id: 'diplomat-foreign-service',
            title: 'Diplomat / Foreign Service',
            description: 'Represent country abroad',
            averageSalary: '$70k - $140k',
            growthOutlook: 'Moderate (4% growth)',
            keySkills: ['Diplomacy', 'Languages', 'Negotiation', 'Politics', 'Cultural'],
            educationLevel: "Master's + Exam",
            experienceLevel: 'Senior to Expert'
          },
          {
            id: 'municipal-administrator',
            title: 'Municipal Administrator',
            description: 'Manage local government',
            averageSalary: '$55k - $100k',
            growthOutlook: 'Moderate (6% growth)',
            keySkills: ['Public Administration', 'Budgeting', 'Management', 'Communication', 'Policy'],
            educationLevel: "Bachelor's to MPA",
            experienceLevel: 'Mid to Senior'
          }
        ]
      },
      {
        id: 'compliance',
        name: 'Compliance / Ethics',
        description: 'Regulatory compliance and ethics',
        roles: [
          {
            id: 'compliance-officer',
            title: 'Compliance Officer',
            description: 'Ensure regulatory compliance',
            averageSalary: '$65k - $110k',
            growthOutlook: 'High (13% growth)',
            keySkills: ['Compliance', 'Regulations', 'Risk Management', 'Auditing', 'Ethics'],
            educationLevel: "Bachelor's + Certification",
            experienceLevel: 'Mid to Senior'
          },
          {
            id: 'ethics-auditor',
            title: 'Ethics Auditor',
            description: 'Audit ethical practices',
            averageSalary: '$60k - $105k',
            growthOutlook: 'High (12% growth)',
            keySkills: ['Ethics', 'Auditing', 'Compliance', 'Risk Assessment', 'Reporting'],
            educationLevel: "Bachelor's",
            experienceLevel: 'Mid to Senior'
          }
        ]
      }
    ]
  },
  {
    id: 'healthcare-medicine',
    name: 'Healthcare, Medicine & Life Sciences',
    description: 'Medical practice, patient care, and health services',
    icon: '⚕️',
    subdomains: [
      {
        id: 'medicine',
        name: 'Medicine',
        description: 'Medical practice and patient treatment',
        roles: [
          {
            id: 'doctor',
            title: 'Doctor / Physician',
            description: 'Diagnose and treat patients',
            averageSalary: '$150k - $300k+',
            growthOutlook: 'Moderate (4% growth)',
            keySkills: ['Medicine', 'Diagnosis', 'Treatment', 'Patient Care', 'Communication'],
            educationLevel: 'MD + Residency',
            experienceLevel: 'Expert'
          },
          {
            id: 'surgeon',
            title: 'Surgeon',
            description: 'Perform surgical procedures',
            averageSalary: '$200k - $400k+',
            growthOutlook: 'Moderate (3% growth)',
            keySkills: ['Surgery', 'Anatomy', 'Precision', 'Decision Making', 'Stamina'],
            educationLevel: 'MD + Surgical Residency',
            experienceLevel: 'Expert'
          },
          {
            id: 'general-practitioner',
            title: 'General Practitioner',
            description: 'Provide primary care',
            averageSalary: '$120k - $220k',
            growthOutlook: 'High (11% growth)',
            keySkills: ['Primary Care', 'Diagnosis', 'Patient Relations', 'Preventive Care', 'Coordination'],
            educationLevel: 'MD + Residency',
            experienceLevel: 'Senior to Expert'
          }
        ]
      },
      {
        id: 'nursing',
        name: 'Nursing / Paramedics',
        description: 'Nursing care and emergency medical services',
        roles: [
          {
            id: 'registered-nurse',
            title: 'Registered Nurse',
            description: 'Provide patient care and support',
            averageSalary: '$65k - $95k',
            growthOutlook: 'High (15% growth)',
            keySkills: ['Nursing', 'Patient Care', 'Medical Procedures', 'Communication', 'Empathy'],
            educationLevel: 'BSN + License',
            experienceLevel: 'Entry to Senior'
          },
          {
            id: 'emt-paramedic',
            title: 'EMT / Paramedic',
            description: 'Provide emergency medical care',
            averageSalary: '$35k - $55k',
            growthOutlook: 'High (11% growth)',
            keySkills: ['Emergency Medicine', 'First Aid', 'CPR', 'Quick Thinking', 'Composure'],
            educationLevel: 'Certification',
            experienceLevel: 'Entry to Mid'
          },
          {
            id: 'lab-technician-med',
            title: 'Medical Lab Technician',
            description: 'Conduct medical laboratory tests',
            averageSalary: '$45k - $65k',
            growthOutlook: 'High (11% growth)',
            keySkills: ['Lab Techniques', 'Testing', 'Analysis', 'Equipment', 'Accuracy'],
            educationLevel: "Associate's + Certification",
            experienceLevel: 'Entry to Mid'
          }
        ]
      },
      {
        id: 'pharmacy',
        name: 'Pharmacy',
        description: 'Pharmaceutical care and drug management',
        roles: [
          {
            id: 'pharmacist',
            title: 'Pharmacist',
            description: 'Dispense medications and advise patients',
            averageSalary: '$110k - $150k',
            growthOutlook: 'Low (2% growth)',
            keySkills: ['Pharmacology', 'Patient Counseling', 'Drug Interactions', 'Accuracy', 'Communication'],
            educationLevel: 'PharmD + License',
            experienceLevel: 'Entry to Senior'
          },
          {
            id: 'pharmaceutical-scientist',
            title: 'Pharmaceutical Scientist',
            description: 'Research and develop drugs',
            averageSalary: '$85k - $140k',
            growthOutlook: 'Moderate (6% growth)',
            keySkills: ['Pharmaceutical Science', 'Research', 'Chemistry', 'Clinical Trials', 'Analysis'],
            educationLevel: 'PharmD or PhD',
            experienceLevel: 'Mid to Expert'
          }
        ]
      },
      {
        id: 'public-health',
        name: 'Public Health',
        description: 'Population health and disease prevention',
        roles: [
          {
            id: 'epidemiologist',
            title: 'Epidemiologist',
            description: 'Study disease patterns and prevention',
            averageSalary: '$70k - $120k',
            growthOutlook: 'Very High (30% growth)',
            keySkills: ['Epidemiology', 'Statistics', 'Research', 'Data Analysis', 'Public Health'],
            educationLevel: "Master's to PhD",
            experienceLevel: 'Mid to Expert'
          },
          {
            id: 'health-policy-expert',
            title: 'Health Policy Expert',
            description: 'Develop health policies',
            averageSalary: '$75k - $130k',
            growthOutlook: 'High (14% growth)',
            keySkills: ['Health Policy', 'Research', 'Analysis', 'Advocacy', 'Government'],
            educationLevel: "Master's",
            experienceLevel: 'Mid to Senior'
          }
        ]
      },
      {
        id: 'mental-health',
        name: 'Mental Health',
        description: 'Mental health care and counseling',
        roles: [
          {
            id: 'psychologist-clinical',
            title: 'Clinical Psychologist',
            description: 'Diagnose and treat mental health',
            averageSalary: '$75k - $120k',
            growthOutlook: 'High (14% growth)',
            keySkills: ['Psychology', 'Therapy', 'Assessment', 'Empathy', 'Communication'],
            educationLevel: 'PhD or PsyD + License',
            experienceLevel: 'Mid to Expert'
          },
          {
            id: 'therapist',
            title: 'Therapist',
            description: 'Provide therapy and counseling',
            averageSalary: '$50k - $85k',
            growthOutlook: 'Very High (23% growth)',
            keySkills: ['Therapy', 'Counseling', 'Empathy', 'Communication', 'Treatment Planning'],
            educationLevel: "Master's + License",
            experienceLevel: 'Entry to Senior'
          },
          {
            id: 'counselor',
            title: 'Counselor',
            description: 'Provide guidance and support',
            averageSalary: '$45k - $70k',
            growthOutlook: 'Very High (23% growth)',
            keySkills: ['Counseling', 'Active Listening', 'Empathy', 'Guidance', 'Ethics'],
            educationLevel: "Master's + License",
            experienceLevel: 'Entry to Senior'
          }
        ]
      },
      {
        id: 'biomedical-engineering',
        name: 'Biomedical Engineering',
        description: 'Medical devices and clinical engineering',
        roles: [
          {
            id: 'medical-device-engineer',
            title: 'Medical Device Engineer',
            description: 'Design medical devices',
            averageSalary: '$75k - $125k',
            growthOutlook: 'High (10% growth)',
            keySkills: ['Biomedical Engineering', 'Design', 'Regulations', 'Testing', 'CAD'],
            educationLevel: "Bachelor's to Master's",
            experienceLevel: 'Mid to Senior'
          },
          {
            id: 'clinical-engineer',
            title: 'Clinical Engineer',
            description: 'Maintain medical equipment',
            averageSalary: '$70k - $110k',
            growthOutlook: 'High (9% growth)',
            keySkills: ['Medical Equipment', 'Troubleshooting', 'Safety', 'Regulations', 'Technical'],
            educationLevel: "Bachelor's",
            experienceLevel: 'Entry to Senior'
          }
        ]
      }
    ]
  }
];

/**
 * Search utility functions
 */
export class UniversalCareerSearch {
  /**
   * Get all domains
   */
  static getAllDomains(): CareerDomain[] {
    return UNIVERSAL_CAREER_TAXONOMY;
  }

  /**
   * Search roles across all domains
   */
  static searchRoles(query: string): CareerRole[] {
    const searchTerm = query.toLowerCase().trim();
    if (!searchTerm) return [];

    const results: CareerRole[] = [];
    
    UNIVERSAL_CAREER_TAXONOMY.forEach(domain => {
      domain.subdomains.forEach(subdomain => {
        subdomain.roles.forEach(role => {
          if (
            role.title.toLowerCase().includes(searchTerm) ||
            role.description.toLowerCase().includes(searchTerm) ||
            role.keySkills.some(skill => skill.toLowerCase().includes(searchTerm)) ||
            subdomain.name.toLowerCase().includes(searchTerm) ||
            domain.name.toLowerCase().includes(searchTerm)
          ) {
            results.push(role);
          }
        });
      });
    });

    return results;
  }

  /**
   * Get domain by ID
   */
  static getDomainById(id: string): CareerDomain | undefined {
    return UNIVERSAL_CAREER_TAXONOMY.find(domain => domain.id === id);
  }

  /**
   * Get subdomain
   */
  static getSubdomain(domainId: string, subdomainId: string): CareerSubdomain | undefined {
    const domain = this.getDomainById(domainId);
    return domain?.subdomains.find(sub => sub.id === subdomainId);
  }

  /**
   * Get role
   */
  static getRole(domainId: string, subdomainId: string, roleId: string): CareerRole | undefined {
    const subdomain = this.getSubdomain(domainId, subdomainId);
    return subdomain?.roles.find(role => role.id === roleId);
  }

  /**
   * Get all roles count
   */
  static getTotalRolesCount(): number {
    return UNIVERSAL_CAREER_TAXONOMY.reduce((total, domain) => {
      return total + domain.subdomains.reduce((domainTotal, subdomain) => {
        return domainTotal + subdomain.roles.length;
      }, 0);
    }, 0);
  }

  /**
   * Get roles by experience level
   */
  static getRolesByExperience(experienceLevel: string): CareerRole[] {
    const results: CareerRole[] = [];
    
    UNIVERSAL_CAREER_TAXONOMY.forEach(domain => {
      domain.subdomains.forEach(subdomain => {
        subdomain.roles.forEach(role => {
          if (role.experienceLevel.toLowerCase().includes(experienceLevel.toLowerCase())) {
            results.push(role);
          }
        });
      });
    });

    return results;
  }
}

