import React, { useState } from "react";
import { Activity, AlertCircle, Scissors } from "lucide-react";

const MedicalRecords = ({ darkMode }) => {
  const [activeTab, setActiveTab] = useState("conditions");

  const primaryColor = "#00bf60";

  const medicalData = {
    conditions: [
      { name: "Type 2 Diabetes", since: "2018", severity: "Moderate", notes: "Well controlled with medication" },
      { name: "Hypertension", since: "2020", severity: "Mild", notes: "Monitoring regularly" },
    ],
    allergies: [
      { name: "Penicillin", severity: "Severe", reaction: "Anaphylaxis" },
      { name: "Peanuts", severity: "Moderate", reaction: "Skin rash, breathing difficulties" },
    ],
    surgeries: [
      { procedure: "Appendectomy", date: "2015-03-15", hospital: "Metro General Hospital" },
      { procedure: "Knee Arthroscopy", date: "2019-11-22", hospital: "Orthopedic Specialty Center" },
    ],
  };

  const tabIcons = {
    conditions: <Activity size={16} className="inline-block mr-1" />,
    allergies: <AlertCircle size={16} className="inline-block mr-1" />,
    surgeries: <Scissors size={16} className="inline-block mr-1" />,
  };

  return (
    <div className={`h-full px-6 py-4 rounded-lg shadow-md overflow-hidden ${darkMode ? "bg-gray-900 text-white" : "bg-white text-black"}`}>
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold" style={{ color: primaryColor }}>
            Medical Records & History
          </h2>
          <p className="text-gray-500">Conditions, allergies, and surgeries</p>
        </div>
      </div>

      {/* Tabs */}
      <div className={`mt-4 p-2 rounded-lg ${darkMode ? "bg-gray-800" : "bg-gray-100"}`}>
        <nav className="flex space-x-2">
          {["conditions", "allergies", "surgeries"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`cursor-pointer px-4 py-2 text-sm font-bold rounded-lg transition ${
                activeTab === tab
                  ? `bg-[${primaryColor}] text-white`
                  : darkMode
                  ? "text-gray-400 hover:text-white"
                  : "text-gray-600 hover:text-black"
              }`}
            >
              {tabIcons[tab]} {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </nav>
      </div>

      {/* Data List with Scrollbar */}
      <div className="mt-4 max-h-64 overflow-y-auto pr-2">
        {activeTab === "conditions" &&
          medicalData.conditions.map((condition, index) => (
            <div key={index} className={`p-4 mb-3 rounded-lg border ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}>
              <div className="flex justify-between">
                <h3 className="font-medium">{condition.name}</h3>
                <span
                  className="px-2 py-1 text-xs rounded"
                  style={{ backgroundColor: primaryColor, color: "white" }}
                >
                  {condition.severity}
                </span>
              </div>
              <p className="text-sm text-gray-400">Since: {condition.since}</p>
              <p className="text-sm text-gray-400">{condition.notes}</p>
            </div>
          ))}

        {activeTab === "allergies" &&
          medicalData.allergies.map((allergy, index) => (
            <div key={index} className={`p-4 mb-3 rounded-lg border ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}>
              <div className="flex justify-between">
                <h3 className="font-medium">{allergy.name}</h3>
                <span
                  className="px-2 py-1 text-xs rounded"
                  style={{ backgroundColor: primaryColor, color: "white" }}
                >
                  {allergy.severity}
                </span>
              </div>
              <p className="text-sm text-gray-400">Reaction: {allergy.reaction}</p>
            </div>
          ))}

        {activeTab === "surgeries" &&
          medicalData.surgeries.map((surgery, index) => (
            <div key={index} className={`p-4 mb-3 rounded-lg border ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}>
              <h3 className="font-medium">{surgery.procedure}</h3>
              <p className="text-sm text-gray-400">Date: {new Date(surgery.date).toLocaleDateString()}</p>
              <p className="text-sm text-gray-400">Hospital: {surgery.hospital}</p>
            </div>
          ))}
      </div>
    </div>
  );
};

export default MedicalRecords;
