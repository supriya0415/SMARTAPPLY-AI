import React, { useState } from 'react';
import { NBCard } from '../NBCard';
import { NBButton } from '../NBButton';
import { Sparkles, Copy, CheckCircle } from 'lucide-react';
import { EnhancedResumeService } from '../../lib/services/enhancedResumeService';
import { toast } from 'sonner';

interface ImprovedBulletsSectionProps {
  weaknesses: string[];
  jobTitle: string;
}

export const ImprovedBulletsSection: React.FC<ImprovedBulletsSectionProps> = ({ 
  weaknesses, 
  jobTitle 
}) => {
  const [improvedBullets, setImprovedBullets] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState<{ [key: string]: boolean }>({});
  const [copied, setCopied] = useState<{ [key: string]: boolean }>({});

  // Extract weak bullet points from weaknesses
  const weakBullets = [
    'Responsible for managing team projects',
    'Worked on various development tasks',
    'Helped with customer support issues',
    'Participated in meetings and discussions'
  ];

  const handleImprove = async (original: string, index: number) => {
    setLoading({ ...loading, [index]: true });
    toast.loading('🤖 AI is improving your bullet point...', { id: `improve-${index}` });

    try {
      const improved = await EnhancedResumeService.rewriteResumeSection(
        original,
        'bullet',
        jobTitle
      );
      
      setImprovedBullets({ ...improvedBullets, [index]: improved });
      toast.success('✨ Bullet point improved!', { id: `improve-${index}` });
    } catch (error) {
      toast('Please try again', { id: `improve-${index}` });
    } finally {
      setLoading({ ...loading, [index]: false });
    }
  };

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopied({ ...copied, [index]: true });
    toast.success('Copied to clipboard!');
    setTimeout(() => setCopied({ ...copied, [index]: false }), 2000);
  };

  if (!weaknesses || weaknesses.length === 0) {
    return null;
  }

  return (
    <NBCard className="p-6">
      <div className="flex items-start space-x-3 mb-4">
        <Sparkles className="w-6 h-6 text-purple-500 flex-shrink-0 mt-1" />
        <div>
          <h3 className="text-xl font-semibold text-foreground">Improve Your Resume Bullets</h3>
          <p className="text-sm text-muted-foreground mt-1">
            AI-enhanced versions of common weak phrases. Use these to make your resume more impactful!
          </p>
        </div>
      </div>

      <div className="space-y-4 mt-6">
        {weakBullets.map((bullet, index) => (
          <div key={index} className="border border-gray-200 rounded-lg p-4 bg-white">
            {/* Original */}
            <div className="mb-3">
              <p className="text-xs font-semibold text-gray-500 mb-1">❌ WEAK (Avoid this):</p>
              <p className="text-sm text-gray-700 italic">"{bullet}"</p>
            </div>

            {/* Improved Version */}
            {improvedBullets[index] ? (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <div className="flex items-start justify-between mb-2">
                  <p className="text-xs font-semibold text-green-700">✅ IMPROVED (Use this):</p>
                  <NBButton
                    onClick={() => handleCopy(improvedBullets[index], index)}
                    size="sm"
                    variant="secondary"
                    className="flex items-center space-x-1"
                  >
                    {copied[index] ? (
                      <>
                        <CheckCircle className="w-3 h-3 text-green-600" />
                        <span className="text-xs">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span className="text-xs">Copy</span>
                      </>
                    )}
                  </NBButton>
                </div>
                <p className="text-sm text-foreground font-medium">"{improvedBullets[index]}"</p>
              </div>
            ) : (
              <NBButton
                onClick={() => handleImprove(bullet, index)}
                disabled={loading[index]}
                size="sm"
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-none hover:from-purple-600 hover:to-pink-600"
              >
                {loading[index] ? (
                  <span className="flex items-center space-x-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>Improving...</span>
                  </span>
                ) : (
                  <span className="flex items-center space-x-2">
                    <Sparkles className="w-4 h-4" />
                    <span>Improve with AI</span>
                  </span>
                )}
              </NBButton>
            )}
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-purple-50 border border-purple-200 rounded-lg">
        <p className="text-sm text-purple-900">
          💡 <strong>Pro Tip:</strong> Use action verbs (Led, Developed, Achieved), include specific metrics 
          (30% increase, $500K revenue), and focus on results rather than responsibilities.
        </p>
      </div>
    </NBCard>
  );
};

