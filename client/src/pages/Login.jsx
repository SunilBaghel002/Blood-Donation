import React, { useState, useEffect } from "react";
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
  });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState("");

  // Generate floating particles
  useEffect(() => {
    const newParticles = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 5,
      duration: 3 + Math.random() * 4,
      size: 4 + Math.random() * 6,
    }));
    setParticles(newParticles);
  }, []);

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
      localStorage.setItem("token", data.token); // Store JWT
      setTimeout(() => {
        console.log("Redirecting to dashboard...");
        window.location.href = "/dashboard"; // Adjust to your dashboard route
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
      // Placeholder: Replace with actual wallet connection (e.g., MetaMask)
      const walletAddress = "0x742d35Cc6565C42c42..."; // Mock address
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

  const FloatingParticle = ({ particle }) => (
    <div
      className="absolute rounded-full bg-red-400 opacity-50"
      style={{
        left: `${particle.x}%`,
        top: `${particle.y}%`,
        width: `${particle.size}px`,
        height: `${particle.size}px`,
        animation: `float ${particle.duration}s ease-in-out infinite ${particle.delay}s, pulse-size 2s ease-in-out infinite`,
      }}
    />
  );

  return (
    <div className="min-h-screen bg-white font-sans">
      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px) scale(1);
            opacity: 0.4;
          }
          50% {
            transform: translateY(-80px) scale(1.2);
            opacity: 0.7;
          }
        }
        @keyframes pulse-size {
          0%,
          100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.3);
          }
        }
        @keyframes pulse-glow {
          0%,
          100% {
            box-shadow: 0 0 15px rgba(185, 28, 28, 0.4);
          }
          50% {
            box-shadow: 0 0 30px rgba(185, 28, 28, 0.7),
              0 0 50px rgba(185, 28, 28, 0.5);
          }
        }
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        .animate-fade-in {
          animation: fade-in 1s ease-out forwards;
        }
        .animate-pulse-glow {
          animation: pulse-glow 2s ease-in-out infinite;
        }
        .parallax-bg {
          background-attachment: fixed;
          background-position: center;
          background-repeat: no-repeat;
          background-size: cover;
        }
        @media (max-width: 768px) {
          .parallax-bg {
            background-attachment: scroll;
          }
        }
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
          background: #fff;
          padding: 0 4px;
        }
      `}</style>

      {/* Back to Home Button */}
      <button
        className="absolute top-6 left-6 flex items-center space-x-2 text-gray-600 hover:text-red-600 transition-colors animate-fade-in"
        onClick={() => (window.location.href = "/")}
        aria-label="Back to Home"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>Back to Home</span>
      </button>

      {/* Login Section */}
      <section
        className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-600 to-pink-500 parallax-bg relative overflow-hidden"
        // style={{
        //   backgroundImage: `url('https://cdn.britannica.com/32/191732-050-5320356D/Human-red-blood-cells.jpg')`,
        // }}
      >
        <div className="absolute inset-0 bg-black/10"></div>
        {particles.map((particle) => (
          <FloatingParticle key={particle.id} particle={particle} />
        ))}
        <div className="absolute top-0 left-0 w-72 h-72 bg-red-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-0 right-0 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
        <div className="relative bg-white/95 backdrop-blur-md p-6 sm:p-8 lg:p-12 rounded-2xl shadow-xl max-w-md w-full mx-4 animate-fade-in">
          <div className="flex items-center justify-center space-x-2 mb-6">
            <Heart className="w-8 h-8 text-red-600" />
            <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-900 animate-fade-in">
              Sign In to BloodChain
            </h2>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all ${
                  errors.email ? "border-red-500" : "border-red-300"
                }`}
                placeholder=" "
                aria-label="Email"
                required
              />
              <label className="absolute left-10 floating-label text-gray-400">
                Email Address
              </label>
              {errors.email && (
                <p className="mt-1 text-sm text-red-600 flex items-center animate-fade-in">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.email}
                </p>
              )}
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className={`w-full pl-10 pr-12 py-3 border rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all ${
                  errors.password ? "border-red-500" : "border-red-300"
                }`}
                placeholder=" "
                aria-label="Password"
                required
              />
              <label className="absolute left-10 floating-label text-gray-400">
                Password
              </label>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600 flex items-center animate-fade-in">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.password}
                </p>
              )}
            </div>
            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-red-600 border-gray-200 rounded focus:ring-red-500"
                  aria-label="Remember me"
                />
                <span className="ml-2 text-sm text-gray-600">Remember me</span>
              </label>
              <a
                href="/forgot-password"
                className="text-sm text-red-600 hover:text-red-500 font-medium"
              >
                Forgot password?
              </a>
            </div>
            {errors.general && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg animate-fade-in">
                <p className="text-sm text-red-600 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-2" />
                  {errors.general}
                </p>
              </div>
            )}
            {success && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg animate-fade-in">
                <p className="text-sm text-green-600 flex items-center">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  {success}
                </p>
              </div>
            )}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-red-600 to-pink-500 text-white py-3 rounded-lg font-semibold text-lg hover:from-red-700 hover:to-pink-600 transform hover:scale-105 transition-all duration-300 animate-pulse-glow flex items-center justify-center space-x-2"
              aria-label="Sign In"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Sign In</span>
                  <ChevronRight className="w-5 h-5" />
                </>
              )}
            </button>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Or continue with
                </span>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={connectWallet}
                disabled={isLoading}
                className="flex items-center justify-center px-4 py-3 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:ring-2 focus:ring-red-500 transition-all disabled:opacity-50"
                aria-label="Connect Wallet"
              >
                <Fingerprint className="w-5 h-5 mr-2" />
                Connect Wallet
              </button>
              <button
                type="button"
                className="flex items-center justify-center px-4 py-3 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:ring-2 focus:ring-red-500 transition-all"
                aria-label="Sign in with Biometric"
              >
                <Smartphone className="w-5 h-5 mr-2" />
                Biometric
              </button>
            </div>
          </form>
          <p className="text-center mt-6 text-sm text-gray-600">
            New here?{" "}
            <a
              href="/signup"
              className="text-red-600 hover:text-red-500 font-medium"
            >
              Sign up
            </a>
          </p>
          <div className="mt-8 grid grid-cols-3 gap-4 text-center">
            <div className="bg-gradient-to-r from-red-100 to-pink-100 rounded-lg p-3 border border-white/20 hover:shadow-md transition-all">
              <Shield className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <p className="text-xs text-gray-600 font-medium">
                Bank-level Security
              </p>
            </div>
            <div className="bg-gradient-to-r from-red-100 to-pink-100 rounded-lg p-3 border border-white/20 hover:shadow-md transition-all">
              <Heart className="w-8 h-8 text-red-600 mx-auto mb-2" />
              <p className="text-xs text-gray-600 font-medium">
                1000+ Lives Saved
              </p>
            </div>
            <div className="bg-gradient-to-r from-red-100 to-pink-100 rounded-lg p-3 border border-white/20 hover:shadow-md transition-all">
              <CheckCircle className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <p className="text-xs text-gray-600 font-medium">100% Verified</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      {/* <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-400 text-sm sm:text-base">
          <p>
            &copy; 2025 BloodChain. All rights reserved. Built with ❤️ for
            humanity.{" "}
            <a href="/privacy" className="hover:text-white">
              Privacy Policy
            </a>{" "}
            |{" "}
            <a href="/terms" className="hover:text-white">
              Terms of Service
            </a>
          </p>
        </div>
      </footer> */}
    </div>
  );
};

export default Login;
