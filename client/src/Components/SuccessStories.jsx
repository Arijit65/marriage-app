/*  SuccessStories.jsx
    A clean, animation-free “Success Stories” section.  
    Only the main testimonial carousel slides automatically or via dots.
*/

import React, { useState, useEffect } from "react";
import { Star, ArrowRight } from "lucide-react";

/* ─── Data ─── */
const testimonials = [
  {
    name: "Rahul & Priya",
    location: "Delhi",
    rating: 5,
    text: "We found each other within two weeks of joining! Marriage Paper made the process safe, simple, and truly special.",
    image:
      "https://images.unsplash.com/photo-1603398938378-f8fab9510402?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Anjali & Rajesh",
    location: "Pune",
    rating: 4,
    text: "The profile-verification steps gave us confidence. Today we’re happily married and grateful for the platform.",
    image:
      "https://plus.unsplash.com/premium_photo-1700353612860-bd8ab8d71f05?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Meera & Vikash",
    location: "Hyderabad",
    rating: 5,
    text: "Personalised matches and the video-ad feature helped us connect on a deeper level before even chatting.",
    image:
      "https://cdn.pixabay.com/photo/2018/09/11/16/13/indian-wedding-3669915_1280.jpg",
  },
];

/* ─── One-off grid cards under the carousel ─── */
const moreStories = [
  {
    name: "Sunita & Amit",
    location: "Kolkata",
    image:
      "https://cdn.pixabay.com/photo/2022/01/30/05/50/couple-6979878_1280.jpg",
  },
  {
    name: "Rhea & Karan",
    location: "Mumbai",
    image:
      "https://images.unsplash.com/photo-1511988617509-a57c8a288659?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Divya & Akash",
    location: "Bengaluru",
    image:
      "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=900&q=80",
  },
];

const SuccessStories = () => {
  const [active, setActive] = useState(0);

  /* auto-advance every 7 s */
  useEffect(() => {
    const id = setInterval(
      () => setActive((prev) => (prev + 1) % testimonials.length),
      7_000
    );
    return () => clearInterval(id);
  }, []);

  const t = testimonials[active];

  return (
    <section className="py-20 bg-gray-100">
      <div className="max-w-6xl mx-auto px-4">
        {/* headings */}
        <header className="text-center mb-16">
          <h4 className=" text-2xl font-bold mb-3 text-gray-600">Success Stories</h4>
          <p className=" text-red-600 text-4xl font-bold ">
            Real couples, real love stories that inspire
          </p>
        </header>

        {/* ────────── Carousel ────────── */}
        <div className="relative max-w-4xl mx-auto overflow-hidden">
          {/* slide wrapper -> translate-x based on active index */}
          <div
            className="flex transition-transform duration-500"
            style={{ transform: `translateX(-${active * 100}%)` }}
          >
            {testimonials.map((item) => (
              <article
                key={item.name}
                className="min-w-full bg-gradient-to-br from-rose-100 to-pink-100 rounded-3xl p-8 md:p-12"
              >
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  {/* text */}
                  <div className="text-center md:text-left">
                    <div className="flex justify-center md:justify-start mb-4">
                      {Array.from({ length: item.rating }).map((_, idx) => (
                        <Star
                          key={idx}
                          className="h-5 w-5 text-yellow-400 fill-current"
                        />
                      ))}
                    </div>

                    <blockquote className="text-lg text-gray-700 mb-6 italic">
                      “{item.text}”
                    </blockquote>

                    <h4 className="font-semibold text-xl text-gray-800">
                      {item.name}
                    </h4>
                    <p className="text-rose-600 font-medium">{item.location}</p>
                  </div>

                  {/* photo */}
                  <div className="relative">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="rounded-2xl shadow-lg w-full h-80 object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl" />
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* dots */}
          <div className="flex justify-center space-x-2 mt-6">
            {testimonials.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActive(idx)}
                className={`h-3 rounded-full transition-all ${
                  idx === active ? "w-8 bg-rose-500" : "w-3 bg-rose-200"
                }`}
                aria-label={`go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>

        {/* ────────── More Stories grid ────────── */}
        <div className="grid md:grid-cols-3 gap-8 mt-20">
          {moreStories.map((c) => (
            <div
              key={c.name}
              className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={c.image}
                  alt={c.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                <div className="absolute bottom-4 left-4 text-white">
                  <h4 className="font-semibold">{c.name}</h4>
                  <p className="text-sm opacity-90">{c.location}</p>
                </div>
              </div>

              <div className="p-6">
                <button className="flex items-center space-x-2 text-rose-600 font-medium hover:text-rose-700 transition">
                  <span>Read Their Story</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SuccessStories;
