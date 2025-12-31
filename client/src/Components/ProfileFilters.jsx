/*  ProfileFilters.jsx - Comprehensive filter sidebar  */

import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, Search } from 'lucide-react';

const ProfileFilters = ({ onFiltersChange, initialFilters: propInitialFilters }) => {
  // Load saved filters from localStorage
  const getSavedFilters = () => {
    try {
      // First check if there are filters from hero search
      const heroFilters = localStorage.getItem('heroSearchFilters');
      if (heroFilters) {
        const parsed = JSON.parse(heroFilters);
        localStorage.removeItem('heroSearchFilters'); // Clear after reading
        return parsed;
      }
      
      // Otherwise check regular saved filters
      const saved = localStorage.getItem('profileFilters');
      return saved ? JSON.parse(saved) : null;
    } catch (error) {
      console.error('Error loading saved filters:', error);
      return null;
    }
  };

  const defaultFilters = {
    profileFor: '',
    ageFrom: '',
    ageTo: '',
    heightFrom: '',
    heightTo: '',
    maritalStatus: [],
    caste: [],
    subcaste: '',
    religion: [],
    motherTongue: [],
    community: [],
    country: '',
    state: '',
    city: '',
    education: [],
    occupation: [],
    annualIncome: '',
    diet: [],
    complexion: [],
    bodyType: []
  };

  // Merge prop initial filters with saved filters, giving priority to prop filters
  const getInitialState = () => {
    const saved = getSavedFilters();
    if (propInitialFilters) {
      return { ...defaultFilters, ...saved, ...propInitialFilters };
    }
    return saved || defaultFilters;
  };

  // Separate state for temporary (unapplied) filters
  const [tempFilters, setTempFilters] = useState(getInitialState());

  // Update filters when prop initialFilters change
  useEffect(() => {
    if (propInitialFilters && Object.keys(propInitialFilters).length > 0) {
      setTempFilters(prev => ({ ...prev, ...propInitialFilters }));
    }
  }, [propInitialFilters]);

  const [expandedSections, setExpandedSections] = useState({
    basic: true,
    religion: true,
    location: true,
    career: true,
    lifestyle: true
  });

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Only update temp filters, don't trigger API call
  const handleFilterChange = (key, value) => {
    setTempFilters(prev => ({ ...prev, [key]: value }));
  };

  // Only update temp filters for multi-select, don't trigger API call
  const handleMultiSelectChange = (key, value, checked) => {
    setTempFilters(prev => {
      const currentValues = prev[key] || [];
      const newValues = checked 
        ? [...currentValues, value]
        : currentValues.filter(item => item !== value);
      return { ...prev, [key]: newValues };
    });
  };

  // Convert frontend filters to API format matching Profile.js and User.js models
  const convertFiltersToAPI = (frontendFilters) => {
    const apiFilters = {};

    // Age filters (calculated from date_of_birth in User model)
    if (frontendFilters.ageFrom) {
      apiFilters.ageMin = parseInt(frontendFilters.ageFrom);
    }
    if (frontendFilters.ageTo) {
      apiFilters.ageMax = parseInt(frontendFilters.ageTo);
    }

    // Gender filter (from User model)
    if (frontendFilters.profileFor) {
      // Convert to match User model: 'Male' or 'Female'
      apiFilters.gender = frontendFilters.profileFor === 'bride' ? 'Female' : frontendFilters.profileFor === 'groom' ? 'Male' : '';
    }

    // Height filters (from personal_info in Profile model) - send as heightMin/heightMax
    if (frontendFilters.heightFrom) {
      apiFilters.heightMin = parseInt(frontendFilters.heightFrom);
    }
    if (frontendFilters.heightTo) {
      apiFilters.heightMax = parseInt(frontendFilters.heightTo);
    }

    // Marital status (from personal_info.marital_status in Profile model)
    if (frontendFilters.maritalStatus && frontendFilters.maritalStatus.length > 0) {
      apiFilters.maritalStatus = frontendFilters.maritalStatus.map(status => {
        // Convert to match database values
        if (status === 'Never Married') return 'never_married';
        if (status === 'Divorced') return 'divorced';
        if (status === 'Widow/Widower') return 'widowed';
        if (status === 'Separated') return 'separated';
        return status.toLowerCase().replace(/\s+/g, '_');
      });
    }

    // Religion (from religious_info.religion in Profile model)
    if (frontendFilters.religion && frontendFilters.religion.length > 0) {
      apiFilters.religion = frontendFilters.religion;
    }

    // Community (from religious_info.community in Profile model)
    if (frontendFilters.community && frontendFilters.community.length > 0) {
      apiFilters.community = frontendFilters.community;
    }

    // Caste (from religious_info.caste in Profile model)
    if (frontendFilters.caste && frontendFilters.caste.length > 0) {
      apiFilters.caste = frontendFilters.caste;
    }

    // Subcaste
    if (frontendFilters.subcaste) {
      apiFilters.subcaste = frontendFilters.subcaste;
    }

    // Mother tongue (from additional_info.native_language in Profile model)
    if (frontendFilters.motherTongue && frontendFilters.motherTongue.length > 0) {
      apiFilters.motherTongue = frontendFilters.motherTongue;
    }

    // Location filter (from location_info in Profile model)
    if (frontendFilters.country) {
      apiFilters.country = frontendFilters.country;
    }
    if (frontendFilters.state) {
      apiFilters.state = frontendFilters.state;
    }
    if (frontendFilters.city) {
      apiFilters.city = frontendFilters.city;
    }

    // Education (from education_career_info.education in Profile model)
    if (frontendFilters.education && frontendFilters.education.length > 0) {
      apiFilters.education = frontendFilters.education;
    }

    // Occupation (from education_career_info.occupation in Profile model)
    if (frontendFilters.occupation && frontendFilters.occupation.length > 0) {
      apiFilters.occupation = frontendFilters.occupation;
    }

    // Annual Income (from education_career_info.annual_income in Profile model)
    if (frontendFilters.annualIncome) {
      apiFilters.annualIncome = frontendFilters.annualIncome;
    }

    // Diet (from lifestyle_info.diet in Profile model)
    if (frontendFilters.diet && frontendFilters.diet.length > 0) {
      apiFilters.diet = frontendFilters.diet.map(d => d.toLowerCase().replace(/\s+/g, '_'));
    }

    // Complexion (from personal_info.complexion in Profile model)
    if (frontendFilters.complexion && frontendFilters.complexion.length > 0) {
      apiFilters.complexion = frontendFilters.complexion.map(c => c.toLowerCase());
    }

    // Body Type (from personal_info.body_type in Profile model)
    if (frontendFilters.bodyType && frontendFilters.bodyType.length > 0) {
      apiFilters.bodyType = frontendFilters.bodyType.map(b => b.toLowerCase());
    }

    return apiFilters;
  };

  // Apply filters - only this triggers the API call
  const handleApplyFilters = () => {
    const apiFilters = convertFiltersToAPI(tempFilters);
    
    // Save to localStorage
    try {
      localStorage.setItem('profileFilters', JSON.stringify(tempFilters));
    } catch (error) {
      console.error('Error saving filters:', error);
    }
    
    onFiltersChange(apiFilters);
  };

  // Clear all filters
  const handleClearFilters = () => {
    setTempFilters(defaultFilters);
    
    // Clear from localStorage
    try {
      localStorage.removeItem('profileFilters');
    } catch (error) {
      console.error('Error clearing saved filters:', error);
    }
    
    onFiltersChange({});
  };

  const FilterSection = ({ title, isExpanded, onToggle, children }) => (
    <div className="border-b border-gray-200 pb-4 mb-4">
      <button
        onClick={onToggle}
        className="flex items-center justify-between w-full text-left font-semibold text-gray-800 mb-3 hover:text-red-600 transition-colors"
      >
        <span>{title}</span>
        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </button>
      {isExpanded && <div className="space-y-3">{children}</div>}
    </div>
  );

  const CheckboxGroup = ({ options, selectedValues, onChange, filterKey }) => (
    <div className="space-y-2 max-h-40 overflow-y-auto">
      {options.map(option => (
        <label key={option} className="flex items-center space-x-2 text-sm">
          <input
            type="checkbox"
            checked={selectedValues.includes(option)}
            onChange={(e) => onChange(filterKey, option, e.target.checked)}
            className="rounded border-gray-300 text-red-600 focus:ring-red-500"
          />
          <span className="text-gray-700">{option}</span>
        </label>
      ))}
    </div>
  );

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-lg font-bold text-gray-800 mb-2">Search Filters</h3>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search by ID or Name..."
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Scrollable Filters Content */}
      <div className="p-4 h-[calc(100vh-280px)] overflow-y-auto" style={{ scrollbarWidth: 'thin' }}>
        
        {/* Basic Details */}
        <FilterSection 
          title="Basic Details" 
          isExpanded={expandedSections.basic}
          onToggle={() => toggleSection('basic')}
        >
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Looking for</label>
            <select
              value={tempFilters.profileFor}
              onChange={(e) => handleFilterChange('profileFor', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-red-500"
            >
              <option value="">Select</option>
              <option value="bride">Bride</option>
              <option value="groom">Groom</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Age From</label>
              <select
                value={tempFilters.ageFrom}
                onChange={(e) => handleFilterChange('ageFrom', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-red-500"
              >
                <option value="">Any</option>
                {Array.from({length: 43}, (_, i) => i + 18).map(age => (
                  <option key={age} value={age}>{age}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Age To</label>
              <select
                value={tempFilters.ageTo}
                onChange={(e) => handleFilterChange('ageTo', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-red-500"
              >
                <option value="">Any</option>
                {Array.from({length: 43}, (_, i) => i + 18).map(age => (
                  <option key={age} value={age}>{age}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Height From</label>
              <select
                value={tempFilters.heightFrom}
                onChange={(e) => handleFilterChange('heightFrom', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-red-500"
              >
                <option value="">Any</option>
                <option value="140">4'7" (140cm)</option>
                <option value="145">4'9" (145cm)</option>
                <option value="150">4'11" (150cm)</option>
                <option value="155">5'1" (155cm)</option>
                <option value="160">5'3" (160cm)</option>
                <option value="165">5'5" (165cm)</option>
                <option value="170">5'7" (170cm)</option>
                <option value="175">5'9" (175cm)</option>
                <option value="180">5'11" (180cm)</option>
                <option value="185">6'1" (185cm)</option>
                <option value="190">6'3" (190cm)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Height To</label>
              <select
                value={tempFilters.heightTo}
                onChange={(e) => handleFilterChange('heightTo', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-red-500"
              >
                <option value="">Any</option>
                <option value="140">4'7" (140cm)</option>
                <option value="145">4'9" (145cm)</option>
                <option value="150">4'11" (150cm)</option>
                <option value="155">5'1" (155cm)</option>
                <option value="160">5'3" (160cm)</option>
                <option value="165">5'5" (165cm)</option>
                <option value="170">5'7" (170cm)</option>
                <option value="175">5'9" (175cm)</option>
                <option value="180">5'11" (180cm)</option>
                <option value="185">6'1" (185cm)</option>
                <option value="190">6'3" (190cm)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Marital Status</label>
            <CheckboxGroup
              options={['Never Married', 'Divorced', 'Widow/Widower', 'Separated']}
              selectedValues={tempFilters.maritalStatus}
              onChange={handleMultiSelectChange}
              filterKey="maritalStatus"
            />
          </div>
        </FilterSection>

        {/* Religion & Caste */}
        <FilterSection 
          title="Religion & Caste" 
          isExpanded={expandedSections.religion}
          onToggle={() => toggleSection('religion')}
        >
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Religion</label>
            <CheckboxGroup
              options={['Hindu', 'Muslim', 'Christian', 'Buddhism', 'Other']}
              selectedValues={tempFilters.religion}
              onChange={handleMultiSelectChange}
              filterKey="religion"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Caste</label>
            <CheckboxGroup
              options={['Brahmin', 'Kshatriya', 'Vaishya', 'Kayastha', 'Maratha', 'Reddy', 'Nair', 'Jat', 'Patel', 'Other']}
              selectedValues={tempFilters.caste}
              onChange={handleMultiSelectChange}
              filterKey="caste"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Subcaste</label>
            <input
              type="text"
              value={tempFilters.subcaste}
              onChange={(e) => handleFilterChange('subcaste', e.target.value)}
              placeholder="Enter subcaste"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-red-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Mother Tongue</label>
            <CheckboxGroup
              options={['Bengali', 'Hindi', 'Tamil', 'Telugu', 'Punjabi', 'Marathi', 'Gujarati', 'Kannada', 'Malayalam', 'Other']}
              selectedValues={tempFilters.motherTongue}
              onChange={handleMultiSelectChange}
              filterKey="motherTongue"
            />
          </div>
        </FilterSection>

        {/* Location */}
        <FilterSection 
          title="Location" 
          isExpanded={expandedSections.location}
          onToggle={() => toggleSection('location')}
        >
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
            <select
              value={tempFilters.country}
              onChange={(e) => handleFilterChange('country', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-red-500"
            >
              <option value="">Select Country</option>
              <option value="India">India</option>
              <option value="USA">USA</option>
              <option value="UK">UK</option>
              <option value="Canada">Canada</option>
              <option value="Australia">Australia</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
            <select
              value={tempFilters.state}
              onChange={(e) => handleFilterChange('state', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-red-500"
            >
              <option value="">Select State</option>
              <option value="Andhra Pradesh">Andhra Pradesh</option>
              <option value="Bihar">Bihar</option>
              <option value="Delhi">Delhi</option>
              <option value="Gujarat">Gujarat</option>
              <option value="Haryana">Haryana</option>
              <option value="Karnataka">Karnataka</option>
              <option value="Kerala">Kerala</option>
              <option value="Madhya Pradesh">Madhya Pradesh</option>
              <option value="Maharashtra">Maharashtra</option>
              <option value="Punjab">Punjab</option>
              <option value="Rajasthan">Rajasthan</option>
              <option value="Tamil Nadu">Tamil Nadu</option>
              <option value="Telangana">Telangana</option>
              <option value="Uttar Pradesh">Uttar Pradesh</option>
              <option value="West Bengal">West Bengal</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
            <input
              type="text"
              value={tempFilters.city}
              onChange={(e) => handleFilterChange('city', e.target.value)}
              placeholder="Enter city"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-red-500"
            />
          </div>
        </FilterSection>

        {/* Career & Education */}
        <FilterSection 
          title="Career & Education" 
          isExpanded={expandedSections.career}
          onToggle={() => toggleSection('career')}
        >
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Education</label>
            <CheckboxGroup
              options={['Higher Secondary', 'Under Graduate', 'Graduate', 'Master Degree', 'Diploma', 'Ph.D']}
              selectedValues={tempFilters.education}
              onChange={handleMultiSelectChange}
              filterKey="education"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Occupation</label>
            <CheckboxGroup
              options={['Service', 'Business', 'Agriculture', 'Home Based Earning', 'Profession (Non Service)', 'Homely', 'Other']}
              selectedValues={tempFilters.occupation}
              onChange={handleMultiSelectChange}
              filterKey="occupation"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Annual Income</label>
            <select
              value={tempFilters.annualIncome}
              onChange={(e) => handleFilterChange('annualIncome', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-red-500"
            >
              <option value="">Select Income</option>
              <option value="below_3_lakhs">Below 3 Lakhs</option>
              <option value="3_to_5_lakhs">3-5 Lakhs</option>
              <option value="5_to_10_lakhs">5-10 Lakhs</option>
              <option value="10_to_20_lakhs">10-20 Lakhs</option>
              <option value="above_20_lakhs">Above 20 Lakhs</option>
            </select>
          </div>
        </FilterSection>

        {/* Lifestyle & Appearance */}
        <FilterSection 
          title="Lifestyle & Appearance" 
          isExpanded={expandedSections.lifestyle}
          onToggle={() => toggleSection('lifestyle')}
        >
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Diet</label>
            <CheckboxGroup
              options={['Vegetarian', 'Non-Vegetarian', 'Eggetarian']}
              selectedValues={tempFilters.diet}
              onChange={handleMultiSelectChange}
              filterKey="diet"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Complexion</label>
            <CheckboxGroup
              options={['Fair', 'Wheatish', 'Dark', 'Very Fair']}
              selectedValues={tempFilters.complexion}
              onChange={handleMultiSelectChange}
              filterKey="complexion"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Body Type</label>
            <CheckboxGroup
              options={['Slim', 'Average', 'Athletic', 'Heavy']}
              selectedValues={tempFilters.bodyType}
              onChange={handleMultiSelectChange}
              filterKey="bodyType"
            />
          </div>
        </FilterSection>

      </div>

      {/* Filter Actions */}
      <div className="p-4 border-t border-gray-200 flex space-x-3">
        <button
          onClick={handleClearFilters}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Clear All
        </button>
        <button 
          onClick={handleApplyFilters}
          className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
        >
          Apply Filters
        </button>
      </div>
    </div>
  );
};

export default ProfileFilters;
