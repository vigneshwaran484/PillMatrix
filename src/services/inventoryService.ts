import {
  collection,
  addDoc,
  getDocs,
  doc,
  query,
  orderBy,
  Timestamp,
  updateDoc,
  increment
} from 'firebase/firestore';
import { db } from '../config/firebase';

export interface InventoryItem {
  id?: string;
  name: string;
  genericName?: string;
  dosage: string;
  form: 'tablet' | 'capsule' | 'liquid' | 'injection' | 'topical' | 'inhaler';
  quantity: number;
  unit: 'tablets' | 'capsules' | 'ml' | 'mg' | 'units';
  minThreshold: number;
  maxStock: number;
  price?: number;
  expiryDate?: Date;
  batchNumber?: string;
  manufacturer?: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Create inventory item

export const createInventoryItem = async (itemData: Omit<InventoryItem, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
  try {
    console.log('📦 Creating inventory item:', itemData.name);

    const dataToSave = {
      ...itemData,
      createdAt: Timestamp.fromDate(new Date()),
      updatedAt: Timestamp.fromDate(new Date()),
    };

    const docRef = await addDoc(collection(db, 'inventory'), dataToSave);
    console.log('✅ Inventory item created:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('❌ Error creating inventory item:', error);
    throw error;
  }
};

// Get all inventory items
export const getAllInventoryItems = async (): Promise<InventoryItem[]> => {
  try {
    console.log('📦 Fetching all inventory items');

    const q = query(
      collection(db, 'inventory'),
      orderBy('name')
    );

    const querySnapshot = await getDocs(q);
    const items: InventoryItem[] = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      items.push({
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(),
        updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate() : new Date(),
        expiryDate: data.expiryDate?.toDate ? data.expiryDate.toDate() : undefined,
      } as InventoryItem);
    });

    console.log('✅ Loaded inventory items:', items.length);
    return items;
  } catch (error) {
    console.error('❌ Error fetching inventory:', error);
    throw error;
  }
};

// Get low stock items (below threshold)
export const getLowStockItems = async (): Promise<InventoryItem[]> => {
  try {
    console.log('📦 Fetching low stock items');

    const allItems = await getAllInventoryItems();
    const lowStockItems = allItems.filter(item => item.quantity <= item.minThreshold);

    console.log('✅ Low stock items:', lowStockItems.length);
    return lowStockItems;
  } catch (error) {
    console.error('❌ Error fetching low stock items:', error);
    throw error;
  }
};

// Update inventory quantity
export const updateInventoryQuantity = async (
  itemId: string,
  quantityChange: number,
  reason: 'stock_addition' | 'prescription_fulfilled' | 'adjustment'
): Promise<void> => {
  try {
    console.log(`📦 Updating inventory ${itemId}: ${quantityChange > 0 ? '+' : ''}${quantityChange}`);

    const itemRef = doc(db, 'inventory', itemId);
    await updateDoc(itemRef, {
      quantity: increment(quantityChange),
      updatedAt: Timestamp.fromDate(new Date()),
    });

    // Log the inventory change
    await addDoc(collection(db, 'inventoryLogs'), {
      itemId,
      quantityChange,
      reason,
      timestamp: Timestamp.fromDate(new Date()),
    });

    console.log('✅ Inventory updated');
  } catch (error) {
    console.error('❌ Error updating inventory:', error);
    throw error;
  }
};

