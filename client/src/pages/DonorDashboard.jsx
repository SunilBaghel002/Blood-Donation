// DonorDashboard.jsx
import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
import {
  Heart,
  Gift,
  Shield,
  Calendar,
  MapPin,
  Droplets,
  Users,
  BookOpen,
  ChevronUp,
  ChevronDown,
  CheckCircle,
  ExternalLink,
  Sparkles,
  Award,
  Flame,
  Sun,
  Trophy,
  Map,
  Globe,
  TrendingUp,
  Package,
  Navigation,
  Search,
  ArrowRight,
  Clock,
  AlertCircle,
  Truck,
  Hospital,
  UserCheck,
  Zap,
} from "lucide-react";

import { useWeb3 } from "../contexts/Web3Context.jsx";
import Header from "../components/Header";
import BloodDroplet from "../components/BloodDroplet";
import NotificationMessage from "../components/NotificationMessage";
import MetricCard from "../components/MetricCard";
import Table from "../components/Table";
import { Avatar, AvatarImage, AvatarFallback } from "../components/ui/avatar";
import ScheduleDonationForm from "../components/ScheduleDonationForm";
import confetti from "canvas-confetti";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const EXPLORER_URL = "https://sepolia.etherscan.io/tx/";

// Dummy live data (replace with API later)
const liveDonations = [
  {
    id: 1,
    location: "New York, USA",
    type: "O+",
    time: "2 mins ago",
    lat: 40.7128,
    lng: -74.006,
  },
  {
    id: 2,
    location: "Mumbai, India",
    type: "A+",
    time: "5 mins ago",
    lat: 19.076,
    lng: 72.8777,
  },
  {
    id: 3,
    location: "London, UK",
    type: "B+",
    time: "8 mins ago",
    lat: 51.5074,
    lng: -0.1278,
  },
  {
    id: 4,
    location: "Tokyo, Japan",
    type: "AB+",
    time: "12 mins ago",
    lat: 35.6762,
    lng: 139.6503,
  },
];

const leaderboard = [
  {
    rank: 1,
    name: "Sarah K.",
    donations: 42,
    points: 4200,
    badge: "Platinum Donor",
  },
  { rank: 2, name: "Raj P.", donations: 38, points: 3800, badge: "Gold Donor" },
  {
    rank: 3,
    name: "Emma L.",
    donations: 35,
    points: 3500,
    badge: "Gold Donor",
  },
  { rank: 4, name: "You", donations: 0, points: 0, badge: "New Hero" },
];

