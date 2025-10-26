// src/contexts/Web3Context.jsx
import React, { createContext, useContext, useEffect, useRef } from "react";
import {
  createConfig,
  WagmiProvider,
  useAccount,
  useConnect,
  useDisconnect,
  useBalance,
} from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createWeb3Modal } from "@web3modal/wagmi/react";
import { http } from "viem";
import { hardhat } from "wagmi/chains";

import { BloodChainABI, CONTRACT_ADDRESS } from "../config/contractABI";
import { NETWORK_CONFIG } from "../config/network.js";

/* -------------------------------------------------
   1. WalletConnect Project ID
   ------------------------------------------------- */
const PROJECT_ID = import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID;

if (!PROJECT_ID) {
  console.warn(
    "VITE_WALLET_CONNECT_PROJECT_ID is missing! WalletConnect disabled."
  );
}

/* -------------------------------------------------
   2. Chain config (Hardhat: 31337)
   ------------------------------------------------- */
const config = createConfig({
  chains: [hardhat],
  transports: {
    [hardhat.id]: http(),
  },
});

/* -------------------------------------------------
   3. Web3Modal
   ------------------------------------------------- */
const modal = createWeb3Modal({
  wagmiConfig: config,
  projectId: PROJECT_ID,
  themeMode: "light",
  metadata: {
    name: "BloodChain",
    description: "Blockchain blood donation platform",
    url: import.meta.env.VITE_APP_URL || "http://localhost:5173",
    icons: ["https://avatars.githubusercontent.com/u/37784886"],
  },
});

/* -------------------------------------------------
   4. Context
   ------------------------------------------------- */
const Web3Context = createContext();

export const useWeb3 = () => useContext(Web3Context);

/* -------------------------------------------------
   5. Backend sync
   ------------------------------------------------- */
const syncBackend = async (address) => {
  const token = localStorage.getItem("token");
  if (!token || !address) return;

  try {
    await fetch("http://localhost:5000/api/auth/connect-wallet", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        email: localStorage.getItem("email"),
        walletAddress: address,
      }),
    });
  } catch (error) {
    console.error("Backend sync failed:", error);
  }
};

/* -------------------------------------------------
   6. Web3Provider
   ------------------------------------------------- */
export const Web3Provider = ({ children }) => {
  const queryClient = useRef(new QueryClient()).current;

  const InnerProvider = () => {
    const { address, isConnected } = useAccount();
    const { connect, connectors, isPending } = useConnect();
    const { disconnect } = useDisconnect();
    const { data: balanceData } = useBalance({ address });

    const contract = {
      address: CONTRACT_ADDRESS,
      abi: BloodChainABI,
    };

    // Auto-sync
    useEffect(() => {
      if (isConnected && address) {
        localStorage.setItem("walletAddress", address);
        syncBackend(address);
      }
    }, [isConnected, address]);

    // Auto-reconnect
    useEffect(() => {
      const saved = localStorage.getItem("walletAddress");
      if (saved && !isConnected) {
        const injected = connectors.find((c) => c.id === "injected");
        if (injected) connect({ connector: injected });
      }
    }, [connectors, connect, isConnected]);

    // Public API
    const value = {
      connectMetaMask: async () => {
        const injected = connectors.find((c) => c.id === "injected");
        if (!injected) return;

        try {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [NETWORK_CONFIG],
          });
        } catch (err) {
          if (err.code !== 4001)
            console.warn("Chain already added or user skipped");
        }

        try {
          await window.ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: NETWORK_CONFIG.chainId }],
          });
        } catch (err) {
          if (err.code === 4902) {
            await window.ethereum.request({
              method: "wallet_addEthereumChain",
              params: [NETWORK_CONFIG],
            });
          }
        }

        connect({ connector: injected });
      },
      connectWalletConnect: () => {
        if (PROJECT_ID) modal.open();
      },
      disconnectWallet: () => disconnect(),
      account: address,
      balance: balanceData ? balanceData.formatted : "0",
      contract,
      isConnected,
      isLoading: isPending,

      connectWallet: async () => {
        const injected = connectors.find((c) => c.id === "injected");
        if (injected) {
          try {
            await window.ethereum.request({
              method: "wallet_addEthereumChain",
              params: [NETWORK_CONFIG],
            });
          } catch (err) {
            console.log("Chain already exists:", err);
          }
          connect({ connector: injected });
        }
      },
    };

    return (
      <Web3Context.Provider value={value}>{children}</Web3Context.Provider>
    );
  };

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <InnerProvider />
      </QueryClientProvider>
    </WagmiProvider>
  );
};
