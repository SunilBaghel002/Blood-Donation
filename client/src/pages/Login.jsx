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

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [particles, setParticles] = useState([]);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    walletAddress: "",
  });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState("");

  // Auto-dismiss messages after 5 seconds
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

  // Animation variants for messages
  const messageVariants = {
    initial: { opacity: 0, y: -20, x: 20 },
    animate: { opacity: 1, y: 0, x: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, y: -20, x: 20, transition: { duration: 0.3 } },
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }
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
      localStorage.setItem("role", data.user.role);
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
      }
      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 1500);
    } catch (error) {
      setErrors({ general: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  const connectWallet = async () => {
    setIsLoading(true);
    try {
      const walletAddress = "0x742d35Cc6565C42c42...";
      const response = await fetch(
        "http://localhost:5000/api/auth/connect-wallet",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: formData.email, walletAddress }),
        }
      );
      const data = await response.json();
      if (!response.ok)
        throw new Error(data.error || "Failed to connect wallet");
      setFormData((prev) => ({ ...prev, walletAddress }));
      setSuccess(data.message);
    } catch (error) {
      setErrors({ wallet: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  const BloodDroplet = ({ particle }) => (
    <svg
      className="absolute"
      style={{
        left: `${particle.x}%`,
        top: `${particle.y}%`,
        width: `${particle.size}px`,
        height: `${particle.size}px`,
        animation: `float ${particle.duration}s ease-in-out infinite ${particle.delay}s, pulse-size 2s ease-in-out infinite`,
      }}
      viewBox="0 0 24 24"
      fill="none"
    >
      <path
        d="M12 3C12 3 8 8 8 12C8 16 12 21 12 21C12 21 16 16 16 12C16 8 12 3 12 3Z"
        fill="#f87171"
        fillOpacity="0.5"
      />
    </svg>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50 font-inter">
      <div className="absolute inset-0">
        <style>
          {`
            @keyframes float {
              0%, 100% { transform: translateY(0px) scale(1); opacity: 0.3; }
              50% { transform: translateY(-60px) scale(1.1); opacity: 0.6; }
            }
            @keyframes pulse-size {
              0%, 100% { transform: scale(1); }
              50% { transform: scale(1.2); }
            }
            @keyframes pulse-glow {
              0%, 100% { box-shadow: 0 0 10px rgba(239, 68, 68, 0.3); }
              50% { box-shadow: 0 0 20px rgba(239, 68, 68, 0.5); }
            }
            @keyframes fade-in {
              from { opacity: 0; transform: translateY(20px); }
              to { opacity: 1; transform: translateY(0); }
            }
            @keyframes message-slide {
              from { opacity: 0; transform: translateY(-20px) translateX(20px); }
              to { opacity: 1; transform: translateY(0) translateX(0); }
            }
            .animate-fade-in { animation: fade-in 0.8s ease-out forwards; }
            .animate-pulse-glow { animation: pulse-glow 2s ease-in-out infinite; }
            .animate-message { animation: message-slide 0.3s ease-out forwards; }
            .parallax-bg {
              background-attachment: fixed;
              background-position: center;
              background-repeat: no-repeat;
              background-size: cover;
              background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' fill='none'%3E%3Cpath d='M50 10C50 10 40 20 40 30C40 40 50 50 50 50C50 50 60 40 60 30C60 20 50 10 50 10Z' fill='%23f87171' fill-opacity='0.05'/%3E%3C/svg%3E");
            }
            @media (max-width: 768px) { .parallax-bg { background-attachment: scroll; } }
            .floating-label {
              top: 50%;
              transform: translateY(-50%);
              transition: all 0.3s ease;
              pointer-events: none;
            }
            input:focus ~ .floating-label,
            input:not(:placeholder-shown) ~ .floating-label {
              top: -8px;
              transform: translateY(0);
              font-size: 0.75rem;
              color: #f87171;
              background: linear-gradient(to bottom, #ffffff, #fef2f2);
              padding: 0 4px;
            }
            .message-container {
              position: fixed;
              top: 1rem;
              right: 1rem;
              z-index: 1000;
              max-width: 300px;
            }
          `}
        </style>
      </div>

      <div className="message-container">
        <AnimatePresence>
          {errors.general && (
            <motion.div
              key="error-message"
              variants={messageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="p-3 bg-red-50 border border-red-200 rounded-lg animate-message mb-2"
            >
              <p className="text-sm text-red-500 flex items-center">
                <AlertCircle className="w-4 h-4 mr-2" />
                {errors.general}
              </p>
            </motion.div>
          )}
          {success && (
            <motion.div
              key="success-message"
              variants={messageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="p-3 bg-green-50 border border-green-200 rounded-lg animate-message"
            >
              <p className="text-sm text-green-600 flex items-center">
                <CheckCircle className="w-4 h-4 mr-2" />
                {success}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <button
        className="absolute top-4 left-4 flex items-center space-x-2 text-gray-600 hover:text-red-500 transition-colors animate-fade-in"
        onClick={() => (window.location.href = "/")}
        aria-label="Back to Home"
      >
        <ArrowLeft className="w-5 h-5" />
        <span className="text-sm font-medium">Back to Home</span>
      </button>

      <section className="min-h-screen flex items-center justify-center parallax-bg relative overflow-hidden">
        {particles.map((particle) => (
          <BloodDroplet key={particle.id} particle={particle} />
        ))}
        <div className="relative bg-gradient-to-br from-white/80 to-red-50/80 backdrop-blur-lg p-6 sm:p-8 md:p-10 rounded-3xl shadow-lg border border-red-100 max-w-lg w-full mx-4 animate-fade-in">
          <div className="flex items-center justify-center space-x-2 mb-6">
            <Heart className="w-8 h-8 text-red-500" />
            <h2 className="text-2xl sm:text-3xl font-semibold text-gray-800 animate-fade-in">
              Sign In to BloodChain
            </h2>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`w-full pl-10 pr-4 py-3 bg-red-50 border border-red-200 rounded-lg focus:ring-2 focus:ring-red-400 focus:border-red-400 transition-all outline-0 ${
                  errors.email ? "border-red-500" : ""
                }`}
                placeholder=" "
                aria-label="Email"
                required
              />
              <label className="absolute left-10 floating-label text-gray-500">
                Email Address
              </label>
              {errors.email && (
                <p className="mt-1 text-sm text-red-500 flex items-center animate-fade-in">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.email}
                </p>
              )}
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className={`w-full pl-10 pr-12 py-3 bg-red-50 border border-red-200 rounded-lg focus:ring-2 focus:ring-red-400 focus:border-red-400 transition-all outline-0 ${
                  errors.password ? "border-red-500" : ""
                }`}
                placeholder=" "
                aria-label="Password"
                required
              />
              <label className="absolute left-10 floating-label text-gray-500">
                Password
              </label>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-600"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
              {errors.password && (
                <p className="mt-1 text-sm text-red-500 flex items-center animate-fade-in">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.password}
                </p>
              )}
            </div>
            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-red-500 border-red-200 rounded focus:ring-red-400 mt-1 outline-0"
                  aria-label="Remember me"
                />
                <span className="ml-2 text-sm text-gray-500">Remember me</span>
              </label>
              <a
                href="/forgot-password"
                className="text-sm text-red-500 hover:text-red-600 font-medium"
              >
                Forgot password?
              </a>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-red-500 to-pink-400 text-white py-2 rounded-lg font-medium text-base hover:from-red-600 hover:to-pink-500 hover:shadow-md hover:shadow-red-500/50 transition-all animate-pulse-glow flex items-center justify-center space-x-2"
              aria-label="Sign In"
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
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-red-100" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-transparent text-gray-500">
                  Or continue with
                </span>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={connectWallet}
                disabled={isLoading}
                className="flex items-center justify-center px-4 py-2 border border-red-200 bg-red-50 rounded-lg text-sm font-medium text-gray-600 hover:bg-red-100 hover:shadow-sm hover:shadow-red-500/50 transition-all disabled:opacity-50"
                aria-label="Connect Wallet"
              >
                <Fingerprint className="w-4 h-4 mr-2" />
                Connect Wallet
              </button>
              <button
                type="button"
                className="flex items-center justify-center px-4 py-2 border border-red-200 bg-red-50 rounded-lg text-sm font-medium text-gray-600 hover:bg-red-100 hover:shadow-sm hover:shadow-red-500/50 transition-all"
                aria-label="Sign in with Biometric"
              >
                <Smartphone className="w-4 h-4 mr-2" />
                Biometric
              </button>
            </div>
          </form>
          <p className="text-center mt-6 text-sm text-gray-500">
            New here?{" "}
            <a
              href="/signup"
              className="text-red-500 hover:text-red-600 font-medium"
            >
              Sign up
            </a>
          </p>
          <div className="mt-8 grid grid-cols-3 gap-3 text-center">
            <div className="bg-red-50 rounded-lg p-3 border border-red-100 hover:shadow-sm hover:shadow-red-500/50 transition-all">
              <Shield className="w-6 h-6 text-green-600 mx-auto mb-2" />
              <p className="text-xs text-gray-500 font-medium">
                Bank-level Security
              </p>
            </div>
            <div className="bg-red-50 rounded-lg p-3 border border-red-100 hover:shadow-sm hover:shadow-red-500/50 transition-all">
              <Heart className="w-6 h-6 text-red-500 mx-auto mb-2" />
              <p className="text-xs text-gray-500 font-medium">
                1000+ Lives Saved
              </p>
            </div>
            <div className="bg-red-50 rounded-lg p-3 border border-red-100 hover:shadow-sm hover:shadow-red-500/50 transition-all">
              <CheckCircle className="w-6 h-6 text-blue-600 mx-auto mb-2" />
              <p className="text-xs text-gray-500 font-medium">100% Verified</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Login;
