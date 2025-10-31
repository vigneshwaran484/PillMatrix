// Lab Technician Service - Database operations for lab technicians
import type { LabReport } from './patientService';

export interface LabTechProfile {
  id: string;
  userId: string;
  name: string;
  email: string;
  licenseNumber: string;
  laboratory: string;
  phone: string;
  createdAt: Date;
}

export interface LabSample {
  id: string;
  patientId: string;
  patientName: string;
  testType: string;
  sampleType: string;
  collectionDate: Date;
  status: 'collected' | 'processing' | 'completed' | 'cancelled';
  doctorName: string;
  notes: string;
}

export interface LabTestResult {
  id: string;
  sampleId: string;
  testName: string;
  result: string;
  normalRange: string;
  unit: string;
  status: 'normal' | 'abnormal' | 'critical';
}

// Mock data
export const mockLabTechs: LabTechProfile[] = [
  {
    id: 'lab-1',
    userId: 'user-4',
    name: 'Sarah Lab Tech',
    email: 'sarah@lab.com',
    licenseNumber: 'LAB-12345',
    laboratory: 'City Diagnostics',
    phone: '+1-555-0300',
    createdAt: new Date(),
  },
];

export const mockSamples: LabSample[] = [
  {
    id: 'sample-1',
    patientId: 'patient-1',
    patientName: 'John Doe',
    testType: 'Blood Work',
    sampleType: 'Whole Blood',
    collectionDate: new Date(),
    status: 'processing',
    doctorName: 'Dr. Smith',
    notes: 'Fasting sample',
  },
];

// Lab Technician functions
export const getLabTechProfile = async (labTechId: string): Promise<LabTechProfile | null> => {
  // TODO: Replace with Firebase query
  return mockLabTechs.find(l => l.id === labTechId) || null;
};

export const getPendingSamples = async (labTechId: string): Promise<LabSample[]> => {
  // TODO: Replace with Firebase query
  console.log('Getting pending samples for lab tech:', labTechId);
  return mockSamples.filter(s => s.status === 'collected' || s.status === 'processing');
};

export const getPatientByQRCode = async (qrCode: string): Promise<{ id: string; name: string; email: string } | null> => {
  // TODO: Replace with Firebase query
  console.log('Getting patient by QR code:', qrCode);
  return {
    id: 'patient-1',
    name: 'John Doe',
    email: 'john@example.com',
  };
};

export const getPatientByID = async (patientId: string): Promise<{ id: string; name: string; email: string } | null> => {
  // TODO: Replace with Firebase query
  console.log('Getting patient by ID:', patientId);
  return {
    id: patientId,
    name: 'John Doe',
    email: 'john@example.com',
  };
};

export const uploadLabReport = async (
  labTechId: string,
  patientId: string,
  report: Omit<LabReport, 'id' | 'labTechId' | 'patientId' | 'createdAt'>
): Promise<string> => {
  // TODO: Replace with Firebase add
  const id = `lab-${Date.now()}`;
  console.log('Uploading lab report:', {
    id,
    labTechId,
    patientId,
    ...report,
  });
  return id;
};

export const updateSampleStatus = async (
  sampleId: string,
  status: LabSample['status']
): Promise<void> => {
  // TODO: Replace with Firebase update
  console.log('Updating sample status:', sampleId, status);
};

export const addTestResult = async (
  sampleId: string,
  result: Omit<LabTestResult, 'id' | 'sampleId'>
): Promise<string> => {
  // TODO: Replace with Firebase add
  const id = `result-${Date.now()}`;
  console.log('Adding test result:', {
    id,
    sampleId,
    ...result,
  });
  return id;
};

export const getTestResults = async (sampleId: string): Promise<LabTestResult[]> => {
  // TODO: Replace with Firebase query
  console.log('Getting test results for sample:', sampleId);
  return [
    {
      id: 'result-1',
      sampleId,
      testName: 'Glucose',
      result: '95',
      normalRange: '70-100',
      unit: 'mg/dL',
      status: 'normal',
    },
  ];
};

export const notifyDoctor = async (
  doctorId: string,
  patientId: string,
  reportId: string
): Promise<void> => {
  // TODO: Replace with Firebase notification
  console.log('Notifying doctor:', {
    doctorId,
    patientId,
    reportId,
  });
};

export const getCompletedReports = async (labTechId: string): Promise<LabReport[]> => {
  // TODO: Replace with Firebase query
  console.log('Getting completed reports for lab tech:', labTechId);
  return [];
};
