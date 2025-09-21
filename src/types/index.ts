export interface User {
  id: string;
  name: string;
  age: number;
  phone: string;
  language: 'en' | 'hi';
  role: 'patient' | 'asha_worker';
  conditions?: HealthCondition[];
  ashaWorkerId?: string;
  profilePicture?: string;
  // Patient-specific fields
  bloodSugarLevel?: number;
  weight?: number;
  height?: number;
  bloodPressure?: {
    systolic: number;
    diastolic: number;
  };
  // ASHA Worker-specific fields
  ashaId?: string;
  village?: string;
  experience?: number;
  specialization?: string[];
  isVerified?: boolean;
  createdAt: Date;
}

export interface HealthCondition {
  id: string;
  name: string;
  diagnosedDate: Date;
  severity: 'mild' | 'moderate' | 'severe';
}

export interface VitalReading {
  id: string;
  userId: string;
  type: 'blood_sugar' | 'blood_pressure' | 'weight';
  value: number;
  systolic?: number; // for blood pressure
  diastolic?: number; // for blood pressure
  unit: string;
  timestamp: Date;
  notes?: string;
}

export interface ASHAWorker {
  id: string;
  name: string;
  phone: string;
  photo: string;
  village: string;
  experience: number;
  specialization: string[];
  rating: number;
  isAvailable: boolean;
}

export interface Reminder {
  id: string;
  userId: string;
  title: string;
  description: string;
  type: 'medication' | 'checkup' | 'exercise' | 'diet';
  time: string; // HH:MM format
  frequency: 'daily' | 'weekly' | 'monthly';
  isActive: boolean;
  createdAt: Date;
}

export interface HealthFeedItem {
  id: string;
  type: 'diet' | 'exercise' | 'tip';
  title: string;
  description: string;
  audioUrl?: string;
  imageUrl?: string;
  language: 'en' | 'hi';
  category: string;
  createdAt: Date;
}

export interface AppContextType {
  user: User | null;
  vitals: VitalReading[];
  reminders: Reminder[];
  ashaWorkers: ASHAWorker[];
  healthFeed: HealthFeedItem[];
  setUser: (user: User | null) => void;
  addVitalReading: (vital: Omit<VitalReading, 'id'>) => void;
  addReminder: (reminder: Omit<Reminder, 'id'>) => void;
  updateReminder: (id: string, reminder: Partial<Reminder>) => void;
  deleteReminder: (id: string) => void;
}