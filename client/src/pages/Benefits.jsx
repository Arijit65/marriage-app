/*  BenefitsSection.jsx - Three-column benefits layout  */

import React from "react";
import { Check, ArrowRight } from "lucide-react";
import MainHeader from "../Components/mainHeader";
import Footer from "../Components/Footer";

const BenefitsSection = () => {
  return (
    <>
    <MainHeader/>
    <section className="py-5 bg-white mb-10">

      <div className="max-w-7xl mx-auto px-6">
        
        {/* Section heading */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Our Benefits & Your Action
          </h2>
          <p className="text-gray-600 text-lg">
            Choose the perfect plan that suits your matrimonial needs
          </p>
        </div>

        {/* Three column layout */}
        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Column 1: About MarriagePaper.Com */}
          <div className="bg-gray-50 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
              About MarriagePaper.Com
            </h3>
            
            <div className="space-y-4 text-gray-600">
              <p className="leading-relaxed">
                We are an <strong>Advanced Version</strong> of Newspaper Matrimonial AD 
                Circulation. Here you <strong>POST YOUR AD</strong> once and your matrimonial 
                ad circulates till your marriage is settled.
              </p>
              
              <p className="leading-relaxed">
                Once your AD is Approved by our team, it automatically circulates 
                among other members, matching your expectation or your 
                partner's expectation. You will continuously receive AD Circulation 
                Report every time your profile is circulated.
              </p>
              
              <p className="leading-relaxed">
                We are just a platform you need, to find your partner for 
                marriage.
              </p>
            </div>
          </div>

          {/* Column 2: Our Benefits */}
          <div className="bg-red-50 rounded-2xl p-8 border border-red-100">
            <h3 className="text-2xl font-bold text-red-600 mb-6 text-center">
              Our Benefits
            </h3>
            
            <div className="space-y-4">
              {[
                "Unlimited Profile Circulation",
                "Unlimited Receiving of Proposal", 
                "Proposal Forwarding facility (for Paid Profile)",
                "Contact Visible only to Receiver of Proposal, no one else",
                "First Talk Assistance by our Expert Team",
                "Arrangement to create your Profile Video"
              ].map((benefit, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <Check className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                  <p className="text-gray-700 leading-relaxed">{benefit}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Column 3: Your Action */}
          <div className="bg-blue-50 rounded-2xl p-8 border border-blue-100">
            <h3 className="text-2xl font-bold text-blue-600 mb-6 text-center">
              Your Action
            </h3>
            
            <div className="text-center space-y-6">
              <p className="text-gray-700 text-lg font-medium">
                It just takes <strong>2 minutes</strong> of your time
              </p>
              
              <div className="space-y-4">
                <button className="w-full bg-red-600 hover:bg-red-700 text-white py-4 px-6 rounded-full text-lg font-semibold transition-colors shadow-lg">
                  Post Your Ad
                </button>
                
                <div className="text-sm text-gray-600">
                  <p>Already Registered? 
                    <button className="text-blue-600 hover:text-blue-700 font-semibold ml-1">
                      Login
                    </button>
                  </p>
                </div>
              </div>
              
              <div className="pt-6 border-t border-blue-200">
                <p className="text-gray-600 text-sm mb-4">Quick Actions:</p>
                <div className="space-y-2">
                  <button className="w-full text-left text-blue-600 hover:text-blue-700 font-medium flex items-center justify-between group">
                    <span>Search Profiles</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                  <button className="w-full text-left text-blue-600 hover:text-blue-700 font-medium flex items-center justify-between group">
                    <span>View Sample Ads</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                  <button className="w-full text-left text-blue-600 hover:text-blue-700 font-medium flex items-center justify-between group">
                    <span>Contact Support</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    <Footer/>
    </>
  );
};

export default BenefitsSection;
