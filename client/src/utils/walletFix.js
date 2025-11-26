// src/utils/walletFix.js

/**
 * Fix for MetaMask window.ethereum conflict
 * Call this BEFORE any Web3 initialization
 */
export const fixMetaMaskConflict = () => {
  if (typeof window === "undefined") return;

  // Detect multiple wallet extensions
  const hasMultipleWallets =
    window.ethereum?.providers && window.ethereum.providers.length > 1;

  if (hasMultipleWallets) {
    console.log("🦊 Multiple wallets detected, prioritizing MetaMask");

    // Find MetaMask provider
    const metamaskProvider = window.ethereum.providers.find(
      (p) => p.isMetaMask && !p.isBraveWallet
    );

    if (metamaskProvider) {
      // Freeze window.ethereum to prevent overwriting
      Object.defineProperty(window, "ethereum", {
        value: metamaskProvider,
        writable: false,
        configurable: false,
      });

      console.log("✅ MetaMask set as default provider");
    }
  } else if (window.ethereum) {
    console.log("🦊 Single wallet detected:", window.ethereum.constructor.name);
  }
};