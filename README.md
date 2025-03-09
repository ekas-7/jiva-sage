  <div align="center">
  <img src="./assets/images/logo.png" alt="Jiva Logo" width="500"/>
  <h3>Your Health Story All in One Place</h3>

</div>

## 📋 Overview

**Jiva** is an advanced healthcare tracking system designed to streamline your medical journey. Our comprehensive platform connects patients with healthcare providers through an intuitive interface that centralizes all your health information in one secure place.

### 🌟 Key Features

- **Continuous Health Monitoring** - Track vital signs and health metrics in real-time
- **Detailed Health Reports** - Visualize your health data with comprehensive analytics
- **Instant Medical History Access** - Share your complete medical history with doctors via a single QR code
- **Medication Management** - Keep track of prescriptions and medication schedules
- **Prescription History** - Access your complete prescription history at any time
- **SOS Support** - Emergency assistance with one-touch calling feature

## 🏗️ System Architecture

Jiva consists of several interconnected components:

- **Frontend (Web)** - Responsive Vite application for patients
- **Doctor Portal** - Specialized Vite interface for healthcare providers
- **Mobile Application** - Flutter-based mobile app for on-the-go access
- **Backend Services** - Node.js backend with REST API
- **ML Pipeline** - FastAPI services for OCR and medical data summarization

## 🚀 Getting Started

### Prerequisites

- Node.js (v16+)
- Flutter (v3.0+)
- Python (v3.8+)
- MongoDB
- Redis

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/itzzGaurav7/jiva-sage.git
   cd jiva-sage
   ```

2. Setup Backend:
   ```bash
   cd Backend
   npm install
   npm start
   ```

3. Setup Frontend:
   ```bash
   cd Frontend
   npm install
   npm run dev
   ```

4. Setup Doctor Portal:
   ```bash
   cd Doctor
   npm install
   npm run dev
   ```

5. Setup Mobile App:
   ```bash
   cd Jiva
   flutter pub get
   flutter run
   ```

6. Setup ML Services:
   ```bash
   cd fastapi
   pip install -r requirements.txt
   uvicorn main:app --reload
   ```

7. Setup Data Summarizer:
   ```bash
   cd data-summarizer
   pip install -r requirements.txt
   python server.py
   ```

## 💻 Usage

### Patient Interface
Access the patient portal through your browser at `http://localhost:3000` or download the Jiva mobile app for on-the-go health tracking.

### Doctor Interface
Healthcare providers can access the specialized portal at `http://localhost:3001` where they can review patient histories, prescribe medications, and analyze health trends.

### QR Code Sharing
Generate a secure QR code from your profile section to instantly share your medical history with healthcare providers.

## 🔍 Core Components

### Frontend
The patient web interface built with Vite provides a responsive dashboard with health metrics visualization, medication reminders, and appointment scheduling.

### Doctor Portal
A specialized interface for healthcare providers with patient history viewer, prescription tools, and health trend analysis.

### Mobile Application
The Flutter-based mobile app offers all the features of the web interface with added mobility and push notifications.

### Backend Services
Node.js backend handling user authentication, data storage, and API services for both web and mobile clients.

### ML Components
- **OCR Service**: Extracts text from medical documents and prescriptions
- **Data Summarizer**: Processes and summarizes complex medical data for easier interpretation

## 🔒 Security Features

- End-to-end encryption for all health data
- HIPAA-compliant data storage
- Secure QR code generation with expiration time
- Granular permission controls for data sharing

## 🛣️ Future Scope

- [ ] Integration with wearable health devices
- [ ] Telemedicine video consultation
- [ ] Medical document e-signing
- [ ] Health insurance claim assistance



<div align="center">
  <p>Made with ❤️ by the Jiva</p>
  <p>Electrothon 7.0</p>
</div>
