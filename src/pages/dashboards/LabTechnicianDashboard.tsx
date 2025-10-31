import { Link } from 'react-router-dom';
import { DocumentTextIcon, ClockIcon, UserGroupIcon, BeakerIcon } from '@heroicons/react/24/outline';
import { DashboardLayout } from '../../components/DashboardLayout';

type StatCardProps = {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  to: string;
  trend?: 'up' | 'down' | 'neutral';
};

const StatCard = ({ title, value, icon, to }: StatCardProps) => (
  <Link to={to} className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow">
    <div className="p-5">
      <div className="flex items-center">
        <div className="flex-shrink-0 bg-blue-500 rounded-md p-3">
          {icon}
        </div>
        <div className="ml-5 w-0 flex-1">
          <dl>
            <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
            <dd>
              <div className="text-lg font-medium text-gray-900">{value}</div>
            </dd>
          </dl>
        </div>
      </div>
    </div>
  </Link>
);

export default function LabTechnicianDashboard() {
  // Mock data - replace with real data from your API
  const stats = [
    { 
      title: 'Tests Today', 
      value: '15', 
      icon: <BeakerIcon className="h-6 w-6 text-white" />,
      to: '/dashboard/tests',
      trend: 'up' as const
    },
    { 
      title: 'Pending Results', 
      value: '7', 
      icon: <ClockIcon className="h-6 w-6 text-white" />,
      to: '/dashboard/pending-results',
      trend: 'down' as const
    },
    { 
      title: 'Completed Today', 
      value: '8', 
      icon: <DocumentTextIcon className="h-6 w-6 text-white" />,
      to: '/dashboard/completed-tests',
      trend: 'up' as const
    },
    { 
      title: 'Patients Today', 
      value: '12', 
      icon: <UserGroupIcon className="h-6 w-6 text-white" />,
      to: '/dashboard/patients'
    },
  ];

  const recentTests = [
    { id: 1, patient: 'John Doe', test: 'CBC', status: 'In Progress', time: '30 min ago' },
    { id: 2, patient: 'Jane Smith', test: 'Lipid Panel', status: 'Ready', time: '1 hour ago' },
    { id: 3, patient: 'Robert Johnson', test: 'Glucose Test', status: 'Pending', time: '2 hours ago' },
  ];

  return (
    <DashboardLayout
      icon="🔬"
      title="Welcome back, Lab Technician!"
      subtitle="Upload and manage lab reports"
      showAIChat={true}
    >
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            Lab Dashboard
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Manage lab tests and patient results efficiently.
          </p>
        </div>

        {/* Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cords-3 gap-6">
        {/* Recent Tests */}
        <div className="lg:col-span-2">
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Recent Tests</h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">Latest test results and status.</p>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Patient
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Test
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
                  {recentTests.map((test) => (
                    <tr key={test.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {test.patient}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {test.test}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${test.status === 'Ready' ? 'bg-green-100 text-green-800' : 
                            test.status === 'In Progress' ? 'bg-blue-100 text-blue-800' : 
                            'bg-yellow-100 text-yellow-800'}`}>
                          {test.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {test.time}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-4 py-4 sm:px-6 border-t border-gray-200">
              <Link to="/dashboard/tests" className="text-sm font-medium text-blue-600 hover:text-blue-500">
                View all tests
              </Link>
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
                <BeakerIcon className="-ml-1 mr-2 h-5 w-5" />
                Record New Test
              </button>
              <button
                type="button"
                className="w-full inline-flex justify-center items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <DocumentTextIcon className="-ml-1 mr-2 h-5 w-5 text-gray-500" />
                Upload Results
              </button>
              <button
                type="button"
                className="w-full inline-flex justify-center items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <UserGroupIcon className="-ml-1 mr-2 h-5 w-5 text-gray-500" />
                View Patient History
              </button>
            </div>
          </div>

          {/* Test Queue */}
          <div className="mt-6 bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Test Queue</h3>
              <p className="mt-1 text-sm text-gray-500">Tests waiting to be processed</p>
            </div>
            <div className="px-4 py-5 sm:p-6">
              <div className="space-y-4">
                {[1, 2].map((item) => (
                  <div key={item} className="border-l-4 border-blue-500 pl-4 py-2">
                    <p className="text-sm font-medium text-gray-900">New Test Request</p>
                    <p className="text-sm text-gray-500">Patient: John Doe - CBC Test</p>
                    <p className="text-xs text-gray-400 mt-1">15 minutes ago</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
    </DashboardLayout>
  );
}
