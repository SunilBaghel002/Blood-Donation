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
  Quote,
} from "lucide-react";
import {
  SiReact,
  SiNodedotjs,
  SiMongodb,
  SiEthereum,
  SiSolidity,
  SiIpfs,
  SiWeb3Dotjs,
} from "react-icons/si";

const BloodChainLanding = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [activeFlowStep, setActiveFlowStep] = useState(null);
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  // Handle scroll for navbar and back-to-top
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

  const howItWorksSteps = [
    {
      title: "Donor Signs Up",
      description:
        "Donors register securely with blockchain-verified identities using MetaMask.",
      icon: User,
    },
    {
      title: "Blood Donation",
      description:
        "Each donation is logged immutably on Ethereum for full transparency.",
      icon: Droplets,
    },
    {
      title: "Blood Bank Updates",
      description:
        "Blood banks update inventory in real-time using smart contracts.",
      icon: Database,
    },
    {
      title: "Hospital Requests",
      description:
        "Hospitals request blood via secure smart contracts for verified transfers.",
      icon: Hospital,
    },
    {
      title: "Track & Deliver",
      description:
        "Trace blood from donor to patient with complete blockchain transparency.",
      icon: MapPin,
    },
  ];

  const features = [
    {
      title: "Transparency",
      description:
        "Every donation, transfer, and allocation is recorded on Ethereum, ensuring trust.",
      icon: Database,
    },
    {
      title: "Security",
      description:
        "JWT authentication, MetaMask, and IPFS encryption protect sensitive data.",
      icon: Shield,
    },
    {
      title: "Efficiency",
      description:
        "Smart contracts automate workflows, reducing errors and speeding up processes.",
      icon: Users,
    },
    {
      title: "Traceability",
      description:
        "Track every blood unit from donation to delivery with immutable records.",
      icon: MapPin,
    },
  ];

  const benefitsByRole = [
    {
      role: "Donors",
      icon: User,
      benefits: [
        "Track your donation's impact in real-time",
        "Earn NFT rewards for donation milestones",
        "Securely manage your donation history",
        "Receive location-based urgent donation alerts",
      ],
    },
    {
      role: "Blood Banks",
      icon: Database,
      benefits: [
        "Real-time inventory updates via blockchain",
        "Reduce wastage with automated tracking",
        "Ensure compliance with tamper-proof records",
        "Streamline logistics with smart contracts",
      ],
    },
    {
      role: "Hospitals",
      icon: Hospital,
      benefits: [
        "Verify blood authenticity instantly",
        "Access regional blood inventories in real-time",
        "Request blood securely via smart contracts",
        "Improve emergency response efficiency",
      ],
    },
    {
      role: "Admins",
      icon: Shield,
      benefits: [
        "Monitor platform activities securely",
        "Detect and prevent fraudulent practices",
        "Generate automated compliance reports",
        "Manage user roles with blockchain security",
      ],
    },
  ];

  const testimonials = [
    {
      name: "Dr. Sarah Lee",
      role: "Blood Bank Manager",
      content:
        "BloodChain has revolutionized our inventory management. The transparency and automation save us time and ensure accuracy.",
    },
    {
      name: "Amit Patel",
      role: "Donor",
      content:
        "I love seeing where my blood goes. The NFT rewards for my donations make it even more motivating!",
    },
    {
      name: "Dr. Emily Wong",
      role: "Hospital Administrator",
      content:
        "With BloodChain, we get verified blood units quickly, which is critical for emergencies. It's a game-changer.",
    },
  ];

  const techStack = [
    {
      name: "React.js",
      description: "Builds a fast, user-friendly interface.",
      icon: SiReact,
      color: "text-blue-500",
    },
    {
      name: "Node.js",
      description: "Powers real-time data processing.",
      icon: SiNodedotjs,
      color: "text-green-500",
    },
    {
      name: "MongoDB",
      description: "Stores data securely and efficiently.",
      icon: SiMongodb,
      color: "text-green-600",
    },
    {
      name: "Ethereum",
      description: "Ensures transparent, tamper-proof records.",
      icon: SiEthereum,
      color: "text-gray-700",
    },
    {
      name: "Solidity",
      description: "Creates secure smart contracts.",
      icon: SiSolidity,
      color: "text-gray-600",
    },
    {
      name: "IPFS",
      description: "Stores medical records securely.",
      icon: SiIpfs,
      color: "text-blue-600",
    },
    {
      name: "Web3.js",
      description: "Connects the platform to blockchain.",
      icon: SiWeb3Dotjs,
      color: "text-pink-500",
    },
    {
      name: "Hardhat",
      description: "Simplifies smart contract development.",
      icon: SiSolidity,
      color: "text-yellow-600",
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
          animation: flow-scale 1.5s ease-in-out;
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
        .testimonial-active {
          transform: scale(1.05);
          z-index: 10;
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
            {[
              "About",
              "How It Works",
              "Benefits",
              "Features",
              "Technology",
              "Testimonials",
              "Contact",
            ].map((item) => (
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
              {[
                "About",
                "How It Works",
                "Benefits",
                "Features",
                "Technology",
                "Testimonials",
                "Contact",
              ].map((item) => (
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
        className="min-h-screen bg-red-600 flex items-center justify-center text-white relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center animate-fade-in">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            BloodChain: Revolutionizing Blood Donation
            <br />
            <span className="text-yellow-300">With Blockchain Technology</span>
          </h1>
          <p className="text-lg sm:text-xl lg:text-2xl mb-8 max-w-3xl mx-auto">
            A decentralized platform that ensures transparency, security, and
            efficiency in blood donation, connecting donors, blood banks, and
            hospitals to save lives.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/signup"
              className="bg-white text-red-600 px-8 py-3 rounded-full font-bold text-lg hover:bg-gray-100 transition-all flex items-center justify-center animate-pulse"
            >
              Become a Donor <ChevronRight className="w-5 h-5 ml-2" />
            </a>
            <a
              href="#how-it-works"
              className="border-2 border-white text-white px-8 py-3 rounded-full font-bold text-lg hover:bg-white hover:text-red-600 transition-all"
            >
              Explore the Platform
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
            Traditional blood donation systems face critical challenges: fraud,
            black marketing, duplicate records, and wastage. BloodChain
            leverages blockchain, smart contracts, and IPFS to create a secure,
            transparent, and efficient platform, ensuring every drop of blood
            reaches patients in need.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                title: "Fraud",
                description:
                  "Fake donations and records erode trust in the system.",
              },
              {
                title: "Wastage",
                description: "Poor tracking leads to expired blood units.",
              },
              {
                title: "Delays",
                description: "Slow processes hinder emergency responses.",
              },
              {
                title: "Opacity",
                description: "Lack of transparency causes inefficiencies.",
              },
            ].map((issue, index) => (
              <div
                key={index}
                className="p-6 bg-gray-100 rounded-lg shadow-md hover:shadow-lg transition-all animate-fade-in"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <Star className="w-10 h-10 text-red-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">{issue.title}</h3>
                <p className="text-gray-600 text-sm">{issue.description}</p>
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
            A seamless, blockchain-powered process to manage blood donations
            from start to finish.
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
                    activeFlowStep === index ? "bg-red-50" : ""
                  }`}
                  style={{ animationDelay: `${index * 0.2}s` }}
                  onMouseEnter={() => setActiveFlowStep(index)}
                  onMouseLeave={() => setActiveFlowStep(null)}
                >
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

      {/* Benefits by Role Section */}
      <section id="benefits" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 text-center mb-6 animate-fade-in">
            Who Benefits from <span className="text-red-600">BloodChain</span>?
          </h2>
          <p className="text-lg text-gray-600 text-center max-w-3xl mx-auto mb-12 animate-fade-in">
            BloodChain empowers every stakeholder in the blood donation process
            with tailored tools and benefits.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefitsByRole.map((role, index) => (
              <div
                key={index}
                className="p-6 bg-gray-100 rounded-lg shadow-md hover:shadow-lg transition-all animate-fade-in"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <div className="w-12 h-12 bg-red-600 text-white rounded-full flex items-center justify-center mx-auto mb-4">
                  <role.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-semibold text-center mb-4">
                  {role.role}
                </h3>
                <ul className="text-gray-600 text-sm space-y-2">
                  {role.benefits.map((benefit, i) => (
                    <li key={i} className="flex items-start">
                      <ChevronRight className="w-4 h-4 text-red-600 mr-2 mt-1" />
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 text-center mb-6 animate-fade-in">
            Key <span className="text-red-600">Features</span>
          </h2>
          <p className="text-lg text-gray-600 text-center max-w-3xl mx-auto mb-12 animate-fade-in">
            BloodChain harnesses blockchain and modern tech to transform blood
            donation.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-all animate-fade-in"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
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
      <section id="technology" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 text-center mb-6 animate-fade-in">
            Powered by <span className="text-red-600">Cutting-Edge Tech</span>
          </h2>
          <p className="text-lg text-gray-600 text-center max-w-3xl mx-auto mb-12 animate-fade-in">
            BloodChain is built with a robust tech stack for security,
            scalability, and performance.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {techStack.map((tech, index) => (
              <div
                key={index}
                className="p-4 bg-gray-100 rounded-lg shadow-md hover:shadow-lg transition-all animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div
                  className={`w-12 h-12 ${tech.color} flex items-center justify-center mx-auto mb-4`}
                >
                  <tech.icon className="w-8 h-8" />
                </div>
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

      {/* Testimonials Section */}
      <section id="testimonials" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 text-center mb-6 animate-fade-in">
            What <span className="text-red-600">People Say</span>
          </h2>
          <p className="text-lg text-gray-600 text-center max-w-3xl mx-auto mb-12 animate-fade-in">
            Hear from those who trust BloodChain to save lives.
          </p>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className={`p-6 bg-white rounded-lg shadow-md transition-all duration-300 ${
                  activeTestimonial === index
                    ? "testimonial-active bg-red-50"
                    : ""
                }`}
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <Quote className="w-8 h-8 text-red-600 mx-auto mb-4" />
                <p className="text-gray-600 text-center text-sm mb-4">
                  "{testimonial.content}"
                </p>
                <p className="text-gray-800 font-semibold text-center">
                  {testimonial.name}
                </p>
                <p className="text-gray-500 text-sm text-center">
                  {testimonial.role}
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
            BloodChain is poised to revolutionize healthcare beyond blood
            donation. By leveraging blockchain, it can manage plasma, organs,
            and vaccines, ensuring transparency and efficiency in critical
            resource distribution globally.
          </p>
          <a
            href="/whitepaper"
            className="bg-red-600 text-white px-8 py-3 rounded-full font-bold text-lg hover:bg-red-700 transition-all flex items-center justify-center mx-auto"
          >
            Read Our Vision <ChevronRight className="w-5 h-5 ml-2" />
          </a>
        </div>
      </section>

      {/* CTA Section */}
      <section id="contact" className="py-16 bg-red-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6 animate-fade-in">
            Join the Life-Saving Mission
          </h2>
          <p className="text-lg mb-8 max-w-3xl mx-auto animate-fade-in">
            Be part of BloodChain to make blood donation secure, transparent,
            and efficient, saving lives every day.
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
              Partner with Us <Users className="w-5 h-5 ml-2" />
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
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Heart className="w-8 h-8 text-red-600" />
                <span className="text-xl font-bold">BloodChain</span>
              </div>
              <p className="text-gray-400 text-sm">
                Transforming blood donation with blockchain technology.
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
