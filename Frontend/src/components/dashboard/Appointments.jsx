import React, { useState, useEffect } from 'react';
import { useUser } from '../../context/userContext';

const Appointments = ({ darkMode }) => {
  const [activeTab, setActiveTab] = useState('upcoming');
  // const [appointments, setAppointments] = useState([]);
  const { profile } = useUser();

  const appointments = profile?.appointments || [];

  // Separate upcoming and past appointments dynamically
  const upcomingAppointments = appointments.filter(appointment => !appointment.prescription);
  const pastAppointments = appointments.filter(appointment => appointment.prescription);

  return (
    <div className={` px-6 w-full h-full py-4 rounded-lg shadow-md overflow-hidden ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
      <div className={`flex justify-between items-center ${darkMode ? 'bg-gray-700 text-white' : 'bg-white text-black'}`}>
        <div>
          <h2 className="text-2xl font-semibold">Appointments & Consultations</h2>
          <p className='text-gray-500'>Upcoming and past medical appointments</p>
        </div>
        <button className={`${darkMode ? 'bg-white text-black' : 'bg-black text-white'} px-4 py-2 rounded-lg font-bold`}>
          Schedule Now
        </button>
      </div>


      <div className="mt-4 bg-gray-100 inline-block p-2 rounded-lg">
        <nav className="flex space-x-2 ">
          <button
            onClick={() => setActiveTab('upcoming')}
            className={`cursor-pointer px-4 py-2 text-sm font-bold rounded-lg transition ${activeTab === 'upcoming' ? 'bg-white text-black' : 'bg-transparent text-gray-600'
              }`}
          >
            Upcoming
          </button>
          <button
            onClick={() => setActiveTab('past')}
            className={`cursor-pointer px-4 py-2 text-sm font-bold rounded-lg transition ${activeTab === 'past' ? 'bg-white text-black' : 'bg-transparent text-gray-600'
              }`}
          >
            Past Consultations
          </button>
        </nav>
      </div>



      <div className="my-4 h-80 overflow-y-auto">
        {activeTab === 'upcoming' && (
          <div className="space-y-4 h-full">
            {upcomingAppointments.length > 0 ? (
              upcomingAppointments.map((appointment) => (
                <div key={appointment.id} className={` p-5 rounded-lg border shadow-sm ${darkMode ? 'border-gray-700 bg-black' : 'border-gray-200 bg-white'}`}>
                  <div className=" flex justify-between items-start">
                    {/* Doctor Details */}
                    <div>
                      <h3 className="font-semibold text-xl">{appointment.doctor}</h3>
                      <p className={`text-md font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{appointment.department}</p>
                      <p className={`text-md font-medium mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Location: {appointment.location}
                      </p>
                    </div>

                    {/* Appointment Time & Badge */}
                    <div className="text-right">
                      <p className="text-lg font-bold">
                        {new Date(appointment.date).toLocaleDateString()} at {appointment.time}
                      </p>
                      <span className={`inline-block px-3 py-1 text-sm font-semibold rounded-full mt-1 ${appointment.isOnline
                        ? (darkMode ? 'bg-blue-900 text-blue-200' : 'bg-blue-100 text-blue-700')
                        : (darkMode ? 'bg-green-900 text-green-200' : 'bg-green-100 text-green-700')
                        }`}>
                        {appointment.isOnline ? 'Online' : 'In-person'}
                      </span>
                    </div>
                  </div>

                  {/* Join Meeting Button for Online Appointments */}
                  {appointment.isOnline && (
                    <div className="mt-3">
                      <a href={appointment.link} target="_blank" rel="noopener noreferrer"
                        className={`cursor-pointer inline-block px-4 py-2 text-md font-semibold rounded-md mt-2 ${darkMode ? 'bg-gray-800 text-white hover:bg-gray-700' : 'bg-white border border-gray-300 text-black hover:bg-gray-100'
                          }`}>
                        Join Meeting
                      </a>
                    </div>
                  )}
                </div>

              ))
            ) : (
              <p className="text-gray-500">No upcoming appointments.</p>
            )}
          </div>
        )}

        {activeTab === 'past' && (
          <div className="space-y-4">
            {pastAppointments.length > 0 ? (
              pastAppointments.map((appointment) => (
                <div key={appointment.id} className={`p-4 rounded-lg border ${darkMode ? 'border-gray-700 bg-black' : 'border-gray-200 bg-white'}`}>
                  <div className="flex justify-between items-start">
                    {/* Doctor Details */}
                    <div>
                      <h3 className="font-semibold text-xl">{appointment.doctor}</h3>
                      <p className={`text-md ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{appointment.department}</p>
                      <p className={`text-md ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Location: {appointment.location}
                      </p>
                    </div>

                    {/* Bold and Larger Date & Time */}
                    <div className="text-right text-lg font-bold">
                      {new Date(appointment.date).toLocaleDateString()} at {appointment.time}
                    </div>
                  </div>

                  {/* Diagnosis & Prescription Section */}
                  <div className="mt-3">
                    <h4 className={`text-md font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Diagnosis:</h4>
                    <p className={`text-md ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{appointment.diagnosis}</p>

                    <h4 className={`text-md font-medium mt-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Prescription:</h4>
                    <p className={`text-md ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{appointment.prescription}</p>
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-2 flex space-x-2">
                    <button className={`cursor-pointer inline-block px-4 py-2 text-md font-semibold rounded-md mt-2 ${darkMode ? 'bg-gray-800 text-white hover:bg-gray-700' : 'bg-white border border-gray-300 text-black hover:bg-gray-100'
                          }`}>
                      View Summary
                    </button>
                  </div>
                </div>

              ))
            ) : (
              <p className="text-gray-500">No past consultations.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Appointments;
