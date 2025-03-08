import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar.jsx';
import PatientDashboard from './PatientDashboard.jsx';
import Profile from '@/components/Profile.jsx';

function Home() {
  return (
    <div className="flex h-screen">
      {/* Sidebar on the left */}
      <Sidebar className="w-1/3"/>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto">
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" />} />
          <Route path="/dashboard" element={<PatientDashboard />} />
          <Route path="/profile" element={<Profile />} />
          {/* <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} /> */}
          <Route path="*" element={<Navigate to="/dashboard" />} />
        </Routes>
      </div>
    </div>
  );
}

export default Home;
