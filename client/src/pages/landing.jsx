import React, { useState, useEffect } from "react";
import {
  Heart,
  Users,
  Shield,
  Database,
  MapPin,
  Droplets,
  Hospital,
  User,
  ChevronRight,
  Menu,
  X,
  ArrowUp,
  Star,
  Building2
} from "lucide-react";

const BloodChainLanding = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [activeFlowStep, setActiveFlowStep] = useState(null);

  // Handle scroll for navbar and back-to-top
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const howItWorksSteps = [
    {
      title: "Donor Signs Up",
      description:
        "Donors register securely using blockchain to verify their identity.",
      icon: User,
      image:
        "https://images.pexels.com/photos/590016/pexels-photo-590016.jpeg?auto=compress&cs=tinysrgb&w=400",
    },
    {
      title: "Blood Donation",
      description:
        "Every donation is recorded on the blockchain for transparency.",
      icon: Droplets,
      image:
        "https://images.pexels.com/photos/7551818/pexels-photo-7551818.jpeg?auto=compress&cs=tinysrgb&w=400",
    },
    {
      title: "Blood Bank Updates",
      description:
        "Blood banks log inventory using smart contracts for accuracy.",
      icon: Database,
      image:
        "https://images.pexels.com/photos/4167542/pexels-photo-4167542.jpeg?auto=compress&cs=tinysrgb&w=400",
    },
    {
      title: "Hospital Requests",
      description:
        "Hospitals request blood securely, ensuring verified transfers.",
      icon: Hospital,
      image:
        "https://images.pexels.com/photos/1692693/pexels-photo-1692693.jpeg?auto=compress&cs=tinysrgb&w=400",
    },
    {
      title: "Track & Deliver",
      description: "Trace blood from donor to patient with full transparency.",
      icon: MapPin,
      image:
        "https://images.pexels.com/photos/590022/pexels-photo-590022.jpeg?auto=compress&cs=tinysrgb&w=400",
    },
  ];

  const features = [
    {
      title: "Transparency",
      description:
        "Every step is recorded on Ethereum, making the process open and trustworthy.",
      icon: Database,
      image:
        "https://images.pexels.com/photos/3183171/pexels-photo-3183171.jpeg?auto=compress&cs=tinysrgb&w=400",
    },
    {
      title: "Security",
      description: "JWT, MetaMask, and encrypted IPFS storage keep data safe.",
      icon: Shield,
      image:
        "https://images.pexels.com/photos/60504/security-protection-anti-virus-software-60504.jpeg?auto=compress&cs=tinysrgb&w=400",
    },
    {
      title: "Efficiency",
      description:
        "Smart contracts automate processes, reducing errors and delays.",
      icon: Users,
      image:
        "https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=400",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800">
      <style jsx>{`
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
        @keyframes flow-scale {
          0% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
          100% {
            transform: scale(1);
          }
        }
        @keyframes flow-path {
          to {
            stroke-dashoffset: 0;
          }
        }
        .animate-fade-in {
          animation: fade-in 1s ease-out forwards;
        }
        .animate-flow-scale {
          animation: flow-scale 1.5s ease-in-out infinite;
        }
        .flow-path {
          stroke-dasharray: 1000;
          stroke-dashoffset: 1000;
          animation: flow-path 2s linear forwards;
        }
        .flow-arrow {
          animation: pulse 2s ease-in-out infinite;
        }
        @keyframes pulse {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.7;
          }
        }
      `}</style>

      {/* Navigation */}
      <nav
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          scrollY > 50 ? "bg-white shadow-lg" : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center py-4">
          <div className="flex items-center space-x-2">
            <Heart className="w-8 h-8 text-red-600" />
            <span className="text-2xl font-bold text-red-600">BloodChain</span>
          </div>
          <div className="hidden md:flex space-x-6">
            {["About", "How It Works", "Features", "Contact"].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase().replace(" ", "-")}`}
                className="text-lg font-medium text-gray-800 hover:text-red-600 transition-colors"
              >
                {item}
              </a>
            ))}
            <a
              href="/signup"
              className="bg-red-600 text-white px-6 py-2 rounded-full font-semibold hover:bg-red-700 transition-all"
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
              {["About", "How It Works", "Features", "Contact"].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase().replace(" ", "-")}`}
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

      {/* Hero Section */}
      <section
        id="about"
        className="min-h-screen bg-gradient-to-br from-red-600 to-pink-500 flex items-center text-white"
        style={{
          backgroundImage: `url('https://images.pexels.com/photos/7551812/pexels-photo-7551812.jpeg?auto=compress&cs=tinysrgb&w=800')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center animate-fade-in">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
            BloodChain: Saving Lives with Blockchain
          </h1>
          <p className="text-lg sm:text-xl lg:text-2xl mb-8 max-w-3xl mx-auto">
            A secure, transparent platform to manage blood donations, connecting
            donors, blood banks, and hospitals to ensure every drop counts.
          </p>
          <div className="flex justify-center gap-4">
            <a
              href="/signup"
              className="bg-white text-red-600 px-8 py-3 rounded-full font-bold text-lg hover:bg-gray-100 transition-all flex items-center"
            >
              Become a Donor <ChevronRight className="w-5 h-5 ml-2" />
            </a>
            <a
              href="#how-it-works"
              className="border-2 border-white text-white px-8 py-3 rounded-full font-bold text-lg hover:bg-white hover:text-red-600 transition-all"
            >
              Learn More
            </a>
          </div>
        </div>
      </section>

      {/* Problem Statement */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6 animate-fade-in">
            Why <span className="text-red-600">BloodChain</span>?
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-12 animate-fade-in">
            Traditional blood donation systems face serious issues: fraud, black
            marketing, duplicate records, and wasted blood. These problems can
            delay life-saving care. BloodChain uses blockchain to make the
            process transparent, secure, and efficient.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Fraud",
                description: "Fake donations and records harm trust.",
              },
              {
                title: "Wastage",
                description: "Poor tracking leads to expired blood units.",
              },
              {
                title: "Delays",
                description: "Lack of transparency slows emergency responses.",
              },
            ].map((issue, index) => (
              <div
                key={index}
                className="p-6 bg-gray-100 rounded-lg shadow-md hover:shadow-lg transition-all animate-fade-in"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <Star className="w-10 h-10 text-red-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">{issue.title}</h3>
                <p className="text-gray-600">{issue.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section with Flowchart */}
      <section id="how-it-works" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 text-center mb-6 animate-fade-in">
            How <span className="text-red-600">BloodChain</span> Works
          </h2>
          <p className="text-lg text-gray-600 text-center max-w-3xl mx-auto mb-12 animate-fade-in">
            A simple, transparent process powered by blockchain to connect
            donors, blood banks, and hospitals.
          </p>
          <div className="relative">
            <svg
              className="absolute top-1/2 left-0 w-full h-16 hidden lg:block -mt-8"
              style={{ zIndex: 0 }}
            >
              <path
                className="flow-path"
                d="M 20 32 H 180 C 200 32 200 48 220 48 H 380 C 400 48 400 32 420 32 H 580 C 600 32 600 48 620 48 H 780 C 800 48 800 32 820 32 H 980"
                stroke="#b91c1c"
                strokeWidth="5"
                fill="none"
              />
              {howItWorksSteps.map((_, index) => (
                <g key={index}>
                  <circle
                    cx={20 + index * 200}
                    cy={32}
                    r="6"
                    fill="#b91c1c"
                    className={activeFlowStep === index ? "flow-arrow" : ""}
                  />
                  <path
                    d={`M ${20 + index * 200 + 6} 32 L ${
                      20 + index * 200 + 15
                    } 32 L ${20 + index * 200 + 12} 28 M ${
                      20 + index * 200 + 15
                    } 32 L ${20 + index * 200 + 12} 36`}
                    stroke="#b91c1c"
                    strokeWidth="2"
                    fill="none"
                    className={activeFlowStep === index ? "flow-arrow" : ""}
                  />
                </g>
              ))}
            </svg>
            <div className="relative grid grid-cols-1 lg:grid-cols-5 gap-6">
              {howItWorksSteps.map((step, index) => (
                <div
                  key={index}
                  className={`p-6 bg-white rounded-lg shadow-md hover:shadow-xl transition-all animate-fade-in ${
                    activeFlowStep === index
                      ? "animate-flow-scale bg-red-50"
                      : ""
                  }`}
                  style={{ animationDelay: `${index * 0.2}s` }}
                  onMouseEnter={() => setActiveFlowStep(index)}
                  onMouseLeave={() => setActiveFlowStep(null)}
                >
                  <img
                    src={step.image}
                    alt={step.title}
                    className="w-full h-32 object-cover rounded-lg mb-4"
                  />
                  <div className="w-12 h-12 bg-red-600 text-white rounded-full flex items-center justify-center mx-auto mb-4">
                    <step.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-semibold text-center mb-2">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 text-center text-sm">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 text-center mb-6 animate-fade-in">
            Key <span className="text-red-600">Features</span>
          </h2>
          <p className="text-lg text-gray-600 text-center max-w-3xl mx-auto mb-12 animate-fade-in">
            BloodChain uses cutting-edge technology to make blood donation safe
            and efficient.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="p-6 bg-gray-100 rounded-lg shadow-md hover:shadow-lg transition-all animate-fade-in"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <img
                  src={feature.image}
                  alt={feature.title}
                  className="w-full h-40 object-cover rounded-lg mb-4"
                />
                <div className="w-12 h-12 bg-red-600 text-white rounded-full flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-semibold text-center mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-center text-sm">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Technology Stack */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 text-center mb-6 animate-fade-in">
            Built with <span className="text-red-600">Top Technology</span>
          </h2>
          <p className="text-lg text-gray-600 text-center max-w-3xl mx-auto mb-12 animate-fade-in">
            BloodChain uses a modern tech stack to ensure reliability and
            security.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {[
              {
                name: "React.js",
                description: "For a smooth, user-friendly interface.",
              },
              {
                name: "Node.js",
                description: "Handles fast, real-time data processing.",
              },
              {
                name: "MongoDB",
                description: "Stores data securely and efficiently.",
              },
              {
                name: "Ethereum",
                description: "Ensures transparent, tamper-proof records.",
              },
              {
                name: "Solidity",
                description: "Powers automated smart contracts.",
              },
              { name: "IPFS", description: "Stores medical records securely." },
              {
                name: "Web3.js",
                description: "Connects the platform to blockchain.",
              },
              {
                name: "Hardhat",
                description: "Simplifies smart contract development.",
              },
            ].map((tech, index) => (
              <div
                key={index}
                className="p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-all animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <h3 className="text-lg font-semibold text-center mb-2">
                  {tech.name}
                </h3>
                <p className="text-gray-600 text-sm text-center">
                  {tech.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Future Vision */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6 animate-fade-in">
            The <span className="text-red-600">Future</span> of BloodChain
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-12 animate-fade-in">
            Beyond blood, BloodChain can manage plasma, organs, and vaccines,
            creating a global solution for healthcare challenges.
          </p>
          <img
            src="https://images.pexels.com/photos/3825581/pexels-photo-3825581.jpeg?auto=compress&cs=tinysrgb&w=800"
            alt="Future healthcare vision"
            className="w-full max-w-3xl mx-auto h-64 object-cover rounded-lg mb-8"
          />
          <a
            href="/whitepaper"
            className="bg-red-600 text-white px-8 py-3 rounded-full font-bold text-lg hover:bg-red-700 transition-all flex items-center justify-center mx-auto"
          >
            Read Our Vision <ChevronRight className="w-5 h-5 ml-2" />
          </a>
        </div>
      </section>

      {/* CTA Section */}
      <section
        id="contact"
        className="py-16 bg-gradient-to-r from-red-600 to-pink-500 text-white"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6 animate-fade-in">
            Join the Life-Saving Mission
          </h2>
          <p className="text-lg mb-8 max-w-3xl mx-auto animate-fade-in">
            Be a part of BloodChain to make blood donation transparent, secure,
            and efficient.
          </p>
          <div className="flex justify-center gap-4">
            <a
              href="/signup"
              className="bg-white text-red-600 px-8 py-3 rounded-full font-bold text-lg hover:bg-gray-100 transition-all flex items-center"
            >
              Become a Donor <Heart className="w-5 h-5 ml-2" />
            </a>
            <a
              href="/contact"
              className="border-2 border-white text-white px-8 py-3 rounded-full font-bold text-lg hover:bg-white hover:text-red-600 transition-all flex items-center"
            >
              Partner with Us <Building2 className="w-5 h-5 ml-2" />
            </a>
          </div>
        </div>
      </section>

      {/* Back to Top Button */}
      <button
        className={`fixed bottom-6 right-6 p-3 bg-red-600 text-white rounded-full shadow-lg hover:bg-red-700 transition-all ${
          scrollY > 300 ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        aria-label="Scroll to top"
      >
        <ArrowUp className="w-6 h-6" />
      </button>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Heart className="w-8 h-8 text-red-600" />
                <span className="text-xl font-bold">BloodChain</span>
              </div>
              <p className="text-gray-400 text-sm">
                Revolutionizing blood donation with blockchain technology.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-4">Links</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>
                  <a href="/about" className="hover:text-white">
                    About
                  </a>
                </li>
                <li>
                  <a href="/donors" className="hover:text-white">
                    For Donors
                  </a>
                </li>
                <li>
                  <a href="/hospitals" className="hover:text-white">
                    For Hospitals
                  </a>
                </li>
                <li>
                  <a href="/blood-banks" className="hover:text-white">
                    For Blood Banks
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-4">Contact</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>
                  <a
                    href="mailto:hello@bloodchain.org"
                    className="hover:text-white"
                  >
                    hello@bloodchain.org
                  </a>
                </li>
                <li>
                  <a href="/support" className="hover:text-white">
                    Support
                  </a>
                </li>
                <li>
                  <a href="/whitepaper" className="hover:text-white">
                    Whitepaper
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
    </div>
  );
};

export default BloodChainLanding;
