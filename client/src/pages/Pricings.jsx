import React, { useState } from "react";
import { Check, Star, Video, FileText, Users, Shield, Crown, Zap, Heart, Gift, ArrowRight, Info, Clock, Award, Phone, Globe } from "lucide-react";
import { useNavigate } from "react-router-dom";
import MainHeader from "../Components/mainHeader";
import Footer from "../Components/Footer";

const PlansSection = () => {
    const navigate = useNavigate();
    
    // Exact data from your screenshots
    const textAdPlans = [
        {
            id: 'basic-plus',
            name: 'Basic Plus',
            price: 3000,
            type: 'text',
            registrationBonus: true,
            features: [
                'Unmasked Contact number',
                'Unlimited proposal',
                'Single cost Till MARRIAGE AD',
                '3000.00'
            ]
        }
    ];

    const videoAdvertisementPlans = [
        {
            id: 'video-advertisement',
            name: 'Video Advertisement',
            price: 7000,
            type: 'video',
            features: [
                'Video club membership *',
                'Musked Contact number',
                'Unlimited proposal',
                'Complementary Profile boosting at social media**'
            ]
        }
    ];

    const videoProfilePackages = [
        {
            id: 'video-basic',
            name: 'Video Basic',
            price: 3500,
            type: 'video',
            features: [
                'You provide Video profile',
                'Free TC* - 10'
            ],
            popular: false
        },
        {
            id: 'standard',
            name: 'Standard',
            price: 7000,
            type: 'video',
            features: [
                'You Provide video clips',
                'Our team will take care of making video profile',
                'Free TC* - 10'
            ],
            popular: true,
            badge: 'MOST POPULAR'
        },
        {
            id: 'premium',
            name: 'Premium',
            price: 10000,
            type: 'video',
            features: [
                'Video profile making by Our experienced team',
                'Free TC* - 15'
            ],
            popular: false
        }
    ];

    // Additional information from screenshots
    const additionalInfo = {
        averageTime: 'SIX MONTHS',
        assurance: 'Free extension of service till you find a suitable match—guaranteed!',
        socialMediaPromotion: 'Social Media promotion',
        firstTalk: 'First talk at extra cost with Video Package**',
        gstIncluded: '*GST included',
        conditionsApply: '**Condition apply'
    };

    // Complete terminology from screenshots
    const terminologyData = [
        {
            term: 'Registration Bonus',
            definition: 'musked contact, UL proposal Receiving opportunity means you can Contact directly'
        },
        {
            term: 'Free bonus proposal point',
            definition: 'For registration 1 proposal point, For pictures - 1 proposal point, For KYC DOCUMENTS SUBMISSION- 2 Proposal Points'
        },
        {
            term: 'Proposal',
            definition: 'while you like to show interest to a selected profile send "proposal" from website, received proposal indicate the other side is interested in your profile'
        },
        {
            term: 'Proposal point',
            definition: 'used to invite selected person to contact'
        },
        {
            term: 'UL',
            definition: 'Unlimited in number, subject to monthly limit of 20 PP'
        },
        {
            term: 'SM promotion',
            definition: 'social media AD boosting complementary(Limit max 10% of fees paid ), additional boosting at your cost'
        },
        {
            term: 'Tele conference',
            definition: 'On request tele-conference can be arranged under our mentorship with from/to whom you received/send proposal'
        },
        {
            term: 'Shooting spot',
            definition: 'Generally We arrange profile shooting at our arranged studio/ picnic spot/during tour/ event organised by our affiliates Shooting can also be done at your place subject to availability of our photographer team'
        }
    ];

    const handlePackageSelect = (packageName, price, packageType = 'video') => {
        // Your original navigation logic
        navigate('/checkout', {
            state: {
                planData: {
                    id: packageType === 'video' ? 
                        (packageName === 'Video Basic' ? 1 : packageName === 'Standard' ? 2 : packageName === 'Premium' ? 3 : 4) : 
                        (packageName === '10 Proposals' ? 5 : 6),
                    name: packageName,
                    price: price,
                    description: packageType === 'video' ? 
                        `${packageName} video profile package` : 
                        `${packageName} proposal points`,
                    type: packageType
                }
            }
        });
    };

    const handleContactUs = () => {
        alert('Contact us for more details about our video profile packages!\n\nPhone: +91-XXXXXXXXXX\nEmail: info@marriagepaper.com');
    };

    const PackageCard = ({ pkg, cardType = 'video', showBonus = false }) => {
        const cardColors = {
            text: 'from-yellow-400 to-yellow-600',
            video: 'from-red-600 to-red-800',
            proposal: 'from-blue-600 to-blue-800'
        };

        return (
            <div className={`relative bg-white rounded-2xl shadow-xl border-2 ${pkg.popular ? 'border-yellow-400 scale-105' : 'border-gray-200'} hover:shadow-2xl transition-all duration-300 group`}>
                {pkg.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                        <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 px-6 py-2 rounded-full text-sm font-bold shadow-lg flex items-center gap-2">
                            <Crown className="h-4 w-4" />
                            {pkg.badge || 'MOST POPULAR'}
                        </div>
                    </div>
                )}

                {pkg.registrationBonus && (
                    <div className="absolute -top-3 -right-3">
                        <div className="bg-green-500 text-white p-2 rounded-full shadow-lg">
                            <Gift className="h-4 w-4" />
                        </div>
                    </div>
                )}

                <div className={`bg-gradient-to-r ${cardColors[cardType]} text-white rounded-t-2xl py-6 px-6 text-center`}>
                    <h3 className="text-2xl font-bold mb-2">{pkg.name}</h3>
                    {showBonus && (
                        <p className="text-sm opacity-90">Registration Bonus Free</p>
                    )}
                </div>

                <div className="p-8">
                    <div className="text-center mb-6">
                        <div className="text-4xl font-bold text-gray-900 mb-2">
                            {typeof pkg.price === 'number' ? `₹${pkg.price.toLocaleString()}` : pkg.price}
                        </div>
                        {pkg.price === 'Varies' && (
                            <p className="text-gray-600 text-sm">Contact for pricing details</p>
                        )}
                    </div>

                    <div className="space-y-3 mb-8">
                        {pkg.features.map((feature, index) => (
                            <div key={index} className="flex items-start gap-3">
                                <div className="flex-shrink-0 mt-1">
                                    <Check className="h-4 w-4 text-green-500" />
                                </div>
                                <span className="text-gray-700 text-sm leading-relaxed">{feature}</span>
                            </div>
                        ))}
                    </div>

                    <button
                        onClick={() => handlePackageSelect(pkg.name, pkg.price, pkg.type)}
                        className={`w-full bg-gradient-to-r ${cardColors[cardType]} hover:scale-105 text-white py-3 px-6 rounded-xl font-semibold transition-all duration-300 shadow-lg group-hover:shadow-xl`}
                    >
                        Choose {pkg.name}
                    </button>
                </div>
            </div>
        );
    };

    return (
        <>
            <MainHeader/>
            <section className="py-5 bg-white relative overflow-hidden">
                {/* Background decorative elements - UNCHANGED */}
                <div className="absolute inset-0 bg-gradient-to-br from-red-50/30 to-yellow-50/30"></div>
                <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-red-100/20 to-transparent rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-yellow-100/20 to-transparent rounded-full blur-3xl"></div>

                <div className="relative max-w-7xl mx-auto px-6">
                    {/* Main heading - UNCHANGED */}
                    <div className="text-center mb-16">
                        <h1 className="text-5xl md:text-6xl font-extrabold text-gray-800 mb-4">
                            Plans
                        </h1>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Choose the perfect matrimonial advertising solution tailored for your success
                        </p>
                    </div>

                    {/* Text AD Registration Section - NEW ENHANCED */}
                    <div className="mb-16">
                        <div className="bg-white rounded-3xl shadow-2xl border border-gray-200 overflow-hidden">
                            <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-center py-6 px-8">
                                <h2 className="text-3xl font-bold text-gray-800 mb-2">Text AD Registration</h2>
                                <p className="text-gray-700 font-semibold">Registration Bonus Free</p>
                            </div>
                            
                            <div className="p-8">
                                <div className="max-w-md mx-auto">
                                    {textAdPlans.map((pkg) => (
                                        <PackageCard key={pkg.id} pkg={pkg} cardType="text" showBonus={true} />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Video Advertisement Overview - NEW */}
                    <div className="mb-16">
                        <div className="bg-white rounded-3xl shadow-2xl border border-gray-200 overflow-hidden">
                            <div className="bg-gradient-to-r from-red-600 to-red-800 text-center py-6 px-8">
                                <h2 className="text-3xl font-bold text-white mb-2">Video Advertisement</h2>
                                <p className="text-red-100">Video club membership *</p>
                                <p className="text-red-100">Musked Contact number</p>
                            </div>
                            
                            <div className="p-8">
                                <div className="max-w-md mx-auto">
                                    {videoAdvertisementPlans.map((pkg) => (
                                        <PackageCard key={pkg.id} pkg={pkg} cardType="video" />
                                    ))}
                                </div>
                                
                                {/* Additional Info from screenshots */}
                                <div className="mt-8 bg-gray-50 rounded-2xl p-6">
                                    <div className="text-center space-y-3">
                                        <div className="flex items-center justify-center gap-2">
                                            <Clock className="h-5 w-5 text-blue-600" />
                                            <span className="font-semibold text-gray-800">Average time for finding suitable match</span>
                                        </div>
                                        <div className="text-2xl font-bold text-blue-600">{additionalInfo.averageTime}</div>
                                        <div className="bg-green-100 rounded-lg p-4">
                                            <div className="flex items-center justify-center gap-2 mb-2">
                                                <Award className="h-5 w-5 text-green-600" />
                                                <span className="font-semibold text-green-800">Assurance</span>
                                            </div>
                                            <p className="text-green-700 text-sm">{additionalInfo.assurance}</p>
                                        </div>
                                        <div className="text-sm text-gray-600 space-y-1">
                                            <p>{additionalInfo.socialMediaPromotion}</p>
                                            <p>{additionalInfo.firstTalk}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Video Profile Packages - ENHANCED */}
                    <div className="mb-16">
                        <div className="relative bg-gradient-to-r from-red-600 via-red-700 to-red-800 shadow-2xl rounded-t-3xl">
                            <div className="absolute inset-0 bg-white/10 rounded-t-3xl"></div>
                            <div className="relative text-center py-8 px-8">
                                <h2 className="text-3xl font-bold text-white mb-3">
                                    VIDEO PROFILE PACKAGES
                                </h2>
                                <p className="text-red-100 text-lg">
                                    Choose your preferred video profile creation option
                                </p>
                            </div>
                        </div>

                        <div className="grid lg:grid-cols-3 gap-8 shadow-2xl rounded-b-3xl p-8 bg-gradient-to-br from-red-50 via-white to-yellow-50">
                            {videoProfilePackages.map((pkg) => (
                                <PackageCard key={pkg.id} pkg={pkg} cardType="video" />
                            ))}
                        </div>
                    </div>

                    {/* Enhanced Terminology Section - NEW DETAILED */}
                    <div className="mb-16">
                        <div className="bg-white rounded-3xl shadow-2xl border border-gray-200 p-8">
                            <h3 className="text-3xl font-bold text-gray-800 mb-8 text-center">Terminology</h3>
                            <div className="grid md:grid-cols-2 gap-6">
                                {terminologyData.map((item, index) => (
                                    <div key={index} className="bg-gray-50 rounded-xl p-6 hover:bg-gray-100 transition-colors">
                                        <h4 className="font-bold text-gray-800 mb-3 text-lg">{item.term}</h4>
                                        <p className="text-gray-600 text-sm leading-relaxed">{item.definition}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Important Information Section - ENHANCED */}
                    <div className="mb-16">
                        <div className="bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 rounded-2xl p-6">
                            <div className="text-center">
                                <div className="flex items-center justify-center gap-2 mb-4">
                                    <Info className="h-6 w-6 text-amber-600" />
                                    <h4 className="text-lg font-semibold text-amber-800">Important Information</h4>
                                </div>
                                <div className="grid md:grid-cols-3 gap-4 text-sm text-amber-700">
                                    <div className="flex items-center justify-center gap-2">
                                        <Check className="h-4 w-4" />
                                        <span>{additionalInfo.gstIncluded}</span>
                                    </div>
                                    <div className="flex items-center justify-center gap-2">
                                        <Award className="h-4 w-4" />
                                        <span>6 months result guarantee</span>
                                    </div>
                                    <div className="flex items-center justify-center gap-2">
                                        <Info className="h-4 w-4" />
                                        <span>{additionalInfo.conditionsApply}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ALL YOUR ORIGINAL SECTIONS REMAIN UNCHANGED */}
                    {/* Advertisement Type Selection - UNCHANGED */}
                    <div className="mb-16">
                        <div className="relative bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 shadow-2xl rounded-t-3xl">
                            <div className="absolute inset-0 bg-white/10 rounded-t-3xl"></div>
                            <div className="relative text-center py-8 px-8">
                                <h2 className="text-3xl font-bold text-gray-800 mb-3">
                                    TYPE OF ADVERTISEMENTS
                                </h2>
                                <p className="text-sm font-bold text-gray-700 uppercase tracking-wider">
                                    SELECT YOUR PREFERRED CHOICE!
                                </p>
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-0 shadow-2xl rounded-b-3xl overflow-hidden">
                            {/* Video Advertisement */}
                            <div className="bg-gradient-to-br from-red-600 via-red-700 to-red-800 text-white relative overflow-hidden group">
                                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/5 transition-all duration-300"></div>
                                <div className="absolute top-0 left-0 w-32 h-32 bg-white/5 rounded-full -translate-x-16 -translate-y-16"></div>
                                <div className="absolute bottom-0 right-0 w-24 h-24 bg-white/5 rounded-full translate-x-12 translate-y-12"></div>

                                <div className="relative flex flex-col text-center py-16 px-10">
                                    <div className="bg-white/15 backdrop-blur-sm w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                                        <Video className="w-10 h-10 text-white" />
                                    </div>
                                    <h3 className="text-3xl font-bold mb-4">VIDEO ADVERTISEMENT</h3>
                                    <div className="bg-white/10 rounded-full px-4 py-2 inline-block mb-6">
                                        <p className="text-red-100 text-sm font-bold uppercase tracking-wide">
                                            CONTACT MASKED (MANDATORY)
                                        </p>
                                    </div>
                                    <button className="bg-white/20 backdrop-blur-sm hover:bg-white/30 border-2 border-white/40 hover:border-white/60 text-white px-10 py-4 rounded-2xl font-bold transition-all duration-300 hover:scale-105 shadow-xl hover:shadow-2xl group-hover:translate-y-[-2px]">
                                        View Details
                                    </button>
                                </div>
                            </div>

                            {/* Text Advertisement */}
                            <div className="bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-600 text-gray-800 relative overflow-hidden group">
                                <div className="absolute inset-0 bg-white/10 group-hover:bg-white/5 transition-all duration-300"></div>
                                <div className="absolute top-0 right-0 w-28 h-28 bg-gray-800/5 rounded-full translate-x-14 -translate-y-14"></div>
                                <div className="absolute bottom-0 left-0 w-20 h-20 bg-gray-800/5 rounded-full -translate-x-10 translate-y-10"></div>

                                <div className="relative flex flex-col text-center py-16 px-10">
                                    <div className="bg-gray-800/15 backdrop-blur-sm w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                                        <FileText className="w-10 h-10 text-gray-800" />
                                    </div>
                                    <h3 className="text-3xl font-bold mb-4">TEXT ADVERTISEMENT</h3>
                                    <div className="bg-gray-800/10 rounded-full px-4 py-2 inline-block mb-6">
                                        <p className="text-gray-700 text-sm font-bold uppercase tracking-wide">
                                            CONTACT MASKED/UNMASKED (OPTIONAL)
                                        </p>
                                    </div>
                                    <button className="bg-gray-800/20 backdrop-blur-sm hover:bg-gray-800/30 border-2 border-white/60 hover:border-gray-800/60 text-gray-800 px-10 py-4 rounded-2xl font-bold transition-all duration-300 hover:scale-105 shadow-xl hover:shadow-2xl group-hover:translate-y-[-2px]">
                                        View Details
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ALL OTHER EXISTING SECTIONS REMAIN EXACTLY THE SAME */}
                    {/* Benefits list - UNCHANGED */}
                    <div className="bg-white/90 backdrop-blur-lg rounded-3xl p-10 shadow-2xl border border-gray-200/50 mb-16">
                        <div className="text-center">
                            <h3 className="text-3xl font-bold text-gray-800 mb-12">What's Included</h3>
                            <div className="grid md:grid-cols-3 gap-8">
                                <div className="group flex flex-col items-center space-y-4 p-6 rounded-2xl hover:bg-green-50/50 transition-all duration-300">
                                    <div className="bg-gradient-to-br from-green-100 to-green-200 w-16 h-16 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                                        <Check className="w-8 h-8 text-green-600" />
                                    </div>
                                    <span className="text-gray-700 font-bold text-lg text-center">
                                        Unlimited Ad Circulation
                                    </span>
                                    <p className="text-gray-500 text-sm text-center">
                                        Your profile reaches maximum visibility
                                    </p>
                                </div>
                                <div className="group flex flex-col items-center space-y-4 p-6 rounded-2xl hover:bg-blue-50/50 transition-all duration-300">
                                    <div className="bg-gradient-to-br from-blue-100 to-blue-200 w-16 h-16 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                                        <Users className="w-8 h-8 text-blue-600" />
                                    </div>
                                    <span className="text-gray-700 font-bold text-lg text-center">
                                        Receive Unlimited Proposal
                                    </span>
                                    <p className="text-gray-500 text-sm text-center">
                                        No limits on incoming proposals
                                    </p>
                                </div>
                                <div className="group flex flex-col items-center space-y-4 p-6 rounded-2xl hover:bg-purple-50/50 transition-all duration-300">
                                    <div className="bg-gradient-to-br from-purple-100 to-purple-200 w-16 h-16 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                                        <Shield className="w-8 h-8 text-purple-600" />
                                    </div>
                                    <span className="text-gray-700 font-bold text-lg text-center">
                                        Send Proposals: 20 Per Month
                                    </span>
                                    <p className="text-gray-500 text-sm text-center">
                                        Connect with your preferred matches
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Contact Section - UNCHANGED */}
                    <div className="mt-6 text-center">
                        <button 
                            onClick={handleContactUs}
                            className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 shadow-lg"
                        >
                            Need Help? Contact Us
                        </button>
                    </div>

                    {/* Add-on Services - UNCHANGED */}
                    <div className="mb-16">
                        <div className="relative bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 shadow-2xl rounded-t-3xl">
                            <div className="absolute inset-0 bg-white/10 rounded-t-3xl"></div>
                            <div className="relative text-center py-8 px-8">
                                <h2 className="text-3xl font-bold text-gray-800">
                                    ADD-ON SERVICES
                                </h2>
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-0 shadow-2xl rounded-b-3xl overflow-hidden">
                            {/* 10 Proposals Plan - UNCHANGED */}
                            <div className="bg-gradient-to-br from-red-600 via-red-700 to-red-800 text-white relative overflow-hidden group">
                                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/5 transition-all duration-300"></div>
                                <div className="absolute top-0 left-0 w-40 h-40 bg-white/5 rounded-full -translate-x-20 -translate-y-20"></div>
                                <div className="absolute bottom-0 right-0 w-32 h-32 bg-white/5 rounded-full translate-x-16 translate-y-16"></div>

                                <div className="relative text-center py-20 px-10">
                                    <div className="bg-white/15 backdrop-blur-sm w-24 h-24 rounded-3xl flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                                        <span className="text-3xl font-bold">10</span>
                                    </div>
                                    <h3 className="text-3xl font-bold mb-4">PROPOSAL POINT</h3>
                                    <div className="bg-white/10 rounded-full px-6 py-2 inline-block mb-6">
                                        <p className="text-red-100 text-lg font-bold">10 PROPOSALS</p>
                                    </div>
                                    <div className="mb-8">
                                        <div className="text-6xl font-bold mb-2">₹250</div>
                                        <p className="text-red-200 text-sm">Best for starters</p>
                                    </div>
                                    <button 
                                        onClick={() => handlePackageSelect('10 Proposals', 250, 'proposal')}
                                        className="bg-white/20 backdrop-blur-sm hover:bg-white/30 border-2 border-white/40 hover:border-white/60 text-white px-10 py-4 rounded-2xl font-bold transition-all duration-300 hover:scale-105 shadow-xl hover:shadow-2xl group-hover:translate-y-[-2px]"
                                    >
                                        Choose Plan
                                    </button>
                                </div>
                            </div>

                            {/* 100 Proposals Plan - UNCHANGED */}
                            <div className="bg-gradient-to-br from-red-600 via-red-700 to-red-800 text-white relative overflow-hidden group">
                                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/5 transition-all duration-300"></div>
                                <div className="absolute top-0 right-0 w-36 h-36 bg-white/5 rounded-full translate-x-18 -translate-y-18"></div>
                                <div className="absolute bottom-0 left-0 w-28 h-28 bg-white/5 rounded-full -translate-x-14 translate-y-14"></div>

                                <div className="absolute top-6 right-6 z-10">
                                    <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-800 px-4 py-2 rounded-full text-sm font-bold flex items-center space-x-1 shadow-lg">
                                        <Crown className="w-4 h-4" />
                                        <span>POPULAR</span>
                                    </div>
                                </div>

                                <div className="relative text-center py-20 px-10">
                                    <div className="bg-white/15 backdrop-blur-sm w-24 h-24 rounded-3xl flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                                        <span className="text-2xl font-bold">100</span>
                                    </div>
                                    <h3 className="text-3xl font-bold mb-4">PROPOSAL POINT</h3>
                                    <div className="bg-white/10 rounded-full px-6 py-2 inline-block mb-6">
                                        <p className="text-red-100 text-lg font-bold">100 PROPOSALS</p>
                                    </div>
                                    <div className="mb-8">
                                        <div className="text-6xl font-bold mb-2">₹2000</div>
                                        <p className="text-red-200 text-sm">Most value for money</p>
                                    </div>
                                    <button 
                                        onClick={() => handlePackageSelect('100 Proposals', 2000, 'proposal')}
                                        className="bg-white/20 backdrop-blur-sm hover:bg-white/30 border-2 border-white/40 hover:border-white/60 text-white px-10 py-4 rounded-2xl font-bold transition-all duration-300 hover:scale-105 shadow-xl hover:shadow-2xl group-hover:translate-y-[-2px]"
                                    >
                                        Choose Plan
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Additional Information - UNCHANGED */}
                    <div className="bg-gradient-to-br from-white/95 to-gray-50/95 backdrop-blur-lg rounded-3xl p-16 shadow-2xl border border-gray-200/50 max-w-6xl mx-auto">
                        <div className="text-center mb-16">
                            <h3 className="text-4xl font-bold text-gray-800 mb-8">
                                Choose Your Perfect Plan
                            </h3>
                            <p className="text-gray-600 leading-relaxed text-xl max-w-4xl mx-auto">
                                Our flexible pricing options are designed to meet your specific matrimonial needs.
                                Whether you prefer video advertisements for maximum impact or text-based ads for
                                traditional approach, we have the right solution for you.
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-16 mb-16">
                            <div className="text-center group">
                                <div className="bg-gradient-to-br from-yellow-100 to-yellow-200 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                                    <Star className="w-10 h-10 text-yellow-600" />
                                </div>
                                <h4 className="text-2xl font-bold text-gray-800 mb-6">
                                    Premium Features
                                </h4>
                                <p className="text-gray-600 leading-relaxed text-lg">
                                    Enjoy unlimited ad circulation and proposal receiving with our premium plans
                                </p>
                            </div>

                            <div className="text-center group">
                                <div className="bg-gradient-to-br from-green-100 to-green-200 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                                    <Zap className="w-10 h-10 text-green-600" />
                                </div>
                                <h4 className="text-2xl font-bold text-gray-800 mb-6">
                                    Flexible Options
                                </h4>
                                <p className="text-gray-600 leading-relaxed text-lg">
                                    Choose between contact masked or unmasked options based on your privacy preference
                                </p>
                            </div>
                        </div>

                        <div className="text-center">
                            <button className="bg-gradient-to-r from-red-600 via-red-700 to-red-800 hover:from-red-700 hover:via-red-800 hover:to-red-900 text-white px-16 py-5 rounded-2xl text-2xl font-bold transition-all duration-300 hover:scale-105 shadow-2xl hover:shadow-3xl">
                                Get Started Today
                            </button>
                        </div>
                    </div>
                </div>
            </section>
            <Footer/>
        </>
    );
};

export default PlansSection;
