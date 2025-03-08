import React, { useState } from 'react';
import PatientProfile from '../components/dashboard/PatientProfile.jsx';
import MedicalRecords from '../components/dashboard/MedicalRecords.jsx';
import Appointments from '../components/dashboard/Appointments.jsx';
import LabReports from '../components/dashboard/LabReports.jsx';
import Medications from '../components/dashboard/Medications.jsx';
import HealthMonitoring from '../components/dashboard/HealthMonitoring.jsx';
import Insurance from '../components/dashboard/Insurance.jsx';
import ThemeToggle from '../components/dashboard/ThemeToggle.jsx';
import UserQRCode from '@/components/UserQRCode.jsx';

const PatientDashboard = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [showModal, setShowModal] = useState(false); // State for modal visibility

  return (
    <div className={`min-h-screen relative ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-800'}`}>
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Patient Dashboard</h1>
          <div className='flex gap-4'>
            <button
              onClick={() => setShowModal(true)} // Open modal on click
              className={`cursor-pointer p-2 rounded-full transition duration-300 ${
                darkMode ? "bg-gray-800 text-white" : "bg-gray-200 text-gray-800"
              }`}
            >
              Share Profile
            </button>
            <ThemeToggle darkMode={darkMode} setDarkMode={setDarkMode} />
          </div>
        </div>

        <div className="flex flex-col lg:grid lg:grid-cols-3 gap-6">
          {/* First Row */}
          <div className="col-span-1">
            <PatientProfile darkMode={darkMode} />
          </div>
          <div className="col-span-2">
            <Appointments darkMode={darkMode} />
          </div>

          {/* Second Row */}
          <div className="col-span-1 h-120">
            <MedicalRecords darkMode={darkMode} />
          </div>
          <div className="col-span-1 h-120">
            <LabReports darkMode={darkMode} />
          </div>
          <div className="col-span-1 h-120">
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

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <UserQRCode closeModal={() => setShowModal(false)} />
        </div>
      )}
    </div>
  );
};

export default PatientDashboard;
