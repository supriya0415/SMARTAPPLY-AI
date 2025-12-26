/**
 * Jake's Resume Template Generator
 * Based on: https://github.com/jakegut/resume
 * License: MIT
 */

export interface ResumeData {
  name: string;
  email: string;
  phone: string;
  linkedin?: string;
  github?: string;
  website?: string;
  
  education: EducationEntry[];
  experience: ExperienceEntry[];
  projects?: ProjectEntry[];
  skills: SkillsSection;
}

export interface EducationEntry {
  institution: string;
  location: string;
  degree: string;
  dates: string;
  gpa?: string;
}

export interface ExperienceEntry {
  position: string;
  company: string;
  location: string;
  dates: string;
  bullets: string[];
}

export interface ProjectEntry {
  name: string;
  technologies: string;
  dates: string;
  bullets: string[];
}

export interface SkillsSection {
  languages?: string[];
  frameworks?: string[];
  tools?: string[];
  libraries?: string[];
}

export class JakeResumeTemplate {
  /**
   * Generate LaTeX code for Jake's resume template
   */
  static generateLaTeX(data: ResumeData): string {
    const latex = `%-------------------------
% Resume in Latex
% Author : Jake Gutierrez
% Based off of: https://github.com/sb2nov/resume
% License : MIT
%------------------------

\\documentclass[letterpaper,11pt]{article}

\\usepackage{latexsym}
\\usepackage[empty]{fullpage}
\\usepackage{titlesec}
\\usepackage{marvosym}
\\usepackage[usenames,dvipsnames]{color}
\\usepackage{verbatim}
\\usepackage{enumitem}
\\usepackage[hidelinks]{hyperref}
\\usepackage{fancyhdr}
\\usepackage[english]{babel}
\\usepackage{tabularx}
\\input{glyphtounicode}

\\pagestyle{fancy}
\\fancyhf{} % clear all header and footer fields
\\fancyfoot{}
\\renewcommand{\\headrulewidth}{0pt}
\\renewcommand{\\footrulewidth}{0pt}

% Adjust margins
\\addtolength{\\oddsidemargin}{-0.5in}
\\addtolength{\\evensidemargin}{-0.5in}
\\addtolength{\\textwidth}{1in}
\\addtolength{\\topmargin}{-.5in}
\\addtolength{\\textheight}{1.0in}

\\urlstyle{same}

\\raggedbottom
\\raggedright
\\setlength{\\tabcolsep}{0in}

% Sections formatting
\\titleformat{\\section}{
  \\vspace{-4pt}\\scshape\\raggedright\\large
}{}{0em}{}[\\color{black}\\titlerule \\vspace{-5pt}]

% Ensure that generate pdf is machine readable/ATS parsable
\\pdfgentounicode=1

%-------------------------
% Custom commands
\\newcommand{\\resumeItem}[1]{
  \\item\\small{
    {#1 \\vspace{-2pt}}
  }
}

\\newcommand{\\resumeSubheading}[4]{
  \\vspace{-2pt}\\item
    \\begin{tabular*}{0.97\\textwidth}[t]{l@{\\extracolsep{\\fill}}r}
      \\textbf{#1} & #2 \\\\
      \\textit{\\small#3} & \\textit{\\small #4} \\\\
    \\end{tabular*}\\vspace{-7pt}
}

\\newcommand{\\resumeSubSubheading}[2]{
    \\item
    \\begin{tabular*}{0.97\\textwidth}{l@{\\extracolsep{\\fill}}r}
      \\textit{\\small#1} & \\textit{\\small #2} \\\\
    \\end{tabular*}\\vspace{-7pt}
}

\\newcommand{\\resumeProjectHeading}[2]{
    \\item
    \\begin{tabular*}{0.97\\textwidth}{l@{\\extracolsep{\\fill}}r}
      \\small#1 & #2 \\\\
    \\end{tabular*}\\vspace{-7pt}
}

\\newcommand{\\resumeSubItem}[1]{\\resumeItem{#1}\\vspace{-4pt}}

\\renewcommand\\labelitemii{$\\vcenter{\\hbox{\\tiny$\\bullet$}}$}

\\newcommand{\\resumeSubHeadingListStart}{\\begin{itemize}[leftmargin=0.15in, label={}]}
\\newcommand{\\resumeSubHeadingListEnd}{\\end{itemize}}
\\newcommand{\\resumeItemListStart}{\\begin{itemize}}
\\newcommand{\\resumeItemListEnd}{\\end{itemize}\\vspace{-5pt}}

%-------------------------------------------
%%%%%%  RESUME STARTS HERE  %%%%%%%%%%%%%%%%%%%%%%%%%%%%

\\begin{document}

%----------HEADING----------
\\begin{center}
    \\textbf{\\Huge \\scshape ${this.escapeLatex(data.name)}} \\\\ \\vspace{1pt}
    \\small ${this.escapeLatex(data.phone)} $|$ \\href{mailto:${data.email}}{\\underline{${this.escapeLatex(data.email)}}}${data.linkedin ? ` $|$ \\href{${data.linkedin}}{\\underline{linkedin.com/in/${this.extractUsername(data.linkedin)}}}` : ''}${data.github ? ` $|$ \\href{${data.github}}{\\underline{github.com/${this.extractUsername(data.github)}}}` : ''}
\\end{center}

${this.generateEducationSection(data.education)}

${this.generateExperienceSection(data.experience)}

${data.projects && data.projects.length > 0 ? this.generateProjectsSection(data.projects) : ''}

${this.generateSkillsSection(data.skills)}

%-------------------------------------------
\\end{document}
`;
    return latex;
  }

