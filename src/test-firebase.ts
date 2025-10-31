// Test Firebase Connection
import { db } from './config/firebase';
import { collection, getDocs } from 'firebase/firestore';

async function testFirebaseConnection() {
  try {
    console.log('🔍 Testing Firebase connection...');
    
    // Test Firestore connection
    const testRef = collection(db, 'test');
    await getDocs(testRef);
    console.log('✅ Firestore connection successful!');
    
    return true;
  } catch (error) {
    console.error('❌ Firebase connection failed:', error);
    return false;
  }
}

// Run the test
testFirebaseConnection().then(success => {
  if (success) {
    console.log('✨ Firebase is properly configured!');
  } else {
    console.log('❌ There was an issue with Firebase configuration.');
  }
});
