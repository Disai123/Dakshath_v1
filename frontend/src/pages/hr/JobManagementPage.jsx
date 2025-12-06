import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import Header from '../../components/common/Header';
import Sidebar from '../../components/common/Sidebar';
import { jobService } from '../../services/jobService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { Plus } from 'lucide-react';

const JobManagementPage = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['companyJobs'],
    queryFn: () => jobService.getCompanyJobs(),
    retry: 1
  });

  // The API returns { success: true, data: jobs }
  // jobService.getCompanyJobs() returns response.data which is { success: true, data: jobs }
  // So data.data should contain the jobs array
  const jobs = data?.data || [];
  
  // Debug: Log to see what we're getting
  if (data && !jobs.length) {
    console.log('JobManagementPage - API Response:', data);
    console.log('JobManagementPage - Jobs array:', jobs);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-3xl font-bold text-gray-900">Job Listings</h1>
              <Link to="/hr/jobs/create" className="btn-primary inline-flex items-center gap-2">
                <Plus className="w-5 h-5" />
                Create Job
              </Link>
            </div>

            {isLoading ? (
              <LoadingSpinner size="lg" />
            ) : error ? (
              <div className="card bg-error-light border border-error">
                <p className="text-error">Error loading jobs: {error.message}</p>
              </div>
            ) : (
              <div className="card">
                {jobs.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Applications</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {jobs.map((job) => (
                          <tr key={job.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 font-medium">{job.title}</td>
                            <td className="px-6 py-4 text-gray-600">{job.job_type}</td>
                            <td className="px-6 py-4">
                              <span className={`badge badge-${job.status === 'active' ? 'success' : 'info'}`}>
                                {job.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-gray-600">{job.application_count || 0}</td>
                            <td className="px-6 py-4">
                              <Link to={`/hr/applications?job_id=${job.id}`} className="text-primary hover:underline text-sm">
                                View Applications
                              </Link>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-gray-600 mb-4">No jobs posted yet</p>
                    <Link to="/hr/jobs/create" className="btn-primary inline-flex items-center gap-2">
                      <Plus className="w-5 h-5" />
                      Create Your First Job
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default JobManagementPage;

