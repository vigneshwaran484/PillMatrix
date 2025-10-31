import Link from 'next/link';
import Image from 'next/image';

const Header = () => {
  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="flex items-center space-x-2">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-white font-bold text-xl">
            PM
          </div>
          <span className="text-xl font-bold text-gray-800">PillMatrix</span>
        </Link>
        
        <nav className="hidden md:flex space-x-8">
          <Link href="/how-it-works" className="text-gray-600 hover:text-primary transition-colors">
            How It Works
          </Link>
          <Link href="/features" className="text-gray-600 hover:text-primary transition-colors">
            Features
          </Link>
          <Link href="/for-institutions" className="text-gray-600 hover:text-primary transition-colors">
            For Institutions
          </Link>
          <Link href="/security" className="text-gray-600 hover:text-primary transition-colors">
            Security
          </Link>
          <Link href="/contact" className="text-gray-600 hover:text-primary transition-colors">
            Contact
          </Link>
        </nav>

        <div className="flex items-center space-x-4">
          <Link 
            href="/login" 
            className="px-4 py-2 text-primary border border-primary rounded-lg hover:bg-primary hover:text-white transition-colors"
          >
            Login
          </Link>
          <Link 
            href="/register" 
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-opacity-90 transition-colors"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
