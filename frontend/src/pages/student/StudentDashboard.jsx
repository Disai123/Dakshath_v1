import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Header from '../../components/common/Header';
import Sidebar from '../../components/common/Sidebar';
import { studentService } from '../../services/studentService';
import { applicationService } from '../../services/applicationService';
import { jobService } from '../../services/jobService';
import { Briefcase, FileText, CheckCircle, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const StudentDashboard = () => {
  const { data: scoreData, isLoading: scoreLoading } = useQuery({
    queryKey: ['studentScore'],
    queryFn: () => studentService.getScore()
  });

  const { data: applicationsData, isLoading: appsLoading } = useQuery({
    queryKey: ['studentApplications'],
    queryFn: () => applicationService.getStudentApplications({ limit: 5 })
  });

  const { data: jobsData, isLoading: jobsLoading } = useQuery({
    queryKey: ['recentJobs'],
    queryFn: () => jobService.getAllJobs({ limit: 6 })
  });

  const score = scoreData?.data?.total_points || 0;
  const applications = applicationsData?.data?.data || [];
  const jobs = jobsData?.data?.data || [];

  const stats = [
    {
      label: 'Total Points',
      value: score,
      icon: CheckCircle,
      color: 'text-success'
    },
    {
      label: 'Total Applications',
      value: applications.length,
      icon: FileText,
      color: 'text-primary'
    },
    {
      label: 'Available Jobs',
      value: jobs.length,
      icon: Briefcase,
      color: 'text-warning'
    }
  ];

  if (scoreLoading || appsLoading || jobsLoading) {
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

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>

            {/* Score Display */}
            <div className="card mb-8">
              <h2 className="text-xl font-semibold mb-4">Your Academic Score</h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Total Points</p>
                  <p className="text-4xl font-bold text-blue-600">{scoreData?.data?.total_points || 0}</p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Course Points</p>
                  <p className="text-3xl font-bold text-green-600">{scoreData?.data?.total_course_points || 0}</p>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Project Points</p>
                  <p className="text-3xl font-bold text-purple-600">{scoreData?.data?.total_project_points || 0}</p>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Hackathon Points</p>
                  <p className="text-3xl font-bold text-orange-600">{scoreData?.data?.total_hackathon_points || 0}</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                <div>
                  <p className="text-sm text-gray-600">Courses Completed</p>
                  <p className="text-xl font-bold">{scoreData?.data?.courses_completed_count || 0}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Projects Approved</p>
                  <p className="text-xl font-bold">{scoreData?.data?.projects_approved_count || 0}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Hackathons</p>
                  <p className="text-xl font-bold">{scoreData?.data?.hackathons_approved_count || 0}</p>
                </div>
              </div>
              {scoreData?.data?.master_certificate_issued && (
                <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="font-semibold text-yellow-800">🎓 Master Certificate Issued</p>
                </div>
              )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {stats.map((stat) => {
                const Icon = stat.icon;
                return (
                  <div key={stat.label} className="card">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">{stat.label}</p>
                        <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                      </div>
                      <Icon className={`w-8 h-8 ${stat.color}`} />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Recent Applications */}
            <div className="card mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Recent Applications</h2>
                <Link to="/applications" className="text-primary hover:underline">
                  View All
                </Link>
              </div>
              {applications.length > 0 ? (
                <div className="space-y-4">
                  {applications.map((app) => (
                    <div key={app.id} className="border-b border-gray-200 pb-4 last:border-0">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium">{app.jobListing?.title}</h3>
                          <p className="text-sm text-gray-600">{app.jobListing?.company?.company_name}</p>
                        </div>
                        <span className={`badge badge-${app.status === 'accepted' ? 'success' : app.status === 'rejected' ? 'error' : 'info'}`}>
                          {app.status.replace('_', ' ')}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600">No applications yet</p>
              )}
            </div>

            {/* Recent Jobs */}
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Recent Job Listings</h2>
                <Link to="/jobs" className="text-primary hover:underline">
                  Browse All
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {jobs.slice(0, 6).map((job) => (
                  <Link
                    key={job.id}
                    to={`/jobs/${job.id}`}
                    className="card hover:shadow-md transition-shadow"
                  >
                    <h3 className="font-semibold mb-2">{job.title}</h3>
                    <p className="text-sm text-gray-600 mb-2">{job.company?.company_name}</p>
                    <p className="text-xs text-gray-500">{job.location}</p>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default StudentDashboard;


