import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ClockIcon, DocumentTextIcon, CalendarIcon, UserGroupIcon, BellIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { DashboardLayout } from '../../components/DashboardLayout';
import { AppointmentScheduler } from '../../components/AppointmentScheduler';
import { getPatientAppointments, Appointment } from '../../services/appointmentService';
import { getPatientPrescriptions, getPatientHealthRecords, Prescription, HealthRecord } from '../../services/healthRecordService';
import { useAuth } from '../../contexts/AuthContext';

type StatCardProps = {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  to: string;
};

const StatCard = ({ title, value, icon, to }: StatCardProps) => (
  <Link to={to} className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow">
    <div className="p-5">
      <div className="flex items-center">
        <div className="flex-shrink-0 bg-blue-500 rounded-md p-3">
          {icon}
        </div>
        <div className="ml-5 w-0 flex-1">
          <dl>
            <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
            <dd>
              <div className="text-lg font-medium text-gray-900">{value}</div>
            </dd>
          </dl>
        </div>
      </div>
    </div>
  </Link>
);

export default function PatientDashboard() {
  const { user } = useAuth();
  const [showScheduler, setShowScheduler] = useState(false);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [healthRecords, setHealthRecords] = useState<HealthRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user?.uid) {
      console.log('🚀 PatientDashboard: User authenticated, loading data for:', user.uid);
      loadAllData();
    } else {
      console.log('⏳ PatientDashboard: No user authenticated yet');
      setLoading(false);
      setError(null);
    }
  }, [user]);

  const loadAllData = async () => {
    if (!user?.uid) {
      console.log('⚠️ loadAllData called but no user.uid available');
      return;
    }

    console.log('🚀 loadAllData started for user:', user.uid);
    setLoading(true);
    setError(null);

    try {
      console.log('🔄 Starting parallel data fetch...');
      const [appointmentsData, prescriptionsData, healthRecordsData] = await Promise.all([
        getPatientAppointments(user.uid).catch(err => {
          console.error('❌ Appointments API failed:', err);
          return [];
        }),
        getPatientPrescriptions(user.uid).catch(err => {
          console.error('❌ Prescriptions API failed:', err);
          return [];
        }),
        getPatientHealthRecords(user.uid).catch(err => {
          console.error('❌ Health records API failed:', err);
          return [];
        }),
      ]);

      console.log('✅ Data fetch completed:', {
        appointments: appointmentsData?.length || 0,
        prescriptions: prescriptionsData?.length || 0,
        healthRecords: healthRecordsData?.length || 0
      });

      setAppointments(appointmentsData || []);
      setPrescriptions(prescriptionsData || []);
      setHealthRecords(healthRecordsData || []);
      console.log('✅ State updated successfully');
    } catch (loadError) {
      const errorMessage = loadError instanceof Error ? loadError.message : 'Failed to load patient data';
      console.error('❌ Error in loadAllData:', errorMessage, loadError);
      setError(errorMessage);
    } finally {
      setLoading(false);
      console.log('🏁 loadAllData completed');
    }
  };

  const loadAppointments = async () => {
    if (!user?.uid) return;
    try {
      const data = await getPatientAppointments(user.uid);
      setAppointments(data);
    } catch (error) {
      console.error('Error loading appointments:', error);
    }
  };

  const upcomingAppointments = appointments.filter(apt => {
    const isNotCancelled = apt.status !== 'cancelled';
    const isNotCompleted = apt.status !== 'completed';
    const now = new Date();
    const appointmentDate = new Date(apt.date);
    const isFuture = appointmentDate >= now;
    return isNotCancelled && isNotCompleted && isFuture;
  });

  const readyPrescriptions = prescriptions.filter(p => p.status === 'filled' || p.status === 'refilled');

  const stats = [
    { 
      title: 'Upcoming Appointments', 
      value: upcomingAppointments.length, 
      icon: <CalendarIcon className="h-6 w-6 text-white" />,
      to: '/dashboard/appointments'
    },
    { 
      title: 'Active Medications', 
      value: prescriptions.length,
      icon: <DocumentTextIcon className="h-6 w-6 text-white" />,
      to: '/dashboard/medications'
    },
    { 
      title: 'Ready for Pickup', 
      value: readyPrescriptions.length,
      icon: <ClockIcon className="h-6 w-6 text-white" />,
      to: '/dashboard/prescriptions'
    },
    { 
      title: 'Health Records', 
      value: healthRecords.length,
      icon: <CheckCircleIcon className="h-6 w-6 text-white" />,
      to: '/dashboard/records'
    },
  ];

  console.log('🔄 PatientDashboard render - User:', user, 'Loading:', loading, 'Error:', error);

  if (loading) {
    return (
      <DashboardLayout
        icon="💊"
        title="Welcome back, Patient!"
        subtitle="Manage your medications and health records"
        showAIChat={true}
      >
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your dashboard...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout
        icon="💊"
        title="Welcome back, Patient!"
        subtitle="Manage your medications and health records"
        showAIChat={true}
      >
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h3 className="text-sm font-medium text-red-800">Error Loading Dashboard</h3>
          <p className="mt-2 text-sm text-red-700">{error}</p>
          <button
            onClick={() => loadAllData()}
            className="mt-4 bg-red-100 px-3 py-2 rounded-md text-sm font-medium text-red-800 hover:bg-red-200"
          >
            Try Again
          </button>
        </div>
      </DashboardLayout>
    );
  }

  if (!user) {
    return (
      <DashboardLayout
        icon="💊"
        title="Welcome back, Patient!"
        subtitle="Manage your medications and health records"
        showAIChat={true}
      >
        <div className="text-center py-12">
          <UserGroupIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">Please log in to access your dashboard</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      icon="💊"
      title="Welcome back, Patient!"
      subtitle="Manage your medications and health records"
      showAIChat={true}
    >
      {/* Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Quick Actions</h3>
        </div>
        <div className="px-4 py-5 sm:p-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <button
              type="button"
              onClick={() => setShowScheduler(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
            >
              <ClockIcon className="-ml-1 mr-2 h-5 w-5" />
              Book Appointment
            </button>
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50"
            >
              <DocumentTextIcon className="-ml-1 mr-2 h-5 w-5 text-gray-500" />
              View Prescriptions
            </button>
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50"
            >
              <DocumentTextIcon className="-ml-1 mr-2 h-5 w-5 text-gray-500" />
              View Lab Results
            </button>
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50"
            >
              <BellIcon className="-ml-1 mr-2 h-5 w-5 text-gray-500" />
              Medication Reminders
            </button>
          </div>
        </div>
      </div>

      {/* Upcoming Appointments */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Upcoming Appointments</h3>
        </div>
        <div className="px-4 py-5 sm:p-6">
          {upcomingAppointments.length === 0 ? (
            <div className="text-center py-8">
              <CalendarIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No upcoming appointments</p>
            </div>
          ) : (
            <div className="space-y-4">
              {upcomingAppointments.slice(0, 3).map((appointment) => (
                <div key={appointment.id} className="border-l-4 border-blue-400 pl-4 py-3 bg-blue-50">
                  <h4 className="text-sm font-medium text-gray-900">Dr. {appointment.doctorName}</h4>
                  <p className="text-sm text-gray-600 mt-1">{appointment.date.toLocaleDateString()} at {appointment.time}</p>
                  <p className="text-sm text-gray-500 mt-1">{appointment.type} - {appointment.reason}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Recent Prescriptions */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Recent Prescriptions</h3>
        </div>
        <div className="px-4 py-5 sm:p-6">
          {prescriptions.length === 0 ? (
            <div className="text-center py-8">
              <DocumentTextIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No prescriptions found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {prescriptions.slice(0, 3).map((prescription) => (
                <div key={prescription.id} className="border-l-4 border-green-400 pl-4 py-3 bg-green-50">
                  <h4 className="text-sm font-medium text-gray-900">Dr. {prescription.doctorName}</h4>
                  <p className="text-sm text-gray-600 mt-1">{prescription.date.toLocaleDateString()}</p>
                  <div className="mt-2 space-y-1">
                    {prescription.medications.map((med: any, idx: number) => (
                      <div key={idx} className="text-sm">
                        <span className="font-medium">{med.name}</span> - {med.dosage} • {med.frequency}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {showScheduler && (
        <AppointmentScheduler
          onClose={() => setShowScheduler(false)}
          onSuccess={loadAppointments}
        />
      )}
    </DashboardLayout>
  );
}
