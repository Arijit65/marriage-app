/*  StatsSection.jsx - Animated statistics with scroll-triggered counters  */

import React, { useEffect, useRef, useState } from 'react';

// Individual animated counter component
const AnimatedCounter = ({ end, duration = 2000, suffix = '', prefix = '' }) => {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);
  const frameId = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (isVisible) {
      const startTime = Date.now();
      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function for smooth deceleration
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const currentCount = Math.floor(easeOut * end);
        
        setCount(currentCount);
        
        if (progress < 1) {
          frameId.current = requestAnimationFrame(animate);
        } else {
          setCount(end);
        }
      };

      frameId.current = requestAnimationFrame(animate);
    }

    return () => {
      if (frameId.current) {
        cancelAnimationFrame(frameId.current);
      }
    };
  }, [isVisible, end, duration]);

  return (
    <span ref={ref} className="font-bold text-4xl md:text-5xl text-red-600">
      {prefix}{count.toLocaleString()}{suffix}
    </span>
  );
};

// Main statistics section component
const StatsSection = () => {
  const stats = [
    {
      number: 4375,
      label: "Happy Customers",
      duration: 2500
    },
    {
      number: 2625,
      label: "Active Members", 
      duration: 2200
    },
    {
      number: 6000, // Your requested 6000 number
      label: "Verified Ads",
      duration: 3000
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-red-50 to-pink-50">
      <div className="max-w-6xl mx-auto px-6">
        {/* Optional heading */}
        <div className="text-center mb-16">
          <h2 className="text-gray-600 text-lg font-medium mb-2">Our Achievement</h2>
          <h3 className="text-gray-800 text-3xl md:text-4xl font-bold">
            Trusted by Thousands
          </h3>
        </div>

        {/* Stats grid */}
        <div className="grid md:grid-cols-3 gap-12 text-center">
          {stats.map((stat, index) => (
            <div 
              key={index}
              className="bg-white rounded-2xl p-8 shadow-lg border border-red-100 hover:shadow-xl transition-shadow duration-300"
            >
              <div className="mb-4">
                <AnimatedCounter 
                  end={stat.number} 
                  duration={stat.duration}
                />
              </div>
              <p className="text-gray-600 text-lg font-medium">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
