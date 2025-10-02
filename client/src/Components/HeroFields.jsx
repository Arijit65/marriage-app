
import { useState } from "react"
import { Search, Heart, Users, Star } from "lucide-react"

const HeroRegistration = () => {
  const [formData, setFormData] = useState({
    gender: "",
    phone: "",
    ageFrom: "",
    ageTo: "",
    religion: "",
    searchId: "",
    isBride: false,
  })

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <section className="relative w-full h-[calc(100vh-120px)] overflow-hidden">
      {/* Enhanced Background with Gradient Overlay */}
      <div className="absolute inset-0 w-full h-full">
        <div
          className="w-full h-full bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage:
              "url(/src/assets/flowers.jpg)",
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
      <div className="relative z-10 w-full h-full flex items-center px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-7xl mx-auto w-full">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left: Enhanced Registration Card */}
            <div className="flex justify-center lg:justify-start">
              <div className="w-full max-w-sm bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20 overflow-hidden transform hover:scale-105 transition-all duration-300">
                {/* Enhanced Header with Gradient */}
            <div className="bg-gradient-to-r from-red-600 to-red-700 px-6 py-6 text-center text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-transparent"></div>
                <div className="relative z-10 mb-2">
                    <div className="flex justify-center mb-2">
                      <div className="p-2 bg-white/20 rounded-full">
                        <Heart className="w-5 h-5" />
                      </div>
                    </div>
                    <h3 className="text-xl font-bold tracking-wide mb-1">Free Registration</h3>
                    <p className="text-red-100 font-medium text-sm">Instant Approval</p>
                </div>
              

                {/* Enhanced Form Body */}
                <div className="p-5 space-y-4 bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20">
                  {/* Gender Selection with Icons */}
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700">Gender</label>
                    <select
                      value={formData.gender}
                      onChange={(e) => handleInputChange("gender", e.target.value)}
                      className="w-full border-2 border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all duration-200 bg-white"
                    >
                      <option value="">Select Gender</option>
                      <option value="bride">👰 Bride</option>
                      <option value="groom">🤵 Groom</option>
                    </select>
                  </div>

                  {/* Phone Number with Enhanced Styling */}
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700">Phone Number</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      placeholder="Enter your phone number"
                      className="w-full border-2 border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all duration-200"
                    />
                  </div>

                  {/* Enhanced Tagline */}
                  <div className="text-center py-1">
                    <p className="text-xs font-semibold text-gray-600 flex items-center justify-center gap-2">
                      <Star className="w-3 h-3 text-red-500" />
                      Finding Match Made Easy
                      <Star className="w-3 h-3 text-red-500" />
                    </p>
                  </div>

                  {/* Enhanced Register Button */}
                  <button className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white py-2.5 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
                    Register Now
                  </button>

                  {/* Enhanced Video Advertisement Section */}
                  <div className="pt-3 text-center space-y-1 border-t border-gray-100">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></div>
                      <p className="text-xs font-semibold text-gray-800">Think Video Advertisement</p>
                      <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></div>
                    </div>
                    <p className="text-xs text-gray-600">For Fast Response</p>
                  </div>
                </div>
              </div>
            </div>
            </div>

            {/* Right: Enhanced Promo Text & Search */}
            <div className="flex flex-col justify-center space-y-6">
              {/* Enhanced Headline Block */}
              <div className="space-y-3 text-center lg:text-left">
                <div className="inline-flex items-center gap-2 bg-red-500/20 backdrop-blur-sm px-3 py-1.5 rounded-full border border-red-400/30">
                  <div className="w-1.5 h-1.5 bg-red-400 rounded-full animate-pulse"></div>
                  <p className="text-red-300 font-semibold text-sm">Advertise</p>
                </div>

                <h2 className="text-3xl lg:text-5xl font-extrabold text-white leading-tight">
                  Profile In{" "}
                  <span className="bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent">Video</span>
                </h2>

                <div className="flex items-center justify-center lg:justify-start gap-3">
                  <div className="h-px bg-gradient-to-r from-transparent to-red-400 flex-1 max-w-16"></div>
                  <p className="text-red-400 font-extrabold text-3xl">&</p>
                  <div className="h-px bg-gradient-to-l from-transparent to-red-400 flex-1 max-w-16"></div>
                </div>

                <h3 className="text-2xl lg:text-4xl font-extrabold bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent">
                  Get Matching Fast
                </h3>
              </div>

              {/* Enhanced Search Section */}
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 border border-white/20 space-y-4">
                {/* ID Search */}
                <div className="space-y-2">
                  <h4 className="text-white font-semibold flex items-center gap-2 text-sm">
                    <Search className="w-4 h-4" />
                    Quick ID Search
                  </h4>
                  <div className="flex">
                    <input
                      type="text"
                      value={formData.searchId}
                      onChange={(e) => handleInputChange("searchId", e.target.value)}
                      placeholder="Enter Profile ID"
                      className="flex-1 border-2 border-gray-300 rounded-l-xl px-3 py-2 text-sm focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all duration-200"
                    />
                    <button className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-6 rounded-r-xl text-sm font-semibold transition-all duration-300 transform hover:scale-105">
                      Go
                    </button>
                  </div>
                </div>

                {/* Advanced Search */}
                <div className="space-y-3">
                  <h4 className="text-white font-semibold flex items-center gap-2 text-sm">
                    <Users className="w-4 h-4" />
                    Advanced Search
                  </h4>

                  {/* Search Filters */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-2">
                    {/* Bride Checkbox */}
                    <label className="flex items-center space-x-2 text-white cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.isBride}
                        onChange={(e) => handleInputChange("isBride", e.target.checked)}
                        className="w-4 h-4 text-red-600 bg-white border-gray-300 rounded focus:ring-red-500 focus:ring-2"
                      />
                      <span className="font-medium text-sm">Bride</span>
                    </label>

                    {/* Age Range */}
                    <div className="flex gap-2">
                      <input
                        type="number"
                        value={formData.ageFrom}
                        onChange={(e) => handleInputChange("ageFrom", e.target.value)}
                        placeholder="Age From"
                        className="w-full border-2 border-gray-300 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all duration-200"
                      />
                      <input
                        type="number"
                        value={formData.ageTo}
                        onChange={(e) => handleInputChange("ageTo", e.target.value)}
                        placeholder="Age To"
                        className="w-full border-2 border-gray-300 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all duration-200"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2">
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
                    <button className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-6 py-1.5 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl whitespace-nowrap text-sm">
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
