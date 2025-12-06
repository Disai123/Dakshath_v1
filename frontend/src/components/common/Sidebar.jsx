import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  Briefcase,
  FileText,
  User,
  Building2,
  Users,
  Settings
} from 'lucide-react';

const Sidebar = () => {
  const { user } = useAuth();
  const location = useLocation();

  const studentMenu = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/jobs', label: 'Browse Jobs', icon: Briefcase },
    { path: '/applications', label: 'My Applications', icon: FileText },
    { path: '/profile', label: 'Profile', icon: User }
  ];

  const hrMenu = [
    { path: '/hr/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/hr/jobs', label: 'Job Listings', icon: Briefcase },
    { path: '/hr/applications', label: 'Applications', icon: FileText },
    { path: '/hr/company', label: 'Company Profile', icon: Building2 }
  ];

  const adminMenu = [
    { path: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/admin/companies', label: 'Companies', icon: Building2 },
    { path: '/admin/users', label: 'Users', icon: Users },
    { path: '/admin/requests', label: 'HR Requests', icon: FileText },
    { path: '/admin/settings', label: 'Settings', icon: Settings }
  ];

  const getMenu = () => {
    if (user?.role === 'student') return studentMenu;
    if (user?.role === 'hr') return hrMenu;
    if (user?.role === 'admin') return adminMenu;
    return [];
  };

  const menu = getMenu();

  return (
    <aside className="w-64 bg-white border-r border-gray-200 min-h-screen">
      <nav className="p-4">
        <ul className="space-y-2">
          {menu.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-primary-light text-primary font-medium'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;

