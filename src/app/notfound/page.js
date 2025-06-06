import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Rocket, Home } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <motion.div
        className="text-center"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <motion.div
          className="mb-8"
          animate={{ 
            rotate: [0, 10, -10, 0],
            y: [0, -10, 10, 0]
          }}
          transition={{ 
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <Rocket className="w-24 h-24 text-cyber-cyan mx-auto mb-4" />
        </motion.div>
        
        <motion.h1
          className="text-6xl font-bold text-white mb-4"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
        >
          404
        </motion.h1>
        
        <motion.h2
          className="text-2xl font-semibold text-gray-300 mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          Mission Not Found
        </motion.h2>
        
        <motion.p
          className="text-gray-400 mb-8 max-w-md mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          The page you're looking for seems to have drifted into deep space. 
          Let's get you back to mission control.
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <Link
            to="/dashboard"
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-cyber-cyan to-neon-green text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            <Home className="w-5 h-5 mr-2" />
            Launch Back to Dashboard
          </Link>
        </motion.div>
        
        <motion.div
          className="mt-12 text-xs text-gray-500"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          Error Code: NAVIGATION_SYSTEM_FAILURE
        </motion.div>
      </motion.div>
    </div>
  );
};

export default NotFound;