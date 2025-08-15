import React, { useState, useEffect } from "react";
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
  Eye,
  Gift,
  BookOpen,
  AlertCircle,
} from "lucide-react";

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

  // Mock data replaced with API calls
  const [bloodInventory, setBloodInventory] = useState([]);
  const [donors, setDonors] = useState([]);
  const [requests, setRequests] = useState([]);
  const [donationHistory, setDonationHistory] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [rewards, setRewards] = useState({ points: 0, badges: [] });

  // Educational content
  const educationalContent = {
    title: "Why Donate Blood?",
    articles: [
      {
        title: "The Importance of Blood Donation",
        content:
          "One blood donation can save up to three lives. Blood is needed for surgeries, trauma care, and treating chronic illnesses like cancer.",
      },
      {
        title: "Who Can Donate?",
        content:
          "Healthy adults aged 17-65, weighing at least 110 lbs, and meeting medical criteria can donate blood every 56 days.",
      },
    ],
    facts: [
      "1 donation can save up to 3 lives.",
      "Blood cannot be manufactured; it must come from donors.",
      "Every 2 seconds, someone needs blood in the U.S.",
    ],
  };

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

        // Fetch role-specific data
        if (data.user.role === "BloodBank") {
          await fetchBloodBankData(token);
        } else if (data.user.role === "Hospital") {
          await fetchHospitalData(token);
        } else if (data.user.role === "Donor") {
          await fetchDonorData(token);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  // Fetch blood bank data (donors, inventory, requests)
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

  // Fetch hospital data (requests, inventory, transactions)
  const fetchHospitalData = async (token) => {
    try {
      const [requestsRes, inventoryRes, transactionsRes] = await Promise.all([
        fetch("http://localhost:5000/api/hospital/requests", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch("http://localhost:5000/api/hospital/inventory", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch("http://localhost:5000/api/hospital/transactions", {
          headers: { Authorization: `Bearer ${token}` },
        }),
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

  // Fetch donor data (donation history, rewards)
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

      if (!historyRes.ok || !rewardsRes.ok) {
        throw new Error("Failed to fetch donor data");
      }

      setDonationHistory(historyData.history || []);
      setRewards(rewardsData.rewards || { points: 0, badges: [] });
    } catch (err) {
      setError(err.message);
    }
  };

  // Connect wallet (mock)
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
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle blood request (hospital)
  const handleBloodRequest = async (bloodType, quantity) => {
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
          body: JSON.stringify({ bloodType, quantity }),
        }
      );
      const data = await response.json();
      if (!response.ok)
        throw new Error(data.error || "Failed to request blood");
      setRequests([...requests, data.request]);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle reward issuance (hospital or blood bank)
  const issueReward = async (recipientId, points) => {
    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:5000/api/rewards/issue", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ recipientId, points }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to issue reward");
      setRewards({ ...rewards, points: rewards.points + points });
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const getDemandColor = (demand) => {
    switch (demand) {
      case "Critical":
        return "text-red-600 bg-red-50";
      case "High":
        return "text-orange-600 bg-orange-50";
      case "Medium":
        return "text-yellow-600 bg-yellow-50";
      case "Low":
        return "text-green-600 bg-green-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  const renderHeader = () => (
    <div className="bg-gradient-to-r from-red-600 to-pink-600 text-white p-6">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-white/20 rounded-lg">
            <Heart className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">BloodChain</h1>
            <p className="text-red-100">Blockchain Blood Management</p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-sm font-medium">{userType}</span>
          <div className="relative">
            <div className="p-2 bg-white/20 rounded-lg cursor-pointer">
              <Activity className="w-6 h-6" />
            </div>
            {notifications > 0 && (
              <div className="absolute -top-2 -right-2 bg-yellow-400 text-red-800 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                {notifications}
              </div>
            )}
          </div>
          <button
            onClick={connectWallet}
            disabled={isLoading}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              connectedWallet
                ? "bg-green-500 text-white"
                : "bg-white text-red-600 hover:bg-gray-50"
            }`}
          >
            {isLoading
              ? "Connecting..."
              : connectedWallet
              ? "✓ Connected"
              : "Connect Wallet"}
          </button>
        </div>
      </div>
      <div className="flex space-x-1 bg-white/10 rounded-lg p-1">
        {["dashboard", "inventory", "transactions", "profile", "education"].map(
          (tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-md font-medium capitalize transition-all ${
                activeTab === tab
                  ? "bg-white text-red-600"
                  : "text-white hover:bg-white/20"
              }`}
            >
              {tab}
            </button>
          )
        )}
      </div>
    </div>
  );

  const renderBloodBankDashboard = () => (
    <div className="p-6 space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-red-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Donors</p>
              <p className="text-2xl font-bold text-gray-800">
                {donors.length}
              </p>
            </div>
            <Users className="w-10 h-10 text-red-500" />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Blood Units</p>
              <p className="text-2xl font-bold text-gray-800">
                {bloodInventory.reduce((sum, item) => sum + item.units, 0)}
              </p>
            </div>
            <Droplets className="w-10 h-10 text-blue-500" />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Pending Requests</p>
              <p className="text-2xl font-bold text-gray-800">
                {requests.filter((r) => r.status === "Pending").length}
              </p>
            </div>
            <FileText className="w-10 h-10 text-green-500" />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Rewards Issued</p>
              <p className="text-2xl font-bold text-gray-800">
                {rewards.points}
              </p>
            </div>
            <Gift className="w-10 h-10 text-purple-500" />
          </div>
        </div>
      </div>

      {/* Donor Management */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <Users className="w-5 h-5 mr-2 text-blue-600" />
          Donor Management
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4">Name</th>
                <th className="text-left py-3 px-4">Blood Type</th>
                <th className="text-left py-3 px-4">Last Donation</th>
                <th className="text-left py-3 px-4">Action</th>
              </tr>
            </thead>
            <tbody>
              {donors.map((donor, index) => (
                <tr
                  key={index}
                  className="border-b border-gray-100 hover:bg-gray-50"
                >
                  <td className="py-3 px-4">
                    {donor.firstName} {donor.lastName}
                  </td>
                  <td className="py-3 px-4">
                    {donor.donorInfo?.bloodGroup || "N/A"}
                  </td>
                  <td className="py-3 px-4">
                    {donor.donorInfo?.lastDonationDate || "N/A"}
                  </td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => issueReward(donor._id, 10)}
                      className="text-blue-600 hover:text-blue-800 flex items-center"
                    >
                      Issue Reward <Gift className="w-4 h-4 ml-1" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Blood Supply Requests */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <FileText className="w-5 h-5 mr-2 text-green-600" />
          Blood Supply Requests
        </h3>
        <div className="space-y-3">
          {requests.map((request, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <div>
                <p className="font-medium">Hospital: {request.hospitalName}</p>
                <p className="text-sm text-gray-600">
                  Blood Type: {request.bloodType} • Quantity: {request.quantity}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <button className="px-3 py-1 bg-green-500 text-white rounded-lg">
                  Approve
                </button>
                <button className="px-3 py-1 bg-red-500 text-white rounded-lg">
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderHospitalDashboard = () => (
    <div className="p-6 space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-red-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Blood Requests</p>
              <p className="text-2xl font-bold text-gray-800">
                {requests.length}
              </p>
            </div>
            <FileText className="w-10 h-10 text-red-500" />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Blood Units Received</p>
              <p className="text-2xl font-bold text-gray-800">
                {bloodInventory.reduce((sum, item) => sum + item.units, 0)}
              </p>
            </div>
            <Droplets className="w-10 h-10 text-blue-500" />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Rewards Issued</p>
              <p className="text-2xl font-bold text-gray-800">
                {rewards.points}
              </p>
            </div>
            <Gift className="w-10 h-10 text-green-500" />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Blockchain TXs</p>
              <p className="text-2xl font-bold text-gray-800">
                {transactions.length}
              </p>
            </div>
            <Database className="w-10 h-10 text-purple-500" />
          </div>
        </div>
      </div>

      {/* Request Blood */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <FileText className="w-5 h-5 mr-2 text-blue-600" />
          Request Blood
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Blood Type
            </label>
            <select
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
              onChange={(e) => handleBloodRequest(e.target.value, 1)}
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
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Quantity (units)
            </label>
            <input
              type="number"
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
              min="1"
            />
          </div>
          <button
            onClick={() => handleBloodRequest("O+", 1)} // Example; replace with form values
            className="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors"
          >
            Submit Request
          </button>
        </div>
      </div>

      {/* Blood Usage */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <Droplets className="w-5 h-5 mr-2 text-red-600" />
          Blood Usage
        </h3>
        <div className="space-y-3">
          {transactions.map((tx, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <div>
                <p className="font-medium">Blood Type: {tx.bloodType}</p>
                <p className="text-sm text-gray-600">Used: {tx.timestamp}</p>
              </div>
              <button
                onClick={() => issueReward(tx.donorId, 5)}
                className="text-blue-600 hover:text-blue-800 flex items-center"
              >
                Issue Reward <Gift className="w-4 h-4 ml-1" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderDonorDashboard = () => (
    <div className="p-6 space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-red-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Donations</p>
              <p className="text-2xl font-bold text-gray-800">
                {donationHistory.length}
              </p>
            </div>
            <Heart className="w-10 h-10 text-red-500" />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Reward Points</p>
              <p className="text-2xl font-bold text-gray-800">
                {rewards.points}
              </p>
            </div>
            <Gift className="w-10 h-10 text-green-500" />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Badges Earned</p>
              <p className="text-2xl font-bold text-gray-800">
                {rewards.badges.length}
              </p>
            </div>
            <Shield className="w-10 h-10 text-blue-500" />
          </div>
        </div>
      </div>

      {/* Donation History */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <Heart className="w-5 h-5 mr-2 text-red-600" />
          My Donation History
        </h3>
        <div className="space-y-4">
          {donationHistory.map((donation, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="font-medium text-gray-800">{donation.date}</p>
                  <p className="text-sm text-gray-600 flex items-center">
                    <MapPin className="w-4 h-4 mr-1" />
                    {donation.location}
                  </p>
                </div>
                <div className="text-right">
                  <div className="flex items-center mb-1">
                    <Droplets className="w-4 h-4 text-red-600 mr-1" />
                    <span className="font-medium">{donation.bloodType}</span>
                  </div>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      donation.status === "Used"
                        ? "bg-green-100 text-green-800"
                        : donation.status === "In Use"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {donation.status}
                  </span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-600">
                  <strong>Impact:</strong> {donation.recipient}
                </p>
                <button className="text-blue-600 hover:text-blue-800 text-sm flex items-center">
                  <Database className="w-4 h-4 mr-1" />
                  View on Blockchain
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Schedule Donation */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <Heart className="w-5 h-5 mr-2 text-red-600" />
          Schedule Donation
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Blood Bank
            </label>
            <select className="w-full border border-gray-300 rounded-lg px-3 py-2">
              <option>City Blood Bank</option>
              <option>University Hospital Blood Center</option>
              <option>Community Health Center</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Preferred Date
            </label>
            <input
              type="date"
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            />
          </div>
          <button className="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors">
            Schedule Donation
          </button>
        </div>
      </div>
    </div>
  );

  const renderEducationTab = () => (
    <div className="p-6 space-y-6">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <BookOpen className="w-5 h-5 mr-2 text-blue-600" />
          {educationalContent.title}
        </h3>
        <div className="space-y-4">
          {educationalContent.articles.map((article, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-medium text-gray-800">{article.title}</h4>
              <p className="text-sm text-gray-600 mt-2">{article.content}</p>
            </div>
          ))}
        </div>
        <div className="mt-6">
          <h4 className="font-medium text-gray-800 mb-2">Key Facts</h4>
          <ul className="list-disc pl-5 text-sm text-gray-600 space-y-1">
            {educationalContent.facts.map((fact, index) => (
              <li key={index}>{fact}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );

  const renderInventory = () => (
    <div className="p-6 space-y-6">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <Droplets className="w-5 h-5 mr-2 text-red-600" />
          Blood Inventory Status
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {bloodInventory.map((blood, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h4 className="text-xl font-bold text-gray-800">
                    {blood.type}
                  </h4>
                  <p className="text-2xl font-bold text-red-600">
                    {blood.units} units
                  </p>
                </div>
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <Droplets className="w-6 h-6 text-red-600" />
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
                <p className="text-sm text-gray-600 flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  Expires in {blood.expiry}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderTransactions = () => (
    <div className="p-6 space-y-6">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold flex items-center">
            <Database className="w-5 h-5 mr-2 text-blue-600" />
            Blockchain Transactions
          </h3>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span>Live on Ethereum</span>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-700">
                  Transaction Hash
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">
                  Type
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">
                  Blood Type
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">
                  Timestamp
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">
                  Status
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx, index) => (
                <tr
                  key={index}
                  className="border-b border-gray-100 hover:bg-gray-50"
                >
                  <td className="py-3 px-4">
                    <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                      {tx.id}
                    </code>
                  </td>
                  <td className="py-3 px-4">{tx.type}</td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center">
                      <Droplets className="w-4 h-4 text-red-600 mr-1" />
                      {tx.bloodType}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-600">{tx.timestamp}</td>
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
                    <button className="text-blue-600 hover:text-blue-800 flex items-center">
                      View <ChevronRight className="w-4 h-4 ml-1" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderProfile = () => (
    <div className="p-6 space-y-6">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <Users className="w-5 h-5 mr-2 text-blue-600" />
          Profile
        </h3>
        <div className="space-y-4">
          <p>
            <strong>Name:</strong> {userData?.firstName} {userData?.lastName}
          </p>
          <p>
            <strong>Email:</strong> {userData?.email}
          </p>
          <p>
            <strong>Role:</strong> {userData?.role}
          </p>
          {userData?.role === "Donor" && (
            <>
              <p>
                <strong>Blood Group:</strong> {userData?.donorInfo?.bloodGroup}
              </p>
              <p>
                <strong>Donation Count:</strong>{" "}
                {userData?.donorInfo?.donationCount}
              </p>
            </>
          )}
          {userData?.role === "Hospital" && (
            <>
              <p>
                <strong>Hospital Name:</strong> {userData?.hospitalInfo?.name}
              </p>
              <p>
                <strong>Location:</strong> {userData?.hospitalInfo?.location}
              </p>
            </>
          )}
          {userData?.role === "BloodBank" && (
            <>
              <p>
                <strong>Blood Bank Name:</strong>{" "}
                {userData?.bloodBankInfo?.name}
              </p>
              <p>
                <strong>Location:</strong> {userData?.bloodBankInfo?.location}
              </p>
            </>
          )}
        </div>
      </div>
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <Lock className="w-5 h-5 mr-2 text-green-600" />
          Privacy & Security
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <span className="text-sm font-medium">
                Personal Data Encrypted
              </span>
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <span className="text-sm font-medium">IPFS Document Storage</span>
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <span className="text-sm font-medium">Blockchain Verified</span>
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-blue-800 mb-2">Data Protection</h4>
            <p className="text-sm text-blue-700">
              Your personal information is encrypted and stored off-chain in
              MongoDB, while only verification hashes and metadata are stored on
              the Ethereum blockchain.
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    if (isLoading) {
      return <div className="p-6 text-center">Loading...</div>;
    }
    if (error) {
      return (
        <div className="p-6">
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600 flex items-center">
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
    <div className="min-h-screen bg-gray-50">
      <style jsx>{`
        @keyframes pulse-glow {
          0%,
          100% {
            box-shadow: 0 0 15px rgba(185, 28, 28, 0.4);
          }
          50% {
            box-shadow: 0 0 30px rgba(185, 28, 28, 0.7),
              0 0 50px rgba(185, 28, 28, 0.5);
          }
        }
        .animate-pulse-glow {
          animation: pulse-glow 2s ease-in-out infinite;
        }
      `}</style>
      {renderHeader()}
      {renderContent()}
    </div>
  );
};

export default BloodManagementSystem;
