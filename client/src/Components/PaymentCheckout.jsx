import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from "./ui/button";
import { User, Phone, Mail, MapPin, CheckCircle, XCircle, ArrowLeft, Shield, Clock } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import LoginForm from '../pages/Auth/Login';
import { useAuth } from '../context/AuthContext';

// Backend URL
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

const PaymentCheckout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user, token } = useAuth();
  const [planData, setPlanData] = useState(location.state?.planData);
  
  // Check for plan data in URL parameters
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const planParam = params.get('plan');
    if (planParam && !planData) {
      try {
        const decodedPlan = JSON.parse(decodeURIComponent(planParam));
        setPlanData(decodedPlan);
      } catch (error) {
        console.error('Error parsing plan data from URL:', error);
      }
    }
  }, [planData]);

  const [formData, setFormData] = useState({
    location: ''
  });

  const [userData, setUserData] = useState({
    name: '',
    email: '',
    phone: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(null);

  // Set user data from auth context when authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      setUserData({
        name: user.name || 'User',
        email: user.email || 'user@example.com',
        phone: user.phone || ''
      });
    }
  }, [isAuthenticated, user]);

  // Handle successful login
  const handleLoginSuccess = () => {
    // User data will be updated automatically via the useEffect above
    // The component will re-render and show the checkout form
  };

  // Load Razorpay script
  useEffect(() => {
    const loadRazorpayScript = () => {
      return new Promise((resolve) => {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        script.onload = () => {
          setRazorpayLoaded(true);
          resolve(true);
        };
        script.onerror = () => {
          console.error('Razorpay SDK failed to load');
          resolve(false);
        };
        document.body.appendChild(script);
      });
    };

    if (!window.Razorpay) {
      loadRazorpayScript();
    } else {
      setRazorpayLoaded(true);
    }
  }, []);

  // Check for existing payment status when component mounts
  useEffect(() => {
    const storedPaymentStatus = localStorage.getItem('planPaymentStatus');
    if (storedPaymentStatus) {
      try {
        const parsedStatus = JSON.parse(storedPaymentStatus);
        setPaymentStatus(parsedStatus);
      } catch (error) {
        console.error('Error parsing payment status:', error);
        localStorage.removeItem('planPaymentStatus');
      }
    }
  }, []);

  // Redirect if no plan data
  useEffect(() => {
    if (!planData) {
      navigate('/plans');
    }
  }, [planData, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const savePaymentStatus = (status, email, orderId) => {
    const paymentData = {
      status,
      email,
      orderId,
      planName: planData.name,
      planPrice: planData.price,
      timestamp: new Date().toISOString()
    };
    localStorage.setItem('planPaymentStatus', JSON.stringify(paymentData));
    setPaymentStatus(paymentData);
  };

  const clearPaymentStatus = () => {
    localStorage.removeItem('planPaymentStatus');
    setPaymentStatus(null);
  };

  const handlePayment = async () => {
    if (!validateForm()) {
      return;
    }

    // Check if Razorpay is loaded
    if (!window.Razorpay) {
      alert('Razorpay SDK is not loaded yet. Please try again in a moment.');
      return;
    }
    
    setIsSubmitting(true);
    setSubmitMessage('');
    
    try {
      // Create plan subscription with payment order
      const response = await fetch(`${BACKEND_URL}/api/v1/payments/subscribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          planId: planData.id,
          location: formData.location,
          amount: planData.price
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        if (result.errors && Array.isArray(result.errors)) {
          // Handle validation errors from server
          const serverErrors = {};
          result.errors.forEach(error => {
            if (error.includes('location')) serverErrors.location = error;
          });
          setErrors(serverErrors);
        } else {
          setSubmitMessage(result.message || 'Subscription failed. Please try again.');
        }
        return;
      }

      // Check if payment data exists
      if (result.success && result.data && result.data.payment) {
        const options = {
          key: import.meta.env.VITE_APP_RAZORPAY_KEY_ID || 'rzp_test_18cNkDBw1AyJNf',
          amount: result.data.payment.amount,
          currency: result.data.payment.currency,
          name: `${planData.name} Plan Subscription`,
          description: `Subscription for ${planData.name} plan`,
          order_id: result.data.payment.orderId,
          handler: async function (response) {
            try {
              const verifyResponse = await fetch(`${BACKEND_URL}/api/v1/payments/verify`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature
                }),
              });

              const verifyResult = await verifyResponse.json();
              
              if (verifyResult.success) {
                // Save successful payment status
                savePaymentStatus('success', userData.email, response.razorpay_order_id);
                
                // Reset form
                setFormData({
                  location: ''
                });
              } else {
                // Save failed payment status
                savePaymentStatus('failed', userData.email, response.razorpay_order_id);
              }
            } catch (error) {
              console.error('Payment verification error:', error);
              // Save failed payment status
              savePaymentStatus('failed', userData.email, 'unknown');
            }
          },
          prefill: {
            name: userData.name || "",
            email: userData.email || "",
            contact: userData.phone || ""
          },
          theme: {
            color: "#DC2626" // Red color to match your theme
          }
        };

        try {
          const rzp = new window.Razorpay(options);
          rzp.open();
        } catch (error) {
          console.error('Error creating Razorpay instance:', error);
          setSubmitMessage('Could not initialize payment gateway. Please try again later.');
        }
      } else {
        setSubmitMessage('Failed to create payment order. Please try again.');
      }
    } catch (error) {
      console.error('Payment error:', error);
      setSubmitMessage('Payment failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    navigate('/plans');
  };

  const handleRetry = () => {
    clearPaymentStatus();
    setSubmitMessage('');
  };

  // Show login popup if not authenticated
  if (!isAuthenticated) {
    return (
      <LoginForm 
        isOpen={true}
        onClose={() => {
          navigate('/plans');
        }}
        onLoginSuccess={handleLoginSuccess}
      />
    );
  }

  // Render success message
  if (paymentStatus && paymentStatus.status === 'success') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-yellow-50 py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <motion.div
            className="bg-white rounded-2xl shadow-2xl p-8 text-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <CheckCircle className="w-10 h-10 text-green-600" />
            </motion.div>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Payment Successful!
            </h1>
            <p className="text-gray-600 mb-6">
              Thank you for subscribing to the {paymentStatus.planName} plan!
            </p>
            
            <div className="bg-gray-50 rounded-xl p-6 mb-8 text-left">
              <h3 className="font-semibold text-gray-900 mb-4">Subscription Details:</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <p><span className="font-medium">Plan:</span> {paymentStatus.planName}</p>
                <p><span className="font-medium">Amount:</span> ₹{paymentStatus.planPrice}</p>
                <p><span className="font-medium">Email:</span> {paymentStatus.email}</p>
                <p><span className="font-medium">Order ID:</span> {paymentStatus.orderId}</p>
              </div>
            </div>
            
            <p className="text-sm text-gray-500 mb-8">
              You will receive a confirmation email shortly with further instructions.
            </p>
            
            <div className="space-y-3">
              <Button
                onClick={() => navigate('/dashboard')}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-xl"
              >
                Go to Dashboard
              </Button>
              <Button
                onClick={handleBack}
                variant="outline"
                className="w-full border-gray-300 text-gray-700 hover:bg-gray-50 py-3 px-6 rounded-xl"
              >
                Back to Plans
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  // Render failure message
  if (paymentStatus && paymentStatus.status === 'failed') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-yellow-50 py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <motion.div
            className="bg-white rounded-2xl shadow-2xl p-8 text-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <XCircle className="w-10 h-10 text-red-600" />
            </motion.div>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Payment Failed
            </h1>
            <p className="text-gray-600 mb-6">
              Sorry, your payment could not be processed.
            </p>
            
            <div className="bg-gray-50 rounded-xl p-6 mb-8 text-left">
              <h3 className="font-semibold text-gray-900 mb-4">Details:</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <p><span className="font-medium">Plan:</span> {paymentStatus.planName}</p>
                <p><span className="font-medium">Amount:</span> ₹{paymentStatus.planPrice}</p>
                <p><span className="font-medium">Email:</span> {paymentStatus.email}</p>
                <p><span className="font-medium">Order ID:</span> {paymentStatus.orderId}</p>
              </div>
            </div>
            
            <div className="space-y-3">
              <Button
                onClick={handleRetry}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-xl"
              >
                Try Again
              </Button>
              <Button
                onClick={handleBack}
                variant="outline"
                className="w-full border-gray-300 text-gray-700 hover:bg-gray-50 py-3 px-6 rounded-xl"
              >
                Back to Plans
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  // If no plan data, show loading or redirect
  if (!planData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-yellow-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading plan details...</p>
        </div>
      </div>
    );
  }

  // Render the checkout form
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-yellow-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <Button
            onClick={handleBack}
            variant="outline"
            className="mb-6 border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Plans
          </Button>
          
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Complete Your Subscription
          </h1>
          <p className="text-xl text-gray-600">
            You're subscribing to the {planData.name} plan
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Plan Summary */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl font-bold">
                  {planData.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{planData.name} Plan</h2>
              <p className="text-gray-600 mb-4">{planData.description}</p>
            </div>

            <div className="space-y-4 mb-6">
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="text-gray-700">Unlimited Ad Circulation</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="text-gray-700">Unlimited Proposals</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="text-gray-700">20 Proposals per Month</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="text-gray-700">Contact Privacy Protection</span>
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-4 text-center">
              <div className="text-3xl font-bold text-gray-900 mb-1">₹{planData.price}</div>
              <p className="text-gray-600 text-sm">One-time payment</p>
            </div>
          </div>

          {/* Payment Form */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Personal Information</h3>
              <p className="text-gray-600 text-sm">Your details from your profile</p>
            </div>

            {/* User Info Display */}
            <div className="bg-blue-50 rounded-xl p-6 mb-6 border border-blue-200">
              <h4 className="font-semibold text-blue-800 mb-4">Your Profile Details</h4>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <User className="w-5 h-5 text-blue-600" />
                  <span className="text-gray-700"><strong>Name:</strong> {userData.name}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-blue-600" />
                  <span className="text-gray-700"><strong>Email:</strong> {userData.email}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-blue-600" />
                  <span className="text-gray-700"><strong>Phone:</strong> {userData.phone}</span>
                </div>
              </div>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); handlePayment(); }} className="space-y-5">
              {/* Location field */}
              <div>
                <label htmlFor="location" className="block text-sm font-semibold text-gray-700 mb-2">
                  Location <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    placeholder="Enter your location"
                    className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl bg-gray-50 text-gray-900 font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 ${
                      errors.location ? 'border-red-500 bg-red-50' : 'border-gray-200 hover:border-gray-300'
                    }`}
                  />
                </div>
                {errors.location && (
                  <motion.p 
                    className="text-center text-red-500 text-sm mt-2"
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    {errors.location}
                  </motion.p>
                )}
              </div>

              {/* Security Info */}
              <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                <div className="flex items-center space-x-3 mb-2">
                  <Shield className="w-5 h-5 text-blue-600" />
                  <span className="text-sm font-semibold text-blue-800">Secure Payment</span>
                </div>
                <p className="text-xs text-blue-700">
                  Your payment information is encrypted and secure. We use Razorpay for secure payment processing.
                </p>
              </div>

              {/* Submit button */}
              <div className="pt-4">
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold py-4 px-8 rounded-xl text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
                  size="lg"
                  disabled={isSubmitting || !razorpayLoaded}
                >
                  {isSubmitting ? 'Processing...' : `Pay ₹${planData.price} & Subscribe`}
                </Button>
                
                {submitMessage && (
                  <motion.p 
                    className="text-center text-gray-600 text-sm mt-4"
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    {submitMessage}
                  </motion.p>
                )}
                
                {!razorpayLoaded && (
                  <div className="flex items-center justify-center space-x-2 mt-4 text-sm text-gray-500">
                    <Clock className="w-4 h-4" />
                    <span>Loading payment gateway...</span>
                  </div>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentCheckout;
