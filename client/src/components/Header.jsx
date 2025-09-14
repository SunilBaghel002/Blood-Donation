import React from "react";
import { motion } from "framer-motion";
import { Heart, Activity } from "lucide-react";

const Header = ({
  userType,
  activeTab,
  setActiveTab,
  notifications,
  connectWallet,
  connectedWallet,
  isLoading,
}) => {
  const tabsByRole = {
    Donor: ["dashboard", "profile", "education"],
    BloodBank: ["dashboard", "inventory", "transactions", "profile"],
    Hospital: ["dashboard", "transactions", "profile"],
    Admin: ["dashboard", "profile"],
  };

  const tabs = tabsByRole[userType] || ["dashboard", "profile"];

  return (
    <motion.header
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-gradient-to-r from-red-500 to-pink-400 text-white p-4 sticky top-0 z-10 shadow-md"
    >
      <div className="flex justify-between items-center max-w-7xl mx-auto">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-white/20 rounded-lg">
            <Heart className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-semibold">BloodChain</h1>
            <p className="text-red-100 text-sm">Blockchain Blood Management</p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-sm font-medium">{userType}</span>
          <div className="relative">
            <div className="p-2 bg-white/20 rounded-lg cursor-pointer">
              <Activity className="w-5 h-5" />
            </div>
            {notifications > 0 && (
              <div className="absolute -top-2 -right-2 bg-yellow-400 text-red-800 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                {notifications}
              </div>
            )}
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={connectWallet}
            disabled={isLoading}
            className={`px-3 py-1.5 rounded-lg font-medium text-sm transition-all ${
              connectedWallet
                ? "bg-green-500 text-white"
                : "bg-white text-red-500 hover:bg-red-50"
            }`}
          >
            {isLoading
              ? "Connecting..."
              : connectedWallet
              ? "✓ Connected"
              : "Connect Wallet"}
          </motion.button>
        </div>
      </div>
      <div className="flex space-x-1 bg-white/10 rounded-lg p-1 mt-4 max-w-7xl mx-auto">
        {tabs.map((tab) => (
          <motion.button
            key={tab}
            whileHover={{ scale: 1.05 }}
            onClick={() => setActiveTab(tab)}
            className={`px-3 py-2 rounded-md font-medium text-sm capitalize transition-all ${
              activeTab === tab
                ? "bg-white text-red-500"
                : "text-white hover:bg-white/20"
            }`}
          >
            {tab}
          </motion.button>
        ))}
      </div>
    </motion.header>
  );
};

export default Header;
