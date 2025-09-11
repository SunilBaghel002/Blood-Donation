import React, { useState } from "react";
import { Heart, Menu, X } from "lucide-react";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = ["Home", "About", "Features", "Future Scopes", "Contact"];

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-sm shadow-md transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center py-4">
        <div className="flex items-center space-x-3">
          <Heart className="w-7 h-7 text-red-600" />
          <span className="text-2xl font-bold text-red-600 tracking-tight">
            BloodChain
          </span>
        </div>
        <div className="hidden md:flex space-x-8 items-center">
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
              className="text-base font-medium text-gray-800 hover:text-red-600 hover:underline underline-offset-4 transition-all duration-200"
              aria-current={
                window.location.pathname ===
                (item === "Home"
                  ? "/"
                  : item === "Future Scopes"
                  ? "/future-scopes"
                  : `#${item.toLowerCase().replace(" ", "-")}`)
                  ? "page"
                  : undefined
              }
            >
              {item}
            </a>
          ))}
          <a
            href="/signup"
            className="bg-gradient-to-r from-red-600 to-red-700 text-white px-6 py-2 rounded-full font-semibold hover:from-red-700 hover:to-red-800 transition-all duration-200 hover:scale-105"
          >
            Join Now
          </a>
        </div>
        <button
          className="md:hidden text-gray-800 p-2"
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
        <div className="md:hidden bg-white/95 shadow-lg animate-slide-in">
          <div className="flex flex-col items-center space-y-3 py-6 px-6">
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
                className="text-base font-medium text-gray-800 hover:text-red-600 hover:underline underline-offset-4 transition-all duration-200"
                onClick={() => setIsMenuOpen(false)}
                aria-current={
                  window.location.pathname ===
                  (item === "Home"
                    ? "/"
                    : item === "Future Scopes"
                    ? "/future-scopes"
                    : `#${item.toLowerCase().replace(" ", "-")}`)
                    ? "page"
                    : undefined
                }
              >
                {item}
              </a>
            ))}
            <a
              href="/signup"
              className="bg-gradient-to-r from-red-600 to-red-700 text-white px-6 py-2 rounded-full font-semibold text-center hover:from-red-700 hover:to-red-800 transition-all duration-200"
            >
              Join Now
            </a>
          </div>
        </div>
      )}
      <style jsx>{`
        @keyframes slide-in {
          from {
            transform: translateY(-10px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        .animate-slide-in {
          animation: slide-in 0.3s ease-out forwards;
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
