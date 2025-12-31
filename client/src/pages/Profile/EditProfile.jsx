import React, { useState, useEffect } from 'react';
import { Camera, Upload, Save, User, Heart, MapPin, Briefcase, GraduationCap, Phone, Mail, Calendar, Users, Home, Star, Menu, X } from 'lucide-react';
import { useAuth } from '../../context';
import { useNavigate } from 'react-router-dom';
import ProfileSidebar from './ProfileSidebar';

// Religion-specific communities and castes (from RegisterForm)
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

// Profession-specific details (from RegisterForm)
const professionDetails = {
    Service: ["Do Not Want To Disclose", "Government Employee", "Private Employee", "Bank Employee", "Teacher", "Nurse", "Police", "Army", "Other"],
    Business: ["Do Not Want To Disclose", "Broker", "Director-Pvt Ltd", "Large Business", "Medium Business", "Proprietary", "Shop", "Small Business", "Other"],
    Agriculture: ["Do Not Want To Disclose", "Average Income", "Good Income", "Large Land (More Than 10 Acre)", "Medium Income", "Medium Land (3-10 Acre)", "Small Land (Less Than 3 Acre)", "Some Profession", "Other"],
    "Home Based Earning": ["Do Not Want To Disclose", "Between 3-10 Lacs P.A.", "Less Than 3 Lacs P.A.", "More Than 10 Lacs P.A.", "Some Profession", "Tution", "Work From Home", "Other"],
    "Profession (Non Service)": ["Do Not Want To Disclose", "Architect", "Broker", "Caterer", "Coaching", "Consultant", "Designer", "Developer", "Doctor", "Engineer", "Event Manager", "Hardware Engineer", "Health/Beauty Care", "Journalist", "Lawyer", "Lecturer", "Nurse", "Para Medical", "Other"],
    Homely: ["Do Not Want To Disclose", "Expert In Co-Curricular Activity", "Expert In Household Work", "Looking For Job", "Other"],
    Other: ["Do Not Want To Disclose", "Other"]
};

// Three-level qualification data structure (from RegisterForm)
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

// Form components defined outside to prevent re-creation on each render
const FormSection = ({ title, icon: Icon, children }) => (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden mb-8">
        <div className="bg-gradient-to-r from-red-600 to-red-700 text-white px-6 py-4">
            <div className="flex items-center gap-3">
                {Icon && (
                    <div className="bg-white/20 p-2 rounded-lg">
                        <Icon className="h-6 w-6" />
                    </div>
                )}
                <h2 className="text-xl font-semibold">{title}</h2>
            </div>
        </div>
        <div className="p-6">
            {children}
        </div>
    </div>
);

