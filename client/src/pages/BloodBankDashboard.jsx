import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Users,
  Droplets,
  FileText,
  Gift,
  Database,
  Lock,
  Clock,
  CheckCircle,
} from "lucide-react";
import Header from "../components/Header";
import BloodDroplet from "../components/BloodDroplet";
import NotificationMessage from "../components/NotificationMessage";
import MetricCard from "../components/MetricCard";
import Table from "../components/Table";

const BloodBankDashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [userType] = useState("BloodBank");
  const [connectedWallet, setConnectedWallet] = useState(false);
  const [notifications, setNotifications] = useState(0);
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [donors, setDonors] = useState([]);
  const [bloodInventory, setBloodInventory] = useState([]);
  const [requests, setRequests] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [rewards, setRewards] = useState({ points: 0, badges: [] });
  const [donationRecord, setDonationRecord] = useState({
    donorId: "",
    bloodType: "",
    units: 1,
  });
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
        await fetchBloodBankData(token);
      } catch (err) {
        setError(err.message || "Unable to fetch user data. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchUserData();
  }, []);

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
      setTransactions(requestsData.transactions || []);
      setRewards({ points: 100, badges: ["Trusted Bank"] }); // Mock data
    } catch (err) {
      setError(
        err.message || "Unable to fetch blood bank data. Please try again."
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

  const renderDashboard = () => (
    <div className="p-6 space-y-6">
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
          value={bloodInventory.reduce((sum, item) => sum + item.units, 0)}
          icon={Droplets}
          color="border-blue-500"
          index={1}
        />
        <MetricCard
          label="Pending Requests"
          value={requests.filter((r) => r.status === "Pending").length}
          icon={FileText}
          color="border-green-500"
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
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/80 backdrop-blur-md rounded-xl shadow-lg p-6"
      >
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <Users className="w-5 h-5 mr-2 text-blue-500" />
          Donor Management
        </h3>
        <Table
          headers={["Name", "Blood Type", "Last Donation"]}
          data={donors}
          rowRenderer={(donor) => (
            <>
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
            </>
          )}
        />
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
        <Table
          headers={[
            "Transaction Hash",
            "Type",
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
              <td className="py-3 px-4">{tx.type || "N/A"}</td>
              <td className="py-3 px-4">
                <span className="inline-flex items-center">
                  <Droplets className="w-4 h-4 text-red-500 mr-1" />
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
                      : tx.status === "Scheduled"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-yellow-100 text-yellow-800"
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
            <strong>Name:</strong> {userData?.bloodBankInfo?.name || "N/A"}
          </p>
          <p className="text-gray-500">
            <strong>Email:</strong> {userData?.email}
          </p>
          <p className="text-gray-500">
            <strong>Role:</strong> {userData?.role}
          </p>
          <p className="text-gray-500">
            <strong>Location:</strong> {userData?.bloodBankInfo?.location}
          </p>
          <p className="text-gray-500">
            <strong>Contact:</strong> {userData?.bloodBankInfo?.contactNumber}
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

export default BloodBankDashboard;
