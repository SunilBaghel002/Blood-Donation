import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  Database,
  Gift,
  Users,
  Lock,
  CheckCircle,
  AlertCircle,
  Droplets,
  RefreshCw,
  Loader,
  X,
  Clock,
  Package,
  ExternalLink,
  Copy,
  Check,
  Building,
  Phone,
  Mail,
  MapPin,
  Edit3,
  Save,
  Shield,
  Zap,
  Award,
  TrendingUp,
} from "lucide-react";
import Header from "../components/Header";
import BloodDroplet from "../components/BloodDroplet";
import MetricCard from "../components/MetricCard";
import Table from "../components/Table";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const HospitalDashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [userType] = useState("Hospital");
  const [connectedWallet, setConnectedWallet] = useState(null);
  const [notifications, setNotifications] = useState(0);
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [requests, setRequests] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [bloodBanks, setBloodBanks] = useState([]);
  const [bloodRequest, setBloodRequest] = useState({
    bloodBankId: "",
    bloodType: "",
    quantity: 1,
  });
  const [rewards] = useState({ points: 50, badges: ["Trusted Hospital"] });
  const [particles, setParticles] = useState([]);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [copied, setCopied] = useState(false);

  // Generate particles
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

  // Fetch user data on mount
  useEffect(() => {
    const fetchUserData = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Please log in to access the dashboard");

        const response = await fetch(`${API_URL}/api/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();

        if (!response.ok)
          throw new Error(data.error || "Failed to fetch user data");

        setUserData(data.user);
        if (data.user.walletAddress) {
          setConnectedWallet(data.user.walletAddress);
        }

        await fetchHospitalData(token);
        await fetchBloodBanks(token);
      } catch (err) {
        console.error("❌ Fetch user error:", err);
        setError(err.message || "Unable to fetch user data. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchUserData();
  }, []);

  // Fetch blood banks
  const fetchBloodBanks = async (token) => {
    try {
      const response = await fetch(`${API_URL}/api/bloodbank/registered`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();

      if (!response.ok)
        throw new Error(data.error || "Failed to fetch blood banks");

      setBloodBanks(
        data.bloodBanks?.map((bank) => ({
          _id: bank._id,
          name: bank.bloodBankInfo?.name || "Unknown",
          location: bank.bloodBankInfo?.location || "N/A",
          contactNumber: bank.bloodBankInfo?.contactNumber || "N/A",
        })) || []
      );
    } catch (err) {
      console.error("❌ Fetch blood banks error:", err);
      setError(err.message || "Unable to fetch blood banks.");
    }
  };

  // Fetch hospital data
  const fetchHospitalData = async (token) => {
    try {
      const [requestsRes, transactionsRes] = await Promise.all([
        fetch(`${API_URL}/api/hospital/requests`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${API_URL}/api/hospital/transactions`, {
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
        requestsData.requests?.map((req) => ({
          _id: req._id,
          bloodBankName: req.bloodBankId?.bloodBankInfo?.name || "Unknown",
          bloodType: req.bloodType,
          quantity: req.quantity,
          status: req.status,
          createdAt: new Date(req.createdAt).toLocaleDateString(),
          blockchainId: req.blockchainId,
        })) || []
      );

      setTransactions(
        transactionsData.transactions?.map((tx) => ({
          _id: tx._id,
          txHash: tx.txHash || tx.transactionHash || tx.hash || "N/A",
          bloodType: tx.bloodType,
          quantity: tx.quantity,
          status: tx.status,
          timestamp: tx.timestamp,
          type: tx.type,
        })) || []
      );
    } catch (err) {
      console.error("❌ Fetch hospital data error:", err);
      setError(err.message || "Unable to fetch hospital data.");
    }
  };

  // Connect wallet
  const connectWallet = async () => {
    if (typeof window.ethereum === "undefined") {
      setError("Please install MetaMask to connect your wallet");
      return;
    }

    setIsLoading(true);
    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      const walletAddress = accounts[0];

      const response = await fetch(`${API_URL}/api/auth/connect-wallet`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ walletAddress }),
      });

      const data = await response.json();

      if (!response.ok)
        throw new Error(data.error || "Failed to connect wallet");

      setConnectedWallet(walletAddress);
      setSuccess("✅ Wallet connected successfully!");
    } catch (err) {
      console.error("❌ Wallet connection error:", err);
      setError(err.message || "Unable to connect wallet. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle blood request
  const handleBloodRequest = async (e) => {
    e.preventDefault();

    if (!bloodRequest.bloodBankId) {
      setError("Please select a blood bank");
      return;
    }

    if (!bloodRequest.bloodType) {
      setError("Please select a blood type");
      return;
    }

    if (bloodRequest.quantity < 1) {
      setError("Quantity must be at least 1");
      return;
    }

    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(`${API_URL}/api/hospital/request-blood`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          bloodBankId: bloodRequest.bloodBankId,
          bloodType: bloodRequest.bloodType,
          quantity: parseInt(bloodRequest.quantity),
        }),
      });

      const data = await response.json();
      console.log("📥 Blood request response:", data);

      if (!response.ok) {
        throw new Error(
          data.error || data.details || "Failed to submit blood request"
        );
      }

      setSuccess("✅ Blood request submitted successfully!");

      // Add new request to list
      setRequests((prev) => [
        {
          _id: data.request._id,
          bloodBankName:
            bloodBanks.find((b) => b._id === bloodRequest.bloodBankId)?.name ||
            "Unknown",
          bloodType: bloodRequest.bloodType,
          quantity: bloodRequest.quantity,
          status: data.request.status || "Pending",
          createdAt: new Date().toLocaleDateString(),
          blockchainId: data.txHash,
        },
        ...prev,
      ]);

      // Reset form
      setBloodRequest({ bloodBankId: "", bloodType: "", quantity: 1 });
    } catch (err) {
      console.error("❌ Blood request error:", err);
      setError(
        err.message || "Unable to submit blood request. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Refresh data
  const handleRefresh = async () => {
    setIsLoading(true);
    const token = localStorage.getItem("token");
    await fetchHospitalData(token);
    await fetchBloodBanks(token);
    setSuccess("✅ Data refreshed!");
    setIsLoading(false);
  };

  // Copy to clipboard
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleString();
  };

  // ============ RENDER DASHBOARD ============
  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ scale: 1.05 }}
          className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-2xl p-6 text-white shadow-lg"
        >
          <div className="flex items-center justify-between mb-4">
            <Clock className="w-10 h-10 opacity-80" />
            <div className="text-3xl font-bold">
              {requests.filter((r) => r.status === "Pending").length}
            </div>
          </div>
          <p className="text-yellow-100 font-medium">Pending Requests</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          whileHover={{ scale: 1.05 }}
          className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-lg"
        >
          <div className="flex items-center justify-between mb-4">
            <CheckCircle className="w-10 h-10 opacity-80" />
            <div className="text-3xl font-bold">
              {requests.filter((r) => r.status === "Approved").length}
            </div>
          </div>
          <p className="text-green-100 font-medium">Approved Requests</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          whileHover={{ scale: 1.05 }}
          className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg"
        >
          <div className="flex items-center justify-between mb-4">
            <Database className="w-10 h-10 opacity-80" />
            <div className="text-3xl font-bold">{transactions.length}</div>
          </div>
          <p className="text-blue-100 font-medium">Transactions</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          whileHover={{ scale: 1.05 }}
          className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg"
        >
          <div className="flex items-center justify-between mb-4">
            <Gift className="w-10 h-10 opacity-80" />
            <div className="text-3xl font-bold">{rewards.points}</div>
          </div>
          <p className="text-purple-100 font-medium">Reward Points</p>
        </motion.div>
      </div>

      {/* Wallet Status */}
      {!connectedWallet ? (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-300 rounded-2xl p-6 flex items-start gap-4 shadow-lg"
        >
          <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center flex-shrink-0">
            <AlertCircle className="w-6 h-6 text-yellow-900" />
          </div>
          <div className="flex-1">
            <h4 className="font-bold text-yellow-900 text-lg mb-2">
              Wallet Not Connected
            </h4>
            <p className="text-yellow-800 mb-4">
              Connect your wallet to enable blockchain features.
            </p>
            <button
              onClick={connectWallet}
              disabled={isLoading}
              className="bg-yellow-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-yellow-700 disabled:opacity-50 flex items-center gap-2"
            >
              {isLoading ? (
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
      ) : (
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
                {connectedWallet.substring(0, 8)}...
                {connectedWallet.substring(38)}
              </p>
            </div>
          </div>
          <button
            onClick={() => copyToClipboard(connectedWallet)}
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

      {/* Request Blood Form */}
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
            Request Blood
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

        <form onSubmit={handleBloodRequest} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Blood Bank Selection */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Select Blood Bank *
              </label>
              <select
                value={bloodRequest.bloodBankId}
                onChange={(e) =>
                  setBloodRequest({
                    ...bloodRequest,
                    bloodBankId: e.target.value,
                  })
                }
                className="w-full bg-red-50 border-2 border-red-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-red-400 outline-none font-medium"
                required
              >
                <option value="">Choose a blood bank...</option>
                {bloodBanks.map((bank) => (
                  <option key={bank._id} value={bank._id}>
                    {bank.name} - {bank.location}
                  </option>
                ))}
              </select>
            </div>

            {/* Blood Type Selection */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Blood Type *
              </label>
              <select
                value={bloodRequest.bloodType}
                onChange={(e) =>
                  setBloodRequest({
                    ...bloodRequest,
                    bloodType: e.target.value,
                  })
                }
                className="w-full bg-red-50 border-2 border-red-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-red-400 outline-none font-medium"
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

            {/* Quantity */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Quantity (Units) *
              </label>
              <input
                type="number"
                value={bloodRequest.quantity}
                onChange={(e) =>
                  setBloodRequest({
                    ...bloodRequest,
                    quantity: parseInt(e.target.value) || 1,
                  })
                }
                className="w-full bg-red-50 border-2 border-red-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-red-400 outline-none font-medium"
                min="1"
                max="100"
                required
              />
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-3 hover:from-red-600 hover:to-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-lg"
          >
            {isLoading ? (
              <>
                <Loader className="w-6 h-6 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <FileText className="w-6 h-6" />
                Submit Blood Request
              </>
            )}
          </motion.button>
        </form>
      </motion.div>

      {/* Blood Requests Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-xl p-8 border-2 border-blue-100"
      >
        <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <FileText className="w-6 h-6 text-blue-600" />
          </div>
          Blood Requests ({requests.length})
        </h3>

        {requests.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <Package className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p className="text-lg">No requests yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b-2 border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">
                    Blood Bank
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">
                    Blood Type
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">
                    Quantity
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody>
                {requests.map((req) => (
                  <tr
                    key={req._id}
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {req.bloodBankName}
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-2 px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-bold">
                        <Droplets className="w-4 h-4" />
                        {req.bloodType}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-bold">{req.quantity}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold ${
                          req.status === "Approved"
                            ? "bg-green-100 text-green-700"
                            : req.status === "Rejected"
                            ? "bg-red-100 text-red-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {req.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{req.createdAt}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>
    </div>
  );

  // ============ RENDER TRANSACTIONS ============
  const renderTransactions = () => (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-xl p-8 border-2 border-blue-100"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Database className="w-6 h-6 text-blue-600" />
            </div>
            Blockchain Transactions
          </h3>
          <div className="flex items-center gap-2 text-sm">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <span className="font-medium text-green-600">Live on Ethereum</span>
          </div>
        </div>

        {transactions.length === 0 ? (
          <div className="text-center py-16 text-gray-500">
            <Database className="w-20 h-20 mx-auto mb-4 text-gray-300" />
            <p className="text-xl font-medium mb-2">No transactions yet</p>
            <p className="text-gray-400">
              Transactions will appear here when processed
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
                    Blood Type
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">
                    Quantity
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
                {transactions.map((tx) => (
                  <tr
                    key={tx._id}
                    className="border-b border-gray-100 hover:bg-blue-50"
                  >
                    <td className="px-6 py-4">
                      {tx.txHash && tx.txHash !== "N/A" ? (
                        <div className="flex items-center gap-2">
                          <code className="text-sm bg-blue-100 px-2 py-1 rounded font-mono">
                            {tx.txHash.substring(0, 10)}...
                          </code>
                          <a
                            href={`https://etherscan.io/tx/${tx.txHash}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        </div>
                      ) : (
                        <span className="text-gray-400">N/A</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-semibold">
                        {tx.type}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-2 px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-bold">
                        <Droplets className="w-4 h-4" />
                        {tx.bloodType}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-bold">{tx.quantity}</td>
                    <td className="px-6 py-4 text-gray-600 text-sm">
                      {formatDate(tx.timestamp)}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold ${
                          tx.status === "Confirmed"
                            ? "bg-green-100 text-green-700"
                            : tx.status === "Pending"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-gray-100 text-gray-700"
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
        )}
      </motion.div>
    </div>
  );

  // ============ RENDER PROFILE ============
  const renderProfile = () => (
    <div className="space-y-6">
      {/* Profile Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 rounded-2xl p-8 text-white shadow-xl"
      >
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center border-4 border-white/30">
            <Building className="w-12 h-12 text-white" />
          </div>
          <div className="text-center md:text-left">
            <h2 className="text-3xl font-bold mb-2">
              {userData?.hospitalInfo?.name || "Hospital"}
            </h2>
            <p className="text-blue-100 flex items-center justify-center md:justify-start gap-2">
              <Mail className="w-4 h-4" />
              {userData?.email}
            </p>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mt-3">
              <span className="px-4 py-1 bg-white/20 rounded-full text-sm font-medium flex items-center gap-2">
                <Shield className="w-4 h-4" />
                Verified Hospital
              </span>
              {connectedWallet && (
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
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl p-8 border-2 border-gray-100"
        >
          <h3 className="text-xl font-bold text-gray-900 flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            Hospital Information
          </h3>

          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
              <Building className="w-5 h-5 text-gray-500" />
              <div>
                <p className="text-sm text-gray-500">Hospital Name</p>
                <p className="font-medium text-gray-900">
                  {userData?.hospitalInfo?.name || "Not set"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
              <MapPin className="w-5 h-5 text-gray-500" />
              <div>
                <p className="text-sm text-gray-500">Location</p>
                <p className="font-medium text-gray-900">
                  {userData?.hospitalInfo?.location || "Not set"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
              <Phone className="w-5 h-5 text-gray-500" />
              <div>
                <p className="text-sm text-gray-500">Contact Number</p>
                <p className="font-medium text-gray-900">
                  {userData?.hospitalInfo?.contactNumber || "Not set"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
              <TrendingUp className="w-5 h-5 text-gray-500" />
              <div>
                <p className="text-sm text-gray-500">Bed Count</p>
                <p className="font-medium text-gray-900">
                  {userData?.hospitalInfo?.bedCount || "Not set"}
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Privacy & Security */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl shadow-xl p-8 border-2 border-gray-100"
        >
          <h3 className="text-xl font-bold text-gray-900 flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Lock className="w-5 h-5 text-green-600" />
            </div>
            Privacy & Security
          </h3>

          <div className="space-y-4">
            {[
              "Personal Data Encrypted",
              "IPFS Document Storage",
              "Blockchain Verified",
            ].map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-green-50 rounded-xl"
              >
                <span className="font-medium text-gray-700">{item}</span>
                <CheckCircle className="w-5 h-5 text-green-500" />
              </div>
            ))}

            <div className="bg-blue-50 p-4 rounded-xl mt-4">
              <h4 className="font-medium text-blue-800 mb-2">
                Data Protection
              </h4>
              <p className="text-sm text-blue-600">
                Your information is encrypted and stored off-chain in MongoDB,
                while only verification hashes and metadata are stored on the
                Ethereum blockchain.
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Wallet & Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-2xl shadow-xl p-8 border-2 border-purple-100"
      >
        <h3 className="text-xl font-bold text-gray-900 flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
            <Award className="w-5 h-5 text-purple-600" />
          </div>
          Statistics & Rewards
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center p-6 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl border-2 border-yellow-100">
            <Gift className="w-10 h-10 text-yellow-500 mx-auto mb-3" />
            <p className="text-3xl font-bold text-gray-900">{rewards.points}</p>
            <p className="text-sm text-gray-500">Reward Points</p>
          </div>
          <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border-2 border-blue-100">
            <FileText className="w-10 h-10 text-blue-500 mx-auto mb-3" />
            <p className="text-3xl font-bold text-gray-900">
              {requests.length}
            </p>
            <p className="text-sm text-gray-500">Total Requests</p>
          </div>
          <div className="text-center p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border-2 border-green-100">
            <CheckCircle className="w-10 h-10 text-green-500 mx-auto mb-3" />
            <p className="text-3xl font-bold text-gray-900">
              {requests.filter((r) => r.status === "Approved").length}
            </p>
            <p className="text-sm text-gray-500">Approved</p>
          </div>
          <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl border-2 border-purple-100">
            <Database className="w-10 h-10 text-purple-500 mx-auto mb-3" />
            <p className="text-3xl font-bold text-gray-900">
              {transactions.length}
            </p>
            <p className="text-sm text-gray-500">Blockchain Txns</p>
          </div>
        </div>

        {/* Badges */}
        <div className="mt-6 p-4 bg-gray-50 rounded-xl">
          <h4 className="font-medium text-gray-700 mb-3">Badges Earned</h4>
          <div className="flex flex-wrap gap-2">
            {rewards.badges.map((badge, index) => (
              <span
                key={index}
                className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full text-sm font-medium"
              >
                🏆 {badge}
              </span>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );

  // ============ RENDER CONTENT ============
  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return renderDashboard();
      case "transactions":
        return renderTransactions();
      case "profile":
        return renderProfile();
      default:
        return renderDashboard();
    }
  };

  // ============ MAIN RENDER ============
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Background Particles */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute rounded-full bg-blue-200 opacity-30"
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

      {/* Header - Pass user prop */}
      <Header
        userType={userType}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        notifications={notifications}
        connectWallet={connectWallet}
        connectedWallet={connectedWallet}
        isLoading={isLoading}
        user={userData}
      />

      {/* Notification Messages */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-24 left-1/2 transform -translate-x-1/2 z-50"
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
            className="fixed top-24 left-1/2 transform -translate-x-1/2 z-50"
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
      <main className="max-w-7xl mx-auto px-4 py-8 relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
};

export default HospitalDashboard;
