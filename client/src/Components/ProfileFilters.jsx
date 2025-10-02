/*  ProfileFilters.jsx - Comprehensive filter sidebar  */

import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Search } from 'lucide-react';

const ProfileFilters = ({ onFiltersChange }) => {
  const [filters, setFilters] = useState({
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
    country: '',
    state: '',
    city: '',
    education: [],
    occupation: [],
    workingWith: [],
    income: '',
    memberType: [],
    profilesWith: []
  });

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

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    
    // Convert filters to API format
    const apiFilters = convertFiltersToAPI(newFilters);
    onFiltersChange(apiFilters);
  };

  const handleMultiSelectChange = (key, value, checked) => {
    const currentValues = filters[key] || [];
    const newValues = checked 
      ? [...currentValues, value]
      : currentValues.filter(item => item !== value);
    
    const newFilters = { ...filters, [key]: newValues };
    setFilters(newFilters);
    
    // Convert filters to API format
    const apiFilters = convertFiltersToAPI(newFilters);
    onFiltersChange(apiFilters);
  };

  // Convert frontend filters to API format
  const convertFiltersToAPI = (frontendFilters) => {
    const apiFilters = {};

    // Age filters
    if (frontendFilters.ageFrom) {
      apiFilters.ageMin = parseInt(frontendFilters.ageFrom);
    }
    if (frontendFilters.ageTo) {
      apiFilters.ageMax = parseInt(frontendFilters.ageTo);
    }

    // Gender filter
    if (frontendFilters.profileFor) {
      apiFilters.gender = frontendFilters.profileFor.toLowerCase();
    }

    // Location filter
    if (frontendFilters.state) {
      apiFilters.location = frontendFilters.state;
    }

    // Member type filter (convert to backend format)
    if (frontendFilters.memberType && frontendFilters.memberType.length > 0) {
      // This would need to be handled in the backend if needed
      // For now, we'll skip member type filtering in API
    }

    return apiFilters;
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
              value={filters.profileFor}
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
                value={filters.ageFrom}
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
                value={filters.ageTo}
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
                value={filters.heightFrom}
                onChange={(e) => handleFilterChange('heightFrom', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-red-500"
              >
                <option value="">Any</option>
                <option value="4'6&quot;">4'6"</option>
                <option value="4'9&quot;">4'9"</option>
                <option value="5'0&quot;">5'0"</option>
                <option value="5'3&quot;">5'3"</option>
                <option value="5'6&quot;">5'6"</option>
                <option value="5'9&quot;">5'9"</option>
                <option value="6'0&quot;">6'0"</option>
                <option value="6'3&quot;">6'3"</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Height To</label>
              <select
                value={filters.heightTo}
                onChange={(e) => handleFilterChange('heightTo', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-red-500"
              >
                <option value="">Any</option>
                <option value="4'6&quot;">4'6"</option>
                <option value="4'9&quot;">4'9"</option>
                <option value="5'0&quot;">5'0"</option>
                <option value="5'3&quot;">5'3"</option>
                <option value="5'6&quot;">5'6"</option>
                <option value="5'9&quot;">5'9"</option>
                <option value="6'0&quot;">6'0"</option>
                <option value="6'3&quot;">6'3"</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Marital Status</label>
            <CheckboxGroup
              options={['Never Married', 'Divorced', 'Widow/Widower', 'Separated']}
              selectedValues={filters.maritalStatus}
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
              options={['Hindu', 'Muslim', 'Christian', 'Sikh', 'Buddhist', 'Jain', 'Others']}
              selectedValues={filters.religion}
              onChange={handleMultiSelectChange}
              filterKey="religion"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Caste</label>
            <CheckboxGroup
              options={['Brahmin', 'Kshatriya', 'Vaishya', 'Shudra', 'Kayastha', 'Maratha', 'Others']}
              selectedValues={filters.caste}
              onChange={handleMultiSelectChange}
              filterKey="caste"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Subcaste</label>
            <input
              type="text"
              value={filters.subcaste}
              onChange={(e) => handleFilterChange('subcaste', e.target.value)}
              placeholder="Enter subcaste"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-red-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Mother Tongue</label>
            <CheckboxGroup
              options={['Hindi', 'English', 'Bengali', 'Tamil', 'Telugu', 'Marathi', 'Gujarati', 'Kannada', 'Others']}
              selectedValues={filters.motherTongue}
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
              value={filters.country}
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
              value={filters.state}
              onChange={(e) => handleFilterChange('state', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-red-500"
            >
              <option value="">Select State</option>
              <option value="Delhi">Delhi</option>
              <option value="Mumbai">Mumbai</option>
              <option value="Bangalore">Bangalore</option>
              <option value="Chennai">Chennai</option>
              <option value="Kolkata">Kolkata</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
            <input
              type="text"
              value={filters.city}
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
              options={['MBA', 'B.Tech', 'M.Tech', 'CA', 'Doctor', 'B.Com', 'M.Com', 'Others']}
              selectedValues={filters.education}
              onChange={handleMultiSelectChange}
              filterKey="education"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Occupation</label>
            <CheckboxGroup
              options={['Engineer', 'Doctor', 'Business', 'Teacher', 'CA', 'Software Professional', 'Others']}
              selectedValues={filters.occupation}
              onChange={handleMultiSelectChange}
              filterKey="occupation"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Working With</label>
            <CheckboxGroup
              options={['Private Company', 'Government', 'Self Employed', 'Business', 'Not Working']}
              selectedValues={filters.workingWith}
              onChange={handleMultiSelectChange}
              filterKey="workingWith"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Annual Income</label>
            <select
              value={filters.income}
              onChange={(e) => handleFilterChange('income', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-red-500"
            >
              <option value="">Select Income</option>
              <option value="0-3">0-3 Lakhs</option>
              <option value="3-5">3-5 Lakhs</option>
              <option value="5-10">5-10 Lakhs</option>
              <option value="10-20">10-20 Lakhs</option>
              <option value="20+">20+ Lakhs</option>
            </select>
          </div>
        </FilterSection>

        {/* Special Preferences */}
        <FilterSection 
          title="Special Preferences" 
          isExpanded={expandedSections.lifestyle}
          onToggle={() => toggleSection('lifestyle')}
        >
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Member Type</label>
            <CheckboxGroup
              options={['QUICK Member', 'STOCK Member', 'Premium Member']}
              selectedValues={filters.memberType}
              onChange={handleMultiSelectChange}
              filterKey="memberType"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Profiles With</label>
            <CheckboxGroup
              options={['Photo', 'Video Profile', 'Verified Mobile', 'Contact Details']}
              selectedValues={filters.profilesWith}
              onChange={handleMultiSelectChange}
              filterKey="profilesWith"
            />
          </div>
        </FilterSection>

      </div>

      {/* Filter Actions */}
      <div className="p-4 border-t border-gray-200 flex space-x-3">
        <button
          onClick={() => {
            setFilters({});
            onFiltersChange({});
          }}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Clear All
        </button>
        <button className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors">
          Apply Filters
        </button>
      </div>
    </div>
  );
};

export default ProfileFilters;
