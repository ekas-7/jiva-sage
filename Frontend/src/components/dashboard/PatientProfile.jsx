import React from 'react';
import { useUser } from '../../context/userContext';
import { User, Mail, Phone, Calendar, Droplet, Heart, Users } from 'lucide-react';

const PatientProfile = ({ darkMode }) => {
  const { profile } = useUser();

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

  return (
    <div className="overflow-y-scroll h-full rounded-lg shadow-sm overflow-hidden bg-white border border-gray-100">
      {/* <div className="p-6 border-b border-gray-100">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">My Profile</h2>
            <p className="text-sm text-gray-500">Conditions, allergies, and surgeries</p>
          </div>
        </div>
      </div> */}
      
      <div className="px-6 py-4">
        <div className="flex flex-col sm:flex-row items-center p-6 bg-gray-50 rounded-lg border border-gray-100 mb-6">
          <div className="relative mb-4 sm:mb-0 sm:mr-6">
            <img
              src={patient.profileImage}
              alt={patient.name}
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-4 border-white shadow-sm"
            />
            <div className="absolute bottom-0 right-0 w-6 h-6 bg-green-500 rounded-full border-2 border-white"></div>
          </div>
          <div className="text-center sm:text-left">
            <h3 className="text-lg font-medium text-gray-900">{patient.name}</h3>
            <p className="text-sm text-gray-500">Patient ID: #{Math.floor(Math.random() * 10000).toString().padStart(4, '0')}</p>
          </div>
        </div>

        {/* Patient Info Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-lg border border-gray-100 bg-white">
            <div className="flex items-center mb-2">
              <div className="w-8 h-8 rounded-full bg-orange-50 flex items-center justify-center text-orange-500 mr-3">
                <Calendar size={16} />
              </div>
              <p className="text-sm font-medium text-gray-500">Age</p>
            </div>
            <p className="text-base font-medium text-gray-900 ml-11">{patient.age} years</p>
          </div>
          
          <div className="p-4 rounded-lg border border-gray-100 bg-white">
            <div className="flex items-center mb-2">
              <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center text-green-500 mr-3">
                <User size={16} />
              </div>
              <p className="text-sm font-medium text-gray-500">Gender</p>
            </div>
            <p className="text-base font-medium text-gray-900 ml-11">{patient.gender}</p>
          </div>
          
          <div className="p-4 rounded-lg border border-gray-100 bg-white">
            <div className="flex items-center mb-2">
              <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center text-red-500 mr-3">
                <Droplet size={16} />
              </div>
              <p className="text-sm font-medium text-gray-500">Blood Group</p>
            </div>
            <p className="text-base font-medium text-gray-900 ml-11">{patient.bloodGroup}</p>
          </div>
          
          <div className="p-4 rounded-lg border border-gray-100 bg-white">
            <div className="flex items-center mb-2">
              <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-500 mr-3">
                <Phone size={16} />
              </div>
              <p className="text-sm font-medium text-gray-500">Contact</p>
            </div>
            <p className="text-base font-medium text-gray-900 ml-11">{patient.contact}</p>
          </div>
          
          <div className="p-4 rounded-lg border border-gray-100 bg-white col-span-1 sm:col-span-2">
            <div className="flex items-center mb-2">
              <div className="w-8 h-8 rounded-full bg-purple-50 flex items-center justify-center text-purple-500 mr-3">
                <Mail size={16} />
              </div>
              <p className="text-sm font-medium text-gray-500">Email</p>
            </div>
            <p className="text-base font-medium text-gray-900 ml-11">{patient.email}</p>
          </div>
          
          <div className="p-4 rounded-lg border border-gray-100 bg-white col-span-1 sm:col-span-2">
            <div className="flex items-center mb-2">
              <div className="w-8 h-8 rounded-full bg-teal-50 flex items-center justify-center text-teal-500 mr-3">
                <Users size={16} />
              </div>
              <p className="text-sm font-medium text-gray-500">Emergency Contact</p>
            </div>
            <div className="ml-11">
              <p className="text-base font-medium text-gray-900">{patient.emergencyContact.name} ({patient.emergencyContact.relation})</p>
              <p className="text-sm text-gray-500">{patient.emergencyContact.phone}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientProfile;