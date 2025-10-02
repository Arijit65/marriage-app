import React, { useState, useRef } from "react";
import { useAuth } from "../context";
// import any icons/components from your UI library if desired

const selectors = {
  memberGender:        ["Male", "Female"],
  maritalStatus:       ["Never Married", "Divorced", "Widowed"],

  states:              ["Select State", "Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh","Goa","Gujarat","Haryana","Himachal Pradesh","Jharkhand","Karnataka","Kerala","Madhya Pradesh","Maharashtra","Manipur","Meghalaya","Mizoram","Nagaland","Odisha","Punjab","Rajasthan","Sikkim","Tamil Nadu","Telangana","Tripura","Uttar Pradesh","Uttarakhand","West Bengal"],
  religions:           ["Hindu", "Muslim", "Christian", "Buddhism", "Other"],

  motherTongues:       ["Bengali", "Hindi", "Tamil", "Telugu", "Punjabi", "Other"],
  professions:         ["Service", "Business", "Agriculture", "Home Based Earning", "Profession (Non Service)", "Homely", "Other"],
  qualificationLevels: ["Higher Secondary", "Under Graduate", "Graduate", "Master Degree", "Diploma", "Ph.D"],
  qualificationCategories: ["General", "OBC", "SC", "ST", "Other"],
  relations:           ["Father", "Mother", "Sibling", "Self", "Friend", "Other"],
};

// Religion-specific communities and castes
const religionData = {
  Hindu: {
    communities: ["Assamese", "Aurnachali", "Awadhi", "Bengali", "Gujarati", "Hindi", "Kannada", "Malayalam", "Marathi", "Odia", "Punjabi", "Tamil", "Telugu", "Other"],
    castes: ["96K Kokanastha", "Adi Andhra", "Adi Dravida", "Agarwal", "Ahir", "Arora", "Bania", "Brahmin", "Chamar", "Choudhary", "Gujjar", "Jat", "Kayastha", "Khatri", "Koli", "Kurmi", "Lohar", "Maheshwari", "Maratha", "Nair", "Patel", "Rajput", "Reddy", "Sharma", "Sindhi", "Teli", "Vishwakarma", "Yadav", "Other"]
  },
  Muslim: {
    communities: ["Bengali", "Bengali Muslim", "Gujrati(Muslim)", "Gulf Muslims", "Hindi", "Kashmiri", "Malayalam", "Marathi", "Punjabi", "Tamil", "Telugu", "Urdu", "Other"],
    castes: ["Ansari", "Any Caste", "Arain", "Awan", "Bohra", "Khoja", "Memon", "Pathan", "Qureshi", "Sayyid", "Sheikh", "Siddiqui", "Syed", "Other"]
  },
  Christian: {
    communities: ["Assamese", "Bengali", "Gujarati", "Hindi", "Kannada", "Malayalam", "Marathi", "Punjabi", "Tamil", "Telugu", "Other"],
    castes: ["Born Again", "Bretheren", "Church of South India", "CMS", "Catholic", "Evangelical", "Methodist", "Orthodox", "Pentecostal", "Protestant", "Syrian Christian", "Other"]
  },
  Buddhism: {
    communities: ["Assamiya", "Bengali", "Mahayana", "Vajrayana", "Hindi", "Tibetan", "Other"],
    castes: ["Mahayana", "Others", "Vajrayana", "Theravada", "Zen", "Other"]
  },
  Other: {
    communities: ["Assamese", "Bengali", "Gujarati", "Hindi", "Kannada", "Malayalam", "Marathi", "Punjabi", "Tamil", "Telugu", "Other"],
    castes: ["Any Caste", "Other"]
  }
};

