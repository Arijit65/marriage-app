import React, { useState, useEffect } from 'react';
import {
  ChevronDown,
  ChevronRight,
  Menu,
  X,
  User,
  Settings,
  FileText,
  CreditCard,
  CheckSquare,
  MapPin,
  Globe,
  Bell,
  Link,
  HelpCircle,
  Package,
  Download,
  BarChart3,
  LogOut
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useApi } from '../../context/ApiContext';
import MemberListing from './MemberListing';

const AdminDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState({
    memberManagement: true,
    adminManagement: false,
    contentManagement: false
  });
  const [selectedMemberType, setSelectedMemberType] = useState('active');
  const [currentView, setCurrentView] = useState('memberListing');
  const [userStats, setUserStats] = useState({});
  const { adminUser, adminLogout } = useAuth();
  const { userApi } = useApi();
  const navigate = useNavigate();

  const handleLogout = () => {
    adminLogout();
    navigate('/admin-login');
  };

  // Fetch user statistics
  const fetchUserStats = async () => {
    try {
      const response = await userApi.getUserStats();
      if (response.success) {
        setUserStats(response.data);
      }
    } catch (err) {
      console.error('Failed to fetch user stats:', err);
    }
  };

  useEffect(() => {
    fetchUserStats();
  }, []);

  // Sidebar menu structure
  const menuItems = [
    {
      key: 'memberManagement',
      title: 'Member Management',
      icon: User,
      expandable: true,
      subItems: [
        { title: `Active Member (${userStats.active || 0})`, type: 'active', active: selectedMemberType === 'active' },
        { title: `Inactive Member (${userStats.total - userStats.active || 0})`, type: 'inactive', active: selectedMemberType === 'inactive' },
        { title: `Pending Member (${userStats.total - userStats.verified || 0})`, type: 'pending', active: selectedMemberType === 'pending' },
        { title: `Private Member (0)`, type: 'private', active: selectedMemberType === 'private' },
        { title: `Suspend Member (${userStats.suspended || 0})`, type: 'suspended', active: selectedMemberType === 'suspended' },
        { title: `Temporary Active (0)`, type: 'temporaryActive', active: selectedMemberType === 'temporaryActive' },
        { title: `Temporary Approval Edit (0)`, type: 'temporaryApprovalEdit', active: selectedMemberType === 'temporaryApprovalEdit' },
        { title: `Unverified Member (${userStats.total - userStats.verified || 0})`, type: 'unverified', active: selectedMemberType === 'unverified' }
      ]
    },
    {
      key: 'adminManagement',
      title: 'Admin Management',
      icon: Settings,
      expandable: true,
      subItems: [
        { title: 'List' },
        { title: 'Add' }
      ]
    },
    {
      key: 'contentManagement',
      title: 'Content Management',
      icon: FileText,
      expandable: true,
      subItems: [
        { title: 'List' },
        { title: 'Add' }
      ]
    },
    {
      key: 'onlinePayments',
      title: 'Online Payments',
      icon: CreditCard
    },
    {
      key: 'chequePayments',
      title: 'Cheque Payments',
      icon: CheckSquare
    },
    {
      key: 'locations',
      title: 'Locations',
      icon: MapPin
    },
    {
      key: 'religions',
      title: 'Religions',
      icon: Globe
    },
    {
      key: 'newsNotice',
      title: 'News/Notice',
      icon: Bell
    },
    {
      key: 'businessLinks',
      title: 'Business Links',
      icon: Link
    },
    {
      key: 'faq',
      title: 'FAQ',
      icon: HelpCircle
    },
    {
      key: 'package',
      title: 'Package',
      icon: Package
    },
    {
      key: 'memberDetails',
      title: 'Member Details Downloader',
      icon: Download
    },
    {
      key: 'rrTracker',
      title: 'RR Tracker',
      icon: BarChart3
    },
    {
      key: 'rrPayment',
      title: 'RR Payment Downloader',
      icon: Download
    },
    {
      key: 'promo',
      title: 'Promo',
      icon: Package
    },
    {
      key: 'logout',
      title: 'Logout',
      icon: LogOut,
      onClick: handleLogout
    }
  ];


  const toggleMenu = (key) => {
    setExpandedMenus(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-72 bg-gray-900 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}>
        <div className="flex items-center justify-between h-20 px-6 bg-gray-900">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center mr-3">
              <span className="text-white font-bold text-lg">MP</span>
            </div>
            <span className="text-white font-bold text-xl">Admin Panel</span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-white hover:text-gray-300"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto bg-gray-900">
          <nav className="px-4 py-6 space-y-2">
            {menuItems.map((item) => (
              <div key={item.key}>
                <button
                  onClick={() => {
                    if (item.expandable) {
                      toggleMenu(item.key);
                    } else if (item.onClick) {
                      item.onClick();
                    }
                  }}
                  className={`w-full flex items-center px-4 py-3 text-base font-medium rounded-lg transition-colors duration-150 ${
                    item.key === 'memberManagement' 
                      ? 'bg-gray-700 text-white' 
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  <item.icon className="mr-4 h-5 w-5" />
                  <span className="flex-1 text-left">{item.title}</span>
                  {item.expandable && (
                    expandedMenus[item.key] ? 
                      <ChevronDown className="h-5 w-5" /> : 
                      <ChevronRight className="h-5 w-5" />
                  )}
                </button>
                
                {item.expandable && expandedMenus[item.key] && (
                  <div className="ml-8 mt-2 space-y-1">
                    {item.subItems.map((subItem, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          if (subItem.type) {
                            setSelectedMemberType(subItem.type);
                            setCurrentView('memberListing');
                          }
                        }}
                        className={`w-full text-left px-4 py-2 text-sm rounded-lg transition-colors duration-150 ${
                          subItem.active
                            ? 'bg-blue-600 text-white'
                            : 'text-gray-400 hover:bg-gray-700 hover:text-white'
                        }`}
                      >
                        {subItem.title}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 h-20">
          <div className="flex items-center justify-between px-8 py-6 h-full">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden mr-4 text-gray-600 hover:text-gray-900"
              >
                <Menu className="h-6 w-6" />
              </button>
              <h1 className="text-2xl font-semibold text-gray-900">
                {currentView === 'memberListing' ? 'Member Management' : 'Content Management'}
              </h1>
            </div>
            <div className="flex items-center space-x-6">
              <span className="text-base text-gray-600">
                Dashboard / {currentView === 'memberListing' ? `${selectedMemberType.charAt(0).toUpperCase() + selectedMemberType.slice(1)} Member` : 'Content Management'}
              </span>
              <div className="flex items-center space-x-3">
                <Bell className="h-6 w-6 text-gray-500" />
                <span className="text-base text-gray-600">{adminUser?.name || 'Admin'}</span>
                <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                  <span className="text-gray-600 font-semibold text-sm">
                    {adminUser?.name?.charAt(0) || 'A'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-auto">
          {currentView === 'memberListing' && (
            <MemberListing memberType={selectedMemberType} />
          )}
          {currentView !== 'memberListing' && (
            <div className="bg-white p-8">
              <div className="text-center">
                <h2 className="text-xl font-medium text-gray-900">Content Management</h2>
                <p className="text-gray-600 mt-2">Select a content management option from the sidebar.</p>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-25 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default AdminDashboard;
