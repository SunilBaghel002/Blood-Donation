// src/pages/ConnectWallet.jsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Wallet, AlertCircle, CheckCircle, Loader2, ArrowLeft } from "lucide-react";
import { useWeb3 } from "../contexts/Web3Context";
import { useNavigate } from "react-router-dom";

const ConnectWallet = () => {
  const { connectMetaMask, connectWalletConnect, isConnected, account } = useWeb3();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const role = localStorage.getItem("role") || "User";

  const handleConnect = async (method) => {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      if (method === "metamask") {
        await connectMetaMask();
      } else {
        await connectWalletConnect();
      }

      setSuccess("Wallet connected successfully!");
      setTimeout(() => {
        const dashboardMap = {
          Donor: "/donor-dashboard",
          Hospital: "/hospital-dashboard",
          BloodBank: "/bloodbank-dashboard",
          Admin: "/admin-dashboard",
        };
        navigate(dashboardMap[role] || "/");
      }, 1500);
    } catch (err) {
      setError(err.message || "Failed to connect wallet. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-pink-50 to-rose-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl p-8 max-w-md w-full border border-red-100"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate(-1)}
            className="text-gray-600 hover:text-red-500 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <Wallet className="w-8 h-8 text-red-500" />
        </div>

        <h1 className="text-3xl font-bold text-gray-800 text-center mb-2">
          Connect Your Wallet
        </h1>
        <p className="text-gray-600 text-center mb-8">
          Securely link your blockchain wallet to access your {role} dashboard.
        </p>

        {/* Connection Status */}
        {isConnected && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg"
          >
            <p className="text-sm text-green-700 flex items-center justify-center">
              <CheckCircle className="w-4 h-4 mr-2" />
              Connected: <span className="font-mono ml-1">{account?.slice(0, 6)}...{account?.slice(-4)}</span>
            </p>
          </motion.div>
        )}

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg"
          >
            <p className="text-sm text-red-600 flex items-center">
              <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0" />
              {error}
            </p>
          </motion.div>
        )}

        {/* Success Message */}
        {success && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg"
          >
            <p className="text-sm text-green-600 flex items-center">
              <CheckCircle className="w-4 h-4 mr-2" />
              {success}
            </p>
          </motion.div>
        )}

        {/* Wallet Options */}
        <div className="space-y-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleConnect("metamask")}
            disabled={loading || isConnected}
            className={`w-full py-4 px-6 rounded-xl font-medium text-lg transition-all flex items-center justify-center space-x-3 ${
              isConnected
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-orange-500 to-pink-500 text-white hover:from-orange-600 hover:to-pink-600 shadow-lg"
            }`}
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <img src="/metamask-icon.svg" alt="MetaMask" className="w-6 h-6" />
                <span>Connect MetaMask</span>
              </>
            )}
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleConnect("walletconnect")}
            disabled={loading || isConnected}
            className={`w-full py-4 px-6 rounded-xl font-medium text-lg transition-all flex items-center justify-center space-x-3 border-2 ${
              isConnected
                ? "border-gray-200 text-gray-400 cursor-not-allowed"
                : "border-blue-500 text-blue-600 hover:bg-blue-50"
            }`}
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <Wallet className="w-6 h-6" />
                <span>WalletConnect</span>
              </>
            )}
          </motion.button>
        </div>

        {/* Footer Note */}
        <p className="text-xs text-gray-500 text-center mt-6">
          Your wallet is required for blockchain interactions like donation records and verification.
        </p>
      </motion.div>
    </div>
  );
};

export default ConnectWallet;