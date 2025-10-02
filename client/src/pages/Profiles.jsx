/*  ProfilesPage.jsx - Static cards with proper scrolling  */

import React, { useState, useEffect } from 'react';
import ProfileFilters from '../Components/ProfileFilters';
import ProfileCard from '../Components/ProfileCard';
import { Search, Filter, Grid, List } from 'lucide-react';
import Footer from '../Components/Footer';
import MainHeader from '../Components/mainHeader';
import { useAuth } from '../context';

const ProfilesPage = () => {
  const { user, isAuthenticated, token } = useAuth(); // Get current user info
  
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({});
  const [viewMode, setViewMode] = useState('list');
  const [showFilters, setShowFilters] = useState(true);
  const backenUrl = import.meta.env.VITE_BACKEND_URL

  // Static profile data as fallback
  const staticProfiles = [
    {
      id: "DEMO_B25102",
      profileId: "B25102-B",
      memberType: "QUICK",
      name: "Bride",
      isDemoProfile: true,
      age: 38,
      height: "5'1\"",
      details: "Bride, 38, 5'1\", Unmarried",
      ethnicity: "Hindu, Bengali, Brahmin Bengali, West Bengal, Navi Mumbai, Arkes, Non Mangalik",
      qualification: "Master Degree, MSc Dietetics And Food Services Management IGNOU",
      profession: "Professional (Various Service), Some Profession, Dietician - Diet Consultant, Kolkata, West Bengal",
      personalDetails: "Medium, Fair Complex, Non Vegetarian",
      aboutMyself: "About Myself: Music, Computer, Religious, Songsstst, Love Travelling, Etc... View Full Profile",
      yetToMarryVerified: "2025-08-05",
      selfVerified: "Mobile",
      photos: 2,
      videoProfiles: 3,
      image: "https://images.unsplash.com/photo-1494790108755-2616c96b26e8?auto=format&fit=crop&w=300&q=80",
      verified: true,
      contactEmail: true
    },
    {
      id: "DEMO_G21102",
      profileId: "G21102-B",
      memberType: "STOCK",
      name: "Groom",
      isDemoProfile: true,
      age: 37,
      height: "5'6\"",
      details: "Groom, 37 years / 5'6\"",
      ethnicity: "Groom, 37, 5'6\", Divorced (No Child)",
      qualification: "Qualification: Master Degree, Engineer, MCA",
      profession: "Profession: Govt / Public Sector, Central Govt Administrative Assistant, Income Protection Life PM, Currently At: Kolkata, West Bengal",
      personalDetails: "Personal Details: Fair, Healthy, Non Vegetarian, Occasionally Drink, Blood Gr: B+",
      aboutMyself: "Our Family... View Full Profile",
      yetToMarryVerified: "2024-11-24",
      selfVerified: "AD Master, Mobile",
      photos: 1,
      videoProfiles: 1,
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80",
      verified: true,
      contactEmail: true
    },
    {
      id: "DEMO_F25103",
      profileId: "F25103-F",
      memberType: "STOCK",
      name: "Bride",
      isDemoProfile: true,
      age: 32,
      height: "5'",
      details: "Bride, 32 years / 5'",
      ethnicity: "Bride, 32, 5', Unmarried",
      qualification: "Qualification: Bengalis, Kayastha Bengali, Navi Basad, Dhaiya Saptagrams, Managals",
      profession: "Master Degree, Honours, MA, Another MA IN POPULATION SC DOING PhD. PMY.",
      personalDetails: "Profession: Honestly, West Bengal",
      aboutMyself: "About Myself... View Full Profile",
      yetToMarryVerified: "2024-12-15",
      selfVerified: "Mobile",
      photos: 3,
      videoProfiles: 2,
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=300&q=80",
      verified: true,
      contactEmail: false
    },
    {
      id: "DEMO_B28104",
      profileId: "B28104-A",
      memberType: "PREMIUM",
      name: "Bride",
      isDemoProfile: true,
      age: 29,
      height: "5'4\"",
      details: "Bride, 29 years / 5'4\"",
      ethnicity: "Hindu, Tamil, Iyer, Tamil Nadu, Chennai, Mangalik",
      qualification: "Master Degree, MBA Finance",
      profession: "Software Professional, Senior Analyst, IT Company, Chennai",
      personalDetails: "Medium, Fair Complex, Vegetarian",
      aboutMyself: "Family oriented, career focused individual looking for life partner...",
      yetToMarryVerified: "2025-07-20",
      selfVerified: "Mobile, Email",
      photos: 4,
      videoProfiles: 2,
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
      verified: true,
      contactEmail: true
    },
    {
      id: "DEMO_G30105",
      profileId: "G30105-C",
      memberType: "QUICK",
      name: "Groom",
      isDemoProfile: true,
      age: 31,
      height: "5'8\"",
      details: "Groom, 31 years / 5'8\"",
      ethnicity: "Hindu, Punjabi, Jat, Punjab, Chandigarh, Non Mangalik",
      qualification: "Bachelor Degree, B.Tech Computer Science",
      profession: "Software Professional, Software Engineer, IT Company, Chandigarh",
      personalDetails: "Tall, Fair Complex, Non Vegetarian, Non-Drinker",
      aboutMyself: "Tech-savvy individual with traditional values...",
      yetToMarryVerified: "2025-06-10",
      selfVerified: "Mobile",
      photos: 2,
      videoProfiles: 1,
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&q=80",
      verified: true,
      contactEmail: true
    },
    {
      id: "DEMO_B26106",
      profileId: "B26106-D",
      memberType: "PREMIUM",
      name: "Bride",
      isDemoProfile: true,
      age: 27,
      height: "5'3\"",
      details: "Bride, 27 years / 5'3\"",
      ethnicity: "Hindu, Marathi, Brahmin, Maharashtra, Mumbai, Mangalik",
      qualification: "Master Degree, MBA Marketing",
      profession: "Marketing Professional, Marketing Manager, FMCG Company, Mumbai",
      personalDetails: "Medium, Wheatish, Vegetarian, Non-Drinker",
      aboutMyself: "Ambitious professional seeking like-minded partner...",
      yetToMarryVerified: "2025-05-15",
      selfVerified: "Mobile, Email",
      photos: 5,
      videoProfiles: 3,
      image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80",
      verified: true,
      contactEmail: true
    },
    {
      id: "DEMO_G32107",
      profileId: "G32107-E",
      memberType: "STOCK",
      name: "Groom",
      isDemoProfile: true,
      age: 35,
      height: "5'10\"",
      details: "Groom, 35 years / 5'10\"",
      ethnicity: "Hindu, Gujarati, Patel, Gujarat, Ahmedabad, Non Mangalik",
      qualification: "Master Degree, MBA Finance",
      profession: "Banking Professional, Senior Manager, National Bank, Ahmedabad",
      personalDetails: "Tall, Fair Complex, Vegetarian, Non-Drinker",
      aboutMyself: "Family-oriented professional with strong values...",
      yetToMarryVerified: "2025-04-20",
      selfVerified: "Mobile",
      photos: 3,
      videoProfiles: 2,
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80",
      verified: true,
      contactEmail: true
    },
    {
      id: "DEMO_B27108",
      profileId: "B27108-F",
      memberType: "QUICK",
      name: "Bride",
      isDemoProfile: true,
      age: 26,
      height: "5'5\"",
      details: "Bride, 26 years / 5'5\"",
      ethnicity: "Hindu, Telugu, Reddy, Andhra Pradesh, Hyderabad, Mangalik",
      qualification: "Bachelor Degree, B.Tech Computer Science",
      profession: "Software Professional, Software Engineer, IT Company, Hyderabad",
      personalDetails: "Medium, Wheatish, Vegetarian, Non-Drinker",
      aboutMyself: "Tech-savvy individual with traditional values...",
      yetToMarryVerified: "2025-03-12",
      selfVerified: "Mobile",
      photos: 3,
      videoProfiles: 2,
      image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=300&q=80",
      verified: true,
      contactEmail: true
    }
  ];

  // Helper function to filter out current user's profile
  const filterOutCurrentUser = (profilesList) => {
    // Check if user is authenticated (now properly working)
    if (!isAuthenticated || !user) {
      console.log('User not authenticated, showing all profiles');
      return profilesList;
    }
    
    console.log('🔍 Filtering profiles for authenticated user:', user.id);
    
    // Filter out the current user's profile
    const filteredProfiles = profilesList.filter(profile => {
      // Check various possible ID field matches
      const isCurrentUserProfile = (
        profile.id === user.id || 
        profile.user_id === user.id || 
        profile.userId === user.id ||
        profile.profileId === user.id ||
        (user.phone && (profile.phone === user.phone || profile.phone_number === user.phone || profile.mobile === user.phone)) ||
        (user.email && profile.email === user.email)
      );
      
      if (isCurrentUserProfile) {
        console.log('🚫 Excluding current user profile:', {
          profileId: profile.id || profile.profileId || profile.user_id,
          profileName: profile.name
        });
        return false;
      }
      
      return true;
    });
    
    console.log(`✅ Filtered ${profilesList.length - filteredProfiles.length} profile(s). Showing ${filteredProfiles.length} profiles.`);
    return filteredProfiles;
  };

  // Fetch profiles from API
  const fetchProfiles = async (filterParams = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      const queryParams = new URLSearchParams({
        page: 1,
        limit: 20,
        ...filterParams
      });

      // Add authorization header if user is logged in
      const authToken = token || localStorage.getItem('token');
      const headers = {
        'Content-Type': 'application/json'
      };
      
      if (authToken) {
        headers['Authorization'] = `Bearer ${authToken}`;
        console.log('Making authenticated request to fetch profiles');
      } else {
        console.log('Making unauthenticated request to fetch profiles');
      }

      const response = await fetch(`${backenUrl}/api/profile/ad-profiles?${queryParams}`, {
        method: 'GET',
        headers
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch profiles');
      }

      const data = await response.json();
      
      if (data.success && data.data.profiles.length > 0) {
        // Combine API profiles with some static profiles
        const apiProfiles = data.data.profiles;
        const combinedProfiles = [...apiProfiles, ...staticProfiles.slice(0, 3)];
        // Filter out current user's profile if logged in
        const filteredProfiles = filterOutCurrentUser(combinedProfiles);
        setProfiles(filteredProfiles);
      } else {
        // If no API profiles, use static profiles (filtered)
        const filteredStaticProfiles = filterOutCurrentUser(staticProfiles);
        setProfiles(filteredStaticProfiles);
      }
    } catch (err) {
      console.error('Error fetching profiles:', err);
      setError(err.message);
      // Fallback to static profiles (filtered)
      const filteredStaticProfiles = filterOutCurrentUser(staticProfiles);
      setProfiles(filteredStaticProfiles);
    } finally {
      setLoading(false);
    }
  };

  // Handle filter changes
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    fetchProfiles(newFilters);
  };

  // Fetch profiles on component mount
  useEffect(() => {
    fetchProfiles();
  }, []);

  // Re-filter profiles when user authentication state changes
  useEffect(() => {
    if (profiles.length > 0 && isAuthenticated && user) {
      // Re-apply filtering when user login/logout state changes
      console.log('Authentication state changed, refetching profiles...');
      fetchProfiles(filters);
    }
  }, [isAuthenticated, user?.id]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <MainHeader />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading profiles...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <MainHeader />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="bg-red-100 rounded-full p-4 mx-auto mb-4 w-16 h-16 flex items-center justify-center">
              <span className="text-red-600 text-2xl">⚠️</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Unable to load profiles</h3>
            <p className="text-gray-600 mb-4">Showing static profiles instead</p>
            <button 
              onClick={() => fetchProfiles(filters)}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
        <MainHeader/>
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <h1 className="text-2xl font-bold text-gray-800">Browse Profiles</h1>
                  <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-semibold">
                    {profiles.length} matches
                  </span>
                  {profiles.length > 0 && (
                    <span className="text-sm text-gray-500">
                      {profiles.length > staticProfiles.length ? 'Live + Static' : 'Static profiles'}
                      {isAuthenticated && ' (excluding your profile)'}
                    </span>
                  )}
                </div>
                
                <div className="flex items-center space-x-4">
                  {/* View Mode Toggle */}
                  <div className="flex bg-gray-100 rounded-lg p-1">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-2 rounded-md transition-colors ${
                        viewMode === 'grid' ? 'bg-white shadow-sm text-red-600' : 'text-gray-500'
                      }`}
                    >
                      <Grid className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-2 rounded-md transition-colors ${
                        viewMode === 'list' ? 'bg-white shadow-sm text-red-600' : 'text-gray-500'
                      }`}
                    >
                      <List className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Refresh Button */}
                  <button
                    onClick={() => fetchProfiles(filters)}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors flex items-center space-x-2"
                  >
                    <span>🔄</span>
                    <span>Refresh</span>
                  </button>

                  {/* Filter Toggle */}
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors lg:hidden"
                  >
                    <Filter className="w-4 h-4" />
                    <span>Filters</span>
                  </button>
                </div>
              </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex gap-6">
          {/* Left Sidebar - Filters */}
          <div className={`${showFilters ? 'block' : 'hidden'} lg:block w-80 flex-shrink-0`}>
            <ProfileFilters onFiltersChange={handleFilterChange} />
          </div>

          {/* Right Content - Profiles */}
          <div className="flex-1">
            <div className="h-[calc(100vh-120px)] overflow-y-auto pr-2">
              {/* Profiles Grid/List */}
              <div className={`${
                viewMode === 'grid' 
                  ? 'grid grid-cols-1 lg:grid-cols-2 gap-6' 
                  : 'space-y-6'
              }`}>
                {profiles.map((profile) => (
                  <ProfileCard 
                    key={profile.id} 
                    profile={profile} 
                    viewMode={viewMode}
                  />
                ))}
              </div>

              {/* No Profiles Found */}
              {profiles.length === 0 && (
                <div className="text-center py-12">
                  <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">No profiles found</h3>
                  <p className="text-gray-500">Try adjusting your filters to see more results</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer/>
    </div>
  );
};

export default ProfilesPage;
