import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Users, ArrowRight } from 'lucide-react';

const PortalLanding = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center px-4">
      <div className="max-w-4xl w-full">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="mx-auto w-20 h-20 bg-red-600 rounded-xl flex items-center justify-center mb-6">
            <span className="text-white font-bold text-3xl">MP</span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">Marriage App Portals</h1>
          <p className="text-gray-400 text-lg">Choose your portal to access the dashboard</p>
        </div>

        {/* Portal Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto">
          {/* Admin Portal */}
          <div className="bg-white rounded-2xl shadow-2xl p-8 hover:shadow-3xl transition-all duration-300 transform hover:-translate-y-2">
            <div className="text-center">
              <div className="mx-auto w-16 h-16 bg-red-600 rounded-xl flex items-center justify-center mb-6">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Admin Panel</h2>
              <p className="text-gray-600 mb-6">
                Access the comprehensive admin dashboard to manage members, content, payments, and system settings.
              </p>
              <ul className="text-sm text-gray-600 mb-8 space-y-2">
                <li>• Member Management</li>
                <li>• Content Management</li>
                <li>• Payment Tracking</li>
                <li>• System Settings</li>
                <li>• Reports & Analytics</li>
              </ul>
              <Link
                to="/admin-login"
                className="inline-flex items-center justify-center w-full px-6 py-3 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors group"
              >
                <span>Access Admin Panel</span>
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          {/* RR Portal */}
          <div className="bg-white rounded-2xl shadow-2xl p-8 hover:shadow-3xl transition-all duration-300 transform hover:-translate-y-2">
            <div className="text-center">
              <div className="mx-auto w-16 h-16 bg-orange-500 rounded-xl flex items-center justify-center mb-6">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">RR Dashboard</h2>
              <p className="text-gray-600 mb-6">
                Manage your referred members, track commissions, and monitor your referral performance.
              </p>
              <ul className="text-sm text-gray-600 mb-8 space-y-2">
                <li>• Member List</li>
                <li>• Payment Tracking</li>
                <li>• Commission Reports</li>
                <li>• Referral History</li>
                <li>• Performance Analytics</li>
              </ul>
              <Link
                to="/rr-login"
                className="inline-flex items-center justify-center w-full px-6 py-3 bg-orange-500 text-white font-medium rounded-lg hover:bg-orange-600 transition-colors group"
              >
                <span>Access RR Dashboard</span>
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-12">
          <Link
            to="/"
            className="text-blue-400 hover:text-blue-300 transition-colors"
          >
            ← Back to Main Website
          </Link>
          <p className="text-gray-400 text-sm mt-4">
            © 2024 Marriage App. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PortalLanding;
