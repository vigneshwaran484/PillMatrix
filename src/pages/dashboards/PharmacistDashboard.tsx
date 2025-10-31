import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { DocumentTextIcon, ClockIcon, ExclamationTriangleIcon, ShoppingCartIcon } from '@heroicons/react/24/outline';
import { DashboardLayout } from '../../components/DashboardLayout';
import { PrescriptionFulfillment } from '../../components/PrescriptionFulfillment';
import { InventoryManagement } from '../../components/InventoryManagement';
import { Prescription, getPendingPrescriptions } from '../../services/healthRecordService';
import { useAuth } from '../../contexts/AuthContext';
import { getAllInventoryItems, getLowStockItems, initializeSampleInventory } from '../../services/inventoryService';

type StatCardProps = {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  to: string;
  trend?: 'up' | 'down' | 'neutral';
};

const StatCard = ({ title, value, icon, to, trend = 'neutral' }: StatCardProps) => {
  const trendColors = {
    up: 'text-green-600',
    down: 'text-red-600',
    neutral: 'text-gray-500'
  };

  return (
    <Link to={to} className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow">
      <div className="p-5">
        <div className="flex items-center">
          <div className="flex-shrink-0 bg-blue-500 rounded-md p-3">
            {icon}
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
              <dd className="flex items-baseline">
                <div className="text-2xl font-semibold text-gray-900">{value}</div>
                {trend !== 'neutral' && (
                  <div className={`ml-2 flex items-baseline text-sm font-semibold ${trendColors[trend]}`}>
                    {trend === 'up' ? '↑' : '↓'} 12%
                  </div>
                )}
              </dd>
            </dl>
          </div>
        </div>
      </div>
    </Link>
  );
};

