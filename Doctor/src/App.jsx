import React, { useEffect } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import QRCodeReader from './pages/QRCodeReader';
import UserData from './pages/UserData';
import { useDoctor } from './context/DoctorContext';

import Home from './pages/Home.jsx';

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
        <Route path="/qr-code" element={<QRCodeReader />} />
        <Route path="/" element={<Home />} />
        {userProfile && <Route path="/user-data" element={<UserData />} />}
      </Routes>
    </div>
  );
}

export default App;
