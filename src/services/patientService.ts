// Patient Service - Database operations for patient records
// This will work with Firebase Firestore

export interface PatientRecord {
  id: string;
  userId: string;
  name: string;
  email: string;
  dateOfBirth: string;
  bloodType: string;
  allergies: string[];
  medicalHistory: string[];
  emergencyContact: {
    name: string;
    phone: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface Prescription {
  id: string;
  patientId: string;
  doctorId: string;
  doctorName: string;
  medicationName: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
  status: 'active' | 'completed' | 'cancelled';
  issuedDate: Date;
  expiryDate: Date;
  createdAt: Date;
}

export interface LabReport {
  id: string;
  patientId: string;
  labTechId: string;
  testName: string;
  results: string;
  fileUrl: string;
  uploadedDate: Date;
  createdAt: Date;
}

export interface MedicationReminder {
  id: string;
  patientId: string;
  prescriptionId: string;
  medicationName: string;
  time: string;
  frequency: string;
  enabled: boolean;
  createdAt: Date;
}

// Mock data for development (will be replaced with Firebase calls)
export const mockPatients: PatientRecord[] = [
  {
    id: 'patient-1',
    userId: 'user-1',
    name: 'John Doe',
    email: 'john@example.com',
    dateOfBirth: '1990-05-15',
    bloodType: 'O+',
    allergies: ['Penicillin', 'Peanuts'],
    medicalHistory: ['Type 2 Diabetes', 'Hypertension'],
    emergencyContact: {
      name: 'Jane Doe',
      phone: '+1-555-0123',
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export const mockPrescriptions: Prescription[] = [
  {
    id: 'rx-1',
    patientId: 'patient-1',
    doctorId: 'doctor-1',
    doctorName: 'Dr. Smith',
    medicationName: 'Metformin',
    dosage: '500mg',
    frequency: 'Twice daily',
    duration: '30 days',
    instructions: 'Take with meals',
    status: 'active',
    issuedDate: new Date(),
    expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    createdAt: new Date(),
  },
];

export const mockLabReports: LabReport[] = [
  {
    id: 'lab-1',
    patientId: 'patient-1',
    labTechId: 'lab-1',
    testName: 'Blood Work',
    results: 'All values within normal range',
    fileUrl: 'https://example.com/blood-work.pdf',
    uploadedDate: new Date(),
    createdAt: new Date(),
  },
];

// These functions will be replaced with actual Firebase calls
export const getPatientRecords = async (patientId: string): Promise<PatientRecord | null> => {
  // TODO: Replace with Firebase query
  return mockPatients.find(p => p.id === patientId) || null;
};

export const getPatientPrescriptions = async (patientId: string): Promise<Prescription[]> => {
  // TODO: Replace with Firebase query
  return mockPrescriptions.filter(p => p.patientId === patientId);
};

export const getPatientLabReports = async (patientId: string): Promise<LabReport[]> => {
  // TODO: Replace with Firebase query
  return mockLabReports.filter(r => r.patientId === patientId);
};

export const addPrescription = async (prescription: Omit<Prescription, 'id' | 'createdAt'>): Promise<string> => {
  // TODO: Replace with Firebase add
  const id = `rx-${Date.now()}`;
  console.log('Adding prescription:', { ...prescription, id });
  return id;
};

export const addLabReport = async (report: Omit<LabReport, 'id' | 'createdAt'>): Promise<string> => {
  // TODO: Replace with Firebase add
  const id = `lab-${Date.now()}`;
  console.log('Adding lab report:', { ...report, id });
  return id;
};

export const updatePrescriptionStatus = async (prescriptionId: string, status: Prescription['status']): Promise<void> => {
  // TODO: Replace with Firebase update
  console.log('Updating prescription status:', prescriptionId, status);
};
