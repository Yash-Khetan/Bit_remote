import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Activity, Heart, Bell, Users, TrendingUp, Calendar } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import FeedCard from '../components/FeedCard';
import ASHAWorkerDashboard from './ASHAWorkerDashboard';
import PatientDashboard from './PatientDashboard';

const Home: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { user, vitals, reminders, healthFeed } = useApp();

  // Get today's health feed items in current language
  const todaysFeed = healthFeed
    .filter(item => item.language === i18n.language)
    .slice(0, 3); // Show first 3 items

  // Get recent vitals summary
  const getRecentVitalsSummary = () => {
    const today = new Date();
    const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
    
    const todaysVitals = vitals.filter(vital => 
      new Date(vital.timestamp).toDateString() === today.toDateString()
    );
    
    return {
      todayCount: todaysVitals.length,
      totalCount: vitals.length
    };
  };

  // Get active reminders count
  const getActiveRemindersCount = () => {
    return reminders.filter(reminder => reminder.isActive).length;
  };

  const vitalsSummary = getRecentVitalsSummary();
  const activeRemindersCount = getActiveRemindersCount();

  if (!user) {
    return (
      <div className="p-4 text-center">
        <p>Loading...</p>
      </div>
    );
  }

  // Show ASHA worker dashboard for ASHA workers
  if (user.role === 'asha_worker') {
    return <ASHAWorkerDashboard />;
  }

  // Show patient dashboard for patients
  if (user.role === 'patient') {
    return <PatientDashboard />;
  }

  // Fallback for any other role
  return (
    <div className="p-4 space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-emerald-500 to-blue-600 text-white p-6 rounded-lg">
        <div className="flex items-center space-x-3 mb-2">
          <Heart className="w-8 h-8" />
          <div>
            <h1 className="text-xl font-bold">
              Welcome back, {user.name}!
            </h1>
            <p className="text-emerald-100">
              How are you feeling today?
            </p>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-4">
        <Link 
          to="/vitals"
          className="bg-white p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center space-x-3">
            <div className="bg-red-100 p-2 rounded-lg">
              <Activity className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{vitalsSummary.todayCount}</p>
              <p className="text-sm text-gray-600">Today's Readings</p>
            </div>
          </div>
        </Link>

        <Link 
          to="/reminders"
          className="bg-white p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center space-x-3">
            <div className="bg-yellow-100 p-2 rounded-lg">
              <Bell className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{activeRemindersCount}</p>
              <p className="text-sm text-gray-600">Active Reminders</p>
            </div>
          </div>
        </Link>
      </div>

      {/* Quick Actions */}
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 gap-3">
          <Link
            to="/vitals"
            className="flex flex-col items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
          >
            <TrendingUp className="w-6 h-6 text-blue-600 mb-2" />
            <span className="text-sm font-medium text-blue-700">Log Vitals</span>
          </Link>
          
          <Link
            to="/reminders"
            className="flex flex-col items-center p-4 bg-yellow-50 rounded-lg hover:bg-yellow-100 transition-colors"
          >
            <Calendar className="w-6 h-6 text-yellow-600 mb-2" />
            <span className="text-sm font-medium text-yellow-700">Set Reminder</span>
          </Link>
          
          <Link
            to="/connect"
            className="flex flex-col items-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
          >
            <Users className="w-6 h-6 text-green-600 mb-2" />
            <span className="text-sm font-medium text-green-700">Call ASHA</span>
          </Link>
          
          <Link
            to="/profile"
            className="flex flex-col items-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
          >
            <Heart className="w-6 h-6 text-purple-600 mb-2" />
            <span className="text-sm font-medium text-purple-700">Profile</span>
          </Link>
        </div>
      </div>

      {/* Today's Health Feed */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            {t('healthFeed.title')}
          </h3>
        </div>
        
        <div className="space-y-4">
          {todaysFeed.map((item) => (
            <FeedCard key={item.id} item={item} />
          ))}
        </div>
        
        {todaysFeed.length === 0 && (
          <div className="bg-white p-6 rounded-lg border border-gray-200 text-center">
            <Heart className="w-12 h-12 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-500">No health tips available today</p>
          </div>
        )}
      </div>

      {/* Health Conditions Summary */}
      {user.conditions.length > 0 && (
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-3">Your Health Conditions</h3>
          <div className="space-y-2">
            {user.conditions.map((condition) => (
              <div key={condition.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">{condition.name}</span>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  condition.severity === 'mild' 
                    ? 'bg-green-100 text-green-800'
                    : condition.severity === 'moderate'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {condition.severity}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;