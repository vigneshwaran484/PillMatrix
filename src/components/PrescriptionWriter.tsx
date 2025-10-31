import { useState } from 'react';
import { XMarkIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import { createPrescription, createHealthRecord } from '../services/healthRecordService';
import { useAuth } from '../contexts/AuthContext';

interface PrescriptionWriterProps {
  patientId: string;
  patientName: string;
  appointmentId?: string;
  onClose: () => void;
  onSuccess: () => void;
}

interface Medication {
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
}

export function PrescriptionWriter({ patientId, patientName, appointmentId, onClose, onSuccess }: PrescriptionWriterProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [diagnosis, setDiagnosis] = useState('');
  const [symptoms, setSymptoms] = useState('');
  const [notes, setNotes] = useState('');
  const [medications, setMedications] = useState<Medication[]>([
    { name: '', dosage: '', frequency: '', duration: '', instructions: '' }
  ]);
  const [vitalSigns, setVitalSigns] = useState({
    bloodPressure: '',
    heartRate: '',
    temperature: '',
    weight: '',
    height: '',
  });

  const addMedication = () => {
    setMedications([...medications, { name: '', dosage: '', frequency: '', duration: '', instructions: '' }]);
  };

  const removeMedication = (index: number) => {
    setMedications(medications.filter((_, i) => i !== index));
  };

  const updateMedication = (index: number, field: keyof Medication, value: string) => {
    const updated = [...medications];
    updated[index][field] = value;
    setMedications(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !user.uid) {
      alert('User not authenticated properly');
      return;
    }

    setLoading(true);
    try {
      console.log('📝 Starting prescription creation process...');
      console.log('👤 Doctor info:', { uid: user.uid, name: user.name });
      console.log('🏥 Patient info:', { id: patientId, name: patientName });
      console.log('💊 Medications to create:', medications.filter(m => m.name.trim() !== ''));
      console.log('🏥 Vital signs:', vitalSigns);

      // Create prescription
      console.log('📄 Creating prescription...');
      await createPrescription({
        patientId,
        patientName,
        doctorId: user.uid,
        doctorName: user.name || '',
        appointmentId,
        date: new Date(),
        medications: medications.filter(m => m.name.trim() !== ''),
        diagnosis,
        notes,
      });

      console.log('📋 Creating health record...');
      // Create health record
      await createHealthRecord({
        patientId,
        patientName,
        doctorId: user.uid,
        doctorName: user.name || '',
        date: new Date(),
        type: 'consultation',
        diagnosis,
        symptoms,
        vitalSigns: {
          bloodPressure: vitalSigns.bloodPressure || undefined,
          heartRate: vitalSigns.heartRate ? parseInt(vitalSigns.heartRate) : undefined,
          temperature: vitalSigns.temperature ? parseFloat(vitalSigns.temperature) : undefined,
          weight: vitalSigns.weight ? parseFloat(vitalSigns.weight) : undefined,
          height: vitalSigns.height ? parseFloat(vitalSigns.height) : undefined,
        },
        notes,
      });

      console.log('✅ Prescription and health record creation completed!');
      alert('Prescription and health record created successfully!');
      onSuccess();
      onClose();
    } catch (error) {
      console.error('❌ Error in prescription creation process:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      alert(`Failed to create prescription. Error: ${errorMessage}\n\nPlease check the browser console for more details.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 z-10">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Write Prescription</h2>
              <p className="text-gray-600 mt-1">Patient: {patientName}</p>
            </div>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Vital Signs */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Vital Signs</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Blood Pressure</label>
                <input
                  type="text"
                  value={vitalSigns.bloodPressure}
                  onChange={(e) => setVitalSigns({ ...vitalSigns, bloodPressure: e.target.value })}
                  placeholder="120/80"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Heart Rate (bpm)</label>
                <input
                  type="number"
                  value={vitalSigns.heartRate}
                  onChange={(e) => setVitalSigns({ ...vitalSigns, heartRate: e.target.value })}
                  placeholder="72"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Temperature (°F)</label>
                <input
                  type="number"
                  step="0.1"
                  value={vitalSigns.temperature}
                  onChange={(e) => setVitalSigns({ ...vitalSigns, temperature: e.target.value })}
                  placeholder="98.6"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Weight (kg)</label>
                <input
                  type="number"
                  step="0.1"
                  value={vitalSigns.weight}
                  onChange={(e) => setVitalSigns({ ...vitalSigns, weight: e.target.value })}
                  placeholder="70"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Height (cm)</label>
                <input
                  type="number"
                  step="0.1"
                  value={vitalSigns.height}
                  onChange={(e) => setVitalSigns({ ...vitalSigns, height: e.target.value })}
                  placeholder="170"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                />
              </div>
            </div>
          </div>

          {/* Symptoms */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">Symptoms</label>
            <textarea
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              rows={3}
              placeholder="Describe patient's symptoms..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none resize-none"
            />
          </div>

          {/* Diagnosis */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">Diagnosis *</label>
            <textarea
              value={diagnosis}
              onChange={(e) => setDiagnosis(e.target.value)}
              required
              rows={3}
              placeholder="Enter diagnosis..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none resize-none"
            />
          </div>

          {/* Medications */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Medications</h3>
              <button
                type="button"
                onClick={addMedication}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-700 transition"
              >
                <PlusIcon className="w-4 h-4" />
                Add Medication
              </button>
            </div>

            <div className="space-y-4">
              {medications.map((med, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="flex items-start justify-between mb-3">
                    <span className="font-semibold text-gray-900">Medication {index + 1}</span>
                    {medications.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeMedication(index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <TrashIcon className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Medicine Name *</label>
                      <input
                        type="text"
                        value={med.name}
                        onChange={(e) => updateMedication(index, 'name', e.target.value)}
                        required
                        placeholder="e.g., Amoxicillin"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Dosage *</label>
                      <input
                        type="text"
                        value={med.dosage}
                        onChange={(e) => updateMedication(index, 'dosage', e.target.value)}
                        required
                        placeholder="e.g., 500mg"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Frequency *</label>
                      <input
                        type="text"
                        value={med.frequency}
                        onChange={(e) => updateMedication(index, 'frequency', e.target.value)}
                        required
                        placeholder="e.g., 3 times daily"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Duration *</label>
                      <input
                        type="text"
                        value={med.duration}
                        onChange={(e) => updateMedication(index, 'duration', e.target.value)}
                        required
                        placeholder="e.g., 7 days"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Instructions</label>
                      <input
                        type="text"
                        value={med.instructions}
                        onChange={(e) => updateMedication(index, 'instructions', e.target.value)}
                        placeholder="e.g., Take with food"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Additional Notes */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">Additional Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              placeholder="Any additional notes or recommendations..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none resize-none"
            />
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-4 pt-4 border-t border-gray-200">
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
              {loading ? 'Saving...' : 'Save Prescription'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
