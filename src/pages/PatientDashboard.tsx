import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { 
  Heart, 
  Activity, 
  Bell, 
  Users, 
  TrendingUp, 
  Calendar,
  Plus,
  AlertTriangle,
  CheckCircle,
  BarChart3
} from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import FeedCard from '../components/FeedCard';

const PatientDashboard: React.FC = () => {
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

  // Get latest health metrics
  const getLatestHealthMetrics = () => {
    const latestVitals = vitals.slice(-3); // Get last 3 readings
    return latestVitals;
  };

  // Get health alerts
  const getHealthAlerts = () => {
    const alerts = [];
    
    // Check for high blood sugar
    const latestBloodSugar = vitals
      .filter(v => v.type === 'blood_sugar')
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0];
    
    if (latestBloodSugar && latestBloodSugar.value > 180) {
      alerts.push({
        type: 'high_blood_sugar',
        message: 'High blood sugar detected',
        value: latestBloodSugar.value,
        timestamp: latestBloodSugar.timestamp,
        severity: 'high'
      });
    }

    // Check for high blood pressure
    const latestBP = vitals
      .filter(v => v.type === 'blood_pressure')
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0];
    
    if (latestBP && latestBP.systolic && latestBP.systolic > 140) {
      alerts.push({
        type: 'high_blood_pressure',
        message: 'High blood pressure detected',
        value: `${latestBP.systolic}/${latestBP.diastolic}`,
        timestamp: latestBP.timestamp,
        severity: 'high'
      });
    }

    return alerts;
  };

  const vitalsSummary = getRecentVitalsSummary();
  const activeRemindersCount = getActiveRemindersCount();
  const latestMetrics = getLatestHealthMetrics();
  const healthAlerts = getHealthAlerts();

  if (!user || user.role !== 'patient') {
    return (
      <div className="p-4 text-center">
        <p>Access denied. This page is for patients only.</p>
      </div>
    );
  }

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
        <div className="flex items-center space-x-4 mt-3">
          <div className="flex items-center space-x-1">
            <CheckCircle className="w-4 h-4 text-green-300" />
            <span className="text-sm">Health Status: Good</span>
          </div>
          <div className="flex items-center space-x-1">
            <Calendar className="w-4 h-4" />
            <span className="text-sm">Last Check: Today</span>
          </div>
        </div>
      </div>

      {/* Health Alerts */}
      {healthAlerts.length > 0 && (
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-3 flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            <span>Health Alerts</span>
          </h3>
          <div className="space-y-2">
            {healthAlerts.map((alert, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                <div>
                  <p className="font-medium text-gray-900">{alert.message}</p>
                  <p className="text-sm text-gray-600">Value: {alert.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

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

      {/* Latest Health Metrics */}
      {latestMetrics.length > 0 && (
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-4">Latest Health Metrics</h3>
          <div className="space-y-3">
            {latestMetrics.map((vital) => (
              <div key={vital.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="bg-emerald-100 p-2 rounded-lg">
                    <Activity className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {vital.type === 'blood_sugar' ? 'Blood Sugar' : 
                       vital.type === 'blood_pressure' ? 'Blood Pressure' : 'Weight'}
                    </p>
                    <p className="text-sm text-gray-600">
                      {new Date(vital.timestamp).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-900">
                    {vital.type === 'blood_pressure' 
                      ? `${vital.systolic}/${vital.diastolic}`
                      : vital.value
                    } {vital.unit}
                  </p>
                  {vital.notes && (
                    <p className="text-xs text-gray-600">{vital.notes}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

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
            to="/activity"
            className="flex flex-col items-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
          >
            <BarChart3 className="w-6 h-6 text-purple-600 mb-2" />
            <span className="text-sm font-medium text-purple-700">Activity Log</span>
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
      {user.conditions && user.conditions.length > 0 && (
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

      {/* Add Reading Button */}
      <div className="fixed bottom-20 right-4">
        <Link
          to="/vitals"
          className="w-14 h-14 bg-emerald-600 text-white rounded-full shadow-lg hover:bg-emerald-700 transition-colors flex items-center justify-center"
        >
          <Plus className="w-6 h-6" />
        </Link>
      </div>
    </div>
  );
};

export default PatientDashboard;
