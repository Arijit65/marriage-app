// AdsSection.jsx  –– refined continuous layout with dynamic data

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useApi } from "../context/ApiContext";

/* ─── Card component ─── */
const DemoCard = ({ profileId = "F2150-F", memberType = "STOCK Member", gender = "Bride", age = "32", height = "5'", religion = "Hindu", ethnicity = "Bengali", caste = "Kayastha", education = "MA", photoCount = "2 Photos", imageUrl, details, qualification, profession }) => {
  const navigate = useNavigate();
  
  const handleCardClick = () => {
    // Navigate to profile detail page using profileId
    navigate(`/profile/${profileId}`);
  };
  
  return (
  <div 
    onClick={handleCardClick}
    className="bg-white rounded-2xl border border-gray-200 shadow-xl flex overflow-hidden cursor-pointer hover:shadow-2xl hover:scale-[1.02] transition-all duration-300">
    {/* photo */}
    <div className="w-[150px] shrink-0 relative">
      <img
        src={imageUrl || "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face"}
        alt="profile"
        className="h-full w-full object-cover"
        onError={(e) => {
          e.target.src = "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face";
        }}
      />
      <span className="absolute bottom-2 left-2 bg-black/70 text-white text-[11px] px-2 rounded">
        {photoCount || `${Math.floor(Math.random() * 4) + 1} Photos`}
      </span>
    </div>

    {/* details */}
    <div className="flex-1 px-5 py-4 space-y-1 text-[15px]">
      <p className="text-[12px] text-gray-500">
        {profileId} • <span className="text-blue-600 font-semibold">{memberType}</span>
      </p>
      <p className="font-semibold">{details || `${gender} · ${age} years / ${height}`}</p>
      <p className="leading-snug text-gray-700">
        {profession || qualification || `${religion}, ${ethnicity}, ${caste} · ${ethnicity}, ${education}...`}
        <span className="text-red-600 font-medium ml-1 cursor-pointer">Read More</span>
      </p>

      <div className="flex items-center pt-2">
        <input
          id={`contactEmail-${profileId}`}
          type="checkbox"
          className="accent-red-600 w-4 h-4 mr-2"
        />
        <label htmlFor={`contactEmail-${profileId}`} className="text-[13px]">
          Contact via email
        </label>
        <button
          className="ml-auto text-red-600 text-xs font-bold hover:translate-x-0.5 transition"
          aria-label="next"
        >
          ➜
        </button>
      </div>
    </div>
  </div>
  );
};

/* ─── Section block ─── */
const Block = ({ label, headline, children, isLast, onViewAll }) => (
  <>
    {/* heading group */}
    <header className="text-center pt-16">
      <p className="text-gray-500 font-medium mb-1">{label}</p>
      <h2 className="text-red-600 text-4xl sm:text-5xl font-extrabold mb-10">
        {headline}
      </h2>
    </header>

    {/* card slot */}
    {children && <div className="mb-14">{children}</div>}

    {/* button */}
    <div className="text-center pb-16">
      <button 
        onClick={onViewAll}
        className="bg-red-600 hover:bg-red-700 text-white px-10 py-3 rounded-full text-lg font-semibold shadow-lg ring-0 hover:ring-4 hover:ring-red-600/30 transition"
      >
        View All
      </button>
    </div>

    {/* divider except under the final block */}
    {!isLast && (
      <div className="max-w-6xl mx-auto h-px bg-gray-300/70" />
    )}
  </>
);

// Fallback placeholder images for variety - moved outside component to avoid dependency issues
const PLACEHOLDER_IMAGES = [
  "https://media.istockphoto.com/id/1987655119/photo/smiling-young-businesswoman-standing-in-the-corridor-of-an-office.jpg?s=612x612&w=0&k=20&c=5N_IVGYsXoyj-H9vEiZUCLqbmmineaemQsKt2NTXGms=",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face"
];

