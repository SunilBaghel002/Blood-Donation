import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Users,
  MapPin,
  Activity,
  Lock,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";
import Header from "../components/Header";
import BloodDroplet from "../components/BloodDroplet";
import NotificationMessage from "../components/NotificationMessage";
import MetricCard from "../components/MetricCard";
import Table from "../components/Table";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [userType] = useState("Admin");
  const [connectedWallet, setConnectedWallet] = useState(false);
  const [notifications, setNotifications] = useState(0);
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [users, setUsers] = useState([]);
  const [bloodBanks, setBloodBanks] = useState([]);
  const [systemMetrics, setSystemMetrics] = useState({
    totalUsers: 0,
    totalBloodBanks: 0,
    systemHealth: "Stable",
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
    const fetchAdminData = async () => {
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
        await fetchUsers(token);
        await fetchBloodBanks(token);
        await fetchSystemMetrics(token);
      } catch (err) {
        setError(
          err.message || "Unable to fetch admin data. Please try again."
        );
      } finally {
        setIsLoading(false);
      }
    };
    fetchAdminData();
  }, []);

  const fetchUsers = async (token) => {
    try {
      const response = await fetch("http://localhost:5000/api/admin/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to fetch users");
      setUsers(
        data.users.map((user) => ({
          _id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role,
          status: user.status || "Active",
        })) || []
      );
    } catch (err) {
      setError(err.message || "Unable to fetch users. Please try again.");
    }
  };

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
          status: bank.status || "Active",
        })) || []
      );
    } catch (err) {
      setError(err.message || "Unable to fetch blood banks. Please try again.");
    }
  };

  const fetchSystemMetrics = async (token) => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/admin/system-metrics",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await response.json();
      if (!response.ok)
        throw new Error(data.error || "Failed to fetch system metrics");
      setSystemMetrics(
        data.metrics || {
          totalUsers: 0,
          totalBloodBanks: 0,
          systemHealth: "Stable",
        }
      );
    } catch (err) {
      setError(
        err.message || "Unable to fetch system metrics. Please try again."
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

  const handleUserAction = async (userId, action) => {
    setIsLoading(true);
    try {
      const response = await fetch(
        "http://localhost:5000/api/admin/user-action",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ userId, action }),
        }
      );
      const data = await response.json();
      if (!response.ok)
        throw new Error(data.error || `Failed to ${action} user`);
      setSuccess(`User ${action} successfully`);
      setUsers((prev) =>
        prev.map((user) =>
          user._id === userId
            ? {
                ...user,
                status: action === "Activate" ? "Active" : "Suspended",
              }
            : user
        )
      );
    } catch (err) {
      setError(err.message || `Unable to ${action} user. Please try again.`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBloodBankAction = async (bloodBankId, action) => {
    setIsLoading(true);
    try {
      const response = await fetch(
        "http://localhost:5000/api/admin/bloodbank-action",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ bloodBankId, action }),
        }
      );
      const data = await response.json();
      if (!response.ok)
        throw new Error(data.error || `Failed to ${action} blood bank`);
      setSuccess(`Blood bank ${action} successfully`);
      setBloodBanks((prev) =>
        prev.map((bank) =>
          bank._id === bloodBankId
            ? { ...bank, status: action === "Approve" ? "Active" : "Suspended" }
            : bank
        )
      );
    } catch (err) {
      setError(
        err.message || `Unable to ${action} blood bank. Please try again.`
      );
    } finally {
      setIsLoading(false);
    }
  };

  const renderDashboard = () => (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricCard
          label="Total Users"
          value={systemMetrics.totalUsers}
          icon={Users}
          color="border-red-500"
          index={0}
        />
        <MetricCard
          label="Total Blood Banks"
          value={systemMetrics.totalBloodBanks}
          icon={MapPin}
          color="border-blue-500"
          index={1}
        />
        <MetricCard
          label="System Health"
          value={systemMetrics.systemHealth}
          icon={Activity}
          color="border-green-500"
          index={2}
        />
      </div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/80 backdrop-blur-md rounded-xl shadow-lg p-6"
      >
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <Users className="w-5 h-5 mr-2 text-blue-500" />
          User Management
        </h3>
        <Table
          headers={["Name", "Email", "Role", "Status", "Actions"]}
          data={users}
          rowRenderer={(user) => (
            <>
              <td className="py-3 px-4">
                {user.firstName} {user.lastName}
              </td>
              <td className="py-3 px-4">{user.email}</td>
              <td className="py-3 px-4">{user.role}</td>
              <td className="py-3 px-4">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    user.status === "Active"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {user.status}
                </span>
              </td>
              <td className="py-3 px-4">
                <div className="flex space-x-2">
                  {user.status === "Active" ? (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleUserAction(user._id, "Suspend")}
                      className="px-3 py-1 bg-red-500 text-white rounded-lg text-sm"
                    >
                      Suspend
                    </motion.button>
                  ) : (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleUserAction(user._id, "Activate")}
                      className="px-3 py-1 bg-green-500 text-white rounded-lg text-sm"
                    >
                      Activate
                    </motion.button>
                  )}
                </div>
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
          <MapPin className="w-5 h-5 mr-2 text-red-500" />
          Blood Bank Management
        </h3>
        <Table
          headers={["Name", "Location", "Contact", "Status", "Actions"]}
          data={bloodBanks}
          rowRenderer={(bank) => (
            <>
              <td className="py-3 px-4">{bank.name}</td>
              <td className="py-3 px-4">{bank.location}</td>
              <td className="py-3 px-4">{bank.contactNumber}</td>
              <td className="py-3 px-4">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    bank.status === "Active"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {bank.status}
                </span>
              </td>
              <td className="py-3 px-4">
                <div className="flex space-x-2">
                  {bank.status === "Active" ? (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleBloodBankAction(bank._id, "Suspend")}
                      className="px-3 py-1 bg-red-500 text-white rounded-lg text-sm"
                    >
                      Suspend
                    </motion.button>
                  ) : (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleBloodBankAction(bank._id, "Approve")}
                      className="px-3 py-1 bg-green-500 text-white rounded-lg text-sm"
                    >
                      Approve
                    </motion.button>
                  )}
                </div>
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
          <Activity className="w-5 h-5 mr-2 text-green-500" />
          System Health
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-green-50/50 rounded-lg flex items-center justify-between">
            <span className="text-sm font-medium text-gray-500">
              API Status
            </span>
            <span className="text-sm font-medium text-green-600 flex items-center">
              <CheckCircle className="w-5 h-5 mr-2" />
              Operational
            </span>
          </div>
          <div className="p-4 bg-green-50/50 rounded-lg flex items-center justify-between">
            <span className="text-sm font-medium text-gray-500">
              Blockchain Sync
            </span>
            <span className="text-sm font-medium text-green-600 flex items-center">
              <CheckCircle className="w-5 h-5 mr-2" />
              Synced
            </span>
          </div>
          <div className="p-4 bg-yellow-50/50 rounded-lg flex items-center justify-between">
            <span className="text-sm font-medium text-gray-500">
              Pending Actions
            </span>
            <span className="text-sm font-medium text-yellow-600 flex items-center">
              <AlertTriangle className="w-5 h-5 mr-2" />
              {notifications} Pending
            </span>
          </div>
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
            {`${userData?.firstName} ${userData?.lastName}`}
          </p>
          <p className="text-gray-500">
            <strong>Email:</strong> {userData?.email}
          </p>
          <p className="text-gray-500">
            <strong>Role:</strong> {userData?.role}
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

export default AdminDashboard;
