import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Activity, 
  Heart, 
  TrendingUp, 
  Calendar,
  Plus,
  Edit,
  Trash2,
  Filter,
  BarChart3,
  Clock,
  AlertTriangle
} from 'lucide-react';
import { useApp } from '../contexts/AppContext';

const ActivityTracker: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { user, vitals, addVitalReading } = useApp();
  const [showAddForm, setShowAddForm] = useState(false);
  const [filterType, setFilterType] = useState('all');
  const [filterDate, setFilterDate] = useState('all');

  // Form state for adding new reading
  const [formData, setFormData] = useState({
    type: 'blood_sugar' as 'blood_sugar' | 'blood_pressure' | 'weight',
    value: '',
    systolic: '',
    diastolic: '',
    unit: 'mg/dL',
    notes: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.value.trim()) {
      newErrors.value = 'Value is required';
    }
    
    if (formData.type === 'blood_pressure') {
      if (!formData.systolic.trim()) {
        newErrors.systolic = 'Systolic value is required';
      }
      if (!formData.diastolic.trim()) {
        newErrors.diastolic = 'Diastolic value is required';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const newReading = {
      userId: user!.id,
      type: formData.type,
      value: parseFloat(formData.value),
      systolic: formData.systolic ? parseFloat(formData.systolic) : undefined,
      diastolic: formData.diastolic ? parseFloat(formData.diastolic) : undefined,
      unit: formData.unit,
      timestamp: new Date(),
      notes: formData.notes
    };

    addVitalReading(newReading);
    
    // Reset form
    setFormData({
      type: 'blood_sugar',
      value: '',
      systolic: '',
      diastolic: '',
      unit: 'mg/dL',
      notes: ''
    });
    setShowAddForm(false);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'blood_sugar':
        return <Activity className="w-5 h-5 text-red-600" />;
      case 'blood_pressure':
        return <Heart className="w-5 h-5 text-blue-600" />;
      case 'weight':
        return <TrendingUp className="w-5 h-5 text-green-600" />;
      default:
        return <Activity className="w-5 h-5 text-gray-600" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'blood_sugar':
        return 'bg-red-100 text-red-800';
      case 'blood_pressure':
        return 'bg-blue-100 text-blue-800';
      case 'weight':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeName = (type: string) => {
    switch (type) {
      case 'blood_sugar':
        return 'Blood Sugar';
      case 'blood_pressure':
        return 'Blood Pressure';
      case 'weight':
        return 'Weight';
      default:
        return type;
    }
  };

  const getHealthStatus = (vital: any) => {
    if (vital.type === 'blood_sugar') {
      if (vital.value > 180) return { status: 'High', color: 'text-red-600' };
      if (vital.value < 70) return { status: 'Low', color: 'text-yellow-600' };
      return { status: 'Normal', color: 'text-green-600' };
    }
    
    if (vital.type === 'blood_pressure' && vital.systolic) {
      if (vital.systolic > 140 || vital.diastolic > 90) return { status: 'High', color: 'text-red-600' };
      if (vital.systolic < 90 || vital.diastolic < 60) return { status: 'Low', color: 'text-yellow-600' };
      return { status: 'Normal', color: 'text-green-600' };
    }
    
    return { status: 'Normal', color: 'text-green-600' };
  };

  const filteredVitals = vitals.filter(vital => {
    const typeMatch = filterType === 'all' || vital.type === filterType;
    
    if (filterDate === 'all') return typeMatch;
    
    const vitalDate = new Date(vital.timestamp);
    const today = new Date();
    
    switch (filterDate) {
      case 'today':
        return typeMatch && vitalDate.toDateString() === today.toDateString();
      case 'week':
        const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
        return typeMatch && vitalDate >= weekAgo;
      case 'month':
        const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
        return typeMatch && vitalDate >= monthAgo;
      default:
        return typeMatch;
    }
  });

  if (!user || user.role !== 'patient') {
    return (
      <div className="p-4 text-center">
        <p>Access denied. This page is for patients only.</p>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-500 to-blue-600 text-white p-6 rounded-lg">
        <div className="flex items-center space-x-3 mb-2">
          <BarChart3 className="w-8 h-8" />
          <div>
            <h1 className="text-xl font-bold">Activity Tracker</h1>
            <p className="text-emerald-100">
              Track your health metrics and progress
            </p>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200 text-center">
          <p className="text-2xl font-bold text-gray-900">{vitals.length}</p>
          <p className="text-sm text-gray-600">Total Readings</p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200 text-center">
          <p className="text-2xl font-bold text-gray-900">
            {vitals.filter(v => new Date(v.timestamp).toDateString() === new Date().toDateString()).length}
          </p>
          <p className="text-sm text-gray-600">Today</p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200 text-center">
          <p className="text-2xl font-bold text-gray-900">
            {vitals.filter(v => {
              const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
              return new Date(v.timestamp) >= weekAgo;
            }).length}
          </p>
          <p className="text-sm text-gray-600">This Week</p>
        </div>
      </div>

      {/* Filters and Add Button */}
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-1 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            >
              <option value="all">All Types</option>
              <option value="blood_sugar">Blood Sugar</option>
              <option value="blood_pressure">Blood Pressure</option>
              <option value="weight">Weight</option>
            </select>
            <select
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-1 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
            </select>
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center space-x-2 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Reading</span>
          </button>
        </div>
      </div>

      {/* Add Reading Form */}
      {showAddForm && (
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Reading</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reading Type
              </label>
              <select
                value={formData.type}
                onChange={(e) => {
                  const type = e.target.value as 'blood_sugar' | 'blood_pressure' | 'weight';
                  setFormData(prev => ({
                    ...prev,
                    type,
                    unit: type === 'blood_sugar' ? 'mg/dL' : type === 'blood_pressure' ? 'mmHg' : 'kg'
                  }));
                }}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              >
                <option value="blood_sugar">Blood Sugar</option>
                <option value="blood_pressure">Blood Pressure</option>
                <option value="weight">Weight</option>
              </select>
            </div>

            {formData.type === 'blood_pressure' ? (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Systolic (mmHg) *
                  </label>
                  <input
                    type="number"
                    value={formData.systolic}
                    onChange={(e) => handleInputChange('systolic', e.target.value)}
                    className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                      errors.systolic ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="120"
                  />
                  {errors.systolic && (
                    <p className="text-red-500 text-sm mt-1">{errors.systolic}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Diastolic (mmHg) *
                  </label>
                  <input
                    type="number"
                    value={formData.diastolic}
                    onChange={(e) => handleInputChange('diastolic', e.target.value)}
                    className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                      errors.diastolic ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="80"
                  />
                  {errors.diastolic && (
                    <p className="text-red-500 text-sm mt-1">{errors.diastolic}</p>
                  )}
                </div>
              </div>
            ) : (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Value ({formData.unit}) *
                </label>
                <input
                  type="number"
                  value={formData.value}
                  onChange={(e) => handleInputChange('value', e.target.value)}
                  className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                    errors.value ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder={formData.type === 'blood_sugar' ? '120' : '65'}
                  step="0.1"
                />
                {errors.value && (
                  <p className="text-red-500 text-sm mt-1">{errors.value}</p>
                )}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notes (Optional)
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                rows={3}
                placeholder="Add any notes about this reading..."
              />
            </div>

            <div className="flex space-x-3">
              <button
                type="submit"
                className="flex-1 bg-emerald-600 text-white py-2 px-4 rounded-lg hover:bg-emerald-700 transition-colors"
              >
                Add Reading
              </button>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Activity Log */}
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <h3 className="font-semibold text-gray-900 mb-4">Activity Log</h3>
        <div className="space-y-3">
          {filteredVitals.map((vital) => {
            const healthStatus = getHealthStatus(vital);
            return (
              <div key={vital.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="bg-white p-2 rounded-lg">
                    {getTypeIcon(vital.type)}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{getTypeName(vital.type)}</p>
                    <p className="text-sm text-gray-600">
                      {new Date(vital.timestamp).toLocaleDateString()} at{' '}
                      {new Date(vital.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
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
                  <p className={`text-sm ${healthStatus.color}`}>
                    {healthStatus.status}
                  </p>
                  {vital.notes && (
                    <p className="text-xs text-gray-600 mt-1">{vital.notes}</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add Reading Button */}
      <div className="fixed bottom-20 right-4">
        <button
          onClick={() => setShowAddForm(true)}
          className="w-14 h-14 bg-emerald-600 text-white rounded-full shadow-lg hover:bg-emerald-700 transition-colors flex items-center justify-center"
        >
          <Plus className="w-6 h-6" />
        </button>
      </div>

      {filteredVitals.length === 0 && (
        <div className="bg-white p-8 rounded-lg border border-gray-200 text-center">
          <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No readings found</h3>
          <p className="text-gray-600 mb-4">
            {filterType !== 'all' || filterDate !== 'all'
              ? 'No readings match your current filters'
              : 'Start tracking your health by adding your first reading'
            }
          </p>
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors"
          >
            Add First Reading
          </button>
        </div>
      )}
    </div>
  );
};

export default ActivityTracker;
