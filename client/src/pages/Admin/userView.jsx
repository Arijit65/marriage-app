import React from 'react';
import { X, User, Mail, Phone, Calendar, MapPin, Briefcase, Heart, Home, DollarSign, Shield, CheckCircle, XCircle } from 'lucide-react';

const UserView = ({ user, onClose }) => {
  if (!user) return null;

  // Get user profile data
  const profile = user.rawUser?.userProfile || {};

  // Format date helper
  const formatDate = (dateString) => {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Status badge component
  const StatusBadge = ({ status, label }) => {
    const isVerified = status === true || status === 'verified' || status === 'active';
    return (
      <div className="flex items-center space-x-2">
        {isVerified ? (
          <CheckCircle className="h-5 w-5 text-green-600" />
        ) : (
          <XCircle className="h-5 w-5 text-red-600" />
        )}
        <span className={`text-sm font-medium ${isVerified ? 'text-green-700' : 'text-red-700'}`}>
          {label}
        </span>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-6 flex justify-between items-center sticky top-0 z-10">
          <div className="flex items-center space-x-4">
            <img
              src={user.photo}
              alt={user.name}
              className="w-16 h-16 rounded-full border-4 border-white object-cover"
              onError={(e) => {
                e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&size=80&background=random`;
              }}
            />
            <div>
              <h2 className="text-2xl font-bold">{user.name}</h2>
              <p className="text-blue-100">ID: {user.id}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-200 transition-colors p-2 rounded-full hover:bg-white/10"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-8 space-y-8">
          {/* Basic Information */}
          <section>
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <User className="h-6 w-6 mr-2 text-blue-600" />
              Basic Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 p-6 rounded-lg">
              <div>
                <label className="text-sm font-semibold text-gray-600">Full Name</label>
                <p className="text-base text-gray-900 mt-1">{user.name}</p>
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-600">Gender</label>
                <p className="text-base text-gray-900 mt-1">{user.gender}</p>
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-600">Age</label>
                <p className="text-base text-gray-900 mt-1">{user.age || 'Not set'}</p>
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-600">Date of Birth</label>
                <p className="text-base text-gray-900 mt-1">{formatDate(user.rawUser?.date_of_birth)}</p>
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-600">Marital Status</label>
                <p className="text-base text-gray-900 mt-1">{profile.marital_status || 'Not set'}</p>
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-600">Religion</label>
                <p className="text-base text-gray-900 mt-1">{profile.religion || 'Not set'}</p>
              </div>
            </div>
          </section>

          {/* Contact Information */}
          <section>
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <Mail className="h-6 w-6 mr-2 text-blue-600" />
              Contact Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 p-6 rounded-lg">
              <div className="flex items-start space-x-3">
                <Phone className="h-5 w-5 text-gray-600 mt-1" />
                <div>
                  <label className="text-sm font-semibold text-gray-600">Mobile Number</label>
                  <p className="text-base text-gray-900 mt-1">{user.mobile}</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Mail className="h-5 w-5 text-gray-600 mt-1" />
                <div>
                  <label className="text-sm font-semibold text-gray-600">Email Address</label>
                  <p className="text-base text-gray-900 mt-1">{user.email}</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-gray-600 mt-1" />
                <div>
                  <label className="text-sm font-semibold text-gray-600">Address</label>
                  <p className="text-base text-gray-900 mt-1">{profile.address || 'Not provided'}</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-gray-600 mt-1" />
                <div>
                  <label className="text-sm font-semibold text-gray-600">City</label>
                  <p className="text-base text-gray-900 mt-1">{profile.city || 'Not set'}</p>
                </div>
              </div>
            </div>
          </section>

          {/* Professional Information */}
          <section>
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <Briefcase className="h-6 w-6 mr-2 text-blue-600" />
              Professional Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 p-6 rounded-lg">
              <div>
                <label className="text-sm font-semibold text-gray-600">Education Level</label>
                <p className="text-base text-gray-900 mt-1">{profile.education_level || 'Not set'}</p>
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-600">Occupation</label>
                <p className="text-base text-gray-900 mt-1">{profile.occupation || 'Not set'}</p>
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-600">Income Range</label>
                <p className="text-base text-gray-900 mt-1">{profile.income_range || 'Not set'}</p>
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-600">Working Location</label>
                <p className="text-base text-gray-900 mt-1">{profile.working_location || 'Not set'}</p>
              </div>
            </div>
          </section>

          {/* Physical Attributes */}
          <section>
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <User className="h-6 w-6 mr-2 text-blue-600" />
              Physical Attributes
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-gray-50 p-6 rounded-lg">
              <div>
                <label className="text-sm font-semibold text-gray-600">Height</label>
                <p className="text-base text-gray-900 mt-1">{profile.height || 'Not set'}</p>
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-600">Weight</label>
                <p className="text-base text-gray-900 mt-1">{profile.weight || 'Not set'}</p>
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-600">Complexion</label>
                <p className="text-base text-gray-900 mt-1">{profile.complexion || 'Not set'}</p>
              </div>
            </div>
          </section>

          {/* Family Information */}
          <section>
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <Home className="h-6 w-6 mr-2 text-blue-600" />
              Family Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 p-6 rounded-lg">
              <div>
                <label className="text-sm font-semibold text-gray-600">Father's Name</label>
                <p className="text-base text-gray-900 mt-1">{profile.father_name || 'Not set'}</p>
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-600">Mother's Name</label>
                <p className="text-base text-gray-900 mt-1">{profile.mother_name || 'Not set'}</p>
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-600">Father's Occupation</label>
                <p className="text-base text-gray-900 mt-1">{profile.father_occupation || 'Not set'}</p>
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-600">Number of Siblings</label>
                <p className="text-base text-gray-900 mt-1">{profile.siblings || 'Not set'}</p>
              </div>
            </div>
          </section>

          {/* Partner Preferences */}
          <section>
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <Heart className="h-6 w-6 mr-2 text-blue-600" />
              Partner Preferences
            </h3>
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-semibold text-gray-600">Preferred Age Range</label>
                  <p className="text-base text-gray-900 mt-1">
                    {profile.partner_age_min && profile.partner_age_max
                      ? `${profile.partner_age_min} - ${profile.partner_age_max} years`
                      : 'Not set'}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-600">Preferred Height</label>
                  <p className="text-base text-gray-900 mt-1">{profile.partner_height || 'Not set'}</p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-600">Preferred Religion</label>
                  <p className="text-base text-gray-900 mt-1">{profile.partner_religion || 'Not set'}</p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-600">Preferred Education</label>
                  <p className="text-base text-gray-900 mt-1">{profile.partner_education || 'Not set'}</p>
                </div>
              </div>
              {profile.partner_expectations && (
                <div className="mt-4">
                  <label className="text-sm font-semibold text-gray-600">Additional Expectations</label>
                  <p className="text-base text-gray-900 mt-2 leading-relaxed">
                    {profile.partner_expectations}
                  </p>
                </div>
              )}
            </div>
          </section>

          {/* Account & Plan Information */}
          <section>
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <DollarSign className="h-6 w-6 mr-2 text-blue-600" />
              Account & Plan Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 p-6 rounded-lg">
              <div>
                <label className="text-sm font-semibold text-gray-600">Account Type</label>
                <p className="text-base text-gray-900 mt-1">{user.type}</p>
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-600">Account Status</label>
                <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full mt-1 ${
                  user.status === 'Active' ? 'bg-green-100 text-green-800' :
                  user.status === 'Suspended' ? 'bg-red-100 text-red-800' :
                  user.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {user.status}
                </span>
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-600">Registration Date</label>
                <p className="text-base text-gray-900 mt-1">{user.regDate}</p>
              </div>
              {user.planExpiresAt && (
                <div>
                  <label className="text-sm font-semibold text-gray-600">Plan Expires At</label>
                  <p className="text-base text-gray-900 mt-1">{formatDate(user.planExpiresAt)}</p>
                </div>
              )}
              <div>
                <label className="text-sm font-semibold text-gray-600">Profile Completeness</label>
                <div className="mt-2">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-base text-gray-900">{profile.completeness || 0}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${profile.completeness || 0}%` }}
                    ></div>
                  </div>
                </div>
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-600">Activity Stats</label>
                <p className="text-base text-gray-900 mt-1">
                  Sent: {user.rawUser?.profile_stats?.proposals_sent || 0} / 
                  Received: {user.rawUser?.profile_stats?.proposals_received || 0}
                </p>
              </div>
            </div>
          </section>

          {/* Verification Status */}
          <section>
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <Shield className="h-6 w-6 mr-2 text-blue-600" />
              Verification Status
            </h3>
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <StatusBadge 
                  status={user.rawUser?.is_verified} 
                  label="OTP Verified" 
                />
                <StatusBadge 
                  status={user.rawUser?.email} 
                  label="Email Verified" 
                />
                <StatusBadge 
                  status={user.rawUser?.phone_number} 
                  label="Mobile Verified" 
                />
                <StatusBadge 
                  status={false} 
                  label="KYC Verified" 
                />
                <StatusBadge 
                  status={false} 
                  label="Admin Verified" 
                />
                <StatusBadge 
                  status={user.isActive} 
                  label="Profile Active" 
                />
              </div>
            </div>
          </section>

          {/* Bio/About */}
          {profile.bio && (
            <section>
              <h3 className="text-xl font-bold text-gray-900 mb-4">About Me</h3>
              <div className="bg-gray-50 p-6 rounded-lg">
                <p className="text-base text-gray-900 leading-relaxed">{profile.bio}</p>
              </div>
            </section>
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

export default UserView;
