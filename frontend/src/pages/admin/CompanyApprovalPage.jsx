import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Header from '../../components/common/Header';
import Sidebar from '../../components/common/Sidebar';
import { companyService } from '../../services/companyService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { formatDate } from '../../utils/helpers';

const CompanyApprovalPage = () => {
  const queryClient = useQueryClient();
  const [statusFilter, setStatusFilter] = useState('all'); // 'all', 'pending', 'active', 'rejected', 'suspended'

  const { data, isLoading } = useQuery({
    queryKey: ['companies', statusFilter],
    queryFn: () => {
      if (statusFilter === 'pending') {
        return companyService.getPendingCompanies();
      } else {
        return companyService.getAllCompanies({ status: statusFilter === 'all' ? undefined : statusFilter });
      }
    }
  });

  const approveMutation = useMutation({
    mutationFn: companyService.approveCompany,
    onSuccess: () => {
      queryClient.invalidateQueries(['companies']);
      queryClient.invalidateQueries(['adminDashboard']); // Refresh dashboard stats
    }
  });

  const rejectMutation = useMutation({
    mutationFn: ({ id, reason }) => companyService.rejectCompany(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries(['companies']);
      queryClient.invalidateQueries(['adminDashboard']); // Refresh dashboard stats
    }
  });

  const companies = data?.data || [];

  const handleReject = (id) => {
    const reason = prompt('Please provide a reason for rejection:');
    if (reason) {
      rejectMutation.mutate({ id, reason });
    }
  };

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

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-3xl font-bold text-gray-900">Companies</h1>
              <div className="flex gap-2">
                <button
                  onClick={() => setStatusFilter('all')}
                  className={`px-4 py-2 rounded-lg ${statusFilter === 'all' ? 'bg-primary text-white' : 'bg-gray-200 text-gray-700'}`}
                >
                  All
                </button>
                <button
                  onClick={() => setStatusFilter('pending')}
                  className={`px-4 py-2 rounded-lg ${statusFilter === 'pending' ? 'bg-primary text-white' : 'bg-gray-200 text-gray-700'}`}
                >
                  Pending
                </button>
                <button
                  onClick={() => setStatusFilter('active')}
                  className={`px-4 py-2 rounded-lg ${statusFilter === 'active' ? 'bg-primary text-white' : 'bg-gray-200 text-gray-700'}`}
                >
                  Active
                </button>
                <button
                  onClick={() => setStatusFilter('rejected')}
                  className={`px-4 py-2 rounded-lg ${statusFilter === 'rejected' ? 'bg-primary text-white' : 'bg-gray-200 text-gray-700'}`}
                >
                  Rejected
                </button>
              </div>
            </div>

            {companies.length > 0 ? (
              <div className="space-y-4">
                {companies.map((company) => (
                  <div key={company.id} className="card">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-semibold">{company.company_name}</h3>
                          <span className={`badge ${
                            company.status === 'active' ? 'badge-success' :
                            company.status === 'pending' ? 'badge-warning' :
                            company.status === 'rejected' ? 'badge-error' :
                            'badge-secondary'
                          }`}>
                            {company.status}
                          </span>
                        </div>
                        <p className="text-gray-600 mb-2">{company.email}</p>
                        {company.description && (
                          <p className="text-gray-600 mb-2">{company.description}</p>
                        )}
                        {company.location && (
                          <p className="text-gray-600 mb-2">📍 {company.location}</p>
                        )}
                        <p className="text-sm text-gray-500">
                          Registered: {formatDate(company.created_at)}
                        </p>
                        {company.approved_at && (
                          <p className="text-sm text-gray-500">
                            Approved: {formatDate(company.approved_at)}
                          </p>
                        )}
                      </div>
                      {company.status === 'pending' && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => approveMutation.mutate(company.id)}
                            disabled={approveMutation.isPending}
                            className="btn-primary"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleReject(company.id)}
                            disabled={rejectMutation.isPending}
                            className="btn-secondary"
                          >
                            Reject
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="card text-center py-12">
                <p className="text-gray-600">No companies found</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default CompanyApprovalPage;

