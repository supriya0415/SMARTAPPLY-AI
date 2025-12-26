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
import { Plus, X } from 'lucide-react';

const educationLevels: { value: EducationLevel; label: string }[] = [
  { value: 'high-school', label: 'High School' },
  { value: 'associates', label: 'Associate Degree' },
  { value: 'bachelors', label: 'Bachelor\'s Degree' },
  { value: 'masters', label: 'Master\'s Degree' },
  { value: 'phd', label: 'PhD' },
  { value: 'other', label: 'Other' }
];

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  age: z.coerce.number().min(16, 'Age must be at least 16').max(100, 'Age must be less than 100'),
  educationLevel: z.enum(['high-school', 'associates', 'bachelors', 'masters', 'phd', 'other']),
  skills: z.array(z.string()).min(1, 'Please add at least one skill'),
  careerInterest: z.string().min(5, 'Career interest must be at least 5 characters')
});

export const Details = () => {
  const navigate = useNavigate();
  const { setProfile, setResults } = useUserStore();
  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCareer, setSelectedCareer] = useState<any>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      skills: []
    }
  });

  // Load selected career data if it exists
  useEffect(() => {
    const savedCareer = localStorage.getItem('selectedCareer');
    if (savedCareer) {
      try {
        const careerData = JSON.parse(savedCareer);
        setSelectedCareer(careerData);
        
        // Pre-populate career interest field with more descriptive text
        const careerDescription = `${careerData.title} - ${careerData.description}`;
        setValue('careerInterest', careerDescription);
        
        // Pre-populate skills from the selected career
        if (careerData.keySkills && careerData.keySkills.length > 0) {
          setSkills(careerData.keySkills);
          setValue('skills', careerData.keySkills);
        }
        
        toast.success(`Pre-filled details for ${careerData.title}`);
      } catch (error) {
        console.error('Error loading selected career:', error);
      }
    }
  }, [setValue]);

  const addSkill = () => {
    if (skillInput.trim() && !skills.includes(skillInput.trim())) {
      const newSkills = [...skills, skillInput.trim()];
      setSkills(newSkills);
      setValue('skills', newSkills);
      setSkillInput('');
    }
  };

  const removeSkill = (skillToRemove: string) => {
    const newSkills = skills.filter(skill => skill !== skillToRemove);
    setSkills(newSkills);
    setValue('skills', newSkills);
  };

  const onSubmit = async (data: any) => {
    const profile = {
      ...data,
      skills: data.skills,
      selectedCareer: selectedCareer || undefined
    };
    
    setProfile(profile);
    setIsLoading(true);
    
    // Clear the selected career from localStorage since it's now part of the profile
    if (selectedCareer) {
      localStorage.removeItem('selectedCareer');
    }
    
    // Generate career recommendation with Gemini API
    try {
      const results = await CareerService.generatePath(profile);
      setResults(results);
      toast.success('Career path generated successfully!');
      navigate('/results');
    } catch (error) {
      console.error('Error generating career path:', error);
      toast.error('Failed to generate career path. Using fallback data.');
      // The service will automatically fall back to mock data
      const results = await CareerService.generatePath(profile);
      setResults(results);
      navigate('/results');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative">
      {/* Form Section */}
      <section className="py-24 px-4 relative">
        <GridBackgroundSmall 
          size={24} 
          lineColor="rgba(139, 92, 246, 0.1)" 
          opacity={0.2}
          className="absolute inset-0"
        >
          <div />
        </GridBackgroundSmall>
        <DotBackground 
          size={40} 
          dotColor="rgba(34, 197, 94, 0.08)" 
          opacity={0.3}
          className="absolute inset-0"
        >
          <div />
        </DotBackground>
        <div className="max-w-2xl mx-auto relative">
          <NBCard className="border-border/50 bg-card/50 backdrop-blur-sm">
            <h2 className="text-3xl font-bold text-foreground mb-6">
              Tell us about yourself
            </h2>
            <p className="text-muted-foreground mb-8">
              The more details you provide, the better our AI-powered career recommendations will be.
            </p>

            {selectedCareer && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <h3 className="font-semibold text-green-800">Career Selected: {selectedCareer.title}</h3>
                </div>
                <p className="text-green-700 text-sm">
                  From {selectedCareer.department} → {selectedCareer.subdepartment}
                </p>
                <p className="text-green-600 text-sm mt-1">
                  We've pre-filled some fields based on your selection.
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <FormInput
                label="Full Name"
                name="name"
                placeholder="Enter your full name"
                register={register}
                error={errors.name as any}
                required
              />

              <FormInput
                label="Age"
                name="age"
                type="number"
                placeholder="Enter your age"
                register={register}
                error={errors.age as any}
                required
              />

              <div className="space-y-2">
                <label className="block text-sm font-medium text-foreground">
                  Education Level <span className="text-destructive ml-1">*</span>
                </label>
                <select
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  {...register('educationLevel')}
                >
                  {educationLevels.map((level) => (
                    <option key={level.value} value={level.value}>
                      {level.label}
                    </option>
                  ))}
                </select>
                {errors.educationLevel && (
                  <p className="text-sm text-destructive font-medium">
                    {(errors.educationLevel as any).message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-foreground">
                  Skills <span className="text-destructive ml-1">*</span>
                </label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                    placeholder="Add a skill (e.g., JavaScript, Python, Design)"
                    className="flex h-10 flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                  <NBButton
                    type="button"
                    onClick={addSkill}
                    variant="accent"
                    className="px-4"
                  >
                    <Plus className="w-4 h-4" />
                  </NBButton>
                </div>
                {skills.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {skills.map((skill) => (
                      <span
                        key={skill}
                        className="bg-accent text-accent-foreground px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-2"
                      >
                        <span>{skill}</span>
                        <button
                          type="button"
                          onClick={() => removeSkill(skill)}
                          className="hover:bg-accent-foreground/20 rounded-full p-0.5"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
                {errors.skills && (
                  <p className="text-sm text-destructive font-medium">
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

              <div className="flex justify-center pt-6">
                <NBButton type="submit" disabled={isLoading}>
                  {isLoading ? 'Generating...' : 'Generate Career Path'}
                </NBButton>
              </div>
            </form>
          </NBCard>
        </div>
      </section>
    </div>
  );
};