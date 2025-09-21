import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  CheckCircle,
  AlertCircle,
  Plus,
  Filter
} from 'lucide-react';
import { useApp } from '../contexts/AppContext';

const ASHAWorkerVisits: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { user } = useApp();
  const [filterDate, setFilterDate] = useState('today');

  // Mock visit data
  const [visits] = useState([
    {
      id: 'visit-1',
      patientName: 'Priya Sharma',
      patientId: 'patient-1',
      type: 'follow_up',
      scheduledDate: '2024-01-20',
      scheduledTime: '10:00 AM',
      status: 'scheduled',
      priority: 'high',
      address: 'House No. 123, Village A',
      purpose: 'Diabetes management follow-up',
      notes: 'Check blood sugar levels and medication compliance'
    },
    {
      id: 'visit-2',
      patientName: 'Rajesh Kumar',
      patientId: 'patient-2',
      type: 'emergency',
      scheduledDate: '2024-01-20',
      scheduledTime: '2:00 PM',
      status: 'completed',
      priority: 'high',
      address: 'House No. 456, Village B',
      purpose: 'High blood sugar emergency',
      notes: 'Patient reported feeling unwell, blood sugar 180 mg/dL'
    },
    {
      id: 'visit-3',
      patientName: 'Sunita Devi',
      patientId: 'patient-3',
      type: 'routine',
      scheduledDate: '2024-01-21',
      scheduledTime: '11:00 AM',
      status: 'scheduled',
      priority: 'medium',
      address: 'House No. 789, Village A',
      purpose: 'Routine blood pressure check',
      notes: 'Monthly health checkup'
    },
    {
      id: 'visit-4',
      patientName: 'Amit Singh',
      patientId: 'patient-4',
      type: 'follow_up',
      scheduledDate: '2024-01-19',
      scheduledTime: '3:00 PM',
      status: 'completed',
      priority: 'high',
      address: 'House No. 321, Village C',
      purpose: 'Critical patient monitoring',
      notes: 'Blood pressure still high, medication adjustment needed'
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'in_progress':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'scheduled':
        return <Clock className="w-4 h-4 text-blue-600" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'cancelled':
        return <AlertCircle className="w-4 h-4 text-red-600" />;
      case 'in_progress':
        return <Clock className="w-4 h-4 text-yellow-600" />;
      default:
        return <Calendar className="w-4 h-4 text-gray-600" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'emergency':
        return 'bg-red-100 text-red-800';
      case 'follow_up':
        return 'bg-blue-100 text-blue-800';
      case 'routine':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredVisits = visits.filter(visit => {
    const today = new Date();
    const visitDate = new Date(visit.scheduledDate);
    
    switch (filterDate) {
      case 'today':
        return visitDate.toDateString() === today.toDateString();
      case 'tomorrow':
        const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);
        return visitDate.toDateString() === tomorrow.toDateString();
      case 'week':
        const weekFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
        return visitDate >= today && visitDate <= weekFromNow;
      default:
        return true;
    }
  });

  if (!user || user.role !== 'asha_worker') {
    return (
      <div className="p-4 text-center">
        <p>Access denied. This page is for ASHA workers only.</p>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-500 to-blue-600 text-white p-6 rounded-lg">
        <div className="flex items-center space-x-3 mb-2">
          <Calendar className="w-8 h-8" />
          <div>
            <h1 className="text-xl font-bold">Visit Management</h1>
            <p className="text-emerald-100">
              Schedule and track patient visits
            </p>
          </div>
        </div>
      </div>

      {/* Filter and Stats */}
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-1 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            >
              <option value="today">Today</option>
              <option value="tomorrow">Tomorrow</option>
              <option value="week">This Week</option>
              <option value="all">All Visits</option>
            </select>
          </div>
          <button className="flex items-center space-x-2 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors">
            <Plus className="w-4 h-4" />
            <span>Schedule Visit</span>
          </button>
        </div>
        
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-blue-600">
              {visits.filter(v => v.status === 'scheduled').length}
            </p>
            <p className="text-sm text-gray-600">Scheduled</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-green-600">
              {visits.filter(v => v.status === 'completed').length}
            </p>
            <p className="text-sm text-gray-600">Completed</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-red-600">
              {visits.filter(v => v.priority === 'high').length}
            </p>
            <p className="text-sm text-gray-600">High Priority</p>
          </div>
        </div>
      </div>

      {/* Visit List */}
      <div className="space-y-4">
        {filteredVisits.map((visit) => (
          <div key={visit.id} className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                  <Users className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{visit.patientName}</h3>
                  <p className="text-sm text-gray-600">{visit.scheduledDate} at {visit.scheduledTime}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {getStatusIcon(visit.status)}
                <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(visit.status)}`}>
                  {visit.status.replace('_', ' ')}
                </span>
              </div>
            </div>

            {/* Visit Details */}
            <div className="mb-3">
              <div className="flex items-center space-x-2 mb-2">
                <span className={`text-xs px-2 py-1 rounded-full ${getTypeColor(visit.type)}`}>
                  {visit.type.replace('_', ' ')}
                </span>
                <span className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(visit.priority)}`}>
                  {visit.priority} priority
                </span>
              </div>
              <p className="text-sm font-medium text-gray-900 mb-1">{visit.purpose}</p>
              <p className="text-sm text-gray-600">{visit.notes}</p>
            </div>

            {/* Address */}
            <div className="flex items-center space-x-2 mb-3 text-sm text-gray-600">
              <MapPin className="w-4 h-4" />
              <span>{visit.address}</span>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-2">
              {visit.status === 'scheduled' && (
                <>
                  <button className="flex-1 bg-emerald-600 text-white py-2 px-4 rounded-lg hover:bg-emerald-700 transition-colors">
                    Start Visit
                  </button>
                  <button className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors">
                    Reschedule
                  </button>
                </>
              )}
              {visit.status === 'completed' && (
                <button className="flex-1 bg-blue-100 text-blue-700 py-2 px-4 rounded-lg hover:bg-blue-200 transition-colors">
                  View Report
                </button>
              )}
              <button className="bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors">
                Details
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Visit Button */}
      <div className="fixed bottom-20 right-4">
        <button className="w-14 h-14 bg-emerald-600 text-white rounded-full shadow-lg hover:bg-emerald-700 transition-colors flex items-center justify-center">
          <Plus className="w-6 h-6" />
        </button>
      </div>

      {filteredVisits.length === 0 && (
        <div className="bg-white p-8 rounded-lg border border-gray-200 text-center">
          <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No visits found</h3>
          <p className="text-gray-600 mb-4">
            {filterDate !== 'all' 
              ? 'No visits scheduled for the selected period'
              : 'You don\'t have any visits scheduled yet'
            }
          </p>
          <button className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors">
            Schedule New Visit
          </button>
        </div>
      )}
    </div>
  );
};

export default ASHAWorkerVisits;
