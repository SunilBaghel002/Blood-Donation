// src/components/Header.jsx
import React from "react";
import { motion } from "framer-motion";
import { Heart, Activity, Bell } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";

const Header = ({
  userType,
  activeTab,
  setActiveTab,
  notifications,
  connectWallet,
  connectedWallet,
  isLoading,
  user, // Now passed from DonorDashboard
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
      className="bg-gradient-to-r from-red-500 to-pink-400 text-white p-4 sticky top-0 z-50 shadow-lg"
    >
      <div className="max-w-7xl mx-auto">
        {/* Top Bar: Logo + Wallet + User */}
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white/20 rounded-lg">
              <Heart className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold">BloodChain</h1>
              <p className="text-red-100 text-xs">Blockchain Blood Management</p>
            </div>
          </div>

          {/* Right Side: Notifications + Wallet + Avatar */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <div className="relative">
              <div className="p-2 bg-white/20 rounded-lg cursor-pointer hover:bg-white/30 transition">
                <Bell className="w-5 h-5" />
              </div>
              {notifications > 0 && (
                <div className="absolute -top-1 -right-1 bg-yellow-400 text-red-800 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                  {notifications}
                </div>
              )}
            </div>

            {/* Connect Wallet */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={connectWallet}
              disabled={isLoading}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-all flex items-center gap-2 ${
                connectedWallet
                  ? "bg-green-500 text-white"
                  : "bg-white text-red-500 hover:bg-red-50"
              }`}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Connecting...
                </span>
              ) : connectedWallet ? (
                "Connected"
              ) : (
                "Connect Wallet"
              )}
            </motion.button>

            {/* Avatar + Name */}
            {user && (
              <div className="flex items-center gap-3">
                <Avatar className="h-9 w-9 ring-2 ring-white/30">
                  <AvatarImage
                    src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.firstName}+${user.lastName}&backgroundColor=ef4444`}
                    alt={user.firstName}
                  />
                  <AvatarFallback className="bg-gradient-to-br from-red-400 to-pink-400 text-white text-sm font-bold">
                    {user.firstName?.[0]}{user.lastName?.[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-medium">
                    {user.firstName} {user.lastName}
                  </p>
                  <p className="text-xs text-red-100">{userType}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 bg-white/10 rounded-lg p-1 mt-4">
          {tabs.map((tab) => (
            <motion.button
              key={tab}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-md font-medium text-sm capitalize transition-all ${
                activeTab === tab
                  ? "bg-white text-red-500 shadow-sm"
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