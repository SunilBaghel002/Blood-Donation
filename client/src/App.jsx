// src/App.jsx
import React, { Suspense, lazy } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Web3Provider, useWeb3 } from "./contexts/Web3Context.jsx"; // ADDED useWeb3

// Lazy components
const BloodChainLanding = lazy(() => import("./pages/landing"));
const DonorDashboard = lazy(() => import("./pages/DonorDashboard"));
const HospitalDashboard = lazy(() => import("./pages/HospitalDashboard"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const Login = lazy(() => import("./pages/Login"));
const Signup = lazy(() => import("./pages/Signup"));
const FutureScopes = lazy(() => import("./pages/FutureScopes"));
const BloodBankDashboard = lazy(() => import("./pages/BloodBankDashboard"));
const EmergencyBloodDonationPortal = lazy(() =>
  import("./pages/EmergencyDashboard")
);
const HospitalEmergencyDashboard = lazy(() =>
  import("./pages/HospitalEmergencyDashboard")
);
const Profile = lazy(() => import("./pages/Profile"));
const ConnectWallet = lazy(() => import("./pages/ConnectWallet"));

const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const { isConnected } = useWeb3(); // NOW IT WORKS

  if (!token) return <Navigate to="/login" />;
  if (allowedRoles && !allowedRoles.includes(role))
    return <Navigate to="/unauthorized" />;

  if (["Donor", "BloodBank", "Hospital"].includes(role) && !isConnected) {
    return <Navigate to="/connect-wallet" replace />;
  }

  return children;
};

function App() {
  return (
    <Web3Provider>
      <Suspense
        fallback={
          <div className="flex items-center justify-center h-screen">
            Loading...
          </div>
        }
      >
        <Router>
          <Routes>
            <Route path="/" element={<BloodChainLanding />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/future-scopes" element={<FutureScopes />} />
            <Route path="/connect-wallet" element={<ConnectWallet />} />

            <Route
              path="/donor-dashboard"
              element={
                <ProtectedRoute allowedRoles={["Donor"]}>
                  <DonorDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/hospital-dashboard"
              element={
                <ProtectedRoute allowedRoles={["Hospital"]}>
                  <HospitalDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin-dashboard"
              element={
                <ProtectedRoute allowedRoles={["Admin"]}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/bloodbank-dashboard"
              element={
                <ProtectedRoute allowedRoles={["BloodBank"]}>
                  <BloodBankDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/emergency"
              element={<EmergencyBloodDonationPortal />}
            />
            <Route
              path="/hospital-emergency"
              element={<HospitalEmergencyDashboard />}
            />
            <Route path="/profile" element={<Profile />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Router>
      </Suspense>
    </Web3Provider>
  );
}

export default App;
