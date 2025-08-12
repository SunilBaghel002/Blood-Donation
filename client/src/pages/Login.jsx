import React, { useState, useEffect } from 'react';
import { Heart, Mail, Lock, Eye, EyeOff, Shield, CheckCircle, ArrowUp, Menu, X, ChevronRight, AlertCircle, Fingerprint, Smartphone } from 'lucide-react';

const Login = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [particles, setParticles] = useState([]);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState('');

  // Handle scroll for navbar and back-to-top
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
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
      await new Promise(resolve => setTimeout(resolve, 1500));
      setSuccess('Login successful! Redirecting to dashboard...');
      setTimeout(() => {
        console.log('Redirecting to dashboard...');
      }, 1500);
    } catch (error) {
      setErrors({ general: 'Invalid email or password. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const connectWallet = async () => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setFormData(prev => ({ ...prev, walletAddress: '0x742d35Cc6565C42c42...' }));
      setSuccess('Wallet connected successfully!');
    } catch (error) {
      setErrors({ wallet: 'Failed to connect wallet' });
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
          0%, 100% { transform: translateY(0px) scale(1); opacity: 0.4; }
          50% { transform: translateY(-80px) scale(1.2); opacity: 0.7; }
        }
        @keyframes pulse-size {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.3); }
        }
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 15px rgba(185, 28, 28, 0.4); }
          50% { box-shadow: 0 0 30px rgba(185, 28, 28, 0.7), 0 0 50px rgba(185, 28, 28, 0.5); }
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .animate-fade-in { animation: fade-in 1s ease-out forwards; }
        .animate-pulse-glow { animation: pulse-glow 2s ease-in-out infinite; }
        .parallax-bg {
          background-attachment: fixed;
          background-position: center;
          background-repeat: no-repeat;
          background-size: cover;
        }
        @media (max-width: 768px) {
          .parallax-bg { background-attachment: scroll; }
        }
        .floating-label {
          transform: translateY(0);
          transition: all 0.3s ease;
        }
        .input-filled .floating-label,
        input:focus ~ .floating-label {
          transform: translateY(-24px);
          font-size: 0.75rem;
          color: #f87171;
        }
      `}</style>

      {/* Navigation */}
      <nav
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          scrollY > 50 ? 'bg-white/95 backdrop-blur-md shadow-md' : 'bg-transparent'
        }`}
        aria-label="Main navigation"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-r from-red-600 to-pink-500 rounded-lg flex items-center justify-center">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <span className={`text-2xl font-bold ${scrollY > 50 ? 'text-gray-900' : 'text-white'}`}>
                BloodChain
              </span>
            </div>
            <div className="hidden md:flex items-center space-x-6">
              {['Features', 'Technology', 'How It Works', 'Benefits', 'Contact'].map((item) => (
                <a
                  key={item}
                  href={`/#${item.toLowerCase().replace(' ', '-')}`}
                  className={`font-medium text-lg hover:text-red-500 transition-colors ${
                    scrollY > 50 ? 'text-gray-800' : 'text-white'
                  }`}
                >
                  {item}
                </a>
              ))}
              <a
                href="/signup"
                className="bg-gradient-to-r from-red-600 to-pink-500 text-white px-6 py-2 rounded-full font-semibold hover:from-red-700 hover:to-pink-600 transform hover:scale-105 transition-all duration-300 animate-pulse-glow"
              >
                Sign Up
              </a>
            </div>
            <button
              className="md:hidden text-white"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
          {isMenuOpen && (
            <div className="md:hidden bg-white/95 backdrop-blur-md shadow-md">
              <div className="flex flex-col space-y-4 py-4 px-6">
                {['Features', 'Technology', 'How It Works', 'Benefits', 'Contact'].map((item) => (
                  <a
                    key={item}
                    href={`/#${item.toLowerCase().replace(' ', '-')}`}
                    className="text-gray-800 font-medium hover:text-red-500 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item}
                  </a>
                ))}
                <a
                  href="/signup"
                  className="bg-gradient-to-r from-red-600 to-pink-500 text-white px-6 py-2 rounded-full font-semibold text-center hover:from-red-700 hover:to-pink-600 transition-all"
                >
                  Sign Up
                </a>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Login Section */}
      <section
        className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-600 to-pink-500 parallax-bg relative overflow-hidden"
        style={{
          backgroundImage: `url('https://cdn.britannica.com/32/191732-050-5320356D/Human-red-blood-cells.jpg')`,
        }}
      >
        <div className="absolute inset-0 bg-black/40"></div>
        {particles.map((particle) => (
          <FloatingParticle key={particle.id} particle={particle} />
        ))}
        <div className="absolute top-0 left-0 w-72 h-72 bg-red-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-0 right-0 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
        <div className="relative bg-white/95 backdrop-blur-md p-6 sm:p-8 lg:p-12 rounded-2xl shadow-xl max-w-md w-full mx-4 animate-fade-in">
          <div className="flex items-center justify-center space-x-2 mb-6">
            <Heart className="w-8 h-8 text-red-600" />
            <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-900 animate-fade-in">Sign In to BloodChain</h2>
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
                  errors.email ? 'border-red-500' : 'border-gray-200'
                } ${formData.email ? 'input-filled' : ''}`}
                placeholder=" "
                aria-label="Email"
                required
              />
              <label className="absolute left-10 top-3 text-gray-400 floating-label pointer-events-none">Email Address</label>
              {errors.email && (
                <p className="mt-1 text-sm text-red-600 flex items-center animate-fade-in">
                  <AlertCircle className="w-4 h-4 mr-1" />{errors.email}
                </p>
              )}
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className={`w-full pl-10 pr-12 py-3 border rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all ${
                  errors.password ? 'border-red-500' : 'border-gray-200'
                } ${formData.password ? 'input-filled' : ''}`}
                placeholder=" "
                aria-label="Password"
                required
              />
              <label className="absolute left-10 top-3 text-gray-400 floating-label pointer-events-none">Password</label>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600 flex items-center animate-fade-in">
                  <AlertCircle className="w-4 h-4 mr-1" />{errors.password}
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
              <a href="/forgot-password" className="text-sm text-red-600 hover:text-red-500 font-medium">
                Forgot password?
              </a>
            </div>
            {errors.general && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg animate-fade-in">
                <p className="text-sm text-red-600 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-2" />{errors.general}
                </p>
              </div>
            )}
            {success && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg animate-fade-in">
                <p className="text-sm text-green-600 flex items-center">
                  <CheckCircle className="w-4 h-4 mr-2" />{success}
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
                <span className="px-2 bg-white text-gray-500">Or continue with</span>
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
            New here? <a href="/signup" className="text-red-600 hover:text-red-500 font-medium">Sign up</a>
          </p>
          <div className="mt-8 grid grid-cols-3 gap-4 text-center">
            <div className="bg-gradient-to-r from-red-100 to-pink-100 rounded-lg p-3 border border-white/20 hover:shadow-md transition-all">
              <Shield className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <p className="text-xs text-gray-600 font-medium">Bank-level Security</p>
            </div>
            <div className="bg-gradient-to-r from-red-100 to-pink-100 rounded-lg p-3 border border-white/20 hover:shadow-md transition-all">
              <Heart className="w-8 h-8 text-red-600 mx-auto mb-2" />
              <p className="text-xs text-gray-600 font-medium">1000+ Lives Saved</p>
            </div>
            <div className="bg-gradient-to-r from-red-100 to-pink-100 rounded-lg p-3 border border-white/20 hover:shadow-md transition-all">
              <CheckCircle className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <p className="text-xs text-gray-600 font-medium">100% Verified</p>
            </div>
          </div>
        </div>
      </section>

      {/* Back to Top Button */}
      <button
        className={`fixed bottom-6 right-6 p-3 bg-red-600 text-white rounded-full shadow-lg hover:bg-red-700 transition-all duration-300 ${
          scrollY > 300 ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        aria-label="Scroll to top"
      >
        <ArrowUp className="w-6 h-6" />
      </button>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-400 text-sm sm:text-base">
          <p>
            &copy; 2025 BloodChain. All rights reserved. Built with ❤️ for humanity.{' '}
            <a href="/privacy" className="hover:text-white">Privacy Policy</a> |{' '}
            <a href="/terms" className="hover:text-white">Terms of Service</a>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Login;