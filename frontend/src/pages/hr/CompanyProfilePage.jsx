import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import Header from '../../components/common/Header';
import Sidebar from '../../components/common/Sidebar';
import { companyService } from '../../services/companyService';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const CompanyProfilePage = () => {
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});

  const { data, isLoading } = useQuery({
    queryKey: ['companyProfile'],
    queryFn: () => companyService.getCompanyProfile(),
    onSuccess: (data) => {
      setFormData(data.data);
    }
  });

  const updateMutation = useMutation({
    mutationFn: companyService.updateCompanyProfile,
    onSuccess: () => {
      queryClient.invalidateQueries(['companyProfile']);
      setIsEditing(false);
    }
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

  const company = data?.data;

  const handleSubmit = (e) => {
    e.preventDefault();
    updateMutation.mutate(formData);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-8">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-3xl font-bold text-gray-900">Company Profile</h1>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="btn-secondary"
              >
                {isEditing ? 'Cancel' : 'Edit'}
              </button>
            </div>

            <form onSubmit={handleSubmit} className="card space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Company Name
                </label>
                <input
                  type="text"
                  value={formData.company_name || ''}
                  disabled={!isEditing}
                  onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                  className="input-field disabled:bg-gray-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  rows={4}
                  value={formData.description || ''}
                  disabled={!isEditing}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="input-field disabled:bg-gray-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Industry
                  </label>
                  <input
                    type="text"
                    value={formData.industry || ''}
                    disabled={!isEditing}
                    onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                    className="input-field disabled:bg-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    value={formData.location || ''}
                    disabled={!isEditing}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="input-field disabled:bg-gray-100"
                  />
                </div>
              </div>

              {isEditing && (
                <button type="submit" className="btn-primary" disabled={updateMutation.isPending}>
                  {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
                </button>
              )}
            </form>
          </div>
        </main>
      </div>
    </div>
  );
};

export default CompanyProfilePage;

