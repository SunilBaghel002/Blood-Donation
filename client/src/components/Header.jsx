// src/components/Header.jsx
import React from "react";
import { motion } from "framer-motion";
import { Heart, Bell, Wallet, ChevronDown } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";

const Header = ({
  userType,
  activeTab,
  setActiveTab,
  notifications,
  connectWallet,
  connectedWallet,
  isLoading,
  user,
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
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 120, damping: 20 }}
      className="bg-gradient-to-r from-red-500 to-pink-400 text-white pb-4 sticky top-0 z-50 shadow-lg"
    >
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center space-x-3"
          >
            <div className="p-3 bg-gradient-to-br from-red-500 to-pink-600 rounded-2xl shadow-lg">
              <Heart className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">BloodChain</h1>
              <p className="text-xs text-red-100">
                Blockchain-Powered Blood Network
              </p>
            </div>
          </motion.div>

          {/* Right Side */}
          <div className="flex items-center space-x-6">
            {/* Notifications */}
            <motion.div whileHover={{ scale: 1.1 }} className="relative">
              <div className="p-3 bg-white/20 backdrop-blur-md rounded-2xl cursor-pointer hover:bg-white/30 transition-all shadow-lg">
                <Bell className="w-6 h-6 text-white" />
              </div>
              {notifications > 0 && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-2 -right-2 bg-yellow-400 text-red-800 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold shadow-lg"
                >
                  {notifications}
                </motion.div>
              )}
            </motion.div>

            {/* Wallet */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={connectWallet}
              disabled={isLoading}
              className={`px-5 py-3 rounded-2xl font-medium text-sm transition-all flex items-center gap-2 shadow-lg ${
                connectedWallet
                  ? "bg-gradient-to-r from-emerald-500 to-teal-600 text-white"
                  : "bg-white/20 backdrop-blur-md text-white hover:bg-white/30"
              }`}
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Connecting...
                </>
              ) : connectedWallet ? (
                <>
                  <Wallet className="w-5 h-5" />
                  Connected
                </>
              ) : (
                <>
                  <Wallet className="w-5 h-5" />
                  Connect Wallet
                </>
              )}
            </motion.button>

            {/* User */}
            {user && (
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex items-center gap-3 bg-white/20 backdrop-blur-md rounded-2xl p-3 shadow-lg"
              >
                <Avatar className="h-10 w-10 ring-4 ring-white/30">
                  <AvatarImage
                    src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.firstName}+${user.lastName}&backgroundColor=ef4444`}
                  />
                  <AvatarFallback className="bg-gradient-to-br from-red-500 to-pink-600 text-white font-bold">
                    {user.firstName?.[0]}
                    {user.lastName?.[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden lg:block">
                  <p className="text-white font-semibold text-sm">
                    {user.firstName} {user.lastName}
                  </p>
                  <p className="text-red-100 text-xs">{userType}</p>
                </div>
                <ChevronDown className="w-4 h-4 text-white hidden lg:block" />
              </motion.div>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-2 bg-white/10 backdrop-blur-md rounded-2xl p-2 mt-3">
          {tabs.map((tab) => (
            <motion.button
              key={tab}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 rounded-xl font-semibold text-sm capitalize transition-all shadow-md ${
                activeTab === tab
                  ? "bg-white text-red-600"
                  : "text-white hover:bg-white/20"
              }`}
            >
              {tab}
            </motion.button>
          ))}
        </div>
      </div>
    </motion.header>
  );
};

export default Header;
