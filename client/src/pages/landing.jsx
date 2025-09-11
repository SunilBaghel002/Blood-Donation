import React, { useState, useEffect } from "react";
import {
  Users,
  Shield,
  Database,
  MapPin,
  Droplets,
  Hospital,
  ChevronRight,
  ArrowUp,
  Star,
  User,
  Quote,
  ChevronLeft,
  ChevronRight as ChevronRightIcon,
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
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const BloodChainLanding = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 6000);
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
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
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
      image:
        "https://images.unsplash.com/photo-1516321310762-479437144403?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
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
      image:
        "https://images.unsplash.com/photo-1519494026892-80cea6e6e7f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
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
      image:
        "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
    },
  ];

  const testimonials = [
    {
      name: "Dr. Sarah Lee",
      role: "Blood Bank Manager",
      content:
        "BloodChain has streamlined our operations, reducing errors and ensuring every unit is tracked accurately.",
      image:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
    },
    {
      name: "Amit Patel",
      role: "Donor",
      content:
        "Seeing where my blood goes is incredible. The NFT rewards make donating even more rewarding!",
      image:
        "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
    },
    {
      name: "Dr. Emily Wong",
      role: "Hospital Administrator",
      content:
        "BloodChain ensures we get verified blood units quickly, saving lives in emergencies.",
      image:
        "https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
    },
    {
      name: "Priya Sharma",
      role: "Donor",
      content:
        "The platform’s transparency gives me confidence that my donations are making a real impact.",
      image:
        "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
    },
    {
      name: "Dr. Michael Chen",
      role: "Medical Director",
      content:
        "BloodChain’s blockchain technology has transformed how we manage blood supply chains.",
      image:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
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

  const futureScopes = [
    {
      title: "Plasma and Platelet Management",
      description:
        "Expand BloodChain to track and manage plasma and platelet donations, ensuring efficient allocation for critical treatments like cancer and surgeries.",
    },
    {
      title: "Organ Donation Tracking",
      description:
        "Integrate organ donation management, using blockchain to ensure ethical, transparent, and secure organ allocation processes.",
    },
    {
      title: "Vaccine Distribution",
      description:
        "Enable secure tracking of vaccine supply chains, ensuring authenticity and timely delivery during pandemics or routine immunizations.",
    },
    {
      title: "Global Healthcare Integration",
      description:
        "Partner with global health organizations to integrate BloodChain into international healthcare systems for unified resource management.",
    },
    {
      title: "AI-Powered Predictive Analytics",
      description:
        "Incorporate AI to predict blood demand, optimize inventory, and alert donors during shortages, enhancing emergency preparedness.",
    },
  ];

  const handlePrevTestimonial = () => {
    setActiveTestimonial((prev) =>
      prev === 0 ? testimonials.length - 1 : prev - 1
    );
  };

  const handleNextTestimonial = () => {
    setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const handlePrevRole = () => {
    setActiveTab((prev) => (prev === 0 ? benefitsByRole.length - 1 : prev - 1));
  };

  const handleNextRole = () => {
    setActiveTab((prev) => (prev + 1) % benefitsByRole.length);
  };

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
        @keyframes slide-in {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        @keyframes hover-lift {
          0% {
            transform: translateY(0);
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }
          100% {
            transform: translateY(-4px);
            box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
          }
        }
        @keyframes tab-switch {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 1s ease-out forwards;
        }
        .animate-slide-in {
          animation: slide-in 0.5s ease-out forwards;
        }
        .hover-lift:hover {
          animation: hover-lift 0.3s ease-out forwards;
        }
        .animate-tab-switch {
          animation: tab-switch 0.5s ease-out forwards;
        }
        .flow-path {
          stroke-dasharray: 1000;
          stroke-dashoffset: 1000;
          animation: flow-path 2s linear forwards;
        }
        @keyframes flow-path {
          to {
            stroke-dashoffset: 0;
          }
        }
        .hero-bg {
          background: #b91c1c;
          background-image: radial-gradient(
              circle at 10% 20%,
              rgba(255, 255, 255, 0.1) 0%,
              transparent 20%
            ),
            radial-gradient(
              circle at 90% 80%,
              rgba(255, 255, 255, 0.1) 0%,
              transparent 20%
            );
        }
        .carousel-card {
          transition: transform 0.5s ease-in-out, opacity 0.5s ease-in-out;
        }
        .carousel-container:hover .carousel-card {
          opacity: 0.6;
        }
        .carousel-container:hover .carousel-card.active {
          transform: scale(1.05);
          opacity: 1;
        }
      `}</style>

      <Navbar />

      {/* Hero Section */}
      <section
        id="about"
        className="min-h-screen hero-bg flex items-center justify-center text-white relative overflow-hidden pt-20"
      >
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1
            className="text-4xl sm:text-5xl lg:text-7xl font-extrabold mb-6 leading-tight animate-fade-in"
            style={{ animationDelay: "0.2s" }}
          >
            <span className="block">BloodChain</span>
            <span className="block text-yellow-300">
              Saving Lives with Blockchain
            </span>
          </h1>
          <p
            className="text-lg sm:text-xl lg:text-2xl mb-10 max-w-4xl mx-auto animate-fade-in"
            style={{ animationDelay: "0.4s" }}
          >
            A decentralized, blockchain-powered platform that connects donors,
            blood banks, and hospitals to ensure secure, transparent, and
            efficient blood donation, saving lives worldwide.
          </p>
          <div
            className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in"
            style={{ animationDelay: "0.6s" }}
          >
            <a
              href="/signup"
              className="bg-yellow-300 text-red-600 px-8 py-4 rounded-full font-bold text-lg hover:bg-yellow-400 transition-all flex items-center justify-center hover-lift"
            >
              Become a Donor <Users className="w-5 h-5 ml-2" />
            </a>
            <a
              href="#future-scopes"
              className="border-2 border-white text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white hover:text-red-600 transition-all flex items-center justify-center hover-lift"
            >
              Our Vision <ChevronRight className="w-5 h-5 ml-2" />
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
            Traditional blood donation systems are plagued by fraud, wastage,
            delays, and lack of transparency. BloodChain uses blockchain, smart
            contracts, and IPFS to deliver a secure, efficient, and transparent
            solution.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { title: "Fraud", description: "Fake donations erode trust." },
              {
                title: "Wastage",
                description: "Poor tracking leads to expired blood.",
              },
              {
                title: "Delays",
                description: "Slow systems hinder emergencies.",
              },
              {
                title: "Opacity",
                description: "Lack of transparency causes inefficiencies.",
              },
            ].map((issue, index) => (
              <div
                key={index}
                className="p-6 bg-gray-100 rounded-lg shadow-md transition-all hover-lift animate-fade-in"
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

      {/* How It Works Section */}
      <section id="how-it-works" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 text-center mb-6 animate-fade-in">
            How <span className="text-red-600">BloodChain</span> Works
          </h2>
          <p className="text-lg text-gray-600 text-center max-w-3xl mx-auto mb-12 animate-fade-in">
            A seamless, blockchain-powered process to manage blood donations
            from donor to patient.
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
                  <circle cx={20 + index * 200} cy={32} r="6" fill="#b91c1c" />
                  <path
                    d={`M ${20 + index * 200 + 6} 32 L ${
                      20 + index * 200 + 15
                    } 32 L ${20 + index * 200 + 12} 28 M ${
                      20 + index * 200 + 15
                    } 32 L ${20 + index * 200 + 12} 36`}
                    stroke="#b91c1c"
                    strokeWidth="2"
                    fill="none"
                  />
                </g>
              ))}
            </svg>
            <div className="relative grid grid-cols-1 lg:grid-cols-5 gap-6">
              {howItWorksSteps.map((step, index) => (
                <div
                  key={index}
                  className="p-6 bg-white rounded-lg shadow-md transition-all hover-lift animate-fade-in"
                  style={{ animationDelay: `${index * 0.2}s` }}
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

      {/* Benefits by Role Section (Carousel) */}
      <section id="benefits" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 text-center mb-6 animate-fade-in">
            Who Benefits from <span className="text-red-600">BloodChain</span>?
          </h2>
          <p className="text-lg text-gray-600 text-center max-w-3xl mx-auto mb-12 animate-fade-in">
            Tailored tools empower every stakeholder in the blood donation
            ecosystem.
          </p>
          <div className="relative">
            <button
              onClick={handlePrevRole}
              className="absolute left-0 top-1/2 transform -translate-y-1/2 p-3 bg-red-600 text-white rounded-full hover:bg-red-700 transition-all z-10"
              aria-label="Previous role"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={handleNextRole}
              className="absolute right-0 top-1/2 transform -translate-y-1/2 p-3 bg-red-600 text-white rounded-full hover:bg-red-700 transition-all z-10"
              aria-label="Next role"
            >
              <ChevronRightIcon className="w-6 h-6" />
            </button>
            <div className="carousel-container overflow-hidden">
              <div
                className="flex transition-transform duration-500"
                style={{ transform: `translateX(-${activeTab * 100}%)` }}
              >
                {benefitsByRole.map((role, index) => (
                  <div
                    key={index}
                    className="carousel-card min-w-full lg:min-w-[25%] p-4 flex items-center justify-center"
                  >
                    <div className="bg-gradient-to-br from-gray-100 to-white rounded-lg shadow-lg p-6 w-full max-w-md mx-auto">
                      <img
                        src={role.image}
                        alt={`${role.role} illustration`}
                        className="w-40 h-40 object-cover rounded-lg mb-4"
                      />
                      <h3 className="text-2xl font-bold text-gray-800 mb-3">
                        {role.role}
                      </h3>
                      <ol className="text-gray-600 text-base space-y-2 list-decimal list-inside">
                        {role.benefits.map((benefit, i) => (
                          <li key={i}>{benefit}</li>
                        ))}
                      </ol>
                    </div>
                  </div>
                ))}
              </div>
            </div>
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
            BloodChain leverages cutting-edge technology to transform blood
            donation.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="p-6 bg-white rounded-lg shadow-md transition-all hover-lift animate-fade-in"
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
            A robust tech stack ensures security, scalability, and performance.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {techStack.map((tech, index) => (
              <div
                key={index}
                className="p-4 bg-gray-100 rounded-lg shadow-md transition-all hover-lift animate-fade-in"
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
            Trusted by donors, blood banks, and hospitals worldwide.
          </p>
          <div className="relative">
            <div className="flex justify-center items-center">
              <button
                onClick={handlePrevTestimonial}
                className="p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-all mx-2"
                aria-label="Previous testimonial"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <div className="flex-1 overflow-hidden">
                <div
                  className="flex transition-transform duration-500"
                  style={{
                    transform: `translateX(-${activeTestimonial * 100}%)`,
                  }}
                >
                  {testimonials.map((testimonial, index) => (
                    <div key={index} className="min-w-[100%] p-4">
                      <div className="p-6 bg-white rounded-lg shadow-md transition-all hover-lift animate-slide-in">
                        <img
                          src={testimonial.image}
                          alt={`${testimonial.name} profile`}
                          className="w-16 h-16 rounded-full mx-auto mb-4 object-cover"
                        />
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
                    </div>
                  ))}
                </div>
              </div>
              <button
                onClick={handleNextTestimonial}
                className="p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-all mx-2"
                aria-label="Next testimonial"
              >
                <ChevronRightIcon className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Future Scopes Section */}
      <section id="future-scopes" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 text-center mb-6 animate-fade-in">
            Our Vision for <span className="text-red-600">Tomorrow</span>
          </h2>
          <p className="text-lg text-gray-600 text-center max-w-3xl mx-auto mb-12 animate-fade-in">
            BloodChain is more than blood donation—it's a platform for
            transforming healthcare resource management worldwide.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {futureScopes.map((scope, index) => (
              <div
                key={index}
                className="p-6 bg-gray-100 rounded-lg shadow-md transition-all hover-lift animate-fade-in"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <Users className="w-10 h-10 text-red-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-center mb-2">
                  {scope.title}
                </h3>
                <p className="text-gray-600 text-sm text-center">
                  {scope.description}
                </p>
              </div>
            ))}
          </div>
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
              className="bg-yellow-300 text-red-600 px-8 py-3 rounded-full font-bold text-lg hover:bg-yellow-400 transition-all flex items-center hover-lift"
            >
              Become a Donor <Users className="w-5 h-5 ml-2" />
            </a>
            <a
              href="/contact"
              className="border-2 border-white text-white px-8 py-3 rounded-full font-bold text-lg hover:bg-white hover:text-red-600 transition-all flex items-center hover-lift"
            >
              Partner with Us <Users className="w-5 h-5 ml-2" />
            </a>
          </div>
        </div>
      </section>

      <Footer />

      {/* Back to Top Button */}
      <button
        className={`fixed bottom-6 right-6 p-3 bg-red-600 text-white rounded-full shadow-lg hover:bg-red-700 transition-all hover-lift ${
          scrollY > 300 ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        aria-label="Scroll to top"
      >
        <ArrowUp className="w-6 h-6" />
      </button>
    </div>
  );
};

export default BloodChainLanding;
