import React, { useState, useEffect } from "react";
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
  FileText,
  Lock,
  Globe,
  Gift,
  BookOpen,
  AlertCircle,
  Calendar,
} from "lucide-react";

const BloodManagementSystem = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [userType, setUserType] = useState(localStorage.getItem("role") || "Donor");
  const [connectedWallet, setConnectedWallet] = useState(false);
  const [notifications, setNotifications] = useState(0);
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Data states
  const [bloodInventory, setBloodInventory] = useState([]);
  const [donors, setDonors] = useState([]);
  const [requests, setRequests] = useState([]);
  const [donationHistory, setDonationHistory] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [rewards, setRewards] = useState({ points: 0, badges: [] });
  const [bloodBanks, setBloodBanks] = useState([]);
  const [scheduleData, setScheduleData] = useState({ bloodBankId: "", date: "", time: "" });
  const [donationRecord, setDonationRecord] = useState({ donorId: "", bloodType: "", units: 1 });
  const [bloodRequest, setBloodRequest] = useState({ bloodBankId: "", bloodType: "", quantity: 1 });

  // Animation variants for messages
  const messageVariants = {
    initial: { opacity: 0, y: -20, x: 20 },
    animate: { opacity: 1, y: 0, x: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, y: -20, x: 20, transition: { duration: 0.3 } },
  };

  // Educational content
  const educationalContent = {
    title: "Why Donate Blood?",
    articles: [
      {
        title: "The Importance of Blood Donation",
        content: "One blood donation can save up to three lives. Blood is needed for surgeries, trauma care, and treating chronic illnesses like cancer.",
      },
      {
        title: "Who Can Donate?",
        content: "Healthy adults aged 17-65, weighing at least 110 lbs, and meeting medical criteria can donate blood every 56 days.",
      },
    ],
    facts: [
      "1 donation can save up to 3 lives.",
      "Blood cannot be manufactured; it must come from donors.",
      "Every 2 seconds, someone needs blood in the U.S.",
    ],
  };

  // Generate blood droplet particles
  const [particles, setParticles] = useState([]);
  useEffect(() => {
    const newParticles = Array.from({ length: 10 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 3,
      duration: 4 + Math.random() * 3,
      size: 8 + Math.random() * 4,
    }));
    setParticles(newParticles);
  }, []);

  // Auto-dismiss messages after 5 seconds
  useEffect(() => {
    if (success || error) {
      const timer = setTimeout(() => {
        setSuccess("");
        setError("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [success, error]);

  // Fetch user data and role-specific data on mount
  useEffect(() => {
    const fetchUserData = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Please log in to access the dashboard");

        const response = await fetch("http://localhost:5000/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Failed to fetch user data");

        setUserData(data.user);
        setUserType(data.user.role);

        // Fetch role-specific data
        if (data.user.role === "BloodBank") {
          await fetchBloodBankData(token);
        } else if (data.user.role === "Hospital") {
          await fetchHospitalData(token);
        } else if (data.user.role === "Donor") {
          await fetchDonorData(token);
        }

        // Fetch registered blood banks
        await fetchBloodBanks(token);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  // Fetch registered blood banks
  const fetchBloodBanks = async (token) => {
    try {
      const response = await fetch("http://localhost:5000/api/bloodbank/registered", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to fetch blood banks");
      setBloodBanks(data.bloodBanks || []);
    } catch (err) {
      setError(err.message);
    }
  };

  // Fetch blood bank data
  const fetchBloodBankData = async (token) => {
    try {
      const [donorsRes, inventoryRes, requestsRes] = await Promise.all([
        fetch("http://localhost:5000/api/bloodbank/donors", { headers: { Authorization: `Bearer ${token}` } }),
        fetch("http://localhost:5000/api/bloodbank/inventory", { headers: { Authorization: `Bearer ${token}` } }),
        fetch("http://localhost:5000/api/bloodbank/requests", { headers: { Authorization: `Bearer ${token}` } }),
      ]);

      const donorsData = await donorsRes.json();
      const inventoryData = await inventoryRes.json();
      const requestsData = await requestsRes.json();

      if (!donorsRes.ok || !inventoryRes.ok || !requestsRes.ok) {
        throw new Error("Failed to fetch blood bank data");
      }

      setDonors(donorsData.donors || []);
      setBloodInventory(inventoryData.inventory || []);
      setRequests(requestsData.requests || []);
    } catch (err) {
      setError(err.message);
    }
  };

  // Fetch hospital data
  const fetchHospitalData = async (token) => {
    try {
      const [requestsRes, inventoryRes, transactionsRes] = await Promise.all([
        fetch("http://localhost:5000/api/hospital/requests", { headers: { Authorization: `Bearer ${token}` } }),
        fetch("http://localhost:5000/api/hospital/inventory", { headers: { Authorization: `Bearer ${token}` } }),
        fetch("http://localhost:5000/api/hospital/transactions", { headers: { Authorization: `Bearer ${token}` } }),
      ]);

      const requestsData = await requestsRes.json();
      const inventoryData = await inventoryRes.json();
      const transactionsData = await transactionsRes.json();

      if (!requestsRes.ok || !inventoryRes.ok || !transactionsRes.ok) {
        throw new Error("Failed to fetch hospital data");
      }

      setRequests(requestsData.requests || []);
      setBloodInventory(inventoryData.inventory || []);
      setTransactions(transactionsData.transactions || []);
    } catch (err) {
      setError(err.message);
    }
  };

  // Fetch donor data
  const fetchDonorData = async (token) => {
    try {
      const [historyRes, rewardsRes] = await Promise.all([
        fetch("http://localhost:5000/api/donor/history", { headers: { Authorization: `Bearer ${token}` } }),
        fetch("http://localhost:5000/api/donor/rewards", { headers: { Authorization: `Bearer ${token}` } }),
      ]);

      const historyData = await historyRes.json();
      const rewardsData = await rewardsRes.json();

      if (!historyRes.ok || !rewardsRes.ok) {
        throw new Error("Failed to fetch donor data");
      }

      setDonationHistory(historyData.history || []);
      setRewards(rewardsData.rewards || { points: 0, badges: [] });
    } catch (err) {
      setError(err.message);
    }
  };

  // Connect wallet
  const connectWallet = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:5000/api/auth/connect-wallet", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          email: userData?.email,
          walletAddress: "0x742d35Cc6565C42c42...",
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to connect wallet");
      setConnectedWallet(true);
      setSuccess("Wallet connected successfully");
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Schedule donation (donor)
  const handleScheduleDonation = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:5000/api/donor/schedule", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(scheduleData),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to schedule donation");
      setSuccess("Donation scheduled successfully");
      setScheduleData({ bloodBankId: "", date: "", time: "" });
      setDonationHistory([...donationHistory, { ...scheduleData, status: "Scheduled" }]);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Record donation (blood bank)
  const handleRecordDonation = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:5000/api/bloodbank/record-donation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(donationRecord),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to record donation");
      setSuccess("Donation recorded successfully");
      setDonationRecord({ donorId: "", bloodType: "", units: 1 });
      // Issue reward automatically
      await issueReward(donationRecord.donorId, donationRecord.units * 10);
      setBloodInventory((prev) =>
        prev.map((item) =>
          item.type === donationRecord.bloodType
            ? { ...item, units: item.units + donationRecord.units }
            : item
        )
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Request blood from specific blood bank (hospital)
  const handleBloodRequest = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:5000/api/hospital/request-blood", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(bloodRequest),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to request blood");
      setSuccess("Blood request submitted successfully");
      setRequests([...requests, data.request]);
      setBloodRequest({ bloodBankId: "", bloodType: "", quantity: 1 });
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Issue reward
  const issueReward = async (recipientId, points) => {
    try {
      const response = await fetch("http://localhost:5000/api/rewards/issue", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ recipientId, points, badge: points >= 50 ? "Gold Donor" : "Silver Donor" }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to issue reward");
      setSuccess(`Reward of ${points} points issued`);
      setRewards((prev) => ({
        points: prev.points + points,
        badges: [...prev.badges, data.badge].filter(Boolean),
      }));
    } catch (err) {
      setError(err.message);
    }
  };

  const getDemandColor = (demand) => {
    switch (demand) {
      case "Critical":
        return "text-red-500 bg-red-50";
      case "High":
        return "text-orange-500 bg-orange-50";
      case "Medium":
        return "text-yellow-500 bg-yellow-50";
      case "Low":
        return "text-green-500 bg-green-50";
      default:
        return "text-gray-500 bg-gray-50";
    }
  };

  const BloodDroplet = ({ particle }) => (
    <svg
      className="absolute"
      style={{
        left: `${particle.x}%`,
        top: `${particle.y}%`,
        width: `${particle.size}px`,
        height: `${particle.size}px`,
        animation: `float ${particle.duration}s ease-in-out infinite ${particle.delay}s, pulse-size 2s ease-in-out infinite`,
      }}
      viewBox="0 0 24 24"
      fill="none"
    >
      <path
        d="M12 3C12 3 8 8 8 12C8 16 12 21 12 21C12 21 16 16 16 12C16 8 12 3 12 3Z"
        fill="#f87171"
        fillOpacity="0.5"
      />
    </svg>
  );

  const renderHeader = () => (
    <motion.header
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-gradient-to-r from-red-500 to-pink-400 text-white p-4 sticky top-0 z-10 shadow-md"
    >
      <div className="flex justify-between items-center max-w-7xl mx-auto">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-white/20 rounded-lg">
            <Heart className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-semibold">BloodChain</h1>
            <p className="text-red-100 text-sm">Blockchain Blood Management</p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-sm font-medium">{userType}</span>
          <div className="relative">
            <div className="p-2 bg-white/20 rounded-lg cursor-pointer">
              <Activity className="w-5 h-5" />
            </div>
            {notifications > 0 && (
              <div className="absolute -top-2 -right-2 bg-yellow-400 text-red-800 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                {notifications}
              </div>
            )}
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={connectWallet}
            disabled={isLoading}
            className={`px-3 py-1.5 rounded-lg font-medium text-sm transition-all ${
              connectedWallet ? "bg-green-500 text-white" : "bg-white text-red-500 hover:bg-red-50"
            }`}
          >
            {isLoading ? "Connecting..." : connectedWallet ? "✓ Connected" : "Connect Wallet"}
          </motion.button>
        </div>
      </div>
      <div className="flex space-x-1 bg-white/10 rounded-lg p-1 mt-4 max-w-7xl mx-auto">
        {["dashboard", "inventory", "transactions", "profile", "education"].map((tab) => (
          <motion.button
            key={tab}
            whileHover={{ scale: 1.05 }}
            onClick={() => setActiveTab(tab)}
            className={`px-3 py-2 rounded-md font-medium text-sm capitalize transition-all ${
              activeTab === tab ? "bg-white text-red-500" : "text-white hover:bg-white/20"
            }`}
          >
            {tab}
          </motion.button>
        ))}
      </div>
    </motion.header>
  );

  const renderBloodBankDashboard = () => (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: "Total Donors", value: donors.length, icon: Users, color: "border-red-500" },
          { label: "Blood Units", value: bloodInventory.reduce((sum, item) => sum + item.units, 0), icon: Droplets, color: "border-blue-500" },
          { label: "Pending Requests", value: requests.filter((r) => r.status === "Pending").length, icon: FileText, color: "border-green-500" },
          { label: "Rewards Issued", value: rewards.points, icon: Gift, color: "border-purple-500" },
        ].map((metric, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`bg-white/80 backdrop-blur-md rounded-xl shadow-lg p-6 border-l-4 ${metric.color}`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">{metric.label}</p>
                <p className="text-2xl font-semibold text-gray-800">{metric.value}</p>
              </div>
              <metric.icon className="w-8 h-8 text-gray-500" />
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/80 backdrop-blur-md rounded-xl shadow-lg p-6"
      >
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <Users className="w-5 h-5 mr-2 text-blue-500" />
          Donor Management
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-red-100">
                <th className="text-left py-3 px-4 text-gray-600">Name</th>
                <th className="text-left py-3 px-4 text-gray-600">Blood Type</th>
                <th className="text-left py-3 px-4 text-gray-600">Last Donation</th>
                <th className="text-left py-3 px-4 text-gray-600">Action</th>
              </tr>
            </thead>
            <tbody>
              {donors.map((donor, index) => (
                <tr key={index} className="border-b border-red-50 hover:bg-red-50/50">
                  <td className="py-3 px-4">{donor.firstName} {donor.lastName}</td>
                  <td className="py-3 px-4">{donor.donorInfo?.bloodGroup || "N/A"}</td>
                  <td className="py-3 px-4">{donor.donorInfo?.lastDonationDate || "N/A"}</td>
                  <td className="py-3 px-4">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => issueReward(donor._id, 10)}
                      className="text-blue-500 hover:text-blue-600 flex items-center text-sm"
                    >
                      Issue Reward <Gift className="w-4 h-4 ml-1" />
                    </motion.button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/80 backdrop-blur-md rounded-xl shadow-lg p-6"
      >
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <FileText className="w-5 h-5 mr-2 text-green-500" />
          Record Donation
        </h3>
        <form onSubmit={handleRecordDonation} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <select
              value={donationRecord.donorId}
              onChange={(e) => setDonationRecord({ ...donationRecord, donorId: e.target.value })}
              className="w-full bg-red-50 border border-red-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-400 outline-0"
              required
            >
              <option value="">Select Donor</option>
              {donors.map((donor) => (
                <option key={donor._id} value={donor._id}>
                  {donor.firstName} {donor.lastName}
                </option>
              ))}
            </select>
            <label className="absolute left-3 top-2 text-gray-500 transition-all duration-300">Donor</label>
          </div>
          <div className="relative">
            <select
              value={donationRecord.bloodType}
              onChange={(e) => setDonationRecord({ ...donationRecord, bloodType: e.target.value })}
              className="w-full bg-red-50 border border-red-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-400 outline-0"
              required
            >
              <option value="">Select Blood Type</option>
              {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
            <label className="absolute left-3 top-2 text-gray-500 transition-all duration-300">Blood Type</label>
          </div>
          <div className="relative">
            <input
              type="number"
              value={donationRecord.units}
              onChange={(e) => setDonationRecord({ ...donationRecord, units: parseInt(e.target.value) })}
              className="w-full bg-red-50 border border-red-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-400 outline-0"
              min="1"
              required
            />
            <label className="absolute left-3 top-2 text-gray-500 transition-all duration-300">Units</label>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={isLoading}
            className="col-span-3 bg-gradient-to-r from-red-500 to-pink-400 text-white py-2 rounded-lg font-medium flex items-center justify-center space-x-2"
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>Record Donation</span>
                <CheckCircle className="w-4 h-4" />
              </>
            )}
          </motion.button>
        </form>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/80 backdrop-blur-md rounded-xl shadow-lg p-6"
      >
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <FileText className="w-5 h-5 mr-2 text-green-500" />
          Blood Supply Requests
        </h3>
        <div className="space-y-3">
          {requests.map((request, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-red-50/50 rounded-lg">
              <div>
                <p className="font-medium text-gray-800">Hospital: {request.hospitalName}</p>
                <p className="text-sm text-gray-500">
                  Blood Type: {request.bloodType} • Quantity: {request.quantity}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-3 py-1 bg-green-500 text-white rounded-lg text-sm"
                >
                  Approve
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-3 py-1 bg-red-500 text-white rounded-lg text-sm"
                >
                  Reject
                </motion.button>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );

  const renderHospitalDashboard = () => (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: "Blood Requests", value: requests.length, icon: FileText, color: "border-red-500" },
          { label: "Blood Units Received", value: bloodInventory.reduce((sum, item) => sum + item.units, 0), icon: Droplets, color: "border-blue-500" },
          { label: "Rewards Issued", value: rewards.points, icon: Gift, color: "border-green-500" },
          { label: "Blockchain TXs", value: transactions.length, icon: Database, color: "border-purple-500" },
        ].map((metric, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`bg-white/80 backdrop-blur-md rounded-xl shadow-lg p-6 border-l-4 ${metric.color}`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">{metric.label}</p>
                <p className="text-2xl font-semibold text-gray-800">{metric.value}</p>
              </div>
              <metric.icon className="w-8 h-8 text-gray-500" />
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/80 backdrop-blur-md rounded-xl shadow-lg p-6"
      >
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <FileText className="w-5 h-5 mr-2 text-blue-500" />
          Request Blood
        </h3>
        <form onSubmit={handleBloodRequest} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <select
              value={bloodRequest.bloodBankId}
              onChange={(e) => setBloodRequest({ ...bloodRequest, bloodBankId: e.target.value })}
              className="w-full bg-red-50 border border-red-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-400 outline-0"
              required
            >
              <option value="">Select Blood Bank</option>
              {bloodBanks.map((bank) => (
                <option key={bank._id} value={bank._id}>{bank.name}</option>
              ))}
            </select>
            <label className="absolute left-3 top-2 text-gray-500 transition-all duration-300">Blood Bank</label>
          </div>
          <div className="relative">
            <select
              value={bloodRequest.bloodType}
              onChange={(e) => setBloodRequest({ ...bloodRequest, bloodType: e.target.value })}
              className="w-full bg-red-50 border border-red-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-400 outline-0"
              required
            >
              <option value="">Select Blood Type</option>
              {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
            <label className="absolute left-3 top-2 text-gray-500 transition-all duration-300">Blood Type</label>
          </div>
          <div className="relative">
            <input
              type="number"
              value={bloodRequest.quantity}
              onChange={(e) => setBloodRequest({ ...bloodRequest, quantity: parseInt(e.target.value) })}
              className="w-full bg-red-50 border border-red-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-400 outline-0"
              min="1"
              required
            />
            <label className="absolute left-3 top-2 text-gray-500 transition-all duration-300">Quantity (units)</label>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={isLoading}
            className="col-span-3 bg-gradient-to-r from-red-500 to-pink-400 text-white py-2 rounded-lg font-medium flex items-center justify-center space-x-2"
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>Submit Request</span>
                <ChevronRight className="w-4 h-4" />
              </>
            )}
          </motion.button>
        </form>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/80 backdrop-blur-md rounded-xl shadow-lg p-6"
      >
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <Droplets className="w-5 h-5 mr-2 text-red-500" />
          Blood Usage
        </h3>
        <div className="space-y-3">
          {transactions.map((tx, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-red-50/50 rounded-lg">
              <div>
                <p className="font-medium text-gray-800">Blood Type: {tx.bloodType}</p>
                <p className="text-sm text-gray-500">Used: {tx.timestamp}</p>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => issueReward(tx.donorId, 5)}
                className="text-blue-500 hover:text-blue-600 flex items-center text-sm"
              >
                Issue Reward <Gift className="w-4 h-4 ml-1" />
              </motion.button>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );

  const renderDonorDashboard = () => (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: "Total Donations", value: donationHistory.length, icon: Heart, color: "border-red-500" },
          { label: "Reward Points", value: rewards.points, icon: Gift, color: "border-green-500" },
          { label: "Badges Earned", value: rewards.badges.length, icon: Shield, color: "border-blue-500" },
        ].map((metric, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`bg-white/80 backdrop-blur-md rounded-xl shadow-lg p-6 border-l-4 ${metric.color}`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">{metric.label}</p>
                <p className="text-2xl font-semibold text-gray-800">{metric.value}</p>
              </div>
              <metric.icon className="w-8 h-8 text-gray-500" />
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/80 backdrop-blur-md rounded-xl shadow-lg p-6"
      >
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <Heart className="w-5 h-5 mr-2 text-red-500" />
          My Donation History
        </h3>
        <div className="space-y-4">
          {donationHistory.map((donation, index) => (
            <div key={index} className="border border-red-100 rounded-lg p-4 bg-red-50/50">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="font-medium text-gray-800">{donation.date}</p>
                  <p className="text-sm text-gray-500 flex items-center">
                    <MapPin className="w-4 h-4 mr-1" />
                    {donation.location || bloodBanks.find((b) => b._id === donation.bloodBankId)?.name || "N/A"}
                  </p>
                </div>
                <div className="text-right">
                  <div className="flex items-center mb-1">
                    <Droplets className="w-4 h-4 text-red-500 mr-1" />
                    <span className="font-medium">{donation.bloodType}</span>
                  </div>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      donation.status === "Used"
                        ? "bg-green-100 text-green-800"
                        : donation.status === "In Use"
                        ? "bg-yellow-100 text-yellow-800"
                        : donation.status === "Scheduled"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {donation.status}
                  </span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-500">
                  <strong>Impact:</strong> {donation.recipient || "Pending"}
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="text-blue-500 hover:text-blue-600 text-sm flex items-center"
                >
                  <Database className="w-4 h-4 mr-1" />
                  View on Blockchain
                </motion.button>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/80 backdrop-blur-md rounded-xl shadow-lg p-6"
      >
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <Calendar className="w-5 h-5 mr-2 text-red-500" />
          Schedule Donation
        </h3>
        <form onSubmit={handleScheduleDonation} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <select
              value={scheduleData.bloodBankId}
              onChange={(e) => setScheduleData({ ...scheduleData, bloodBankId: e.target.value })}
              className="w-full bg-red-50 border border-red-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-400 outline-0"
              required
            >
              <option value="">Select Blood Bank</option>
              {bloodBanks.map((bank) => (
                <option key={bank._id} value={bank._id}>{bank.name}</option>
              ))}
            </select>
            <label className="absolute left-3 top-2 text-gray-500 transition-all duration-300">Blood Bank</label>
          </div>
          <div className="relative">
            <input
              type="date"
              value={scheduleData.date}
              onChange={(e) => setScheduleData({ ...scheduleData, date: e.target.value })}
              className="w-full bg-red-50 border border-red-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-400 outline-0"
              required
            />
            <label className="absolute left-3 top-2 text-gray-500 transition-all duration-300">Date</label>
          </div>
          <div className="relative">
            <input
              type="time"
              value={scheduleData.time}
              onChange={(e) => setScheduleData({ ...scheduleData, time: e.target.value })}
              className="w-full bg-red-50 border border-red-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-400 outline-0"
              required
            />
            <label className="absolute left-3 top-2 text-gray-500 transition-all duration-300">Time</label>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={isLoading}
            className="col-span-3 bg-gradient-to-r from-red-500 to-pink-400 text-white py-2 rounded-lg font-medium flex items-center justify-center space-x-2"
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>Schedule Donation</span>
                <Calendar className="w-4 h-4" />
              </>
            )}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );

  const renderEducationTab = () => (
    <div className="p-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/80 backdrop-blur-md rounded-xl shadow-lg p-6"
      >
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <BookOpen className="w-5 h-5 mr-2 text-blue-500" />
          {educationalContent.title}
        </h3>
        <div className="space-y-4">
          {educationalContent.articles.map((article, index) => (
            <div key={index} className="border border-red-100 rounded-lg p-4 bg-red-50/50">
              <h4 className="font-medium text-gray-800">{article.title}</h4>
              <p className="text-sm text-gray-500 mt-2">{article.content}</p>
            </div>
          ))}
        </div>
        <div className="mt-6">
          <h4 className="font-medium text-gray-800 mb-2">Key Facts</h4>
          <ul className="list-disc pl-5 text-sm text-gray-500 space-y-1">
            {educationalContent.facts.map((fact, index) => (
              <li key={index}>{fact}</li>
            ))}
          </ul>
        </div>
      </motion.div>
    </div>
  );

  const renderInventory = () => (
    <div className="p-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/80 backdrop-blur-md rounded-xl shadow-lg p-6"
      >
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <Droplets className="w-5 h-5 mr-2 text-red-500" />
          Blood Inventory Status
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {bloodInventory.map((blood, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="border border-red-100 rounded-lg p-4 bg-red-50/50"
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h4 className="text-xl font-semibold text-gray-800">{blood.type}</h4>
                  <p className="text-2xl font-semibold text-red-500">{blood.units} units</p>
                </div>
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <Droplets className="w-5 h-5 text-red-500" />
                </div>
              </div>
              <div className="space-y-2">
                <div className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getDemandColor(blood.demand)}`}>
                  {blood.demand} Demand
                </div>
                <p className="text-sm text-gray-500 flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  Expires in {blood.expiry}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );

  const renderTransactions = () => (
    <div className="p-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/80 backdrop-blur-md rounded-xl shadow-lg p-6"
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold flex items-center">
            <Database className="w-5 h-5 mr-2 text-blue-500" />
            Blockchain Transactions
          </h3>
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span>Live on Ethereum</span>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-red-100">
                <th className="text-left py-3 px-4 text-gray-600">Transaction Hash</th>
                <th className="text-left py-3 px-4 text-gray-600">Type</th>
                <th className="text-left py-3 px-4 text-gray-600">Blood Type</th>
                <th className="text-left py-3 px-4 text-gray-600">Timestamp</th>
                <th className="text-left py-3 px-4 text-gray-600">Status</th>
                <th className="text-left py-3 px-4 text-gray-600">Action</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx, index) => (
                <tr key={index} className="border-b border-red-50 hover:bg-red-50/50">
                  <td className="py-3 px-4">
                    <code className="text-sm bg-red-100 px-2 py-1 rounded">{tx.id}</code>
                  </td>
                  <td className="py-3 px-4">{tx.type}</td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center">
                      <Droplets className="w-4 h-4 text-red-500 mr-1" />
                      {tx.bloodType}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-500">{tx.timestamp}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        tx.status === "Confirmed"
                          ? "bg-green-100 text-green-800"
                          : tx.status === "In Transit"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {tx.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="text-blue-500 hover:text-blue-600 flex items-center text-sm"
                    >
                      View <ChevronRight className="w-4 h-4 ml-1" />
                    </motion.button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );

  const renderProfile = () => (
    <div className="p-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/80 backdrop-blur-md rounded-xl shadow-lg p-6"
      >
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <Users className="w-5 h-5 mr-2 text-blue-500" />
          Profile
        </h3>
        <div className="space-y-3">
          <p className="text-gray-500">
            <strong>Name:</strong> {userData?.firstName} {userData?.lastName}
          </p>
          <p className="text-gray-500">
            <strong>Email:</strong> {userData?.email}
          </p>
          <p className="text-gray-500">
            <strong>Role:</strong> {userData?.role}
          </p>
          {userData?.role === "Donor" && (
            <>
              <p className="text-gray-500">
                <strong>Blood Group:</strong> {userData?.donorInfo?.bloodGroup}
              </p>
              <p className="text-gray-500">
                <strong>Donation Count:</strong> {userData?.donorInfo?.donationCount}
              </p>
            </>
          )}
          {userData?.role === "Hospital" && (
            <>
              <p className="text-gray-500">
                <strong>Hospital Name:</strong> {userData?.hospitalInfo?.name}
              </p>
              <p className="text-gray-500">
                <strong>Location:</strong> {userData?.hospitalInfo?.location}
              </p>
            </>
          )}
          {userData?.role === "BloodBank" && (
            <>
              <p className="text-gray-500">
                <strong>Blood Bank Name:</strong> {userData?.bloodBankInfo?.name}
              </p>
              <p className="text-gray-500">
                <strong>Location:</strong> {userData?.bloodBankInfo?.location}
              </p>
            </>
          )}
        </div>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/80 backdrop-blur-md rounded-xl shadow-lg p-6"
      >
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <Lock className="w-5 h-5 mr-2 text-green-500" />
          Privacy & Security
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            {[
              "Personal Data Encrypted",
              "IPFS Document Storage",
              "Blockchain Verified",
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-green-50/50 rounded-lg">
                <span className="text-sm font-medium text-gray-500">{item}</span>
                <CheckCircle className="w-5 h-5 text-green-500" />
              </div>
            ))}
          </div>
          <div className="bg-blue-50/50 p-4 rounded-lg">
            <h4 className="font-medium text-blue-800 mb-2">Data Protection</h4>
            <p className="text-sm text-blue-600">
              Your personal information is encrypted and stored off-chain in MongoDB, while only verification hashes and metadata are stored on the Ethereum blockchain.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="p-6 text-center text-gray-500">
          <div className="w-6 h-6 border-2 border-red-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          Loading...
        </div>
      );
    }
    if (error) {
      return (
        <div className="p-6">
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-500 flex items-center">
              <AlertCircle className="w-4 h-4 mr-2" />
              {error}
            </p>
          </div>
        </div>
      );
    }
    switch (activeTab) {
      case "dashboard":
        return userType === "BloodBank"
          ? renderBloodBankDashboard()
          : userType === "Hospital"
          ? renderHospitalDashboard()
          : renderDonorDashboard();
      case "inventory":
        return renderInventory();
      case "transactions":
        return renderTransactions();
      case "profile":
        return renderProfile();
      case "education":
        return renderEducationTab();
      default:
        return renderDonorDashboard();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50 font-inter">
      <div className="absolute inset-0">
        <style>
          {`
            @keyframes float {
              0%, 100% { transform: translateY(0px) scale(1); opacity: 0.3; }
              50% { transform: translateY(-60px) scale(1.1); opacity: 0.6; }
            }
            @keyframes pulse-size {
              0%, 100% { transform: scale(1); }
              50% { transform: scale(1.2); }
            }
            @keyframes pulse-glow {
              0%, 100% { box-shadow: 0 0 10px rgba(239, 68, 68, 0.3); }
              50% { box-shadow: 0 0 20px rgba(239, 68, 68, 0.5); }
            }
            @keyframes fade-in {
              from { opacity: 0; transform: translateY(20px); }
              to { opacity: 1; transform: translateY(0); }
            }
            @keyframes message-slide {
              from { opacity: 0; transform: translateY(-20px) translateX(20px); }
              to { opacity: 1; transform: translateY(0) translateX(0); }
            }
            .animate-fade-in { animation: fade-in 0.8s ease-out forwards; }
            .animate-pulse-glow { animation: pulse-glow 2s ease-in-out infinite; }
            .animate-message { animation: message-slide 0.3s ease-out forwards; }
            .parallax-bg {
              background-attachment: fixed;
              background-position: center;
              background-repeat: no-repeat;
              background-size: cover;
              background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' fill='none'%3E%3Cpath d='M50 10C50 10 40 20 40 30C40 40 50 50 50 50C50 50 60 40 60 30C60 20 50 10 50 10Z' fill='%23f87171' fill-opacity='0.05'/%3E%3C/svg%3E");
            }
            @media (max-width: 768px) { .parallax-bg { background-attachment: scroll; } }
            .floating-label {
              top: 50%;
              transform: translateY(-50%);
              transition: all 0.3s ease;
              pointer-events: none;
            }
            input:focus ~ .floating-label,
            input:not(:placeholder-shown) ~ .floating-label,
            select:focus ~ .floating-label,
            select:not([value=""]) ~ .floating-label {
              top: -8px;
              transform: translateY(0);
              font-size: 0.75rem;
              color: #f87171;
              background: linear-gradient(to bottom, #ffffff, #fef2f2);
              padding: 0 4px;
            }
          `}
        </style>
        {particles.map((particle) => (
          <BloodDroplet key={particle.id} particle={particle} />
        ))}
      </div>

      <div className="fixed top-4 right-4 z-50 max-w-xs">
        <AnimatePresence>
          {error && (
            <motion.div
              key="error-message"
              variants={messageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="p-3 bg-red-50 border border-red-200 rounded-lg animate-message mb-2"
            >
              <p className="text-sm text-red-500 flex items-center">
                <AlertCircle className="w-4 h-4 mr-2" />
                {error}
              </p>
            </motion.div>
          )}
          {success && (
            <motion.div
              key="success-message"
              variants={messageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="p-3 bg-green-50 border border-green-200 rounded-lg animate-message"
            >
              <p className="text-sm text-green-600 flex items-center">
                <CheckCircle className="w-4 h-4 mr-2" />
                {success}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {renderHeader()}
      <div className="max-w-7xl mx-auto">{renderContent()}</div>
    </div>
  );
};

export default BloodManagementSystem;