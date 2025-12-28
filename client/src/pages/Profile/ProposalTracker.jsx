import React, { useState, useEffect } from 'react';
import {
  Send, Inbox, Clock, CheckCircle, XCircle, Eye, MessageSquare,
  Calendar, MapPin, Briefcase, Heart, UserCheck, Filter, Search,
  ChevronRight, ChevronLeft, AlertCircle, RefreshCw, User
} from 'lucide-react';
import { useApi } from '../../context';

const ProposalTracker = ({ user }) => {
  const { api } = useApi();
  const [activeTab, setActiveTab] = useState('received'); // 'received' or 'sent'
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProposal, setSelectedProposal] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all'); // 'all', 'pending', 'accepted', 'rejected'
  const [searchQuery, setSearchQuery] = useState('');
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
    hasNext: false,
    hasPrev: false
  });

  // Fetch proposals based on active tab
  useEffect(() => {
    fetchProposals();
  }, [activeTab, filterStatus, pagination.currentPage]);

  const fetchProposals = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const endpoint = activeTab === 'sent' ? '/proposals/sent' : '/proposals/received';
      const params = {
        page: pagination.currentPage,
        limit: 10
      };
      
      if (filterStatus !== 'all') {
        params.status = filterStatus;
      }

      const response = await api.get(endpoint, { params });
      
      if (response.data.success) {
        setProposals(response.data.data.proposals);
        setPagination(response.data.data.pagination);
      }
    } catch (err) {
      console.error('Error fetching proposals:', err);
      setError(err.response?.data?.message || 'Failed to fetch proposals');
    } finally {
      setLoading(false);
    }
  };

  // Handle proposal response (accept/reject)
  const handleProposalResponse = async (proposalId, status, responseMessage = '') => {
    try {
      const response = await api.put(`/proposals/${proposalId}/respond`, {
        status,
        responseMessage
      });

      if (response.data.success) {
        // Refresh proposals
        fetchProposals();
        setSelectedProposal(null);
        
        // Show success message
        alert(`Proposal ${status === 'accepted' ? 'accepted' : 'rejected'} successfully!`);
      }
    } catch (err) {
      console.error('Error responding to proposal:', err);
      alert(err.response?.data?.message || 'Failed to respond to proposal');
    }
  };

  // Handle withdraw proposal
  const handleWithdrawProposal = async (proposalId) => {
    if (!confirm('Are you sure you want to withdraw this proposal?')) {
      return;
    }

    try {
      const response = await api.delete(`/proposals/${proposalId}/withdraw`);

      if (response.data.success) {
        fetchProposals();
        alert('Proposal withdrawn successfully!');
      }
    } catch (err) {
      console.error('Error withdrawing proposal:', err);
      alert(err.response?.data?.message || 'Failed to withdraw proposal');
    }
  };

  // Get status badge color and text
  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { color: 'bg-yellow-100 text-yellow-800 border-yellow-200', text: 'Pending', icon: Clock },
      accepted: { color: 'bg-green-100 text-green-800 border-green-200', text: 'Accepted', icon: CheckCircle },
      rejected: { color: 'bg-red-100 text-red-800 border-red-200', text: 'Rejected', icon: XCircle },
      withdrawn: { color: 'bg-gray-100 text-gray-800 border-gray-200', text: 'Withdrawn', icon: AlertCircle }
    };
    
    return statusConfig[status] || statusConfig.pending;
  };

  // Format date
  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Filter proposals based on search
  const filteredProposals = proposals.filter(proposal => {
    const targetUser = activeTab === 'sent' ? proposal.proposedUser : proposal.proposerUser;
    
    // Skip if targetUser is undefined
    if (!targetUser) return false;
    
    const searchLower = searchQuery.toLowerCase();
    
    return (
      targetUser.name?.toLowerCase().includes(searchLower) ||
      targetUser.occupation?.toLowerCase().includes(searchLower) ||
      targetUser.location?.city?.toLowerCase().includes(searchLower) ||
      targetUser.location?.state?.toLowerCase().includes(searchLower)
    );
  });

  // Render proposal card
  const renderProposalCard = (proposal) => {
    const targetUser = activeTab === 'sent' ? proposal.proposedUser : proposal.proposerUser;
    
    // Skip rendering if targetUser is undefined
    if (!targetUser) return null;
    
    const statusBadge = getStatusBadge(proposal.status);
    const StatusIcon = statusBadge.icon;
    const baseUrl = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';
    const profilePhoto = targetUser.photos?.[0] || null;

    return (
      <div
        key={proposal.id}
        className="bg-white rounded-lg border border-slate-200 hover:shadow-lg transition-shadow duration-200 overflow-hidden"
      >
        <div className="p-4">
          <div className="flex gap-4">
            {/* Profile Photo */}
            <div className="flex-shrink-0">
              <div className="w-24 h-24 rounded-lg overflow-hidden bg-slate-100">
                {profilePhoto ? (
                  <img
                    src={`${baseUrl}${profilePhoto}`}
                    alt={targetUser.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = 'https://dummyimage.com/200x200/eeeeee/333&text=No+Photo';
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <User className="h-10 w-10 text-slate-400" />
                  </div>
                )}
              </div>
            </div>

            {/* User Details */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 truncate">
                    {targetUser.name || 'Anonymous User'}
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-slate-600 mt-1">
                    <span>{targetUser.age} yrs</span>
                    <span>•</span>
                    <span>{targetUser.gender || 'N/A'}</span>
                    <span>•</span>
                    <span>{targetUser.maritalStatus || 'N/A'}</span>
                  </div>
                </div>
                
                {/* Status Badge */}
                <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border ${statusBadge.color} text-xs font-medium`}>
                  <StatusIcon className="h-3.5 w-3.5" />
                  {statusBadge.text}
                </div>
              </div>

              {/* Additional Details */}
              <div className="space-y-1.5 text-sm text-slate-600">
                {targetUser.occupation && (
                  <div className="flex items-center gap-2">
                    <Briefcase className="h-4 w-4 text-slate-400" />
                    <span>{targetUser.occupation}</span>
                  </div>
                )}
                
                {(targetUser.location?.city || targetUser.location?.state) && (
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-slate-400" />
                    <span>
                      {[targetUser.location.city, targetUser.location.state]
                        .filter(Boolean)
                        .join(', ')}
                    </span>
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-slate-400" />
                  <span>{formatDate(proposal.createdAt)}</span>
                </div>
              </div>

              {/* Message Preview */}
              {proposal.message && (
                <div className="mt-3 p-2 bg-slate-50 rounded border border-slate-200">
                  <div className="flex items-start gap-2">
                    <MessageSquare className="h-4 w-4 text-slate-400 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-slate-700 line-clamp-2">
                      {proposal.message}
                    </p>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="mt-4 flex items-center gap-2">
                <button
                  onClick={() => setSelectedProposal(proposal)}
                  className="px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors text-sm font-medium flex items-center gap-2"
                >
                  <Eye className="h-4 w-4" />
                  View Details
                </button>

                {activeTab === 'received' && proposal.status === 'pending' && (
                  <>
                    <button
                      onClick={() => handleProposalResponse(proposal.id, 'accepted')}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium flex items-center gap-2"
                    >
                      <CheckCircle className="h-4 w-4" />
                      Accept
                    </button>
                    <button
                      onClick={() => handleProposalResponse(proposal.id, 'rejected')}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium flex items-center gap-2"
                    >
                      <XCircle className="h-4 w-4" />
                      Reject
                    </button>
                  </>
                )}

                {activeTab === 'sent' && proposal.status === 'pending' && (
                  <button
                    onClick={() => handleWithdrawProposal(proposal.id)}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium flex items-center gap-2"
                  >
                    <XCircle className="h-4 w-4" />
                    Withdraw
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Render proposal detail modal
  const renderProposalDetail = () => {
    if (!selectedProposal) return null;

    const targetUser = activeTab === 'sent' 
      ? selectedProposal.proposedUser 
      : selectedProposal.proposerUser;
    const statusBadge = getStatusBadge(selectedProposal.status);
    const StatusIcon = statusBadge.icon;
    const baseUrl = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';

    return (
      <div
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        onClick={() => setSelectedProposal(null)}
      >
        <div
          className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-slate-900">Proposal Details</h2>
            <button
              onClick={() => setSelectedProposal(null)}
              className="text-slate-400 hover:text-slate-600 text-2xl font-bold"
            >
              ×
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Status Banner */}
            <div className={`flex items-center gap-3 p-4 rounded-lg border ${statusBadge.color}`}>
              <StatusIcon className="h-6 w-6" />
              <div>
                <p className="font-semibold">Status: {statusBadge.text}</p>
                {selectedProposal.respondedAt && (
                  <p className="text-sm opacity-80">
                    Responded on {formatDate(selectedProposal.respondedAt)}
                  </p>
                )}
              </div>
            </div>

            {/* User Profile */}
            <div className="flex gap-6 p-4 bg-slate-50 rounded-lg">
              {/* Photos */}
              <div className="flex-shrink-0">
                {targetUser.photos && targetUser.photos.length > 0 ? (
                  <div className="grid grid-cols-2 gap-2">
                    {targetUser.photos.slice(0, 4).map((photo, idx) => (
                      <div key={idx} className="w-24 h-24 rounded-lg overflow-hidden bg-slate-200">
                        <img
                          src={`${baseUrl}${photo}`}
                          alt={`${targetUser.name} - ${idx + 1}`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.src = 'https://dummyimage.com/200x200/eeeeee/333&text=No+Photo';
                          }}
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="w-48 h-48 rounded-lg overflow-hidden bg-slate-200 flex items-center justify-center">
                    <User className="h-20 w-20 text-slate-400" />
                  </div>
                )}
              </div>

              {/* Details */}
              <div className="flex-1">
                <h3 className="text-xl font-bold text-slate-900 mb-3">
                  {targetUser.name || 'Anonymous User'}
                </h3>
                
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-slate-600">Age:</span>
                    <span className="ml-2 font-medium text-slate-900">{targetUser.age} years</span>
                  </div>
                  
                  <div>
                    <span className="text-slate-600">Gender:</span>
                    <span className="ml-2 font-medium text-slate-900">{targetUser.gender || 'N/A'}</span>
                  </div>
                  
                  <div>
                    <span className="text-slate-600">Marital Status:</span>
                    <span className="ml-2 font-medium text-slate-900">{targetUser.maritalStatus || 'N/A'}</span>
                  </div>
                  
                  {targetUser.occupation && (
                    <div>
                      <span className="text-slate-600">Occupation:</span>
                      <span className="ml-2 font-medium text-slate-900">{targetUser.occupation}</span>
                    </div>
                  )}
                  
                  {targetUser.education && (
                    <div className="col-span-2">
                      <span className="text-slate-600">Education:</span>
                      <span className="ml-2 font-medium text-slate-900">{targetUser.education}</span>
                    </div>
                  )}
                  
                  {(targetUser.location?.city || targetUser.location?.state) && (
                    <div className="col-span-2">
                      <span className="text-slate-600">Location:</span>
                      <span className="ml-2 font-medium text-slate-900">
                        {[targetUser.location.city, targetUser.location.state]
                          .filter(Boolean)
                          .join(', ')}
                      </span>
                    </div>
                  )}
                  
                  {targetUser.familyType && (
                    <div className="col-span-2">
                      <span className="text-slate-600">Family Type:</span>
                      <span className="ml-2 font-medium text-slate-900">{targetUser.familyType}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Proposal Message */}
            {selectedProposal.message && (
              <div>
                <h4 className="font-semibold text-slate-900 mb-2">Proposal Message</h4>
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-slate-700 whitespace-pre-wrap">{selectedProposal.message}</p>
                </div>
              </div>
            )}

            {/* Response Message */}
            {selectedProposal.responseMessage && (
              <div>
                <h4 className="font-semibold text-slate-900 mb-2">Response Message</h4>
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-slate-700 whitespace-pre-wrap">{selectedProposal.responseMessage}</p>
                </div>
              </div>
            )}

            {/* Timeline */}
            <div>
              <h4 className="font-semibold text-slate-900 mb-3">Timeline</h4>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-blue-500 mt-2"></div>
                  <div>
                    <p className="text-sm font-medium text-slate-900">Proposal Sent</p>
                    <p className="text-xs text-slate-600">{formatDate(selectedProposal.createdAt)}</p>
                  </div>
                </div>
                
                {selectedProposal.respondedAt && (
                  <div className="flex items-start gap-3">
                    <div className={`w-2 h-2 rounded-full mt-2 ${
                      selectedProposal.status === 'accepted' ? 'bg-green-500' : 'bg-red-500'
                    }`}></div>
                    <div>
                      <p className="text-sm font-medium text-slate-900">
                        Proposal {selectedProposal.status === 'accepted' ? 'Accepted' : 'Rejected'}
                      </p>
                      <p className="text-xs text-slate-600">{formatDate(selectedProposal.respondedAt)}</p>
                    </div>
                  </div>
                )}
                
                {selectedProposal.expiresAt && selectedProposal.status === 'pending' && (
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-yellow-500 mt-2"></div>
                    <div>
                      <p className="text-sm font-medium text-slate-900">Expires On</p>
                      <p className="text-xs text-slate-600">{formatDate(selectedProposal.expiresAt)}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            {activeTab === 'received' && selectedProposal.status === 'pending' && (
              <div className="flex gap-3 pt-4 border-t border-slate-200">
                <button
                  onClick={() => {
                    handleProposalResponse(selectedProposal.id, 'accepted');
                  }}
                  className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center justify-center gap-2"
                >
                  <CheckCircle className="h-5 w-5" />
                  Accept Proposal
                </button>
                <button
                  onClick={() => {
                    handleProposalResponse(selectedProposal.id, 'rejected');
                  }}
                  className="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium flex items-center justify-center gap-2"
                >
                  <XCircle className="h-5 w-5" />
                  Reject Proposal
                </button>
              </div>
            )}

            {activeTab === 'sent' && selectedProposal.status === 'pending' && (
              <div className="flex gap-3 pt-4 border-t border-slate-200">
                <button
                  onClick={() => {
                    handleWithdrawProposal(selectedProposal.id);
                  }}
                  className="w-full px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium flex items-center justify-center gap-2"
                >
                  <XCircle className="h-5 w-5" />
                  Withdraw Proposal
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Proposal Tracker</h1>
        <p className="text-slate-600">Manage all your sent and received proposals</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-slate-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
              <Send className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-slate-600">Sent</p>
              <p className="text-2xl font-bold text-slate-900">
                {user?.profile_stats?.proposals_sent || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-slate-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center">
              <Inbox className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-slate-600">Received</p>
              <p className="text-2xl font-bold text-slate-900">
                {user?.profile_stats?.proposals_received || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-slate-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-slate-600">Accepted</p>
              <p className="text-2xl font-bold text-slate-900">
                {user?.profile_stats?.proposals_accepted || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-slate-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-yellow-100 flex items-center justify-center">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-slate-600">Pending</p>
              <p className="text-2xl font-bold text-slate-900">
                {user?.profile_stats?.proposals_pending || 0}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs and Filters */}
      <div className="bg-white rounded-lg border border-slate-200 p-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* Tabs */}
          <div className="flex gap-2">
            <button
              onClick={() => {
                setActiveTab('received');
                setPagination(prev => ({ ...prev, currentPage: 1 }));
              }}
              className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                activeTab === 'received'
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <Inbox className="h-4 w-4" />
              Received
            </button>
            <button
              onClick={() => {
                setActiveTab('sent');
                setPagination(prev => ({ ...prev, currentPage: 1 }));
              }}
              className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                activeTab === 'sent'
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <Send className="h-4 w-4" />
              Sent
            </button>
          </div>

          {/* Filter and Search */}
          <div className="flex gap-2">
            {/* Status Filter */}
            <select
              value={filterStatus}
              onChange={(e) => {
                setFilterStatus(e.target.value);
                setPagination(prev => ({ ...prev, currentPage: 1 }));
              }}
              className="px-4 py-2 bg-slate-100 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="accepted">Accepted</option>
              <option value="rejected">Rejected</option>
              <option value="withdrawn">Withdrawn</option>
            </select>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name, location..."
                className="pl-10 pr-4 py-2 bg-slate-100 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
              />
            </div>

            {/* Refresh Button */}
            <button
              onClick={fetchProposals}
              disabled={loading}
              className="px-4 py-2 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 text-slate-700 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900 mx-auto mb-4"></div>
            <p className="text-slate-600">Loading proposals...</p>
          </div>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-3" />
          <p className="text-red-700 font-medium mb-2">Error Loading Proposals</p>
          <p className="text-red-600 text-sm">{error}</p>
          <button
            onClick={fetchProposals}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      ) : filteredProposals.length === 0 ? (
        <div className="bg-white rounded-lg border border-slate-200 p-12 text-center">
          <Heart className="h-16 w-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-slate-900 mb-2">
            No Proposals {searchQuery ? 'Found' : 'Yet'}
          </h3>
          <p className="text-slate-600">
            {searchQuery
              ? 'Try adjusting your search filters'
              : activeTab === 'sent'
              ? 'Start connecting with potential matches by sending proposals'
              : 'Received proposals will appear here'}
          </p>
        </div>
      ) : (
        <>
          {/* Proposal Cards */}
          <div className="space-y-4">
            {filteredProposals.map((proposal) => renderProposalCard(proposal))}
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-between bg-white rounded-lg border border-slate-200 p-4">
              <div className="text-sm text-slate-600">
                Showing {((pagination.currentPage - 1) * 10) + 1} to{' '}
                {Math.min(pagination.currentPage * 10, pagination.totalCount)} of{' '}
                {pagination.totalCount} proposals
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={() => setPagination(prev => ({ ...prev, currentPage: prev.currentPage - 1 }))}
                  disabled={!pagination.hasPrev}
                  className="px-4 py-2 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </button>
                
                <div className="flex items-center gap-2">
                  {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                    const page = i + 1;
                    return (
                      <button
                        key={page}
                        onClick={() => setPagination(prev => ({ ...prev, currentPage: page }))}
                        className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                          pagination.currentPage === page
                            ? 'bg-slate-900 text-white'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        {page}
                      </button>
                    );
                  })}
                </div>
                
                <button
                  onClick={() => setPagination(prev => ({ ...prev, currentPage: prev.currentPage + 1 }))}
                  disabled={!pagination.hasNext}
                  className="px-4 py-2 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Proposal Detail Modal */}
      {renderProposalDetail()}
    </div>
  );
};

export default ProposalTracker;
