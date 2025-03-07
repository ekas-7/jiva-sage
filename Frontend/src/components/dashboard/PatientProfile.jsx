import React from 'react';
import { useUser } from '../../context/userContext';

const PatientProfile = ({darkMode }) => {
  const {profile} = useUser();

  const patient = profile?.user?.[0] || {
    "name": "",
    "age": null,
    "gender": "",
    "bloodGroup": "",
    "contact": "",
    "email": "",
    "password": "",
    "emergencyContact": {
        "name": "",
        "relation": "",
        "phone": ""
    },
    "profileImage": ""
}

  // const patient

  return (
    <div className={`overflow-y-auto h-full px-6 py-4 rounded-lg shadow-md ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
      <div className={`flex flex-col sm:flex-row justify-between items-start sm:items-center ${darkMode ? 'bg-gray-700 text-white' : 'bg-white text-black'}`}>
        <div>
          <h2 className="text-xl sm:text-2xl font-semibold">My Profile</h2>
          <p className='text-gray-500 text-sm sm:text-base'>Conditions, allergies, and surgeries</p>
        </div>
      </div>
      
      <div className="mt-4">
        <div className="flex flex-col sm:flex-row items-center mb-6">
          <img
            src={patient.profileImage}
            alt={patient.name}
            className="w-20 h-20 sm:w-24 sm:h-24 rounded-full mb-4 sm:mb-0 sm:mr-4 object-cover"
          />
          <div className="text-center sm:text-left">
            <h3 className="text-lg font-semibold">{patient.name}</h3>
          </div>
        </div>

        {/* Patient Info Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <p className={`text-xs sm:text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Age</p>
            <p className="text-sm sm:text-base">{patient.age} years</p>
          </div>
          <div>
            <p className={`text-xs sm:text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Gender</p>
            <p className="text-sm sm:text-base">{patient.gender}</p>
          </div>
          <div>
            <p className={`text-xs sm:text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Blood Group</p>
            <p className="text-sm sm:text-base">{patient.bloodGroup}</p>
          </div>
          <div>
            <p className={`text-xs sm:text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Contact</p>
            <p className="text-sm sm:text-base">{patient.contact}</p>
          </div>
          <div className="col-span-1 sm:col-span-2">
            <p className={`text-xs sm:text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Email</p>
            <p className="text-sm sm:text-base">{patient.email}</p>
          </div>
          <div className="col-span-1 sm:col-span-2">
            <p className={`text-xs sm:text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Emergency Contact</p>
            <p className="text-sm sm:text-base">{patient.emergencyContact.name} ({patient.emergencyContact.relation})</p>
            <p className="text-sm sm:text-base">{patient.emergencyContact.phone}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientProfile;
