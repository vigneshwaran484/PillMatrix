# Prescription OCR Upload Feature 📸→💊

## Overview
Doctors can now upload images of handwritten prescriptions and automatically convert them to digital prescriptions using OCR (Optical Character Recognition) technology.

## Features

### 1. **Image Upload**
- Drag & drop or click to upload
- Supports PNG, JPG, JPEG formats
- Max file size: 10MB
- Real-time image preview

### 2. **OCR Text Extraction**
- Powered by Tesseract.js
- Extracts text from handwritten/printed prescriptions
- Shows extraction progress
- Displays raw extracted text

### 3. **Smart Medication Parsing**
- Automatically detects medications from extracted text
- Identifies:
  - **Medication names** (first 1-2 words)
  - **Dosage** (e.g., "500mg", "10ml")
  - **Frequency** (e.g., "twice daily", "BD", "OD")
  - **Duration** (e.g., "7 days", "2 weeks")

### 4. **Manual Editing**
- Edit auto-parsed medications
- Add/remove medications
- Verify and correct OCR mistakes
- Add diagnosis and notes

### 5. **Save to Firestore**
- Creates digital prescription
- Links to patient and appointment
- Creates activity log
- Notifies patient in real-time

## How It Works

### User Flow

```
Doctor Dashboard
    ↓
Confirmed Appointment → Click "Upload Rx"
    ↓
Upload prescription image
    ↓
Click "Extract Text with OCR"
    ↓
Tesseract.js processes image (shows progress)
    ↓
Text extracted and displayed
    ↓
Medications auto-parsed from text
    ↓
Doctor reviews and edits medications
    ↓
Doctor adds diagnosis
    ↓
Click "Save Prescription"
    ↓
Prescription saved to Firestore
    ↓
Activity created
    ↓
Patient sees "Prescription Created" in real-time
```

### Technical Flow

```typescript
// 1. Image Upload
handleImageUpload() → FileReader → Base64 image

// 2. OCR Extraction
Tesseract.recognize(image, 'eng') → Extracted text

// 3. Smart Parsing
parseMedications(text) → Array<ExtractedMedication>

// 4. Save to Database
createPrescription({
  medications: [...],
  diagnosis: "...",
  notes: "Digitized from uploaded image"
}) → Firestore
```

## OCR Parsing Logic

### Medication Detection
```typescript
// Looks for lines containing:
- mg, ml, tablet, capsule, syrup, injection
- Extracts: "Metformin 500mg twice daily for 7 days"
```

### Frequency Detection
```typescript
// Recognizes:
- daily, twice, thrice
- morning, evening, night
- OD (once daily), BD (twice daily), TD (thrice daily)
```

### Duration Detection
```typescript
// Extracts:
- "7 days", "2 weeks", "1 month"
- Numbers followed by day/days/week/weeks/month/months
```

## Component Structure

### PrescriptionUploader.tsx

```typescript
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
```

### Key Functions

#### 1. handleImageUpload
```typescript
const handleImageUpload = (event) => {
  const file = event.target.files?.[0];
  // Convert to base64 for Tesseract
  reader.readAsDataURL(file);
};
```

#### 2. handleExtractText
```typescript
const handleExtractText = async () => {
  const result = await Tesseract.recognize(image, 'eng', {
    logger: (m) => console.log(`OCR Progress: ${m.progress * 100}%`)
  });
  setExtractedText(result.data.text);
  parseMedications(result.data.text);
};
```

#### 3. parseMedications
```typescript
const parseMedications = (text: string) => {
  // Split into lines
  // Look for medication keywords
  // Extract dosage, frequency, duration
  // Return array of medications
};
```

#### 4. handleSavePrescription
```typescript
const handleSavePrescription = async () => {
  await createPrescription({
    patientId,
    medications: medications.map(med => ({
      name: med.name,
      dosage: med.dosage,
      frequency: med.frequency,
      duration: med.duration
    })),
    diagnosis,
    notes: `Digitized from uploaded image. Original: ${extractedText}`
  });
};
```

## Integration with Doctor Dashboard

### Added to DoctorDashboard.tsx

```typescript
// 1. Import
import { PrescriptionUploader } from '../../components/PrescriptionUploader';

// 2. State
const [showPrescriptionUploader, setShowPrescriptionUploader] = useState(false);

// 3. Button in Appointments Table
{appointment.status === 'confirmed' && (
  <button onClick={() => {
    setSelectedPatient({ id: appointment.patientId, name: appointment.patientName });
    setShowPrescriptionUploader(true);
  }}>
    Upload Rx
  </button>
)}

// 4. Modal
{showPrescriptionUploader && selectedPatient && (
  <PrescriptionUploader
    patientId={selectedPatient.id}
    patientName={selectedPatient.name}
    onClose={() => setShowPrescriptionUploader(false)}
    onSuccess={() => loadAppointments()}
  />
)}
```

## UI/UX Features

### 1. **Upload Area**
- Drag & drop zone
- Cloud upload icon
- File type and size hints
- Hover effect

### 2. **Image Preview**
- Shows uploaded image
- Max height: 256px
- Centered display
- Rounded corners

### 3. **OCR Button**
- Disabled until image uploaded
- Shows loading spinner during extraction
- Progress indicator in console

### 4. **Extracted Text Display**
- Read-only textarea
- Shows raw OCR output
- Gray background
- Scrollable

### 5. **Medication Editor**
- Grid layout (2 columns)
- Add/Remove buttons
- Input fields for each property
- Visual separation with borders

