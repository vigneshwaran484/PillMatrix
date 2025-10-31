import { useState, useEffect } from 'react';
import { PlusIcon, MagnifyingGlassIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { InventoryItem, getAllInventoryItems, getLowStockItems, createInventoryItem, updateInventoryQuantity } from '../services/inventoryService';

interface InventoryManagementProps {
  onUpdate?: () => void;
}

export function InventoryManagement({ onUpdate }: InventoryManagementProps) {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [lowStockItems, setLowStockItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'low-stock' | 'expiring'>('all');

  // Form state for adding new inventory
  const [newItem, setNewItem] = useState({
    name: '',
    genericName: '',
    dosage: '',
    form: 'tablet' as InventoryItem['form'],
    quantity: 0,
    unit: 'tablets' as InventoryItem['unit'],
    minThreshold: 10,
    maxStock: 100,
    batchNumber: '',
    manufacturer: '',
    description: '',
  });

  useEffect(() => {
    loadInventory();
  }, []);

  const loadInventory = async () => {
    try {
      setLoading(true);
      const [allItems, lowItems] = await Promise.all([
        getAllInventoryItems(),
        getLowStockItems(),
      ]);
      setInventory(allItems);
      setLowStockItems(lowItems);
    } catch (error) {
      console.error('Error loading inventory:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createInventoryItem(newItem);
      setNewItem({
        name: '',
        genericName: '',
        dosage: '',
        form: 'tablet',
        quantity: 0,
        unit: 'tablets',
        minThreshold: 10,
        maxStock: 100,
        batchNumber: '',
        manufacturer: '',
        description: '',
      });
      setShowAddForm(false);
      await loadInventory();
      if (onUpdate) onUpdate();
      alert('Inventory item added successfully!');
    } catch (error) {
      console.error('Error adding inventory item:', error);
      alert('Failed to add inventory item');
    }
  };

  const handleStockAdjustment = async (itemId: string, adjustment: number) => {
    try {
      await updateInventoryQuantity(itemId, adjustment, 'adjustment');
      await loadInventory();
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error('Error adjusting stock:', error);
      alert('Failed to adjust stock');
    }
  };

  const filteredInventory = inventory.filter(item => {
    // Search filter
    const matchesSearch = searchTerm === '' ||
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.genericName && item.genericName.toLowerCase().includes(searchTerm.toLowerCase()));

    // Status filter
    let matchesFilter = true;
    if (filter === 'low-stock') {
      matchesFilter = item.quantity <= item.minThreshold;
    } else if (filter === 'expiring') {
      matchesFilter = !!(item.expiryDate && item.expiryDate <= new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)); // Next 30 days
    }

    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Inventory Management</h3>
        </div>
        <div className="px-4 py-8 flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200 flex justify-between items-center">
          <div>
            <h3 className="text-lg leading-6 font-medium text-gray-900">Inventory Management</h3>
            <p className="mt-1 text-sm text-gray-500">Manage medicine stock and inventory</p>
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
          >
            <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
            Add Medicine
          </button>
        </div>

        {/* Search and Filter */}
        <div className="px-4 py-4 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search medicines..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as any)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Items</option>
                <option value="low-stock">Low Stock</option>
                <option value="expiring">Expiring Soon</option>
              </select>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="px-4 py-4">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{inventory.length}</div>
              <div className="text-sm text-gray-500">Total Items</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{lowStockItems.length}</div>
              <div className="text-sm text-gray-500">Low Stock</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {inventory.filter(item => item.expiryDate && item.expiryDate <= new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)).length}
              </div>
              <div className="text-sm text-gray-500">Expiring Soon</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {inventory.reduce((sum, item) => sum + item.quantity, 0)}
              </div>
              <div className="text-sm text-gray-500">Total Stock</div>
            </div>
          </div>
        </div>
      </div>

      {/* Add New Item Form */}
      {showAddForm && (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Add New Medicine</h3>
          </div>
          <form onSubmit={handleAddItem} className="px-4 py-5 sm:p-6 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Medicine Name *</label>
                <input
                  type="text"
                  required
                  value={newItem.name}
                  onChange={(e) => setNewItem({...newItem, name: e.target.value})}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Generic Name</label>
                <input
                  type="text"
                  value={newItem.genericName}
                  onChange={(e) => setNewItem({...newItem, genericName: e.target.value})}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Dosage *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., 500mg, 10mg/ml"
                  value={newItem.dosage}
                  onChange={(e) => setNewItem({...newItem, dosage: e.target.value})}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Form *</label>
                <select
                  value={newItem.form}
                  onChange={(e) => setNewItem({...newItem, form: e.target.value as InventoryItem['form']})}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="tablet">Tablet</option>
                  <option value="capsule">Capsule</option>
                  <option value="liquid">Liquid</option>
                  <option value="injection">Injection</option>
                  <option value="topical">Topical</option>
                  <option value="inhaler">Inhaler</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Initial Quantity *</label>
                <input
                  type="number"
                  required
                  min="0"
                  value={newItem.quantity}
                  onChange={(e) => setNewItem({...newItem, quantity: parseInt(e.target.value) || 0})}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Unit *</label>
                <select
                  value={newItem.unit}
                  onChange={(e) => setNewItem({...newItem, unit: e.target.value as InventoryItem['unit']})}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="tablets">Tablets</option>
                  <option value="capsules">Capsules</option>
                  <option value="ml">ml</option>
                  <option value="mg">mg</option>
                  <option value="units">Units</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Min Threshold</label>
                <input
                  type="number"
                  min="0"
                  value={newItem.minThreshold}
                  onChange={(e) => setNewItem({...newItem, minThreshold: parseInt(e.target.value) || 0})}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Max Stock</label>
                <input
                  type="number"
                  min="0"
                  value={newItem.maxStock}
                  onChange={(e) => setNewItem({...newItem, maxStock: parseInt(e.target.value) || 0})}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
              >
                Add Medicine
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Inventory Table */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Medicine
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stock
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredInventory.map((item) => {
                const isLowStock = item.quantity <= item.minThreshold;
                const isExpiringSoon = item.expiryDate && item.expiryDate <= new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

                return (
                  <tr key={item.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{item.name}</div>
                        <div className="text-sm text-gray-500">{item.dosage} • {item.form}</div>
                        {item.genericName && (
                          <div className="text-xs text-gray-400">{item.genericName}</div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {item.quantity} {item.unit}
                      </div>
                      <div className="text-xs text-gray-500">
                        Min: {item.minThreshold} • Max: {item.maxStock}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {isLowStock ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          <ExclamationTriangleIcon className="w-4 h-4 mr-1" />
                          Low Stock
                        </span>
                      ) : isExpiringSoon ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          Expiring Soon
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          In Stock
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button
                        onClick={() => handleStockAdjustment(item.id!, 10)}
                        className="text-green-600 hover:text-green-900"
                      >
                        +10
                      </button>
                      <button
                        onClick={() => handleStockAdjustment(item.id!, -1)}
                        className="text-red-600 hover:text-red-900"
                      >
                        -1
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
