import React, { useState, useEffect, useCallback } from 'react';
import { X, CreditCard, Calendar, DollarSign, CheckCircle, XCircle, Clock, AlertCircle } from 'lucide-react';
import { useApi } from '../../context/ApiContext';

const UserPayment = ({ user, onClose }) => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalPayments, setTotalPayments] = useState(0);
  const { adminApi_methods } = useApi();

  const fetchPayments = useCallback(async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      setError(null);
      const response = await adminApi_methods.getUserPayments(user.id, currentPage, 10);
      
      if (response.success) {
        setPayments(response.data.payments || []);
        setTotalPages(response.data.pagination?.totalPages || 1);
        setTotalPayments(response.data.pagination?.totalItems || 0);
      } else {
        setError(response.error || 'Failed to fetch payments');
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch payments');
    } finally {
      setLoading(false);
    }
  }, [adminApi_methods, user?.id, currentPage]);

  // Fetch user payment history
  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get status badge
  const getStatusBadge = (status) => {
    const statusConfig = {
      completed: {
        icon: CheckCircle,
        bgColor: 'bg-green-100',
        textColor: 'text-green-800',
        borderColor: 'border-green-200',
        label: 'Completed'
      },
      pending: {
        icon: Clock,
        bgColor: 'bg-yellow-100',
        textColor: 'text-yellow-800',
        borderColor: 'border-yellow-200',
        label: 'Pending'
      },
      failed: {
        icon: XCircle,
        bgColor: 'bg-red-100',
        textColor: 'text-red-800',
        borderColor: 'border-red-200',
        label: 'Failed'
      },
      cancelled: {
        icon: AlertCircle,
        bgColor: 'bg-gray-100',
        textColor: 'text-gray-800',
        borderColor: 'border-gray-200',
        label: 'Cancelled'
      }
    };

    const config = statusConfig[status] || statusConfig.pending;
    const Icon = config.icon;

    return (
      <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-semibold border ${config.bgColor} ${config.textColor} ${config.borderColor}`}>
        <Icon className="h-4 w-4" />
        <span>{config.label}</span>
      </span>
    );
  };

  // Calculate total amount paid
  const calculateTotalPaid = () => {
    return payments
      .filter(p => p.status === 'completed')
      .reduce((sum, p) => sum + (parseFloat(p.amount?.replace('₹', '') || 0)), 0);
  };

  if (!user) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-green-700 text-white px-8 py-6 flex justify-between items-center sticky top-0 z-10">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
              <CreditCard className="h-8 w-8 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Payment History</h2>
              <p className="text-green-100">{user.name} (ID: {user.id})</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-200 transition-colors p-2 rounded-full hover:bg-white/10"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Summary Cards */}
        <div className="p-8 bg-gray-50 border-b border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Payments</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{totalPayments}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <CreditCard className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Amount Paid</p>
                  <p className="text-3xl font-bold text-green-600 mt-2">₹{calculateTotalPaid().toFixed(2)}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Current Plan</p>
                  <p className="text-3xl font-bold text-purple-600 mt-2">{user.type}</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Payment History Table */}
        <div className="p-8">
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
            <Calendar className="h-6 w-6 mr-2 text-green-600" />
            Transaction History
          </h3>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
              <AlertCircle className="h-12 w-12 text-red-600 mx-auto mb-3" />
              <p className="text-red-800 font-medium">{error}</p>
              <button
                onClick={fetchPayments}
                className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                Retry
              </button>
            </div>
          ) : payments.length === 0 ? (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-12 text-center">
              <CreditCard className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-xl font-medium text-gray-600 mb-2">No Payment History</p>
              <p className="text-gray-500">This user hasn't made any payments yet.</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-100 border-b-2 border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                        Transaction ID
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                        Plan
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                        Payment Method
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                        Date & Time
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                        Receipt
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {payments.map((payment, index) => (
                      <tr key={payment.id || index} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="text-sm font-mono text-gray-900">#{payment.id}</div>
                          {payment.razorpayOrderId && (
                            <div className="text-xs text-gray-500 mt-1 font-mono">
                              {payment.razorpayOrderId}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-gray-900">
                            {payment.planId ? `Plan ${payment.planId}` : 'N/A'}
                          </div>
                          {payment.metadata?.planType && (
                            <div className="text-xs text-gray-500 mt-1 capitalize">
                              {payment.metadata.planType}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-base font-bold text-gray-900">
                            {payment.amount || '₹0'}
                          </div>
                          <div className="text-xs text-gray-500">{payment.currency || 'INR'}</div>
                        </td>
                        <td className="px-6 py-4">
                          {getStatusBadge(payment.status)}
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900 capitalize">
                            {payment.paymentMethod || 'Razorpay'}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">
                            {formatDate(payment.createdAt)}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          {payment.receipt ? (
                            <div className="text-xs font-mono text-gray-600 bg-gray-100 px-2 py-1 rounded">
                              {payment.receipt}
                            </div>
                          ) : (
                            <span className="text-sm text-gray-400">N/A</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200">
                  <div className="text-sm text-gray-700">
                    Page {currentPage} of {totalPages} ({totalPayments} total payments)
                  </div>
                  <div className="flex space-x-2">
                    <button
                      className="px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage(prev => prev - 1)}
                    >
                      Previous
                    </button>
                    
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
                          className={`px-4 py-2 text-sm border rounded-md transition-colors ${
                            currentPage === pageNum
                              ? 'bg-green-600 text-white border-green-600'
                              : 'border-gray-300 hover:bg-gray-100'
                          }`}
                          onClick={() => setCurrentPage(pageNum)}
                        >
                          {pageNum}
                        </button>
                      );
                    })}

                    <button
                      className="px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage(prev => prev + 1)}
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer Actions */}
        <div className="border-t border-gray-200 px-8 py-6 flex justify-end space-x-4 bg-gray-50">
          <button
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition-colors font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserPayment;
