import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../hooks/useAuth';
import {
  LocationOnOutlined,
  MapOutlined,
  DashboardOutlined,
  LogoutOutlined,
  LoginOutlined,
  MenuOutlined,
  CloseOutlined,
} from '@mui/icons-material';
import { useState } from 'react';

const Header = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  const navLinkClass = (path) => `
    relative flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-300
    ${isActive(path)
      ? 'text-blue-400 bg-blue-500/20'
      : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
    }
  `;

  const activeIndicator = (path) => {
    return isActive(path) ? (
      <motion.div
        layoutId="activeIndicator"
        className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-t-lg"
        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
      />
    ) : null;
  };

  return (
    <header className="sticky top-0 z-40 bg-gradient-to-b from-gray-900 to-gray-800 border-b border-gray-700/50 backdrop-blur-xl">
      <div className="container-custom">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-3 text-xl md:text-2xl font-bold group"
          >
            <motion.div
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg group-hover:shadow-lg group-hover:shadow-blue-500/50 transition-all"
            >
              <LocationOnOutlined className="text-white" fontSize="large" />
            </motion.div>
            <div className="flex flex-col">
              <span className="text-white">Stamp</span>
              <span className="text-xs text-gray-400 font-normal">Locations</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-2">
            {isAuthenticated ? (
              <>
                <div className="flex items-center gap-2">
                  <Link to="/dashboard" className="relative">
                    <div className={navLinkClass('/dashboard')}>
                      <DashboardOutlined fontSize="small" />
                      Dashboard
                      {activeIndicator('/dashboard')}
                    </div>
                  </Link>

                  <Link to="/map" className="relative">
                    <div className={navLinkClass('/map')}>
                      <MapOutlined fontSize="small" />
                      Map
                      {activeIndicator('/map')}
                    </div>
                  </Link>
                </div>

                <div className="flex items-center gap-4 ml-6 pl-6 border-l border-gray-700">
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center gap-3"
                  >
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold text-sm">
                      {user?.name?.charAt(0)?.toUpperCase()}
                    </div>
                    <span className="text-sm text-gray-400 hidden lg:block">
                      Hi, <span className="text-white font-medium">{user?.name}</span>
                    </span>
                  </motion.div>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-lg font-medium transition-all hover:shadow-lg hover:shadow-red-500/30"
                  >
                    <LogoutOutlined fontSize="small" />
                    Logout
                  </motion.button>
                </div>
              </>
            ) : (
              <Link to="/login">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white rounded-lg font-medium transition-all hover:shadow-lg hover:shadow-blue-500/30"
                >
                  <LoginOutlined fontSize="small" />
                  Login
                </motion.div>
              </Link>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-white p-2 hover:bg-gray-700 rounded-lg transition-colors"
          >
            {mobileMenuOpen ? (
              <CloseOutlined fontSize="large" />
            ) : (
              <MenuOutlined fontSize="large" />
            )}
          </motion.button>
        </div>

        {/* Mobile Navigation */}
        <motion.nav
          initial={false}
          animate={mobileMenuOpen ? 'open' : 'closed'}
          variants={{
            open: { opacity: 1, height: 'auto' },
            closed: { opacity: 0, height: 0 },
          }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="md:hidden overflow-hidden border-t border-gray-700/50"
        >
          <div className="px-4 py-6 space-y-3">
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                  <motion.div
                    className={`${navLinkClass('/dashboard')} rounded-lg`}
                  >
                    <DashboardOutlined fontSize="small" />
                    Dashboard
                  </motion.div>
                </Link>

                <Link to="/map" onClick={() => setMobileMenuOpen(false)}>
                  <motion.div
                    className={`${navLinkClass('/map')} rounded-lg`}
                  >
                    <MapOutlined fontSize="small" />
                    Map
                  </motion.div>
                </Link>

                <div className="pt-4 border-t border-gray-700">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold">
                      {user?.name?.charAt(0)?.toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">{user?.name}</p>
                      <p className="text-xs text-gray-500">{user?.email}</p>
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-lg font-medium transition-all"
                  >
                    <LogoutOutlined fontSize="small" />
                    Logout
                  </motion.button>
                </div>
              </>
            ) : (
              <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                <motion.div
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg font-medium w-full"
                >
                  <LoginOutlined fontSize="small" />
                  Login
                </motion.div>
              </Link>
            )}
          </div>
        </motion.nav>
      </div>
    </header>
  );
};

export default Header;