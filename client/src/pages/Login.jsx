import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Heart,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Shield,
  CheckCircle,
  ArrowLeft,
  ChevronRight,
  AlertCircle,
  Fingerprint,
  Smartphone,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [particles, setParticles] = useState([]);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState("");

  // Auto-dismiss messages
  useEffect(() => {
    if (success || errors.general) {
      const timer = setTimeout(() => {
        setSuccess("");
        setErrors((prev) => ({ ...prev, general: "" }));
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [success, errors.general]);

  // Generate blood droplet particles
  useEffect(() => {
    const newParticles = Array.from({ length: 10 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 3,
      duration: 4 + Math.random() * 3,
      size: 8 + Math.random() * 4,
    }));
    setParticles(newParticles);
  }, []);

  // Animation variants
  const messageVariants = {
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3 } },
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Email is invalid";
    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 8)
      newErrors.password = "Password must be at least 8 characters";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsLoading(true);
    setErrors({});
    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });
      const data = await response.json();
      if (!response.ok)
        throw new Error(data.error || "Invalid email or password");

      setSuccess(data.message);
      localStorage.setItem("token", data.token);
      localStorage.setItem("userId", data.user._id);
      localStorage.setItem("role", data.user.role);

      // Store role-specific info
      if (data.user.role === "Donor") {
        localStorage.setItem(
          "donorInfo",
          JSON.stringify(data.user.donorInfo || {})
        );
      } else if (data.user.role === "Hospital") {
        localStorage.setItem(
          "hospitalInfo",
          JSON.stringify(data.user.hospitalInfo || {})
        );
      } else if (data.user.role === "BloodBank") {
        localStorage.setItem(
          "bloodBankInfo",
          JSON.stringify(data.user.bloodBankInfo || {})
        );
      } else if (data.user.role === "Admin") {
        localStorage.setItem(
          "adminInfo",
          JSON.stringify(data.user.adminInfo || {})
        );
      }

      setTimeout(() => {
        navigate(`/dashboard/${data.user.role.toLowerCase()}`);
      }, 1500);
    } catch (error) {
      setErrors({ general: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  // Blood Droplet (Motion SVG)
  const BloodDroplet = ({ particle }) => (
    <motion.div
      className="absolute"
      style={{
        left: `${particle.x}%`,
        top: `${particle.y}%`,
        width: `${particle.size}px`,
        height: `${particle.size}px`,
      }}
      animate={{ y: [0, -60, 0], scale: [1, 1.1, 1], opacity: [0.3, 0.6, 0.3] }}
      transition={{
        duration: particle.duration,
        delay: particle.delay,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
        <path
          d="M12 3C12 3 8 8 8 12C8 16 12 21 12 21C12 21 16 16 16 12C16 8 12 3 12 3Z"
          fill="#f87171"
          fillOpacity="0.5"
        />
      </svg>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50 font-inter relative overflow-hidden">
      <style>
        {`
          @keyframes float { 0%, 100% { transform: translateY(0px) scale(1); opacity: 0.3; } 50% { transform: translateY(-60px) scale(1.1); opacity: 0.6; } }
          @keyframes pulse-glow { 0%, 100% { box-shadow: 0 0 10px rgba(239, 68, 68, 0.3); } 50% { box-shadow: 0 0 20px rgba(239, 68, 68, 0.5); } }
          .animate-pulse-glow { animation: pulse-glow 2s ease-in-out infinite; }
          .parallax-bg { background-attachment: fixed; background-position: center; background-repeat: no-repeat; background-size: cover; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' fill='none'%3E%3Cpath d='M50 10C50 10 40 20 40 30C40 40 50 50 50 50C50 50 60 40 60 30C60 20 50 10 50 10Z' fill='%23f87171' fill-opacity='0.05'/%3E%3C/svg%3E"); }
          @media (max-width: 768px) { .parallax-bg { background-attachment: scroll; } }
          .floating-label-container { position: relative; }
          .floating-label { position: absolute; top: -0.5rem; left: 0.75rem; font-size: 0.75rem; color: #4b5563; background: #fff; padding: 0 0.25rem; transition: all 0.2s ease; pointer-events: none; }
          input:focus, select:focus { border-color: #f87171; box-shadow: 0 0 0 2px rgba(239, 68, 68, 0.2); }
        `}
      </style>

      {/* Particles */}
      {particles.map((particle) => (
        <BloodDroplet key={particle.id} particle={particle} />
      ))}

      {/* Toast Messages */}
      <div className="fixed top-4 right-4 z-50 max-w-xs w-full">
        <AnimatePresence>
          {errors.general && (
            <motion.div
              key="error"
              variants={messageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="p-3 bg-red-50 border border-red-200 rounded-lg shadow-sm"
            >
              <p className="text-sm text-red-600 flex items-center">
                <AlertCircle className="w-4 h-4 mr-2" />
                {errors.general}
              </p>
            </motion.div>
          )}
          {success && (
            <motion.div
              key="success"
              variants={messageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="p-3 bg-green-50 border border-green-200 rounded-lg shadow-sm"
            >
              <p className="text-sm text-green-600 flex items-center">
                <CheckCircle className="w-4 h-4 mr-2" />
                {success}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Back Button */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        onClick={() => navigate("/")}
        className="absolute top-4 left-4 flex items-center space-x-2 text-gray-600 hover:text-red-500 transition-colors z-10"
      >
        <ArrowLeft className="w-5 h-5" />
        <span className="text-sm font-medium">Back to Home</span>
      </motion.button>

      {/* Login Form */}
      <section className="min-h-screen flex items-center justify-center relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative bg-white/80 backdrop-blur-lg p-6 sm:p-8 rounded-xl shadow-lg border border-red-100 max-w-md w-full mx-4"
        >
          <div className="flex items-center justify-center space-x-2 mb-6">
            <Heart className="w-8 h-8 text-red-500" />
            <h2 className="text-2xl sm:text-3xl font-semibold text-gray-800">
              Sign In to BloodChain
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div className="relative floating-label-container">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`w-full pl-10 pr-4 py-3 bg-red-50 border ${
                  errors.email ? "border-red-500" : "border-red-200"
                } rounded-lg focus:ring-2 focus:ring-red-400 outline-none`}
                placeholder=" "
                required
              />
              <label className="floating-label">Email Address</label>
              {errors.email && (
                <p className="mt-1 text-sm text-red-500 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.email}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="relative floating-label-container">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className={`w-full pl-10 pr-12 py-3 bg-red-50 border ${
                  errors.password ? "border-red-500" : "border-red-200"
                } rounded-lg focus:ring-2 focus:ring-red-400 outline-none`}
                placeholder=" "
                required
              />
              <label className="floating-label">Password</label>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-600"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
              {errors.password && (
                <p className="mt-1 text-sm text-red-500 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.password}
                </p>
              )}
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-red-500 border-red-200 rounded focus:ring-red-400"
                />
                <span className="ml-2 text-sm text-gray-500">Remember me</span>
              </label>
              <a
                href="/forgot-password"
                className="text-sm text-red-500 hover:text-red-600"
              >
                Forgot password?
              </a>
            </div>

            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-red-500 to-pink-400 text-white py-3 rounded-lg font-medium flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Sign In</span>
                  <ChevronRight className="w-4 h-4" />
                </>
              )}
            </motion.button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-red-100" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white/80 text-gray-500">
                Or continue with
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => alert("Wallet connect coming soon!")}
              className="flex items-center justify-center px-4 py-2 border border-red-200 bg-red-50 rounded-lg text-sm font-medium text-gray-600"
            >
              <Fingerprint className="w-4 h-4 mr-2" />
              Connect Wallet
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled
              className="flex items-center justify-center px-4 py-2 border border-red-200 bg-red-50 rounded-lg text-sm font-medium text-gray-600 opacity-50"
            >
              <Smartphone className="w-4 h-4 mr-2" />
              Biometric
            </motion.button>
          </div>

          <p className="text-center mt-6 text-sm text-gray-500">
            New here?{" "}
            <a href="/signup" className="text-red-500 hover:text-red-600">
              Sign up
            </a>
          </p>

          <div className="mt-8 grid grid-cols-3 gap-3 text-center">
            <div className="bg-red-50 rounded-lg p-3 border border-red-100">
              <Shield className="w-6 h-6 text-green-600 mx-auto mb-2" />
              <p className="text-xs text-gray-500">Bank-level Security</p>
            </div>
            <div className="bg-red-50 rounded-lg p-3 border border-red-100">
              <Heart className="w-6 h-6 text-red-500 mx-auto mb-2" />
              <p className="text-xs text-gray-500">1000+ Lives Saved</p>
            </div>
            <div className="bg-red-50 rounded-lg p-3 border border-red-100">
              <CheckCircle className="w-6 h-6 text-blue-600 mx-auto mb-2" />
              <p className="text-xs text-gray-500">100% Verified</p>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default Login;
