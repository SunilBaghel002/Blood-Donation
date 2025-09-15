import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
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
  Database,
  Users,
  Lock,
  BookOpen,
  ChevronUp,
  ChevronDown,
  CheckCircle,
} from "lucide-react";
import Header from "../components/Header";
import BloodDroplet from "../components/BloodDroplet";
import NotificationMessage from "../components/NotificationMessage";
import MetricCard from "../components/MetricCard";
import Table from "../components/Table";
import { AnimatePresence } from "framer-motion";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const DonorDashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [userType] = useState("Donor");
  const [connectedWallet, setConnectedWallet] = useState(false);
  const [notifications, setNotifications] = useState(0);
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [donationHistory, setDonationHistory] = useState([]);
  const [rewards, setRewards] = useState({ points: 0, badges: [] });
  const [bloodBanks, setBloodBanks] = useState([]);
  const [scheduleData, setScheduleData] = useState({
    bloodBankId: "",
    date: "",
    time: "",
  });
  const [particles, setParticles] = useState([]);
  const [expandedArticle, setExpandedArticle] = useState(null);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(null);

  const educationalContent = {
    title: "Learn About Blood Donation",
    articles: [
      {
        title: "The Importance of Blood Donation",
        content:
          "Blood donation is a critical act that can save up to three lives per donation...",
      },
      {
        title: "Who Can Donate?",
        content:
          "Healthy adults aged 17-65, weighing at least 110 lbs (50 kg)...",
      },
      {
        title: "The Donation Process",
        content:
          "The blood donation process is simple and safe, taking about 30-45 minutes...",
      },
      {
        title: "Benefits of Donating",
        content:
          "Donating blood not only saves lives but also benefits the donor...",
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
        await fetchDonorData(token);
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

  const handleQuizSubmit = (e) => {
    e.preventDefault();
    let score = 0;
    educationalContent.quiz.forEach((q, index) => {
      if (quizAnswers[index] === q.correctAnswer) score++;
    });
    setQuizScore(score);
    setQuizSubmitted(true);
  };

  const renderDonationHistory = () => (
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
  );

  const renderScheduleDonation = () => (
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
              setScheduleData({ ...scheduleData, bloodBankId: e.target.value })
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
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-6 bg-white rounded-lg shadow-md p-6"
        >
          <h4 className="text-md font-medium text-gray-800 mb-4">
            Blood Type Compatibility
          </h4>
          <Table
            headers={[
              "Blood Type",
              "Can Donate To",
              "Can Receive From",
              "Donation Frequency",
            ]}
            data={educationalContent.compatibilityTable}
            rowRenderer={(row) => (
              <>
                <td className="py-3 px-4 font-medium">{row.bloodType}</td>
                <td className="py-3 px-4">{row.canDonateTo.join(", ")}</td>
                <td className="py-3 px-4">{row.canReceiveFrom.join(", ")}</td>
                <td className="py-3 px-4">{row.frequency}</td>
              </>
            )}
          />
        </motion.div>
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

  const renderDashboard = () => (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricCard
          label="Total Donations"
          value={donationHistory.length}
          icon={Heart}
          color="border-red-500"
          index={0}
        />
        <MetricCard
          label="Reward Points"
          value={rewards.points}
          icon={Gift}
          color="border-green-500"
          index={1}
        />
        <MetricCard
          label="Badges Earned"
          value={rewards.badges.length}
          icon={Shield}
          color="border-blue-500"
          index={2}
        />
      </div>
      {renderDonationHistory()}
      {renderScheduleDonation()}
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
      case "education":
        return renderEducationTab();
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

export default DonorDashboard;
