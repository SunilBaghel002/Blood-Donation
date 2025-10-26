// src/pages/ConnectWallet.jsx
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Wallet,
  AlertCircle,
  CheckCircle,
  Loader2,
  ArrowLeft,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useWeb3 } from "../contexts/Web3Context";

const ConnectWallet = () => {
  const {
    connectMetaMask,
    connectWalletConnect,
    isConnected,
    account,
    isLoading,
  } = useWeb3();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const role = localStorage.getItem("role") || "User";

  const handleConnect = async (type) => {
    setError("");
    setSuccess("");

    try {
      if (type === "metamask") {
        await connectMetaMask();
      } else {
        await connectWalletConnect();
      }
    } catch (err) {
      setError(err.message || "Connection failed");
    }
  };

  useEffect(() => {
    if (isConnected && account) {
      setSuccess("Wallet connected successfully!");
      localStorage.setItem("walletAddress", account);

      const token = localStorage.getItem("token");
      if (token) {
        fetch("/api/auth/connect-wallet", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            email: localStorage.getItem("email"),
            walletAddress: account,
          }),
        }).catch(console.error);
      }

      setTimeout(() => {
        const map = {
          Donor: "/donor-dashboard",
          Hospital: "/hospital-dashboard",
          BloodBank: "/bloodbank-dashboard",
          Admin: "/admin-dashboard",
        };
        navigate(map[role] || "/");
      }, 1500);
    }
  }, [isConnected, account, navigate, role]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-pink-50 to-rose-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl p-8 max-w-md w-full border border-red-100"
      >
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate(-1)}
            className="text-gray-600 hover:text-red-500"
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

        {isConnected && (
          <motion.div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-700 flex items-center justify-center">
              <CheckCircle className="w-4 h-4 mr-2" />
              Connected:{" "}
              <span className="font-mono ml-1">
                {account?.slice(0, 6)}...{account?.slice(-4)}
              </span>
            </p>
          </motion.div>
        )}

        {error && (
          <motion.div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600 flex items-center">
              <AlertCircle className="w-4 h-4 mr-2" />
              {error}
            </p>
          </motion.div>
        )}

        {success && (
          <motion.div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-600 flex items-center">
              <CheckCircle className="w-4 h-4 mr-2" />
              {success}
            </p>
          </motion.div>
        )}

        <div className="space-y-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleConnect("metamask")}
            disabled={isLoading || isConnected}
            className={`w-full py-4 px-6 rounded-xl font-medium text-lg flex items-center justify-center space-x-3 ${
              isConnected
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-orange-500 to-pink-500 text-white hover:from-orange-600 hover:to-pink-600 shadow-lg"
            }`}
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <img
                  src="/metamask-icon.svg"
                  alt="MetaMask"
                  className="w-6 h-6"
                />
                <span>Connect MetaMask</span>
              </>
            )}
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleConnect("walletconnect")}
            disabled={isLoading || isConnected}
            className={`w-full py-4 px-6 rounded-xl font-medium text-lg flex items-center justify-center space-x-3 border-2 ${
              isConnected
                ? "border-gray-200 text-gray-400 cursor-not-allowed"
                : "border-blue-500 text-blue-600 hover:bg-blue-50"
            }`}
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <Wallet className="w-6 h-6" />
                <span>WalletConnect</span>
              </>
            )}
          </motion.button>
        </div>

        <p className="text-xs text-gray-500 text-center mt-6">
          Your wallet is required for blockchain interactions.
        </p>
      </motion.div>
    </div>
  );
};

export default ConnectWallet;
