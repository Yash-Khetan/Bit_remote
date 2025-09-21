import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Calendar,
  Download,
  Filter,
  Eye
} from 'lucide-react';
import { useApp } from '../contexts/AppContext';

const ASHAWorkerReports: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { user } = useApp();
  const [selectedPeriod, setSelectedPeriod] = useState('month');

  // Mock report data
  const [reports] = useState([
    {
      id: 'report-1',
      title: 'Monthly Health Summary',
      type: 'summary',
      period: 'January 2024',
      generatedDate: '2024-01-20',
      status: 'ready',
      description: 'Comprehensive health report for all assigned patients',
      metrics: {
        totalPatients: 12,
        activeVisits: 8,
        completedVisits: 15,
        healthAlerts: 3
      }
    },
    {
      id: 'report-2',
      title: 'Diabetes Management Report',
      type: 'condition',
      period: 'January 2024',
      generatedDate: '2024-01-18',
      status: 'ready',
      description: 'Detailed analysis of diabetes patients and their progress',
      metrics: {
        diabeticPatients: 5,
        avgBloodSugar: 145,
        medicationCompliance: 85,
        improvementRate: 12
      }
    },
    {
      id: 'report-3',
      title: 'Hypertension Monitoring',
      type: 'condition',
      period: 'January 2024',
      generatedDate: '2024-01-15',
      status: 'ready',
      description: 'Blood pressure trends and management effectiveness',
      metrics: {
        hypertensivePatients: 7,
        avgSystolic: 135,
        avgDiastolic: 88,
        controlledPatients: 4
      }
    },
    {
      id: 'report-4',
      title: 'Weekly Visit Summary',
      type: 'activity',
      period: 'Week 3, January 2024',
      generatedDate: '2024-01-19',
      status: 'generating',
      description: 'Weekly summary of patient visits and activities',
      metrics: {
        scheduledVisits: 12,
        completedVisits: 10,
        cancelledVisits: 2,
        emergencyVisits: 1
      }
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ready':
        return 'bg-green-100 text-green-800';
      case 'generating':
        return 'bg-yellow-100 text-yellow-800';
      case 'error':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'summary':
        return 'bg-blue-100 text-blue-800';
      case 'condition':
        return 'bg-purple-100 text-purple-800';
      case 'activity':
        return 'bg-emerald-100 text-emerald-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredReports = reports.filter(report => {
    if (selectedPeriod === 'all') return true;
    
    const reportDate = new Date(report.generatedDate);
    const now = new Date();
    
    switch (selectedPeriod) {
      case 'week':
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        return reportDate >= weekAgo;
      case 'month':
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        return reportDate >= monthAgo;
      case 'quarter':
        const quarterAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        return reportDate >= quarterAgo;
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
          <BarChart3 className="w-8 h-8" />
          <div>
            <h1 className="text-xl font-bold">Health Reports</h1>
            <p className="text-emerald-100">
              View and manage health reports
            </p>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-100 p-2 rounded-lg">
              <BarChart3 className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{reports.length}</p>
              <p className="text-sm text-gray-600">Total Reports</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="bg-green-100 p-2 rounded-lg">
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {reports.filter(r => r.status === 'ready').length}
              </p>
              <p className="text-sm text-gray-600">Ready Reports</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Actions */}
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-1 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            >
              <option value="week">Last Week</option>
              <option value="month">Last Month</option>
              <option value="quarter">Last Quarter</option>
              <option value="all">All Time</option>
            </select>
          </div>
          <button className="flex items-center space-x-2 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors">
            <BarChart3 className="w-4 h-4" />
            <span>Generate Report</span>
          </button>
        </div>
      </div>

      {/* Reports List */}
      <div className="space-y-4">
        {filteredReports.map((report) => (
          <div key={report.id} className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{report.title}</h3>
                  <p className="text-sm text-gray-600">{report.period}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(report.status)}`}>
                  {report.status}
                </span>
                <span className={`text-xs px-2 py-1 rounded-full ${getTypeColor(report.type)}`}>
                  {report.type}
                </span>
              </div>
            </div>

            <p className="text-sm text-gray-600 mb-3">{report.description}</p>

            {/* Metrics */}
            <div className="grid grid-cols-2 gap-4 mb-3">
              {Object.entries(report.metrics).map(([key, value]) => (
                <div key={key} className="text-center p-2 bg-gray-50 rounded-lg">
                  <p className="text-lg font-bold text-gray-900">{value}</p>
                  <p className="text-xs text-gray-600 capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </p>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
              <span>Generated: {report.generatedDate}</span>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-2">
              {report.status === 'ready' && (
                <>
                  <button className="flex-1 flex items-center justify-center space-x-2 bg-emerald-100 text-emerald-600 py-2 px-4 rounded-lg hover:bg-emerald-200 transition-colors">
                    <Eye className="w-4 h-4" />
                    <span>View</span>
                  </button>
                  <button className="flex-1 flex items-center justify-center space-x-2 bg-blue-100 text-blue-600 py-2 px-4 rounded-lg hover:bg-blue-200 transition-colors">
                    <Download className="w-4 h-4" />
                    <span>Download</span>
                  </button>
                </>
              )}
              {report.status === 'generating' && (
                <button className="flex-1 bg-gray-100 text-gray-600 py-2 px-4 rounded-lg cursor-not-allowed">
                  Generating...
                </button>
              )}
              <button className="bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors">
                Share
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Generate Report Button */}
      <div className="fixed bottom-20 right-4">
        <button className="w-14 h-14 bg-emerald-600 text-white rounded-full shadow-lg hover:bg-emerald-700 transition-colors flex items-center justify-center">
          <BarChart3 className="w-6 h-6" />
        </button>
      </div>

      {filteredReports.length === 0 && (
        <div className="bg-white p-8 rounded-lg border border-gray-200 text-center">
          <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No reports found</h3>
          <p className="text-gray-600 mb-4">
            {selectedPeriod !== 'all' 
              ? 'No reports generated for the selected period'
              : 'You don\'t have any reports yet'
            }
          </p>
          <button className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors">
            Generate First Report
          </button>
        </div>
      )}
    </div>
  );
};

export default ASHAWorkerReports;
