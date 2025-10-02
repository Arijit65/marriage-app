import React, { useState, useEffect } from "react";
import {
  Menu, X, Home, Edit3, Image as ImageIcon, BarChart2, ListChecks,
  Eye, CheckCircle, ExternalLink, ChevronRight, Bookmark, Upload, CreditCard,
  LogOut, User, Facebook, Link as LinkIcon, Youtube, Pencil
} from "lucide-react";
import { useAuth } from "../../context";
import { useNavigate } from 'react-router-dom';
import EditProfile from './EditProfile';

const SidebarItem = ({ icon: Icon, label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 text-sm rounded-lg transition
      ${active ? "bg-emerald-700/20 text-white" : "text-slate-200 hover:bg-white/10"}`}
  >
    <Icon className="h-4 w-4" />
    <span className="truncate">{label}</span>
  </button>
);

export default function Dashboard() {
  const [open, setOpen] = useState(true);
  const [currentView, setCurrentView] = useState('dashboard'); // 'dashboard', 'editProfile', 'myProfile', etc.
  const { user, isAuthenticated, loading, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Helper functions to extract profile data
  const getAge = () => {
    if (!user?.date_of_birth) return 'Age not set';
    const birth = new Date(user.date_of_birth);
    const today = new Date();
    const age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      return age - 1;
    }
    return age;
  };

  const getMaritalStatus = () => {
    return user?.userProfile?.personal_info?.marital_status || 'Not specified';
  };

  const getReligion = () => {
    return user?.userProfile?.religious_info?.religion || 'Not specified';
  };

  const getCaste = () => {
    return user?.userProfile?.religious_info?.caste || 'Not specified';
  };

  const getMotherTongue = () => {
    return user?.userProfile?.additional_info?.native_language || 'Not specified';
  };

  const getEducation = () => {
    return user?.userProfile?.education_career_info?.education || 'Not specified';
  };

  const getOccupation = () => {
    return user?.userProfile?.education_career_info?.occupation || 'Not specified';
  };

  const getAboutMe = () => {
    return user?.userProfile?.about_me || 'No description available';
  };

  const getFamilyDetails = () => {
    const familyInfo = user?.userProfile?.family_info;
    if (!familyInfo) return 'Family details not provided';

    const details = [];
    if (familyInfo.type) details.push(`Family Type: ${familyInfo.type}`);
    if (familyInfo.status) details.push(`Status: ${familyInfo.status}`);
    if (familyInfo.father_name) details.push(`Father: ${familyInfo.father_name}`);
    if (familyInfo.mother_name) details.push(`Mother: ${familyInfo.mother_name}`);

    return details.length > 0 ? details.join(', ') : 'Family details not provided';
  };

  const getLocation = () => {
    const location = user?.userProfile?.location_info;
    if (!location) return 'Location not specified';

    const parts = [];
    if (location.city) parts.push(location.city);
    if (location.state) parts.push(location.state);
    if (location.country) parts.push(location.country);

    return parts.length > 0 ? parts.join(', ') : 'Location not specified';
  };

  // Function to render the main content based on current view
  const renderMainContent = () => {
    switch (currentView) {
      case 'editProfile':
        return <EditProfile user={user} />;
      case 'myProfile':
        return (
          <div className="text-center py-16">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">My Profile View</h2>
            <p className="text-gray-600">Profile view coming soon...</p>
          </div>
        );
      case 'additionalPhoto':
        return (
          <div className="text-center py-16">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Additional Photo</h2>
            <p className="text-gray-600">Photo management coming soon...</p>
          </div>
        );
      case 'dashboard':
      default:
        return renderDashboardContent();
    }
  };

  // Function to render the original dashboard content
  const renderDashboardContent = () => (
    <>
      {/* Breadcrumb */}
      <div className="text-sm text-slate-500 flex items-center gap-2 mb-4">
        <a className="hover:text-rose-600 inline-flex items-center gap-1" href="#">
          Back to Website
        </a>
      </div>

      <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">
        My MarriagePaper ({user.id || 'User Profile'})
      </h1>

      {/* Yellow AD Matter Panel */}
      <section className="rounded-xl border border-slate-200 overflow-hidden bg-white">
        <div className="bg-amber-400/90 px-4 md:px-6 py-5">
          <div className="grid grid-cols-1 md:grid-cols-[220px_1fr_auto] gap-5 items-center">
            {/* Poster */}
            <div className="bg-white/60 rounded-lg p-3">
              <img
                src={
                  user.userProfile?.profile_photo ?
                    `${import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000'}${user.userProfile.profile_photo}` :
                  (user.userProfile?.photos && user.userProfile.photos[0]) ?
                    `${import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000'}${user.userProfile.photos[0]}` :
                  "https://dummyimage.com/300x300/eeeeee/333&text=Profile+Photo"
                }
                className="w-full rounded"
                alt="Profile photo"
                onError={(e) => {
                  e.target.src = "https://dummyimage.com/300x300/eeeeee/333&text=Profile+Photo";
                }}
              />
            </div>

            {/* Details */}
            <ul className="text-sm leading-7 text-slate-800">
              <li>
                <span className="font-semibold">{user.gender || 'Profile Type'}</span>,
                {getAge()},
                {getMaritalStatus()}
              </li>
              <li>
                <span className="font-semibold">Ethnicity:</span> {getReligion()},
                {getCaste()},
                Mother Tongue:- {getMotherTongue()}
              </li>
              <li>
                <span className="font-semibold">Qualification:</span> {getEducation()}
              </li>
              <li>
                <span className="font-semibold">Profession:</span> {getOccupation()}
              </li>
              <li>
                <span className="font-semibold">Personal Details:</span> {getAboutMe()}
              </li>
              <li>
                <span className="font-semibold">Our Family:</span> {getFamilyDetails()}
              </li>
              <li>
                <span className="font-semibold">Resident of:</span> {getLocation()}
              </li>
            </ul>

            {/* Actions */}
            <div className="flex flex-col gap-3">
              <button
                onClick={() => setCurrentView('editProfile')}
                className="inline-flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-lg hover:bg-slate-800"
              >
                <Pencil className="h-4 w-4" />
                Modify
              </button>
              <button className="inline-flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700">
                <SearchIcon className="h-4 w-4" />
                Find Match
              </button>
            </div>
          </div>

          {/* Social strip */}
          <div className="bg-emerald-600 text-white px-4 md:px-6 py-3 flex items-center gap-3">
            <span className="font-medium">View your profile @:</span>
            <div className="flex items-center gap-2">
              <button className="w-8 h-8 rounded-full bg-white/10 grid place-items-center hover:bg-white/20">
                <LinkIcon className="h-4 w-4" />
              </button>
              <button className="w-8 h-8 rounded-full bg-white/10 grid place-items-center hover:bg-white/20">
                <Facebook className="h-4 w-4" />
              </button>
              <button className="w-8 h-8 rounded-full bg-white/10 grid place-items-center hover:bg-white/20">
                <Youtube className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Blue info bars */}
          <div className="divide-y divide-slate-200">
            <div className="flex items-center justify-between px-4 md:px-6 py-3 bg-sky-50">
              <span className="text-sm text-slate-700">
                Check where your Advertisement was circulated
              </span>
              <button className="inline-flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-lg hover:bg-slate-800">
                Check
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            <div className="flex items-center justify-between px-4 md:px-6 py-3 bg-sky-50">
              <span className="text-sm text-slate-700">
                Check details of Proposal Received/Sent
              </span>
              <button className="inline-flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-lg hover:bg-slate-800">
                Check
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Video Upload Section */}
      <section className="bg-white rounded-xl border border-slate-200 p-6 mt-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-slate-900">My Videos(For social media use only)</h2>
          <span className="text-sm text-slate-500">Upload up to 3 videos</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Video Upload Slots */}
          {[1, 2, 3].map((slot) => (
            <div key={slot} className="relative">
              <div className="aspect-video bg-slate-50 border-2 border-dashed border-slate-300 rounded-lg flex flex-col items-center justify-center hover:border-emerald-400 transition-colors cursor-pointer group">
                <div className="text-center">
                  <Upload className="h-8 w-8 text-slate-400 mx-auto mb-2 group-hover:text-emerald-500" />
                  <p className="text-sm text-slate-600 mb-1">Upload Video {slot}</p>
                  <p className="text-xs text-slate-500">MP4, MOV up to 50MB</p>
                </div>
                <input
                  type="file"
                  accept="video/*"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  onChange={(e) => {
                    // Handle video upload logic here
                    console.log(`Video ${slot} selected:`, e.target.files[0]);
                  }}
                />
              </div>

              {/* Video Preview Placeholder */}
              <div className="mt-2 hidden">
                <video
                  className="w-full aspect-video rounded-lg"
                  controls
                  poster="https://dummyimage.com/300x200/eeeeee/333&text=Video+Preview"
                >
                  <source src="#" type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-sm text-slate-600">Video {slot}</span>
                  <button className="text-rose-600 hover:text-rose-700 text-sm">
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
          <div className="flex items-start gap-3">
            <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center mt-0.5">
              <span className="text-xs text-blue-600 font-medium">!</span>
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-medium text-blue-900 mb-1">Video Guidelines</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Keep videos professional and appropriate</li>
                <li>• Maximum file size: 50MB per video</li>
                <li>• Supported formats: MP4, MOV, AVI</li>
                <li>• Videos will be reviewed before going live</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* KPI Cards */}
      <section className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="text-sm text-slate-600">My AD Views</div>
          <div className="mt-3 text-5xl font-semibold text-rose-600">
            {user.profile_stats?.views_count || 0}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="text-sm text-slate-600">My AD Status</div>
          <div className="mt-3 text-4xl font-semibold text-slate-900">
            <span className={`${user.is_active ? 'text-emerald-600' : 'text-rose-600'}`}>
              {user.is_active ? 'Active' : 'Inactive'}
            </span>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="text-sm text-slate-600">My CCP Balance</div>
          <div className="mt-3 text-5xl font-semibold text-slate-900">
            {user.profile_stats?.proposals_sent || 0}
          </div>
          <button className="mt-4 text-sm text-emerald-700 inline-flex items-center gap-1">
            View Details <ExternalLink className="h-4 w-4" />
          </button>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="text-sm text-slate-600">Proposal Monthly Balance</div>
          <div className="mt-3 text-5xl font-semibold text-rose-600">
            {user.profile_stats?.proposals_received || 0}
          </div>
          <button className="mt-4 text-sm text-emerald-700 inline-flex items-center gap-1">
            View Details <ExternalLink className="h-4 w-4" />
          </button>
        </div>
      </section>
    </>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
          <p className="mt-4 text-slate-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    navigate('/login');
    return null;
  }

  // Debug log to see what user data we have
  console.log('🔍 Dashboard - User data:', user);
  console.log('🔍 Dashboard - User profile:', user?.userProfile);
  console.log('🔍 Dashboard - User keys:', user ? Object.keys(user) : 'No user');
  console.log('🔍 Dashboard - isAuthenticated:', isAuthenticated);
  console.log('🔍 Dashboard - loading:', loading);

  // Debug image URL construction
  if (user?.userProfile) {
    const profilePhoto = user.userProfile.profile_photo;
    const photos = user.userProfile.photos;
    const baseUrl = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';

    console.log('🖼️ Profile photo field:', profilePhoto);
    console.log('🖼️ Photos array:', photos);
    console.log('🖼️ Base URL:', baseUrl);

    if (profilePhoto) {
      console.log('🖼️ Profile photo URL:', `${baseUrl}${profilePhoto}`);
    } else if (photos && photos[0]) {
      console.log('🖼️ First photo URL:', `${baseUrl}${photos[0]}`);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top Nav */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-slate-200">
        <div className="mx-auto max-w-7xl px-4 lg:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => setOpen(!open)} className="lg:hidden p-2 rounded hover:bg-slate-100">
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
            <span className="hidden sm:block">My MarriagePaper ({user.id || 'User'})</span>
            <div className="w-9 h-9 rounded-full bg-rose-100 grid place-items-center text-rose-600">
              <User className="h-5 w-5" />
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 lg:px-6 py-4 grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6">
        {/* Sidebar */}
        <aside className={`lg:sticky lg:top-20 self-start ${open ? "block" : "hidden lg:block"}`}>
          <div className="bg-slate-900 rounded-2xl p-3 text-slate-100">
            <div className="px-3 py-3 text-xs uppercase tracking-wider text-slate-400">
              Menu
            </div>
            <div className="space-y-1">
              <SidebarItem
                icon={Home}
                label="My MarriagePaper"
                active={currentView === 'dashboard'}
                onClick={() => setCurrentView('dashboard')}
              />
              <SidebarItem
                icon={Eye}
                label="My Profile View"
                active={currentView === 'myProfile'}
                onClick={() => setCurrentView('myProfile')}
              />
              <SidebarItem
                icon={Edit3}
                label="Edit My Ad"
                active={currentView === 'editProfile'}
                onClick={() => setCurrentView('editProfile')}
              />
              <SidebarItem
                icon={ImageIcon}
                label="Additional Photo"
                active={currentView === 'additionalPhoto'}
                onClick={() => setCurrentView('additionalPhoto')}
              />
              <SidebarItem
                icon={BarChart2}
                label="AD Circulation Report"
                active={currentView === 'circulationReport'}
                onClick={() => setCurrentView('circulationReport')}
              />
              <SidebarItem
                icon={ListChecks}
                label="My Proposals Tracker"
                active={currentView === 'proposalsTracker'}
                onClick={() => setCurrentView('proposalsTracker')}
              />
              <SidebarItem
                icon={CreditCard}
                label="My CCP Tracker"
                active={currentView === 'ccpTracker'}
                onClick={() => setCurrentView('ccpTracker')}
              />
              <SidebarItem
                icon={Upload}
                label="My Photo Request Tracker"
                active={currentView === 'photoRequestTracker'}
                onClick={() => setCurrentView('photoRequestTracker')}
              />
              <SidebarItem
                icon={CreditCard}
                label="My Payments History"
                active={currentView === 'paymentsHistory'}
                onClick={() => setCurrentView('paymentsHistory')}
              />
              <SidebarItem
                icon={Bookmark}
                label="My Bookmarks"
                active={currentView === 'bookmarks'}
                onClick={() => setCurrentView('bookmarks')}
              />
              <SidebarItem
                icon={LogOut}
                label="Logout"
                onClick={handleLogout}
              />
            </div>
          </div>
        </aside>

        {/* Main */}
        <main>
          {renderMainContent()}
        </main>
      </div>
    </div>
  );
}

function SearchIcon(props) {
  return <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" {...props}>
    <path stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      d="m21 21-4.35-4.35M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z" />
  </svg>;
}