// Profession-specific details
const professionDetails = {
  Service: [
    "Do Not Want To Disclose",
    "Government Employee",
    "Private Employee",
    "Bank Employee",
    "Teacher",
    "Nurse",
    "Police",
    "Army",
    "Other"
  ],
  Business: [
    "Do Not Want To Disclose",
    "Broker",
    "Director-Pvt Ltd",
    "Large Business",
    "Medium Business",
    "Proprietary",
    "Shop",
    "Small Business",
    "Other"
  ],
  Agriculture: [
    "Do Not Want To Disclose",
    "Average Income",
    "Good Income",
    "Large Land (More Than 10 Acre)",
    "Medium Income",
    "Medium Land (3-10 Acre)",
    "Small Land (Less Than 3 Acre)",
    "Some Profession",
    "Other"
  ],
  "Home Based Earning": [
    "Do Not Want To Disclose",
    "Between 3-10 Lacs P.A.",
    "Less Than 3 Lacs P.A.",
    "More Than 10 Lacs P.A.",
    "Some Profession",
    "Tution",
    "Work From Home",
    "Other"
  ],
  "Profession (Non Service)": [
    "Do Not Want To Disclose",
    "Architect",
    "Broker",
    "Caterer",
    "Coaching",
    "Consultant",
    "Designer",
    "Developer",
    "Doctor",
    "Engineer",
    "Event Manager",
    "Hardware Engineer",
    "Health/Beauty Care",
    "Journalist",
    "Lawyer",
    "Lecturer",
    "Nurse",
    "Para Medical",
    "Other"
  ],
  Homely: [
    "Do Not Want To Disclose",
    "Expert In Co-Curricular Activity",
    "Expert In Household Work",
    "Looking For Job",
    "Other"
  ],
  Other: [
    "Do Not Want To Disclose",
    "Other"
  ]
};

// Three-level qualification data structure
const qualificationData = {
  "Higher Secondary": {
    categories: ["Arts", "Commerce", "Science", "Other"],
    degrees: {
      "Arts": ["Arts", "Other"],
      "Commerce": ["Commerce", "Other"],
      "Science": ["Science", "Other"],
      "Other": ["Other"]
    }
  },
  "Under Graduate": {
    categories: ["Arts-Science-Commerce", "Engineer", "Legal", "Management", "Medical", "Other"],
    degrees: {
      "Arts-Science-Commerce": ["B.A", "B.Sc", "B.Com", "BBA", "BCA", "Other"],
      "Engineer": ["B.Tech", "B.E", "B.Arch", "Other"],
      "Legal": ["LLB", "B.L", "Other"],
      "Management": ["BBA", "BMS", "Other"],
      "Medical": ["MBBS", "BDS", "B.Pharm", "BPT", "Other"],
      "Other": ["Other"]
    }
  },
  "Graduate": {
    categories: ["Financial", "Arts-Science-Commerce", "Engineer", "Legal", "Management", "Medical", "Other"],
    degrees: {
      "Financial": ["CA", "CS", "ICWA", "Other"],
      "Arts-Science-Commerce": ["B.A", "B.Sc", "B.Com", "BBA", "BCA", "Other"],
      "Engineer": ["B.Tech", "B.E", "B.Arch", "Other"],
      "Legal": ["LLB", "B.L", "Other"],
      "Management": ["BBA", "BMS", "Other"],
      "Medical": ["MBBS", "BDS", "B.Pharm", "BPT", "Other"],
      "Other": ["Other"]
    }
  },
  "Master Degree": {
    categories: ["Arts-Science-Commerce", "Engineer", "Legal", "Management", "Medical", "Other"],
    degrees: {
      "Arts-Science-Commerce": ["M.A", "M.Sc", "M.Com", "MBA", "MCA", "Other"],
      "Engineer": ["M.Tech", "M.E", "M.Sc(IT)", "MS(Engg)", "Other"],
      "Legal": ["LLM", "ML", "Other"],
      "Management": ["MBA", "PGDM", "Other"],
      "Medical": ["MD", "MS", "MDS", "Other"],
      "Other": ["Other"]
    }
  },
  "Diploma": {
    categories: ["Engineer", "Legal", "Medical", "Management", "Other"],
    degrees: {
      "Engineer": ["Diploma in Engineering", "PGDCA", "Other"],
      "Legal": ["Diploma in Law", "Other"],
      "Medical": ["Diploma in Medical", "Other"],
      "Management": ["Diploma in Management", "Other"],
      "Other": ["Other"]
    }
  },
  "Ph.D": {
    categories: ["Arts", "Commerce", "Engineer", "Legal", "Management", "Medical", "Other"],
    degrees: {
      "Arts": ["Ph.D in Arts", "Other"],
      "Commerce": ["Ph.D in Commerce", "Other"],
      "Engineer": ["Ph.D in Engineering", "Other"],
      "Legal": ["Ph.D in Law", "Other"],
      "Management": ["Ph.D in Management", "Other"],
      "Medical": ["Ph.D in Medical", "Other"],
      "Other": ["Other"]
    }
  }
};

