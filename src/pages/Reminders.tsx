import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Bell, Clock, Trash2, Edit3, BellRing } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { Reminder } from '../types';

const Reminders: React.FC = () => {
  const { t } = useTranslation();
  const { reminders, addReminder, updateReminder, deleteReminder, user } = useApp();
  
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingReminder, setEditingReminder] = useState<Reminder | null>(null);
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>('default');
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'medication' as Reminder['type'],
    time: '',
    frequency: 'daily' as Reminder['frequency']
  });

  useEffect(() => {
    // Check notification permission status
    setNotificationPermission(Notification.permission);
  }, []);

  const requestNotificationPermission = async () => {
    try {
      const permission = await Notification.requestPermission();
      setNotificationPermission(permission);
      
      if (permission === 'granted') {
        // TODO: Register service worker and set up push notifications
        // This would connect to your push notification service (Firebase, AWS SNS, etc.)
        console.log('Notifications enabled - TODO: Connect to backend push service');
      }
    } catch (error) {
      console.error('Error requesting notification permission:', error);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;

    const reminderData = {
      userId: user.id,
      ...formData,
      isActive: true,
      createdAt: new Date()
    };

    if (editingReminder) {
      updateReminder(editingReminder.id, reminderData);
      setEditingReminder(null);
    } else {
      addReminder(reminderData);
    }

    setFormData({
      title: '',
      description: '',
      type: 'medication',
      time: '',
      frequency: 'daily'
    });
    setShowAddForm(false);
  };

  const handleEdit = (reminder: Reminder) => {
    setFormData({
      title: reminder.title,
      description: reminder.description,
      type: reminder.type,
      time: reminder.time,
      frequency: reminder.frequency
    });
    setEditingReminder(reminder);
    setShowAddForm(true);
  };

  const handleToggle = (id: string, isActive: boolean) => {
    updateReminder(id, { isActive: !isActive });
  };

  const getReminderIcon = (type: Reminder['type']) => {
    switch (type) {
      case 'medication': return '💊';
      case 'checkup': return '🩺';
      case 'exercise': return '🏃';
      case 'diet': return '🥗';
      default: return '⏰';
    }
  };

  const getReminderTypeColor = (type: Reminder['type']) => {
    switch (type) {
      case 'medication': return 'bg-blue-100 text-blue-800';
      case 'checkup': return 'bg-green-100 text-green-800';
      case 'exercise': return 'bg-orange-100 text-orange-800';
      case 'diet': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const sortedReminders = [...reminders].sort((a, b) => a.time.localeCompare(b.time));

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">{t('reminders.title')}</h1>
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-emerald-600 text-white p-2 rounded-lg hover:bg-emerald-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>

      {/* Push Notifications */}
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <BellRing className="w-5 h-5 text-emerald-600" />
            <div>
              <h3 className="font-semibold text-gray-900">{t('reminders.pushNotifications')}</h3>
              <p className="text-sm text-gray-600">
                {notificationPermission === 'granted' 
                  ? t('reminders.notificationsEnabled')
                  : t('reminders.enableNotifications')
                }
              </p>
            </div>
          </div>
          
          {notificationPermission !== 'granted' && (
            <button
              onClick={requestNotificationPermission}
              className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-emerald-700 transition-colors"
            >
              {t('reminders.enableNow')}
            </button>
          )}
        </div>
      </div>

      {/* Reminders List */}
      <div className="space-y-3">
        {sortedReminders.length === 0 ? (
          <div className="bg-white p-8 rounded-lg border border-gray-200 text-center">
            <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No reminders set yet</p>
          </div>
        ) : (
          sortedReminders.map((reminder) => (
            <div key={reminder.id} className="bg-white p-4 rounded-lg border border-gray-200">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3 flex-1">
                  <div className="text-2xl">{getReminderIcon(reminder.type)}</div>
                  
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="font-semibold text-gray-900">{reminder.title}</h3>
                      <span className={`text-xs px-2 py-1 rounded-full ${getReminderTypeColor(reminder.type)}`}>
                        {t(`reminders.${reminder.type}`)}
                      </span>
                    </div>
                    
                    <p className="text-gray-600 text-sm mb-2">{reminder.description}</p>
                    
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span>{reminder.time}</span>
                      </div>
                      <span>•</span>
                      <span>{t(`reminders.${reminder.frequency}`)}</span>
                      <span>•</span>
                      <span className={reminder.isActive ? 'text-green-600' : 'text-red-600'}>
                        {reminder.isActive ? t('reminders.active') : t('reminders.inactive')}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2 ml-4">
                  <button
                    onClick={() => handleToggle(reminder.id, reminder.isActive)}
                    className={`p-2 rounded-lg transition-colors ${
                      reminder.isActive 
                        ? 'bg-green-100 text-green-600 hover:bg-green-200' 
                        : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                    }`}
                  >
                    <Bell className="w-4 h-4" />
                  </button>
                  
                  <button
                    onClick={() => handleEdit(reminder)}
                    className="p-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  
                  <button
                    onClick={() => deleteReminder(reminder.id)}
                    className="p-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add/Edit Reminder Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end z-50">
          <div className="bg-white rounded-t-lg w-full max-h-[80vh] overflow-y-auto">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">
                  {editingReminder ? t('common.edit') : t('reminders.addReminder')}
                </h3>
                <button
                  onClick={() => {
                    setShowAddForm(false);
                    setEditingReminder(null);
                    setFormData({
                      title: '',
                      description: '',
                      type: 'medication',
                      time: '',
                      frequency: 'daily'
                    });
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-4 space-y-4">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="e.g., Morning Medication"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('reminders.description')}
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  rows={3}
                  placeholder="e.g., Take Metformin 500mg with breakfast"
                  required
                />
              </div>

              {/* Type and Time */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Type
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value as Reminder['type']})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  >
                    <option value="medication">{t('reminders.medication')}</option>
                    <option value="checkup">{t('reminders.checkup')}</option>
                    <option value="exercise">{t('reminders.exercise')}</option>
                    <option value="diet">{t('reminders.diet')}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('reminders.time')}
                  </label>
                  <input
                    type="time"
                    value={formData.time}
                    onChange={(e) => setFormData({...formData, time: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    required
                  />
                </div>
              </div>

              {/* Frequency */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('reminders.frequency')}
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {['daily', 'weekly', 'monthly'].map(freq => (
                    <button
                      key={freq}
                      type="button"
                      onClick={() => setFormData({...formData, frequency: freq as Reminder['frequency']})}
                      className={`p-2 text-sm rounded-lg border transition-colors ${
                        formData.frequency === freq
                          ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {t(`reminders.${freq}`)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddForm(false);
                    setEditingReminder(null);
                  }}
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

export default Reminders;