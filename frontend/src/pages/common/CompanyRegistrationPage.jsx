import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Building2, Mail, Lock, Phone, Globe, MapPin, Users, AlertCircle, CheckCircle } from 'lucide-react';
import { companyService } from '../../services/companyService';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const CompanyRegistrationPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    // Company details
    company_name: '',
    description: '',
    website: '',
    industry: '',
    location: '',
    phone: '',
    employee_count: '',
    // HR user details
    hr_name: '',
    hr_email: '',
    hr_password: '',
    hr_confirm_password: '',
    hr_phone: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validation
    if (formData.hr_password !== formData.hr_confirm_password) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (formData.hr_password.length < 6) {
      setError('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    try {
      const registrationData = {
        company_name: formData.company_name,
        description: formData.description,
        website: formData.website,
        industry: formData.industry,
        location: formData.location,
        phone: formData.phone,
        employee_count: formData.employee_count || null,
        hr_name: formData.hr_name,
        hr_email: formData.hr_email,
        hr_password: formData.hr_password,
        hr_phone: formData.hr_phone
      };

      const response = await companyService.registerCompany(registrationData);
      
      if (response.success) {
        setSuccess(true);
        // Redirect to login after 3 seconds
        setTimeout(() => {
          navigate('/login?registered=true');
        }, 3000);
      }
    } catch (err) {
      // Handle validation errors with details
      const errorData = err.response?.data?.error;
      if (errorData?.details && Array.isArray(errorData.details) && errorData.details.length > 0) {
        // Show specific field errors
        const fieldErrors = errorData.details.map(d => `${d.field}: ${d.message}`).join(', ');
        setError(`${errorData.message || 'Validation failed'}. ${fieldErrors}`);
      } else {
        setError(errorData?.message || 'Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-light to-white flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="card text-center">
            <div className="mb-6">
              <div className="w-16 h-16 bg-success-light rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-success" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Registration Successful!</h1>
              <p className="text-gray-600 mb-4">
                Your company registration has been submitted successfully.
              </p>
              <p className="text-sm text-gray-500 mb-6">
                Your account is pending admin approval. You will receive an email notification once your company is approved. You can then login with your credentials.
              </p>
              <p className="text-sm text-gray-500">
                Redirecting to login page...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-light to-white py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center text-primary hover:text-primary-dark mb-4">
            <Building2 className="w-6 h-6 mr-2" />
            <span className="text-xl font-bold">Dakshath</span>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Company Registration</h1>
          <p className="text-gray-600">
            Register your company to start posting jobs and finding qualified candidates
          </p>
        </div>

        {/* Registration Form */}
        <div className="card">
          {error && (
            <div className="mb-6 p-4 bg-error-light border border-error rounded-lg">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-error mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-error mb-1">Validation Error</p>
                  <p className="text-sm text-error">{error}</p>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Company Information Section */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-primary" />
                Company Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Company Name <span className="text-error">*</span>
                  </label>
                  <input
                    type="text"
                    name="company_name"
                    required
                    value={formData.company_name}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="Enter company name"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Company Description
                  </label>
                  <textarea
                    name="description"
                    rows={4}
                    value={formData.description}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="Describe your company, its mission, and values"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Globe className="w-4 h-4 inline mr-1" />
                    Website
                  </label>
                  <input
                    type="url"
                    name="website"
                    value={formData.website}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="https://www.example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Industry
                  </label>
                  <input
                    type="text"
                    name="industry"
                    value={formData.industry}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="e.g., Technology, Finance, Healthcare"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <MapPin className="w-4 h-4 inline mr-1" />
                    Location
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="City, State, Country"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Phone className="w-4 h-4 inline mr-1" />
                    Phone
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="+1 234 567 8900"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Users className="w-4 h-4 inline mr-1" />
                    Employee Count
                  </label>
                  <select
                    name="employee_count"
                    value={formData.employee_count}
                    onChange={handleChange}
                    className="input-field"
                  >
                    <option value="">Select range</option>
                    <option value="1-10">1-10</option>
                    <option value="11-50">11-50</option>
                    <option value="51-200">51-200</option>
                    <option value="201-500">201-500</option>
                    <option value="501-1000">501-1000</option>
                    <option value="1000+">1000+</option>
                  </select>
                </div>
              </div>
            </div>

            {/* HR User Account Section */}
            <div className="border-t border-gray-200 pt-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Mail className="w-5 h-5 text-primary" />
                Primary HR User Account
              </h2>
              <p className="text-sm text-gray-600 mb-4">
                This will be your login account. You can add more HR users after approval.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name <span className="text-error">*</span>
                  </label>
                  <input
                    type="text"
                    name="hr_name"
                    required
                    value={formData.hr_name}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email <span className="text-error">*</span>
                  </label>
                  <input
                    type="email"
                    name="hr_email"
                    required
                    value={formData.hr_email}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="your.email@company.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone
                  </label>
                  <input
                    type="tel"
                    name="hr_phone"
                    value={formData.hr_phone}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="+1 234 567 8900"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password <span className="text-error">*</span>
                  </label>
                  <input
                    type="password"
                    name="hr_password"
                    required
                    value={formData.hr_password}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="Minimum 6 characters"
                    minLength={6}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm Password <span className="text-error">*</span>
                  </label>
                  <input
                    type="password"
                    name="hr_confirm_password"
                    required
                    value={formData.hr_confirm_password}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="Re-enter password"
                    minLength={6}
                  />
                </div>
              </div>
            </div>

            {/* Terms and Submit */}
            <div className="border-t border-gray-200 pt-6">
              <div className="flex items-start gap-2 mb-6">
                <input
                  type="checkbox"
                  id="terms"
                  required
                  className="mt-1"
                />
                <label htmlFor="terms" className="text-sm text-gray-600">
                  I agree to the Terms of Service and Privacy Policy. I understand that my company registration is subject to admin approval.
                </label>
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary flex-1"
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <LoadingSpinner size="sm" />
                      <span className="ml-2">Registering...</span>
                    </span>
                  ) : (
                    'Register Company'
                  )}
                </button>
                <Link to="/" className="btn-secondary">
                  Cancel
                </Link>
              </div>

              <p className="text-center text-sm text-gray-600 mt-4">
                Already have an account?{' '}
                <Link to="/login" className="text-primary hover:text-primary-dark font-medium">
                  Login here
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CompanyRegistrationPage;

