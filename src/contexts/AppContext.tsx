import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { User, VitalReading, Reminder, ASHAWorker, HealthFeedItem, AppContextType } from '../types';
import { saveToStorage, loadFromStorage, STORAGE_KEYS } from '../utils/storage';
import { 
  dummyUser, 
  dummyVitalReadings, 
  dummyReminders, 
  dummyASHAWorkers, 
  dummyHealthFeed 
} from '../data/dummyData';

interface AppState {
  user: User | null;
  vitals: VitalReading[];
  reminders: Reminder[];
  ashaWorkers: ASHAWorker[];
  healthFeed: HealthFeedItem[];
}

type AppAction =
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'ADD_VITAL_READING'; payload: VitalReading }
  | { type: 'ADD_REMINDER'; payload: Reminder }
  | { type: 'UPDATE_REMINDER'; payload: { id: string; reminder: Partial<Reminder> } }
  | { type: 'DELETE_REMINDER'; payload: string }
  | { type: 'LOAD_DATA'; payload: AppState };

const initialState: AppState = {
  user: null,
  vitals: [],
  reminders: [],
  ashaWorkers: dummyASHAWorkers,
  healthFeed: dummyHealthFeed
};

const AppContext = createContext<AppContextType | null>(null);

const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'SET_USER':
      const newStateWithUser = { ...state, user: action.payload };
      if (action.payload) {
        saveToStorage(STORAGE_KEYS.USER, action.payload);
      }
      return newStateWithUser;

    case 'ADD_VITAL_READING':
      const newVitals = [...state.vitals, action.payload];
      saveToStorage(STORAGE_KEYS.VITALS, newVitals);
      return { ...state, vitals: newVitals };

    case 'ADD_REMINDER':
      const newReminders = [...state.reminders, action.payload];
      saveToStorage(STORAGE_KEYS.REMINDERS, newReminders);
      return { ...state, reminders: newReminders };

    case 'UPDATE_REMINDER':
      const updatedReminders = state.reminders.map(reminder =>
        reminder.id === action.payload.id
          ? { ...reminder, ...action.payload.reminder }
          : reminder
      );
      saveToStorage(STORAGE_KEYS.REMINDERS, updatedReminders);
      return { ...state, reminders: updatedReminders };

    case 'DELETE_REMINDER':
      const filteredReminders = state.reminders.filter(reminder => reminder.id !== action.payload);
      saveToStorage(STORAGE_KEYS.REMINDERS, filteredReminders);
      return { ...state, reminders: filteredReminders };

    case 'LOAD_DATA':
      return action.payload;

    default:
      return state;
  }
};

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Load data from localStorage on app start
  useEffect(() => {
    const savedUser = loadFromStorage<User>(STORAGE_KEYS.USER);
    const savedVitals = loadFromStorage<VitalReading[]>(STORAGE_KEYS.VITALS);
    const savedReminders = loadFromStorage<Reminder[]>(STORAGE_KEYS.REMINDERS);

    // Always start with no user to force login
    const loadedState: AppState = {
      user: null, // Always start with no user
      vitals: savedVitals || dummyVitalReadings,
      reminders: savedReminders || dummyReminders,
      ashaWorkers: dummyASHAWorkers,
      healthFeed: dummyHealthFeed
    };

    dispatch({ type: 'LOAD_DATA', payload: loadedState });
  }, []);

  const contextValue: AppContextType = {
    user: state.user,
    vitals: state.vitals,
    reminders: state.reminders,
    ashaWorkers: state.ashaWorkers,
    healthFeed: state.healthFeed,
    setUser: (user) => dispatch({ type: 'SET_USER', payload: user }),
    addVitalReading: (vital) => {
      const newVital: VitalReading = {
        ...vital,
        id: `vital-${Date.now()}`,
      };
      dispatch({ type: 'ADD_VITAL_READING', payload: newVital });
    },
    addReminder: (reminder) => {
      const newReminder: Reminder = {
        ...reminder,
        id: `reminder-${Date.now()}`,
      };
      dispatch({ type: 'ADD_REMINDER', payload: newReminder });
    },
    updateReminder: (id, reminder) => dispatch({ type: 'UPDATE_REMINDER', payload: { id, reminder } }),
    deleteReminder: (id) => dispatch({ type: 'DELETE_REMINDER', payload: id })
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};