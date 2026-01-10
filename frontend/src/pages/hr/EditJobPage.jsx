import { useState, useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import Header from '../../components/common/Header';
import Sidebar from '../../components/common/Sidebar';
import { jobService } from '../../services/jobService';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const EditJobPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        job_type: 'full-time',
        location: '',
        department: '',
        required_score_min: '',
        salary_min: '',
        salary_max: '',
        experience_level: '',
        application_deadline: '',
        number_of_positions: '1',
        qualifications: '',
        status: 'draft'
    });

    // Fetch job details
    const { data: jobData, isLoading } = useQuery({
        queryKey: ['job', id],
        queryFn: () => jobService.getJobById(id),
        retry: 1
    });

    // Populate form when job data is loaded
    useEffect(() => {
        if (jobData?.data) {
            const job = jobData.data;
            setFormData({
                title: job.title || '',
                description: job.description || '',
                job_type: job.job_type || 'full-time',
                location: job.location || '',
                department: job.department || '',
                required_score_min: job.required_score_min || '',
                salary_min: job.salary_min || '',
                salary_max: job.salary_max || '',
                experience_level: job.experience_level || '',
                application_deadline: job.application_deadline ? new Date(job.application_deadline).toISOString().slice(0, 16) : '',
                number_of_positions: job.number_of_positions || '1',
                qualifications: job.qualifications || '',
                status: job.status || 'draft'
            });
        }
    }, [jobData]);

    const updateMutation = useMutation({
        mutationFn: (data) => jobService.updateJob(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries(['companyJobs']);
            queryClient.invalidateQueries(['job', id]);
            navigate('/hr/jobs');
        }
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        const submitData = {
            ...formData,
            required_score_min: parseFloat(formData.required_score_min),
            salary_min: formData.salary_min ? parseFloat(formData.salary_min) : null,
            salary_max: formData.salary_max ? parseFloat(formData.salary_max) : null,
            number_of_positions: parseInt(formData.number_of_positions),
            application_deadline: formData.application_deadline || null
        };

        updateMutation.mutate(submitData);
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Header />
                <div className="flex">
                    <Sidebar />
                    <main className="flex-1 p-8">
                        <LoadingSpinner size="lg" />
                    </main>
                </div>
            </div>
        );
    }

    const job = jobData?.data;

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />
            <div className="flex">
                <Sidebar />
                <main className="flex-1 p-8">
                    <div className="max-w-4xl mx-auto">
                        <div className="mb-6">
                            <h1 className="text-3xl font-bold text-gray-900">Edit Job Listing</h1>
                            {job?.created_at && (
                                <p className="text-sm text-gray-600 mt-2">
                                    Created on: {new Date(job.created_at).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}
                                </p>
                            )}
                        </div>

                        <form onSubmit={handleSubmit} className="card space-y-6">
                            {/* Basic Information */}
                            <div className="border-b pb-6">
                                <h2 className="text-xl font-semibold text-gray-900 mb-4">Basic Information</h2>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Job Title *
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.title}
                                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                            className="input-field"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Job Description *
                                        </label>
                                        <textarea
                                            required
                                            rows={6}
                                            value={formData.description}
                                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                            className="input-field"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Job Type *
                                            </label>
                                            <select
                                                required
                                                value={formData.job_type}
                                                onChange={(e) => setFormData({ ...formData, job_type: e.target.value })}
                                                className="input-field"
                                            >
                                                <option value="full-time">Full-time</option>
                                                <option value="part-time">Part-time</option>
                                                <option value="internship">Internship</option>
                                                <option value="contract">Contract</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Status *
                                            </label>
                                            <select
                                                required
                                                value={formData.status}
                                                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                                className="input-field"
                                            >
                                                <option value="draft">Draft</option>
                                                <option value="active">Active</option>
                                                <option value="closed">Closed</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Location
                                            </label>
                                            <input
                                                type="text"
                                                value={formData.location}
                                                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                                className="input-field"
                                                placeholder="e.g., Remote, New York, NY"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Department
                                            </label>
                                            <input
                                                type="text"
                                                value={formData.department}
                                                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                                                className="input-field"
                                                placeholder="e.g., Engineering, Sales"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Requirements */}
                            <div className="border-b pb-6">
                                <h2 className="text-xl font-semibold text-gray-900 mb-4">Requirements</h2>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Minimum Required Points *
                                        </label>
                                        <input
                                            type="number"
                                            required
                                            min="0"
                                            step="0.01"
                                            value={formData.required_score_min}
                                            onChange={(e) => setFormData({ ...formData, required_score_min: e.target.value })}
                                            className="input-field"
                                        />
                                        <p className="text-xs text-gray-500 mt-1">
                                            Students must have at least this many points to apply
                                        </p>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Experience Level
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.experience_level}
                                            onChange={(e) => setFormData({ ...formData, experience_level: e.target.value })}
                                            className="input-field"
                                            placeholder="e.g., Entry Level, Mid-Senior, Senior"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Qualifications
                                        </label>
                                        <textarea
                                            rows={4}
                                            value={formData.qualifications}
                                            onChange={(e) => setFormData({ ...formData, qualifications: e.target.value })}
                                            className="input-field"
                                            placeholder="List required qualifications, certifications, or skills..."
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Compensation & Details */}
                            <div className="border-b pb-6">
                                <h2 className="text-xl font-semibold text-gray-900 mb-4">Compensation & Details</h2>

                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Minimum Salary
                                            </label>
                                            <input
                                                type="number"
                                                min="0"
                                                step="0.01"
                                                value={formData.salary_min}
                                                onChange={(e) => setFormData({ ...formData, salary_min: e.target.value })}
                                                className="input-field"
                                                placeholder="e.g., 50000"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Maximum Salary
                                            </label>
                                            <input
                                                type="number"
                                                min="0"
                                                step="0.01"
                                                value={formData.salary_max}
                                                onChange={(e) => setFormData({ ...formData, salary_max: e.target.value })}
                                                className="input-field"
                                                placeholder="e.g., 80000"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Number of Positions *
                                            </label>
                                            <input
                                                type="number"
                                                required
                                                min="1"
                                                value={formData.number_of_positions}
                                                onChange={(e) => setFormData({ ...formData, number_of_positions: e.target.value })}
                                                className="input-field"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Application Deadline
                                            </label>
                                            <input
                                                type="datetime-local"
                                                value={formData.application_deadline}
                                                onChange={(e) => setFormData({ ...formData, application_deadline: e.target.value })}
                                                className="input-field"
                                            />
                                            <p className="text-xs text-gray-500 mt-1">
                                                Leave empty for no deadline
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-4">
                                <button
                                    type="submit"
                                    className="btn-primary"
                                    disabled={updateMutation.isPending}
                                >
                                    {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => navigate('/hr/jobs')}
                                    className="btn-secondary"
                                >
                                    Cancel
                                </button>
                            </div>

                            {updateMutation.isError && (
                                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                                    Error updating job: {updateMutation.error?.message || 'Please try again'}
                                </div>
                            )}
                        </form>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default EditJobPage;