const AdsSection = () => {
  const navigate = useNavigate();
  const [latestAds, setLatestAds] = useState([]);
  const [featuredAds, setFeaturedAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const { profileApi } = useApi();

  const handleViewAll = () => {
    navigate('/profiles');
  };

  // Fallback data functions - moved inside useEffect to avoid dependencies
  useEffect(() => {
    const getFallbackLatestAds = () => [
      {
        id: 1,
        profileId: "F2150-F",
        memberType: "STOCK Member",
        name: "Priya Sharma",
        age: 32,
        height: "5'",
        details: "Bride · 32 years / 5'",
        ethnicity: "Hindu, Bengali, Kayastha",
        qualification: "MA",
        profession: "Software Engineer",
        photos: 2,
        image: PLACEHOLDER_IMAGES[0]
      },
      {
        id: 2,
        profileId: "F2151-M",
        memberType: "PREMIUM Member", 
        name: "Arjun Khan",
        age: 28,
        height: "5'8",
        details: "Groom · 28 years / 5'8",
        ethnicity: "Muslim, Punjabi, Jatt",
        qualification: "MBA",
        profession: "Business Analyst",
        photos: 3,
        image: PLACEHOLDER_IMAGES[1]
      }
    ];

    const getFallbackFeaturedAds = () => [
      {
        id: 3,
        profileId: "F2152-F",
        memberType: "VIP Member",
        name: "Sarah Wilson",
        age: 26,
        height: "5'3",
        details: "Bride · 26 years / 5'3",
        ethnicity: "Christian, Anglo-Indian",
        qualification: "B.Tech",
        profession: "Software Developer",
        photos: 4,
        image: PLACEHOLDER_IMAGES[2]
      },
      {
        id: 4,
        profileId: "F2155-M",
        memberType: "VIP Member",
        name: "Rahul Agarwal", 
        age: 29,
        height: "5'9",
        details: "Groom · 29 years / 5'9",
        ethnicity: "Jain, Marwari, Agarwal",
        qualification: "Ph.D",
        profession: "Research Scientist",
        photos: 3,
        image: PLACEHOLDER_IMAGES[5]
      }
    ];

    const fetchAds = async () => {
      try {
        setLoading(true);
        
        // Fetch the latest profiles
        const latestResponse = await profileApi.getAdProfiles({ 
          page: 1, 
          limit: 10 // Get more to have options
        });

        if (latestResponse?.success && latestResponse?.data?.profiles) {
          const profiles = latestResponse.data.profiles;
          
          // Process profiles and add fallback images where needed
          const processedProfiles = profiles.map((profile, index) => ({
            ...profile,
            image: profile.image || PLACEHOLDER_IMAGES[index % PLACEHOLDER_IMAGES.length]
          }));
          
          // Latest Ads: Last 2 profiles (most recent)
          setLatestAds(processedProfiles.slice(0, 2));
          
          // Featured Ads: Random 2 profiles from the remaining
          const remainingProfiles = processedProfiles.length > 2 ? processedProfiles.slice(2) : processedProfiles;
          const shuffled = [...remainingProfiles].sort(() => 0.5 - Math.random());
          setFeaturedAds(shuffled.slice(0, 2));
        } else {
          // If API fails, use fallback data
          setLatestAds(getFallbackLatestAds());
          setFeaturedAds(getFallbackFeaturedAds());
        }
      } catch (err) {
        console.error('Error fetching ads:', err);
        
        // Use fallback data
        setLatestAds(getFallbackLatestAds());
        setFeaturedAds(getFallbackFeaturedAds());
      } finally {
        setLoading(false);
      }
    };

    fetchAds();
  }, [profileApi]);

  // Loading state
  if (loading) {
    return (
      <section className="w-full bg-gray-100/60">
        <div className="max-w-7xl mx-auto px-4">
          <header className="text-center pt-16">
            <h2 className="text-red-600 text-4xl sm:text-5xl font-extrabold mb-10">
              Loading Ads...
            </h2>
          </header>
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    /* full-bleed subtle background */
    <section className="w-full bg-gray-100/60">
      <div className="max-w-7xl mx-auto px-4">
        {/* Latest Ads – heading + dynamic cards (2 latest profiles) */}
        <Block
          label="Latest Ads"
          headline="Find Your Perfect Match Today"
          onViewAll={handleViewAll}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {latestAds.map((profile, index) => (
              <DemoCard 
                key={profile.id || index}
                profileId={profile.profileId}
                memberType={profile.memberType}
                details={profile.details}
                ethnicity={profile.ethnicity}
                qualification={profile.qualification}
                profession={profile.profession}
                photoCount={profile.photos ? `${profile.photos} Photos` : '2 Photos'}
                imageUrl={profile.image}
              />
            ))}
          </div>
        </Block>

        {/* Featured Ads – heading + dynamic cards (2 random profiles) */}
        <Block
          label="Featured Ads"
          headline="Discover Your Perfect Match"
          isLast
          onViewAll={handleViewAll}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 max-w-6xl mx-auto">
            {featuredAds.map((profile, index) => (
              <DemoCard 
                key={profile.id || index}
                profileId={profile.profileId}
                memberType={profile.memberType}
                details={profile.details}
                ethnicity={profile.ethnicity}
                qualification={profile.qualification}
                profession={profile.profession}
                photoCount={profile.photos ? `${profile.photos} Photos` : '3 Photos'}
                imageUrl={profile.image}
              />
            ))}
          </div>
        </Block>
      </div>
    </section>
  );
};

export default AdsSection;
