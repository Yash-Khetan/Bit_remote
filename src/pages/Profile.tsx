import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  User as UserIcon, 
  Phone, 
  Calendar, 
  Heart, 
  Settings, 
  Bell, 
  Globe,
  LogOut,
  Shield,
  MapPin,
  Star,
  Award
} from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import LanguageSelector from '../components/LanguageSelector';

const Profile: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user, setUser } = useApp();

  const handleSignOut = () => {
    setUser(null);
    navigate('/login');
  };

  if (!user) {
    return (
      <div className="p-4 text-center">
        <p>Loading...</p>
      </div>
    );
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <h1 className="text-2xl font-bold text-gray-900">{t('profile.title')}</h1>

      {/* Profile Card */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center overflow-hidden">
            {user.profilePicture ? (
              <img
                src={user.profilePicture}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <UserIcon className="w-10 h-10 text-emerald-600" />
            )}
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">{user.name}</h2>
            <p className="text-gray-600">
              {user.role === 'asha_worker' ? 'ASHA Worker' : `${user.age} years old`}
            </p>
            {user.role === 'asha_worker' && (
              <div className="flex items-center space-x-2 mt-1">
                <Star className="w-4 h-4 text-yellow-500" />
                <span className="text-sm text-gray-600">4.8 Rating</span>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center space-x-3">
            <Phone className="w-5 h-5 text-gray-400" />
            <span className="text-gray-700">{user.phone}</span>
          </div>
          
          {user.role === 'asha_worker' && user.village && (
            <div className="flex items-center space-x-3">
              <MapPin className="w-5 h-5 text-gray-400" />
              <span className="text-gray-700">{user.village}</span>
            </div>
          )}
          
          {user.role === 'asha_worker' && user.experience && (
            <div className="flex items-center space-x-3">
              <Award className="w-5 h-5 text-gray-400" />
              <span className="text-gray-700">{user.experience} years experience</span>
            </div>
          )}
          
          <div className="flex items-center space-x-3">
            <Calendar className="w-5 h-5 text-gray-400" />
            <span className="text-gray-700">
              Joined {formatDate(user.createdAt)}
            </span>
          </div>
          
          <div className="flex items-center space-x-3">
            <Globe className="w-5 h-5 text-gray-400" />
            <span className="text-gray-700">
              Language: {user.language === 'en' ? 'English' : 'हिंदी'}
            </span>
          </div>
        </div>
      </div>

      {/* Health Conditions - Only for patients */}
      {user.role === 'patient' && (
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
            <Heart className="w-5 h-5 text-red-500" />
            <span>{t('profile.healthConditions')}</span>
          </h3>
          
          {user.conditions && user.conditions.length > 0 ? (
            <div className="space-y-3">
              {user.conditions.map((condition) => (
                <div key={condition.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{condition.name}</p>
                    <p className="text-sm text-gray-600">
                      Diagnosed: {formatDate(condition.diagnosedDate)}
                    </p>
                  </div>
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
          ) : (
            <p className="text-gray-500 text-center py-4">No health conditions recorded</p>
          )}
        </div>
      )}

      {/* ASHA Worker Specializations */}
      {user.role === 'asha_worker' && user.specialization && user.specialization.length > 0 && (
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
            <Shield className="w-5 h-5 text-emerald-500" />
            <span>Specializations</span>
          </h3>
          
          <div className="flex flex-wrap gap-2">
            {user.specialization.map((spec) => (
              <span
                key={spec}
                className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-sm"
              >
                {spec.replace('_', ' ')}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Settings */}
      <div className="bg-white rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 p-6 border-b border-gray-200 flex items-center space-x-2">
          <Settings className="w-5 h-5 text-gray-500" />
          <span>{t('profile.settings')}</span>
        </h3>
        
        <div className="divide-y divide-gray-200">
          {/* Language Setting */}
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Globe className="w-5 h-5 text-gray-400" />
              <div>
                <p className="font-medium text-gray-900">{t('profile.language')}</p>
                <p className="text-sm text-gray-600">Choose your preferred language</p>
              </div>
            </div>
            <LanguageSelector />
          </div>

          {/* Notifications Setting */}
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Bell className="w-5 h-5 text-gray-400" />
              <div>
                <p className="font-medium text-gray-900">{t('profile.notifications')}</p>
                <p className="text-sm text-gray-600">Manage notification preferences</p>
              </div>
            </div>
            <button
              onClick={() => navigate('/reminders')}
              className="text-emerald-600 text-sm hover:text-emerald-700"
            >
              Configure
            </button>
          </div>
        </div>
      </div>

      {/* Sign Out */}
      <button
        onClick={handleSignOut}
        className="w-full bg-red-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-red-700 transition-colors flex items-center justify-center space-x-2"
      >
        <LogOut className="w-5 h-5" />
        <span>{t('profile.signOut')}</span>
      </button>
    </div>
  );
};

export default Profile;