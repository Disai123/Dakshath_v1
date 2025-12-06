import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Header from '../../components/common/Header';
import Sidebar from '../../components/common/Sidebar';
import { hrRequestService } from '../../services/hrRequestService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { formatDate } from '../../utils/helpers';
import { CheckCircle, XCircle, Clock, MessageSquare, AlertCircle } from 'lucide-react';

const HRRequestsPage = () => {
  const queryClient = useQueryClient();
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [processAction, setProcessAction] = useState(null);
  const [adminNotes, setAdminNotes] = useState('');

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['adminHRRequests'],
    queryFn: () => hrRequestService.getAllRequests(),
    retry: 1
  });

  const processMutation = useMutation({
    mutationFn: ({ id, action, notes }) => hrRequestService.processRequest(id, { action, admin_notes: notes }),
    onSuccess: () => {
      queryClient.invalidateQueries(['adminHRRequests']);
      setSelectedRequest(null);
      setProcessAction(null);
      setAdminNotes('');
      alert('Request processed successfully');
    },
    onError: (error) => {
      alert(error?.response?.data?.error?.message || 'Failed to process request');
    }
  });

  const requests = data?.data || [];

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { color: 'warning', icon: Clock, label: 'Pending' },
      approved: { color: 'success', icon: CheckCircle, label: 'Approved' },
      rejected: { color: 'error', icon: XCircle, label: 'Rejected' },
      completed: { color: 'success', icon: CheckCircle, label: 'Completed' }
    };

    const config = statusConfig[status] || statusConfig.pending;
    const Icon = config.icon;

    return (
      <span className={`badge badge-${config.color} inline-flex items-center gap-1`}>
        <Icon className="w-4 h-4" />
        {config.label}
      </span>
    );
  };

  const getRequestTypeLabel = (type) => {
    const labels = {
      status_update: 'Status Update',
      interview_schedule: 'Interview Schedule',
      assignment: 'Assignment',
      other: 'Other'
    };
    return labels[type] || type;
  };

  const handleProcess = (request, action) => {
    setSelectedRequest(request);
    setProcessAction(action);
  };

  const confirmProcess = () => {
    if (!selectedRequest || !processAction) return;
    processMutation.mutate({
      id: selectedRequest.id,
      action: processAction,
      notes: adminNotes
    });
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
            <h1 className="text-3xl font-bold text-gray-900 mb-8">HR Requests</h1>

            {isError ? (
              <div className="card bg-error-light border border-error">
                <p className="text-error">Error loading requests: {error?.response?.data?.error?.message || error?.message || 'Unknown error'}</p>
              </div>
            ) : (
              <>
                {requests.length > 0 ? (
                  <div className="space-y-4">
                    {requests.map((request) => (
                      <div key={request.id} className="card">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-lg font-semibold text-gray-900">
                                Request #{request.id} - {getRequestTypeLabel(request.request_type)}
                              </h3>
                              {getStatusBadge(request.status)}
                            </div>
                            <div className="text-sm text-gray-600 space-y-1">
                              <p>
                                <strong>Company:</strong> {request.hrUser?.company?.company_name || 'N/A'}
                              </p>
                              <p>
                                <strong>HR User:</strong> {request.hrUser?.user?.name || 'N/A'} ({request.hrUser?.user?.email || 'N/A'})
                              </p>
                              <p>
                                <strong>Application:</strong> {request.application?.jobListing?.title || 'N/A'} - 
                                Candidate: {request.application?.student?.name || 'N/A'}
                              </p>
                              {request.requested_status && (
                                <p>
                                  <strong>Requested Status:</strong> {request.requested_status.replace('_', ' ')}
                                </p>
                              )}
                              <p>
                                <strong>Created:</strong> {formatDate(request.created_at)}
                              </p>
                              {request.processed_at && (
                                <p>
                                  <strong>Processed:</strong> {formatDate(request.processed_at)} by {request.processedBy?.name || 'N/A'}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                          <div className="flex items-start gap-2 mb-2">
                            <MessageSquare className="w-5 h-5 text-gray-400 mt-0.5" />
                            <div className="flex-1">
                              <p className="font-medium text-gray-900 mb-1">HR Message:</p>
                              <p className="text-gray-700 whitespace-pre-line">{request.message}</p>
                            </div>
                          </div>
                        </div>

                        {request.admin_notes && (
                          <div className="mb-4 p-4 bg-primary-light rounded-lg">
                            <div className="flex items-start gap-2">
                              <AlertCircle className="w-5 h-5 text-primary mt-0.5" />
                              <div className="flex-1">
                                <p className="font-medium text-gray-900 mb-1">Admin Notes:</p>
                                <p className="text-gray-700 whitespace-pre-line">{request.admin_notes}</p>
                              </div>
                            </div>
                          </div>
                        )}

                        {request.status === 'pending' && (
                          <div className="flex gap-3 pt-4 border-t border-gray-200">
                            <button
                              onClick={() => handleProcess(request, 'approve')}
                              className="btn-primary"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleProcess(request, 'reject')}
                              className="btn-secondary"
                            >
                              Reject
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="card text-center py-12">
                    <p className="text-gray-600">No HR requests found</p>
                  </div>
                )}
              </>
            )}

            {/* Process Modal */}
            {selectedRequest && processAction && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                  <h3 className="text-xl font-bold mb-4">
                    {processAction === 'approve' ? 'Approve' : 'Reject'} Request
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Are you sure you want to {processAction} this request?
                  </p>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Admin Notes (optional)
                    </label>
                    <textarea
                      value={adminNotes}
                      onChange={(e) => setAdminNotes(e.target.value)}
                      className="input-field w-full"
                      rows="4"
                      placeholder="Add any notes about this decision..."
                    />
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={confirmProcess}
                      disabled={processMutation.isPending}
                      className={`btn-${processAction === 'approve' ? 'primary' : 'secondary'} flex-1`}
                    >
                      {processMutation.isPending ? 'Processing...' : `Confirm ${processAction === 'approve' ? 'Approve' : 'Reject'}`}
                    </button>
                    <button
                      onClick={() => {
                        setSelectedRequest(null);
                        setProcessAction(null);
                        setAdminNotes('');
                      }}
                      className="btn-secondary flex-1"
                      disabled={processMutation.isPending}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default HRRequestsPage;

