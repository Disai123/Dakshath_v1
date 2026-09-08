import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { User, GraduationCap, Briefcase, FileText, Edit, Save, X } from 'lucide-react';
import Header from '../../components/common/Header';
import Sidebar from '../../components/common/Sidebar';
import BackLink from '../../components/common/BackLink';
import { studentService } from '../../services/studentService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ProfileCompletionBar from '../../components/student/ProfileCompletionBar';
import MultiInput from '../../components/common/MultiInput';
import { formatScore, formatDate } from '../../utils/helpers';
import { Trophy, Award } from 'lucide-react';
import { SHOW_HACKATHON_IN_DAKSHATH } from '../../utils/constants';


const ProfilePage = () => {
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    skills: []
  });

  const { data: profileData, isLoading: profileLoading } = useQuery({
    queryKey: ['studentProfile'],
    queryFn: () => studentService.getProfile(),
    onSuccess: (data) => {
      setFormData({
        ...data.data,
        skills: data.data.skills || []
      });
    }
  });

  const { data: scoreData, isLoading: scoreLoading } = useQuery({
    queryKey: ['studentScore'],
    queryFn: () => studentService.getScore()
  });

  const { data: achievementsData, isLoading: achievementsLoading } = useQuery({
    queryKey: ['studentAchievements'],
    queryFn: () => studentService.getAchievements()
  });

  const updateMutation = useMutation({
    mutationFn: studentService.updateProfile,
    onSuccess: (response) => {
      queryClient.invalidateQueries(['studentProfile']);
      setIsEditing(false);
      alert('Profile updated successfully!');
    },
    onError: (error) => {
      alert(error.response?.data?.error?.message || 'Failed to update profile');
    }
  });

  if (profileLoading || scoreLoading || achievementsLoading) {
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

  const profile = profileData?.data;
  const score = scoreData?.data;
  const achievements = achievementsData?.data;
  const profileCompletion = profileData?.data?.profile_completion_percentage || 0;

  // When hackathons are hidden, recompute count/points from visible groups only (API totals still include them).
  const visibleAchievementGroups = Object.fromEntries(
    Object.entries(achievements?.grouped || {}).filter(
      ([type]) => SHOW_HACKATHON_IN_DAKSHATH || type !== 'hackathon_approval'
    )
  );
  const visibleAchievementItems = Object.values(visibleAchievementGroups).flat();
  const visibleAchievementCount = visibleAchievementItems.length;
  const visibleAchievementPoints = visibleAchievementItems.reduce(
    (sum, item) => sum + (Number(item.points_awarded) || 0),
    0
  );

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateMutation.mutate(formData);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-8">
          <div className="max-w-5xl mx-auto">
            <BackLink to="/dashboard" label="Back to Dashboard" />
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="btn-secondary flex items-center gap-2"
                >
                  <Edit className="w-4 h-4" />
                  Edit Profile
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={handleSubmit}
                    disabled={updateMutation.isPending}
                    className="btn-primary flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      setFormData({ ...profile, skills: profile.skills || [] });
                    }}
                    className="btn-secondary flex items-center gap-2"
                  >
                    <X className="w-4 h-4" />
                    Cancel
                  </button>
                </div>
              )}
            </div>

            {/* Profile Completion */}
            <ProfileCompletionBar percentage={profileCompletion} />

            <form onSubmit={handleSubmit} className="mt-6 space-y-6">
              {/* Personal Information Section */}
              <div className="card">
                <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                  <User className="w-5 h-5 text-primary" />
                  Personal Information
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Name
                    </label>
                    <input
                      type="text"
                      value={formData.name || ''}
                      disabled
                      className="input-field bg-gray-100"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={formData.email || ''}
                      disabled
                      className="input-field bg-gray-100"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
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

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      value={formData.date_of_birth ? formData.date_of_birth.split('T')[0] : ''}
                      disabled={!isEditing}
                      onChange={(e) => handleInputChange('date_of_birth', e.target.value)}
                      className="input-field disabled:bg-gray-100"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Gender
                    </label>
                    <select
                      value={formData.gender || ''}
                      disabled={!isEditing}
                      onChange={(e) => handleInputChange('gender', e.target.value)}
                      className="input-field disabled:bg-gray-100"
                    >
                      <option value="">Select gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                      <option value="Prefer not to say">Prefer not to say</option>
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Address
                    </label>
                    <textarea
                      rows={2}
                      value={formData.address || ''}
                      disabled={!isEditing}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      placeholder="Full address"
                      className="input-field disabled:bg-gray-100"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      City
                    </label>
                    <input
                      type="text"
                      value={formData.city || ''}
                      disabled={!isEditing}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      placeholder="e.g., Bangalore"
                      className="input-field disabled:bg-gray-100"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      State
                    </label>
                    <input
                      type="text"
                      value={formData.state || ''}
                      disabled={!isEditing}
                      onChange={(e) => handleInputChange('state', e.target.value)}
                      placeholder="e.g., Karnataka"
                      className="input-field disabled:bg-gray-100"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Country
                    </label>
                    <input
                      type="text"
                      value={formData.country || ''}
                      disabled={!isEditing}
                      onChange={(e) => handleInputChange('country', e.target.value)}
                      placeholder="e.g., India"
                      className="input-field disabled:bg-gray-100"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Pincode
                    </label>
                    <input
                      type="text"
                      value={formData.pincode || ''}
                      disabled={!isEditing}
                      onChange={(e) => handleInputChange('pincode', e.target.value)}
                      placeholder="e.g., 560001"
                      className="input-field disabled:bg-gray-100"
                    />
                  </div>
                </div>
              </div>

              {/* Education Section */}
              <div className="card">
                <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-primary" />
                  Education
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Current Education Level
                    </label>
                    <select
                      value={formData.current_education || ''}
                      disabled={!isEditing}
                      onChange={(e) => handleInputChange('current_education', e.target.value)}
                      className="input-field disabled:bg-gray-100"
                    >
                      <option value="">Select level</option>
                      <option value="High School">High School</option>
                      <option value="Undergraduate">Undergraduate</option>
                      <option value="Graduate">Graduate</option>
                      <option value="Postgraduate">Postgraduate</option>
                      <option value="PhD">PhD</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Institution Name
                    </label>
                    <input
                      type="text"
                      value={formData.institution || ''}
                      disabled={!isEditing}
                      onChange={(e) => handleInputChange('institution', e.target.value)}
                      placeholder="e.g., ABC University"
                      className="input-field disabled:bg-gray-100"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Graduation Year
                    </label>
                    <input
                      type="number"
                      min="2000"
                      max="2030"
                      value={formData.graduation_year || ''}
                      disabled={!isEditing}
                      onChange={(e) => handleInputChange('graduation_year', parseInt(e.target.value))}
                      placeholder="e.g., 2024"
                      className="input-field disabled:bg-gray-100"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      CGPA / Percentage
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      max="10"
                      value={formData.cgpa || ''}
                      disabled={!isEditing}
                      onChange={(e) => handleInputChange('cgpa', parseFloat(e.target.value))}
                      placeholder="e.g., 8.5"
                      className="input-field disabled:bg-gray-100"
                    />
                  </div>
                </div>
              </div>

              {/* Professional Section */}
              <div className="card">
                <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-primary" />
                  Professional Information
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Bio / Summary
                    </label>
                    <textarea
                      rows={4}
                      value={formData.bio || ''}
                      disabled={!isEditing}
                      onChange={(e) => handleInputChange('bio', e.target.value)}
                      placeholder="Tell us about yourself, your interests, and career goals..."
                      className="input-field disabled:bg-gray-100"
                    />
                  </div>

                  {isEditing ? (
                    <MultiInput
                      label="Skills"
                      values={formData.skills}
                      onChange={(values) => handleInputChange('skills', values)}
                      placeholder="Add a skill (e.g., Python, React, etc.)"
                    />
                  ) : (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Skills
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {formData.skills?.length > 0 ? (
                          formData.skills.map((skill, index) => (
                            <span key={index} className="badge badge-info">
                              {skill}
                            </span>
                          ))
                        ) : (
                          <p className="text-gray-500 text-sm">No skills added</p>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        LinkedIn URL
                      </label>
                      <input
                        type="url"
                        value={formData.linkedin_url || ''}
                        disabled={!isEditing}
                        onChange={(e) => handleInputChange('linkedin_url', e.target.value)}
                        placeholder="https://linkedin.com/in/..."
                        className="input-field disabled:bg-gray-100"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        GitHub URL
                      </label>
                      <input
                        type="url"
                        value={formData.github_url || ''}
                        disabled={!isEditing}
                        onChange={(e) => handleInputChange('github_url', e.target.value)}
                        placeholder="https://github.com/..."
                        className="input-field disabled:bg-gray-100"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Portfolio URL
                      </label>
                      <input
                        type="url"
                        value={formData.portfolio_url || ''}
                        disabled={!isEditing}
                        onChange={(e) => handleInputChange('portfolio_url', e.target.value)}
                        placeholder="https://yourportfolio.com"
                        className="input-field disabled:bg-gray-100"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Documents Section */}
              <div className="card">
                <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-primary" />
                  Documents
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Resume URL
                    </label>
                    <input
                      type="url"
                      value={formData.resume_url || ''}
                      disabled={!isEditing}
                      onChange={(e) => handleInputChange('resume_url', e.target.value)}
                      placeholder="https://drive.google.com/... or https://imgur.com/..."
                      className="input-field disabled:bg-gray-100"
                    />
                    {formData.resume_url && (
                      <a
                        href={formData.resume_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-primary hover:underline mt-1 inline-block"
                      >
                        View Resume →
                      </a>
                    )}
                  </div>

                  {isEditing && (
                    <div className="bg-primary-light border border-primary/20 rounded-lg p-3">
                      <p className="text-sm text-primary">
                        💡 <strong>Tip:</strong> Upload your resume to Google Drive, Dropbox, or any file hosting service and paste the shareable link here.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Academic Score Section */}
              <div className="card">
                <h2 className="text-xl font-semibold mb-4">Academic Score</h2>
                <div className={`grid grid-cols-2 ${SHOW_HACKATHON_IN_DAKSHATH ? 'md:grid-cols-4' : 'md:grid-cols-3'} gap-4 mb-4`}>
                  <div className="text-center p-4 bg-primary-light rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Total Points</p>
                    <p className="text-3xl font-bold text-primary">
                      {SHOW_HACKATHON_IN_DAKSHATH
                        ? (score?.total_points || 0)
                        : ((score?.total_course_points || 0) + (score?.total_project_points || 0))}
                    </p>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Course Points</p>
                    <p className="text-3xl font-bold text-green-600">{score?.total_course_points || 0}</p>
                  </div>
                  <div className="text-center p-4 bg-secondary-light rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Project Points</p>
                    <p className="text-3xl font-bold text-secondary-dark">{score?.total_project_points || 0}</p>
                  </div>
                  {SHOW_HACKATHON_IN_DAKSHATH && (
                    <div className="text-center p-4 bg-orange-50 rounded-lg">
                      <p className="text-sm text-gray-600 mb-1">Hackathon Points</p>
                      <p className="text-3xl font-bold text-orange-600">{score?.total_hackathon_points || 0}</p>
                    </div>
                  )}
                </div>
                <div className={`grid ${SHOW_HACKATHON_IN_DAKSHATH ? 'grid-cols-3' : 'grid-cols-2'} gap-4 pt-4 border-t`}>
                  <div>
                    <p className="text-sm text-gray-600">Courses Completed</p>
                    <p className="text-xl font-bold">{score?.courses_completed_count || 0}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Projects Approved</p>
                    <p className="text-xl font-bold">{score?.projects_approved_count || 0}</p>
                  </div>
                  {SHOW_HACKATHON_IN_DAKSHATH && (
                    <div>
                      <p className="text-sm text-gray-600">Hackathons</p>
                      <p className="text-xl font-bold">{score?.hackathons_approved_count || 0}</p>
                    </div>
                  )}
                </div>
                {score?.master_certificate_issued && (
                  <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-yellow-600" />
                    <span className="font-semibold text-yellow-800">Master Certificate Issued</span>
                  </div>
                )}
              </div>

              {/* Achievements Section */}
              {visibleAchievementCount > 0 && (
                <div className="card">
                  <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <Award className="w-5 h-5" />
                    Achievements ({SHOW_HACKATHON_IN_DAKSHATH ? (achievements.total_count) : visibleAchievementCount})
                  </h2>
                  <div className="mb-4 p-3 bg-primary-light rounded-lg">
                    <p className="text-sm text-gray-600">Total Achievement Points</p>
                    <p className="text-2xl font-bold text-primary">
                      {SHOW_HACKATHON_IN_DAKSHATH ? (achievements.total_points || 0) : visibleAchievementPoints}
                    </p>
                  </div>
                  <div className="space-y-3">
                    {Object.entries(visibleAchievementGroups).map(([type, items]) => (
                      <div key={type} className="border border-gray-200 rounded-lg p-4">
                        <h3 className="font-semibold mb-2 capitalize">{type.replace('_', ' ')}</h3>
                        <div className="space-y-2">
                          {items.map((achievement) => (
                            <div key={achievement.id} className="p-3 bg-gray-50 rounded-lg">
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex-1">
                                  <p className="text-sm font-medium">{achievement.source_type}</p>
                                  <p className="text-xs text-gray-600">{formatDate(achievement.awarded_at)}</p>
                                </div>
                                <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-sm font-medium">
                                  +{achievement.points_awarded} pts
                                </span>
                              </div>
                              {/* Display submission URL for hackathons and realtime projects */}
                              {achievement.reference_data && (
                                <div className="mt-2 pt-2 border-t border-gray-200">
                                  {(achievement.reference_data.submission_url || achievement.reference_data.project_url) && (
                                    <div className="flex items-center gap-2">
                                      <span className="text-xs text-gray-600">Submission:</span>
                                      <a
                                        href={achievement.reference_data.submission_url || achievement.reference_data.project_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-xs text-primary hover:underline flex items-center gap-1"
                                      >
                                        View Project →
                                      </a>
                                    </div>
                                  )}
                                  {achievement.reference_data.project_title && (
                                    <p className="text-xs text-gray-600 mt-1">
                                      <span className="font-medium">Title:</span> {achievement.reference_data.project_title}
                                    </p>
                                  )}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </form>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ProfilePage;
