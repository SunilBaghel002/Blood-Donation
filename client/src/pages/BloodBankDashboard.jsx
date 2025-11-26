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
} from "lucide-react";
import Header from "../components/Header";
import BloodDroplet from "../components/BloodDroplet";
import NotificationMessage from "../components/NotificationMessage";
import MetricCard from "../components/MetricCard";
import Table from "../components/Table";
import { useWeb3 } from "../contexts/Web3Context"; // ✅ Import Web3Context

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
  const [rewards] = useState({ points: 100, badges: ["Trusted Bank"] });
  const [donationRecord, setDonationRecord] = useState({
    donorId: "",
    bloodType: "",
    units: 1,
  });
  const [particles, setParticles] = useState([]);
  const [copied, setCopied] = useState(false);

  // ✅ Use Web3Context
  const {
    account,
    isConnected,
    connectWallet,
    isLoading: walletLoading,
  } = useWeb3();

  // Particles animation
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

  // ✅ Fetch user data on mount
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

  // ✅ Sync wallet to backend when connected
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
      const [donorsRes, inventoryRes, requestsRes] = await Promise.all([
        fetch(`${API_URL}/api/bloodbank/donors`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${API_URL}/api/bloodbank/inventory`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${API_URL}/api/bloodbank/requests`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      const donorsData = await donorsRes.json();
      const inventoryData = await inventoryRes.json();
      const requestsData = await requestsRes.json();

      if (!donorsRes.ok) {
        throw new Error(donorsData.error || "Failed to fetch donors");
      }
      if (!inventoryRes.ok) {
        throw new Error(inventoryData.error || "Failed to fetch inventory");
      }
      if (!requestsRes.ok) {
        throw new Error(requestsData.error || "Failed to fetch requests");
      }

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
          hospitalName:
            req.hospitalId?.hospitalInfo?.name || "Unknown Hospital",
          bloodType: req.bloodType,
          quantity: req.quantity,
          status: req.status,
          createdAt: new Date(req.createdAt).toLocaleDateString(),
        })) || []
      );
    } catch (err) {
      console.error("❌ Fetch blood bank data error:", err);
      setError(err.message || "Unable to fetch blood bank data");
    }
  };

  // ✅ Handle wallet connection
  const handleConnectWallet = async () => {
    try {
      await connectWallet();
      setSuccess("✅ Wallet connected successfully!");
    } catch (err) {
      console.error("❌ Wallet connection error:", err);
      setError("Failed to connect wallet. Please try again.");
    }
  };

  // ✅ Copy wallet address
  const copyAddress = () => {
    if (account) {
      navigator.clipboard.writeText(account);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // ✅ Handle record donation with validation
  const handleRecordDonation = async (e) => {
    e.preventDefault();

    // ✅ Validation
    if (!donationRecord.donorId) {
      setError("Please select a donor");
      return;
    }
    if (!donationRecord.bloodType) {
      setError("Please select blood type");
      return;
    }
    if (donationRecord.units < 1 || donationRecord.units > 10) {
      setError("Units must be between 1 and 10");
      return;
    }

    // ✅ Check if wallet is connected
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

      // Refresh data
      await fetchBloodBankData(localStorage.getItem("token"));
    } catch (err) {
      console.error("❌ Record donation error:", err);
      setError(err.message || "Failed to record donation");
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ Handle request approval/rejection
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
      console.log("📥 Request action response:", data);

      if (!response.ok) {
        throw new Error(
          data.error || `Failed to ${action.toLowerCase()} request`
        );
      }

      setSuccess(`✅ Request ${action.toLowerCase()} successfully!`);

      // Update local state
      setRequests((prev) =>
        prev.map((req) =>
          req._id === requestId ? { ...req, status: action } : req
        )
      );

      // Refresh data
      await fetchBloodBankData(localStorage.getItem("token"));
    } catch (err) {
      console.error("❌ Request action error:", err);
      setError(err.message || `Failed to ${action.toLowerCase()} request`);
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ Get demand color
  const getDemandColor = (demand) => {
    switch (demand) {
      case "Critical":
        return "text-red-600 bg-red-100";
      case "High":
        return "text-orange-600 bg-orange-100";
      case "Medium":
        return "text-yellow-600 bg-yellow-100";
      case "Low":
        return "text-green-600 bg-green-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  // ✅ Calculate total blood units
  const getTotalBloodUnits = () => {
    return bloodInventory.reduce((sum, item) => sum + item.units, 0);
  };

  // ============ RENDER DASHBOARD ============
  const renderDashboard = () => (
    <div className="p-6 space-y-6">
      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <MetricCard
          label="Total Donors"
          value={donors.length}
          icon={Users}
          color="border-red-500"
          index={0}
        />
        <MetricCard
          label="Blood Units"
          value={getTotalBloodUnits()}
          icon={Droplets}
          color="border-blue-500"
          index={1}
        />
        <MetricCard
          label="Pending Requests"
          value={requests.filter((r) => r.status === "Pending").length}
          icon={FileText}
          color="border-yellow-500"
          index={2}
        />
        <MetricCard
          label="Rewards Issued"
          value={rewards.points}
          icon={Gift}
          color="border-purple-500"
          index={3}
        />
      </div>

      {/* Wallet Connection Warning */}
      {!isConnected && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex items-start gap-3"
        >
          <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h4 className="font-semibold text-yellow-900 mb-1">
              Wallet Not Connected
            </h4>
            <p className="text-sm text-yellow-700 mb-3">
              Please connect your wallet to record donations and manage
              requests.
            </p>
            <button
              onClick={handleConnectWallet}
              disabled={walletLoading}
              className="bg-yellow-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-yellow-700 disabled:opacity-50 flex items-center gap-2"
            >
              {walletLoading ? (
                <Loader className="w-4 h-4 animate-spin" />
              ) : (
                "Connect Wallet"
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
          className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h4 className="font-semibold text-green-900 text-sm">
                Wallet Connected
              </h4>
              <p className="text-xs text-green-700 font-mono">
                {account.substring(0, 6)}...{account.substring(38)}
              </p>
            </div>
          </div>
          <button
            onClick={copyAddress}
            className="text-green-600 hover:text-green-700 p-2 hover:bg-green-100 rounded-lg transition"
          >
            {copied ? (
              <Check className="w-4 h-4" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </button>
        </motion.div>
      )}

      {/* Record Donation Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-red-100"
      >
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <Droplets className="w-5 h-5 mr-2 text-red-500" />
          Record New Donation
        </h3>
        <form onSubmit={handleRecordDonation} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Donor Selection */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select Donor
              </label>
              <select
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
                <option value="">Choose a donor...</option>
                {donors.map((donor) => (
                  <option key={donor._id} value={donor._id}>
                    {donor.firstName} {donor.lastName} (
                    {donor.donorInfo?.bloodGroup || "N/A"})
                  </option>
                ))}
              </select>
            </div>

            {/* Blood Type */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Blood Type
              </label>
              <select
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
                <option value="">Select blood type...</option>
                {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(
                  (type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  )
                )}
              </select>
            </div>

            {/* Units */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Units (1-10)
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
                className="w-full bg-red-50 border border-red-200 rounded-lg px-3 py-3 focus:ring-2 focus:ring-red-400 outline-none"
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
            disabled={isLoading || !isConnected}
            className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2 hover:from-red-600 hover:to-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {isLoading ? (
              <Loader className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <CheckCircle className="w-5 h-5" />
                Record Donation
              </>
            )}
          </motion.button>
        </form>
      </motion.div>

      {/* Donor Management */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-gray-200"
      >
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <Users className="w-5 h-5 mr-2 text-blue-500" />
          Registered Donors ({donors.length})
        </h3>
        {donors.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            No donors registered yet
          </p>
        ) : (
          <Table
            headers={["Name", "Blood Type", "Last Donation", "Total Donations"]}
            data={donors}
            rowRenderer={(donor) => (
              <>
                <td className="py-3 px-4 font-medium">
                  {donor.firstName} {donor.lastName}
                </td>
                <td className="py-3 px-4">
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-700 rounded-full text-sm font-semibold">
                    <Droplets className="w-3 h-3" />
                    {donor.donorInfo?.bloodGroup || "N/A"}
                  </span>
                </td>
                <td className="py-3 px-4 text-sm text-gray-600">
                  {donor.donorInfo?.lastDonationDate
                    ? new Date(
                        donor.donorInfo.lastDonationDate
                      ).toLocaleDateString()
                    : "Never"}
                </td>
                <td className="py-3 px-4">
                  <span className="font-semibold text-green-600">
                    {donor.donorInfo?.donationCount || 0}
                  </span>
                </td>
              </>
            )}
          />
        )}
      </motion.div>

      {/* Blood Supply Requests */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-gray-200"
      >
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <FileText className="w-5 h-5 mr-2 text-green-500" />
          Blood Supply Requests ({requests.length})
        </h3>
        <div className="space-y-3">
          {requests.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No requests yet</p>
          ) : (
            requests.map((request) => (
              <div
                key={request._id}
                className="flex flex-col md:flex-row md:items-center md:justify-between p-4 bg-gradient-to-r from-red-50 to-pink-50 rounded-lg border border-red-100"
              >
                <div className="flex-1 mb-3 md:mb-0">
                  <h4 className="font-semibold text-gray-900">
                    {request.hospitalName}
                  </h4>
                  <div className="flex flex-wrap items-center gap-3 mt-1 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <Droplets className="w-4 h-4 text-red-500" />
                      {request.bloodType}
                    </span>
                    <span className="flex items-center gap-1">
                      <Package className="w-4 h-4 text-blue-500" />
                      {request.quantity} units
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4 text-gray-500" />
                      {request.createdAt}
                    </span>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
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
                  <div className="flex items-center gap-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() =>
                        handleRequestAction(request._id, "Approved")
                      }
                      disabled={isLoading || !isConnected}
                      className="px-4 py-2 bg-green-500 text-white rounded-lg text-sm font-medium hover:bg-green-600 disabled:opacity-50 flex items-center gap-1"
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
                      className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600 disabled:opacity-50 flex items-center gap-1"
                    >
                      <XCircle className="w-4 h-4" />
                      Reject
                    </motion.button>
                  </div>
                )}
              </div>
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
        className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-gray-200"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold flex items-center">
            <Droplets className="w-5 h-5 mr-2 text-red-500" />
            Blood Inventory Status
          </h3>
          <div className="text-sm text-gray-500">
            Total:{" "}
            <strong className="text-red-600">
              {getTotalBloodUnits()} units
            </strong>
          </div>
        </div>

        {bloodInventory.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            No blood inventory yet. Record donations to build inventory.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {bloodInventory.map((blood) => (
              <motion.div
                key={blood._id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="border-2 border-red-100 rounded-xl p-5 bg-gradient-to-br from-red-50 to-pink-50 hover:shadow-lg transition-all"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="text-2xl font-bold text-gray-800">
                      {blood.bloodType}
                    </h4>
                    <p className="text-3xl font-bold text-red-600 mt-1">
                      {blood.units}
                    </p>
                    <p className="text-xs text-gray-500">units available</p>
                  </div>
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                    <Droplets className="w-6 h-6 text-red-500" />
                  </div>
                </div>
                <div className="space-y-2">
                  <div
                    className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${getDemandColor(
                      blood.demand
                    )}`}
                  >
                    {blood.demand} Demand
                  </div>
                  <p className="text-xs text-gray-600 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
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

  // ============ RENDER TRANSACTIONS ============
  const renderTransactions = () => {
    const blockchainTxs = [
      {
        txHash: "0xabc123...def456",
        type: "Donation Recorded",
        bloodType: "O+",
        quantity: 2,
        timestamp: new Date().toISOString(),
        status: "Confirmed",
      },
      {
        txHash: "0xdef456...ghi789",
        type: "Supply Request",
        bloodType: "A-",
        quantity: 3,
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        status: "Pending",
      },
    ];

    return (
      <div className="p-6 space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-gray-200"
        >
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold flex items-center">
              <Database className="w-5 h-5 mr-2 text-blue-500" />
              Blockchain Transactions
            </h3>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>Live on Hardhat</span>
            </div>
          </div>

          {blockchainTxs.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              No blockchain transactions yet
            </p>
          ) : (
            <Table
              headers={[
                "Tx Hash",
                "Type",
                "Blood Type",
                "Qty",
                "Time",
                "Status",
              ]}
              data={blockchainTxs}
              rowRenderer={(tx) => (
                <>
                  <td className="py-3 px-4">
                    <a
                      href={`https://hardhat.explorer/${tx.txHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-mono text-blue-600 hover:underline flex items-center gap-1"
                    >
                      {tx.txHash.substring(0, 10)}...
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </td>
                  <td className="py-3 px-4 text-sm">{tx.type}</td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center gap-1">
                      <Droplets className="w-4 h-4 text-red-500" />
                      {tx.bloodType}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-semibold">{tx.quantity}</td>
                  <td className="py-3 px-4 text-xs text-gray-500">
                    {new Date(tx.timestamp).toLocaleString()}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold ${
                        tx.status === "Confirmed"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {tx.status}
                    </span>
                  </td>
                </>
              )}
            />
          )}
        </motion.div>
      </div>
    );
  };

  // ============ RENDER PROFILE ============
  const renderProfile = () => (
    <div className="p-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-gray-200"
      >
        <h3 className="text-lg font-semibold mb-6 flex items-center">
          <Users className="w-5 h-5 mr-2 text-blue-500" />
          Blood Bank Profile
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500 mb-1">Blood Bank Name</p>
              <p className="font-semibold text-gray-900">
                {userData?.bloodBankInfo?.name || "N/A"}
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500 mb-1">Email</p>
              <p className="font-semibold text-gray-900">{userData?.email}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500 mb-1">Role</p>
              <p className="font-semibold text-gray-900">{userData?.role}</p>
            </div>
          </div>
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500 mb-1">Location</p>
              <p className="font-semibold text-gray-900">
                {userData?.bloodBankInfo?.location || "N/A"}
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500 mb-1">Contact Number</p>
              <p className="font-semibold text-gray-900">
                {userData?.bloodBankInfo?.contactNumber || "N/A"}
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500 mb-1">Storage Capacity</p>
              <p className="font-semibold text-gray-900">
                {userData?.bloodBankInfo?.bloodStorageCapacity || "N/A"} units
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Security Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-gray-200"
      >
        <h3 className="text-lg font-semibold mb-6 flex items-center">
          <Lock className="w-5 h-5 mr-2 text-green-500" />
          Privacy & Security
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { icon: Lock, text: "End-to-End Encrypted", color: "green" },
            { icon: Database, text: "Blockchain Verified", color: "blue" },
            { icon: Shield, text: "HIPAA Compliant", color: "purple" },
          ].map((item, index) => (
            <div
              key={index}
              className={`flex items-center gap-3 p-4 bg-${item.color}-50 border border-${item.color}-100 rounded-lg`}
            >
              <item.icon className={`w-6 h-6 text-${item.color}-600`} />
              <span className="text-sm font-medium text-gray-700">
                {item.text}
              </span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );

  // ============ RENDER CONTENT ============
  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="p-6 flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader className="w-8 h-8 text-red-500 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      );
    }

    switch (activeTab) {
      case "dashboard":
        return renderDashboard();
      case "inventory":
        return renderInventory();
      case "transactions":
        return renderTransactions();
      case "profile":
        return renderProfile();
      default:
        return renderDashboard();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-pink-50 to-red-50">
      {/* Background Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particles.map((particle) => (
          <BloodDroplet key={particle.id} particle={particle} />
        ))}
      </div>

      <Header
        userType={userType}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        notifications={notifications}
        connectWallet={handleConnectWallet}
        connectedWallet={isConnected}
        isLoading={walletLoading}
      />

      <NotificationMessage success={success} error={error} />

      <main className="relative max-w-7xl mx-auto pt-20">
        {renderContent()}
      </main>
    </div>
  );
};

export default BloodBankDashboard;