  private static generateEducationSection(education: EducationEntry[]): string {
    if (!education || education.length === 0) return '';
    
    let section = `%-----------EDUCATION-----------
\\section{Education}
  \\resumeSubHeadingListStart\n`;
    
    education.forEach(edu => {
      section += `    \\resumeSubheading
      {${this.escapeLatex(edu.institution)}}{${this.escapeLatex(edu.location)}}
      {${this.escapeLatex(edu.degree)}}{${this.escapeLatex(edu.dates)}}\n`;
    });
    
    section += `  \\resumeSubHeadingListEnd\n\n`;
    return section;
  }

  private static generateExperienceSection(experience: ExperienceEntry[]): string {
    if (!experience || experience.length === 0) return '';
    
    let section = `%-----------EXPERIENCE-----------
\\section{Experience}
  \\resumeSubHeadingListStart\n\n`;
    
    experience.forEach(exp => {
      section += `    \\resumeSubheading
      {${this.escapeLatex(exp.position)}}{${this.escapeLatex(exp.dates)}}
      {${this.escapeLatex(exp.company)}}{${this.escapeLatex(exp.location)}}
      \\resumeItemListStart\n`;
      
      exp.bullets.forEach(bullet => {
        section += `        \\resumeItem{${this.escapeLatex(bullet)}}\n`;
      });
      
      section += `      \\resumeItemListEnd\n\n`;
    });
    
    section += `  \\resumeSubHeadingListEnd\n\n`;
    return section;
  }

  private static generateProjectsSection(projects: ProjectEntry[]): string {
    if (!projects || projects.length === 0) return '';
    
    let section = `%-----------PROJECTS-----------
\\section{Projects}
    \\resumeSubHeadingListStart\n`;
    
    projects.forEach(project => {
      section += `      \\resumeProjectHeading
          {\\textbf{${this.escapeLatex(project.name)}} $|$ \\emph{${this.escapeLatex(project.technologies)}}}{${this.escapeLatex(project.dates)}}
          \\resumeItemListStart\n`;
      
      project.bullets.forEach(bullet => {
        section += `            \\resumeItem{${this.escapeLatex(bullet)}}\n`;
      });
      
      section += `          \\resumeItemListEnd\n`;
    });
    
    section += `    \\resumeSubHeadingListEnd\n\n`;
    return section;
  }

  private static generateSkillsSection(skills: SkillsSection): string {
    let section = `%-----------PROGRAMMING SKILLS-----------
\\section{Technical Skills}
 \\begin{itemize}[leftmargin=0.15in, label={}]
    \\small{\\item{\n`;
    
    if (skills.languages && skills.languages.length > 0) {
      section += `     \\textbf{Languages}{: ${skills.languages.join(', ')}} \\\\\n`;
    }
    if (skills.frameworks && skills.frameworks.length > 0) {
      section += `     \\textbf{Frameworks}{: ${skills.frameworks.join(', ')}} \\\\\n`;
    }
    if (skills.tools && skills.tools.length > 0) {
      section += `     \\textbf{Developer Tools}{: ${skills.tools.join(', ')}} \\\\\n`;
    }
    if (skills.libraries && skills.libraries.length > 0) {
      section += `     \\textbf{Libraries}{: ${skills.libraries.join(', ')}}\n`;
    }
    
    section += `    }}
 \\end{itemize}\n\n`;
    return section;
  }

