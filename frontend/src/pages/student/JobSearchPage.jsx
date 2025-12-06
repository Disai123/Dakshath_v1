import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Header from '../../components/common/Header';
import Sidebar from '../../components/common/Sidebar';
import { jobService } from '../../services/jobService';
import { Search, Filter } from 'lucide-react';
import { Link } from 'react-router-dom';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { getQualificationStatus, formatScore } from '../../utils/helpers';

const JobSearchPage = () => {
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({
    job_type: '',
    location: ''
  });

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['jobs', search, filters],
    queryFn: () => {
      // If there's a search query or filters, use searchJobs
      if (search || filters.job_type || filters.location) {
        return jobService.searchJobs({ q: search, ...filters });
      }
      // Otherwise, get all jobs
      return jobService.getAllJobs(filters);
    }
  });

  const jobs = data?.data || [];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Find Your Next Opportunity</h1>

            {/* Search and Filters */}
            <div className="card mb-6">
              <div className="flex gap-4 mb-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search jobs, companies..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="input-field pl-10"
                  />
                </div>
              </div>
              <div className="flex gap-4">
                <select
                  value={filters.job_type}
                  onChange={(e) => setFilters({ ...filters, job_type: e.target.value })}
                  className="input-field"
                >
                  <option value="">All Job Types</option>
                  <option value="full-time">Full-time</option>
                  <option value="part-time">Part-time</option>
                  <option value="internship">Internship</option>
                  <option value="contract">Contract</option>
                </select>
                <input
                  type="text"
                  placeholder="Location"
                  value={filters.location}
                  onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                  className="input-field"
                />
              </div>
            </div>

            {/* Jobs List */}
            {isLoading ? (
              <LoadingSpinner size="lg" />
            ) : isError ? (
              <div className="card text-center py-12">
                <p className="text-red-600">Error loading jobs: {error?.message || 'Unknown error'}</p>
              </div>
            ) : (
              <>
                {jobs.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {jobs.map((job) => {
                      const qualification = job.qualification_status
                        ? getQualificationStatus(job.student_score, job.required_score_min)
                        : null;

                      return (
                        <Link
                          key={job.id}
                          to={`/jobs/${job.id}`}
                          className="card hover:shadow-lg transition-shadow"
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <h3 className="font-semibold text-lg mb-1">{job.title}</h3>
                              <p className="text-sm text-gray-600">{job.company?.company_name || 'Company Name'}</p>
                            </div>
                            {qualification && (
                              <span className={`badge badge-${qualification.color}`}>
                                {qualification.status === 'qualified' ? 'Qualified' : 'Not Qualified'}
                              </span>
                            )}
                          </div>
                          <div className="space-y-2 text-sm text-gray-600">
                            <p>📍 {job.location || 'Remote'}</p>
                            <p>💼 {job.job_type}</p>
                            <p>📊 Min Score: {formatScore(job.required_score_min)}</p>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                ) : (
                  <div className="card text-center py-12">
                    <p className="text-gray-600">No jobs found. Try adjusting your search.</p>
                  </div>
                )}
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default JobSearchPage;

