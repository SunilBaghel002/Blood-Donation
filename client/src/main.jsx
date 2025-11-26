// src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { Web3Provider } from "./contexts/Web3Context.jsx";
import "leaflet/dist/leaflet.css";
import "./styles/leaflet-custom.css";

import { fixMetaMaskConflict } from "./utils/walletfix.js";
fixMetaMaskConflict();

const root = ReactDOM.createRoot(document.getElementById("root"));

if (import.meta.env.DEV) {
  // Development: No StrictMode to avoid double API calls
  root.render(<App />);
} else {
  // Production: Use StrictMode
  root.render(
    <React.StrictMode>
      <Web3Provider>
        <App />
      </Web3Provider>
    </React.StrictMode>
  );
}
