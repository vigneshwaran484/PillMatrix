import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { UserGroupIcon, ClockIcon, DocumentTextIcon } from '@heroicons/react/24/outline';
import { DashboardLayout } from '../../components/DashboardLayout';
import { PatientRecordsViewer } from '../../components/PatientRecordsViewer';
import { PrescriptionWriter } from '../../components/PrescriptionWriter';
import { PrescriptionUploader } from '../../components/PrescriptionUploader';
import { LabTestOrder } from '../../components/LabTestOrder';
import { getDoctorAppointments, updateAppointmentStatus, Appointment } from '../../services/appointmentService';
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

export default function DoctorDashboard() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<{ id: string; name: string } | null>(null);
  const [showRecordsViewer, setShowRecordsViewer] = useState(false);
  const [showPrescriptionWriter, setShowPrescriptionWriter] = useState(false);
  const [showPrescriptionUploader, setShowPrescriptionUploader] = useState(false);
  const [showLabTestOrder, setShowLabTestOrder] = useState(false);

  useEffect(() => {
    if (user?.uid) {
      loadAppointments();
    }
  }, [user]);

  const loadAppointments = async () => {
    if (!user?.uid) return;
    console.log('👨‍⚕️ Loading doctor appointments for UID:', user.uid);
    try {
      const data = await getDoctorAppointments(user.uid);
      console.log('📅 Loaded doctor appointments:', data);
      setAppointments(data);
    } catch (error) {
      console.error('Error loading appointments:', error);
    }
  };

  const handleConfirmAppointment = async (appointmentId: string) => {
    try {
      await updateAppointmentStatus(appointmentId, 'confirmed');
      loadAppointments();
    } catch (error) {
      console.error('Error confirming appointment:', error);
    }
  };

  const handleCancelAppointment = async (appointmentId: string) => {
    if (window.confirm('Are you sure you want to cancel this appointment?')) {
      try {
        await updateAppointmentStatus(appointmentId, 'cancelled');
        loadAppointments();
      } catch (error) {
        console.error('Error cancelling appointment:', error);
      }
    }
  };

  const handleViewRecords = (patientId: string, patientName: string) => {
    setSelectedPatient({ id: patientId, name: patientName });
    setShowRecordsViewer(true);
  };

  const handleWritePrescription = () => {
    setShowRecordsViewer(false);
    setShowPrescriptionWriter(true);
  };

  const handleOrderLabTest = () => {
    setShowRecordsViewer(false);
    setShowLabTestOrder(true);
  };

  const todayAppointments = appointments.filter(apt => {
    const today = new Date();
    return apt.date.toDateString() === today.toDateString() && apt.status !== 'cancelled';
  });

  const pendingAppointments = appointments.filter(apt => apt.status === 'pending');

  // Get unique patient count
  const uniquePatients = appointments
    .map(apt => apt.patientId)
    .filter((id, index, self) => self.indexOf(id) === index);

  // Real-time stats from Firebase data
  const stats = [
    { 
      title: 'Today\'s Appointments', 
      value: todayAppointments.length, 
      icon: <ClockIcon className="h-6 w-6 text-white" />,
      to: '/dashboard/appointments'
    },
    { 
      title: 'Active Patients', 
      value: uniquePatients.length, 
      icon: <UserGroupIcon className="h-6 w-6 text-white" />,
      to: '/dashboard/patients'
    },
    { 
      title: 'Pending Appointments', 
      value: pendingAppointments.length, 
      icon: <DocumentTextIcon className="h-6 w-6 text-white" />,
      to: '/dashboard/prescriptions'
    },
    { 
      title: 'Total Appointments', 
      value: appointments.length, 
      icon: <DocumentTextIcon className="h-6 w-6 text-white" />,
      to: '/dashboard/lab-results'
    },
  ];


  return (
    <DashboardLayout
      icon="👨‍⚕️"
      title="Welcome back, Doctor!"
      subtitle="Manage your patients and prescriptions"
      showAIChat={true}
    >
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            Good morning, Dr. {user?.name || 'Doctor'}
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Here's your schedule and updates for today.
          </p>
        </div>

        {/* Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      <div className="space-y-6">
        {/* Upcoming Appointments */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Upcoming Appointments</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">Your schedule for today.</p>
          </div>
          <div className="overflow-x-auto">
            {todayAppointments.length === 0 ? (
              <p className="text-center text-gray-500 py-8">No appointments for today</p>
            ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Patient
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Time
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {todayAppointments.map((appointment) => (
                  <tr key={appointment.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {appointment.patientName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {appointment.time}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                      {appointment.type}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full capitalize ${
                        appointment.status === 'confirmed' ? 'bg-green-100 text-green-800' : 
                        appointment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        appointment.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {appointment.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                      {appointment.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleConfirmAppointment(appointment.id!)}
                            className="text-green-600 hover:text-green-900"
                          >
                            Confirm
                          </button>
                          <button
                            onClick={() => handleCancelAppointment(appointment.id!)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Cancel
                          </button>
                        </>
                      )}
                      {appointment.status === 'confirmed' && (
                        <>
                          <button
                            onClick={() => handleCancelAppointment(appointment.id!)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => {
                              setSelectedPatient({ id: appointment.patientId, name: appointment.patientName });
                              setShowPrescriptionUploader(true);
                            }}
                            className="text-purple-600 hover:text-purple-900"
                          >
                            Upload Rx
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => handleViewRecords(appointment.patientId, appointment.patientName)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        View Records
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            )}
          </div>
          <div className="px-4 py-4 sm:px-6 border-t border-gray-200">
            <Link to="/dashboard/appointments" className="text-sm font-medium text-blue-600 hover:text-blue-500">
              View all appointments
            </Link>
          </div>
        </div>
      </div>

      {/* Patient Records Viewer */}
      {showRecordsViewer && selectedPatient && (
        <PatientRecordsViewer
          patientId={selectedPatient.id}
          patientName={selectedPatient.name}
          onClose={() => {
            setShowRecordsViewer(false);
            setSelectedPatient(null);
          }}
          onWritePrescription={handleWritePrescription}
          onOrderLabTest={handleOrderLabTest}
        />
      )}

      {/* Prescription Writer */}
      {showPrescriptionWriter && selectedPatient && (
        <PrescriptionWriter
          patientId={selectedPatient.id}
          patientName={selectedPatient.name}
          onClose={() => {
            setShowPrescriptionWriter(false);
            setSelectedPatient(null);
          }}
          onSuccess={() => {
            loadAppointments();
          }}
        />
      )}

      {/* Lab Test Order */}
      {showLabTestOrder && selectedPatient && (
        <LabTestOrder
          patientId={selectedPatient.id}
          patientName={selectedPatient.name}
          onClose={() => {
            setShowLabTestOrder(false);
            setSelectedPatient(null);
          }}
          onSuccess={() => {
            loadAppointments();
          }}
        />
      )}

      {/* Prescription Uploader */}
      {showPrescriptionUploader && selectedPatient && (
        <PrescriptionUploader
          patientId={selectedPatient.id}
          patientName={selectedPatient.name}
          onClose={() => {
            setShowPrescriptionUploader(false);
            setSelectedPatient(null);
          }}
          onSuccess={() => {
            loadAppointments();
          }}
        />
      )}
      </div>
    </DashboardLayout>
  );
}
