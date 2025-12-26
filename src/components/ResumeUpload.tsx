import { useState, useRef } from 'react';
import { Upload, FileText, X, CheckCircle, Loader2 } from 'lucide-react';
import { ResumeService } from '../lib/services/resumeService';
import { ResumeData } from '../lib/types';
import { toast } from 'sonner';

interface ResumeUploadProps {
  onResumeUploaded: (resumeData: ResumeData) => void;
  onResumeRemoved: () => void;
  resumeData?: ResumeData;
  disabled?: boolean;
}

export const ResumeUpload = ({ 
  onResumeUploaded, 
  onResumeRemoved, 
  resumeData, 
  disabled = false 
}: ResumeUploadProps) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (file: File) => {
    // Validate file type
    const allowedTypes = ['application/pdf', 'text/plain'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Please upload a PDF or text file');
      return;
    }

    // Validate file size (5MB limit)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      toast.error('File size must be less than 5MB');
      return;
    }

    setIsProcessing(true);

    try {
      const { extractedText, extractedInfo } = await ResumeService.processResumeFile(file);
      
      const resumeData: ResumeData = {
        file,
        extractedText,
        extractedInfo
      };

      onResumeUploaded(resumeData);
      toast.success('Resume uploaded and processed successfully!');
    } catch (error) {
      console.error('Error processing resume:', error);
      toast.error('Failed to process resume. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (disabled) return;

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFileUpload(files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      handleFileUpload(files[0]);
    }
  };

  const handleRemoveResume = () => {
    onResumeRemoved();
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (resumeData) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-accent/10 border border-accent/20 rounded-lg">
          <div className="flex items-center space-x-3">
            <FileText className="w-8 h-8 text-accent" />
            <div>
              <p className="font-medium text-foreground">{resumeData.file.name}</p>
              <p className="text-sm text-muted-foreground">
                {formatFileSize(resumeData.file.size)} • Processed
              </p>
            </div>
          </div>
          <button
            onClick={handleRemoveResume}
            disabled={disabled}
            className="p-2 hover:bg-accent/20 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>

        {/* Extracted Information Preview */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-foreground">Extracted Information:</h4>
          
          {resumeData.extractedInfo.skills.length > 0 && (
            <div>
              <p className="text-xs text-muted-foreground mb-1">Skills ({resumeData.extractedInfo.skills.length}):</p>
              <div className="flex flex-wrap gap-1">
                {resumeData.extractedInfo.skills.slice(0, 8).map((skill, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full"
                  >
                    {skill}
                  </span>
                ))}
                {resumeData.extractedInfo.skills.length > 8 && (
                  <span className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded-full">
                    +{resumeData.extractedInfo.skills.length - 8} more
                  </span>
                )}
              </div>
            </div>
          )}

          {resumeData.extractedInfo.experience.length > 0 && (
            <div>
              <p className="text-xs text-muted-foreground mb-1">Experience ({resumeData.extractedInfo.experience.length} positions):</p>
              <div className="space-y-1">
                {resumeData.extractedInfo.experience.slice(0, 2).map((exp, index) => (
                  <p key={index} className="text-xs text-foreground">
                    {exp.position} at {exp.company}
                  </p>
                ))}
                {resumeData.extractedInfo.experience.length > 2 && (
                  <p className="text-xs text-muted-foreground">
                    +{resumeData.extractedInfo.experience.length - 2} more positions
                  </p>
                )}
              </div>
            </div>
          )}

          {resumeData.extractedInfo.education.length > 0 && (
            <div>
              <p className="text-xs text-muted-foreground mb-1">Education ({resumeData.extractedInfo.education.length} degrees):</p>
              <div className="space-y-1">
                {resumeData.extractedInfo.education.slice(0, 2).map((edu, index) => (
                  <p key={index} className="text-xs text-foreground">
                    {edu.degree} in {edu.field} from {edu.institution}
                  </p>
                ))}
                {resumeData.extractedInfo.education.length > 2 && (
                  <p className="text-xs text-muted-foreground">
                    +{resumeData.extractedInfo.education.length - 2} more degrees
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div
        className={`relative border-2 border-dashed rounded-lg p-6 transition-colors ${
          dragActive
            ? 'border-accent bg-accent/5'
            : 'border-border hover:border-accent/50'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => !disabled && fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.txt"
          onChange={handleFileInput}
          disabled={disabled}
          className="hidden"
        />
        
        <div className="text-center">
          {isProcessing ? (
            <div className="flex flex-col items-center space-y-2">
              <Loader2 className="w-8 h-8 text-accent animate-spin" />
              <p className="text-sm text-muted-foreground">Processing resume...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center space-y-2">
              <Upload className="w-8 h-8 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium text-foreground">
                  {dragActive ? 'Drop your resume here' : 'Upload your resume'}
                </p>
                <p className="text-xs text-muted-foreground">
                  PDF or text files up to 5MB
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center space-x-2 text-xs text-muted-foreground">
        <CheckCircle className="w-3 h-3" />
        <span>We'll extract your skills, experience, and education automatically</span>
      </div>
    </div>
  );
};
