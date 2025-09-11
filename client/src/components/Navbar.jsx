import React, { useState, useEffect } from "react";
import { Heart, Menu, X } from "lucide-react";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    "Home",
    "About",
    "How It Works",
    "Benefits",
    "Features",
    "Technology",
    "Testimonials",
    "Future Scopes",
    "Contact",
  ];

  return (
    <nav
      className={`fixed top-0 w-full z-50 bg-white shadow-lg transition-all duration-300`}
    >
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center py-4">
        <div className="flex items-center space-x-2">
          <Heart className="w-8 h-8 text-red-600" />
          <span className="text-2xl font-bold text-red-600">BloodChain</span>
        </div>
        <div className="hidden md:flex space-x-6 items-center">
          {navItems.map((item) => (
            <a
              key={item}
              href={
                item === "Home"
                  ? "/"
                  : item === "Future Scopes"
                  ? "/future-scopes"
                  : `#${item.toLowerCase().replace(" ", "-")}`
              }
              className="text-lg font-medium text-gray-800 hover:text-red-600 transition-colors"
            >
              {item}
            </a>
          ))}
          <a
            href="/signup"
            className="bg-red-600 text-white px-6 py-2 rounded-full font-semibold hover:bg-red-700 transition-all hover:scale-105"
          >
            Join Now
          </a>
        </div>
        <button
          className="md:hidden text-gray-800"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        >
          {isMenuOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>
      </div>
      {isMenuOpen && (
        <div className="md:hidden bg-white shadow-lg">
          <div className="flex flex-col space-y-4 py-4 px-6">
            {navItems.map((item) => (
              <a
                key={item}
                href={
                  item === "Home"
                    ? "/"
                    : item === "Future Scopes"
                    ? "/future-scopes"
                    : `#${item.toLowerCase().replace(" ", "-")}`
                }
                className="text-gray-800 font-medium hover:text-red-600"
                onClick={() => setIsMenuOpen(false)}
              >
                {item}
              </a>
            ))}
            <a
              href="/signup"
              className="bg-red-600 text-white px-6 py-2 rounded-full font-semibold text-center hover:bg-red-700"
            >
              Join Now
            </a>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
