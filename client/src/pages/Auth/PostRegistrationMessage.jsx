import React, { useState, useEffect } from 'react';
import { CheckCircle, Gift, Heart, Users, ArrowRight, Star, Crown, Clock, Phone } from 'lucide-react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';

const PostRegistrationMessage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { id } = useParams();

    const [userData, setUserData] = useState({
        id: id || 'G2001',
        name: 'Loading...'
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch user data based on ID from URL params
    useEffect(() => {
        const fetchUserData = async () => {
            if (!id) {
                setLoading(false);
                return;
            }

            try {
                const token = localStorage.getItem('token');
                const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

                const response = await fetch(`${API_URL}/users/me`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (response.ok) {
                    const result = await response.json();
                    if (result.success && result.data.user) {
                        setUserData({
                            id: result.data.user.id,
                            name: result.data.user.name || 'New User'
                        });
                    }
                } else {
                    // If API fails, use the ID from params
                    setUserData({
                        id: id,
                        name: 'New User'
                    });
                }
            } catch (err) {
                console.error('Error fetching user data:', err);
                // Fallback to using ID from params
                setUserData({
                    id: id,
                    name: 'New User'
                });
                setError('Could not load user details');
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [id]);

    const benefits = [
        {
            icon: Gift,
            title: 'View Matching profile available with us',
            description: 'Browse through our extensive database of verified profiles',
            color: 'text-red-600 bg-red-100'
        },
        {
            icon: Heart,
            title: 'Receive Proposal',
            description: 'Get proposal notifications from interested matches',
            color: 'text-pink-600 bg-pink-100'
        },
        {
            icon: Users,
            title: 'Send Proposal using Proposal point',
            description: 'Use your proposal points to connect with preferred matches',
            color: 'text-blue-600 bg-blue-100'
        },
        {
            icon: CheckCircle,
            title: 'Check advertisement PUBlication news paper',
            description: 'Track where your advertisement appears in newspapers',
            color: 'text-green-600 bg-green-100'
        }
    ];

    const nextSteps = [
        {
            step: 2,
            title: 'Click here to go in dahsboard and to fill details of your profile',
            action: () => navigate('/dashboard'),
            color: 'bg-blue-500'
        },
        {
            step: 3,
            title: 'Click here to find your perfect match',
            action: () => navigate('/profiles'),
            color: 'bg-purple-500'
        }
    ];

    const pricingInfo = [
        {
            title: 'Basic Ad for Till marriage',
            price: 'Rs 25.00',
            duration: 'One Time',
            highlight: true
        },
        {
            title: '10 days Trial',
            price: 'FREE!',
            duration: 'Limited Time',
            highlight: false
        }
    ];

    const handleViewProfiles = () => {
        navigate('/profiles');
    };

    const handleCompleteProfile = () => {
        navigate('/profile/complete');
    };

    const handleContactSupport = () => {
        // Add contact support logic
        window.open('tel:+91-XXXXXXXXXX', '_self');
    };

    // Show loading state
    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-red-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading your registration details...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-red-50">
            {/* Header Section */}
            <div className="bg-gradient-to-r from-red-600 via-red-700 to-red-800 text-white py-12">
                <div className="max-w-4xl mx-auto px-6 text-center">
                    <div className="flex items-center justify-center mb-6">
                        <div className="bg-white/20 backdrop-blur-sm p-4 rounded-full">
                            <CheckCircle className="h-16 w-16 text-white" />
                        </div>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">
                         ADVERTISEMENT POSTED
                    </h1>
                    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 max-w-2xl mx-auto">
                        <h2 className="text-2xl font-semibold mb-2">Try it for FREE !</h2>
                        <p className="text-red-100 text-lg">
                            Welcome to the world of matrimonial possibilities
                        </p>
                    </div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-6 py-12">
                {/* Welcome Message Card */}
                <div className="bg-gradient-to-r from-cyan-100 to-blue-100 rounded-3xl p-8 mb-12 shadow-lg border border-cyan-200">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="bg-cyan-500 p-3 rounded-full">
                            <Crown className="h-8 w-8 text-white" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800">Welcome to Marriage Paper, {userData.name}!</h2>
                            <p className="text-cyan-700">Your AD {userData.id}</p>
                            {error && <p className="text-orange-600 text-sm mt-1">{error}</p>}
                        </div>
                    </div>

                    <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 mb-6">
                        <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                            <Star className="h-6 w-6 text-yellow-500" />
                            You received 1 Proposal or Bonus + 10 CCP as Bonus
                        </h3>
                        
                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {benefits.map((benefit, index) => (
                                <div key={index} className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-300 group">
                                    <div className={`w-12 h-12 rounded-full ${benefit.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300`}>
                                        <benefit.icon className="h-6 w-6" />
                                    </div>
                                    <h4 className="font-semibold text-gray-800 mb-2 text-sm">
                                        {index + 1}. {benefit.title}
                                    </h4>
                                    <p className="text-gray-600 text-xs">{benefit.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Next Steps */}
                    <div className="space-y-4">
                        {nextSteps.map((step, index) => (
                            <div key={index} className="bg-white/60 backdrop-blur-sm rounded-xl p-4">
                                <button
                                    onClick={step.action}
                                    className="w-full flex items-center justify-between hover:bg-white/40 rounded-lg p-3 transition-all duration-300 group"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`w-8 h-8 rounded-full ${step.color} text-white flex items-center justify-center font-bold text-sm`}>
                                            {step.step}
                                        </div>
                                        <span className="text-gray-800 font-medium text-left">{step.title}</span>
                                    </div>
                                    <ArrowRight className="h-5 w-5 text-gray-600 group-hover:text-blue-600 transition-colors" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Why Marriage Paper Section */}
                <div className="grid lg:grid-cols-3 gap-8 mb-12">
                    {/* Main Content */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-200">
                            <h3 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                                <div className="bg-gradient-to-r from-red-500 to-red-600 p-3 rounded-full">
                                    <Heart className="h-8 w-8 text-white" />
                                </div>
                                Why MarriagePaper.com ?
                            </h3>
                            <div className="prose prose-gray max-w-none">
                                <p className="text-gray-600 leading-relaxed text-lg mb-4">
                                    We are India's First Newspaper Like Matrimonial 
                                    Ad Service on Internet with very Genuine and 
                                    Real profile like partner and groom. Our 
                                    advertisement at the same time our service 
                                    similar to Newspaper matrimonial advertisement 
                                    yet more powerful due to advance technology.
                                </p>
                            </div>
                            
                            {/* Action Buttons */}
                            <div className="flex flex-wrap gap-4 mt-8">
                                <button
                                    onClick={handleViewProfiles}
                                    className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 shadow-lg flex items-center gap-2"
                                >
                                    <Users className="h-5 w-5" />
                                    View Matching Profiles
                                </button>
                                <button
                                    onClick={handleCompleteProfile}
                                    className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 shadow-lg flex items-center gap-2"
                                >
                                    <ArrowRight className="h-5 w-5" />
                                    Complete Profile
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Pricing Card */}
                    <div className="lg:col-span-1">
                        <div className="bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-600 rounded-3xl p-8 shadow-xl text-gray-800 h-full">
                            <h4 className="text-2xl font-bold mb-6 flex items-center gap-2">
                                <div className="bg-white/20 p-2 rounded-full">
                                    <Clock className="h-6 w-6" />
                                </div>
                                Special Offers
                            </h4>
                            
                            <div className="space-y-4">
                                {pricingInfo.map((plan, index) => (
                                    <div key={index} className={`bg-white/20 backdrop-blur-sm rounded-2xl p-4 ${plan.highlight ? 'ring-2 ring-white/50' : ''}`}>
                                        {plan.highlight && (
                                            <div className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold mb-3 inline-block">
                                                Pay Now
                                            </div>
                                        )}
                                        <h5 className="font-bold text-lg mb-2">{plan.title}</h5>
                                        <div className="text-2xl font-bold mb-1">{plan.price}</div>
                                        <p className="text-sm opacity-90">{plan.duration}</p>
                                        {!plan.highlight && (
                                            <div className="text-green-800 font-bold text-lg mt-2">FREE!</div>
                                        )}
                                    </div>
                                ))}
                            </div>

                            <button
                                onClick={handleContactSupport}
                                className="w-full bg-white/20 hover:bg-white/30 backdrop-blur-sm text-gray-800 font-bold py-3 px-6 rounded-xl transition-all duration-300 hover:scale-105 mt-6 flex items-center justify-center gap-2"
                            >
                                <Phone className="h-5 w-5" />
                                Need Help? Contact Us
                            </button>
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-gradient-to-r from-red-600 via-red-700 to-red-800 rounded-3xl p-8 text-white text-center">
                    <h3 className="text-3xl font-bold mb-6">Ready to Find Your Perfect Match?</h3>
                    <p className="text-red-100 text-lg mb-8 max-w-2xl mx-auto">
                        Start exploring profiles, send proposals, and take the next step towards your happily ever after.
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <button
                            onClick={handleViewProfiles}
                            className="bg-white text-red-600 px-8 py-3 rounded-xl font-bold hover:bg-gray-100 transition-all duration-300 hover:scale-105 shadow-lg"
                        >
                            Browse Profiles Now
                        </button>
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="bg-white/20 hover:bg-white/30 backdrop-blur-sm border-2 border-white/40 text-white px-8 py-3 rounded-xl font-bold transition-all duration-300 hover:scale-105"
                        >
                            Go to Dashboard
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PostRegistrationMessage;
