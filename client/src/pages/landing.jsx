// src/pages/BloodChainLanding.jsx
import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
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
} from "lucide-react";
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
import CountUp from "react-countup";

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
  const [donationCount, setDonationCount] = useState(118542301);
  const [leaderboard] = useState([
    { rank: 1, name: "Sarah M.", donations: 42, city: "New York", avatar: "S" },
    { rank: 2, name: "Rajesh K.", donations: 38, city: "Mumbai", avatar: "R" },
    { rank: 3, name: "Ana L.", donations: 35, city: "São Paulo", avatar: "A" },
    { rank: 4, name: "James T.", donations: 31, city: "London", avatar: "J" },
    { rank: 5, name: "Li Wei", donations: 29, city: "Beijing", avatar: "L" },
  ]);

  const mapRef = useRef(null);
  const mapInitialized = useRef(false);

  // Simulate live donations
  useEffect(() => {
    const interval = setInterval(() => {
      setDonationCount((prev) => prev + Math.floor(Math.random() * 3) + 1);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  // === MAPMYINDIA: LOAD SDK + INIT MAP ===
  useEffect(() => {
    if (mapInitialized.current) return;

    const MAP_SDK_KEY = import.meta.env.VITE_APP_MAPMYINDIA_MAP_SDK_KEY;
    if (!MAP_SDK_KEY) {
      console.error("Add REACT_APP_MAPMYINDIA_MAP_SDK_KEY to .env");
      return;
    }

    // Load MapmyIndia SDK
    const script = document.createElement("script");
    script.src = `https://apis.mappls.com/advancedmaps/api/${MAP_SDK_KEY}/map_sdk?v=3.0&layer=vector`;
    script.async = true;

    script.onload = () => {
      if (!document.getElementById("mapmyindia-map")) return;

      // Initialize Map
      mapRef.current = new window.MapmyIndia.Map("mapmyindia-map", {
        center: [20.5937, 78.9629],
        zoom: 4,
        zoomControl: true,
        hybrid: false,
        search: false,
      });

      // Indian cities with donor data
      const donorLocations = [
        { name: "Delhi", lat: 28.6139, lng: 77.209, donors: 18500 },
        { name: "Mumbai", lat: 19.076, lng: 72.8777, donors: 15200 },
        { name: "Bangalore", lat: 12.9716, lng: 77.5946, donors: 13800 },
        { name: "Chennai", lat: 13.0827, lng: 80.2707, donors: 11200 },
        { name: "Kolkata", lat: 22.5726, lng: 88.3639, donors: 9800 },
        { name: "Hyderabad", lat: 17.385, lng: 78.4867, donors: 9500 },
        { name: "Pune", lat: 18.5204, lng: 73.8567, donors: 8700 },
        { name: "Ahmedabad", lat: 23.0225, lng: 72.5714, donors: 7900 },
      ];

      // Add markers
      donorLocations.forEach((loc) => {
        new window.MapmyIndia.Marker({
          map: mapRef.current,
          position: [loc.lat, loc.lng],
          icon: "https://www.mapmyindia.com/api/advanced-maps/doc/sample/map_sdk/red_marker.png",
          popup: {
            html: `
              <div style="font-family: system-ui; padding: 8px; min-width: 130px;">
                <h4 style="margin: 0 0 4px; color: #dc2626; font-weight: bold; font-size: 14px;">
                  ${loc.name}
                </h4>
                <p style="margin: 0; font-size: 13px; color: #374151;">
                  ${loc.donors.toLocaleString()} donors
                </p>
              </div>
            `,
            offset: [0, -35],
          },
        });
      });

      mapInitialized.current = true;
    };

    script.onerror = () => {
      console.error("Failed to load MapmyIndia SDK");
    };

    document.head.appendChild(script);

    return () => {
      if (script.parentNode) script.parentNode.removeChild(script);
      if (mapRef.current && mapRef.current.remove) mapRef.current.remove();
    };
  }, []);

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const stats = [
    { label: "Total Donations", value: donationCount, format: "number" },
    { label: "Lives Saved", value: donationCount * 3, format: "number" },
    { label: "Active Donors", value: 284750, format: "number" },
    { label: "Partner Hospitals", value: 127, format: "number" },
  ];

  const features = [
    {
      icon: Database,
      title: "Transparent Tracking",
      desc: "Every donation recorded on Ethereum — immutable, auditable, trusted.",
    },
    {
      icon: Shield,
      title: "Medical-Grade Security",
      desc: "HIPAA-compliant encryption. Your data is safe, always.",
    },
    {
      icon: Activity,
      title: "Real-Time Inventory",
      desc: "Hospitals see live blood levels. No more shortages.",
    },
    {
      icon: Trophy,
      title: "Donor Rewards",
      desc: "Earn badges, track impact, get priority alerts.",
    },
  ];

  const howItWorks = [
    {
      step: 1,
      title: "Register & Verify",
      desc: "Secure signup with ID verification",
    },
    {
      step: 2,
      title: "Donate at Center",
      desc: "Visit any partnered blood bank",
    },
    {
      step: 3,
      title: "Tracked on Blockchain",
      desc: "Donation logged instantly",
    },
    { step: 4, title: "Save Lives", desc: "Your blood helps patients in need" },
  ];

  const hospitalPartners = [
    {
      name: "Mayo Clinic",
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Mayo_Clinic_logo.svg/512px-Mayo_Clinic_logo.svg.png",
    },
    {
      name: "Cleveland Clinic",
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1c/Cleveland_Clinic_logo.svg/512px-Cleveland_Clinic_logo.svg.png",
    },
    {
      name: "Johns Hopkins",
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/02/Johns_Hopkins_University_Seal.svg/512px-Johns_Hopkins_University_Seal.svg.png",
    },
    {
      name: "Apollo Hospitals",
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Apollo_Hospitals_Logo.svg/512px-Apollo_Hospitals_Logo.svg.png",
    },
    {
      name: "NHS",
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0e/NHS-Logo.svg/512px-NHS-Logo.svg.png",
    },
    {
      name: "Red Cross",
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/Emblem_of_the_ICRC.svg/512px-Emblem_of_the_ICRC.svg.png",
    },
  ];

  const chartData = {
    labels: ["2019", "2020", "2021", "2022", "2023", "2024"],
    datasets: [
      {
        label: "Global Donations (Millions)",
        data: [112, 108, 115, 117, 118, 120],
        backgroundColor: "#dc2626",
        borderRadius: 6,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: { y: { beginAtZero: true } },
  };

  return (
    <>
      {/* NAVIGATION */}
      <nav className="fixed top-0 w-full bg-white shadow-sm z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">BloodChain</span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <a
              href="#features"
              className="text-gray-700 hover:text-red-600 font-medium"
            >
              Features
            </a>
            <a
              href="#how"
              className="text-gray-700 hover:text-red-600 font-medium"
            >
              How It Works
            </a>
            <a
              href="#map"
              className="text-gray-700 hover:text-red-600 font-medium"
            >
              Global Reach
            </a>
            <a
              href="#leaderboard"
              className="text-gray-700 hover:text-red-600 font-medium"
            >
              Leaderboard
            </a>
            <a
              href="/signup"
              className="bg-red-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-red-700 transition"
            >
              Donate Now
            </a>
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

        {isMenuOpen && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: "auto" }}
            className="md:hidden bg-white border-t"
          >
            <div className="px-6 py-4 space-y-3">
              <a href="#features" className="block text-gray-700">
                Features
              </a>
              <a href="#how" className="block text-gray-700">
                How It Works
              </a>
              <a href="#map" className="block text-gray-700">
                Global Reach
              </a>
              <a href="#leaderboard" className="block text-gray-700">
                Leaderboard
              </a>
              <a
                href="/signup"
                className="block bg-red-600 text-white px-6 py-2 rounded-lg text-center font-medium"
              >
                Donate Now
              </a>
            </div>
          </motion.div>
        )}
      </nav>

      {/* HERO */}
      <section className="pt-32 pb-20 bg-gradient-to-b from-red-50 to-white">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <motion.div
            variants={fadeIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Transparent Blood Donation
              <br />
              <span className="text-red-600">Powered by Blockchain</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Track every donation from donor to patient. Build trust. Save
              lives.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/signup"
                className="bg-red-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-red-700 transition flex items-center justify-center gap-2"
              >
                Become a Donor <ArrowRight className="w-5 h-5" />
              </a>
              <a
                href="#demo"
                className="border-2 border-red-600 text-red-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-red-50 transition flex items-center justify-center gap-2"
              >
                <Play className="w-5 h-5" /> Watch Demo
              </a>
            </div>
          </motion.div>

          {/* Live Counter */}
          <div className="mt-16 bg-white rounded-2xl shadow-lg p-8 max-w-4xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              {stats.map((stat, i) => (
                <div key={i}>
                  <div className="text-3xl font-bold text-red-600">
                    <CountUp end={stat.value} duration={2.5} separator="," />
                    {stat.format === "number" && "+"}
                  </div>
                  <div className="text-gray-700 font-medium mt-1">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Trust Badges */}
          <div className="mt-12 flex flex-wrap justify-center gap-8 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-green-600" />
              <span>HIPAA Compliant</span>
            </div>
            <div className="flex items-center gap-2">
              <Lock className="w-5 h-5 text-green-600" />
              <span>End-to-End Encrypted</span>
            </div>
            <div className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-green-600" />
              <span>WHO Aligned</span>
            </div>
          </div>
        </div>
      </section>

      {/* HOSPITAL PARTNERS */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            variants={fadeIn}
            initial="hidden"
            whileInView="visible"
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900">
              Trusted by Leading Hospitals
            </h2>
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 items-center">
            {hospitalPartners.map((h, i) => (
              <motion.img
                key={i}
                src={h.logo}
                alt={h.name}
                className="h-12 mx-auto grayscale hover:grayscale-0 transition"
                whileHover={{ scale: 1.1 }}
              />
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            variants={fadeIn}
            initial="hidden"
            whileInView="visible"
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why BloodChain?
            </h2>
            <p className="text-xl text-gray-600">
              A modern solution to an urgent problem.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((f, i) => (
              <motion.div
                key={i}
                variants={fadeIn}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="bg-gray-50 p-6 rounded-xl hover:shadow-md transition"
              >
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                  <f.icon className="w-7 h-7 text-red-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {f.title}
                </h3>
                <p className="text-gray-600">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            variants={fadeIn}
            initial="hidden"
            whileInView="visible"
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600">Simple. Secure. Impactful.</p>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-6">
            {howItWorks.map((step, i) => (
              <div key={i} className="relative">
                {i < howItWorks.length - 1 && (
                  <div className="absolute top-10 left-16 w-full h-0.5 bg-gray-300 hidden md:block" />
                )}
                <motion.div
                  variants={fadeIn}
                  initial="hidden"
                  whileInView="visible"
                  className="bg-white p-6 rounded-xl border border-gray-100 text-center relative z-10"
                >
                  <div className="w-12 h-12 bg-red-600 text-white rounded-full flex items-center justify-center font-bold text-lg mx-auto mb-4">
                    {step.step}
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-sm text-gray-600">{step.desc}</p>
                </motion.div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* GLOBAL MAP - MAPMYINDIA */}
      <section id="map" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            variants={fadeIn}
            initial="hidden"
            whileInView="visible"
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Global Donor Network
            </h2>
            <p className="text-xl text-gray-600">
              Join donors from 120+ countries
            </p>
          </motion.div>

          <div className="bg-gray-50 rounded-2xl p-4 shadow-sm h-96 md:h-[500px] overflow-hidden">
            <div
              id="mapmyindia-map"
              className="w-full h-full rounded-xl"
              style={{ minHeight: "400px" }}
            >
              {!process.env.REACT_APP_MAPMYINDIA_MAP_SDK_KEY && (
                <div className="flex items-center justify-center h-full bg-gray-200 text-gray-600 text-center p-4">
                  <p className="text-sm">
                    Add{" "}
                    <code className="bg-gray-300 px-1 rounded">
                      REACT_APP_MAPMYINDIA_MAP_SDK_KEY
                    </code>{" "}
                    in <code>.env</code>
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* LEADERBOARD */}
      <section id="leaderboard" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            variants={fadeIn}
            initial="hidden"
            whileInView="visible"
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Top Donors This Month
            </h2>
            <p className="text-xl text-gray-600">
              Be the next hero on the leaderboard
            </p>
          </motion.div>

          <div className="bg-white rounded-2xl shadow-sm overflow-hidden max-w-2xl mx-auto">
            {leaderboard.map((user, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className={`flex items-center justify-between p-4 ${
                  i < leaderboard.length - 1 ? "border-b" : ""
                }`}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${
                      i === 0
                        ? "bg-yellow-500"
                        : i === 1
                        ? "bg-gray-400"
                        : i === 2
                        ? "bg-orange-600"
                        : "bg-red-600"
                    }`}
                  >
                    {user.rank}
                  </div>
                  <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center text-red-600 font-bold">
                    {user.avatar}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">
                      {user.name}
                    </div>
                    <div className="text-sm text-gray-500">{user.city}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-red-600">{user.donations}</div>
                  <div className="text-xs text-gray-500">donations</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CHART */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            variants={fadeIn}
            initial="hidden"
            whileInView="visible"
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Growing Impact
            </h2>
            <p className="text-xl text-gray-600">
              Global blood donations are rising — but gaps remain.
            </p>
          </motion.div>
          <div className="bg-gray-50 p-6 rounded-xl shadow-sm max-w-4xl mx-auto">
            <Bar data={chartData} options={chartOptions} />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-red-600 text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.h2
            variants={fadeIn}
            initial="hidden"
            whileInView="visible"
            className="text-4xl font-bold mb-6"
          >
            Ready to Save Lives?
          </motion.h2>
          <motion.p
            variants={fadeIn}
            initial="hidden"
            whileInView="visible"
            className="text-xl mb-8 opacity-90"
          >
            Join 280,000+ donors making a difference every day.
          </motion.p>
          <motion.a
            href="/signup"
            variants={fadeIn}
            initial="hidden"
            whileInView="visible"
            className="inline-flex items-center gap-3 bg-white text-red-600 px-8 py-4 rounded-lg text-lg font-bold hover:bg-gray-100 transition"
          >
            Start Donating Now <Trophy className="w-5 h-5" />
          </motion.a>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-red-600 rounded flex items-center justify-center">
                  <Heart className="w-5 h-5 text-white" />
                </div>
                <span className="font-bold">BloodChain</span>
              </div>
              <p className="text-gray-400 text-sm">
                Blockchain-powered blood donation tracking.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Platform</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <a href="#" className="hover:text-white">
                    For Donors
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    For Hospitals
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    For Blood Banks
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Company</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <a href="#" className="hover:text-white">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Careers
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Legal</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <a href="#" className="hover:text-white">
                    Privacy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Terms
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Security
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-6 text-center text-sm text-gray-400">
            © 2025 BloodChain. All rights reserved.
          </div>
        </div>
      </footer>
    </>
  );
};

export default BloodChainLanding;
