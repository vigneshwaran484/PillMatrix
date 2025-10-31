import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  query, 
  where, 
  orderBy,
  Timestamp,
  onSnapshot,
  updateDoc,
  limit
} from 'firebase/firestore';
import { db } from '../config/firebase';

export interface HealthRecord {
  id?: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  date: Date;
  type: 'consultation' | 'lab-result' | 'prescription' | 'diagnosis' | 'vaccination';
  diagnosis?: string;
  symptoms?: string;
  vitalSigns?: {
    bloodPressure?: string;
    heartRate?: number;
    temperature?: number;
    weight?: number;
    height?: number;
  };
  labResults?: string;
  notes?: string;
  createdAt: Date;
}

export interface Prescription {
  id?: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  pharmacistId?: string;
  pharmacistName?: string;
  appointmentId?: string;
  date: Date;
  medications: Array<{
    name: string;
    dosage: string;
    frequency: string;
    duration: string;
    instructions?: string;
  }>;
  diagnosis: string;
  notes?: string;
  status: 'pending' | 'filled' | 'refilled' | 'delivered' | 'cancelled';
  filledAt?: Date;
  deliveredAt?: Date;
  createdAt: Date;
}

export interface LabTest {
  id?: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  appointmentId?: string;
  date: Date;
  testType: string;
  priority: 'routine' | 'urgent' | 'stat';
  instructions?: string;
  status: 'ordered' | 'in_progress' | 'completed' | 'cancelled';
  notes?: string;
  createdAt: Date;
}

export interface Activity {
  id?: string;
  type: 'prescription_created' | 'prescription_filled' | 'prescription_refilled' | 'prescription_delivered' | 'lab_test_ordered' | 'lab_test_completed' | 'appointment_scheduled' | 'appointment_confirmed';
  title: string;
  description: string;
  patientId: string;
  patientName: string;
  actorId: string;
  actorName: string;
  actorRole: 'doctor' | 'pharmacist' | 'lab-technician' | 'patient';
  relatedId?: string;
  relatedType?: 'prescription' | 'lab-test' | 'appointment';
  createdAt: Date;
}

// Create a health record
export const createHealthRecord = async (recordData: Omit<HealthRecord, 'id' | 'createdAt'>): Promise<string> => {
  try {
    console.log('📋 Creating health record with data:', {
      patientId: recordData.patientId,
      patientName: recordData.patientName,
      doctorId: recordData.doctorId,
      doctorName: recordData.doctorName,
      type: recordData.type,
      diagnosis: recordData.diagnosis,
      symptoms: recordData.symptoms,
      vitalSigns: recordData.vitalSigns,
    });

    // Build data object, only including defined fields
    const dataToSave: any = {
      patientId: recordData.patientId,
      patientName: recordData.patientName,
      doctorId: recordData.doctorId,
      doctorName: recordData.doctorName,
      date: Timestamp.fromDate(recordData.date),
      type: recordData.type,
      createdAt: Timestamp.fromDate(new Date()),
    };

    // Only add optional fields if they're defined
    if (recordData.diagnosis) dataToSave.diagnosis = recordData.diagnosis;
    if (recordData.symptoms) dataToSave.symptoms = recordData.symptoms;
    if (recordData.vitalSigns) dataToSave.vitalSigns = recordData.vitalSigns;
    if (recordData.labResults) dataToSave.labResults = recordData.labResults;
    if (recordData.notes) dataToSave.notes = recordData.notes;

    const docRef = await addDoc(collection(db, 'healthRecords'), dataToSave);

    console.log('✅ Health record created successfully with ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('❌ Error creating health record:', error);
    console.error('❌ Error details:', error instanceof Error ? error.message : String(error));
    throw error;
  }
};

// Get health records for a patient (simplified for testing)
export const getPatientHealthRecords = async (patientId: string): Promise<HealthRecord[]> => {
  try {
    console.log('📋 Fetching health records for patient:', patientId);

    // Temporary: Use simple query without ordering
    const q = query(
      collection(db, 'healthRecords'),
      where('patientId', '==', patientId)
      // Removed orderBy temporarily
    );

    console.log('📋 Executing health records query...');
    const querySnapshot = await getDocs(q);
    console.log('📋 Health records query executed, found', querySnapshot.size, 'documents');

    const records: HealthRecord[] = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      console.log('📄 Processing health record:', doc.id, data);
      
      // Safely convert dates
      let date: Date;
      let createdAt: Date;
      
      try {
        date = data.date?.toDate ? data.date.toDate() : new Date(data.date);
      } catch (e) {
        console.warn('⚠️ Could not convert date, using current date:', data.date);
        date = new Date();
      }
      
      try {
        createdAt = data.createdAt?.toDate ? data.createdAt.toDate() : new Date(data.createdAt);
      } catch (e) {
        console.warn('⚠️ Could not convert createdAt, using current date:', data.createdAt);
        createdAt = new Date();
      }
      
      records.push({
        id: doc.id,
        ...data,
        date,
        createdAt,
      } as HealthRecord);
    });

    console.log('✅ Loaded health records:', records.length);
    return records;
  } catch (error) {
    console.error('❌ Error fetching health records:', error);
    console.error('❌ Error details:', error instanceof Error ? error.message : String(error));
    throw error;
  }
};

