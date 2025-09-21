import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Users, 
  Phone, 
  MessageSquare, 
  MapPin, 
  Calendar,
  AlertTriangle,
  Heart,
  Activity,
  Search,
  Filter
} from 'lucide-react';
import { useApp } from '../contexts/AppContext';

const ASHAWorkerPatients: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { user } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Mock patient data
  const [patients] = useState([
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
      bloodPressure: { systolic: 130, diastolic: 85 },
      address: 'House No. 123, Village A, Block XYZ'
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
      bloodPressure: { systolic: 140, diastolic: 90 },
      address: 'House No. 456, Village B, Block XYZ'
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
      bloodPressure: { systolic: 120, diastolic: 80 },
      address: 'House No. 789, Village A, Block XYZ'
    },
    {
      id: 'patient-4',
      name: 'Amit Singh',
      age: 60,
      phone: '+91 98765 43213',
      village: 'Village C',
      conditions: ['diabetes', 'hypertension'],
      lastVisit: '2024-01-12',
      nextVisit: '2024-01-19',
      status: 'critical',
      bloodSugar: 220,
      bloodPressure: { systolic: 160, diastolic: 100 },
      address: 'House No. 321, Village C, Block XYZ'
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'stable':
        return <Heart className="w-4 h-4 text-green-600" />;
      case 'needs_attention':
        return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      case 'critical':
        return <AlertTriangle className="w-4 h-4 text-red-600" />;
      default:
        return <Activity className="w-4 h-4 text-gray-600" />;
    }
  };

  const filteredPatients = patients.filter(patient => {
    const matchesSearch = patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         patient.village.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || patient.status === filterStatus;
    return matchesSearch && matchesFilter;
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
          <Users className="w-8 h-8" />
          <div>
            <h1 className="text-xl font-bold">Patient Management</h1>
            <p className="text-emerald-100">
              Manage your assigned patients
            </p>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <div className="flex space-x-3 mb-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search patients by name or village..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 appearance-none"
            >
              <option value="all">All Status</option>
              <option value="stable">Stable</option>
              <option value="needs_attention">Needs Attention</option>
              <option value="critical">Critical</option>
            </select>
          </div>
        </div>
        
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>Total Patients: {filteredPatients.length}</span>
          <span>Showing {filteredPatients.length} of {patients.length}</span>
        </div>
      </div>

      {/* Patient List */}
      <div className="space-y-4">
        {filteredPatients.map((patient) => (
          <div key={patient.id} className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                  <Users className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{patient.name}</h3>
                  <p className="text-sm text-gray-600">{patient.age} years • {patient.village}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {getStatusIcon(patient.status)}
                <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(patient.status)}`}>
                  {patient.status.replace('_', ' ')}
                </span>
              </div>
            </div>

            {/* Health Status */}
            <div className="grid grid-cols-2 gap-4 mb-3">
              <div className="text-center p-2 bg-gray-50 rounded-lg">
                <p className="text-lg font-bold text-gray-900">{patient.bloodSugar}</p>
                <p className="text-xs text-gray-600">Blood Sugar (mg/dL)</p>
              </div>
              <div className="text-center p-2 bg-gray-50 rounded-lg">
                <p className="text-lg font-bold text-gray-900">
                  {patient.bloodPressure.systolic}/{patient.bloodPressure.diastolic}
                </p>
                <p className="text-xs text-gray-600">Blood Pressure</p>
              </div>
            </div>

            {/* Health Conditions */}
            <div className="mb-3">
              <div className="flex flex-wrap gap-1">
                {patient.conditions.map((condition) => (
                  <span
                    key={condition}
                    className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full"
                  >
                    {condition}
                  </span>
                ))}
              </div>
            </div>

            {/* Address */}
            <div className="flex items-center space-x-2 mb-3 text-sm text-gray-600">
              <MapPin className="w-4 h-4" />
              <span>{patient.address}</span>
            </div>

            {/* Visit Information */}
            <div className="flex items-center justify-between mb-3 text-sm">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">Last: {patient.lastVisit}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-600">Next: {patient.nextVisit}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-2">
              <button className="flex-1 flex items-center justify-center space-x-2 py-2 bg-emerald-100 text-emerald-600 rounded-lg hover:bg-emerald-200 transition-colors">
                <Phone className="w-4 h-4" />
                <span>Call</span>
              </button>
              <button className="flex-1 flex items-center justify-center space-x-2 py-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors">
                <MessageSquare className="w-4 h-4" />
                <span>Message</span>
              </button>
              <button className="flex-1 flex items-center justify-center space-x-2 py-2 bg-purple-100 text-purple-600 rounded-lg hover:bg-purple-200 transition-colors">
                <Calendar className="w-4 h-4" />
                <span>Visit</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Patient Button */}
      <div className="fixed bottom-20 right-4">
        <button className="w-14 h-14 bg-emerald-600 text-white rounded-full shadow-lg hover:bg-emerald-700 transition-colors flex items-center justify-center">
          <Users className="w-6 h-6" />
        </button>
      </div>

      {filteredPatients.length === 0 && (
        <div className="bg-white p-8 rounded-lg border border-gray-200 text-center">
          <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No patients found</h3>
          <p className="text-gray-600 mb-4">
            {searchTerm || filterStatus !== 'all' 
              ? 'Try adjusting your search or filter criteria'
              : 'You don\'t have any assigned patients yet'
            }
          </p>
          <button className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors">
            Add New Patient
          </button>
        </div>
      )}
    </div>
  );
};

export default ASHAWorkerPatients;