export function PharmacistDashboard() {
  const { user } = useAuth();
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [lowStockItems, setLowStockItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentView, setCurrentView] = useState<'prescriptions' | 'inventory'>('prescriptions');

  // Check authentication and role
  console.log('🔍 PharmacistDashboard: User object:', user);
  console.log('🔍 PharmacistDashboard: User role:', user?.role);
  console.log('🔍 PharmacistDashboard: User authenticated:', !!user);

  if (!user) {
    console.log('❌ PharmacistDashboard: No user found, redirecting to login');
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (user.role !== 'pharmacist') {
    console.log('❌ PharmacistDashboard: User is not a pharmacist, role is:', user.role);
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 font-semibold">Access Denied</p>
          <p className="text-gray-600">This page is only for pharmacists.</p>
          <p className="text-gray-500">Your role: {user.role}</p>
        </div>
      </div>
    );
  }

  console.log('✅ PharmacistDashboard: User authenticated as pharmacist');

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    try {
      setLoading(true);
      console.log('🔍 PharmacistDashboard: Loading prescriptions and inventory...');

      // Initialize sample inventory data if needed
      await initializeSampleInventory();

      const [prescriptionsData, inventoryData, lowStockData] = await Promise.all([
        getPendingPrescriptions(),
        getAllInventoryItems(),
        getLowStockItems(),
      ]);

      console.log('✅ PharmacistDashboard: Loaded prescriptions:', prescriptionsData.length);
      console.log('✅ PharmacistDashboard: Loaded inventory:', inventoryData.length);
      console.log('✅ PharmacistDashboard: Low stock items:', lowStockData.length);

      setPrescriptions(prescriptionsData);
      setLowStockItems(lowStockData);
    } catch (error) {
      console.error('❌ PharmacistDashboard: Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTimeAgo = (date: Date): string => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)} min ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hour${Math.floor(seconds / 3600) > 1 ? 's' : ''} ago`;
    return date.toLocaleDateString();
  };

  const getStatusDisplay = (status: Prescription['status']): { label: string; color: string } => {
    switch (status) {
      case 'pending':
        return { label: 'Needs Clarification', color: 'bg-yellow-100 text-yellow-800' };
      case 'filled':
        return { label: 'Ready', color: 'bg-green-100 text-green-800' };
      case 'refilled':
        return { label: 'Ready', color: 'bg-green-100 text-green-800' };
      default:
        return { label: 'In Progress', color: 'bg-blue-100 text-blue-800' };
    }
  };

  // Calculate stats from real data
  const pendingCount = prescriptions.filter(p => p.status === 'pending').length;
  const readyForPickupCount = prescriptions.filter(p => p.status === 'filled' || p.status === 'refilled').length;
  const deliveredCount = prescriptions.filter(p => p.status === 'delivered').length;
  const recentPrescriptions = prescriptions.slice(0, 3);

  const stats: Array<StatCardProps & { key: number }> = [
    { 
      title: 'To Fill', 
      value: pendingCount, 
      icon: <DocumentTextIcon className="h-6 w-6 text-white" />,
      to: '#prescriptions',
      trend: pendingCount > 10 ? 'up' as const : 'neutral' as const,
      key: 1
    },
    { 
      title: 'Ready for Pickup', 
      value: readyForPickupCount, 
      icon: <ClockIcon className="h-6 w-6 text-white" />,
      to: '#prescriptions',
      trend: 'neutral' as const,
      key: 2
    },
    { 
      title: 'Delivered Today', 
      value: deliveredCount, 
      icon: <ShoppingCartIcon className="h-6 w-6 text-white" />,
      to: '#prescriptions',
      trend: 'neutral' as const,
      key: 3
    },
    { 
      title: 'Low Stock Items', 
      value: lowStockItems.length, 
      icon: <ExclamationTriangleIcon className="h-6 w-6 text-white" />,
      to: '#inventory',
      trend: lowStockItems.length > 5 ? 'down' as const : 'neutral' as const,
      key: 4
    },
  ];

  return (
    <DashboardLayout
      icon="💊"
      title="Welcome back, Pharmacist!"
      subtitle="Process prescriptions and manage inventory"
      showAIChat={true}
    >
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            Pharmacy Dashboard
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Manage prescriptions and inventory efficiently.
          </p>
        </div>

        {/* Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map(({ key, ...statProps }) => (
          <div key={key} onClick={() => {
            if (statProps.to === '#prescriptions') setCurrentView('prescriptions');
            if (statProps.to === '#inventory') setCurrentView('inventory');
          }}>
            <StatCard {...statProps} />
          </div>
        ))}
      </div>

        {/* View Switcher */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <div className="flex space-x-4">
              <button
                onClick={() => setCurrentView('prescriptions')}
                className={`px-4 py-2 rounded-md text-sm font-medium ${
                  currentView === 'prescriptions'
                    ? 'bg-blue-100 text-blue-700 border-blue-300'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Prescription Management
              </button>
              <button
                onClick={() => setCurrentView('inventory')}
                className={`px-4 py-2 rounded-md text-sm font-medium ${
                  currentView === 'inventory'
                    ? 'bg-blue-100 text-blue-700 border-blue-300'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Inventory Management
              </button>
            </div>
          </div>
        </div>

        {/* Content based on current view */}
        {currentView === 'prescriptions' ? (
          <>
            {/* Recent Prescriptions */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                  <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Recent Prescriptions</h3>
                    <p className="mt-1 max-w-2xl text-sm text-gray-500">Latest prescription requests.</p>
                  </div>
                  <div className="overflow-x-auto">
                    {loading ? (
                      <div className="px-6 py-8 text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                      </div>
                    ) : recentPrescriptions.length === 0 ? (
                      <div className="px-6 py-8 text-center text-gray-500">
                        No recent prescriptions
                      </div>
                    ) : (
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Patient
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Medication
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Time
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {recentPrescriptions.map((rx) => {
                          const statusInfo = getStatusDisplay(rx.status);
                          return (
                          <tr key={rx.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {rx.patientName}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {rx.medications[0]?.name || 'N/A'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusInfo.color}`}>
                                {statusInfo.label}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {getTimeAgo(rx.createdAt)}
                            </td>
                          </tr>
                        )})}
                      </tbody>
                    </table>
                    )}
                  </div>
                  <div className="px-4 py-4 sm:px-6 border-t border-gray-200">
                    <button
                      onClick={() => setCurrentView('prescriptions')}
                      className="text-sm font-medium text-blue-600 hover:text-blue-500"
                    >
                      View all prescriptions
                    </button>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div>
                <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                  <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Quick Actions</h3>
                  </div>
                  <div className="px-4 py-5 sm:p-6 space-y-4">
                    <button
                      type="button"
                      className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      <DocumentTextIcon className="-ml-1 mr-2 h-5 w-5" />
                      Process New Prescription
                    </button>
                    <button
                      type="button"
                      className="w-full inline-flex justify-center items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      <ShoppingCartIcon className="-ml-1 mr-2 h-5 w-5 text-gray-500" />
                      Place Order
                    </button>
                    <button
                      type="button"
                      className="w-full inline-flex justify-center items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      <ClockIcon className="-ml-1 mr-2 h-5 w-5 text-gray-500" />
                      Check Order Status
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Prescription Fulfillment */}
            <PrescriptionFulfillment onUpdate={loadAllData} />
          </>
        ) : (
          /* Inventory Management View */
          <InventoryManagement onUpdate={loadAllData} />
        )}
      </div>
    </DashboardLayout>
  );
}
