import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar.jsx';
import PatientDashboard from './PatientDashboard.jsx';
import Profile from '@/pages/ProfilePage.jsx';
import AppointmentPage from './AppointmentPage.jsx';
import LabRecordsPage from './LabRecordsPage.jsx';
import MedicalRecordsPage from './MedicalRecordsPage.jsx';
import MedicationPage from './MedicationPage.jsx';
import InsurancePage from './InsurancePage.jsx';
import HealthMonitoringPage from './HealthMonitoringPage.jsx';

function Home() {
  return (
    <div className="flex h-screen">
      {/* Sidebar on the left */}
      <Sidebar className="w-1/3 dark:bg-red-100"/>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto bg-[#ffdde2]">
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" />} />
          <Route path="/dashboard" element={<PatientDashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/appointments" element={<AppointmentPage />} />
          <Route path="/medical-records" element={<MedicalRecordsPage />} />
          <Route path="/lab-records" element={<LabRecordsPage />} />
          <Route path="/medication" element={<MedicationPage />} />
          <Route path="/insurance" element={<InsurancePage />} />
          <Route path="/health-monitoring" element={<HealthMonitoringPage />} />
          {/* <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} /> */}
          <Route path="*" element={<Navigate to="/dashboard" />} />
        </Routes>
      </div>
    </div>
  );
}

export default Home;
