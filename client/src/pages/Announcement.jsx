import React from 'react';
import Sidebar from '../Components/Sidebar';
import MainHeader from '../Components/mainHeader';

const Announcement = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <MainHeader />
      
      {/* Main Content with Sidebar - Centered */}
      <div className="flex justify-center">
        <div className="flex max-w-7xl w-full">
          {/* Sidebar */}
          <Sidebar activePage="announcement" />
          
          {/* Main Content Area */}
          <div className="flex-1 p-8 bg-white">
            <div className="max-w-4xl mx-auto">
              {/* Main Heading */}
              <h1 className="text-4xl font-bold text-gray-800 mb-8">Announcement</h1>
              
              {/* Banner Section */}
              <section className="mb-8">
                <div className="bg-gradient-to-r from-red-600 to-purple-600 text-white p-6 rounded-lg mb-6">
                  <h2 className="text-2xl font-bold mb-2">MarriagePaper.Com</h2>
                  <h3 className="text-xl font-bold text-purple-200 mb-1">Advertise Video Profile & Get Free Sundarbon Trip</h3>
                  <p className="text-purple-200 italic">(For Diamond Package Users)</p>
                </div>
              </section>

              {/* Video Ad Plan Section */}
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-800 mb-2">Select suitable VIDEO Ad Plan</h2>
                <h3 className="text-lg text-gray-600 mb-4">With contact number privacy</h3>
                
                {/* Video Ad Plan Table */}
                <div className="bg-white border border-gray-300 rounded-lg overflow-hidden shadow-sm">
                  <table className="w-full">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="px-4 py-3 text-left text-gray-700 font-semibold">Package</th>
                        <th className="px-4 py-3 text-left text-gray-700 font-semibold">To do for video profile</th>
                        <th className="px-4 py-3 text-left text-gray-700 font-semibold">Fees *</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-gray-200">
                        <td className="px-4 py-3 text-gray-800 font-medium">Silver Package</td>
                        <td className="px-4 py-3 text-gray-700">You : Make & Provide us</td>
                        <td className="px-4 py-3 text-gray-800 font-semibold">₹2199.00</td>
                      </tr>
                      <tr className="border-b border-gray-200">
                        <td className="px-4 py-3 text-gray-800 font-medium">Gold Package</td>
                        <td className="px-4 py-3 text-gray-700">You : Provide video clips</td>
                        <td className="px-4 py-3">
                          <div className="text-gray-800 font-semibold">₹5698.00</div>
                          <div className="text-sm text-gray-600">(2199+ 3499)</div>
                        </td>
                      </tr>
                      <tr className="border-b border-gray-200">
                        <td className="px-4 py-3 text-gray-800 font-medium">Diamond Package</td>
                        <td className="px-4 py-3 text-gray-700">We : Shoot, edit and make profile ready</td>
                        <td className="px-4 py-3">
                          <div className="text-gray-800 font-semibold">₹8198.00</div>
                          <div className="text-sm text-gray-600">(2199+ 5999)</div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                
                <p className="text-sm text-gray-600 mt-2">*GST extra</p>
              </section>

              {/* Assurance Section */}
              <section className="mb-8">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">ASSURANCE</h3>
                <p className="text-gray-700 mb-2">**If Marriage not settled within 6 months</p>
                <p className="text-gray-700 font-medium">We Continue Advertisement Till you find a suitable Match at NO EXTRA COST</p>
              </section>

              {/* Login/Registration Section */}
              <section className="mb-8">
                <div className="grid grid-cols-2 gap-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">New user</h3>
                    <a href="/register" className="text-blue-600 hover:text-blue-800 font-medium">
                      Register now
                    </a>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Existing member</h3>
                    <div className="space-y-1">
                      <a href="/login" className="text-blue-600 hover:text-blue-800 font-medium block">
                        Login
                      </a>
                      <a href="/" className="text-blue-600 hover:text-blue-800 font-medium block">
                        website
                      </a>
                    </div>
                  </div>
                </div>
              </section>

              {/* Footer Section */}
              <section className="text-center">
                <p className="text-gray-700 mb-4">
                  If Interested, visit website or Whatsapp us @ 7278763789 Our Team will contact you
                </p>
                <div className="space-y-2">
                  <a href="#" className="text-blue-600 hover:text-blue-800 font-medium block">
                    Click to view VIDEO profile of one of our member
                  </a>
                  <a href="#" className="text-blue-600 hover:text-blue-800 font-medium block">
                    Click here to view Video Profile Making Guide
                  </a>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Announcement; 