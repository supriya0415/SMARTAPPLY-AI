import { GoogleGenerativeAI } from '@google/generative-ai';
import { ExtractedResumeInfo } from '../types';
import { config } from '../config';

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(config.geminiApiKey);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export class ResumeService {
  static async extractTextFromFile(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        const text = e.target?.result as string;
        resolve(text);
      };
      
      reader.onerror = () => {
        reject(new Error('Failed to read file'));
      };
      
      if (file.type === 'text/plain') {
        reader.readAsText(file);
      } else if (file.type === 'application/pdf') {
        // For PDF files, we'll need to handle this differently
        // For now, we'll assume the file is already text or use a PDF parsing library
        reader.readAsText(file);
      } else {
        reject(new Error('Unsupported file type. Please upload a PDF or text file.'));
      }
    });
  }

  static async extractResumeInfo(file: File): Promise<ExtractedResumeInfo> {
    try {
      // Check if API key is available
      if (!config.geminiApiKey) {
        console.warn('Gemini API key not found, using fallback extraction');
        return this.getFallbackExtraction();
      }

      // Extract text from file
      const extractedText = await this.extractTextFromFile(file);
      
      if (!extractedText.trim()) {
        throw new Error('No text could be extracted from the file');
      }

      const prompt = `
        You are a resume parsing AI. Extract structured information from the following resume text.
        
        Resume Text:
        ${extractedText}
        
        Please extract and return the information in the following JSON format:
        {
          "name": "Full Name (if found)",
          "email": "email@example.com (if found)",
          "phone": "phone number (if found)",
          "skills": ["skill1", "skill2", "skill3", ...],
          "experience": [
            {
              "company": "Company Name",
              "position": "Job Title",
              "duration": "Start Date - End Date",
              "description": "Job description and responsibilities",
              "skills": ["skill1", "skill2", ...]
            }
          ],
          "education": [
            {
              "institution": "University/College Name",
              "degree": "Degree Type (Bachelor's, Master's, etc.)",
              "field": "Field of Study",
              "year": "Graduation Year",
              "gpa": "GPA (if mentioned)"
            }
          ],
          "summary": "Professional summary or objective (if found)",
          "languages": ["Language1", "Language2", ...],
          "certifications": ["Certification1", "Certification2", ...]
        }
        
        Guidelines:
        - Extract all technical skills, programming languages, tools, and technologies
        - Include soft skills like communication, leadership, etc.
        - For experience, extract company names, job titles, duration, and key responsibilities
        - For education, extract institution, degree, field of study, and graduation year
        - If any field is not found, use an empty array or omit the field
        - Be thorough in extracting skills from job descriptions and experience
        - Normalize skill names (e.g., "JavaScript" not "javascript" or "JS")
        - Return only valid JSON, no additional text
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      // Extract JSON from the response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No valid JSON found in response');
      }
      
      const extractedInfo = JSON.parse(jsonMatch[0]) as ExtractedResumeInfo;
      
      // Ensure arrays are properly initialized
      return {
        name: extractedInfo.name || undefined,
        email: extractedInfo.email || undefined,
        phone: extractedInfo.phone || undefined,
        skills: extractedInfo.skills || [],
        experience: extractedInfo.experience || [],
        education: extractedInfo.education || [],
        summary: extractedInfo.summary || undefined,
        languages: extractedInfo.languages || [],
        certifications: extractedInfo.certifications || []
      };
    } catch (error) {
      console.error('Error extracting resume info:', error);
      return this.getFallbackExtraction();
    }
  }

  private static getFallbackExtraction(): ExtractedResumeInfo {
    return {
      skills: [],
      experience: [],
      education: [],
      languages: [],
      certifications: []
    };
  }

  static async processResumeFile(file: File): Promise<{ extractedText: string; extractedInfo: ExtractedResumeInfo }> {
    try {
      const extractedText = await this.extractTextFromFile(file);
      const extractedInfo = await this.extractResumeInfo(file);
      
      return {
        extractedText,
        extractedInfo
      };
    } catch (error) {
      console.error('Error processing resume file:', error);
      throw new Error('Failed to process resume file. Please try again.');
    }
  }
}
