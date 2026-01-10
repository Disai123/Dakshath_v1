import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import Header from '../../components/common/Header';
import Sidebar from '../../components/common/Sidebar';
import { jobService } from '../../services/jobService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { Plus, Edit, Trash2 } from 'lucide-react';

const JobManagementPage = () => {
  const queryClient = useQueryClient();
  const [deleteJobId, setDeleteJobId] = useState(null);

  const { data, isLoading, error } = useQuery({
    queryKey: ['companyJobs'],
    queryFn: () => jobService.getCompanyJobs(),
    retry: 1
  });

  const deleteMutation = useMutation({
    mutationFn: jobService.deleteJob,
    onSuccess: () => {
      queryClient.invalidateQueries(['companyJobs']);
      setDeleteJobId(null);
    }
  });

  const jobs = data?.data || [];

  const handleDelete = (jobId) => {
    setDeleteJobId(jobId);
  };

  const confirmDelete = () => {
    if (deleteJobId) {
      deleteMutation.mutate(deleteJobId);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusBadge = (job) => {
    if (job.is_expired) {
      return <span className="badge badge-error">Expired</span>;
    }

    switch (job.status) {
      case 'active':
        return <span className="badge badge-success">Active</span>;
      case 'draft':
        return <span className="badge badge-info">Draft</span>;
      case 'closed':
        return <span className="badge badge-secondary">Closed</span>;
      default:
        return <span className="badge">{job.status}</span>;
    }
  };

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
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Created</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Deadline</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Applications</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {jobs.map((job) => (
                          <tr key={job.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 font-medium">{job.title}</td>
                            <td className="px-6 py-4 text-gray-600 capitalize">{job.job_type.replace('-', ' ')}</td>
                            <td className="px-6 py-4">
                              {getStatusBadge(job)}
                            </td>
                            <td className="px-6 py-4 text-gray-600 text-sm">{formatDate(job.created_at)}</td>
                            <td className="px-6 py-4 text-gray-600 text-sm">
                              {job.application_deadline ? (
                                <span className={job.is_expired ? 'text-red-600 font-medium' : ''}>
                                  {formatDate(job.application_deadline)}
                                </span>
                              ) : (
                                'No deadline'
                              )}
                            </td>
                            <td className="px-6 py-4 text-gray-600">{job.application_count || 0}</td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <Link
                                  to={`/hr/jobs/edit/${job.id}`}
                                  className="text-primary hover:text-primary-dark inline-flex items-center gap-1"
                                  title="Edit job"
                                >
                                  <Edit className="w-4 h-4" />
                                  <span className="text-sm">Edit</span>
                                </Link>
                                <button
                                  onClick={() => handleDelete(job.id)}
                                  className="text-red-600 hover:text-red-800 inline-flex items-center gap-1"
                                  title="Delete job"
                                >
                                  <Trash2 className="w-4 h-4" />
                                  <span className="text-sm">Delete</span>
                                </button>
                                <Link
                                  to={`/hr/applications?job_id=${job.id}`}
                                  className="text-gray-600 hover:text-gray-900 text-sm hover:underline"
                                >
                                  View Applications
                                </Link>
                              </div>
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

      {/* Delete Confirmation Modal */}
      {deleteJobId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Confirm Delete</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this job listing? This action cannot be undone and will also delete all associated applications.
            </p>
            <div className="flex gap-4 justify-end">
              <button
                onClick={() => setDeleteJobId(null)}
                className="btn-secondary"
                disabled={deleteMutation.isPending}
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium"
                disabled={deleteMutation.isPending}
              >
                {deleteMutation.isPending ? 'Deleting...' : 'Delete Job'}
              </button>
            </div>
            {deleteMutation.isError && (
              <p className="text-red-600 text-sm mt-4">
                Error: {deleteMutation.error?.message || 'Failed to delete job'}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default JobManagementPage;

