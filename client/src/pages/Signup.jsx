import React, { useState, useEffect } from 'react';
import { Heart, Mail, Lock, Eye, EyeOff, Shield, User, Building2, ChevronRight, AlertCircle, CheckCircle, ArrowLeft, Fingerprint, Smartphone } from 'lucide-react';

const BloodChainLogin = () => {
  const [activeTab, setActiveTab] = useState('login');
  const [userType, setUserType] = useState('donor');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [particles, setParticles] = useState([]);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    organization: '',
    walletAddress: '',
    twoFactorEnabled: false
  });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState('');

  useEffect(() => {
    // Generate floating particles
    const newParticles = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 5,
      duration: 3 + Math.random() * 4
    }));
    setParticles(newParticles);
  }, []);

  const userTypes = [
    { id: 'donor', label: 'Blood Donor', icon: Heart, color: 'red' },
    { id: 'bloodbank', label: 'Blood Bank', icon: Building2, color: 'blue' },
    { id: 'hospital', label: 'Hospital', icon: Shield, color: 'green' }
  ];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    // Clear error when user starts typing
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
    
    if (activeTab === 'register') {
      if (!formData.firstName) newErrors.firstName = 'First name is required';
      if (!formData.lastName) newErrors.lastName = 'Last name is required';
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
      if (userType !== 'donor' && !formData.organization) {
        newErrors.organization = 'Organization name is required';
      }
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
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      if (activeTab === 'register') {
        setSuccess('Account created successfully! Please check your email to verify your account.');
        setStep(2);
      } else {
        setSuccess('Login successful! Redirecting to dashboard...');
        setTimeout(() => {
          // Redirect to dashboard
          console.log('Redirecting to dashboard...');
        }, 1500);
      }
    } catch (error) {
      setErrors({ general: 'An error occurred. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const connectWallet = async () => {
    setIsLoading(true);
    try {
      // Simulate wallet connection
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
      className="absolute w-1 h-1 bg-red-300 rounded-full opacity-60"
      style={{
        left: `${particle.x}%`,
        top: `${particle.y}%`,
        animation: `float ${particle.duration}s ease-in-out infinite ${particle.delay}s`
      }}
    />
  );

  const renderUserTypeSelector = () => (
    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-700 mb-3">Select Account Type</label>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {userTypes.map((type) => (
          <button
            key={type.id}
            type="button"
            onClick={() => setUserType(type.id)}
            className={`relative p-4 rounded-xl border-2 transition-all duration-300 ${
              userType === type.id
                ? `border-${type.color}-500 bg-${type.color}-50 text-${type.color}-700`
                : 'border-gray-200 hover:border-gray-300 text-gray-600'
            }`}
          >
            <div className="flex flex-col items-center space-y-2">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                userType === type.id ? `bg-${type.color}-500 text-white` : 'bg-gray-100 text-gray-600'
              }`}>
                <type.icon className="w-5 h-5" />
              </div>
              <span className="text-sm font-medium">{type.label}</span>
            </div>
            {userType === type.id && (
              <div className={`absolute -top-1 -right-1 w-6 h-6 bg-${type.color}-500 rounded-full flex items-center justify-center`}>
                <CheckCircle className="w-4 h-4 text-white" />
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );

  const renderLoginForm = () => (
    <div className="space-y-6">
      {renderUserTypeSelector()}
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all ${
              errors.email ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter your email"
          />
        </div>
        {errors.email && <p className="mt-1 text-sm text-red-600 flex items-center"><AlertCircle className="w-4 h-4 mr-1" />{errors.email}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type={showPassword ? 'text' : 'password'}
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            className={`w-full pl-10 pr-12 py-3 border rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all ${
              errors.password ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter your password"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>
        {errors.password && <p className="mt-1 text-sm text-red-600 flex items-center"><AlertCircle className="w-4 h-4 mr-1" />{errors.password}</p>}
      </div>

      <div className="flex items-center justify-between">
        <label className="flex items-center">
          <input type="checkbox" className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500" />
          <span className="ml-2 text-sm text-gray-600">Remember me</span>
        </label>
        <a href="#" className="text-sm text-red-600 hover:text-red-700 font-medium">Forgot password?</a>
      </div>

      {errors.general && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600 flex items-center">
            <AlertCircle className="w-4 h-4 mr-2" />
            {errors.general}
          </p>
        </div>
      )}

      {success && (
        <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm text-green-600 flex items-center">
            <CheckCircle className="w-4 h-4 mr-2" />
            {success}
          </p>
        </div>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-gradient-to-r from-red-600 to-pink-600 text-white py-3 px-4 rounded-xl font-semibold hover:from-red-700 hover:to-pink-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
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
          <div className="w-full border-t border-gray-300" />
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
          className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:ring-2 focus:ring-red-500 transition-all disabled:opacity-50"
        >
          <Fingerprint className="w-5 h-5 mr-2" />
          Connect Wallet
        </button>
        <button
          type="button"
          className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:ring-2 focus:ring-red-500 transition-all"
        >
          <Smartphone className="w-5 h-5 mr-2" />
          Biometric
        </button>
      </div>
    </div>
  );

  const renderRegisterForm = () => (
    <div className="space-y-6">
      {step === 1 ? (
        <>
          {renderUserTypeSelector()}
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all ${
                  errors.firstName ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="John"
              />
              {errors.firstName && <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all ${
                  errors.lastName ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Doe"
              />
              {errors.lastName && <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="john@example.com"
              />
            </div>
            {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
          </div>

          {userType !== 'donor' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {userType === 'bloodbank' ? 'Blood Bank Name' : 'Hospital Name'}
              </label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  name="organization"
                  value={formData.organization}
                  onChange={handleInputChange}
                  className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all ${
                    errors.organization ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder={userType === 'bloodbank' ? 'City Blood Bank' : 'General Hospital'}
                />
              </div>
              {errors.organization && <p className="mt-1 text-sm text-red-600">{errors.organization}</p>}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`w-full pl-10 pr-12 py-3 border rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all ${
                    errors.password ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Create password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className={`w-full pl-10 pr-12 py-3 border rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all ${
                    errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Confirm password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.confirmPassword && <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>}
            </div>
          </div>

          <div className="flex items-start">
            <input
              type="checkbox"
              className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500 mt-1"
              required
            />
            <label className="ml-2 text-sm text-gray-600">
              I agree to the{' '}
              <a href="#" className="text-red-600 hover:text-red-700 font-medium">Terms of Service</a>
              {' '}and{' '}
              <a href="#" className="text-red-600 hover:text-red-700 font-medium">Privacy Policy</a>
            </label>
          </div>
        </>
      ) : (
        <div className="text-center py-8">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Account Created!</h3>
          <p className="text-gray-600 mb-6">
            We've sent a verification email to <strong>{formData.email}</strong>. 
            Please check your inbox and click the verification link to activate your account.
          </p>
          <button
            type="button"
            onClick={() => setActiveTab('login')}
            className="bg-gradient-to-r from-red-600 to-pink-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-red-700 hover:to-pink-700 transition-all duration-300"
          >
            Go to Login
          </button>
        </div>
      )}

      {step === 1 && (
        <>
          {errors.general && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600 flex items-center">
                <AlertCircle className="w-4 h-4 mr-2" />
                {errors.general}
              </p>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-red-600 to-pink-600 text-white py-3 px-4 rounded-xl font-semibold hover:from-red-700 hover:to-pink-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>Create Account</span>
                <ChevronRight className="w-5 h-5" />
              </>
            )}
          </button>
        </>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-pink-50 flex items-center justify-center p-4 relative overflow-hidden">
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0.3; }
          50% { transform: translateY(-100px) rotate(180deg); opacity: 0.8; }
        }
      `}</style>

      {/* Floating Particles Background */}
      <div className="absolute inset-0 pointer-events-none">
        {particles.map((particle) => (
          <FloatingParticle key={particle.id} particle={particle} />
        ))}
      </div>

      {/* Background Gradient Orbs */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-red-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
      <div className="absolute top-0 right-0 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-red-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000"></div>

      {/* Back to Home */}
      <button className="absolute top-6 left-6 flex items-center space-x-2 text-gray-600 hover:text-red-600 transition-colors">
        <ArrowLeft className="w-5 h-5" />
        <span>Back to Home</span>
      </button>

      {/* Main Login Container */}
      <div className="relative w-full max-w-md">
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8">
          {/* Logo and Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Heart className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">BloodChain</h1>
            <p className="text-gray-600">
              {activeTab === 'login' ? 'Welcome back! Sign in to your account' : 'Create your account to get started'}
            </p>
          </div>

          {/* Tab Switcher */}
          <div className="flex rounded-xl bg-gray-100 p-1 mb-8">
            <button
              onClick={() => {
                setActiveTab('login');
                setStep(1);
                setErrors({});
                setSuccess('');
              }}
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all duration-300 ${
                activeTab === 'login'
                  ? 'bg-white text-red-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => {
                setActiveTab('register');
                setStep(1);
                setErrors({});
                setSuccess('');
              }}
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all duration-300 ${
                activeTab === 'register'
                  ? 'bg-white text-red-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Forms */}
          {activeTab === 'login' ? renderLoginForm() : renderRegisterForm()}

          {/* Footer */}
          <div className="mt-8 text-center text-sm text-gray-500">
            <p>Secured by blockchain technology</p>
            <div className="flex items-center justify-center space-x-4 mt-2">
              <div className="flex items-center space-x-1">
                <Shield className="w-4 h-4 text-green-500" />
                <span>256-bit SSL</span>
              </div>
              <div className="flex items-center space-x-1">
                <CheckCircle className="w-4 h-4 text-blue-500" />
                <span>HIPAA Compliant</span>
              </div>
            </div>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="mt-6 grid grid-cols-3 gap-4 text-center">
          <div className="bg-white/60 backdrop-blur-sm rounded-xl p-3 border border-white/20">
            <Shield className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <p className="text-xs text-gray-600 font-medium">Bank-level Security</p>
          </div>
          <div className="bg-white/60 backdrop-blur-sm rounded-xl p-3 border border-white/20">
            <Heart className="w-8 h-8 text-red-600 mx-auto mb-2" />
            <p className="text-xs text-gray-600 font-medium">1000+ Lives Saved</p>
          </div>
          <div className="bg-white/60 backdrop-blur-sm rounded-xl p-3 border border-white/20">
            <CheckCircle className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <p className="text-xs text-gray-600 font-medium">100% Verified</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BloodChainLogin;