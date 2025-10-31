import { Outlet, Link } from 'react-router-dom';
import { UserCircleIcon, Cog6ToothIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';

type DashboardLayoutProps = {
  userRole: 'patient' | 'doctor' | 'pharmacist' | 'lab';
  userName: string;
};

export default function DashboardLayout({ userRole, userName }: DashboardLayoutProps) {
  const roleDisplay = {
    patient: 'Patient',
    doctor: 'Doctor',
    pharmacist: 'Pharmacist',
    lab: 'Lab Technician'
  };

  const navItems = {
    patient: [
      { name: 'Dashboard', path: '/dashboard' },
      { name: 'Prescriptions', path: '/dashboard/prescriptions' },
      { name: 'Lab Reports', path: '/dashboard/lab-reports' },
      { name: 'Appointments', path: '/dashboard/appointments' },
    ],
    doctor: [
      { name: 'Dashboard', path: '/dashboard' },
      { name: 'Patients', path: '/dashboard/patients' },
      { name: 'Appointments', path: '/dashboard/appointments' },
      { name: 'Prescriptions', path: '/dashboard/prescriptions' },
    ],
    pharmacist: [
      { name: 'Dashboard', path: '/dashboard' },
      { name: 'Prescriptions', path: '/dashboard/prescriptions' },
      { name: 'Inventory', path: '/dashboard/inventory' },
      { name: 'Patients', path: '/dashboard/patients' },
    ],
    lab: [
      { name: 'Dashboard', path: '/dashboard' },
      { name: 'Tests', path: '/dashboard/tests' },
      { name: 'Reports', path: '/dashboard/reports' },
      { name: 'Patients', path: '/dashboard/patients' },
    ]
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-lg">
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-center h-16 bg-blue-600 text-white">
            <h1 className="text-xl font-bold">PillMatrix</h1>
          </div>

          {/* User Profile */}
          <div className="p-4 flex items-center space-x-3 border-b">
            <UserCircleIcon className="h-10 w-10 text-gray-400" />
            <div>
              <p className="font-medium">{userName}</p>
              <p className="text-sm text-gray-500">{roleDisplay[userRole]}</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-2 py-4 space-y-1">
            {navItems[userRole].map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t">
            <button className="flex items-center w-full text-left text-sm font-medium text-gray-700 hover:text-gray-900">
              <Cog6ToothIcon className="mr-3 h-5 w-5 text-gray-400" />
              Settings
            </button>
            <button className="mt-2 flex items-center w-full text-left text-sm font-medium text-red-600 hover:text-red-800">
              <ArrowRightOnRectangleIcon className="mr-3 h-5 w-5" />
              Sign out
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="pl-64">
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
