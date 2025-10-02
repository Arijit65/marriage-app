import React from 'react';
import Sidebar from '../Components/Sidebar';
import MainHeader from '../Components/mainHeader';

const Workflow = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <MainHeader />
      
      {/* Main Content with Sidebar - Centered */}
      <div className="flex justify-center">
        <div className="flex max-w-7xl w-full">
          {/* Sidebar */}
          <Sidebar activePage="workflow" />
          
          {/* Main Content Area */}
          <div className="flex-1 p-8 bg-white">
            <div className="max-w-4xl mx-auto">
              {/* Main Heading */}
              <h1 className="text-4xl font-bold text-gray-800 mb-8">Work Flow</h1>
              
              {/* Registration Process Section */}
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Registration Process</h2>
                <p className="text-red-600 italic text-lg mb-4">
                  Creating a complete & detailed advertisement for potential marriage prospects has never been easier before.
                </p>
                <div className="text-gray-700 leading-relaxed space-y-4">
                  <p>
                    MarriagePaper allows you to try our advertisement service for free by aiding you to create a robust profile that includes all aspects of your lifestyle, family, preferences, & photos and this advertisement would be displayed on our website till marriage. <br />
                    While our free advertisement services do not allow your contact information to appear along with the advertisement, we offer various paid membership services that would allow your contact information to be available with the advertisement and also give your advertisement top-zone visibility. Select the plan that works for you and get started!
                  </p>
                </div>
              </section>

              {/* Circulation Section */}
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Circulation</h2>
                <div className="text-gray-700 leading-relaxed space-y-4">
                  <p>
                    MarriagePaper's ingenious automated search algorithms are programmed to proactively identify perfect profiles that match your preferences. Intimation regarding such unique matches are shared with both parties via email. A summary of all such automated matches is also shared on a weekly basis via SMS. Moreover, the results of such automated searches are also available at MyMarriagePaper for your consideration at a later time.
                  </p>
                </div>
              </section>

              {/* MyMarriagePaper Section */}
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">MyMarriagePaper</h2>
                <div className="text-gray-700 leading-relaxed space-y-4">
                  <p>
                    Missed to check your email notifications from your potential life partner? Worry not, for MyMarriagePaper offers you an unique comprehensive platform that allows you to take absolute control of all aspects of the matrimonial services offered by MarriagePaper. MyMarriagePaper is a single co-action page through which you can track all the notifications of the interests/proposals sent/received by you, manage, view, & edit your advertisement profile, bookmark any interesting profiles, and much more.
                  </p>
                </div>
              </section>

              {/* Privacy Settings Section */}
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Privacy Settings</h2>
                <div className="text-gray-700 leading-relaxed space-y-4">
                  <p>
                    Although it is an absolute mandate for every member to register with a phone number and email address, a member may choose to hide the Mobile Number or Email Address from public view and this preference of the member shall be honored at all times. Only the selected contact details (Mobile Number/Email Address) of the member shall be shared on advertisement display, circulation via email, & also along with 'Proposals' and even with CCP access. It is mandatory to choose either Mobile or Email or both the contact details.
                  </p>
                </div>
              </section>

              {/* Call to Action */}
              <div className="text-center mt-12">
                <h3 className="text-3xl font-bold text-gray-800 mb-4">"Post Your FREE AD"</h3>
                <a 
                  href="/register" 
                  className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-md text-lg font-medium transition-colors"
                >
                  Register Now
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Workflow; 