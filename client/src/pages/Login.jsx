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
  Droplets,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [particles, setParticles] = useState([]);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState("");

  /* ---------- Auto-dismiss toast ---------- */
  useEffect(() => {
    if (success || errors.general) {
      const t = setTimeout(() => {
        setSuccess("");
        setErrors((prev) => ({ ...prev, general: "" }));
      }, 5000);
      return () => clearTimeout(t);
    }
  }, [success, errors.general]);

  /* ---------- Floating blood particles (only on form side) ---------- */
  useEffect(() => {
    const newParticles = Array.from({ length: 10 }, (_, i) => ({
      id: i,
      x: Math.random() * 40 + 5, // Keep particles on left side only
      y: Math.random() * 100,
      delay: Math.random() * 5,
      duration: 6 + Math.random() * 4,
      size: 10 + Math.random() * 6,
    }));
    setParticles(newParticles);
  }, []);

  const messageVariants = {
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
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
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Invalid credentials");

      setSuccess(data.message);
      localStorage.setItem("token", data.token);
      localStorage.setItem("userId", data.user._id);
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
      } else if (data.user.role === "Admin") {
        localStorage.setItem(
          "adminInfo",
          JSON.stringify(data.user.adminInfo || {})
        );
      }

      setTimeout(() => {
        navigate(`/${data.user.role.toLowerCase()}-dashboard`);
      }, 1500);
    } catch (error) {
      setErrors({ general: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  /* ---------- Blood droplet particle ---------- */
  const BloodDroplet = ({ p }) => (
    <motion.div
      className="absolute pointer-events-none"
      style={{ left: `${p.x}%`, top: `${p.y}%` }}
      animate={{ y: [0, -80, 0], scale: [1, 1.2, 1], opacity: [0.4, 0.7, 0.4] }}
      transition={{
        duration: p.duration,
        delay: p.delay,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      <svg width={p.size} height={p.size} viewBox="0 0 24 24" fill="none">
        <path
          d="M12 2C12 2 8 7 8 11C8 15 12 20 12 20C12 20 16 15 16 11C16 7 12 2 12 2Z"
          fill="#ef4444"
          opacity="0.6"
        />
      </svg>
    </motion.div>
  );

  return (
    <>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
          body { font-family: 'Inter', sans-serif; }
          .floating-label { 
            position: absolute; top: -8px; left: 12px; font-size: 12px; 
            background: white; padding: 0 4px; color: #6b7280; 
            transition: all 0.2s ease; pointer-events: none; 
          }
          input:focus ~ .floating-label, 
          input:not(:placeholder-shown) ~ .floating-label { color: #dc2626; }
        `}
      </style>

      <div className="min-h-screen flex flex-col lg:flex-row overflow-hidden relative">
        {/* Floating blood particles (only on left half) */}
        {particles.map((p) => (
          <BloodDroplet key={p.id} p={p} />
        ))}

        {/* Toast messages */}
        <div className="fixed top-4 right-4 z-50 space-y-2">
          <AnimatePresence>
            {errors.general && (
              <motion.div
                variants={messageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="p-4 bg-red-50 border border-red-200 rounded-lg shadow-sm flex items-center"
              >
                <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
                <p className="text-sm text-red-700">{errors.general}</p>
              </motion.div>
            )}
            {success && (
              <motion.div
                variants={messageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="p-4 bg-green-50 border border-green-200 rounded-lg shadow-sm flex items-center"
              >
                <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                <p className="text-sm text-green-700">{success}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Back button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate("/")}
          className="absolute top-6 left-6 flex items-center gap-2 text-gray-600 hover:text-red-600 transition z-10"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm font-medium">Back to Home</span>
        </motion.button>

        {/* LEFT HALF: Login Form (50vw) */}
        <div className="w-full lg:w-1/2 min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-pink-50 p-6">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            className="w-full max-w-md sm:scale-125 scale-100"
          >
            <div className="bg-white/95 backdrop-blur-sm p-8 rounded-2xl shadow-2xl border border-red-100">
              {/* Logo */}
              <div className="flex justify-center mb-6">
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Droplets className="w-12 h-12 text-red-600" />
                </motion.div>
              </div>

              <h1 className="text-center text-2xl font-bold text-gray-800 mb-2">
                Welcome back
              </h1>
              <p className="text-center text-sm text-gray-600 mb-8">
                Welcome back! Please enter your details.
              </p>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Email */}
                <div className="relative">
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder=" "
                    className={`w-full px-4 py-3 bg-gray-50 border ${
                      errors.email ? "border-red-500" : "border-gray-200"
                    } rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition`}
                  />
                  <label className="floating-label">Email</label>
                  {errors.email && (
                    <p className="mt-1 text-xs text-red-600 flex items-center">
                      <AlertCircle className="w-3 h-3 mr-1" />
                      {errors.email}
                    </p>
                  )}
                </div>

                {/* Password */}
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder=" "
                    className={`w-full px-4 py-3 bg-gray-50 border ${
                      errors.password ? "border-red-500" : "border-gray-200"
                    } rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition`}
                  />
                  <label className="floating-label">Password</label>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                  {errors.password && (
                    <p className="mt-1 text-xs text-red-600 flex items-center">
                      <AlertCircle className="w-3 h-3 mr-1" />
                      {errors.password}
                    </p>
                  )}
                </div>

                {/* Remember & Forgot */}
                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                    />
                    <span className="ml-2 text-gray-600">
                      Remember for 30 days
                    </span>
                  </label>
                  <a
                    href="/forgot-password"
                    className="text-red-600 hover:text-red-700 font-medium"
                  >
                    Forgot password
                  </a>
                </div>

                {/* Submit */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-3 rounded-lg transition flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      Sign in
                      <ChevronRight className="w-4 h-4" />
                    </>
                  )}
                </motion.button>

                {/* Google */}
                <button
                  type="button"
                  className="w-full flex items-center justify-center gap-3 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 6.75c1.63 0 3.06.56 4.21 1.65l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Sign in with Google
                </button>
              </form>

              <p className="text-center mt-6 text-sm text-gray-600">
                Don’t have an account?{" "}
                <a
                  href="/signup"
                  className="text-red-600 hover:text-red-700 font-medium"
                >
                  Sign up
                </a>
              </p>
            </div>
          </motion.div>
        </div>

        {/* RIGHT HALF: Full Image (50vw × 100vh) - Hidden on mobile */}
        <div className="hidden lg:block w-1/2 h-screen relative overflow-hidden">
          <motion.div
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0"
          >
            <img
              src="https://t3.ftcdn.net/jpg/03/73/15/18/360_F_373151842_vSb3llzX7fSStSTianXmmlOGt5VNbZaM.jpg"
              alt="Blood donation saves lives"
              className="w-full h-full object-cover"
            />
            {/* Dark overlay for text readability */}
            <div className="absolute inset-0 bg-black/40" />

            {/* Centered text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white p-8">
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-5xl md:text-6xl font-bold drop-shadow-2xl"
              >
                Every Drop Counts
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mt-4 text-xl md:text-2xl font-medium drop-shadow-lg"
              >
                Be a hero. Donate blood today.
              </motion.p>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default Login;
