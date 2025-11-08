import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
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
  Lock,
  Globe,
  Menu,
  X,
  Play,
  Zap,
  TrendingUp,
  User,
  Hospital,
  Banknote,
  UserCheck,
  ArrowUp,
  HeartPulse,
  Stethoscope,
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
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const BloodChainLanding = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [activeFlowStep, setActiveFlowStep] = useState(null);
  const canvasRef = useRef(null);

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

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
    });

    const updateSize = () => {
      const width = Math.min(window.innerWidth, 600);
      const height = width * 0.8;
      renderer.setSize(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };
    updateSize();
    window.addEventListener("resize", updateSize);

    const points = [];
    for (let i = 0; i < 50; i++) {
      const x = Math.sin((i * Math.PI) / 50) * (1 - i / 50) * 1.5;
      const y = (i - 25) * 0.08;
      points.push(new THREE.Vector2(x, y));
    }
    const geometry = new THREE.LatheGeometry(points, 64);
    const material = new THREE.MeshPhysicalMaterial({
      color: 0x9b2c2c,
      metalness: 0.1,
      roughness: 0.2,
      clearcoat: 1,
      clearcoatRoughness: 0.1,
      side: THREE.DoubleSide,
    });
    const bloodDrop = new THREE.Mesh(geometry, material);
    scene.add(bloodDrop);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    const pointLight = new THREE.PointLight(0xf43f5e, 1, 100);
    pointLight.position.set(-5, -5, 5);
    scene.add(pointLight);

    const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
    scene.add(ambientLight);

    const hemisphereLight = new THREE.HemisphereLight(0xf59e0b, 0x9b2c2c, 0.8);
    scene.add(hemisphereLight);

    camera.position.z = 4;
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableZoom = false;
    controls.enablePan = false;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.8;

    const animate = () => {
      requestAnimationFrame(animate);
      bloodDrop.rotation.y += 0.005;
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      window.removeEventListener("resize", updateSize);
      renderer.dispose();
      controls.dispose();
    };
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const impactStats = [
    {
      value: "118.5M+",
      label: "Global Blood Donations Annually (WHO, 2025)",
      icon: Droplets,
    },
    {
      value: "40%",
      label: "Donations from 16% of Population (High-Income Countries)",
      icon: Globe,
    },
    {
      value: "Every 2s",
      label: "Someone Needs Blood Worldwide",
      icon: Clock,
    },
    {
      value: "$1.4B",
      label: "Blockchain Healthcare Market (2025 Projection)",
      icon: TrendingUp,
    },
    {
      value: "34%",
      label: "CAGR for Blockchain in Healthcare",
      icon: Zap,
    },
  ];

  // New section data for Why Donate Blood
  const whyDonateBenefits = [
    {
      title: "Health Benefits for Donors",
      description:
        "Regular donation lowers blood pressure, reduces heart attack risk, and regulates iron levels. Plus, enjoy free health screenings at every visit.",
      icon: HeartPulse,
      benefits: [
        "Reduced cardiovascular risks",
        "Free mini-physical checkup",
        "Improved emotional well-being and stress reduction",
        "Sense of purpose and community belonging",
      ],
    },
    {
      title: "Life-Saving Impact for Recipients",
      description:
        "One donation can save up to three lives, helping accident victims, surgery patients, cancer fighters, and new mothers.",
      icon: Stethoscope,
      benefits: [
        "Supports trauma and emergency care",
        "Aids chronic illness treatments like cancer",
        "Essential for surgeries and transplants",
        "Critical for maternal and newborn health",
      ],
    },
  ];

  const howItWorksSteps = [
    {
      title: "Donor Registers",
      description:
        "Securely register with blockchain-verified identity, ensuring trust and privacy while learning about blood types and eligibility.",
      icon: User,
    },
    {
      title: "Blood Donation",
      description:
        "Donate blood at certified centers; each unit is tested for safety and logged immutably on Ethereum for full transparency.",
      icon: Droplets,
    },
    {
      title: "Inventory Update",
      description:
        "Blood banks update real-time inventory using smart contracts, with AI predictions to prevent shortages and reduce waste.",
      icon: Database,
    },
    {
      title: "Hospital Request",
      description:
        "Hospitals request blood via secure smart contracts, with instant verification to ensure compatibility and safety.",
      icon: Hospital,
    },
    {
      title: "Trace & Use",
      description:
        "Full traceability from donor to recipient, promoting accountability and enabling impact tracking for donors.",
      icon: MapPin,
    },
  ];

  const roleBenefits = [
    {
      role: "Donors",
      icon: User,
      benefits: [
        "Real-time tracking of donation impact via blockchain",
        "Location-based urgent donation alerts",
        "Earn unique NFT rewards for donation milestones",
        "Secure access to donation history and health insights",
        "Contribute to global blood supply transparency",
      ],
    },
    {
      role: "Hospitals",
      icon: Hospital,
      benefits: [
        "Instant verification of blood authenticity and source",
        "Seamless blood requests with smart contract automation",
        "Real-time access to regional blood inventory",
        "Compliance with regulatory standards via immutable records",
        "Streamlined emergency response with trusted data",
      ],
    },
    {
      role: "Blood Banks",
      icon: Banknote,
      benefits: [
        "Transparent inventory management with blockchain",
        "Automated validation of blood units via smart contracts",
        "AI-powered predictions to minimize blood wastage",
        "Secure data sharing with hospitals and regulators",
        "Optimized logistics with real-time tracking",
      ],
    },
    {
      role: "Admins",
      icon: UserCheck,
      benefits: [
        "Secure oversight of user permissions and roles",
        "Real-time system health monitoring with analytics",
        "Automated compliance reporting with blockchain data",
        "Manage decentralized network with ease",
        "Ensure data integrity across the platform",
      ],
    },
  ];

  const features = [
    {
      icon: Database,
      title: "Blockchain Transparency",
      description:
        "Immutable Ethereum records for every donation and transfer, ensuring trust and preventing fraud in the supply chain.",
      gradient: "from-red-600 to-rose-500", // Updated to rose for better scheme
      image:
        "https://images.pexels.com/photos/3183171/pexels-photo-3183171.jpeg?auto=compress&cs=tinysrgb&w=800",
    },
    {
      icon: Shield,
      title: "Data Security",
      description:
        "Encrypted off-chain storage with blockchain-verified hashes, protecting sensitive health data while enabling secure sharing.",
      gradient: "from-red-600 to-rose-500",
      image:
        "https://images.pexels.com/photos/60504/security-protection-anti-virus-software-60504.jpeg?auto=compress&cs=tinysrgb&w=800",
    },
    {
      icon: Globe,
      title: "IPFS Storage",
      description:
        "Decentralized, tamper-proof storage for medical records, consent forms, and donation histories, reducing central points of failure.",
      gradient: "from-red-600 to-rose-500",
      image:
        "https://images.pexels.com/photos/373543/pexels-photo-373543.jpeg?auto=compress&cs=tinysrgb&w=800",
    },
    {
      icon: Activity,
      title: "Real-time Tracking",
      description:
        "End-to-end visibility from vein to vein, allowing donors to see their impact and stakeholders to monitor supply in real-time.",
      gradient: "from-red-600 to-rose-500",
      image:
        "https://images.pexels.com/photos/590016/pexels-photo-590016.jpeg?auto=compress&cs=tinysrgb&w=800",
    },
    {
      icon: Users,
      title: "Multi-stakeholder",
      description:
        "Unified platform connecting donors, hospitals, blood banks, and regulators for efficient, collaborative blood management.",
      gradient: "from-red-600 to-rose-500",
      image:
        "https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=800",
    },
    {
      icon: Lock,
      title: "Smart Contracts",
      description:
        "Automated, self-executing contracts in Solidity for secure payments, verifications, and compliance without intermediaries.",
      gradient: "from-red-600 to-rose-500",
      image:
        "https://images.pexels.com/photos/159888/pexels-photo-159888.jpeg?auto=compress&cs=tinysrgb&w=800",
    },
  ];

  const testimonials = [
    {
      name: "Dr. Sarah Johnson",
      role: "Blood Bank Director",
      content:
        "BloodChain's transparency and automation have transformed our operations, ensuring every unit is traceable and safe.",
      avatar:
        "https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=100",
    },
    {
      name: "Michael Chen",
      role: "Regular Donor",
      content:
        "Seeing my donations save lives in real-time is incredible. The NFT rewards and health insights are a great bonus!",
      avatar:
        "https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=100",
    },
    {
      name: "Dr. Maria Rodriguez",
      role: "Hospital Administrator",
      content:
        "BloodChain's instant verification and inventory access have streamlined our emergency responses, saving precious time.",
      avatar:
        "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=100",
    },
  ];

  const techStack = [
    {
      name: "React",
      color: "text-blue-500",
      icon: SiReact,
      description: "Dynamic, responsive UI for seamless user experience",
    },
    {
      name: "Node.js",
      color: "text-green-500",
      icon: SiNodedotjs,
      description: "Scalable backend for real-time data processing",
    },
    {
      name: "MongoDB",
      color: "text-green-600",
      icon: SiMongodb,
      description: "Secure NoSQL database for efficient data storage",
    },
    {
      name: "Express",
      color: "text-gray-600",
      icon: SiExpress,
      description: "Robust API framework for seamless integrations",
    },
    {
      name: "Ethereum",
      color: "text-purple-500",
      icon: SiEthereum,
      description: "Immutable blockchain for transparent records",
    },
    {
      name: "Solidity",
      color: "text-blue-600",
      icon: SiSolidity,
      description: "Smart contracts for automated workflows",
    },
    {
      name: "IPFS",
      color: "text-orange-500",
      icon: SiIpfs,
      description: "Decentralized storage for secure medical records",
    },
    {
      name: "Web3",
      color: "text-yellow-500",
      icon: SiWeb3Dotjs,
      description: "Enables blockchain interactions for trust",
    },
  ];

  const donationData = {
    labels: ["2018", "2019", "2020", "2021", "2022", "2023", "2024", "2025"],
    datasets: [
      {
        label: "Blood Donations (Millions)",
        data: [110, 112, 108, 115, 117, 118, 120, 122], // Updated with 2025 projection
        backgroundColor: "rgba(155, 44, 44, 0.8)", // Crimson
        borderColor: "rgba(155, 44, 44, 1)",
        borderWidth: 2,
        borderRadius: 8,
        borderSkipped: false,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: {
        display: true,
        text: "Global Blood Donations Trend (2018-2025 Projection)",
        font: { size: 20, weight: "bold" },
        color: "#1f2937",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Donations (Millions)",
          font: { weight: "bold" },
        },
        grid: { color: "rgba(0,0,0,0.05)" },
      },
      x: {
        title: { display: true, text: "Year", font: { weight: "bold" } },
        grid: { display: false },
      },
    },
    animation: {
      duration: 2000,
      easing: "easeOutCubic",
    },
    backgroundColor: "#f9fafb",
  };

  return (
    <div className="min-h-screen bg-white font-sans antialiased">
      {/* FIXED: Removed <style jsx> → use regular <style> */}
      <style>
        {`
          @keyframes pulse-glow {
            0%, 100% { box-shadow: 0 0 15px rgba(155, 44, 44, 0.4); }
            50% { box-shadow: 0 0 30px rgba(155, 44, 44, 0.7), 0 0 50px rgba(155, 44, 44, 0.5); }
          }
          @keyframes flow-scale { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.05); } }
          @keyframes flow-path { to { stroke-dashoffset: 0; } }
          .animate-pulse-glow { animation: pulse-glow 2s ease-in-out infinite; }
          .animate-flow-scale { animation: flow-scale 1.5s ease-in-out infinite; }
          .flow-path { stroke-dasharray: 1000; stroke-dashoffset: 1000; animation: flow-path 2s linear forwards; }
          .parallax-bg { background-attachment: fixed; background-position: center; background-repeat: no-repeat; background-size: cover; }
          @media (max-width: 768px) { .parallax-bg { background-attachment: scroll; } }
        `}
      </style>

      {/* Navigation */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          scrollY > 50
            ? "bg-white/95 backdrop-blur-lg shadow-lg"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <motion.div
              className="flex items-center space-x-2"
              whileHover={{ scale: 1.05 }}
            >
              <div className="w-10 h-10 bg-gradient-to-r from-red-600 to-rose-500 rounded-lg flex items-center justify-center">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <span
                className={`text-2xl font-bold ${
                  scrollY > 50 ? "text-gray-900" : "text-white"
                }`}
              >
                BloodChain
              </span>
            </motion.div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-6">
              {[
                "Why Donate",
                "Features",
                "How It Works",
                "Technology",
                "Trends",
                "Benefits",
                "Contact",
              ].map((item) => (
                <motion.a
                  key={item}
                  href={`#${item.toLowerCase().replace(" ", "-")}`}
                  className={`font-medium text-lg hover:text-red-500 transition-colors ${
                    scrollY > 50 ? "text-gray-800" : "text-white"
                  }`}
                  whileHover={{ y: -2 }}
                >
                  {item}
                </motion.a>
              ))}
              <motion.a
                href="/signup"
                className="bg-gradient-to-r from-red-600 to-rose-500 text-white px-6 py-2 rounded-full font-semibold hover:from-red-700 hover:to-rose-600 animate-pulse-glow"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Sign Up
              </motion.a>
            </div>

            {/* Mobile Menu Toggle */}
            <button
              className="md:hidden text-white"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="md:hidden bg-white/95 backdrop-blur-md shadow-md"
            >
              <div className="flex flex-col space-y-4 py-4 px-6">
                {[
                  "Why Donate",
                  "Features",
                  "How It Works",
                  "Technology",
                  "Trends",
                  "Benefits",
                  "Contact",
                ].map((item) => (
                  <motion.a
                    key={item}
                    href={`#${item.toLowerCase().replace(" ", "-")}`}
                    className="text-gray-800 font-medium hover:text-red-500"
                    onClick={() => setIsMenuOpen(false)}
                    whileHover={{ x: 5 }}
                  >
                    {item}
                  </motion.a>
                ))}
                <motion.a
                  href="/signup"
                  className="bg-gradient-to-r from-red-600 to-rose-500 text-white px-6 py-2 rounded-full font-semibold text-center"
                  whileHover={{ scale: 1.02 }}
                >
                  Sign Up
                </motion.a>
              </div>
            </motion.div>
          )}
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="relative min-h-screen bg-gradient-to-br from-red-600 via-rose-500 to-red-800 flex items-center overflow-hidden parallax-bg"
        style={{
          backgroundImage: `url('https://cdn.britannica.com/32/191732-050-5320356D/Human-red-blood-cells.jpg')`,
        }}>
        <div className="absolute inset-0 bg-black/40"></div>
        <motion.div
          className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center gap-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
        >
          <motion.div
            className="text-center lg:text-left text-white lg:w-1/2"
            variants={itemVariants}
          >
            <motion.h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Empowering
              <br />
              <span className="bg-gradient-to-r from-amber-400 via-yellow-300 to-orange-400 bg-clip-text text-transparent">
                Life-Saving Trust
              </span>
            </motion.h1>
            <motion.p className="text-lg sm:text-xl lg:text-2xl mb-8 max-w-2xl opacity-90">
              Revolutionize blood management with blockchain-powered
              transparency, traceability, and security.
            </motion.p>
            <motion.div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <motion.a
                href="/signup"
                className="bg-white text-red-600 px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-100 flex items-center justify-center space-x-2 animate-pulse-glow"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                <span>Join as Donor</span>
                <ChevronRight className="w-5 h-5" />
              </motion.a>
              <motion.button
                className="border-2 border-white text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white hover:text-red-600 flex items-center justify-center space-x-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                <Play className="w-5 h-5" />
                <span>Watch Demo</span>
              </motion.button>
            </motion.div>
          </motion.div>
          <motion.div
            className="lg:w-1/2 flex justify-center"
            variants={itemVariants}
          >
            <motion.canvas
              ref={canvasRef}
              className="w-[300px] h-[300px] lg:w-[400px] lg:h-[400px]"
              whileHover={{ scale: 1.1 }}
            />
          </motion.div>
        </motion.div>
      </section>

      {/* New: Why Donate Blood Section */}
      <motion.section
        id="why-donate"
        className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-gray-50 to-white"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-12 sm:mb-16"
            variants={itemVariants}
          >
            <motion.h2
              className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              Why{" "}
              <span className="text-red-600 bg-gradient-to-r from-red-600 to-rose-500 bg-clip-text text-transparent">
                Donate Blood
              </span>
              ?
            </motion.h2>
            <motion.p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto">
              Blood donation is a simple act with profound benefits for both
              donors and recipients. Learn how you can make a difference.
            </motion.p>
          </motion.div>
          <motion.div
            className="grid grid-cols-1 lg:grid-cols-2 gap-8"
            variants={containerVariants}
          >
            {whyDonateBenefits.map((benefit, index) => (
              <motion.div
                key={index}
                className="group text-center p-6 sm:p-8 bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-500 border border-gray-100/50"
                variants={itemVariants}
                whileHover={{ y: -5, scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <motion.div
                  className="w-16 h-16 mx-auto mb-6 bg-gradient-to-r from-red-600 to-rose-500 rounded-full flex items-center justify-center"
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.3 }}
                >
                  <benefit.icon className="w-8 h-8 text-white" />
                </motion.div>
                <div className="text-2xl font-bold text-gray-900 mb-4">
                  {benefit.title}
                </div>
                <p className="text-gray-600 mb-6">{benefit.description}</p>
                <ul className="space-y-3 text-left">
                  {benefit.benefits.map((item, i) => (
                    <motion.li
                      key={i}
                      className="flex items-start"
                      initial={{ x: -20, opacity: 0 }}
                      whileInView={{ x: 0, opacity: 1 }}
                      transition={{ delay: i * 0.1 }}
                    >
                      <CheckCircle className="w-5 h-5 text-red-600 mr-3 mt-1 flex-shrink-0" />
                      <span className="text-gray-700">{item}</span>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Impact Stats with staggered motion - no images, no rotation */}
      <motion.section
        className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-gray-50 to-white"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-12 sm:mb-16"
            variants={itemVariants}
          >
            <motion.h2
              className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              Our{" "}
              <span className="text-red-600 bg-gradient-to-r from-red-600 to-rose-500 bg-clip-text text-transparent">
                Global Impact
              </span>
            </motion.h2>
            <motion.p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto">
              Transforming the global blood supply chain with blockchain
              efficiency and transparency.
            </motion.p>
          </motion.div>
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 lg:gap-8"
            variants={containerVariants}
          >
            {impactStats.map((stat, index) => (
              <motion.div
                key={index}
                className="group text-center p-6 bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-500 border border-gray-100/50"
                variants={itemVariants}
                whileHover={{ y: -10, scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <stat.icon className="w-12 h-12 mx-auto mb-4 text-red-600 group-hover:scale-110 transition-transform duration-300" />
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Donation Trends with enhanced chart styling */}
      {/* <section id="trends" className="py-12 sm:py-16 lg:py-20 bg-white">
              <motion.div
                className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={containerVariants}
              >
                <motion.div
                  className="text-center mb-12 sm:mb-16"
                  variants={itemVariants}
                >
                  <motion.h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                    Blood Donation{" "}
                    <span className="text-red-600 bg-gradient-to-r from-red-600 to-rose-500 bg-clip-text text-transparent">
                      Trends
                    </span>
                  </motion.h2>
                  <motion.p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto">
                    Steady growth in global donations, with blockchain poised to
                    address shortages (WHO estimates).
                  </motion.p>
                </motion.div>
                <motion.div
                  className="max-w-4xl mx-auto rounded-2xl overflow-hidden shadow-xl"
                  variants={itemVariants}
                >
                  <div className="bg-gradient-to-r from-red-50 to-rose-50 p-6">
                    <Bar data={donationData} options={chartOptions} />
                  </div>
                </motion.div>
              </motion.div>
            </section> */}
      <section
        id="donation-trends"
        className="py-12 sm:py-16 lg:py-20 bg-white"
      >
        <motion.div
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
        >
          <motion.div
            className="text-center mb-12 sm:mb-16"
            variants={itemVariants}
          >
            <motion.h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Blood Donation{" "}
              <span className="text-red-600 bg-gradient-to-r from-red-600 to-pink-500 bg-clip-text text-transparent">
                Trends
              </span>
            </motion.h2>
            <motion.p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto">
              Global blood donation growth over the years (Source: WHO
              estimates).
            </motion.p>
          </motion.div>
          <motion.div
            className="max-w-4xl mx-auto rounded-2xl overflow-hidden shadow-xl"
            variants={itemVariants}
          >
            <div className="bg-gradient-to-r from-red-50 to-pink-50 p-6">
              <Bar data={donationData} options={chartOptions} />
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* How It Works with interactive SVG enhancements - no images, no rotation, improved hover */}
      <motion.section
        id="how-it-works"
        className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-gray-50 to-white"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-12 sm:mb-16"
            variants={itemVariants}
          >
            <motion.h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              How{" "}
              <span className="text-red-600 bg-gradient-to-r from-red-600 to-rose-500 bg-clip-text text-transparent">
                BloodChain
              </span>{" "}
              Works
            </motion.h2>
            <motion.p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto">
              A seamless, transparent process powered by blockchain, from
              registration to life-saving delivery.
            </motion.p>
          </motion.div>
          <div className="relative">
            <svg
              className="absolute top-1/2 left-0 w-full h-24 hidden lg:block -mt-12"
              style={{ zIndex: 0 }}
            >
              <motion.path
                className="flow-path"
                d="M 20 36 H 180 C 200 36 200 60 220 60 H 380 C 400 60 400 36 420 36 H 580 C 600 36 600 60 620 60 H 780 C 800 60 800 36 820 36 H 980"
                stroke="#dc2626"
                strokeWidth="6"
                fill="none"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 2, ease: "easeInOut" }}
              />
              {howItWorksSteps.map((_, index) => (
                <g key={index}>
                  <motion.circle
                    cx={20 + index * 200}
                    cy={36}
                    r="8"
                    fill="#dc2626"
                    className={activeFlowStep === index ? "flow-arrow" : ""}
                    animate={
                      activeFlowStep === index ? { scale: [1, 1.2, 1] } : {}
                    }
                    transition={{ duration: 0.5 }}
                  />
                  <path
                    d={`M ${20 + index * 200 + 8} 36 L ${
                      20 + index * 200 + 20
                    } 36 L ${20 + index * 200 + 14} 30 M ${
                      20 + index * 200 + 20
                    } 36 L ${20 + index * 200 + 14} 42`}
                    stroke="#dc2626"
                    strokeWidth="3"
                    fill="none"
                    className={activeFlowStep === index ? "flow-arrow" : ""}
                  />
                </g>
              ))}
            </svg>
            <motion.div
              className="relative flex flex-col lg:flex-row items-center justify-between gap-6 lg:gap-8"
              variants={containerVariants}
            >
              {howItWorksSteps.map((step, index) => (
                <motion.div
                  key={index}
                  className={`relative w-full lg:w-[18%] text-center p-6 bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-500 border border-gray-100/50 z-10 cursor-pointer ${
                    activeFlowStep === index
                      ? "animate-flow-scale bg-gradient-to-r from-red-50 to-rose-50 ring-2 ring-red-500/50"
                      : ""
                  }`}
                  variants={itemVariants}
                  whileHover={{
                    y: -8,
                    scale: 1.03,
                    boxShadow: "0 20px 40px rgba(220, 38, 38, 0.1)",
                  }}
                  onHoverStart={() => setActiveFlowStep(index)}
                  onHoverEnd={() => setActiveFlowStep(null)}
                >
                  <motion.div
                    className="w-14 h-14 mx-auto mb-4 bg-gradient-to-r from-red-600 to-rose-500 rounded-full flex items-center justify-center"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <step.icon className="w-8 h-8 text-white" />
                  </motion.div>
                  <div className="text-xl font-bold text-gray-900 mb-2">
                    {index + 1}. {step.title}
                  </div>
                  <p className="text-base text-gray-600">{step.description}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Benefits by Role with micro-interactions - no images, no rotation */}
      <motion.section
        id="benefits"
        className="py-12 sm:py-16 lg:py-20 bg-white"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-12 sm:mb-16"
            variants={itemVariants}
          >
            <motion.h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Benefits for{" "}
              <span className="text-red-600 bg-gradient-to-r from-red-600 to-rose-500 bg-clip-text text-transparent">
                Every Role
              </span>
            </motion.h2>
            <motion.p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto">
              Tailored blockchain solutions enhancing efficiency and trust
              across the blood donation ecosystem.
            </motion.p>
          </motion.div>
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8"
            variants={containerVariants}
          >
            {roleBenefits.map((role, index) => (
              <motion.div
                key={index}
                className="group p-6 bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-500 border border-gray-100/50"
                variants={itemVariants}
                whileHover={{ y: -10 }}
              >
                <role.icon className="w-12 h-12 mx-auto mb-4 text-red-600 group-hover:scale-110 transition-transform duration-300" />
                <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">
                  {role.role}
                </h3>
                <ul className="list-none text-sm text-gray-600 space-y-3">
                  {role.benefits.map((benefit, i) => (
                    <motion.li
                      key={i}
                      className="flex items-start"
                      initial={{ x: -20, opacity: 0 }}
                      whileInView={{ x: 0, opacity: 1 }}
                      transition={{ delay: i * 0.1 }}
                    >
                      <CheckCircle className="w-5 h-5 text-red-600 mr-2 mt-1 flex-shrink-0" />
                      <span>{benefit}</span>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Features with gradient overlays and hovers */}
      <motion.section
        id="features"
        className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-gray-50 to-white"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-12 sm:mb-16"
            variants={itemVariants}
          >
            <motion.h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Why{" "}
              <span className="text-red-600 bg-gradient-to-r from-red-600 to-rose-500 bg-clip-text text-transparent">
                BloodChain
              </span>
              ?
            </motion.h2>
            <motion.p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto">
              Cutting-edge blockchain features revolutionizing blood donation
              with unmatched security and efficiency.
            </motion.p>
          </motion.div>
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
            variants={containerVariants}
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="group relative bg-white rounded-2xl p-6 sm:p-8 shadow-md hover:shadow-2xl transition-all duration-700 border border-gray-100/50 overflow-hidden"
                variants={itemVariants}
                whileHover={{ y: -10, scale: 1.02 }}
              >
                <motion.div
                  className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-700"
                  style={{
                    background: `linear-gradient(to right, ${feature.gradient})`,
                  }}
                />
                <motion.img
                  src={feature.image}
                  alt={feature.title}
                  className="w-full h-40 object-cover rounded-xl mb-4 relative z-10"
                  whileHover={{ scale: 1.05 }}
                />
                <motion.div
                  className={`relative z-10 w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r ${feature.gradient} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
                  whileHover={{ scale: 1.1 }}
                >
                  <feature.icon className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                </motion.div>
                <motion.h3
                  className="text-xl font-bold text-gray-900 mb-4 relative z-10 group-hover:text-red-600 transition-colors"
                  whileHover={{ color: "#dc2626" }}
                >
                  {feature.title}
                </motion.h3>
                <motion.p
                  className="text-base text-gray-600 leading-relaxed relative z-10"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                >
                  {feature.description}
                </motion.p>
                <motion.div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-600 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 relative z-10" />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Technology Stack with tooltips and enhanced grid - no rotation, improved hover */}
      <motion.section
        id="technology"
        className="py-12 sm:py-16 lg:py-20 bg-white"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-12 sm:mb-16"
            variants={itemVariants}
          >
            <motion.h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Powered by{" "}
              <span className="text-red-600 bg-gradient-to-r from-red-600 to-rose-500 bg-clip-text text-transparent">
                Innovation
              </span>
            </motion.h2>
            <motion.p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto">
              A robust, scalable tech stack built for secure blood management.
            </motion.p>
          </motion.div>
          <motion.div
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 lg:gap-8 mb-12 sm:mb-16"
            variants={containerVariants}
          >
            {techStack.map((tech, index) => (
              <motion.div
                key={index}
                className="group relative text-center p-6 bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-500 border border-gray-100/50"
                variants={itemVariants}
                whileHover={{ y: -5, scale: 1.05 }}
              >
                <motion.div
                  whileHover={{ scale: 1.2 }}
                  transition={{ duration: 0.3 }}
                >
                  <tech.icon
                    className={`${tech.color} text-4xl mb-2 group-hover:scale-110 transition-transform duration-300`}
                  />
                </motion.div>
                <div className="font-semibold text-base text-gray-900">
                  {tech.name}
                </div>
                <motion.div
                  className="absolute inset-x-0 top-full mt-2 bg-gray-900 text-white text-sm p-3 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none shadow-lg"
                  initial={{ y: 10, opacity: 0 }}
                  whileHover={{ y: 0, opacity: 1 }}
                >
                  {tech.description}
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
          <motion.div
            className="bg-gradient-to-r from-gray-900 via-gray-800 to-black rounded-3xl p-6 sm:p-8 lg:p-12 text-white overflow-hidden"
            variants={itemVariants}
          >
            <motion.h3
              className="text-2xl sm:text-3xl font-bold text-center mb-8"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
            >
              System Architecture
            </motion.h3>
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
              variants={containerVariants}
            >
              {[
                {
                  title: "Blockchain Layer",
                  icon: Database,
                  desc: "Ethereum smart contracts for immutable records and automated verifications.",
                  img: "https://images.pexels.com/photos/844124/pexels-photo-844124.jpeg?auto=compress&cs=tinysrgb&w=400",
                },
                {
                  title: "Storage Layer",
                  icon: Globe,
                  desc: "IPFS for decentralized, secure document storage with blockchain pinning.",
                  img: "https://images.pexels.com/photos/373543/pexels-photo-373543.jpeg?auto=compress&cs=tinysrgb&w=400",
                },
                {
                  title: "Application Layer",
                  icon: Shield,
                  desc: "MERN stack for scalable, user-friendly interfaces with Web3 integration.",
                  img: "https://images.pexels.com/photos/60504/security-protection-anti-virus-software-60504.jpeg?auto=compress&cs=tinysrgb&w=400",
                },
              ].map((layer, i) => (
                <motion.div
                  key={i}
                  className="text-center group"
                  variants={itemVariants}
                  whileHover={{ y: -5 }}
                >
                  <motion.img
                    src={layer.img}
                    alt={layer.title}
                    className="w-full h-32 object-cover rounded-xl mb-4"
                    whileHover={{ scale: 1.05 }}
                  />
                  <motion.div
                    className="w-20 h-20 mx-auto mb-4 bg-gradient-to-r from-red-600 to-rose-500 rounded-full flex items-center justify-center"
                    whileHover={{ scale: 1.1 }}
                  >
                    <layer.icon className="w-10 h-10 text-white" />
                  </motion.div>
                  <h4 className="font-bold text-lg mb-2">{layer.title}</h4>
                  <p className="text-gray-200 text-base">{layer.desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* Testimonials with smooth sliding and neon accents */}
      <motion.section
        className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-gray-900 to-black text-white relative overflow-hidden"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-red-900/20 to-rose-900/20"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            className="text-center mb-12 sm:mb-16"
            variants={itemVariants}
          >
            <motion.h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
              Trusted by{" "}
              <span className="text-red-400 bg-gradient-to-r from-red-400 to-rose-400 bg-clip-text text-transparent">
                Healthcare Leaders
              </span>
            </motion.h2>
          </motion.div>
          <motion.div
            className="relative max-w-4xl mx-auto overflow-hidden"
            variants={itemVariants}
          >
            <motion.div
              className="flex"
              key={activeTestimonial}
              initial={{ x: 100 }}
              animate={{ x: 0 }}
              exit={{ x: -100 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            >
              {testimonials.map((test, index) => (
                <div key={index} className="min-w-full flex justify-center">
                  <motion.div
                    className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 lg:p-12 text-center max-w-lg shadow-2xl border border-white/20"
                    whileHover={{
                      scale: 1.02,
                      boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
                    }}
                  >
                    <motion.img
                      src={test.avatar}
                      alt={test.name}
                      className="w-20 h-20 rounded-full mx-auto mb-6 object-cover border-4 border-red-400/30"
                      whileHover={{ scale: 1.1, rotate: 10 }}
                    />
                    <motion.blockquote
                      className="text-lg lg:text-xl mb-6 italic text-gray-200"
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                    >
                      "{test.content}"
                    </motion.blockquote>
                    <div className="font-bold text-xl text-white">
                      {test.name}
                    </div>
                    <div className="text-red-400 text-base font-semibold">
                      {test.role}
                    </div>
                  </motion.div>
                </div>
              ))}
            </motion.div>
            <motion.div
              className="flex justify-center mt-8 space-x-2"
              variants={itemVariants}
            >
              {testimonials.map((_, index) => (
                <motion.button
                  key={index}
                  onClick={() => setActiveTestimonial(index)}
                  className={`rounded-full transition-all duration-300 ${
                    index === activeTestimonial
                      ? "bg-red-500 w-8 shadow-lg shadow-red-500/50"
                      : "bg-white/30 hover:bg-white/50"
                  }`}
                  whileHover={{ scale: 1.3 }}
                  whileTap={{ scale: 0.9 }}
                  aria-label={`View testimonial ${index + 1}`}
                >
                  <div
                    className={`w-3 h-3 rounded-full bg-current ${
                      index === activeTestimonial ? "w-8" : ""
                    }`}
                  ></div>
                </motion.button>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* CTA with bold contrasts and neon glow */}
      <motion.section
        className="py-12 sm:py-16 lg:py-20 bg-gradient-to-r from-red-600 via-rose-500 to-red-800 text-white relative"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
      >
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.h2
            className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6"
            variants={itemVariants}
          >
            Join the Life-Saving Revolution
          </motion.h2>
          <motion.p
            className="text-base sm:text-lg lg:text-xl mb-8 max-w-3xl mx-auto opacity-90"
            variants={itemVariants}
          >
            Secure your legacy in blockchain-powered blood donation. Every drop
            counts.
          </motion.p>
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            variants={itemVariants}
          >
            <motion.a
              href="/signup"
              className="bg-white text-red-600 px-6 sm:px-8 py-3 sm:py-4 rounded-full font-bold text-lg hover:bg-gray-100 transform transition-all duration-300 flex items-center justify-center space-x-2 animate-pulse-glow shadow-2xl shadow-white/20"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              aria-label="Become a donor"
            >
              <Heart className="w-6 h-6" />
              <span>Become a Donor</span>
            </motion.a>
            <motion.a
              href="/contact"
              className="border-2 border-white text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full font-bold text-lg hover:bg-white hover:text-red-600 transform transition-all duration-300 flex items-center justify-center space-x-2 shadow-2xl shadow-white/20"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              aria-label="Partner with us"
            >
              <Building2 className="w-6 h-6" />
              <span>Partner with Us</span>
            </motion.a>
          </motion.div>
        </div>
      </motion.section>

      {/* Back to Top */}
      <motion.button
        className={`fixed bottom-6 right-6 p-3 bg-red-600 text-white rounded-full shadow-lg hover:bg-red-700 transition-all ${
          scrollY > 300 ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        initial={{ scale: 0 }}
        animate={{ scale: scrollY > 300 ? 1 : 0 }}
        whileHover={{ scale: 1.1, rotate: 360 }}
      >
        <ArrowUp className="w-6 h-6" />
      </motion.button>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-gray-900 to-black text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Footer content */}
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2025 BloodChain. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default BloodChainLanding;
