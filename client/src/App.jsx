// src/App.jsx (Updated - add wallet check)
import React, { Suspense, lazy } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useWeb3 } from "./contexts/Web3Context.jsx"; // New

// Lazy components (unchanged)
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

// Updated ProtectedRoute with wallet check
const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const { isConnected } = useWeb3(); // New: Check wallet

  if (!token) return <Navigate to="/login" />;
  if (allowedRoles && !allowedRoles.includes(role))
    return <Navigate to="/unauthorized" />;

  // For blockchain roles (Donor, BloodBank, etc.), require wallet
  if (["Donor", "BloodBank", "Hospital"].includes(role) && !isConnected) {
    return <Navigate to="/connect-wallet" />; // New route for wallet connect
  }

  return children;
};

function App() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50 flex items-center justify-center">
          <div className="flex items-center space-x-2 text-gray-600">
            <div className="w-6 h-6 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
            <span>Loading...</span>
          </div>
        </div>
      }
    >
      <Routes>
        <Route path="/" element={<BloodChainLanding />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/future-scopes" element={<FutureScopes />} />
        

        {/* Protected Routes */}
        <Route
          path="/dashboard/donor"
          element={
            <ProtectedRoute allowedRoles={["Donor"]}>
              <DonorDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/hospital"
          element={
            <ProtectedRoute allowedRoles={["Hospital"]}>
              <HospitalDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/admin"
          element={
            <ProtectedRoute allowedRoles={["Admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/bloodbank"
          element={
            <ProtectedRoute allowedRoles={["BloodBank"]}>
              <BloodBankDashboard />
            </ProtectedRoute>
          }
        />
        <Route path="/emergency" element={<EmergencyBloodDonationPortal />} />
        <Route
          path="/hospital-emergency"
          element={<HospitalEmergencyDashboard />}
        />
        <Route path="/profile" element={<Profile />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Suspense>
  );
}

export default App;
