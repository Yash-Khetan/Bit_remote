import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, TrendingUp, Calendar } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import VitalsChart from '../components/VitalsChart';
import { VitalReading } from '../types';

const Vitals: React.FC = () => {
  const { t } = useTranslation();
  const { vitals, addVitalReading, user } = useApp();
  
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedType, setSelectedType] = useState<'blood_sugar' | 'blood_pressure' | 'weight'>('blood_sugar');
  const [chartPeriod, setChartPeriod] = useState<'week' | 'month'>('week');
  const [formData, setFormData] = useState({
    value: '',
    systolic: '',
    diastolic: '',
    notes: ''
  });

  const handleAddVital = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;

    const newVital: Omit<VitalReading, 'id'> = {
      userId: user.id,
      type: selectedType,
      value: parseFloat(formData.value),
      timestamp: new Date(),
      notes: formData.notes || undefined,
      unit: selectedType === 'blood_sugar' ? 'mg/dL' : selectedType === 'blood_pressure' ? 'mmHg' : 'kg'
    };

    if (selectedType === 'blood_pressure') {
      newVital.systolic = parseFloat(formData.systolic);
      newVital.diastolic = parseFloat(formData.diastolic);
      newVital.value = parseFloat(formData.systolic); // Use systolic as main value
    }

    addVitalReading(newVital);
    setFormData({ value: '', systolic: '', diastolic: '', notes: '' });
    setShowAddForm(false);
  };

  const getLatestReading = (type: string) => {
    return vitals
      .filter(v => v.type === type)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0];
  };

  const getAverage = (type: string, days: number = 7) => {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);
    
    const recentReadings = vitals.filter(v => 
      v.type === type && new Date(v.timestamp) >= cutoff
    );
    
    if (recentReadings.length === 0) return 0;
    
    const sum = recentReadings.reduce((acc, reading) => acc + reading.value, 0);
    return sum / recentReadings.length;
  };

  const vitalTypes = [
    { key: 'blood_sugar' as const, label: t('vitals.bloodSugar'), unit: 'mg/dL', color: 'text-red-600' },
    { key: 'blood_pressure' as const, label: t('vitals.bloodPressure'), unit: 'mmHg', color: 'text-blue-600' },
    { key: 'weight' as const, label: t('vitals.weight'), unit: 'kg', color: 'text-green-600' }
  ];

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">{t('vitals.title')}</h1>
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-emerald-600 text-white p-2 rounded-lg hover:bg-emerald-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 gap-4">
        {vitalTypes.map(({ key, label, unit, color }) => {
          const latest = getLatestReading(key);
          const average = getAverage(key);
          
          return (
            <div key={key} className="bg-white p-4 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-gray-900">{label}</h3>
                <TrendingUp className={`w-4 h-4 ${color}`} />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500 mb-1">{t('vitals.latest')}</p>
                  {latest ? (
                    <p className="text-lg font-bold text-gray-900">
                      {key === 'blood_pressure' 
                        ? `${latest.systolic}/${latest.diastolic}` 
                        : latest.value.toFixed(1)
                      } <span className="text-sm font-normal text-gray-500">{unit}</span>
                    </p>
                  ) : (
                    <p className="text-gray-400">No data</p>
                  )}
                </div>
                
                <div>
                  <p className="text-xs text-gray-500 mb-1">{t('vitals.average')} (7d)</p>
                  <p className="text-lg font-bold text-gray-600">
                    {average > 0 ? average.toFixed(1) : '--'} 
                    <span className="text-sm font-normal text-gray-500">{unit}</span>
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Chart Controls */}
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900">{t('vitals.trend')}</h3>
          <div className="flex items-center space-x-2">
            <select
              value={chartPeriod}
              onChange={(e) => setChartPeriod(e.target.value as 'week' | 'month')}
              className="px-3 py-1 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
            >
              <option value="week">{t('vitals.lastSevenDays')}</option>
              <option value="month">{t('vitals.lastThirtyDays')}</option>
            </select>
          </div>
        </div>
        
        <div className="flex space-x-2 mb-4">
          {vitalTypes.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setSelectedType(key)}
              className={`px-3 py-2 text-sm rounded-lg transition-colors ${
                selectedType === key
                  ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                  : 'bg-gray-100 text-gray-600 border border-gray-200 hover:bg-gray-200'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <VitalsChart 
          data={vitals} 
          type={selectedType} 
          period={chartPeriod}
        />
      </div>

      {/* Add Vital Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end z-50">
          <div className="bg-white rounded-t-lg w-full max-h-[80vh] overflow-y-auto">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">{t('vitals.addReading')}</h3>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
            </div>

            <form onSubmit={handleAddVital} className="p-4 space-y-4">
              {/* Type Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {vitalTypes.map(({ key, label }) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setSelectedType(key)}
                      className={`p-2 text-xs rounded-lg border transition-colors ${
                        selectedType === key
                          ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Value Input */}
              {selectedType === 'blood_pressure' ? (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('vitals.systolic')}
                    </label>
                    <input
                      type="number"
                      value={formData.systolic}
                      onChange={(e) => setFormData({...formData, systolic: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      placeholder="120"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('vitals.diastolic')}
                    </label>
                    <input
                      type="number"
                      value={formData.diastolic}
                      onChange={(e) => setFormData({...formData, diastolic: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      placeholder="80"
                      required
                    />
                  </div>
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {vitalTypes.find(v => v.key === selectedType)?.label} ({vitalTypes.find(v => v.key === selectedType)?.unit})
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.value}
                    onChange={(e) => setFormData({...formData, value: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder={selectedType === 'blood_sugar' ? '120' : '68.5'}
                    required
                  />
                </div>
              )}

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('vitals.notes')}
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  rows={3}
                  placeholder="Optional notes..."
                />
              </div>

              {/* Submit Button */}
              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="flex-1 py-3 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  {t('common.cancel')}
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 px-4 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                >
                  {t('common.save')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Vitals;