import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Header from '../../components/common/Header';
import Sidebar from '../../components/common/Sidebar';
import { applicationService } from '../../services/applicationService';
import { hrRequestService } from '../../services/hrRequestService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { formatDate } from '../../utils/helpers';
import { STATUS_LABELS, STATUS_COLORS } from '../../utils/constants';
import { MessageSquare, X } from 'lucide-react';

const HRApplicationsPage = () => {
  const queryClient = useQueryClient();
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [requestType, setRequestType] = useState('status_update');
  const [requestedStatus, setRequestedStatus] = useState('');
  const [requestMessage, setRequestMessage] = useState('');

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['companyApplications'],
    queryFn: async () => {
      try {
        const response = await applicationService.getCompanyApplications();
        console.log('HR Applications response:', response);
        return response;
      } catch (error) {
        console.error('Error fetching HR applications:', error);
        throw error;
      }
    }
  });

  const createRequestMutation = useMutation({
    mutationFn: (requestData) => hrRequestService.createRequest(requestData),
    onSuccess: () => {
      queryClient.invalidateQueries(['companyApplications']);
      setShowRequestModal(false);
      setSelectedApplication(null);
      setRequestType('status_update');
      setRequestedStatus('');
      setRequestMessage('');
      alert('Request created successfully. Admin will review and process it.');
    },
    onError: (error) => {
      const errorMessage = error?.response?.data?.error?.message || 'Failed to create request';
      const errorDetails = error?.response?.data?.error?.details;
      
      if (errorDetails && Array.isArray(errorDetails) && errorDetails.length > 0) {
        const detailsMessage = errorDetails.map(d => `${d.field}: ${d.message}`).join('\n');
        alert(`${errorMessage}\n\nDetails:\n${detailsMessage}`);
      } else {
        alert(errorMessage);
      }
    }
  });

  const applications = data?.data || [];
  
  const handleCreateRequest = (application) => {
    setSelectedApplication(application);
    setShowRequestModal(true);
  };

  const handleSubmitRequest = () => {
    if (!requestMessage.trim()) {
      alert('Please enter a message');
      return;
    }

    if (requestType === 'status_update' && !requestedStatus) {
      alert('Please select a status');
      return;
    }

    // Build request data - only include requested_status if it's a status_update request
    const requestData = {
      application_id: selectedApplication.id,
      request_type: requestType,
      message: requestMessage.trim()
    };

    // Only add requested_status if request_type is 'status_update' and status is provided
    if (requestType === 'status_update' && requestedStatus) {
      requestData.requested_status = requestedStatus;
    }

    createRequestMutation.mutate(requestData);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Applications</h1>

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
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Candidate</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Job</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Applied Date</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Score</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {applications.map((app) => (
                          <tr key={app.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4">
                              <p className="font-medium">{app.student?.name}</p>
                              <p className="text-sm text-gray-600">{app.student?.email}</p>
                            </td>
                            <td className="px-6 py-4">{app.jobListing?.title}</td>
                            <td className="px-6 py-4 text-gray-600">{formatDate(app.applied_at)}</td>
                            <td className="px-6 py-4 text-gray-600">{app.score_at_application}</td>
                            <td className="px-6 py-4">
                              <span className={`badge badge-${STATUS_COLORS[app.status] || 'info'}`}>
                                {STATUS_LABELS[app.status] || app.status}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <button
                                onClick={() => handleCreateRequest(app)}
                                className="btn-primary text-sm inline-flex items-center gap-2"
                              >
                                <MessageSquare className="w-4 h-4" />
                                Request Action
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-gray-600">No applications received yet</p>
                  </div>
                )}
              </div>
            )}

            {/* Request Modal */}
            {showRequestModal && selectedApplication && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold">Create Request to Admin</h3>
                    <button
                      onClick={() => {
                        setShowRequestModal(false);
                        setSelectedApplication(null);
                        setRequestType('status_update');
                        setRequestedStatus('');
                        setRequestMessage('');
                      }}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>

                  <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Application Details:</p>
                    <p className="font-medium">{selectedApplication.jobListing?.title}</p>
                    <p className="text-sm text-gray-600">Candidate: {selectedApplication.student?.name}</p>
                    <p className="text-sm text-gray-600">Current Status: {STATUS_LABELS[selectedApplication.status] || selectedApplication.status}</p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Request Type *
                      </label>
                      <select
                        value={requestType}
                        onChange={(e) => {
                          setRequestType(e.target.value);
                          if (e.target.value !== 'status_update') {
                            setRequestedStatus('');
                          }
                        }}
                        className="input-field w-full"
                      >
                        <option value="status_update">Status Update</option>
                        <option value="interview_schedule">Interview Schedule</option>
                        <option value="assignment">Assignment</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    {requestType === 'status_update' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Requested Status *
                        </label>
                        <select
                          value={requestedStatus}
                          onChange={(e) => setRequestedStatus(e.target.value)}
                          className="input-field w-full"
                        >
                          <option value="">Select Status</option>
                          <option value="under_review">Under Review</option>
                          <option value="interview_scheduled">Interview Scheduled</option>
                          <option value="accepted">Accepted</option>
                          <option value="rejected">Rejected</option>
                        </select>
                      </div>
                    )}

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Message to Admin *
                      </label>
                      <textarea
                        value={requestMessage}
                        onChange={(e) => setRequestMessage(e.target.value)}
                        className="input-field w-full"
                        rows="6"
                        placeholder="Explain what action you need the admin to take. For example: 'Please schedule an interview with this candidate' or 'Please update status to accepted and notify the student'..."
                        required
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Note: Admin will review your request and coordinate with the student. You cannot directly contact students.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3 mt-6">
                    <button
                      onClick={handleSubmitRequest}
                      disabled={createRequestMutation.isPending}
                      className="btn-primary flex-1"
                    >
                      {createRequestMutation.isPending ? 'Creating...' : 'Submit Request'}
                    </button>
                    <button
                      onClick={() => {
                        setShowRequestModal(false);
                        setSelectedApplication(null);
                        setRequestType('status_update');
                        setRequestedStatus('');
                        setRequestMessage('');
                      }}
                      className="btn-secondary flex-1"
                      disabled={createRequestMutation.isPending}
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

export default HRApplicationsPage;

