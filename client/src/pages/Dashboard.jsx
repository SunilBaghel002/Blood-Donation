import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Heart,
  Shield,
  Users,
  Building2,
  Activity,
  Gift,
  ChevronRight,
  CheckCircle,
  Clock,
  MapPin,
  Droplets,
  Database,
  FileText,
  Lock,
  BookOpen,
  AlertCircle,
  Calendar,
  ChevronDown,
  ChevronUp,
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
import Navbar from "../components/Navbar";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const BloodManagementSystem = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [userType, setUserType] = useState(
    localStorage.getItem("role") || "Donor"
  );
  const [connectedWallet, setConnectedWallet] = useState(false);
  const [notifications, setNotifications] = useState(0);
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [expandedArticle, setExpandedArticle] = useState(null);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(null);
  // Data states
  const [bloodInventory, setBloodInventory] = useState([]);
  const [donors, setDonors] = useState([]);
  const [requests, setRequests] = useState([]);
  const [donationHistory, setDonationHistory] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [rewards, setRewards] = useState({ points: 0, badges: [] });
  const [bloodBanks, setBloodBanks] = useState([]);
  const [scheduleData, setScheduleData] = useState({
    bloodBankId: "",
    date: "",
    time: "",
  });
  const [donationRecord, setDonationRecord] = useState({
    donorId: "",
    bloodType: "",
    units: 1,
  });
  const [bloodRequest, setBloodRequest] = useState({
    bloodBankId: "",
    bloodType: "",
    quantity: 1,
  });
  // Animation variants for messages
  const messageVariants = {
    initial: { opacity: 0, y: -20, x: 20 },
    animate: { opacity: 1, y: 0, x: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, y: -20, x: 20, transition: { duration: 0.3 } },
  };
  // Educational content
  const educationalContent = {
    title: "Learn About Blood Donation",
    articles: [
      {
        title: "The Importance of Blood Donation",
        content:
          "Blood donation is a critical act that can save up to three lives per donation. It is essential for surgeries, trauma care, cancer treatment, and managing chronic illnesses. Donated blood is used in emergencies, such as car accidents, and for patients with conditions like sickle cell anemia or leukemia, ensuring a steady supply is vital for healthcare systems worldwide.",
      },
      {
        title: "Who Can Donate?",
        content:
          "Healthy adults aged 17-65, weighing at least 110 lbs (50 kg), and meeting specific medical criteria can donate blood every 56 days. Donors must have no recent tattoos, piercings, or certain medical conditions like anemia or infectious diseases. Always consult with a healthcare professional to confirm eligibility.",
      },
      {
        title: "The Donation Process",
        content:
          "The blood donation process is simple and safe, taking about 30-45 minutes. It includes registration, a health screening, the donation itself (about 8-10 minutes), and a brief recovery period with refreshments. Your blood is then tested, processed, and distributed to hospitals as needed.",
      },
      {
        title: "Benefits of Donating",
        content:
          "Donating blood not only saves lives but also benefits the donor. It can help detect health issues early through the screening process, reduce iron levels in the body, and foster a sense of community contribution. Regular donors may also receive rewards like NFTs on BloodChain.",
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
          backgroundColor: "rgba(239, 68, 68, 0.6)",
          borderColor: "rgba(239, 68, 68, 1)",
          borderWidth: 1,
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
        if (!response.ok)
          throw new Error(data.error || "Failed to fetch user data");
        setUserData(data.user);
        setUserType(data.user.role);
        localStorage.setItem("role", data.user.role);
        if (data.user.role === "BloodBank") {
          await fetchBloodBankData(token);
        } else if (data.user.role === "Hospital") {
          await fetchHospitalData(token);
        } else if (data.user.role === "Donor") {
          await fetchDonorData(token);
        }
        await fetchBloodBanks(token);
      } catch (err) {
        setError(err.message || "Unable to fetch user data. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchUserData();
  }, []);
  // Fetch registered blood banks
  const fetchBloodBanks = async (token) => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/bloodbank/registered",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await response.json();
      if (!response.ok)
        throw new Error(data.error || "Failed to fetch blood banks");
      setBloodBanks(
        data.bloodBanks.map((bank) => ({
          _id: bank._id,
          name: bank.bloodBankInfo.name,
          location: bank.bloodBankInfo.location,
          contactNumber: bank.bloodBankInfo.contactNumber,
        }))
      );
    } catch (err) {
      setError(err.message || "Unable to fetch blood banks. Please try again.");
    }
  };
  // Fetch blood bank data
  const fetchBloodBankData = async (token) => {
    try {
      const [donorsRes, inventoryRes, requestsRes] = await Promise.all([
        fetch("http://localhost:5000/api/bloodbank/donors", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch("http://localhost:5000/api/bloodbank/inventory", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch("http://localhost:5000/api/bloodbank/requests", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);
      const donorsData = await donorsRes.json();
      const inventoryData = await inventoryRes.json();
      const requestsData = await requestsRes.json();
      if (!donorsRes.ok)
        throw new Error(donorsData.error || "Failed to fetch donors");
      if (!inventoryRes.ok)
        throw new Error(inventoryData.error || "Failed to fetch inventory");
      if (!requestsRes.ok)
        throw new Error(requestsData.error || "Failed to fetch requests");
      setDonors(donorsData.donors || []);
      setBloodInventory(
        inventoryData.inventory.map((item) => ({
          _id: item._id,
          bloodType: item.bloodType,
          units: item.units,
          expiryDate: new Date(item.expiryDate).toLocaleDateString(),
          demand: item.demand,
        })) || []
      );
      setRequests(
        requestsData.requests.map((req) => ({
          _id: req._id,
          hospitalName: req.hospitalId?.hospitalInfo?.name || "Unknown",
          bloodType: req.bloodType,
          quantity: req.quantity,
          status: req.status,
          createdAt: new Date(req.createdAt).toLocaleDateString(),
        })) || []
      );
    } catch (err) {
      setError(
        err.message || "Unable to fetch blood bank data. Please try again."
      );
    }
  };
  // Fetch hospital data
  const fetchHospitalData = async (token) => {
    try {
      const [requestsRes, transactionsRes] = await Promise.all([
        fetch("http://localhost:5000/api/hospital/requests", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch("http://localhost:5000/api/hospital/transactions", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);
      const requestsData = await requestsRes.json();
      const transactionsData = await transactionsRes.json();
      if (!requestsRes.ok)
        throw new Error(requestsData.error || "Failed to fetch requests");
      if (!transactionsRes.ok)
        throw new Error(
          transactionsData.error || "Failed to fetch transactions"
        );
      setRequests(
        requestsData.requests.map((req) => ({
          _id: req._id,
          bloodBankName: req.bloodBankId?.bloodBankInfo?.name || "Unknown",
          bloodType: req.bloodType,
          quantity: req.quantity,
          status: req.status,
          createdAt: new Date(req.createdAt).toLocaleDateString(),
        })) || []
      );
      setTransactions(
        transactionsData.transactions.map((tx) => ({
          _id: tx._id,
          txHash: tx.txHash,
          type: tx.type,
          bloodType: tx.bloodType,
          quantity: tx.quantity,
          status: tx.status,
          timestamp: new Date(tx.timestamp).toLocaleString(),
        })) || []
      );
      setBloodInventory([]);
    } catch (err) {
      setError(
        err.message || "Unable to fetch hospital data. Please try again."
      );
    }
  };
  // Fetch donor data
  const fetchDonorData = async (token) => {
    try {
      const [historyRes, rewardsRes] = await Promise.all([
        fetch("http://localhost:5000/api/donor/history", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch("http://localhost:5000/api/donor/rewards", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);
      const historyData = await historyRes.json();
      const rewardsData = await rewardsRes.json();
      if (!historyRes.ok)
        throw new Error(
          historyData.error || "Failed to fetch donation history"
        );
      if (!rewardsRes.ok)
        throw new Error(rewardsData.error || "Failed to fetch rewards");
      setDonationHistory(
        historyData.history.map((tx) => ({
          _id: tx._id,
          bloodBankId: tx.bloodBankId,
          date: new Date(tx.timestamp).toLocaleDateString(),
          bloodType: tx.bloodType,
          status: tx.status,
          quantity: tx.quantity,
          location:
            bloodBanks.find((b) => b._id === tx.bloodBankId)?.name || "Unknown",
          recipient: tx.hospitalId?.hospitalInfo?.name || "Pending",
        })) || []
      );
      setRewards(rewardsData.rewards || { points: 0, badges: [] });
    } catch (err) {
      setError(err.message || "Unable to fetch donor data. Please try again.");
    }
  };
  // Connect wallet
  const connectWallet = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/connect-wallet",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            email: userData?.email,
            walletAddress: "0x742d35Cc6565C42c42...",
          }),
        }
      );
      const data = await response.json();
      if (!response.ok)
        throw new Error(data.error || "Failed to connect wallet");
      setConnectedWallet(true);
      setSuccess("Wallet connected successfully");
    } catch (err) {
      setError(err.message || "Unable to connect wallet. Please try again.");
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
      if (!response.ok)
        throw new Error(data.error || "Failed to schedule donation");
      setSuccess("Donation scheduled successfully");
      setDonationHistory([
        ...donationHistory,
        {
          _id: data.transaction._id,
          bloodBankId: data.transaction.bloodBankId,
          date: new Date(data.transaction.timestamp).toLocaleDateString(),
          bloodType: data.transaction.bloodType,
          status: data.transaction.status,
          quantity: data.transaction.quantity,
          location:
            bloodBanks.find((b) => b._id === data.transaction.bloodBankId)
              ?.name || "Unknown",
          recipient: "Pending",
        },
      ]);
      setScheduleData({ bloodBankId: "", date: "", time: "" });
    } catch (err) {
      setError(err.message || "Unable to schedule donation. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  // Record donation (blood bank)
  const handleRecordDonation = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch(
        "http://localhost:5000/api/bloodbank/record-donation",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(donationRecord),
        }
      );
      const data = await response.json();
      if (!response.ok)
        throw new Error(data.error || "Failed to record donation");
      setSuccess("Donation recorded successfully");
      setDonationRecord({ donorId: "", bloodType: "", units: 1 });
      setBloodInventory((prev) => {
        const existing = prev.find(
          (item) => item.bloodType === donationRecord.bloodType
        );
        if (existing) {
          return prev.map((item) =>
            item.bloodType === donationRecord.bloodType
              ? {
                  ...item,
                  units: item.units + donationRecord.units,
                  demand:
                    item.units + donationRecord.units < 10
                      ? "Critical"
                      : item.units + donationRecord.units < 20
                      ? "High"
                      : item.units + donationRecord.units < 50
                      ? "Medium"
                      : "Low",
                }
              : item
          );
        }
        return [
          ...prev,
          {
            bloodType: donationRecord.bloodType,
            units: donationRecord.units,
            expiryDate: new Date(
              Date.now() + 42 * 24 * 60 * 60 * 1000
            ).toLocaleDateString(),
            demand:
              donationRecord.units < 10
                ? "Critical"
                : donationRecord.units < 20
                ? "High"
                : donationRecord.units < 50
                ? "Medium"
                : "Low",
          },
        ];
      });
    } catch (err) {
      setError(err.message || "Unable to record donation. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  // Request blood from specific blood bank (hospital)
  const handleBloodRequest = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch(
        "http://localhost:5000/api/hospital/request-blood",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(bloodRequest),
        }
      );
      const data = await response.json();
      if (!response.ok)
        throw new Error(data.error || "Failed to request blood");
      setSuccess("Blood request submitted successfully");
      setRequests([
        ...requests,
        {
          _id: data.request._id,
          bloodBankName:
            bloodBanks.find((b) => b._id === data.request.bloodBankId)?.name ||
            "Unknown",
          bloodType: data.request.bloodType,
          quantity: data.request.quantity,
          status: data.request.status,
          createdAt: new Date(data.request.createdAt).toLocaleDateString(),
        },
      ]);
      setBloodRequest({ bloodBankId: "", bloodType: "", quantity: 1 });
    } catch (err) {
      setError(err.message || "Unable to request blood. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  // Approve/Reject request (blood bank)
  const handleRequestAction = async (requestId, action) => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `http://localhost:5000/api/bloodbank/request-action`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ requestId, action }),
        }
      );
      const data = await response.json();
      if (!response.ok)
        throw new Error(data.error || `Failed to ${action} request`);
      setSuccess(`Request ${action} successfully`);
      setRequests((prev) =>
        prev.map((req) =>
          req._id === requestId ? { ...req, status: action } : req
        )
      );
    } catch (err) {
      setError(err.message || `Unable to ${action} request. Please try again.`);
    } finally {
      setIsLoading(false);
    }
  };
  // Handle quiz submission
  const handleQuizSubmit = (e) => {
    e.preventDefault();
    let score = 0;
    educationalContent.quiz.forEach((q, index) => {
      if (quizAnswers[index] === q.correctAnswer) score++;
    });
    setQuizScore(score);
    setQuizSubmitted(true);
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
  const renderBloodBankDashboard = () => (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          {
            label: "Total Donors",
            value: donors.length,
            icon: Users,
            color: "border-red-500",
          },
          {
            label: "Blood Units",
            value: bloodInventory.reduce((sum, item) => sum + item.units, 0),
            icon: Droplets,
            color: "border-blue-500",
          },
          {
            label: "Pending Requests",
            value: requests.filter((r) => r.status === "Pending").length,
            icon: FileText,
            color: "border-green-500",
          },
          {
            label: "Rewards Issued",
            value: rewards.points,
            icon: Gift,
            color: "border-purple-500",
          },
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
                <p className="text-2xl font-semibold text-gray-800">
                  {metric.value}
                </p>
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
                <th className="text-left py-3 px-4 text-gray-600">
                  Blood Type
                </th>
                <th className="text-left py-3 px-4 text-gray-600">
                  Last Donation
                </th>
              </tr>
            </thead>
            <tbody>
              {donors.map((donor, index) => (
                <tr
                  key={index}
                  className="border-b border-red-50 hover:bg-red-50/50"
                >
                  <td className="py-3 px-4">
                    {donor.firstName} {donor.lastName}
                  </td>
                  <td className="py-3 px-4">
                    {donor.donorInfo?.bloodGroup || "N/A"}
                  </td>
                  <td className="py-3 px-4">
                    {donor.donorInfo?.lastDonationDate
                      ? new Date(
                          donor.donorInfo.lastDonationDate
                        ).toLocaleDateString()
                      : "N/A"}
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
        <form
          onSubmit={handleRecordDonation}
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          <div className="relative">
            <label
              htmlFor="donorId"
              className="absolute -top-2 left-3 text-sm text-gray-500 bg-white px-1 transition-all duration-300"
            >
              Donor
            </label>
            <select
              id="donorId"
              value={donationRecord.donorId}
              onChange={(e) =>
                setDonationRecord({
                  ...donationRecord,
                  donorId: e.target.value,
                })
              }
              className="w-full bg-red-50 border border-red-200 rounded-lg px-3 py-3 focus:ring-2 focus:ring-red-400 outline-none"
              required
            >
              <option value="">Select Donor</option>
              {donors.map((donor) => (
                <option key={donor._id} value={donor._id}>
                  {donor.firstName} {donor.lastName}
                </option>
              ))}
            </select>
          </div>
          <div className="relative">
            <label
              htmlFor="bloodType"
              className="absolute -top-2 left-3 text-sm text-gray-500 bg-white px-1 transition-all duration-300"
            >
              Blood Type
            </label>
            <select
              id="bloodType"
              value={donationRecord.bloodType}
              onChange={(e) =>
                setDonationRecord({
                  ...donationRecord,
                  bloodType: e.target.value,
                })
              }
              className="w-full bg-red-50 border border-red-200 rounded-lg px-3 py-3 focus:ring-2 focus:ring-red-400 outline-none"
              required
            >
              <option value="">Select Blood Type</option>
              {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(
                (type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                )
              )}
            </select>
          </div>
          <div className="relative">
            <label
              htmlFor="units"
              className="absolute -top-2 left-3 text-sm text-gray-500 bg-white px-1 transition-all duration-300"
            >
              Units
            </label>
            <input
              id="units"
              type="number"
              value={donationRecord.units}
              onChange={(e) =>
                setDonationRecord({
                  ...donationRecord,
                  units: parseInt(e.target.value) || 1,
                })
              }
              className="w-full bg-red-50 border border-red-200 rounded-lg px-3 py-3 focus:ring-2 focus:ring-red-400 outline-none"
              min="1"
              required
            />
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
          {requests.map((request) => (
            <div
              key={request._id}
              className="flex items-center justify-between p-3 bg-red-50/50 rounded-lg"
            >
              <div>
                <p className="font-medium text-gray-800">
                  Hospital: {request.hospitalName}
                </p>
                <p className="text-sm text-gray-500">
                  Blood Type: {request.bloodType} • Quantity: {request.quantity}{" "}
                  • Status: {request.status}
                </p>
              </div>
              {request.status === "Pending" && (
                <div className="flex items-center space-x-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleRequestAction(request._id, "Approved")}
                    className="px-3 py-1 bg-green-500 text-white rounded-lg text-sm"
                  >
                    Approve
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleRequestAction(request._id, "Rejected")}
                    className="px-3 py-1 bg-red-500 text-white rounded-lg text-sm"
                  >
                    Reject
                  </motion.button>
                </div>
              )}
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
  const renderHospitalDashboard = () => (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          {
            label: "Blood Requests",
            value: requests.length,
            icon: FileText,
            color: "border-red-500",
          },
          {
            label: "Blockchain TXs",
            value: transactions.length,
            icon: Database,
            color: "border-purple-500",
          },
          {
            label: "Rewards Issued",
            value: rewards.points,
            icon: Gift,
            color: "border-green-500",
          },
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
                <p className="text-2xl font-semibold text-gray-800">
                  {metric.value}
                </p>
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
        <form
          onSubmit={handleBloodRequest}
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          <div className="relative">
            <label
              htmlFor="bloodBankId"
              className="absolute -top-2 left-3 text-sm text-gray-500 bg-white px-1 transition-all duration-300"
            >
              Blood Bank
            </label>
            <select
              id="bloodBankId"
              value={bloodRequest.bloodBankId}
              onChange={(e) =>
                setBloodRequest({
                  ...bloodRequest,
                  bloodBankId: e.target.value,
                })
              }
              className="w-full bg-red-50 border border-red-200 rounded-lg px-3 py-3 focus:ring-2 focus:ring-red-400 outline-none"
              required
            >
              <option value="">Select Blood Bank</option>
              {bloodBanks.map((bank) => (
                <option key={bank._id} value={bank._id}>
                  {bank.name}
                </option>
              ))}
            </select>
          </div>
          <div className="relative">
            <label
              htmlFor="requestBloodType"
              className="absolute -top-2 left-3 text-sm text-gray-500 bg-white px-1 transition-all duration-300"
            >
              Blood Type
            </label>
            <select
              id="requestBloodType"
              value={bloodRequest.bloodType}
              onChange={(e) =>
                setBloodRequest({ ...bloodRequest, bloodType: e.target.value })
              }
              className="w-full bg-red-50 border border-red-200 rounded-lg px-3 py-3 focus:ring-2 focus:ring-red-400 outline-none"
              required
            >
              <option value="">Select Blood Type</option>
              {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(
                (type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                )
              )}
            </select>
          </div>
          <div className="relative">
            <label
              htmlFor="quantity"
              className="absolute -top-2 left-3 text-sm text-gray-500 bg-white px-1 transition-all duration-300"
            >
              Quantity (units)
            </label>
            <input
              id="quantity"
              type="number"
              value={bloodRequest.quantity}
              onChange={(e) =>
                setBloodRequest({
                  ...bloodRequest,
                  quantity: parseInt(e.target.value) || 1,
                })
              }
              className="w-full bg-red-50 border border-red-200 rounded-lg px-3 py-3 focus:ring-2 focus:ring-red-400 outline-none"
              min="1"
              required
            />
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
          <FileText className="w-5 h-5 mr-2 text-green-500" />
          My Requests
        </h3>
        <div className="space-y-3">
          {requests.map((request) => (
            <div
              key={request._id}
              className="flex items-center justify-between p-3 bg-red-50/50 rounded-lg"
            >
              <div>
                <p className="font-medium text-gray-800">
                  Blood Bank: {request.bloodBankName}
                </p>
                <p className="text-sm text-gray-500">
                  Blood Type: {request.bloodType} • Quantity: {request.quantity}{" "}
                  • Status: {request.status}
                </p>
              </div>
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
          {
            label: "Total Donations",
            value: donationHistory.length,
            icon: Heart,
            color: "border-red-500",
          },
          {
            label: "Reward Points",
            value: rewards.points,
            icon: Gift,
            color: "border-green-500",
          },
          {
            label: "Badges Earned",
            value: rewards.badges.length,
            icon: Shield,
            color: "border-blue-500",
          },
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
                <p className="text-2xl font-semibold text-gray-800">
                  {metric.value}
                </p>
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
          {donationHistory.map((donation) => (
            <div
              key={donation._id}
              className="border border-red-100 rounded-lg p-4 bg-red-50/50"
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="font-medium text-gray-800">{donation.date}</p>
                  <p className="text-sm text-gray-500 flex items-center">
                    <MapPin className="w-4 h-4 mr-1" />
                    {donation.location}
                  </p>
                </div>
                <div className="text-right">
                  <div className="flex items-center mb-1">
                    <Droplets className="w-4 h-4 text-red-500 mr-1" />
                    <span className="font-medium">{donation.bloodType}</span>
                  </div>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      donation.status === "Confirmed"
                        ? "bg-green-100 text-green-800"
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
                  <strong>Impact:</strong> {donation.recipient}
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
        <form
          onSubmit={handleScheduleDonation}
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          <div className="relative">
            <label
              htmlFor="scheduleBloodBankId"
              className="absolute -top-2 left-3 text-sm text-gray-500 bg-white px-1 transition-all duration-300"
            >
              Blood Bank
            </label>
            <select
              id="scheduleBloodBankId"
              value={scheduleData.bloodBankId}
              onChange={(e) =>
                setScheduleData({
                  ...scheduleData,
                  bloodBankId: e.target.value,
                })
              }
              className="w-full bg-red-50 border border-red-200 rounded-lg px-3 py-3 focus:ring-2 focus:ring-red-400 outline-none"
              required
            >
              <option value="">Select Blood Bank</option>
              {bloodBanks.map((bank) => (
                <option key={bank._id} value={bank._id}>
                  {bank.name}
                </option>
              ))}
            </select>
          </div>
          <div className="relative">
            <label
              htmlFor="scheduleDate"
              className="absolute -top-2 left-3 text-sm text-gray-500 bg-white px-1 transition-all duration-300"
            >
              Date
            </label>
            <input
              id="scheduleDate"
              type="date"
              value={scheduleData.date}
              onChange={(e) =>
                setScheduleData({ ...scheduleData, date: e.target.value })
              }
              className="w-full bg-red-50 border border-red-200 rounded-lg px-3 py-3 focus:ring-2 focus:ring-red-400 outline-none"
              required
            />
          </div>
          <div className="relative">
            <label
              htmlFor="scheduleTime"
              className="absolute -top-2 left-3 text-sm text-gray-500 bg-white px-1 transition-all duration-300"
            >
              Time
            </label>
            <input
              id="scheduleTime"
              type="time"
              value={scheduleData.time}
              onChange={(e) =>
                setScheduleData({ ...scheduleData, time: e.target.value })
              }
              className="w-full bg-red-50 border border-red-200 rounded-lg px-3 py-3 focus:ring-2 focus:ring-red-400 outline-none"
              required
            />
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
        transition={{ duration: 0.8 }}
        className="bg-white/80 backdrop-blur-md rounded-xl shadow-lg p-6"
      >
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <BookOpen className="w-5 h-5 mr-2 text-blue-500" />
          {educationalContent.title}
        </h3>
        {/* Blood Donation Distribution Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-red-50 rounded-lg p-6 mb-6"
        >
          <h4 className="text-md font-medium text-gray-800 mb-4">
            Global Blood Donation by Type
          </h4>
          <div className="h-64">
            <Bar
              data={educationalContent.bloodTypeData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { display: true, position: "top" },
                  tooltip: {
                    backgroundColor: "#f87171",
                    titleColor: "#fff",
                    bodyColor: "#fff",
                  },
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    title: { display: true, text: "Percentage (%)" },
                  },
                  x: { title: { display: true, text: "Blood Type" } },
                },
              }}
            />
          </div>
        </motion.div>
        {/* Articles with Accordion */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="space-y-4"
        >
          {educationalContent.articles.map((article, index) => (
            <motion.div
              key={index}
              className="border border-red-100 rounded-lg bg-red-50/50"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <button
                className="w-full text-left p-4 flex justify-between items-center"
                onClick={() =>
                  setExpandedArticle(expandedArticle === index ? null : index)
                }
                aria-expanded={expandedArticle === index}
                aria-controls={`article-${index}`}
              >
                <h4 className="font-medium text-gray-800">{article.title}</h4>
                {expandedArticle === index ? (
                  <ChevronUp className="w-5 h-5 text-red-500" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-red-500" />
                )}
              </button>
              <AnimatePresence>
                {expandedArticle === index && (
                  <motion.div
                    id={`article-${index}`}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="px-4 pb-4 text-sm text-gray-600"
                  >
                    {article.content}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </motion.div>
        {/* Blood Type Compatibility Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-6 bg-white rounded-lg shadow-md p-6"
        >
          <h4 className="text-md font-medium text-gray-800 mb-4">
            Blood Type Compatibility
          </h4>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-red-100">
                  <th className="text-left py-3 px-4 text-gray-600">
                    Blood Type
                  </th>
                  <th className="text-left py-3 px-4 text-gray-600">
                    Can Donate To
                  </th>
                  <th className="text-left py-3 px-4 text-gray-600">
                    Can Receive From
                  </th>
                  <th className="text-left py-3 px-4 text-gray-600">
                    Donation Frequency
                  </th>
                </tr>
              </thead>
              <tbody>
                {educationalContent.compatibilityTable.map((row, index) => (
                  <tr
                    key={index}
                    className="border-b border-red-50 hover:bg-red-50/50"
                  >
                    <td className="py-3 px-4 font-medium">{row.bloodType}</td>
                    <td className="py-3 px-4">{row.canDonateTo.join(", ")}</td>
                    <td className="py-3 px-4">
                      {row.canReceiveFrom.join(", ")}
                    </td>
                    <td className="py-3 px-4">{row.frequency}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
        {/* Donation Process Infographic */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-6 bg-red-50 rounded-lg p-6"
        >
          <h4 className="text-md font-medium text-gray-800 mb-4">
            Donation Process
          </h4>
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            {[
              {
                step: "Register",
                icon: Users,
                description: "Sign up and verify eligibility",
              },
              {
                step: "Screen",
                icon: CheckCircle,
                description: "Health check and questionnaire",
              },
              {
                step: "Donate",
                icon: Droplets,
                description: "Give blood in 8-10 minutes",
              },
              { step: "Recover", icon: Heart, description: "Rest and refresh" },
            ].map((step, index) => (
              <motion.div
                key={index}
                className="flex-1 text-center p-4 bg-white rounded-lg shadow-md"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                <step.icon className="w-8 h-8 mx-auto mb-2 text-red-500" />
                <h5 className="font-medium text-gray-800">{step.step}</h5>
                <p className="text-sm text-gray-600">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
        {/* Interactive Quiz */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
          className="mt-6 bg-white rounded-lg shadow-md p-6"
        >
          <h4 className="text-md font-medium text-gray-800 mb-4">
            Test Your Knowledge
          </h4>
          <form onSubmit={handleQuizSubmit} className="space-y-4">
            {educationalContent.quiz.map((q, index) => (
              <div
                key={index}
                className="border border-red-100 rounded-lg p-4 bg-red-50/50"
              >
                <p className="font-medium text-gray-800 mb-2">{q.question}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {q.options.map((option, optIndex) => (
                    <label
                      key={optIndex}
                      className="flex items-center space-x-2"
                    >
                      <input
                        type="radio"
                        name={`quiz-${index}`}
                        value={option}
                        checked={quizAnswers[index] === option}
                        onChange={() =>
                          setQuizAnswers({ ...quizAnswers, [index]: option })
                        }
                        className="text-red-500 focus:ring-red-400"
                        disabled={quizSubmitted}
                      />
                      <span className="text-sm text-gray-600">{option}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
            {!quizSubmitted ? (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                className="bg-gradient-to-r from-red-500 to-pink-400 text-white py-2 px-4 rounded-lg font-medium"
              >
                Submit Answers
              </motion.button>
            ) : (
              <div className="text-center">
                <p className="text-lg font-medium text-gray-800">
                  Your Score: {quizScore} / {educationalContent.quiz.length}
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setQuizAnswers({});
                    setQuizSubmitted(false);
                    setQuizScore(null);
                  }}
                  className="mt-2 bg-blue-500 text-white py-2 px-4 rounded-lg font-medium"
                >
                  Retake Quiz
                </motion.button>
              </div>
            )}
          </form>
        </motion.div>
        {/* Key Facts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="mt-6"
        >
          <h4 className="text-md font-medium text-gray-800 mb-2">Key Facts</h4>
          <ul className="list-disc pl-5 text-sm text-gray-600 space-y-1">
            {educationalContent.facts.map((fact, index) => (
              <li key={index}>{fact}</li>
            ))}
          </ul>
        </motion.div>
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
          {bloodInventory.map((blood) => (
            <motion.div
              key={blood._id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="border border-red-100 rounded-lg p-4 bg-red-50/50"
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h4 className="text-xl font-semibold text-gray-800">
                    {blood.bloodType}
                  </h4>
                  <p className="text-2xl font-semibold text-red-500">
                    {blood.units} units
                  </p>
                </div>
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <Droplets className="w-5 h-5 text-red-500" />
                </div>
              </div>
              <div className="space-y-2">
                <div
                  className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getDemandColor(
                    blood.demand
                  )}`}
                >
                  {blood.demand} Demand
                </div>
                <p className="text-sm text-gray-500 flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  Expires: {blood.expiryDate}
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
                <th className="text-left py-3 px-4 text-gray-600">
                  Transaction Hash
                </th>
                <th className="text-left py-3 px-4 text-gray-600">Type</th>
                <th className="text-left py-3 px-4 text-gray-600">
                  Blood Type
                </th>
                <th className="text-left py-3 px-4 text-gray-600">Quantity</th>
                <th className="text-left py-3 px-4 text-gray-600">Timestamp</th>
                <th className="text-left py-3 px-4 text-gray-600">Status</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx) => (
                <tr
                  key={tx._id}
                  className="border-b border-red-50 hover:bg-red-50/50"
                >
                  <td className="py-3 px-4">
                    <code className="text-sm bg-red-100 px-2 py-1 rounded">
                      {tx.txHash.substring(0, 10)}...
                    </code>
                  </td>
                  <td className="py-3 px-4">{tx.type}</td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center">
                      <Droplets className="w-4 h-4 text-red-500 mr-1" />
                      {tx.bloodType}
                    </span>
                  </td>
                  <td className="py-3 px-4">{tx.quantity}</td>
                  <td className="py-3 px-4 text-gray-500">{tx.timestamp}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        tx.status === "Confirmed"
                          ? "bg-green-100 text-green-800"
                          : tx.status === "Scheduled"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {tx.status}
                    </span>
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
            <strong>Name:</strong>{" "}
            {userType === "Donor"
              ? `${userData?.firstName} ${userData?.lastName}`
              : userData?.[userType.toLowerCase() + "Info"]?.name || "N/A"}
          </p>
          <p className="text-gray-500">
            <strong>Email:</strong> {userData?.email}
          </p>
          <p className="text-gray-500">
            <strong>Role:</strong> {userData?.role}
          </p>
          {userType === "Donor" && (
            <>
              <p className="text-gray-500">
                <strong>Blood Group:</strong> {userData?.donorInfo?.bloodGroup}
              </p>
              <p className="text-gray-500">
                <strong>Donation Count:</strong>{" "}
                {userData?.donorInfo?.donationCount}
              </p>
              <p className="text-gray-500">
                <strong>Rewards:</strong> {userData?.donorInfo?.rewards.points}{" "}
                points, Badges:{" "}
                {userData?.donorInfo?.rewards.badges.join(", ") || "None"}
              </p>
            </>
          )}
          {userType !== "Donor" && (
            <>
              <p className="text-gray-500">
                <strong>Location:</strong>{" "}
                {userData?.[userType.toLowerCase() + "Info"]?.location}
              </p>
              <p className="text-gray-500">
                <strong>Contact:</strong>{" "}
                {userData?.[userType.toLowerCase() + "Info"]?.contactNumber}
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
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-green-50/50 rounded-lg"
              >
                <span className="text-sm font-medium text-gray-500">
                  {item}
                </span>
                <CheckCircle className="w-5 h-5 text-green-500" />
              </div>
            ))}
          </div>
          <div className="bg-blue-50/50 p-4 rounded-lg">
            <h4 className="font-medium text-blue-800 mb-2">Data Protection</h4>
            <p className="text-sm text-blue-600">
              Your personal information is encrypted and stored off-chain in
              MongoDB, while only verification hashes and metadata are stored on
              the Ethereum blockchain.
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
            .floating-label-container {
              position: relative;
              margin-bottom: 1.5rem;
            }
            .floating-label {
              position: absolute;
              top: -0.5rem;
              left: 0.75rem;
              font-size: 0.75rem;
              color: #4b5563;
              background: #fff;
              padding: 0 0.25rem;
              transition: all 0.2s ease;
              pointer-events: none;
            }
            input:focus,
            select:focus {
              border-color: #f87171;
              box-shadow: 0 0 0 2px rgba(239, 68, 68, 0.2);
            }
            .font-inter {
              font-family: 'Inter', sans-serif;
            }
          `}
        </style>
        {particles.map((particle) => (
          <BloodDroplet key={particle.id} particle={particle} />
        ))}
      </div>
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        userType={userType}
        notifications={notifications}
        connectWallet={connectWallet}
        connectedWallet={connectedWallet}
        isLoading={isLoading}
      />
      <AnimatePresence>
        {success && (
          <motion.div
            variants={messageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="fixed top-4 right-4 p-3 bg-green-50 border border-green-200 rounded-lg shadow-md z-50"
          >
            <p className="text-sm text-green-600 flex items-center">
              <CheckCircle className="w-4 h-4 mr-2" />
              {success}
            </p>
          </motion.div>
        )}
        {error && (
          <motion.div
            variants={messageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="fixed top-4 right-4 p-3 bg-red-50 border border-red-200 rounded-lg shadow-md z-50"
          >
            <p className="text-sm text-red-600 flex items-center">
              <AlertCircle className="w-4 h-4 mr-2" />
              {error}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
      <main className="relative max-w-7xl mx-auto">{renderContent()}</main>
    </div>
  );
};

export default BloodManagementSystem;