# Appointment Not Showing - Debugging Guide

## Issue
Appointments are not appearing in:
1. Patient's "Upcoming Appointments" section
2. Doctor's appointments list

## 🔍 Step-by-Step Debugging

### Step 1: Check Browser Console

Open browser console (F12 → Console tab) and look for these messages:

#### When Scheduling Appointment (as Patient):
```
📅 Creating appointment with data: {
  patientId: "abc123...",
  patientName: "Jane Doe",
  doctorId: "xyz789...",
  doctorName: "John Smith",
  date: [Date object],
  time: "10:00 AM"
}
✅ Appointment created with ID: [appointment-id]
```

**If you DON'T see these messages:**
- ❌ Appointment creation failed
- Check for error messages in console
- Verify Firebase is initialized

**If you see "Permission denied" error:**
- ❌ Firestore security rules not set
- Go to Firebase Console → Firestore → Rules
- Add the security rules (see APPOINTMENT_SYSTEM_GUIDE.md)

### Step 2: Verify in Firebase Console

1. **Go to Firestore:**
   - https://console.firebase.google.com/project/pillmatrix/firestore/data

2. **Check `appointments` collection:**
   - Should see a new document
   - Document ID: Auto-generated (e.g., `abc123xyz`)
   
3. **Click on the document and verify fields:**
   ```
   patientId: "kF3mN9pQ2rS5..." (Firebase UID, NOT email!)
   patientName: "Jane Doe"
   patientEmail: "patient@test.com"
   doctorId: "mN9pQ2rS5tU8..." (Firebase UID, NOT email!)
   doctorName: "John Smith"
   date: October 29, 2025 at 10:00:00 AM UTC+5:30
   time: "10:00 AM"
   type: "consultation"
   status: "pending"
   reason: "Regular checkup"
   createdAt: [timestamp]
   ```

**Common Issues:**

❌ **patientId or doctorId is an email (not UID)**
- Cause: Old code using email instead of UID
- Fix: Already fixed in latest code, but old data won't work
- Solution: Delete old appointments and create new ones

❌ **date field is a string instead of Timestamp**
- Cause: Date not properly converted to Firestore Timestamp
- Fix: Check appointmentService.ts

❌ **Document doesn't exist**
- Cause: Creation failed silently
- Check console for errors

### Step 3: Check Patient Dashboard Loading

When you refresh the Patient Dashboard, console should show:

```
📊 Loading patient data for UID: kF3mN9pQ2rS5...
📅 Loaded appointments: [
  {
    id: "abc123",
    patientId: "kF3mN9pQ2rS5...",
    doctorId: "mN9pQ2rS5tU8...",
    date: [Date object],
    time: "10:00 AM",
    status: "pending",
    ...
  }
]
💊 Loaded prescriptions: []
📋 Loaded health records: []
```

**If appointments array is empty `[]`:**

Possible causes:
1. **UID mismatch** - patientId in Firestore doesn't match user.uid
2. **No appointments in Firestore** - Check Step 2
3. **Query error** - Check console for errors

### Step 4: Check Doctor Dashboard Loading

When doctor logs in, console should show:

```
👨‍⚕️ Loading doctor appointments for UID: mN9pQ2rS5tU8...
📅 Loaded doctor appointments: [
  {
    id: "abc123",
    patientId: "kF3mN9pQ2rS5...",
    doctorId: "mN9pQ2rS5tU8...",
    patientName: "Jane Doe",
    date: [Date object],
    time: "10:00 AM",
    status: "pending",
    ...
  }
]
```

**If appointments array is empty `[]`:**

Possible causes:
1. **UID mismatch** - doctorId in Firestore doesn't match doctor's user.uid
2. **Wrong doctor selected** - Appointment created for different doctor
3. **Query error** - Check console for errors

---

## 🛠️ Common Fixes

### Fix 1: UID Mismatch

**Problem:** patientId/doctorId in Firestore doesn't match user.uid

**Check:**
1. Login as patient
2. Open console
3. Look for: `📋 User profile loaded from Firestore: {uid: "...", ...}`
4. Copy the UID
5. Go to Firestore and check if appointment's patientId matches

**Solution:**
- If UIDs don't match, delete old appointments
- Create new appointment (will use correct UID)

### Fix 2: Email Instead of UID

**Problem:** Old appointments have email in patientId/doctorId

**Check Firestore:**
```
❌ Wrong:
patientId: "patient@test.com"
doctorId: "doctor@test.com"

✅ Correct:
patientId: "kF3mN9pQ2rS5tU8vW1xY4z"
doctorId: "mN9pQ2rS5tU8vW1xY4z7B"
```

**Solution:**
1. Delete all appointments in Firestore
2. Create new appointments (will use UIDs)

### Fix 3: Date Filtering Issue

