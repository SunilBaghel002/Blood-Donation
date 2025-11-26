// src/contexts/Web3Context.jsx
import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
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
  console.warn("⚠️ VITE_WALLET_CONNECT_PROJECT_ID missing");
}

/* -------------------------------------------------
   2. Chain Config
   ------------------------------------------------- */
const config = createConfig({
  chains: [hardhat],
  transports: {
    [hardhat.id]: http("http://127.0.0.1:8545"),
  },
});

/* -------------------------------------------------
   3. Web3Modal
   ------------------------------------------------- */
let modal;
if (PROJECT_ID) {
  modal = createWeb3Modal({
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
}

/* -------------------------------------------------
   4. Context
   ------------------------------------------------- */
const Web3Context = createContext();

export const useWeb3 = () => {
  const context = useContext(Web3Context);
  if (!context) {
    throw new Error("useWeb3 must be used within Web3Provider");
  }
  return context;
};

/* -------------------------------------------------
   5. Backend Sync (FIXED)
   ------------------------------------------------- */
const syncBackend = async (address) => {
  const token = localStorage.getItem("token");

  if (!token) {
    console.log("⚠️ No token found, skipping wallet sync");
    return;
  }

  if (!address) {
    console.log("⚠️ No wallet address, skipping sync");
    return;
  }

  try {
    console.log("🔄 Syncing wallet to backend:", address);

    const response = await fetch(
      "http://localhost:5000/api/auth/connect-wallet",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ walletAddress: address }), // ✅ Fixed: Only send walletAddress
      }
    );

    if (!response.ok) {
      const error = await response.json();
      console.error("❌ Backend sync failed:", error);
      return;
    }

    const data = await response.json();
    console.log("✅ Wallet synced:", data);
  } catch (error) {
    console.error("❌ Backend sync error:", error.message);
  }
};

/* -------------------------------------------------
   6. Web3Provider (IMPROVED)
   ------------------------------------------------- */
export const Web3Provider = ({ children }) => {
  const queryClient = useRef(
    new QueryClient({
      defaultOptions: {
        queries: {
          refetchOnWindowFocus: false,
          retry: 1,
        },
      },
    })
  ).current;

  const InnerProvider = () => {
    const { address, isConnected, chain } = useAccount();
    const { connect, connectors, isPending, error } = useConnect();
    const { disconnect } = useDisconnect();
    const { data: balanceData } = useBalance({ address });

    const [isSyncing, setIsSyncing] = useState(false);
    const syncedRef = useRef(false);

    const contract = {
      address: CONTRACT_ADDRESS,
      abi: BloodChainABI,
    };

    // ============ Auto-Sync (Only Once) ============
    useEffect(() => {
      if (isConnected && address && !syncedRef.current && !isSyncing) {
        setIsSyncing(true);
        localStorage.setItem("walletAddress", address);

        syncBackend(address).finally(() => {
          syncedRef.current = true;
          setIsSyncing(false);
        });
      }
    }, [isConnected, address, isSyncing]);

    // ============ Auto-Reconnect ============
    useEffect(() => {
      const savedAddress = localStorage.getItem("walletAddress");
      const token = localStorage.getItem("token");

      if (savedAddress && token && !isConnected) {
        console.log("🔄 Auto-reconnecting wallet...");
        const injected = connectors.find((c) => c.id === "injected");
        if (injected) {
          connect({ connector: injected });
        }
      }
    }, [connectors, connect, isConnected]);

    // ============ Error Handling ============
    useEffect(() => {
      if (error) {
        console.error("❌ Wallet connection error:", error.message);
      }
    }, [error]);

    // ============ Public API ============
    const value = {
      // MetaMask Connection
      connectMetaMask: async () => {
        try {
          if (!window.ethereum) {
            alert("Please install MetaMask!");
            return;
          }

          const injected = connectors.find((c) => c.id === "injected");
          if (!injected) {
            console.error("Injected connector not found");
            return;
          }

          // Add/Switch to Hardhat network
          try {
            await window.ethereum.request({
              method: "wallet_switchEthereumChain",
              params: [{ chainId: NETWORK_CONFIG.chainId }],
            });
          } catch (switchError) {
            // Network doesn't exist, add it
            if (switchError.code === 4902) {
              await window.ethereum.request({
                method: "wallet_addEthereumChain",
                params: [NETWORK_CONFIG],
              });
            } else {
              throw switchError;
            }
          }

          // Connect wallet
          connect({ connector: injected });
        } catch (error) {
          console.error("MetaMask connection error:", error);
        }
      },

      // WalletConnect
      connectWalletConnect: () => {
        if (PROJECT_ID && modal) {
          modal.open();
        } else {
          console.error("WalletConnect not configured");
        }
      },

      // Disconnect
      disconnectWallet: () => {
        disconnect();
        localStorage.removeItem("walletAddress");
        syncedRef.current = false;
      },

      // Shorthand for MetaMask
      connectWallet: async () => {
        const injected = connectors.find((c) => c.id === "injected");
        if (injected) {
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
        }
      },

      // State
      account: address,
      balance: balanceData ? balanceData.formatted : "0",
      contract,
      isConnected,
      isLoading: isPending || isSyncing,
      chain,
      error,
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
