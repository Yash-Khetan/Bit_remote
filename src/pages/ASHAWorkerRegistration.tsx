import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Shield, User, Camera, ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react';
import { useApp } from '../contexts/AppContext';

const ASHAWorkerRegistration: React.FC = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const { setUser } = useApp();
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    profilePicture: '',
    ashaId: '',
    village: '',
    experience: '',
    specialization: [] as string[]
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<'pending' | 'verified' | 'failed'>('pending');

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleSpecializationToggle = (specialization: string) => {
    setFormData(prev => ({
      ...prev,
      specialization: prev.specialization.includes(specialization)
        ? prev.specialization.filter(s => s !== specialization)
        : [...prev.specialization, specialization]
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

  const verifyASHAId = async () => {
    if (!formData.ashaId.trim()) {
      setErrors(prev => ({ ...prev, ashaId: t('registration.ashaIdRequired') }));
      return;
    }

    setIsVerifying(true);
    setVerificationStatus('pending');

    // Simulate API call for ASHA ID verification
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock verification - in real app, this would call your backend
      const isValidASHAId = formData.ashaId.length >= 6 && /^[A-Z0-9]+$/.test(formData.ashaId);
      
      if (isValidASHAId) {
        setVerificationStatus('verified');
        setErrors(prev => ({ ...prev, ashaId: '' }));
      } else {
        setVerificationStatus('failed');
        setErrors(prev => ({ ...prev, ashaId: t('registration.ashaIdInvalid') }));
      }
    } catch (error) {
      setVerificationStatus('failed');
      setErrors(prev => ({ ...prev, ashaId: t('registration.verificationFailed') }));
    } finally {
      setIsVerifying(false);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = t('registration.nameRequired');
    }
    
    if (!formData.phone.trim() || formData.phone.length < 10) {
      newErrors.phone = t('registration.phoneRequired');
    }

    if (!formData.ashaId.trim()) {
      newErrors.ashaId = t('registration.ashaIdRequired');
    } else if (verificationStatus !== 'verified') {
      newErrors.ashaId = t('registration.ashaIdNotVerified');
    }

    if (!formData.village.trim()) {
      newErrors.village = t('registration.villageRequired');
    }

    if (!formData.experience || parseInt(formData.experience) < 0) {
      newErrors.experience = t('registration.experienceRequired');
    }

    if (formData.specialization.length === 0) {
      newErrors.specialization = t('registration.specializationRequired');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    // Create user object
    const user = {
      id: `asha-${Date.now()}`,
      name: formData.name,
      age: 0, // ASHA workers don't need age in this context
      phone: formData.phone,
      language: i18n.language as 'en' | 'hi',
      role: 'asha_worker' as const,
      profilePicture: formData.profilePicture,
      ashaId: formData.ashaId,
      village: formData.village,
      experience: parseInt(formData.experience),
      specialization: formData.specialization,
      isVerified: verificationStatus === 'verified',
      createdAt: new Date()
    };

    setUser(user);
    navigate('/');
  };

  const getVerificationIcon = () => {
    switch (verificationStatus) {
      case 'verified':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'failed':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      default:
        return null;
    }
  };

  const getVerificationMessage = () => {
    switch (verificationStatus) {
      case 'verified':
        return <span className="text-green-600 text-sm">{t('registration.ashaIdVerified')}</span>;
      case 'failed':
        return <span className="text-red-600 text-sm">{t('registration.ashaIdInvalid')}</span>;
      default:
        return null;
    }
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
              {t('registration.ashaWorkerTitle')}
            </h1>
            <p className="text-sm text-gray-600">
              {t('registration.ashaWorkerSubtitle')}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Profile Picture */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              {t('registration.profilePicture')} *
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

              {/* Phone */}
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
                  placeholder="Phone number"
                />
                {errors.phone && (
                  <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                )}
              </div>
            </div>
          </div>

          {/* ASHA Worker Verification */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {t('registration.ashaVerification')}
            </h3>
            <div className="space-y-4">
              {/* ASHA ID */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('registration.ashaId')} *
                </label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={formData.ashaId}
                    onChange={(e) => handleInputChange('ashaId', e.target.value)}
                    className={`flex-1 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                      errors.ashaId ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter your ASHA Worker ID"
                    disabled={isVerifying}
                  />
                  <button
                    type="button"
                    onClick={verifyASHAId}
                    disabled={isVerifying || !formData.ashaId.trim()}
                    className="px-4 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                  >
                    {isVerifying ? '...' : t('registration.verify')}
                  </button>
                </div>
                <div className="flex items-center space-x-2 mt-2">
                  {getVerificationIcon()}
                  {getVerificationMessage()}
                </div>
                {errors.ashaId && (
                  <p className="text-red-500 text-sm mt-1">{errors.ashaId}</p>
                )}
              </div>

              {/* Village */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('registration.village')} *
                </label>
                <input
                  type="text"
                  value={formData.village}
                  onChange={(e) => handleInputChange('village', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                    errors.village ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Village/Area name"
                />
                {errors.village && (
                  <p className="text-red-500 text-sm mt-1">{errors.village}</p>
                )}
              </div>

              {/* Experience */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('registration.experience')} (years) *
                </label>
                <input
                  type="number"
                  value={formData.experience}
                  onChange={(e) => handleInputChange('experience', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                    errors.experience ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Years of experience"
                  min="0"
                />
                {errors.experience && (
                  <p className="text-red-500 text-sm mt-1">{errors.experience}</p>
                )}
              </div>
            </div>
          </div>

          {/* Specialization */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {t('registration.specialization')} *
            </h3>
            <div className="space-y-3">
              {[
                'maternal_health',
                'child_health',
                'family_planning',
                'immunization',
                'nutrition',
                'hypertension',
                'diabetes',
                'tuberculosis'
              ].map(specialization => (
                <button
                  key={specialization}
                  type="button"
                  onClick={() => handleSpecializationToggle(specialization)}
                  className={`w-full flex items-center justify-between p-4 rounded-lg border-2 transition-colors ${
                    formData.specialization.includes(specialization)
                      ? 'border-emerald-500 bg-emerald-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Shield className="w-5 h-5 text-gray-600" />
                    <span className="font-medium">
                      {t(`registration.${specialization}`)}
                    </span>
                  </div>
                  {formData.specialization.includes(specialization) && (
                    <div className="w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full" />
                    </div>
                  )}
                </button>
              ))}
            </div>
            {errors.specialization && (
              <p className="text-red-500 text-sm mt-2">{errors.specialization}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={verificationStatus !== 'verified'}
            className="w-full bg-emerald-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-emerald-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {t('registration.completeRegistration')}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ASHAWorkerRegistration;
