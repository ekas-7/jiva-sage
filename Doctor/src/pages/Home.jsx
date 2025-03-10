import React, { useState, useRef } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Scanner } from '@yudiel/react-qr-scanner';
import { Camera, AlertCircle, Loader, Heart, RefreshCw, X, Lock } from 'lucide-react';
import { useDoctor } from '@/context/DoctorContext';

import Navbar from '@/components/NavBar';

function Home() {
  const [showScanner, setShowScanner] = useState(false);
  const [showPinVerification, setShowPinVerification] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [scannedQRValue, setScannedQRValue] = useState('');
  const [pin, setPin] = useState(['', '', '', '']);
  const pinInputRefs = [useRef(), useRef(), useRef(), useRef()];
  const navigate = useNavigate();

  const { setUserProfile } = useDoctor();
  const HOST_URI = import.meta.env.VITE_HOST_URI;

  const handleScan = async (result) => {
    if (!result || result.length === 0) return;
    
    const qrValue = result[0].rawValue;
    console.log('QR Code scanned:', qrValue);
    
    // Store QR value and show PIN verification screen
    setScannedQRValue(qrValue);
    setShowScanner(false);
    setShowPinVerification(true);
    
    // Focus the first PIN input automatically
    setTimeout(() => {
      pinInputRefs[0].current?.focus();
    }, 100);
  };

  const handlePinChange = (index, value) => {
    // Only allow digits
    if (!/^\d*$/.test(value)) return;
    
    // Update the PIN array
    const newPin = [...pin];
    newPin[index] = value;
    setPin(newPin);
    
    // Auto-focus next input
    if (value && index < 3) {
      pinInputRefs[index + 1].current?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    // Handle backspace - if current is empty, focus previous
    if (e.key === 'Backspace' && !pin[index] && index > 0) {
      pinInputRefs[index - 1].current?.focus();
    }
  };

  const verifyPin = async () => {
    const fullPin = pin.join('');
    
    // Check if PIN is complete
    if (fullPin.length !== 4) {
      setError('Please enter a 4-digit PIN');
      return;
    }
    
    try {
      setIsLoading(true);
      setError(null);
      console.log("host : ",HOST_URI+'/api/doctor/qr-data');
      const temp = HOST_URI+'/api/doctor/qr-data'
      
      // Make API call with both QR value and PIN
      const res = await axios.post(
        'http://localhost:4000/api/doctor/qr-data', 
        { pin: fullPin }, 
        { 
          headers: { 
            Authorization: scannedQRValue 
          }
        }
      );
      
      console.log('API Response:', res.data);
      
      // If successful, set user profile and navigate
      setUserProfile(res.data.data);
      setShowPinVerification(false);
      navigate('/user-data', { state: { userData: res.data.data } });
      
    } catch (err) {
      console.error('Error calling API:', err);
      setError(err.response?.data?.message || err.message || 'Failed to verify PIN');
    } finally {
      setIsLoading(false);
    }
  };

  const closeOverlay = () => {
    setShowScanner(false);
    setShowPinVerification(false);
    setError(null);
    setPin(['', '', '', '']);
  };

  return (
    <div className="min-h-screen bg-[#e6f7ef]">
      <Navbar />
      
      <div className="max-w-6xl mx-auto p-6">
        <div className="mt-10 text-center">
          <button
            onClick={() => setShowScanner(true)}
            className="bg-gradient-to-r from-[#00bf60] to-[#00a050] hover:from-[#00a050] hover:to-[#00bf60] text-white px-6 py-3 rounded-lg font-medium shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 mx-auto"
          >
            <Camera size={20} />
            Scan Patient QR
          </button>
        </div>
        
        {/* QR Scanner Overlay */}
        {showScanner && (
          <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden max-w-md w-full">
              {/* Header */}
              <div className="bg-[#e6f7ef] p-3 border-b border-gray-100 flex justify-between items-center">
                <h2 className="font-bold text-[#00bf60] flex items-center text-sm">
                  <Camera size={16} className="mr-2" />
                  Scan Patient QR Code
                </h2>
                <button 
                  onClick={closeOverlay}
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
                <div className="absolute inset-0 pointer-events-none border-2 border-[#00bf60] border-dashed opacity-70 m-4 rounded"></div>
              </div>
              
              {/* Status Messages */}
              <div className="p-3">
                {isLoading && (
                  <div className="bg-gray-50 p-3 rounded-md flex items-center">
                    <Loader size={16} className="text-[#00bf60] animate-spin mr-2" />
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
        
        {/* PIN Verification Overlay */}
        {showPinVerification && (
          <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden max-w-md w-full">
              {/* Header */}
              <div className="bg-[#e6f7ef] p-3 border-b border-gray-100 flex justify-between items-center">
                <h2 className="font-bold text-[#00bf60] flex items-center text-sm">
                  <Lock size={16} className="mr-2" />
                  Enter Patient PIN
                </h2>
                <button 
                  onClick={closeOverlay}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={20} />
                </button>
              </div>
              
              {/* PIN Input */}
              <div className="p-6">
                <div className="text-center mb-4">
                  <p className="text-gray-600 text-sm">Please enter the 4-digit PIN to access patient data</p>
                </div>
                
                <div className="flex justify-center gap-3 mb-6">
                  {pin.map((digit, index) => (
                    <input
                      key={index}
                      ref={pinInputRefs[index]}
                      type="password"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handlePinChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      className="w-12 h-12 text-center text-xl font-bold border-2 border-gray-300 rounded-md focus:border-[#00bf60] focus:outline-none"
                    />
                  ))}
                </div>
                
                <button
                  onClick={verifyPin}
                  disabled={isLoading || pin.some(digit => digit === '')}
                  className="w-full bg-gradient-to-r from-[#00bf60] to-[#00a050] hover:from-[#00a050] hover:to-[#00bf60] text-white py-2 px-4 rounded-md font-medium shadow-md transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center">
                      <Loader size={16} className="animate-spin mr-2" />
                      Verifying...
                    </span>
                  ) : (
                    "Access Patient Data"
                  )}
                </button>
              </div>
              
              {/* Error Message */}
              {error && (
                <div className="px-6 pb-4">
                  <div className="bg-red-50 p-3 rounded-md border-l-4 border-red-500">
                    <div className="flex items-start">
                      <AlertCircle size={16} className="text-red-500 mr-2 mt-0.5" />
                      <div>
                        <h3 className="font-bold text-sm text-red-700">Error</h3>
                        <p className="text-xs text-red-600">{error}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;