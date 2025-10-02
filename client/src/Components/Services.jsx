/*  ServicesSection.jsx  – replicates the “Our Services / Know What We Offer” strip  */

import React from "react";
import { UserCheck, Star, Settings, Briefcase } from "lucide-react";

const services = [
  {
    title: "Our Workflow",
    description:
      "Marriage Paper helps you create video ads, connects you with potential matches via automated searches, and provides a comprehensive platform to manage your profile.",
    icon: UserCheck,
  },
  {
    title: "Proposal Service",
    description:
      "MarriagePaper.com’s Proposal Services allow you to send proposals to profiles you’re interested in—even if their contact details are hidden—using our secure Proposal Gateway.",
    icon: Star,
  },
  {
    title: "Yet-To-Marry Ads",
    description:
      "Marriage Paper ensures that all member profiles are regularly updated to reflect genuine availability by verifying that members are active on the platform at least once every 30 days.",
    icon: Settings,
  },
  {
    title: "Announcements",
    description:
      "Marriage Paper helps you find your perfect match quickly by allowing you to advertise your profile via video and connecting you with potential partners through our efficient services.",
    icon: Briefcase,
  },
];

const ServicesSection = () => (
  <section className="py-20 bg-white">
    <div className="max-w-6xl mx-auto px-4">
      {/* headings */}
      <div className="text-center mb-12">
        <p className="text-gray-600 text-lg font-medium">Our Services</p>
        <h2 className="text-red-600 text-4xl sm:text-5xl font-extrabold mt-2">
          Know What We Offer
        </h2>

        <div className="w-24 h-px bg-gray-300 mx-auto mt-6" />
      </div>

      {/* card grid */}
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
        {services.map(({ title, description, icon: Icon }) => (
          <div
            key={title}
            className="border border-gray-300 rounded-2xl p-6 flex flex-col shadow-sm hover:shadow-lg transition"
          >
            {/* red label bar */}
            <div className="mb-6">
              <div className="bg-red-600 text-white text-center py-2 rounded-lg font-semibold">
                {title}
              </div>
            </div>

            {/* description */}
            <p className="text-gray-600 text-sm leading-relaxed flex-1">
              {description}
            </p>

            {/* learn more button */}
            <button className="mt-8 self-center bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-full text-sm font-semibold transition-colors">
              Learn More
            </button>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default ServicesSection;
