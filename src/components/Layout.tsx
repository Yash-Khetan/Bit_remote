import React, { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  Home, 
  Activity, 
  Bell, 
  Users, 
  User,
  Shield,
  Calendar,
  BarChart3
} from 'lucide-react';
import LanguageSelector from './LanguageSelector';
import { useApp } from '../contexts/AppContext';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const { t } = useTranslation();
  const { user } = useApp();

  // Different navigation based on user role
  const getNavigation = () => {
    if (user?.role === 'asha_worker') {
      return [
        { path: '/', icon: Home, label: t('navigation.dashboard') },
        { path: '/patients', icon: Users, label: t('navigation.patients') },
        { path: '/visits', icon: Calendar, label: t('navigation.visits') },
        { path: '/reports', icon: BarChart3, label: t('navigation.reports') },
        { path: '/profile', icon: User, label: t('navigation.profile') }
      ];
    } else {
      return [
        { path: '/', icon: Home, label: t('navigation.home') },
        { path: '/vitals', icon: Activity, label: t('navigation.vitals') },
        { path: '/activity', icon: BarChart3, label: t('navigation.activity') },
        { path: '/reminders', icon: Bell, label: t('navigation.reminders') },
        { path: '/connect', icon: Users, label: t('navigation.connect') },
        { path: '/profile', icon: User, label: t('navigation.profile') }
      ];
    }
  };

  const navigation = getNavigation();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-md mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold text-gray-900">Aarogya Sahayak</h1>
          </div>
          <LanguageSelector />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-md mx-auto w-full">
        {children}
      </main>

      {/* Bottom Navigation */}
      <nav className="bg-white border-t border-gray-200">
        <div className="max-w-md mx-auto px-2 py-2">
          <div className="flex justify-around">
            {navigation.map(({ path, icon: Icon, label }) => {
              const isActive = location.pathname === path;
              return (
                <Link
                  key={path}
                  to={path}
                  className={`flex flex-col items-center py-2 px-3 rounded-lg transition-colors ${
                    isActive 
                      ? 'text-emerald-600 bg-emerald-50' 
                      : 'text-gray-600 hover:text-emerald-600 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-5 h-5 mb-1" />
                  <span className="text-xs font-medium">{label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Layout;