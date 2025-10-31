// Doctor Service - Database operations for doctors
import type { Prescription } from './patientService';

export interface DoctorProfile {
  id: string;
  userId: string;
  name: string;
  email: string;
  licenseNumber: string;
  specialization: string;
  hospital: string;
  phone: string;
  createdAt: Date;
}

export interface PatientSearchResult {
  id: string;
  name: string;
  email: string;
  dateOfBirth: string;
  bloodType: string;
  allergies: string[];
}

// Mock data
export const mockDoctors: DoctorProfile[] = [
  {
    id: 'doctor-1',
    userId: 'user-2',
    name: 'Dr. Smith',
    email: 'dr.smith@hospital.com',
    licenseNumber: 'LIC-12345',
    specialization: 'Internal Medicine',
    hospital: 'City Hospital',
    phone: '+1-555-0100',
    createdAt: new Date(),
  },
];

// Doctor functions
export const getDoctorProfile = async (doctorId: string): Promise<DoctorProfile | null> => {
  // TODO: Replace with Firebase query
  return mockDoctors.find(d => d.id === doctorId) || null;
};

export const searchPatientByEmail = async (email: string): Promise<PatientSearchResult | null> => {
  // TODO: Replace with Firebase query
  // This will search for patients by email
  console.log('Searching for patient:', email);
  return {
    id: 'patient-1',
    name: 'John Doe',
    email: email,
    dateOfBirth: '1990-05-15',
    bloodType: 'O+',
    allergies: ['Penicillin'],
  };
};

export const searchPatientByQRCode = async (qrCode: string): Promise<PatientSearchResult | null> => {
  // TODO: Replace with Firebase query
  // This will search for patients by QR code
  console.log('Searching for patient by QR:', qrCode);
  return {
    id: 'patient-1',
    name: 'John Doe',
    email: 'john@example.com',
    dateOfBirth: '1990-05-15',
    bloodType: 'O+',
    allergies: ['Penicillin'],
  };
};

export const issuePrescription = async (
  doctorId: string,
  patientId: string,
  prescription: Omit<Prescription, 'id' | 'doctorId' | 'patientId' | 'createdAt'>
): Promise<string> => {
  // TODO: Replace with Firebase add
  const id = `rx-${Date.now()}`;
  console.log('Issuing prescription:', {
    id,
    doctorId,
    patientId,
    ...prescription,
  });
  return id;
};

export const getDoctorPatients = async (doctorId: string): Promise<PatientSearchResult[]> => {
  // TODO: Replace with Firebase query
  // Get all patients associated with this doctor
  console.log('Getting patients for doctor:', doctorId);
  return [
    {
      id: 'patient-1',
      name: 'John Doe',
      email: 'john@example.com',
      dateOfBirth: '1990-05-15',
      bloodType: 'O+',
      allergies: ['Penicillin'],
    },
    {
      id: 'patient-2',
      name: 'Jane Smith',
      email: 'jane@example.com',
      dateOfBirth: '1985-03-20',
      bloodType: 'A+',
      allergies: [],
    },
  ];
};

export const getDoctorPrescriptions = async (doctorId: string): Promise<Prescription[]> => {
  // TODO: Replace with Firebase query
  // Get all prescriptions issued by this doctor
  console.log('Getting prescriptions for doctor:', doctorId);
  return [];
};