const InputField = ({ label, name, type = 'text', required = false, placeholder, options, value, onChange }) => (
    <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
            {label} {required && <span className="text-red-500">*</span>}
        </label>
        {options ? (
            <select
                name={name}
                value={value}
                onChange={onChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white text-gray-700"
                required={required}
            >
                <option value="">Select {label}</option>
                {options.map((option) => (
                    <option key={option} value={option}>{option}</option>
                ))}
            </select>
        ) : (
            <input
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                required={required}
            />
        )}
    </div>
);

const TextAreaField = ({ label, name, required = false, rows = 4, value, onChange }) => (
    <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
            {label} {required && <span className="text-red-500">*</span>}
        </label>
        <textarea
            name={name}
            value={value}
            onChange={onChange}
            rows={rows}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
            required={required}
        />
    </div>
);

const EditProfile = () => {
    const { user, isAuthenticated, loading } = useAuth();
    const navigate = useNavigate();
    const [open, setOpen] = useState(true);
    const [formData, setFormData] = useState({
        // Personal Details (from registration)
        name: '',
        gender: '',
        dateOfBirth: '',
        maritalStatus: '',
        religion: '',
        community: '',
        caste: '',
        motherTongue: '',
        
        // Registration specific fields
        profession: '',
        professionDetail: '',
        highestQualification: '',
        qualificationCategory: '',
        qualificationDegree: '',
        advertiserName: '',
        relationWithCandidate: '',
        
        // Contact Details
        mobileNumber: '',
        alternateNumber: '',
        email: '',
        
        // Location Details
        state: '',
        country: 'India',
        city: '',
        
        // Additional fields
        age: '',
        subCaste: '',
        gothram: '',
        star: '',
        raasi: '',
        profileFor: 'Self',
        
        // Physical Details
        height: '',
        weight: '',
        bodyType: '',
        complexion: '',
        physicalStatus: '',
        bloodGroup: '',
        
        // Location Details Extended
        residencyStatus: '',
        
        // Education & Career
        education: '',
        educationDetail: '',
        occupation: '',
        occupationDetail: '',
        annualIncome: '',
        workingWith: '',
        workingAs: '',
        
        // Family Details
        familyType: '',
        familyStatus: '',
        familyValues: '',
        fatherOccupation: '',
        motherOccupation: '',
        noOfBrothers: '',
        noOfSisters: '',
        
        // Lifestyle
        diet: '',
        smoke: '',
        drink: '',
        
        // About & Partner Preference
        aboutYourself: '',
        partnerAge: '',
        partnerHeight: '',
        partnerMaritalStatus: '',
        partnerReligion: '',
        partnerCaste: '',
        partnerEducation: '',
        partnerOccupation: '',
        partnerIncome: '',
        partnerLocation: '',
        aboutPartner: '',
        timeToCall: '',
        
        // Hobbies & Interests
        hobbies: '',
        interests: '',
        music: '',
        books: '',
        movies: '',
        sports: '',
        cuisines: '',
        dressStyle: ''
    });

    const [profileImages, setProfileImages] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Redirect if not authenticated
    useEffect(() => {
        if (!loading && !isAuthenticated) {
            navigate('/');
        }
    }, [loading, isAuthenticated, navigate]);

    // Prevent scroll restoration
    useEffect(() => {
        if ('scrollRestoration' in window.history) {
            window.history.scrollRestoration = 'manual';
        }
        return () => {
            if ('scrollRestoration' in window.history) {
                window.history.scrollRestoration = 'auto';
            }
        };
    }, []);

    // Populate form with existing user data
    useEffect(() => {
        if (user && user.userProfile) {
            const profile = user.userProfile;
            const registrationInfo = profile.registration_info || {};
            
            setFormData(prev => ({
                ...prev,
                // Personal Details
                name: user.name || '',
                gender: user.gender || '',
                dateOfBirth: user.date_of_birth ? user.date_of_birth.split('T')[0] : '',
                maritalStatus: profile.personal_info?.marital_status || '',
                religion: profile.religious_info?.religion || '',
                community: profile.religious_info?.community || '',
                caste: profile.religious_info?.caste || '',
                motherTongue: profile.additional_info?.native_language || '',
                gothram: profile.religious_info?.gothra || '',

                // Registration specific fields
                profession: registrationInfo.profession || '',
                professionDetail: registrationInfo.profession_detail || '',
                highestQualification: registrationInfo.qualification_level || '',
                qualificationCategory: registrationInfo.qualification_category || '',
                qualificationDegree: registrationInfo.qualification_degree || '',
                advertiserName: registrationInfo.advertiser_name || '',
                relationWithCandidate: registrationInfo.relation_with_candidate || '',

                // Physical Details
                height: profile.personal_info?.height || '',
                weight: profile.personal_info?.weight || '',
                bodyType: profile.personal_info?.body_type || '',
                complexion: profile.personal_info?.complexion || '',

                // Location Details
                country: profile.location_info?.country || 'India',
                state: profile.location_info?.state || '',
                city: profile.location_info?.city || '',

                // Education & Career
                education: profile.education_career_info?.education || '',
                occupation: profile.education_career_info?.occupation || '',
                annualIncome: profile.education_career_info?.annual_income || '',

                // Family Details
                familyType: profile.family_info?.type || '',
                familyStatus: profile.family_info?.status || '',
                fatherOccupation: profile.family_info?.father_occupation || '',
                motherOccupation: profile.family_info?.mother_occupation || '',

                // Lifestyle
                diet: profile.lifestyle_info?.diet || '',
                smoke: profile.lifestyle_info?.smoking || '',
                drink: profile.lifestyle_info?.drinking || '',

                // About & Contact
                aboutYourself: profile.about_me || '',
                mobileNumber: user.phone_number || '',
                alternateNumber: user.alternate_phone || '',
                email: user.email || '',

                // Hobbies & Interests
                hobbies: Array.isArray(profile.hobbies) ? profile.hobbies.join(', ') : '',
                interests: Array.isArray(profile.interests) ? profile.interests.join(', ') : ''
            }));

            // Load existing photos
            if (profile.photos && Array.isArray(profile.photos)) {
                const baseUrl = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';
                const photoUrls = profile.photos.map(photo => `${baseUrl}${photo}`);
                setProfileImages(photoUrls);
            }
        }
    }, [user]);

    // Dropdown options (from RegisterForm)
    const dropdownOptions = {
        profileFor: ['Self', 'Son', 'Daughter', 'Brother', 'Sister', 'Friend', 'Relative'],
        gender: ['Male', 'Female'],
        maritalStatus: ['Never Married', 'Divorced', 'Widowed'],
        religion: ['Hindu', 'Muslim', 'Christian', 'Buddhism', 'Other'],
        motherTongue: ['Bengali', 'Hindi', 'Tamil', 'Telugu', 'Punjabi', 'Other'],
        professions: ['Service', 'Business', 'Agriculture', 'Home Based Earning', 'Profession (Non Service)', 'Homely', 'Other'],
        qualificationLevels: ['Higher Secondary', 'Under Graduate', 'Graduate', 'Master Degree', 'Diploma', 'Ph.D'],
        relations: ['Father', 'Mother', 'Sibling', 'Self', 'Friend', 'Other'],
        states: ["Select State", "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal"],
        bodyType: ['Slim', 'Average', 'Athletic', 'Heavy'],
        complexion: ['Very Fair', 'Fair', 'Wheatish', 'Wheatish Brown', 'Dark'],
        physicalStatus: ['Normal', 'Physically Challenged'],
        bloodGroup: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
        education: ['High School', 'Diploma', 'Bachelor', 'Master', 'Doctorate', 'Other'],
        occupation: ['Software Engineer', 'Doctor', 'Teacher', 'Business', 'Government Job', 'Private Job', 'Self Employed', 'Other'],
        annualIncome: ['Below 1 Lakh', '1-2 Lakh', '2-5 Lakh', '5-10 Lakh', '10-20 Lakh', '20+ Lakh'],
        workingWith: ['Private Company', 'Government', 'Business/Self Employed', 'Not Working'],
        familyType: ['Joint Family', 'Nuclear Family'],
        familyStatus: ['Middle Class', 'Upper Middle Class', 'Rich', 'Affluent'],
        familyValues: ['Traditional', 'Moderate', 'Liberal'],
        diet: ['Vegetarian', 'Non-Vegetarian', 'Occasionally Non-Vegetarian', 'Jain', 'Vegan'],
        smoke: ['No', 'Occasionally', 'Yes'],
        drink: ['No', 'Occasionally', 'Yes'],
        residencyStatus: ['Citizen', 'Permanent Resident', 'Temporary Visa', 'Work Permit']
    };

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
    };

    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);
        files.forEach(file => {
            const reader = new FileReader();
            reader.onload = (e) => {
                setProfileImages(prev => [...prev, e.target.result]);
            };
            reader.readAsDataURL(file);
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        try {
            // API call to save profile data
            console.log('Profile Data:', formData);
            console.log('Profile Images:', profileImages);
            
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            alert('Profile updated successfully!');
        } catch (error) {
            console.error('Error updating profile:', error);
            alert('Failed to update profile. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Top Nav */}
            <header className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-slate-200">
                <div className="mx-auto max-w-7xl px-4 lg:px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <button type="button" onClick={() => setOpen(!open)} className="lg:hidden p-2 rounded hover:bg-slate-100">
                            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                        </button>
                        <img
                            src="/src/assets/logo.png"
                            alt="MarriagePaper"
                            className="h-10"
                        />
                        <nav className="hidden md:flex items-center gap-6 text-sm text-slate-600">
                            <a href="/" className="hover:text-rose-600">Home</a>
                            <a href="/about" className="hover:text-rose-600">About Us</a>
                            <a href="/benefit" className="hover:text-rose-600">Our Services</a>
                            <a href="/profiles" className="hover:text-rose-600">Find Match</a>
                            <a href="/plans" className="hover:text-rose-600">Plans</a>
                        </nav>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-slate-600">
                        <span className="hidden sm:block">My MarriagePaper ({user?.id || 'User'})</span>
                        <div className="w-9 h-9 rounded-full bg-rose-100 grid place-items-center text-rose-600">
                            <User className="h-5 w-5" />
                        </div>
                    </div>
                </div>
            </header>

            <div className="mx-auto max-w-7xl px-4 lg:px-6 py-4 grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6">
                {/* Sidebar */}
                <ProfileSidebar open={open} />

                {/* Main Content */}
                <main>
                    {/* Header */}
                    <div className="mb-6">
                        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">Edit My Profile</h1>
                        <p className="text-slate-600">Complete your profile to find your perfect match</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6" autoComplete="off">
                    {/* Photo Upload Section */}
                    <FormSection title="My Gallery" icon={Camera}>
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-6">
                            {profileImages.map((image, index) => (
                                <div key={index} className="relative group">
                                    <img
                                        src={image}
                                        alt={`Profile ${index + 1}`}
                                        className="w-full h-24 object-cover rounded-lg border-2 border-gray-200"
                                    />
                                </div>
                            ))}
                            <label className="w-full h-24 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-red-400 hover:bg-red-50 transition-colors">
                                <div className="text-center">
                                    <Upload className="h-6 w-6 text-gray-400 mx-auto mb-1" />
                                    <span className="text-xs text-gray-500">Upload</span>
                                </div>
                                <input
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    className="hidden"
                                />
                            </label>
                        </div>
                    </FormSection>

                    {/* Personal Details */}
                    <FormSection title="Personal Details" icon={User}>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <InputField label="Name" name="name" placeholder="Enter your full name" value={formData.name} onChange={handleInputChange} />
                            <InputField label="Gender" name="gender" options={dropdownOptions.gender} required value={formData.gender} onChange={handleInputChange} />
                            <InputField label="Date of Birth" name="dateOfBirth" type="date" required value={formData.dateOfBirth} onChange={handleInputChange} />
                            <InputField label="Marital Status" name="maritalStatus" options={dropdownOptions.maritalStatus} required value={formData.maritalStatus} onChange={handleInputChange} />
                            <InputField label="State" name="state" options={dropdownOptions.states.filter(s => s !== "Select State")} value={formData.state} onChange={handleInputChange} />
                            <InputField label="Religion" name="religion" options={dropdownOptions.religion} value={formData.religion} onChange={handleInputChange} />
                            
                            {/* Conditional Community and Caste based on Religion */}
                            {formData.religion && religionData[formData.religion] && (
                                <>
                                    <InputField 
                                        label="Community" 
                                        name="community" 
                                        options={religionData[formData.religion].communities} 
                                        required 
                                        value={formData.community}
                                        onChange={handleInputChange}
                                    />
                                    <InputField 
                                        label="Caste" 
                                        name="caste" 
                                        options={religionData[formData.religion].castes} 
                                        required 
                                        value={formData.caste}
                                        onChange={handleInputChange}
                                    />
                                </>
                            )}
                            
                            <InputField label="Mother Tongue" name="motherTongue" options={dropdownOptions.motherTongue} value={formData.motherTongue} onChange={handleInputChange} />
                            <InputField label="Sub Caste" name="subCaste" placeholder="Enter sub caste" value={formData.subCaste} onChange={handleInputChange} />
                            <InputField label="Gothram" name="gothram" placeholder="Enter gothram" value={formData.gothram} onChange={handleInputChange} />
                            <InputField label="Star/Nakshatra" name="star" placeholder="Enter star" value={formData.star} onChange={handleInputChange} />
                            <InputField label="Raasi" name="raasi" placeholder="Enter raasi" value={formData.raasi} onChange={handleInputChange} />
                        </div>
                    </FormSection>

                    {/* Professional & Educational Information (from Registration) */}
                    <FormSection title="Professional & Educational Information" icon={Briefcase}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <InputField 
                                label="Profession" 
                                name="profession" 
                                options={dropdownOptions.professions} 
                                required 
                                value={formData.profession}
                                onChange={handleInputChange}
                            />
                            
                            {/* Conditional Profession Detail */}
                            {formData.profession && professionDetails[formData.profession] && (
                                <InputField 
                                    label={`${formData.profession} Detail`}
                                    name="professionDetail" 
                                    options={professionDetails[formData.profession]} 
                                    value={formData.professionDetail}
                                    onChange={handleInputChange}
                                />
                            )}
                            
                            <InputField 
                                label="Highest Qualification" 
                                name="highestQualification" 
                                options={dropdownOptions.qualificationLevels} 
                                value={formData.highestQualification}
                                onChange={handleInputChange}
                            />
                            
                            {/* Conditional Qualification Category */}
                            {formData.highestQualification && qualificationData[formData.highestQualification] && (
                                <InputField 
                                    label="Qualification Category" 
                                    name="qualificationCategory" 
                                    options={qualificationData[formData.highestQualification].categories} 
                                    value={formData.qualificationCategory}
                                    onChange={handleInputChange}
                                />
                            )}
                            
                            {/* Conditional Qualification Degree */}
                            {formData.highestQualification && formData.qualificationCategory && 
                             qualificationData[formData.highestQualification]?.degrees[formData.qualificationCategory] && (
                                <InputField 
                                    label="Qualification Degree" 
                                    name="qualificationDegree" 
                                    options={qualificationData[formData.highestQualification].degrees[formData.qualificationCategory]} 
                                    value={formData.qualificationDegree}
                                    onChange={handleInputChange}
                                />
                            )}
                            
                            <InputField label="Advertiser Name" name="advertiserName" placeholder="Enter advertiser name" value={formData.advertiserName} onChange={handleInputChange} />
                            <InputField 
                                label="Relation with Candidate" 
                                name="relationWithCandidate" 
                                options={dropdownOptions.relations} 
                                value={formData.relationWithCandidate}
                                onChange={handleInputChange}
                            />
                        </div>
                    </FormSection>

                    {/* Physical Details */}
                    <FormSection title="Physical Details" icon={Heart}>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <InputField label="Height" name="height" placeholder="e.g., 5'6&quot;" value={formData.height} onChange={handleInputChange} />
                            <InputField label="Weight" name="weight" placeholder="e.g., 65 kg" value={formData.weight} onChange={handleInputChange} />
                            <InputField label="Body Type" name="bodyType" options={dropdownOptions.bodyType} value={formData.bodyType} onChange={handleInputChange} />
                            <InputField label="Complexion" name="complexion" options={dropdownOptions.complexion} value={formData.complexion} onChange={handleInputChange} />
                            <InputField label="Physical Status" name="physicalStatus" options={dropdownOptions.physicalStatus} value={formData.physicalStatus} onChange={handleInputChange} />
                            <InputField label="Blood Group" name="bloodGroup" options={dropdownOptions.bloodGroup} value={formData.bloodGroup} onChange={handleInputChange} />
                        </div>
                    </FormSection>

                    {/* Location Details */}
                    <FormSection title="Location Details" icon={MapPin}>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <InputField label="Country" name="country" placeholder="India" value={formData.country} onChange={handleInputChange} />
                            <InputField label="City" name="city" placeholder="Enter city" value={formData.city} onChange={handleInputChange} />
                            <InputField label="Residency Status" name="residencyStatus" options={dropdownOptions.residencyStatus} value={formData.residencyStatus} onChange={handleInputChange} />
                        </div>
                    </FormSection>

                    {/* Education & Career */}
                    <FormSection title="Education & Career" icon={GraduationCap}>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <InputField label="Education" name="education" options={dropdownOptions.education} value={formData.education} onChange={handleInputChange} />
                            <InputField label="Education Detail" name="educationDetail" placeholder="College/University name" value={formData.educationDetail} onChange={handleInputChange} />
                            <InputField label="Occupation" name="occupation" options={dropdownOptions.occupation} value={formData.occupation} onChange={handleInputChange} />
                            <InputField label="Occupation Detail" name="occupationDetail" placeholder="Job title/designation" value={formData.occupationDetail} onChange={handleInputChange} />
                            <InputField label="Annual Income" name="annualIncome" options={dropdownOptions.annualIncome} value={formData.annualIncome} onChange={handleInputChange} />
                            <InputField label="Working With" name="workingWith" options={dropdownOptions.workingWith} value={formData.workingWith} onChange={handleInputChange} />
                            <InputField label="Working As" name="workingAs" placeholder="e.g., Team Lead, Manager" value={formData.workingAs} onChange={handleInputChange} />
                        </div>
                    </FormSection>

                    {/* Family Details */}
                    <FormSection title="Family Details" icon={Users}>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <InputField label="Family Type" name="familyType" options={dropdownOptions.familyType} value={formData.familyType} onChange={handleInputChange} />
                            <InputField label="Family Status" name="familyStatus" options={dropdownOptions.familyStatus} value={formData.familyStatus} onChange={handleInputChange} />
                            <InputField label="Family Values" name="familyValues" options={dropdownOptions.familyValues} value={formData.familyValues} onChange={handleInputChange} />
                            <InputField label="Father's Occupation" name="fatherOccupation" placeholder="Father's occupation" value={formData.fatherOccupation} onChange={handleInputChange} />
                            <InputField label="Mother's Occupation" name="motherOccupation" placeholder="Mother's occupation" value={formData.motherOccupation} onChange={handleInputChange} />
                            <InputField label="No. of Brothers" name="noOfBrothers" type="number" placeholder="0" value={formData.noOfBrothers} onChange={handleInputChange} />
                            <InputField label="No. of Sisters" name="noOfSisters" type="number" placeholder="0" value={formData.noOfSisters} onChange={handleInputChange} />
                        </div>
                    </FormSection>

                    {/* Lifestyle */}
                    <FormSection title="Lifestyle" icon={Star}>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <InputField label="Diet" name="diet" options={dropdownOptions.diet} value={formData.diet} onChange={handleInputChange} />
                            <InputField label="Smoking" name="smoke" options={dropdownOptions.smoke} value={formData.smoke} onChange={handleInputChange} />
                            <InputField label="Drinking" name="drink" options={dropdownOptions.drink} value={formData.drink} onChange={handleInputChange} />
                        </div>
                    </FormSection>

                    {/* About Yourself */}
                    <FormSection title="About Yourself" icon={User}>
                        <div className="grid grid-cols-1 gap-6">
                            <TextAreaField label="About Yourself" name="aboutYourself" rows={4} value={formData.aboutYourself} onChange={handleInputChange} />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <InputField label="Hobbies" name="hobbies" placeholder="Reading, Music, Sports..." value={formData.hobbies} onChange={handleInputChange} />
                                <InputField label="Interests" name="interests" placeholder="Photography, Travel..." value={formData.interests} onChange={handleInputChange} />
                                <InputField label="Music Preference" name="music" placeholder="Classical, Pop, Rock..." value={formData.music} onChange={handleInputChange} />
                                <InputField label="Books" name="books" placeholder="Fiction, Non-fiction..." value={formData.books} onChange={handleInputChange} />
                                <InputField label="Movies" name="movies" placeholder="Comedy, Drama, Action..." value={formData.movies} onChange={handleInputChange} />
                                <InputField label="Sports" name="sports" placeholder="Cricket, Football..." value={formData.sports} onChange={handleInputChange} />
                                <InputField label="Cuisines" name="cuisines" placeholder="Italian, Chinese..." value={formData.cuisines} onChange={handleInputChange} />
                                <InputField label="Dress Style" name="dressStyle" placeholder="Casual, Formal..." value={formData.dressStyle} onChange={handleInputChange} />
                            </div>
                        </div>
                    </FormSection>

                    {/* Partner Preference */}
                    <FormSection title="Partner Preference" icon={Heart}>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                            <InputField label="Partner Age" name="partnerAge" placeholder="e.g., 25-30" value={formData.partnerAge} onChange={handleInputChange} />
                            <InputField label="Partner Height" name="partnerHeight" placeholder="e.g., 5'2&quot; - 5'8&quot;" value={formData.partnerHeight} onChange={handleInputChange} />
                            <InputField label="Partner Marital Status" name="partnerMaritalStatus" options={dropdownOptions.maritalStatus} value={formData.partnerMaritalStatus} onChange={handleInputChange} />
                            <InputField label="Partner Religion" name="partnerReligion" options={dropdownOptions.religion} value={formData.partnerReligion} onChange={handleInputChange} />
                            <InputField label="Partner Caste" name="partnerCaste" placeholder="Any/Specific" value={formData.partnerCaste} onChange={handleInputChange} />
                            <InputField label="Partner Education" name="partnerEducation" options={dropdownOptions.education} value={formData.partnerEducation} onChange={handleInputChange} />
                            <InputField label="Partner Occupation" name="partnerOccupation" options={dropdownOptions.occupation} value={formData.partnerOccupation} onChange={handleInputChange} />
                            <InputField label="Partner Income" name="partnerIncome" options={dropdownOptions.annualIncome} value={formData.partnerIncome} onChange={handleInputChange} />
                            <InputField label="Partner Location" name="partnerLocation" placeholder="Preferred cities/states" value={formData.partnerLocation} onChange={handleInputChange} />
                        </div>
                        <TextAreaField label="About Partner" name="aboutPartner" rows={4} value={formData.aboutPartner} onChange={handleInputChange} />
                    </FormSection>

                    {/* Contact Details */}
                    <FormSection title="Contact Details" icon={Phone}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <InputField label="Mobile Number" name="mobileNumber" type="tel" required placeholder="Enter mobile number" value={formData.mobileNumber} onChange={handleInputChange} />
                            <InputField label="Alternate Number" name="alternateNumber" type="tel" placeholder="Enter alternate number" value={formData.alternateNumber} onChange={handleInputChange} />
                            <InputField label="Email" name="email" type="email" placeholder="Enter email address" value={formData.email} onChange={handleInputChange} />
                            <InputField label="Best Time to Call" name="timeToCall" placeholder="e.g., 6 PM - 8 PM" value={formData.timeToCall} onChange={handleInputChange} />
                        </div>
                    </FormSection>

                    {/* Submit Button */}
                    <div className="flex justify-center py-8">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-4 px-12 rounded-xl transition-all duration-300 hover:scale-105 shadow-lg flex items-center gap-3"
                        >
                            {isSubmitting ? (
                                <>
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                    <span>Updating Profile...</span>
                                </>
                            ) : (
                                <>
                                    <Save className="h-5 w-5" />
                                    <span>Update Profile</span>
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </main>
        </div>
    </div>
    );
};

export default EditProfile;

