import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

// Update manifest link to include proper app info
const updateManifest = () => {
  const existingLink = document.querySelector('link[rel="manifest"]');
  if (!existingLink) {
    const link = document.createElement('link');
    link.rel = 'manifest';
    link.href = '/manifest.json';
    document.head.appendChild(link);
  }
};

// Update page title
document.title = 'Aarogya Sahayak - Healthcare Companion';

// Call manifest update
updateManifest();

const root = createRoot(document.getElementById('root')!);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);