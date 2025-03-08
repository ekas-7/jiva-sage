import React, { useState } from 'react';
import MedicalRecords from '../components/userData/MedicalRecords.jsx';
import LabReports from '../components/userData/LabReports.jsx';
import Medications from '../components/userData/Medications.jsx';
import HealthMonitoring from '../components/userData/HealthMonitoring.jsx';
import Insurance from '../components/userData/Insurance.jsx';

import { useLocation } from 'react-router-dom';

import { Bell, Share, User, Sun, Moon, Settings } from 'lucide-react';

const UserData = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [showModal, setShowModal] = useState(false); // State for modal visibility

  const location = useLocation();
  const data = location.state?.userData || null;

  console.log(data);
  
  return (
    <div className={`min-h-screen relative ${darkMode ? 'bg-gray-900 text-white' : 'bg-[0xFFFFB6C1] text-gray-800'}`}>
      <div className="container mx-auto px-4 py-6 bg-[#ffdde2] border-radius-5 border-black">
        <div className="flex flex-col lg:grid lg:grid-cols-3 gap-3">
          {/* Second Row */}
          <div className="col-span-1 h-120">
            <MedicalRecords darkMode={darkMode} userProfile={data}/>
          </div>
          <div className="col-span-1 h-120">
            <LabReports darkMode={darkMode} userProfile={data} />
          </div>
          <div className="col-span-1 h-120">
            <Medications darkMode={darkMode} userProfile={data}/>
          </div>

          {/* Third Row */}
          <div className="col-span-1">
            <Insurance darkMode={darkMode} userProfile={data}/>
          </div>
          <div className="col-span-2">
            <HealthMonitoring darkMode={darkMode} userProfile={data}/>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserData;
