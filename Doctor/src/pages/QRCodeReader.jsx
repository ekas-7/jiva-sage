import React, { useState } from 'react';
import axios from 'axios';
import { Scanner } from '@yudiel/react-qr-scanner';
import { Camera, AlertCircle, Loader, HeartPulse, RefreshCw, User } from 'lucide-react';
import UserData from './UserData.jsx';
import { useDoctor } from '@/context/DoctorContext.jsx';
import { useNavigate } from 'react-router-dom';

function QRCodeReader({ darkMode }) {
  const [apiResponse, setApiResponse] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [scanActive, setScanActive] = useState(true);

  const { setUserProfile } = useDoctor();
  const navigate = useNavigate();

  const handleScan = async (result) => {
    if (!result || result.length === 0 || !scanActive) return;
    
    // Pause scanning while processing
    setScanActive(false);
    
    const qrValue = result[0].rawValue;
    console.log(qrValue);
    
    try {
      setIsLoading(true);
      setError(null);
      
      // Make API call with the QR code value
      const res = await axios.post(
        'http://localhost:4000/api/doctor/qr-data', 
        {}, // Empty request body
        { 
          headers: { 
            Authorization:qrValue 
          }
        }
      );
      const data = res.data;
      
      // Log the API response to console
      console.log('API Response:', data.data);
      
      setUserProfile(data.data);
      // Update state with the response
      setApiResponse(data.data);
      
    } catch (err) {
      console.error('Error calling API:', err);
      setError(err.message || 'Failed to fetch data');
    } finally {
      setIsLoading(false);
    }
  };

  const resetScanner = () => {
    setApiResponse(null);
    setError(null);
    setScanActive(true);
  };

  // Theme colors
  const bgColor = darkMode ? "bg-gray-900" : "bg-[#e6f7ef]";
  const cardBgColor = darkMode ? "bg-gray-800" : "bg-white";
  const textColor = darkMode ? "text-white" : "text-gray-900";
  const secondaryTextColor = darkMode ? "text-gray-400" : "text-gray-500";
  const borderColor = darkMode ? "border-gray-700" : "border-gray-100";
  const scannerBgColor = darkMode ? "bg-gray-700" : "bg-[#e6f7ef]";
  const footerBgColor = darkMode ? "bg-gray-800" : "bg-gray-800";
  const footerTextColor = darkMode ? "text-gray-300" : "text-gray-300";

  return (
    <div className={`flex flex-col min-h-screen ${bgColor}`}>
      {/* Header */}
      <header className={`bg-[#00bf60] text-white p-4 shadow-md`}>
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center">
            <div className="mr-3 bg-white p-2 rounded-full">
              <HeartPulse className="text-[#00bf60]" size={20} />
            </div>
            <h1 className="text-xl font-bold">Medical QR Scanner</h1>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 bg-white px-3 py-1 rounded-full text-sm font-medium text-[#00bf60]">
              <User size={14} />
              <span>Doctor Mode</span>
            </div>
          </div>
        </div>
      </header>
      
      <main className="flex-1 mx-auto w-full p-4 bg-[#e6f7ef]">
        {/* Scanner Container - UPDATED WITH SMALLER SIZE */}
        <div className={`${cardBgColor} rounded-lg shadow-md overflow-hidden mb-6 border ${borderColor} max-w-md mx-auto`}>
          <div className={`p-3 ${scannerBgColor} border-b ${borderColor}`}>
            <h2 className={`font-bold text-[#00bf60] flex items-center text-sm`}>
              <Camera size={16} className="mr-2" />
              {scanActive ? 'Scan Patient QR Code' : 'Patient Data Loaded'}
            </h2>
          </div>
          
          {scanActive ? (
            <div className="relative">
              <div className="aspect-square max-h-40 w-full overflow-hidden">
                <Scanner 
                  onScan={handleScan}
                  scanDelay={500}
                  constraints={{ facingMode: "environment" }}
                />
              </div>
              <div className="absolute inset-0 pointer-events-none border-2 border-[#00bf60] border-dashed opacity-70 m-4 rounded"></div>
            </div>
          ) : (
            <div className={`aspect-square max-h-40 w-full ${darkMode ? "bg-gray-700" : "bg-gray-100"} flex items-center justify-center`}>
              <button 
                onClick={resetScanner}
                className="bg-[#00bf60] text-white py-1 px-3 rounded-md hover:bg-[#00a050] transition-colors flex items-center gap-2 text-sm"
              >
                <RefreshCw size={14} />
                Scan New Code
              </button>
            </div>
          )}
        </div>
        
        {/* Status/Results Container */}
        <div className="space-y-4 max-w-2xl mx-auto">
          {/* Loading State */}
          {isLoading && (
            <div className={`${cardBgColor} p-4 rounded-lg shadow-md flex items-center border ${borderColor}`}>
              <Loader size={20} className="text-[#00bf60] animate-spin mr-3" />
              <p className={`${textColor} text-sm`}>Authenticating and retrieving patient data...</p>
            </div>
          )}
          
          {/* Error Message */}
          {error && (
            <div className={`${darkMode ? "bg-red-900 bg-opacity-20" : "bg-red-50"} p-4 rounded-lg shadow-md border-l-4 border-red-500`}>
              <div className="flex items-start">
                <AlertCircle size={20} className="text-red-500 mr-3 mt-0.5" />
                <div>
                  <h3 className={`font-bold text-sm ${darkMode ? "text-red-400" : "text-red-700"}`}>Authentication Error</h3>
                  <p className={`text-xs ${darkMode ? "text-red-300" : "text-red-600"}`}>{error}</p>
                </div>
              </div>
            </div>
          )}
          
          {/* User Data */}
          {apiResponse && !isLoading && !error && (
            <UserData data={apiResponse} onReset={resetScanner} darkMode={darkMode} />
          )}
        </div>
      </main>
      
      <footer className={`${footerBgColor} ${footerTextColor} py-3 text-center text-sm mt-6`}>
        Secure Medical QR Scanner • © {new Date().getFullYear()} • All rights reserved
      </footer>
    </div>
  );
}

export default QRCodeReader;