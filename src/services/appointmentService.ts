import { 
  collection, 
  addDoc, 
  getDocs, 
  getDoc,
  doc, 
  query, 
  where, 
  orderBy, 
  updateDoc,
  Timestamp 
} from 'firebase/firestore';
import { db } from '../config/firebase';

export interface Appointment {
  id?: string;
  patientId: string;
  patientName: string;
  patientEmail: string;
  doctorId: string;
  doctorName: string;
  date: Date;
  time: string;
  type: 'consultation' | 'follow-up' | 'emergency' | 'routine-checkup';
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  reason: string;
  notes?: string;
  createdAt: Date;
}

// Create a new appointment
export const createAppointment = async (appointmentData: Omit<Appointment, 'id' | 'createdAt'>): Promise<string> => {
  try {
    console.log('📝 Creating appointment with data:', {
      patientId: appointmentData.patientId,
      patientName: appointmentData.patientName,
      doctorId: appointmentData.doctorId,
      doctorName: appointmentData.doctorName,
      date: appointmentData.date,
      time: appointmentData.time,
      type: appointmentData.type,
      status: appointmentData.status,
    });

    const docRef = await addDoc(collection(db, 'appointments'), {
      ...appointmentData,
      date: Timestamp.fromDate(appointmentData.date),
      createdAt: Timestamp.fromDate(new Date()),
    });

    console.log('✅ Appointment created successfully with ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('❌ Error creating appointment:', error);
    console.error('❌ Error details:', error instanceof Error ? error.message : 'Unknown error');
    throw error;
  }
};

// Get appointments for a patient (simplified query for testing)
export const getPatientAppointments = async (patientId: string): Promise<Appointment[]> => {
  try {
    console.log('🔍 Fetching appointments for patient:', patientId);

    // Temporary: Use a simple query without ordering to test basic functionality
    const q = query(
      collection(db, 'appointments'),
      where('patientId', '==', patientId)
      // Removed orderBy temporarily to avoid index requirement
    );

    console.log('🔍 Executing query...');
    const querySnapshot = await getDocs(q);
    console.log('🔍 Query executed, found', querySnapshot.size, 'documents');

    const appointments: Appointment[] = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      console.log('📄 Processing appointment:', doc.id, data);
      
      // Safely convert dates
      let date: Date;
      let createdAt: Date;
      
      try {
        date = data.date?.toDate ? data.date.toDate() : new Date(data.date);
      } catch (e) {
        console.warn('⚠️ Could not convert appointment date, using current date:', data.date);
        date = new Date();
      }
      
      try {
        createdAt = data.createdAt?.toDate ? data.createdAt.toDate() : new Date(data.createdAt);
      } catch (e) {
        console.warn('⚠️ Could not convert appointment createdAt, using current date:', data.createdAt);
        createdAt = new Date();
      }
      
      appointments.push({
        id: doc.id,
        ...data,
        date,
        createdAt,
      } as Appointment);
    });

    console.log('✅ Loaded appointments:', appointments.length);
    return appointments;
  } catch (error) {
    console.error('❌ Error fetching patient appointments:', error);
    console.error('❌ Error details:', error instanceof Error ? error.message : 'Unknown error');
    throw error;
  }
};

// Get appointments for a doctor (simplified query for testing)
export const getDoctorAppointments = async (doctorId: string): Promise<Appointment[]> => {
  try {
    console.log('👨‍⚕️ Fetching appointments for doctor:', doctorId);

    // Temporary: Use a simple query without ordering
    const q = query(
      collection(db, 'appointments'),
      where('doctorId', '==', doctorId)
      // Removed orderBy temporarily
    );

    console.log('👨‍⚕️ Executing doctor query...');
    const querySnapshot = await getDocs(q);
    console.log('👨‍⚕️ Doctor query executed, found', querySnapshot.size, 'documents');

    const appointments: Appointment[] = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      console.log('📄 Processing doctor appointment:', doc.id, data);
      
      // Safely convert dates
      let date: Date;
      let createdAt: Date;
      
      try {
        date = data.date?.toDate ? data.date.toDate() : new Date(data.date);
      } catch (e) {
        console.warn('⚠️ Could not convert doctor appointment date, using current date:', data.date);
        date = new Date();
      }
      
      try {
        createdAt = data.createdAt?.toDate ? data.createdAt.toDate() : new Date(data.createdAt);
      } catch (e) {
        console.warn('⚠️ Could not convert doctor appointment createdAt, using current date:', data.createdAt);
        createdAt = new Date();
      }
      
      appointments.push({
        id: doc.id,
        ...data,
        date,
        createdAt,
      } as Appointment);
    });

    console.log('✅ Loaded doctor appointments:', appointments.length);
    return appointments;
  } catch (error) {
    console.error('❌ Error fetching doctor appointments:', error);
    console.error('❌ Error details:', error instanceof Error ? error.message : 'Unknown error');
    throw error;
  }
};

// Update appointment status
export const updateAppointmentStatus = async (
  appointmentId: string, 
  status: Appointment['status'],
  notes?: string
): Promise<void> => {
  try {
    const appointmentRef = doc(db, 'appointments', appointmentId);
    await updateDoc(appointmentRef, {
      status,
      ...(notes && { notes }),
    });
    console.log('✅ Appointment status updated');
  } catch (error) {
    console.error('❌ Error updating appointment:', error);
    throw error;
  }
};

// Get all doctors (for patient to select)
export const getDoctors = async (): Promise<Array<{ id: string; name: string; email: string }>> => {
  try {
    const q = query(
      collection(db, 'users'),
      where('role', '==', 'doctor')
    );
    const querySnapshot = await getDocs(q);
    const doctors: Array<{ id: string; name: string; email: string }> = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      // Use the document ID as the user UID (this is correct)
      doctors.push({
        id: doc.id, // This is the Firebase UID stored as document ID
        name: data.name,
        email: data.email,
      });
    });
    
    console.log('👨‍⚕️ Found doctors:', doctors);
    return doctors;
  } catch (error) {
    console.error('❌ Error fetching doctors:', error);
    throw error;
  }
};