  /**
   * Escape special LaTeX characters
   */
  private static escapeLatex(text: string): string {
    if (!text) return '';
    return text
      .replace(/\\/g, '\\textbackslash{}')
      .replace(/&/g, '\\&')
      .replace(/%/g, '\\%')
      .replace(/\$/g, '\\$')
      .replace(/#/g, '\\#')
      .replace(/_/g, '\\_')
      .replace(/\{/g, '\\{')
      .replace(/\}/g, '\\}')
      .replace(/~/g, '\\textasciitilde{}')
      .replace(/\^/g, '\\textasciicircum{}');
  }

  /**
   * Extract username from URL
   */
  private static extractUsername(url: string): string {
    const parts = url.split('/');
    return parts[parts.length - 1] || url;
  }

  /**
   * Download LaTeX file
   */
  static downloadLaTeX(latex: string, filename: string = 'resume.tex'): void {
    const blob = new Blob([latex], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  /**
   * Get Overleaf link to compile LaTeX
   */
  static getOverleafLink(): string {
    return 'https://www.overleaf.com/';
  }

  /**
   * Parse resume data from AI analysis and user profile
   * Now with Gemini-powered extraction!
   */
  static async parseResumeFromAnalysis(
    resumeText: string,
    userProfile: any,
    feedback: any
  ): Promise<ResumeData> {
    console.log('📄 Parsing resume data for Jake\'s template...');
    
    // Try Gemini-powered extraction first
    const geminiData = await this.extractWithGemini(resumeText, userProfile, feedback);
    
    if (geminiData) {
      console.log('✨ Using Gemini AI extracted data');
      return geminiData;
    }
    
    console.log('📝 Using regex-based extraction');
    
    // Fallback to regex-based extraction
    const resumeData: ResumeData = {
      name: userProfile?.name || 'Your Name',
      email: userProfile?.email || 'your.email@example.com',
      phone: userProfile?.phone || '123-456-7890',
      linkedin: userProfile?.linkedin,
      github: userProfile?.github,
      
      education: this.extractEducation(resumeText, userProfile),
      experience: this.extractExperience(resumeText, feedback),
      projects: this.extractProjects(resumeText),
      skills: this.extractSkills(userProfile, feedback)
    };
    
    return resumeData;
  }

  /**
   * Use Gemini AI to extract resume sections intelligently
   */
  private static async extractWithGemini(
    resumeText: string,
    userProfile: any,
    feedback: any
  ): Promise<ResumeData | null> {
    console.log('📊 Resume text available:', resumeText ? 'YES' : 'NO');
    console.log('📏 Resume text length:', resumeText?.length || 0, 'characters');
    
    if (!resumeText || resumeText.length < 50) {
      console.log('❌ Resume text too short or missing, skipping Gemini extraction');
      return null;
    }
    
    // Show first 500 characters for debugging
    console.log('📝 Resume text preview:');
    console.log(resumeText.substring(0, 500) + '...');

    try {
      console.log('🤖 Calling Gemini AI for resume data extraction...');
      
      const { GeminiService } = await import('./geminiService');
      
      const prompt = `You are a professional resume parser. Extract ALL information from this resume into structured JSON.

RESUME TEXT:
${resumeText}

INSTRUCTIONS:
1. Read the entire resume carefully
2. Extract EVERY piece of information you find
3. Use the ACTUAL text from the resume - do NOT make up or infer information
4. If you cannot find something, leave it as an empty array []
5. Preserve exact wording from the resume
6. Return ONLY the JSON object - NO markdown, NO code blocks, NO explanations

EXPECTED JSON FORMAT:
{
  "education": [
    {
      "institution": "Exact university name from resume",
      "location": "City, State from resume",
      "degree": "Full degree name from resume",
      "dates": "Exact dates from resume"
    }
  ],
  "experience": [
    {
      "position": "Exact job title from resume",
      "company": "Exact company name from resume",
      "location": "City, State from resume",
      "dates": "Exact dates from resume",
      "bullets": [
        "First bullet point exactly as written",
        "Second bullet point exactly as written",
        "Third bullet point exactly as written"
      ]
    }
  ],
  "projects": [
    {
      "name": "Project name from resume",
      "technologies": "Technologies listed",
      "dates": "Project dates",
      "bullets": ["Project description points"]
    }
  ],
  "skills": {
    "languages": ["Programming languages listed"],
    "frameworks": ["Frameworks listed"],
    "tools": ["Tools listed"],
    "libraries": ["Libraries listed"]
  }
}

CRITICAL RULES:
- Extract from sections labeled: Education, Experience, Work History, Projects, Skills, Technical Skills
- Keep ALL bullet points from each job
- Use exact dates (e.g., "June 2020 - Present", "2018-2022", etc.)
- If multiple jobs, include ALL of them
- If multiple schools, include ALL of them
- DO NOT use placeholders like "Company Name" or "University Name"
- If you can't find a section, return empty array []
- Return ONLY the JSON object`;

      const response = await GeminiService.generateContent(prompt);
      console.log('📥 Received Gemini response, length:', response.length);
      
      // Clean response
      let cleaned = response.trim();
      cleaned = cleaned.replace(/```json\n?/g, '');
      cleaned = cleaned.replace(/```\n?/g, '');
      cleaned = cleaned.trim();
      
      console.log('🧹 Cleaned response, searching for JSON...');
      
      const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        console.log('🎯 Found JSON in response, parsing...');
        const parsed = JSON.parse(jsonMatch[0]);
        
        console.log('✅ Gemini AI successfully extracted resume data:');
        console.log('   📚 Education entries:', parsed.education?.length || 0);
        console.log('   💼 Experience entries:', parsed.experience?.length || 0);
        console.log('   🚀 Projects:', parsed.projects?.length || 0);
        console.log('   🛠️ Skills categories:', Object.keys(parsed.skills || {}).length);
        
        // Validate we got real data, not placeholders
        const hasRealEducation = parsed.education?.some((edu: any) => 
          edu.institution && 
          !edu.institution.includes('University Name') && 
          !edu.institution.includes('[')
        );
        const hasRealExperience = parsed.experience?.some((exp: any) => 
          exp.company && 
          !exp.company.includes('Company Name') && 
          !exp.company.includes('[')
        );
        
        if (hasRealEducation || hasRealExperience) {
          console.log('✨ Real data detected! Using Gemini extraction');
          
          return {
            name: userProfile?.name || 'Your Name',
            email: userProfile?.email || 'your.email@example.com',
            phone: userProfile?.phone || '123-456-7890',
            linkedin: userProfile?.linkedin,
            github: userProfile?.github,
            education: parsed.education || [],
            experience: parsed.experience || [],
            projects: parsed.projects || [],
            skills: parsed.skills || { languages: [], frameworks: [], tools: [], libraries: [] }
          };
        } else {
          console.log('⚠️ Gemini returned placeholder data, using regex fallback');
        }
      } else {
        console.log('❌ No JSON found in Gemini response');
      }
    } catch (error: any) {
      console.log('⚠️ Gemini extraction failed:', error.message);
    }
    
    return null;
  }

  private static extractEducation(resumeText: string, userProfile: any): EducationEntry[] {
    const educationEntries: EducationEntry[] = [];
    
    // Try to extract from resume text first
    const eduSection = this.extractSection(resumeText, ['education', 'academic', 'qualifications']);
    
    if (eduSection) {
      // Parse education entries from text
      const lines = eduSection.split('\n').filter(line => line.trim());
      let currentEntry: Partial<EducationEntry> = {};
      
      for (const line of lines) {
        const trimmed = line.trim();
        
        // Look for dates (e.g., "2018-2022", "Aug 2018 - May 2022")
        const dateMatch = trimmed.match(/(\d{4}\s*[-–]\s*\d{4})|(\w+\.?\s+\d{4}\s*[-–]\s*\w+\.?\s+\d{4})|(\d{4}\s*[-–]\s*Present)/i);
        
        // Look for degree patterns
        const degreeMatch = trimmed.match(/(Bachelor|Master|PhD|Associate|B\.?S\.?|M\.?S\.?|B\.?A\.?|M\.?A\.?|Diploma)/i);
        
        if (degreeMatch && !currentEntry.degree) {
          currentEntry.degree = trimmed;
        } else if (dateMatch && !currentEntry.dates) {
          currentEntry.dates = dateMatch[0];
          // The line before dates might be institution
          if (!currentEntry.institution && trimmed !== dateMatch[0]) {
            currentEntry.institution = trimmed.replace(dateMatch[0], '').trim();
          }
        } else if (!currentEntry.institution && trimmed.length > 3) {
          currentEntry.institution = trimmed;
        }
        
        // If we have enough info, add entry
        if (currentEntry.degree && currentEntry.institution) {
          educationEntries.push({
            institution: currentEntry.institution,
            location: userProfile?.location || 'City, State',
            degree: currentEntry.degree,
            dates: currentEntry.dates || 'Aug 2018 - May 2022'
          });
          currentEntry = {};
        }
      }
    }
    
    // Fallback to user profile
    if (educationEntries.length === 0) {
      if (userProfile?.education) {
        return [
          {
            institution: userProfile.education.institution || 'University Name',
            location: userProfile.location || 'City, State',
            degree: userProfile.educationLevel || 'Bachelor of Science',
            dates: userProfile.education.dates || 'Aug 2018 - May 2022'
          }
        ];
      }
      
      return [
        {
          institution: 'University Name',
          location: 'City, State',
          degree: userProfile?.educationLevel || 'Bachelor of Science',
          dates: 'Aug 2018 - May 2022'
        }
      ];
    }
    
    return educationEntries;
  }

  private static extractExperience(resumeText: string, feedback: any): ExperienceEntry[] {
    const experienceEntries: ExperienceEntry[] = [];
    
    // Try to extract from resume text
    const expSection = this.extractSection(resumeText, ['experience', 'work history', 'employment', 'professional experience', 'work experience']);
    
    if (expSection) {
      const lines = expSection.split('\n').filter(line => line.trim());
      let currentEntry: Partial<ExperienceEntry> & { bullets: string[] } = { bullets: [] };
      
      for (const line of lines) {
        const trimmed = line.trim();
        
        // Skip empty lines
        if (!trimmed) continue;
        
        // Look for dates
        const dateMatch = trimmed.match(/(\d{4}\s*[-–]\s*\d{4})|(\w+\.?\s+\d{4}\s*[-–]\s*\w+\.?\s+\d{4})|(\d{4}\s*[-–]\s*Present)|(\w+\s+\d{4}\s*[-–]\s*Present)/i);
        
        // Look for bullet points (various formats)
        const bulletMatch = trimmed.match(/^[•●■▪▸➤\-\*]\s*(.+)$/) || 
                           (trimmed.startsWith('- ') ? { 1: trimmed.substring(2) } : null) ||
                           (trimmed.startsWith('* ') ? { 1: trimmed.substring(2) } : null);
        
        if (bulletMatch && currentEntry.position) {
          currentEntry.bullets.push(bulletMatch[1]);
        } else if (dateMatch) {
          // Save previous entry if it exists
          if (currentEntry.position && currentEntry.company && currentEntry.bullets.length > 0) {
            experienceEntries.push(currentEntry as ExperienceEntry);
          }
          // Start new entry
          currentEntry = {
            position: '',
            company: '',
            location: 'City, State',
            dates: dateMatch[0],
            bullets: []
          };
        } else if (!currentEntry.position && trimmed.length > 3) {
          currentEntry.position = trimmed;
        } else if (!currentEntry.company && trimmed.length > 3 && currentEntry.position) {
          currentEntry.company = trimmed;
        }
      }
      
      // Add last entry
      if (currentEntry.position && currentEntry.company && currentEntry.bullets.length > 0) {
        experienceEntries.push(currentEntry as ExperienceEntry);
      }
    }
    
    // If no experience extracted, return minimal template for user to fill
    if (experienceEntries.length === 0) {
      console.log('⚠️ No experience extracted from resume, using minimal template');
      return [
        {
          position: '[Your Job Title]',
          company: '[Company Name]',
          location: '[City, State]',
          dates: '[Start Date] - [End Date or Present]',
          bullets: [
            '[Describe your key responsibility or achievement]',
            '[Quantify your impact with metrics when possible]',
            '[Highlight technical skills or leadership experience]'
          ]
        }
      ];
    }
    
    return experienceEntries;
  }

  private static extractProjects(resumeText: string): ProjectEntry[] {
    const projectEntries: ProjectEntry[] = [];
    
    // Try to extract from resume text
    const projSection = this.extractSection(resumeText, ['projects', 'portfolio', 'academic projects', 'personal projects']);
    
    if (projSection) {
      const lines = projSection.split('\n').filter(line => line.trim());
      let currentEntry: Partial<ProjectEntry> & { bullets: string[] } = { bullets: [] };
      
      for (const line of lines) {
        const trimmed = line.trim();
        
        if (!trimmed) continue;
        
        // Look for technologies (e.g., "React, Node.js, MongoDB")
        const techMatch = trimmed.match(/^(.+?)\s*[|:]\s*(.+)$/);
        
        // Look for dates
        const dateMatch = trimmed.match(/(\d{4}\s*[-–]\s*\d{4})|(\w+\.?\s+\d{4}\s*[-–]\s*\w+\.?\s+\d{4})|(\d{4}\s*[-–]\s*Present)/i);
        
        // Look for bullet points
        const bulletMatch = trimmed.match(/^[•●■▪▸➤-]\s*(.+)$/);
        
        if (bulletMatch && currentEntry.name) {
          currentEntry.bullets.push(bulletMatch[1]);
        } else if (techMatch && !currentEntry.technologies) {
          currentEntry.name = techMatch[1].trim();
          currentEntry.technologies = techMatch[2].trim();
        } else if (dateMatch && currentEntry.name) {
          currentEntry.dates = dateMatch[0];
        } else if (!currentEntry.name && trimmed.length > 3) {
          currentEntry.name = trimmed;
        }
        
        // Complete entry if we have name and bullets
        if (currentEntry.name && currentEntry.bullets.length >= 2) {
          projectEntries.push({
            name: currentEntry.name,
            technologies: currentEntry.technologies || 'Various Technologies',
            dates: currentEntry.dates || 'Recent',
            bullets: currentEntry.bullets
          });
          currentEntry = { bullets: [] };
        }
      }
    }
    
    // Return empty if no projects (optional section)
    return projectEntries;
  }

  /**
   * Helper method to extract a section from resume text
   */
  private static extractSection(text: string, sectionNames: string[]): string | null {
    if (!text) return null;
    
    const lowerText = text.toLowerCase();
    
    for (const sectionName of sectionNames) {
      const pattern = new RegExp(`(${sectionName})\\s*:?\\s*\\n([\\s\\S]*?)(?=\\n\\s*[A-Z][A-Za-z\\s]+:|$)`, 'i');
      const match = text.match(pattern);
      
      if (match && match[2]) {
        return match[2].trim();
      }
      
      // Try alternative pattern (section as header)
      const idx = lowerText.indexOf(sectionName.toLowerCase());
      if (idx !== -1) {
        // Find the next section or end
        const nextSectionIdx = lowerText.substring(idx + 50).search(/\n\s*[A-Z][A-Za-z\s]+:\s*\n/);
        if (nextSectionIdx !== -1) {
          return text.substring(idx + sectionName.length, idx + 50 + nextSectionIdx).trim();
        } else {
          // Take rest of text
          const remaining = text.substring(idx + sectionName.length).trim();
          return remaining.substring(0, Math.min(remaining.length, 500));
        }
      }
    }
    
    return null;
  }

  private static extractSkills(userProfile: any, feedback: any): SkillsSection {
    const skills = userProfile?.skills || [];
    const matchedSkills = feedback?.matchedSkills || [];
    
    const allSkills = [...new Set([...skills.map((s: any) => s.name || s), ...matchedSkills])];
    
    // Categorize skills (simplified)
    return {
      languages: allSkills.filter((s: string) => 
        ['javascript', 'python', 'java', 'c++', 'typescript', 'go', 'rust', 'sql'].some(lang => 
          s.toLowerCase().includes(lang)
        )
      ),
      frameworks: allSkills.filter((s: string) => 
        ['react', 'node', 'angular', 'vue', 'django', 'flask', 'express', 'spring'].some(fw => 
          s.toLowerCase().includes(fw)
        )
      ),
      tools: allSkills.filter((s: string) => 
        ['git', 'docker', 'kubernetes', 'aws', 'azure', 'jenkins', 'ci/cd'].some(tool => 
          s.toLowerCase().includes(tool)
        )
      ),
      libraries: allSkills.filter((s: string) => 
        ['pandas', 'numpy', 'tensorflow', 'pytorch', 'scikit'].some(lib => 
          s.toLowerCase().includes(lib)
        )
      )
    };
  }
}