// Create a prescription
export const createPrescription = async (prescriptionData: Omit<Prescription, 'id' | 'createdAt' | 'status'>): Promise<string> => {
  try {
    console.log('💊 Creating prescription with data:', {
      patientId: prescriptionData.patientId,
      patientName: prescriptionData.patientName,
      doctorId: prescriptionData.doctorId,
      doctorName: prescriptionData.doctorName,
      diagnosis: prescriptionData.diagnosis,
      medications: prescriptionData.medications,
    });

    // Filter out undefined appointmentId
    const dataToSave: any = {
      patientId: prescriptionData.patientId,
      patientName: prescriptionData.patientName,
      doctorId: prescriptionData.doctorId,
      doctorName: prescriptionData.doctorName,
      date: Timestamp.fromDate(prescriptionData.date),
      medications: prescriptionData.medications,
      diagnosis: prescriptionData.diagnosis,
      status: 'pending',
      createdAt: Timestamp.fromDate(new Date()),
    };

    // Only add appointmentId if it's defined
    if (prescriptionData.appointmentId) {
      dataToSave.appointmentId = prescriptionData.appointmentId;
    }

    // Only add notes if it's defined
    if (prescriptionData.notes) {
      dataToSave.notes = prescriptionData.notes;
    }

    const docRef = await addDoc(collection(db, 'prescriptions'), dataToSave);

    // Create activity
    await createActivity({
      type: 'prescription_created',
      title: 'Prescription Created',
      description: `Dr. ${prescriptionData.doctorName} prescribed ${prescriptionData.medications.length} medication(s)`,
      patientId: prescriptionData.patientId,
      patientName: prescriptionData.patientName,
      actorId: prescriptionData.doctorId,
      actorName: prescriptionData.doctorName,
      actorRole: 'doctor',
      relatedId: docRef.id,
      relatedType: 'prescription',
    });

    console.log('✅ Prescription created successfully with ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('❌ Error creating prescription:', error);
    console.error('❌ Error details:', error instanceof Error ? error.message : String(error));
    throw error;
  }
};

// Get prescriptions for a patient (simplified for testing)
export const getPatientPrescriptions = async (patientId: string): Promise<Prescription[]> => {
  try {
    console.log('💊 Fetching prescriptions for patient:', patientId);

    // Temporary: Use simple query without ordering
    const q = query(
      collection(db, 'prescriptions'),
      where('patientId', '==', patientId)
      // Removed orderBy temporarily
    );

    console.log('💊 Executing prescriptions query...');
    const querySnapshot = await getDocs(q);
    console.log('💊 Prescriptions query executed, found', querySnapshot.size, 'documents');

    const prescriptions: Prescription[] = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      console.log('📄 Processing prescription:', doc.id, data);
      
      // Safely convert dates
      let date: Date;
      let createdAt: Date;
      
      try {
        date = data.date?.toDate ? data.date.toDate() : new Date(data.date);
      } catch (e) {
        console.warn('⚠️ Could not convert prescription date, using current date:', data.date);
        date = new Date();
      }
      
      try {
        createdAt = data.createdAt?.toDate ? data.createdAt.toDate() : new Date(data.createdAt);
      } catch (e) {
        console.warn('⚠️ Could not convert prescription createdAt, using current date:', data.createdAt);
        createdAt = new Date();
      }
      
      prescriptions.push({
        id: doc.id,
        ...data,
        date,
        createdAt,
      } as Prescription);
    });

    console.log('✅ Loaded prescriptions:', prescriptions.length);
    return prescriptions;
  } catch (error) {
    console.error('❌ Error fetching prescriptions:', error);
    console.error('❌ Error details:', error instanceof Error ? error.message : String(error));
    throw error;
  }
};

