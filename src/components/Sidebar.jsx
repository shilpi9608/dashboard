import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, Plus, X } from 'lucide-react';

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();

  const navItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/create-mission', icon: Plus, label: 'Create Mission' }
  ];

  const sidebarVariants = {
    open: {
      x: 0,
      transition: { type: 'spring', stiffness: 300, damping: 30 }
    },
    closed: {
      x: '-100%',
      transition: { type: 'spring', stiffness: 300, damping: 30 }
    }
  };

  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.nav
        className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 glass-panel z-50 lg:z-30"
        variants={sidebarVariants}
        initial="closed"
        animate={isOpen ? 'open' : 'closed'}
      >
        <div className="p-6">
          <button
            onClick={onClose}
            className="lg:hidden glass-button p-2 rounded-lg mb-6"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="space-y-2">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={onClose}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                    isActive
                      ? 'bg-cyber-cyan/20 text-cyber-cyan neon-glow'
                      : 'text-gray-300 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <item.icon className={`w-5 h-5 ${isActive ? 'text-cyber-cyan' : ''}`} />
                  <span className="font-medium">{item.label}</span>
                </NavLink>
              );
            })}
          </div>
        </div>
      </motion.nav>

      {/* Desktop sidebar spacer */}
      <div className="hidden lg:block w-64 flex-shrink-0" />
    </>
  );
};

export default Sidebar;