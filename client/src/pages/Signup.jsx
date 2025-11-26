// src/pages/Signup.jsx
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
  User,
  Fingerprint,
  Smartphone,
  Loader,
} from "lucide-react";
import MultiStep from "../components/MultiStep";

// ============ API BASE URL ============
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [subStep, setSubStep] = useState(1);
  const [particles, setParticles] = useState([]);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    role: "Donor",
    otp: "",
    questionnaire: {
      // Donor fields
      bloodGroup: "",
      donationCount: "",
      lastDonationDate: "",
      medicalConditions: "",
      // Hospital fields
      hospitalName: "",
      hospitalLocation: "",
      bedCount: "",
      hospitalContactNumber: "",
      // Blood Bank fields
      name: "",
      location: "",
      bloodStorageCapacity: "",
      contactNumber: "",
    },
  });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState("");
  const [resendTimer, setResendTimer] = useState(0);

  // Auto-dismiss messages
  useEffect(() => {
    if (success || errors.general) {
      const t = setTimeout(() => {
        setSuccess("");
        setErrors((prev) => ({ ...prev, general: "" }));
      }, 5000);
      return () => clearTimeout(t);
    }
  }, [success, errors.general]);

  // Resend OTP timer
  useEffect(() => {
    if (resendTimer > 0) {
      const t = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(t);
    }
  }, [resendTimer]);

  // Particles animation
  useEffect(() => {
    const newParticles = Array.from({ length: 10 }, (_, i) => ({
      id: i,
      x: Math.random() * 40 + 5,
      y: Math.random() * 100,
      delay: Math.random() * 5,
      duration: 6 + Math.random() * 4,
      size: 10 + Math.random() * 6,
    }));
    setParticles(newParticles);
  }, []);

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

  const messageVariants = {
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes("questionnaire.")) {
      const field = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        questionnaire: { ...prev.questionnaire, [field]: value },
      }));
      if (field === "donationCount" && value === "0") {
        setFormData((prev) => ({
          ...prev,
          questionnaire: { ...prev.questionnaire, lastDonationDate: "Never" },
        }));
        setTimeout(handleNextQuestion, 500);
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
    setErrors((prev) => ({ ...prev, [name]: "", general: "" }));
  };

  const validateStep = () => {
    const newErrors = {};
    if (step === 1) {
      if (!formData.role) newErrors.role = "Role is required";
      if (formData.role === "Donor") {
        if (!formData.firstName?.trim())
          newErrors.firstName = "First name required";
        if (!formData.lastName?.trim())
          newErrors.lastName = "Last name required";
      }
      if (!formData.email?.trim()) newErrors.email = "Email required";
      else if (!/\S+@\S+\.\S+/.test(formData.email))
        newErrors.email = "Invalid email";
    } else if (step === 2) {
      if (!formData.otp || !/^\w{6}$/.test(formData.otp))
        newErrors.otp = "Enter 6-character OTP";
    } else if (step === 3) {
      if (!formData.password || formData.password.length < 8)
        newErrors.password = "Min 8 characters";
      if (formData.password !== formData.confirmPassword)
        newErrors.confirmPassword = "Passwords don't match";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ============ API CALL: STEP 1 - SEND OTP ============
  const sendOTP = async () => {
    if (!validateStep()) return;
    setIsLoading(true);
    setErrors({});

    try {
      console.log("📤 Sending signup request...");

      const response = await fetch(`${API_URL}/api/auth/signup`, {
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
      console.log("📥 Server response:", data);

      if (!response.ok) {
        throw new Error(data.error || "Failed to send OTP");
      }

      setSuccess(`✅ OTP sent to ${formData.email}`);
      setResendTimer(60); // 60 seconds cooldown
      setStep(2);

      // ⚠️ DEV ONLY: Auto-fill OTP if returned
      if (data.otp && import.meta.env.DEV) {
        console.log("🔐 Dev OTP:", data.otp);
        setFormData((prev) => ({ ...prev, otp: data.otp }));
      }
    } catch (error) {
      console.error("❌ Signup error:", error);
      setErrors({ general: error.message || "Failed to send OTP" });
    } finally {
      setIsLoading(false);
    }
  };

  // ============ API CALL: STEP 2 - VERIFY OTP ============
  const verifyOTP = async () => {
    if (!validateStep()) return;
    setIsLoading(true);
    setErrors({});

    try {
      console.log("📤 Verifying OTP...");

      const response = await fetch(`${API_URL}/api/auth/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          otp: formData.otp.toUpperCase(),
        }),
      });

      const data = await response.json();
      console.log("📥 Server response:", data);

      if (!response.ok) {
        throw new Error(data.error || "Invalid OTP");
      }

      setSuccess("✅ OTP verified successfully!");
      setStep(3);
    } catch (error) {
      console.error("❌ OTP verification error:", error);
      setErrors({ otp: error.message || "Invalid OTP" });
    } finally {
      setIsLoading(false);
    }
  };

  // ============ API CALL: STEP 3 - SET PASSWORD ============
  const setPassword = async () => {
    if (!validateStep()) return;
    setIsLoading(true);
    setErrors({});

    try {
      console.log("📤 Setting password...");

      const response = await fetch(`${API_URL}/api/auth/complete-signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          confirmPassword: formData.confirmPassword,
        }),
      });

      const data = await response.json();
      console.log("📥 Server response:", data);

      if (!response.ok) {
        throw new Error(data.error || "Failed to set password");
      }

      setSuccess("✅ Password set successfully!");
      setStep(4);
      setSubStep(1);
    } catch (error) {
      console.error("❌ Password error:", error);
      setErrors({ general: error.message || "Failed to set password" });
    } finally {
      setIsLoading(false);
    }
  };

  // ============ API CALL: STEP 4 - SUBMIT QUESTIONNAIRE ============
  const submitQuestionnaire = async () => {
    setIsLoading(true);
    setErrors({});

    try {
      console.log("📤 Submitting questionnaire...");

      // Build questionnaire based on role
      let questionnaireData = {};
      if (formData.role === "Donor") {
        questionnaireData = {
          bloodGroup: formData.questionnaire.bloodGroup,
          donationCount: formData.questionnaire.donationCount || "0",
          lastDonationDate:
            formData.questionnaire.donationCount === "0"
              ? undefined
              : formData.questionnaire.lastDonationDate,
          medicalConditions: formData.questionnaire.medicalConditions || "",
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

      const response = await fetch(`${API_URL}/api/auth/submit-questionnaire`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          role: formData.role,
          questionnaire: questionnaireData,
        }),
      });

      const data = await response.json();
      console.log("📥 Server response:", data);

      if (!response.ok) {
        throw new Error(data.error || "Failed to submit questionnaire");
      }

      // Save token
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      setSuccess("🎉 Account created successfully!");

      // Redirect based on role
      setTimeout(() => {
        const roleRoutes = {
          Donor: "/donor-dashboard",
          Hospital: "/hospital-dashboard",
          BloodBank: "/bloodbank-dashboard",
          Admin: "/admin-dashboard",
        };
        window.location.href = roleRoutes[formData.role] || "/dashboard";
      }, 1500);
    } catch (error) {
      console.error("❌ Questionnaire error:", error);
      setErrors({ general: error.message || "Failed to create account" });
    } finally {
      setIsLoading(false);
    }
  };

  // ============ NAVIGATION ============
  const handleNext = () => {
    if (step === 1) {
      sendOTP();
    } else if (step === 2) {
      verifyOTP();
    } else if (step === 3) {
      setPassword();
    }
  };

  const handlePrev = () => setStep(step > 1 ? step - 1 : 1);

  const handleNextQuestion = () => {
    if (subStep < 4) {
      setSubStep(subStep + 1);
    } else {
      submitQuestionnaire();
    }
  };

  const handlePrevQuestion = () => {
    if (subStep > 1) setSubStep(subStep - 1);
  };

  // ============ RESEND OTP ============
  const handleResendOTP = async () => {
    if (resendTimer > 0) return;

    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/auth/signup`, {
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

      if (!response.ok) {
        throw new Error(data.error || "Failed to resend OTP");
      }

      setSuccess("✅ New OTP sent!");
      setResendTimer(60);

      if (data.otp && import.meta.env.DEV) {
        console.log("🔐 Dev OTP:", data.otp);
        setFormData((prev) => ({ ...prev, otp: data.otp }));
      }
    } catch (error) {
      setErrors({ general: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  // ============ RENDER QUESTIONNAIRE ============
  const renderQuestion = () => {
    const q = formData.questionnaire;
    if (formData.role === "Donor") {
      switch (subStep) {
        case 1:
          return (
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-center">
                What's your blood group?
              </h3>
              <select
                name="questionnaire.bloodGroup"
                value={q.bloodGroup}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
              >
                <option value="">Select Blood Group</option>
                {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(
                  (bg) => (
                    <option key={bg} value={bg}>
                      {bg}
                    </option>
                  )
                )}
              </select>
            </div>
          );
        case 2:
          return (
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-center">
                How many times have you donated?
              </h3>
              <input
                type="number"
                name="questionnaire.donationCount"
                value={q.donationCount}
                onChange={handleInputChange}
                placeholder="0"
                min="0"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 outline-none text-center"
              />
            </div>
          );
        case 3:
          if (q.donationCount === "0") return null;
          return (
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-center">
                Last donation date?
              </h3>
              <input
                type="date"
                name="questionnaire.lastDonationDate"
                value={q.lastDonationDate}
                onChange={handleInputChange}
                max={new Date().toISOString().split("T")[0]}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
              />
            </div>
          );
        case 4:
          return (
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-center">
                Any medical conditions?
              </h3>
              <textarea
                name="questionnaire.medicalConditions"
                value={q.medicalConditions}
                onChange={handleInputChange}
                placeholder="e.g. Diabetes, Hypertension (optional)"
                rows="3"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 outline-none resize-none"
              />
            </div>
          );
      }
    } else if (formData.role === "Hospital") {
      switch (subStep) {
        case 1:
          return (
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-center">Hospital Name</h3>
              <input
                type="text"
                name="questionnaire.hospitalName"
                value={q.hospitalName}
                onChange={handleInputChange}
                placeholder="Enter hospital name"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
              />
            </div>
          );
        case 2:
          return (
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-center">Location</h3>
              <input
                type="text"
                name="questionnaire.hospitalLocation"
                value={q.hospitalLocation}
                onChange={handleInputChange}
                placeholder="City, State"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
              />
            </div>
          );
        case 3:
          return (
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-center">Bed Count</h3>
              <input
                type="number"
                name="questionnaire.bedCount"
                value={q.bedCount}
                onChange={handleInputChange}
                placeholder="Number of beds"
                min="1"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
              />
            </div>
          );
        case 4:
          return (
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-center">
                Contact Number
              </h3>
              <input
                type="tel"
                name="questionnaire.hospitalContactNumber"
                value={q.hospitalContactNumber}
                onChange={handleInputChange}
                placeholder="+91 1234567890"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
              />
            </div>
          );
      }
    } else if (formData.role === "BloodBank") {
      switch (subStep) {
        case 1:
          return (
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-center">
                Blood Bank Name
              </h3>
              <input
                type="text"
                name="questionnaire.name"
                value={q.name}
                onChange={handleInputChange}
                placeholder="Enter blood bank name"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
              />
            </div>
          );
        case 2:
          return (
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-center">Location</h3>
              <input
                type="text"
                name="questionnaire.location"
                value={q.location}
                onChange={handleInputChange}
                placeholder="City, State"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
              />
            </div>
          );
        case 3:
          return (
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-center">
                Storage Capacity (units)
              </h3>
              <input
                type="number"
                name="questionnaire.bloodStorageCapacity"
                value={q.bloodStorageCapacity}
                onChange={handleInputChange}
                placeholder="Number of units"
                min="1"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
              />
            </div>
          );
        case 4:
          return (
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-center">
                Contact Number
              </h3>
              <input
                type="tel"
                name="questionnaire.contactNumber"
                value={q.contactNumber}
                onChange={handleInputChange}
                placeholder="+91 1234567890"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
              />
            </div>
          );
      }
    }
  };

  return (
    <>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
          body { font-family: 'Inter', sans-serif; }
          .floating-label { position: absolute; top: -8px; left: 12px; font-size: 12px; background: white; padding: 0 4px; color: #6b7280; transition: all 0.2s ease; pointer-events: none; }
          input:focus ~ .floating-label, input:not(:placeholder-shown) ~ .floating-label { color: #dc2626; }
        `}
      </style>

      <div className="min-h-screen flex flex-col lg:flex-row overflow-hidden relative">
        {particles.map((p) => (
          <BloodDroplet key={p.id} p={p} />
        ))}

        {/* Messages */}
        <div className="fixed top-4 right-4 z-50 space-y-2 max-w-md">
          <AnimatePresence>
            {errors.general && (
              <motion.div
                variants={messageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="p-4 bg-red-50 border border-red-200 rounded-lg shadow-sm flex items-start gap-2"
              >
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-700">{errors.general}</p>
              </motion.div>
            )}
            {success && (
              <motion.div
                variants={messageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="p-4 bg-green-50 border border-green-200 rounded-lg shadow-sm flex items-start gap-2"
              >
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-green-700">{success}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => window.history.back()}
          className="absolute top-6 left-6 flex items-center gap-2 text-gray-600 hover:text-red-600 z-10 transition"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm font-medium">Back</span>
        </motion.button>

        {/* LEFT: Form */}
        <div className="w-full lg:w-1/2 min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-pink-50 p-6">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            className="w-full max-w-md"
          >
            <div className="bg-white/95 backdrop-blur-sm p-8 rounded-2xl shadow-2xl border border-red-100">
              <div className="flex justify-center mb-6">
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Heart className="w-12 h-12 text-red-600" />
                </motion.div>
              </div>
              <h1 className="text-center text-2xl font-bold text-gray-800 mb-2">
                Create Account
              </h1>
              <p className="text-center text-sm text-gray-600 mb-6">
                Join the life-saving network
              </p>

              <MultiStep currentStep={step < 4 ? step : 4} totalSteps={4} />

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleNext();
                }}
                className="space-y-5"
              >
                {/* STEP 1: Basic Info */}
                {step === 1 && (
                  <>
                    <div className="relative">
                      <select
                        name="role"
                        value={formData.role}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
                      >
                        <option value="Donor">Donor</option>
                        <option value="Hospital">Hospital</option>
                        <option value="BloodBank">Blood Bank</option>
                      </select>
                      <label className="floating-label">Role</label>
                    </div>

                    {formData.role === "Donor" && (
                      <div className="grid grid-cols-2 gap-4">
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                          <input
                            type="text"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleInputChange}
                            placeholder=" "
                            className="pl-10 w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
                          />
                          <label className="floating-label">First Name</label>
                          {errors.firstName && (
                            <p className="text-xs text-red-600 mt-1">
                              {errors.firstName}
                            </p>
                          )}
                        </div>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                          <input
                            type="text"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleInputChange}
                            placeholder=" "
                            className="pl-10 w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
                          />
                          <label className="floating-label">Last Name</label>
                          {errors.lastName && (
                            <p className="text-xs text-red-600 mt-1">
                              {errors.lastName}
                            </p>
                          )}
                        </div>
                      </div>
                    )}

                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder=" "
                        className="pl-10 w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
                      />
                      <label className="floating-label">Email</label>
                      {errors.email && (
                        <p className="text-xs text-red-600 mt-1">
                          {errors.email}
                        </p>
                      )}
                    </div>
                  </>
                )}

                {/* STEP 2: OTP Verification */}
                {step === 2 && (
                  <div className="space-y-4">
                    <div className="text-center mb-4">
                      <p className="text-sm text-gray-600">
                        We've sent a 6-character OTP to
                      </p>
                      <p className="font-semibold text-gray-900">
                        {formData.email}
                      </p>
                    </div>
                    <div className="relative">
                      <input
                        type="text"
                        name="otp"
                        value={formData.otp}
                        onChange={handleInputChange}
                        maxLength="6"
                        placeholder=" "
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 outline-none text-center text-lg tracking-widest uppercase"
                      />
                      <label className="floating-label">6-Character OTP</label>
                      {errors.otp && (
                        <p className="text-xs text-red-600 mt-1">
                          {errors.otp}
                        </p>
                      )}
                    </div>
                    <div className="text-center">
                      <button
                        type="button"
                        onClick={handleResendOTP}
                        disabled={resendTimer > 0 || isLoading}
                        className="text-sm text-red-600 hover:text-red-700 font-medium disabled:text-gray-400 disabled:cursor-not-allowed"
                      >
                        {resendTimer > 0
                          ? `Resend OTP in ${resendTimer}s`
                          : "Resend OTP"}
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP 3: Password */}
                {step === 3 && (
                  <>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        placeholder=" "
                        className="pl-10 pr-12 w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
                      />
                      <label className="floating-label">Password</label>
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                      >
                        {showPassword ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                      {errors.password && (
                        <p className="text-xs text-red-600 mt-1">
                          {errors.password}
                        </p>
                      )}
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        placeholder=" "
                        className="pl-10 pr-12 w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
                      />
                      <label className="floating-label">Confirm Password</label>
                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                      {errors.confirmPassword && (
                        <p className="text-xs text-red-600 mt-1">
                          {errors.confirmPassword}
                        </p>
                      )}
                    </div>
                  </>
                )}

                {/* STEP 4: Questionnaire */}
                {step === 4 && (
                  <div className="space-y-6">
                    {renderQuestion()}
                    <div className="flex justify-between">
                      {subStep > 1 && (
                        <button
                          type="button"
                          onClick={handlePrevQuestion}
                          disabled={isLoading}
                          className="px-4 py-2 text-gray-600 border border-gray-300 bg-white rounded-lg font-medium flex items-center gap-2 hover:bg-gray-50 disabled:opacity-50"
                        >
                          <ArrowLeft className="w-4 h-4" /> Back
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={handleNextQuestion}
                        disabled={isLoading}
                        className="flex-1 ml-2 bg-red-600 hover:bg-red-700 text-white font-medium py-2 rounded-lg flex items-center justify-center gap-2 disabled:opacity-50"
                      >
                        {isLoading ? (
                          <Loader className="w-5 h-5 animate-spin" />
                        ) : (
                          <>
                            {subStep < 4 ? "Next" : "Submit"}
                            <ChevronRight className="w-4 h-4" />
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}

                {/* Navigation for Steps 1-3 */}
                {step < 4 && (
                  <div className="flex justify-between mt-6">
                    {step > 1 && (
                      <button
                        type="button"
                        onClick={handlePrev}
                        disabled={isLoading}
                        className="px-4 py-2 text-gray-600 border border-gray-300 bg-white rounded-lg font-medium flex items-center gap-2 hover:bg-gray-50 disabled:opacity-50"
                      >
                        <ArrowLeft className="w-4 h-4" /> Back
                      </button>
                    )}
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="flex-1 ml-2 bg-red-600 hover:bg-red-700 text-white font-medium py-2 rounded-lg flex items-center justify-center gap-2 disabled:opacity-50 transition"
                    >
                      {isLoading ? (
                        <Loader className="w-5 h-5 animate-spin" />
                      ) : (
                        <>
                          {step === 1
                            ? "Send OTP"
                            : step === 2
                            ? "Verify OTP"
                            : "Set Password"}
                          <ChevronRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </div>
                )}
              </form>

              <p className="text-center mt-6 text-sm text-gray-600">
                Have an account?{" "}
                <a
                  href="/login"
                  className="text-red-600 font-medium hover:underline"
                >
                  Sign in
                </a>
              </p>

              <div className="mt-8 grid grid-cols-3 gap-3 text-center">
                <div className="bg-red-50 rounded-lg p-3 border border-red-100 hover:shadow-sm transition-all">
                  <Shield className="w-6 h-6 text-green-600 mx-auto mb-2" />
                  <p className="text-xs text-gray-500 font-medium">
                    Bank-level Security
                  </p>
                </div>
                <div className="bg-red-50 rounded-lg p-3 border border-red-100 hover:shadow-sm transition-all">
                  <Heart className="w-6 h-6 text-red-500 mx-auto mb-2" />
                  <p className="text-xs text-gray-500 font-medium">
                    1000+ Lives Saved
                  </p>
                </div>
                <div className="bg-red-50 rounded-lg p-3 border border-red-100 hover:shadow-sm transition-all">
                  <CheckCircle className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                  <p className="text-xs text-gray-500 font-medium">
                    100% Verified
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* RIGHT: Image */}
        <div className="hidden lg:block w-1/2 h-screen relative overflow-hidden">
          <motion.div
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0"
          >
            <img
              src="https://t3.ftcdn.net/jpg/03/73/15/18/360_F_373151842_vSb3llzX7fSStSTianXmmlOGt5VNbZaM.jpg"
              alt="Blood donation"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40" />
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

export default Signup;
