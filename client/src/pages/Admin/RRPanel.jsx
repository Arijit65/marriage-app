import React, { useState, useEffect } from 'react';
import { 
  ChevronDown, 
  ChevronRight, 
  Search, 
  Eye, 
  Edit, 
  Trash2, 
  Menu,
  X,
  User,
  CreditCard,
  BarChart3,
  Users,
  Bell,
  LogOut,
  DollarSign,
  FileText,
  CheckCircle,
  AlertTriangle,
  Copy,
  Share
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const RRDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('memberList');
  const { rrUser, rrLogout, rrToken } = useAuth();
  const navigate = useNavigate();
  const [referralCode, setReferralCode] = useState(null);
  const [isGeneratingCode, setIsGeneratingCode] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  
  // Real members data state
  const [membersData, setMembersData] = useState([]);
  const [membersStats, setMembersStats] = useState({
    totalMembers: 0,
    activeMembers: 0,
    totalCommissionEarned: 0
  });
  const [membersPagination, setMembersPagination] = useState({
    currentPage: 1,
    totalPages: 0,
    totalCount: 0,
    hasNext: false,
    hasPrev: false
  });
  const [loadingMembers, setLoadingMembers] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

  // Form state for Add Member
  const [formData, setFormData] = useState({
    name: '',
    gender: '',
    phone: '',
    email: '',
    dateOfBirth: '',
    maritalStatus: '',
    state: '',
    city: '',
    religion: '',
    caste: '',
    highestQualification: '',
    profession: '',
    motherTongue: '',
    photo: null
  });
  const [submitting, setSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleLogout = () => {
    rrLogout();
    navigate('/rr-login');
  };

  useEffect(() => {
    if (rrUser?.referCode) {
      setReferralCode(rrUser.referCode);
    }
  }, [rrUser]);

  // Fetch referred members data
  const fetchReferredMembers = async (page = 1, search = '') => {
    if (!rrToken) return;
    
    setLoadingMembers(true);
    try {
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: '10',
        ...(search && { search })
      });

      const response = await fetch(`${API_BASE_URL}/api/rr/referred-members?${queryParams}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${rrToken}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      
      if (response.ok && data.success) {
        setMembersData(data.data.members);
        setMembersStats(data.data.stats);
        setMembersPagination(data.data.pagination);
      } else {
        console.error('Failed to fetch referred members:', data.message);
        setMembersData([]);
      }
    } catch (error) {
      console.error('Error fetching referred members:', error);
      setMembersData([]);
    } finally {
      setLoadingMembers(false);
    }
  };

  // Load members data when component mounts or when relevant state changes
  useEffect(() => {
    if (rrToken && activeSection === 'memberList') {
      fetchReferredMembers(membersPagination.currentPage, searchTerm);
    }
  }, [rrToken, activeSection]);

  // Handle search with debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (activeSection === 'memberList') {
        fetchReferredMembers(1, searchTerm);
      }
    }, 500);
    
    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  const generateReferralCode = async () => {
    setIsGeneratingCode(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/rr/generate-referral-code`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${rrToken}`
        }
      });

      const data = await response.json();
      
      if (response.ok && data.success) {
        setReferralCode(data.data.referCode);
      } else {
        alert(data.message || 'Failed to generate referral code');
      }
    } catch (error) {
      console.error('Error generating referral code:', error);
      alert('Network error. Please try again.');
    } finally {
      setIsGeneratingCode(false);
    }
  };

  const copyReferralCode = async () => {
    if (referralCode) {
      try {
        await navigator.clipboard.writeText(referralCode);
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
      } catch (error) {
        console.error('Failed to copy:', error);
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'photo' && files) {
      setFormData(prev => ({
        ...prev,
        [name]: files[0]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // Simulate API call for RR registration
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Show success message
      setShowSuccess(true);
      alert('Member registered successfully!\n\nThis is a demo registration. In production, this would create the user account with registration source "rr".');
      
      // Reset form after successful submission
      setTimeout(() => {
        setFormData({
          name: '',
          gender: '',
          phone: '',
          email: '',
          dateOfBirth: '',
          maritalStatus: '',
          state: '',
          city: '',
          religion: '',
          caste: '',
          highestQualification: '',
          profession: '',
          motherTongue: '',
          photo: null
        });
        setShowSuccess(false);
      }, 3000);
      
    } catch (error) {
      alert('Failed to register member. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // RR Sidebar menu structure
  const rrMenuItems = [
    {
      key: 'memberList',
      title: 'Member List',
      icon: Users,
      active: true
    },
    {
      key: 'addMember',
      title: 'Add Member',
      icon: User
    },
    {
      key: 'trackPayment',
      title: 'Track Payment',
      icon: CreditCard
    },
    {
      key: 'commissionReport',
      title: 'Commission Report',
      icon: DollarSign
    },
    {
      key: 'referralHistory',
      title: 'Referral History',
      icon: BarChart3
    },
    {
      key: 'logout',
      title: 'Logout',
      icon: LogOut,
      onClick: handleLogout
    }
  ];

  // Sample RR member data
  const rrMemberData = [
    {
      id: 'RR001-M001',
      photo: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=80&h=80&fit=crop&crop=face',
      name: 'Priya Sharma',
      gender: 'Female',
      mobile: '9876543210',
      email: 'priya.sharma@email.com',
      membershipType: 'Premium',
      joinDate: '2024-12-15',
      status: 'Active',
      commission: '₹2,500',
      referralCode: 'PS2024',
      lastActivity: '2 days ago'
    },
    {
      id: 'RR001-M002',
      photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face',
      name: 'Rajesh Kumar',
      gender: 'Male',
      mobile: '9123456789',
      email: 'rajesh.kumar@email.com',
      membershipType: 'Basic',
      joinDate: '2024-11-28',
      status: 'Active',
      commission: '₹1,200',
      referralCode: 'RK2024',
      lastActivity: '1 week ago'
    },
    {
      id: 'RR001-M003',
      photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&crop=face',
      name: 'Anjali Patel',
      gender: 'Female',
      mobile: '9987654321',
      email: 'anjali.patel@email.com',
      membershipType: 'Premium',
      joinDate: '2024-10-12',
      status: 'Inactive',
      commission: '₹3,800',
      referralCode: 'AP2024',
      lastActivity: '3 weeks ago'
    }
  ];

  // Payment tracking data
  const paymentData = [
    {
      id: 'PAY001',
      member: 'Priya Sharma',
      amount: '₹5,000',
      type: 'Premium Subscription',
      date: '2024-12-20',
      status: 'Completed',
      commission: '₹500',
      paymentMethod: 'UPI'
    },
    {
      id: 'PAY002',
      member: 'Rajesh Kumar',
      amount: '₹2,000',
      type: 'Basic Subscription',
      date: '2024-12-18',
      status: 'Pending',
      commission: '₹200',
      paymentMethod: 'Credit Card'
    },
    {
      id: 'PAY003',
      member: 'Anjali Patel',
      amount: '₹7,500',
      type: 'Premium + Video Profile',
      date: '2024-12-15',
      status: 'Completed',
      commission: '₹750',
      paymentMethod: 'Bank Transfer'
    }
  ];

  const handleMenuClick = (key) => {
    setActiveSection(key);
  };

  const renderMemberList = () => (
    <div className="p-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">My Referred Members</h2>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <p className="text-gray-600">Total Members: {membersStats.totalMembers}</p>
            <p className="text-gray-600">Active: {membersStats.activeMembers}</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="bg-green-100 text-green-800 px-4 py-2 rounded-lg">
              <span className="font-semibold">Total Commission: ₹{membersStats.totalCommissionEarned}</span>
            </div>
          </div>
        </div>
        
        {/* Search Bar */}
        <div className="flex items-center space-x-4 mb-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search members by name, phone, or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>
          <button
            onClick={() => fetchReferredMembers(membersPagination.currentPage, searchTerm)}
            disabled={loadingMembers}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
          >
            {loadingMembers ? 'Loading...' : 'Refresh'}
          </button>
        </div>
      </div>

      {loadingMembers ? (
        <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
          <div className="flex items-center justify-center space-x-2">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            <span className="text-gray-600">Loading members...</span>
          </div>
        </div>
      ) : membersData.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
          <div className="text-gray-500">
            <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Referred Members Yet</h3>
            <p className="text-gray-600 mb-4">
              {!referralCode 
                ? "Generate your referral code to start referring members." 
                : "Share your referral code to start getting referred members."}
            </p>
            {referralCode && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-md mx-auto">
                <p className="text-sm text-blue-700 mb-2">Your Referral Code:</p>
                <code className="text-lg font-mono bg-white px-3 py-1 rounded border text-blue-800">
                  {referralCode}
                </code>
              </div>
            )}
          </div>
        </div>
      ) : (
        <>
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Member Details</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Contact</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Location & Education</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Commission</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {membersData.map((member) => (
                    <tr key={member.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                            {member.photo ? (
                              <img
                                src={`${API_BASE_URL}${member.photo}`}
                                alt={member.name}
                                className="w-12 h-12 rounded-full object-cover"
                                onError={(e) => {
                                  e.target.style.display = 'none';
                                  e.target.nextSibling.style.display = 'flex';
                                }}
                              />
                            ) : null}
                            <span className="text-gray-500 font-semibold text-sm">
                              {member.name?.split(' ').map(n => n[0]).join('') || member.gender?.[0] || 'U'}
                            </span>
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900">{member.name || 'N/A'}</div>
                            <div className="text-sm text-gray-600">{member.id}</div>
                            <div className="text-xs text-blue-600">{member.gender} • Plan {member.planId}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{member.phone || 'N/A'}</div>
                        <div className="text-sm text-gray-600">{member.email || 'N/A'}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">
                          {member.location?.state || 'N/A'}{member.location?.city && `, ${member.location.city}`}
                        </div>
                        <div className="text-xs text-gray-600">
                          Joined: {new Date(member.joinDate).toLocaleDateString()}
                        </div>
                        <div className="text-xs text-gray-500">
                          {member.education || 'Education not specified'}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-lg font-bold text-green-600">₹{member.commission}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                          member.accountStatus === 'active' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {member.accountStatus === 'active' ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex space-x-2">
                          <button className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm">
                            <Eye className="h-4 w-4 inline mr-1" />
                            View
                          </button>
                          <button className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm">
                            <FileText className="h-4 w-4 inline mr-1" />
                            Report
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
          {/* Pagination */}
          {membersPagination.totalPages > 1 && (
            <div className="bg-white rounded-lg shadow-sm border mt-4 px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  Showing {((membersPagination.currentPage - 1) * 10) + 1} to {Math.min(membersPagination.currentPage * 10, membersPagination.totalCount)} of {membersPagination.totalCount} results
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => fetchReferredMembers(membersPagination.currentPage - 1, searchTerm)}
                    disabled={!membersPagination.hasPrev || loadingMembers}
                    className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <span className="text-sm text-gray-600">
                    Page {membersPagination.currentPage} of {membersPagination.totalPages}
                  </span>
                  <button
                    onClick={() => fetchReferredMembers(membersPagination.currentPage + 1, searchTerm)}
                    disabled={!membersPagination.hasNext || loadingMembers}
                    className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );

  const renderAddMember = () => (
    <div className="p-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Add New Member</h2>
        <p className="text-gray-600">Register a new member on their behalf</p>
      </div>

      {/* Success Message */}
      {showSuccess && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <div className="flex items-center">
            <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
            <span className="text-green-700 font-medium">Member registered successfully!</span>
          </div>
          <p className="text-green-600 text-sm mt-1">The member has been added to your referral list.</p>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm border p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Member Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-300 focus:border-blue-300 outline-none transition-colors"
                placeholder="Enter member name"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Gender *</label>
              <select 
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-300 focus:border-blue-300 outline-none transition-colors" 
                required
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          {/* Contact Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Mobile Number *</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-300 focus:border-blue-300 outline-none transition-colors"
                placeholder="Enter mobile number"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-300 focus:border-blue-300 outline-none transition-colors"
                placeholder="Enter email address"
                required
              />
            </div>
          </div>

          {/* Personal Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth *</label>
              <input
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-300 focus:border-blue-300 outline-none transition-colors"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Marital Status *</label>
              <select 
                name="maritalStatus"
                value={formData.maritalStatus}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-300 focus:border-blue-300 outline-none transition-colors" 
                required
              >
                <option value="">Select Marital Status</option>
                <option value="Never Married">Never Married</option>
                <option value="Divorced">Divorced</option>
                <option value="Widowed">Widowed</option>
              </select>
            </div>
          </div>

          {/* Location */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
              <select 
                name="state"
                value={formData.state}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-300 focus:border-blue-300 outline-none transition-colors"
              >
                <option value="">Select State</option>
                <option value="Maharashtra">Maharashtra</option>
                <option value="Karnataka">Karnataka</option>
                <option value="Tamil Nadu">Tamil Nadu</option>
                <option value="Delhi">Delhi</option>
                <option value="West Bengal">West Bengal</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-300 focus:border-blue-300 outline-none transition-colors"
                placeholder="Enter city"
              />
            </div>
          </div>

          {/* Cultural Background */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Religion</label>
              <select 
                name="religion"
                value={formData.religion}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-300 focus:border-blue-300 outline-none transition-colors"
              >
                <option value="">Select Religion</option>
                <option value="Hindu">Hindu</option>
                <option value="Muslim">Muslim</option>
                <option value="Christian">Christian</option>
                <option value="Sikh">Sikh</option>
                <option value="Other">Other</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Caste</label>
              <select 
                name="caste"
                value={formData.caste}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-300 focus:border-blue-300 outline-none transition-colors"
              >
                <option value="">Select Caste</option>
                <option value="Bengali">Bengali</option>
                <option value="Punjabi">Punjabi</option>
                <option value="Marathi">Marathi</option>
                <option value="Gujarati">Gujarati</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          {/* Education & Profession */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Highest Qualification</label>
              <select 
                name="highestQualification"
                value={formData.highestQualification}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-300 focus:border-blue-300 outline-none transition-colors"
              >
                <option value="">Select Qualification</option>
                <option value="10th Pass">10th Pass</option>
                <option value="12th Pass">12th Pass</option>
                <option value="Graduate">Graduate</option>
                <option value="Post-Graduate">Post-Graduate</option>
                <option value="Other">Other</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Profession *</label>
              <select 
                name="profession"
                value={formData.profession}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-300 focus:border-blue-300 outline-none transition-colors" 
                required
              >
                <option value="">Select Profession</option>
                <option value="Engineer">Engineer</option>
                <option value="Doctor">Doctor</option>
                <option value="Business">Business</option>
                <option value="Teacher">Teacher</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          {/* Additional Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Mother Tongue</label>
              <select 
                name="motherTongue"
                value={formData.motherTongue}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-300 focus:border-blue-300 outline-none transition-colors"
              >
                <option value="">Select Mother Tongue</option>
                <option value="Bengali">Bengali</option>
                <option value="Hindi">Hindi</option>
                <option value="Tamil">Tamil</option>
                <option value="Telugu">Telugu</option>
                <option value="Punjabi">Punjabi</option>
                <option value="Other">Other</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Photo Upload</label>
              <input
                type="file"
                name="photo"
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-300 focus:border-blue-300 outline-none transition-colors bg-white"
                accept="image/*"
              />
            </div>
          </div>

          {/* RR Information */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="text-sm font-medium text-blue-800 mb-2">Registration Details</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-700">
              <div>
                <span className="font-medium">Registered by:</span> {rrUser?.name || 'RR User'}
              </div>
              <div>
                <span className="font-medium">RR ID:</span> {rrUser?.id || 'RR001'}
              </div>
              <div>
                <span className="font-medium">Registration Source:</span> RR
              </div>
              <div>
                <span className="font-medium">Date:</span> {new Date().toLocaleDateString()}
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={submitting}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Registering...</span>
                </div>
              ) : (
                'Register Member'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  const renderTrackPayment = () => (
    <div className="p-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Payment Tracking</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-100 p-4 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">₹14,500</div>
            <div className="text-sm text-blue-800">Total Payments</div>
          </div>
          <div className="bg-green-100 p-4 rounded-lg">
            <div className="text-2xl font-bold text-green-600">₹12,000</div>
            <div className="text-sm text-green-800">Completed</div>
          </div>
          <div className="bg-yellow-100 p-4 rounded-lg">
            <div className="text-2xl font-bold text-yellow-600">₹2,500</div>
            <div className="text-sm text-yellow-800">Pending</div>
          </div>
          <div className="bg-purple-100 p-4 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">₹1,450</div>
            <div className="text-sm text-purple-800">Commission Earned</div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Payment ID</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Member</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Amount</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Type</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Date</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Commission</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {paymentData.map((payment) => (
                <tr key={payment.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-blue-600">{payment.id}</td>
                  <td className="px-6 py-4 text-gray-900">{payment.member}</td>
                  <td className="px-6 py-4 font-bold text-gray-900">{payment.amount}</td>
                  <td className="px-6 py-4 text-gray-600">{payment.type}</td>
                  <td className="px-6 py-4 text-gray-600">{payment.date}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                      payment.status === 'Completed' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {payment.status === 'Completed' ? <CheckCircle className="h-3 w-3 mr-1" /> : <AlertTriangle className="h-3 w-3 mr-1" />}
                      {payment.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-bold text-green-600">{payment.commission}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case 'memberList':
        return renderMemberList();
      case 'addMember':
        return renderAddMember();
      case 'trackPayment':
        return renderTrackPayment();
      case 'commissionReport':
        return (
          <div className="p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Commission Report</h2>
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-3xl font-bold text-green-600">₹7,500</div>
                  <div className="text-green-800">Total Commission</div>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-3xl font-bold text-blue-600">₹6,200</div>
                  <div className="text-blue-800">Paid Commission</div>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <div className="text-3xl font-bold text-orange-600">₹1,300</div>
                  <div className="text-orange-800">Pending Commission</div>
                </div>
              </div>
              <p className="text-gray-600">Detailed commission breakdown and payment history will be displayed here.</p>
            </div>
          </div>
        );
      case 'referralHistory':
        return (
          <div className="p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Referral History</h2>
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <p className="text-gray-600">Complete history of all referrals and their conversion status will be shown here.</p>
            </div>
          </div>
        );
      default:
        return renderMemberList();
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* RR Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-72 bg-gradient-to-b from-blue-800 to-blue-900 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}>
        <div className="flex items-center justify-between h-20 px-6 bg-blue-900 border-b border-blue-700">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center mr-3">
              <span className="text-white font-bold text-lg">RR</span>
            </div>
            <div>
              <span className="text-white font-bold text-xl">RR Dashboard</span>
              <div className="text-blue-200 text-xs">Relationship Representative</div>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-white hover:text-blue-200"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          <nav className="px-4 py-6 space-y-2">
            {rrMenuItems.map((item) => (
              <button
                key={item.key}
                onClick={() => {
                  if (item.onClick) {
                    item.onClick();
                  } else {
                    handleMenuClick(item.key);
                  }
                }}
                className={`w-full flex items-center px-4 py-3 text-base font-medium rounded-lg transition-colors duration-150 ${
                  activeSection === item.key
                    ? 'bg-blue-700 text-white shadow-lg' 
                    : 'text-blue-100 hover:bg-blue-700 hover:text-white'
                }`}
              >
                <item.icon className="mr-4 h-5 w-5" />
                <span className="flex-1 text-left">{item.title}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* RR Profile Section */}
        <div className="p-4 border-t border-blue-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
              <span className="text-gray-600 font-semibold text-sm">
                {rrUser?.name?.split(' ').map(n => n[0]).join('') || 'RR'}
              </span>
            </div>
            <div>
              <div className="text-white font-medium">{rrUser?.name || 'RR User'}</div>
              <div className="text-blue-200 text-xs">ID: {rrUser?.id || 'RR001'}</div>
            </div>
          </div>
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
              <h1 className="text-2xl font-semibold text-gray-900">RR Panel</h1>
            </div>
            <div className="flex items-center space-x-6">
              {/* Referral Code Section */}
              <div className="flex items-center space-x-3">
                {referralCode ? (
                  <div className="flex items-center space-x-2 bg-green-50 border border-green-200 rounded-lg px-3 py-2">
                    <Share className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium text-green-800">Referral Code:</span>
                    <code className="text-sm font-mono bg-white px-2 py-1 rounded border text-green-700">
                      {referralCode}
                    </code>
                    <button
                      onClick={copyReferralCode}
                      className="ml-2 text-green-600 hover:text-green-800 transition-colors"
                      title="Copy referral code"
                    >
                      <Copy className="h-4 w-4" />
                    </button>
                    {copySuccess && (
                      <span className="text-xs text-green-600 font-medium">Copied!</span>
                    )}
                  </div>
                ) : (
                  <button
                    onClick={generateReferralCode}
                    disabled={isGeneratingCode}
                    className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Share className="h-4 w-4" />
                    {isGeneratingCode ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>Generating...</span>
                      </>
                    ) : (
                      <span>Generate Referral Code</span>
                    )}
                  </button>
                )}
              </div>
              
              <span className="text-base text-gray-600">Welcome, {rrUser?.name || 'RR User'}</span>
              <div className="flex items-center space-x-3">
                <Bell className="h-6 w-6 text-gray-500" />
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold">
                    {rrUser?.name?.split(' ').map(n => n[0]).join('') || 'RR'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-auto bg-gray-50">
          {renderContent()}
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

export default RRDashboard;
