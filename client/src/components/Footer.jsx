import React from "react";
import { Heart, Twitter, Github, Linkedin, Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Heart className="w-8 h-8 text-red-600" />
              <span className="text-xl font-bold">BloodChain</span>
            </div>
            <p className="text-gray-400 text-sm mb-4">
              Transforming blood donation with blockchain technology to save
              lives globally.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://twitter.com/bloodchain"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Twitter className="w-6 h-6" />
              </a>
              <a
                href="https://github.com/bloodchain"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Github className="w-6 h-6" />
              </a>
              <a
                href="https://linkedin.com/company/bloodchain"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Linkedin className="w-6 h-6" />
              </a>
            </div>
          </div>
          <div>
            <h4 className="font-bold text-lg mb-4">Platform</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>
                <a href="/about" className="hover:text-white transition-colors">
                  About
                </a>
              </li>
              <li>
                <a
                  href="/donors"
                  className="hover:text-white transition-colors"
                >
                  For Donors
                </a>
              </li>
              <li>
                <a
                  href="/hospitals"
                  className="hover:text-white transition-colors"
                >
                  For Hospitals
                </a>
              </li>
              <li>
                <a
                  href="/blood-banks"
                  className="hover:text-white transition-colors"
                >
                  For Blood Banks
                </a>
              </li>
              <li>
                <a
                  href="/future-scopes"
                  className="hover:text-white transition-colors"
                >
                  Future Scopes
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-lg mb-4">Resources</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>
                <a
                  href="/whitepaper"
                  className="hover:text-white transition-colors"
                >
                  Whitepaper
                </a>
              </li>
              <li>
                <a href="/docs" className="hover:text-white transition-colors">
                  Documentation
                </a>
              </li>
              <li>
                <a href="/blog" className="hover:text-white transition-colors">
                  Blog
                </a>
              </li>
              <li>
                <a href="/faq" className="hover:text-white transition-colors">
                  FAQ
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-lg mb-4">Stay Connected</h4>
            <p className="text-gray-400 text-sm mb-4">
              Subscribe for updates on BloodChain’s mission.
            </p>
            <div className="flex">
              <input
                type="email"
                placeholder="Enter your email"
                className="px-4 py-2 rounded-l-full text-gray-800 focus:outline-none"
              />
              <button className="bg-red-600 text-white px-4 py-2 rounded-r-full hover:bg-red-700 transition-colors">
                <Mail className="w-5 h-5" />
              </button>
            </div>
            <ul className="space-y-2 text-gray-400 text-sm mt-4">
              <li>
                <a
                  href="/contact"
                  className="hover:text-white transition-colors"
                >
                  Contact Us
                </a>
              </li>
              <li>
                <a
                  href="/support"
                  className="hover:text-white transition-colors"
                >
                  Support
                </a>
              </li>
              <li>
                <a
                  href="/privacy"
                  className="hover:text-white transition-colors"
                >
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-6 text-center text-gray-400 text-sm">
          <p>&copy; 2025 BloodChain. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
