# 🔍 Appointment System Debug Steps

## Step 1: Clear Console & Test

1. **Open browser console** (F12 → Console)
2. **Clear console** (🚫 icon)
3. **Login as patient** (patient@pillmatrix.com)

## Step 2: Check User Authentication

**Look for this message:**
```
📋 User profile loaded from Firestore: {
  uid: "qGIWA77M4uYoEgGdMDU4M56d8o93",  ← Copy this UID
  name: "Jane Doe",
  email: "patient@pillmatrix.com",
  role: "patient"
}
```

**Copy your UID** - you'll need it later.

## Step 3: Check Doctors Loading

**Click "Book Appointment"**

**Look for:**
```
👨‍⚕️ Found doctors: [
  {
    id: "[doctor-uid]",      ← Should be UID, not email
    name: "John Smith",
    email: "doctor@pillmatrix.com"
  }
]
```

**If you see this, doctors are loading correctly.**

## Step 4: Book Appointment

**Fill form:**
- Doctor: Dr. John Smith
- Date: **TOMORROW** (important!)
- Time: 10:00 AM
- Type: Consultation
- Reason: Regular checkup
- Click "Schedule Appointment"

**Look for:**
```
📝 Creating appointment with data: {
  patientId: "qGIWA77M4uYoEgGdMDU4M56d8o93",
  patientName: "Jane Doe",
  doctorId: "[doctor-uid]",    ← Should match doctor from Step 3
  doctorName: "John Smith",
  date: [tomorrow's date],
  time: "10:00 AM",
  type: "consultation",
  status: "pending"
}
✅ Appointment created successfully with ID: [some-id]
```

## Step 5: Check Firestore

**Go to:** https://console.firebase.google.com/project/pillmatrix/firestore/data

**Click `appointments` collection**

**Verify appointment document:**
- `patientId` matches your UID from Step 2
- `doctorId` matches doctor UID from Step 3
- `date` is tomorrow
- `status` is "pending"
- `time` is "10:00 AM"

## Step 6: Check Patient Dashboard Loading

**Refresh patient dashboard**

**Look for:**
```
📊 Loading patient data for UID: qGIWA77M4uYoEgGdMDU4M56d8o93
📅 Loaded appointments: [
  {
    id: "[appointment-id]",
    patientId: "qGIWA77M4uYoEgGdMDU4M56d8o93",
    date: [Date object],
    status: "pending",
    ...
  }
]
```

## Step 7: Check Filtering

**Look for filtering logs:**
```
🔍 Filtering appointment: {
  id: "[appointment-id]",
  date: [Date object],
  appointmentDate: Wed Oct 30 2025 10:00:00 GMT+0530,
  now: [current date/time],
  status: "pending",
  isNotCancelled: true,
  isNotCompleted: true,
  isFuture: true,          ← Should be TRUE for tomorrow
  passes: true             ← Should be TRUE
}
```

**If `passes: false`, check which condition failed:**
- `isFuture: false` → Date is in past (schedule for tomorrow!)
- `isNotCancelled: false` → Status is "cancelled"
- `isNotCompleted: false` → Status is "completed"

## Step 8: Verify UI

**Patient Dashboard:**
- "Upcoming Appointments" section should show 1 appointment
- "Upcoming Appointments" stat should show: 1

## Step 9: Test Doctor Side

**Logout → Login as doctor**

**Look for:**
```
👨‍⚕️ Loading doctor appointments for UID: [doctor-uid]
📅 Loaded doctor appointments: [appointment data]
```

**Check "Today's Appointments" table:**
- Should show Jane Doe's appointment
- Status: pending

---

## 🎯 Most Likely Issues:

### 1. **Date in Past**
**Symptom:** `isFuture: false`
**Fix:** Schedule appointment for **tomorrow**, not today

### 2. **UID Mismatch**
**Symptom:** No appointments in dashboard
**Fix:** Check if `patientId` in Firestore matches user UID

### 3. **Doctor Not Selected**
**Symptom:** `doctorId` is undefined
**Fix:** Make sure you select a doctor in the dropdown

### 4. **Security Rules**
**Symptom:** Permission denied
**Fix:** Verify rules are published in Firebase Console

---

## 📝 What to Share:

If still not working, share:
1. **All console logs** from Steps 1-8
2. **Screenshot of Firestore appointment document**
3. **Your user UID** from Step 2
4. **Doctor UID** from Step 3

**Follow these steps in order and let me know what you see!** 🔍
