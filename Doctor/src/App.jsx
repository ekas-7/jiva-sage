import React, { useEffect } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import QRCodeReader from './pages/QRCodeReader';
import ApiCaller from './pages/ApiCaller';
import UserData from './pages/UserData';
import { useDoctor } from './context/DoctorContext';

function App() {
  const { userProfile } = useDoctor();
  const navigate = useNavigate();

  useEffect(() => {
    if (!userProfile) {
      navigate('/'); // Redirect to home if userProfile is empty
    }
  }, [userProfile, navigate]);

  return (
    <div>
      <Routes>
        <Route path="/" element={<QRCodeReader />} />
        {userProfile && <Route path="/user-data" element={<UserData />} />}
      </Routes>
    </div>
  );
}

export default App;
