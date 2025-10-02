import React from 'react';
import Sidebar from '../Components/Sidebar';
import MainHeader from '../Components/mainHeader';

const YetToMarry = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <MainHeader />
      
      {/* Main Content with Sidebar - Centered */}
      <div className="flex justify-center">
        <div className="flex max-w-7xl w-full">
          {/* Sidebar */}
          <Sidebar activePage="yet-to-marry" />
          
          {/* Main Content Area */}
          <div className="flex-1 p-8 bg-white">
            <div className="max-w-4xl mx-auto">
              {/* Main Heading */}
              <h1 className="text-4xl font-bold text-gray-800 mb-8">Yet To Marry (YTM)</h1>
              
              {/* Content Sections */}
              <section className="mb-8">
                <div className="text-gray-700 leading-relaxed space-y-6">
                  <p>
                    At MarriagePaper, we strive to keep our member's profiles updated with genuine availability statuses. We make this happen by ensuring that all our members are active at least once within the past 30 days on our website.
                  </p>
                  
                  <p>
                    This unique assessment allows us to ensure that you don't waste your precious time in contacting a member who is no longer available.
                  </p>
                  
                  <p>
                    The YTM status awards top-zone visibility to a member's profile and the member's advertisement appears as 'YTM Certified' along with the last date the member had been active on MarriagePaper.
                  </p>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default YetToMarry; 