import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Users } from 'lucide-react';

const AdminNavLinks = () => {
  return (
    <div className="flex items-center space-x-4">
      <Link
        to="/admin-login"
        className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
      >
        <Shield className="h-4 w-4" />
        <span>Admin Login</span>
      </Link>
      <Link
        to="/rr-login"
        className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
      >
        <Users className="h-4 w-4" />
        <span>RR Login</span>
      </Link>
    </div>
  );
};

export default AdminNavLinks;
