// src/pages/BloodChainLanding.jsx
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  TrendingUp,
  Award,
  Stethoscope,
  UserCheck,
  ArrowRight,
  Trophy,
  Star,
  Zap,
  Bell,
  AlertCircle,
  Phone,
  Mail,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Download,
  BookOpen,
  HelpCircle,
  ChevronDown,
  ExternalLink,
  Smartphone,
  Gift,
  Target,
  Verified,
} from "lucide-react";
import { Bar, Doughnut, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import CountUp from "react-countup";
import IndiaMap from "../components/IndiaMap";
import "../styles/leaflet-custom.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const BloodChainLanding = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [donationCount, setDonationCount] = useState(2847531);
  const [activeTab, setActiveTab] = useState("donor");
  const [expandedFAQ, setExpandedFAQ] = useState(null);
  const [showEmergencyBanner, setShowEmergencyBanner] = useState(true);
  const [isMapLoading, setIsMapLoading] = useState(true);
  const [liveActivity, setLiveActivity] = useState([
    {
      id: 1,
      type: "donation",
      donor: "Rajesh K.",
      location: "Mumbai",
      time: "2 min ago",
    },
    {
      id: 2,
      type: "request",
      hospital: "AIIMS Delhi",
      bloodType: "O+",
      time: "5 min ago",
    },
    {
      id: 3,
      type: "donation",
      donor: "Priya S.",
      location: "Bangalore",
      time: "8 min ago",
    },
  ]);

  const mapRef = useRef(null);
  const mapInitialized = useRef(false);

  // ============ LIVE DONATION COUNTER ============
  useEffect(() => {
    const interval = setInterval(() => {
      setDonationCount((prev) => prev + Math.floor(Math.random() * 3) + 1);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  // ============ LIVE ACTIVITY FEED ============
  useEffect(() => {
    const activityInterval = setInterval(() => {
      const activities = [
        {
          type: "donation",
          donor: "Amit P.",
          location: "Delhi",
          time: "Just now",
        },
        {
          type: "donation",
          donor: "Sneha M.",
          location: "Chennai",
          time: "Just now",
        },
        {
          type: "request",
          hospital: "Fortis Hospital",
          bloodType: "AB+",
          time: "Just now",
        },
        {
          type: "donation",
          donor: "Vikram R.",
          location: "Hyderabad",
          time: "Just now",
        },
      ];

      const newActivity =
        activities[Math.floor(Math.random() * activities.length)];
      newActivity.id = Date.now();

      setLiveActivity((prev) => [newActivity, ...prev.slice(0, 4)]);
    }, 12000);

    return () => clearInterval(activityInterval);
  }, []);

  // ============ MAPMYINDIA MAP INTEGRATION ============
  // useEffect(() => {
  //   if (mapInitialized.current) return;

  //   const MAP_SDK_KEY = import.meta.env.VITE_APP_MAPMYINDIA_MAP_SDK_KEY;
  //   if (!MAP_SDK_KEY) {
  //     console.error("⚠️ Add VITE_APP_MAPMYINDIA_MAP_SDK_KEY to .env");
  //     setIsMapLoading(false);
  //     return;
  //   }

  //   const script = document.createElement("script");
  //   script.src = `https://apis.mappls.com/advancedmaps/api/${MAP_SDK_KEY}/map_sdk?v=3.0&layer=vector`;
  //   script.async = true;

  //   script.onload = () => {
  //     if (!document.getElementById("mapmyindia-map")) return;

  //     try {
  //       mapRef.current = new window.MapmyIndia.Map("mapmyindia-map", {
  //         center: [20.5937, 78.9629],
  //         zoom: 5,
  //         zoomControl: true,
  //         hybrid: false,
  //         search: false,
  //       });

  //       // Major Indian cities with realistic donor data
  //       const indianCities = [
  //         {
  //           name: "Delhi NCR",
  //           lat: 28.6139,
  //           lng: 77.209,
  //           donors: 45200,
  //           banks: 87,
  //         },
  //         {
  //           name: "Mumbai",
  //           lat: 19.076,
  //           lng: 72.8777,
  //           donors: 38500,
  //           banks: 72,
  //         },
  //         {
  //           name: "Bangalore",
  //           lat: 12.9716,
  //           lng: 77.5946,
  //           donors: 32800,
  //           banks: 65,
  //         },
  //         {
  //           name: "Chennai",
  //           lat: 13.0827,
  //           lng: 80.2707,
  //           donors: 28200,
  //           banks: 58,
  //         },
  //         {
  //           name: "Kolkata",
  //           lat: 22.5726,
  //           lng: 88.3639,
  //           donors: 25800,
  //           banks: 54,
  //         },
  //         {
  //           name: "Hyderabad",
  //           lat: 17.385,
  //           lng: 78.4867,
  //           donors: 24500,
  //           banks: 49,
  //         },
  //         {
  //           name: "Pune",
  //           lat: 18.5204,
  //           lng: 73.8567,
  //           donors: 22700,
  //           banks: 43,
  //         },
  //         {
  //           name: "Ahmedabad",
  //           lat: 23.0225,
  //           lng: 72.5714,
  //           donors: 19900,
  //           banks: 38,
  //         },
  //         {
  //           name: "Surat",
  //           lat: 21.1702,
  //           lng: 72.8311,
  //           donors: 15200,
  //           banks: 28,
  //         },
  //         {
  //           name: "Jaipur",
  //           lat: 26.9124,
  //           lng: 75.7873,
  //           donors: 14100,
  //           banks: 26,
  //         },
  //         {
  //           name: "Lucknow",
  //           lat: 26.8467,
  //           lng: 80.9462,
  //           donors: 13500,
  //           banks: 24,
  //         },
  //         {
  //           name: "Kochi",
  //           lat: 9.9312,
  //           lng: 76.2673,
  //           donors: 12800,
  //           banks: 22,
  //         },
  //       ];

  //       indianCities.forEach((city) => {
  //         new window.MapmyIndia.Marker({
  //           map: mapRef.current,
  //           position: [city.lat, city.lng],
  //           icon: "https://apis.mapmyindia.com/map_v3/1.png",
  //           popup: {
  //             html: `
  //               <div style="font-family: system-ui; padding: 12px; min-width: 180px;">
  //                 <h4 style="margin: 0 0 8px; color: #dc2626; font-weight: bold; font-size: 15px;">
  //                   ${city.name}
  //                 </h4>
  //                 <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
  //                   <span style="font-size: 12px; color: #6b7280;">👥 Donors:</span>
  //                   <span style="font-weight: 600; color: #374151;">${city.donors.toLocaleString()}</span>
  //                 </div>
  //                 <div style="display: flex; align-items: center; gap: 8px;">
  //                   <span style="font-size: 12px; color: #6b7280;">🏥 Blood Banks:</span>
  //                   <span style="font-weight: 600; color: #374151;">${
  //                     city.banks
  //                   }</span>
  //                 </div>
  //               </div>
  //             `,
  //             offset: [0, -35],
  //           },
  //         });
  //       });

  //       mapInitialized.current = true;
  //       setIsMapLoading(false);
  //     } catch (error) {
  //       console.error("Map initialization error:", error);
  //       setIsMapLoading(false);
  //     }
  //   };

  //   script.onerror = () => {
  //     console.error("Failed to load MapmyIndia SDK");
  //     setIsMapLoading(false);
  //   };

  //   document.head.appendChild(script);

  //   return () => {
  //     if (script.parentNode) script.parentNode.removeChild(script);
  //     if (mapRef.current && mapRef.current.remove) mapRef.current.remove();
  //   };
  // }, []);

  // ============ ANIMATION VARIANTS ============
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const slideInLeft = {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.6 } },
  };

  const slideInRight = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.6 } },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  // ============ INDIA-SPECIFIC STATS ============
  const stats = [
    {
      label: "Total Donations",
      value: donationCount,
      icon: Droplets,
      color: "text-red-600",
      bgColor: "bg-red-50",
    },
    {
      label: "Lives Saved",
      value: donationCount * 3,
      icon: Heart,
      color: "text-pink-600",
      bgColor: "bg-pink-50",
    },
    {
      label: "Active Donors",
      value: 284750,
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      label: "Blood Banks",
      value: 1127,
      icon: Building2,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
  ];

  // ============ FEATURES ============
  const features = [
    {
      icon: Database,
      title: "Blockchain Verified",
      desc: "Every donation recorded on Ethereum. Immutable, transparent, and trustworthy.",
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      icon: Shield,
      title: "Medical-Grade Security",
      desc: "HIPAA-compliant encryption ensures your medical data stays private and secure.",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      icon: Activity,
      title: "Real-Time Inventory",
      desc: "Live blood availability across India. No more shortages or emergency scrambles.",
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      icon: Trophy,
      title: "Donor Rewards",
      desc: "Earn points, unlock NFT badges, and get priority access to emergency requests.",
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
    },
    {
      icon: MapPin,
      title: "Hyper-Local Discovery",
      desc: "MapmyIndia integration shows nearest verified blood banks in under 30 seconds.",
      color: "text-red-600",
      bgColor: "bg-red-50",
    },
    {
      icon: Bell,
      title: "Emergency Alerts",
      desc: "Get instant notifications when nearby hospitals need your blood group urgently.",
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
  ];

  // ============ HOW IT WORKS ============
  const howItWorks = [
    {
      step: 1,
      title: "Register & Verify",
      desc: "Quick signup with Aadhaar-like blockchain verification",
      icon: UserCheck,
    },
    {
      step: 2,
      title: "Find Blood Bank",
      desc: "Locate nearest verified center using MapmyIndia",
      icon: MapPin,
    },
    {
      step: 3,
      title: "Donate Blood",
      desc: "Safe, hygienic donation at certified centers",
      icon: Droplets,
    },
    {
      step: 4,
      title: "Blockchain Tracking",
      desc: "Donation logged instantly on Ethereum network",
      icon: Database,
    },
    {
      step: 5,
      title: "Earn Rewards",
      desc: "Get points, badges, and recognition",
      icon: Gift,
    },
    {
      step: 6,
      title: "Save Lives",
      desc: "Your blood reaches patients transparently",
      icon: Heart,
    },
  ];

  // ============ INDIAN HOSPITAL PARTNERS ============
  const hospitalPartners = [
    { name: "AIIMS", logo: "🏥", verified: true },
    { name: "Apollo Hospitals", logo: "🏥", verified: true },
    { name: "Fortis Healthcare", logo: "🏥", verified: true },
    { name: "Max Healthcare", logo: "🏥", verified: true },
    { name: "Manipal Hospitals", logo: "🏥", verified: true },
    { name: "Narayana Health", logo: "🏥", verified: true },
    { name: "Indian Red Cross", logo: "🏥", verified: true },
    { name: "Tata Memorial", logo: "🏥", verified: true },
  ];

  // ============ LEADERBOARD ============
  const leaderboard = [
    {
      rank: 1,
      name: "Rajesh Kumar",
      donations: 42,
      city: "Mumbai",
      avatar: "👨",
      bloodGroup: "O+",
    },
    {
      rank: 2,
      name: "Priya Sharma",
      donations: 38,
      city: "Delhi",
      avatar: "👩",
      bloodGroup: "A+",
    },
    {
      rank: 3,
      name: "Amit Patel",
      donations: 35,
      city: "Ahmedabad",
      avatar: "👨",
      bloodGroup: "B+",
    },
    {
      rank: 4,
      name: "Sneha Reddy",
      donations: 31,
      city: "Hyderabad",
      avatar: "👩",
      bloodGroup: "AB+",
    },
    {
      rank: 5,
      name: "Vikram Singh",
      donations: 29,
      city: "Jaipur",
      avatar: "👨",
      bloodGroup: "O-",
    },
  ];

  // ============ TESTIMONIALS ============
  const testimonials = [
    {
      name: "Dr. Anjali Mehta",
      role: "Head of Hematology, Apollo Delhi",
      image: "👩‍⚕️",
      quote:
        "BloodChain has revolutionized how we manage blood inventory. Real-time tracking saves countless lives.",
      rating: 5,
    },
    {
      name: "Rohan Desai",
      role: "Regular Donor, Mumbai",
      image: "👨",
      quote:
        "Knowing exactly where my blood goes gives me immense satisfaction. The blockchain transparency is incredible!",
      rating: 5,
    },
    {
      name: "Kavita Iyer",
      role: "Blood Bank Manager, Bangalore",
      image: "👩",
      quote:
        "We've reduced blood wastage by 40% since implementing BloodChain. The system is a game-changer.",
      rating: 5,
    },
  ];

  // ============ FAQ ============
  const faqs = [
    {
      question: "Is my medical data safe on the blockchain?",
      answer:
        "Absolutely! We use zero-knowledge proofs. Only verification hashes are on-chain, not your personal medical data. Your information is encrypted and stored securely off-chain.",
    },
    {
      question: "How do I earn rewards?",
      answer:
        "Every successful donation earns you 100 points. You can redeem these for health checkups, priority emergency alerts, or exclusive NFT donor badges.",
    },
    {
      question: "Which blood banks are verified?",
      answer:
        "We partner with 1,100+ certified blood banks across India, including AIIMS, Apollo, Fortis, and Indian Red Cross centers. All are government-approved.",
    },
    {
      question: "Can I donate if I'm on medication?",
      answer:
        "It depends on the medication. Our smart screening system will check your eligibility during registration. Consult with the on-site medical team before donating.",
    },
    {
      question: "How often can I donate blood?",
      answer:
        "Men can donate every 3 months, women every 4 months. Our system automatically tracks your eligibility and notifies you when you can donate again.",
    },
    {
      question: "What if there's an emergency need for my blood type?",
      answer:
        "You'll receive instant SMS and app notifications when nearby hospitals urgently need your blood group. You can respond with one tap.",
    },
  ];

  // ============ BLOOD GROUP COMPATIBILITY DATA ============
  const bloodGroupData = {
    labels: ["A+", "O+", "B+", "AB+", "A-", "O-", "B-", "AB-"],
    datasets: [
      {
        label: "Donors in India (%)",
        data: [30, 35, 8, 4, 6, 2, 2, 1],
        backgroundColor: [
          "#ef4444",
          "#f97316",
          "#f59e0b",
          "#84cc16",
          "#10b981",
          "#06b6d4",
          "#3b82f6",
          "#8b5cf6",
        ],
      },
    ],
  };

  // ============ IMPACT CHART ============
  const impactData = {
    labels: ["2020", "2021", "2022", "2023", "2024", "2025"],
    datasets: [
      {
        label: "Donations (in thousands)",
        data: [412, 498, 587, 721, 892, 1124],
        borderColor: "#dc2626",
        backgroundColor: "rgba(220, 38, 38, 0.1)",
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const impactOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: { display: false },
    },
    scales: {
      y: { beginAtZero: true },
    },
  };

  return (
    <div className="bg-white overflow-x-hidden">
      {/* ============ EMERGENCY BANNER ============ */}
      <AnimatePresence>
        {showEmergencyBanner && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-gradient-to-r from-red-600 to-red-700 text-white"
          >
            <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-5 h-5 animate-pulse" />
                <span className="text-sm font-medium">
                  🚨 <strong>URGENT:</strong> O- blood needed at AIIMS Delhi for
                  emergency surgery.{" "}
                  <a href="#emergency" className="underline font-bold">
                    Respond Now →
                  </a>
                </span>
              </div>
              <button
                onClick={() => setShowEmergencyBanner(false)}
                className="hover:bg-red-800 p-1 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ============ NAVIGATION ============ */}
      <nav className="sticky top-0 w-full bg-white/95 backdrop-blur-md shadow-sm z-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
              className="w-10 h-10 bg-gradient-to-br from-red-600 to-red-700 rounded-xl flex items-center justify-center shadow-lg"
            >
              <Heart className="w-6 h-6 text-white fill-white" />
            </motion.div>
            <div>
              <span className="text-xl font-bold bg-gradient-to-r from-red-600 to-red-700 bg-clip-text text-transparent">
                BloodChain
              </span>
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <Verified className="w-3 h-3 text-blue-500" />
                <span>Verified Platform</span>
              </div>
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-8">
            <a
              href="#features"
              className="text-gray-700 hover:text-red-600 font-medium transition"
            >
              Features
            </a>
            <a
              href="#how"
              className="text-gray-700 hover:text-red-600 font-medium transition"
            >
              How It Works
            </a>
            <a
              href="#map"
              className="text-gray-700 hover:text-red-600 font-medium transition"
            >
              Network
            </a>
            <a
              href="#testimonials"
              className="text-gray-700 hover:text-red-600 font-medium transition"
            >
              Stories
            </a>
            <a
              href="#faq"
              className="text-gray-700 hover:text-red-600 font-medium transition"
            >
              FAQ
            </a>
            <a
              href="/login"
              className="text-gray-700 hover:text-red-600 font-medium transition"
            >
              Login
            </a>
            <a
              href="/signup"
              className="bg-gradient-to-r from-red-600 to-red-700 text-white px-6 py-2.5 rounded-lg font-semibold hover:shadow-lg hover:scale-105 transition-all duration-200"
            >
              Donate Now
            </a>
          </div>

          <button
            className="lg:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="w-6 h-6 text-gray-700" />
            ) : (
              <Menu className="w-6 h-6 text-gray-700" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="lg:hidden bg-white border-t border-gray-100"
            >
              <div className="px-6 py-4 space-y-3">
                <a
                  href="#features"
                  className="block text-gray-700 hover:text-red-600 font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Features
                </a>
                <a
                  href="#how"
                  className="block text-gray-700 hover:text-red-600 font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  How It Works
                </a>
                <a
                  href="#map"
                  className="block text-gray-700 hover:text-red-600 font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Network
                </a>
                <a
                  href="#testimonials"
                  className="block text-gray-700 hover:text-red-600 font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Stories
                </a>
                <a
                  href="#faq"
                  className="block text-gray-700 hover:text-red-600 font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  FAQ
                </a>
                <a
                  href="/login"
                  className="block text-gray-700 hover:text-red-600 font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </a>
                <a
                  href="/signup"
                  className="block bg-gradient-to-r from-red-600 to-red-700 text-white px-6 py-3 rounded-lg text-center font-semibold"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Donate Now
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* ============ HERO SECTION ============ */}
      <section className="relative pt-20 pb-32 bg-gradient-to-br from-red-50 via-white to-pink-50 overflow-hidden">
        {/* Background Decorations */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-red-200 rounded-full blur-3xl opacity-20 animate-pulse" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-200 rounded-full blur-3xl opacity-20 animate-pulse" />
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <motion.div
                variants={fadeIn}
                className="inline-flex items-center gap-2 bg-red-100 text-red-700 px-4 py-2 rounded-full text-sm font-semibold mb-6"
              >
                <Zap className="w-4 h-4" />
                India's First Blockchain Blood Platform
              </motion.div>

              <motion.h1
                variants={fadeIn}
                className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight"
              >
                Every Drop
                <br />
                <span className="bg-gradient-to-r from-red-600 to-red-700 bg-clip-text text-transparent">
                  Counts. Tracked.
                </span>
              </motion.h1>

              <motion.p
                variants={fadeIn}
                className="text-xl text-gray-600 mb-8 leading-relaxed"
              >
                Join India's most transparent blood donation platform. Every
                donation verified on blockchain. Every life saved, tracked.
              </motion.p>

              <motion.div
                variants={fadeIn}
                className="flex flex-col sm:flex-row gap-4 mb-8"
              >
                <a
                  href="/signup"
                  className="group bg-gradient-to-r from-red-600 to-red-700 text-white px-8 py-4 rounded-xl font-bold text-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  Start Donating
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </a>
                <a
                  href="#demo"
                  className="group border-2 border-red-600 text-red-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-red-50 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <Play className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  Watch Demo
                </a>
              </motion.div>

              <motion.div
                variants={fadeIn}
                className="flex flex-wrap items-center gap-6 text-sm text-gray-600"
              >
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-green-600" />
                  <span>HIPAA Compliant</span>
                </div>
                <div className="flex items-center gap-2">
                  <Lock className="w-5 h-5 text-green-600" />
                  <span>Blockchain Secured</span>
                </div>
                <div className="flex items-center gap-2">
                  <Verified className="w-5 h-5 text-blue-600" />
                  <span>Govt. Approved</span>
                </div>
              </motion.div>
            </motion.div>

            {/* Right Content - Live Activity Feed */}
            <motion.div
              variants={slideInRight}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">
                  🔴 Live Activity
                </h3>
                <div className="flex items-center gap-2 text-sm text-green-600 font-semibold">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  Online
                </div>
              </div>

              <div className="space-y-4 mb-6">
                <AnimatePresence mode="popLayout">
                  {liveActivity.map((activity) => (
                    <motion.div
                      key={activity.id}
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 20 }}
                      className="flex items-start gap-3 bg-gray-50 p-4 rounded-xl"
                    >
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          activity.type === "donation"
                            ? "bg-red-100 text-red-600"
                            : "bg-blue-100 text-blue-600"
                        }`}
                      >
                        {activity.type === "donation" ? (
                          <Droplets className="w-5 h-5" />
                        ) : (
                          <Bell className="w-5 h-5" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-gray-900">
                          {activity.type === "donation"
                            ? `${activity.donor} donated blood`
                            : `${activity.hospital} needs ${activity.bloodType}`}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {activity.location} • {activity.time}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-4 pt-6 border-t border-gray-100">
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">
                    <CountUp end={donationCount} duration={2} separator="," />
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    Total Donations
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    <CountUp end={1127} duration={2} separator="," />
                  </div>
                  <div className="text-xs text-gray-500 mt-1">Blood Banks</div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Stats Bar */}
          <motion.div
            variants={fadeIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mt-20 bg-white rounded-3xl shadow-xl p-8 border border-gray-100"
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {stats.map((stat, i) => (
                <motion.div
                  key={i}
                  whileHover={{ scale: 1.05 }}
                  className="text-center group cursor-pointer"
                >
                  <div
                    className={`w-14 h-14 ${stat.bgColor} rounded-2xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform`}
                  >
                    <stat.icon className={`w-7 h-7 ${stat.color}`} />
                  </div>
                  <div className={`text-3xl font-bold ${stat.color} mb-1`}>
                    <CountUp end={stat.value} duration={2.5} separator="," />+
                  </div>
                  <div className="text-sm text-gray-600 font-medium">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ============ HOSPITAL PARTNERS ============ */}
      <section className="py-16 bg-white border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            variants={fadeIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Trusted by India's Top Healthcare Institutions
            </h2>
            <p className="text-gray-600">
              1,100+ verified blood banks & hospitals across India
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-6 items-center">
            {hospitalPartners.map((h, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ scale: 1.1 }}
                className="text-center group cursor-pointer"
              >
                <div className="text-5xl mb-2 grayscale group-hover:grayscale-0 transition">
                  {h.logo}
                </div>
                <div className="text-xs font-medium text-gray-600 group-hover:text-red-600 transition">
                  {h.name}
                </div>
                {h.verified && (
                  <div className="flex items-center justify-center gap-1 mt-1">
                    <Verified className="w-3 h-3 text-blue-500" />
                    <span className="text-[10px] text-blue-600">Verified</span>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ FEATURES ============ */}
      <section id="features" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            variants={fadeIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Why Choose BloodChain?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              A modern, transparent solution to India's blood shortage crisis
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {features.map((f, i) => (
              <motion.div
                key={i}
                variants={fadeIn}
                whileHover={{ y: -10 }}
                className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 group"
              >
                <div
                  className={`w-16 h-16 ${f.bgColor} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}
                >
                  <f.icon className={`w-8 h-8 ${f.color}`} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {f.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ============ HOW IT WORKS ============ */}
      <section id="how" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            variants={fadeIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600">
              Simple. Secure. Life-Saving.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {howItWorks.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="relative bg-gradient-to-br from-gray-50 to-white p-8 rounded-2xl border-2 border-gray-100 hover:border-red-200 transition-all duration-300 group"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-gradient-to-br from-red-600 to-red-700 text-white rounded-xl flex items-center justify-center font-bold text-lg shadow-lg group-hover:scale-110 transition-transform">
                      {step.step}
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-3">
                      <step.icon className="w-5 h-5 text-red-600" />
                      <h3 className="font-bold text-gray-900 text-lg">
                        {step.title}
                      </h3>
                    </div>
                    <p className="text-gray-600">{step.desc}</p>
                  </div>
                </div>

                {i < howItWorks.length - 1 && (
                  <div className="absolute -right-3 top-1/2 transform -translate-y-1/2 hidden lg:block">
                    <ChevronRight className="w-6 h-6 text-gray-300" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ BLOOD GROUP COMPATIBILITY ============ */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            variants={fadeIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Blood Group Distribution in India
            </h2>
            <p className="text-xl text-gray-600">
              Know your blood type's rarity and impact
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              variants={slideInLeft}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="bg-white p-8 rounded-3xl shadow-xl"
            >
              <Doughnut
                data={bloodGroupData}
                options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      position: "bottom",
                      labels: { padding: 15, font: { size: 12 } },
                    },
                  },
                }}
              />
            </motion.div>

            <motion.div
              variants={slideInRight}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="space-y-6"
            >
              <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
                <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                  <Target className="w-5 h-5 text-red-600" />
                  Universal Donor: O-
                </h3>
                <p className="text-gray-600">
                  Only <strong>2%</strong> of Indians have O- blood. Their
                  donations can save anyone in an emergency.
                </p>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
                <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                  <Heart className="w-5 h-5 text-pink-600" />
                  Universal Recipient: AB+
                </h3>
                <p className="text-gray-600">
                  <strong>4%</strong> have AB+ blood. They can receive from any
                  blood group.
                </p>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
                <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                  Most Common: O+ & A+
                </h3>
                <p className="text-gray-600">
                  <strong>65%</strong> of Indians have O+ or A+ blood, making
                  these types most in-demand.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ============ INDIA NETWORK MAP ============ */}
      <section id="map" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            variants={fadeIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Our India-Wide Network
            </h2>
            <p className="text-xl text-gray-600">
              1,100+ blood banks across 28 states & 8 UTs
            </p>
          </motion.div>

          <motion.div
            variants={fadeIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="bg-gradient-to-br from-gray-50 to-white rounded-3xl shadow-2xl overflow-hidden border-2 border-gray-200 p-2"
          >
            <div className="relative h-[500px] lg:h-[600px]">
              {/* ✅ USE LEAFLET MAP */}
              <IndiaMap />
            </div>

            {/* Map Info Footer */}
            <div className="bg-white border-t-2 border-gray-100 p-4">
              <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-600 rounded-full"></div>
                  <span>Blood Bank Locations</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-red-600" />
                  <span>18 Major Cities Covered</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-blue-600" />
                  <span>284,750+ Active Donors</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-400">Powered by</span>
                  <strong className="text-red-600">OpenStreetMap</strong>
                </div>
              </div>
            </div>
          </motion.div>

          {/* City Stats Grid */}
          <motion.div
            variants={fadeIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-3 gap-6 mt-12"
          >
            <div className="bg-gradient-to-br from-red-50 to-white p-6 rounded-2xl border border-red-100">
              <div className="text-4xl font-bold text-red-600 mb-2">28</div>
              <p className="text-gray-700 font-medium">States & UTs Covered</p>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-white p-6 rounded-2xl border border-blue-100">
              <div className="text-4xl font-bold text-blue-600 mb-2">1,127</div>
              <p className="text-gray-700 font-medium">Verified Blood Banks</p>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-white p-6 rounded-2xl border border-green-100">
              <div className="text-4xl font-bold text-green-600 mb-2">24/7</div>
              <p className="text-gray-700 font-medium">Emergency Support</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ============ IMPACT CHART ============ */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            variants={fadeIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Growing Every Day
            </h2>
            <p className="text-xl text-gray-600">
              BloodChain's impact across India (2020-2025)
            </p>
          </motion.div>

          <motion.div
            variants={fadeIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="bg-white p-8 rounded-3xl shadow-xl max-w-5xl mx-auto"
          >
            <Line data={impactData} options={impactOptions} />
          </motion.div>
        </div>
      </section>

      {/* ============ LEADERBOARD ============ */}
      <section id="leaderboard" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            variants={fadeIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              🏆 Top Donors This Month
            </h2>
            <p className="text-xl text-gray-600">
              Join India's most generous blood donors
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="bg-white rounded-3xl shadow-2xl overflow-hidden max-w-3xl mx-auto border border-gray-100"
          >
            {leaderboard.map((user, i) => (
              <motion.div
                key={i}
                variants={fadeIn}
                whileHover={{ scale: 1.02 }}
                className={`flex items-center justify-between p-6 ${
                  i < leaderboard.length - 1 ? "border-b border-gray-100" : ""
                } hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 transition-all duration-300`}
              >
                <div className="flex items-center gap-4 flex-1">
                  {/* Rank Badge */}
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-white text-lg shadow-lg ${
                      i === 0
                        ? "bg-gradient-to-br from-yellow-400 to-yellow-600"
                        : i === 1
                        ? "bg-gradient-to-br from-gray-300 to-gray-500"
                        : i === 2
                        ? "bg-gradient-to-br from-orange-400 to-orange-600"
                        : "bg-gradient-to-br from-red-500 to-red-700"
                    }`}
                  >
                    #{user.rank}
                  </div>

                  {/* Avatar */}
                  <div className="text-4xl">{user.avatar}</div>

                  {/* User Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-gray-900 text-lg">
                        {user.name}
                      </h3>
                      {i < 3 && <Trophy className="w-4 h-4 text-yellow-500" />}
                    </div>
                    <p className="text-sm text-gray-500">{user.city}</p>
                  </div>
                </div>

                {/* Stats */}
                <div className="text-right">
                  <div className="text-2xl font-bold text-red-600">
                    {user.donations}
                  </div>
                  <div className="text-xs text-gray-500">donations</div>
                  <div className="mt-1 inline-block bg-red-100 text-red-700 px-2 py-1 rounded text-xs font-semibold">
                    {user.bloodGroup}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            variants={fadeIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <a
              href="/leaderboard"
              className="inline-flex items-center gap-2 text-red-600 font-semibold hover:gap-3 transition-all"
            >
              View Full Leaderboard
              <ArrowRight className="w-5 h-5" />
            </a>
          </motion.div>
        </div>
      </section>

      {/* ============ TESTIMONIALS ============ */}
      <section id="testimonials" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            variants={fadeIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Real Stories, Real Impact
            </h2>
            <p className="text-xl text-gray-600">
              Hear from doctors, donors, and lives we've saved
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-3 gap-8"
          >
            {testimonials.map((t, i) => (
              <motion.div
                key={i}
                variants={fadeIn}
                whileHover={{ y: -10 }}
                className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 relative"
              >
                {/* Quote Icon */}
                <div className="absolute -top-4 -left-4 w-12 h-12 bg-red-600 rounded-full flex items-center justify-center text-white text-3xl font-serif">
                  "
                </div>

                {/* Rating */}
                <div className="flex gap-1 mb-4">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>

                {/* Quote */}
                <p className="text-gray-700 italic mb-6 leading-relaxed">
                  "{t.quote}"
                </p>

                {/* Author */}
                <div className="flex items-center gap-3">
                  <div className="text-4xl">{t.image}</div>
                  <div>
                    <h4 className="font-bold text-gray-900">{t.name}</h4>
                    <p className="text-sm text-gray-500">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ============ FAQ ============ */}
      <section id="faq" className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            variants={fadeIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-600">
              Everything you need to know about BloodChain
            </p>
          </motion.div>

          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-gray-50 rounded-2xl overflow-hidden border border-gray-200"
              >
                <button
                  onClick={() => setExpandedFAQ(expandedFAQ === i ? null : i)}
                  className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-3 flex-1">
                    <HelpCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                    <span className="font-semibold text-gray-900">
                      {faq.question}
                    </span>
                  </div>
                  <ChevronDown
                    className={`w-5 h-5 text-gray-400 transition-transform ${
                      expandedFAQ === i ? "rotate-180" : ""
                    }`}
                  />
                </button>

                <AnimatePresence>
                  {expandedFAQ === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6 text-gray-600 leading-relaxed">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>

          <motion.div
            variants={fadeIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <p className="text-gray-600 mb-4">Still have questions?</p>
            <a
              href="mailto:support@bloodchain.in"
              className="inline-flex items-center gap-2 text-red-600 font-semibold hover:gap-3 transition-all"
            >
              <Mail className="w-5 h-5" />
              Contact Support
            </a>
          </motion.div>
        </div>
      </section>

      {/* ============ CTA SECTION ============ */}
      <section className="py-24 bg-gradient-to-br from-red-600 via-red-700 to-red-800 text-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] " />
        </div>

        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="space-y-8"
          >
            <motion.div variants={fadeIn} className="text-6xl mb-6">
              🩸
            </motion.div>

            <motion.h2
              variants={fadeIn}
              className="text-4xl md:text-6xl font-bold mb-6"
            >
              Ready to Save Lives?
            </motion.h2>

            <motion.p
              variants={fadeIn}
              className="text-xl md:text-2xl mb-8 opacity-90 max-w-2xl mx-auto"
            >
              Join <strong>284,750+ donors</strong> across India making a
              difference every single day.
            </motion.p>

            <motion.div
              variants={fadeIn}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <a
                href="/signup"
                className="group bg-white text-red-600 px-10 py-5 rounded-2xl text-lg font-bold hover:bg-gray-100 transition-all duration-300 inline-flex items-center justify-center gap-3 shadow-2xl hover:scale-105"
              >
                Start Donating Now
                <Trophy className="w-6 h-6 group-hover:scale-110 transition-transform" />
              </a>
              <a
                href="#download"
                className="group border-2 border-white text-white px-10 py-5 rounded-2xl text-lg font-bold hover:bg-white hover:text-red-600 transition-all duration-300 inline-flex items-center justify-center gap-3"
              >
                <Smartphone className="w-6 h-6" />
                Download App
              </a>
            </motion.div>

            <motion.div
              variants={fadeIn}
              className="pt-8 flex flex-wrap justify-center gap-8 text-sm opacity-80"
            >
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                <span>Free to join</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                <span>Instant verification</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                <span>Earn rewards</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ============ FOOTER ============ */}
      <footer className="bg-gray-900 text-white">
        {/* Main Footer */}
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">
            {/* Brand Column */}
            <div className="lg:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-red-600 to-red-700 rounded-xl flex items-center justify-center">
                  <Heart className="w-7 h-7 text-white fill-white" />
                </div>
                <div>
                  <span className="text-2xl font-bold">BloodChain</span>
                  <div className="flex items-center gap-1 text-xs text-gray-400">
                    <Verified className="w-3 h-3 text-blue-400" />
                    <span>Blockchain Verified</span>
                  </div>
                </div>
              </div>
              <p className="text-gray-400 mb-6 leading-relaxed">
                India's first blockchain-powered blood donation platform. Every
                drop counts, every donation tracked, every life saved matters.
              </p>
              <div className="flex gap-3">
                <a
                  href="#"
                  className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-red-600 transition-colors"
                >
                  <Facebook className="w-5 h-5" />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-red-600 transition-colors"
                >
                  <Twitter className="w-5 h-5" />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-red-600 transition-colors"
                >
                  <Instagram className="w-5 h-5" />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-red-600 transition-colors"
                >
                  <Linkedin className="w-5 h-5" />
                </a>
              </div>
            </div>

            {/* Platform Links */}
            <div>
              <h4 className="font-bold text-lg mb-4">Platform</h4>
              <ul className="space-y-3 text-gray-400">
                <li>
                  <a href="/donor" className="hover:text-white transition">
                    For Donors
                  </a>
                </li>
                <li>
                  <a href="/bloodbank" className="hover:text-white transition">
                    For Blood Banks
                  </a>
                </li>
                <li>
                  <a href="/hospital" className="hover:text-white transition">
                    For Hospitals
                  </a>
                </li>
                <li>
                  <a href="/admin" className="hover:text-white transition">
                    Admin Portal
                  </a>
                </li>
              </ul>
            </div>

            {/* Resources Links */}
            <div>
              <h4 className="font-bold text-lg mb-4">Resources</h4>
              <ul className="space-y-3 text-gray-400">
                <li>
                  <a href="/about" className="hover:text-white transition">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="/blog" className="hover:text-white transition">
                    Blog
                  </a>
                </li>
                <li>
                  <a
                    href="/documentation"
                    className="hover:text-white transition"
                  >
                    Documentation
                  </a>
                </li>
                <li>
                  <a href="/careers" className="hover:text-white transition">
                    Careers
                  </a>
                </li>
              </ul>
            </div>

            {/* Legal Links */}
            <div>
              <h4 className="font-bold text-lg mb-4">Legal</h4>
              <ul className="space-y-3 text-gray-400">
                <li>
                  <a href="/privacy" className="hover:text-white transition">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="/terms" className="hover:text-white transition">
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a href="/security" className="hover:text-white transition">
                    Security
                  </a>
                </li>
                <li>
                  <a href="/contact" className="hover:text-white transition">
                    Contact Us
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm">
              © 2025 BloodChain. All rights reserved. Made with ❤️ in India.
            </p>
            <div className="flex items-center gap-6 text-sm text-gray-400">
              <a href="#" className="hover:text-white transition">
                <Phone className="w-4 h-4 inline mr-1" />
                1800-BLOOD-CHAIN
              </a>
              <a href="#" className="hover:text-white transition">
                <Mail className="w-4 h-4 inline mr-1" />
                support@bloodchain.in
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* ============ SCROLL TO TOP BUTTON ============ */}
      <motion.button
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: false }}
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="fixed bottom-8 right-8 w-14 h-14 bg-gradient-to-br from-red-600 to-red-700 text-white rounded-full shadow-2xl hover:scale-110 transition-transform z-50 flex items-center justify-center"
      >
        <ChevronRight className="w-6 h-6 rotate-[-90deg]" />
      </motion.button>
    </div>
  );
};

export default BloodChainLanding;
