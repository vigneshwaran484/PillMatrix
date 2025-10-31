import { Link } from 'react-router-dom';
import { ArrowRightOnRectangleIcon, BellIcon, UserCircleIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/how-it-works');
    } catch (error) {
      console.error('Logout error:', error);
      navigate('/how-it-works');
    }
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold text-primary">
            PillMatrix
          </Link>
          {user ? (
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
          ) : (
            <div className="flex items-center gap-4">
              <Link to="/login" className="text-gray-600 hover:text-primary">
                Login
              </Link>
              <Link 
                to="/register" 
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-700 transition"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
