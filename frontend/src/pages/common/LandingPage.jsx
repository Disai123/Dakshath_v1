import { Link } from 'react-router-dom';
import { Briefcase, Users, Building2, TrendingUp, CheckCircle, ArrowRight, Trophy, Medal } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { jobService } from '../../services/jobService';
import { publicService } from '../../services/publicService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { formatScore } from '../../utils/helpers';

// Top Students Leaderboard Component with Auto-Scroll
const TopStudentsLeaderboard = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['topStudents'],
    queryFn: () => publicService.getTopStudents(10),
    retry: 1,
    refetchInterval: 60000 // Refresh every minute
  });

  const students = data?.data || [];

  return (
    <div className="relative bg-gradient-to-br from-yellow-50 via-white to-blue-50 rounded-3xl shadow-2xl p-6 border-2 border-yellow-200 overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-200 rounded-full opacity-20 -mr-16 -mt-16"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-blue-200 rounded-full opacity-20 -ml-12 -mb-12"></div>

      {/* Header */}
      <div className="relative flex items-center justify-center gap-2 mb-4">
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-400 opacity-10 rounded-2xl"></div>
        <Trophy className="w-6 h-6 text-yellow-600 animate-bounce" />
        <h3 className="text-xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
          Top Performers
        </h3>
        <Trophy className="w-6 h-6 text-yellow-600 animate-bounce" style={{ animationDelay: '0.2s' }} />
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <LoadingSpinner size="md" />
        </div>
      ) : students.length > 0 ? (
        <div className="relative h-80 overflow-hidden">
          {/* Auto-scrolling container */}
          <div className="animate-scroll space-y-2">
            {/* Duplicate students for seamless loop */}
            {[...students, ...students].map((student, index) => {
              const actualIndex = index % students.length;
              // Different background colors for variety
              const bgColors = [
                'bg-gradient-to-r from-yellow-50 to-orange-50',
                'bg-gradient-to-r from-blue-50 to-cyan-50',
                'bg-gradient-to-r from-purple-50 to-pink-50',
                'bg-gradient-to-r from-green-50 to-emerald-50',
                'bg-gradient-to-r from-red-50 to-rose-50',
              ];
              const bgColor = bgColors[actualIndex % bgColors.length];

              return (
                <div
                  key={`${student.student_id}-${index}`}
                  className={`flex items-center gap-2 p-2 rounded-xl ${bgColor} shadow-md hover:shadow-lg transition-all duration-300 border-2 ${actualIndex < 3 ? 'border-yellow-400' : 'border-transparent'
                    } hover:border-yellow-400 transform hover:scale-105`}
                >
                  {/* Rank Badge with Gradient */}
                  <div className={`relative flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center font-bold text-sm shadow-md ${actualIndex === 0 ? 'bg-gradient-to-br from-yellow-400 to-yellow-600 text-white' :
                    actualIndex === 1 ? 'bg-gradient-to-br from-gray-300 to-gray-500 text-white' :
                      actualIndex === 2 ? 'bg-gradient-to-br from-orange-400 to-orange-600 text-white' :
                        'bg-gradient-to-br from-blue-500 to-blue-700 text-white'
                    }`}>
                    {actualIndex === 0 ? '🥇' : actualIndex === 1 ? '🥈' : actualIndex === 2 ? '🥉' : `#${actualIndex + 1}`}
                    {actualIndex < 3 && (
                      <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-yellow-400 rounded-full animate-ping"></div>
                    )}
                  </div>

                  {/* Student Info */}
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-gray-900 truncate text-sm">{student.student_name}</p>
                    <p className="text-xs text-gray-600 truncate flex items-center gap-1">
                      <span className="inline-block w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                      {student.email}
                    </p>
                  </div>

                  {/* Points Badge */}
                  <div className="flex-shrink-0 bg-white px-2.5 py-1 rounded-lg border-2 border-blue-300 shadow-sm">
                    <p className="font-black text-lg bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      {student.total_points}
                    </p>
                    <p className="text-xs font-bold text-gray-600 uppercase tracking-wide -mt-1">pts</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Gradient Overlays for Fade Effect */}
          <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-yellow-50 to-transparent pointer-events-none z-10"></div>
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-blue-50 to-transparent pointer-events-none z-10"></div>
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-2xl">
          <Trophy className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">No students yet</p>
        </div>
      )}
    </div>
  );
};

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
            {/* Top Students Leaderboard */}
            <TopStudentsLeaderboard />
          </div>
        </div>
      </section>

      {/* For Companies Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Company Logos Showcase */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-3xl p-6 border-2 border-green-200 overflow-hidden order-2 lg:order-1">
              <h3 className="text-xl font-bold text-center mb-4 text-gray-900">Trusted by Leading Companies</h3>
              <div className="overflow-hidden">
                <div className="animate-scroll-horizontal flex gap-8">
                  {/* First set of logos */}
                  <div className="grid grid-rows-3 grid-flow-col gap-4 flex-shrink-0">
                    {/* Row 1 */}
                    {[
                      { name: 'TechCorp', color: 'text-blue-600', font: 'font-bold' },
                      { name: 'InnovateLabs', color: 'text-purple-600', font: 'font-extrabold italic' },
                      { name: 'FutureSoft', color: 'text-orange-600', font: 'font-bold' },
                      { name: 'DataFlow', color: 'text-cyan-600', font: 'font-semibold' },
                      { name: 'CloudNine', color: 'text-sky-600', font: 'font-bold' },
                      { name: 'CodeCraft', color: 'text-green-600', font: 'font-extrabold' },
                      { name: 'DevHub', color: 'text-indigo-700', font: 'font-bold' }
                    ].map((company, idx) => (
                      <div key={`r1-${idx}`} className="flex items-center justify-center h-20 px-4">
                        <span className={`${company.color} ${company.font} text-2xl hover:scale-110 transition-transform cursor-pointer`}>
                          {company.name}
                        </span>
                      </div>
                    ))}
                    {/* Row 2 */}
                    {[
                      { name: 'StartupX', color: 'text-red-600', font: 'font-black' },
                      { name: 'VentureY', color: 'text-yellow-600', font: 'font-bold italic' },
                      { name: 'BuildIt', color: 'text-orange-500', font: 'font-extrabold' },
                      { name: 'ScaleUp', color: 'text-emerald-600', font: 'font-bold' },
                      { name: 'GrowthCo', color: 'text-lime-600', font: 'font-semibold' },
                      { name: 'LaunchPad', color: 'text-blue-700', font: 'font-bold' },
                      { name: 'Nexus', color: 'text-purple-700', font: 'font-extrabold' }
                    ].map((company, idx) => (
                      <div key={`r2-${idx}`} className="flex items-center justify-center h-20 px-4">
                        <span className={`${company.color} ${company.font} text-2xl hover:scale-110 transition-transform cursor-pointer`}>
                          {company.name}
                        </span>
                      </div>
                    ))}
                    {/* Row 3 */}
                    {[
                      { name: 'Synergy', color: 'text-orange-600', font: 'font-bold italic' },
                      { name: 'Quantum', color: 'text-violet-600', font: 'font-black' },
                      { name: 'Vertex', color: 'text-teal-600', font: 'font-bold' },
                      { name: 'Zenith', color: 'text-blue-600', font: 'font-extrabold' },
                      { name: 'Apex', color: 'text-amber-600', font: 'font-bold' },
                      { name: 'Pinnacle', color: 'text-yellow-700', font: 'font-extrabold italic' }
                    ].map((company, idx) => (
                      <div key={`r3-${idx}`} className="flex items-center justify-center h-20 px-4">
                        <span className={`${company.color} ${company.font} text-2xl hover:scale-110 transition-transform cursor-pointer`}>
                          {company.name}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Duplicate set for seamless loop */}
                  <div className="grid grid-rows-3 grid-flow-col gap-4 flex-shrink-0">
                    {/* Row 1 */}
                    {[
                      { name: 'TechCorp', color: 'text-blue-600', font: 'font-bold' },
                      { name: 'InnovateLabs', color: 'text-purple-600', font: 'font-extrabold italic' },
                      { name: 'FutureSoft', color: 'text-orange-600', font: 'font-bold' },
                      { name: 'DataFlow', color: 'text-cyan-600', font: 'font-semibold' },
                      { name: 'CloudNine', color: 'text-sky-600', font: 'font-bold' },
                      { name: 'CodeCraft', color: 'text-green-600', font: 'font-extrabold' },
                      { name: 'DevHub', color: 'text-indigo-700', font: 'font-bold' }
                    ].map((company, idx) => (
                      <div key={`r1-dup-${idx}`} className="flex items-center justify-center h-20 px-4">
                        <span className={`${company.color} ${company.font} text-2xl hover:scale-110 transition-transform cursor-pointer`}>
                          {company.name}
                        </span>
                      </div>
                    ))}
                    {/* Row 2 */}
                    {[
                      { name: 'StartupX', color: 'text-red-600', font: 'font-black' },
                      { name: 'VentureY', color: 'text-yellow-600', font: 'font-bold italic' },
                      { name: 'BuildIt', color: 'text-orange-500', font: 'font-extrabold' },
                      { name: 'ScaleUp', color: 'text-emerald-600', font: 'font-bold' },
                      { name: 'GrowthCo', color: 'text-lime-600', font: 'font-semibold' },
                      { name: 'LaunchPad', color: 'text-blue-700', font: 'font-bold' },
                      { name: 'Nexus', color: 'text-purple-700', font: 'font-extrabold' }
                    ].map((company, idx) => (
                      <div key={`r2-dup-${idx}`} className="flex items-center justify-center h-20 px-4">
                        <span className={`${company.color} ${company.font} text-2xl hover:scale-110 transition-transform cursor-pointer`}>
                          {company.name}
                        </span>
                      </div>
                    ))}
                    {/* Row 3 */}
                    {[
                      { name: 'Synergy', color: 'text-orange-600', font: 'font-bold italic' },
                      { name: 'Quantum', color: 'text-violet-600', font: 'font-black' },
                      { name: 'Vertex', color: 'text-teal-600', font: 'font-bold' },
                      { name: 'Zenith', color: 'text-blue-600', font: 'font-extrabold' },
                      { name: 'Apex', color: 'text-amber-600', font: 'font-bold' },
                      { name: 'Pinnacle', color: 'text-yellow-700', font: 'font-extrabold italic' }
                    ].map((company, idx) => (
                      <div key={`r3-dup-${idx}`} className="flex items-center justify-center h-20 px-4">
                        <span className={`${company.color} ${company.font} text-2xl hover:scale-110 transition-transform cursor-pointer`}>
                          {company.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-center text-xs text-gray-500 mt-4">Auto-scrolling showcase</p>
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
