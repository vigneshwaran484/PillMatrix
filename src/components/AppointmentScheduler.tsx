import { useState, useEffect } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { createAppointment, getDoctors } from '../services/appointmentService';
import { useAuth } from '../contexts/AuthContext';

interface AppointmentSchedulerProps {
  onClose: () => void;
  onSuccess: () => void;
}

export function AppointmentScheduler({ onClose, onSuccess }: AppointmentSchedulerProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [doctors, setDoctors] = useState<Array<{ id: string; name: string; email: string }>>([]);
  const [formData, setFormData] = useState({
    doctorId: '',
    date: '',
    time: '',
    type: 'consultation' as const,
    reason: '',
  });

  useEffect(() => {
    loadDoctors();
  }, []);

  const loadDoctors = async () => {
    try {
      const doctorsList = await getDoctors();
      setDoctors(doctorsList);
    } catch (error) {
      console.error('Error loading doctors:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !user.uid) {
      alert('User not authenticated properly');
      return;
    }

    setLoading(true);
    try {
      const selectedDoctor = doctors.find(d => d.id === formData.doctorId);
      if (!selectedDoctor) {
        alert('Please select a doctor');
        return;
      }

      const appointmentDate = new Date(`${formData.date}T${formData.time}`);

      console.log('📅 Creating appointment with data:', {
        patientId: user.uid,
        patientName: user.name,
        doctorId: selectedDoctor.id,
        doctorName: selectedDoctor.name,
        date: appointmentDate,
        time: formData.time,
      });

      const appointmentId = await createAppointment({
        patientId: user.uid,
        patientName: user.name || '',
        patientEmail: user.email || '',
        doctorId: selectedDoctor.id,
        doctorName: selectedDoctor.name,
        date: appointmentDate,
        time: formData.time,
        type: formData.type,
        status: 'pending',
        reason: formData.reason,
      });

      console.log('✅ Appointment created with ID:', appointmentId);
      alert('Appointment scheduled successfully!');
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error scheduling appointment:', error);
      alert('Failed to schedule appointment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full p-8 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Schedule Appointment</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Select Doctor */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Select Doctor
            </label>
            <select
              value={formData.doctorId}
              onChange={(e) => setFormData({ ...formData, doctorId: e.target.value })}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
            >
              <option value="">Choose a doctor...</option>
              {doctors.map((doctor) => (
                <option key={doctor.id} value={doctor.id}>
                  Dr. {doctor.name}
                </option>
              ))}
            </select>
          </div>

          {/* Date */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Appointment Date
            </label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              min={new Date().toISOString().split('T')[0]}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
            />
          </div>

          {/* Time */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Preferred Time
            </label>
            <input
              type="time"
              value={formData.time}
              onChange={(e) => setFormData({ ...formData, time: e.target.value })}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
            />
          </div>

          {/* Appointment Type */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Appointment Type
            </label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
            >
              <option value="consultation">Consultation</option>
              <option value="follow-up">Follow-up</option>
              <option value="emergency">Emergency</option>
              <option value="routine-checkup">Routine Checkup</option>
            </select>
          </div>

          {/* Reason */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Reason for Visit
            </label>
            <textarea
              value={formData.reason}
              onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
              required
              rows={4}
              placeholder="Please describe your symptoms or reason for the appointment..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none resize-none"
            />
          </div>

          {/* Submit Button */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Scheduling...' : 'Schedule Appointment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
