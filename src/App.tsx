import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AppProvider, useApp } from './contexts/AppContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import PatientRegistration from './pages/PatientRegistration';
import ASHAWorkerRegistration from './pages/ASHAWorkerRegistration';
import ASHAWorkerPatients from './pages/ASHAWorkerPatients';
import ASHAWorkerVisits from './pages/ASHAWorkerVisits';
import ASHAWorkerReports from './pages/ASHAWorkerReports';
import Vitals from './pages/Vitals';
import ActivityTracker from './pages/ActivityTracker';
import Reminders from './pages/Reminders';
import HealthWorkerConnect from './pages/HealthWorkerConnect';
import Profile from './pages/Profile';
import { loadFromStorage, STORAGE_KEYS } from './utils/storage';
import './i18n';

const AppContent: React.FC = () => {
  const { user } = useApp();
  const { i18n } = useTranslation();

  // Load saved language preference
  useEffect(() => {
    const savedLanguage = loadFromStorage<string>(STORAGE_KEYS.LANGUAGE);
    if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'hi')) {
      i18n.changeLanguage(savedLanguage);
    }
  }, [i18n]);

  // Register service worker for PWA functionality
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then(() => console.log('Service Worker registered'))
        .catch(() => console.log('Service Worker registration failed'));
    }
  }, []);

  // If no user, show login
  if (!user) {
    return (
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register/patient" element={<PatientRegistration />} />
          <Route path="/register/asha" element={<ASHAWorkerRegistration />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    );
  }

  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/vitals" element={<Vitals />} />
          <Route path="/activity" element={<ActivityTracker />} />
          <Route path="/reminders" element={<Reminders />} />
          <Route path="/connect" element={<HealthWorkerConnect />} />
          <Route path="/patients" element={<ASHAWorkerPatients />} />
          <Route path="/visits" element={<ASHAWorkerVisits />} />
          <Route path="/reports" element={<ASHAWorkerReports />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/login" element={<Navigate to="/" replace />} />
          <Route path="/register/*" element={<Navigate to="/" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </Router>
  );
};

const App: React.FC = () => {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
};

export default App;