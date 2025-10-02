import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { CheckCircle, ChevronLeft, ChevronRight, Eye, ShieldCheck, Heart, Play, MessageCircle, X, Send } from "lucide-react";
import MainHeader from "../../Components/mainHeader";
import Footer from "../../Components/Footer";
import { useAuth } from "../../context/AuthContext";

export default function IndividualProfilePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated, token } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Proposal state
  const [showProposalModal, setShowProposalModal] = useState(false);
  const [proposalMessage, setProposalMessage] = useState("");
  const [proposalLoading, setProposalLoading] = useState(false);
  const [proposalError, setProposalError] = useState(null);
  const [proposalSent, setProposalSent] = useState(false);
  const backendUrl = import.meta.env.VITE_BACKEND_URL
  // Static profile data as fallback
  const staticProfiles = {
    "B25102-B": {
      id: "B25102-B",
      views: 168,
      adType: "QUICK Member",
      verified: true,
      ytmVerifiedOn: "2025-08-03",
      images: [
        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1200&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1520975682031-6de9d28754d3?q=80&w=1200&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=1200&auto=format&fit=crop",
      ],
      details: {
        "My Details": "Bride, 38, 5'11\", Unmarried",
        Ethnicity:
          "Hindu, Bengali, Brahmin Bengali, West Bengal, Nar, Mesha-Aries, Non Mangalik",
        Qualification:
          "Master Degree, MSc Dietetics And Food Services Management - IGNOU",
        Profession:
          "Professional (non Service), Dietician - Diet Consultant, Currently at: Hooghly, West Bengal",
        "Personal Details": "Medium Complexion, Non Vegetarian",
        "About Myself":
          "Music lover, singing Rabindra Sangeet, loves travelling, story books, fond of preparing breakfast dishes.",
        "Our Family":
          "Nuclear, moderate; father alive staying with me (retired from service); mother alive staying with me (homemaker); 1 brother (engineer-service); ancestral house at Konnagar, Hooghly; high cultural esteem.",
        "Resident Of": "-",
      },
      expectations: {
        "We Are Looking For":
          "Groom 39 to 45, Hindu, Bengali, Brahmin Bengali, Deb/Nar; income does not matter",
        "We May Go For":
          "Unmarried, Hindu, Kayastha Bengali, Baidya",
      },
    },
    "G21102-B": {
      id: "G21102-B",
      views: 145,
      adType: "STOCK Member",
      verified: true,
      ytmVerifiedOn: "2024-11-24",
      images: [
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1200&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=1200&auto=format&fit=crop",
      ],
      details: {
        "My Details": "Groom, 37, 5'6\", Divorced (No Child)",
        Ethnicity: "Hindu, Bengali, Kayastha Bengali, West Bengal",
        Qualification: "Master Degree, Engineer, MCA",
        Profession: "Govt / Public Sector, Central Govt Administrative Assistant, Income Protection Life PM, Currently At: Kolkata, West Bengal",
        "Personal Details": "Fair, Healthy, Non Vegetarian, Occasionally Drink, Blood Gr: B+",
        "About Myself": "Our Family...",
        "Our Family": "Nuclear family with traditional values",
        "Resident Of": "Kolkata, West Bengal",
      },
      expectations: {
        "We Are Looking For": "Bride 32 to 40, Hindu, Bengali, educated",
        "We May Go For": "Unmarried, Hindu, Bengali",
      },
    },
    "F25103-F": {
      id: "F25103-F",
      views: 89,
      adType: "STOCK Member",
      verified: true,
      ytmVerifiedOn: "2024-12-15",
      images: [
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=1200&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?q=80&w=1200&auto=format&fit=crop",
      ],
      details: {
        "My Details": "Bride, 32, 5', Unmarried",
        Ethnicity: "Bengalis, Kayastha Bengali, Navi Basad, Dhaiya Saptagrams, Managals",
        Qualification: "Master Degree, Honours, MA, Another MA IN POPULATION SC DOING PhD. PMY.",
        Profession: "Honestly, West Bengal",
        "Personal Details": "Medium, Fair Complex, Non Vegetarian",
        "About Myself": "About Myself...",
        "Our Family": "Traditional Bengali family",
        "Resident Of": "West Bengal",
      },
      expectations: {
        "We Are Looking For": "Groom 30 to 38, Hindu, Bengali, educated",
        "We May Go For": "Unmarried, Hindu, Bengali",
      },
    },
    // Add more static profiles for API-generated IDs
    "B00002-F": {
      id: "B00002-F",
      views: 156,
      adType: "QUICK Member",
      verified: true,
      ytmVerifiedOn: "2025-01-15",
      images: [
        "https://images.unsplash.com/photo-1494790108755-2616c96b26e8?q=80&w=1200&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1200&auto=format&fit=crop",
      ],
      details: {
        "My Details": "Bride, 28, 5'4\", Unmarried",
        Ethnicity: "Hindu, Tamil, Iyer, Tamil Nadu, Chennai, Mangalik",
        Qualification: "Master Degree, MBA Finance",
        Profession: "Software Professional, Senior Analyst, IT Company, Chennai",
        "Personal Details": "Medium, Fair Complex, Vegetarian",
        "About Myself": "Family oriented, career focused individual looking for life partner...",
        "Our Family": "Nuclear family with traditional values",
        "Resident Of": "Chennai, Tamil Nadu",
      },
      expectations: {
        "We Are Looking For": "Groom 28 to 35, Hindu, Tamil, educated",
        "We May Go For": "Unmarried, Hindu, Tamil",
      },
    },
    "G00003-M": {
      id: "G00003-M",
      views: 134,
      adType: "PREMIUM Member",
      verified: true,
      ytmVerifiedOn: "2025-02-20",
      images: [
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1200&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=1200&auto=format&fit=crop",
      ],
      details: {
        "My Details": "Groom, 30, 5'10\", Unmarried",
        Ethnicity: "Hindu, Punjabi, Jat, Punjab, Chandigarh, Non Mangalik",
        Qualification: "Bachelor Degree, B.Tech Computer Science",
        Profession: "Software Professional, Software Engineer, IT Company, Chandigarh",
        "Personal Details": "Tall, Fair Complex, Non Vegetarian, Non-Drinker",
        "About Myself": "Tech-savvy individual with traditional values...",
        "Our Family": "Joint family with strong cultural values",
        "Resident Of": "Chandigarh, Punjab",
      },
      expectations: {
        "We Are Looking For": "Bride 25 to 32, Hindu, Punjabi, educated",
        "We May Go For": "Unmarried, Hindu, Punjabi",
      },
    }
  };

  // Fetch profile data
  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError(null);

      // Try to fetch from API first
      const response = await fetch(`${backendUrl}/api/profile/public/${id}`);
      
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setProfile(data.data);
          return;
        }
      }

      // Fallback to static data
      if (staticProfiles[id]) {
        setProfile(staticProfiles[id]);
      } else {
        setError('Profile not found');
      }
    } catch (err) {
      console.error('Error fetching profile:', err);
      
      // Fallback to static data
      if (staticProfiles[id]) {
        setProfile(staticProfiles[id]);
      } else {
        setError('Profile not found');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchProfile();
    }
  }, [id]);

  const [idx, setIdx] = useState(0);
  const prev = () => setIdx((i) => (i - 1 + profile?.images?.length) % (profile?.images?.length || 1));
  const next = () => setIdx((i) => (i + 1) % (profile?.images?.length || 1));

  // Proposal functions
  const handlePropose = () => {
    // Check if this is a demo profile
    const isDemoProfile = /^(DEMO_|[A-Z]\d{5}-[A-Z]$)/.test(id);
    if (isDemoProfile) {
      alert('This is a demo profile. Please register to view real profiles and send proposals.');
      return;
    }

    if (!isAuthenticated) {
      navigate('/auth/login');
      return;
    }

    if (user?.id === id) {
      alert('You cannot send a proposal to yourself');
      return;
    }

    setShowProposalModal(true);
    setProposalError(null);
  };

  const sendProposal = async () => {
    try {
      setProposalLoading(true);
      setProposalError(null);

      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

      console.log('🔄 Sending proposal...', {
        url: `${API_URL}/v1/proposals/send`,
        proposedUserId: id,
        message: proposalMessage.trim(),
        token: token ? 'Present' : 'Missing'
      });

      const response = await fetch(`${API_URL}/v1/proposals/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          proposedUserId: id,
          message: proposalMessage.trim()
        })
      });

      console.log('📡 Response status:', response.status);
      console.log('📡 Response headers:', response.headers);

      let result;
      try {
        result = await response.json();
        console.log('📡 Response data:', result);
      } catch (parseError) {
        console.error('❌ Failed to parse response as JSON:', parseError);
        const textResponse = await response.text();
        console.log('📡 Raw response:', textResponse);
        throw new Error('Invalid response format from server');
      }

      if (response.ok && result.success) {
        console.log('✅ Proposal sent successfully');
        setProposalSent(true);
        setShowProposalModal(false);
        setProposalMessage("");
        alert('Proposal sent successfully!');
      } else {
        console.error('❌ Proposal failed:', result);
        setProposalError(result.message || `Failed to send proposal (${response.status})`);
      }
    } catch (error) {
      console.error('❌ Error sending proposal:', error);
      setProposalError(`Network error: ${error.message}`);
    } finally {
      setProposalLoading(false);
    }
  };

  const closeProposalModal = () => {
    setShowProposalModal(false);
    setProposalMessage("");
    setProposalError(null);
  };

  const DetailRow = ({ label, value }) => (
    <div className="text-sm leading-6">
      <span className="font-semibold text-gray-800">{label}:</span>{" "}
      <span className="text-gray-700">{value}</span>
    </div>
  );

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <MainHeader />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading profile...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Error state
  if (error || !profile) {
    return (
      <div className="min-h-screen bg-gray-50">
        <MainHeader />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="bg-red-100 rounded-full p-4 mx-auto mb-4 w-16 h-16 flex items-center justify-center">
              <span className="text-red-600 text-2xl">⚠️</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Profile not found</h3>
            <p className="text-gray-600 mb-4">The profile you're looking for doesn't exist</p>
            <button 
              onClick={() => navigate('/profiles')}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
            >
              Back to Profiles
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <MainHeader />
      <section className="w-full">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
          {/* Back link */}
          <button
            type="button"
            className="mb-4 inline-flex items-center text-sm text-rose-600 hover:text-rose-700"
            onClick={() => navigate('/profiles')}
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Profiles
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6">
            {/* LEFT: Profile content */}
            <div className="bg-white border border-rose-200 rounded-xl overflow-hidden shadow-sm">
              {/* Header strip */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-rose-100 px-4 sm:px-6 py-4">
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl font-semibold text-gray-900">{profile.id}</h1>
                  {profile.verified && (
                    <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
                      <ShieldCheck className="h-3.5 w-3.5" />
                      Verified Ad
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span className="inline-flex items-center gap-1">
                    <Eye className="h-4 w-4 text-gray-500" />
                    Ad Viewed: <b className="ml-1 text-gray-800">{profile.views} times</b>
                  </span>
                  <span>
                    Ad Type: <b className="ml-1 text-rose-600">{profile.adType}</b>
                  </span>
                </div>
              </div>

              {/* Body */}
              <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-6 p-4 sm:p-6">
                {/* Image carousel */}
                <div className="relative">
                  <div className="overflow-hidden rounded-lg border border-gray-200 bg-gray-50">
                    <img
                      src={profile.images[idx]}
                      alt="Profile"
                      className="aspect-[3/4] w-full object-cover"
                    />
                  </div>

                  {/* Prev / Next */}
                  {profile.images.length > 1 && (
                    <>
                      <button
                        type="button"
                        aria-label="Previous photo"
                        className="absolute left-2 top-1/2 -translate-y-1/2 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/90 shadow ring-1 ring-gray-200 hover:bg-white"
                        onClick={prev}
                      >
                        <ChevronLeft className="h-5 w-5 text-gray-700" />
                      </button>
                      <button
                        type="button"
                        aria-label="Next photo"
                        className="absolute right-2 top-1/2 -translate-y-1/2 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/90 shadow ring-1 ring-gray-200 hover:bg-white"
                        onClick={next}
                      >
                        <ChevronRight className="h-5 w-5 text-gray-700" />
                      </button>
                    </>
                  )}

                  {/* Thumbnails */}
                  {profile.images.length > 1 && (
                    <div className="mt-3 grid grid-cols-3 gap-2">
                      {profile.images.map((src, i) => (
                        <button
                          key={src}
                          type="button"
                          onClick={() => setIdx(i)}
                          className={`overflow-hidden rounded-md border ${i === idx ? "border-rose-400 ring-2 ring-rose-200" : "border-gray-200"}`}
                        >
                          <img src={src} alt={`thumb-${i}`} className="aspect-square w-full object-cover" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    {Object.entries(profile.details).map(([k, v]) => (
                      <DetailRow key={k} label={k} value={v} />
                    ))}
                  </div>

                  <div className="mt-4 rounded-lg border border-rose-100 bg-rose-50/40 p-4">
                    <h3 className="mb-2 text-base font-semibold text-rose-700">My Expectation</h3>
                    <div className="space-y-2 text-sm">
                      {Object.entries(profile.expectations).map(([k, v]) => (
                        <DetailRow key={k} label={k} value={v} />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT: Contact panel */}
            <aside className="lg:sticky lg:top-24">
              <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-5">
                <h4 className="text-sm font-semibold text-gray-800 mb-4">
                  Advertiser Contact Detail
                </h4>

                <div className="flex items-center gap-3 mb-5">
                  <img
                    src={profile.images[0]}
                    alt="avatar"
                    className="h-12 w-12 rounded-full object-cover ring-2 ring-rose-200"
                  />
                  <div>
                    <div className="font-semibold text-gray-900">{profile.id}</div>
                    <div className="text-xs text-gray-600">
                      YTM Verified On {profile.ytmVerifiedOn}
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  {(() => {
                    const isDemoProfile = /^(DEMO_|[A-Z]\d{5}-[A-Z]$)/.test(id);
                    return (
                      <button
                        onClick={handlePropose}
                        disabled={proposalSent || isDemoProfile}
                        className={`w-full inline-flex items-center justify-center gap-2 rounded-lg px-4 py-3 font-semibold shadow transition-colors ${
                          isDemoProfile
                            ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                            : proposalSent
                            ? 'bg-green-600 hover:bg-green-700 text-white'
                            : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                        }`}
                      >
                        <MessageCircle className="h-5 w-5" />
                        {isDemoProfile ? 'Demo Profile' : proposalSent ? 'Proposal Sent' : 'Propose Now'}
                      </button>
                    );
                  })()}
                  <button className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-3 font-semibold text-white shadow hover:bg-indigo-700">
                    <ShieldCheck className="h-5 w-5" />
                    Request YTM
                  </button>
                  <button className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-3 font-semibold text-white shadow hover:bg-indigo-700">
                    <Play className="h-5 w-5" />
                    Video Profile
                  </button>
                </div>

                <div className="mt-4 flex justify-center">
                  <button className="inline-flex items-center gap-2 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
                    <Heart className="h-4 w-4 text-rose-600" />
                    Add To Favourite
                  </button>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* Proposal Modal */}
      {showProposalModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Send Proposal</h3>
              <button
                onClick={closeProposalModal}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="p-6">
              <div className="mb-4">
                <label htmlFor="proposalMessage" className="block text-sm font-medium text-gray-700 mb-2">
                  Message (Optional)
                </label>
                <textarea
                  id="proposalMessage"
                  rows={4}
                  value={proposalMessage}
                  onChange={(e) => setProposalMessage(e.target.value)}
                  placeholder="Write a personalized message..."
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  maxLength={1000}
                />
                <div className="mt-1 text-xs text-gray-500">
                  {proposalMessage.length}/1000 characters
                </div>
              </div>

              {proposalError && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-600">{proposalError}</p>
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={closeProposalModal}
                  className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  Cancel
                </button>
                <button
                  onClick={sendProposal}
                  disabled={proposalLoading}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {proposalLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      Send Proposal
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
