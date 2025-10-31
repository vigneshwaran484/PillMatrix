import { useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { createLabTestOrder } from '../services/healthRecordService';
import { useAuth } from '../contexts/AuthContext';

interface LabTestOrderProps {
  patientId: string;
  patientName: string;
  appointmentId?: string;
  onClose: () => void;
  onSuccess: () => void;
}

const commonLabTests = [
  'Complete Blood Count (CBC)',
  'Basic Metabolic Panel (BMP)',
  'Comprehensive Metabolic Panel (CMP)',
  'Lipid Panel',
  'Thyroid Panel (TSH, T3, T4)',
  'Hemoglobin A1C',
  'Urinalysis',
  'Stool Culture',
  'Blood Culture',
  'Liver Function Tests',
  'Kidney Function Tests',
  'Electrolyte Panel',
  'Coagulation Studies (PT/PTT)',
  'Cardiac Enzymes',
  'Vitamin D',
  'Iron Studies',
  'Hormone Panel',
  'Infectious Disease Screening',
  'Drug Screen',
  'Other (specify below)'
];

export function LabTestOrder({ patientId, patientName, appointmentId, onClose, onSuccess }: LabTestOrderProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [testType, setTestType] = useState('');
  const [customTestType, setCustomTestType] = useState('');
  const [priority, setPriority] = useState<'routine' | 'urgent' | 'stat'>('routine');
  const [instructions, setInstructions] = useState('');
  const [notes, setNotes] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !user.uid) {
      alert('User not authenticated properly');
      return;
    }

    const finalTestType = testType === 'Other (specify below)' ? customTestType : testType;

    if (!finalTestType.trim()) {
      alert('Please specify a test type');
      return;
    }

    setLoading(true);
    try {
      console.log('🧪 Starting lab test order creation process...');
      console.log('👤 Doctor info:', { uid: user.uid, name: user.name });
      console.log('🏥 Patient info:', { id: patientId, name: patientName });
      console.log('🧪 Test info:', { testType: finalTestType, priority, instructions });

      await createLabTestOrder({
        patientId,
        patientName,
        doctorId: user.uid,
        doctorName: user.name || '',
        appointmentId,
        date: new Date(),
        testType: finalTestType,
        priority,
        instructions: instructions.trim() || undefined,
        notes: notes.trim() || undefined,
      });

      console.log('✅ Lab test order creation completed!');
      alert('Lab test order created successfully!');
      onSuccess();
      onClose();
    } catch (error) {
      console.error('❌ Error in lab test order creation process:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      alert(`Failed to create lab test order. Error: ${errorMessage}\n\nPlease check the browser console for more details.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 z-10">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Order Lab Test</h2>
              <p className="text-gray-600 mt-1">Patient: {patientName}</p>
            </div>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Test Type */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Test Type *
            </label>
            <select
              value={testType}
              onChange={(e) => setTestType(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
            >
              <option value="">Select a test type...</option>
              {commonLabTests.map((test) => (
                <option key={test} value={test}>
                  {test}
                </option>
              ))}
            </select>
          </div>

          {/* Custom Test Type */}
          {testType === 'Other (specify below)' && (
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Specify Test Type *
              </label>
              <input
                type="text"
                value={customTestType}
                onChange={(e) => setCustomTestType(e.target.value)}
                required
                placeholder="Enter specific test type..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
              />
            </div>
          )}

          {/* Priority */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Priority *
            </label>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  value="routine"
                  checked={priority === 'routine'}
                  onChange={(e) => setPriority(e.target.value as 'routine' | 'urgent' | 'stat')}
                  className="text-primary focus:ring-primary"
                />
                <span className="ml-2 text-sm text-gray-700">
                  <strong>Routine</strong> - Standard processing time (1-3 days)
                </span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="urgent"
                  checked={priority === 'urgent'}
                  onChange={(e) => setPriority(e.target.value as 'routine' | 'urgent' | 'stat')}
                  className="text-primary focus:ring-primary"
                />
                <span className="ml-2 text-sm text-gray-700">
                  <strong>Urgent</strong> - Expedited processing (same day)
                </span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="stat"
                  checked={priority === 'stat'}
                  onChange={(e) => setPriority(e.target.value as 'routine' | 'urgent' | 'stat')}
                  className="text-primary focus:ring-primary"
                />
                <span className="ml-2 text-sm text-gray-700">
                  <strong>STAT</strong> - Immediate processing (within hours)
                </span>
              </label>
            </div>
          </div>

          {/* Special Instructions */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Special Instructions
            </label>
            <textarea
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              rows={3}
              placeholder="Any special preparation instructions, fasting requirements, or specific test conditions..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none resize-none"
            />
          </div>

          {/* Additional Notes */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Additional Notes
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              placeholder="Any additional clinical context or notes for the lab technician..."
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
              {loading ? 'Ordering...' : 'Order Lab Test'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
