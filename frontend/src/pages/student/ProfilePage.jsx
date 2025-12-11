import { useQuery } from '@tanstack/react-query';
import Header from '../../components/common/Header';
import Sidebar from '../../components/common/Sidebar';
import { studentService } from '../../services/studentService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { formatScore, formatDate } from '../../utils/helpers';
import { Trophy, Award } from 'lucide-react';

const ProfilePage = () => {
  const { data: profileData, isLoading: profileLoading } = useQuery({
    queryKey: ['studentProfile'],
    queryFn: () => studentService.getProfile()
  });

  const { data: scoreData, isLoading: scoreLoading } = useQuery({
    queryKey: ['studentScore'],
    queryFn: () => studentService.getScore()
  });

  const { data: achievementsData, isLoading: achievementsLoading } = useQuery({
    queryKey: ['studentAchievements'],
    queryFn: () => studentService.getAchievements()
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

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-8">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">My Profile</h1>

            {/* Score Section - Updated with new fields */}
            <div className="card mb-6">
              <h2 className="text-xl font-semibold mb-4">Academic Score</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Total Points</p>
                  <p className="text-3xl font-bold text-blue-600">{score?.total_points || 0}</p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Course Points</p>
                  <p className="text-3xl font-bold text-green-600">{score?.total_course_points || 0}</p>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Project Points</p>
                  <p className="text-3xl font-bold text-purple-600">{score?.total_project_points || 0}</p>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Hackathon Points</p>
                  <p className="text-3xl font-bold text-orange-600">{score?.total_hackathon_points || 0}</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                <div>
                  <p className="text-sm text-gray-600">Courses Completed</p>
                  <p className="text-xl font-bold">{score?.courses_completed_count || 0}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Projects Approved</p>
                  <p className="text-xl font-bold">{score?.projects_approved_count || 0}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Hackathons</p>
                  <p className="text-xl font-bold">{score?.hackathons_approved_count || 0}</p>
                </div>
              </div>
              {score?.master_certificate_issued && (
                <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-yellow-600" />
                  <span className="font-semibold text-yellow-800">Master Certificate Issued</span>
                </div>
              )}
            </div>

            {/* Achievements Section */}
            {achievements?.achievements && achievements.achievements.length > 0 && (
              <div className="card mb-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Award className="w-5 h-5" />
                  Achievements ({achievements.total_count})
                </h2>
                <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-gray-600">Total Achievement Points</p>
                  <p className="text-2xl font-bold text-blue-600">{achievements.total_points || 0}</p>
                </div>
                <div className="space-y-3">
                  {Object.entries(achievements.grouped || {}).map(([type, items]) => (
                    <div key={type} className="border border-gray-200 rounded-lg p-4">
                      <h3 className="font-semibold mb-2 capitalize">{type.replace('_', ' ')}</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {items.map((achievement) => (
                          <div key={achievement.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                            <div>
                              <p className="text-sm font-medium">{achievement.source_type}</p>
                              <p className="text-xs text-gray-600">{formatDate(achievement.awarded_at)}</p>
                            </div>
                            <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-sm font-medium">
                              +{achievement.points_awarded} pts
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Profile Info */}
            <div className="card mb-6">
              <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
              <div className="space-y-2">
                <p><strong>Name:</strong> {profile?.name}</p>
                <p><strong>Email:</strong> {profile?.email}</p>
              </div>
            </div>

            {/* Courses */}
            {profile?.courses && profile.courses.length > 0 && (
              <div className="card mb-6">
                <h2 className="text-xl font-semibold mb-4">Courses</h2>
                <div className="space-y-3">
                  {profile.courses.slice(0, 5).map((course) => (
                    <div key={course.id} className="border-b border-gray-200 pb-3 last:border-0">
                      <p className="font-medium">{course.course_title}</p>
                      <p className="text-sm text-gray-600">Progress: {course.progress}%</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Certificates - Fixed field names */}
            {profile?.certificates && profile.certificates.length > 0 && (
              <div className="card">
                <h2 className="text-xl font-semibold mb-4">Certificates</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {profile.certificates.map((cert) => (
                    <div key={cert.id} className="border border-gray-200 rounded-lg p-4">
                      <p className="font-medium">{cert.course_title || 'Certificate'}</p>
                      <p className="text-sm text-gray-600">{formatDate(cert.issued_at)}</p>
                      {cert.certificate_url && (
                        <a href={cert.certificate_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 text-sm mt-2 inline-block hover:underline">
                          View Certificate →
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default ProfilePage;

