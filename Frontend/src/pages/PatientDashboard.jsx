import React, { useState } from 'react';
import PatientProfile from '../components/dashboard/PatientProfile.jsx';
import MedicalRecords from '../components/dashboard/MedicalRecords.jsx';
import Appointments from '../components/dashboard/Appointments.jsx';
import LabReports from '../components/dashboard/LabReports.jsx';
import Medications from '../components/dashboard/Medications.jsx';
import HealthMonitoring from '../components/dashboard/HealthMonitoring.jsx';
import Insurance from '../components/dashboard/Insurance.jsx';
import ThemeToggle from '../components/dashboard/ThemeToggle.jsx';

const PatientDashboard = () => {
  const [darkMode, setDarkMode] = useState(false);

  // Sample patient data

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-800'}`}>
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Patient Dashboard</h1>
          <ThemeToggle darkMode={darkMode} setDarkMode={setDarkMode} />
        </div>

        <div className="flex flex-col lg:grid lg:grid-cols-3 gap-6">

          {/* First Row */}
          <div className="col-span-1">
            <PatientProfile darkMode={darkMode} />
          </div>
          <div className="col-span-2 h-120">
            <Appointments darkMode={darkMode} />
          </div>

          {/* Second Row */}
          <div className="col-span-1 h-100">
            <MedicalRecords darkMode={darkMode} />
          </div>
          <div className="col-span-1 h-100">
            <LabReports darkMode={darkMode} />
          </div>
          <div className="col-span-1 h-100">
            <Medications darkMode={darkMode} />
          </div>

          {/* Third Row */}
          <div className="col-span-1">
            <Insurance darkMode={darkMode} />
          </div>
          <div className="col-span-2">
            <HealthMonitoring darkMode={darkMode} />
          </div>
        </div>

      </div>
    </div>
  );
};

export default PatientDashboard;