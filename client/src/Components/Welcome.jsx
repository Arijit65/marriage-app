import React from 'react';
//import sampleImg from '@/assets/welcome.jpg'; // ⬅️ replace with the real path or URL

const WelcomeSection = () => {
  return (
    <section className="w-full px-6 py-12">
      <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
        {/* ───────────── Left: Text Block ───────────── */}
        <div>
          <h5 className="text-gray-600 text-lg font-semibold mb-1">
            Welcome To
          </h5>
          <h2 className="text-red-600 text-4xl lg:text-5xl font-extrabold mb-6">
            Marriage Paper
          </h2>

          {/* Subtle divider */}
          <hr className="border-t border-gray-200 mb-6" />

          <p className="text-gray-700 leading-relaxed mb-8">
            Welcome to our Matrimonial Video Platform! We are thrilled to bring
            the cherished tradition of matchmaking into the digital age by
            showcasing personalized introductory videos of brides and grooms.
            Our platform is designed to help you connect on a deeper level,
            moving beyond the limitations of text profiles to offer an engaging
            and authentic way to find your perfect match. Through these videos,
            you get a real sense of the individual’s personality, values, and
            aspirations, making it easier to find someone who truly resonates
            with you. Join us today and experience a new dimension of
            matrimonial matchmaking, where meaningful connections and genuine
            interactions lead the way to your happily ever after.
          </p>

          <button className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-full font-semibold transition-colors">
            Read More
          </button>
        </div>

        {/* ───────────── Right: Image ───────────── */}
        <div className="flex justify-center lg:justify-end">
          <img
            src= 'https://www.marriagepaper.com/assets/images/welcome.jpg'
            alt="Traditional wedding scene"
            className="w-80 lg:w-96 rounded-lg object-cover shadow"
          />
        </div>
      </div>
    </section>
  );
};

export default WelcomeSection;