const FormField = ({ label, children, className = "" }) => (
  <div className={`mb-6 ${className}`}>
    {label && <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>}
    {children}
  </div>
);

export default function PostAdForm({ referCode }) {
  const { loading, error, clearErrors } = useAuth();
  const [_otpSent, setOtpSent] = useState(false);
  const [agree, setAgree] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const hiddenFileInputRef = useRef(null);
  const [formData, setFormData] = useState({
    name: '',
    gender: '',
    phone: '',
    
    maritalStatus: '',
    dateOfBirth: '',
    state: '',
    religion: '',
    community: '',
    caste: '',
    motherTongue: '',
    profession: '',
    professionDetail: '',
    highestQualification: '',
    qualificationCategory: '',
    qualificationDegree: '',
    advertiserName: '',
    relationWithCandidate: '',
    otp: '',
    alternatePhone: '',
    photosFiles: []
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // If religion changes, reset community and caste
    if (name === 'religion') {
      setFormData(prev => ({
        ...prev,
        [name]: value,
        community: '',
        caste: ''
      }));
    } 
    // If profession changes, reset profession detail
    else if (name === 'profession') {
      setFormData(prev => ({
        ...prev,
        [name]: value,
        professionDetail: ''
      }));
    }
    // If qualification level changes, reset category and degree
    else if (name === 'highestQualification') {
      setFormData(prev => ({
        ...prev,
        [name]: value,
        qualificationCategory: '',
        qualificationDegree: ''
      }));
    }
    // If qualification category changes, reset degree
    else if (name === 'qualificationCategory') {
      setFormData(prev => ({
        ...prev,
        [name]: value,
        qualificationDegree: ''
      }));
    }
    else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    
    // Clear errors when user starts typing
    if (error) {
      clearErrors();
    }
  };

  const handleSendOTP = async () => {
    if (!formData.phone) {
      alert('Please enter a mobile number first');
      return;
    }
    
    setSubmitting(true);
    
    try {
      // Call the send OTP API first
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const response = await fetch(`${API_URL}/auth/send-registration-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phone: formData.phone
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (result.success) {
        setOtpSent(true);
        if (result.data.fallback && result.data.fallbackOTP) {
          alert(`OTP sent successfully!\n\nFallback OTP: ${result.data.fallbackOTP}\n\n(Note: SMS service failed, using fallback OTP)`);
        } else {
          alert('OTP sent successfully! Please check your phone for the verification code.');
        }
      } else {
        alert(result.error || 'Failed to send OTP');
      }
    } catch (error) {
      console.error('Error sending OTP:', error);
      if (error.message.includes('404')) {
        alert('Server not found. Please make sure the server is running on http://localhost:5000');
      } else if (error.message.includes('Failed to execute \'json\'')) {
        alert('Server returned invalid response. Please check if the server is running properly.');
      } else {
        alert(`An error occurred while sending OTP: ${error.message}`);
      }
    } finally {
      setSubmitting(false);
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!agree) {
      alert('Please agree to the terms and conditions');
      return;
    }

    // Check if OTP is sent
    if (!_otpSent) {
      alert('Please send OTP first');
      return;
    }

    if (!formData.otp) {
      alert('Please enter the OTP sent to your phone');
      return;
    }

    setSubmitting(true);
    
    try {
      // Prepare multipart form data for fields + photos
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const form = new FormData();
      const payload = {
        name: formData.name,
        phone: formData.phone,
        gender: formData.gender,
        dateOfBirth: formData.dateOfBirth,
        maritalStatus: formData.maritalStatus,
        state: formData.state,
        religion: formData.religion,
        community: formData.community,
        caste: formData.caste,
        motherTongue: formData.motherTongue,
        profession: formData.profession,
        professionDetail: formData.professionDetail,
        highestQualification: formData.highestQualification,
        qualificationCategory: formData.qualificationCategory,
        qualificationDegree: formData.qualificationDegree,
        advertiserName: formData.advertiserName,
        relationWithCandidate: formData.relationWithCandidate,
        otp: formData.otp,
        ...(referCode && { referCode: referCode })
      };
      Object.entries(payload).forEach(([k, v]) => form.append(k, v ?? ''));
      (formData.photosFiles || []).forEach(file => form.append('photos', file));

      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        body: form
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (result.success) {
        setShowSuccess(true);
        alert('Registration completed successfully!\n\nYour account has been created and activated.');
        
        // Store the token and user data
        if (result.data.token) {
          localStorage.setItem('token', result.data.token);
          localStorage.setItem('user', JSON.stringify(result.data.user));
        }
        
        // Reset form
        setFormData({
          name: '',
          gender: '',
          phone: '',
          maritalStatus: '',
          dateOfBirth: '',
          state: '',
          religion: '',
          community: '',
          caste: '',
          motherTongue: '',
          profession: '',
          professionDetail: '',
          highestQualification: '',
          qualificationCategory: '',
          qualificationDegree: '',
          advertiserName: '',
          relationWithCandidate: '',
          otp: '',
          alternatePhone: '',
          photosFiles: []
        });
        setOtpSent(false);
        
        // Redirect to post registration message page
        setTimeout(() => {
          window.location.href = `/post-reg/${result.data.user.id}`;
        }, 2000);
        
      } else {
        alert(result.error || 'Registration failed');
      }
      
    } catch (error) {
      console.error('Error during registration:', error);
      if (error.message.includes('404')) {
        alert('Server not found. Please make sure the server is running on http://localhost:5000');
      } else if (error.message.includes('Failed to execute \'json\'')) {
        alert('Server returned invalid response. Please check if the server is running properly.');
      } else {
        alert(`An error occurred during registration: ${error.message}`);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="min-h-screen w-full bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Form Area */}
          <div className="flex-1 bg-white rounded-2xl shadow-xl border border-red-100 p-8">
            <h2 className="text-3xl mb-6 font-bold text-center tracking-wide text-red-500">
              POST YOUR ADVERTISEMENT
            </h2>

            {/* Try it for FREE row */}
            <div className="font-semibold text-gray-900 mb-6 text-center">Try it for FREE <span className="text-red-500">*</span></div>
            
            {/* Registration Info */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <p className="text-blue-700 text-sm text-center">
                <strong>Registration Process:</strong> Fill in your details, send OTP to your phone, verify the OTP to complete registration. Your password will be auto-generated.
              </p>
            </div>

            {/* Error Display */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            {/* Success Display */}
            {showSuccess && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                <p className="text-green-600 text-sm">Registration Completed Successfully!</p>
                <p className="text-green-600 text-sm mt-2">Your account has been created and activated. Redirecting to dashboard...</p>
              </div>
            )}

            <form autoComplete="off" className="space-y-6" onSubmit={handleSubmit}>
              {/* First Row - Gender and Mobile */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField label="MEMBER GENDER *">
                  <select 
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-red-300 focus:border-red-300 outline-none transition-colors"
                    required
                  >
                    <option value="">Select Gender</option>
                    {selectors.memberGender.map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </FormField>
                
                <FormField label="Mobile *">
                  <div className="flex">
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="Enter mobile number"
                      className="flex-1 border border-gray-300 rounded-l-lg px-4 py-3 focus:ring-2 focus:ring-red-300 focus:border-red-300 outline-none transition-colors"
                      required
                    />
                    <button
                      type="button"
                      className="bg-red-500 text-white px-6 font-semibold rounded-r-lg hover:bg-red-600 transition-colors whitespace-nowrap disabled:opacity-50"
                      onClick={handleSendOTP}
                      disabled={submitting || !formData.phone}
                    >
                      {submitting ? 'Sending...' : 'Send OTP'}
                    </button>
                  </div>
                </FormField>
              </div>

              {/* Second Row - OTP and Alternate Mobile */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField label="OTP">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      name="otp"
                      value={formData.otp}
                      onChange={handleInputChange}
                      placeholder="Enter OTP"
                      className="flex-1 border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-red-300 focus:border-red-300 outline-none transition-colors"
                    />
                  </div>
                </FormField>
                
                <FormField label="Mobile (Alternate)">
                  <input
                    type="tel"
                    name="alternatePhone"
                    value={formData.alternatePhone}
                    onChange={handleInputChange}
                    placeholder="Alternate mobile number"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-red-300 focus:border-red-300 outline-none transition-colors"
                  />
                </FormField>
              </div>


              {/* Third Row - Marital Status and Date of Birth */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField label="MARITAL STATUS *">
                  <select 
                    name="maritalStatus"
                    value={formData.maritalStatus}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-red-300 focus:border-red-300 outline-none transition-colors"
                    required
                  >
                    <option value="">Select Marital Status</option>
                    {selectors.maritalStatus.map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </FormField>
                
                <FormField label="Date of Birth *">
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-red-300 focus:border-red-300 outline-none transition-colors"
                    required
                  />
                </FormField>
              </div>

              {/* Fourth Row - State and Religion */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField label="State">
                  <select 
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-red-300 focus:border-red-300 outline-none transition-colors"
                  >
                    {selectors.states.map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </FormField>
                
                <FormField label="Religion">
                  <select 
                    name="religion"
                    value={formData.religion}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-red-300 focus:border-red-300 outline-none transition-colors"
                  >
                    <option value="">Select Religion</option>
                    {selectors.religions.map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </FormField>
              </div>

              {/* Fifth Row - Community and Caste (Conditional based on Religion) */}
              {formData.religion && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField label="YOUR COMMUNITY *">
                    <select 
                      name="community"
                      value={formData.community}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-red-300 focus:border-red-300 outline-none transition-colors"
                      required
                    >
                      <option value="">Your Community *</option>
                      {religionData[formData.religion]?.communities.map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </FormField>
                  
                  <FormField label="YOUR CASTE *">
                    <select 
                      name="caste"
                      value={formData.caste}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-red-300 focus:border-red-300 outline-none transition-colors"
                      required
                    >
                      <option value="">Your Caste *</option>
                      {religionData[formData.religion]?.castes.map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </FormField>
                </div>
              )}

              {/* Sixth Row - Mother Tongue and Profession */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField label="Mother Tongue">
                  <select 
                    name="motherTongue"
                    value={formData.motherTongue}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-red-300 focus:border-red-300 outline-none transition-colors"
                  >
                    <option value="">Select Mother Tongue</option>
                    {selectors.motherTongues.map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </FormField>
                
                <FormField label="MEMBER PROFESSION *">
                  <select 
                    name="profession"
                    value={formData.profession}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-red-300 focus:border-red-300 outline-none transition-colors"
                    required
                  >
                    <option value="">Select Profession</option>
                    {selectors.professions.map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </FormField>
              </div>

              {/* Profession Detail Row - Conditional based on Profession */}
              {formData.profession && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField label={`${formData.profession.toUpperCase()} DETAIL`}>
                    <select 
                      name="professionDetail"
                      value={formData.professionDetail}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-red-300 focus:border-red-300 outline-none transition-colors"
                    >
                      <option value="">Select Detail</option>
                      {professionDetails[formData.profession]?.map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </FormField>
                  
                  <div></div> {/* Empty div to maintain grid layout */}
                </div>
              )}

              {/* Seventh Row - Qualification Level and Category */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField label="QUALIFICATION LEVEL">
                  <select 
                    name="highestQualification"
                    value={formData.highestQualification}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-red-300 focus:border-red-300 outline-none transition-colors"
                  >
                    <option value="">Select Qualification Level</option>
                    {selectors.qualificationLevels.map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </FormField>
                
                <FormField label="YOUR QUALIFICATION CATEGORY">
                  <select 
                    name="qualificationCategory"
                    value={formData.qualificationCategory}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-red-300 focus:border-red-300 outline-none transition-colors"
                    disabled={!formData.highestQualification}
                  >
                    <option value="">Your Qualification Category</option>
                    {formData.highestQualification && qualificationData[formData.highestQualification]?.categories.map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </FormField>
              </div>

              {/* Eighth Row - Qualification Degree and Advertiser Name */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField label="YOUR QUALIFICATION DEGREE">
                  <select 
                    name="qualificationDegree"
                    value={formData.qualificationDegree}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-red-300 focus:border-red-300 outline-none transition-colors"
                    disabled={!formData.qualificationCategory}
                  >
                    <option value="">Your Qualification Degree</option>
                    {formData.highestQualification && formData.qualificationCategory && qualificationData[formData.highestQualification]?.degrees[formData.qualificationCategory]?.map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </FormField>
                
                <FormField label="Name of Advertiser">
                  <input 
                    type="text"
                    name="advertiserName"
                    value={formData.advertiserName}
                    onChange={handleInputChange}
                    placeholder="Enter advertiser name"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-red-300 focus:border-red-300 outline-none transition-colors"
                  />
                </FormField>
              </div>

              {/* Ninth Row - Relation */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField label="RELATION WITH CANDIDATE">
                  <select 
                    name="relationWithCandidate"
                    value={formData.relationWithCandidate}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-red-300 focus:border-red-300 outline-none transition-colors"
                  >
                    <option value="">Select Relation</option>
                    {selectors.relations.map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </FormField>
              </div>

              {/* Tenth Row - Upload Photos with previews and add button */}
              <FormField label="Upload Photos" className="md:col-span-2">
                <div className="flex flex-wrap gap-4">
                  {formData.photosFiles && formData.photosFiles.length > 0 && (
                    formData.photosFiles.map((file, idx) => {
                      const previewUrl = URL.createObjectURL(file);
                      return (
                        <div key={idx} className="relative w-24 h-24 rounded overflow-hidden border border-gray-200">
                          <img src={previewUrl} alt={`preview-${idx}`} className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => {
                              setFormData(prev => {
                                const next = [...(prev.photosFiles || [])];
                                next.splice(idx, 1);
                                return { ...prev, photosFiles: next };
                              });
                            }}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 text-xs flex items-center justify-center shadow"
                            aria-label="Remove image"
                          >
                            ×
                          </button>
                        </div>
                      );
                    })
                  )}

                  <button
                    type="button"
                    className="w-24 h-24 border-2 border-dashed border-gray-300 rounded flex items-center justify-center text-gray-500 hover:border-red-300 hover:text-red-400"
                    onClick={() => hiddenFileInputRef.current?.click()}
                    aria-label="Add image"
                  >
                    +
                  </button>
                </div>
                <input
                  ref={hiddenFileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const files = Array.from(e.target.files || []);
                    if (files.length > 0) {
                      setFormData(prev => ({ ...prev, photosFiles: [...(prev.photosFiles || []), ...files] }));
                    }
                    if (hiddenFileInputRef.current) hiddenFileInputRef.current.value = '';
                  }}
                />
                {formData.photosFiles && formData.photosFiles.length > 0 && (
                  <p className="text-xs text-gray-500 mt-2">Click + to add more. Click × on an image to remove.</p>
                )}
              </FormField>

              {/* reCAPTCHA placeholder */}
              <div className="text-center">
                <div className="bg-gray-100 rounded-lg py-4 flex items-center justify-center text-sm text-gray-500 border border-gray-200">
                  {/* Replace this div with your recaptcha widget */}
                  [reCAPTCHA]
                </div>
              </div>

              {/* OTP, consent */}
              <div className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  id="agree"
                  className="mt-1 accent-red-500"
                  checked={agree}
                  onChange={() => setAgree(a => !a)}
                />
                <label htmlFor="agree" className="text-gray-600 text-sm leading-relaxed">
                  I am allowing MarriagePaper to send me OTP SMS to my mobile and Email Verification link to my email
                </label>
              </div>

              <button
                className="w-full py-4 bg-red-500 hover:bg-red-600 text-white font-bold rounded-lg text-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                type="submit"
                disabled={submitting || !agree || !_otpSent || !formData.otp}
              >
                {submitting ? 'Completing Registration...' : 'Complete Registration'}
              </button>
            </form>
          </div>

          {/* Why MarriagePaper.com Card */}
          <div className="lg:w-96">
            <div className="bg-white border border-red-100 rounded-2xl shadow-xl p-8 sticky top-20">
              <h3 className="text-xl font-bold text-red-600 mb-4">Why MarriagePaper.com ?</h3>
              <p className="text-gray-700 leading-relaxed">
                We are India's First Newspaper-like Matrimonial Ad Service on internet, with a goal to help you find your life partner and protect the environment at the same time. Our services vary similar to newspaper matrimonial advertising, just more powerful due to Internet.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
