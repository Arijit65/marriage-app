import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";

const LoginForm = ({ isOpen, onClose, onLoginSuccess }) => {
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    phone: '',
    otp: ''
  });
  const [otpSent, setOtpSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [otpMessage, setOtpMessage] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSendOTP = async () => {
    if (!formData.phone) {
      alert('Please enter a mobile number first');
      return;
    }
    
    setSubmitting(true);
    
    try {
      // Call login API to send OTP
      const result = await login(formData.phone);
      
      if (result.success && result.requiresOTP) {
        setOtpSent(true);
        setOtpMessage(result.message);
      } else if (result.success) {
        // Direct login successful (shouldn't happen with OTP flow)
        setShowSuccess(true);
        setTimeout(() => {
          onClose();
          setShowSuccess(false);
          if (onLoginSuccess) onLoginSuccess();
        }, 1000);
      } else {
        alert(result.error || 'Failed to send OTP');
      }
    } catch {
      alert('An error occurred while sending OTP');
    } finally {
      setSubmitting(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (!formData.otp) {
      alert('Please enter the OTP');
      return;
    }
    
    setSubmitting(true);
    
    try {
      // Call login API with OTP
      const result = await login(formData.phone, formData.otp);
      
      if (result.success) {
        setShowSuccess(true);
        
        // Reset form
        setFormData({
          phone: '',
          otp: ''
        });
        setOtpSent(false);
        setOtpMessage('');
        
        // Get stored checkout data
        const redirectPath = sessionStorage.getItem('redirectAfterLogin');
        const storedPlanData = sessionStorage.getItem('checkoutPlanData');
        
        // Close modal and handle redirection
        setTimeout(() => {
          onClose();
          setShowSuccess(false);
          
          // If we have stored checkout data, use it
          if (redirectPath === '/checkout' && storedPlanData) {
            const planData = JSON.parse(storedPlanData);
            sessionStorage.removeItem('redirectAfterLogin');
            sessionStorage.removeItem('checkoutPlanData');
            window.location.href = '/checkout?plan=' + encodeURIComponent(JSON.stringify(planData));
          }
          
          // Call the onLoginSuccess callback if provided
          if (onLoginSuccess) {
            onLoginSuccess();
          }
        }, 1000);
      } else {
        alert(result.error || 'Invalid OTP');
      }
    } catch {
      alert('An error occurred during OTP verification');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!otpSent) {
      // If OTP not sent yet, send OTP first
      await handleSendOTP();
    } else {
      // If OTP sent, verify it
      await handleVerifyOTP();
    }
  };

  const handleClose = () => {
    // Reset form when closing
    setFormData({
      phone: '',
      otp: ''
    });
    setOtpSent(false);
    setShowSuccess(false);
    setOtpMessage('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={handleClose}>
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md mx-4" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Login</h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
          >
            ×
          </button>
        </div>

        {/* OTP Status Messages */}
        {otpMessage && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-6">
            <p className="text-blue-700 text-sm text-center">
              {otpMessage}
            </p>
          </div>
        )}

        {/* Success Display */}
        {showSuccess && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <p className="text-green-600 text-sm text-center">Login Successful!</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Mobile Number Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mobile Number *
            </label>
            <div className="flex gap-2">
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="Enter mobile number"
                className="flex-1 border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-red-300 focus:border-red-300 outline-none transition-colors"
                required
              />
              <button
                type="button"
                onClick={handleSendOTP}
                className="bg-red-500 text-white px-6 py-3 font-semibold rounded-lg hover:bg-red-600 transition-colors whitespace-nowrap disabled:opacity-50"
                disabled={!formData.phone || submitting}
              >
                {submitting ? 'Sending...' : (otpSent ? 'Sent' : 'Send OTP')}
              </button>
            </div>
          </div>

          {/* OTP Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              OTP *
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                name="otp"
                value={formData.otp}
                onChange={handleInputChange}
                placeholder="Enter OTP"
                className="flex-1 border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-red-300 focus:border-red-300 outline-none transition-colors"
                required
              />
              {otpSent && (
                <button
                  type="button"
                  onClick={handleVerifyOTP}
                  className="bg-green-500 text-white px-4 py-3 font-semibold rounded-lg hover:bg-green-600 transition-colors whitespace-nowrap disabled:opacity-50"
                  disabled={submitting}
                >
                  {submitting ? 'Verifying...' : 'Verify OTP'}
                </button>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 bg-red-500 hover:bg-red-600 text-white font-bold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={submitting || (!otpSent && !formData.phone) || (otpSent && !formData.otp)}
          >
            {submitting ? (otpSent ? 'Verifying...' : 'Sending OTP...') : (otpSent ? 'Verify & Login' : 'Send OTP')}
          </button>
        </form>

        {/* Footer Links */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <button
              type="button"
              className="text-red-500 hover:text-red-600 font-medium"
              onClick={() => {
                // You can add navigation to registration here
                alert('Navigate to registration page');
              }}
            >
              Sign up
            </button>
          </p>
          <p className="text-sm text-gray-600 mt-2">
            <button
              type="button"
              className="text-red-500 hover:text-red-600 font-medium"
              onClick={() => {
                // You can add forgot password functionality here
                alert('Forgot password functionality');
              }}
            >
              Forgot password?
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
