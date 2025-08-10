import React, { useState, useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
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
  User,
  Hospital,
  Banknote,
  UserCheck,
  ArrowUp,
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
  const canvasRef = useRef(null);

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

  // 3D Interactive Blood Drop with responsive sizing
  useEffect(() => {
    const canvas = canvasRef.current;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });

    // Responsive canvas size
    const updateCanvasSize = () => {
      const width =
        window.innerWidth < 640 ? 200 : window.innerWidth < 1024 ? 300 : 400;
      const height = width;
      renderer.setSize(width, height);
      camera.aspect = 1;
      camera.updateProjectionMatrix();
    };
    updateCanvasSize();
    window.addEventListener("resize", updateCanvasSize);

    // Teardrop shape
    const points = [];
    for (let i = 0; i < 20; i++) {
      const x = Math.sin((i * Math.PI) / 20) * (1 - i / 20) * 1.5;
      const y = (i - 10) * 0.2;
      points.push(new THREE.Vector2(x, y));
    }
    const geometry = new THREE.LatheGeometry(points, 32);
    const material = new THREE.MeshPhongMaterial({
      color: 0xb91c1c,
      shininess: 300,
      side: THREE.DoubleSide,
    });
    const bloodDrop = new THREE.Mesh(geometry, material);
    scene.add(bloodDrop);

    // Lighting
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);
    const ambientLight = new THREE.AmbientLight(0x404040, 2);
    scene.add(ambientLight);
    const hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x444444, 1);
    scene.add(hemisphereLight);

    camera.position.z = 5;

    // Orbit Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableZoom = false;
    controls.enablePan = false;

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      window.removeEventListener("resize", updateCanvasSize);
      renderer.dispose();
      controls.dispose();
    };
  }, []);

  const impactStats = [
    {
      value: "118M+",
      label: "Global Blood Donations Annually (WHO)",
      icon: Droplets,
    },
    {
      value: "40%",
      label: "Donations from 16% of World Population",
      icon: Globe,
    },
    { value: "Every 2s", label: "Someone Needs Blood Worldwide", icon: Clock },
    {
      value: "$1.4B",
      label: "Blockchain Healthcare Market (2024)",
      icon: TrendingUp,
    },
    { value: "34%", label: "CAGR for Blockchain in Healthcare", icon: Zap },
  ];

  const howItWorksSteps = [
    {
      title: "Donor Registers",
      description: "Secure registration with blockchain verification.",
    },
    {
      title: "Blood Donation",
      description: "Event logged immutably on Ethereum.",
    },
    {
      title: "Inventory Update",
      description: "Blood banks track units in real-time.",
    },
    {
      title: "Hospital Request",
      description: "Verified transfers with smart contracts.",
    },
    {
      title: "Trace & Use",
      description: "Full traceability from donor to recipient.",
    },
  ];

  const roleBenefits = [
    {
      role: "Donors",
      icon: User,
      benefits: [
        "Track your impact",
        "Get alerts for needs",
        "Earn rewards via NFTs",
      ],
    },
    {
      role: "Hospitals",
      icon: Hospital,
      benefits: [
        "Verify blood authenticity",
        "Request units seamlessly",
        "Access real-time inventory",
      ],
    },
    {
      role: "Blood Banks",
      icon: Banknote,
      benefits: [
        "Manage inventory transparently",
        "Automate validations",
        "Reduce waste with AI predictions",
      ],
    },
    {
      role: "Admins",
      icon: UserCheck,
      benefits: [
        "Oversee permissions",
        "Monitor system health",
        "Ensure compliance",
      ],
    },
  ];

  const features = [
    {
      icon: Database,
      title: "Blockchain Transparency",
      description:
        "Every donation and transfer immutably recorded on Ethereum blockchain",
      gradient: "from-red-600 to-pink-600",
    },
    {
      icon: Shield,
      title: "Data Security",
      description:
        "Personal information encrypted and stored off-chain with verification hashes",
      gradient: "from-red-600 to-pink-600",
    },
    {
      icon: Globe,
      title: "IPFS Storage",
      description:
        "Decentralized storage for consent forms and medical certificates",
      gradient: "from-red-600 to-pink-600",
    },
    {
      icon: Activity,
      title: "Real-time Tracking",
      description: "Track your donation from collection to life-saving usage",
      gradient: "from-red-600 to-pink-600",
    },
    {
      icon: Users,
      title: "Multi-stakeholder",
      description:
        "Connects donors, blood banks, and hospitals in one platform",
      gradient: "from-red-600 to-pink-600",
    },
    {
      icon: Lock,
      title: "Smart Contracts",
      description: "Automated workflows with Solidity smart contracts",
      gradient: "from-red-600 to-pink-600",
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
    <div className="min-h-screen bg-white font-sans">
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
          scrollY > 50
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
                  scrollY > 50 ? "text-gray-900" : "text-white"
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
                  href={`#${item.toLowerCase().replace(" ", "-")}`}
                  className={`font-medium text-lg hover:text-red-500 transition-colors ${
                    scrollY > 50 ? "text-gray-800" : "text-white"
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
                    href={`#${item.toLowerCase().replace(" ", "-")}`}
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

      {/* Hero Section */}
      <section
        className="relative min-h-screen bg-gradient-to-br from-red-600 to-pink-500 flex items-center overflow-hidden parallax-bg"
        style={{
          backgroundImage: `url('https://media.istockphoto.com/id/1664691267/photo/red-and-white-blood-cells-in-an-artery.jpg?s=612x612&w=0&k=20&c=8bymdSkcOuZoMhc8_WmYzsPuKqgy9_UVgAa0BysLQlA=')`,
        }}
      >
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center gap-8">
          <div className="text-center lg:text-left text-white lg:w-1/2 animate-fade-in">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Empowering
              <br />
              <span className="bg-gradient-to-r from-yellow-400 to-amber-400 bg-clip-text text-transparent">
                Life-Saving Trust
              </span>
            </h1>
            <p className="text-lg sm:text-xl lg:text-2xl mb-8 max-w-2xl opacity-90">
              Revolutionize blood management with blockchain-powered{" "}
              <span className="font-semibold text-amber-300">transparency</span>
              ,{" "}
              <span className="font-semibold text-amber-300">traceability</span>
              , and{" "}
              <span className="font-semibold text-amber-300">security</span> for
              donors, hospitals, and blood banks.
            </p>
            <p className="text-base sm:text-lg mb-8">
              Join 118M+ donors saving lives with blockchain transparency.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start items-center">
              <a
                href="/signup"
                className="group bg-white text-red-600 px-6 sm:px-8 py-3 sm:py-4 rounded-full font-bold text-lg hover:bg-gray-100 transform hover:scale-105 transition-all duration-300 flex items-center space-x-2 animate-pulse-glow"
                aria-label="Join as a donor"
              >
                <span>Join as Donor</span>
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </a>
              <button className="group border-2 border-white text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full font-bold text-lg hover:bg-white hover:text-red-600 transform hover:scale-105 transition-all duration-300 flex items-center space-x-2">
                <Play className="w-5 h-5" />
                <span>Watch Demo</span>
              </button>
            </div>
          </div>
          <div className="lg:w-1/2 flex justify-center">
            <canvas
              ref={canvasRef}
              className="w-[200px] sm:w-[300px] lg:w-[400px] h-[200px] sm:h-[300px] lg:h-[400px]"
            />
          </div>
        </div>
      </section>

      {/* Impact Stats Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16 animate-fade-in">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Our <span className="text-red-600">Global Impact</span>
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto">
              BloodChain tackles critical shortages and inefficiencies in the
              global blood supply chain.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6 lg:gap-8">
            {impactStats.map((stat, index) => (
              <div
                key={index}
                className="text-center p-4 sm:p-6 bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 animate-fade-in border border-gray-100"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <stat.icon className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-4 text-red-600" />
                <div className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                  {stat.value}
                </div>
                <div className="text-sm sm:text-base text-gray-600">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-12 sm:py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16 animate-fade-in">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              How <span className="text-red-600">BloodChain</span> Works
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto">
              A seamless, decentralized process ensuring safety and efficiency.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row flex-wrap justify-center items-center gap-4 sm:gap-6">
            {howItWorksSteps.map((step, index) => (
              <div
                key={index}
                className="text-center p-4 sm:p-6 bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 animate-fade-in w-full sm:w-[calc(50%-1rem)] lg:w-[calc(20%-1rem)]"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <div className="text-xl sm:text-2xl font-bold mb-2 text-gray-900">
                  {index + 1}. {step.title}
                </div>
                <p className="text-sm sm:text-base text-gray-600">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits by Role Section */}
      <section id="benefits" className="py-12 sm:py-16 lg:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16 animate-fade-in">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Benefits for <span className="text-red-600">Every Role</span>
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto">
              Tailored features for donors, hospitals, blood banks, and admins.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {roleBenefits.map((role, index) => (
              <div
                key={index}
                className="p-4 sm:p-6 bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 animate-fade-in border border-gray-100"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <role.icon className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-4 text-red-600" />
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 text-center">
                  {role.role}
                </h3>
                <ul className="list-disc list-inside text-sm sm:text-base text-gray-600">
                  {role.benefits.map((benefit, i) => (
                    <li key={i}>{benefit}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-12 sm:py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16 animate-fade-in">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Why <span className="text-red-600">BloodChain</span>?
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto">
              Cutting-edge blockchain technology ensuring trust, transparency,
              and security in every blood donation.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group relative bg-white rounded-xl p-6 sm:p-8 shadow-md hover:shadow-xl transition-all duration-500 border border-gray-100 overflow-hidden animate-fade-in"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div
                    className={`absolute inset-0 bg-gradient-to-r ${feature.gradient} opacity-10`}
                  ></div>
                </div>
                <div
                  className={`relative w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-r ${feature.gradient} rounded-lg flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300`}
                >
                  <feature.icon className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 group-hover:text-red-600 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-600 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Technology Stack */}
      <section id="technology" className="py-12 sm:py-16 lg:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16 animate-fade-in">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Powered by <span className="text-red-600">Innovation</span>
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto">
              Built on secure, cutting-edge technologies for a reliable blood
              management ecosystem.
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 mb-12 sm:mb-16">
            {techStack.map((tech, index) => (
              <div
                key={index}
                className="group text-center p-4 sm:p-6 bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <tech.icon
                  className={`${tech.color} text-3xl sm:text-4xl mb-2 group-hover:scale-110 transition-transform`}
                />
                <div className="font-semibold text-sm sm:text-base text-gray-900">
                  {tech.name}
                </div>
              </div>
            ))}
          </div>
          <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-6 sm:p-8 lg:p-12 text-white animate-fade-in">
            <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-center mb-8">
              System Architecture
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
              <div className="text-center">
                <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 bg-red-600 rounded-full flex items-center justify-center">
                  <Database className="w-8 h-8 sm:w-10 sm:h-10" />
                </div>
                <h4 className="font-bold text-lg mb-2">Blockchain Layer</h4>
                <p className="text-gray-200 text-sm sm:text-base">
                  Ethereum smart contracts for immutable record keeping
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 bg-red-600 rounded-full flex items-center justify-center">
                  <Globe className="w-8 h-8 sm:w-10 sm:h-10" />
                </div>
                <h4 className="font-bold text-lg mb-2">Storage Layer</h4>
                <p className="text-gray-200 text-sm sm:text-base">
                  IPFS for decentralized document storage
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 bg-red-600 rounded-full flex items-center justify-center">
                  <Shield className="w-8 h-8 sm:w-10 sm:h-10" />
                </div>
                <h4 className="font-bold text-lg mb-2">Application Layer</h4>
                <p className="text-gray-200 text-sm sm:text-base">
                  MERN stack for secure user interfaces
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16 animate-fade-in">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
              Trusted by{" "}
              <span className="text-red-400">Healthcare Leaders</span>
            </h2>
          </div>
          <div className="relative max-w-4xl mx-auto overflow-hidden animate-fade-in">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${activeTestimonial * 100}%)` }}
            >
              {testimonials.map((test, index) => (
                <div key={index} className="min-w-full flex justify-center">
                  <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 sm:p-8 lg:p-12 text-center max-w-lg shadow-lg">
                    <div className="text-5xl sm:text-6xl mb-6">
                      {test.avatar}
                    </div>
                    <blockquote className="text-base sm:text-lg lg:text-xl mb-6 italic text-gray-200">
                      "{test.content}"
                    </blockquote>
                    <div className="font-bold text-lg sm:text-xl text-white">
                      {test.name}
                    </div>
                    <div className="text-red-400 text-sm sm:text-base">
                      {test.role}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-center mt-6 sm:mt-8 space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveTestimonial(index)}
                  className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-300 ${
                    index === activeTestimonial
                      ? "bg-red-500 w-6 sm:w-8"
                      : "bg-white/30"
                  }`}
                  aria-label={`View testimonial ${index + 1}`}
                ></button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-r from-red-600 to-pink-500 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center animate-fade-in">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
            Join the Life-Saving Revolution
          </h2>
          <p className="text-base sm:text-lg lg:text-xl mb-8 max-w-3xl mx-auto opacity-90">
            Empower donors, hospitals, and blood banks with secure, transparent
            blood management.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/signup"
              className="bg-white text-red-600 px-6 sm:px-8 py-3 sm:py-4 rounded-full font-bold text-lg hover:bg-gray-100 transform hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-2 animate-pulse-glow"
              aria-label="Become a donor"
            >
              <Heart className="w-5 h-5 sm:w-6 sm:h-6" />
              <span>Become a Donor</span>
            </a>
            <a
              href="/contact"
              className="border-2 border-white text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full font-bold text-lg hover:bg-white hover:text-red-600 transform hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-2"
              aria-label="Partner with us"
            >
              <Building2 className="w-5 h-5 sm:w-6 sm:h-6" />
              <span>Partner with Us</span>
            </a>
          </div>
        </div>
      </section>

      {/* Back to Top Button */}
      <button
        className={`fixed bottom-6 right-6 p-3 bg-red-600 text-white rounded-full shadow-lg hover:bg-red-700 transition-all duration-300 ${
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Heart className="w-8 h-8 text-red-600" />
                <span className="text-xl sm:text-2xl font-bold">
                  BloodChain
                </span>
              </div>
              <p className="text-gray-400 text-sm sm:text-base">
                Revolutionizing blood management with blockchain technology.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-4">Platform</h4>
              <ul className="space-y-2 text-gray-400 text-sm sm:text-base">
                <li>
                  <a href="/donors" className="hover:text-white">
                    For Donors
                  </a>
                </li>
                <li>
                  <a href="/blood-banks" className="hover:text-white">
                    For Blood Banks
                  </a>
                </li>
                <li>
                  <a href="/hospitals" className="hover:text-white">
                    For Hospitals
                  </a>
                </li>
                <li>
                  <a href="/api" className="hover:text-white">
                    API Access
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-4">Resources</h4>
              <ul className="space-y-2 text-gray-400 text-sm sm:text-base">
                <li>
                  <a href="/docs" className="hover:text-white">
                    Documentation
                  </a>
                </li>
                <li>
                  <a href="/whitepaper" className="hover:text-white">
                    White Paper
                  </a>
                </li>
                <li>
                  <a href="/help" className="hover:text-white">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="/community" className="hover:text-white">
                    Community
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-4">Contact</h4>
              <ul className="space-y-2 text-gray-400 text-sm sm:text-base">
                <li>
                  <a
                    href="mailto:hello@bloodchain.org"
                    className="hover:text-white"
                  >
                    hello@bloodchain.org
                  </a>
                </li>
                <li>
                  <a href="tel:+15551234567" className="hover:text-white">
                    +1 (555) 123-4567
                  </a>
                </li>
                <li>
                  <a href="https://twitter.com" className="hover:text-white">
                    Twitter
                  </a>
                </li>
                <li>
                  <a href="https://linkedin.com" className="hover:text-white">
                    LinkedIn
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 sm:mt-12 pt-6 sm:pt-8 text-center text-gray-400 text-sm sm:text-base">
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
        </div>
      </footer>
    </div>
  );
};

export default BloodChainLanding;
