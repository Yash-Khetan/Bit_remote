import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { User, Heart, Shield, ArrowRight } from 'lucide-react';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [selectedRole, setSelectedRole] = useState<'patient' | 'asha_worker' | null>(null);

  const handleLanguageChange = (language: 'en' | 'hi') => {
    i18n.changeLanguage(language);
  };

  const handleRoleSelection = (role: 'patient' | 'asha_worker') => {
    setSelectedRole(role);
    // Navigate to appropriate registration page
    if (role === 'patient') {
      navigate('/register/patient');
    } else {
      navigate('/register/asha');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-blue-50 px-4 py-8">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Heart className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {t('login.welcome')}
          </h1>
          <p className="text-gray-600">
            {t('login.subtitle')}
          </p>
        </div>

        {/* Language Selection */}
        <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            {t('login.selectLanguage')}
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => handleLanguageChange('en')}
              className={`p-3 rounded-lg border-2 transition-colors ${
                i18n.language === 'en'
                  ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              English
            </button>
            <button
              type="button"
              onClick={() => handleLanguageChange('hi')}
              className={`p-3 rounded-lg border-2 transition-colors ${
                i18n.language === 'hi'
                  ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              हिंदी
            </button>
          </div>
        </div>

        {/* Role Selection */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
            {t('login.selectRole')}
          </h3>
          <div className="space-y-4">
            {/* Patient Option */}
            <button
              onClick={() => handleRoleSelection('patient')}
              className="w-full flex items-center justify-between p-4 rounded-lg border-2 border-gray-200 hover:border-emerald-500 hover:bg-emerald-50 transition-colors group"
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-blue-600" />
                </div>
                <div className="text-left">
                  <h4 className="font-semibold text-gray-900">{t('login.patient')}</h4>
                  <p className="text-sm text-gray-600">{t('login.patientDescription')}</p>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-emerald-600" />
            </button>

            {/* ASHA Worker Option */}
            <button
              onClick={() => handleRoleSelection('asha_worker')}
              className="w-full flex items-center justify-between p-4 rounded-lg border-2 border-gray-200 hover:border-emerald-500 hover:bg-emerald-50 transition-colors group"
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                  <Shield className="w-6 h-6 text-emerald-600" />
                </div>
                <div className="text-left">
                  <h4 className="font-semibold text-gray-900">{t('login.ashaWorker')}</h4>
                  <p className="text-sm text-gray-600">{t('login.ashaWorkerDescription')}</p>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-emerald-600" />
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-sm text-gray-500">
            {t('login.helpText')}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
