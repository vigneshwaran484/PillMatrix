import { useState, useEffect } from 'react';
import { XMarkIcon, DocumentTextIcon, BeakerIcon } from '@heroicons/react/24/outline';
import { getPatientHealthRecords, getPatientPrescriptions, getPatientLabTests, HealthRecord, Prescription, LabTest } from '../services/healthRecordService';

interface PatientRecordsViewerProps {
  patientId: string;
  patientName: string;
  onClose: () => void;
  onWritePrescription: () => void;
  onOrderLabTest: () => void;
}

export function PatientRecordsViewer({ patientId, patientName, onClose, onWritePrescription, onOrderLabTest }: PatientRecordsViewerProps) {
  const [activeTab, setActiveTab] = useState<'records' | 'prescriptions' | 'lab-tests'>('records');
  const [healthRecords, setHealthRecords] = useState<HealthRecord[]>([]);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [labTests, setLabTests] = useState<LabTest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPatientData();
  }, [patientId]);

  const loadPatientData = async () => {
    setLoading(true);
    try {
      const [records, presc, lab] = await Promise.all([
        getPatientHealthRecords(patientId),
        getPatientPrescriptions(patientId),
        getPatientLabTests(patientId),
      ]);
      setHealthRecords(records);
      setPrescriptions(presc);
      setLabTests(lab);
    } catch (error) {
      console.error('Error loading patient data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Patient Records</h2>
            <p className="text-gray-600 mt-1">{patientName}</p>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 px-6">
          <button
            onClick={() => setActiveTab('records')}
            className={`px-4 py-3 font-semibold border-b-2 transition ${
              activeTab === 'records'
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Health Records
          </button>
          <button
            onClick={() => setActiveTab('prescriptions')}
            className={`px-4 py-3 font-semibold border-b-2 transition ${
              activeTab === 'prescriptions'
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Prescriptions
          </button>
          <button
            onClick={() => setActiveTab('lab-tests')}
            className={`px-4 py-3 font-semibold border-b-2 transition ${
              activeTab === 'lab-tests'
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Lab Tests
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : (
            <>
              {activeTab === 'records' && (
                <div className="space-y-4">
                  {healthRecords.length === 0 ? (
                    <p className="text-center text-gray-500 py-8">No health records found</p>
                  ) : (
                    healthRecords.map((record) => (
                      <div key={record.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <BeakerIcon className="w-5 h-5 text-primary" />
                            <span className="font-semibold text-gray-900 capitalize">{record.type}</span>
                          </div>
                          <span className="text-sm text-gray-600">
                            {record.date.toLocaleDateString()}
                          </span>
                        </div>
                        {record.diagnosis && (
                          <div className="mb-2">
                            <span className="text-sm font-semibold text-gray-700">Diagnosis: </span>
                            <span className="text-sm text-gray-900">{record.diagnosis}</span>
                          </div>
                        )}
                        {record.symptoms && (
                          <div className="mb-2">
                            <span className="text-sm font-semibold text-gray-700">Symptoms: </span>
                            <span className="text-sm text-gray-900">{record.symptoms}</span>
                          </div>
                        )}
                        {record.vitalSigns && (
                          <div className="mb-2">
                            <span className="text-sm font-semibold text-gray-700">Vital Signs: </span>
                            <span className="text-sm text-gray-900">
                              {record.vitalSigns.bloodPressure && `BP: ${record.vitalSigns.bloodPressure} | `}
                              {record.vitalSigns.heartRate && `HR: ${record.vitalSigns.heartRate} bpm | `}
                              {record.vitalSigns.temperature && `Temp: ${record.vitalSigns.temperature}°F`}
                            </span>
                          </div>
                        )}
                        {record.notes && (
                          <div>
                            <span className="text-sm font-semibold text-gray-700">Notes: </span>
                            <span className="text-sm text-gray-900">{record.notes}</span>
                          </div>
                        )}
                        <div className="mt-2 text-xs text-gray-500">
                          By Dr. {record.doctorName}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {activeTab === 'prescriptions' && (
                <div className="space-y-4">
                  {prescriptions.length === 0 ? (
                    <p className="text-center text-gray-500 py-8">No prescriptions found</p>
                  ) : (
                    prescriptions.map((prescription) => (
                      <div key={prescription.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <DocumentTextIcon className="w-5 h-5 text-primary" />
                            <span className="font-semibold text-gray-900">Prescription</span>
                          </div>
                          <span className="text-sm text-gray-600">
                            {prescription.date.toLocaleDateString()}
                          </span>
                        </div>
                        <div className="mb-3">
                          <span className="text-sm font-semibold text-gray-700">Diagnosis: </span>
                          <span className="text-sm text-gray-900">{prescription.diagnosis}</span>
                        </div>
                        <div className="mb-2">
                          <span className="text-sm font-semibold text-gray-700 block mb-2">Medications:</span>
                          <div className="space-y-2">
                            {prescription.medications.map((med, idx) => (
                              <div key={idx} className="bg-white rounded p-3 border border-gray-200">
                                <div className="font-semibold text-gray-900">{med.name}</div>
                                <div className="text-sm text-gray-600 mt-1">
                                  <span className="font-medium">Dosage:</span> {med.dosage} | 
                                  <span className="font-medium"> Frequency:</span> {med.frequency} | 
                                  <span className="font-medium"> Duration:</span> {med.duration}
                                </div>
                                {med.instructions && (
                                  <div className="text-sm text-gray-600 mt-1">
                                    <span className="font-medium">Instructions:</span> {med.instructions}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                        {prescription.notes && (
                          <div className="mt-2">
                            <span className="text-sm font-semibold text-gray-700">Notes: </span>
                            <span className="text-sm text-gray-900">{prescription.notes}</span>
                          </div>
                        )}
                        <div className="mt-2 text-xs text-gray-500">
                          Prescribed by Dr. {prescription.doctorName}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {activeTab === 'lab-tests' && (
                <div className="space-y-4">
                  {labTests.length === 0 ? (
                    <p className="text-center text-gray-500 py-8">No lab tests found</p>
                  ) : (
                    labTests.map((labTest) => (
                      <div key={labTest.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <BeakerIcon className="w-5 h-5 text-primary" />
                            <span className="font-semibold text-gray-900">Lab Test Order</span>
                          </div>
                          <div className="text-right">
                            <span className={`px-2 py-1 text-xs font-semibold rounded-full capitalize ${
                              labTest.status === 'completed' ? 'bg-green-100 text-green-800' :
                              labTest.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800' :
                              labTest.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                              'bg-blue-100 text-blue-800'
                            }`}>
                              {labTest.status.replace('_', ' ')}
                            </span>
                            <div className="text-sm text-gray-600 mt-1">
                              {labTest.date.toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                        <div className="mb-3">
                          <span className="text-sm font-semibold text-gray-700">Test Type: </span>
                          <span className="text-sm text-gray-900">{labTest.testType}</span>
                        </div>
                        <div className="mb-3">
                          <span className="text-sm font-semibold text-gray-700">Priority: </span>
                          <span className={`text-sm font-semibold capitalize ${
                            labTest.priority === 'stat' ? 'text-red-600' :
                            labTest.priority === 'urgent' ? 'text-orange-600' :
                            'text-green-600'
                          }`}>
                            {labTest.priority}
                          </span>
                        </div>
                        {labTest.instructions && (
                          <div className="mb-2">
                            <span className="text-sm font-semibold text-gray-700">Instructions: </span>
                            <span className="text-sm text-gray-900">{labTest.instructions}</span>
                          </div>
                        )}
                        {labTest.notes && (
                          <div className="mt-2">
                            <span className="text-sm font-semibold text-gray-700">Notes: </span>
                            <span className="text-sm text-gray-900">{labTest.notes}</span>
                          </div>
                        )}
                        <div className="mt-2 text-xs text-gray-500">
                          Ordered by Dr. {labTest.doctorName}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="flex gap-4 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition"
          >
            Close
          </button>
          <button
            onClick={() => {
              onOrderLabTest();
              onClose();
            }}
            className="px-6 py-3 bg-orange-600 text-white font-semibold rounded-lg hover:bg-orange-700 transition"
          >
            Order Lab Test
          </button>
          <button
            onClick={() => {
              onWritePrescription();
              onClose();
            }}
            className="px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-blue-700 transition"
          >
            Write Prescription
          </button>
        </div>
      </div>
    </div>
  );
}
