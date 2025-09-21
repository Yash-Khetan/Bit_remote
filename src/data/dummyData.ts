import { ASHAWorker, VitalReading, HealthFeedItem, Reminder, User } from '../types';

// Dummy ASHA Workers
export const dummyASHAWorkers: ASHAWorker[] = [
  {
    id: 'asha-1',
    name: 'Priya Sharma',
    phone: '+91-9876543210',
    photo: 'https://images.pexels.com/photos/5327580/pexels-photo-5327580.jpeg?auto=compress&cs=tinysrgb&w=200',
    village: 'Ramgarh',
    experience: 8,
    specialization: ['Diabetes Care', 'Maternal Health', 'Child Nutrition'],
    rating: 4.8,
    isAvailable: true
  },
  {
    id: 'asha-2',
    name: 'Sunita Devi',
    phone: '+91-9876543211',
    photo: 'https://images.pexels.com/photos/5452201/pexels-photo-5452201.jpeg?auto=compress&cs=tinysrgb&w=200',
    village: 'Ramgarh',
    experience: 12,
    specialization: ['Hypertension', 'Senior Care', 'Mental Health'],
    rating: 4.9,
    isAvailable: false
  }
];

// Dummy Vital Readings (Last 10 days)
export const dummyVitalReadings: VitalReading[] = [
  // Blood Sugar readings
  {
    id: 'vital-1',
    userId: 'user-1',
    type: 'blood_sugar',
    value: 120,
    unit: 'mg/dL',
    timestamp: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000),
    notes: 'Fasting'
  },
  {
    id: 'vital-2',
    userId: 'user-1',
    type: 'blood_sugar',
    value: 140,
    unit: 'mg/dL',
    timestamp: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
    notes: 'Post meal'
  },
  {
    id: 'vital-3',
    userId: 'user-1',
    type: 'blood_sugar',
    value: 115,
    unit: 'mg/dL',
    timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    notes: 'Fasting'
  },
  {
    id: 'vital-4',
    userId: 'user-1',
    type: 'blood_sugar',
    value: 135,
    unit: 'mg/dL',
    timestamp: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000)
  },
  // Blood Pressure readings
  {
    id: 'vital-5',
    userId: 'user-1',
    type: 'blood_pressure',
    value: 130,
    systolic: 130,
    diastolic: 85,
    unit: 'mmHg',
    timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
  },
  {
    id: 'vital-6',
    userId: 'user-1',
    type: 'blood_pressure',
    value: 125,
    systolic: 125,
    diastolic: 80,
    unit: 'mmHg',
    timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000)
  },
  // Weight readings
  {
    id: 'vital-7',
    userId: 'user-1',
    type: 'weight',
    value: 68.5,
    unit: 'kg',
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
  },
  {
    id: 'vital-8',
    userId: 'user-1',
    type: 'weight',
    value: 68.2,
    unit: 'kg',
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
  },
  {
    id: 'vital-9',
    userId: 'user-1',
    type: 'blood_sugar',
    value: 118,
    unit: 'mg/dL',
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    notes: 'Fasting'
  },
  {
    id: 'vital-10',
    userId: 'user-1',
    type: 'weight',
    value: 68.0,
    unit: 'kg',
    timestamp: new Date()
  }
];

// Dummy Health Feed Items
export const dummyHealthFeed: HealthFeedItem[] = [
  {
    id: 'feed-1',
    type: 'diet',
    title: 'Diabetes-Friendly Breakfast',
    description: 'Start your day with oats, nuts, and fresh fruits for stable blood sugar levels.',
    imageUrl: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=300',
    language: 'en',
    category: 'Diabetes Care',
    createdAt: new Date()
  },
  {
    id: 'feed-2',
    type: 'exercise',
    title: 'Daily Walking Routine',
    description: '30 minutes of brisk walking can help control blood pressure and improve heart health.',
    imageUrl: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=300',
    language: 'en',
    category: 'Heart Health',
    createdAt: new Date()
  },
  {
    id: 'feed-3',
    type: 'tip',
    title: 'Blood Pressure Monitoring',
    description: 'Check your BP at the same time daily for accurate tracking. Rest 5 minutes before measuring.',
    language: 'en',
    category: 'Hypertension',
    createdAt: new Date()
  },
  // Hindi versions
  {
    id: 'feed-4',
    type: 'diet',
    title: 'मधुमेह के लिए नाश्ता',
    description: 'ब्लड शुगर को नियंत्रित रखने के लिए ओट्स, मेवे और ताजे फल के साथ दिन की शुरुआत करें।',
    language: 'hi',
    category: 'मधुमेह देखभाल',
    createdAt: new Date()
  },
  {
    id: 'feed-5',
    type: 'exercise',
    title: 'दैनिक पैदल चलना',
    description: '30 मिनट तेज़ चलना रक्तचाप को नियंत्रित करने और हृदय स्वास्थ्य में सुधार करने में मदद कर सकता है।',
    language: 'hi',
    category: 'हृदय स्वास्थ्य',
    createdAt: new Date()
  },
  {
    id: 'feed-6',
    type: 'tip',
    title: 'रक्तचाप की निगरानी',
    description: 'सटीक ट्रैकिंग के लिए रोज़ाना एक ही समय पर अपना BP चेक करें। मापने से पहले 5 मिनट आराम करें।',
    language: 'hi',
    category: 'उच्च रक्तचाप',
    createdAt: new Date()
  }
];

// Dummy Reminders
export const dummyReminders: Reminder[] = [
  {
    id: 'reminder-1',
    userId: 'user-1',
    title: 'Morning Medication',
    description: 'Take Metformin 500mg with breakfast',
    type: 'medication',
    time: '08:00',
    frequency: 'daily',
    isActive: true,
    createdAt: new Date()
  },
  {
    id: 'reminder-2',
    userId: 'user-1',
    title: 'Blood Sugar Check',
    description: 'Check fasting blood sugar level',
    type: 'checkup',
    time: '07:00',
    frequency: 'daily',
    isActive: true,
    createdAt: new Date()
  },
  {
    id: 'reminder-3',
    userId: 'user-1',
    title: 'Evening Walk',
    description: '30 minutes brisk walking',
    type: 'exercise',
    time: '18:00',
    frequency: 'daily',
    isActive: true,
    createdAt: new Date()
  },
  {
    id: 'reminder-4',
    userId: 'user-1',
    title: 'Doctor Appointment',
    description: 'Monthly checkup with Dr. Kumar',
    type: 'checkup',
    time: '10:00',
    frequency: 'monthly',
    isActive: true,
    createdAt: new Date()
  }
];

// Dummy User
export const dummyUser: User = {
  id: 'user-1',
  name: 'Rajesh Kumar',
  age: 55,
  phone: '+91-9876543212',
  language: 'en',
  conditions: [
    {
      id: 'condition-1',
      name: 'Type 2 Diabetes',
      diagnosedDate: new Date('2020-03-15'),
      severity: 'moderate'
    },
    {
      id: 'condition-2',
      name: 'Hypertension',
      diagnosedDate: new Date('2021-08-22'),
      severity: 'mild'
    }
  ],
  ashaWorkerId: 'asha-1',
  createdAt: new Date('2023-01-10')
};