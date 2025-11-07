import React, { useState, useEffect } from "react";
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
  Clock,
  Target,
} from "lucide-react";

import { useWeb3 } from "../contexts/Web3Context.jsx";
import Header from "../components/Header";
import BloodDroplet from "../components/BloodDroplet";
import NotificationMessage from "../components/NotificationMessage";
import MetricCard from "../components/MetricCard";
import Table from "../components/Table";
import { Avatar, AvatarImage, AvatarFallback } from "../components/ui/avatar";
import ScheduleDonationForm from "../components/ScheduleDonationForm";

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
  const [notifications] = useState(3);
  const [userData, setUserData] = useState(null);
  const [donationHistory, setDonationHistory] = useState([]);
  const [rewards] = useState({ points: 1250, badges: ["Hero", "Lifesaver"] });
  const [bloodBanks] = useState([
    { _id: "1", name: "City Blood Center", location: "Downtown" },
    { _id: "2", name: "Red Cross Hospital", location: "West Side" },
  ]);
  const [scheduleData, setScheduleData] = useState({
    bloodBankId: "",
    date: "",
    time: "",
  });
  const [particles] = useState(
    Array.from({ length: 15 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 3,
      duration: 6 + Math.random() * 4,
      size: 10 + Math.random() * 6,
    }))
  );
  const [expandedArticle, setExpandedArticle] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [toast] = useState({ type: "", msg: "" });

  // Mock data
  useEffect(() => {
    setUserData({
      firstName: "Alex",
      lastName: "Donor",
      email: "alex@bloodchain.com",
      donorInfo: { bloodGroup: "O+", donationCount: 8 },
    });
    setDonationHistory([
      {
        _id: "1",
        date: "2025-10-15",
        bloodType: "O+",
        status: "Confirmed",
        location: "City Blood Center",
        txHash: "0xabc123...",
      },
      {
        _id: "2",
        date: "2025-09-01",
        bloodType: "O+",
        status: "Scheduled",
        location: "Red Cross Hospital",
      },
    ]);
  }, []);

  const educationalContent = {
    title: "Master Blood Donation",
    articles: [
      {
        title: "Why Your Blood Matters",
        content: "One donation saves 3 lives. You're a hero...",
      },
      {
        title: "Eligibility Guide",
        content: "17+, 110lbs+, healthy. Easy as that...",
      },
      {
        title: "The 30-Min Process",
        content: "Register → Screen → Donate → Refresh...",
      },
      {
        title: "Perks of Donating",
        content: "Health check, points, badges, pride...",
      },
    ],
    bloodTypeData: {
      labels: ["O+", "A+", "B+", "AB+", "O-", "A-", "B-", "AB-"],
      datasets: [
        {
          label: "Global %",
          data: [38, 34, 9, 4, 7, 6, 2, 1],
          backgroundColor: "rgba(239, 68, 68, 0.7)",
          borderColor: "#ef4444",
          borderWidth: 2,
          borderRadius: 8,
          borderSkipped: false,
        },
      ],
    },
  };

  const renderDonationHistory = () => (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-white/90 to-red-50/50 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-red-100"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-gray-800 flex items-center">
          <Heart className="w-7 h-7 mr-3 text-red-600" />
          Donation Timeline
        </h3>
        <Sparkles className="w-6 h-6 text-yellow-500 animate-pulse" />
      </div>
      <div className="space-y-5">
        {donationHistory.map((d, i) => (
          <motion.div
            key={d._id}
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: i * 0.1 }}
            className="relative pl-10 pb-8 border-l-4 border-red-300"
          >
            <div className="absolute left-0 top-0 w-8 h-8 bg-red-500 rounded-full -translate-x-1/2 flex items-center justify-center">
              <Droplets className="w-5 h-5 text-white" />
            </div>
            <div className="bg-white rounded-xl p-5 shadow-lg hover:shadow-xl transition-all">
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
                <a
                  href={`${EXPLORER_URL}${d.txHash}`}
                  target="_blank"
                  className="mt-3 inline-flex items-center text-xs text-blue-600 hover:text-blue-800 font-medium"
                >
                  View on Blockchain <ExternalLink className="w-3 h-3 ml-1" />
                </a>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );

  const renderScheduleDonation = () => (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-gradient-to-br from-red-500/10 to-pink-500/10 backdrop-blur-2xl rounded-3xl p-8 shadow-2xl border border-red-200"
    >
      <div className="text-center mb-6">
        <h3 className="text-3xl font-bold text-gray-800 mb-2">
          Be a Hero Today
        </h3>
        <p className="text-gray-600">Schedule your next life-saving donation</p>
      </div>
      <ScheduleDonationForm
        scheduleData={scheduleData}
        setScheduleData={setScheduleData}
        bloodBanks={bloodBanks}
        isLoading={isLoading}
        onSubmit={() => {}}
      />
    </motion.div>
  );

  const renderDashboard = () => (
    <div className="p-6 space-y-8">
      {/* Hero Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="relative overflow-hidden"
        >
          <MetricCard
            label="Lives Saved"
            value={donationHistory.length * 3}
            icon={Heart}
            color="from-red-500 to-pink-600"
            gradient
            index={0}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl" />
        </motion.div>
        <motion.div whileHover={{ scale: 1.05 }}>
          <MetricCard
            label="Hero Points"
            value={rewards.points}
            icon={Gift}
            color="from-emerald-500 to-teal-600"
            gradient
            index={1}
          />
        </motion.div>
        <motion.div whileHover={{ scale: 1.05 }}>
          <MetricCard
            label="Badges"
            value={rewards.badges.length}
            icon={Award}
            color="from-purple-500 to-indigo-600"
            gradient
            index={2}
          />
        </motion.div>
      </div>

      {/* Quick Donate */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-gradient-to-r from-red-600 to-pink-600 rounded-2xl p-8 shadow-2xl"
      >
        <h3 className="text-2xl font-bold text-white mb-6 text-center">
          Quick Donate Now
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {["O+", "A+", "B+", "AB+"].map((bt, i) => (
            <motion.button
              key={bt}
              whileHover={{ scale: 1.1, rotate: [0, -5, 5, 0] }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {}}
              className="bg-white/20 backdrop-blur-md text-white font-bold py-6 rounded-2xl shadow-lg hover:bg-white/30 transition-all flex flex-col items-center space-y-2"
            >
              <Droplets className="w-10 h-10" />
              <span className="text-xl">{bt}</span>
            </motion.button>
          ))}
        </div>
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-8">
        {renderDonationHistory()}
        {renderScheduleDonation()}
      </div>
    </div>
  );

  const renderProfile = () => (
    <div className="p-8">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="max-w-4xl mx-auto"
      >
        <div className="bg-gradient-to-br from-white/95 to-red-50/70 backdrop-blur-2xl rounded-3xl shadow-2xl p-10 border border-red-100">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="relative">
              <Avatar className="h-32 w-32 ring-8 ring-red-100 shadow-2xl">
                <AvatarImage
                  src={`https://api.dicebear.com/7.x/initials/svg?seed=${userData?.firstName}+${userData?.lastName}`}
                />
                <AvatarFallback className="text-3xl font-bold bg-gradient-to-br from-red-500 to-pink-600 text-white">
                  {userData?.firstName?.[0]}
                  {userData?.lastName?.[0]}
                </AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-2 -right-2 bg-yellow-400 text-yellow-900 rounded-full p-2 shadow-lg">
                <Award className="w-6 h-6" />
                -magnetic
              </div>
            </div>
            <div className="text-center md:text-left flex-1">
              <h2 className="text-4xl font-bold text-gray-800 mb-2">
                {userData?.firstName} {userData?.lastName}
              </h2>
              <p className="text-lg text-gray-600 mb-4">{userData?.email}</p>
              <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                <div className="bg-red-100 text-red-700 px-4 py-2 rounded-full font-bold flex items-center">
                  <Droplets className="w-5 h-5 mr-2" />{" "}
                  {userData?.donorInfo?.bloodGroup}
                </div>
                <div className="bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full font-bold">
                  {userData?.donorInfo?.donationCount} Donations
                </div>
              </div>
            </div>
          </div>

          <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: Target, label: "Goal", value: "12/year" },
              { icon: Clock, label: "Last", value: "15 Oct" },
              { icon: Heart, label: "Streak", value: "3 months" },
              { icon: Sparkles, label: "Rank", value: "#42" },
            ].map((stat, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -5 }}
                className="bg-white/70 backdrop-blur rounded-2xl p-5 text-center shadow-lg"
              >
                <stat.icon className="w-8 h-8 mx-auto mb-2 text-red-600" />
                <p className="text-sm text-gray-600">{stat.label}</p>
                <p className="text-xl font-bold text-gray-800">{stat.value}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );

  const renderEducationTab = () => (
    <div className="p-8 space-y-8">
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-center mb-10"
      >
        <h2 className="text-5xl font-bold text-gray-800 mb-4">
          Blood Donation Academy
        </h2>
        <p className="text-xl text-gray-600">Learn. Donate. Save Lives.</p>
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-8">
        <motion.div
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="bg-gradient-to-br from-red-500/10 to-pink-500/10 backdrop-blur-xl rounded-3xl p-8 shadow-2xl"
        >
          <h3 className="text-2xl font-bold mb-6 text-gray-800">
            Global Impact
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

        <motion.div
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="space-y-6"
        >
          {educationalContent.articles.map((a, i) => (
            <motion.div
              key={i}
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
                {expandedArticle === i ? (
                  <ChevronUp className="w-6 h-6 text-red-600" />
                ) : (
                  <ChevronDown className="w-6 h-6 text-red-600" />
                )}
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
        </motion.div>
      </div>
    </div>
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
    switch (activeTab) {
      case "dashboard":
        return renderDashboard();
      case "profile":
        return renderProfile();
      case "education":
        return renderEducationTab();
      default:
        return renderDashboard();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-pink-50 to-rose-50 relative overflow-hidden">
      <div className="absolute inset-0 opacity-30">
        {particles.map((p) => (
          <BloodDroplet key={p.id} particle={p} />
        ))}
      </div>

      <style>{`
        @keyframes float { 0%, 100% { transform: translateY(0) rotate(0deg); } 50% { transform: translateY(-30px) rotate(5deg); } }
        @keyframes pulse-glow { 0%, 100% { box-shadow: 0 0 20px rgba(239, 68, 68, 0.3); } 50% { box-shadow: 0 0 40px rgba(239, 68, 68, 0.6); } }
        .glass { backdrop-filter: blur(16px); background: rgba(255, 255, 255, 0.8); }
        .float { animation: float 6s ease-in-out infinite; }
        .glow { animation: pulse-glow 3s ease-in-out infinite; }
      `}</style>

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
