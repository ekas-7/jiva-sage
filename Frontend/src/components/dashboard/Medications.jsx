import React from 'react';
import {useUser} from '../../context/userContext.jsx'

const Medications = ({ darkMode }) => {
  const {profile} = useUser();
  // Sample medications data
  const medications = profile?.medications || []

  return (
    <div className={`overflow-y-auto h-full px-6 py-4 rounded-lg shadow-md overflow-hidden ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
      <div className={`flex justify-between items-center ${darkMode ? 'bg-gray-700 text-white' : 'bg-white text-black'}`}>
        <div>
          <h2 className="text-2xl font-semibold">Medications & Prescriptions</h2>
          <p className='text-gray-500'>Current medications and refill status</p>
        </div>
        <button className={`${darkMode ? 'bg-white text-black' : 'bg-black text-white'} px-4 py-2 rounded-lg font-bold`}>
          Request All
        </button>
      </div>
      
      <div className="mt-4">
        <div className="space-y-4">
          {medications.map((medication) => {
            // Calculate days until refill
            const today = new Date();
            const refillDate = new Date(medication.refillDate);
            const daysUntilRefill = Math.ceil((refillDate - today) / (1000 * 60 * 60 * 24));
            
            return (
              <div 
                key={medication.id} 
                className={`p-5 rounded-lg ${darkMode ? 'bg-black text-white' : 'bg-white '} border border-gray-200`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold">{medication.name} {medication.dosage}</h3>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {medication.frequency}
                    </p>
                  </div>
                  <div>
                    {daysUntilRefill <= 7 ? (
                      <span className={`inline-block px-2 py-1 text-xs rounded ${
                        darkMode ? 'bg-red-800 text-red-200' : 'bg-red-100 text-red-800'
                      }`}>
                        Refill in {daysUntilRefill} days
                      </span>
                    ) : (
                      <span className={`inline-block px-2 py-1 text-xs rounded ${
                        darkMode ? 'bg-green-800 text-green-200' : 'bg-green-100 text-green-800'
                      }`}>
                        Refill in {daysUntilRefill} days
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="mt-2">
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    <span className="font-medium">Started:</span> {new Date(medication.startDate).toLocaleDateString()}
                  </p>
                  <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    <span className="font-medium">Instructions:</span> {medication.instructions}
                  </p>
                </div>
                
                <div className="w-full mt-3 flex space-x-2">
                  <button className={`w-1/2 px-3 py-2 text-sm font-bold rounded cursor-pointer ${
                    darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-white border border-gray-200 hover:bg-gray-100'
                  } `}>
                    Set Reminder
                  </button>
                  <button className={`w-1/2 px-3 py-2 text-sm font-bold rounded cursor-pointer ${
                    darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-white border border-gray-200 hover:bg-gray-100'
                  } `}>
                    Request Refill
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Medications;