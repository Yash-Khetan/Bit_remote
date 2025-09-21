import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { User, Heart, Activity, ArrowLeft, Camera } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { HealthCondition } from '../types';

const PatientRegistration: React.FC = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const { setUser } = useApp();
  
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    phone: '',
    profilePicture: '',
    // Health details
    bloodSugarLevel: '',
    weight: '',
    height: '',
    bloodPressureSystolic: '',
    bloodPressureDiastolic: '',
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

  const handleProfilePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setFormData(prev => ({ ...prev, profilePicture: event.target?.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = t('registration.nameRequired');
    }
    
    if (!formData.age || parseInt(formData.age) < 1 || parseInt(formData.age) > 120) {
      newErrors.age = t('registration.ageRequired');
    }
    
    if (!formData.phone.trim() || formData.phone.length < 10) {
      newErrors.phone = t('registration.phoneRequired');
    }

    if (!formData.bloodSugarLevel || parseFloat(formData.bloodSugarLevel) < 0) {
      newErrors.bloodSugarLevel = t('registration.bloodSugarRequired');
    }

    if (!formData.weight || parseFloat(formData.weight) < 0) {
      newErrors.weight = t('registration.weightRequired');
    }

    if (!formData.height || parseFloat(formData.height) < 0) {
      newErrors.height = t('registration.heightRequired');
    }

    if (!formData.bloodPressureSystolic || parseFloat(formData.bloodPressureSystolic) < 0) {
      newErrors.bloodPressureSystolic = t('registration.bpSystolicRequired');
    }

    if (!formData.bloodPressureDiastolic || parseFloat(formData.bloodPressureDiastolic) < 0) {
      newErrors.bloodPressureDiastolic = t('registration.bpDiastolicRequired');
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
      id: `patient-${Date.now()}`,
      name: formData.name,
      age: parseInt(formData.age),
      phone: formData.phone,
      language: i18n.language as 'en' | 'hi',
      role: 'patient' as const,
      profilePicture: formData.profilePicture,
      conditions: healthConditions,
      bloodSugarLevel: parseFloat(formData.bloodSugarLevel),
      weight: parseFloat(formData.weight),
      height: parseFloat(formData.height),
      bloodPressure: {
        systolic: parseFloat(formData.bloodPressureSystolic),
        diastolic: parseFloat(formData.bloodPressureDiastolic)
      },
      createdAt: new Date()
    };

    setUser(user);
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-blue-50 px-4 py-8">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center mb-6">
          <button
            onClick={() => navigate('/login')}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div className="ml-4">
            <h1 className="text-xl font-bold text-gray-900">
              {t('registration.patientTitle')}
            </h1>
            <p className="text-sm text-gray-600">
              {t('registration.patientSubtitle')}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Profile Picture */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              {t('registration.profilePicture')}
            </label>
            <div className="flex items-center space-x-4">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden">
                {formData.profilePicture ? (
                  <img
                    src={formData.profilePicture}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-8 h-8 text-gray-400" />
                )}
              </div>
              <div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleProfilePictureChange}
                  className="hidden"
                  id="profile-picture"
                />
                <label
                  htmlFor="profile-picture"
                  className="flex items-center space-x-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors cursor-pointer"
                >
                  <Camera className="w-4 h-4" />
                  <span>{t('registration.uploadPhoto')}</span>
                </label>
              </div>
            </div>
          </div>

          {/* Personal Information */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {t('registration.personalInfo')}
            </h3>
            <div className="space-y-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('registration.name')} *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                    errors.name ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder={t('registration.namePlaceholder')}
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                )}
              </div>

              {/* Age & Phone */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('registration.age')} *
                  </label>
                  <input
                    type="number"
                    value={formData.age}
                    onChange={(e) => handleInputChange('age', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                      errors.age ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Age"
                    min="1"
                    max="120"
                  />
                  {errors.age && (
                    <p className="text-red-500 text-sm mt-1">{errors.age}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('registration.phone')} *
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
            </div>
          </div>

          {/* Health Information */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {t('registration.healthInfo')}
            </h3>
            <div className="space-y-4">
              {/* Blood Sugar Level */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('registration.bloodSugarLevel')} (mg/dL) *
                </label>
                <input
                  type="number"
                  value={formData.bloodSugarLevel}
                  onChange={(e) => handleInputChange('bloodSugarLevel', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                    errors.bloodSugarLevel ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="e.g., 120"
                  min="0"
                  step="0.1"
                />
                {errors.bloodSugarLevel && (
                  <p className="text-red-500 text-sm mt-1">{errors.bloodSugarLevel}</p>
                )}
              </div>

              {/* Weight & Height */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('registration.weight')} (kg) *
                  </label>
                  <input
                    type="number"
                    value={formData.weight}
                    onChange={(e) => handleInputChange('weight', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                      errors.weight ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="e.g., 65"
                    min="0"
                    step="0.1"
                  />
                  {errors.weight && (
                    <p className="text-red-500 text-sm mt-1">{errors.weight}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('registration.height')} (cm) *
                  </label>
                  <input
                    type="number"
                    value={formData.height}
                    onChange={(e) => handleInputChange('height', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                      errors.height ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="e.g., 170"
                    min="0"
                    step="0.1"
                  />
                  {errors.height && (
                    <p className="text-red-500 text-sm mt-1">{errors.height}</p>
                  )}
                </div>
              </div>

              {/* Blood Pressure */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('registration.bloodPressure')} (mmHg) *
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <input
                      type="number"
                      value={formData.bloodPressureSystolic}
                      onChange={(e) => handleInputChange('bloodPressureSystolic', e.target.value)}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                        errors.bloodPressureSystolic ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Systolic"
                      min="0"
                    />
                    {errors.bloodPressureSystolic && (
                      <p className="text-red-500 text-sm mt-1">{errors.bloodPressureSystolic}</p>
                    )}
                  </div>
                  <div>
                    <input
                      type="number"
                      value={formData.bloodPressureDiastolic}
                      onChange={(e) => handleInputChange('bloodPressureDiastolic', e.target.value)}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                        errors.bloodPressureDiastolic ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Diastolic"
                      min="0"
                    />
                    {errors.bloodPressureDiastolic && (
                      <p className="text-red-500 text-sm mt-1">{errors.bloodPressureDiastolic}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Health Conditions */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {t('registration.conditions')}
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
                      {t(`registration.${condition}`)}
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

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-emerald-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-emerald-700 transition-colors"
          >
            {t('registration.completeRegistration')}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PatientRegistration;
