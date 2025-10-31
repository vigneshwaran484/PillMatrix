import { Link, useNavigate } from 'react-router-dom';
import { ArrowRightOnRectangleIcon, BellIcon, UserCircleIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../contexts/AuthContext';

export function Header() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/how-it-works');
    } catch (error) {
      console.error('Logout error:', error);
      navigate('/how-it-works');
    }
  };

  if (!user) return null;

  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold text-primary">
            PillMatrix
          </Link>
          <div className="flex items-center gap-6">
            <button className="relative text-gray-600 hover:text-primary">
              <BellIcon className="w-6 h-6" />
              <span className="absolute top-0 right-0 w-2 h-2 bg-accent rounded-full"></span>
            </button>
            <div className="flex items-center gap-3">
              <UserCircleIcon className="w-8 h-8 text-primary" />
              <div className="text-sm text-left">
                <p className="font-semibold text-gray-900">{user.name || 'User'}</p>
                <p className="text-gray-600 capitalize">{user.role || 'Unknown'}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-primary hover:bg-blue-700 rounded-lg transition"
            >
              <ArrowRightOnRectangleIcon className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
