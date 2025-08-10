import React, { useState, useEffect } from "react";
import {
  Heart,
  Shield,
  Users,
  Building2,
  Activity,
  ChevronRight,
  CheckCircle,
  Clock,
  MapPin,
  Droplets,
  Database,
  FileText,
  Lock,
  Globe,
  Eye,
  Menu,
  X,
  Play,
  Star,
  Zap,
  TrendingUp,
} from "lucide-react";
import {
  SiReact,
  SiNodedotjs,
  SiMongodb,
  SiExpress,
  SiEthereum,
  SiSolidity,
  SiIpfs,
  SiWeb3Dotjs,
} from "react-icons/si";

const BloodChainLanding = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  // Handle scroll for navbar
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Testimonial rotation
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const stats = [
    { value: "1,247", label: "Lives Saved", icon: Heart },
    { value: "23", label: "Blood Banks", icon: Building2 },
    { value: "100%", label: "Transparency", icon: Shield },
    { value: "3,456", label: "Blockchain TXs", icon: Database },
  ];

  const features = [
    {
      icon: Database,
      title: "Blockchain Transparency",
      description:
        "Every donation and transfer immutably recorded on Ethereum blockchain",
      gradient: "from-red-700 to-red-800",
    },
    {
      icon: Shield,
      title: "Data Security",
      description:
        "Personal information encrypted and stored off-chain with verification hashes",
      gradient: "from-red-700 to-red-800",
    },
    {
      icon: Globe,
      title: "IPFS Storage",
      description:
        "Decentralized storage for consent forms and medical certificates",
      gradient: "from-red-700 to-red-800",
    },
    {
      icon: Activity,
      title: "Real-time Tracking",
      description: "Track your donation from collection to life-saving usage",
      gradient: "from-red-700 to-red-800",
    },
    {
      icon: Users,
      title: "Multi-stakeholder",
      description:
        "Connects donors, blood banks, and hospitals in one platform",
      gradient: "from-red-700 to-red-800",
    },
    {
      icon: Lock,
      title: "Smart Contracts",
      description: "Automated workflows with Solidity smart contracts",
      gradient: "from-red-700 to-red-800",
    },
  ];

  const testimonials = [
    {
      name: "Dr. Sarah Johnson",
      role: "Blood Bank Director",
      content:
        "BloodChain has revolutionized our inventory management. The transparency and traceability are unprecedented.",
      avatar: "👩‍⚕️",
    },
    {
      name: "Michael Chen",
      role: "Regular Donor",
      content:
        "Finally, I can see exactly how my donations are being used to save lives. This technology is game-changing.",
      avatar: "👨‍💼",
    },
    {
      name: "Dr. Maria Rodriguez",
      role: "Hospital Administrator",
      content:
        "The verification process is seamless. We can instantly verify blood authenticity and source.",
      avatar: "👩‍🔬",
    },
  ];

  const techStack = [
    { name: "React", color: "text-blue-500", icon: SiReact },
    { name: "Node.js", color: "text-green-500", icon: SiNodedotjs },
    { name: "MongoDB", color: "text-green-600", icon: SiMongodb },
    { name: "Express", color: "text-gray-600", icon: SiExpress },
    { name: "Ethereum", color: "text-purple-500", icon: SiEthereum },
    { name: "Solidity", color: "text-blue-600", icon: SiSolidity },
    { name: "IPFS", color: "text-orange-500", icon: SiIpfs },
    { name: "Web3", color: "text-yellow-500", icon: SiWeb3Dotjs },
  ];

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      <style jsx>{`
        @keyframes pulse-glow {
          0%,
          100% {
            box-shadow: 0 0 20px rgba(185, 28, 28, 0.3);
          }
          50% {
            box-shadow: 0 0 40px rgba(185, 28, 28, 0.6),
              0 0 60px rgba(185, 28, 28, 0.4);
          }
        }
        .animate-pulse-glow {
          animation: pulse-glow 2s ease-in-out infinite;
        }
      `}</style>

      {/* Navigation */}
      <nav
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          scrollY > 50
            ? "bg-white/95 backdrop-blur-md shadow-lg"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-r from-red-700 to-red-800 rounded-lg flex items-center justify-center">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <span
                className={`text-2xl font-bold ${
                  scrollY > 50 ? "text-gray-800" : "text-white"
                }`}
              >
                BloodChain
              </span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              {["Features", "Technology", "About", "Contact"].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className={`font-medium hover:text-red-700 transition-colors ${
                    scrollY > 50 ? "text-gray-700" : "text-white"
                  }`}
                >
                  {item}
                </a>
              ))}
              <button className="bg-gradient-to-r from-red-700 to-red-800 text-white px-6 py-2 rounded-full font-semibold hover:from-red-800 hover:to-red-900 transform hover:scale-105 transition-all duration-300 animate-pulse-glow">
                Launch App
              </button>
            </div>
            <button
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen bg-gradient-to-br  from-red-600 to-pink-600 flex items-center overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center">
          <div className="text-center md:text-left text-white md:w-1/2">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Empowering
              <br />
              <span className="bg-gradient-to-r from-yellow-400 to-amber-500 bg-clip-text text-transparent">
                Life-Saving Trust
              </span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl opacity-90">
              Blockchain-powered blood management ensuring{" "}
              <span className="font-semibold text-amber-300">transparency</span>
              ,
              <span className="font-semibold text-amber-300">
                {" "}
                traceability
              </span>
              , and
              <span className="font-semibold text-amber-300">
                {" "}
                security
              </span>{" "}
              for donors, hospitals, and blood banks.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start items-center mb-12">
              <button className="group bg-white text-red-700 px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-100 transform hover:scale-105 transition-all duration-300 flex items-center space-x-2 animate-pulse-glow">
                <span>Join as Donor</span>
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="group border-2 border-white text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white hover:text-red-700 transform hover:scale-105 transition-all duration-300 flex items-center space-x-2">
                <Play className="w-5 h-5" />
                <span>Watch Demo</span>
              </button>
            </div>
          </div>
          <div className="md:w-1/2 flex justify-center">
            <svg
              width="300"
              height="300"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 2C8.13401 2 5 5.13401 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13401 15.866 2 12 2Z"
                fill="#B91C1C"
              />
            </svg>
          </div>
        </div>
        {/* <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/50 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div> */}
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
              Why <span className="text-red-700">BloodChain</span>?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Cutting-edge blockchain technology to ensure trust, transparency,
              and security in every blood donation.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 overflow-hidden"
              >
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div
                    className={`absolute inset-0 bg-gradient-to-r ${feature.gradient} opacity-10`}
                  ></div>
                </div>
                <div
                  className={`relative w-16 h-16 bg-gradient-to-r ${feature.gradient} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
                >
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-4 group-hover:text-red-700 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-700 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Technology Stack */}
      <section id="technology" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
              Powered by <span className="text-red-700">Innovation</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Built on secure, cutting-edge technologies for a reliable blood
              management ecosystem.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
            {techStack.map((tech, index) => (
              <div
                key={index}
                className="group text-center p-6 bg-gray-50 rounded-2xl hover:bg-white hover:shadow-lg transition-all duration-300"
              >
                <tech.icon
                  className={`${tech.color} text-4xl mb-2 group-hover:scale-110 transition-transform`}
                />
                <div className="font-semibold text-gray-800">{tech.name}</div>
              </div>
            ))}
          </div>
          <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-3xl p-8 md:p-12 text-white">
            <h3 className="text-2xl md:text-3xl font-bold text-center mb-8">
              System Architecture
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-20 h-20 mx-auto mb-4 bg-red-700 rounded-full flex items-center justify-center">
                  <Database className="w-10 h-10" />
                </div>
                <h4 className="font-bold mb-2">Blockchain Layer</h4>
                <p className="text-gray-300 text-sm">
                  Ethereum smart contracts for immutable record keeping
                </p>
              </div>
              <div className="text-center">
                <div className="w-20 h-20 mx-auto mb-4 bg-red-700 rounded-full flex items-center justify-center">
                  <Globe className="w-10 h-10" />
                </div>
                <h4 className="font-bold mb-2">Storage Layer</h4>
                <p className="text-gray-300 text-sm">
                  IPFS for decentralized document storage
                </p>
              </div>
              <div className="text-center">
                <div className="w-20 h-20 mx-auto mb-4 bg-red-700 rounded-full flex items-center justify-center">
                  <Shield className="w-10 h-10" />
                </div>
                <h4 className="font-bold mb-2">Application Layer</h4>
                <p className="text-gray-300 text-sm">
                  MERN stack for secure user interfaces
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Trusted by{" "}
              <span className="text-red-400">Healthcare Leaders</span>
            </h2>
          </div>
          <div className="relative max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 md:p-12 text-center">
              <div className="text-6xl mb-6">
                {testimonials[activeTestimonial].avatar}
              </div>
              <blockquote className="text-xl md:text-2xl mb-6 italic">
                "{testimonials[activeTestimonial].content}"
              </blockquote>
              <div className="font-bold text-xl">
                {testimonials[activeTestimonial].name}
              </div>
              <div className="text-red-400">
                {testimonials[activeTestimonial].role}
              </div>
            </div>
            <div className="flex justify-center mt-8 space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === activeTestimonial
                      ? "bg-red-500 w-8"
                      : "bg-white/30"
                  }`}
                ></button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-red-700 to-red-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Join the Life-Saving Revolution
          </h2>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto opacity-90">
            Empower donors, hospitals, and blood banks with secure, transparent
            blood management.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-red-700 px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-100 transform hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-2 animate-pulse-glow">
              <Heart className="w-6 h-6" />
              <span>Become a Donor</span>
            </button>
            <button className="border-2 border-white text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white hover:text-red-700 transform hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-2">
              <Building2 className="w-6 h-6" />
              <span>Partner with Us</span>
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Heart className="w-8 h-8 text-red-700" />
                <span className="text-2xl font-bold">BloodChain</span>
              </div>
              <p className="text-gray-400">
                Revolutionizing blood management with blockchain technology.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Platform</h4>
              <ul className="space-y-2 text-gray-400">
                <li>For Donors</li>
                <li>For Blood Banks</li>
                <li>For Hospitals</li>
                <li>API Access</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Resources</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Documentation</li>
                <li>White Paper</li>
                <li>Help Center</li>
                <li>Community</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Contact</h4>
              <ul className="space-y-2 text-gray-400">
                <li>hello@bloodchain.org</li>
                <li>+1 (555) 123-4567</li>
                <li>Twitter</li>
                <li>LinkedIn</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>
              &copy; 2025 BloodChain. All rights reserved. Built with ❤️ for
              humanity.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default BloodChainLanding;
