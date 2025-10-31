import { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../contexts/AuthContext';

type AuthMode = 'signin' | 'register';
type UserRole = 'patient' | 'doctor' | 'pharmacist' | 'lab';

export function Login() {
  const [mode, setMode] = useState<AuthMode>('signin');
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    governmentId: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const { login, register, user } = useAuth();
  const navigate = useNavigate();

  // Navigate to role-specific dashboard when user logs in
  useEffect(() => {
    if (user && mode === 'signin') {
      const dashboardPath = user.role === 'patient' ? '/dashboard/patient' :
                           user.role === 'doctor' ? '/dashboard/doctor' :
                           user.role === 'pharmacist' ? '/dashboard/pharmacist' :
                           '/dashboard/lab';
      navigate(dashboardPath);
    }
  }, [user, mode, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (mode === 'signin') {
        // Sign in validation
        if (!formData.email || !formData.password) {
          throw new Error('Please fill in all fields');
        }

        // Authenticate with Firebase
        await login(formData.email, formData.password);

        // Navigation will happen automatically through AuthContext
        // since the component will re-render when authentication state changes

      } else {
        // Registration validation
        if (!formData.firstName || !formData.lastName || !formData.email || !formData.password || !formData.confirmPassword) {
          throw new Error('Please fill in all required fields');
        }
        if (formData.password !== formData.confirmPassword) {
          throw new Error('Passwords do not match');
        }
        if (formData.password.length < 8) {
          throw new Error('Password must be at least 8 characters');
        }
        if (userRole !== 'patient' && !formData.governmentId) {
          throw new Error('Government ID is required for professionals');
        }

        // Register with Firebase
        const userData = {
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          role: userRole || 'patient',
          ...(userRole !== 'patient' && { governmentId: formData.governmentId }),
          password: formData.password,
        };

        await register(userData);

        // Show success message and switch to sign in
        setSuccess(true);
        setTimeout(() => {
          setMode('signin');
          setSuccess(false);
          setUserRole(null);
          setFormData({
            email: '',
            password: '',
            confirmPassword: '',
            firstName: '',
            lastName: '',
            governmentId: '',
          });
        }, 2000);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const roleInfo = {
    patient: {
      title: 'Patient',
      icon: '👤',
      description: 'Manage your prescriptions and medications',
    },
    doctor: {
      title: 'Doctor',
      icon: '👨‍⚕️',
      description: 'Issue and manage digital prescriptions',
    },
    pharmacist: {
      title: 'Pharmacist',
      icon: '💊',
      description: 'Dispense and verify prescriptions',
    },
    lab: {
      title: 'Lab Technician',
      icon: '🔬',
      description: 'Upload and manage lab reports',
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center py-12 px-4">
      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-900 font-semibold">Signing you in...</p>
            <p className="text-gray-600 text-sm mt-2">Please wait while we authenticate your account</p>
          </div>
        </div>
      )}

      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-block">
            <span className="text-3xl font-bold text-white">PillMatrix</span>
          </Link>
        </div>

        {/* Sign In Tab */}
        {mode === 'signin' && !userRole && (
          <div className="bg-white rounded-xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Sign In</h2>

            {success && (
              <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 text-green-700 text-center">
                ✓ Sign in successful! Welcome back!
              </div>
            )}

            {error && (
              <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 text-center">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-900 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-gray-900 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? (
                      <EyeSlashIcon className="w-5 h-5" />
                    ) : (
                      <EyeIcon className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full btn-primary bg-accent hover:bg-orange-500 mt-6 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Signing in...
                  </>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-600">
                Don't have an account?{' '}
                <button
                  onClick={() => setMode('register')}
                  className="text-primary font-semibold hover:underline"
                >
                  Create one
                </button>
              </p>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <a href="#" className="text-sm text-primary hover:underline block text-center">
                Forgot your password?
              </a>
            </div>
          </div>
        )}

        {/* Register Role Selection */}
        {mode === 'register' && !userRole && (
          <div className="bg-white rounded-xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">Create Account</h2>
            <p className="text-gray-600 text-center mb-8">Join PillMatrix as a...</p>

            <div className="space-y-4">
              {(Object.keys(roleInfo) as UserRole[]).map((role) => (
                <button
                  key={role}
                  onClick={() => setUserRole(role)}
                  className="w-full p-4 border-2 border-gray-200 rounded-lg hover:border-primary hover:bg-blue-50 transition text-left"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{roleInfo[role].icon}</span>
                    <div>
                      <p className="font-bold text-gray-900">{roleInfo[role].title}</p>
                      <p className="text-sm text-gray-600">{roleInfo[role].description}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            <div className="mt-6 text-center">
              <p className="text-gray-600">
                Already have an account?{' '}
                <button
                  onClick={() => setMode('signin')}
                  className="text-primary font-semibold hover:underline"
                >
                  Sign in
                </button>
              </p>
            </div>
          </div>
        )}

        {/* Register Form */}
        {mode === 'register' && userRole && (
          <div className="bg-white rounded-xl shadow-xl p-8">
            {success ? (
              <div className="text-center py-8">
                <div className="text-5xl mb-4">✓</div>
                <h3 className="text-2xl font-bold text-green-600 mb-2">Account Created!</h3>
                <p className="text-gray-600">Welcome to PillMatrix. Redirecting to sign in...</p>
              </div>
            ) : (
              <>
                <button
                  onClick={() => setUserRole(null)}
                  className="text-primary hover:underline text-sm font-semibold mb-4"
                >
                  ← Back to role selection
                </button>

                <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                  Register as {roleInfo[userRole].title}
                </h2>

                {error && (
                  <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 text-center">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-semibold text-gray-900 mb-2">
                    First Name
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
                    placeholder="John"
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-semibold text-gray-900 mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
                    placeholder="Doe"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-900 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
                  placeholder="you@example.com"
                />
              </div>

              {/* Government ID for professionals */}
              {userRole !== 'patient' && (
                <div>
                  <label htmlFor="governmentId" className="block text-sm font-semibold text-gray-900 mb-2">
                    Official Government ID Number (e.g., Aadhaar)
                    <span className="text-xs text-gray-500 ml-1 block font-normal mt-1">
                      For verification purposes to ensure the security and integrity of the PillMatrix network.
                    </span>
                  </label>
                  <input
                    type="text"
                    id="governmentId"
                    name="governmentId"
                    value={formData.governmentId}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
                    placeholder="XXXX XXXX XXXX XXXX"
                  />
                </div>
              )}

              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-gray-900 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? (
                      <EyeSlashIcon className="w-5 h-5" />
                    ) : (
                      <EyeIcon className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-900 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div className="flex items-start gap-2">
                <input
                  type="checkbox"
                  id="terms"
                  required
                  className="mt-1 rounded border-gray-300"
                />
                <label htmlFor="terms" className="text-sm text-gray-600">
                  I agree to the{' '}
                  <a href="#" className="text-primary hover:underline">
                    Terms of Service
                  </a>{' '}
                  and{' '}
                  <a href="#" className="text-primary hover:underline">
                    Privacy Policy
                  </a>
                </label>
              </div>

                  <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full btn-primary bg-accent hover:bg-orange-500 mt-6 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Creating Account...
                      </>
                    ) : (
                      'Create Account'
                    )}
                  </button>
                </form>

                <div className="mt-6 text-center">
                  <p className="text-gray-600">
                    Already have an account?{' '}
                    <button
                      onClick={() => {
                        setMode('signin');
                        setUserRole(null);
                      }}
                      className="text-primary font-semibold hover:underline"
                    >
                      Sign in
                    </button>
                  </p>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
