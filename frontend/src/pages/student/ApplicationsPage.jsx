import { useQuery } from '@tanstack/react-query';
import Header from '../../components/common/Header';
import Sidebar from '../../components/common/Sidebar';
import { applicationService } from '../../services/applicationService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { formatDate } from '../../utils/helpers';
import { STATUS_LABELS, STATUS_COLORS } from '../../utils/constants';
import { Link } from 'react-router-dom';

const ApplicationsPage = () => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['studentApplications'],
    queryFn: async () => {
      try {
        const response = await applicationService.getStudentApplications();
        console.log('Applications response:', response);
        return response;
      } catch (error) {
        console.error('Error fetching applications:', error);
        throw error;
      }
    }
  });

  const applications = data?.data || [];
  
  console.log('Applications data:', { data, applications, isLoading, isError, error });

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">My Applications</h1>

            {isLoading ? (
              <LoadingSpinner size="lg" />
            ) : isError ? (
              <div className="card text-center py-12">
                <p className="text-red-600">Error loading applications: {error?.response?.data?.error?.message || error?.message || 'Unknown error'}</p>
              </div>
            ) : (
              <div className="card">
                {applications.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Job</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Company</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Applied Date</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Score</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {applications.map((app) => (
                          <tr key={app.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4">
                              <Link to={`/jobs/${app.jobListing?.id}`} className="font-medium text-primary hover:underline">
                                {app.jobListing?.title}
                              </Link>
                            </td>
                            <td className="px-6 py-4 text-gray-600">{app.jobListing?.company?.company_name}</td>
                            <td className="px-6 py-4 text-gray-600">{formatDate(app.applied_at)}</td>
                            <td className="px-6 py-4">
                              <span className={`badge badge-${STATUS_COLORS[app.status] || 'info'}`}>
                                {STATUS_LABELS[app.status] || app.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-gray-600">{app.score_at_application}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-gray-600">No applications yet</p>
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

export default ApplicationsPage;

