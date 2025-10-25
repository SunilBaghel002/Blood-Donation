// src/contexts/Web3Context.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import { ethers } from "ethers";
import { BloodChainABI, CONTRACT_ADDRESS } from "../config/contractABI";
import detectEthereumProvider from "@metamask/detect-provider";

const Web3Context = createContext();

export const useWeb3 = () => useContext(Web3Context);

export const Web3Provider = ({ children }) => {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [account, setAccount] = useState(null);
  const [contract, setContract] = useState(null);
  const [balance, setBalance] = useState("0");
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const connectWallet = async () => {
    setIsLoading(true);
    try {
      const ethProvider = await detectEthereumProvider();
      if (!ethProvider) {
        alert("MetaMask not found! Install it.");
        return;
      }

      const accounts = await ethProvider.request({ method: "eth_requestAccounts" });
      const browserProvider = new ethers.BrowserProvider(ethProvider);
      const signer = await browserProvider.getSigner();
      const address = await signer.getAddress();
      const balance = await browserProvider.getBalance(address);

      const contract = new ethers.Contract(CONTRACT_ADDRESS, BloodChainABI, signer);

      setProvider(browserProvider);
      setSigner(signer);
      setAccount(address);
      setBalance(ethers.formatEther(balance));
      setContract(contract);
      setIsConnected(true);

      // Save to localStorage (for persistence)
      localStorage.setItem("walletAddress", address);

      // Call backend to link wallet
      const token = localStorage.getItem("token");
      if (token) {
        await fetch("/api/auth/connect-wallet", {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify({ email: localStorage.getItem("email"), walletAddress: address }),
        });
      }
    } catch (error) {
      console.error("Connection failed:", error);
      alert("Failed to connect wallet");
    }
    setIsLoading(false);
  };

  const disconnectWallet = () => {
    setProvider(null);
    setSigner(null);
    setAccount(null);
    setContract(null);
    setBalance("0");
    setIsConnected(false);
    localStorage.removeItem("walletAddress");
  };

  // Auto-connect if previously connected
  useEffect(() => {
    const savedAddress = localStorage.getItem("walletAddress");
    if (savedAddress && window.ethereum) connectWallet();
  }, []);

  return (
    <Web3Context.Provider value={{ connectWallet, disconnectWallet, account, balance, contract, isConnected, isLoading }}>
      {children}
    </Web3Context.Provider>
  );
};