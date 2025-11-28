import React, { useState } from 'react';
import { ChevronDownIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoginForm from '../pages/Auth/Login';

const MobileHeader = () => {
  const navigate = useNavigate();
  const { isAuthenticated, userPhone } = useAuth();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isServicesDropdownOpen, setIsServicesDropdownOpen] = useState(false);

  const openLoginModal = () => setIsLoginModalOpen(true);
  const closeLoginModal = () => setIsLoginModalOpen(false);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  const handleNavigation = (path) => {
    navigate(path);
    closeMobileMenu();
  };

  return (
    <header className="w-full bg-white shadow-sm">
      {/* Main Mobile Header Section */}
      <div className="flex justify-between items-center px-4 py-3">
        {/* Mobile Menu Button */}
        <button
          onClick={toggleMobileMenu}
          className="p-2 text-gray-600 hover:text-gray-800 focus:outline-none"
        >
          {isMobileMenuOpen ? (
            <XMarkIcon className="h-6 w-6" />
          ) : (
            <Bars3Icon className="h-6 w-6" />
          )}
        </button>

        {/* Logo Section */}
        <div className="flex items-center">
          <img
            src="/src/assets/logo.png"
            alt="Marriage Paper Logo"
            className="h-10 w-auto"
          />
        </div>

        {/* Action Buttons Section */}
        <div className="flex items-center space-x-2">
          {!isAuthenticated ? (
            <button 
              onClick={openLoginModal} 
              className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-md text-xs font-medium transition-colors"
            >
              Login
            </button>
          ) : (
            <button 
              onClick={() => navigate('/dashboard')} 
              className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-2 rounded-md text-xs font-medium transition-colors"
            >
              Profile
            </button>
          )}
          <button 
            onClick={() => navigate('/profiles')} 
            className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-md text-xs font-medium transition-colors"
          >
            Search
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`bg-white border-t border-gray-200 ${isMobileMenuOpen ? 'block' : 'hidden'}`}>
        <div className="px-4 py-2 space-y-1">
          <button 
            onClick={() => handleNavigation('/')} 
            className="block w-full text-left px-3 py-3 text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors"
          >
            Home
          </button>
          <button 
            onClick={() => handleNavigation('/about')} 
            className="block w-full text-left px-3 py-3 text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors"
          >
            About Us
          </button>
          
          {/* Mobile Services Section */}
          <div>
            <button
              onClick={() => setIsServicesDropdownOpen(!isServicesDropdownOpen)}
              className="flex items-center justify-between w-full px-3 py-3 text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors"
            >
              <span>Our Services</span>
              <ChevronDownIcon className={`w-4 h-4 transform transition-transform ${isServicesDropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            
            {isServicesDropdownOpen && (
              <div className="pl-6 space-y-1 mt-1">
                <button 
                  onClick={() => handleNavigation('/workflow')} 
                  className="block w-full text-left px-3 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-md transition-colors"
                >
                  Our Workflow
                </button>
                <button 
                  onClick={() => handleNavigation('/proposal')} 
                  className="block w-full text-left px-3 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-md transition-colors"
                >
                  Proposal Services
                </button>
                <button 
                  onClick={() => handleNavigation('/yet-to-marry')} 
                  className="block w-full text-left px-3 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-md transition-colors"
                >
                  Yet To Marry
                </button>
                <button 
                  onClick={() => handleNavigation('/announcement')} 
                  className="block w-full text-left px-3 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-md transition-colors"
                >
                  Announcement
                </button>
              </div>
            )}
          </div>
          
          <button 
            onClick={() => handleNavigation('/benefit')} 
            className="block w-full text-left px-3 py-3 text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors"
          >
            Benefit
          </button>
          <button 
            onClick={() => handleNavigation('/blogs')} 
            className="block w-full text-left px-3 py-3 text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors"
          >
            Blog
          </button>
          <button 
            onClick={() => handleNavigation('/profiles')} 
            className="block w-full text-left px-3 py-3 text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors"
          >
            Find Match
          </button>
          <button 
            onClick={() => handleNavigation('/plans')} 
            className="block w-full text-left px-3 py-3 text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors"
          >
            Plans
          </button>
          <button 
            onClick={() => handleNavigation('/fees')} 
            className="block w-full text-left px-3 py-3 text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors"
          >
            Fees & Offer
          </button>

          {/* Mobile Auth Section */}
          {!isAuthenticated && (
            <div className="pt-3 border-t border-gray-200 mt-3">
              <button 
                onClick={() => { openLoginModal(); closeMobileMenu(); }} 
                className="block w-full text-center px-3 py-3 text-red-600 hover:bg-red-50 rounded-md transition-colors font-medium"
              >
                Login
              </button>
              <button 
                onClick={() => handleNavigation('/register')} 
                className="block w-full text-center px-3 py-3 text-red-600 hover:bg-red-50 rounded-md transition-colors font-medium mt-2"
              >
                Post Ad
              </button>
            </div>
          )}
          
          {isAuthenticated && (
            <div className="pt-3 border-t border-gray-200 mt-3">
              <div className="px-3 py-2 text-center text-sm">
                <span className="text-gray-600">Welcome, </span>
                <span className="font-medium text-red-600">{userPhone}</span>
              </div>
              <button 
                onClick={() => handleNavigation('/dashboard')} 
                className="block w-full text-center px-3 py-3 text-red-600 hover:bg-red-50 rounded-md transition-colors font-medium mt-2"
              >
                Go to My Profile
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Login Modal */}
      <LoginForm isOpen={isLoginModalOpen} onClose={closeLoginModal} />
    </header>
  );
};

export default MobileHeader;