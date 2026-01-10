import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import { Building2, MapPin, Globe, Phone, Mail, Linkedin, Twitter, Users, Calendar, Award, Heart, Code, Image as ImageIcon } from 'lucide-react';
import Header from '../../components/common/Header';
import Sidebar from '../../components/common/Sidebar';
import { companyService } from '../../services/companyService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import MultiInput from '../../components/common/MultiInput';

const CompanyProfilePage = () => {
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    specialties: [],
    benefits: [],
    tech_stack: [],
    values: [],
    certifications: [],
    gallery_images: []
  });

  const { data, isLoading } = useQuery({
    queryKey: ['companyProfile'],
    queryFn: () => companyService.getCompanyProfile()
  });

  // Populate form data when company profile is loaded
  useEffect(() => {
    if (data?.data) {
      setFormData({
        ...data.data,
        specialties: data.data.specialties || [],
        benefits: data.data.benefits || [],
        tech_stack: data.data.tech_stack || [],
        values: data.data.values || [],
        certifications: data.data.certifications || [],
        gallery_images: data.data.gallery_images || []
      });
    }
  }, [data]);

  const updateMutation = useMutation({
    mutationFn: companyService.updateCompanyProfile,
    onSuccess: () => {
      queryClient.invalidateQueries(['companyProfile']);
      setIsEditing(false);
    }
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex">
          <Sidebar />
          <div className="flex-1 p-8">
            <LoadingSpinner size="lg" />
          </div>
        </div>
      </div>
    );
  }

  const company = data?.data;

  const handleSubmit = (e) => {
    e.preventDefault();
    updateMutation.mutate(formData);
  };

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-8">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-3xl font-bold text-gray-900">Company Profile</h1>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="btn-secondary"
              >
                {isEditing ? 'Cancel' : 'Edit Profile'}
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information Section */}
              <div className="card">
                <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-primary" />
                  Basic Information
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Company Name
                    </label>
                    <input
                      type="text"
                      value={formData.company_name || ''}
                      disabled={true}
                      className="input-field bg-gray-100"
                    />
                    <p className="text-xs text-gray-500 mt-1">Contact admin to change company name</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      rows={4}
                      value={formData.description || ''}
                      disabled={!isEditing}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      placeholder="Tell us about your company..."
                      className="input-field disabled:bg-gray-100"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Industry
                      </label>
                      <input
                        type="text"
                        value={formData.industry || ''}
                        disabled={!isEditing}
                        onChange={(e) => handleInputChange('industry', e.target.value)}
                        placeholder="e.g., Technology, Healthcare"
                        className="input-field disabled:bg-gray-100"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Company Type
                      </label>
                      <select
                        value={formData.company_type || ''}
                        disabled={!isEditing}
                        onChange={(e) => handleInputChange('company_type', e.target.value)}
                        className="input-field disabled:bg-gray-100"
                      >
                        <option value="">Select type</option>
                        <option value="Startup">Startup</option>
                        <option value="SME">SME</option>
                        <option value="MNC">MNC</option>
                        <option value="Government">Government</option>
                        <option value="Non-profit">Non-profit</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Company Size
                      </label>
                      <select
                        value={formData.company_size || ''}
                        disabled={!isEditing}
                        onChange={(e) => handleInputChange('company_size', e.target.value)}
                        className="input-field disabled:bg-gray-100"
                      >
                        <option value="">Select size</option>
                        <option value="1-10">1-10 employees</option>
                        <option value="11-50">11-50 employees</option>
                        <option value="51-200">51-200 employees</option>
                        <option value="201-500">201-500 employees</option>
                        <option value="501-1000">501-1000 employees</option>
                        <option value="1000+">1000+ employees</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Calendar className="w-4 h-4 inline mr-1" />
                      Founded Year
                    </label>
                    <input
                      type="number"
                      min="1800"
                      max={new Date().getFullYear()}
                      value={formData.founded_year || ''}
                      disabled={!isEditing}
                      onChange={(e) => handleInputChange('founded_year', parseInt(e.target.value))}
                      placeholder="e.g., 2020"
                      className="input-field disabled:bg-gray-100"
                    />
                  </div>
                </div>
              </div>

              {/* Location & Contact Section */}
              <div className="card">
                <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-primary" />
                  Location & Contact
                </h2>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Headquarters Address
                      </label>
                      <input
                        type="text"
                        value={formData.headquarters || ''}
                        disabled={!isEditing}
                        onChange={(e) => handleInputChange('headquarters', e.target.value)}
                        placeholder="Full address"
                        className="input-field disabled:bg-gray-100"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        City/Location
                      </label>
                      <input
                        type="text"
                        value={formData.location || ''}
                        disabled={!isEditing}
                        onChange={(e) => handleInputChange('location', e.target.value)}
                        placeholder="e.g., Bangalore, India"
                        className="input-field disabled:bg-gray-100"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Globe className="w-4 h-4 inline mr-1" />
                        Website URL
                      </label>
                      <input
                        type="url"
                        value={formData.website || ''}
                        disabled={!isEditing}
                        onChange={(e) => handleInputChange('website', e.target.value)}
                        placeholder="https://example.com"
                        className="input-field disabled:bg-gray-100"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Phone className="w-4 h-4 inline mr-1" />
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={formData.phone || ''}
                        disabled={!isEditing}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        placeholder="+91 1234567890"
                        className="input-field disabled:bg-gray-100"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Mail className="w-4 h-4 inline mr-1" />
                      Contact Email
                    </label>
                    <input
                      type="email"
                      value={formData.email || ''}
                      disabled={true}
                      className="input-field bg-gray-100"
                    />
                    <p className="text-xs text-gray-500 mt-1">Primary email cannot be changed</p>
                  </div>
                </div>
              </div>

              {/* Social Media Section */}
              <div className="card">
                <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary" />
                  Social Media
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Linkedin className="w-4 h-4 inline mr-1 text-blue-600" />
                      LinkedIn Profile
                    </label>
                    <input
                      type="url"
                      value={formData.linkedin_url || ''}
                      disabled={!isEditing}
                      onChange={(e) => handleInputChange('linkedin_url', e.target.value)}
                      placeholder="https://linkedin.com/company/..."
                      className="input-field disabled:bg-gray-100"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Twitter className="w-4 h-4 inline mr-1 text-blue-400" />
                      Twitter/X Profile
                    </label>
                    <input
                      type="url"
                      value={formData.twitter_url || ''}
                      disabled={!isEditing}
                      onChange={(e) => handleInputChange('twitter_url', e.target.value)}
                      placeholder="https://twitter.com/..."
                      className="input-field disabled:bg-gray-100"
                    />
                  </div>
                </div>
              </div>

              {/* Company Culture & Values Section */}
              <div className="card">
                <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                  <Heart className="w-5 h-5 text-primary" />
                  Company Culture & Values
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mission Statement
                    </label>
                    <textarea
                      rows={3}
                      value={formData.mission_statement || ''}
                      disabled={!isEditing}
                      onChange={(e) => handleInputChange('mission_statement', e.target.value)}
                      placeholder="What is your company's mission?"
                      className="input-field disabled:bg-gray-100"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Vision Statement
                    </label>
                    <textarea
                      rows={3}
                      value={formData.vision_statement || ''}
                      disabled={!isEditing}
                      onChange={(e) => handleInputChange('vision_statement', e.target.value)}
                      placeholder="What is your company's vision?"
                      className="input-field disabled:bg-gray-100"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Company Culture
                    </label>
                    <textarea
                      rows={4}
                      value={formData.company_culture || ''}
                      disabled={!isEditing}
                      onChange={(e) => handleInputChange('company_culture', e.target.value)}
                      placeholder="Describe your company culture and work environment..."
                      className="input-field disabled:bg-gray-100"
                    />
                  </div>

                  {isEditing ? (
                    <MultiInput
                      label="Core Values"
                      values={formData.values}
                      onChange={(values) => handleInputChange('values', values)}
                      placeholder="Add a core value..."
                    />
                  ) : (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Core Values
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {formData.values?.length > 0 ? (
                          formData.values.map((value, index) => (
                            <span key={index} className="badge badge-info">
                              {value}
                            </span>
                          ))
                        ) : (
                          <p className="text-gray-500 text-sm">No values added</p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Work Environment Section */}
              <div className="card">
                <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                  <Code className="w-5 h-5 text-primary" />
                  Work Environment
                </h2>

                <div className="space-y-4">
                  {isEditing ? (
                    <>
                      <MultiInput
                        label="Specialties / Focus Areas"
                        values={formData.specialties}
                        onChange={(values) => handleInputChange('specialties', values)}
                        placeholder="Add a specialty..."
                      />

                      <MultiInput
                        label="Tech Stack"
                        values={formData.tech_stack}
                        onChange={(values) => handleInputChange('tech_stack', values)}
                        placeholder="Add a technology..."
                      />

                      <MultiInput
                        label="Employee Benefits"
                        values={formData.benefits}
                        onChange={(values) => handleInputChange('benefits', values)}
                        placeholder="Add a benefit..."
                      />

                      <MultiInput
                        label="Certifications & Awards"
                        values={formData.certifications}
                        onChange={(values) => handleInputChange('certifications', values)}
                        placeholder="Add a certification or award..."
                      />
                    </>
                  ) : (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Specialties / Focus Areas
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {formData.specialties?.length > 0 ? (
                            formData.specialties.map((item, index) => (
                              <span key={index} className="badge badge-info">{item}</span>
                            ))
                          ) : (
                            <p className="text-gray-500 text-sm">No specialties added</p>
                          )}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Tech Stack
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {formData.tech_stack?.length > 0 ? (
                            formData.tech_stack.map((item, index) => (
                              <span key={index} className="badge badge-success">{item}</span>
                            ))
                          ) : (
                            <p className="text-gray-500 text-sm">No tech stack added</p>
                          )}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Employee Benefits
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {formData.benefits?.length > 0 ? (
                            formData.benefits.map((item, index) => (
                              <span key={index} className="badge badge-warning">{item}</span>
                            ))
                          ) : (
                            <p className="text-gray-500 text-sm">No benefits added</p>
                          )}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          <Award className="w-4 h-4 inline mr-1" />
                          Certifications & Awards
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {formData.certifications?.length > 0 ? (
                            formData.certifications.map((item, index) => (
                              <span key={index} className="badge badge-error">{item}</span>
                            ))
                          ) : (
                            <p className="text-gray-500 text-sm">No certifications added</p>
                          )}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Media Section */}
              <div className="card">
                <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                  <ImageIcon className="w-5 h-5 text-primary" />
                  Company Media
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Company Logo URL
                    </label>
                    <input
                      type="url"
                      value={formData.logo_url || ''}
                      disabled={!isEditing}
                      onChange={(e) => handleInputChange('logo_url', e.target.value)}
                      placeholder="https://example.com/logo.png"
                      className="input-field disabled:bg-gray-100"
                    />
                    {formData.logo_url && (
                      <div className="mt-2">
                        <img src={formData.logo_url} alt="Company Logo" className="h-20 object-contain" />
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Cover Image URL
                    </label>
                    <input
                      type="url"
                      value={formData.cover_image_url || ''}
                      disabled={!isEditing}
                      onChange={(e) => handleInputChange('cover_image_url', e.target.value)}
                      placeholder="https://example.com/cover.png"
                      className="input-field disabled:bg-gray-100"
                    />
                    {formData.cover_image_url && (
                      <div className="mt-2">
                        <img src={formData.cover_image_url} alt="Cover" className="w-full h-40 object-cover rounded-lg" />
                      </div>
                    )}
                  </div>

                  <div>
                    <p className="text-sm text-gray-600 bg-blue-50 border border-blue-200 rounded-lg p-3">
                      💡 <strong>Tip:</strong> Upload images to a service like Imgur or Cloudinary and paste the URL here.
                    </p>
                  </div>
                </div>
              </div>

              {isEditing && (
                <div className="flex gap-4">
                  <button
                    type="submit"
                    className="btn-primary flex-1"
                    disabled={updateMutation.isPending}
                  >
                    {updateMutation.isPending ? 'Saving...' : 'Save All Changes'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </form>
          </div>
        </main>
      </div>
    </div>
  );
};

export default CompanyProfilePage;
