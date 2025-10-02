import React, { useState } from 'react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoginForm from '../pages/Auth/Login';

const MainHeader = () => {
  const navigate = useNavigate();
  const { isAuthenticated, userPhone, logout } = useAuth();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const openLoginModal = () => setIsLoginModalOpen(true);
  const closeLoginModal = () => setIsLoginModalOpen(false);

  return (
    <header className="w-full bg-white">
      {/* Top Navigation Menu Section */}
      <nav className="flex justify-center items-center py-4 px-6 border-b border-gray-200">
        <div className="flex items-center space-x-6 text-lg text-gray-600 font-normal">
          <button onClick={() => navigate('/')} className="hover:text-gray-800 transition-colors">
            Home
          </button>
          <button onClick={() => navigate('/about')} className="hover:text-gray-800 transition-colors">
            About Us
          </button>
          
          {/* Our Services Dropdown */}
          <div className="relative group">
            <button
              className="flex items-center space-x-1 hover:text-gray-800 transition-colors"
            >
              <span>Our Services</span>
              <ChevronDownIcon className="w-4 h-4" />
            </button>
            
            {/* Dropdown Menu */}
            <div 
              className="absolute top-full left-0 mt-0 w-56 bg-white shadow-lg border border-gray-200 rounded-md z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 ease-in-out"
            >
              <button onClick={() => navigate('/workflow')} className="block w-full text-left px-5 py-4 text-gray-700 hover:bg-gray-50 transition-colors text-base">
                Our Workflow
              </button>
              <button onClick={() => navigate('/proposal')} className="block w-full text-left px-5 py-4 text-gray-700 hover:bg-gray-50 transition-colors text-base">
                Proposal Services
              </button>
              <button onClick={() => navigate('/yet-to-marry')} className="block w-full text-left px-5 py-4 text-gray-700 hover:bg-gray-50 transition-colors text-base">
                Yet To Marry
              </button>
              <button onClick={() => navigate('/announcement')} className="block w-full text-left px-5 py-4 text-gray-700 hover:bg-gray-50 transition-colors text-base">
                Announcement
              </button>
            </div>
          </div>
          
          <button onClick={() => navigate('/benefit')} className="hover:text-gray-800 transition-colors">
            Benefit
          </button>
          <button  onClick={() => navigate('/blogs')} className="hover:text-gray-800 transition-colors">
            Blog
          </button>
          <button onClick={() => navigate('/profiles')} className="hover:text-gray-800 transition-colors">
            Find Match
          </button>
          <button onClick={() => navigate('/plans')} className="hover:text-gray-800 transition-colors">
            Plans
          </button>
          <button className="hover:text-gray-800 transition-colors">
            Fees & Offer
          </button>
        </div>
      </nav>

      {/* Logo and Buttons Section */}
      <div className="flex justify-center items-center gap-96 px-6 py-2">
        {/* Logo Section */}
        <div className="flex items-center">
          <div className="flex items-center space-x-3">
            {/* Logo Icon */}
             {/* <div className="w-14 h-14 bg-red-50 border-2 border-red-400 rounded-lg flex items-center justify-center"> */}
              <img
                  src="/src/assets/logo.png"
                  alt="Marriage Paper Logo"
                  className="h-14 w-auto"
                />
              {/* <span className="text-red-600 font-bold text-lg">mp</span> */}
            {/* </div> */}
     
            {/* <span className="text-red-600 text-4xl font-bold">marriagepaper</span> */} 
                  
          </div>

        </div>

        {/* Action Buttons Section */}
        <div className="flex items-center space-x-4 ml-16">
          {!isAuthenticated ? (
            <>
              <button onClick={openLoginModal} className="bg-red-500 hover:bg-red-600 text-white px-5 py-2.5 rounded-md text-sm font-medium transition-colors">
                Login
              </button>
              <button onClick={() => navigate('/register')} className="bg-red-500 hover:bg-red-600 text-white px-5 py-2.5 rounded-md text-sm font-medium transition-colors">
                Post Ad
              </button>
            </>
          ) : (
            <>
              <div className="flex items-center space-x-3">
                <span className="text-sm text-gray-600">Welcome,</span>
                <span className="text-sm font-medium text-red-600">{userPhone}</span>
              </div>
              <button onClick={()=>navigate('/dashboard')} className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
                Go to My Profile
              </button>
            </>
          )}
          <button onClick={() => navigate('/profiles')} className="bg-red-500 hover:bg-red-600 text-white px-5 py-2.5 rounded-md text-sm font-medium transition-colors">
            Search
          </button>
        </div>
      </div>

      {/* Login Modal */}
      <LoginForm isOpen={isLoginModalOpen} onClose={closeLoginModal} />
    </header>
  );
};

export default MainHeader;
