import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Users, 
  Activity, 
  Heart, 
  AlertTriangle, 
  Phone, 
  MessageSquare, 
  Calendar,
  TrendingUp,
  Shield,
  MapPin,
  Star
} from 'lucide-react';
import { useApp } from '../contexts/AppContext';

const ASHAWorkerDashboard: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { user, vitals, reminders } = useApp();

  // Mock data for ASHA worker dashboard
  const [assignedPatients] = useState([
    {
      id: 'patient-1',
      name: 'Priya Sharma',
      age: 45,
      phone: '+91 98765 43210',
      village: 'Village A',
      conditions: ['diabetes', 'hypertension'],
      lastVisit: '2024-01-15',
      nextVisit: '2024-01-22',
      status: 'stable',
      bloodSugar: 140,
      bloodPressure: { systolic: 130, diastolic: 85 }
    },
    {
      id: 'patient-2',
      name: 'Rajesh Kumar',
      age: 52,
      phone: '+91 98765 43211',
      village: 'Village B',
      conditions: ['diabetes'],
      lastVisit: '2024-01-14',
      nextVisit: '2024-01-21',
      status: 'needs_attention',
      bloodSugar: 180,
      bloodPressure: { systolic: 140, diastolic: 90 }
    },
    {
      id: 'patient-3',
      name: 'Sunita Devi',
      age: 38,
      phone: '+91 98765 43212',
      village: 'Village A',
      conditions: ['hypertension'],
      lastVisit: '2024-01-13',
      nextVisit: '2024-01-20',
      status: 'stable',
      bloodSugar: 95,
      bloodPressure: { systolic: 120, diastolic: 80 }
    }
  ]);

  const [todayTasks] = useState([
    {
      id: 'task-1',
      type: 'visit',
      patient: 'Priya Sharma',
      time: '10:00 AM',
      priority: 'high',
      description: 'Follow-up visit for diabetes management'
    },
    {
      id: 'task-2',
      type: 'call',
      patient: 'Rajesh Kumar',
      time: '2:00 PM',
      priority: 'medium',
      description: 'Check blood sugar levels'
    },
    {
      id: 'task-3',
      type: 'visit',
      patient: 'Sunita Devi',
      time: '4:00 PM',
      priority: 'low',
      description: 'Routine blood pressure check'
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'stable':
        return 'bg-green-100 text-green-800';
      case 'needs_attention':
        return 'bg-yellow-100 text-yellow-800';
      case 'critical':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
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

  const getTaskIcon = (type: string) => {
    switch (type) {
      case 'visit':
        return <Heart className="w-4 h-4" />;
      case 'call':
        return <Phone className="w-4 h-4" />;
      default:
        return <Calendar className="w-4 h-4" />;
    }
  };

  if (!user || user.role !== 'asha_worker') {
    return (
      <div className="p-4 text-center">
        <p>Access denied. This page is for ASHA workers only.</p>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-emerald-500 to-blue-600 text-white p-6 rounded-lg">
        <div className="flex items-center space-x-3 mb-2">
          <Shield className="w-8 h-8" />
          <div>
            <h1 className="text-xl font-bold">
              Welcome, {user.name}!
            </h1>
            <p className="text-emerald-100">
              ASHA Worker • {user.village} • {user.experience} years experience
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-4 mt-3">
          <div className="flex items-center space-x-1">
            <Star className="w-4 h-4 text-yellow-300" />
            <span className="text-sm">4.8 Rating</span>
          </div>
          <div className="flex items-center space-x-1">
            <Users className="w-4 h-4" />
            <span className="text-sm">{assignedPatients.length} Patients</span>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-100 p-2 rounded-lg">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{assignedPatients.length}</p>
              <p className="text-sm text-gray-600">Assigned Patients</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="bg-red-100 p-2 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {assignedPatients.filter(p => p.status === 'needs_attention').length}
              </p>
              <p className="text-sm text-gray-600">Need Attention</p>
            </div>
          </div>
        </div>
      </div>

      {/* Today's Tasks */}
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <h3 className="font-semibold text-gray-900 mb-4">Today's Tasks</h3>
        <div className="space-y-3">
          {todayTasks.map((task) => (
            <div key={task.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="bg-emerald-100 p-2 rounded-lg">
                  {getTaskIcon(task.type)}
                </div>
                <div>
                  <p className="font-medium text-gray-900">{task.patient}</p>
                  <p className="text-sm text-gray-600">{task.description}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{task.time}</p>
                <span className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(task.priority)}`}>
                  {task.priority}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Assigned Patients */}
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900">Assigned Patients</h3>
          <button className="text-emerald-600 text-sm font-medium">View All</button>
        </div>
        <div className="space-y-3">
          {assignedPatients.map((patient) => (
            <div key={patient.id} className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                    <Users className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{patient.name}</p>
                    <p className="text-sm text-gray-600">{patient.age} years • {patient.village}</p>
                  </div>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(patient.status)}`}>
                  {patient.status.replace('_', ' ')}
                </span>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mt-3">
                <div className="text-center">
                  <p className="text-lg font-bold text-gray-900">{patient.bloodSugar}</p>
                  <p className="text-xs text-gray-600">Blood Sugar (mg/dL)</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-gray-900">
                    {patient.bloodPressure.systolic}/{patient.bloodPressure.diastolic}
                  </p>
                  <p className="text-xs text-gray-600">Blood Pressure</p>
                </div>
              </div>

              <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-200">
                <div className="text-xs text-gray-600">
                  Last visit: {patient.lastVisit}
                </div>
                <div className="flex space-x-2">
                  <button className="p-2 bg-emerald-100 text-emerald-600 rounded-lg hover:bg-emerald-200 transition-colors">
                    <Phone className="w-4 h-4" />
                  </button>
                  <button className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors">
                    <MessageSquare className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Health Alerts */}
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <h3 className="font-semibold text-gray-900 mb-4">Health Alerts</h3>
        <div className="space-y-3">
          <div className="flex items-center space-x-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <AlertTriangle className="w-5 h-5 text-yellow-600" />
            <div>
              <p className="font-medium text-gray-900">High Blood Sugar Alert</p>
              <p className="text-sm text-gray-600">Rajesh Kumar - 180 mg/dL (Above normal)</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-red-50 border border-red-200 rounded-lg">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            <div>
              <p className="font-medium text-gray-900">Missed Medication</p>
              <p className="text-sm text-gray-600">Priya Sharma - Diabetes medication not taken</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 gap-3">
          <button className="flex flex-col items-center p-4 bg-emerald-50 rounded-lg hover:bg-emerald-100 transition-colors">
            <Users className="w-6 h-6 text-emerald-600 mb-2" />
            <span className="text-sm font-medium text-emerald-700">Add Patient</span>
          </button>
          
          <button className="flex flex-col items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
            <Activity className="w-6 h-6 text-blue-600 mb-2" />
            <span className="text-sm font-medium text-blue-700">Log Visit</span>
          </button>
          
          <button className="flex flex-col items-center p-4 bg-yellow-50 rounded-lg hover:bg-yellow-100 transition-colors">
            <Calendar className="w-6 h-6 text-yellow-600 mb-2" />
            <span className="text-sm font-medium text-yellow-700">Schedule Visit</span>
          </button>
          
          <button className="flex flex-col items-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
            <TrendingUp className="w-6 h-6 text-purple-600 mb-2" />
            <span className="text-sm font-medium text-purple-700">Reports</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ASHAWorkerDashboard;
