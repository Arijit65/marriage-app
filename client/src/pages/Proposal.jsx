import React from 'react';
import Sidebar from '../Components/Sidebar';
import MainHeader from '../Components/mainHeader';

const Proposal = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <MainHeader />
      
      {/* Main Content with Sidebar - Centered */}
      <div className="flex justify-center">
        <div className="flex max-w-7xl w-full">
          {/* Sidebar */}
          <Sidebar activePage="proposal" />
          
          {/* Main Content Area */}
          <div className="flex-1 p-8 bg-white">
            <div className="max-w-4xl mx-auto">
              {/* Main Heading */}
              <h1 className="text-4xl font-bold text-gray-800 mb-8">Proposal Services</h1>
              
              {/* Question Section */}
              <section className="mb-8">
                <div className="text-gray-700 leading-relaxed space-y-4">
                  <p className="text-lg">
                    <strong>Liked a Profile? The contact number is not available on the website but interested to talk to them. How to contact them?</strong>
                  </p>
                </div>
              </section>

              {/* Solution Section */}
              <section className="mb-8">
                <div className="text-gray-700 leading-relaxed space-y-4">
                  <p>
                    To communicate with such profiles, send a <strong>Proposal</strong>.
                  </p>
                </div>
              </section>

              {/* Privacy Policy Section */}
              <section className="mb-8">
                <div className="text-gray-700 leading-relaxed space-y-4">
                  <p>
                    As per the 'Privacy Policy' of MarriagePaper.com contact details of Advertisers remains hidden in general and for initial communication with profiles having no contact visible on the profile, you need to use our <strong>Proposal Gateway</strong>.
                  </p>
                </div>
              </section>

              {/* Reverse Scenario Section */}
              <section className="mb-8">
                <div className="text-gray-700 leading-relaxed space-y-4">
                  <p>
                    On the other hand, if you <strong>RECEIVE PROPOSAL</strong>, you can communicate directly with the sender.
                  </p>
                </div>
              </section>

              {/* How Section */}
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-red-600 mb-4">How?</h2>
                <div className="text-gray-700 leading-relaxed space-y-4">
                  <p>
                    As soon as a member initiates a Proposal, MarriagePaper triggers an <strong>INTIMATION</strong> to the other side with the interested member's Profile ID and Contact Details (Phone Number and Email ID).
                  </p>
                </div>
              </section>

              {/* Call to Action */}
              <div className="text-center mt-12">
                <h3 className="text-3xl font-bold text-gray-800 mb-4">"Get Unlimited Proposal Service."</h3>
                <a 
                  href="/upgrade" 
                  className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-md text-lg font-medium transition-colors"
                >
                  Upgrade Now
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Proposal; 