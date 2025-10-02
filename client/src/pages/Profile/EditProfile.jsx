import React, { useState, useEffect } from 'react';
import { Camera, Upload, Save, User, Heart, MapPin, Briefcase, GraduationCap, Phone, Mail, Calendar, Users, Home, Star } from 'lucide-react';

const EditProfile = ({ user }) => {
    const [formData, setFormData] = useState({
        // Personal Details
        profileFor: 'Self',
        name: '',
        gender: '',
        dateOfBirth: '',
        age: '',
        maritalStatus: '',
        religion: '',
        motherTongue: '',
        caste: '',
        subCaste: '',
        gothram: '',
        star: '',
        raasi: '',
        
        // Physical Details
        height: '',
        weight: '',
        bodyType: '',
        complexion: '',
        physicalStatus: '',
        bloodGroup: '',
        
        // Location Details
        country: 'India',
        state: '',
        city: '',
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
        
        // Contact Details
        mobileNumber: '',
        alternateNumber: '',
        email: '',
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

    // Populate form with existing user data
    useEffect(() => {
        if (user && user.userProfile) {
            const profile = user.userProfile;
            setFormData(prev => ({
                ...prev,
                // Personal Details
                name: user.name || '',
                gender: user.gender || '',
                dateOfBirth: user.date_of_birth || '',
                maritalStatus: profile.personal_info?.marital_status || '',
                religion: profile.religious_info?.religion || '',
                motherTongue: profile.additional_info?.native_language || '',
                caste: profile.religious_info?.caste || '',
                gothram: profile.religious_info?.gothra || '',

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

    // Dropdown options
    const dropdownOptions = {
        profileFor: ['Self', 'Son', 'Daughter', 'Brother', 'Sister', 'Friend', 'Relative'],
        gender: ['Male', 'Female'],
        maritalStatus: ['Never Married', 'Divorced', 'Widowed', 'Separated', 'Annulled'],
        religion: ['Hindu', 'Muslim', 'Christian', 'Sikh', 'Buddhist', 'Jain', 'Parsi', 'Jewish', 'Bahai', 'Spiritual', 'Other'],
        motherTongue: ['Hindi', 'English', 'Bengali', 'Telugu', 'Marathi', 'Tamil', 'Gujarati', 'Urdu', 'Kannada', 'Odia', 'Malayalam', 'Punjabi', 'Assamese', 'Other'],
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
        residencyStatus: ['Citizen', 'Permanent Resident', 'Temporary Visa', 'Work Permit'],
        states: ['Andhra Pradesh', 'Karnataka', 'Kerala', 'Tamil Nadu', 'Telangana', 'Maharashtra', 'Gujarat', 'Delhi', 'West Bengal', 'Other']
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
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

    const FormSection = ({ title, icon: Icon, children }) => (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden mb-8">
            <div className="bg-gradient-to-r from-red-600 to-red-700 text-white px-6 py-4">
                <div className="flex items-center gap-3">
                    <div className="bg-white/20 p-2 rounded-lg">
                        <Icon className="h-6 w-6" />
                    </div>
                    <h2 className="text-xl font-semibold">{title}</h2>
                </div>
            </div>
            <div className="p-6">
                {children}
            </div>
        </div>
    );

    const InputField = ({ label, name, type = 'text', required = false, placeholder, options }) => (
        <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
                {label} {required && <span className="text-red-500">*</span>}
            </label>
            {options ? (
                <select
                    name={name}
                    value={formData[name]}
                    onChange={handleInputChange}
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
                    value={formData[name]}
                    onChange={handleInputChange}
                    placeholder={placeholder}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    required={required}
                />
            )}
        </div>
    );

    const TextAreaField = ({ label, name, required = false, rows = 4 }) => (
        <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
                {label} {required && <span className="text-red-500">*</span>}
            </label>
            <textarea
                name={name}
                value={formData[name]}
                onChange={handleInputChange}
                rows={rows}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                required={required}
            />
        </div>
    );

    return (
        <div>
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">Edit My Profile</h1>
                <p className="text-slate-600">Complete your profile to find your perfect match</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
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
                            <InputField label="Profile Created For" name="profileFor" options={dropdownOptions.profileFor} required />
                            <InputField label="Name" name="name" required placeholder="Enter your full name" />
                            <InputField label="Gender" name="gender" options={dropdownOptions.gender} required />
                            <InputField label="Date of Birth" name="dateOfBirth" type="date" required />
                            <InputField label="Age" name="age" type="number" placeholder="Enter age" />
                            <InputField label="Marital Status" name="maritalStatus" options={dropdownOptions.maritalStatus} required />
                            <InputField label="Religion" name="religion" options={dropdownOptions.religion} required />
                            <InputField label="Mother Tongue" name="motherTongue" options={dropdownOptions.motherTongue} required />
                            <InputField label="Caste" name="caste" placeholder="Enter caste" />
                            <InputField label="Sub Caste" name="subCaste" placeholder="Enter sub caste" />
                            <InputField label="Gothram" name="gothram" placeholder="Enter gothram" />
                            <InputField label="Star/Nakshatra" name="star" placeholder="Enter star" />
                            <InputField label="Raasi" name="raasi" placeholder="Enter raasi" />
                        </div>
                    </FormSection>

                    {/* Physical Details */}
                    <FormSection title="Physical Details" icon={Heart}>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <InputField label="Height" name="height" placeholder="e.g., 5'6&quot;" required />
                            <InputField label="Weight" name="weight" placeholder="e.g., 65 kg" />
                            <InputField label="Body Type" name="bodyType" options={dropdownOptions.bodyType} />
                            <InputField label="Complexion" name="complexion" options={dropdownOptions.complexion} />
                            <InputField label="Physical Status" name="physicalStatus" options={dropdownOptions.physicalStatus} />
                            <InputField label="Blood Group" name="bloodGroup" options={dropdownOptions.bloodGroup} />
                        </div>
                    </FormSection>

                    {/* Location Details */}
                    <FormSection title="Location Details" icon={MapPin}>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <InputField label="Country" name="country" placeholder="India" />
                            <InputField label="State" name="state" options={dropdownOptions.states} required />
                            <InputField label="City" name="city" placeholder="Enter city" required />
                            <InputField label="Residency Status" name="residencyStatus" options={dropdownOptions.residencyStatus} />
                        </div>
                    </FormSection>

                    {/* Education & Career */}
                    <FormSection title="Education & Career" icon={GraduationCap}>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <InputField label="Education" name="education" options={dropdownOptions.education} required />
                            <InputField label="Education Detail" name="educationDetail" placeholder="College/University name" />
                            <InputField label="Occupation" name="occupation" options={dropdownOptions.occupation} required />
                            <InputField label="Occupation Detail" name="occupationDetail" placeholder="Job title/designation" />
                            <InputField label="Annual Income" name="annualIncome" options={dropdownOptions.annualIncome} />
                            <InputField label="Working With" name="workingWith" options={dropdownOptions.workingWith} />
                            <InputField label="Working As" name="workingAs" placeholder="e.g., Team Lead, Manager" />
                        </div>
                    </FormSection>

                    {/* Family Details */}
                    <FormSection title="Family Details" icon={Users}>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <InputField label="Family Type" name="familyType" options={dropdownOptions.familyType} />
                            <InputField label="Family Status" name="familyStatus" options={dropdownOptions.familyStatus} />
                            <InputField label="Family Values" name="familyValues" options={dropdownOptions.familyValues} />
                            <InputField label="Father's Occupation" name="fatherOccupation" placeholder="Father's occupation" />
                            <InputField label="Mother's Occupation" name="motherOccupation" placeholder="Mother's occupation" />
                            <InputField label="No. of Brothers" name="noOfBrothers" type="number" placeholder="0" />
                            <InputField label="No. of Sisters" name="noOfSisters" type="number" placeholder="0" />
                        </div>
                    </FormSection>

                    {/* Lifestyle */}
                    <FormSection title="Lifestyle" icon={Star}>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <InputField label="Diet" name="diet" options={dropdownOptions.diet} />
                            <InputField label="Smoking" name="smoke" options={dropdownOptions.smoke} />
                            <InputField label="Drinking" name="drink" options={dropdownOptions.drink} />
                        </div>
                    </FormSection>

                    {/* About Yourself */}
                    <FormSection title="About Yourself" icon={User}>
                        <div className="grid grid-cols-1 gap-6">
                            <TextAreaField label="About Yourself" name="aboutYourself" rows={4} />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <InputField label="Hobbies" name="hobbies" placeholder="Reading, Music, Sports..." />
                                <InputField label="Interests" name="interests" placeholder="Photography, Travel..." />
                                <InputField label="Music Preference" name="music" placeholder="Classical, Pop, Rock..." />
                                <InputField label="Books" name="books" placeholder="Fiction, Non-fiction..." />
                                <InputField label="Movies" name="movies" placeholder="Comedy, Drama, Action..." />
                                <InputField label="Sports" name="sports" placeholder="Cricket, Football..." />
                                <InputField label="Cuisines" name="cuisines" placeholder="Italian, Chinese..." />
                                <InputField label="Dress Style" name="dressStyle" placeholder="Casual, Formal..." />
                            </div>
                        </div>
                    </FormSection>

                    {/* Partner Preference */}
                    <FormSection title="Partner Preference" icon={Heart}>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                            <InputField label="Partner Age" name="partnerAge" placeholder="e.g., 25-30" />
                            <InputField label="Partner Height" name="partnerHeight" placeholder="e.g., 5'2&quot; - 5'8&quot;" />
                            <InputField label="Partner Marital Status" name="partnerMaritalStatus" options={dropdownOptions.maritalStatus} />
                            <InputField label="Partner Religion" name="partnerReligion" options={dropdownOptions.religion} />
                            <InputField label="Partner Caste" name="partnerCaste" placeholder="Any/Specific" />
                            <InputField label="Partner Education" name="partnerEducation" options={dropdownOptions.education} />
                            <InputField label="Partner Occupation" name="partnerOccupation" options={dropdownOptions.occupation} />
                            <InputField label="Partner Income" name="partnerIncome" options={dropdownOptions.annualIncome} />
                            <InputField label="Partner Location" name="partnerLocation" placeholder="Preferred cities/states" />
                        </div>
                        <TextAreaField label="About Partner" name="aboutPartner" rows={4} />
                    </FormSection>

                    {/* Contact Details */}
                    <FormSection title="Contact Details" icon={Phone}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <InputField label="Mobile Number" name="mobileNumber" type="tel" required placeholder="Enter mobile number" />
                            <InputField label="Alternate Number" name="alternateNumber" type="tel" placeholder="Enter alternate number" />
                            <InputField label="Email" name="email" type="email" required placeholder="Enter email address" />
                            <InputField label="Best Time to Call" name="timeToCall" placeholder="e.g., 6 PM - 8 PM" />
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
        </div>
    );
};

export default EditProfile;
