// src/config/network.js
export const NETWORK_CONFIG = {
  chainId: "0x7a69", // 31337 in hex (Hardhat default)
  chainName: "Hardhat Local",
  nativeCurrency: { name: "Ethereum", symbol: "ETH", decimals: 18 },
  rpcUrls: ["http://127.0.0.1:8545"],
  blockExplorerUrls: [], // optional
};