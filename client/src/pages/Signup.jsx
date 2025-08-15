```javascriptreact
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
  User,
} from "lucide-react";

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [particles, setParticles] = useState([]);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    role: "Donor",
    otp: "",
    walletAddress: "",
    questionnaire: {
      bloodGroup: "",
      donationCount: "",
      lastDonationDate: "",
      medicalConditions: "",
      hospitalName: "",
      hospitalLocation: "",
      bedCount: "",
      hospitalContactNumber: "",
      name: "", // Changed from bloodBankName
      location: "", // Changed from bloodBankLocation
      bloodStorageCapacity: "",
      contactNumber: "", // Changed from bloodBankContactNumber
    },
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
    const { name, value, type, checked } = e.target;
    if (name.includes("questionnaire.")) {
      const field = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        questionnaire: {
          ...prev.questionnaire,
          [field]: type === "checkbox" ? checked : value,
        },
      }));
      // Clear error for the specific questionnaire field
      if (errors[`questionnaire.${field}`]) {
        setErrors((prev) => ({ ...prev, [`questionnaire.${field}`]: "" }));
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
      // Clear error for the top-level field
      if (errors[name]) {
        setErrors((prev) => ({ ...prev, [name]: "" }));
      }
    }
  };

  const validateStep = () => {
    const newErrors = {};
    if (step === 1) {
      if (!formData.role) newErrors.role = "Role is required";
      if (formData.role === "Donor") {
        if (!formData.firstName) newErrors.firstName = "First name is required";
        if (!formData.lastName) newErrors.lastName = "Last name is required";
      }
      if (!formData.email) {
        newErrors.email = "Email is required";
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = "Email is invalid";
      }
    } else if (step === 2) {
      if (!formData.otp) {
        newErrors.otp = "OTP is required";
      } else if (!/^\w{6}$/.test(formData.otp)) {
        newErrors.otp = "OTP must be a 6-character code";
      }
    } else if (step === 3) {
      if (!formData.password) {
        newErrors.password = "Password is required";
      } else if (formData.password.length < 8) {
        newErrors.password = "Password must be at least 8 characters";
      }
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
      }
    } else if (step === 4) {
      if (formData.role === "Donor") {
        if (!formData.questionnaire.bloodGroup) {
          newErrors["questionnaire.bloodGroup"] = "Blood group is required";
        }
      } else if (formData.role === "Hospital") {
        if (!formData.questionnaire.hospitalName)
          newErrors["questionnaire.hospitalName"] = "Hospital name is required";
        if (!formData.questionnaire.hospitalLocation)
          newErrors["questionnaire.hospitalLocation"] = "Location is required";
        if (!formData.questionnaire.bedCount)
          newErrors["questionnaire.bedCount"] = "Bed count is required";
        if (!formData.questionnaire.hospitalContactNumber)
          newErrors["questionnaire.hospitalContactNumber"] = "Contact number is required";
      } else if (formData.role === "BloodBank") {
        if (!formData.questionnaire.name)
          newErrors["questionnaire.name"] = "Blood bank name is required";
        if (!formData.questionnaire.location)
          newErrors["questionnaire.location"] = "Location is required";
        if (!formData.questionnaire.bloodStorageCapacity)
          newErrors["questionnaire.bloodStorageCapacity"] = "Storage capacity is required";
        if (!formData.questionnaire.contactNumber)
          newErrors["questionnaire.contactNumber"] = "Contact number is required";
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep()) return;
    setIsLoading(true);
    setErrors({});
    try {
      if (step === 1) {
        const response = await fetch("http://localhost:5000/api/auth/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            role: formData.role,
          }),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Failed to send OTP");
        setSuccess(data.message);
        setStep(2);
      } else if (step === 2) {
        const response = await fetch("http://localhost:5000/api/auth/verify-otp", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: formData.email, otp: formData.otp }),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Failed to verify OTP");
        setSuccess(data.message);
        setStep(3);
      } else if (step === 3) {
        const response = await fetch("http://localhost:5000/api/auth/complete-signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
            confirmPassword: formData.confirmPassword,
          }),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Failed to set password");
        setSuccess(data.message);
        setStep(4);
      } else if (step === 4) {
        // Prepare questionnaire data based on role
        let questionnaireData = {};
        if (formData.role === "Donor") {
          questionnaireData = {
            bloodGroup: formData.questionnaire.bloodGroup,
            donationCount: formData.questionnaire.donationCount,
            lastDonationDate: formData.questionnaire.lastDonationDate,
            medicalConditions: formData.questionnaire.medicalConditions,
          };
        } else if (formData.role === "Hospital") {
          questionnaireData = {
            name: formData.questionnaire.hospitalName,
            location: formData.questionnaire.hospitalLocation,
            bedCount: formData.questionnaire.bedCount,
            contactNumber: formData.questionnaire.hospitalContactNumber,
          };
        } else if (formData.role === "BloodBank") {
          questionnaireData = {
            name: formData.questionnaire.name,
            location: formData.questionnaire.location,
            bloodStorageCapacity: formData.questionnaire.bloodStorageCapacity,
            contactNumber: formData.questionnaire.contactNumber,
          };
        }

        const response = await fetch("http://localhost:5000/api/auth/submit-questionnaire", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: formData.email,
            role: formData.role,
            questionnaire: questionnaireData,
          }),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Failed to submit questionnaire");
        setSuccess(data.message);
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", data.user.role);
        setTimeout(() => {
          window.location.href = "/dashboard";
        }, 1500);
      }
    } catch (error) {
      setErrors({ general: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  const connectWallet = async () => {
    setIsLoading(true);
    try {
      const walletAddress = "0x742d35Cc6565C42c42..."; // Mock address
      const response = await fetch("http://localhost:5000/api/auth/connect-wallet", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ email: formData.email, walletAddress }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to connect wallet");
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
      <div className="absolute inset-0">
        <style>
          {`
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
            @media (max-width: 768px) { .parallax-bg { background-attachment: scroll; } }
            .floating-label {
              top: 50%;
              transform: translateY(-50%);
              transition: all 0.3s ease;
              pointer-events: none;
            }
            input:focus ~ .floating-label,
            input:not(:placeholder-shown) ~ .floating-label,
            select:focus ~ .floating-label,
            select:not([value=""]) ~ .floating-label,
            textarea:focus ~ .floating-label,
            textarea:not(:placeholder-shown) ~ .floating-label {
              top: -8px;
              transform: translateY(0);
              font-size: 0.75rem;
              color: #f87171;
              background: #fff;
              padding: 0 4px;
            }
            .progress-bar {
              background: linear-gradient(to right, #dc2626 ${(step / 4) * 100}%, #e5e7eb ${(step / 4) * 100}%);
            }
          `}
        </style>
      </div>

      <button
        className="absolute top-6 left-6 flex items-center space-x-2 text-gray-600 hover:text-red-600 transition-colors animate-fade-in"
        onClick={() => (window.location.href = "/")}
        aria-label="Back to Home"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>Back to Home</span>
      </button>

      <section
        className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-600 to-pink-500 parallax-bg relative overflow-hidden"
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
              Sign Up for BloodChain
            </h2>
          </div>
          <div className="relative mb-6">
            <div className="w-full h-2 bg-gray-200 rounded-full progress-bar"></div>
            <div className="flex justify-between text-sm text-gray-600 mt-1">
              <span>
                Step {step}:{" "}
                {step === 1
                  ? "Account Details"
                  : step === 2
                  ? "Verify OTP"
                  : step === 3
                  ? "Set Password"
                  : "Questionnaire"}
              </span>
              <span>{step}/4</span>
            </div>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            {step === 1 && (
              <>
                <div className="relative">
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all ${
                      errors.role ? "border-red-500" : "border-red-300"
                    }`}
                    aria-label="Role"
                    required
                  >
                    <option value="Donor">Donor</option>
                    <option value="Hospital">Hospital</option>
                    <option value="BloodBank">Blood Bank</option>
                  </select>
                  <label className="absolute left-4 floating-label text-gray-400">
                    Role
                  </label>
                  {errors.role && (
                    <p className="mt-1 text-sm text-red-600 flex items-center animate-fade-in">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.role}
                    </p>
                  )}
                </div>
                {formData.role === "Donor" && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all ${
                          errors.firstName ? "border-red-500" : "border-red-300"
                        }`}
                        placeholder=" "
                        aria-label="First Name"
                        required
                      />
                      <label className="absolute left-10 floating-label text-gray-400">
                        First Name
                      </label>
                      {errors.firstName && (
                        <p className="mt-1 text-sm text-red-600 flex items-center animate-fade-in">
                          <AlertCircle className="w-4 h-4 mr-1" />
                          {errors.firstName}
                        </p>
                      )}
                    </div>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all ${
                          errors.lastName ? "border-red-500" : "border-red-300"
                        }`}
                        placeholder=" "
                        aria-label="Last Name"
                        required
                      />
                      <label className="absolute left-10 floating-label text-gray-400">
                        Last Name
                      </label>
                      {errors.lastName && (
                        <p className="mt-1 text-sm text-red-600 flex items-center animate-fade-in">
                          <AlertCircle className="w-4 h-4 mr-1" />
                          {errors.lastName}
                        </p>
                      )}
                    </div>
                  </div>
                )}
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
              </>
            )}
            {step === 2 && (
              <div className="relative">
                <input
                  type="text"
                  name="otp"
                  value={formData.otp}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all ${
                    errors.otp ? "border-red-500" : "border-red-300"
                  }`}
                  placeholder=" "
                  aria-label="OTP"
                  required
                />
                <label className="absolute left-4 floating-label text-gray-400">
                  Enter 6-digit OTP
                </label>
                {errors.otp && (
                  <p className="mt-1 text-sm text-red-600 flex items-center animate-fade-in">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.otp}
                  </p>
                )}
                <p className="text-sm text-gray-600 mt-2">
                  An OTP has been sent to <strong>{formData.email}</strong>.
                  Please check your inbox.
                </p>
              </div>
            )}
            {step === 3 && (
              <>
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
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                  {errors.password && (
                    <p className="mt-1 text-sm text-red-600 flex items-center animate-fade-in">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.password}
                    </p>
                  )}
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-12 py-3 border rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all ${
                      errors.confirmPassword ? "border-red-500" : "border-red-300"
                    }`}
                    placeholder=" "
                    aria-label="Confirm Password"
                    required
                  />
                  <label className="absolute left-10 floating-label text-gray-400">
                    Confirm Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                  {errors.confirmPassword && (
                    <p className="mt-1 text-sm text-red-600 flex items-center animate-fade-in">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>
                <div className="flex items-start">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-red-600 border-gray-200 rounded focus:ring-red-500 mt-1"
                    aria-label="Agree to Terms and Privacy Policy"
                    required
                  />
                  <label className="ml-2 text-sm text-gray-600">
                    I agree to the{" "}
                    <a href="/terms" className="text-red-600 hover:text-red-500 font-medium">
                      Terms of Service
                    </a>{" "}
                    and{" "}
                    <a href="/privacy" className="text-red-600 hover:text-red-500 font-medium">
                      Privacy Policy
                    </a>
                  </label>
                </div>
              </>
            )}
            {step === 4 && formData.role === "Donor" && (
              <div className="space-y-6">
                <div className="relative">
                  <select
                    name="questionnaire.bloodGroup"
                    value={formData.questionnaire.bloodGroup}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all ${
                      errors["questionnaire.bloodGroup"] ? "border-red-500" : "border-red-300"
                    }`}
                    aria-label="Blood Group"
                    required
                  >
                    <option value="">Select Blood Group</option>
                    {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((bg) => (
                      <option key={bg} value={bg}>
                        {bg}
                      </option>
                    ))}
                  </select>
                  <label className="absolute left-4 floating-label text-gray-400">
                    Blood Group
                  </label>
                  {errors["questionnaire.bloodGroup"] && (
                    <p className="mt-1 text-sm text-red-600 flex items-center animate-fade-in">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors["questionnaire.bloodGroup"]}
                    </p>
                  )}
                </div>
                <div className="relative">
                  <input
                    type="number"
                    name="questionnaire.donationCount"
                    value={formData.questionnaire.donationCount}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all ${
                      errors["questionnaire.donationCount"] ? "border-red-500" : "border-red-300"
                    }`}
                    placeholder=" "
                    aria-label="Donation Count"
                  />
                  <label className="absolute left-4 floating-label text-gray-400">
                    Number of Donations
                  </label>
                  {errors["questionnaire.donationCount"] && (
                    <p className="mt-1 text-sm text-red-600 flex items-center animate-fade-in">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors["questionnaire.donationCount"]}
                    </p>
                  )}
                </div>
                <div className="relative">
                  <input
                    type="date"
                    name="questionnaire.lastDonationDate"
                    value={formData.questionnaire.lastDonationDate}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                    placeholder=" "
                    aria-label="Last Donation Date"
                  />
                  <label className="absolute left-4 floating-label text-gray-400">
                    Last Donation Date
                  </label>
                </div>
                <div className="relative">
                  <textarea
                    name="questionnaire.medicalConditions"
                    value={formData.questionnaire.medicalConditions}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                    placeholder=" "
                    aria-label="Medical Conditions"
                  />
                  <label className="absolute left-4 floating-label text-gray-400">
                    Medical Conditions
                  </label>
                </div>
              </div>
            )}
            {step === 4 && formData.role === "Hospital" && (
              <div className="space-y-6">
                <div className="relative">
                  <input
                    type="text"
                    name="questionnaire.hospitalName"
                    value={formData.questionnaire.hospitalName}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all ${
                      errors["questionnaire.hospitalName"] ? "border-red-500" : "border-red-300"
                    }`}
                    placeholder=" "
                    aria-label="Hospital Name"
                    required
                  />
                  <label className="absolute left-4 floating-label text-gray-400">
                    Hospital Name
                  </label>
                  {errors["questionnaire.hospitalName"] && (
                    <p className="mt-1 text-sm text-red-600 flex items-center animate-fade-in">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors["questionnaire.hospitalName"]}
                    </p>
                  )}
                </div>
                <div className="relative">
                  <input
                    type="text"
                    name="questionnaire.hospitalLocation"
                    value={formData.questionnaire.hospitalLocation}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all ${
                      errors["questionnaire.hospitalLocation"] ? "border-red-500" : "border-red-300"
                    }`}
                    placeholder=" "
                    aria-label="Location"
                    required
                  />
                  <label className="absolute left-4 floating-label text-gray-400">
                    Location
                  </label>
                  {errors["questionnaire.hospitalLocation"] && (
                    <p className="mt-1 text-sm text-red-600 flex items-center animate-fade-in">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors["questionnaire.hospitalLocation"]}
                    </p>
                  )}
                </div>
                <div className="relative">
                  <input
                    type="number"
                    name="questionnaire.bedCount"
                    value={formData.questionnaire.bedCount}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all ${
                      errors["questionnaire.bedCount"] ? "border-red-500" : "border-red-300"
                    }`}
                    placeholder=" "
                    aria-label="Bed Count"
                    required
                  />
                  <label className="absolute left-4 floating-label text-gray-400">
                    Bed Count
                  </label>
                  {errors["questionnaire.bedCount"] && (
                    <p className="mt-1 text-sm text-red-600 flex items-center animate-fade-in">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors["questionnaire.bedCount"]}
                    </p>
                  )}
                </div>
                <div className="relative">
                  <input
                    type="text"
                    name="questionnaire.hospitalContactNumber"
                    value={formData.questionnaire.hospitalContactNumber}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all ${
                      errors["questionnaire.hospitalContactNumber"] ? "border-red-500" : "border-red-300"
                    }`}
                    placeholder=" "
                    aria-label="Contact Number"
                    required
                  />
                  <label className="absolute left-4 floating-label text-gray-400">
                    Contact Number
                  </label>
                  {errors["questionnaire.hospitalContactNumber"] && (
                    <p className="mt-1 text-sm text-red-600 flex items-center animate-fade-in">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors["questionnaire.hospitalContactNumber"]}
                    </p>
                  )}
                </div>
              </div>
            )}
            {step === 4 && formData.role === "BloodBank" && (
              <div className="space-y-6">
                <div className="relative">
                  <input
                    type="text"
                    name="questionnaire.name"
                    value={formData.questionnaire.name}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all ${
                      errors["questionnaire.name"] ? "border-red-500" : "border-red-300"
                    }`}
                    placeholder=" "
                    aria-label="Blood Bank Name"
                    required
                  />
                  <label className="absolute left-4 floating-label text-gray-400">
                    Blood Bank Name
                  </label>
                  {errors["questionnaire.name"] && (
                    <p className="mt-1 text-sm text-red-600 flex items-center animate-fade-in">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors["questionnaire.name"]}
                    </p>
                  )}
                </div>
                <div className="relative">
                  <input
                    type="text"
                    name="questionnaire.location"
                    value={formData.questionnaire.location}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all ${
                      errors["questionnaire.location"] ? "border-red-500" : "border-red-300"
                    }`}
                    placeholder=" "
                    aria-label="Location"
                    required
                  />
                  <label className="absolute left-4 floating-label text-gray-400">
                    Location
                  </label>
                  {errors["questionnaire.location"] && (
                    <p className="mt-1 text-sm text-red-600 flex items-center animate-fade-in">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors["questionnaire.location"]}
                    </p>
                  )}
                </div>
                <div className="relative">
                  <input
                    type="number"
                    name="questionnaire.bloodStorageCapacity"
                    value={formData.questionnaire.bloodStorageCapacity}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all ${
                      errors["questionnaire.bloodStorageCapacity"] ? "border-red-500" : "border-red-300"
                    }`}
                    placeholder=" "
                    aria-label="Blood Storage Capacity"
                    required
                  />
                  <label className="absolute left-4 floating-label text-gray-400">
                    Blood Storage Capacity (units)
                  </label>
                  {errors["questionnaire.bloodStorageCapacity"] && (
                    <p className="mt-1 text-sm text-red-600 flex items-center animate-fade-in">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors["questionnaire.bloodStorageCapacity"]}
                    </p>
                  )}
                </div>
                <div className="relative">
                  <input
                    type="text"
                    name="questionnaire.contactNumber"
                    value={formData.questionnaire.contactNumber}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all ${
                      errors["questionnaire.contactNumber"] ? "border-red-500" : "border-red-300"
                    }`}
                    placeholder=" "
                    aria-label="Contact Number"
                    required
                  />
                  <label className="absolute left-4 floating-label text-gray-400">
                    Contact Number
                  </label>
                  {errors["questionnaire.contactNumber"] && (
                    <p className="mt-1 text-sm text-red-600 flex items-center animate-fade-in">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors["questionnaire.contactNumber"]}
                    </p>
                  )}
                </div>
              </div>
            )}
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
            {step < 4 && (
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-red-600 to-pink-500 text-white py-3 rounded-lg font-semibold text-lg hover:from-red-700 hover:to-pink-600 transform hover:scale-105 transition-all duration-300 animate-pulse-glow flex items-center justify-center space-x-2"
                aria-label={step === 1 ? "Send OTP" : step === 2 ? "Verify OTP" : "Set Password"}
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>{step === 1 ? "Send OTP" : step === 2 ? "Verify OTP" : "Set Password"}</span>
                    <ChevronRight className="w-5 h-5" />
                  </>
                )}
              </button>
            )}
            {step === 4 && (
              <>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-red-600 to-pink-500 text-white py-3 rounded-lg font-semibold text-lg hover:from-red-700 hover:to-pink-600 transform hover:scale-105 transition-all duration-300 animate-pulse-glow flex items-center justify-center space-x-2"
                  aria-label="Submit Questionnaire"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Submit Questionnaire</span>
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
                    aria-label="Sign up with Biometric"
                  >
                    <Smartphone className="w-5 h-5 mr-2" />
                    Biometric
                  </button>
                </div>
              </>
            )}
          </form>
          <p className="text-center mt-6 text-sm text-gray-600">
            Already have an account?{" "}
            <a href="/login" className="text-red-600 hover:text-red-500 font-medium">
              Sign in
            </a>
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
    </div>
  );
};

export default Signup;
```