import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Home } from './pages/Home';
import { HowItWorks } from './pages/HowItWorks';
import { Features } from './pages/Features';
import { ForInstitutions } from './pages/ForInstitutions';
import { Security } from './pages/Security';
import { Contact } from './pages/Contact';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import PatientDashboard from './pages/dashboards/PatientDashboard';
import DoctorDashboard from './pages/dashboards/DoctorDashboard';
import PharmacistDashboard from './pages/dashboards/PharmacistDashboard';
import LabTechnicianDashboard from './pages/dashboards/LabTechnicianDashboard';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import PrescriptionUpload from "./pages/PrescriptionUpload";
import { OCRTest } from './components/OCRTest';

function AppContent() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen flex flex-col">
      {!isAuthenticated && <Navbar />}
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/features" element={<Features />} />
          <Route path="/for-institutions" element={<ForInstitutions />} />
          <Route path="/security" element={<Security />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/prescription" element={<PrescriptionUpload />} />
          <Route path="/ocr-test" element={<OCRTest />} />
          <Route 
            path="/dashboard" 
            element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/dashboard/patient" 
            element={isAuthenticated ? <PatientDashboard /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/dashboard/doctor" 
            element={isAuthenticated ? <DoctorDashboard /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/dashboard/pharmacist" 
            element={isAuthenticated ? <PharmacistDashboard /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/dashboard/lab" 
            element={isAuthenticated ? <LabTechnicianDashboard /> : <Navigate to="/login" />} 
          />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;
