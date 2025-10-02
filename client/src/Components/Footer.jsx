import React from 'react'
import { motion } from 'framer-motion'
import { Heart, ArrowRight } from 'lucide-react'

const Footer = () => {
  return (
 
<footer className="bg-gray-900 text-white py-16">
<div className="container mx-auto px-4">
  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
    <motion.div
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
    >
      <div className="flex items-center space-x-2 mb-6">
        <Heart className="h-8 w-8 text-rose-500" />
        <span className="text-2xl font-bold">Marriage Paper</span>
      </div>
      <p className="text-gray-400 mb-6 leading-relaxed">
        India's most trusted matrimonial platform helping millions find their perfect life partner
        through innovative technology and personalized service.
      </p>

      <div className="flex space-x-4">
        {['facebook', 'twitter', 'instagram', 'linkedin'].map((social) => (
          <motion.a
            key={social}
            href="#"
            className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-rose-600 transition-colors"
            whileHover={{ scale: 1.1, y: -2 }}
          >
            <span className="sr-only">{social}</span>
            <div className="w-5 h-5 bg-gray-400 rounded"></div>
          </motion.a>
        ))}
      </div>
    </motion.div>

    {[
      {
        title: 'Quick Links',
        links: ['Browse Profiles', 'Success Stories', 'Mobile App', 'Help Center', 'Privacy Policy']
      },
      {
        title: 'Services',
        links: ['Premium Membership', 'Personal Matchmaker', 'Profile Verification', 'Wedding Services', 'Astrology']
      },
      {
        title: 'Support',
        links: ['Contact Us', 'FAQ', 'Terms of Service', 'Refund Policy', 'Safety Tips']
      }
    ].map((section, index) => (
      <motion.div
        key={section.title}
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: (index + 1) * 0.1 }}
      >
        <h3 className="font-semibold text-lg mb-6">{section.title}</h3>
        <ul className="space-y-3">
          {section.links.map((link) => (
            <li key={link}>
              <motion.a
                href="#"
                className="text-gray-400 hover:text-white transition-colors flex items-center group"
                whileHover={{ x: 5 }}
              >
                <span>{link}</span>
                <ArrowRight className="h-3 w-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
              </motion.a>
            </li>
          ))}
        </ul>
      </motion.div>
    ))}
  </div>

  {/* Newsletter Signup */}
  <motion.div
    className="border-t border-gray-800 pt-8 mb-8"
    initial={{ opacity: 0, y: 60 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
  >
    <div className="max-w-md mx-auto text-center">
      <h4 className="font-semibold text-lg mb-4">Stay Updated</h4>
      <p className="text-gray-400 mb-6">Get latest success stories and matrimonial tips</p>
      <div className="flex gap-2">
        <input
          type="email"
          placeholder="Your email address"
          className="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:border-rose-500 focus:ring-1 focus:ring-rose-500"
        />
        <motion.button
          className="px-6 py-3 bg-rose-600 text-white rounded-lg font-medium hover:bg-rose-700 transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Subscribe
        </motion.button>
      </div>
    </div>
  </motion.div>

  <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
    <p>&copy; 2024 Marriage Paper. All rights reserved. | Made with ❤️ in India</p>
  </div>
</div>
</footer>
  )
}

export default Footer