### 6. **Diagnosis & Notes**
- Required diagnosis field
- Optional notes textarea
- Clear labels

### 7. **Action Buttons**
- Cancel (gray)
- Save Prescription (green)
- Disabled during processing

## Example Prescription Formats

### Format 1: Simple List
```
Metformin 500mg
Twice daily
7 days

Lisinopril 10mg
Once daily
30 days
```

### Format 2: Detailed
```
1. Tab. Metformin 500mg BD x 7 days
2. Tab. Lisinopril 10mg OD x 30 days
3. Syrup Amoxicillin 250mg/5ml TDS x 5 days
```

### Format 3: Prescription Pad
```
Rx
Metformin 500mg - 1-0-1 (7 days)
Lisinopril 10mg - 1-0-0 (30 days)

Diagnosis: Type 2 Diabetes, Hypertension
```

## OCR Accuracy Tips

### For Best Results:
1. ✅ Good lighting
2. ✅ Clear, focused image
3. ✅ Straight angle (not tilted)
4. ✅ High resolution
5. ✅ Legible handwriting

### Common Issues:
1. ❌ Blurry images
2. ❌ Poor lighting/shadows
3. ❌ Tilted/rotated images
4. ❌ Very messy handwriting
5. ❌ Low resolution

## Error Handling

### 1. No Image Uploaded
```typescript
if (!image) {
  alert('Please upload an image first!');
  return;
}
```

### 2. OCR Extraction Failed
```typescript
catch (error) {
  console.error('❌ OCR extraction failed:', error);
  alert('Failed to extract text. Please try again!');
}
```

### 3. No Medications Detected
```typescript
if (parsedMeds.length === 0) {
  // Add empty medication for manual entry
  setMedications([{ name: '', dosage: '', frequency: '', duration: '' }]);
}
```

### 4. Missing Required Fields
```typescript
if (!diagnosis) {
  alert('Please enter a diagnosis');
  return;
}
```

## Data Saved to Firestore

```javascript
{
  patientId: "patient-uid",
  patientName: "John Doe",
  doctorId: "doctor-uid",
  doctorName: "Dr. Smith",
  appointmentId: "appointment-id",
  medications: [
    {
      name: "Metformin",
      dosage: "500mg",
      frequency: "Twice daily",
      duration: "7 days",
      instructions: "Take as prescribed"
    }
  ],
  diagnosis: "Type 2 Diabetes",
  notes: "Prescription digitized from uploaded image. Original text: Metformin 500mg...",
  status: "pending",
  date: Timestamp,
  createdAt: Timestamp
}
```

## Activity Log Created

```javascript
{
  type: "prescription_created",
  title: "Prescription Created",
  description: "Metformin 500mg, Lisinopril 10mg",
  patientId: "patient-uid",
  patientName: "John Doe",
  actorId: "doctor-uid",
  actorName: "Dr. Smith",
  actorRole: "doctor",
  relatedId: "prescription-id",
  relatedType: "prescription",
  createdAt: Timestamp
}
```

## Benefits

### For Doctors:
1. ✅ **Faster data entry** - Upload instead of typing
2. ✅ **Reduce errors** - OCR reads handwriting
3. ✅ **Digital backup** - Never lose prescriptions
4. ✅ **Easy editing** - Correct OCR mistakes quickly

### For Patients:
1. ✅ **Digital records** - Access prescriptions anytime
2. ✅ **Real-time notifications** - Know when prescription is ready
3. ✅ **No lost papers** - Everything in one place
4. ✅ **Easy sharing** - Share with pharmacists digitally

### For System:
1. ✅ **Structured data** - Searchable, analyzable
2. ✅ **Activity tracking** - Complete audit trail
3. ✅ **Integration ready** - Works with existing features
4. ✅ **Scalable** - Handles any number of uploads

## Future Enhancements

### Planned Features:
1. **Multi-language OCR** - Support regional languages
2. **Handwriting AI** - Better recognition of doctor's handwriting
3. **Auto-diagnosis detection** - Extract diagnosis from prescription
4. **Drug interaction warnings** - Check for conflicts
5. **Insurance integration** - Auto-fill insurance forms
6. **Batch upload** - Multiple prescriptions at once
7. **Image enhancement** - Auto-rotate, crop, enhance
8. **Voice input** - Dictate prescriptions

## Testing

### Test Case 1: Upload Clear Prescription
1. Click "Upload Rx" on confirmed appointment
2. Upload clear prescription image
3. Click "Extract Text with OCR"
4. Verify medications are parsed correctly
5. Edit if needed
6. Add diagnosis
7. Save prescription
8. Check patient dashboard for activity

### Test Case 2: Manual Entry
1. Upload prescription
2. OCR fails to parse
3. Manually enter medications
4. Save prescription
5. Verify data in Firestore

### Test Case 3: Edit Parsed Data
1. Upload prescription
2. OCR parses medications
3. Edit dosage/frequency
4. Add/remove medications
5. Save prescription
6. Verify changes saved correctly

## Summary

✅ **Upload prescription images**
✅ **OCR text extraction with Tesseract.js**
✅ **Smart medication parsing**
✅ **Manual editing and verification**
✅ **Save to Firestore**
✅ **Real-time activity notifications**
✅ **Integrated with Doctor Dashboard**
✅ **Works with confirmed appointments**

The Prescription OCR feature transforms handwritten prescriptions into structured digital data, making healthcare more efficient and error-free! 🎉
