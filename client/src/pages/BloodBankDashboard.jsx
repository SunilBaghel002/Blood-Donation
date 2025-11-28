// src/pages/BloodBankDashboard.jsx
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  Droplets,
  FileText,
  Gift,
  Database,
  Lock,
  Clock,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Package,
  Activity,
  Loader,
  ExternalLink,
  Copy,
  Check,
  XCircle,
  AlertTriangle,
  Shield,
  Zap,
  Download,
  Filter,
  Search,
  RefreshCw,
  Award,
  Calendar,
  UserPlus,
  Info,
  MapPin,
  Phone,
  Mail,
  Building,
  Edit3,
  Save,
  X,
  User,
  Settings,
  LogOut,
} from "lucide-react";
import Header from "../components/Header";
import BloodDroplet from "../components/BloodDroplet";
import NotificationMessage from "../components/NotificationMessage";
import MetricCard from "../components/MetricCard";
import Table from "../components/Table";
import { useWeb3 } from "../contexts/Web3Context";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const BloodBankDashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [userType] = useState("BloodBank");
  const [notifications, setNotifications] = useState(0);
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [donors, setDonors] = useState([]);
  const [bloodInventory, setBloodInventory] = useState([]);
  const [requests, setRequests] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [donationRecord, setDonationRecord] = useState({
    donorId: "",
    bloodType: "",
    units: 1,
  });
  const [selectedDonor, setSelectedDonor] = useState(null);
  const [particles, setParticles] = useState([]);
  const [copied, setCopied] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    licenseNumber: "",
    operatingHours: "",
    emergencyContact: "",
  });

  const {
    account,
    isConnected,
    connectWallet,
    isLoading: walletLoading,
  } = useWeb3();

  // Particles animation
  useEffect(() => {
    const newParticles = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 3,
      duration: 4 + Math.random() * 3,
      size: 8 + Math.random() * 4,
    }));
    setParticles(newParticles);
  }, []);

  // Auto-dismiss messages
  useEffect(() => {
    if (success || error) {
      const timer = setTimeout(() => {
        setSuccess("");
        setError("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [success, error]);

  // Fetch user data on mount
  useEffect(() => {
    const fetchUserData = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("Please log in to access the dashboard");
        }

        const response = await fetch(`${API_URL}/api/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to fetch user data");
        }

        setUserData(data.user);

        // Set profile data from user data
        if (data.user) {
          setProfileData({
            name: data.user.bloodBankInfo?.name || data.user.firstName || "",
            email: data.user.email || "",
            phone: data.user.phone || data.user.bloodBankInfo?.phone || "",
            address: data.user.bloodBankInfo?.address || "",
            city: data.user.bloodBankInfo?.city || "",
            state: data.user.bloodBankInfo?.state || "",
            pincode: data.user.bloodBankInfo?.pincode || "",
            licenseNumber: data.user.bloodBankInfo?.licenseNumber || "",
            operatingHours:
              data.user.bloodBankInfo?.operatingHours || "9:00 AM - 6:00 PM",
            emergencyContact: data.user.bloodBankInfo?.emergencyContact || "",
          });
        }

        await fetchBloodBankData(token);
      } catch (err) {
        console.error("❌ Fetch user error:", err);
        setError(err.message || "Unable to fetch user data");
      } finally {
        setIsLoading(false);
      }
    };
    fetchUserData();
  }, []);

  // Sync wallet to backend
  useEffect(() => {
    const syncWallet = async () => {
      if (isConnected && account) {
        try {
          const token = localStorage.getItem("token");
          const response = await fetch(`${API_URL}/api/auth/connect-wallet`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ walletAddress: account }),
          });

          const data = await response.json();

          if (response.ok) {
            console.log("✅ Wallet synced to backend:", account);
          } else {
            console.warn("⚠️ Wallet sync failed:", data.error);
          }
        } catch (err) {
          console.error("❌ Wallet sync error:", err);
        }
      }
    };

    syncWallet();
  }, [isConnected, account]);

  // ✅ Fetch blood bank data
  const fetchBloodBankData = async (token) => {
    try {
      const [donorsRes, inventoryRes, requestsRes, transactionsRes] =
        await Promise.all([
          fetch(`${API_URL}/api/bloodbank/donors`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${API_URL}/api/bloodbank/inventory`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${API_URL}/api/bloodbank/requests`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${API_URL}/api/bloodbank/transactions`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

      const donorsData = await donorsRes.json();
      const inventoryData = await inventoryRes.json();
      const requestsData = await requestsRes.json();
      const transactionsData = await transactionsRes.json();

      if (!donorsRes.ok)
        throw new Error(donorsData.error || "Failed to fetch donors");
      if (!inventoryRes.ok)
        throw new Error(inventoryData.error || "Failed to fetch inventory");
      if (!requestsRes.ok)
        throw new Error(requestsData.error || "Failed to fetch requests");
      if (!transactionsRes.ok)
        throw new Error(
          transactionsData.error || "Failed to fetch transactions"
        );

      setDonors(donorsData.donors || []);
      setBloodInventory(
        inventoryData.inventory?.map((item) => ({
          _id: item._id,
          bloodType: item.bloodType,
          units: item.units,
          expiryDate: new Date(item.expiryDate).toLocaleDateString(),
          demand: item.demand,
        })) || []
      );
      setRequests(
        requestsData.requests?.map((req) => ({
          _id: req._id,
          hospitalName:
            req.hospitalId?.hospitalInfo?.name || "Unknown Hospital",
          bloodType: req.bloodType,
          quantity: req.quantity,
          status: req.status,
          createdAt: new Date(req.createdAt).toLocaleDateString(),
        })) || []
      );

      // ✅ Set real blockchain transactions
      setTransactions(
        transactionsData.transactions?.map((tx) => ({
          _id: tx._id,
          txHash: tx.txHash || "N/A",
          type: tx.type,
          bloodType: tx.bloodType,
          quantity: tx.quantity,
          status: tx.status,
          timestamp: tx.timestamp,
          donorName: tx.donorId
            ? `${tx.donorId.firstName} ${tx.donorId.lastName}`
            : "N/A",
          hospitalName: tx.hospitalId?.hospitalInfo?.name || "N/A",
        })) || []
      );
    } catch (err) {
      console.error("❌ Fetch blood bank data error:", err);
      setError(err.message || "Unable to fetch blood bank data");
    }
  };

  // ✅ Handle donor selection
  const handleDonorChange = (donorId) => {
    const donor = donors.find((d) => d._id === donorId);
    setSelectedDonor(donor);
    setDonationRecord({
      donorId,
      bloodType: donor?.donorInfo?.bloodGroup || "",
      units: 1,
    });
  };

  // Handle wallet connection
  const handleConnectWallet = async () => {
    try {
      await connectWallet();
      setSuccess("✅ Wallet connected successfully!");
    } catch (err) {
      console.error("❌ Wallet connection error:", err);
      setError("Failed to connect wallet. Please try again.");
    }
  };

  // Copy wallet address
  const copyAddress = () => {
    if (account) {
      navigator.clipboard.writeText(account);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // ✅ Handle record donation with blood type validation
  const handleRecordDonation = async (e) => {
    e.preventDefault();

    // Validation
    if (!donationRecord.donorId) {
      setError("Please select a donor");
      return;
    }

    // ✅ Check if selected blood type matches donor's blood type
    if (
      selectedDonor &&
      donationRecord.bloodType !== selectedDonor.donorInfo?.bloodGroup
    ) {
      setError(
        `Blood type mismatch! Donor's blood type is ${selectedDonor.donorInfo?.bloodGroup}`
      );
      return;
    }

    if (!donationRecord.bloodType) {
      setError("Blood type not available for selected donor");
      return;
    }

    if (donationRecord.units < 1 || donationRecord.units > 10) {
      setError("Units must be between 1 and 10");
      return;
    }

    if (!isConnected || !account) {
      setError("Please connect your wallet first");
      return;
    }

    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(`${API_URL}/api/bloodbank/record-donation`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          donorId: donationRecord.donorId,
          bloodType: donationRecord.bloodType,
          units: parseInt(donationRecord.units),
        }),
      });

      const data = await response.json();
      console.log("📥 Record donation response:", data);

      if (!response.ok) {
        throw new Error(data.error || "Failed to record donation");
      }

      setSuccess(
        `✅ Donation recorded! Tx: ${data.txHash?.substring(0, 10)}...`
      );
      setDonationRecord({ donorId: "", bloodType: "", units: 1 });
      setSelectedDonor(null);

      // Refresh data
      await fetchBloodBankData(localStorage.getItem("token"));
    } catch (err) {
      console.error("❌ Record donation error:", err);
      setError(err.message || "Failed to record donation");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle request approval/rejection
  const handleRequestAction = async (requestId, action) => {
    if (!isConnected || !account) {
      setError("Please connect your wallet first");
      return;
    }

    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(`${API_URL}/api/bloodbank/request-action`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ requestId, action }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || `Failed to ${action.toLowerCase()} request`
        );
      }

      setSuccess(`✅ Request ${action.toLowerCase()} successfully!`);

      // Refresh data
      await fetchBloodBankData(localStorage.getItem("token"));
    } catch (err) {
      console.error("❌ Request action error:", err);
      setError(err.message || `Failed to ${action.toLowerCase()} request`);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle profile update
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/api/auth/update-profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          bloodBankInfo: {
            name: profileData.name,
            phone: profileData.phone,
            address: profileData.address,
            city: profileData.city,
            state: profileData.state,
            pincode: profileData.pincode,
            licenseNumber: profileData.licenseNumber,
            operatingHours: profileData.operatingHours,
            emergencyContact: profileData.emergencyContact,
          },
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update profile");
      }

      setSuccess("✅ Profile updated successfully!");
      setIsEditingProfile(false);
      setUserData(data.user);
    } catch (err) {
      console.error("❌ Profile update error:", err);
      setError(err.message || "Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  // Get demand color
  const getDemandColor = (demand) => {
    switch (demand) {
      case "Critical":
        return "text-red-600 bg-red-100 border-red-200";
      case "High":
        return "text-orange-600 bg-orange-100 border-orange-200";
      case "Medium":
        return "text-yellow-600 bg-yellow-100 border-yellow-200";
      case "Low":
        return "text-green-600 bg-green-100 border-green-200";
      default:
        return "text-gray-600 bg-gray-100 border-gray-200";
    }
  };

  // Calculate total blood units
  const getTotalBloodUnits = () => {
    return bloodInventory.reduce((sum, item) => sum + item.units, 0);
  };

  // Refresh all data
  const handleRefresh = async () => {
    setIsLoading(true);
    await fetchBloodBankData(localStorage.getItem("token"));
    setSuccess("✅ Data refreshed successfully!");
    setIsLoading(false);
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Get status color for transactions
  const getStatusColor = (status) => {
    switch (status) {
      case "Confirmed":
        return "bg-green-100 text-green-700 border-green-200";
      case "Scheduled":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "In Transit":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "Used":
        return "bg-purple-100 text-purple-700 border-purple-200";
      case "Pending":
        return "bg-orange-100 text-orange-700 border-orange-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  // ============ RENDER DASHBOARD ============
  const renderDashboard = () => (
    <div className="p-6 space-y-6">
      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ scale: 1.05, y: -5 }}
          className="bg-gradient-to-br from-red-500 to-red-600 rounded-2xl p-6 text-white shadow-lg"
        >
          <div className="flex items-center justify-between mb-4">
            <Users className="w-12 h-12 opacity-80" />
            <div className="text-4xl font-bold">{donors.length}</div>
          </div>
          <p className="text-red-100 font-medium">Registered Donors</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          whileHover={{ scale: 1.05, y: -5 }}
          className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg"
        >
          <div className="flex items-center justify-between mb-4">
            <Droplets className="w-12 h-12 opacity-80" />
            <div className="text-4xl font-bold">{getTotalBloodUnits()}</div>
          </div>
          <p className="text-blue-100 font-medium">Total Blood Units</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          whileHover={{ scale: 1.05, y: -5 }}
          className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-2xl p-6 text-white shadow-lg"
        >
          <div className="flex items-center justify-between mb-4">
            <FileText className="w-12 h-12 opacity-80" />
            <div className="text-4xl font-bold">
              {requests.filter((r) => r.status === "Pending").length}
            </div>
          </div>
          <p className="text-yellow-100 font-medium">Pending Requests</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          whileHover={{ scale: 1.05, y: -5 }}
          className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg"
        >
          <div className="flex items-center justify-between mb-4">
            <Database className="w-12 h-12 opacity-80" />
            <div className="text-4xl font-bold">{transactions.length}</div>
          </div>
          <p className="text-purple-100 font-medium">Blockchain Transactions</p>
        </motion.div>
      </div>

      {/* Wallet Connection Warning */}
      {!isConnected && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-300 rounded-2xl p-6 flex items-start gap-4 shadow-lg"
        >
          <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center flex-shrink-0">
            <AlertTriangle className="w-6 h-6 text-yellow-900" />
          </div>
          <div className="flex-1">
            <h4 className="font-bold text-yellow-900 text-lg mb-2">
              Wallet Not Connected
            </h4>
            <p className="text-yellow-800 mb-4">
              Please connect your MetaMask wallet to record donations and manage
              blockchain transactions.
            </p>
            <button
              onClick={handleConnectWallet}
              disabled={walletLoading}
              className="bg-yellow-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-yellow-700 disabled:opacity-50 flex items-center gap-2 shadow-md hover:shadow-lg transition-all"
            >
              {walletLoading ? (
                <Loader className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <Zap className="w-5 h-5" />
                  Connect Wallet
                </>
              )}
            </button>
          </div>
        </motion.div>
      )}

      {/* Connected Wallet Info */}
      {isConnected && account && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300 rounded-2xl p-6 flex items-center justify-between shadow-lg"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-400 rounded-full flex items-center justify-center">
              <CheckCircle className="w-7 h-7 text-green-900" />
            </div>
            <div>
              <h4 className="font-bold text-green-900 mb-1">
                Wallet Connected
              </h4>
              <p className="text-sm text-green-700 font-mono">
                {account.substring(0, 8)}...{account.substring(38)}
              </p>
            </div>
          </div>
          <button
            onClick={copyAddress}
            className="text-green-700 hover:text-green-900 p-3 hover:bg-green-100 rounded-lg transition"
          >
            {copied ? (
              <Check className="w-5 h-5" />
            ) : (
              <Copy className="w-5 h-5" />
            )}
          </button>
        </motion.div>
      )}

      {/* Record Donation Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-xl p-8 border-2 border-red-100"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <Droplets className="w-6 h-6 text-red-600" />
            </div>
            Record New Donation
          </h3>
          <button
            onClick={handleRefresh}
            disabled={isLoading}
            className="text-gray-600 hover:text-red-600 p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <RefreshCw
              className={`w-5 h-5 ${isLoading ? "animate-spin" : ""}`}
            />
          </button>
        </div>

        <form onSubmit={handleRecordDonation} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Donor Selection */}
            <div className="relative">
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Select Donor *
              </label>
              <select
                value={donationRecord.donorId}
                onChange={(e) => handleDonorChange(e.target.value)}
                className="w-full bg-red-50 border-2 border-red-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-red-400 outline-none font-medium text-gray-900"
                required
              >
                <option value="">Choose a donor...</option>
                {donors.map((donor) => (
                  <option key={donor._id} value={donor._id}>
                    {donor.firstName} {donor.lastName} (
                    {donor.donorInfo?.bloodGroup || "N/A"})
                  </option>
                ))}
              </select>
            </div>

            {/* Blood Type - Auto-filled & Read-only */}
            <div className="relative">
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Blood Type *
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={donationRecord.bloodType}
                  readOnly
                  className="w-full bg-gray-100 border-2 border-gray-300 rounded-xl px-4 py-3 font-bold text-gray-900 cursor-not-allowed"
                  placeholder={
                    selectedDonor
                      ? selectedDonor.donorInfo?.bloodGroup
                      : "Auto-filled"
                  }
                />
                <div className="absolute right-3 top-3">
                  <Lock className="w-5 h-5 text-gray-400" />
                </div>
              </div>
              {selectedDonor && (
                <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                  <Info className="w-3 h-3" />
                  Auto-detected from donor's profile
                </p>
              )}
            </div>

            {/* Units */}
            <div className="relative">
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Units (1-10) *
              </label>
              <input
                type="number"
                value={donationRecord.units}
                onChange={(e) =>
                  setDonationRecord({
                    ...donationRecord,
                    units: parseInt(e.target.value) || 1,
                  })
                }
                className="w-full bg-red-50 border-2 border-red-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-red-400 outline-none font-medium text-gray-900"
                min="1"
                max="10"
                required
              />
            </div>
          </div>

          {/* Submit Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isLoading || !isConnected || !selectedDonor}
            className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-3 hover:from-red-600 hover:to-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-lg hover:shadow-xl"
          >
            {isLoading ? (
              <>
                <Loader className="w-6 h-6 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <CheckCircle className="w-6 h-6" />
                Record Donation on Blockchain
              </>
            )}
          </motion.button>
        </form>
      </motion.div>

      {/* Donor Management */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-xl p-8 border-2 border-blue-100"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            Registered Donors ({donors.length})
          </h3>
        </div>
        {donors.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <UserPlus className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p className="text-lg">No donors registered yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b-2 border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">
                    Name
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">
                    Blood Type
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">
                    Last Donation
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">
                    Total Donations
                  </th>
                </tr>
              </thead>
              <tbody>
                {donors.map((donor) => (
                  <tr
                    key={donor._id}
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {donor.firstName} {donor.lastName}
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-2 px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-bold">
                        <Droplets className="w-4 h-4" />
                        {donor.donorInfo?.bloodGroup || "N/A"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {donor.donorInfo?.lastDonationDate
                        ? new Date(
                            donor.donorInfo.lastDonationDate
                          ).toLocaleDateString()
                        : "Never"}
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-bold text-green-600 text-lg">
                        {donor.donorInfo?.donationCount || 0}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>

      {/* Blood Supply Requests */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-xl p-8 border-2 border-green-100"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-green-600" />
            </div>
            Blood Supply Requests ({requests.length})
          </h3>
        </div>
        <div className="space-y-4">
          {requests.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Package className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p className="text-lg">No requests yet</p>
            </div>
          ) : (
            requests.map((request) => (
              <motion.div
                key={request._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex flex-col lg:flex-row lg:items-center lg:justify-between p-6 bg-gradient-to-r from-red-50 to-pink-50 rounded-xl border-2 border-red-100 shadow-md hover:shadow-lg transition"
              >
                <div className="flex-1 mb-4 lg:mb-0">
                  <h4 className="font-bold text-gray-900 text-lg mb-2">
                    {request.hospitalName}
                  </h4>
                  <div className="flex flex-wrap items-center gap-4">
                    <span className="flex items-center gap-2 text-sm font-medium">
                      <Droplets className="w-4 h-4 text-red-500" />
                      {request.bloodType}
                    </span>
                    <span className="flex items-center gap-2 text-sm font-medium">
                      <Package className="w-4 h-4 text-blue-500" />
                      {request.quantity} units
                    </span>
                    <span className="flex items-center gap-2 text-sm text-gray-500">
                      <Clock className="w-4 h-4" />
                      {request.createdAt}
                    </span>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold ${
                        request.status === "Pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : request.status === "Approved"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {request.status}
                    </span>
                  </div>
                </div>
                {request.status === "Pending" && (
                  <div className="flex items-center gap-3">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() =>
                        handleRequestAction(request._id, "Approved")
                      }
                      disabled={isLoading || !isConnected}
                      className="px-5 py-2 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 disabled:opacity-50 flex items-center gap-2 shadow-md"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Approve
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() =>
                        handleRequestAction(request._id, "Rejected")
                      }
                      disabled={isLoading || !isConnected}
                      className="px-5 py-2 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 disabled:opacity-50 flex items-center gap-2 shadow-md"
                    >
                      <XCircle className="w-4 h-4" />
                      Reject
                    </motion.button>
                  </div>
                )}
              </motion.div>
            ))
          )}
        </div>
      </motion.div>
    </div>
  );

  // ============ RENDER INVENTORY ============
  const renderInventory = () => (
    <div className="p-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-xl p-8 border-2 border-gray-100"
      >
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <Droplets className="w-6 h-6 text-red-600" />
            </div>
            Blood Inventory Status
          </h3>
          <div className="text-right">
            <p className="text-sm text-gray-500">Total Stock</p>
            <p className="text-3xl font-bold text-red-600">
              {getTotalBloodUnits()} <span className="text-lg">units</span>
            </p>
          </div>
        </div>

        {bloodInventory.length === 0 ? (
          <div className="text-center py-16 text-gray-500">
            <Database className="w-20 h-20 mx-auto mb-4 text-gray-300" />
            <p className="text-xl font-medium mb-2">No blood inventory yet</p>
            <p className="text-gray-400">
              Record donations to build your inventory
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {bloodInventory.map((blood) => (
              <motion.div
                key={blood._id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.05, y: -8 }}
                className="relative border-2 border-red-200 rounded-2xl p-6 bg-gradient-to-br from-red-50 via-white to-pink-50 hover:shadow-2xl transition-all cursor-pointer"
              >
                <div className="absolute top-4 right-4">
                  <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center">
                    <Droplets className="w-7 h-7 text-red-600" />
                  </div>
                </div>

                <div className="mb-4">
                  <h4 className="text-3xl font-bold text-gray-900 mb-1">
                    {blood.bloodType}
                  </h4>
                  <p className="text-4xl font-bold text-red-600">
                    {blood.units}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">units available</p>
                </div>

                <div className="space-y-3">
                  <div
                    className={`inline-block px-3 py-1 rounded-full text-xs font-bold border ${getDemandColor(
                      blood.demand
                    )}`}
                  >
                    {blood.demand} Demand
                  </div>
                  <p className="text-xs text-gray-600 flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Expires: {blood.expiryDate}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );

  // ============ RENDER TRANSACTIONS (REAL BLOCKCHAIN DATA) ============
  const renderTransactions = () => {
    const filteredTransactions = transactions.filter((tx) => {
      const matchesSearch =
        tx.txHash?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tx.donorName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tx.bloodType?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesFilter =
        filterStatus === "all" || tx.status === filterStatus;

      return matchesSearch && matchesFilter;
    });

    return (
      <div className="p-6 space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl p-8 border-2 border-blue-100"
        >
          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Database className="w-6 h-6 text-blue-600" />
                </div>
                Blockchain Transactions
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                Real-time verified transactions from Ethereum network
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="font-medium text-green-600">
                  Live on Hardhat
                </span>
              </div>
              <button
                onClick={handleRefresh}
                disabled={isLoading}
                className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition"
              >
                <RefreshCw
                  className={`w-5 h-5 ${isLoading ? "animate-spin" : ""}`}
                />
              </button>
            </div>
          </div>

          {/* Search & Filter */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by transaction hash, donor name, or blood type..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-400 outline-none"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-400 outline-none font-medium"
            >
              <option value="all">All Status</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Scheduled">Scheduled</option>
              <option value="In Transit">In Transit</option>
              <option value="Used">Used</option>
              <option value="Pending">Pending</option>
            </select>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-green-600">
                {transactions.filter((tx) => tx.status === "Confirmed").length}
              </p>
              <p className="text-sm text-green-700">Confirmed</p>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-blue-600">
                {transactions.filter((tx) => tx.status === "Scheduled").length}
              </p>
              <p className="text-sm text-blue-700">Scheduled</p>
            </div>
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-yellow-600">
                {transactions.filter((tx) => tx.status === "In Transit").length}
              </p>
              <p className="text-sm text-yellow-700">In Transit</p>
            </div>
            <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-purple-600">
                {transactions.filter((tx) => tx.status === "Used").length}
              </p>
              <p className="text-sm text-purple-700">Used</p>
            </div>
          </div>

          {/* Transactions Table */}
          {filteredTransactions.length === 0 ? (
            <div className="text-center py-16 text-gray-500">
              <Database className="w-20 h-20 mx-auto mb-4 text-gray-300" />
              <p className="text-xl font-medium mb-2">
                {transactions.length === 0
                  ? "No blockchain transactions yet"
                  : "No transactions match your search"}
              </p>
              <p className="text-gray-400">
                {transactions.length === 0
                  ? "Record a donation to see it here"
                  : "Try a different search term or filter"}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-blue-50 to-purple-50 border-b-2 border-blue-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">
                      Transaction Hash
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">
                      Type
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">
                      Donor / Hospital
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">
                      Blood Type
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">
                      Units
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">
                      Timestamp
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTransactions.map((tx, index) => (
                    <motion.tr
                      key={tx._id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="border-b border-gray-100 hover:bg-blue-50 transition"
                    >
                      <td className="px-6 py-4">
                        {tx.txHash && tx.txHash !== "N/A" ? (
                          <a
                            href={`https://etherscan.io/tx/${tx.txHash}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-mono text-sm font-medium"
                          >
                            {tx.txHash.substring(0, 10)}...
                            {tx.txHash.substring(tx.txHash.length - 6)}
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        ) : (
                          <span className="text-gray-400 font-mono text-sm">
                            N/A
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold ${
                            tx.type === "Donation"
                              ? "bg-green-100 text-green-700"
                              : tx.type === "Transfer"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-purple-100 text-purple-700"
                          }`}
                        >
                          {tx.type === "Donation" && (
                            <Gift className="w-3 h-3" />
                          )}
                          {tx.type === "Transfer" && (
                            <Package className="w-3 h-3" />
                          )}
                          {tx.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-medium text-gray-900">
                        {tx.type === "Donation"
                          ? tx.donorName
                          : tx.hospitalName}
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-2 px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-bold">
                          <Droplets className="w-4 h-4" />
                          {tx.bloodType}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-bold text-gray-900">
                        {tx.quantity}
                      </td>
                      <td className="px-6 py-4 text-gray-600 text-sm">
                        {formatDate(tx.timestamp)}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(
                            tx.status
                          )}`}
                        >
                          {tx.status === "Confirmed" && (
                            <CheckCircle className="w-3 h-3" />
                          )}
                          {tx.status === "Pending" && (
                            <Clock className="w-3 h-3" />
                          )}
                          {tx.status === "In Transit" && (
                            <Package className="w-3 h-3" />
                          )}
                          {tx.status}
                        </span>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Export Button */}
          {filteredTransactions.length > 0 && (
            <div className="mt-6 flex justify-end">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  const csvContent =
                    "data:text/csv;charset=utf-8," +
                    "Transaction Hash,Type,Donor/Hospital,Blood Type,Units,Timestamp,Status\n" +
                    filteredTransactions
                      .map(
                        (tx) =>
                          `${tx.txHash},${tx.type},${
                            tx.type === "Donation"
                              ? tx.donorName
                              : tx.hospitalName
                          },${tx.bloodType},${tx.quantity},${formatDate(
                            tx.timestamp
                          )},${tx.status}`
                      )
                      .join("\n");
                  const encodedUri = encodeURI(csvContent);
                  const link = document.createElement("a");
                  link.setAttribute("href", encodedUri);
                  link.setAttribute("download", "blockchain_transactions.csv");
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                  setSuccess("✅ Transactions exported successfully!");
                }}
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition shadow-lg"
              >
                <Download className="w-5 h-5" />
                Export CSV
              </motion.button>
            </div>
          )}
        </motion.div>
      </div>
    );
  };

  // ============ RENDER PROFILE ============
  const renderProfile = () => (
    <div className="p-6 space-y-6">
      {/* Profile Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-red-500 via-red-600 to-pink-600 rounded-2xl p-8 text-white shadow-xl relative overflow-hidden"
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          {particles.map((particle) => (
            <motion.div
              key={particle.id}
              className="absolute rounded-full bg-white"
              style={{
                width: particle.size,
                height: particle.size,
                left: `${particle.x}%`,
                top: `${particle.y}%`,
              }}
              animate={{
                y: [0, -30, 0],
                opacity: [0.3, 0.8, 0.3],
              }}
              transition={{
                duration: particle.duration,
                delay: particle.delay,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>

        <div className="relative flex flex-col md:flex-row items-center gap-6">
          <div className="w-32 h-32 bg-white/20 rounded-full flex items-center justify-center border-4 border-white/30">
            <Building className="w-16 h-16 text-white" />
          </div>
          <div className="text-center md:text-left">
            <h2 className="text-3xl font-bold mb-2">
              {profileData.name ||
                userData?.bloodBankInfo?.name ||
                "Blood Bank"}
            </h2>
            <p className="text-red-100 flex items-center justify-center md:justify-start gap-2 mb-2">
              <Mail className="w-4 h-4" />
              {userData?.email || profileData.email}
            </p>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mt-3">
              <span className="px-4 py-1 bg-white/20 rounded-full text-sm font-medium flex items-center gap-2">
                <Shield className="w-4 h-4" />
                Verified Blood Bank
              </span>
              {isConnected && (
                <span className="px-4 py-1 bg-green-400/30 rounded-full text-sm font-medium flex items-center gap-2">
                  <Zap className="w-4 h-4" />
                  Wallet Connected
                </span>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Profile Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Basic Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl p-8 border-2 border-gray-100"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900 flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <User className="w-5 h-5 text-blue-600" />
              </div>
              Basic Information
            </h3>
            <button
              onClick={() => setIsEditingProfile(!isEditingProfile)}
              className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
            >
              {isEditingProfile ? (
                <>
                  <X className="w-4 h-4" />
                  Cancel
                </>
              ) : (
                <>
                  <Edit3 className="w-4 h-4" />
                  Edit
                </>
              )}
            </button>
          </div>

          {isEditingProfile ? (
            <form onSubmit={handleProfileUpdate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Blood Bank Name
                </label>
                <input
                  type="text"
                  value={profileData.name}
                  onChange={(e) =>
                    setProfileData({ ...profileData, name: e.target.value })
                  }
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-400 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone
                </label>
                <input
                  type="tel"
                  value={profileData.phone}
                  onChange={(e) =>
                    setProfileData({ ...profileData, phone: e.target.value })
                  }
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-400 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  License Number
                </label>
                <input
                  type="text"
                  value={profileData.licenseNumber}
                  onChange={(e) =>
                    setProfileData({
                      ...profileData,
                      licenseNumber: e.target.value,
                    })
                  }
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-400 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Operating Hours
                </label>
                <input
                  type="text"
                  value={profileData.operatingHours}
                  onChange={(e) =>
                    setProfileData({
                      ...profileData,
                      operatingHours: e.target.value,
                    })
                  }
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-400 outline-none"
                  placeholder="e.g., 9:00 AM - 6:00 PM"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Emergency Contact
                </label>
                <input
                  type="tel"
                  value={profileData.emergencyContact}
                  onChange={(e) =>
                    setProfileData({
                      ...profileData,
                      emergencyContact: e.target.value,
                    })
                  }
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-400 outline-none"
                />
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-blue-700 disabled:opacity-50 transition"
              >
                {isLoading ? (
                  <Loader className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    Save Changes
                  </>
                )}
              </motion.button>
            </form>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                <Building className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Blood Bank Name</p>
                  <p className="font-medium text-gray-900">
                    {profileData.name || "Not set"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                <Mail className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium text-gray-900">
                    {userData?.email || "Not set"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                <Phone className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="font-medium text-gray-900">
                    {profileData.phone || "Not set"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                <Shield className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">License Number</p>
                  <p className="font-medium text-gray-900">
                    {profileData.licenseNumber || "Not set"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                <Clock className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Operating Hours</p>
                  <p className="font-medium text-gray-900">
                    {profileData.operatingHours || "Not set"}
                  </p>
                </div>
              </div>
            </div>
          )}
        </motion.div>

        {/* Address Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl shadow-xl p-8 border-2 border-gray-100"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900 flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <MapPin className="w-5 h-5 text-green-600" />
              </div>
              Address Information
            </h3>
          </div>

          {isEditingProfile ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Street Address
                </label>
                <input
                  type="text"
                  value={profileData.address}
                  onChange={(e) =>
                    setProfileData({ ...profileData, address: e.target.value })
                  }
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-green-400 outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    value={profileData.city}
                    onChange={(e) =>
                      setProfileData({ ...profileData, city: e.target.value })
                    }
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-green-400 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    State
                  </label>
                  <input
                    type="text"
                    value={profileData.state}
                    onChange={(e) =>
                      setProfileData({ ...profileData, state: e.target.value })
                    }
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-green-400 outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  PIN Code
                </label>
                <input
                  type="text"
                  value={profileData.pincode}
                  onChange={(e) =>
                    setProfileData({ ...profileData, pincode: e.target.value })
                  }
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-green-400 outline-none"
                />
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                <MapPin className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Street Address</p>
                  <p className="font-medium text-gray-900">
                    {profileData.address || "Not set"}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                  <div>
                    <p className="text-sm text-gray-500">City</p>
                    <p className="font-medium text-gray-900">
                      {profileData.city || "Not set"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                  <div>
                    <p className="text-sm text-gray-500">State</p>
                    <p className="font-medium text-gray-900">
                      {profileData.state || "Not set"}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                <div>
                  <p className="text-sm text-gray-500">PIN Code</p>
                  <p className="font-medium text-gray-900">
                    {profileData.pincode || "Not set"}
                  </p>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>

      {/* Wallet Information */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-2xl shadow-xl p-8 border-2 border-purple-100"
      >
        <h3 className="text-xl font-bold text-gray-900 flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
            <Zap className="w-5 h-5 text-purple-600" />
          </div>
          Blockchain Wallet
        </h3>

        {isConnected && account ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-6 bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl border-2 border-purple-200">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">
                    Connected Wallet Address
                  </p>
                  <p className="font-mono font-medium text-gray-900">
                    {account}
                  </p>
                </div>
              </div>
              <button
                onClick={copyAddress}
                className="p-3 bg-purple-100 text-purple-600 rounded-lg hover:bg-purple-200 transition"
              >
                {copied ? (
                  <Check className="w-5 h-5" />
                ) : (
                  <Copy className="w-5 h-5" />
                )}
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-gray-50 rounded-xl text-center">
                <p className="text-2xl font-bold text-green-600">
                  {transactions.length}
                </p>
                <p className="text-sm text-gray-500">Total Transactions</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl text-center">
                <p className="text-2xl font-bold text-blue-600">
                  {
                    transactions.filter((tx) => tx.status === "Confirmed")
                      .length
                  }
                </p>
                <p className="text-sm text-gray-500">Confirmed</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl text-center">
                <p className="text-2xl font-bold text-purple-600">
                  {getTotalBloodUnits()}
                </p>
                <p className="text-sm text-gray-500">Units Tracked</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-10 h-10 text-purple-600" />
            </div>
            <h4 className="text-lg font-bold text-gray-900 mb-2">
              No Wallet Connected
            </h4>
            <p className="text-gray-500 mb-6">
              Connect your MetaMask wallet to enable blockchain features
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleConnectWallet}
              disabled={walletLoading}
              className="px-8 py-3 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 disabled:opacity-50 flex items-center gap-2 mx-auto transition"
            >
              {walletLoading ? (
                <Loader className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <Zap className="w-5 h-5" />
                  Connect Wallet
                </>
              )}
            </motion.button>
          </div>
        )}
      </motion.div>

      {/* Statistics Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-2xl shadow-xl p-8 border-2 border-gray-100"
      >
        <h3 className="text-xl font-bold text-gray-900 flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
            <Award className="w-5 h-5 text-yellow-600" />
          </div>
          Performance Summary
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center p-6 bg-gradient-to-br from-red-50 to-pink-50 rounded-xl border-2 border-red-100">
            <Droplets className="w-10 h-10 text-red-500 mx-auto mb-3" />
            <p className="text-3xl font-bold text-gray-900">
              {getTotalBloodUnits()}
            </p>
            <p className="text-sm text-gray-500">Blood Units</p>
          </div>
          <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border-2 border-blue-100">
            <Users className="w-10 h-10 text-blue-500 mx-auto mb-3" />
            <p className="text-3xl font-bold text-gray-900">{donors.length}</p>
            <p className="text-sm text-gray-500">Active Donors</p>
          </div>
          <div className="text-center p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border-2 border-green-100">
            <CheckCircle className="w-10 h-10 text-green-500 mx-auto mb-3" />
            <p className="text-3xl font-bold text-gray-900">
              {requests.filter((r) => r.status === "Approved").length}
            </p>
            <p className="text-sm text-gray-500">Fulfilled Requests</p>
          </div>
          <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl border-2 border-purple-100">
            <Database className="w-10 h-10 text-purple-500 mx-auto mb-3" />
            <p className="text-3xl font-bold text-gray-900">
              {transactions.length}
            </p>
            <p className="text-sm text-gray-500">Blockchain Txns</p>
          </div>
        </div>
      </motion.div>
    </div>
  );

  // ============ TAB CONFIGURATION ============
  const tabs = [
    { id: "dashboard", label: "Dashboard", icon: Activity },
    { id: "inventory", label: "Inventory", icon: Droplets },
    { id: "transactions", label: "Transactions", icon: Database },
    { id: "profile", label: "Profile", icon: User },
  ];

  // ============ MAIN RENDER ============
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-red-50 to-pink-50">
      {/* Background Particles */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute rounded-full bg-red-200 opacity-30"
            style={{
              width: particle.size,
              height: particle.size,
              left: `${particle.x}%`,
              top: `${particle.y}%`,
            }}
            animate={{
              y: [0, -50, 0],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: particle.duration,
              delay: particle.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Header */}
      <Header userType={userType} notifications={notifications} />

      {/* Notification Messages */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50"
          >
            <div className="bg-red-500 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3">
              <AlertCircle className="w-6 h-6" />
              <span className="font-medium">{error}</span>
              <button
                onClick={() => setError("")}
                className="ml-4 hover:bg-red-600 p-1 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        )}
        {success && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50"
          >
            <div className="bg-green-500 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3">
              <CheckCircle className="w-6 h-6" />
              <span className="font-medium">{success}</span>
              <button
                onClick={() => setSuccess("")}
                className="ml-4 hover:bg-green-600 p-1 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-4 border-white border-t-transparent rounded-full"
          />
        </div>
      )}

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 relative z-10">
        {/* Tab Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl p-2 mb-8 border-2 border-gray-100"
        >
          <div className="flex flex-wrap gap-2">
            {tabs.map((tab) => (
              <motion.button
                key={tab.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${
                  activeTab === tab.id
                    ? "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <tab.icon className="w-5 h-5" />
                <span className="hidden sm:inline">{tab.label}</span>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === "dashboard" && renderDashboard()}
            {activeTab === "inventory" && renderInventory()}
            {activeTab === "transactions" && renderTransactions()}
            {activeTab === "profile" && renderProfile()}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
};

export default BloodBankDashboard;
