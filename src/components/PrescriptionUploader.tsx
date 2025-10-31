import { useState } from 'react';
import Tesseract from 'tesseract.js';
import { CloudArrowUpIcon, DocumentTextIcon, XMarkIcon, SparklesIcon } from '@heroicons/react/24/outline';
import { createPrescription } from '../services/healthRecordService';
import { useAuth } from '../contexts/AuthContext';

interface PrescriptionUploaderProps {
  patientId: string;
  patientName: string;
  appointmentId?: string;
  onClose: () => void;
  onSuccess: () => void;
}

interface ExtractedMedication {
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
}

// Gemini API key for AI-powered prescription parsing
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

export function PrescriptionUploader({ 
  patientId, 
  patientName, 
  appointmentId,
  onClose, 
  onSuccess 
}: PrescriptionUploaderProps) {
  const { user } = useAuth();
  const [image, setImage] = useState<string | null>(null);
  const [extractedText, setExtractedText] = useState('');
  const [loading, setLoading] = useState(false);
  const [aiProcessing, setAiProcessing] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [medications, setMedications] = useState<ExtractedMedication[]>([]);
  const [diagnosis, setDiagnosis] = useState('');
  const [notes, setNotes] = useState('');

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const parseWithAI = async (text: string) => {
    setAiProcessing(true);
    try {
      console.log('🤖 Starting AI-powered prescription parsing...');
      console.log('📝 Text to parse:', text);
      
      const prompt = `You are a medical prescription parser. Extract structured information from this prescription text.

Prescription Text:
${text}

Extract and return ONLY a valid JSON object with this exact structure (no markdown, no code blocks, just pure JSON):
{
  "medications": [
    {
      "name": "medication name",
      "dosage": "dosage with unit (e.g., 500mg, 10ml)",
      "frequency": "how often (e.g., twice daily, once daily, BD, OD)",
      "duration": "how long (e.g., 7 days, 2 weeks)"
    }
  ],
  "diagnosis": "primary diagnosis or condition",
  "notes": "any additional instructions or notes"
}

Rules:
1. Extract ALL medications mentioned
2. If dosage/frequency/duration is unclear, use "As directed" or "Not specified"
3. Common abbreviations: OD=once daily, BD=twice daily, TD=thrice daily
4. Return ONLY the JSON object, no other text
5. If no diagnosis found, use empty string
6. If no notes found, use empty string`;

      console.log('📡 Calling Gemini API...');
      
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: prompt
              }]
            }],
            generationConfig: {
              temperature: 0.2,
              maxOutputTokens: 2048,
            }
          })
        }
      );

      console.log('📡 API Response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('❌ API Error:', errorData);
        throw new Error(`AI API error: ${response.status} - ${JSON.stringify(errorData)}`);
      }

      const data = await response.json();
      console.log('📦 Full API response:', data);
      
      const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;
      
      if (!aiResponse) {
        console.error('❌ No AI response in data:', data);
        throw new Error('No response from AI');
      }

      console.log('🤖 AI Response:', aiResponse);

      // Clean the response - remove markdown code blocks if present
      let cleanedResponse = aiResponse.trim();
      if (cleanedResponse.startsWith('```json')) {
        cleanedResponse = cleanedResponse.replace(/```json\n?/g, '').replace(/```\n?/g, '');
      } else if (cleanedResponse.startsWith('```')) {
        cleanedResponse = cleanedResponse.replace(/```\n?/g, '');
      }

      console.log('🧹 Cleaned response:', cleanedResponse);

      const parsed = JSON.parse(cleanedResponse);
      
      console.log('✅ AI parsed prescription:', parsed);

      if (parsed.medications && Array.isArray(parsed.medications) && parsed.medications.length > 0) {
        setMedications(parsed.medications);
        console.log(`✅ Extracted ${parsed.medications.length} medications`);
      } else {
        console.warn('⚠️ No medications found, using basic parsing');
        parseMedications(text);
        return;
      }

      if (parsed.diagnosis) {
        setDiagnosis(parsed.diagnosis);
        console.log('✅ Extracted diagnosis:', parsed.diagnosis);
      }

      if (parsed.notes) {
        setNotes(parsed.notes);
        console.log('✅ Extracted notes:', parsed.notes);
      }

      alert('✅ AI successfully parsed the prescription! Please review and edit if needed.');
    } catch (error) {
      console.error('❌ AI parsing failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('Full error:', errorMessage);
      alert(`AI parsing failed: ${errorMessage}\n\nFalling back to basic parsing...`);
      
      // Fallback to basic parsing
      parseMedications(text);
    } finally {
      setAiProcessing(false);
    }
  };

  const handleExtractText = async () => {
    if (!image) {
      alert('Please upload an image first!');
      return;
    }

    setLoading(true);
    setExtractedText('');

    try {
      console.log('🔍 Starting OCR extraction...');
      console.log('📸 Image data length:', image.length);
      
      // Create a worker for better performance
      const worker = await Tesseract.createWorker('eng', 1, {
        logger: (m) => {
          console.log('OCR Status:', m);
          if (m.status === 'recognizing text') {
            console.log(`📊 OCR Progress: ${Math.round(m.progress * 100)}%`);
          }
        },
      });

      console.log('✅ Worker created, starting recognition...');
      
      const { data } = await worker.recognize(image);
      
      console.log('✅ OCR extraction complete!');
      console.log('📦 Full OCR result:', data);
      console.log('📝 Extracted text:', data?.text);
      console.log('📊 Confidence:', data?.confidence);
      
      await worker.terminate();
      
      if (!data || !data.text || data.text.trim().length === 0) {
        console.warn('⚠️ No text extracted from OCR');
        alert('No text could be extracted from the image. Please ensure the image is clear and contains readable text.');
        return;
      }

      setExtractedText(data.text);

      // Use AI to parse the extracted text intelligently
      await parseWithAI(data.text);
    } catch (error) {
      console.error('❌ OCR extraction failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      alert(`Failed to extract text: ${errorMessage}\n\nPlease try:\n- Using a clearer image\n- Better lighting\n- Higher resolution\n- Refreshing the page`);
    } finally {
      setLoading(false);
    }
  };

  const parseMedications = (text: string) => {
    console.log('🔍 Starting advanced medication parsing...');
    const lines = text.split('\n').filter(line => line.trim());
    const parsedMeds: ExtractedMedication[] = [];
    let extractedDiagnosis = '';
    let extractedNotes = '';

    // Enhanced medication keywords
    const medKeywords = ['mg', 'ml', 'mcg', 'g', 'tablet', 'tab', 'cap', 'capsule', 'syrup', 'syr', 'injection', 'inj', 'drops', 'cream', 'ointment'];
    
    // Frequency patterns with expansions
    const frequencyPatterns = {
      'od': 'Once daily',
      'bd': 'Twice daily',
      'td': 'Thrice daily',
      'tds': 'Thrice daily',
      'qid': 'Four times daily',
      'prn': 'As needed',
      'sos': 'As needed',
      'stat': 'Immediately',
      'hs': 'At bedtime',
      'ac': 'Before meals',
      'pc': 'After meals',
      'daily': 'Once daily',
      'twice': 'Twice daily',
      'thrice': 'Thrice daily',
      'morning': 'In the morning',
      'evening': 'In the evening',
      'night': 'At night',
      'noon': 'At noon',
      '1-0-0': 'Once daily (morning)',
      '0-1-0': 'Once daily (noon)',
      '0-0-1': 'Once daily (night)',
      '1-0-1': 'Twice daily (morning & night)',
      '1-1-1': 'Thrice daily',
      '0-1-1': 'Twice daily (noon & night)',
      '1-1-0': 'Twice daily (morning & noon)'
    };

    // Duration patterns
    const durationPatterns = [
      /(\d+)\s*\/\s*7/i,  // "7/7" format
      /(\d+)\s*\/\s*52/i, // "2/52" format (weeks)
      /x\s*(\d+)\s*(day|days|d)/i,
      /for\s*(\d+)\s*(day|days|d)/i,
      /(\d+)\s*(day|days|d)/i,
      /(\d+)\s*(week|weeks|wk|w)/i,
      /(\d+)\s*(month|months|mon|m)/i
    ];

    // Diagnosis keywords
    const diagnosisKeywords = ['diagnosis', 'dx', 'impression', 'condition'];
    
    // Notes keywords
    const notesKeywords = ['note', 'instruction', 'advice', 'caution', 'warning'];

    lines.forEach((line, index) => {
      const lowerLine = line.toLowerCase();
      const trimmedLine = line.trim();

      // Check for diagnosis
      diagnosisKeywords.forEach(keyword => {
        if (lowerLine.includes(keyword + ':') || lowerLine.startsWith(keyword)) {
          const diagText = trimmedLine.split(':')[1] || lines[index + 1] || '';
          if (diagText.trim()) {
            extractedDiagnosis = diagText.trim();
            console.log('📋 Found diagnosis:', extractedDiagnosis);
          }
        }
      });

      // Check for notes/instructions
      notesKeywords.forEach(keyword => {
        if (lowerLine.includes(keyword)) {
          const noteText = trimmedLine.split(':')[1] || '';
          if (noteText.trim()) {
            extractedNotes += (extractedNotes ? ' ' : '') + noteText.trim();
          }
        }
      });

      // Skip lines that are clearly not medications
      if (lowerLine.includes('rx') || 
          lowerLine.includes('prescription') ||
          lowerLine.includes('doctor') ||
          lowerLine.includes('patient') ||
          lowerLine.includes('date') ||
          diagnosisKeywords.some(k => lowerLine.includes(k)) ||
          trimmedLine.length < 5) {
        return;
      }

      // Check if line contains medication-related keywords
      const hasMedKeyword = medKeywords.some(keyword => lowerLine.includes(keyword));
      
      if (hasMedKeyword || /\d+\s*(mg|ml|mcg|g)/i.test(trimmedLine)) {
        // Extract medication name - improved logic
        let medName = '';
        
        // Remove common prefixes
        let cleanLine = trimmedLine
          .replace(/^\d+[\.\)]\s*/i, '') // Remove numbering
          .replace(/^(tab|cap|syr|inj)\.?\s*/i, '') // Remove tablet/capsule prefix
          .trim();

        // Extract name (first 1-3 words before dosage)
        const nameMatch = cleanLine.match(/^([a-zA-Z\s]+?)(?=\s*\d+\s*(mg|ml|mcg|g))/i);
        if (nameMatch) {
          medName = nameMatch[1].trim();
        } else {
          // Fallback: take first 2 words
          const words = cleanLine.split(/\s+/);
          medName = words.slice(0, Math.min(2, words.length)).join(' ');
        }

        // Extract dosage - improved patterns
        const dosagePatterns = [
          /(\d+\.?\d*\s*mg)/i,
          /(\d+\.?\d*\s*ml)/i,
          /(\d+\.?\d*\s*mcg)/i,
          /(\d+\.?\d*\s*g)/i,
          /(\d+\.?\d*\s*mg\s*\/\s*\d+\.?\d*\s*ml)/i, // "250mg/5ml" format
        ];
        
        let dosage = '';
        for (const pattern of dosagePatterns) {
          const match = trimmedLine.match(pattern);
          if (match) {
            dosage = match[1].trim();
            break;
          }
        }

        // Extract frequency - check all patterns
        let frequency = 'As directed';
        for (const [pattern, expansion] of Object.entries(frequencyPatterns)) {
          const regex = new RegExp(`\\b${pattern}\\b`, 'i');
          if (regex.test(lowerLine)) {
            frequency = expansion;
            break;
          }
        }

        // Extract duration - check all patterns
        let duration = '7 days';
        for (const pattern of durationPatterns) {
          const match = trimmedLine.match(pattern);
          if (match) {
            if (pattern.source.includes('/7')) {
              duration = `${match[1]} days`;
            } else if (pattern.source.includes('/52')) {
              duration = `${match[1]} weeks`;
            } else if (match[2]) {
              duration = `${match[1]} ${match[2].toLowerCase()}`;
            }
            break;
          }
        }

        // Only add if we have at least a name and dosage
        if (medName && dosage) {
          parsedMeds.push({
            name: medName,
            dosage: dosage,
            frequency: frequency,
            duration: duration
          });
          console.log(`✅ Parsed medication: ${medName} ${dosage} - ${frequency} for ${duration}`);
        }
      }
    });

    // Set extracted data
    if (parsedMeds.length > 0) {
      setMedications(parsedMeds);
      console.log(`✅ Successfully parsed ${parsedMeds.length} medications`);
    } else {
      console.warn('⚠️ No medications found, adding empty form');
      setMedications([{
        name: '',
        dosage: '',
        frequency: '',
        duration: ''
      }]);
    }

    if (extractedDiagnosis) {
      setDiagnosis(extractedDiagnosis);
    }

    if (extractedNotes) {
      setNotes(extractedNotes);
    }
  };

  const handleAddMedication = () => {
    setMedications([...medications, {
      name: '',
      dosage: '',
      frequency: '',
      duration: ''
    }]);
  };

  const handleRemoveMedication = (index: number) => {
    setMedications(medications.filter((_, i) => i !== index));
  };

  const handleMedicationChange = (index: number, field: keyof ExtractedMedication, value: string) => {
    const updated = [...medications];
    updated[index][field] = value;
    setMedications(updated);
  };

  const handleSavePrescription = async () => {
    if (!user) {
      alert('You must be logged in to save prescriptions');
      return;
    }

    if (!user.uid) {
      alert('User ID is missing. Please try logging out and back in.');
      return;
    }

    if (medications.length === 0 || !medications[0].name) {
      alert('Please add at least one medication');
      return;
    }

    if (!diagnosis) {
      alert('Please enter a diagnosis');
      return;
    }

    setProcessing(true);

    try {
      await createPrescription({
        patientId,
        patientName,
        doctorId: user.uid,
        doctorName: user.name || 'Unknown Doctor',
        appointmentId,
        date: new Date(),
        medications: medications.map(med => ({
          name: med.name,
          dosage: med.dosage,
          frequency: med.frequency,
          duration: med.duration,
          instructions: 'Take as prescribed'
        })),
        diagnosis,
        notes: notes || `Prescription digitized from uploaded image. Original text: ${extractedText.substring(0, 200)}...`,
      });

      alert('✅ Prescription saved successfully!');
      onSuccess();
      onClose();
    } catch (error) {
      console.error('❌ Error saving prescription:', error);
      alert('Failed to save prescription. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-full max-w-4xl shadow-lg rounded-md bg-white">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">
            Upload & Digitize Prescription
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded">
          <p className="text-sm text-blue-800">
            <strong>Patient:</strong> {patientName}
          </p>
        </div>

        {/* Upload Section */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Upload Prescription Image
          </label>
          <div className="flex items-center justify-center w-full">
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <CloudArrowUpIcon className="w-10 h-10 mb-3 text-gray-400" />
                <p className="mb-2 text-sm text-gray-500">
                  <span className="font-semibold">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-gray-500">PNG, JPG, JPEG (MAX. 10MB)</p>
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* Image Preview */}
        {image && (
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Uploaded Image
            </label>
            <div className="border rounded-lg p-2 bg-gray-50">
              <img src={image} alt="Prescription" className="max-h-64 mx-auto rounded" />
            </div>
            <button
              onClick={handleExtractText}
              disabled={loading || aiProcessing}
              className="mt-3 w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Extracting Text...
                </>
              ) : aiProcessing ? (
                <>
                  <SparklesIcon className="h-5 w-5 mr-2 animate-pulse" />
                  AI Processing...
                </>
              ) : (
                <>
                  <SparklesIcon className="h-5 w-5 mr-2" />
                  Extract with AI
                </>
              )}
            </button>
          </div>
        )}

        {/* Extracted Text */}
        {extractedText && (
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Extracted Text (Raw)
            </label>
            <textarea
              value={extractedText}
              readOnly
              className="w-full h-24 px-3 py-2 text-sm border border-gray-300 rounded-md bg-gray-50"
              placeholder="Extracted text will appear here..."
            />
          </div>
        )}

        {/* Medications */}
        {medications.length > 0 && (
          <div className="mb-6">
            <div className="flex justify-between items-center mb-3">
              <label className="block text-sm font-medium text-gray-700">
                Medications (Edit & Verify)
              </label>
              <button
                onClick={handleAddMedication}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                + Add Medication
              </button>
            </div>

            <div className="space-y-3">
              {medications.map((med, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-3 bg-gray-50">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-sm font-medium text-gray-700">Medication {index + 1}</span>
                    {medications.length > 1 && (
                      <button
                        onClick={() => handleRemoveMedication(index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <XMarkIcon className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="Medication Name"
                      value={med.name}
                      onChange={(e) => handleMedicationChange(index, 'name', e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                    />
                    <input
                      type="text"
                      placeholder="Dosage (e.g., 500mg)"
                      value={med.dosage}
                      onChange={(e) => handleMedicationChange(index, 'dosage', e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                    />
                    <input
                      type="text"
                      placeholder="Frequency (e.g., Twice daily)"
                      value={med.frequency}
                      onChange={(e) => handleMedicationChange(index, 'frequency', e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                    />
                    <input
                      type="text"
                      placeholder="Duration (e.g., 7 days)"
                      value={med.duration}
                      onChange={(e) => handleMedicationChange(index, 'duration', e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Diagnosis */}
        {medications.length > 0 && (
          <>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Diagnosis *
              </label>
              <input
                type="text"
                value={diagnosis}
                onChange={(e) => setDiagnosis(e.target.value)}
                placeholder="Enter diagnosis"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Additional Notes
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any additional notes or instructions..."
                className="w-full h-20 px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
          </>
        )}

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          {medications.length > 0 && (
            <button
              onClick={handleSavePrescription}
              disabled={processing}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 disabled:opacity-50"
            >
              {processing ? 'Saving...' : 'Save Prescription'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
