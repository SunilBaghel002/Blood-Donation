import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FileText,
  Database,
  Gift,
  Users,
  Lock,
  CheckCircle,
} from "lucide-react";
import Header from "../components/Header";
import BloodDroplet from "../components/BloodDroplet";
import NotificationMessage from "../components/NotificationMessage";
import MetricCard from "../components/MetricCard";
import Table from "../components/Table";

const HospitalDashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [userType] = useState("Hospital");
  const [connectedWallet, setConnectedWallet] = useState(false);
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

  useEffect(() => {
    if (success || error) {
      const timer = setTimeout(() => {
        setSuccess("");
        setError("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [success, error]);

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
        await fetchHospitalData(token);
        await fetchBloodBanks(token);
      } catch (err) {
        setError(err.message || "Unable to fetch user data. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchUserData();
  }, []);

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
      setTransactions(transactionsData.transactions || []);
    } catch (err) {
      setError(
        err.message || "Unable to fetch hospital data. Please try again."
      );
    }
  };

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
        throw new Error(data.error || "Failed to submit blood request");
      setSuccess("Blood request submitted successfully");
      setRequests((prev) => [
        ...prev,
        {
          _id: data.request._id,
          bloodBankName:
            bloodBanks.find((b) => b._id === bloodRequest.bloodBankId)?.name ||
            "Unknown",
          bloodType: bloodRequest.bloodType,
          quantity: bloodRequest.quantity,
          status: data.request.status,
          createdAt: new Date(data.request.createdAt).toLocaleDateString(),
        },
      ]);
      setBloodRequest({ bloodBankId: "", bloodType: "", quantity: 1 });
    } catch (err) {
      setError(
        err.message || "Unable to submit blood request. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const renderDashboard = () => (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricCard
          label="Pending Requests"
          value={requests.filter((r) => r.status === "Pending").length}
          icon={FileText}
          color="border-red-500"
          index={0}
        />
        <MetricCard
          label="Approved Requests"
          value={requests.filter((r) => r.status === "Approved").length}
          icon={CheckCircle}
          color="border-green-500"
          index={1}
        />
        <MetricCard
          label="Reward Points"
          value={rewards.points}
          icon={Gift}
          color="border-blue-500"
          index={2}
        />
      </div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/80 backdrop-blur-md rounded-xl shadow-lg p-6"
      >
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <FileText className="w-5 h-5 mr-2 text-red-500" />
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
              htmlFor="bloodType"
              className="absolute -top-2 left-3 text-sm text-gray-500 bg-white px-1 transition-all duration-300"
            >
              Blood Type
            </label>
            <select
              id="bloodType"
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
              Quantity (Units)
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
                <FileText className="w-4 h-4" />
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
          <FileText className="w-5 h-5 mr-2 text-blue-500" />
          Blood Requests
        </h3>
        <Table
          headers={["Blood Bank", "Blood Type", "Quantity", "Status", "Date"]}
          data={requests}
          rowRenderer={(req) => (
            <>
              <td className="py-3 px-4">{req.bloodBankName}</td>
              <td className="py-3 px-4">{req.bloodType}</td>
              <td className="py-3 px-4">{req.quantity}</td>
              <td className="py-3 px-4">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    req.status === "Approved"
                      ? "bg-green-100 text-green-800"
                      : req.status === "Rejected"
                      ? "bg-red-100 text-red-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {req.status}
                </span>
              </td>
              <td className="py-3 px-4">{req.createdAt}</td>
            </>
          )}
        />
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
        <Table
          headers={[
            "Transaction Hash",
            "Blood Type",
            "Quantity",
            "Timestamp",
            "Status",
          ]}
          data={transactions}
          rowRenderer={(tx) => (
            <>
              <td className="py-3 px-4">
                <code className="text-sm bg-red-100 px-2 py-1 rounded">
                  {tx.txHash?.substring(0, 10) || "N/A"}...
                </code>
              </td>
              <td className="py-3 px-4">
                <span className="inline-flex items-center">
                  <FileText className="w-4 h-4 text-red-500 mr-1" />
                  {tx.bloodType}
                </span>
              </td>
              <td className="py-3 px-4">{tx.quantity}</td>
              <td className="py-3 px-4 text-gray-500">
                {tx.timestamp ? new Date(tx.timestamp).toLocaleString() : "N/A"}
              </td>
              <td className="py-3 px-4">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    tx.status === "Confirmed"
                      ? "bg-green-100 text-green-800"
                      : tx.status === "Pending"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {tx.status}
                </span>
              </td>
            </>
          )}
        />
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
            <strong>Name:</strong> {userData?.hospitalInfo?.name || "N/A"}
          </p>
          <p className="text-gray-500">
            <strong>Email:</strong> {userData?.email}
          </p>
          <p className="text-gray-500">
            <strong>Role:</strong> {userData?.role}
          </p>
          <p className="text-gray-500">
            <strong>Location:</strong> {userData?.hospitalInfo?.location}
          </p>
          <p className="text-gray-500">
            <strong>Contact:</strong> {userData?.hospitalInfo?.contactNumber}
          </p>
          <p className="text-gray-500">
            <strong>Rewards:</strong> {rewards.points} points, Badges:{" "}
            {rewards.badges.join(", ") || "None"}
          </p>
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
              Your information is encrypted and stored off-chain in MongoDB,
              while only verification hashes and metadata are stored on the
              Ethereum blockchain.
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50 font-inter">
      <div className="absolute inset-0">
        <style>
          {`
            @keyframes float { 0%, 100% { transform: translateY(0px) scale(1); opacity: 0.3; } 50% { transform: translateY(-60px) scale(1.1); opacity: 0.6; } }
            @keyframes pulse-size { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.2); } }
            @keyframes pulse-glow { 0%, 100% { box-shadow: 0 0 10px rgba(239, 68, 68, 0.3); } 50% { box-shadow: 0 0 20px rgba(239, 68, 68, 0.5); } }
            @keyframes fade-in { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
            .animate-fade-in { animation: fade-in 0.8s ease-out forwards; }
            .animate-pulse-glow { animation: pulse-glow 2s ease-in-out infinite; }
            .parallax-bg { background-attachment: fixed; background-position: center; background-repeat: no-repeat; background-size: cover; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' fill='none'%3E%3Cpath d='M50 10C50 10 40 20 40 30C40 40 50 50 50 50C50 50 60 40 60 30C60 20 50 10 50 10Z' fill='%23f87171' fill-opacity='0.05'/%3E%3C/svg%3E"); }
            @media (max-width: 768px) { .parallax-bg { background-attachment: scroll; } }
            .floating-label-container { position: relative; margin-bottom: 1.5rem; }
            .floating-label { position: absolute; top: -0.5rem; left: 0.75rem; font-size: 0.75rem; color: #4b5563; background: #fff; padding: 0 0.25rem; transition: all 0.2s ease; pointer-events: none; }
            input:focus, select:focus { border-color: #f87171; box-shadow: 0 0 0 2px rgba(239, 68, 68, 0.2); }
            .font-inter { font-family: 'Inter', sans-serif; }
          `}
        </style>
        {particles.map((particle) => (
          <BloodDroplet key={particle.id} particle={particle} />
        ))}
      </div>
      <Header
        userType={userType}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        notifications={notifications}
        connectWallet={connectWallet}
        connectedWallet={connectedWallet}
        isLoading={isLoading}
      />
      <NotificationMessage success={success} error={error} />
      <main className="relative max-w-7xl mx-auto">{renderContent()}</main>
    </div>
  );
};

export default HospitalDashboard;
