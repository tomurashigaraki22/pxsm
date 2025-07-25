import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext'; // Add this import

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth(); // Add this

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled ? 'py-2 bg-white/90 shadow-md backdrop-blur-md' : 'py-4 bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ delay: 0.2 }}
  className="flex items-center gap-2"
>
  <Link to="/" className="flex items-center gap-2">
    <img
      src={require("../../public/logo.jpg")}  // public folder access
      alt="SocialBoost Logo"
      className="w-32 h-16 rounded-full object-cover"
    />
  </Link>
</motion.div>


          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {!user ? (
              // Public navigation items
              <>
                <Link to="/login" className="text-gray-600 hover:text-pink-500">
                  Services
                </Link>
                <Link to="/login" className="text-gray-600 hover:text-pink-500">
                  Login
                </Link>
                <Link to="/signup" className="text-gray-600 hover:text-pink-500">
                  Sign Up
                </Link>
              </>
            ) : (
              // Authenticated navigation items
              <>
                <Link to="/wallet" className="text-gray-600 hover:text-pink-500">Wallet</Link>
                <Link to="/services" className="text-gray-600 hover:text-pink-500">Services</Link>
                <Link to="/order-history" className="text-gray-600 hover:text-pink-500">Order History</Link>
              </>
            )}
          </div>

          {/* User Menu / Auth Buttons */}
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <span className="hidden md:inline text-sm font-medium text-gray-700">{user.username}</span>
                <span className="hidden md:inline px-3 py-1 text-sm font-medium text-green-800 bg-green-100 rounded-full">
                  ₦{user.balance?.toLocaleString() ?? '0'}
                </span>
                <button 
                  onClick={logout}
                  className="hidden md:inline text-sm text-red-600 hover:text-red-500"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link to="/login">
                <motion.button
                  className="px-5 py-2 rounded-full bg-gradient-to-r from-pink-500 to-blue-500 text-white text-sm font-medium"
                  whileHover={{ scale: 1.05 }}
                >
                  Sign In
                </motion.button>
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-gray-800"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden mt-4 bg-white rounded-lg shadow-lg p-4"
          >
            {user ? (
              // Authenticated mobile menu
              <div className="flex flex-col space-y-4">
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm font-medium text-gray-700">{user.username}</span>
                  <span className="px-3 py-1 text-sm font-medium text-green-800 bg-green-100 rounded-full">
                    ₦{user.balance?.toLocaleString() ?? '0'}
                  </span>
                </div>
                <Link to="/wallet" className="text-gray-600 hover:text-pink-500 py-2">Wallet</Link>
                <Link to="/services" className="text-gray-600 hover:text-pink-500 py-2">Services</Link>
                <button 
                  onClick={logout}
                  className="text-red-600 hover:text-red-500 py-2 text-left"
                >
                  Logout
                </button>
              </div>
            ) : (
              // Public mobile menu
              <div className="flex flex-col space-y-4">
                <Link
                  to="/login"
                  className="text-gray-600 hover:text-pink-500 py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Services
                </Link>
                <Link
                  to="/login"
                  className="text-gray-600 hover:text-pink-500 py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="text-gray-600 hover:text-pink-500 py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </motion.nav>
  );
};

export default Navbar;
