import React, { useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Scanner } from '@yudiel/react-qr-scanner';
import { Camera, AlertCircle, Loader, Heart, RefreshCw, X } from 'lucide-react';
import { useDoctor } from '@/context/DoctorContext';

import Navbar from '@/components/NavBar';

function Home() {
  const [showScanner, setShowScanner] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const {setUserProfile} = useDoctor();

  const handleScan = async (result) => {
    if (!result || result.length === 0) return;
    
    const qrValue = result[0].rawValue;
    console.log('QR Code scanned:', qrValue);
    
    try {
      setIsLoading(true);
      setError(null);
      
      // Make API call with the QR code value
      const res = await axios.post(
        'http://localhost:4000/api/doctor/qr-data', 
        {}, 
        { 
          headers: { 
            Authorization: qrValue 
          }
        }
      );
      
      console.log('API Response:', res.data);
      
      // If successful, close scanner and redirect
      setUserProfile(res.data.data)
      setShowScanner(false);
      navigate('/user-data', { state: { userData: res.data.data } });
      
    } catch (err) {
      console.error('Error calling API:', err);
      setError(err.message || 'Failed to fetch data');
    } finally {
      setIsLoading(false);
    }
  };

  const closeScanner = () => {
    setShowScanner(false);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-6xl mx-auto p-6">
        <div className="mt-10 text-center">
          <button
            onClick={() => setShowScanner(true)}
            className="bg-gradient-to-r from-[#FF7C8C] to-[#FFB6C1] hover:from-[#FFB6C1] hover:to-[#FF7C8C] text-white px-6 py-3 rounded-lg font-medium shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 mx-auto"
          >
            <Camera size={20} />
            Click Me
          </button>
        </div>
        
        {/* QR Scanner Overlay */}
        {showScanner && (
          <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden max-w-md w-full">
              {/* Header */}
              <div className="bg-[#FFF0F3] p-3 border-b border-gray-100 flex justify-between items-center">
                <h2 className="font-bold text-[#FF7C8C] flex items-center text-sm">
                  <Camera size={16} className="mr-2" />
                  Scan Patient QR Code
                </h2>
                <button 
                  onClick={closeScanner}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={20} />
                </button>
              </div>
              
              {/* Scanner */}
              <div className="relative">
                <div className="aspect-square max-h-60 w-full overflow-hidden">
                  <Scanner 
                    onScan={handleScan}
                    scanDelay={500}
                    constraints={{ facingMode: "environment" }}
                  />
                </div>
                <div className="absolute inset-0 pointer-events-none border-2 border-[#FFB6C1] border-dashed opacity-70 m-4 rounded"></div>
              </div>
              
              {/* Status Messages */}
              <div className="p-3">
                {isLoading && (
                  <div className="bg-gray-50 p-3 rounded-md flex items-center">
                    <Loader size={16} className="text-[#FFB6C1] animate-spin mr-2" />
                    <p className="text-gray-600 text-sm">Processing QR code...</p>
                  </div>
                )}
                
                {error && (
                  <div className="bg-red-50 p-3 rounded-md border-l-4 border-red-500">
                    <div className="flex items-start">
                      <AlertCircle size={16} className="text-red-500 mr-2 mt-0.5" />
                      <div>
                        <h3 className="font-bold text-sm text-red-700">Error</h3>
                        <p className="text-xs text-red-600">{error}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;