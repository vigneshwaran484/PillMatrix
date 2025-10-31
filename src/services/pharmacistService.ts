// Pharmacist Service - Database operations for pharmacists
import type { Prescription } from './patientService';

export interface PharmacistProfile {
  id: string;
  userId: string;
  name: string;
  email: string;
  licenseNumber: string;
  pharmacy: string;
  phone: string;
  createdAt: Date;
}

export interface PrescriptionForDispensing {
  id: string;
  patientName: string;
  patientEmail: string;
  medicationName: string;
  dosage: string;
  quantity: number;
  frequency: string;
  doctorName: string;
  status: 'pending' | 'dispensed' | 'cancelled';
  issuedDate: Date;
}

export interface InventoryItem {
  id: string;
  medicationName: string;
  dosage: string;
  quantity: number;
  minThreshold: number;
  expiryDate: Date;
  supplier: string;
}

export interface DrugAlternative {
  originalMedication: string;
  alternativeMedication: string;
  bioEquivalence: number; // 0-100 percentage
  safetyScore: number; // 0-100
  reason: string;
}

// Mock data
export const mockPharmacists: PharmacistProfile[] = [
  {
    id: 'pharmacist-1',
    userId: 'user-3',
    name: 'John Pharmacist',
    email: 'john@pharmacy.com',
    licenseNumber: 'PHARM-12345',
    pharmacy: 'City Pharmacy',
    phone: '+1-555-0200',
    createdAt: new Date(),
  },
];

export const mockInventory: InventoryItem[] = [
  {
    id: 'inv-1',
    medicationName: 'Metformin',
    dosage: '500mg',
    quantity: 150,
    minThreshold: 50,
    expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
    supplier: 'Pharma Supplies Inc',
  },
  {
    id: 'inv-2',
    medicationName: 'Lisinopril',
    dosage: '10mg',
    quantity: 30,
    minThreshold: 50,
    expiryDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000),
    supplier: 'Pharma Supplies Inc',
  },
];

// Pharmacist functions
export const getPharmacistProfile = async (pharmacistId: string): Promise<PharmacistProfile | null> => {
  // TODO: Replace with Firebase query
  return mockPharmacists.find(p => p.id === pharmacistId) || null;
};

export const getPendingPrescriptions = async (pharmacistId: string): Promise<PrescriptionForDispensing[]> => {
  // TODO: Replace with Firebase query
  console.log('Getting pending prescriptions for pharmacist:', pharmacistId);
  return [
    {
      id: 'rx-1',
      patientName: 'John Doe',
      patientEmail: 'john@example.com',
      medicationName: 'Metformin',
      dosage: '500mg',
      quantity: 30,
      frequency: 'Twice daily',
      doctorName: 'Dr. Smith',
      status: 'pending',
      issuedDate: new Date(),
    },
  ];
};

export const dispensePrescription = async (
  prescriptionId: string,
  pharmacistId: string,
  quantity: number
): Promise<void> => {
  // TODO: Replace with Firebase update
  console.log('Dispensing prescription:', {
    prescriptionId,
    pharmacistId,
    quantity,
  });
};

export const getInventory = async (pharmacistId: string): Promise<InventoryItem[]> => {
  // TODO: Replace with Firebase query
  console.log('Getting inventory for pharmacist:', pharmacistId);
  return mockInventory;
};

export const updateInventory = async (itemId: string, quantity: number): Promise<void> => {
  // TODO: Replace with Firebase update
  console.log('Updating inventory:', itemId, quantity);
};

export const getLowStockItems = async (pharmacistId: string): Promise<InventoryItem[]> => {
  // TODO: Replace with Firebase query
  console.log('Getting low stock items for pharmacist:', pharmacistId);
  return mockInventory.filter(item => item.quantity <= item.minThreshold);
};

export const findDrugAlternatives = async (
  medicationName: string,
  dosage: string
): Promise<DrugAlternative[]> => {
  // TODO: Replace with Gemini API call or Firebase query
  console.log('Finding alternatives for:', medicationName, dosage);
  return [
    {
      originalMedication: medicationName,
      alternativeMedication: 'Glipizide',
      bioEquivalence: 95,
      safetyScore: 92,
      reason: 'Similar efficacy, lower cost',
    },
  ];
};

export const checkDrugInteractions = async (medications: string[]): Promise<string[]> => {
  // TODO: Replace with API call
  console.log('Checking interactions for:', medications);
  return [];
};
