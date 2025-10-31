# PillMatrix Database Setup Guide

## Overview
PillMatrix now includes a complete database layer with services for all user roles (Patients, Doctors, Pharmacists, Lab Technicians).

## Architecture

### Services Layer
- **patientService.ts** - Patient records, prescriptions, lab reports
- **doctorService.ts** - Doctor profiles, patient search, prescription issuance
- **pharmacistService.ts** - Prescription dispensing, inventory management
- **labService.ts** - Lab reports, sample management, test results

### Data Models

#### Patient
```typescript
{
  id: string;
  userId: string;
  name: string;
  email: string;
  dateOfBirth: string;
  bloodType: string;
  allergies: string[];
  medicalHistory: string[];
  emergencyContact: { name, phone };
  createdAt: Date;
  updatedAt: Date;
}
```

#### Prescription
```typescript
{
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
```

#### Lab Report
```typescript
{
  id: string;
  patientId: string;
  labTechId: string;
  testName: string;
  results: string;
  fileUrl: string;
  uploadedDate: Date;
  createdAt: Date;
}
```

## Current Status

### ✅ Implemented
- Service layer with TypeScript interfaces
- Mock data for development
- Database function signatures
- Data models for all entities

### 🔄 TODO - Firebase Integration
Replace all `TODO` comments in service files with actual Firebase calls:

1. **Authentication**
   ```typescript
   // Use Firebase Auth for user management
   import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
   ```

2. **Firestore Queries**
   ```typescript
   // Replace mock data with Firestore queries
   import { collection, query, where, getDocs, addDoc, updateDoc } from 'firebase/firestore';
   ```

3. **File Storage**
   ```typescript
   // Upload lab reports and files to Firebase Storage
   import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
   ```

## Firebase Setup Instructions

### 1. Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click "Create a new project"
3. Name it "PillMatrix"
4. Enable Google Analytics (optional)

### 2. Enable Services
- **Authentication**: Email/Password
- **Firestore Database**: Start in test mode
- **Cloud Storage**: For lab reports and files

### 3. Get Firebase Config
1. Go to Project Settings
2. Copy the Firebase config
3. Update `src/config/firebase.ts` with your credentials

### 4. Firestore Collections Structure
```
users/
  ├── {userId}
  │   ├── role: 'patient' | 'doctor' | 'pharmacist' | 'lab'
  │   ├── email: string
  │   └── profile: {...}

patients/
  ├── {patientId}
  │   ├── name: string
  │   ├── email: string
  │   ├── bloodType: string
  │   ├── allergies: string[]
  │   └── medicalHistory: string[]

prescriptions/
  ├── {prescriptionId}
  │   ├── patientId: string
  │   ├── doctorId: string
  │   ├── medicationName: string
  │   ├── status: string
  │   └── issuedDate: timestamp

labReports/
  ├── {reportId}
  │   ├── patientId: string
  │   ├── labTechId: string
  │   ├── testName: string
  │   ├── results: string
  │   └── uploadedDate: timestamp

inventory/
  ├── {itemId}
  │   ├── medicationName: string
  │   ├── quantity: number
  │   ├── minThreshold: number
  │   └── expiryDate: timestamp
```

## Usage Examples

### Patient Dashboard
```typescript
import { getPatientPrescriptions, getPatientLabReports } from '@/services/patientService';

// Get patient's prescriptions
const prescriptions = await getPatientPrescriptions(patientId);

// Get patient's lab reports
const reports = await getPatientLabReports(patientId);
```

### Doctor Dashboard
```typescript
import { searchPatientByEmail, issuePrescription } from '@/services/doctorService';

// Search for patient
const patient = await searchPatientByEmail('john@example.com');

// Issue prescription
const rxId = await issuePrescription(doctorId, patientId, prescriptionData);
```

### Pharmacist Dashboard
```typescript
import { getPendingPrescriptions, dispensePrescription, getLowStockItems } from '@/services/pharmacistService';

// Get pending prescriptions
const pending = await getPendingPrescriptions(pharmacistId);

// Dispense prescription
await dispensePrescription(prescriptionId, pharmacistId, quantity);

// Check low stock
const lowStock = await getLowStockItems(pharmacistId);
```

### Lab Technician Dashboard
```typescript
import { uploadLabReport, updateSampleStatus, notifyDoctor } from '@/services/labService';

// Upload lab report
const reportId = await uploadLabReport(labTechId, patientId, reportData);

// Update sample status
await updateSampleStatus(sampleId, 'completed');

// Notify doctor
await notifyDoctor(doctorId, patientId, reportId);
```

## Security Considerations

### Firestore Security Rules
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Patients can only read their own records
    match /patients/{patientId} {
      allow read: if request.auth.uid == resource.data.userId;
      allow write: if request.auth.uid == resource.data.userId;
    }
    
    // Doctors can read patient records they have access to
    match /prescriptions/{prescriptionId} {
      allow read: if request.auth.uid == resource.data.doctorId || 
                     request.auth.uid == resource.data.patientId;
      allow write: if request.auth.uid == resource.data.doctorId;
    }
    
    // Lab techs can upload reports
    match /labReports/{reportId} {
      allow read: if request.auth.uid == resource.data.labTechId ||
                     request.auth.uid == resource.data.patientId;
      allow write: if request.auth.uid == resource.data.labTechId;
    }
  }
}
```

## Next Steps

1. **Set up Firebase project** with the instructions above
2. **Update firebase.ts** with your Firebase credentials
3. **Replace TODO comments** in service files with Firebase calls
4. **Test each service** with real data
5. **Implement real-time listeners** for live updates
6. **Add error handling** and validation
7. **Deploy to production** with proper security rules

## Support

For Firebase documentation:
- [Firebase Docs](https://firebase.google.com/docs)
- [Firestore Guide](https://firebase.google.com/docs/firestore)
- [Firebase Auth](https://firebase.google.com/docs/auth)
- [Cloud Storage](https://firebase.google.com/docs/storage)
