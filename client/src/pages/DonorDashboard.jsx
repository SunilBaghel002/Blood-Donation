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
} from "lucide-react";

import { useWeb3 } from "../contexts/Web3Context.jsx";
import Header from "../components/Header";
import BloodDroplet from "../components/BloodDroplet";
import NotificationMessage from "../components/NotificationMessage";
import MetricCard from "../components/MetricCard";
import Table from "../components/Table";
import { Avatar, AvatarImage, AvatarFallback } from "../components/ui/avatar";
import ScheduleDonationForm from "../components/ScheduleDonationForm";
import confetti from 'canvas-confetti';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const EXPLORER_URL = "https://sepolia.etherscan.io/tx/";

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
      bloodType: tx.bloodType,
      status: tx.status,
      quantity: tx.quantity,
      location:
        bloodBanks.find((b) => b._id === tx.bloodBankId)?.name || "Unknown",
      txHash: tx.txHash || null,
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
        date: new Date(Number(e.args.timestamp) * 1000).toLocaleDateString(),
        location: "Blockchain",
        status: "Confirmed",
      }));
      setDonationHistory((prev) => {
        const merged = [...prev];
        chainHist.forEach((c) => {
          if (!merged.some((m) => m.txHash === c.txHash)) merged.push(c);
        });
        return merged.sort((a, b) => new Date(b.date) - new Date(a.date));
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

  const handleDonate = async (bloodType, units = 1) => {
    if (!isConnected) return showToast("error", "Connect MetaMask first");
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      const donorId = localStorage.getItem("userId") || userData?._id;
      const res = await fetch(
        "http://localhost:5000/api/bloodbank/record-donation",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ donorId, bloodType, units }),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Donation failed");

      showToast(
        "success",
        `Donated ${units} unit(s) of ${bloodType}! Tx: ${data.txHash.slice(
          0,
          8
        )}...`
      );
      confetti({
  particleCount: 100,
  spread: 70,
  origin: { y: 0.6 },
  colors: ['#ef4444', '#ec4899', '#f43f5e'],
  scalar: 1.2,
});
      await fetchDonorMongo();
      await fetchOnChainDonations();
    } catch (err) {
      showToast("error", err.message);
    } finally {
      setIsLoading(false);
    }
  };

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

  const educationalContent = {
    title: "Learn About Blood Donation",
    articles: [
      {
        title: "The Importance of Blood Donation",
        content:
          "Blood donation is a critical act that can save up to three lives per donation...",
      },
      {
        title: "Who Can Donate?",
        content:
          "Healthy adults aged 17-65, weighing at least 110 lbs (50 kg)...",
      },
      {
        title: "The Donation Process",
        content:
          "The blood donation process is simple and safe, taking about 30-45 minutes...",
      },
      {
        title: "Benefits of Donating",
        content:
          "Donating blood not only saves lives but also benefits the donor...",
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

  const renderDonationHistory = () => (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-red-100 overflow-y-scroll overflow-x-visible h-148"
    >
      <motion.div
        variants={item}
        className="flex items-center justify-between mb-6 "
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

      {/* <motion.div
        variants={item}
        className="bg-gradient-to-r from-red-600 to-pink-600 rounded-3xl p-8 shadow-2xl"
      >
        <h3 className="text-3xl font-bold text-white mb-6 text-center">
          Quick Donate Now
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {["O+", "A+", "B+", "AB+"].map((bt) => (
            <motion.div
              key={bt}
              whileHover={{ scale: 1.15, rotateY: 180 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleDonate(bt, 1)}
              className="relative preserve-3d cursor-pointer"
              style={{ transformStyle: "preserve-3d" }}
            >
              <div className="absolute inset-0 backface-hidden bg-white/20 backdrop-blur-md rounded-2xl p-6 flex flex-col items-center justify-center text-white font-bold shadow-lg">
                <Droplets className="w-12 h-12 mb-2" />
                <span className="text-2xl">{bt}</span>
              </div>
              <div className="absolute inset-0 rotate-y-180 backface-hidden bg-gradient-to-br from-red-700 to-pink-700 rounded-2xl p-6 flex items-center justify-center">
                <motion.div
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ duration: 0.6, repeat: Infinity }}
                >
                  <Droplets className="w-16 h-16 text-white" />
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div> */}

      <div className="grid lg:grid-cols-2 gap-8">
        {renderDonationHistory()}
        {renderScheduleDonation()}
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
      : renderEducationTab();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50 font-inter relative overflow-hidden">
      <div className="absolute inset-0">
        <style>{`
          @keyframes float { 0%, 100% { transform: translateY(0) scale(1); opacity: 0.3; } 50% { transform: translateY(-60px) scale(1.1); opacity: 0.6; } }
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
