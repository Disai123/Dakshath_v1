import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Header from '../../components/common/Header';
import Sidebar from '../../components/common/Sidebar';
import { jobService } from '../../services/jobService';
import { applicationService } from '../../services/applicationService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { getQualificationStatus, formatScore, formatDate } from '../../utils/helpers';
import { CheckCircle, XCircle, MapPin, Briefcase, Calendar, Building2, ArrowLeft, ExternalLink } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const JobDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const { data, isLoading } = useQuery({
    queryKey: ['job', id],
    queryFn: () => jobService.getJobById(id)
  });

  const applyMutation = useMutation({
    mutationFn: async (data) => {
      console.log('Submitting application with data:', data);
      try {
        const response = await applicationService.applyToJob(data);
        console.log('Application service response:', response);
        return response;
      } catch (error) {
        console.error('Application service error:', error);
        throw error;
      }
    },
    onSuccess: (response) => {
      console.log('Application submitted successfully:', response);
      queryClient.invalidateQueries(['studentApplications']);
      // Show success message
      alert('Application submitted successfully!');
      navigate('/applications');
    },
    onError: (error) => {
      console.error('Application mutation error:', error);
      const errorMessage = error.response?.data?.error?.message || error.message || 'Failed to submit application. Please try again.';
      alert(errorMessage);
    }
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex">
          {user && <Sidebar />}
          <div className={`${user ? 'flex-1' : 'w-full'} p-8`}>
            <LoadingSpinner size="lg" />
          </div>
        </div>
      </div>
    );
  }

  const job = data?.data;
  if (!job) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex justify-center items-center min-h-screen">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Job Not Found</h2>
            <p className="text-gray-600 mb-4">The job you're looking for doesn't exist or has been removed.</p>
            <Link to="/jobs" className="btn-primary inline-flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Jobs
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Always check qualification if we have student score and required score
  // This ensures 0 >= 0 is correctly handled
  // Convert to numbers to ensure proper comparison
  const studentScore = parseFloat(job.student_score) || 0;
  const requiredScore = parseFloat(job.required_score_min) || 0;
  
  const qualification = (job.student_score !== undefined && job.student_score !== null && job.required_score_min !== undefined && job.required_score_min !== null)
    ? getQualificationStatus(studentScore, requiredScore)
    : null;

  // Student can apply if their score >= required score (including 0 >= 0)
  const canApply = qualification?.status === 'qualified';
  const isStudent = user?.role === 'student';

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex">
        {user && <Sidebar />}
        <main className={`${user ? 'flex-1' : 'w-full'} p-4 sm:p-6 lg:p-8`}>
          <div className="max-w-5xl mx-auto">
            {/* Back Button */}
            <Link 
              to="/jobs" 
              className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Jobs</span>
            </Link>

            {/* Main Job Card */}
            <div className="card mb-6">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
                <div className="flex-1">
                  <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">{job.title}</h1>
                  <div className="flex flex-wrap items-center gap-4 text-gray-600 mb-4">
                    <div className="flex items-center gap-2">
                      <Building2 className="w-5 h-5 text-gray-400" />
                      <span className="font-medium text-gray-900">{job.company?.company_name || 'Company Name'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-gray-400" />
                      <span>{job.location || 'Remote'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Briefcase className="w-5 h-5 text-gray-400" />
                      <span className="capitalize">{job.job_type?.replace('-', ' ')}</span>
                    </div>
                    {job.created_at && (
                      <div className="flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-gray-400" />
                        <span>Posted {formatDate(job.created_at)}</span>
                      </div>
                    )}
                  </div>
                </div>
                {job.company?.logo_url && (
                  <div className="flex-shrink-0">
                    <img 
                      src={job.company.logo_url} 
                      alt={job.company.company_name} 
                      className="w-24 h-24 object-contain rounded-lg border border-gray-200 bg-white p-2"
                    />
                  </div>
                )}
              </div>

              {/* Qualification Status - Only show if user is logged in as student */}
              {isStudent && qualification && (
                <div className={`p-4 rounded-lg mb-6 border-l-4 ${
                  qualification.color === 'success' 
                    ? 'bg-success-light border-success' 
                    : qualification.color === 'error' 
                    ? 'bg-error-light border-error' 
                    : 'bg-warning-light border-warning'
                }`}>
                  <div className="flex items-center gap-3">
                    {qualification.status === 'qualified' ? (
                      <CheckCircle className="w-6 h-6 text-success flex-shrink-0" />
                    ) : (
                      <XCircle className="w-6 h-6 text-error flex-shrink-0" />
                    )}
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">{qualification.message}</p>
                      <p className="text-sm text-gray-700 mt-1">
                        Your Score: <span className="font-medium">{formatScore(job.student_score)}</span> | 
                        Required: <span className="font-medium">{formatScore(job.required_score_min)}</span>
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Apply Button Section */}
              <div className="pt-6 border-t border-gray-200">
                {!user ? (
                  <div className="bg-primary-light p-4 rounded-lg">
                    <p className="text-gray-700 mb-3">
                      <strong>Want to apply for this position?</strong> Please log in to submit your application.
                    </p>
                    <Link to="/login" className="btn-primary inline-flex items-center gap-2">
                      Login to Apply
                      <ExternalLink className="w-4 h-4" />
                    </Link>
                  </div>
                ) : isStudent ? (
                  <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                    <button
                      onClick={() => {
                        console.log('Apply button clicked, job_listing_id:', id);
                        applyMutation.mutate({ job_listing_id: parseInt(id) });
                      }}
                      disabled={!canApply || applyMutation.isPending}
                      className={`btn-primary ${!canApply ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      {applyMutation.isPending ? 'Applying...' : 'Apply Now'}
                    </button>
                    {!canApply && (
                      <p className="text-sm text-gray-600">
                        You must meet the minimum score requirement ({formatScore(job.required_score_min)}) to apply for this position.
                      </p>
                    )}
                    {applyMutation.isError && (
                      <p className="text-sm text-red-600">
                        {applyMutation.error?.response?.data?.error?.message || applyMutation.error?.message || 'Failed to submit application'}
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="bg-warning-light p-4 rounded-lg">
                    <p className="text-gray-700">
                      Only students can apply for jobs. Please log in with a student account to apply.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Job Description */}
            <div className="card mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 pb-3 border-b border-gray-200">
                Job Description
              </h2>
              <div 
                className="prose max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-strong:text-gray-900 prose-ul:text-gray-700 prose-ol:text-gray-700 prose-li:text-gray-700"
                dangerouslySetInnerHTML={{ __html: job.description }} 
              />
            </div>

            {/* Requirements & Details */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="card">
                <h2 className="text-xl font-bold text-gray-900 mb-4 pb-3 border-b border-gray-200">
                  Requirements
                </h2>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">Minimum Score</p>
                    <p className="text-lg font-semibold text-gray-900">{formatScore(job.required_score_min)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">Job Type</p>
                    <p className="text-lg font-semibold text-gray-900 capitalize">{job.job_type?.replace('-', ' ')}</p>
                  </div>
                  {job.qualifications && (
                    <div>
                      <p className="text-sm font-medium text-gray-500 mb-2">Additional Qualifications</p>
                      <p className="text-gray-700 whitespace-pre-line leading-relaxed">{job.qualifications}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Company Info */}
              {job.company && (
                <div className="card">
                  <h2 className="text-xl font-bold text-gray-900 mb-4 pb-3 border-b border-gray-200">
                    About the Company
                  </h2>
                  <div className="space-y-3">
                    <div>
                      <p className="text-lg font-semibold text-gray-900">{job.company.company_name}</p>
                      {job.company.industry && (
                        <p className="text-sm text-gray-600 mt-1">Industry: {job.company.industry}</p>
                      )}
                    </div>
                    {job.company.location && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <MapPin className="w-4 h-4" />
                        <span className="text-sm">{job.company.location}</span>
                      </div>
                    )}
                    {job.company.description && (
                      <p className="text-sm text-gray-700 leading-relaxed">{job.company.description}</p>
                    )}
                    {job.company.website && (
                      <a 
                        href={job.company.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-primary hover:text-primary-dark text-sm font-medium"
                      >
                        Visit Website
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default JobDetailPage;

