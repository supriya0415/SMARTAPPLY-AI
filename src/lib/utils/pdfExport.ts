import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { EnhancedUserProfile, CareerRecommendation } from '../types';

export class PDFExportService {
  /**
   * Export complete career roadmap as PDF
   */
  static async exportCareerRoadmap(
    profile: EnhancedUserProfile,
    roadmap: CareerRecommendation
  ): Promise<void> {
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const margin = 20;
    let yPosition = margin;

    // Header
    pdf.setFillColor(139, 92, 246); // Purple
    pdf.rect(0, 0, pageWidth, 40, 'F');
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(24);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Career Roadmap', margin, 25);
    
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`${profile.name} | ${profile.careerInterest}`, margin, 33);
    
    yPosition = 50;
    pdf.setTextColor(0, 0, 0);

    // Career Summary
    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Career Path Overview', margin, yPosition);
    yPosition += 10;

    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'normal');
    const summaryLines = pdf.splitTextToSize(roadmap.summary || 'Your personalized career path', pageWidth - 2 * margin);
    pdf.text(summaryLines, margin, yPosition);
    yPosition += summaryLines.length * 5 + 10;

    // Career Details
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Career Details', margin, yPosition);
    yPosition += 8;

    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`Title: ${roadmap.title}`, margin + 5, yPosition);
    yPosition += 6;
    pdf.text(`Fit Score: ${roadmap.fitScore}%`, margin + 5, yPosition);
    yPosition += 6;
    pdf.text(`Salary Range: $${roadmap.salaryRange?.min || 50}k - $${roadmap.salaryRange?.max || 150}k`, margin + 5, yPosition);
    yPosition += 6;
    pdf.text(`Growth Prospects: ${roadmap.growthProspects}`, margin + 5, yPosition);
    yPosition += 10;

    // Required Skills
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Required Skills', margin, yPosition);
    yPosition += 8;

    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    const skills = Array.isArray(roadmap.requiredSkills) ? roadmap.requiredSkills : [];
    const skillsText = skills.slice(0, 10).map((skill: any) => 
      typeof skill === 'string' ? skill : skill.name || skill
    ).join(', ');
    const skillLines = pdf.splitTextToSize(skillsText, pageWidth - 2 * margin);
    pdf.text(skillLines, margin + 5, yPosition);
    yPosition += skillLines.length * 5 + 10;

    // Career Path Milestones
    if (roadmap.careerPath && roadmap.careerPath.nodes) {
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Career Milestones & Path', margin, yPosition);
      yPosition += 8;

      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      
      // Filter out nodes with meaningful content
      const meaningfulNodes = roadmap.careerPath.nodes.filter((node: any) => {
        const label = node.data?.label || node.id || '';
        // Exclude nodes that are just numbers or generic IDs
        return label && label.length > 2 && !label.match(/^[0-9]+$/);
      });

      if (meaningfulNodes.length > 0) {
        meaningfulNodes.slice(0, 10).forEach((node: any, idx: number) => {
          if (yPosition > 270) {
            pdf.addPage();
            yPosition = margin;
          }
          
          const label = node.data?.label || node.id || `Milestone ${idx + 1}`;
          const type = node.type || 'step';
          
          // Add emoji based on type
          let emoji = '📍';
          if (type === 'course') emoji = '📚';
          if (type === 'internship') emoji = '💼';
          if (type === 'job') emoji = '🎯';
          if (type === 'certification') emoji = '🏆';
          if (type === 'skill') emoji = '⚡';
          
          pdf.setFont('helvetica', 'bold');
          pdf.text(`${idx + 1}. ${emoji} ${label}`, margin + 5, yPosition);
          yPosition += 5;
          
          if (node.data?.description) {
            pdf.setFont('helvetica', 'normal');
            const descLines = pdf.splitTextToSize(node.data.description, pageWidth - 2 * margin - 10);
            pdf.text(descLines, margin + 10, yPosition);
            yPosition += descLines.length * 4 + 3;
          }
          yPosition += 3;
        });
      } else {
        // Fallback: Create generic milestones based on career
        const genericMilestones = [
          `Foundation: Learn ${roadmap.title} fundamentals`,
          `Skill Development: Master core technical skills`,
          `Practical Experience: Build real-world projects`,
          `Professional Growth: Gain industry experience`,
          `Expertise: Achieve advanced proficiency`
        ];
        
        genericMilestones.forEach((milestone, idx) => {
          if (yPosition > 270) {
            pdf.addPage();
            yPosition = margin;
          }
          pdf.setFont('helvetica', 'bold');
          pdf.text(`${idx + 1}. ${milestone}`, margin + 5, yPosition);
          yPosition += 7;
        });
      }
    }

    // Alternative Careers
    if (roadmap.alternatives && roadmap.alternatives.length > 0) {
      if (yPosition > 240) {
        pdf.addPage();
        yPosition = margin;
      }

      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Alternative Career Paths', margin, yPosition);
      yPosition += 8;

      pdf.setFontSize(10);
      roadmap.alternatives.slice(0, 5).forEach((alt: any, idx: number) => {
        if (yPosition > 270) {
          pdf.addPage();
          yPosition = margin;
        }
        pdf.setFont('helvetica', 'bold');
        pdf.text(`${idx + 1}. ${alt.title}`, margin + 5, yPosition);
        yPosition += 5;
        pdf.setFont('helvetica', 'normal');
        const altDesc = pdf.splitTextToSize(alt.description || '', pageWidth - 2 * margin - 10);
        pdf.text(altDesc, margin + 10, yPosition);
        yPosition += altDesc.length * 4 + 3;
        pdf.text(`Match Score: ${alt.matchScore}% | ${alt.salary}`, margin + 10, yPosition);
        yPosition += 6;
      });
    }

    // Footer
    const pageCount = (pdf as any).internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      pdf.setPage(i);
      pdf.setFontSize(8);
      pdf.setTextColor(128, 128, 128);
      pdf.text(`Generated by SmartApply AI | Page ${i} of ${pageCount}`, margin, 290);
      pdf.text(new Date().toLocaleDateString(), pageWidth - margin - 30, 290);
    }

    // Save PDF
    pdf.save(`${profile.name}_Career_Roadmap.pdf`);
  }

  /**
   * Export learning resources as PDF
   */
  static async exportLearningResources(
    profile: EnhancedUserProfile,
    resources: any[]
  ): Promise<void> {
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const margin = 20;
    let yPosition = margin;

    // Header
    pdf.setFillColor(59, 130, 246); // Blue
    pdf.rect(0, 0, pageWidth, 40, 'F');
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(24);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Learning Resources', margin, 25);
    
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`${profile.name} | ${profile.careerInterest}`, margin, 33);
    
    yPosition = 50;
    pdf.setTextColor(0, 0, 0);

    // Resources by Category
    resources.forEach((category: any, catIdx: number) => {
      if (catIdx > 0 && yPosition > 250) {
        pdf.addPage();
        yPosition = margin;
      }

      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.text(category.category, margin, yPosition);
      yPosition += 8;

      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'italic');
      const catDesc = pdf.splitTextToSize(category.description, pageWidth - 2 * margin);
      pdf.text(catDesc, margin, yPosition);
      yPosition += catDesc.length * 4 + 5;

      // Resources
      category.resources.forEach((resource: any, resIdx: number) => {
        if (yPosition > 270) {
          pdf.addPage();
          yPosition = margin;
        }

        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(11);
        pdf.text(`${resIdx + 1}. ${resource.title}`, margin + 5, yPosition);
        yPosition += 5;

        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(9);
        pdf.text(`Provider: ${resource.provider} | Difficulty: ${resource.difficulty} | Duration: ${resource.duration}`, margin + 10, yPosition);
        yPosition += 4;
        
        if (resource.cost === 0) {
          pdf.setTextColor(34, 197, 94); // Green
          pdf.text('FREE', margin + 10, yPosition);
          pdf.setTextColor(0, 0, 0);
        } else {
          pdf.text(`Cost: $${resource.cost}`, margin + 10, yPosition);
        }
        yPosition += 4;

        pdf.text(`URL: ${resource.url}`, margin + 10, yPosition);
        yPosition += 6;
      });

      yPosition += 5;
    });

    // Footer
    const pageCount = (pdf as any).internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      pdf.setPage(i);
      pdf.setFontSize(8);
      pdf.setTextColor(128, 128, 128);
      pdf.text(`Generated by SmartApply AI | Page ${i} of ${pageCount}`, margin, 290);
      pdf.text(new Date().toLocaleDateString(), pageWidth - margin - 30, 290);
    }

    pdf.save(`${profile.name}_Learning_Resources.pdf`);
  }

  /**
   * Export complete profile summary as PDF
   */
  static async exportProfileSummary(profile: EnhancedUserProfile): Promise<void> {
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const margin = 20;
    let yPosition = margin;

    // Header
    pdf.setFillColor(16, 185, 129); // Green
    pdf.rect(0, 0, pageWidth, 40, 'F');
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(24);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Career Profile', margin, 25);
    
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'normal');
    pdf.text(profile.name || 'User', margin, 33);
    
    yPosition = 50;
    pdf.setTextColor(0, 0, 0);

    // Personal Info
    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Personal Information', margin, yPosition);
    yPosition += 10;

    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`Career Interest: ${profile.careerInterest}`, margin + 5, yPosition);
    yPosition += 6;
    pdf.text(`Experience: ${profile.yearsOfExperience || 0} years`, margin + 5, yPosition);
    yPosition += 6;
    pdf.text(`Education: ${profile.educationLevel}`, margin + 5, yPosition);
    yPosition += 6;
    if (profile.location) {
      pdf.text(`Location: ${profile.location}`, margin + 5, yPosition);
      yPosition += 6;
    }
    yPosition += 5;

    // Skills
    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Skills', margin, yPosition);
    yPosition += 10;

    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    const skillsText = (profile.skills || []).join(', ');
    const skillLines = pdf.splitTextToSize(skillsText, pageWidth - 2 * margin);
    pdf.text(skillLines, margin + 5, yPosition);
    yPosition += skillLines.length * 5 + 10;

    // Progress Summary
    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Learning Progress', margin, yPosition);
    yPosition += 10;

    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`Overall Progress: ${profile.progressData?.overallProgress || 0}%`, margin + 5, yPosition);
    yPosition += 6;
    pdf.text(`Resources Completed: ${profile.learningResourcesCompleted?.length || 0}`, margin + 5, yPosition);
    yPosition += 6;
    pdf.text(`Learning Activities: ${profile.progressData?.learningActivities?.length || 0}`, margin + 5, yPosition);
    yPosition += 10;

    // Career Recommendations Summary
    if (profile.careerRecommendations && profile.careerRecommendations.length > 0) {
      pdf.setFontSize(16);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Career Matches', margin, yPosition);
      yPosition += 10;

      profile.careerRecommendations.slice(0, 3).forEach((rec: any, idx: number) => {
        if (yPosition > 260) {
          pdf.addPage();
          yPosition = margin;
        }

        pdf.setFontSize(12);
        pdf.setFont('helvetica', 'bold');
        pdf.text(`${idx + 1}. ${rec.title}`, margin + 5, yPosition);
        yPosition += 6;

        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'normal');
        pdf.text(`Fit Score: ${rec.fitScore}%`, margin + 10, yPosition);
        yPosition += 5;

        const descLines = pdf.splitTextToSize(rec.description || '', pageWidth - 2 * margin - 15);
        pdf.text(descLines, margin + 10, yPosition);
        yPosition += descLines.length * 4 + 8;
      });
    }

    // Footer
    const pageCount = (pdf as any).internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      pdf.setPage(i);
      pdf.setFontSize(8);
      pdf.setTextColor(128, 128, 128);
      pdf.text(`Generated by SmartApply AI | Page ${i} of ${pageCount}`, margin, 290);
      pdf.text(new Date().toLocaleDateString(), pageWidth - margin - 30, 290);
    }

    pdf.save(`${profile.name}_Career_Profile.pdf`);
  }

  /**
   * Capture an HTML element as PDF (for visual exports like flowcharts)
   */
  static async exportElementAsPDF(
    elementId: string,
    fileName: string
  ): Promise<void> {
    const element = document.getElementById(elementId);
    if (!element) {
      throw new Error(`Element with id "${elementId}" not found`);
    }

    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('l', 'mm', 'a4');
    
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = canvas.width;
    const imgHeight = canvas.height;
    const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
    
    const imgX = (pdfWidth - imgWidth * ratio) / 2;
    const imgY = 10;
    
    pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
    pdf.save(fileName);
  }
}

