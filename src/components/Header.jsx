import React from 'react';
import { motion } from 'framer-motion';
import { Menu, LogOut, Rocket } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Header = ({ onMenuClick }) => {
  const { user, logout } = useAuth();

  return (
    <motion.header 
      className="glass-panel fixed top-0 left-0 right-0 z-50 px-6 py-4"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={onMenuClick}
            className="lg:hidden glass-button p-2 rounded-lg"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-cyber-cyan to-neon-green rounded-lg flex items-center justify-center">
              <Rocket className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-cyber-cyan to-neon-green bg-clip-text text-transparent">
              Mission Control
            </h1>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-300">{user?.email}</span>
          <button
            onClick={logout}
            className="glass-button p-2 rounded-lg hover:bg-red-500/20 transition-colors"
            title="Sign Out"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;