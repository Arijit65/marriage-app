import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Heart, Users, Shield, Search, Star, CheckCircle, Phone, Mail, MapPin,
  Menu, X, ArrowRight, Play, Award, Sparkles, Globe, Clock, MessageCircle,
  UserCheck, Settings, Bell, Camera, Filter, ChevronDown, ChevronUp,
  ContactRound
} from 'lucide-react';

const MarriagePaperWebsite = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [pulseRingComplete, setPulseRingComplete] = useState(false);
  const [currentBgImage, setCurrentBgImage] = useState(0);

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Control pulse ring animation - show for 2 cycles then make permanent
  useEffect(() => {
    const timer = setTimeout(() => {
      setPulseRingComplete(true);
    }, 120000); // 2 minutes (2 cycles of 60 seconds each)

    return () => clearTimeout(timer);
  }, []);

  // Background image slider
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBgImage((prev) => (prev + 1) % backgroundImages.length);
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(interval);
  }, []);

  const backgroundImages = [
    'https://images.unsplash.com/photo-1519741497674-611481863552?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
    'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
    'https://images.unsplash.com/photo-1519225421980-715cb0215aed?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
    'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80'
  ];

  const testimonials = [
    {
      name: "Priya & Arjun",
      image: "https://5.imimg.com/data5/ANDROID/Default/2023/3/293649890/YR/OW/WW/35669235/product-jpeg.jpg",
      text: "We found each other through Marriage Paper and couldn't be happier. The platform made our journey to love so much easier.",
      location: "Mumbai",
      rating: 5
    },
    {
      name: "Kavya & Rohit",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQibRLajE3fbkyH0P2TtMO7Vy6oWtb1VruNqQ&s",
      text: "Marriage Paper helped us connect despite being in different cities. Now we're happily married for 2 years!",
      location: "Delhi - Bangalore",
      rating: 5
    },
    {
      name: "Deepa & Vikram",
      image: "https://akshitphotography.com/wp-content/uploads/2023/08/15-1-scaled.jpg",
      text: "The detailed profiles and family information helped us make the right choice. Thank you Marriage Paper!",
      location: "Chennai",
      rating: 5
    }
  ];

  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const staggerChildren = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <div className="min-h-screen py-4 bg-gradient-to-br from-rose-50 via-white to-pink-50">
      {/* Header */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="bg-white/90 backdrop-blur-md border-b border-rose-100 sticky top-0 z-50 shadow-sm"
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <motion.div
              className="flex items-center space-x-2"
              whileHover={{ scale: 1.05 }}
            >
              {/* Logo Container with Enhanced Animations */}
              <motion.div
                className="relative"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              >
                {/* Main Logo Image */}
                <motion.img
                  src="/src/assets/logo.png"
                  alt="Marriage Paper Logo"
                  className="h-12 w-auto"
                  whileHover={{
                    scale: 1.1,
                    rotate: [0, -5, 5, 0],
                    transition: { duration: 0.6 }
                  }}
                  animate={{
                    y: [0, -3, 0],
                    transition: {
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }
                  }}
                />

                {/* Floating Sparkles Animation */}
                <motion.div
                  className="absolute -top-2 -right-2 w-3 h-3 bg-yellow-400 rounded-full opacity-80"
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.8, 0.2, 0.8],
                    rotate: [0, 180, 360]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />

                <motion.div
                  className="absolute -bottom-1 -left-1 w-2 h-2 bg-pink-400 rounded-full opacity-60"
                  animate={{
                    scale: [1, 1.3, 1],
                    opacity: [0.6, 0.1, 0.6],
                    rotate: [0, -180, -360]
                  }}
                  transition={{
                    duration: 1.8,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.5
                  }}
                />

                {/* Pulse Ring Effect */}
                <motion.div
                  className="absolute inset-0 border-2 border-rose-300 rounded-full"
                  animate={pulseRingComplete ? {
                    scale: 1,
                    opacity: 0.3
                  } : {
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0, 0.3]
                  }}
                  transition={pulseRingComplete ? {
                    duration: 0.5,
                    ease: "easeOut"
                  } : {
                    duration: 60,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
              </motion.div>

              {/* Optional: Keep a small text label for accessibility */}
              {/* <motion.span 
                className="text-lg font-semibold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent hidden sm:block"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
              >
                Marriage Paper
              </motion.span> */}
            </motion.div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8">
              {['Home', 'About Us', 'Our Services', 'Benefit', 'Blog', 'Find Match', 'Plans', 'Fees & Offer'].map((item, index) => (
                <motion.a
                  key={item}
                  href="#"
                  className="text-gray-700 hover:text-rose-600 transition-colors relative"
                  whileHover={{ y: -2 }}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  {item}
                  <motion.div
                    className="absolute bottom-0 left-0 w-0 h-0.5 bg-rose-600"
                    whileHover={{ width: '100%' }}
                    transition={{ duration: 0.3 }}
                  />
                </motion.a>
              ))}
            </nav>

            <div className="flex items-center space-x-4">
              <motion.button
                className="hidden md:flex items-center space-x-2 px-4 py-2 border border-rose-200 text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <UserCheck className="h-4 w-4" />
                <span>Login</span>
              </motion.button>

              <motion.button
                className="px-6 py-2 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-lg font-medium shadow-lg hover:shadow-xl transition-all"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                Post Free Ad
              </motion.button>

              {/* Mobile Menu Button */}
              <button
                className="lg:hidden p-2"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden bg-white border-t border-rose-100"
            >
              <div className="container mx-auto px-4 py-4 space-y-4">
                {['Home', 'About Us', 'Our Services', 'Benefit', 'Blog', 'Find Match', 'Plans', 'Fees & Offer'].map((item) => (
                  <a key={item} href="#" className="block text-gray-700 hover:text-rose-600 transition-colors">
                    {item}
                  </a>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden py-4">
        {/* Background Image Slider */}
        <div className="absolute inset-0">
          <AnimatePresence mode="wait">
            <motion.img
              key={currentBgImage}
              src={backgroundImages[currentBgImage]}
              alt="Background"
              className="absolute inset-0 w-full h-full object-cover"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
            />
          </AnimatePresence>

          {/* Semi-transparent overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-rose-100/70 to-pink-100/70"></div>
        </div>

        {/* Floating Elements */}
        <motion.div
          className="absolute top-20 left-10 w-20 h-20 bg-rose-200 rounded-full opacity-20"
          animate={{ y: [-10, 10, -10], rotate: [0, 180, 360] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute top-40 right-20 w-16 h-16 bg-pink-200 rounded-full opacity-20"
          animate={{ y: [10, -10, 10], rotate: [360, 180, 0] }}
          transition={{ duration: 6, repeat: Infinity }}
        />

        <div className="container mx-auto px-4 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              className="space-y-8"
              variants={staggerChildren}
              initial="initial"
              animate="animate"
            >
              <motion.div className="space-y-2" variants={fadeInUp}>
                <motion.div
                  className="inline-flex items-center space-x-2 bg-rose-100 text-rose-700 px-4 py-2 rounded-full text-sm font-medium"
                  whileHover={{ scale: 1.05 }}
                >
                  <Sparkles className="h-4 w-4" />
                  <span>India's Most Trusted Matrimony Service</span>
                </motion.div>

                <motion.h1
                  className="text-4xl lg:text-6xl xl:text-7xl font-bold leading-tight"
                  variants={fadeInUp}
                >
                  Find Your
                  <motion.span
                    className="bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent block"
                    animate={{ backgroundPosition: ['0%', '100%', '0%'] }}
                    transition={{ duration: 3, repeat: Infinity }}
                  >
                    Perfect Partner
                  </motion.span>
                </motion.h1>

                <motion.p
                  className="text-xl text-gray-600 leading-relaxed max-w-lg"
                  variants={fadeInUp}
                >
                  Join over <span className="font-semibold text-rose-600">50,000+ happy couples</span> who found
                  their soulmate through our AI-powered matching system. Experience the perfect blend of
                  tradition and modern technology.
                </motion.p>
              </motion.div>

              {/* Enhanced Quick Search */}
              <motion.div
                className="bg-white/80 backdrop-blur-sm border border-rose-100 rounded-2xl p-6 shadow-xl"
                variants={fadeInUp}
                whileHover={{ y: -5, shadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' }}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-800">Quick Partner Search</h3>
                  <motion.button
                    onClick={() => setShowMobileSearch(!showMobileSearch)}
                    className="md:hidden"
                    whileTap={{ scale: 0.95 }}
                  >
                    {showMobileSearch ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                  </motion.button>
                </div>

                <AnimatePresence>
                  <motion.div
                    className={`grid gap-4 ${showMobileSearch || window.innerWidth >= 768 ? 'grid-cols-1 md:grid-cols-4' : 'hidden md:grid md:grid-cols-4'}`}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                  >
                    <div className="relative">
                      <select className="w-full p-3 border border-rose-200 rounded-lg focus:border-rose-400 focus:ring-2 focus:ring-rose-100 bg-white">
                        <option>Bride</option>
                        <option>Groom</option>
                      </select>
                    </div>


                    <div className="relative">
                      <select className="w-full p-3 border border-rose-200 rounded-lg focus:border-rose-400 focus:ring-2 focus:ring-rose-100 bg-white">
                        <option>Age Range</option>
                        <option>21-25</option>
                        <option>26-30</option>
                        <option>31-35</option>
                        <option>36+</option>
                      </select>
                    </div>

                    <div className="relative">
                      <select className="w-full p-3 border border-rose-200 rounded-lg focus:border-rose-400 focus:ring-2 focus:ring-rose-100 bg-white">
                        <option>Religion</option>
                        <option>Hindu</option>
                        <option>Muslim</option>
                        <option>Christian</option>
                        <option>Sikh</option>
                        <option>Others</option>
                      </select>
                    </div>

                    <div className="relative">
                      <input
                        type="text"
                        placeholder="City/State"
                        className="w-full p-3 border border-rose-200 rounded-lg focus:border-rose-400 focus:ring-2 focus:ring-rose-100"
                      />
                      <MapPin className="absolute right-3 top-3.5 h-4 w-4 text-gray-400" />
                    </div>

                    <motion.button
                      className="bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-lg font-medium flex items-center justify-center space-x-2 p-3 hover:from-rose-600 hover:to-pink-600 transition-all shadow-lg"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Search className="h-4 w-4" />
                      <span>Search</span>
                    </motion.button>
                  </motion.div>
                </AnimatePresence>
              </motion.div>

              {/* Stats */}
              <motion.div
                className="grid grid-cols-3 gap-8"
                variants={staggerChildren}
              >
                {[
                  { number: '50K+', label: 'Happy Marriages', icon: Heart },
                  { number: '2M+', label: 'Registered Users', icon: Users },
                  { number: '15+', label: 'Years Experience', icon: Award }
                ].map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    className="text-center"
                    variants={fadeInUp}
                    whileHover={{ scale: 1.1 }}
                  >
                    <div className="flex items-center justify-center mb-2">
                      <stat.icon className="h-8 w-8 text-rose-500 mr-2" />
                      <div className="text-3xl font-bold text-rose-600">{stat.number}</div>
                    </div>
                    <div className="text-sm text-gray-600">{stat.label}</div>
                  </motion.div>
                ))}
              </motion.div>

              {/* CTA Buttons */}
              <motion.div
                className="flex flex-col sm:flex-row gap-4"
                variants={fadeInUp}
              >
                <motion.button
                  className="flex items-center justify-center space-x-2 bg-gradient-to-r from-rose-500 to-pink-500 text-white px-8 py-4 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <ContactRound className="h-5 w-5" />
                  <span>Find Match by Id</span>
                  <ArrowRight className="h-4 w-4" />
                </motion.button>

                <motion.button
                  className="flex items-center justify-center space-x-2 border-2 border-rose-200 text-rose-600 px-8 py-4 rounded-xl font-medium hover:bg-rose-50 transition-all"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Play className="h-5 w-5" />
                  <span>Watch Success Stories</span>
                </motion.button>
              </motion.div>
            </motion.div>

            {/* Hero Image with Enhanced Design */}
            <motion.div
              className="relative w-full max-w-sm mx-auto lg:max-w-md"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              {/* Semi blur background effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-rose-200/30 to-pink-200/30 backdrop-blur-sm rounded-3xl transform rotate-6"
                animate={{ rotate: [6, 8, 6] }}
                transition={{ duration: 4, repeat: Infinity }}
              />

              <motion.div
                className="relative bg-white/85 backdrop-blur-md rounded-3xl shadow-2xl overflow-hidden border border-rose-100"
                whileHover={{ y: -5, rotate: -1 }}
                transition={{ duration: 0.3 }}
              >
                <div className="absolute top-4 right-4 flex space-x-2">
                  <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                </div>

                {/* Form Content */}
                <div className="p-0">
                  {/* Header with Marriage Theme */}
                  <div className="bg-gradient-to-r from-red-500 to-red-600 px-6 py-5 text-center relative overflow-hidden rounded-t-3xl">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
                    <motion.div
                      initial={{ y: 10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.3 }}
                      className="relative z-10"
                    >
                      <div className="flex items-center justify-center mb-2">
                        <Heart className="h-5 w-5 text-white/80 mr-2" />
                        <h3 className="text-xl font-bold text-white">Free Registration</h3>
                        <Heart className="h-5 w-5 text-white/80 ml-2" />
                      </div>
                      <p className="text-white/95 text-sm font-medium">Instant Approval</p>
                    </motion.div>
                  </div>

                  {/* Form Fields with Marriage Vibe */}
                  <div className="bg-gradient-to-b from-white to-rose-50/30 px-6 py-6 space-y-4 rounded-b-3xl">
                    {/* Gender Select */}
                    <motion.div
                      className="relative"
                      whileHover={{ scale: 1.01 }}
                      transition={{ duration: 0.2 }}
                    >
                      <select className="w-full px-4 py-3 border border-rose-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-rose-500 text-gray-700 bg-white shadow-sm hover:shadow-md transition-all duration-200 font-medium">
                        <option>Gender</option>
                        <option>Male</option>
                        <option>Female</option>
                      </select>
                    </motion.div>

                    {/* Phone Input */}
                    <motion.div
                      className="relative"
                      whileHover={{ scale: 1.01 }}
                      transition={{ duration: 0.2 }}
                    >
                      <input
                        type="tel"
                        placeholder="Phone Number"
                        className="w-full px-4 py-3 border border-rose-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-rose-500 bg-white shadow-sm hover:shadow-md transition-all duration-200 font-medium"
                      />
                    </motion.div>

                    {/* Marriage-themed Center Text */}
                    <motion.div
                      className="text-center py-3"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.5 }}
                    >
                      <div className="inline-flex items-center bg-gradient-to-r from-rose-100 to-pink-100 rounded-full px-4 py-2 border border-rose-200">
                        <Sparkles className="h-4 w-4 text-rose-500 mr-2" />
                        <p className="text-rose-700 font-semibold text-sm">Finding Match Made Easy</p>
                        <Sparkles className="h-4 w-4 text-rose-500 ml-2" />
                      </div>
                    </motion.div>

                    {/* Register Button with Marriage Theme */}
                    <motion.button
                      className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white py-3 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden group"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                      <span className="relative z-10 flex items-center justify-center">
                        <Heart className="h-4 w-4 mr-2" />
                        Register Now
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </span>
                    </motion.button>

                    {/* Bottom Text with Marriage Theme */}
                    <motion.div
                      className="text-center pt-3"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.7 }}
                    >
                      <div className="bg-gradient-to-r from-rose-50 to-pink-50 rounded-xl p-3 border border-rose-100">
                        <div className="flex items-center justify-center mb-1">
                          <Play className="h-4 w-4 text-rose-500 mr-2" />
                          <p className="text-rose-700 font-semibold text-sm">Think Video Advertisement</p>
                        </div>
                        <div className="flex items-center justify-center">
                          <div className="w-2 h-2 bg-rose-500 rounded-full mr-2 animate-pulse"></div>
                          <p className="text-rose-600 text-xs font-medium">For Fast Response</p>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </div>

                {/* Floating Profile Cards with Marriage Theme */}
                <motion.div
                  className="absolute -top-4 -left-4 bg-white/95 backdrop-blur-sm rounded-xl p-3 shadow-lg border border-rose-100"
                  animate={{ y: [-5, 5, -5] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  whileHover={{ scale: 1.1 }}
                >
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-rose-400 to-pink-500 rounded-full flex items-center justify-center">
                      <Heart className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <div className="w-16 h-2 bg-rose-200 rounded-full"></div>
                      <div className="w-12 h-2 bg-rose-100 rounded-full mt-1"></div>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  className="absolute -bottom-4 -right-4 bg-white/95 backdrop-blur-sm rounded-xl p-3 shadow-lg border border-blue-100"
                  animate={{ y: [5, -5, 5] }}
                  transition={{ duration: 3, repeat: Infinity, delay: 1.5 }}
                  whileHover={{ scale: 1.1 }}
                >
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center">
                      <Users className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <div className="w-16 h-2 bg-blue-200 rounded-full"></div>
                      <div className="w-12 h-2 bg-blue-100 rounded-full mt-1"></div>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </motion.div>


          </div>
        </div>
      </section>

      {/* Featured Ads Section */}
      <section className="py-16 bg-gradient-to-br from-red-50 via-pink-50 to-rose-50 relative overflow-hidden">
        {/* Background decorative elements */}
        <motion.div
          className="absolute top-10 left-10 w-24 h-24 bg-red-200 rounded-full opacity-10"
          animate={{ y: [-15, 15, -15], rotate: [0, 180, 360] }}
          transition={{ duration: 10, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-20 right-20 w-32 h-32 bg-pink-200 rounded-full opacity-10"
          animate={{ y: [15, -15, 15], rotate: [360, 180, 0] }}
          transition={{ duration: 8, repeat: Infinity }}
        />

        <div className="container mx-auto px-4">
          {/* Featured Ads Header */}
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center justify-center mb-6">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent to-red-300"></div>
              <motion.div
                className="mx-6 bg-white rounded-full px-6 py-2 shadow-lg border border-red-100"
                whileHover={{ scale: 1.05 }}
              >
                <span className="text-gray-600 font-medium text-sm tracking-wide">Featured Ads</span>
              </motion.div>
              <div className="flex-1 h-px bg-gradient-to-l from-transparent to-red-300"></div>
            </div>

            <motion.h2
              className="text-4xl lg:text-5xl font-bold mb-6"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <span className="bg-gradient-to-r from-red-600 via-pink-600 to-red-600 bg-clip-text text-transparent">
                Discover Your Perfect Match
              </span>
            </motion.h2>

            <motion.button
              className="inline-flex items-center bg-red-500 text-white px-8 py-3 rounded-full font-semibold hover:bg-red-600 transition-all duration-300 shadow-lg hover:shadow-xl"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
            >
              <span>View All</span>
              <ArrowRight className="ml-2 h-4 w-4" />
            </motion.button>
          </motion.div>

          {/* Latest Ads Section */}
          <motion.div
            className="text-center mb-10"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="inline-block bg-white/80 backdrop-blur-sm rounded-full px-6 py-2 shadow-md border border-gray-200 mb-4">
              <span className="text-gray-600 font-medium">Latest Ads</span>
            </div>
            <h3 className="text-3xl lg:text-4xl font-bold text-gray-800">
              Find Your Perfect Match Today
            </h3>
          </motion.div>

          {/* Profile Cards Grid */}
          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            variants={staggerChildren}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {/* Sample Profile Card - You can map through your data */}
            {[
              {
                id: "F27103",
                type: "STOCK Member",
                title: "Bride - 32years/5'",
                details: "Hindu, Bengali, Kayastha Bengali, MA...",
                photos: 2,
                image: " https://www.shutterstock.com/image-photo/smiling-cheerful-young-adult-indian-260nw-1841388895.jpg"
              },
              {
                id: "M28105",
                type: "PREMIUM Member",
                title: "Groom - 28years/5'8\"",
                details: "Hindu, Punjabi, Engineer, MBA...",
                photos: 5,
                image: "https://media.gettyimages.com/id/944138400/photo/indian-young-man-in-london-expressing-positive-emotion.jpg?s=612x612&w=gi&k=20&c=jfguMh7Rw5mzWi1RU3veS0XB0sUD7EuE4lH_WyhuLcc="
              },
              {
                id: "F25098",
                type: "VERIFIED Member",
                title: "Bride - 25years/5'4\"",
                details: "Christian, South Indian, Doctor...",
                photos: 3,
                image: "https://media.istockphoto.com/id/1352202195/photo/portrait-of-a-smiling-woman-of-indian-ethnicity.jpg?s=612x612&w=0&k=20&c=cjHX4onCYzTG_IErGD7bXySc47WV1Z2iCL0zM7d0W8Q="
              },
              {
                id: "M30112",
                type: "GOLD Member",
                title: "Groom - 30years/6'",
                details: "Sikh, Business Owner, Delhi...",
                photos: 4,
                image: "https://www.shutterstock.com/image-photo/indian-man-office-portrait-260nw-2366329425.jpg"
              }
            ].map((profile, index) => (
              <motion.div
                key={profile.id}
                className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 group"
                variants={fadeInUp}
                whileHover={{ y: -8, scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                {/* Profile Header */}
                <div className="relative">
                  <div className="absolute top-3 left-3 z-10">
                    <div className="flex items-center space-x-2">
                      <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                        {profile.id}
                      </span>
                      <span className="bg-blue-500 text-white text-xs font-medium px-2 py-1 rounded">
                        {profile.type}
                      </span>
                    </div>
                  </div>

                  {/* Profile Image */}
                  <div className="relative h-48 overflow-hidden">
                    <motion.img
                      src={profile.image}
                      alt={profile.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      whileHover={{ scale: 1.1 }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                </div>

                {/* Profile Content */}
                <div className="p-5">
                  <motion.h4
                    className="font-bold text-lg text-gray-800 mb-2"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    {profile.title}
                  </motion.h4>

                  <motion.p
                    className="text-gray-600 text-sm mb-3 leading-relaxed"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ delay: index * 0.1 + 0.1 }}
                  >
                    {profile.details}
                    <motion.button
                      className="text-red-500 font-medium ml-1 hover:text-red-600"
                      whileHover={{ scale: 1.05 }}
                    >
                      Read More
                    </motion.button>
                  </motion.p>

                  {/* Photos Button */}
                  <motion.button
                    className="w-full bg-gradient-to-r from-gray-100 to-gray-50 text-gray-700 py-2 px-4 rounded-lg font-medium mb-4 hover:from-red-50 hover:to-pink-50 hover:text-red-600 transition-all duration-300 border border-gray-200"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Camera className="inline-block w-4 h-4 mr-2" />
                    See {profile.photos} Photos
                  </motion.button>

                  {/* Action Buttons */}
                  <div className="flex space-x-2">
                    <motion.button
                      className="flex-1 bg-red-500 text-white py-2 px-4 rounded-lg font-medium hover:bg-red-600 transition-colors duration-300 flex items-center justify-center"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Mail className="w-4 h-4 mr-1" />
                      Contact
                    </motion.button>

                    <motion.button
                      className="bg-pink-100 text-pink-600 p-2 rounded-lg hover:bg-pink-200 transition-colors duration-300"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Heart className="w-5 h-5" />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Load More Button */}
          <motion.div
            className="text-center mt-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <motion.button
              className="inline-flex items-center bg-white text-red-600 px-8 py-3 rounded-full font-semibold border-2 border-red-200 hover:bg-red-50 hover:border-red-300 transition-all duration-300 shadow-lg hover:shadow-xl"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <span>Load More Profiles</span>
              <ChevronDown className="ml-2 h-4 w-4" />
            </motion.button>
          </motion.div>
        </div>
      </section>


      {/* Enhanced Features Section */}
      <section className="py-20 bg-white relative overflow-hidden">
        <motion.div
          className="absolute inset-0 opacity-5"
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
        >
          <Heart className="h-96 w-96 text-rose-500 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
        </motion.div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl lg:text-5xl font-bold mb-4">
              Why Choose <span className="text-rose-600">Marriage Paper</span>?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Experience the perfect blend of traditional values and cutting-edge technology
              in your journey to find your ideal life partner.
            </p>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={staggerChildren}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {[
              {
                icon: Users,
                title: 'AI-Powered Matching',
                description: 'Our advanced algorithm analyzes 50+ compatibility factors to find your perfect match.',
                color: 'rose'
              },
              {
                icon: Shield,
                title: '100% Verified Profiles',
                description: 'Every profile undergoes rigorous verification including ID, education, and occupation.',
                color: 'pink'
              },
              {
                icon: Search,
                title: 'Smart Search Filters',
                description: 'Find matches based on specific preferences including lifestyle, values, and interests.',
                color: 'purple'
              },
              {
                icon: MessageCircle,
                title: 'Secure Communication',
                description: 'Chat safely with advanced privacy controls and secure messaging features.',
                color: 'blue'
              },
              {
                icon: Globe,
                title: 'Global Reach',
                description: 'Connect with compatible matches across India and internationally.',
                color: 'green'
              },
              {
                icon: Clock,
                title: '24/7 Support',
                description: 'Our dedicated relationship advisors are available round the clock to help you.',
                color: 'orange'
              }
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                className="group"
                variants={fadeInUp}
                whileHover={{ y: -10 }}
              >
                <div className="text-center p-8 border border-rose-100 rounded-2xl hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-rose-50/30 h-full">
                  <motion.div
                    className={`bg-gradient-to-br from-${feature.color}-100 to-${feature.color}-200 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform`}
                  >
                    <feature.icon className={`h-10 w-10 text-${feature.color}-600`} />
                  </motion.div>

                  <h3 className="text-xl font-semibold text-gray-800 mb-4">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>

                  <motion.button
                    className="mt-6 text-rose-600 font-medium flex items-center justify-center space-x-2 mx-auto group-hover:text-rose-700"
                    whileHover={{ x: 5 }}
                  >
                    <span>Learn More</span>
                    <ArrowRight className="h-4 w-4" />
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Enhanced Services Section */}
      <section className="py-20 bg-gradient-to-br from-rose-50 to-pink-50 relative">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold mb-4">Premium Services</h2>
            <p className="text-xl text-gray-600">Comprehensive matrimonial solutions tailored for you</p>
          </motion.div>

          <motion.div
            // className="grid md:grid-cols-2 lg:grid-cols-4 gap-6" 
            className='flex items-center justify-center gap-6'
            variants={staggerChildren}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {[
              {
                title: 'Personal Matchmaker',
                description: 'Dedicated relationship expert to guide your journey and provide personalized recommendations.',
                icon: UserCheck,
                badge: 'Most Popular'
              },
              {
                title: 'Profile Boost',
                description: 'Increase your profile visibility by 10x and get priority placement in search results.',
                icon: Star,
                badge: 'New'
              },
              // {
              //   title: 'Video Calling',
              //   description: 'Connect face-to-face with matches through secure in-app video calling feature.',
              //   icon: Camera,
              //   badge: null
              // },
              {
                title: 'Advanced Analytics',
                description: 'Get detailed insights about your profile performance and match compatibility scores.',
                icon: Settings,
                badge: 'Premium'
              }
            ].map((service, index) => (
              <motion.div
                key={service.title}
                className="relative"
                variants={fadeInUp}
                whileHover={{ y: -5 }}
              >
                {service.badge && (
                  <div className="absolute -top-3 -right-3 z-10">
                    <span className="bg-gradient-to-r from-rose-500 to-pink-500 text-white text-xs px-3 py-1 rounded-full font-medium">
                      {service.badge}
                    </span>
                  </div>
                )}

                <div className="bg-white rounded-2xl p-6 border border-rose-100 hover:shadow-xl transition-all duration-300 h-full">
                  <div className="text-center">
                    <div className="bg-red-500 text-white p-4 rounded-xl w-fit mx-auto mb-6">
                      <service.icon className="h-8 w-8" />
                    </div>

                    <h3 className="text-xl font-semibold mb-4">{service.title}</h3>
                    <p className="text-gray-600 text-sm mb-6 leading-relaxed">{service.description}</p>

                    <motion.button
                      className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white py-3 rounded-lg font-medium hover:from-red-600 hover:to-red-700 transition-all"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Learn More
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Enhanced Success Stories with Carousel */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold mb-4">Success Stories</h2>
            <p className="text-xl text-gray-600">Real couples, real love stories that inspire</p>
          </motion.div>

          <div className="relative max-w-4xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTestimonial}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.5 }}
                className="bg-gradient-to-br from-rose-50 to-pink-50 rounded-3xl p-8 md:p-12"
              >
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  <div className="text-center md:text-left">
                    <div className="flex justify-center md:justify-start mb-4">
                      {[...Array(testimonials[activeTestimonial].rating)].map((_, i) => (
                        <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                      ))}
                    </div>

                    <blockquote className="text-lg text-gray-700 mb-6 italic">
                      "{testimonials[activeTestimonial].text}"
                    </blockquote>

                    <div>
                      <h4 className="font-semibold text-xl text-gray-800">
                        {testimonials[activeTestimonial].name}
                      </h4>
                      <p className="text-rose-600 font-medium">
                        {testimonials[activeTestimonial].location}
                      </p>
                    </div>
                  </div>

                  <div className="relative">
                    <motion.img
                      src={testimonials[activeTestimonial].image}
                      alt={testimonials[activeTestimonial].name}
                      className="rounded-2xl shadow-lg w-full h-80 object-cover"
                      whileHover={{ scale: 1.05 }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl"></div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Testimonial Navigation */}
            <div className="flex justify-center space-x-2 mt-8">
              {testimonials.map((_, index) => (
                <motion.button
                  key={index}
                  className={`w-3 h-3 rounded-full transition-all ${index === activeTestimonial ? 'bg-rose-500 w-8' : 'bg-rose-200'
                    }`}
                  onClick={() => setActiveTestimonial(index)}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                />
              ))}
            </div>
          </div>

          {/* More Success Stories Grid */}
          <motion.div
            className="grid md:grid-cols-3 gap-8 mt-16"
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            {[
              { name: 'Anjali & Rajesh', location: 'Pune', image: 'https://plus.unsplash.com/premium_photo-1700353612860-bd8ab8d71f05?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8bG92ZSUyMGNvdXBsZXxlbnwwfHwwfHx8MA%3D%3D' },
              { name: 'Meera & Vikash', location: 'Hyderabad', image: 'https://cdn.pixabay.com/photo/2018/09/11/16/13/indian-wedding-3669915_640.jpg' },
              { name: 'Sunita & Amit', location: 'Kolkata', image: 'https://cdn.pixabay.com/photo/2022/01/30/05/50/couple-6979878_1280.jpg' }
            ].map((couple, index) => (
              <motion.div
                key={couple.name}
                className="group cursor-pointer"
                whileHover={{ y: -5 }}
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all border border-rose-100">
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={couple.image}
                      alt={couple.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                    <div className="absolute bottom-4 left-4 text-white">
                      <h4 className="font-semibold">{couple.name}</h4>
                      <p className="text-sm opacity-90">{couple.location}</p>
                    </div>
                  </div>

                  <div className="p-6">
                    <motion.button
                      className="flex items-center space-x-2 text-rose-600 font-medium group-hover:text-rose-700"
                      whileHover={{ x: 5 }}
                    >
                      <span>Read Their Story</span>
                      <ArrowRight className="h-4 w-4" />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Enhanced Contact Section */}
      <section className="py-20 bg-gradient-to-br from-rose-500 to-pink-500 text-white relative overflow-hidden">
        <motion.div
          className="absolute inset-0 opacity-10"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 8, repeat: Infinity }}
        >
          <div className="absolute top-20 left-20 w-40 h-40 bg-white rounded-full"></div>
          <div className="absolute bottom-20 right-20 w-60 h-60 bg-white rounded-full"></div>
        </motion.div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -60 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl lg:text-5xl font-bold mb-6">Ready to Find Your Perfect Match?</h2>
              <p className="text-xl mb-8 text-rose-100 leading-relaxed">
                Join thousands of happy couples who found love through our platform.
                Start your journey to lifelong happiness today!
              </p>

              <div className="space-y-6">
                {[
                  { icon: Phone, text: '+91 98765 43210', label: 'Call Us' },
                  { icon: Mail, text: 'contact@marriagepaper.com', label: 'Email Us' },
                  { icon: MapPin, text: 'Mumbai, Maharashtra, India', label: 'Visit Us' }
                ].map((contact, index) => (
                  <motion.div
                    key={contact.label}
                    className="flex items-center space-x-4"
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ x: 10 }}
                  >
                    <div className="bg-white/20 p-3 rounded-lg">
                      <contact.icon className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="font-medium">{contact.text}</p>
                      <p className="text-rose-200 text-sm">{contact.label}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="flex flex-wrap gap-4 mt-8">
                <motion.button
                  className="bg-white text-rose-600 px-6 py-3 rounded-lg font-medium hover:bg-rose-50 transition-colors flex items-center space-x-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Phone className="h-4 w-4" />
                  <span>Schedule Call</span>
                </motion.button>

                <motion.button
                  className="border-2 border-white text-white px-6 py-3 rounded-lg font-medium hover:bg-white hover:text-rose-600 transition-all flex items-center space-x-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <MessageCircle className="h-4 w-4" />
                  <span>Live Chat</span>
                </motion.button>
              </div>
            </motion.div>

            <motion.div
              className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl p-8"
              initial={{ opacity: 0, x: 60 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
            >
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-white mb-2">Get Started Today</h3>
                <p className="text-rose-100">Fill out the form and we'll help you find your perfect match</p>
              </div>

              <div className="space-y-4">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Your Full Name"
                    className="w-full p-4 bg-white/20 border border-white/30 text-white placeholder:text-rose-200 rounded-lg focus:border-white focus:ring-2 focus:ring-white/50"
                  />
                </div>

                <div className="relative">
                  <input
                    type="email"
                    placeholder="Email Address"
                    className="w-full p-4 bg-white/20 border border-white/30 text-white placeholder:text-rose-200 rounded-lg focus:border-white focus:ring-2 focus:ring-white/50"
                  />
                </div>

                <div className="relative">
                  <input
                    type="tel"
                    placeholder="Phone Number"
                    className="w-full p-4 bg-white/20 border border-white/30 text-white placeholder:text-rose-200 rounded-lg focus:border-white focus:ring-2 focus:ring-white/50"
                  />
                </div>

                <div className="relative">
                  <select className="w-full p-4 bg-white/20 border border-white/30 text-white rounded-lg focus:border-white focus:ring-2 focus:ring-white/50">
                    <option value="" className="text-gray-800">I'm looking for</option>
                    <option value="bride" className="text-gray-800">Bride</option>
                    <option value="groom" className="text-gray-800">Groom</option>
                  </select>
                </div>

                <motion.button
                  className="w-full bg-white text-rose-600 py-4 rounded-lg font-bold text-lg hover:bg-rose-50 transition-colors flex items-center justify-center space-x-2"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Heart className="h-5 w-5" />
                  <span>Start My Journey</span>
                  <ArrowRight className="h-5 w-5" />
                </motion.button>
              </div>

              <p className="text-rose-200 text-sm text-center mt-4">
                * Free registration with premium features available
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Enhanced Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            <motion.div
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center space-x-2 mb-6">
                <Heart className="h-8 w-8 text-rose-500" />
                <span className="text-2xl font-bold">Marriage Paper</span>
              </div>
              <p className="text-gray-400 mb-6 leading-relaxed">
                India's most trusted matrimonial platform helping millions find their perfect life partner
                through innovative technology and personalized service.
              </p>

              <div className="flex space-x-4">
                {['facebook', 'twitter', 'instagram', 'linkedin'].map((social) => (
                  <motion.a
                    key={social}
                    href="#"
                    className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-rose-600 transition-colors"
                    whileHover={{ scale: 1.1, y: -2 }}
                  >
                    <span className="sr-only">{social}</span>
                    <div className="w-5 h-5 bg-gray-400 rounded"></div>
                  </motion.a>
                ))}
              </div>
            </motion.div>

            {[
              {
                title: 'Quick Links',
                links: ['Browse Profiles', 'Success Stories', 'Mobile App', 'Help Center', 'Privacy Policy']
              },
              {
                title: 'Services',
                links: ['Premium Membership', 'Personal Matchmaker', 'Profile Verification', 'Wedding Services', 'Astrology']
              },
              {
                title: 'Support',
                links: ['Contact Us', 'FAQ', 'Terms of Service', 'Refund Policy', 'Safety Tips']
              }
            ].map((section, index) => (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: (index + 1) * 0.1 }}
              >
                <h3 className="font-semibold text-lg mb-6">{section.title}</h3>
                <ul className="space-y-3">
                  {section.links.map((link) => (
                    <li key={link}>
                      <motion.a
                        href="#"
                        className="text-gray-400 hover:text-white transition-colors flex items-center group"
                        whileHover={{ x: 5 }}
                      >
                        <span>{link}</span>
                        <ArrowRight className="h-3 w-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </motion.a>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>

          {/* Newsletter Signup */}
          <motion.div
            className="border-t border-gray-800 pt-8 mb-8"
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="max-w-md mx-auto text-center">
              <h4 className="font-semibold text-lg mb-4">Stay Updated</h4>
              <p className="text-gray-400 mb-6">Get latest success stories and matrimonial tips</p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:border-rose-500 focus:ring-1 focus:ring-rose-500"
                />
                <motion.button
                  className="px-6 py-3 bg-rose-600 text-white rounded-lg font-medium hover:bg-rose-700 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Subscribe
                </motion.button>
              </div>
            </div>
          </motion.div>

          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Marriage Paper. All rights reserved. | Made with ❤️ in India</p>
          </div>
        </div>
      </footer>

      {/* Floating Action Button */}
      <motion.div
        className="fixed bottom-6 right-6 z-50"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 2 }}
      >
        <motion.button
          className="w-14 h-14 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-full shadow-lg flex items-center justify-center"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <MessageCircle className="h-6 w-6" />
        </motion.button>
      </motion.div>
    </div>
  );
};

export default MarriagePaperWebsite;
