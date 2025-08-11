import React, { useState } from "react";
import { Mail, Lock, LogIn, Heart, Menu, X } from "lucide-react";

const Login = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans">
      <style jsx>{`
        @keyframes pulse-glow {
          0%,
          100% {
            box-shadow: 0 0 15px rgba(185, 28, 28, 0.4);
          }
          50% {
            box-shadow: 0 0 30px rgba(185, 28, 28, 0.7),
              0 0 50px rgba(185, 28, 28, 0.5);
          }
        }
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 1s ease-out forwards;
        }
        .animate-pulse-glow {
          animation: pulse-glow 2s ease-in-out infinite;
        }
        .parallax-bg {
          background-attachment: fixed;
          background-position: center;
          background-repeat: no-repeat;
          background-size: cover;
        }
        @media (max-width: 768px) {
          .parallax-bg {
            background-attachment: scroll;
          }
        }
      `}</style>

      {/* Navigation */}
      <nav
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          isMenuOpen
            ? "bg-white/95 backdrop-blur-md shadow-md"
            : "bg-transparent"
        }`}
        aria-label="Main navigation"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-r from-red-600 to-pink-500 rounded-lg flex items-center justify-center">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <span
                className={`text-2xl font-bold ${
                  isMenuOpen ? "text-gray-900" : "text-white"
                }`}
              >
                BloodChain
              </span>
            </div>
            <div className="hidden md:flex items-center space-x-6">
              {[
                "Features",
                "Technology",
                "How It Works",
                "Benefits",
                "Contact",
              ].map((item) => (
                <a
                  key={item}
                  href={`/#${item.toLowerCase().replace(" ", "-")}`}
                  className={`font-medium text-lg hover:text-red-500 transition-colors ${
                    isMenuOpen ? "text-gray-800" : "text-white"
                  }`}
                >
                  {item}
                </a>
              ))}
              <a
                href="/signup"
                className="bg-gradient-to-r from-red-600 to-pink-500 text-white px-6 py-2 rounded-full font-semibold hover:from-red-700 hover:to-pink-600 transform hover:scale-105 transition-all duration-300 animate-pulse-glow"
              >
                Sign Up
              </a>
            </div>
            <button
              className="md:hidden text-white"
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
            <div className="md:hidden bg-white/95 backdrop-blur-md shadow-md">
              <div className="flex flex-col space-y-4 py-4 px-6">
                {[
                  "Features",
                  "Technology",
                  "How It Works",
                  "Benefits",
                  "Contact",
                ].map((item) => (
                  <a
                    key={item}
                    href={`/#${item.toLowerCase().replace(" ", "-")}`}
                    className="text-gray-800 font-medium hover:text-red-500 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item}
                  </a>
                ))}
                <a
                  href="/signup"
                  className="bg-gradient-to-r from-red-600 to-pink-500 text-white px-6 py-2 rounded-full font-semibold text-center hover:from-red-700 hover:to-pink-600 transition-all"
                >
                  Sign Up
                </a>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Login Form */}
      <section
        className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-600 to-pink-500 parallax-bg"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1634141443727-8f13d4e6a9b4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')`,
        }}
      >
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="relative bg-white/10 backdrop-blur-md p-6 sm:p-8 lg:p-12 rounded-2xl shadow-xl max-w-md w-full mx-4 animate-fade-in">
          <div className="flex items-center justify-center space-x-2 mb-6">
            <Heart className="w-8 h-8 text-red-600" />
            <h2 className="text-2xl sm:text-3xl font-bold text-center text-white">
              Log In to BloodChain
            </h2>
          </div>
          <form className="space-y-4">
            <div className="flex items-center bg-white/10 p-3 rounded-lg border border-transparent focus-within:border-red-500 transition-all">
              <Mail className="w-5 h-5 sm:w-6 sm:h-6 mr-2 text-gray-300" />
              <input
                type="email"
                placeholder="Email or Username"
                className="bg-transparent outline-none w-full text-white placeholder-gray-400"
                aria-label="Email or Username"
                required
              />
            </div>
            <div className="flex items-center bg-white/10 p-3 rounded-lg border border-transparent focus-within:border-red-500 transition-all">
              <Lock className="w-5 h-5 sm:w-6 sm:h-6 mr-2 text-gray-300" />
              <input
                type="password"
                placeholder="Password"
                className="bg-transparent outline-none w-full text-white placeholder-gray-400"
                aria-label="Password"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-red-600 to-pink-500 text-white py-3 rounded-lg font-bold text-lg hover:from-red-700 hover:to-pink-600 transform hover:scale-105 transition-all duration-300 animate-pulse-glow"
              aria-label="Log In"
            >
              <LogIn className="inline w-5 h-5 sm:w-6 sm:h-6 mr-2" /> Log In
            </button>
          </form>
          <p className="text-center mt-4 text-sm sm:text-base">
            <a
              href="/forgot-password"
              className="text-red-400 hover:text-red-300 transition-colors"
            >
              Forgot password?
            </a>
          </p>
          <div className="mt-6 text-center">
            <p className="text-gray-300 text-sm sm:text-base">
              Or sign in with
            </p>
            <button className="mt-2 bg-black/80 text-white py-2 px-4 rounded-lg w-full hover:bg-black transition-all">
              Sign in with X
            </button>
          </div>
          <p className="text-center mt-4 text-sm sm:text-base">
            New here?{" "}
            <a
              href="/signup"
              className="text-red-400 hover:text-red-300 transition-colors"
            >
              Sign up
            </a>
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-400 text-sm sm:text-base">
          <p>
            &copy; 2025 BloodChain. All rights reserved. Built with ❤️ for
            humanity.{" "}
            <a href="/privacy" className="hover:text-white">
              Privacy Policy
            </a>{" "}
            |{" "}
            <a href="/terms" className="hover:text-white">
              Terms of Service
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Login;
