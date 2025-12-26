import { DocumentAnalysisResult, QuizQuestion } from '../types/learningTypes';
import * as pdfjsLib from 'pdfjs-dist';

// Configure PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

// Learning Assistant Server Configuration
const LEARNING_SERVER_URL = 'http://localhost:3002';

export class DocumentProcessorService {
  /**
   * Extract text from PDF files using PDF.js
   */
  static async extractTextFromPDF(file: File): Promise<string> {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      let fullText = '';

      for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        const page = await pdf.getPage(pageNum);
        const textContent = await page.getTextContent();
        const pageText = textContent.items
          .map((item: any) => item.str)
          .join(' ');
        fullText += pageText + '\n';
      }

      if (!fullText.trim()) {
        throw new Error('The PDF appears to be empty or contains no readable text. Please ensure your PDF contains text content.');
      }

      return fullText;
    } catch (error) {
      console.error('Error extracting text from PDF:', error);
      throw new Error('Failed to extract text from PDF. The file might be corrupted, password-protected, or contain only images. Please try converting to text or use the "Paste Text" option.');
    }
  }

  /**
   * Extract text from various file types (PDF, DOCX, TXT)
   */
  static async extractTextFromFile(file: File): Promise<string> {
    const fileType = file.type;
    const fileName = file.name.toLowerCase();
    
    try {
      if (fileType === 'text/plain' || fileName.endsWith('.txt')) {
        const text = await file.text();
        if (!text.trim()) {
          throw new Error('The uploaded text file appears to be empty. Please upload a file with content.');
        }
        return text;
      } else if (fileType === 'application/pdf' || fileName.endsWith('.pdf')) {
        return await this.extractTextFromPDF(file);
      } else if (fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || fileName.endsWith('.docx')) {
        // For now, just return a message that DOCX support is coming
        throw new Error('DOCX files are not yet supported. Please save your document as a text file (.txt) or copy and paste the content using the "Paste Text" option.');
      } else {
        const extension = fileName.split('.').pop()?.toUpperCase() || 'Unknown';
        throw new Error(`Unsupported file type: ${extension}. Currently only TXT files are supported. Please use the "Paste Text" option to input your content directly.`);
      }
    } catch (error: any) {
      if (error.message) {
        throw error;
      }
      throw new Error('Failed to read the file. Please ensure the file is not corrupted and try again.');
    }
  }

  /**
   * Analyze document content for educational purposes using server-side Gemini AI
   */
  static async analyzeDocument(documentText: string): Promise<DocumentAnalysisResult> {
    try {
      const response = await fetch(`${LEARNING_SERVER_URL}/api/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: documentText }),
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Analysis failed');
      }

      return result.data;
    } catch (error) {
      console.error('Error analyzing document:', error);
      throw new Error('Failed to analyze document. Please ensure the Learning Assistant server is running on port 3002.');
    }
  }

  /**
   * Generate quiz questions from document using server-side Gemini AI
   */
  static async generateQuiz(documentText: string, questionCount: number = 5): Promise<QuizQuestion[]> {
    try {
      const response = await fetch(`${LEARNING_SERVER_URL}/api/generate-quiz`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ documentText, questionCount }),
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Quiz generation failed');
      }

      return result.data;
    } catch (error) {
      console.error('Error generating quiz with server:', error);
      // Fallback to basic quiz generation
      return this.generateBasicQuiz(documentText, questionCount);
    }
  }

  /**
   * Fallback basic quiz generation
   */
  private static generateBasicQuiz(documentText: string, questionCount: number): QuizQuestion[] {
    const questions: QuizQuestion[] = [];
    const sentences = documentText.split(/[.!?]+/).filter(s => s.trim().length > 30);
    
    for (let i = 0; i < Math.min(questionCount, sentences.length); i++) {
      const sentence = sentences[i].trim();
      questions.push({
        id: `question-${Date.now()}-${i}`,
        type: 'SHORT_ANSWER',
        question: `What is the main concept discussed in: "${sentence.substring(0, 100)}..."?`,
        correctAnswer: sentence.substring(0, 200),
        explanation: `This question tests comprehension of key concepts in the document.`,
        difficulty: 'MEDIUM',
        tags: ['comprehension', 'basic']
      });
    }
    
    return questions;
  }
}