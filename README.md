# Aarogya Sahayak - Healthcare Management App

A comprehensive healthcare management application designed for patients and ASHA (Accredited Social Health Activist) workers in India. This app provides role-based access with dedicated portals for patients and healthcare workers.

## 🏥 Features

### For Patients
- **Patient Dashboard**: Personalized health overview with alerts and quick actions
- **Health Tracking**: Monitor blood sugar, blood pressure, and weight
- **Activity Tracker**: Log health metrics with notes and view historical data
- **Health Reminders**: Set medication and checkup reminders
- **ASHA Worker Connect**: Direct communication with assigned healthcare workers
- **Health Feed**: Daily health tips and educational content
- **Bilingual Support**: English and Hindi language support

### For ASHA Workers
- **ASHA Worker Dashboard**: Comprehensive patient management interface
- **Patient Management**: View and manage assigned patients
- **Visit Scheduling**: Schedule and track patient visits
- **Health Reports**: Generate and view health analytics
- **Patient Communication**: Call and message patients directly
- **Health Alerts**: Monitor patient health status and alerts
- **Verification System**: ASHA ID verification for worker authentication

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Yash-Khetan/Bit_remote.git
   cd Bit_remote/project
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5174` (or the port shown in terminal)

## 🏗️ Project Structure

```
project/
├── src/
│   ├── components/          # Reusable UI components
│   ├── contexts/           # React context for state management
│   ├── data/              # Mock data and dummy content
│   ├── i18n/              # Internationalization files
│   ├── pages/             # Application pages
│   │   ├── Login.tsx                    # Role selection and login
│   │   ├── PatientRegistration.tsx      # Patient registration form
│   │   ├── ASHAWorkerRegistration.tsx   # ASHA worker registration
│   │   ├── PatientDashboard.tsx         # Patient dashboard
│   │   ├── ASHAWorkerDashboard.tsx      # ASHA worker dashboard
│   │   ├── ActivityTracker.tsx          # Health metrics tracking
│   │   ├── ASHAWorkerPatients.tsx       # Patient management
│   │   ├── ASHAWorkerVisits.tsx         # Visit scheduling
│   │   ├── ASHAWorkerReports.tsx        # Health reports
│   │   └── Profile.tsx                  # User profile management
│   ├── types/             # TypeScript type definitions
│   └── utils/             # Utility functions
├── public/                # Static assets
└── package.json          # Project dependencies
```

## 🎯 User Roles

### Patient Registration
- Personal information (name, age, phone, profile picture)
- Health details (blood sugar, weight, height, blood pressure)
- Health conditions (diabetes, hypertension)
- Language preference

### ASHA Worker Registration
- Personal information (name, phone, profile picture)
- ASHA ID verification (required field)
- Village/area assignment
- Years of experience
- Specializations (maternal health, child health, etc.)

## 🔧 Technology Stack

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Routing**: React Router DOM
- **Internationalization**: react-i18next
- **State Management**: React Context API
- **Charts**: Recharts
- **PWA**: Service Worker support

## 📱 Key Features

### Role-Based Access Control
- Different navigation menus for patients and ASHA workers
- Role-specific dashboards and functionality
- Secure user authentication flow

### Health Monitoring
- Real-time health metrics tracking
- Health alerts and notifications
- Historical data visualization
- Notes and observations

### Communication
- Direct patient-ASHA worker communication
- Visit scheduling and management
- Health report sharing

### Localization
- English and Hindi language support
- Culturally appropriate content
- Regional healthcare terminology

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Designed for the Indian healthcare system
- ASHA worker program integration
- Community health management focus
- Mobile-first responsive design

## 📞 Support

For support and questions, please open an issue in the GitHub repository.

---

**Aarogya Sahayak** - Empowering healthcare through technology 🏥💚