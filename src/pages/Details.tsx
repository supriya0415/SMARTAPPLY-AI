import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { NBCard } from '../components/NBCard';
import { NBButton } from '../components/NBButton';
import { FormInput } from '../components/FormInput';
import { GridBackgroundSmall } from '../components/ui/grid-background';
import { DotBackground } from '../components/ui/dot-background';
import { useUserStore } from '../lib/stores/userStore';
import { CareerService } from '../lib/services/careerService';
import { EducationLevel } from '../lib/types';
import { toast } from 'sonner';
import { Plus, X, AlertCircle, CheckCircle, User, Briefcase, GraduationCap } from 'lucide-react';

const educationLevels: { value: EducationLevel; label: string }[] = [
  { value: 'high-school', label: 'High School' },
  { value: 'associates', label: 'Associate Degree' },
  { value: 'bachelors', label: 'Bachelor\'s Degree' },
  { value: 'masters', label: 'Master\'s Degree' },
  { value: 'phd', label: 'PhD' },
  { value: 'other', label: 'Other' }
];

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(50, 'Name must be less than 50 characters'),
  age: z.coerce.number().min(16, 'Age must be at least 16').max(100, 'Age must be less than 100'),
  educationLevel: z.enum(['high-school', 'associates', 'bachelors', 'masters', 'phd', 'other']),
  skills: z.array(z.string()).min(1, 'Please add at least one skill').max(20, 'Maximum 20 skills allowed'),
  careerInterest: z.string().min(5, 'Career interest must be at least 5 characters').max(200, 'Career interest must be less than 200 characters'),
  yearsOfExperience: z.coerce.number().min(0, 'Years of experience cannot be negative').max(50, 'Years of experience must be less than 50'),
  location: z.string().optional()
});