// Get prescriptions written by a doctor (simplified for testing)
export const getDoctorPrescriptions = async (doctorId: string): Promise<Prescription[]> => {
  try {
    console.log('👨‍⚕️ Fetching prescriptions for doctor:', doctorId);

    // Temporary: Use simple query without ordering
    const q = query(
      collection(db, 'prescriptions'),
      where('doctorId', '==', doctorId)
      // Removed orderBy temporarily
    );

    console.log('👨‍⚕️ Executing doctor prescriptions query...');
    const querySnapshot = await getDocs(q);
    console.log('👨‍⚕️ Doctor prescriptions query executed, found', querySnapshot.size, 'documents');

    const prescriptions: Prescription[] = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      console.log('📄 Processing doctor prescription:', doc.id, data);
      
      // Safely convert dates
      let date: Date;
      let createdAt: Date;
      
      try {
        date = data.date?.toDate ? data.date.toDate() : new Date(data.date);
      } catch (e) {
        console.warn('⚠️ Could not convert doctor prescription date, using current date:', data.date);
        date = new Date();
      }
      
      try {
        createdAt = data.createdAt?.toDate ? data.createdAt.toDate() : new Date(data.createdAt);
      } catch (e) {
        console.warn('⚠️ Could not convert doctor prescription createdAt, using current date:', data.createdAt);
        createdAt = new Date();
      }
      
      prescriptions.push({
        id: doc.id,
        ...data,
        date,
        createdAt,
      } as Prescription);
    });

    console.log('✅ Loaded doctor prescriptions:', prescriptions.length);
    return prescriptions;
  } catch (error) {
    console.error('❌ Error fetching doctor prescriptions:', error);
    console.error('❌ Error details:', error instanceof Error ? error.message : String(error));
    throw error;
  }
};

