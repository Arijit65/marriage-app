import React from 'react'
import MainHeader from '../Components/mainHeader'
import Footer from '../Components/Footer'
import StatsSection from '../Components/AnimatedStats'
import { CheckCircle, CreditCard, Eye, Headphones, MessageCircle, Shield } from 'lucide-react'

const About = () => {
  const features = [
    {
      icon: Eye,
      title: "Eye On Quality",
      description: "We verify the Quality of every AD placed on our platform. During our 15+ years of experience, we have learned the Best of Services."
    },
    {
      icon: Shield,
      title: "Protection Guaranteed",
      description: "We verify the protection or safety of our customers. Each advertisement is completely verified. Contact Privacy at first visit."
    },
    {
      icon: Headphones,
      title: "Active Support",
      description: "We are always active and ready to help our advertisers with all sort of queries. Our support team is more flexible now."
    },
    {
      icon: MessageCircle,
      title: "Prompt Complaint Response",
      description: "Our team solves each and every regarding our platform and we try to find in every Service Problem."
    },
    {
      icon: CheckCircle,
      title: "Verified Ads",
      description: "All advertisement are checked by our team for verification via telephone conversation."
    },
    {
      icon: CreditCard,
      title: "Secure Payment Gateway",
      description: "Our payment gateway is secured and verified. We help our customers during the payment."
    }
  ];

  return (
    <div>
      <MainHeader />
      <section className="py-16 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-start">

          {/* Left side - Text content only */}
          <div className="space-y-6">
            <h1 className="text-red-500 text-5xl font-bold leading-tight">
              Welcome!
            </h1>
            <h2 className="text-gray-600 text-xl font-medium">
              Know More About MarriagePaper.Com
            </h2>

            <div className="space-y-4 text-gray-600 text-base leading-relaxed">
              <p>
                We're an OPEN PLATFORM where Contact Details of Premium Advertisers are
                visible to everyone. We Display & Circulate your matrimonial advertisement via
                Website/SMS/Email.
              </p>

              <p>
                We are just a platform you need, to find your partner for marriage.
              </p>
            </div>
          </div>

          {/* Right side - Image */}
          <div className="min-h-screen bg-white flex items-center justify-center p-6">
            {/* Outer frame to control overall aspect on wide screens */}
            <div className="grid grid-cols-[1fr,0.72fr] grid-rows-[auto,auto] gap-6 max-w-5xl w-full">
              {/* Top-left: large square */}
              <div className="row-span-1">
                <div className="relative w-full">
                  <div className="aspect-square overflow-hidden rounded">
                    <img
                      src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR9SRRmhH4X5N2e4QalcoxVbzYsD44C-sQv-w&s"
                      alt="placeholder large"
                      className="h-full w-full object-cover"
                    />
                  </div>
                </div>
              </div>

              {/* Top-right: small square, aligned to top of large */}
              <div className="row-span-1">
                <div className="aspect-square overflow-hidden rounded">
                  <img
                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTc9APxkj0xClmrU3PpMZglHQkx446nQPG6lA&s"
                    alt="placeholder small square"
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>

              {/* Bottom-left: small portrait-ish rectangle centered under the big tile */}
              <div className="-mt-28 ml-20 w-48 max-w-[55%] justify-self-start">
                {/* The negative top margin pulls this tile up to sit between the bottom edges,
              and the left margin insets it to mirror the screenshot spacing. */}
                <div className="aspect-[4/5] overflow-hidden rounded shadow-sm">
                  <img
                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTc9APxkj0xClmrU3PpMZglHQkx446nQPG6lA&s"
                    alt="placeholder bottom-left"
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>

              {/* Bottom-right: short wide rectangle under the right column */}
              <div className="-mt-10">
                <div className="aspect-[5/4] overflow-hidden rounded">
                  <img
                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTc9APxkj0xClmrU3PpMZglHQkx446nQPG6lA&s"
                    alt="placeholder bottom-right"
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>


        </div>
      </section>
      <StatsSection />
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">

          {/* Main heading */}
          <div className="text-center mb-16">
            <h2 className="text-red-600 text-4xl md:text-5xl font-bold mb-4">
              Why We Are Best
            </h2>
            <p className="text-gray-600 text-lg max-w-3xl mx-auto leading-relaxed">
              With over 20+ years of experience, MarriagePaper.com is a decade-old Matrimonial Ad Platform,
              successfully running since 2005. We are also the finest fastest-friendly Matrimonial Ad Platform in
              India because of our Premium Services are only 3.5 Per year.
            </p>
          </div>

          {/* Features grid - Full width */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-6 shadow-md border border-gray-200 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start space-x-4">
                  <div className="bg-red-100 p-3 rounded-lg flex-shrink-0">
                    <feature.icon className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-gray-800 mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Founder section - Below features, centered */}
          <div className="max-w-7xl mx-auto">
            <div className="bg-white rounded-2xl p-8 md:p-16 shadow-lg border border-gray-200">
              <h3 className="text-red-600 text-3xl font-bold text-center mb-16">
                The Man Behind MarriagePaper.Com
              </h3>

              <div className="grid md:grid-cols-5 gap-12 items-center">
                {/* Profile image - takes 2 columns */}
                <div className="md:col-span-2 text-center">
                  <div className="w-72 h-96 mx-auto bg-gray-200 rounded-lg overflow-hidden shadow-lg">
                    <img
                      src="https://via.placeholder.com/288x384/e5e7eb/6b7280?text=Founder+Photo"
                      alt="Founder"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="mt-8">
                    <h4 className="text-3xl font-bold text-gray-800 mb-3">
                      Shyam Shankar Ghosh
                    </h4>
                    <p className="text-red-600 font-semibold text-xl">
                      Founder & CEO
                    </p>
                  </div>
                </div>

                {/* Profile description - takes 3 columns */}
                <div className="md:col-span-3 space-y-6">
                  <p className="text-gray-600 leading-relaxed text-lg">
                    Shyam Shankar Ghosh, ex-employee of State Bank of India, Food Technology Specialist (Contact
                    from Jadavpur University Kolkata), Self Made Entrepreneur, started off his 2nd life International
                    Advertisement and Back in the year 2004, when Internet was still comparatively Back then, he had
                    the vision to create a digital platform to serve the needs of matrimonial services.
                  </p>

                  <p className="text-gray-600 leading-relaxed text-lg">
                    In 2004, he started <strong>MarriagePaper.com</strong> with the goal to advocate and help the Independent flourished out
                    with the idea to help back of internet in know him. It seems him, MarriagePaper.com has continued to
                    be under his supervision and his 20 years of expertise and who acted are in help people find the real
                    partner while saving in lakhs of times.
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      <Footer />
    </div>
  )
}

export default About 