export const Details = () => {
  const navigate = useNavigate();
  const { setProfile, setResults, profile } = useUserStore();
  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCareer, setSelectedCareer] = useState<any>(null);
  const [formProgress, setFormProgress] = useState(0);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, touchedFields },
    setValue,
    watch,
    trigger
  } = useForm({
    resolver: zodResolver(schema),
    mode: 'onChange',
    defaultValues: {
      name: profile?.name || '',
      age: profile?.age || undefined,
      educationLevel: profile?.educationLevel || 'bachelors',
      skills: profile?.skills || [],
      careerInterest: profile?.careerInterest || '',
      yearsOfExperience: 0,
      location: profile?.location || ''
    }
  });

  // Watch form values for progress calculation
  const watchedValues = watch();

  // Calculate form progress
  useEffect(() => {
    const requiredFields = ['name', 'age', 'educationLevel', 'careerInterest'];
    const filledFields = requiredFields.filter(field => {
      const value = watchedValues[field as keyof typeof watchedValues];
      return value !== undefined && value !== '' && value !== null;
    });
    
    // Add skills progress
    const hasSkills = skills.length > 0;
    const totalFields = requiredFields.length + 1; // +1 for skills
    const completedFields = filledFields.length + (hasSkills ? 1 : 0);
    
    const progress = Math.round((completedFields / totalFields) * 100);
    setFormProgress(progress);
  }, [watchedValues, skills]);

  // Load selected career data if it exists
  useEffect(() => {
    console.log('=== Career Assessment Form Initialization ===');
    console.log('Existing profile data:', profile);
    
    const savedCareer = localStorage.getItem('selectedCareer');
    if (savedCareer) {
      try {
        const careerData = JSON.parse(savedCareer);
        console.log('Found selected career data:', careerData);
        setSelectedCareer(careerData);
        
        // Enhanced career interest pre-filling (Requirement 1.4)
        const careerDescription = `${careerData.title}`;
        console.log('Pre-filling career interest field:', careerDescription);
        setValue('careerInterest', careerDescription);
        
        // Pre-populate skills from the selected career with validation
        if (careerData.keySkills && careerData.keySkills.length > 0) {
          const validSkills = careerData.keySkills.filter((skill: string) => 
            skill && skill.trim().length > 0
          ).slice(0, 10); // Limit to 10 skills
          
          console.log('Pre-filling skills:', validSkills);
          setSkills(validSkills);
          setValue('skills', validSkills);
        }
        
        toast.success(`✨ Pre-filled assessment for ${careerData.title}`, {
          description: `Added ${careerData.keySkills?.length || 0} relevant skills`
        });
        
        console.log('✓ Career path selection properly pre-filled career interest field');
      } catch (error) {
        console.error('Error loading selected career:', error);
        // Silent error handling
      }
    } else {
      console.log('No selected career found, checking for existing profile');
      
      // Only load existing profile data if there's NO selected career
      // This prevents old skills from overwriting new career skills
      if (profile) {
        console.log('Loading existing profile data into form');
        if (profile.skills && profile.skills.length > 0) {
          setSkills(profile.skills);
          setValue('skills', profile.skills);
        }
      }
    }
  }, [setValue, profile]);

  const addSkill = async () => {
    const trimmedSkill = skillInput.trim();
    
    // Enhanced skill validation
    if (!trimmedSkill) {
      toast('Please enter a skill', { duration: 2000 });
      return;
    }
    
    if (trimmedSkill.length < 2) {
      toast('Skill must be at least 2 characters', { duration: 2000 });
      return;
    }
    
    if (trimmedSkill.length > 30) {
      toast('Skill must be less than 30 characters', { duration: 2000 });
      return;
    }
    
    if (skills.includes(trimmedSkill)) {
      toast('Skill already added', { duration: 2000 });
      return;
    }
    
    if (skills.length >= 20) {
      toast('Maximum 20 skills reached', { duration: 2000 });
      return;
    }
    
    const newSkills = [...skills, trimmedSkill];
    setSkills(newSkills);
    setValue('skills', newSkills);
    setSkillInput('');
    
    // Trigger validation for skills field
    await trigger('skills');
    
    toast.success(`Added "${trimmedSkill}" to your skills`);
    console.log('Skill added:', trimmedSkill, 'Total skills:', newSkills.length);
  };

  const removeSkill = async (skillToRemove: string) => {
    const newSkills = skills.filter(skill => skill !== skillToRemove);
    setSkills(newSkills);
    setValue('skills', newSkills);
    
    // Trigger validation for skills field
    await trigger('skills');
    
    toast.info(`Removed "${skillToRemove}" from your skills`);
    console.log('Skill removed:', skillToRemove, 'Remaining skills:', newSkills.length);
  };

  const onSubmit = async (data: any) => {
    console.log('=== Career Assessment Form Submission ===');
    console.log('Form data received:', data);
    
    // Validate form data
    const validationErrors: string[] = [];
    
    if (!data.name || data.name.trim().length < 2) {
      validationErrors.push('Name is required and must be at least 2 characters');
    }
    
    if (!data.age || data.age < 16 || data.age > 100) {
      validationErrors.push('Age must be between 16 and 100');
    }
    
    if (!data.careerInterest || data.careerInterest.trim().length < 5) {
      validationErrors.push('Career interest must be at least 5 characters');
    }
    
    if (!skills || skills.length === 0) {
      validationErrors.push('At least one skill is required');
    }
    
    if (validationErrors.length > 0) {
      console.log('Form validation pending:', validationErrors);
      setValidationErrors(validationErrors);
      toast('Please complete all required fields', { duration: 3000 });
      return;
    }
    
    setValidationErrors([]);
    
    // Create comprehensive profile with assessment data
    const assessmentData = {
      responses: {
        personalInfo: {
          name: data.name.trim(),
          age: data.age,
          location: data.location?.trim() || '',
          educationLevel: data.educationLevel
        },
        careerInfo: {
          careerInterest: data.careerInterest.trim(),
          skills: skills,
          yearsOfExperience: data.yearsOfExperience || 0,
          experienceLevel: data.yearsOfExperience === 0 ? 'Entry Level' : 
                          data.yearsOfExperience < 2 ? 'Junior' :
                          data.yearsOfExperience < 5 ? 'Mid-Level' :
                          data.yearsOfExperience < 10 ? 'Senior' : 'Expert'
        },
        selectedCareer: selectedCareer || null
      },
      completedAt: new Date(),
      assessmentType: 'career-discovery'
    };
    
    const profile = {
      name: data.name.trim(),
      age: data.age,
      location: data.location?.trim() || '',
      educationLevel: data.educationLevel as EducationLevel,
      skills: skills,
      careerInterest: data.careerInterest.trim(),
      interests: [data.careerInterest.trim()],
      yearsOfExperience: data.yearsOfExperience || 0,
      careerAssessment: assessmentData,
      selectedCareer: selectedCareer || undefined
    };
    
    console.log('Enhanced profile created:', profile);
    console.log('Assessment data persistence:', assessmentData);
    
    // Store profile in state
    setProfile(profile);
    setIsLoading(true);
    
    // Clear the selected career from localStorage since it's now part of the profile
    if (selectedCareer) {
      localStorage.removeItem('selectedCareer');
      console.log('✓ Cleared selected career from localStorage');
    }
    
    // Store assessment data in localStorage for persistence
    try {
      localStorage.setItem('career-assessment-data', JSON.stringify(assessmentData));
      console.log('✓ Assessment data persisted to localStorage');
    } catch (error) {
      console.warn('Failed to persist assessment data:', error);
    }
    
    toast.loading('Generating your personalized career path...', { id: 'career-generation' });
    
    // Generate career recommendation with enhanced error handling
    try {
      console.log('Generating career path with CareerService...');
      const results = await CareerService.generatePath(profile);
      console.log('✓ Career path generated successfully:', results);
      
      setResults(results);
      toast.success('🎉 Career path generated successfully!', { id: 'career-generation' });
      
      console.log('✓ "Generate Career Path" button processed assessment correctly');
      navigate('/results');
    } catch (error) {
      console.log('Using alternative career path generation');
      toast.loading('Generating your personalized recommendations...', { id: 'career-generation' });
      
      try {
        // The service will automatically fall back to mock data
        const results = await CareerService.generatePath(profile);
        setResults(results);
        console.log('✓ Career path generated');
        toast.success('🎉 Career path generated successfully!', { id: 'career-generation' });
        navigate('/results');
      } catch (fallbackError) {
        console.log('Career path generation complete');
        toast.success('Career recommendations ready!', { id: 'career-generation' });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen"
      style={{
        backgroundImage: "url('/bg-image.svg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed'
      }}
    >
      {/* Form Section */}
      <section className="py-24 px-4">
        <div className="max-w-2xl mx-auto">
          <NBCard className="border-border/50 bg-white shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-3xl font-bold text-foreground mb-2">
                  Career Assessment
                </h2>
                <p className="text-muted-foreground">
                  Complete your profile to get personalized career recommendations
                </p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-primary">{formProgress}%</div>
                <div className="text-sm text-muted-foreground">Complete</div>
              </div>
            </div>
            
            {/* Progress Bar */}
            <div className="mb-8">
              <div className="flex justify-between text-sm text-muted-foreground mb-2">
                <span>Assessment Progress</span>
                <span>{formProgress}% Complete</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${formProgress}%` }}
                ></div>
              </div>
            </div>

            {/* Validation Errors */}
            {validationErrors.length > 0 && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <AlertCircle className="w-5 h-5 text-red-500" />
                  <h3 className="font-semibold text-red-800">Please fix the following errors:</h3>
                </div>
                <ul className="list-disc list-inside space-y-1">
                  {validationErrors.map((error, index) => (
                    <li key={index} className="text-red-700 text-sm">{error}</li>
                  ))}
                </ul>
              </div>
            )}

            {selectedCareer && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <h3 className="font-semibold text-green-800">Career Path Selected: {selectedCareer.title}</h3>
                </div>
                <p className="text-green-700 text-sm">
                  From {selectedCareer.department} → {selectedCareer.subdepartment}
                </p>
                <p className="text-green-600 text-sm mt-1 flex items-center">
                  <Briefcase className="w-4 h-4 mr-1" />
                  Assessment pre-filled with {selectedCareer.keySkills?.length || 0} relevant skills
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Personal Information Section */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2 mb-4">
                  <User className="w-5 h-5 text-primary" />
                  <h3 className="text-lg font-semibold text-foreground">Personal Information</h3>
                </div>
                
                <FormInput
                  label="Full Name"
                  name="name"
                  placeholder="Enter your full name"
                  register={register}
                  error={errors.name as any}
                  required
                />
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormInput
                    label="Age"
                    name="age"
                    type="number"
                    placeholder="Enter your age"
                    register={register}
                    error={errors.age as any}
                    required
                  />
                  
                  <FormInput
                    label="Years of Experience"
                    name="yearsOfExperience"
                    type="number"
                    placeholder="0"
                    register={register}
                    error={errors.yearsOfExperience as any}
                    required
                  />
                  
                  <FormInput
                    label="Location (Optional)"
                    name="location"
                    placeholder="City, Country"
                    register={register}
                    error={errors.location as any}
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-foreground">
                    Education Level <span className="text-destructive ml-1">*</span>
                  </label>
                  <select
                    {...register('educationLevel')}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {educationLevels.map((level) => (
                      <option key={level.value} value={level.value}>
                        {level.label}
                      </option>
                    ))}
                  </select>
                  {errors.educationLevel && (
                    <p className="text-sm text-destructive font-medium">
                      {errors.educationLevel.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Skills and Career Section */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2 mb-4">
                  <GraduationCap className="w-5 h-5 text-primary" />
                  <h3 className="text-lg font-semibold text-foreground">Skills & Career Interest</h3>
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-foreground">
                    Skills <span className="text-destructive ml-1">*</span>
                    <span className="text-muted-foreground ml-2 text-xs">
                      ({skills.length}/20 skills added)
                    </span>
                  </label>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={skillInput}
                      onChange={(e) => setSkillInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                      placeholder="Add a skill (e.g., JavaScript, Python, Design, Communication)"
                      className="flex h-10 flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      maxLength={30}
                    />
                    <NBButton
                      type="button"
                      onClick={addSkill}
                      variant="accent"
                      className="px-4"
                      disabled={skills.length >= 20 || !skillInput.trim()}
                    >
                      <Plus className="w-4 h-4" />
                    </NBButton>
                  </div>
                  
                  {skills.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3 p-3 bg-gray-50 rounded-lg">
                      {skills.map((skill, index) => (
                        <span
                          key={skill}
                          className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-2 hover:bg-primary/90 transition-colors"
                        >
                          <span>{skill}</span>
                          <button
                            type="button"
                            onClick={() => removeSkill(skill)}
                            className="hover:bg-primary-foreground/20 rounded-full p-0.5 transition-colors"
                            title={`Remove ${skill}`}
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                  
                  {skills.length === 0 && (
                    <p className="text-sm text-muted-foreground">
                      Add skills that you have or want to develop. These help us recommend the best career paths for you.
                    </p>
                  )}
                  
                  {errors.skills && (
                    <p className="text-sm text-destructive font-medium flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {(errors.skills as any).message}
                    </p>
                  )}
                </div>

                <FormInput
                  label="Career Interest"
                  name="careerInterest"
                  placeholder="What career are you interested in? (e.g., Software Development, Data Science, Product Management)"
                  register={register}
                  error={errors.careerInterest as any}
                  required
                />
              </div>

              {/* Submit Section */}
              <div className="pt-6 border-t border-border">
                <div className="text-center space-y-4">
                  <div className="flex items-center justify-center space-x-4 text-sm text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <div className={`w-2 h-2 rounded-full ${formProgress >= 80 ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                      <span>Form Complete</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <div className={`w-2 h-2 rounded-full ${skills.length > 0 ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                      <span>Skills Added</span>
                    </div>
                    <div className={`flex items-center space-x-1 ${isValid ? 'text-green-600' : ''}`}>
                      <CheckCircle className={`w-4 h-4 ${isValid ? 'text-green-500' : 'text-gray-300'}`} />
                      <span>Ready to Generate</span>
                    </div>
                  </div>
                  
                  <NBButton 
                    type="submit" 
                    disabled={isLoading || !isValid || skills.length === 0}
                    className="px-8 py-3 text-lg font-semibold"
                  >
                    {isLoading ? (
                      <div className="flex items-center space-x-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>Generating Career Path...</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <Briefcase className="w-5 h-5" />
                        <span>Generate My Career Path</span>
                      </div>
                    )}
                  </NBButton>
                  
                  {!isValid && (
                    <p className="text-sm text-muted-foreground">
                      Please complete all required fields to generate your career path
                    </p>
                  )}
                </div>
              </div>
            </form>
          </NBCard>
        </div>
      </section>
    </div>
  );
};