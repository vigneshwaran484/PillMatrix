# Firebase Appointment System - Testing Guide

## Issue Fixed ✅

**Problem:** Appointments were not being stored in Firebase because the system was using email addresses instead of Firebase UIDs.

**Solution:** Updated all components to use Firebase UID (`user.uid`) for patient and doctor identification.

---

## What Changed

### 1. **AuthContext** (`src/contexts/AuthContext.tsx`)
- Added `uid` field to `UserData` type
- User object now includes Firebase UID when authenticated
- UID is automatically added when user logs in

### 2. **AppointmentScheduler** (`src/components/AppointmentScheduler.tsx`)
- Now uses `user.uid` instead of `user.email` for `patientId`
- Validates that UID exists before creating appointment

### 3. **PatientDashboard** (`src/pages/dashboards/PatientDashboard.tsx`)
- Fetches appointments using `user.uid` instead of `user.email`

### 4. **DoctorDashboard** (`src/pages/dashboards/DoctorDashboard.tsx`)
- Fetches appointments using `user.uid` instead of `user.email`

### 5. **PrescriptionWriter** (`src/components/PrescriptionWriter.tsx`)
- Uses `user.uid` for `doctorId` when creating prescriptions and health records

---

## How to Test

### Step 1: Clear Old Data (Important!)

Since we changed from email to UID, you need to start fresh:

1. **Go to Firebase Console:**
   - https://console.firebase.google.com/project/pillmatrix/firestore

2. **Delete old collections (if they exist):**
   - Click on `appointments` collection → Delete collection
   - Click on `healthRecords` collection → Delete collection
   - Click on `prescriptions` collection → Delete collection

3. **Clear browser data:**
   - Press `F12` → Console tab
   - Run: `localStorage.clear()`
   - Close and reopen browser

### Step 2: Register Users

**Register a Doctor:**
1. Go to login page
2. Click "Create one"
3. Fill in:
   - First Name: John
   - Last Name: Smith
   - Email: doctor@test.com
   - Password: password123
   - Confirm Password: password123
   - Role: Doctor
   - Government ID: DOC123456
4. Click "Create Account"
5. **Check console for:**
   ```
   ✅ Using Firebase registration
   ✅ Firebase user created: doctor@test.com
   ✅ User profile saved to Firestore
   ```
6. Logout

**Register a Patient:**
1. Click "Create one"
2. Fill in:
   - First Name: Jane
   - Last Name: Doe
   - Email: patient@test.com
   - Password: password123
   - Confirm Password: password123
   - Role: Patient
3. Click "Create Account"
4. **Check console for:**
   ```
   ✅ Using Firebase registration
   ✅ Firebase user created: patient@test.com
   ✅ User profile saved to Firestore
   ```

### Step 3: Verify User UIDs in Firestore

1. **Go to Firestore:**
   - https://console.firebase.google.com/project/pillmatrix/firestore/data

2. **Check `users` collection:**
   - Should see 2 documents
   - Each document ID is the Firebase UID (e.g., `abc123xyz456`)
   - Click on each document to see:
     ```
     name: "John Smith" or "Jane Doe"
     email: "doctor@test.com" or "patient@test.com"
     role: "doctor" or "patient"
     createdAt: [timestamp]
     ```

### Step 4: Schedule Appointment (as Patient)

1. **Login as patient** (patient@test.com / password123)

2. **Check console for UID:**
   ```
   👤 Auth state changed: signed in patient@test.com
   📋 User profile loaded from Firestore: {uid: "abc123...", name: "Jane Doe", ...}
   ```

3. **Click "Book Appointment"**

4. **Fill in form:**
   - Select Doctor: Dr. John Smith
   - Date: Tomorrow's date
   - Time: 10:00 AM
   - Type: Consultation
   - Reason: "Regular checkup"

5. **Click "Schedule Appointment"**

6. **Check console for:**
   ```
   ✅ Appointment created: [appointment-id]
   ```

7. **Verify in Firestore:**
   - Go to Firestore → `appointments` collection
   - Should see new document with:
     ```
     patientId: "abc123..." (patient's UID)
     patientName: "Jane Doe"
     patientEmail: "patient@test.com"
     doctorId: "xyz789..." (doctor's UID)
     doctorName: "John Smith"
     date: [timestamp]
     time: "10:00 AM"
     type: "consultation"
     status: "pending"
     reason: "Regular checkup"
     createdAt: [timestamp]
     ```

8. **Check dashboard:**
   - Should see appointment in "Upcoming Appointments" section

### Step 5: Confirm Appointment (as Doctor)

1. **Logout and login as doctor** (doctor@test.com / password123)

2. **Check console for UID:**
   ```
   👤 Auth state changed: signed in doctor@test.com
   📋 User profile loaded from Firestore: {uid: "xyz789...", name: "John Smith", ...}
   ```

3. **Check "Today's Appointments" table:**
   - Should see Jane Doe's appointment
   - Status: "pending"

4. **Click "Confirm" button**

5. **Check console for:**
   ```
   ✅ Appointment status updated
   ```

6. **Verify in Firestore:**
   - Appointment status should change to "confirmed"

### Step 6: View Patient Records

1. **Click "View Records" for Jane Doe**

