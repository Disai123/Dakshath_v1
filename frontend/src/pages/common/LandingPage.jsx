import { Link } from 'react-router-dom';
import { Briefcase, Users, Building2, TrendingUp, CheckCircle, ArrowRight } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { jobService } from '../../services/jobService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { formatScore } from '../../utils/helpers';

const LandingPage = () => {
  // Fetch jobs for the landing page
  const { data, isLoading } = useQuery({
    queryKey: ['landingJobs'],
    queryFn: () => jobService.getAllJobs({ limit: 6 }),
    retry: 1
  });

  const jobs = data?.data || [];
  const totalJobs = data?.meta?.total || 0;

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Briefcase className="w-8 h-8 text-primary mr-2" />
              <h1 className="text-2xl font-bold text-primary">Dakshath</h1>
            </div>
            <div className="flex items-center gap-4">
              <Link to="/login" className="text-gray-600 hover:text-gray-900">
                Login
              </Link>
              <Link to="/login" className="btn-primary">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-light to-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              Connect Your Academic Success to Career Opportunities
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Dakshath bridges the gap between your academic achievements and real-world job opportunities. 
              Find positions that match your skills and qualifications.
            </p>
            <div className="flex gap-4 justify-center">
              <Link to="/login" className="btn-primary text-lg px-8 py-4">
                Get Started
                <ArrowRight className="w-5 h-5 ml-2 inline" />
              </Link>
              <Link to="/login" className="btn-secondary text-lg px-8 py-4">
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Job Openings Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Explore Job Opportunities
            </h2>
            <p className="text-xl text-gray-600 mb-2">
              We have <span className="font-bold text-primary text-2xl">{totalJobs}</span> active job openings
            </p>
            <p className="text-gray-600">
              Browse through our available positions and find your perfect match
            </p>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner size="lg" />
            </div>
          ) : jobs.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {jobs.map((job) => (
                  <Link
                    key={job.id}
                    to={`/jobs/${job.id}`}
                    className="card hover:shadow-lg transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-1 text-gray-900">{job.title}</h3>
                        <p className="text-sm text-gray-600">{job.company?.company_name || 'Company Name'}</p>
                      </div>
                    </div>
                    <div className="space-y-2 text-sm text-gray-600 mb-4">
                      <p className="flex items-center gap-2">
                        <span>📍</span> {job.location || 'Remote'}
                      </p>
                      <p className="flex items-center gap-2">
                        <span>💼</span> {job.job_type}
                      </p>
                      {job.required_score_min !== null && job.required_score_min !== undefined && (
                        <p className="flex items-center gap-2">
                          <span>📊</span> Min Score: {formatScore(job.required_score_min)}
                        </p>
                      )}
                    </div>
                    <div className="pt-4 border-t border-gray-200">
                      <span className="text-primary font-medium text-sm flex items-center gap-1">
                        View Details <ArrowRight className="w-4 h-4" />
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
              <div className="text-center">
                <Link to="/jobs" className="btn-primary inline-flex items-center gap-2">
                  View All Jobs
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600">No job openings available at the moment. Check back soon!</p>
            </div>
          )}
        </div>
      </section>

      {/* For Students Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">For Students</h2>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <CheckCircle className="w-6 h-6 text-success mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold mb-1">Discover Opportunities</h3>
                    <p className="text-gray-600">Browse jobs matched to your academic score</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-6 h-6 text-success mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold mb-1">Easy Application</h3>
                    <p className="text-gray-600">Apply to jobs with one click - your profile is already complete</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-6 h-6 text-success mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold mb-1">Track Applications</h3>
                    <p className="text-gray-600">Monitor your application status in real-time</p>
                  </div>
                </li>
              </ul>
              <Link to="/login" className="btn-primary mt-6 inline-block">
                Student Login
              </Link>
            </div>
            <div className="bg-primary-light rounded-2xl p-8">
              <Users className="w-32 h-32 text-primary mx-auto" />
            </div>
          </div>
        </div>
      </section>

      {/* For Companies Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="bg-success-light rounded-2xl p-8 order-2 lg:order-1">
              <Building2 className="w-32 h-32 text-success mx-auto" />
            </div>
            <div className="order-1 lg:order-2">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">For Companies</h2>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <CheckCircle className="w-6 h-6 text-success mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold mb-1">Pre-Qualified Candidates</h3>
                    <p className="text-gray-600">Receive applications only from candidates who meet your requirements</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-6 h-6 text-success mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold mb-1">Verified Credentials</h3>
                    <p className="text-gray-600">Access verified academic profiles and scores</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-6 h-6 text-success mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold mb-1">Streamlined Hiring</h3>
                    <p className="text-gray-600">Reduce time-to-hire with our efficient platform</p>
                  </div>
                </li>
              </ul>
              <div className="flex gap-4 mt-6">
                <Link to="/register/company" className="btn-primary inline-block">
                  Register Company
                </Link>
                <Link to="/login" className="btn-secondary inline-block">
                  HR Login
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join Dakshath today and connect your academic success with career opportunities
          </p>
          <Link to="/login" className="bg-white text-primary px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-block">
            Start Now
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <Briefcase className="w-6 h-6 text-primary mr-2" />
                <h3 className="text-xl font-bold">Dakshath</h3>
              </div>
              <p className="text-gray-400">
                Connecting academic success with career opportunities.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/login" className="hover:text-white">Student Login</Link></li>
                <li><Link to="/register/company" className="hover:text-white">Register Company</Link></li>
                <li><Link to="/login" className="hover:text-white">HR Login</Link></li>
                <li><Link to="/login" className="hover:text-white">Admin Login</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">About</h4>
              <p className="text-gray-400">
                Dakshath is a job and internship platform that matches students with opportunities based on their academic achievements.
              </p>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 Dakshath. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;

