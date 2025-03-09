import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import { useUser } from './context/userContext';

import Home from './pages/Home.jsx';
import Auth from './pages/AuthPage.jsx';
import QRCodeData from './pages/QRCodeData';
import Landing from './pages/Landing';
import ReportData from './pages/ReportData';

function App() {
  const { token } = useUser();
  console.log("token:", token);

  return (
    <Routes>
      {/* If not authenticated, only allow access to /auth */}
      {!token ? (
        <>
        <Route path="/landing" element={<Landing />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="*" element={<Navigate to="/auth" replace />} />
        </>
      ) : (
        <>
          {/* Authenticated Routes */}
          <Route path="/*" element={<Landing />} />
          <Route path="/qr-code" element={<QRCodeData />} />
          <Route path="/report" element={<ReportData />} />
          <Route path="*" element={<Navigate to="/" replace />} />
          
        </>
      )}
    </Routes>
  );
}

export default App;
