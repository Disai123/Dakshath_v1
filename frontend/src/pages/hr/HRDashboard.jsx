import { useQuery } from '@tanstack/react-query';
import Header from '../../components/common/Header';
import Sidebar from '../../components/common/Sidebar';
import { hrService } from '../../services/hrService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { Briefcase, FileText, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

const HRDashboard = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['hrDashboard'],
    queryFn: () => hrService.getDashboard()
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

  const stats = data?.data || {};

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">HR Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="card">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Active Jobs</p>
                    <p className="text-2xl font-bold">{stats.active_jobs || 0}</p>
                  </div>
                  <Briefcase className="w-8 h-8 text-primary" />
                </div>
              </div>
              <div className="card">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Applications</p>
                    <p className="text-2xl font-bold">{stats.total_applications || 0}</p>
                  </div>
                  <FileText className="w-8 h-8 text-success" />
                </div>
              </div>
              <div className="card">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Pending Review</p>
                    <p className="text-2xl font-bold">{stats.pending_applications || 0}</p>
                  </div>
                  <Clock className="w-8 h-8 text-warning" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="card">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold">Recent Applications</h2>
                  <Link to="/hr/applications" className="text-primary hover:underline text-sm">
                    View All
                  </Link>
                </div>
                {stats.recent_applications && stats.recent_applications.length > 0 ? (
                  <div className="space-y-3">
                    {stats.recent_applications.map((app) => (
                      <div key={app.id} className="border-b border-gray-200 pb-3 last:border-0">
                        <p className="font-medium">{app.student?.name}</p>
                        <p className="text-sm text-gray-600">{app.jobListing?.title}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-600">No applications yet</p>
                )}
              </div>

              <div className="card">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold">Recent Jobs</h2>
                  <Link to="/hr/jobs" className="text-primary hover:underline text-sm">
                    View All
                  </Link>
                </div>
                {stats.recent_jobs && stats.recent_jobs.length > 0 ? (
                  <div className="space-y-3">
                    {stats.recent_jobs.map((job) => (
                      <div key={job.id} className="border-b border-gray-200 pb-3 last:border-0">
                        <p className="font-medium">{job.title}</p>
                        <p className="text-sm text-gray-600">{job.status}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-600">No jobs posted yet</p>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default HRDashboard;

