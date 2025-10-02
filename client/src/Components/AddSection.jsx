// AdsSection.jsx  –– refined continuous layout

import React from "react";

/* ─── Card component ─── */
const DemoCard = ({ profileId = "F2150-F", memberType = "STOCK Member", gender = "Bride", age = "32", height = "5'", religion = "Hindu", ethnicity = "Bengali", caste = "Kayastha", education = "MA", photoCount = "2 Photos", imageUrl }) => (
  <div className="bg-white rounded-2xl border border-gray-200 shadow-xl flex overflow-hidden">
    {/* photo */}
    <div className="w-[150px] shrink-0 relative">
      <img
        src={imageUrl}
        alt="profile"
        className="h-full w-full object-cover"
      />
      <span className="absolute bottom-2 left-2 bg-black/70 text-white text-[11px] px-2 rounded">
        {photoCount}
      </span>
    </div>

    {/* details */}
    <div className="flex-1 px-5 py-4 space-y-1 text-[15px]">
      <p className="text-[12px] text-gray-500">
        {profileId} • <span className="text-blue-600 font-semibold">{memberType}</span>
      </p>
      <p className="font-semibold">{gender} · {age} years / {height}</p>
      <p className="leading-snug text-gray-700">
        {religion}, {ethnicity}, {caste} · {ethnicity}, {education}…
        <span className="text-red-600 font-medium ml-1 cursor-pointer">Read More</span>
      </p>

      <div className="flex items-center pt-2">
        <input
          id="contactEmail"
          type="checkbox"
          className="accent-red-600 w-4 h-4 mr-2"
        />
        <label htmlFor="contactEmail" className="text-[13px]">
          Contact via email
        </label>
        <button
          className="ml-auto text-red-600 text-xs font-bold hover:translate-x-0.5 transition"
          aria-label="next"
        >
          ➜
        </button>
      </div>
    </div>
  </div>
);

/* ─── Section block ─── */
const Block = ({ label, headline, children, isLast }) => (
  <>
    {/* heading group */}
    <header className="text-center pt-16">
      <p className="text-gray-500 font-medium mb-1">{label}</p>
      <h2 className="text-red-600 text-4xl sm:text-5xl font-extrabold mb-10">
        {headline}
      </h2>
    </header>

    {/* card slot */}
    {children && <div className="mb-14">{children}</div>}

    {/* button */}
    <div className="text-center pb-16">
      <button className="bg-red-600 hover:bg-red-700 text-white px-10 py-3 rounded-full text-lg font-semibold shadow-lg ring-0 hover:ring-4 hover:ring-red-600/30 transition">
        View All
      </button>
    </div>

    {/* divider except under the final block */}
    {!isLast && (
      <div className="max-w-6xl mx-auto h-px bg-gray-300/70" />
    )}
  </>
);

const AdsSection = () => {
  // Different placeholder images for variety
  const placeholderImages = [
    "https://media.istockphoto.com/id/1987655119/photo/smiling-young-businesswoman-standing-in-the-corridor-of-an-office.jpg?s=612x612&w=0&k=20&c=5N_IVGYsXoyj-H9vEiZUCLqbmmineaemQsKt2NTXGms=",
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
    "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face",
    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
    "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop&crop=face",
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face"
  ];

  return (
    /* full-bleed subtle background */
    <section className="w-full bg-gray-100/60">
      <div className="max-w-7xl mx-auto px-4">
        {/* Latest Ads – heading + sample cards (2 cards) */}
        <Block
          label="Latest Ads"
          headline="Find Your Perfect Match Today"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <DemoCard 
              profileId="F2150-F"
              memberType="STOCK Member"
              gender="Bride"
              age="32"
              height="5'"
              religion="Hindu"
              ethnicity="Bengali"
              caste="Kayastha"
              education="MA"
              photoCount="2 Photos"
              imageUrl={placeholderImages[0]}
            />
            <DemoCard 
              profileId="F2151-M"
              memberType="PREMIUM Member"
              gender="Groom"
              age="28"
              height="5'8"
              religion="Muslim"
              ethnicity="Punjabi"
              caste="Jatt"
              education="MBA"
              photoCount="3 Photos"
              imageUrl={placeholderImages[1]}
            />
          </div>
        </Block>

        {/* Featured Ads – heading + sample cards (4 cards) */}
        <Block
          label="Featured Ads"
          headline="Discover Your Perfect Match"
          isLast
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 max-w-6xl mx-auto">
            <DemoCard 
              profileId="F2152-F"
              memberType="VIP Member"
              gender="Bride"
              age="26"
              height="5'3"
              religion="Christian"
              ethnicity="Anglo-Indian"
              caste="General"
              education="B.Tech"
              photoCount="4 Photos"
              imageUrl={placeholderImages[2]}
            />
            {/* <DemoCard 
              profileId="F2153-M"
              memberType="STOCK Member"
              gender="Groom"
              age="30"
              height="5'10"
              religion="Sikh"
              ethnicity="Punjabi"
              caste="Ramgharia"
              education="CA"
              photoCount="2 Photos"
              imageUrl={placeholderImages[3]}
            /> */}
            <DemoCard 
              profileId="F2154-F"
              memberType="PREMIUM Member"
              gender="Bride"
              age="24"
              height="5'2"
              religion="Hindu"
              ethnicity="Gujarati"
              caste="Patel"
              education="MBBS"
              photoCount="5 Photos"
              imageUrl={placeholderImages[4]}
            />
            <DemoCard 
              profileId="F2155-M"
              memberType="VIP Member"
              gender="Groom"
              age="29"
              height="5'9"
              religion="Jain"
              ethnicity="Marwari"
              caste="Agarwal"
              education="Ph.D"
              photoCount="3 Photos"
              imageUrl={placeholderImages[5]}
            />
          </div>
        </Block>
      </div>
    </section>
  );
};

export default AdsSection;
