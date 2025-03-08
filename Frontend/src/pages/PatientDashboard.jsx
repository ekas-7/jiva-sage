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
import { useUser } from '@/context/userContext.jsx';
import axios from 'axios';

import { useNavigate } from 'react-router-dom';

import { Bell, Share, User, Sun, Moon, Settings } from 'lucide-react';

const PatientDashboard = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [showModal, setShowModal] = useState(false); // State for modal visibility

  const { profile } = useUser()
  const navigate = useNavigate();

  const user = profile?.user?.[0] || {
    name: "John Doe",
    age: 45,
    gender: "Male",
    bloodGroup: "O+",
    contact: "+1 (555) 123-4567",
    email: "john.doe@example.com",
    password: "",
    emergencyContact: {
      name: "Jane Doe",
      relation: "Spouse",
      phone: "+1 (555) 987-6543",
    },
    profileImage: "/placeholder.svg?height=200&width=200"
  }

  const data = {
    "reports": [
      {
        "patient_name": "John Doe",
        "analysis_date": "2023-12-01",
        "overall_health_status": "Stable with monitoring required",
        "analysis": [
          {
            "parameter": "Blood Glucose",
            "status": "Elevated",
            "interpretation": "Blood glucose levels are higher than normal, indicating potential risk for diabetes or need for adjustment in diet or medication.",
            "risk_level": "Moderate"
          },
          {
            "parameter": "Lipid Profile",
            "status": "Borderline",
            "interpretation": "Lipid levels are approaching high risk, suggesting possible cardiovascular risks.",
            "risk_level": "Moderate"
          },
          {
            "parameter": "Blood Pressure",
            "status": "Normal",
            "interpretation": "Blood pressure levels are within normal range.",
            "risk_level": "Low"
          },
          {
            "parameter": "Heart Rate",
            "status": "Normal",
            "interpretation": "Heart rate is stable and within normal limits.",
            "risk_level": "Low"
          }
        ],
        "nutrition_recommendations": [
          {
            "food_type": "Low Glycemic Index Foods",
            "reason": "To manage and stabilize blood glucose levels.",
            "examples": ["Whole grains", "Legumes", "Nuts"],
            "frequency": "Daily",
            "portion_size": "Moderate"
          },
          {
            "food_type": "High Fiber Foods",
            "reason": "To improve lipid profile and aid in digestion.",
            "examples": ["Fruits", "Vegetables", "Whole grains"],
            "frequency": "Daily",
            "portion_size": "At least half of each meal"
          }
        ],
        "activity_recommendations": [
          {
            "activity_type": "Aerobic Exercise",
            "reason": "To improve cardiovascular health and manage weight.",
            "examples": ["Walking", "Cycling", "Swimming"],
            "frequency": "5 times a week",
            "intensity": "Moderate",
            "duration": "30 minutes",
            "precautions": [
              "Start slowly and increase pace gradually",
              "Stay hydrated",
              "Consult a doctor if any discomfort occurs"
            ]
          }
        ],
        "follow_up_recommendations": [
          "Regular monitoring of blood glucose and lipid levels every 3 months.",
          "Consultation with a dietitian to adjust dietary needs based on latest health reports.",
          "Routine check-ups with the primary care physician to monitor overall health and adjust medications as necessary."
        ]
      }
    ]
  }

  const generateReport = async () => {
    const dummyData = {
      reports: [profile]
    }
    console.log(dummyData);

    try {
      // const res = await axios.post('https://jiva-data-summarizer.davinder.live/analyze-health',{dummyData});
      // const data = res.data
      console.log("report data : ", data);
      navigate('/report')
    }
    catch (err) {
      console.log("Error in generating report : ", err.message);
    }
  }

  return (
    <div className={`min-h-screen relative ${darkMode ? 'bg-gray-900 text-white' : 'bg-[0xFFFFB6C1] text-gray-800'}`}>
      <div className="container mx-auto px-4 py-6 bg-[#ffdde2] border-radius-5 border-black">


        <div className="flex mb-2 rounded-lg justify-between items-center bg-white py-4 px-6 border-b border-gray-100 shadow-sm">
          <div className="flex items-center">
            <div className="h-10 w-10 rounded-full bg-[#FFE6EA] flex items-center justify-center text-[#FF7C8C] mr-3">
              <span className="text-lg font-semibold">{user.name[0]}</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">Hello, {user.name}</h1>
              <p className="text-sm text-gray-500">Welcome back to your health portal</p>
            </div>
          </div>
          <div className='flex items-center gap-4'>
            <button
              onClick={() => generateReport()}
              className="flex items-center gap-2 bg-[#FFB6C1] hover:bg-[#fba8b5] text-black px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24">
                <path d="M13 3L4 14h7v7l9-11h-7V3z" fill="black" stroke="black" stroke-width="0.5" />
              </svg>
              Generate Report
            </button>
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 bg-[#FFB6C1] hover:bg-[#fba8b5] text-black px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path>
                <polyline points="16 6 12 2 8 6"></polyline>
                <line x1="12" y1="2" x2="12" y2="15"></line>
              </svg>
              Share Profile
            </button>
          </div>
        </div>

        <div className="flex flex-col lg:grid lg:grid-cols-3 gap-3">
          {/* First Row */}
          <div className="col-span-1">
            <PatientProfile darkMode={darkMode} />
          </div>
          <div className="col-span-2 h-120">
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
