/*  ProfileCard.jsx - Detailed profile card matching the image  */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Briefcase, GraduationCap, Eye, Heart, MessageCircle, Check, Play, Camera, ArrowRight, User } from 'lucide-react';

// Profile Image Component
const ProfileImage = ({ profile, className, size = 'md' }) => {
  const [imageError, setImageError] = useState(false);
  
  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-32 h-40', 
    lg: 'w-full h-80'
  };

  const iconSizes = {
    sm: 'w-8 h-8',
    md: 'w-16 h-16',
    lg: 'w-32 h-32'
  };

  // Show default icon if no image or image failed to load
  if (!profile.image || profile.image === null || imageError) {
    return (
      <div className={`${sizeClasses[size]} ${className} bg-gray-100 border border-gray-200 rounded-lg flex items-center justify-center`}>
        <User className={`${iconSizes[size]} text-gray-400`} />
      </div>
    );
  }

  return (
    <img
      src={profile.image}
      alt={profile.name}
      className={`${sizeClasses[size]} ${className} object-cover border border-gray-200`}
      onError={() => setImageError(true)}
    />
  );
};

const ProfileCard = ({ profile, viewMode = 'grid' }) => {
  const navigate = useNavigate();

  const handleProfileClick = () => {
    // Use profileId if available (for static profiles), otherwise use id (for API profiles)
    const profileIdentifier = profile.profileId || profile.id || profile.user_id;
    navigate(`/profile/${profileIdentifier}`);
  };

  const handleProposeClick = (e) => {
    e.stopPropagation();

    if (profile.isDemoProfile) {
      alert('This is a demo profile. Please register to view real profiles and send proposals.');
      return;
    }

    // For real profiles, navigate to the profile page where the propose functionality exists
    handleProfileClick();
  };

  const getMemberTypeColor = (type) => {
    switch (type) {
      case 'QUICK': return 'bg-green-100 text-green-800 border-green-200';
      case 'STOCK': return 'bg-blue-100 text-blue-800 border-blue-200'; 
      case 'PREMIUM': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (viewMode === 'list') {
    return (
      <div 
        className="bg-white rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-300 overflow-hidden cursor-pointer"
        onClick={handleProfileClick}
      >
        <div className="p-6">
          <div className="flex space-x-6">
            {/* Profile Image */}
            <div className="relative flex-shrink-0">
              <ProfileImage profile={profile} className="rounded-lg" size="md" />
              
              {/* Image indicators */}
              <div className="absolute bottom-2 left-2 flex space-x-1">
                <div className="bg-black/70 text-white text-xs px-2 py-1 rounded flex items-center space-x-1">
                  <Camera className="w-3 h-3" />
                  <span>See {profile.photos} Photos</span>
                </div>
              </div>
              
              {profile.videoProfiles > 0 && (
                <div className="absolute top-2 left-2 bg-red-600 text-white text-xs px-2 py-1 rounded flex items-center space-x-1">
                  <Play className="w-3 h-3" />
                  <span>Video Profile {profile.videoProfiles}</span>
                </div>
              )}

              {profile.verified && (
                <div className="absolute top-2 right-2 bg-green-600 rounded-full p-1">
                  <Check className="w-3 h-3 text-white" />
                </div>
              )}
            </div>

            {/* Profile Details */}
            <div className="flex-1 space-y-3">
              {/* Header Info */}
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center space-x-3 mb-2">
                    <p className="text-sm text-gray-500 font-medium">{profile.profileId}</p>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getMemberTypeColor(profile.memberType)}`}>
                      {profile.memberType} Member
                    </span>
                    {profile.verified && (
                      <span className="text-green-600 text-xs font-semibold">✓ Verified AD</span>
                    )}
                  </div>
                  <h3 className="font-bold text-lg text-gray-800 mb-1">
                    {profile.details}
                  </h3>
                </div>
              </div>

              {/* Detailed Information */}
              <div className="space-y-2 text-sm text-gray-700">
                <p><strong>Ethnicity:</strong> {profile.ethnicity}</p>
                <p><strong>Qualification:</strong> {profile.qualification}</p>
                <p><strong>Profession:</strong> {profile.profession}</p>
                <p><strong>Personal Details:</strong> {profile.personalDetails}</p>
                <p className="text-gray-600">
                  <strong>About Myself:</strong> {profile.aboutMyself}
                  <button 
                    className="text-red-600 hover:text-red-700 font-semibold ml-1"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleProfileClick();
                    }}
                  >
                    Read More
                  </button>
                </p>
              </div>

              {/* Verification & Contact Info */}
              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <div className="space-y-1">
                  <p className="text-xs text-gray-500">
                    <strong>Yet To Marry Verified On:</strong> {profile.yetToMarryVerified}
                  </p>
                  <p className="text-xs text-gray-500">
                    <strong>Self Verified:</strong> {profile.selfVerified}
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center space-x-2">
                  {profile.contactEmail && (
                    <div className="flex items-center text-xs text-gray-600 mr-4">
                      <input type="checkbox" className="mr-2 accent-red-600" />
                      <span>Contact via email</span>
                    </div>
                  )}
                  <button 
                    className="text-gray-500 hover:text-red-600 transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleProfileClick();
                    }}
                  >
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="flex items-center space-x-4 pt-2">
                <button
                  className={`text-sm font-semibold ${
                    profile.isDemoProfile
                      ? 'text-gray-400 cursor-not-allowed'
                      : 'text-red-600 hover:text-red-700'
                  }`}
                  onClick={handleProposeClick}
                  disabled={profile.isDemoProfile}
                >
                  {profile.isDemoProfile ? 'Demo Profile' : 'Propose Now'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Grid View - Larger and more detailed
  return (
    <div 
      className="bg-white rounded-xl border border-gray-200 hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer"
      onClick={handleProfileClick}
    >
      {/* Profile Image */}
      <div className="relative">
        <ProfileImage profile={profile} className="" size="lg" />
        
        {/* Image indicators */}
        <div className="absolute bottom-3 left-3">
          <div className="bg-black/70 text-white text-sm px-3 py-1 rounded flex items-center space-x-1">
            <Camera className="w-4 h-4" />
            <span>See {profile.photos} Photos</span>
          </div>
        </div>
        
        {profile.videoProfiles > 0 && (
          <div className="absolute top-3 left-3 bg-red-600 text-white text-sm px-3 py-1 rounded flex items-center space-x-1">
            <Play className="w-4 h-4" />
            <span>Video Profile {profile.videoProfiles}</span>
          </div>
        )}

        {profile.verified && (
          <div className="absolute top-3 right-3 bg-green-600 rounded-full p-2">
            <Check className="w-4 h-4 text-white" />
          </div>
        )}
      </div>

      {/* Profile Details */}
      <div className="p-6">
        {/* Header Info */}
        <div className="mb-4">
          <div className="flex items-center space-x-3 mb-3">
            <p className="text-sm text-gray-500 font-medium">{profile.profileId}</p>
            <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getMemberTypeColor(profile.memberType)}`}>
              {profile.memberType} Member
            </span>
          </div>
          {profile.verified && (
            <span className="text-green-600 text-sm font-semibold">✓ Verified AD</span>
          )}
          <h3 className="font-bold text-xl text-gray-800 mt-2">
            {profile.details}
          </h3>
        </div>

        {/* Detailed Information */}
        <div className="space-y-3 text-sm text-gray-700 mb-6">
          <p><strong>Ethnicity:</strong> {profile.ethnicity}</p>
          <p><strong>Qualification:</strong> {profile.qualification}</p>
          <p><strong>Profession:</strong> {profile.profession}</p>
          <p><strong>Personal Details:</strong> {profile.personalDetails}</p>
          <p className="text-gray-600">
            <strong>About Myself:</strong> {profile.aboutMyself.substring(0, 60)}...
            <button 
              className="text-red-600 hover:text-red-700 font-semibold ml-1"
              onClick={(e) => {
                e.stopPropagation();
                handleProfileClick();
              }}
            >
              View Full Profile
            </button>
          </p>
        </div>

        {/* Verification Info */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="space-y-1 text-xs text-gray-600">
            <p><strong>Yet To Marry Verified On:</strong> {profile.yetToMarryVerified}</p>
            <p><strong>Self Verified:</strong> {profile.selfVerified}</p>
          </div>
        </div>

        {/* Contact & Actions */}
        <div className="space-y-4">
          {profile.contactEmail && (
            <div className="flex items-center text-sm text-gray-600">
              <input type="checkbox" className="mr-3 accent-red-600" />
              <span>Contact via email</span>
              <button 
                className="ml-auto text-gray-400 hover:text-red-600 transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  handleProfileClick();
                }}
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          <button
            className={`w-full py-3 px-6 rounded-lg font-bold transition-colors ${
              profile.isDemoProfile
                ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                : 'bg-red-600 hover:bg-red-700 text-white'
            }`}
            onClick={handleProposeClick}
            disabled={profile.isDemoProfile}
          >
            {profile.isDemoProfile ? 'Demo Profile' : 'Propose Now'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
