import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { useState } from 'react';
import { User, GraduationCap, Briefcase, FileText, Download, Mail, Phone, MapPin, Calendar, Award, Trophy, ExternalLink } from 'lucide-react';
import Header from '../../components/common/Header';
import Sidebar from '../../components/common/Sidebar';
import BackLink from '../../components/common/BackLink';
import { studentService } from '../../services/studentService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { formatDate } from '../../utils/helpers';
import { SHOW_HACKATHON_IN_DAKSHATH } from '../../utils/constants';

const StudentProfileView = () => {
    const { id } = useParams();
    const [downloading, setDownloading] = useState(false);

    const { data: profileData, isLoading: profileLoading } = useQuery({
        queryKey: ['studentProfile', id],
        queryFn: () => studentService.getProfile(id),
        refetchOnMount: 'always',
        staleTime: 0 // Always fetch fresh data
    });

    const { data: scoreData, isLoading: scoreLoading } = useQuery({
        queryKey: ['studentScore', id],
        queryFn: () => studentService.getScore(id),
        refetchOnMount: 'always',
        staleTime: 0
    });

    const { data: achievementsData, isLoading: achievementsLoading } = useQuery({
        queryKey: ['studentAchievements', id],
        queryFn: () => studentService.getAchievements(id),
        refetchOnMount: 'always',
        staleTime: 0
    });

    const handleDownload = async () => {
        try {
            setDownloading(true);
            const pdfBlob = await studentService.downloadProfile(id);

            // Create a blob URL and download as PDF file
            const blob = new Blob([pdfBlob], { type: 'application/pdf' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${profileData?.data?.name?.replace(/\s+/g, '_')}_Profile_${new Date().toISOString().split('T')[0]}.pdf`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);

            alert('Profile downloaded successfully!');
        } catch (error) {
            alert('Failed to download profile: ' + (error.response?.data?.error?.message || error.message));
        } finally {
            setDownloading(false);
        }
    };

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

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />
            <div className="flex">
                <Sidebar />
                <main className="flex-1 p-8">
                    <div className="max-w-5xl mx-auto">
                        {/* Header with Back and Download */}
                        <div className="flex items-center justify-between mb-8">
                            <BackLink to="/hr/applications" label="Back to Applications" className="mb-0" />
                            <button
                                onClick={handleDownload}
                                disabled={downloading}
                                className="btn-primary flex items-center gap-2"
                            >
                                <Download className="w-4 h-4" />
                                {downloading ? 'Downloading...' : 'Download Profile'}
                            </button>
                        </div>

                        <h1 className="text-3xl font-bold text-gray-900 mb-2">{profile?.name}'s Profile</h1>
                        <p className="text-gray-600 mb-8">Student Profile Overview</p>

                        {/* Profile Completion Status */}
                        {profile?.profile_completed && (
                            <div className="bg-success-light border border-success rounded-lg p-4 mb-6">
                                <p className="text-success font-semibold">
                                    ✓ Profile Completed on {formatDate(profile.profile_completed_at)}
                                </p>
                            </div>
                        )}

                        {/* Personal Information Section */}
                        <div className="card mb-6">
                            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                                <User className="w-5 h-5 text-primary" />
                                Personal Information
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="flex items-start gap-3">
                                    <Mail className="w-5 h-5 text-gray-400 mt-0.5" />
                                    <div>
                                        <p className="text-sm text-gray-600">Email</p>
                                        <p className="font-medium">{profile?.email || 'Not provided'}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <Phone className="w-5 h-5 text-gray-400 mt-0.5" />
                                    <div>
                                        <p className="text-sm text-gray-600">Phone</p>
                                        <p className="font-medium">{profile?.phone || 'Not provided'}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                                    <div>
                                        <p className="text-sm text-gray-600">Date of Birth</p>
                                        <p className="font-medium">{profile?.date_of_birth ? formatDate(profile.date_of_birth) : 'Not provided'}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <User className="w-5 h-5 text-gray-400 mt-0.5" />
                                    <div>
                                        <p className="text-sm text-gray-600">Gender</p>
                                        <p className="font-medium">{profile?.gender || 'Not provided'}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3 md:col-span-2">
                                    <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                                    <div>
                                        <p className="text-sm text-gray-600">Address</p>
                                        <p className="font-medium">
                                            {profile?.address || 'Not provided'}
                                            {profile?.city && `, ${profile.city}`}
                                            {profile?.state && `, ${profile.state}`}
                                            {profile?.country && `, ${profile.country}`}
                                            {profile?.pincode && ` - ${profile.pincode}`}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Education Section */}
                        <div className="card mb-6">
                            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                                <GraduationCap className="w-5 h-5 text-primary" />
                                Education
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-gray-600">Education Level</p>
                                    <p className="font-medium">{profile?.current_education || 'Not provided'}</p>
                                </div>

                                <div>
                                    <p className="text-sm text-gray-600">Institution</p>
                                    <p className="font-medium">{profile?.institution || 'Not provided'}</p>
                                </div>

                                <div>
                                    <p className="text-sm text-gray-600">Graduation Year</p>
                                    <p className="font-medium">{profile?.graduation_year || 'Not provided'}</p>
                                </div>

                                <div>
                                    <p className="text-sm text-gray-600">CGPA / Percentage</p>
                                    <p className="font-medium">{profile?.cgpa || 'Not provided'}</p>
                                </div>
                            </div>
                        </div>

                        {/* Professional Section */}
                        <div className="card mb-6">
                            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                                <Briefcase className="w-5 h-5 text-primary" />
                                Professional Information
                            </h2>

                            <div className="space-y-4">
                                {profile?.bio && (
                                    <div>
                                        <p className="text-sm text-gray-600 mb-1">Bio / Summary</p>
                                        <p className="text-gray-900">{profile.bio}</p>
                                    </div>
                                )}

                                <div>
                                    <p className="text-sm text-gray-600 mb-2">Skills</p>
                                    <div className="flex flex-wrap gap-2">
                                        {profile?.skills?.length > 0 ? (
                                            profile.skills.map((skill, index) => (
                                                <span key={index} className="badge badge-info">
                                                    {skill}
                                                </span>
                                            ))
                                        ) : (
                                            <p className="text-gray-500 text-sm">No skills added</p>
                                        )}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {profile?.linkedin_url && (
                                        <a
                                            href={profile.linkedin_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-2 text-primary hover:underline"
                                        >
                                            <ExternalLink className="w-4 h-4" />
                                            LinkedIn Profile
                                        </a>
                                    )}

                                    {profile?.github_url && (
                                        <a
                                            href={profile.github_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-2 text-primary hover:underline"
                                        >
                                            <ExternalLink className="w-4 h-4" />
                                            GitHub Profile
                                        </a>
                                    )}

                                    {profile?.portfolio_url && (
                                        <a
                                            href={profile.portfolio_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-2 text-primary hover:underline"
                                        >
                                            <ExternalLink className="w-4 h-4" />
                                            Portfolio
                                        </a>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Documents Section */}
                        {profile?.resume_url && (
                            <div className="card mb-6">
                                <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                                    <FileText className="w-5 h-5 text-primary" />
                                    Documents
                                </h2>

                                <a
                                    href={profile.resume_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 text-primary hover:underline font-medium"
                                >
                                    <FileText className="w-5 h-5" />
                                    View Resume / CV
                                    <ExternalLink className="w-4 h-4" />
                                </a>
                            </div>
                        )}

                        {/* Academic Score Section */}
                        <div className="card mb-6">
                            <h2 className="text-xl font-semibold mb-4">Academic Performance</h2>
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
                                                                            <ExternalLink className="w-3 h-3" />
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
                    </div>
                </main>
            </div>
        </div>
    );
};

export default StudentProfileView;
