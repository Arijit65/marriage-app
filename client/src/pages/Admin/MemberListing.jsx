import React, { useState, useEffect } from 'react';
import { Eye, Edit, Trash2 } from 'lucide-react';
import { useApi } from '../../context/ApiContext';

const MemberListing = ({ memberType = 'active' }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalUsers, setTotalUsers] = useState(0);
  const [userStats, setUserStats] = useState({});

  const { userApi } = useApi();

  // Map frontend member types to backend account statuses
  const memberTypeToStatus = {
    active: 'active',
    inactive: 'inactive',
    pending: 'pending_verification',
    private: 'private',
    suspended: 'suspended',
    temporaryActive: 'temporary_active',
    temporaryApprovalEdit: 'temporary_approval_edit',
    unverified: 'unverified'
  };

  // Get member type display names and counts
  const memberTypesConfig = {
    active: { title: 'Active Member', emoji: '🔍' },
    inactive: { title: 'Inactive Member', emoji: '😴' },
    pending: { title: 'Pending Member', emoji: '⏳' },
    private: { title: 'Private Member', emoji: '🔒' },
    suspended: { title: 'Suspend Member', emoji: '⛔' },
    temporaryActive: { title: 'Temporary Active', emoji: '⚡' },
    temporaryApprovalEdit: { title: 'Temporary Approval Edit', emoji: '✏️' },
    unverified: { title: 'Unverified Member', emoji: '❓' }
  };

  // Transform backend user data to frontend format
  const transformUserData = (user) => {
    // Calculate age from date_of_birth
    const age = user.date_of_birth
      ? new Date().getFullYear() - new Date(user.date_of_birth).getFullYear()
      : null;

    // Generate verification status based on user fields
    const verificationParts = [
      user.is_verified ? 'OTP Verified' : 'OTP Not Verified',
      user.email ? 'Email Verified' : 'Email Not Verified',
      user.phone_number ? 'Mobile Verified' : 'Mobile Not Verified',
      'KYC Not Verified',
      'AD Not Verified'
    ];

    return {
      id: user.id,
      photo: user.userProfile?.photos?.[0] || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || 'User')}&size=80&background=random`,
      name: user.name || 'Not Set',
      gender: user.gender || 'Not Specified',
      mobile: user.phone_number || 'Not Provided',
      email: user.email || 'Not Provided',
      type: user.plan_info?.id === 1 ? 'Free' : 'Premium',
      regDate: new Date(user.created_at).toLocaleString(),
      verDate: user.is_verified ? new Date(user.updated_at).toLocaleDateString() : '',
      ccp: user.profile_stats?.proposals_received || 0 + '/' + user.profile_stats?.proposals_sent || 0,
      status: mapAccountStatusToDisplayStatus(user.account_status),
      verificationStatus: verificationParts.join(' / '),
      age: age,
      isActive: user.is_active,
      planExpiresAt: user.plan_info?.expires_at,
      rawUser: user // Keep reference to original user data
    };
  };

  const mapAccountStatusToDisplayStatus = (status) => {
    const statusMap = {
      'active': 'Active',
      'inactive': 'Inactive',
      'pending_verification': 'Pending',
      'private': 'Private',
      'suspended': 'Suspended',
      'temporary_active': 'Temporary Active',
      'temporary_approval_edit': 'Temporary Approval Edit',
      'unverified': 'Unverified'
    };
    return statusMap[status] || status;
  };

  // Fetch users from API
  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);

      const filters = {
        page: currentPage,
        limit: entriesPerPage,
        search: searchTerm || undefined,
        status: memberTypeToStatus[memberType] || undefined,
        sortBy: 'created_at',
        sortOrder: 'DESC'
      };

      const response = await userApi.getUsers(filters);

      if (response.success) {
        const transformedUsers = response.data.users.map(transformUserData);
        setUsers(transformedUsers);
        setTotalUsers(response.data.pagination.total);
      } else {
        setError(response.error);
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
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

  // Get count for current member type from stats
  const getCurrentTypeCount = () => {
    switch (memberType) {
      case 'active':
        return userStats.active || 0;
      case 'suspended':
        return userStats.suspended || 0;
      case 'unverified':
        return userStats.total - userStats.verified || 0;
      default:
        return totalUsers;
    }
  };

  const currentConfig = {
    ...memberTypesConfig[memberType],
    count: getCurrentTypeCount()
  };

  useEffect(() => {
    fetchUsers();
  }, [currentPage, entriesPerPage, searchTerm, memberType]);

  useEffect(() => {
    fetchUserStats();
  }, []);

  // Calculate pagination
  const totalPages = Math.ceil(totalUsers / entriesPerPage);
  const startIndex = (currentPage - 1) * entriesPerPage;
  const endIndex = Math.min(startIndex + entriesPerPage, totalUsers);

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedMembers(users.map(user => user.id));
    } else {
      setSelectedMembers([]);
    }
  };

  const handleSelectMember = (memberId, checked) => {
    if (checked) {
      setSelectedMembers(prev => [...prev, memberId]);
    } else {
      setSelectedMembers(prev => prev.filter(id => id !== memberId));
    }
  };

  const handleView = (member) => {
    console.log('View member:', member);
    // TODO: Navigate to member details page
  };

  const handlePayment = (member) => {
    console.log('Handle payment for member:', member);
    // TODO: Open payment/subscription modal
  };

  const handleDelete = async (member) => {
    if (!confirm(`Are you sure you want to delete user ${member.name}?`)) {
      return;
    }

    try {
      const response = await userApi.deleteUser(member.id);
      if (response.success) {
        // Refresh the user list
        await fetchUsers();
        alert('User deleted successfully');
      } else {
        alert('Failed to delete user: ' + response.error);
      }
    } catch (err) {
      alert('Error deleting user: ' + err.message);
    }
  };

  const handleStatusChange = async (member, newStatus) => {
    try {
      let response;

      switch (newStatus) {
        case 'activate':
          response = await userApi.activateUser(member.id);
          break;
        case 'suspend':
          const reason = prompt('Please enter suspension reason:');
          if (!reason) return;
          response = await userApi.suspendUser(member.id, reason, null);
          break;
        case 'block':
          const blockReason = prompt('Please enter block reason:');
          if (!blockReason) return;
          response = await userApi.blockUser(member.id, blockReason, null);
          break;
        default:
          return;
      }

      if (response.success) {
        await fetchUsers();
        alert(`User ${newStatus}d successfully`);
      } else {
        alert(`Failed to ${newStatus} user: ` + response.error);
      }
    } catch (err) {
      alert(`Error ${newStatus}ing user: ` + err.message);
    }
  };

  const getStatusColor = (status) => {
    const statusColors = {
      'Active': 'bg-green-100 text-green-800',
      'Inactive': 'bg-gray-100 text-gray-800',
      'Pending': 'bg-yellow-100 text-yellow-800',
      'Private': 'bg-blue-100 text-blue-800',
      'Suspended': 'bg-red-100 text-red-800',
      'Temporary Active': 'bg-purple-100 text-purple-800',
      'Temporary Approval Edit': 'bg-purple-100 text-purple-800',
      'Unverified': 'bg-orange-100 text-orange-800'
    };
    return statusColors[status] || 'bg-gray-100 text-gray-800';
  };

  const handleSearch = (value) => {
    setSearchTerm(value);
    setCurrentPage(1); // Reset to first page when searching
  };

  if (loading) {
    return (
      <div className="bg-white">
        <div className="bg-blue-600 text-white px-8 py-4">
          <h2 className="text-lg font-medium">
            {currentConfig.emoji} {currentConfig.title}
          </h2>
        </div>
        <div className="flex items-center justify-center py-12">
          <div className="text-lg text-gray-600">Loading members...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white">
        <div className="bg-blue-600 text-white px-8 py-4">
          <h2 className="text-lg font-medium">
            {currentConfig.emoji} {currentConfig.title}
          </h2>
        </div>
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="text-lg text-red-600 mb-2">Error loading members</div>
            <div className="text-sm text-gray-600 mb-4">{error}</div>
            <button
              onClick={() => fetchUsers()}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white">
      {/* Header */}
      <div className="bg-blue-600 text-white px-8 py-4">
        <h2 className="text-lg font-medium">
          {currentConfig.emoji} {currentConfig.title}
        </h2>
      </div>

      {/* Table Controls */}
      <div className="flex items-center justify-between px-8 py-6 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-3">
            <span className="text-base text-gray-600">Show:</span>
            <select
              className="border border-gray-300 rounded-md px-3 py-2 text-base bg-white"
              value={entriesPerPage}
              onChange={(e) => {
                setEntriesPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
            <span className="text-base text-gray-600">of {totalUsers.toLocaleString()}</span>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <span className="text-base text-gray-600">Search:</span>
          <input
            type="text"
            className="border border-gray-300 rounded-md px-4 py-2 text-base w-64"
            placeholder="Search members..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Data Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-100 border-b-2 border-gray-200">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 w-4 h-4"
                  checked={selectedMembers.length === users.length && users.length > 0}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                />
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">Photo/Post</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">Gender</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">Mobile/Email</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">Type/RR</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">Date</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">CCP/SMS</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {users.length === 0 ? (
              <tr>
                <td colSpan="9" className="px-6 py-12 text-center text-gray-500">
                  <div className="text-lg">No members found</div>
                  <div className="text-sm mt-2">
                    {searchTerm ? `No results for "${searchTerm}"` : `No ${memberType} members available`}
                  </div>
                </td>
              </tr>
            ) : (
              users.map((member) => (
                <tr key={member.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-6">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300 w-4 h-4"
                      checked={selectedMembers.includes(member.id)}
                      onChange={(e) => handleSelectMember(member.id, e.target.checked)}
                    />
                  </td>
                  <td className="px-6 py-6">
                    <div className="flex items-center space-x-4">
                      <img
                        src={member.photo}
                        alt={member.name}
                        className="w-14 h-14 rounded-full object-cover border-2 border-gray-200"
                        onError={(e) => {
                          e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&size=80&background=random`;
                        }}
                      />
                      <div>
                        <div className="text-base font-semibold text-gray-900">{member.id}</div>
                        <div className="text-sm text-gray-600">{member.name}</div>
                        {member.age && (
                          <div className="text-xs text-gray-500">Age: {member.age}</div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-6 text-base text-gray-900">{member.gender}</td>
                  <td className="px-6 py-6">
                    <div className="text-base text-gray-900">{member.mobile}</div>
                    <div className="text-sm text-gray-600 mt-1">{member.email}</div>
                    <div className="text-xs text-red-600 mt-2 leading-relaxed max-w-xs">
                      {member.verificationStatus}
                    </div>
                  </td>
                  <td className="px-6 py-6 text-base text-gray-900">{member.type}</td>
                  <td className="px-6 py-6">
                    <div className="text-sm text-blue-600 cursor-pointer hover:underline font-medium">
                      {member.planExpiresAt ? 'Paid Plan' : 'Free Plan'}
                    </div>
                    <div className="text-xs text-gray-600 mt-1">{member.regDate}</div>
                    <div className="text-xs text-gray-600">Ver Date:</div>
                    <div className="text-xs text-gray-600">{member.verDate}</div>
                  </td>
                  <td className="px-6 py-6 text-base text-gray-900">{member.ccp}</td>
                  <td className="px-6 py-6">
                    <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(member.status)}`}>
                      {member.status}
                    </span>
                  </td>
                  <td className="px-6 py-6">
                    <div className="flex flex-col gap-2">
                      <button
                        onClick={() => handleView(member)}
                        className="bg-cyan-500 hover:bg-cyan-600 text-white px-3 py-2 rounded-md text-sm font-medium flex items-center space-x-1 transition-colors justify-center"
                      >
                        <Eye className="h-4 w-4" />
                        <span>View</span>
                      </button>
                      <button
                        onClick={() => handlePayment(member)}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-md text-sm font-medium flex items-center space-x-1 transition-colors"
                      >
                        <Edit className="h-4 w-4" />
                        <span>Payment</span>
                      </button>

                      {/* Conditional action buttons based on user status */}
                      {member.status === 'Suspended' ? (
                        <button
                          onClick={() => handleStatusChange(member, 'activate')}
                          className="bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded-md text-sm font-medium flex items-center space-x-1 transition-colors"
                        >
                          <span>Activate</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => handleStatusChange(member, 'suspend')}
                          className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-2 rounded-md text-sm font-medium flex items-center space-x-1 transition-colors"
                        >
                          <span>Suspend</span>
                        </button>
                      )}

                      <button
                        onClick={() => handleDelete(member)}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-md text-sm font-medium flex items-center space-x-1 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalUsers > 0 && (
        <div className="flex items-center justify-between px-8 py-6 border-t border-gray-200 bg-gray-50">
          <div className="text-base text-gray-700">
            Showing {startIndex + 1} to {endIndex} of {totalUsers.toLocaleString()} entries
            {searchTerm && ` (filtered)`}
          </div>
          <div className="flex space-x-2">
            <button
              className="px-4 py-2 text-base border border-gray-300 rounded-md hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => prev - 1)}
            >
              Previous
            </button>

            {/* Page numbers */}
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }

              return (
                <button
                  key={pageNum}
                  className={`px-4 py-2 text-base border rounded-md transition-colors ${
                    currentPage === pageNum
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'border-gray-300 hover:bg-gray-100'
                  }`}
                  onClick={() => setCurrentPage(pageNum)}
                >
                  {pageNum}
                </button>
              );
            })}

            <button
              className="px-4 py-2 text-base border border-gray-300 rounded-md hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(prev => prev + 1)}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MemberListing;