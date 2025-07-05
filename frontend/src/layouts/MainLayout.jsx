import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../features/auth/authSlice';
import Sidebar from '../components/Sidebar';
import { useState } from 'react';

export default function MainLayout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleAddTask = () => {
    window.dispatchEvent(new CustomEvent('addTask'));
  };

  const handleAddCategory = () => {
    window.dispatchEvent(new CustomEvent('addCategory'));
  };

  const handleShowReminders = () => {
    window.dispatchEvent(new CustomEvent('showReminders'));
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Navigation Header */}
      <header className="bg-blue-600 text-white shadow-lg relative">
        <div className="px-4 sm:px-6 py-2 flex justify-between items-center">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Sidebar Toggle for Mobile */}
            <button
              onClick={toggleSidebar}
              className="md:hidden text-white p-2 rounded-lg hover:bg-white hover:bg-opacity-10 transition-colors"
              aria-label="Toggle sidebar"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <span className="text-lg sm:text-xl font-bold">📋</span>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-lg sm:text-xl font-bold">Smart Task Manager</h1>
                <p className="text-blue-100 text-xs sm:text-sm">Organize your life, one task at a time</p>
              </div>
              <div className="sm:hidden">
                <h1 className="text-lg font-bold">Task Manager</h1>
              </div>
            </div>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {/* Navigation Links */}
            <nav className="flex space-x-4">
              <button
                onClick={() => navigate('/')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  location.pathname === '/' 
                    ? 'bg-white bg-opacity-20 text-white' 
                    : 'text-blue-100 hover:bg-white hover:bg-opacity-10'
                }`}
              >
                📊 Dashboard
              </button>
              <button
                onClick={() => navigate('/statistics')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  location.pathname === '/statistics' 
                    ? 'bg-white bg-opacity-20 text-white' 
                    : 'text-blue-100 hover:bg-white hover:bg-opacity-10'
                }`}
              >
                📈 Statistics
              </button>
            </nav>

            {/* User Info */}
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="font-medium">Welcome back,</p>
                <p className="text-blue-100">{user?.name || 'User'}</p>
              </div>
              <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <span className="text-lg font-bold">
                  {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="bg-white bg-opacity-20 text-white px-4 py-2 rounded-lg hover:bg-opacity-30 transition-all duration-200 font-medium"
              >
                Logout
              </button>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-3">
            {/* Reminders Button for Mobile */}
            <button
              onClick={handleShowReminders}
              className="text-white p-2 rounded-lg hover:bg-white hover:bg-opacity-10 transition-colors"
              aria-label="Show Reminders"
              title="Reminders"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>
            
            <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <span className="text-sm font-bold">
                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
              </span>
            </div>
            <button
              onClick={toggleMobileMenu}
              className="text-white p-2 rounded-lg hover:bg-white hover:bg-opacity-10 transition-colors"
              aria-label="Toggle mobile menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg z-50">
            <div className="px-4 py-4 space-y-4">
              {/* Mobile Navigation Links */}
              <nav className="space-y-2">
                <button
                  onClick={() => {
                    navigate('/');
                    closeMobileMenu();
                  }}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                    location.pathname === '/' 
                      ? 'bg-white bg-opacity-20 text-white' 
                      : 'text-blue-100 hover:bg-white hover:bg-opacity-10'
                  }`}
                >
                  📊 Dashboard
                </button>
                <button
                  onClick={() => {
                    navigate('/statistics');
                    closeMobileMenu();
                  }}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                    location.pathname === '/statistics' 
                      ? 'bg-white bg-opacity-20 text-white' 
                      : 'text-blue-100 hover:bg-white hover:bg-opacity-10'
                  }`}
                >
                  📈 Statistics
                </button>
              </nav>

              {/* Mobile User Info */}
              <div className="border-t border-white border-opacity-20 pt-4">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                    <span className="text-lg font-bold">
                      {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium">Welcome back,</p>
                    <p className="text-blue-100">{user?.name || 'User'}</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    handleLogout();
                    closeMobileMenu();
                  }}
                  className="w-full bg-white bg-opacity-20 text-white px-4 py-3 rounded-lg hover:bg-opacity-30 transition-all duration-200 font-medium"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <div className="flex flex-1">
        <Sidebar 
          onAddTask={handleAddTask} 
          onAddCategory={handleAddCategory} 
          onShowReminders={handleShowReminders}
          isMobileOpen={isSidebarOpen}
          onMobileClose={closeSidebar}
        />
        <main className="flex-1 p-4 sm:p-8">{children}</main>
      </div>

      {/* Floating Action Button for Mobile */}
      <button
        onClick={handleAddTask}
        className="md:hidden fixed bottom-6 right-6 w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-all duration-200 z-30 flex items-center justify-center"
        aria-label="Add Task"
        title="Add Task"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      </button>
    </div>
  );
} 