import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function NotFound() {
  const { user } = useAuth();
  const redirectPath = user ? '/dashboard' : '/';

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 to-blue-100 flex items-center justify-center px-4">
      <div className="text-center">
        <motion.h1 
          className="text-9xl font-bold bg-gradient-to-r from-pink-500 to-blue-500 bg-clip-text text-transparent"
          animate={{ 
            y: [0, -20, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        >
          404
        </motion.h1>
        <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mt-8 mb-4">
          Oops! Page not found
        </h2>
        <p className="text-gray-600 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link 
          to={redirectPath}
          className="inline-block bg-gradient-to-r from-pink-500 to-blue-500 text-white px-8 py-3 rounded-full 
            hover:shadow-lg transform hover:scale-105 transition-all duration-300"
        >
          Go Back Home
        </Link>
      </div>
    </div>
  );
}