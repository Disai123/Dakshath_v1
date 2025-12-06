import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Header from '../../components/common/Header';
import Sidebar from '../../components/common/Sidebar';
import { adminService } from '../../services/adminService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { Users, Building2, Briefcase, FileText, UserCheck, TrendingUp } from 'lucide-react';
import { formatDate } from '../../utils/helpers';
import { STATUS_LABELS, STATUS_COLORS } from '../../utils/constants';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  
  const { data, isLoading, error } = useQuery({
    queryKey: ['adminDashboard'],
    queryFn: () => adminService.getDashboard(),
    retry: 1
  });

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

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex">
          <Sidebar />
          <div className="flex-1 p-8">
            <div className="card bg-error-light border border-error">
              <p className="text-error">Error loading dashboard: {error.message}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const stats = data?.data || {};
  const allStudents = stats.all_students || [];
  const allHRUsers = stats.all_hr_users || [];
  const allJobs = stats.all_jobs || [];
  const allApplications = stats.all_applications || [];
  const allCompanies = stats.all_companies || [];

  const tabs = [
    { id: 'overview', label: 'Overview', icon: TrendingUp },
    { id: 'students', label: 'All Students', icon: Users },
    { id: 'hr', label: 'All HR Users', icon: UserCheck },
    { id: 'jobs', label: 'All Jobs', icon: Briefcase },
    { id: 'applications', label: 'All Applications', icon: FileText },
    { id: 'companies', label: 'All Companies', icon: Building2 }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              <div className="card">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Students</p>
                    <p className="text-2xl font-bold">{stats.total_students || 0}</p>
                  </div>
                  <Users className="w-8 h-8 text-primary" />
                </div>
              </div>
              <div className="card">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total HR Users</p>
                    <p className="text-2xl font-bold">{stats.total_hr_users || 0}</p>
                  </div>
                  <UserCheck className="w-8 h-8 text-success" />
                </div>
              </div>
              <div className="card">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Companies</p>
                    <p className="text-2xl font-bold">{stats.total_companies || 0}</p>
                    {stats.pending_companies > 0 && (
                      <p className="text-xs text-warning mt-1">{stats.pending_companies} pending</p>
                    )}
                  </div>
                  <Building2 className="w-8 h-8 text-warning" />
                </div>
              </div>
              <div className="card">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Jobs</p>
                    <p className="text-2xl font-bold">{stats.total_jobs || 0}</p>
                    <p className="text-xs text-gray-500 mt-1">{stats.active_jobs || 0} active</p>
                  </div>
                  <Briefcase className="w-8 h-8 text-error" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="card">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Applications</p>
                    <p className="text-2xl font-bold">{stats.total_applications || 0}</p>
                  </div>
                  <FileText className="w-8 h-8 text-primary" />
                </div>
              </div>
              <div className="card">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Active Companies</p>
                    <p className="text-2xl font-bold">{stats.active_companies || 0}</p>
                  </div>
                  <Building2 className="w-8 h-8 text-success" />
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="card mb-6">
              <div className="border-b border-gray-200">
                <nav className="flex space-x-8">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                          activeTab === tab.id
                            ? 'border-primary text-primary'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        {tab.label}
                      </button>
                    );
                  })}
                </nav>
              </div>
            </div>

            {/* Tab Content */}
            <div className="card">
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Application Status Breakdown</h3>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                      {stats.applications_by_status?.map((item) => (
                        <div key={item.status} className="text-center p-4 bg-gray-50 rounded-lg">
                          <p className="text-2xl font-bold">{item.count}</p>
                          <p className="text-sm text-gray-600">{STATUS_LABELS[item.status] || item.status}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'students' && (
                <div>
                  <h3 className="text-lg font-semibold mb-4">All Students ({allStudents.length})</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Joined</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Last Login</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {allStudents && allStudents.length > 0 ? (
                          allStudents.map((student) => (
                            <tr key={student.id} className="hover:bg-gray-50">
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                  {student.avatar ? (
                                    <img src={student.avatar} alt={student.name} className="w-10 h-10 rounded-full" />
                                  ) : (
                                    <div className="w-10 h-10 rounded-full bg-primary-light flex items-center justify-center">
                                      <Users className="w-5 h-5 text-primary" />
                                    </div>
                                  )}
                                  <p className="font-medium">{student.name}</p>
                                </div>
                              </td>
                              <td className="px-6 py-4 text-gray-600">{student.email}</td>
                              <td className="px-6 py-4">
                                <span className={`badge badge-${student.is_active !== false ? 'success' : 'error'}`}>
                                  {student.is_active !== false ? 'Active' : 'Inactive'}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-gray-600">{formatDate(student.created_at)}</td>
                              <td className="px-6 py-4 text-gray-600">
                                {student.last_login ? formatDate(student.last_login) : 'Never'}
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                              No students found
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {activeTab === 'hr' && (
                <div>
                  <h3 className="text-lg font-semibold mb-4">All HR Users ({allHRUsers.length})</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Company</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Joined</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Last Login</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {allHRUsers && allHRUsers.length > 0 ? (
                          allHRUsers.map((hrUser) => (
                            <tr key={hrUser.id} className="hover:bg-gray-50">
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                  {hrUser.user?.avatar ? (
                                    <img src={hrUser.user.avatar} alt={hrUser.user.name} className="w-10 h-10 rounded-full" />
                                  ) : (
                                    <div className="w-10 h-10 rounded-full bg-success-light flex items-center justify-center">
                                      <UserCheck className="w-5 h-5 text-success" />
                                    </div>
                                  )}
                                  <p className="font-medium">{hrUser.user?.name || 'N/A'}</p>
                                </div>
                              </td>
                              <td className="px-6 py-4 text-gray-600">{hrUser.user?.email || 'N/A'}</td>
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-2">
                                  {hrUser.company?.logo_url && (
                                    <img src={hrUser.company.logo_url} alt={hrUser.company.company_name} className="w-6 h-6 rounded" />
                                  )}
                                  <span className="font-medium">{hrUser.company?.company_name || 'N/A'}</span>
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <span className={`badge badge-${(hrUser.is_active !== false && hrUser.user?.is_active !== false) ? 'success' : 'error'}`}>
                                  {(hrUser.is_active !== false && hrUser.user?.is_active !== false) ? 'Active' : 'Inactive'}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-gray-600">
                                {hrUser.user?.created_at ? formatDate(hrUser.user.created_at) : 'N/A'}
                              </td>
                              <td className="px-6 py-4 text-gray-600">
                                {hrUser.user?.last_login ? formatDate(hrUser.user.last_login) : 'Never'}
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                              No HR users found
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {activeTab === 'jobs' && (
                <div>
                  <h3 className="text-lg font-semibold mb-4">All Jobs ({allJobs && allJobs.length || 0})</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Job Title</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Company</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Applications</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Posted</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {allJobs && allJobs.length > 0 ? (
                          allJobs.map((job) => (
                          <tr key={job.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4">
                              <p className="font-medium">{job.title}</p>
                              <p className="text-sm text-gray-600">{job.job_type} • {job.location || 'Remote'}</p>
                            </td>
                            <td className="px-6 py-4">{job.company?.company_name || 'N/A'}</td>
                            <td className="px-6 py-4">
                              <span className={`badge badge-${job.status === 'active' ? 'success' : 'info'}`}>
                                {job.status}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <div className="space-y-1">
                                <p className="font-medium">{job.total_applications || 0} total</p>
                                <div className="text-xs text-gray-600 space-x-2">
                                  <span>Applied: {job.applications_by_status?.applied || 0}</span>
                                  <span>•</span>
                                  <span>Accepted: {job.applications_by_status?.accepted || 0}</span>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-gray-600">{formatDate(job.created_at)}                            </td>
                          </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                              No jobs found
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {activeTab === 'applications' && (
                <div>
                  <h3 className="text-lg font-semibold mb-4">All Applications ({allApplications && allApplications.length || 0})</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Student</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Job</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Company</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Applied</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Score</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {allApplications && allApplications.length > 0 ? (
                          allApplications.map((app) => (
                            <tr key={app.id} className="hover:bg-gray-50">
                              <td className="px-6 py-4">
                                <p className="font-medium">{app.student?.name || 'N/A'}</p>
                                <p className="text-sm text-gray-600">{app.student?.email || 'N/A'}</p>
                              </td>
                              <td className="px-6 py-4">{app.jobListing?.title || 'N/A'}</td>
                              <td className="px-6 py-4">{app.jobListing?.company?.company_name || 'N/A'}</td>
                              <td className="px-6 py-4">
                                <span className={`badge badge-${STATUS_COLORS[app.status] || 'info'}`}>
                                  {STATUS_LABELS[app.status] || app.status}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-gray-600">{formatDate(app.applied_at)}</td>
                              <td className="px-6 py-4 text-gray-600">{app.score_at_application || 'N/A'}</td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                              No applications found
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {activeTab === 'companies' && (
                <div>
                  <h3 className="text-lg font-semibold mb-4">All Companies ({allCompanies && allCompanies.length || 0})</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Company Name</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Jobs</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">HR Users</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Created</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {allCompanies && allCompanies.length > 0 ? (
                          allCompanies.map((company) => (
                            <tr key={company.id} className="hover:bg-gray-50">
                              <td className="px-6 py-4">
                                <p className="font-medium">{company.company_name}</p>
                                {company.industry && (
                                  <p className="text-sm text-gray-600">{company.industry}</p>
                                )}
                              </td>
                              <td className="px-6 py-4 text-gray-600">{company.email || 'N/A'}</td>
                              <td className="px-6 py-4">
                                <span className={`badge badge-${company.status === 'active' ? 'success' : company.status === 'pending' ? 'warning' : 'error'}`}>
                                  {company.status}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-gray-600">{company.total_jobs || 0}</td>
                              <td className="px-6 py-4 text-gray-600">{company.total_hr_users || 0}</td>
                              <td className="px-6 py-4 text-gray-600">{formatDate(company.created_at)}</td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                              No companies found
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
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

export default AdminDashboard;