// Create a lab test order
export const createLabTestOrder = async (labTestData: Omit<LabTest, 'id' | 'createdAt' | 'status'>): Promise<string> => {
  try {
    console.log('🧪 Creating lab test order with data:', {
      patientId: labTestData.patientId,
      patientName: labTestData.patientName,
      doctorId: labTestData.doctorId,
      doctorName: labTestData.doctorName,
      testType: labTestData.testType,
      priority: labTestData.priority,
    });

    // Build data object, only including defined fields
    const dataToSave: any = {
      patientId: labTestData.patientId,
      patientName: labTestData.patientName,
      doctorId: labTestData.doctorId,
      doctorName: labTestData.doctorName,
      status: 'ordered',
      date: Timestamp.fromDate(labTestData.date),
      testType: labTestData.testType,
      priority: labTestData.priority,
      createdAt: Timestamp.fromDate(new Date()),
    };

    // Only add optional fields if they're defined
    if (labTestData.appointmentId) dataToSave.appointmentId = labTestData.appointmentId;
    if (labTestData.instructions) dataToSave.instructions = labTestData.instructions;
    if (labTestData.notes) dataToSave.notes = labTestData.notes;

    const docRef = await addDoc(collection(db, 'labTests'), dataToSave);

    console.log('✅ Lab test order created successfully with ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('❌ Error creating lab test order:', error);
    console.error('❌ Error details:', error instanceof Error ? error.message : String(error));
    throw error;
  }
};

// Get lab tests for a patient
export const getPatientLabTests = async (patientId: string): Promise<LabTest[]> => {
  try {
    console.log('🧪 Fetching lab tests for patient:', patientId);

    // Temporary: Use simple query without ordering
    const q = query(
      collection(db, 'labTests'),
      where('patientId', '==', patientId)
      // Removed orderBy temporarily
    );

    console.log('🧪 Executing lab tests query...');
    const querySnapshot = await getDocs(q);
    console.log('🧪 Lab tests query executed, found', querySnapshot.size, 'documents');

    const labTests: LabTest[] = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      console.log('📄 Processing lab test:', doc.id, data);

      // Safely convert dates
      let date: Date;
      let createdAt: Date;

      try {
        date = data.date?.toDate ? data.date.toDate() : new Date(data.date);
      } catch (e) {
        console.warn('⚠️ Could not convert lab test date, using current date:', data.date);
        date = new Date();
      }

      try {
        createdAt = data.createdAt?.toDate ? data.createdAt.toDate() : new Date(data.createdAt);
      } catch (e) {
        console.warn('⚠️ Could not convert lab test createdAt, using current date:', data.createdAt);
        createdAt = new Date();
      }

      labTests.push({
        id: doc.id,
        ...data,
        date,
        createdAt,
      } as LabTest);
    });

    console.log('✅ Loaded lab tests:', labTests.length);
    return labTests;
  } catch (error) {
    console.error('❌ Error fetching patient lab tests:', error);
    console.error('❌ Error details:', error instanceof Error ? error.message : String(error));
    throw error;
  }
};

// Get lab tests ordered by a doctor
export const getDoctorLabTests = async (doctorId: string): Promise<LabTest[]> => {
  try {
    console.log('👨‍⚕️ Fetching lab tests for doctor:', doctorId);

    // Temporary: Use simple query without ordering
    const q = query(
      collection(db, 'labTests'),
      where('doctorId', '==', doctorId)
      // Removed orderBy temporarily
    );

    console.log('👨‍⚕️ Executing doctor lab tests query...');
    const querySnapshot = await getDocs(q);
    console.log('👨‍⚕️ Doctor lab tests query executed, found', querySnapshot.size, 'documents');

    const labTests: LabTest[] = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      console.log('📄 Processing doctor lab test:', doc.id, data);

      // Safely convert dates
      let date: Date;
      let createdAt: Date;

      try {
        date = data.date?.toDate ? data.date.toDate() : new Date(data.date);
      } catch (e) {
        console.warn('⚠️ Could not convert doctor lab test date, using current date:', data.date);
        date = new Date();
      }

      try {
        createdAt = data.createdAt?.toDate ? data.createdAt.toDate() : new Date(data.createdAt);
      } catch (e) {
        console.warn('⚠️ Could not convert doctor lab test createdAt, using current date:', data.createdAt);
        createdAt = new Date();
      }

      labTests.push({
        id: doc.id,
        ...data,
        date,
        createdAt,
      } as LabTest);
    });

    console.log('✅ Loaded doctor lab tests:', labTests.length);
    return labTests;
  } catch (error) {
    console.error('❌ Error fetching doctor lab tests:', error);
    console.error('❌ Error details:', error instanceof Error ? error.message : String(error));
    throw error;
  }
};

// Create an activity
export const createActivity = async (activityData: Omit<Activity, 'id' | 'createdAt'>): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, 'activities'), {
      ...activityData,
      createdAt: Timestamp.fromDate(new Date()),
    });
    console.log('✅ Activity created:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('❌ Error creating activity:', error);
    throw error;
  }
};

