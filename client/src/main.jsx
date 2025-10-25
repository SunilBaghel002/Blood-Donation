// src/main.jsx (Updated)
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import "./index.css";
import { Web3Provider } from "./contexts/Web3Context.jsx"; // New

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Web3Provider> {/* Wrap here */}
        <App />
      </Web3Provider>
    </BrowserRouter>
  </React.StrictMode>
);