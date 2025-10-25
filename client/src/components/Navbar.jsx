// src/components/Navbar.jsx (Updated - add wallet section)
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useWeb3 } from "../contexts/Web3Context.jsx"; // New
import { Heart, LogOut, Wallet } from "lucide-react"; // Assuming icons

const Navbar = ({ role }) => {
  const {
    account,
    balance,
    connectWallet,
    disconnectWallet,
    isConnected,
    isLoading,
  } = useWeb3();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    disconnectWallet();
    navigate("/login");
  };

  return (
    <nav className="bg-gradient-to-r from-red-600 to-pink-600 shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link
            to="/"
            className="text-white font-bold text-xl flex items-center"
          >
            <Heart className="mr-2" /> BloodChain
          </Link>

          {/* Nav Links */}
          <div className="hidden md:flex space-x-6">
            {role === "Donor" && (
              <Link
                to="/donor-dashboard"
                className="text-white hover:underline"
              >
                Dashboard
              </Link>
            )}
            {role === "Hospital" && (
              <Link
                to="/hospital-dashboard"
                className="text-white hover:underline"
              >
                Dashboard
              </Link>
            )}
            {/* Add more role-based links */}
            <Link to="/profile" className="text-white hover:underline">
              Profile
            </Link>
          </div>

          {/* Wallet Section */}
          <div className="flex items-center space-x-4">
            {isConnected ? (
              <>
                <div className="text-white text-sm">
                  {account?.slice(0, 6)}...{account?.slice(-4)} | {balance} ETH
                </div>
                <button
                  onClick={disconnectWallet}
                  className="text-white hover:text-gray-200"
                >
                  <LogOut size={20} />
                </button>
              </>
            ) : (
              <button
                onClick={connectWallet}
                disabled={isLoading}
                className="bg-white text-red-600 px-4 py-2 rounded-md font-semibold hover:bg-gray-100 disabled:opacity-50"
              >
                {isLoading ? "Connecting..." : "Connect Wallet"}
                <Wallet size={18} className="ml-2 inline" />
              </button>
            )}
            <button
              onClick={handleLogout}
              className="text-white hover:text-gray-200"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
