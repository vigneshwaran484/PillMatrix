import { useState, useEffect } from 'react';
import { Prescription, getPendingPrescriptions, updatePrescriptionStatus } from '../services/healthRecordService';
import { checkMedicationAvailability, calculatePrescriptionQuantity, updateInventoryQuantity } from '../services/inventoryService';
import { useAuth } from '../contexts/AuthContext';
import { CheckCircleIcon } from '@heroicons/react/24/outline';

interface PrescriptionFulfillmentProps {
  onUpdate?: () => void;
}

export function PrescriptionFulfillment({ onUpdate }: PrescriptionFulfillmentProps) {
  const { user } = useAuth();
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    loadPrescriptions();
  }, []);

  const loadPrescriptions = async () => {
    try {
      const data = await getPendingPrescriptions();
      setPrescriptions(data);
    } catch (error) {
      console.error('Error loading prescriptions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFillPrescription = async (prescriptionId: string) => {
    if (!user || !user.name || !user.uid) return;
    
    setProcessingId(prescriptionId);
    try {
      await updatePrescriptionStatus(prescriptionId, 'filled', user.uid, user.name);
      await loadPrescriptions();
      if (onUpdate) onUpdate();
      alert('Prescription filled successfully!');
    } catch (error) {
      console.error('Error filling prescription:', error);
      alert('Failed to fill prescription');
    } finally {
      setProcessingId(null);
    }
  };

  const handleDeliverPrescription = async (prescriptionId: string) => {
    if (!user || !user.name || !user.uid) return;

    setProcessingId(prescriptionId);
    try {
      // Get the prescription details
      const prescription = prescriptions.find(p => p.id === prescriptionId);
      if (!prescription) {
        throw new Error('Prescription not found');
      }

      // Check inventory availability for all medications
      let allMedicationsAvailable = true;
      const insufficientStock: string[] = [];

      for (const med of prescription.medications) {
        const requiredQuantity = calculatePrescriptionQuantity(med.frequency, med.duration);
        const availability = await checkMedicationAvailability(med.name, requiredQuantity);

        if (!availability.available) {
          allMedicationsAvailable = false;
          insufficientStock.push(`${med.name}: ${availability.availableQuantity} available, ${requiredQuantity} needed`);
        }
      }

      if (!allMedicationsAvailable) {
        alert(`Cannot deliver prescription. Insufficient stock:\n${insufficientStock.join('\n')}`);
        return;
      }

      // Deduct stock from inventory for each medication
      for (const med of prescription.medications) {
        const requiredQuantity = calculatePrescriptionQuantity(med.frequency, med.duration);
        const availability = await checkMedicationAvailability(med.name, requiredQuantity);

        if (availability.item) {
          await updateInventoryQuantity(
            availability.item.id!,
            -requiredQuantity,
            'prescription_fulfilled'
          );
        }
      }

      // Update prescription status
      await updatePrescriptionStatus(prescriptionId, 'delivered', user.uid, user.name);
      await loadPrescriptions();
      if (onUpdate) onUpdate();
      alert('Prescription delivered successfully to patient!');
    } catch (error) {
      console.error('Error delivering prescription:', error);
      alert('Failed to mark prescription as delivered');
    } finally {
      setProcessingId(null);
    }
  };

  const handleRefillPrescription = async (prescriptionId: string) => {
    if (!user || !user.name || !user.uid) return;

    setProcessingId(prescriptionId);
    try {
      await updatePrescriptionStatus(prescriptionId, 'refilled', user.uid, user.name);
      await loadPrescriptions();
      if (onUpdate) onUpdate();
      alert('Prescription refilled successfully!');
    } catch (error) {
      console.error('Error refilling prescription:', error);
      alert('Failed to refill prescription');
    } finally {
      setProcessingId(null);
    }
  };

  if (loading) {
    return (
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Pending Prescriptions</h3>
        </div>
        <div className="px-4 py-8 flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
        <h3 className="text-lg leading-6 font-medium text-gray-900">Prescription Management</h3>
        <p className="mt-1 text-sm text-gray-500">Fill prescriptions and deliver medications to patients</p>
      </div>
      <div className="overflow-x-auto">
        {prescriptions.length === 0 ? (
          <p className="text-center text-gray-500 py-8">No prescriptions to process</p>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Patient
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Medications
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Doctor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {prescriptions.map((prescription) => (
                <tr key={prescription.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {prescription.patientName}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    <div className="space-y-1">
                      {prescription.medications.map((med, idx) => (
                        <div key={idx}>
                          <span className="font-medium">{med.name}</span> - {med.dosage}
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    Dr. {prescription.doctorName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      prescription.status === 'delivered' ? 'bg-green-100 text-green-800' :
                      prescription.status === 'filled' || prescription.status === 'refilled' ? 'bg-blue-100 text-blue-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {prescription.status === 'delivered' ? 'Delivered' : prescription.status === 'filled' || prescription.status === 'refilled' ? 'Ready for Pickup' : 'Needs Filling'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    {prescription.status === 'delivered' ? (
                      <span className="text-green-600 font-medium">✓ Delivered</span>
                    ) : prescription.status === 'filled' || prescription.status === 'refilled' ? (
                      <button
                        onClick={() => handleDeliverPrescription(prescription.id!)}
                        disabled={processingId === prescription.id}
                        className="inline-flex items-center text-blue-600 hover:text-blue-900 disabled:opacity-50"
                      >
                        <CheckCircleIcon className="w-5 h-5 mr-1" />
                        {processingId === prescription.id ? 'Delivering...' : 'Deliver'}
                      </button>
                    ) : (
                      <>
                        <button
                          onClick={() => handleFillPrescription(prescription.id!)}
                          disabled={processingId === prescription.id}
                          className="inline-flex items-center text-green-600 hover:text-green-900 disabled:opacity-50"
                        >
                          <CheckCircleIcon className="w-5 h-5 mr-1" />
                          {processingId === prescription.id ? 'Processing...' : 'Fill'}
                        </button>
                        <button
                          onClick={() => handleRefillPrescription(prescription.id!)}
                          disabled={processingId === prescription.id}
                          className="inline-flex items-center text-blue-600 hover:text-blue-900 disabled:opacity-50"
                        >
                          <CheckCircleIcon className="w-5 h-5 mr-1" />
                          Refill
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
