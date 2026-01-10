import { useState } from 'react';
import { Settings as SettingsIcon, Save } from 'lucide-react';
import Header from '../../components/common/Header';
import Sidebar from '../../components/common/Sidebar';

const AdminSettingsPage = () => {
    const [settings, setSettings] = useState({
        siteName: 'Dakshath LMS',
        siteDescription: 'Learning Management System with Job Placement',
        contactEmail: 'admin@dakshath.com',
        maxApplicationsPerStudent: 10,
        autoApproveCompanies: false,
        requireEmailVerification: true,
        allowStudentRegistration: true,
        maintenanceMode: false
    });

    const handleChange = (field, value) => {
        setSettings({ ...settings, [field]: value });
    };

    const handleSave = () => {
        // In a real application, this would save to backend
        alert('Settings saved successfully! (Note: This is a demo - settings are not persisted)');
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />
            <div className="flex">
                <Sidebar />
                <main className="flex-1 p-8">
                    <div className="max-w-4xl mx-auto">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900 mb-2">System Settings</h1>
                                <p className="text-gray-600">Configure system-wide settings and preferences</p>
                            </div>
                            <button
                                onClick={handleSave}
                                className="btn-primary flex items-center gap-2"
                            >
                                <Save className="w-4 h-4" />
                                Save Changes
                            </button>
                        </div>

                        {/* General Settings */}
                        <div className="card mb-6">
                            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                                <SettingsIcon className="w-5 h-5 text-primary" />
                                General Settings
                            </h2>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Site Name
                                    </label>
                                    <input
                                        type="text"
                                        value={settings.siteName}
                                        onChange={(e) => handleChange('siteName', e.target.value)}
                                        className="input-field"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Site Description
                                    </label>
                                    <textarea
                                        rows={3}
                                        value={settings.siteDescription}
                                        onChange={(e) => handleChange('siteDescription', e.target.value)}
                                        className="input-field"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Contact Email
                                    </label>
                                    <input
                                        type="email"
                                        value={settings.contactEmail}
                                        onChange={(e) => handleChange('contactEmail', e.target.value)}
                                        className="input-field"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Application Settings */}
                        <div className="card mb-6">
                            <h2 className="text-xl font-semibold mb-6">Application Settings</h2>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Max Applications Per Student
                                    </label>
                                    <input
                                        type="number"
                                        min="1"
                                        max="50"
                                        value={settings.maxApplicationsPerStudent}
                                        onChange={(e) => handleChange('maxApplicationsPerStudent', parseInt(e.target.value))}
                                        className="input-field"
                                    />
                                    <p className="text-sm text-gray-500 mt-1">
                                        Maximum number of job applications a student can submit
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* System Preferences */}
                        <div className="card mb-6">
                            <h2 className="text-xl font-semibold mb-6">System Preferences</h2>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                    <div>
                                        <p className="font-medium text-gray-900">Auto-Approve Companies</p>
                                        <p className="text-sm text-gray-600">Automatically approve new company registrations</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={settings.autoApproveCompanies}
                                            onChange={(e) => handleChange('autoApproveCompanies', e.target.checked)}
                                            className="sr-only peer"
                                        />
                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-light rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                    </label>
                                </div>

                                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                    <div>
                                        <p className="font-medium text-gray-900">Require Email Verification</p>
                                        <p className="text-sm text-gray-600">Users must verify their email before accessing the system</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={settings.requireEmailVerification}
                                            onChange={(e) => handleChange('requireEmailVerification', e.target.checked)}
                                            className="sr-only peer"
                                        />
                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-light rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                    </label>
                                </div>

                                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                    <div>
                                        <p className="font-medium text-gray-900">Allow Student Registration</p>
                                        <p className="text-sm text-gray-600">Enable public student registration</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={settings.allowStudentRegistration}
                                            onChange={(e) => handleChange('allowStudentRegistration', e.target.checked)}
                                            className="sr-only peer"
                                        />
                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-light rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                    </label>
                                </div>

                                <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                                    <div>
                                        <p className="font-medium text-gray-900">Maintenance Mode</p>
                                        <p className="text-sm text-gray-600">Disable public access to the system</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={settings.maintenanceMode}
                                            onChange={(e) => handleChange('maintenanceMode', e.target.checked)}
                                            className="sr-only peer"
                                        />
                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-yellow-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-500"></div>
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* Info Card */}
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <p className="text-sm text-blue-800">
                                <strong>Note:</strong> This is a demo settings page. In a production environment, these settings would be saved to a database and applied system-wide.
                            </p>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default AdminSettingsPage;
