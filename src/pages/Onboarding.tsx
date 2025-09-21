import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { User, Heart, Activity } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { HealthCondition } from '../types';

const Onboarding: React.FC = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const { setUser } = useApp();
  
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    phone: '',
    ashaId: '',
    conditions: [] as string[]
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleConditionToggle = (condition: string) => {
    setFormData(prev => ({
      ...prev,
      conditions: prev.conditions.includes(condition)
        ? prev.conditions.filter(c => c !== condition)
        : [...prev.conditions, condition]
    }));
  };

  const handleLanguageChange = (language: 'en' | 'hi') => {
    i18n.changeLanguage(language);
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = t('onboarding.nameRequired');
    }
    
    if (!formData.age || parseInt(formData.age) < 1 || parseInt(formData.age) > 120) {
      newErrors.age = t('onboarding.ageRequired');
    }
    
    if (!formData.phone.trim() || formData.phone.length < 10) {
      newErrors.phone = t('onboarding.phoneRequired');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    // Create health conditions
    const healthConditions: HealthCondition[] = formData.conditions.map(condition => ({
      id: `condition-${Date.now()}-${condition}`,
      name: condition === 'diabetes' ? 'Type 2 Diabetes' : 'Hypertension',
      diagnosedDate: new Date(),
      severity: 'moderate' as const
    }));

    // Create user object
    const user = {
      id: `user-${Date.now()}`,
      name: formData.name,
      age: parseInt(formData.age),
      phone: formData.phone,
      language: i18n.language as 'en' | 'hi',
      conditions: healthConditions,
      ashaWorkerId: formData.ashaId || 'asha-1',
      createdAt: new Date()
    };

    setUser(user);
    navigate('/');
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
            {t('onboarding.welcome')}
          </h1>
          <p className="text-gray-600">
            {t('onboarding.subtitle')}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Information */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="space-y-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('onboarding.name')}
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                    errors.name ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter your full name"
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                )}
              </div>

              {/* Age & Phone */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('onboarding.age')}
                  </label>
                  <input
                    type="number"
                    value={formData.age}
                    onChange={(e) => handleInputChange('age', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                      errors.age ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Age"
                  />
                  {errors.age && (
                    <p className="text-red-500 text-sm mt-1">{errors.age}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('onboarding.phone')}
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                      errors.phone ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Phone"
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                  )}
                </div>
              </div>

              {/* Language Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('onboarding.language')}
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
            </div>
          </div>

          {/* Health Conditions */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {t('onboarding.conditions')}
            </h3>
            <div className="space-y-3">
              {['diabetes', 'hypertension'].map(condition => (
                <button
                  key={condition}
                  type="button"
                  onClick={() => handleConditionToggle(condition)}
                  className={`w-full flex items-center justify-between p-4 rounded-lg border-2 transition-colors ${
                    formData.conditions.includes(condition)
                      ? 'border-emerald-500 bg-emerald-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Activity className="w-5 h-5 text-gray-600" />
                    <span className="font-medium">
                      {t(`onboarding.${condition}`)}
                    </span>
                  </div>
                  {formData.conditions.includes(condition) && (
                    <div className="w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* ASHA Worker ID */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('onboarding.ashaId')} (Optional)
            </label>
            <input
              type="text"
              value={formData.ashaId}
              onChange={(e) => handleInputChange('ashaId', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="Enter ASHA Worker ID"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-emerald-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-emerald-700 transition-colors"
          >
            {t('onboarding.complete')}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Onboarding;