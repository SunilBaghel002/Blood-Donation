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

const BloodChainLanding = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
      gradient: "from-blue-500 to-purple-600",
    },
    {
      icon: Shield,
      title: "Data Security",
      description:
        "Personal information encrypted and stored off-chain with verification hashes",
      gradient: "from-green-500 to-teal-600",
    },
    {
      icon: Globe,
      title: "IPFS Storage",
      description:
        "Decentralized storage for consent forms and medical certificates",
      gradient: "from-purple-500 to-pink-600",
    },
    {
      icon: Activity,
      title: "Real-time Tracking",
      description: "Track your donation from collection to life-saving usage",
      gradient: "from-orange-500 to-red-600",
    },
    {
      icon: Users,
      title: "Multi-stakeholder",
      description:
        "Connects donors, blood banks, and hospitals in one platform",
      gradient: "from-indigo-500 to-blue-600",
    },
    {
      icon: Lock,
      title: "Smart Contracts",
      description: "Automated workflows with Solidity smart contracts",
      gradient: "from-yellow-500 to-orange-600",
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
    { name: "React", color: "text-blue-500" },
    { name: "Node.js", color: "text-green-500" },
    { name: "MongoDB", color: "text-green-600" },
    { name: "Express", color: "text-gray-600" },
    { name: "Ethereum", color: "text-purple-500" },
    { name: "Solidity", color: "text-blue-600" },
    { name: "IPFS", color: "text-orange-500" },
    { name: "Web3", color: "text-yellow-500" },
  ];

  const FloatingCard = ({ children, delay = 0 }) => (
    <div
      className="transform hover:scale-105 transition-all duration-500 ease-out"
      style={{
        animation: `float 6s ease-in-out infinite ${delay}s`,
      }}
    >
      {children}
    </div>
  );

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }
        @keyframes pulse-glow {
          0%,
          100% {
            box-shadow: 0 0 20px rgba(220, 38, 38, 0.3);
          }
          50% {
            box-shadow: 0 0 40px rgba(220, 38, 38, 0.6),
              0 0 60px rgba(220, 38, 38, 0.4);
          }
        }
        @keyframes gradient-shift {
          0%,
          100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
        .animate-pulse-glow {
          animation: pulse-glow 2s ease-in-out infinite;
        }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient-shift 3s ease infinite;
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
              <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-pink-600 rounded-lg flex items-center justify-center">
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
                  className={`font-medium hover:text-red-500 transition-colors ${
                    scrollY > 50 ? "text-gray-700" : "text-white"
                  }`}
                >
                  {item}
                </a>
              ))}
              <button className="bg-gradient-to-r from-red-500 to-pink-600 text-white px-6 py-2 rounded-full font-semibold hover:from-red-600 hover:to-pink-700 transform hover:scale-105 transition-all duration-300 animate-pulse-glow">
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
      <section className="relative min-h-screen bg-gradient-to-br from-red-600 via-red-700 to-red-800 animate-gradient flex items-center overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-black/20"></div>
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white/30 rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 3}s`,
              }}
            ></div>
          ))}
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <FloatingCard>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Revolutionizing
              <br />
              <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent animate-gradient">
                Blood Management
              </span>
            </h1>
          </FloatingCard>

          <FloatingCard delay={0.2}>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto opacity-90">
              The world's first blockchain-powered blood donation platform
              ensuring
              <span className="font-semibold text-yellow-300">
                {" "}
                complete transparency
              </span>
              ,
              <span className="font-semibold text-yellow-300">
                {" "}
                immutable records
              </span>
              , and
              <span className="font-semibold text-yellow-300">
                {" "}
                life-saving traceability
              </span>
            </p>
          </FloatingCard>

          <FloatingCard delay={0.4}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <button className="group bg-white text-red-600 px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-100 transform hover:scale-105 transition-all duration-300 flex items-center space-x-2 animate-pulse-glow">
                <span>Start Saving Lives</span>
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="group border-2 border-white text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white hover:text-red-600 transform hover:scale-105 transition-all duration-300 flex items-center space-x-2">
                <Play className="w-5 h-5" />
                <span>Watch Demo</span>
              </button>
            </div>
          </FloatingCard>

          {/* Stats */}
          <FloatingCard delay={0.6}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
              {stats.map((stat, index) => (
                <div key={index} className="text-center group">
                  <div className="w-16 h-16 mx-auto mb-4 bg-white/20 rounded-full flex items-center justify-center group-hover:bg-white/30 transition-colors">
                    <stat.icon className="w-8 h-8" />
                  </div>
                  <div className="text-3xl font-bold mb-2">{stat.value}</div>
                  <div className="text-white/80">{stat.label}</div>
                </div>
              ))}
            </div>
          </FloatingCard>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/50 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
              Cutting-Edge <span className="text-red-600">Features</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Built on the latest blockchain technology to ensure trust,
              transparency, and security in every blood donation
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <FloatingCard key={index} delay={index * 0.1}>
                <div className="group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 overflow-hidden">
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div
                      className={`absolute inset-0 bg-gradient-to-r ${feature.gradient} opacity-5`}
                    ></div>
                  </div>

                  <div
                    className={`relative w-16 h-16 bg-gradient-to-r ${feature.gradient} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>

                  <h3 className="text-xl font-bold text-gray-800 mb-4 group-hover:text-red-600 transition-colors">
                    {feature.title}
                  </h3>

                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>

                  <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>
              </FloatingCard>
            ))}
          </div>
        </div>
      </section>

      {/* Technology Stack */}
      <section id="technology" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
              Powered by <span className="text-red-600">Advanced Tech</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Built on the most reliable and secure technologies in the
              blockchain ecosystem
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
            {techStack.map((tech, index) => (
              <FloatingCard key={index} delay={index * 0.05}>
                <div className="group text-center p-6 bg-gray-50 rounded-2xl hover:bg-white hover:shadow-lg transition-all duration-300">
                  <div
                    className={`text-4xl font-bold ${tech.color} mb-2 group-hover:scale-110 transition-transform`}
                  >
                    {tech.name.charAt(0)}
                  </div>
                  <div className="font-semibold text-gray-800">{tech.name}</div>
                </div>
              </FloatingCard>
            ))}
          </div>

          {/* Architecture Diagram */}
          <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-3xl p-8 md:p-12 text-white">
            <h3 className="text-2xl md:text-3xl font-bold text-center mb-8">
              System Architecture
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-20 h-20 mx-auto mb-4 bg-blue-500 rounded-full flex items-center justify-center">
                  <Database className="w-10 h-10" />
                </div>
                <h4 className="font-bold mb-2">Blockchain Layer</h4>
                <p className="text-gray-300 text-sm">
                  Ethereum smart contracts for immutable record keeping
                </p>
              </div>
              <div className="text-center">
                <div className="w-20 h-20 mx-auto mb-4 bg-green-500 rounded-full flex items-center justify-center">
                  <Globe className="w-10 h-10" />
                </div>
                <h4 className="font-bold mb-2">Storage Layer</h4>
                <p className="text-gray-300 text-sm">
                  IPFS for decentralized document storage
                </p>
              </div>
              <div className="text-center">
                <div className="w-20 h-20 mx-auto mb-4 bg-red-500 rounded-full flex items-center justify-center">
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
      <section className="py-20 bg-gradient-to-r from-red-600 to-pink-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <FloatingCard>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Save Lives?
            </h2>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto opacity-90">
              Join the revolution in blood management. Every donation matters,
              every life counts.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-red-600 px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-100 transform hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-2 animate-pulse-glow">
                <Heart className="w-6 h-6" />
                <span>Become a Donor</span>
              </button>
              <button className="border-2 border-white text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white hover:text-red-600 transform hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-2">
                <Building2 className="w-6 h-6" />
                <span>Partner with Us</span>
              </button>
            </div>
          </FloatingCard>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Heart className="w-8 h-8 text-red-500" />
                <span className="text-2xl font-bold">BloodChain</span>
              </div>
              <p className="text-gray-400">
                Revolutionizing blood management through blockchain technology.
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
              &copy; 2024 BloodChain. All rights reserved. Built with ❤️ for
              humanity.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default BloodChainLanding;