**Problem:** Appointment exists but filtered out

**Check console for upcoming appointments:**
```javascript
// In PatientDashboard
const upcomingAppointments = appointments.filter(apt => 
  apt.status !== 'cancelled' && 
  apt.status !== 'completed' && 
  apt.date >= new Date()
);
```

**Debug:**
1. Check if `apt.date` is a Date object
2. Check if `apt.date >= new Date()` is true
3. Check appointment status

**Solution:**
- If date is in the past, schedule for future date
- If status is 'cancelled' or 'completed', create new appointment

### Fix 4: Firestore Security Rules

**Problem:** "Permission denied" error

**Check:**
- Go to Firebase Console → Firestore → Rules
- Verify rules are published

**Solution:**
Add these rules:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /appointments/{appointmentId} {
      allow create: if request.auth != null;
      allow read: if request.auth != null && 
                    (resource.data.patientId == request.auth.uid ||
                     resource.data.doctorId == request.auth.uid);
      allow update: if request.auth != null && 
                      resource.data.doctorId == request.auth.uid;
    }
    
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

---

## 📋 Complete Testing Checklist

### As Patient:

- [ ] Login as patient
- [ ] Check console for UID: `{uid: "...", name: "...", role: "patient"}`
- [ ] Click "Book Appointment"
- [ ] Select a doctor
- [ ] Choose future date (tomorrow or later)
- [ ] Choose time
- [ ] Fill reason
- [ ] Click "Schedule Appointment"
- [ ] Check console for: `✅ Appointment created with ID: ...`
- [ ] Go to Firestore and verify appointment exists
- [ ] Verify patientId matches your UID
- [ ] Refresh page
- [ ] Check console for: `📅 Loaded appointments: [...]`
- [ ] Check "Upcoming Appointments" section shows appointment
- [ ] Verify "Upcoming Appointments" stat shows correct count

### As Doctor:

- [ ] Login as doctor
- [ ] Check console for UID: `{uid: "...", name: "...", role: "doctor"}`
- [ ] Check console for: `📅 Loaded doctor appointments: [...]`
- [ ] Verify appointment appears in "Today's Appointments" table
- [ ] Verify doctorId in Firestore matches your UID
- [ ] Click "Confirm" button
- [ ] Verify status changes to "confirmed"

---

## 🔧 Manual Verification

### Check User UIDs:

1. **Get Patient UID:**
   - Login as patient
   - Console: Look for `uid` in user object
   - Example: `kF3mN9pQ2rS5tU8vW1xY4z`

2. **Get Doctor UID:**
   - Login as doctor
   - Console: Look for `uid` in user object
   - Example: `mN9pQ2rS5tU8vW1xY4z7B`

3. **Check Firestore:**
   - Go to `users` collection
   - Find documents with these UIDs
   - Verify role is correct

### Check Appointment Data:

1. **Go to Firestore → appointments**
2. **Click on appointment document**
3. **Verify:**
   - patientId = Patient's UID (not email!)
   - doctorId = Doctor's UID (not email!)
   - date = Firestore Timestamp (not string!)
   - status = "pending"
   - All other fields present

---

## 🚨 If Still Not Working

### Nuclear Option: Start Fresh

1. **Delete all Firestore data:**
   ```
   - Delete `appointments` collection
   - Delete `prescriptions` collection
   - Delete `healthRecords` collection
   - Keep `users` collection
   ```

2. **Clear browser:**
   ```javascript
   // In browser console:
   localStorage.clear();
   ```

3. **Logout and login again**

4. **Create new appointment**

5. **Check console logs at every step**

---

## 📞 Debug Output Template

If still not working, share this info:

```
**Patient UID:** [from console]
**Doctor UID:** [from console]
**Appointment ID:** [from Firestore]
**Console Logs:** [copy all appointment-related logs]
**Firestore Screenshot:** [screenshot of appointment document]
**Error Messages:** [any errors in console]
```

---

## ✅ Success Indicators

You'll know it's working when:

1. ✅ Console shows: `✅ Appointment created with ID: ...`
2. ✅ Firestore has appointment with correct UIDs
3. ✅ Console shows: `📅 Loaded appointments: [...]` (not empty)
4. ✅ "Upcoming Appointments" section shows appointment
5. ✅ Stats show correct count (not 0)
6. ✅ Doctor sees appointment in their dashboard
7. ✅ Doctor can confirm appointment

---

## 🎯 Most Likely Issues

Based on common problems:

1. **UID Mismatch (90%)** - patientId/doctorId doesn't match user.uid
2. **Old Email-Based Data (5%)** - Using email instead of UID
3. **Security Rules (3%)** - Firestore rules not set
4. **Date in Past (2%)** - Appointment scheduled for past date

**Start with checking UIDs in console vs Firestore!**
