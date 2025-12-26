import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AdminService } from '../../lib/services/adminService';
import { NBCard } from '../../components/NBCard';
import { NBButton } from '../../components/NBButton';
import { Briefcase, Plus, Edit, Trash2, X, Download } from 'lucide-react';
import { toast } from 'sonner';
import { UNIVERSAL_CAREER_TAXONOMY } from '../../lib/data/universalCareerTaxonomy';

export const AdminCareers = () => {
  const [careers, setCareers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCareer, setEditingCareer] = useState<any>(null);
  const [formData, setFormData] = useState({
    id: '',
    title: '',
    domain: '',
    subdomain: '',
    description: '',
    salary: { min: 0, max: 0, currency: 'USD' },
    growth: '',
    skills: [] as string[],
    experienceLevels: [] as string[],
    education: [] as string[],
    responsibilities: [] as string[],
    certifications: [] as string[],
    isActive: true
  });

  useEffect(() => {
    loadCareers();
  }, []);

  const loadCareers = async () => {
    setLoading(true);
    try {
      // Load from frontend taxonomy FIRST (primary source - 1000+ careers)
      const taxonomyCareers: any[] = [];
      
      UNIVERSAL_CAREER_TAXONOMY.forEach((domain) => {
        domain.subdomains.forEach((subdomain) => {
          subdomain.roles.forEach((role) => {
            // Parse salary from string like "$70k - $120k"
            const salaryMatch = role.averageSalary.match(/\$(\d+)k?\s*-\s*\$(\d+)k?/i);
            const minSalary = salaryMatch ? parseInt(salaryMatch[1]) * 1000 : 0;
            const maxSalary = salaryMatch ? parseInt(salaryMatch[2]) * 1000 : 0;
            
            taxonomyCareers.push({
              _id: role.id, // Use id as _id for React key
              id: role.id,
              title: role.title,
              domain: domain.name,
              subdomain: subdomain.name,
              description: role.description,
              salary: { min: minSalary, max: maxSalary, currency: 'USD' },
              growth: role.growthOutlook,
              skills: role.keySkills || [],
              experienceLevels: role.experienceLevel ? [role.experienceLevel] : [],
              education: role.educationLevel ? [role.educationLevel] : [],
              responsibilities: [],
              certifications: [],
              isActive: true,
              fromTaxonomy: true // Mark as from taxonomy
            });
          });
        });
      });
      
      // Also try to load manually added/edited careers from backend
      try {
        const data = await AdminService.getAllCareers({ limit: 1000 });
        const manualCareers = (data.careers || []).map((c: any) => ({
          ...c,
          fromTaxonomy: false // Mark as manually added
        }));
        
        // Merge: taxonomy careers + manually added (manual override taxonomy if same ID)
        const careerMap = new Map(taxonomyCareers.map(c => [c.id, c]));
        manualCareers.forEach((manual: any) => {
          careerMap.set(manual.id, manual); // Manual overrides taxonomy
        });
        
        setCareers(Array.from(careerMap.values()));
      } catch (error) {
        // If backend fails, just use taxonomy
        console.log('Backend careers load failed, using taxonomy only');
        setCareers(taxonomyCareers);
      }
    } catch (error) {
      toast.error('Failed to load careers');
      setCareers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingCareer) {
        await AdminService.updateCareer(editingCareer.id, formData);
        toast.success('Career updated successfully');
      } else {
        await AdminService.createCareer(formData);
        toast.success('Career created successfully');
      }
      
      setShowModal(false);
      resetForm();
      loadCareers();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to save career');
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) {
      return;
    }

    try {
      await AdminService.deleteCareer(id);
      toast.success('Career deleted successfully');
      loadCareers();
    } catch (error) {
      toast.error('Failed to delete career');
    }
  };

  const handleEdit = (career: any) => {
    setEditingCareer(career);
    setFormData({
      id: career.id,
      title: career.title,
      domain: career.domain,
      subdomain: career.subdomain,
      description: career.description,
      salary: career.salary || { min: 0, max: 0, currency: 'USD' },
      growth: career.growth || '',
      skills: career.skills || [],
      experienceLevels: career.experienceLevels || [],
      education: career.education || [],
      responsibilities: career.responsibilities || [],
      certifications: career.certifications || [],
      isActive: career.isActive !== false
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setEditingCareer(null);
    setFormData({
      id: '',
      title: '',
      domain: '',
      subdomain: '',
      description: '',
      salary: { min: 0, max: 0, currency: 'USD' },
      growth: '',
      skills: [],
      experienceLevels: [],
      education: [],
      responsibilities: [],
      certifications: [],
      isActive: true
    });
  };

  const handleArrayInput = (field: string, value: string) => {
    const items = value.split(',').map(s => s.trim()).filter(s => s);
    setFormData({ ...formData, [field]: items });
  };

  const handleImportFromTaxonomy = async () => {
    if (!confirm('This will import ALL 1000+ careers from the taxonomy. This may take a minute. Continue?')) {
      return;
    }

    try {
      toast.loading('Importing careers from taxonomy...', { id: 'import' });
      
      // Convert taxonomy format to Career model format
      const careersToImport: any[] = [];
      
      UNIVERSAL_CAREER_TAXONOMY.forEach((domain) => {
        domain.subdomains.forEach((subdomain) => {
          subdomain.roles.forEach((role) => {
            // Parse salary from string like "$70k - $120k"
            const salaryMatch = role.averageSalary.match(/\$(\d+)k?\s*-\s*\$(\d+)k?/i);
            const minSalary = salaryMatch ? parseInt(salaryMatch[1]) * 1000 : 0;
            const maxSalary = salaryMatch ? parseInt(salaryMatch[2]) * 1000 : 0;
            
            // Parse growth from string like "High (22% growth)"
            const growthMatch = role.growthOutlook.match(/(\d+)%/);
            const growth = growthMatch ? `${role.growthOutlook}` : role.growthOutlook;
            
            careersToImport.push({
              id: role.id,
              title: role.title,
              domain: domain.name,
              subdomain: subdomain.name,
              description: role.description,
              salary: { min: minSalary, max: maxSalary, currency: 'USD' },
              growth: growth,
              skills: role.keySkills || [],
              experienceLevels: role.experienceLevel ? [role.experienceLevel] : [],
              education: role.educationLevel ? [role.educationLevel] : [],
              responsibilities: [],
              certifications: [],
              isActive: true
            });
          });
        });
      });

      const result = await AdminService.importCareersFromTaxonomy(careersToImport);
      
      toast.success(
        `✅ Imported ${result.imported} careers! ${result.skipped} already existed.`,
        { id: 'import' }
      );
      
      // Reload careers
      loadCareers();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to import careers', { id: 'import' });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 border-b">
        <div className="max-w-7xl mx-auto px-4 pt-24 pb-8">
          <h1 className="text-4xl font-bold mb-2 text-gray-800">Job Management</h1>
          <p className="text-gray-600">Add, edit, and manage career opportunities</p>
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex space-x-6">
            <Link to="/admin" className="py-4 px-2 border-b-2 border-transparent hover:border-gray-300 text-gray-600 hover:text-gray-900">
              Dashboard
            </Link>
            <Link to="/admin/users" className="py-4 px-2 border-b-2 border-transparent hover:border-gray-300 text-gray-600 hover:text-gray-900">
              Users
            </Link>
            <Link to="/admin/careers" className="py-4 px-2 border-b-2 border-purple-600 text-purple-600 font-medium">
              Job Management
            </Link>
            <Link to="/admin/analytics" className="py-4 px-2 border-b-2 border-transparent hover:border-gray-300 text-gray-600 hover:text-gray-900">
              Analytics
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 pt-16 pb-8">
        {/* Header with Add Button */}
        <div className="mb-6 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Briefcase className="w-6 h-6 text-purple-600" />
            <span className="text-2xl font-bold text-foreground">
              {careers.length} Career Paths
            </span>
          </div>
           <div className="flex space-x-3">
             <NBButton
               onClick={() => {
                 resetForm();
                 setShowModal(true);
               }}
               className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-none hover:from-purple-600 hover:to-pink-600"
             >
               Add New Career
             </NBButton>
           </div>
        </div>

        {/* Careers Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading careers...</p>
          </div>
         ) : careers.length === 0 ? (
           <NBCard className="p-12 text-center">
             <Briefcase className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
             <p className="text-muted-foreground mb-4">Loading careers...</p>
           </NBCard>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {careers.map((career) => (
              <NBCard key={career._id} className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-foreground line-clamp-2 mb-2">
                      {career.title}
                    </h3>
                    <div className="flex flex-wrap gap-2 mb-2">
                      <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">
                        {career.domain}
                      </span>
                      <span className="text-xs bg-pink-100 text-pink-800 px-2 py-1 rounded">
                        {career.subdomain}
                      </span>
                    </div>
                  </div>
                </div>
                
                <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                  {career.description}
                </p>
                
                <div className="flex justify-between items-center pt-4 border-t">
                  <div className="text-sm">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      career.isActive 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {career.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                   <div className="flex space-x-2">
                     {!career.fromTaxonomy && (
                       <>
                         <NBButton
                           size="sm"
                           variant="secondary"
                           onClick={() => handleEdit(career)}
                         >
                           <Edit className="w-4 h-4" />
                         </NBButton>
                         <NBButton
                           size="sm"
                           variant="secondary"
                           onClick={() => handleDelete(career.id, career.title)}
                           className="text-red-600 hover:bg-red-50"
                         >
                           <Trash2 className="w-4 h-4" />
                         </NBButton>
                       </>
                     )}
                     {career.fromTaxonomy && (
                       <span className="text-xs text-blue-600 px-2 py-1 bg-blue-50 rounded">
                         From Taxonomy
                       </span>
                     )}
                   </div>
                </div>
              </NBCard>
            ))}
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full my-8">
            <div className="p-6 border-b flex justify-between items-center">
              <h2 className="text-2xl font-bold text-foreground">
                {editingCareer ? 'Edit Career' : 'Add New Career'}
              </h2>
              <button
                onClick={() => {
                  setShowModal(false);
                  resetForm();
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Career ID * (unique)
                </label>
                <input
                  type="text"
                  required
                  value={formData.id}
                  onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                  placeholder="e.g., software-engineer"
                  disabled={!!editingCareer}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Job Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., Software Engineer"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Domain *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.domain}
                    onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
                    placeholder="e.g., Technology"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Subdomain *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.subdomain}
                    onChange={(e) => setFormData({ ...formData, subdomain: e.target.value })}
                    placeholder="e.g., Software Development"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description *
                </label>
                <textarea
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief description of the career..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Min Salary
                  </label>
                  <input
                    type="number"
                    value={formData.salary.min}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      salary: { ...formData.salary, min: Number(e.target.value) }
                    })}
                    placeholder="60000"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Max Salary
                  </label>
                  <input
                    type="number"
                    value={formData.salary.max}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      salary: { ...formData.salary, max: Number(e.target.value) }
                    })}
                    placeholder="120000"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Growth Outlook
                </label>
                <input
                  type="text"
                  value={formData.growth}
                  onChange={(e) => setFormData({ ...formData, growth: e.target.value })}
                  placeholder="e.g., High, 15% annually"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Required Skills (comma-separated)
                </label>
                <input
                  type="text"
                  value={formData.skills.join(', ')}
                  onChange={(e) => handleArrayInput('skills', e.target.value)}
                  placeholder="JavaScript, React, Node.js"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Experience Levels (comma-separated)
                </label>
                <input
                  type="text"
                  value={formData.experienceLevels.join(', ')}
                  onChange={(e) => handleArrayInput('experienceLevels', e.target.value)}
                  placeholder="Entry, Mid, Senior"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="mr-2"
                />
                <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
                  Active (visible to users)
                </label>
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t">
                <NBButton
                  type="button"
                  variant="secondary"
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                >
                  Cancel
                </NBButton>
                <NBButton
                  type="submit"
                  className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-none hover:from-purple-600 hover:to-pink-600"
                >
                  {editingCareer ? 'Update Career' : 'Create Career'}
                </NBButton>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

