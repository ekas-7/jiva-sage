import React,{useState} from 'react'
import { Scanner } from '@yudiel/react-qr-scanner';

function QRCodeReader() {
  const [scanResult, setScanResult] = useState(null);
  const [scanning, setScanning] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [error, setError] = useState(null);

  const handleScan = async (data) => {
    if (data && !scanResult) {
      setScanResult(data);
      setScanning(false);

      try {
        // Send the QR data to your backend to process and send OTP
        const response = await axios.post('/api/scan-qr', {
          qrData: data,
          // Include the current user's ID who is scanning
          scanningUserId: getCurrentUserId() // Implement this function to get current user
        });

        if (response.data.success) {
          setOtpSent(true);
        } else {
          setError(response.data.message || 'Failed to process QR code');
        }
      } catch (err) {
        setError('Error sending OTP. Please try again.');
        console.error(err);
      }
    }
  };

  const handleError = (err) => {
    console.error(err);
    setError('Error accessing camera. Please check permissions.');
  };

  const resetScanner = () => {
    setScanResult(null);
    setOtpSent(false);
    setError(null);
  };

  const startScanning = () => {
    setScanning(true);
    resetScanner();
  };

  return (
    <div className="qr-scanner-container">
      <h2>Scan QR Code</h2>

      {!scanning && !scanResult && (
        <button onClick={startScanning} className="scan-button">
          Start Scanning
        </button>
      )}

      {scanning && (
        <div className="scanner">
          <Scanner
            onResult={(result) => {
              console.log(result);
            }}
            onError={handleError}
            constraints={{ facingMode: 'environment' }}
            style={{ width: '20%' }}
          />
        </div>
      )}

      {error && (
        <div className="error-message">
          <p>{error}</p>
          <button onClick={resetScanner}>Try Again</button>
        </div>
      )}

      {otpSent && (
        <div className="success-message">
          <p>QR code scanned successfully! An OTP has been sent to the owner.</p>
          <button onClick={resetScanner}>Scan Another</button>
        </div>
      )}
    </div>
  );
}

export default QRCodeReader