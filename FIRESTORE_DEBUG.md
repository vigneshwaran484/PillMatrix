# Firestore Error Debugging Guide

## Error Fixed: "Unsupported field value: undefined"

### Root Cause
Firebase Firestore does not allow `undefined` values in documents. When optional fields like `appointmentId` are undefined, Firestore rejects the entire write operation.

### Solution Applied
Updated all create functions to filter out undefined fields before sending to Firestore:

1. ✅ `createPrescription()` - Only includes appointmentId and notes if defined
2. ✅ `createHealthRecord()` - Only includes optional fields if defined
3. ✅ `createLabTestOrder()` - Only includes optional fields if defined

### Code Pattern Used
```typescript
const dataToSave: any = {
  // Required fields
  patientId: data.patientId,
  // ... other required fields
};

// Only add optional fields if they're defined
if (data.optionalField) {
  dataToSave.optionalField = data.optionalField;
}

await addDoc(collection(db, 'collectionName'), dataToSave);
```

## Next Steps to Complete Setup

### 1. Update Firestore Security Rules

**Current Issue:** Firestore may still have restrictive rules blocking writes.

**Solution:**
1. Go to: https://console.firebase.google.com/project/pillmatrix/firestore/rules
2. Replace with these **development-only** rules:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

3. Click **Publish**

⚠️ **WARNING:** These rules allow all access. Only use for development!

### 2. Verify Firestore Database Exists

1. Go to: https://console.firebase.google.com/project/pillmatrix/firestore
2. Ensure database is created
3. If not, click "Create Database" → "Start in test mode"

### 3. Test the Fix

After updating Firestore rules:

1. **Reload the application** (Ctrl+R or Cmd+R)
2. **Try creating a prescription** from the Doctor Dashboard
3. **Check browser console** (F12) for detailed logs
4. **Success indicators:**
   - Alert: "Prescription and health record created successfully!"
   - Console: "✅ Prescription created successfully with ID: ..."

### 4. Common Errors and Solutions

#### Error: "Missing or insufficient permissions"
**Solution:** Update Firestore rules as shown above

#### Error: "Network request failed"
**Solution:** 
- Check internet connection
- Verify Firebase project is active
- Check browser console for CORS errors

#### Error: "Collection not found"
**Solution:** Collections are created automatically on first write. This error shouldn't occur.

#### Error: "Invalid data"
**Solution:** Already fixed! The code now filters undefined values.

## Testing Checklist

- [ ] Firestore rules updated to allow writes
- [ ] Database exists and is accessible
- [ ] Application reloaded after rule changes
- [ ] Can create prescriptions without errors
- [ ] Can create lab test orders without errors
- [ ] Can view created prescriptions in Patient Records
- [ ] Browser console shows success messages

## Production Security (Future)

For production deployment, implement proper security rules:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Prescriptions
    match /prescriptions/{prescriptionId} {
      allow read: if request.auth != null && 
        (resource.data.patientId == request.auth.uid || 
         resource.data.doctorId == request.auth.uid);
      allow create: if request.auth != null && 
        request.resource.data.doctorId == request.auth.uid;
    }
    
    // Lab Tests
    match /labTests/{labTestId} {
      allow read: if request.auth != null && 
        (resource.data.patientId == request.auth.uid || 
         resource.data.doctorId == request.auth.uid);
      allow create: if request.auth != null && 
        request.resource.data.doctorId == request.auth.uid;
    }
    
    // Health Records
    match /healthRecords/{recordId} {
      allow read: if request.auth != null && 
        (resource.data.patientId == request.auth.uid || 
         resource.data.doctorId == request.auth.uid);
      allow create: if request.auth != null && 
        request.resource.data.doctorId == request.auth.uid;
    }
  }
}
```

**Note:** Production rules require Firebase Authentication to be implemented.

## Support Resources

- Firebase Console: https://console.firebase.google.com/project/pillmatrix
- Firestore Documentation: https://firebase.google.com/docs/firestore
- Security Rules Guide: https://firebase.google.com/docs/firestore/security/get-started
