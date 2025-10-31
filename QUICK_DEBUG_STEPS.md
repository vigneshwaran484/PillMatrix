# Quick Debugging Steps - Appointments Not Working

## 🚨 Immediate Actions

### Step 1: Check Browser Console

1. **Open browser** (Chrome/Edge)
2. **Press F12** → Go to **Console** tab
3. **Clear console** (click 🚫 icon)
4. **Try booking an appointment**

### Step 2: Look for These Messages

#### ✅ **Success Messages (What You SHOULD See):**

```
📅 Creating appointment with data: {
  patientId: "kF3mN9pQ2rS5tU8vW1xY4z",  ← Long random string (UID)
  patientName: "Jane Doe",
  doctorId: "mN9pQ2rS5tU8vW1xY4z7B",   ← Long random string (UID)
  doctorName: "John Smith",
  date: Wed Oct 30 2025 10:00:00 GMT+0530,
  time: "10:00 AM"
}
✅ Appointment created with ID: abc123xyz456
```

#### ❌ **Error Messages (What Indicates Problems):**

```
❌ Firebase: Missing or insufficient permissions (permission-denied)
❌ Firebase: Error (auth/...)
❌ Error scheduling appointment: [error details]
```

### Step 3: Check Firestore Console

1. **Go to:** https://console.firebase.google.com/project/pillmatrix/firestore/data

2. **Look for `appointments` collection**

3. **Click on it** - Do you see any documents?

#### If YES - Appointment was created:
- Click on the document
- Check these fields:
  - `patientId` - Should be a long UID like `kF3mN9pQ2rS5tU8vW1xY4z`
  - `doctorId` - Should be a long UID like `mN9pQ2rS5tU8vW1xY4z7B`
  - `date` - Should be a Firestore Timestamp
  - `status` - Should be "pending"

#### If NO - Appointment creation failed:
- Check console for error messages
- Verify security rules are published

### Step 4: Check User UID

**In browser console, look for:**
```
📋 User profile loaded from Firestore: {
  uid: "kF3mN9pQ2rS5tU8vW1xY4z",  ← Copy this UID
  name: "Jane Doe",
  email: "patient@pillmatrix.com",
  role: "patient"
}
```

**Then in Firestore:**
- Go to the appointment document
- Check if `patientId` matches the UID above
- They MUST be exactly the same!

---

## 🔧 Common Issues & Quick Fixes

### Issue 1: "Permission Denied" Error

**Console shows:**
```
❌ FirebaseError: Missing or insufficient permissions
```

**Fix:**
1. Go to: https://console.firebase.google.com/project/pillmatrix/firestore/rules
2. Make sure rules are published (green checkmark)
3. Try again

### Issue 2: Appointment Created But Not Showing

**Firestore has appointment, but dashboard shows 0**

**Possible causes:**

#### A) UID Mismatch
```
Firestore appointment:
  patientId: "abc123..."

Your user UID:
  uid: "xyz789..."  ← Different!
```

**Fix:** Delete appointment, create new one

#### B) Date in Past
```
Appointment date: Oct 28, 2025 (yesterday)
Today: Oct 29, 2025
Result: Filtered out as "past" appointment
```

**Fix:** Schedule for future date (tomorrow or later)

#### C) Wrong Status
```
Appointment status: "cancelled" or "completed"
Result: Filtered out
```

**Fix:** Create new appointment (will be "pending")

### Issue 3: Email Instead of UID

**Firestore shows:**
```
❌ Wrong:
patientId: "patient@pillmatrix.com"
doctorId: "doctor@pillmatrix.com"

✅ Correct:
patientId: "kF3mN9pQ2rS5tU8vW1xY4z"
doctorId: "mN9pQ2rS5tU8vW1xY4z7B"
```

**Fix:**
1. Delete all appointments in Firestore
2. Logout and login again
3. Create new appointment

---

## 📊 Detailed Console Logs

After my latest update, you'll see detailed filtering logs:

```
📊 Loading patient data for UID: kF3mN9pQ2rS5...
📅 Loaded appointments: [
  {
    id: "abc123",
    patientId: "kF3mN9pQ2rS5...",
    date: Wed Oct 30 2025 10:00:00 GMT+0530,
    status: "pending",
    ...
  }
]

🔍 Filtering appointment: {
  id: "abc123",
  date: Wed Oct 30 2025 10:00:00 GMT+0530,
  status: "pending",
  isNotCancelled: true,
  isNotCompleted: true,
  isFuture: true,
  passes: true  ← Should be true!
}
```

**If `passes: false`**, check which condition failed:
- `isNotCancelled: false` → Status is "cancelled"
- `isNotCompleted: false` → Status is "completed"
- `isFuture: false` → Date is in the past

---

## 🎯 Quick Test Checklist

Do this in order:

1. [ ] Open browser console (F12)
2. [ ] Clear console
3. [ ] Login as patient
4. [ ] Check console for user UID
5. [ ] Click "Book Appointment"
6. [ ] Select doctor
7. [ ] Choose **TOMORROW's date** (not today!)
8. [ ] Choose any time
9. [ ] Fill reason
10. [ ] Click "Schedule Appointment"
11. [ ] Check console for "✅ Appointment created with ID: ..."
12. [ ] Go to Firestore and verify appointment exists
13. [ ] Verify `patientId` matches your UID
14. [ ] Refresh patient dashboard
15. [ ] Check console for "📅 Loaded appointments: [...]"
16. [ ] Check console for "🔍 Filtering appointment: ..."
17. [ ] Check if "passes: true"
18. [ ] Look at "Upcoming Appointments" section

---

## 📸 What to Share If Still Not Working

If it's still not working, share these:

1. **Console logs** (copy all appointment-related messages)
2. **Firestore screenshot** (appointment document)
3. **Your user UID** (from console)
4. **Appointment patientId** (from Firestore)
5. **Any error messages**

---

## 💡 Most Likely Issue

Based on common problems, it's usually one of these:

1. **UID Mismatch (80%)** - patientId doesn't match user.uid
2. **Date in Past (10%)** - Scheduled for today/yesterday
3. **Permission Denied (5%)** - Rules not published
4. **Old Email Data (5%)** - Using email instead of UID

**Start by checking the console logs!**