const DonorDashboard = () => {
  const {
    account,
    contract,
    isConnected,
    connectWallet,
    isLoading: web3Loading,
  } = useWeb3();

  const [activeTab, setActiveTab] = useState("dashboard");
  const [notifications, setNotifications] = useState(0);
  const [userData, setUserData] = useState(null);
  const [donationHistory, setDonationHistory] = useState([]);
  const [rewards, setRewards] = useState({ points: 0, badges: [] });
  const [bloodBanks, setBloodBanks] = useState([]);
  const [scheduleData, setScheduleData] = useState({
    bloodBankId: "",
    date: "",
    time: "",
  });
  const [particles, setParticles] = useState([]);
  const [expandedArticle, setExpandedArticle] = useState(null);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState({ type: "", msg: "" });
  const [selectedDonation, setSelectedDonation] = useState(null);
  const [searchTxHash, setSearchTxHash] = useState("");

  const showToast = (type, msg) => {
    setToast({ type, msg });
    setTimeout(() => setToast({ type: "", msg: "" }), 5000);
  };

  useEffect(() => {
    const newParticles = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 4,
      duration: 6 + Math.random() * 4,
      size: 10 + Math.random() * 6,
    }));
    setParticles(newParticles);
  }, []);

  const fetchUser = async () => {
    const token = localStorage.getItem("token");
    if (!token) return showToast("error", "Please log in");
    const res = await fetch("http://localhost:5000/api/auth/me", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to load profile");
    setUserData(data.user);
  };

  const fetchBloodBanks = async () => {
    const token = localStorage.getItem("token");
    const res = await fetch("http://localhost:5000/api/bloodbank/registered", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to load blood banks");
    setBloodBanks(
      data.bloodBanks.map((b) => ({
        _id: b._id,
        name: b.bloodBankInfo.name,
        location: b.bloodBankInfo.location,
      }))
    );
  };

  const fetchDonorMongo = async () => {
    const token = localStorage.getItem("token");
    const [histRes, rewRes] = await Promise.all([
      fetch("http://localhost:5000/api/donor/history", {
        headers: { Authorization: `Bearer ${token}` },
      }),
      fetch("http://localhost:5000/api/donor/rewards", {
        headers: { Authorization: `Bearer ${token}` },
      }),
    ]);
    const hist = await histRes.json();
    const rew = await rewRes.json();
    if (!histRes.ok) throw new Error(hist.error || "History error");
    if (!rewRes.ok) throw new Error(rew.error || "Rewards error");

    const mapped = (hist.history || []).map((tx) => ({
      _id: tx._id,
      date: new Date(tx.timestamp).toLocaleDateString(),
      fullDate: new Date(tx.timestamp),
      bloodType: tx.bloodType,
      status: tx.status,
      quantity: tx.quantity,
      location:
        bloodBanks.find((b) => b._id === tx.bloodBankId)?.name || "Unknown",
      txHash: tx.txHash || null,
      // Mock tracking stages (in production, fetch from blockchain/backend)
      trackingStages: [
        {
          stage: "Collected",
          status: "completed",
          date: new Date(tx.timestamp),
          location: bloodBanks.find((b) => b._id === tx.bloodBankId)?.name,
        },
        {
          stage: "Tested",
          status:
            tx.status === "Confirmed" ||
            tx.status === "In Transit" ||
            tx.status === "Used"
              ? "completed"
              : "pending",
          date:
            tx.status === "Confirmed"
              ? new Date(new Date(tx.timestamp).getTime() + 2 * 60 * 60 * 1000)
              : null,
          location: "Lab Facility",
        },
        {
          stage: "Stored",
          status:
            tx.status === "Confirmed" ||
            tx.status === "In Transit" ||
            tx.status === "Used"
              ? "completed"
              : "pending",
          date:
            tx.status === "Confirmed"
              ? new Date(new Date(tx.timestamp).getTime() + 4 * 60 * 60 * 1000)
              : null,
          location: "Blood Bank Storage",
        },
        {
          stage: "In Transit",
          status:
            tx.status === "In Transit" || tx.status === "Used"
              ? "completed"
              : "pending",
          date:
            tx.status === "In Transit"
              ? new Date(new Date(tx.timestamp).getTime() + 24 * 60 * 60 * 1000)
              : null,
          location: "Hospital Transport",
        },
        {
          stage: "Used",
          status: tx.status === "Used" ? "completed" : "pending",
          date:
            tx.status === "Used"
              ? new Date(new Date(tx.timestamp).getTime() + 48 * 60 * 60 * 1000)
              : null,
          location: "Emergency Ward, City Hospital",
          impact: "Saved 1 life in surgery",
        },
      ],
    }));
    setDonationHistory(mapped);
    setRewards(rew.rewards || { points: 0, badges: [] });
  };

  const fetchOnChainDonations = async () => {
    if (!contract || !account) return;
    try {
      const filter = contract.filters.DonationRecorded(account);
      const events = await contract.queryFilter(filter, 0, "latest");
      const chainHist = events.map((e) => ({
        txHash: e.transactionHash,
        bloodType: e.args.bloodType,
        units: Number(e.args.units),
        quantity: Number(e.args.units),
        date: new Date(Number(e.args.timestamp) * 1000).toLocaleDateString(),
        fullDate: new Date(Number(e.args.timestamp) * 1000),
        location: "Blockchain",
        status: "Confirmed",
      }));
      setDonationHistory((prev) => {
        const merged = [...prev];
        chainHist.forEach((c) => {
          if (!merged.some((m) => m.txHash === c.txHash)) merged.push(c);
        });
        return merged.sort(
          (a, b) => new Date(b.fullDate) - new Date(a.fullDate)
        );
      });
    } catch (err) {
      console.warn("On-chain fetch failed:", err);
    }
  };

  useEffect(() => {
    const init = async () => {
      setIsLoading(true);
      try {
        await fetchUser();
        await fetchBloodBanks();
        await fetchDonorMongo();
        if (isConnected) await fetchOnChainDonations();
      } catch (err) {
        showToast("error", err.message);
      } finally {
        setIsLoading(false);
      }
    };
    init();
  }, [isConnected]);

  const handleScheduleDonation = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/donor/schedule", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(scheduleData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Schedule failed");
      showToast("success", "Donation scheduled!");
      setScheduleData({ bloodBankId: "", date: "", time: "" });
      await fetchDonorMongo();
    } catch (err) {
      showToast("error", err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuizSubmit = (e) => {
    e.preventDefault();
    let score = 0;
    educationalContent.quiz.forEach((q, i) => {
      if (quizAnswers[i] === q.correctAnswer) score++;
    });
    setQuizScore(score);
    setQuizSubmitted(true);
  };

  const handleTrackDonation = (donation) => {
    setSelectedDonation(donation);
    setActiveTab("tracker");
  };

  const handleSearchTxHash = () => {
    const found = donationHistory.find(
      (d) =>
        d.txHash && d.txHash.toLowerCase().includes(searchTxHash.toLowerCase())
    );
    if (found) {
      setSelectedDonation(found);
      setActiveTab("tracker");
      showToast("success", "Donation found!");
    } else {
      showToast("error", "Transaction not found");
    }
  };

  const educationalContent = {
    title: "Learn About Blood Donation",
    articles: [
      {
        title: "The Importance of Blood Donation",
        content:
          "Blood donation is a critical act that can save up to three lives per donation. Every day, thousands of people require blood transfusions for surgeries, cancer treatment, chronic illnesses, and traumatic injuries. Your single donation can make a life-or-death difference.",
      },
      {
        title: "Who Can Donate?",
        content:
          "Healthy adults aged 17-65, weighing at least 110 lbs (50 kg), can donate blood. You must be in good health, well-rested, and have eaten a meal before donation. Certain medical conditions and medications may temporarily or permanently defer you from donating.",
      },
      {
        title: "The Donation Process",
        content:
          "The blood donation process is simple and safe, taking about 30-45 minutes total. This includes registration, a mini-physical, the actual donation (8-10 minutes), and refreshments. Professional staff ensure your comfort and safety throughout.",
      },
      {
        title: "Benefits of Donating",
        content:
          "Donating blood not only saves lives but also benefits the donor. It provides a free mini-health screening, may reduce iron levels (beneficial for some), and gives you a sense of purpose and community contribution.",
      },
    ],
    facts: [
      "1 donation can save up to 3 lives.",
      "Blood cannot be manufactured; it relies on voluntary donors.",
      "Every 2 seconds, someone in the U.S. needs blood.",
      "Only 7% of the population has O-negative blood, the universal donor type.",
    ],
    bloodTypeData: {
      labels: ["O+", "A+", "B+", "AB+", "O-", "A-", "B-", "AB-"],
      datasets: [
        {
          label: "Global Donation Distribution (%)",
          data: [38, 34, 9, 4, 7, 6, 2, 1],
          backgroundColor: "rgba(239, 68, 68, 0.7)",
          borderColor: "#ef4444",
          borderWidth: 2,
          borderRadius: 8,
        },
      ],
    },
    compatibilityTable: [
      {
        bloodType: "O+",
        canDonateTo: ["O+", "A+", "B+", "AB+"],
        canReceiveFrom: ["O+", "O-"],
        frequency: "Every 56 days",
      },
      {
        bloodType: "A+",
        canDonateTo: ["A+", "AB+"],
        canReceiveFrom: ["A+", "A-", "O+", "O-"],
        frequency: "Every 56 days",
      },
      {
        bloodType: "B+",
        canDonateTo: ["B+", "AB+"],
        canReceiveFrom: ["B+", "B-", "O+", "O-"],
        frequency: "Every 56 days",
      },
      {
        bloodType: "AB+",
        canDonateTo: ["AB+"],
        canReceiveFrom: ["All types"],
        frequency: "Every 56 days",
      },
      {
        bloodType: "O-",
        canDonateTo: ["All types"],
        canReceiveFrom: ["O-"],
        frequency: "Every 56 days",
      },
      {
        bloodType: "A-",
        canDonateTo: ["A+", "A-", "AB+", "AB-"],
        canReceiveFrom: ["A-", "O-"],
        frequency: "Every 56 days",
      },
      {
        bloodType: "B-",
        canDonateTo: ["B+", "B-", "AB+", "AB-"],
        canReceiveFrom: ["B-", "O-"],
        frequency: "Every 56 days",
      },
      {
        bloodType: "AB-",
        canDonateTo: ["AB+", "AB-"],
        canReceiveFrom: ["AB-", "A-", "B-", "O-"],
        frequency: "Every 56 days",
      },
    ],
    quiz: [
      {
        question: "How many lives can one blood donation save?",
        options: ["1", "2", "3", "Up to 3"],
        correctAnswer: "Up to 3",
      },
      {
        question: "What is the minimum weight to donate blood?",
        options: ["100 lbs", "110 lbs", "120 lbs", "130 lbs"],
        correctAnswer: "110 lbs",
      },
      {
        question: "How often can you donate whole blood?",
        options: [
          "Every 30 days",
          "Every 56 days",
          "Every 90 days",
          "Every year",
        ],
        correctAnswer: "Every 56 days",
      },
    ],
  };

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };
  const item = { hidden: { y: 30, opacity: 0 }, show: { y: 0, opacity: 1 } };

  // ============ DONATION TRACKER COMPONENT ============
  const renderDonationTracker = () => {
    const getStageIcon = (stage) => {
      switch (stage) {
        case "Collected":
          return Droplets;
        case "Tested":
          return Shield;
        case "Stored":
          return Package;
        case "In Transit":
          return Truck;
        case "Used":
          return Heart;
        default:
          return CheckCircle;
      }
    };

    const getStageColor = (status) => {
      switch (status) {
        case "completed":
          return "from-green-500 to-emerald-600";
        case "active":
          return "from-blue-500 to-cyan-600";
        case "pending":
          return "from-gray-300 to-gray-400";
        default:
          return "from-gray-300 to-gray-400";
      }
    };

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="p-6 space-y-8"
      >
        {/* Search Bar */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl p-6 border border-red-100"
        >
          <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
            <Search className="w-7 h-7 mr-3 text-blue-600" />
            Track Your Donation
          </h3>
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Enter transaction hash..."
              value={searchTxHash}
              onChange={(e) => setSearchTxHash(e.target.value)}
              className="flex-1 bg-gray-50 border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-400 outline-none font-mono text-sm"
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSearchTxHash}
              className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-8 py-3 rounded-xl font-semibold flex items-center gap-2 shadow-lg"
            >
              <Search className="w-5 h-5" />
              Track
            </motion.button>
          </div>
        </motion.div>

        {/* Recent Donations Quick Access */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl p-6 border border-red-100"
        >
          <h3 className="text-xl font-bold text-gray-800 mb-4">
            Your Recent Donations
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {donationHistory.slice(0, 6).map((donation) => (
              <motion.div
                key={donation._id || donation.txHash}
                whileHover={{ scale: 1.02 }}
                onClick={() => handleTrackDonation(donation)}
                className="bg-gradient-to-r from-red-50 to-pink-50 rounded-xl p-4 cursor-pointer border-2 border-red-100 hover:border-red-300 transition-all"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl font-bold text-red-600">
                    {donation.bloodType}
                  </span>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold ${
                      donation.status === "Confirmed"
                        ? "bg-green-100 text-green-700"
                        : donation.status === "In Transit"
                        ? "bg-blue-100 text-blue-700"
                        : donation.status === "Used"
                        ? "bg-purple-100 text-purple-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {donation.status}
                  </span>
                </div>
                <p className="text-sm text-gray-600">{donation.date}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {donation.location}
                </p>
                <div className="mt-3 flex items-center text-blue-600 text-sm font-medium">
                  Track Journey <ArrowRight className="w-4 h-4 ml-1" />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Detailed Tracking View */}
        {selectedDonation && (
          <motion.div
            initial={{ y: 20, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border-2 border-blue-200"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-800 mb-2">
                  Donation Journey Tracker
                </h2>
                <p className="text-gray-600">
                  Track your life-saving impact in real-time
                </p>
              </div>
              <div className="text-right">
                <div className="inline-flex items-center gap-2 bg-red-100 text-red-700 px-4 py-2 rounded-full font-bold text-lg">
                  <Droplets className="w-6 h-6" />
                  {selectedDonation.bloodType}
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  {selectedDonation.quantity} unit(s)
                </p>
              </div>
            </div>

            {/* Blockchain Verification */}
            {selectedDonation.txHash && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 mb-8 border-2 border-blue-200"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                      <Shield className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-800">
                        Blockchain Verified
                      </p>
                      <p className="text-sm text-gray-600 font-mono">
                        {selectedDonation.txHash.substring(0, 20)}...
                        {selectedDonation.txHash.substring(
                          selectedDonation.txHash.length - 10
                        )}
                      </p>
                    </div>
                  </div>
                  <a
                    href={`${EXPLORER_URL}${selectedDonation.txHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
                  >
                    View on Explorer <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </motion.div>
            )}

            {/* Timeline */}
            <div className="space-y-6">
              {selectedDonation.trackingStages?.map((stage, index) => {
                const StageIcon = getStageIcon(stage.stage);
                const isCompleted = stage.status === "completed";
                const isActive =
                  stage.status === "completed" &&
                  (index === selectedDonation.trackingStages.length - 1 ||
                    selectedDonation.trackingStages[index + 1].status ===
                      "pending");

                return (
                  <motion.div
                    key={index}
                    initial={{ x: -50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="relative pl-16"
                  >
                    {/* Connector Line */}
                    {index < selectedDonation.trackingStages.length - 1 && (
                      <div
                        className={`absolute left-7 top-16 w-1 h-full ${
                          isCompleted ? "bg-green-300" : "bg-gray-200"
                        }`}
                      />
                    )}

                    {/* Stage Icon */}
                    <div
                      className={`absolute left-0 top-0 w-14 h-14 bg-gradient-to-br ${getStageColor(
                        stage.status
                      )} rounded-full flex items-center justify-center shadow-xl ${
                        isActive ? "ring-4 ring-blue-300 animate-pulse" : ""
                      }`}
                    >
                      <StageIcon className="w-7 h-7 text-white" />
                    </div>

                    {/* Stage Content */}
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      className={`bg-gradient-to-r ${
                        isCompleted
                          ? "from-green-50 to-emerald-50 border-green-200"
                          : "from-gray-50 to-gray-100 border-gray-200"
                      } rounded-2xl p-6 border-2 shadow-md`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-xl font-bold text-gray-800">
                          {stage.stage}
                        </h4>
                        {isCompleted && (
                          <CheckCircle className="w-6 h-6 text-green-600" />
                        )}
                        {stage.status === "pending" && (
                          <Clock className="w-6 h-6 text-gray-400" />
                        )}
                      </div>

                      <div className="space-y-2 text-sm text-gray-600">
                        {stage.date && (
                          <p className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            {stage.date.toLocaleString()}
                          </p>
                        )}
                        {stage.location && (
                          <p className="flex items-center gap-2">
                            <MapPin className="w-4 h-4" />
                            {stage.location}
                          </p>
                        )}
                        {stage.impact && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-3 bg-purple-100 border-2 border-purple-300 rounded-lg p-3"
                          >
                            <p className="flex items-center gap-2 text-purple-800 font-semibold">
                              <Sparkles className="w-5 h-5" />
                              Impact: {stage.impact}
                            </p>
                          </motion.div>
                        )}
                      </div>

                      {/* Status Messages */}
                      {stage.status === "pending" && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="mt-3 flex items-center gap-2 text-amber-600 text-sm font-medium"
                        >
                          <AlertCircle className="w-4 h-4" />
                          Awaiting next stage...
                        </motion.div>
                      )}

                      {isActive && (
                        <motion.div
                          animate={{ opacity: [1, 0.5, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                          className="mt-3 flex items-center gap-2 text-blue-600 text-sm font-bold"
                        >
                          <Zap className="w-4 h-4" />
                          Current Stage - In Progress
                        </motion.div>
                      )}
                    </motion.div>
                  </motion.div>
                );
              })}
            </div>

            {/* Impact Summary */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="mt-8 bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl p-8 text-white shadow-2xl"
            >
              <h3 className="text-2xl font-bold mb-4 flex items-center">
                <Heart className="w-7 h-7 mr-3" />
                Your Life-Saving Impact
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <p className="text-4xl font-bold mb-2">
                    {selectedDonation.quantity * 3}
                  </p>
                  <p className="text-purple-100">Potential Lives Saved</p>
                </div>
                <div className="text-center">
                  <p className="text-4xl font-bold mb-2">100%</p>
                  <p className="text-purple-100">Blockchain Verified</p>
                </div>
                <div className="text-center">
                  <p className="text-4xl font-bold mb-2">
                    {selectedDonation.trackingStages?.filter(
                      (s) => s.status === "completed"
                    ).length || 0}
                    /{selectedDonation.trackingStages?.length || 0}
                  </p>
                  <p className="text-purple-100">Stages Completed</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </motion.div>
    );
  };

  const renderDonationHistory = () => (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-red-100 max-h-[600px] overflow-y-auto"
    >
      <motion.div
        variants={item}
        className="flex items-center justify-between mb-6"
      >
        <h3 className="text-2xl font-bold text-gray-800 flex items-center">
          <Heart className="w-7 h-7 mr-3 text-red-600" /> Donation Timeline
        </h3>
        <Sparkles className="w-6 h-6 text-yellow-500 animate-pulse" />
      </motion.div>
      <div className="space-y-6">
        {donationHistory.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            No donations yet. Be a hero today!
          </p>
        ) : (
          donationHistory.map((d, i) => (
            <motion.div
              key={d._id || d.txHash}
              variants={item}
              className="relative pl-12 pb-8 border-l-4 border-red-300"
            >
              <div className="absolute left-0 top-0 w-10 h-10 bg-red-500 rounded-full -translate-x-1/2 flex items-center justify-center shadow-lg">
                <Droplets className="w-6 h-6 text-white" />
              </div>
              <div className="bg-gradient-to-r from-white to-red-50/50 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-lg font-semibold text-gray-800">
                      {d.date}
                    </p>
                    <p className="text-sm text-gray-600 flex items-center mt-1">
                      <MapPin className="w-4 h-4 mr-1" /> {d.location}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="inline-flex items-center bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-bold">
                      <Droplets className="w-4 h-4 mr-1" /> {d.bloodType}
                    </div>
                    <span
                      className={`mt-2 inline-block px-3 py-1 rounded-full text-xs font-bold ${
                        d.status === "Confirmed"
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {d.status}
                    </span>
                  </div>
                </div>

                {/* Track Journey Button */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleTrackDonation(d)}
                  className="mt-4 w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-2 rounded-lg font-semibold flex items-center justify-center gap-2 hover:from-blue-600 hover:to-blue-700 transition"
                >
                  <Navigation className="w-4 h-4" />
                  Track Journey
                </motion.button>

                {d.txHash && (
                  <motion.a
                    whileHover={{ x: 5 }}
                    href={`${EXPLORER_URL}${d.txHash}`}
                    target="_blank"
                    className="mt-3 inline-flex items-center text-xs text-blue-600 hover:text-blue-800 font-medium"
                  >
                    View on Blockchain <ExternalLink className="w-3 h-3 ml-1" />
                  </motion.a>
                )}
              </div>
            </motion.div>
          ))
        )}
      </div>
    </motion.div>
  );

  const renderScheduleDonation = () => (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-gradient-to-br from-red-500/10 to-pink-500/10 backdrop-blur-2xl rounded-3xl p-8 shadow-2xl border border-red-200"
    >
      <motion.div
        initial={{ y: -20 }}
        animate={{ y: 0 }}
        className="text-center mb-6"
      >
        <h3 className="text-3xl font-bold text-gray-800 mb-2">
          Schedule Your Impact
        </h3>
        <p className="text-gray-600">Save lives on your time</p>
      </motion.div>
      <ScheduleDonationForm
        scheduleData={scheduleData}
        setScheduleData={setScheduleData}
        bloodBanks={bloodBanks}
        isLoading={isLoading}
        onSubmit={handleScheduleDonation}
      />
    </motion.div>
  );

  const renderLiveMap = () => (
    <motion.div
      variants={item}
      className="bg-white/90 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-red-100"
    >
      <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
        <Globe className="w-7 h-7 mr-3 text-blue-600" /> Live Donations
        Worldwide
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-6">
          <div className="space-y-4">
            {liveDonations.map((d) => (
              <motion.div
                key={d.id}
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: d.id * 0.1 }}
                className="flex items-center justify-between bg-white/70 backdrop-blur rounded-xl p-4 shadow"
              >
                <div>
                  <p className="font-semibold text-gray-800">{d.location}</p>
                  <p className="text-sm text-gray-600">{d.time}</p>
                </div>
                <div className="bg-red-100 text-red-700 px-3 py-1 rounded-full font-bold text-sm">
                  {d.type}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-6 flex items-center justify-center">
          <Map className="w-32 h-32 text-indigo-400 opacity-50" />
          <p className="absolute text-lg font-bold text-indigo-600">
            Interactive Map Coming Soon
          </p>
        </div>
      </div>
    </motion.div>
  );

  const renderLeaderboard = () => (
    <motion.div
      variants={item}
      className="bg-white/90 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-red-100"
    >
      <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
        <Trophy className="w-7 h-7 mr-3 text-yellow-500" /> Top Donors
      </h3>
      <div className="space-y-4">
        {leaderboard.map((entry, i) => (
          <motion.div
            key={i}
            initial={{ x: i % 2 === 0 ? -50 : 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: i * 0.1 }}
            className={`flex items-center justify-between p-4 rounded-xl ${
              entry.name === "You"
                ? "bg-gradient-to-r from-yellow-100 to-orange-100 border-2 border-yellow-400"
                : "bg-gray-50"
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
                    : "bg-gray-300"
                }`}
              >
                {entry.rank}
              </div>
              <div>
                <p className="font-bold text-gray-800">{entry.name}</p>
                <p className="text-sm text-gray-600">{entry.badge}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-bold text-lg text-gray-800">
                {entry.donations} Donations
              </p>
              <p className="text-sm text-gray-600">{entry.points} pts</p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );

  const renderDashboard = () => (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="p-6 space-y-8"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          {
            label: "Lives Saved",
            value: donationHistory.length * 3,
            icon: Heart,
            color: "from-red-500 to-pink-600",
          },
          {
            label: "Hero Points",
            value: rewards.points,
            icon: Gift,
            color: "from-emerald-500 to-teal-600",
          },
          {
            label: "Badges",
            value: rewards.badges.length,
            icon: Award,
            color: "from-purple-500 to-indigo-600",
          },
        ].map((stat, i) => (
          <motion.div key={i} variants={item} whileHover={{ scale: 1.05 }}>
            <MetricCard {...stat} gradient index={i} />
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {renderDonationHistory()}
        {renderScheduleDonation()}
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {renderLiveMap()}
        {renderLeaderboard()}
      </div>
    </motion.div>
  );

  const renderProfile = () => {
    const achievements = [
      {
        name: "First Donation",
        icon: "Droplet",
        unlocked: userData?.donorInfo?.donationCount > 0,
      },
      {
        name: "5x Hero",
        icon: "Star",
        unlocked: userData?.donorInfo?.donationCount >= 5,
      },
      {
        name: "O+ Legend",
        icon: "Flame",
        unlocked: userData?.donorInfo?.bloodGroup === "O+",
      },
      { name: "Early Bird", icon: "Sun", unlocked: true },
    ];

    const signupQuestions = [
      {
        q: "Emergency Contact",
        a: userData?.emergencyContact || "Not provided",
      },
      { q: "Preferred Time", a: userData?.preferredTime || "Anytime" },
      { q: "Allergies", a: userData?.allergies?.join(", ") || "None" },
      {
        q: "Medical Conditions",
        a: userData?.medicalConditions?.join(", ") || "None",
      },
    ];

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="p-8"
      >
        <div className="max-w-5xl mx-auto space-y-8">
          {/* Hero Card */}
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            className="bg-gradient-to-br from-red-500/20 to-pink-500/20 backdrop-blur-2xl rounded-3xl p-10 shadow-2xl border border-red-200"
          >
            <div className="flex flex-col md:flex-row items-center gap-8">
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.8 }}
              >
                <Avatar className="h-36 w-36 ring-8 ring-white/30 shadow-2xl">
                  <AvatarImage
                    src={
                      userData?.profileImage ||
                      `https://api.dicebear.com/7.x/initials/svg?seed=${userData?.firstName}+${userData?.lastName}`
                    }
                  />
                  <AvatarFallback className="text-4xl font-bold bg-gradient-to-br from-red-500 to-pink-600 text-white">
                    {userData?.firstName?.[0]}
                    {userData?.lastName?.[0]}
                  </AvatarFallback>
                </Avatar>
              </motion.div>
              <div className="text-center md:text-left">
                <h2 className="text-5xl font-bold text-gray-800 mb-2">
                  {userData?.firstName} {userData?.lastName}
                </h2>
                <p className="text-xl text-gray-600 mb-4">{userData?.email}</p>
                <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                  <div className="bg-red-100 text-red-700 px-5 py-2 rounded-full font-bold flex items-center text-lg">
                    <Droplets className="w-6 h-6 mr-2" />{" "}
                    {userData?.donorInfo?.bloodGroup}
                  </div>
                  <div className="bg-emerald-100 text-emerald-700 px-5 py-2 rounded-full font-bold text-lg">
                    {userData?.donorInfo?.donationCount} Donations
                  </div>
                  <div className="bg-purple-100 text-purple-700 px-5 py-2 rounded-full font-bold text-lg">
                    {rewards.points} Points
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Achievements */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-white/90 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-red-100"
          >
            <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
              <Award className="w-7 h-7 mr-3 text-yellow-500" /> Achievements
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {achievements.map((ach, i) => (
                <motion.div
                  key={i}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className={`text-center p-6 rounded-2xl transition-all ${
                    ach.unlocked
                      ? "bg-gradient-to-br from-yellow-400 to-orange-500 text-white shadow-xl"
                      : "bg-gray-100 text-gray-400"
                  }`}
                >
                  <div className="text-4xl mb-2">
                    {ach.icon === "Droplet" && (
                      <Droplets className="w-12 h-12 mx-auto" />
                    )}
                    {ach.icon === "Star" && (
                      <Sparkles className="w-12 h-12 mx-auto" />
                    )}
                    {ach.icon === "Flame" && (
                      <Flame className="w-12 h-12 mx-auto" />
                    )}
                    {ach.icon === "Sun" && (
                      <Sun className="w-12 h-12 mx-auto" />
                    )}
                  </div>
                  <p className="font-bold text-sm">{ach.name}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Signup Q&A */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-white/90 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-red-100"
          >
            <h3 className="text-2xl font-bold text-gray-800 mb-6">
              Personal Info
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              {signupQuestions.map((item, i) => (
                <motion.div
                  key={i}
                  whileHover={{ x: 5 }}
                  className="bg-gradient-to-r from-red-50 to-pink-50 rounded-xl p-5 border border-red-100"
                >
                  <p className="text-sm text-gray-600 font-medium">{item.q}</p>
                  <p className="text-lg font-semibold text-gray-800 mt-1">
                    {item.a}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.div>
    );
  };

  const renderEducationTab = () => (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="p-8 space-y-10"
    >
      <motion.div variants={item} className="text-center">
        <h2 className="text-5xl font-bold text-gray-800 mb-4">
          Blood Donation Academy
        </h2>
        <p className="text-xl text-gray-600">Learn. Donate. Save Lives.</p>
      </motion.div>

      <motion.div
        variants={item}
        className="bg-white/90 backdrop-blur-xl rounded-3xl p-8 shadow-2xl"
      >
        <h3 className="text-2xl font-bold mb-6 text-gray-800">
          Global Blood Types
        </h3>
        <div className="h-80">
          <Bar
            data={educationalContent.bloodTypeData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: { legend: { position: "top" } },
              scales: { y: { beginAtZero: true } },
            }}
          />
        </div>
      </motion.div>

      <div className="space-y-6">
        {educationalContent.articles.map((a, i) => (
          <motion.div
            key={i}
            variants={item}
            whileHover={{ scale: 1.02 }}
            className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl overflow-hidden"
          >
            <button
              onClick={() =>
                setExpandedArticle(expandedArticle === i ? null : i)
              }
              className="w-full p-6 text-left flex justify-between items-center hover:bg-red-50/50 transition-all"
            >
              <h4 className="text-lg font-bold text-gray-800">{a.title}</h4>
              <motion.div animate={{ rotate: expandedArticle === i ? 180 : 0 }}>
                {expandedArticle === i ? (
                  <ChevronUp className="w-6 h-6 text-red-600" />
                ) : (
                  <ChevronDown className="w-6 h-6 text-red-600" />
                )}
              </motion.div>
            </button>
            <AnimatePresence>
              {expandedArticle === i && (
                <motion.p
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="px-6 pb-6 text-gray-600"
                >
                  {a.content}
                </motion.p>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

      <motion.div
        variants={item}
        className="bg-white/90 backdrop-blur-xl rounded-3xl p-8 shadow-2xl"
      >
        <h3 className="text-2xl font-bold mb-6 text-gray-800">
          Compatibility Guide
        </h3>
        <Table
          headers={[
            "Blood Type",
            "Can Donate To",
            "Can Receive From",
            "Frequency",
          ]}
          data={educationalContent.compatibilityTable}
          rowRenderer={(row) => (
            <>
              <td className="py-3 px-4 font-bold text-red-700">
                {row.bloodType}
              </td>
              <td className="py-3 px-4 text-sm">
                {row.canDonateTo.join(", ")}
              </td>
              <td className="py-3 px-4 text-sm">
                {row.canReceiveFrom.join(", ")}
              </td>
              <td className="py-3 px-4 text-sm text-gray-600">
                {row.frequency}
              </td>
            </>
          )}
        />
      </motion.div>

      <motion.div
        variants={item}
        className="bg-gradient-to-r from-red-500/10 to-pink-500/10 backdrop-blur-xl rounded-3xl p-8 shadow-2xl"
      >
        <h3 className="text-2xl font-bold mb-6 text-gray-800">
          Donation Journey
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { step: "Register", icon: Users, desc: "Sign up & verify" },
            { step: "Screen", icon: CheckCircle, desc: "Health check" },
            { step: "Donate", icon: Droplets, desc: "8-10 mins" },
            { step: "Recover", icon: Heart, desc: "Rest & refresh" },
          ].map((s, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -10 }}
              className="text-center bg-white/70 backdrop-blur rounded-2xl p-6 shadow-lg"
            >
              <s.icon className="w-12 h-12 mx-auto mb-3 text-red-600" />
              <h5 className="font-bold text-gray-800">{s.step}</h5>
              <p className="text-sm text-gray-600 mt-1">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <motion.div
        variants={item}
        className="bg-white/90 backdrop-blur-xl rounded-3xl p-8 shadow-2xl"
      >
        <h3 className="text-2xl font-bold mb-6 text-gray-800">
          Test Your Knowledge
        </h3>
        <form onSubmit={handleQuizSubmit} className="space-y-6">
          {educationalContent.quiz.map((q, i) => (
            <motion.div
              key={i}
              whileHover={{ x: 5 }}
              className="border border-red-100 rounded-xl p-5 bg-red-50/30"
            >
              <p className="font-medium text-gray-800 mb-3">{q.question}</p>
              <div className="grid grid-cols-2 gap-3">
                {q.options.map((opt) => (
                  <label
                    key={opt}
                    className="flex items-center space-x-2 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name={`q${i}`}
                      value={opt}
                      checked={quizAnswers[i] === opt}
                      onChange={() =>
                        setQuizAnswers({ ...quizAnswers, [i]: opt })
                      }
                      className="text-red-600 focus:ring-red-400"
                      disabled={quizSubmitted}
                    />
                    <span className="text-sm">{opt}</span>
                  </label>
                ))}
              </div>
            </motion.div>
          ))}
          {!quizSubmitted ? (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              className="w-full bg-gradient-to-r from-red-500 to-pink-600 text-white py-3 rounded-xl font-bold text-lg shadow-lg"
            >
              Submit Quiz
            </motion.button>
          ) : (
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              className="text-center p-6 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl text-white"
            >
              <p className="text-3xl font-bold">
                Score: {quizScore}/{educationalContent.quiz.length}
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                onClick={() => {
                  setQuizAnswers({});
                  setQuizSubmitted(false);
                  setQuizScore(null);
                }}
                className="mt-4 bg-white text-teal-600 px-6 py-2 rounded-lg font-bold"
              >
                Retake Quiz
              </motion.button>
            </motion.div>
          )}
        </form>
      </motion.div>

      <motion.div
        variants={item}
        className="bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-3xl p-8 shadow-2xl"
      >
        <h3 className="text-2xl font-bold mb-6">Key Facts</h3>
        <ul className="space-y-3 text-lg">
          {educationalContent.facts.map((f, i) => (
            <motion.li
              key={i}
              initial={{ x: -50 }}
              animate={{ x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="flex items-center"
            >
              <Sparkles className="w-6 h-6 mr-3" />
              {f}
            </motion.li>
          ))}
        </ul>
      </motion.div>
    </motion.div>
  );

  const renderContent = () => {
    if (isLoading || web3Loading) {
      return (
        <div className="flex justify-center items-center h-96">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-8 border-red-600 border-t-transparent rounded-full"
          />
        </div>
      );
    }
    return activeTab === "dashboard"
      ? renderDashboard()
      : activeTab === "profile"
      ? renderProfile()
      : activeTab === "education"
      ? renderEducationTab()
      : activeTab === "map"
      ? renderLiveMap()
      : activeTab === "leaderboard"
      ? renderLeaderboard()
      : activeTab === "tracker"
      ? renderDonationTracker()
      : renderDashboard();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50 font-inter relative overflow-hidden">
      <div className="absolute inset-0">
        <style>{`
          .preserve-3d { transform-style: preserve-3d; }
          .backface-hidden { backface-visibility: hidden; }
          .rotate-y-180 { transform: rotateY(180deg); }
        `}</style>
        {particles.map((p) => (
          <BloodDroplet key={p.id} particle={p} />
        ))}
      </div>

      <Header
        userType="Donor"
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        notifications={notifications}
        connectWallet={connectWallet}
        connectedWallet={isConnected}
        isLoading={web3Loading}
        user={userData}
        extraTabs={["tracker", "map", "leaderboard"]}
      />

      <NotificationMessage
        success={toast.type === "success" ? toast.msg : ""}
        error={toast.type === "error" ? toast.msg : ""}
      />
      <main className="relative z-10 max-w-7xl mx-auto px-4">
        {renderContent()}
      </main>
    </div>
  );
};

export default DonorDashboard;
