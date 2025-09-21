import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Phone, MessageCircle, Star, MapPin, Clock, X } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { ASHAWorker } from '../types';

const HealthWorkerConnect: React.FC = () => {
  const { t } = useTranslation();
  const { user, ashaWorkers } = useApp();
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [selectedWorker, setSelectedWorker] = useState<ASHAWorker | null>(null);
  const [messageText, setMessageText] = useState('');

  const assignedWorker = user ? ashaWorkers.find(worker => worker.id === user.ashaWorkerId) : null;
  const otherWorkers = ashaWorkers.filter(worker => worker.id !== user?.ashaWorkerId);

  const handleCall = (phone: string) => {
    window.location.href = `tel:${phone}`;
  };

  const handleMessage = (worker: ASHAWorker) => {
    setSelectedWorker(worker);
    setShowMessageModal(true);
  };

  const sendMessage = () => {
    // TODO: Implement messaging API integration
    console.log('Sending message to:', selectedWorker?.name, messageText);
    
    // Here you would integrate with your messaging service:
    // - WhatsApp Business API
    // - SMS gateway service
    // - In-app messaging system
    
    setShowMessageModal(false);
    setMessageText('');
    setSelectedWorker(null);
    
    // Show success feedback
    alert('Message sent successfully!'); // Replace with proper toast notification
  };

  const WorkerCard: React.FC<{ worker: ASHAWorker; isAssigned?: boolean }> = ({ 
    worker, 
    isAssigned = false 
  }) => (
    <div className={`bg-white p-4 rounded-lg border-2 transition-all ${
      isAssigned ? 'border-emerald-200 bg-emerald-50' : 'border-gray-200'
    }`}>
      <div className="flex items-start space-x-4">
        {/* Photo */}
        <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-200">
          <img
            src={worker.photo}
            alt={worker.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://images.pexels.com/photos/5452201/pexels-photo-5452201.jpeg?auto=compress&cs=tinysrgb&w=200';
            }}
          />
        </div>

        {/* Details */}
        <div className="flex-1">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className="font-semibold text-gray-900">{worker.name}</h3>
              <p className="text-sm text-gray-600 flex items-center">
                <MapPin className="w-3 h-3 mr-1" />
                {worker.village}
              </p>
            </div>
            
            <div className="flex items-center space-x-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-medium">{worker.rating}</span>
            </div>
          </div>

          <div className="space-y-2 mb-3">
            <p className="text-sm text-gray-600">
              {t('healthWorker.experience', { years: worker.experience })}
            </p>
            
            <div className="flex flex-wrap gap-1">
              {worker.specialization.map((spec, index) => (
                <span key={index} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                  {spec}
                </span>
              ))}
            </div>

            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${worker.isAvailable ? 'bg-green-400' : 'bg-red-400'}`} />
              <span className={`text-sm ${worker.isAvailable ? 'text-green-600' : 'text-red-600'}`}>
                {worker.isAvailable ? t('healthWorker.available') : t('healthWorker.unavailable')}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-2">
            <button
              onClick={() => handleCall(worker.phone)}
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
            >
              <Phone className="w-4 h-4" />
              <span>{t('healthWorker.call')}</span>
            </button>
            
            <button
              onClick={() => handleMessage(worker)}
              className="flex-1 bg-emerald-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors flex items-center justify-center space-x-2"
            >
              <MessageCircle className="w-4 h-4" />
              <span>{t('healthWorker.message')}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <h1 className="text-2xl font-bold text-gray-900">{t('healthWorker.title')}</h1>

      {/* Assigned Worker */}
      {assignedWorker && (
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">
            {t('healthWorker.assignedWorker')}
          </h2>
          <WorkerCard worker={assignedWorker} isAssigned={true} />
        </div>
      )}

      {/* Other Workers */}
      {otherWorkers.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">
            {t('healthWorker.otherWorkers')}
          </h2>
          <div className="space-y-3">
            {otherWorkers.map((worker) => (
              <WorkerCard key={worker.id} worker={worker} />
            ))}
          </div>
        </div>
      )}

      {/* Message Modal */}
      {showMessageModal && selectedWorker && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-md">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">
                  {t('healthWorker.messageModal')}
                </h3>
                <button
                  onClick={() => setShowMessageModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                To: {selectedWorker.name}
              </p>
            </div>

            <div className="p-4">
              <textarea
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 resize-none"
                rows={4}
                placeholder={t('healthWorker.messageText')}
              />
            </div>

            <div className="p-4 border-t border-gray-200 flex space-x-3">
              <button
                onClick={() => setShowMessageModal(false)}
                className="flex-1 py-2 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                {t('common.cancel')}
              </button>
              <button
                onClick={sendMessage}
                disabled={!messageText.trim()}
                className="flex-1 py-2 px-4 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {t('healthWorker.send')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HealthWorkerConnect;