2. **Should see modal with:**
   - Patient name: Jane Doe
   - Two tabs: Health Records, Prescriptions
   - Both should be empty (new patient)

### Step 7: Write Prescription

1. **Click "Write Prescription"**

2. **Fill in form:**
   - **Vital Signs:**
     - Blood Pressure: 120/80
     - Heart Rate: 72
     - Temperature: 98.6
     - Weight: 65
     - Height: 165
   
   - **Symptoms:** "Mild headache and fatigue"
   
   - **Diagnosis:** "Common cold with mild dehydration"
   
   - **Medication 1:**
     - Medicine Name: Paracetamol
     - Dosage: 500mg
     - Frequency: 3 times daily
     - Duration: 3 days
     - Instructions: Take after meals with water
   
   - **Click "+ Add Medication"**
   
   - **Medication 2:**
     - Medicine Name: Vitamin C
     - Dosage: 1000mg
     - Frequency: Once daily
     - Duration: 7 days
     - Instructions: Take in the morning
   
   - **Additional Notes:** "Rest well and drink plenty of fluids. Follow up if symptoms persist after 3 days."

3. **Click "Save Prescription"**

4. **Check console for:**
   ```
   ✅ Prescription created: [prescription-id]
   ✅ Health record created: [record-id]
   ```

5. **Verify in Firestore:**
   
   **Check `prescriptions` collection:**
   ```
   patientId: "abc123..." (patient's UID)
   patientName: "Jane Doe"
   doctorId: "xyz789..." (doctor's UID)
   doctorName: "John Smith"
   date: [timestamp]
   diagnosis: "Common cold with mild dehydration"
   medications: [
     {
       name: "Paracetamol",
       dosage: "500mg",
       frequency: "3 times daily",
       duration: "3 days",
       instructions: "Take after meals with water"
     },
     {
       name: "Vitamin C",
       dosage: "1000mg",
       frequency: "Once daily",
       duration: "7 days",
       instructions: "Take in the morning"
     }
   ]
   notes: "Rest well and drink plenty of fluids..."
   createdAt: [timestamp]
   ```
   
   **Check `healthRecords` collection:**
   ```
   patientId: "abc123..." (patient's UID)
   patientName: "Jane Doe"
   doctorId: "xyz789..." (doctor's UID)
   doctorName: "John Smith"
   date: [timestamp]
   type: "consultation"
   diagnosis: "Common cold with mild dehydration"
   symptoms: "Mild headache and fatigue"
   vitalSigns: {
     bloodPressure: "120/80",
     heartRate: 72,
     temperature: 98.6,
     weight: 65,
     height: 165
   }
   notes: "Rest well and drink plenty of fluids..."
   createdAt: [timestamp]
   ```

### Step 8: View Records Again

1. **Click "View Records" for Jane Doe again**

2. **Health Records tab should show:**
   - Consultation record with diagnosis, symptoms, vital signs

3. **Prescriptions tab should show:**
   - Prescription with 2 medications
   - Full details visible

---

## Console Debugging

### Expected Console Messages

**When registering:**
```
🔥 Firebase initialized with project: pillmatrix
📝 Registration attempt: {email: "...", role: "..."}
✅ Using Firebase registration
✅ Firebase user created: ...
✅ User profile saved to Firestore
```

**When logging in:**
```
🔐 Login attempt: {email: "...", projectId: "pillmatrix"}
✅ Using Firebase authentication
✅ Firebase authentication successful
👤 Auth state changed: signed in ...
📋 User profile loaded from Firestore: {uid: "...", name: "...", role: "..."}
```

**When scheduling appointment:**
```
✅ Appointment created: [id]
```

**When confirming appointment:**
```
✅ Appointment status updated
```

**When writing prescription:**
```
✅ Prescription created: [id]
✅ Health record created: [id]
```

### Common Issues

**"User not authenticated properly"**
- Cause: User UID is missing
- Fix: Logout and login again
- Check: Console should show `uid` in user object

**"Permission denied"**
- Cause: Firestore security rules not set
- Fix: Add security rules (see APPOINTMENT_SYSTEM_GUIDE.md)

**"No doctors found"**
- Cause: No users with role="doctor"
- Fix: Register a doctor account first

**Appointments not showing**
- Cause: Using old email-based data
- Fix: Delete old collections and start fresh

---

## Success Criteria ✅

After completing all steps, you should have:

- [x] 2 users in Firestore (1 doctor, 1 patient)
- [x] 1 appointment in Firestore (with UIDs, not emails)
- [x] 1 health record in Firestore
- [x] 1 prescription in Firestore
- [x] Patient can see their appointment
- [x] Doctor can see and confirm appointments
- [x] Doctor can view patient records
- [x] Doctor can write prescriptions
- [x] All data linked by UID

---

## Next Steps

Once testing is successful:

1. **Add Firestore Security Rules** (see APPOINTMENT_SYSTEM_GUIDE.md)
2. **Test with multiple patients and doctors**
3. **Test appointment cancellation** (future feature)
4. **Add email notifications** (future feature)

---

## Troubleshooting

If appointments still don't show:

1. **Check browser console** for errors
2. **Check Firestore console** to see if data is being created
3. **Verify UID** is present in user object (console log)
4. **Clear browser cache** and localStorage
5. **Restart dev server** (`npm run dev`)

If you see any errors, share the console output for debugging!
