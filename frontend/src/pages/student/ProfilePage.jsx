import { useQuery } from '@tanstack/react-query';
import Header from '../../components/common/Header';
import Sidebar from '../../components/common/Sidebar';
import { studentService } from '../../services/studentService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { formatScore, formatDate } from '../../utils/helpers';

const ProfilePage = () => {
  const { data: profileData, isLoading: profileLoading } = useQuery({
    queryKey: ['studentProfile'],
    queryFn: () => studentService.getProfile()
  });

  const { data: scoreData, isLoading: scoreLoading } = useQuery({
    queryKey: ['studentScore'],
    queryFn: () => studentService.getScore()
  });

  if (profileLoading || scoreLoading) {
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

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-8">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">My Profile</h1>

            {/* Score Section */}
            <div className="card mb-6">
              <h2 className="text-xl font-semibold mb-4">Academic Score</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Overall Score</p>
                  <p className="text-2xl font-bold text-primary">{formatScore(score?.overall_score)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Test Average</p>
                  <p className="text-2xl font-bold">{formatScore(score?.test_average)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Course Average</p>
                  <p className="text-2xl font-bold">{formatScore(score?.course_average)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Hackathon Average</p>
                  <p className="text-2xl font-bold">{formatScore(score?.hackathon_average)}</p>
                </div>
              </div>
            </div>

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

            {/* Certificates */}
            {profile?.certificates && profile.certificates.length > 0 && (
              <div className="card">
                <h2 className="text-xl font-semibold mb-4">Certificates</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {profile.certificates.map((cert) => (
                    <div key={cert.id} className="border border-gray-200 rounded-lg p-4">
                      <p className="font-medium">{cert.certificate_name}</p>
                      <p className="text-sm text-gray-600">{formatDate(cert.issued_at)}</p>
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