// Get activities for a patient (real-time)
export const subscribeToPatientActivities = (
  patientId: string,
  callback: (activities: Activity[]) => void
): (() => void) => {
  const q = query(
    collection(db, 'activities'),
    where('patientId', '==', patientId),
    orderBy('createdAt', 'desc'),
    limit(10)
  );

  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    const activities: Activity[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      activities.push({
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(),
      } as Activity);
    });
    callback(activities);
  });

  return unsubscribe;
};

// Update prescription status (for pharmacist)
export const updatePrescriptionStatus = async (
  prescriptionId: string,
  status: Prescription['status'],
  pharmacistId: string,
  pharmacistName: string
): Promise<void> => {
  try {
    const prescriptionRef = doc(db, 'prescriptions', prescriptionId);
    const updateData: any = {
      status,
      pharmacistId,
      pharmacistName,
    };

    if (status === 'filled' || status === 'refilled' || status === 'delivered') {
      if (status === 'delivered') {
        updateData.deliveredAt = Timestamp.fromDate(new Date());
      } else {
        updateData.filledAt = Timestamp.fromDate(new Date());
      }
    }

    await updateDoc(prescriptionRef, updateData);

    // Get prescription data to create activity
    const prescriptionDoc = await getDocs(query(collection(db, 'prescriptions'), where('__name__', '==', prescriptionId)));
    if (!prescriptionDoc.empty) {
      const prescriptionData = prescriptionDoc.docs[0].data();
      
      // Create activity
      await createActivity({
        type: status === 'delivered' ? 'prescription_delivered' : (status === 'refilled' ? 'prescription_refilled' : 'prescription_filled'),
        title: status === 'delivered' ? 'Prescription Delivered to Patient' : (status === 'refilled' ? 'Prescription Refilled' : 'Prescription Filled'),
        description: `${prescriptionData.medications[0]?.name || 'Medication'} - ${status === 'delivered' ? 'Delivered to patient' : (status === 'refilled' ? 'Refill completed' : 'Fill completed')}`,
        patientId: prescriptionData.patientId,
        patientName: prescriptionData.patientName,
        actorId: pharmacistId,
        actorName: pharmacistName,
        actorRole: 'pharmacist',
        relatedId: prescriptionId,
        relatedType: 'prescription',
      });
    }

    console.log('✅ Prescription status updated');
  } catch (error) {
    console.error('❌ Error updating prescription:', error);
    throw error;
  }
};

// Get pending and filled prescriptions for pharmacist (pending to fill, filled to deliver)
export const getPendingPrescriptions = async (): Promise<Prescription[]> => {
  try {
    console.log('🔍 getPendingPrescriptions: Starting query...');

    const q = query(
      collection(db, 'prescriptions'),
      where('status', 'in', ['pending', 'filled', 'refilled'])
      // Removed orderBy for now to avoid indexing issues
    );

    console.log('🔍 getPendingPrescriptions: Executing query...');
    const querySnapshot = await getDocs(q);
    console.log('✅ getPendingPrescriptions: Query executed, found', querySnapshot.size, 'documents');

    const prescriptions: Prescription[] = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      console.log('📄 Processing prescription:', doc.id, data);

      prescriptions.push({
        id: doc.id,
        ...data,
        date: data.date?.toDate ? data.date.toDate() : new Date(),
        filledAt: data.filledAt?.toDate ? data.filledAt.toDate() : undefined,
        deliveredAt: data.deliveredAt?.toDate ? data.deliveredAt.toDate() : undefined,
        createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(),
      } as Prescription);
    });

    // Sort manually since we removed orderBy
    prescriptions.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    console.log('✅ getPendingPrescriptions: Returning', prescriptions.length, 'prescriptions');
    return prescriptions;
  } catch (error) {
    console.error('❌ Error fetching pending prescriptions:', error);
    throw error;
  }
};
