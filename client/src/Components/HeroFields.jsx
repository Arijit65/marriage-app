
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Search, Heart, Users, Star } from "lucide-react"
import { flowers, mp_logo } from '../assets/assets'
import { useAuth } from '../context/AuthContext'

const HeroRegistration = () => {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  const [formData, setFormData] = useState({
    gender: "",
    phone: "",
    ageFrom: "",
    ageTo: "",
    religion: "",
    searchId: "",
    searchGender: "bride", // Changed from isBride to radio button selection
  })

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleRegisterClick = () => {
    // Navigate to registration page with pre-filled data
    navigate('/register', { 
      state: { 
        prefilledData: {
          gender: formData.gender === "bride" ? "Female" : formData.gender === "groom" ? "Male" : "",
          phone: formData.phone,
          religion: formData.religion ? formData.religion.charAt(0).toUpperCase() + formData.religion.slice(1) : ""
        }
      } 
    })
  }

  // Handle Quick ID Search
  const handleQuickSearch = () => {
    if (!formData.searchId.trim()) {
      alert('Please enter a Profile ID');
      return;
    }
    
    // Navigate to individual profile page
    navigate(`/profile/${formData.searchId.trim()}`);
  }

  // Handle Advanced Search
  const handleAdvancedSearch = () => {
    // Build filter parameters from form data
    const filters = {};
    
    if (formData.searchGender) {
      filters.profileFor = formData.searchGender;
    }
    
    if (formData.ageFrom) {
      filters.ageFrom = formData.ageFrom;
    }
    
    if (formData.ageTo) {
      filters.ageTo = formData.ageTo;
    }
    
    if (formData.religion) {
      filters.religion = [formData.religion.charAt(0).toUpperCase() + formData.religion.slice(1)];
    }
    
    // Save to localStorage for ProfileFilters to pick up
    try {
      localStorage.setItem('heroSearchFilters', JSON.stringify(filters));
    } catch (error) {
      console.error('Error saving search filters:', error);
    }
    
    // Navigate to profiles page with filters as state
    navigate('/profiles', { state: { appliedFilters: filters } });
  }

  return (
    <section className="relative w-full min-h-[calc(100vh-120px)] lg:h-[calc(100vh-120px)] overflow-hidden">
      {/* Enhanced Background with Gradient Overlay */}
      <div className="absolute inset-0 w-full h-full">
        <div
          className="w-full h-full bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage:
              `url(${flowers})`,
            filter: "blur(8px)",
            transform: "scale(1.1)",
          }}
        />
        {/* Enhanced gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/50 to-red-900/30"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
      </div>

      {/* Floating Elements for Visual Interest */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-2 h-2 bg-red-400/30 rounded-full animate-pulse"></div>
        <div className="absolute top-40 right-20 w-3 h-3 bg-white/20 rounded-full animate-pulse delay-1000"></div>
        <div className="absolute bottom-40 left-20 w-1 h-1 bg-red-300/40 rounded-full animate-pulse delay-500"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 w-full h-full flex items-center px-4 sm:px-6 lg:px-8 py-6 lg:py-4">
        <div className="max-w-7xl mx-auto w-full">
          <div className={`grid grid-cols-1 ${!isAuthenticated ? 'lg:grid-cols-2' : 'lg:grid-cols-1'} gap-8 lg:gap-8 items-center ${!isAuthenticated ? 'lg:items-center' : 'lg:items-center justify-center'}`}>
            {/* Left: Enhanced Registration Card - Only show when NOT authenticated */}
            {!isAuthenticated && (
            <div className="flex justify-center lg:justify-start order-1 lg:order-1">
              <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden transform hover:scale-[1.02] transition-all duration-300">
                {/* Enhanced Header with Gradient */}
                <div className="bg-gradient-to-br from-rose-500 via-red-600 to-pink-600 px-6 py-5 text-center text-white relative overflow-hidden">
                  {/* Decorative Elements */}
                  <div className="absolute top-0 left-0 w-32 h-32 bg-white/10 rounded-full -translate-x-16 -translate-y-16"></div>
                  <div className="absolute bottom-0 right-0 w-40 h-40 bg-white/10 rounded-full translate-x-16 translate-y-16"></div>
                  
                  <div className="relative z-10">
                    <div className="flex justify-center mb-2">
                      <div className="p-1 bg-white/20 backdrop-blur-sm rounded-xl shadow-lg">
                        <img src={mp_logo} alt="MP Logo" className="w-8 h-8 object-contain" />
                      </div>
                    </div>
                    <h3 className="text-xl font-bold tracking-wide mb-1">Free Registration</h3>
                    <p className="text-red-50 font-medium text-sm">✨ Instant Approval ✨</p>
                  </div>
                </div>

                {/* Enhanced Form Body */}
                <div className="p-6 space-y-4 bg-gradient-to-b from-gray-50 to-white">
                  {/* Gender Selection with Better Visibility */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-gray-800">
                      I am looking for
                    </label>
                    <div className="grid grid-cols-2 gap-2.5">
                      <button
                        type="button"
                        onClick={() => handleInputChange("gender", "bride")}
                        className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all duration-200 ${
                          formData.gender === "bride"
                            ? "border-rose-500 bg-rose-50 shadow-lg shadow-rose-200"
                            : "border-gray-300 bg-white hover:border-rose-300 hover:bg-rose-50/50"
                        }`}
                      >
                        <span className="text-2xl mb-0.5">👰</span>
                        <span className={`text-xs font-semibold ${
                          formData.gender === "bride" ? "text-rose-600" : "text-gray-700"
                        }`}>
                          Bride
                        </span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleInputChange("gender", "groom")}
                        className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all duration-200 ${
                          formData.gender === "groom"
                            ? "border-rose-500 bg-rose-50 shadow-lg shadow-rose-200"
                            : "border-gray-300 bg-white hover:border-rose-300 hover:bg-rose-50/50"
                        }`}
                      >
                        <span className="text-2xl mb-0.5">🤵</span>
                        <span className={`text-xs font-semibold ${
                          formData.gender === "groom" ? "text-rose-600" : "text-gray-700"
                        }`}>
                          Groom
                        </span>
                      </button>
                    </div>
                  </div>

                  {/* Phone Number with Enhanced Styling */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-gray-800">
                      Phone Number *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-500 text-sm">📱</span>
                      </div>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                        placeholder="Enter your mobile number"
                        className="w-full pl-10 pr-3 py-2.5 border-2 border-gray-300 rounded-xl text-sm font-medium focus:outline-none focus:border-rose-500 focus:ring-4 focus:ring-rose-100 transition-all duration-200 bg-white"
                      />
                    </div>
                  </div>

                  {/* Enhanced Tagline */}
                  <div className="flex items-center justify-center gap-2 py-1">
                    <div className="h-px bg-gradient-to-r from-transparent via-rose-300 to-transparent flex-1"></div>
                    <div className="flex items-center gap-1.5">
                      <Star className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
                      <span className="text-xs font-bold text-gray-700 tracking-wide">
                        FINDING MATCH MADE EASY
                      </span>
                      <Star className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
                    </div>
                    <div className="h-px bg-gradient-to-r from-transparent via-rose-300 to-transparent flex-1"></div>
                  </div>

                  {/* Enhanced Register Button */}
                  <button 
                    type="button"
                    onClick={handleRegisterClick}
                    className="w-full bg-gradient-to-r from-rose-500 via-red-600 to-pink-600 hover:from-rose-600 hover:via-red-700 hover:to-pink-700 text-white py-3 rounded-xl font-bold text-sm transition-all duration-300 transform hover:scale-[1.02] hover:shadow-2xl shadow-lg active:scale-95"
                  >
                    Register Now - It's Free!
                  </button>

                  {/* Enhanced Video Advertisement Section */}
                  <div className="pt-3 text-center space-y-1 border-t-2 border-dashed border-gray-200">
                    <div className="flex items-center justify-center gap-1.5">
                      <div className="w-1.5 h-1.5 bg-rose-500 rounded-full animate-pulse"></div>
                      <p className="text-xs font-bold text-gray-800 tracking-wide">
                        THINK VIDEO ADVERTISEMENT
                      </p>
                      <div className="w-1.5 h-1.5 bg-rose-500 rounded-full animate-pulse"></div>
                    </div>
                    <p className="text-xs font-semibold text-rose-600 bg-rose-50 py-1 px-2.5 rounded-full inline-block">
                      🚀 For Faster Response
                    </p>
                  </div>
                </div>
              </div>
            </div>
            )}

            {/* Right: Enhanced Promo Text & Search */}
            <div className={`flex flex-col justify-center space-y-4 lg:space-y-6 order-2 lg:order-2 px-2 lg:px-0 ${isAuthenticated ? 'max-w-4xl mx-auto' : ''}`}>
              {/* Enhanced Headline Block */}
              <div className={`space-y-2 lg:space-y-3 ${isAuthenticated ? 'text-center' : 'text-center lg:text-left'}`}>
                <div className="inline-flex items-center gap-2 bg-red-500/20 backdrop-blur-sm px-3 py-1.5 rounded-full border border-red-400/30">
                  <div className="w-1.5 h-1.5 bg-red-400 rounded-full animate-pulse"></div>
                  <p className="text-red-300 font-semibold text-sm">Advertise</p>
                </div>

                <h2 className="text-2xl sm:text-3xl lg:text-5xl font-extrabold text-white leading-tight">
                  Profile In{" "}
                  <span className="bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent">Video</span>
                </h2>

                <div className={`flex items-center ${isAuthenticated ? 'justify-center' : 'justify-center lg:justify-start'} gap-3`}>
                  <div className="h-px bg-gradient-to-r from-transparent to-red-400 flex-1 max-w-16"></div>
                  <p className="text-red-400 font-extrabold text-3xl">&</p>
                  <div className="h-px bg-gradient-to-l from-transparent to-red-400 flex-1 max-w-16"></div>
                </div>

                <h3 className="text-xl sm:text-2xl lg:text-4xl font-extrabold bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent">
                  Get Matching Fast
                </h3>
              </div>

              {/* Enhanced Search Section */}
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 lg:p-5 border border-white/20 space-y-3 lg:space-y-4">
                {/* ID Search */}
                <div className="space-y-1.5 lg:space-y-2">
                  <h4 className="text-white font-semibold flex items-center gap-2 text-sm">
                    <Search className="w-4 h-4" />
                    Quick ID Search
                  </h4>
                  <div className="flex flex-col sm:flex-row gap-2 lg:gap-0">
                    <input
                      type="text"
                      value={formData.searchId}
                      onChange={(e) => handleInputChange("searchId", e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleQuickSearch()}
                      placeholder="Enter Profile ID (e.g., B00009-F)"
                      className="flex-1 border-2 border-gray-300 rounded-xl sm:rounded-l-xl sm:rounded-r-none px-3 py-2 text-sm focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all duration-200"
                    />
                    <button 
                      onClick={handleQuickSearch}
                      className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-6 py-2 rounded-xl sm:rounded-r-xl sm:rounded-l-none text-sm font-semibold transition-all duration-300 transform hover:scale-105"
                    >
                      Go
                    </button>
                  </div>
                </div>

                {/* Advanced Search */}
                <div className="space-y-2 lg:space-y-3">
                  <h4 className="text-white font-semibold flex items-center gap-2 text-sm">
                    <Users className="w-4 h-4" />
                    Advanced Search
                  </h4>

                  {/* Search Filters */}
                  <div className="grid grid-cols-1 gap-2 lg:grid-cols-2 lg:gap-2">
                    {/* Gender Selection - Radio Buttons */}
                    <div className="flex items-center space-x-4 text-white">
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="radio"
                          name="searchGender"
                          value="bride"
                          checked={formData.searchGender === "bride"}
                          onChange={(e) => handleInputChange("searchGender", e.target.value)}
                          className="w-4 h-4 text-red-600 bg-white border-gray-300 focus:ring-red-500 focus:ring-2"
                        />
                        <span className="font-medium text-sm">👰 Bride</span>
                      </label>
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="radio"
                          name="searchGender"
                          value="groom"
                          checked={formData.searchGender === "groom"}
                          onChange={(e) => handleInputChange("searchGender", e.target.value)}
                          className="w-4 h-4 text-red-600 bg-white border-gray-300 focus:ring-red-500 focus:ring-2"
                        />
                        <span className="font-medium text-sm">🤵 Groom</span>
                      </label>
                    </div>

                    {/* Age Range */}
                    <div className="flex gap-2">
                      <input
                        type="number"
                        value={formData.ageFrom}
                        onChange={(e) => handleInputChange("ageFrom", e.target.value)}
                        placeholder="Age From"
                        min="18"
                        max="100"
                        className="w-full border-2 border-gray-300 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all duration-200"
                      />
                      <input
                        type="number"
                        value={formData.ageTo}
                        onChange={(e) => handleInputChange("ageTo", e.target.value)}
                        placeholder="Age To"
                        min="18"
                        max="100"
                        className="w-full border-2 border-gray-300 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all duration-200"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 lg:flex-row lg:gap-2">
                    {/* Religion */}
                    <select
                      value={formData.religion}
                      onChange={(e) => handleInputChange("religion", e.target.value)}
                      className="flex-1 border-2 border-gray-300 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all duration-200"
                    >
                      <option value="">Select Religion</option>
                      <option value="hindu">Hindu</option>
                      <option value="muslim">Muslim</option>
                      <option value="christian">Christian</option>
                      <option value="sikh">Sikh</option>
                      <option value="buddhist">Buddhist</option>
                      <option value="jain">Jain</option>
                    </select>

                    {/* Search Button */}
                    <button 
                      onClick={handleAdvancedSearch}
                      className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-6 py-1.5 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl whitespace-nowrap text-sm"
                    >
                      Search Matches
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HeroRegistration