// Search inventory by medication name
export const searchInventoryByName = async (searchTerm: string): Promise<InventoryItem[]> => {
  try {
    console.log('🔍 Searching inventory for:', searchTerm);

    const allItems = await getAllInventoryItems();
    const filteredItems = allItems.filter(item =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.genericName && item.genericName.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    console.log('✅ Found items:', filteredItems.length);
    return filteredItems;
  } catch (error) {
    console.error('❌ Error searching inventory:', error);
    throw error;
  }
};

// Check if medication is available in inventory
export const checkMedicationAvailability = async (medicationName: string, requiredQuantity: number): Promise<{
  available: boolean;
  availableQuantity: number;
  item?: InventoryItem;
}> => {
  try {
    console.log(`🔍 Checking availability: ${medicationName} x${requiredQuantity}`);

    const items = await searchInventoryByName(medicationName);
    const matchingItem = items.find(item =>
      item.name.toLowerCase() === medicationName.toLowerCase() ||
      (item.genericName && item.genericName.toLowerCase() === medicationName.toLowerCase())
    );

    if (!matchingItem) {
      return { available: false, availableQuantity: 0 };
    }

    const available = matchingItem.quantity >= requiredQuantity;
    console.log(`✅ Availability check: ${available ? 'Available' : 'Not available'} (${matchingItem.quantity} available, ${requiredQuantity} needed)`);

    return {
      available,
      availableQuantity: matchingItem.quantity,
      item: matchingItem,
    };
  } catch (error) {
    console.error('❌ Error checking medication availability:', error);
    return { available: false, availableQuantity: 0 };
  }
};

// Calculate quantity needed for prescription
export const calculatePrescriptionQuantity = (
  frequency: string,
  duration: string
): number => {
  // Parse duration (e.g., "7 days", "2 weeks", "1 month")
  const durationMatch = duration.match(/(\d+)\s*(day|week|month)s?/i);
  if (!durationMatch) return 0;

  const durationValue = parseInt(durationMatch[1]);
  const durationUnit = durationMatch[2].toLowerCase();

  let days = 0;
  switch (durationUnit) {
    case 'day':
      days = durationValue;
      break;
    case 'week':
      days = durationValue * 7;
      break;
    case 'month':
      days = durationValue * 30; // Approximation
      break;
  }

  // Parse frequency
  let dosesPerDay = 1; // Default
  const frequencyLower = frequency.toLowerCase();

  if (frequencyLower.includes('once daily') || frequencyLower.includes('daily') || frequencyLower.includes('od')) {
    dosesPerDay = 1;
  } else if (frequencyLower.includes('twice daily') || frequencyLower.includes('bd')) {
    dosesPerDay = 2;
  } else if (frequencyLower.includes('thrice daily') || frequencyLower.includes('tds') || frequencyLower.includes('tid')) {
    dosesPerDay = 3;
  } else if (frequencyLower.includes('four times daily') || frequencyLower.includes('qid')) {
    dosesPerDay = 4;
  } else if (frequencyLower.includes('as needed') || frequencyLower.includes('prn') || frequencyLower.includes('sos')) {
    dosesPerDay = 0; // Variable, use minimum
  }

  return days * dosesPerDay;
};

export const initializeSampleInventory = async (): Promise<void> => {
  try {
    console.log('🔧 Initializing sample inventory data...');

    const sampleItems: Omit<InventoryItem, 'id' | 'createdAt' | 'updatedAt'>[] = [
      {
        name: 'Metformin',
        genericName: 'Metformin Hydrochloride',
        dosage: '500mg',
        form: 'tablet',
        quantity: 150,
        unit: 'tablets',
        minThreshold: 50,
        maxStock: 200,
        manufacturer: 'Generic',
        description: 'Oral diabetes medicine'
      },
      {
        name: 'Lisinopril',
        genericName: 'Lisinopril',
        dosage: '10mg',
        form: 'tablet',
        quantity: 75,
        unit: 'tablets',
        minThreshold: 30,
        maxStock: 100,
        manufacturer: 'Generic',
        description: 'ACE inhibitor for blood pressure'
      },
      {
        name: 'Albuterol Inhaler',
        genericName: 'Albuterol Sulfate',
        dosage: '90mcg',
        form: 'inhaler',
        quantity: 25,
        unit: 'units',
        minThreshold: 10,
        maxStock: 50,
        manufacturer: 'Various',
        description: 'Bronchodilator for asthma'
      },
      {
        name: 'Amoxicillin',
        genericName: 'Amoxicillin',
        dosage: '500mg',
        form: 'capsule',
        quantity: 200,
        unit: 'capsules',
        minThreshold: 40,
        maxStock: 300,
        manufacturer: 'Generic',
        description: 'Antibiotic for bacterial infections'
      },
      {
        name: 'Ibuprofen',
        genericName: 'Ibuprofen',
        dosage: '400mg',
        form: 'tablet',
        quantity: 120,
        unit: 'tablets',
        minThreshold: 25,
        maxStock: 150,
        manufacturer: 'Generic',
        description: 'NSAID for pain and inflammation'
      },
      {
        name: 'Omeprazole',
        genericName: 'Omeprazole',
        dosage: '20mg',
        form: 'capsule',
        quantity: 90,
        unit: 'capsules',
        minThreshold: 20,
        maxStock: 120,
        manufacturer: 'Generic',
        description: 'Proton pump inhibitor for acid reflux'
      },
      {
        name: 'Aspirin',
        genericName: 'Acetylsalicylic Acid',
        dosage: '81mg',
        form: 'tablet',
        quantity: 180,
        unit: 'tablets',
        minThreshold: 35,
        maxStock: 250,
        manufacturer: 'Generic',
        description: 'Antiplatelet medication'
      },
      {
        name: 'Prednisone',
        genericName: 'Prednisone',
        dosage: '5mg',
        form: 'tablet',
        quantity: 60,
        unit: 'tablets',
        minThreshold: 15,
        maxStock: 80,
        manufacturer: 'Generic',
        description: 'Corticosteroid for inflammation'
      }
    ];

    // Check if inventory already has items
    const existingItems = await getAllInventoryItems();
    if (existingItems.length > 0) {
      console.log('✅ Sample inventory already exists, skipping initialization');
      return;
    }

    // Add sample items
    for (const item of sampleItems) {
      await createInventoryItem(item);
    }

    console.log('✅ Sample inventory data initialized successfully');
  } catch (error) {
    console.error('❌ Error initializing sample inventory:', error);
    throw error;
  }
};
