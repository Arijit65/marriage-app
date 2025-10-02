import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Sidebar = ({ activePage = 'workflow' }) => {
  const [currentAdIndex, setCurrentAdIndex] = useState(0);

  const ads = [
    {
      id: 1,
      type: "Groom",
      age: "28years",
      details: "Hindu, Bengali, General, BA, Software Engineer, 6'2\", Fair, Bangalore",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
    },
    {
      id: 2,
      type: "Bride",
      age: "32years/5'",
      details: "Hindu, Bengali, Kayastha Bengali, MA, Marketing Manager, 5'6\", Fair, Delhi",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
    },
    {
      id: 3,
      type: "Bride",
      age: "25years",
      details: "Hindu, Punjabi, General, MBA, Marketing Manager, 5'6\", Fair, Delhi",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
    },
    {
      id: 4,
      type: "Groom",
      age: "34years/",
      details: "Hindu, Bengali, khatriya, Diploma, IT Professional, 5'10\", Medium, Mumbai",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
    },
    {
      id: 5,
      type: "Groom",
      age: "30years",
      details: "Hindu, Marathi, General, BTech, IT Professional, 5'10\", Medium, Mumbai",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentAdIndex((prev) => (prev + 1) % ads.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [ads.length]);

  const nextAd = () => {
    setCurrentAdIndex((prev) => (prev + 1) % ads.length);
  };

  const prevAd = () => {
    setCurrentAdIndex((prev) => (prev - 1 + ads.length) % ads.length);
  };

  return (
    <div className="w-80 bg-white shadow-lg min-h-screen overflow-y-auto">
      {/* MarriagePaper Services Section */}
      <div className="bg-blue-900 text-white p-4">
        <h3 className="text-lg font-semibold mb-4">MarriagePaper Services</h3>
        <nav className="space-y-2">
          <a 
            href="/workflow" 
            className={`block py-2 px-3 rounded transition-colors ${
              activePage === 'workflow' 
                ? 'bg-blue-800 text-white font-medium' 
                : 'hover:bg-blue-800'
            }`}
          >
            Our Workflow
          </a>
          <a 
            href="/proposal" 
            className={`block py-2 px-3 rounded transition-colors ${
              activePage === 'proposal' 
                ? 'bg-blue-800 text-white font-medium' 
                : 'hover:bg-blue-800'
            }`}
          >
            Proposal
          </a>
          <a 
            href="/yet-to-marry" 
            className={`block py-2 px-3 rounded transition-colors ${
              activePage === 'yet-to-marry' 
                ? 'bg-blue-800 text-white font-medium' 
                : 'hover:bg-blue-800'
            }`}
          >
            Yet-To-Marry
          </a>
          <a 
            href="/announcement" 
            className={`block py-2 px-3 rounded transition-colors ${
              activePage === 'announcement' 
                ? 'bg-blue-800 text-white font-medium' 
                : 'hover:bg-blue-800'
            }`}
          >
            Announcement
          </a>
        </nav>
      </div>

      {/* Latest Posted Ads Section */}
      <div className="p-4">
        <div className="bg-blue-900 text-white p-3 rounded-t">
          <h3 className="text-lg font-semibold">Latest Posted Ads</h3>
        </div>
        
        {/* Ad Carousel */}
        <div className="bg-gray-200 p-4 relative">
          <div className="relative h-48 bg-gray-300 rounded overflow-hidden">
            {/* Actual Image */}
            <img 
              src={ads[currentAdIndex].image}
              alt="Advertisement"
              className="w-full h-full object-cover"
            />
            
            {/* Navigation Arrows */}
            <button 
              onClick={prevAd}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white p-1 rounded-full shadow-md z-10"
            >
              <ChevronLeft className="w-4 h-4 text-gray-700" />
            </button>
            <button 
              onClick={nextAd}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white p-1 rounded-full shadow-md z-10"
            >
              <ChevronRight className="w-4 h-4 text-gray-700" />
            </button>
          </div>
        </div>

        {/* Ad Card */}
        <div className="bg-white border border-gray-200 rounded-b shadow-sm">
          <div className="bg-red-600 text-white px-3 py-1 text-sm font-medium">
            {ads[currentAdIndex].type} - {ads[currentAdIndex].age}
          </div>
          <div className="p-3">
            <p className="text-gray-800 text-sm leading-relaxed">
              {ads[currentAdIndex].details}
            </p>
            <a 
              href="#" 
              className="text-red-600 text-sm font-medium hover:text-red-800 transition-colors inline-block mt-2"
            >
              View Profile
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar; 