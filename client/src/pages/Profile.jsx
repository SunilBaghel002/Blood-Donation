import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { Heart, Shield, Lock, MapPin, CheckCircle, AlertCircle } from "lucide-react";

const Profile = () => {
  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    userType: "",
    status: "pending",
    kycVerified: false,
    certificates: [],
    livesTouched: 0,
    trustScore: "0%",
    joinDate: "",
    location: "",
    profilePicture: "",
    donationCount: 0,
    requestCount: 0,
    donationChange: "+0%",
    requestChange: "+0%",
    transactionChange: "+0%",
    impactChange: "+0%",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isEditing, setIsEditing] = useState({
    fullName: false,
    email: false,
    phone: false,
    location: false,
    password: false,
  });
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    location: "",
    otp: "",
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Please log in to view your profile");
          navigate("/login");
          return;
        }
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const [profileResponse, statsResponse] = await Promise.all([
          axios.get("http://localhost:5000/api/auth/me", config),
          axios.get("http://localhost:5000/api/donor/rewards", config),
        ]);
        const profile = profileResponse.data.user;
        const stats = statsResponse.data;
        if (profile.status !== "completed") {
          setError("Please complete OTP verification to access your profile");
          navigate("/verify");
          return;
        }
        setUserData({
          firstName: profile.firstName || "",
          lastName: profile.lastName || "",
          email: profile.email || "",
          phone: profile.phone || "",
          userType: profile.role || "Donor",
          status: profile.status || "pending",
          kycVerified: profile.kycVerified || false,
          certificates: profile.certificates || [],
          livesTouched: stats.livesTouched || 0,
          trustScore: stats.trustScore || "0%",
          joinDate: profile.createdAt || new Date().toISOString(),
          location: profile.location || "",
          profilePicture: profile.profilePicture || "",
          donationCount: stats.donationCount || 0,
          requestCount: stats.requestCount || 0,
          donationChange: stats.donationChange || "+0%",
          requestChange: stats.requestChange || "+0%",
          transactionChange: stats.transactionChange || "+0%",
          impactChange: stats.impactChange || "+0%",
        });
        setFormData({
          fullName: `${profile.firstName || ""} ${profile.lastName || ""}`.trim(),
          email: profile.email || "",
          phone: profile.phone || "",
          location: profile.location || "",
          otp: "",
          currentPassword: "",
          newPassword: "",
          confirmNewPassword: "",
        });
        setError("");
      } catch (err) {
        setError(
          err.response?.data?.error ||
            (err.response?.status === 401
              ? "Please log in to view your profile"
              : err.response?.status === 403
              ? "Please complete OTP verification"
              : "Failed to load profile data")
        );
        if (err.response?.status === 401 || err.response?.status === 403) {
          localStorage.removeItem("token");
          navigate(err.response?.status === 401 ? "/login" : "/verify");
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [navigate]);

  const formatUserType = (userType) => {
    if (!userType) return "Donor";
    const types = userType.split(",").map((type) => {
      switch (type.trim().toLowerCase()) {
        case "donor":
          return "Donor";
        case "hospital":
          return "Hospital";
        case "bloodbank":
          return "Blood Bank";
        default:
          return type.trim();
      }
    });
    return types.join(" & ");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (
      selectedFile &&
      ["image/jpeg", "image/png", "image/jpg"].includes(selectedFile.type) &&
      selectedFile.size <= 5 * 1024 * 1024
    ) {
      setFile(selectedFile);
      setError("");
    } else {
      setError(
        selectedFile
          ? "Please select a valid image file (JPEG, JPG, or PNG) under 5MB"
          : "No file selected"
      );
      setFile(null);
    }
  };

  const handleUploadProfilePicture = async () => {
    if (!file) {
      setError("Please select an image to upload");
      return;
    }
    try {
      setIsUploading(true);
      setError("");
      setSuccess("");
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("profilePicture", file);
      const response = await axios.post(
        "http://localhost:5000/api/auth/upload-profile-picture",
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUserData((prev) => ({
        ...prev,
        profilePicture: response.data.profilePicture,
      }));
      setSuccess("Profile picture updated successfully");
      setFile(null);
    } catch (err) {
      setError(
        err.response?.data?.error || "Failed to upload profile picture"
      );
      setSuccess("");
    } finally {
      setIsUploading(false);
    }
  };

  const handleUpdateEmail = async () => {
    try {
      setError("");
      setSuccess("");
      const token = localStorage.getItem("token");
      if (
        !formData.email ||
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
      ) {
        setError("Please provide a valid email address");
        return;
      }
      const response = await axios.post(
        "http://localhost:5000/api/auth/update-email",
        { newEmail: formData.email },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setIsEditing((prev) => ({ ...prev, email: true }));
      setSuccess("OTP sent to your new email");
    } catch (err) {
      setError(err.response?.data?.error || "Failed to send OTP");
    }
  };

  const handleVerifyEmailOtp = async () => {
    try {
      setError("");
      setSuccess("");
      const token = localStorage.getItem("token");
      if (!formData.otp || !/^\d{6}$/.test(formData.otp)) {
        setError("Please provide a valid 6-digit OTP");
        return;
      }
      const response = await axios.post(
        "http://localhost:5000/api/auth/verify-update-email",
        { newEmail: formData.email, otp: formData.otp },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUserData((prev) => ({ ...prev, email: formData.email }));
      setFormData((prev) => ({ ...prev, otp: "" }));
      setIsEditing((prev) => ({ ...prev, email: false }));
      setSuccess("Email updated successfully");
    } catch (err) {
      setError(err.response?.data?.error || "Failed to verify OTP");
    }
  };

  const handleUpdatePhone = async () => {
    try {
      setError("");
      setSuccess("");
      const token = localStorage.getItem("token");
      if (!formData.phone || !/^\+?[1-9]\d{1,14}$/.test(formData.phone)) {
        setError("Please provide a valid phone number (e.g., +1234567890)");
        return;
      }
      const response = await axios.post(
        "http://localhost:5000/api/auth/update-phone",
        { newPhone: formData.phone },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUserData((prev) => ({ ...prev, phone: formData.phone }));
      setIsEditing((prev) => ({ ...prev, phone: false }));
      setSuccess("Phone number updated successfully");
    } catch (err) {
      setError(err.response?.data?.error || "Failed to update phone number");
    }
  };

  const handleUpdatePassword = async () => {
    try {
      setError("");
      setSuccess("");
      if (
        !formData.currentPassword ||
        !formData.newPassword ||
        !formData.confirmNewPassword
      ) {
        setError("Please fill in all password fields");
        return;
      }
      if (formData.newPassword.length < 6) {
        setError("New password must be at least 6 characters long");
        return;
      }
      if (formData.newPassword !== formData.confirmNewPassword) {
        setError("New passwords do not match");
        return;
      }
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:5000/api/auth/update-password",
        {
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setFormData((prev) => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: "",
      }));
      setIsEditing((prev) => ({ ...prev, password: false }));
      setSuccess("Password updated successfully");
    } catch (err) {
      setError(err.response?.data?.error || "Failed to update password");
    }
  };

  const handleSaveChanges = async (e) => {
    e.preventDefault();
    try {
      setError("");
      setSuccess("");
      const token = localStorage.getItem("token");
      const [firstName, lastName] = formData.fullName.split(" ");
      await axios.put(
        "http://localhost:5000/api/auth/update-profile",
        {
          firstName: firstName || userData.firstName,
          lastName: lastName || userData.lastName,
          location: formData.location,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUserData((prev) => ({
        ...prev,
        firstName: firstName || prev.firstName,
        lastName: lastName || prev.lastName,
        location: formData.location,
      }));
      setIsEditing({
        fullName: false,
        email: false,
        phone: false,
        location: false,
        password: false,
      });
      setSuccess("Profile updated successfully");
    } catch (err) {
      setError(err.response?.data?.error || "Failed to update profile");
    }
  };

  const handleCancel = () => {
    setFormData({
      fullName: `${userData.firstName} ${userData.lastName}`.trim(),
      email: userData.email,
      phone: userData.phone,
      location: userData.location,
      otp: "",
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    });
    setIsEditing({
      fullName: false,
      email: false,
      phone: false,
      location: false,
      password: false,
    });
    setError("");
    setSuccess("");
  };

  const copyToClipboard = (text) => {
    if (text) {
      navigator.clipboard.writeText(text);
      setSuccess("Certificate ID copied to clipboard!");
      setTimeout(() => setSuccess(""), 2000);
    } else {
      setError("No certificate ID available to copy");
    }
  };

  if (error && userData.status !== "completed") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50 text-gray-800 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center p-8 bg-white/80 rounded-2xl shadow-lg"
        >
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-red-500 mb-4">{error}</h1>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/verify")}
            className="bg-gradient-to-r from-red-500 to-pink-400 text-white font-semibold py-3 px-6 rounded-lg"
          >
            Go to Verification
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50 text-gray-800 font-['Inter',sans-serif]">
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-7xl mx-auto p-6"
      >
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-red-100 border border-red-300 rounded-lg text-red-600 flex items-center gap-3"
          >
            <AlertCircle className="w-5 h-5" />
            <span>{error}</span>
          </motion.div>
        )}
        {success && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-green-100 border border-green-300 rounded-lg text-green-600 flex items-center gap-3"
          >
            <CheckCircle className="w-5 h-5" />
            <span>{success}</span>
          </motion.div>
        )}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <motion.header
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <h1 className="text-3xl font-bold text-gray-800">My Profile</h1>
              <p className="text-gray-500 mt-1">Manage your BloodChain profile details.</p>
            </motion.header>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/80 backdrop-blur-md p-8 rounded-xl shadow-lg"
            >
              <div className="flex items-center gap-6 mb-8">
                <div className="relative group">
                  {isLoading ? (
                    <div className="w-32 h-32 rounded-full bg-gray-200 animate-pulse"></div>
                  ) : (
                    <>
                      <img
                        alt={`${userData.firstName}'s profile picture`}
                        className="w-32 h-32 rounded-full object-cover ring-4 ring-red-100 group-hover:ring-red-300 transition-all duration-300"
                        src={
                          userData.profilePicture ||
                          "https://via.placeholder.com/128"
                        }
                        onError={(e) =>
                          (e.target.src = "https://via.placeholder.com/128")
                        }
                      />
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/jpg"
                        onChange={handleFileChange}
                        className="hidden"
                        id="profile-picture-upload"
                      />
                      <label
                        htmlFor="profile-picture-upload"
                        className="absolute bottom-2 right-2 bg-red-500 text-white p-2 rounded-full transition-all duration-300 opacity-0 group-hover:opacity-100 cursor-pointer"
                      >
                        <Heart className="w-4 h-4" />
                      </label>
                    </>
                  )}
                </div>
                <div>
                  {isLoading ? (
                    <div className="space-y-2">
                      <div className="h-6 w-32 bg-gray-200 rounded animate-pulse"></div>
                      <div className="h-4 w-48 bg-gray-200 rounded animate-pulse"></div>
                      <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                  ) : (
                    <>
                      <h2 className="text-2xl font-bold text-gray-800">
                        {userData.firstName} {userData.lastName}
                      </h2>
                      <p className="text-gray-500">{userData.email}</p>
                      <p className="text-gray-500 text-sm mt-1">
                        Joined on {new Date(userData.joinDate).toLocaleDateString()}
                      </p>
                    </>
                  )}
                </div>
              </div>
              {file && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleUploadProfilePicture}
                  disabled={isUploading}
                  className={`w-full bg-gradient-to-r from-red-500 to-pink-400 text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2 ${
                    isUploading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {isUploading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Heart className="w-4 h-4" />
                      Upload Profile Picture
                    </>
                  )}
                </motion.button>
              )}
              <form onSubmit={handleSaveChanges} className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="fullName"
                      className="block text-sm font-medium text-gray-600 mb-2"
                    >
                      Full Name
                    </label>
                    {isEditing.fullName ? (
                      <div className="flex gap-2">
                        <input
                          id="fullName"
                          type="text"
                          name="fullName"
                          value={formData.fullName}
                          onChange={handleInputChange}
                          className="w-full bg-red-50 border border-red-200 rounded-lg px-3 py-3 focus:ring-2 focus:ring-red-400 outline-none text-gray-800"
                          placeholder="Enter full name"
                        />
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          type="button"
                          onClick={() =>
                            setIsEditing((prev) => ({ ...prev, fullName: false }))
                          }
                          className="bg-gray-200 text-gray-600 p-2 rounded-lg"
                        >
                          <Lock className="w-4 h-4" />
                        </motion.button>
                      </div>
                    ) : (
                      <div className="relative">
                        <input
                          id="fullName"
                          type="text"
                          value={`${userData.firstName} ${userData.lastName}`}
                          disabled
                          className="w-full bg-red-50 border border-red-200 rounded-lg px-3 py-3 text-gray-500 pr-12"
                        />
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          type="button"
                          onClick={() =>
                            setIsEditing((prev) => ({ ...prev, fullName: true }))
                          }
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-red-500"
                        >
                          <Heart className="w-4 h-4" />
                        </motion.button>
                      </div>
                    )}
                  </div>
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-600 mb-2"
                    >
                      Email
                    </label>
                    {isEditing.email ? (
                      <div className="space-y-3">
                        <div className="flex gap-2">
                          <input
                            id="email"
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className="w-full bg-red-50 border border-red-200 rounded-lg px-3 py-3 focus:ring-2 focus:ring-red-400 outline-none text-gray-800"
                            placeholder="Enter new email"
                          />
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            type="button"
                            onClick={handleUpdateEmail}
                            disabled={!formData.email}
                            className="bg-gradient-to-r from-red-500 to-pink-400 text-white p-2 rounded-lg disabled:opacity-50"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            type="button"
                            onClick={() => {
                              setIsEditing((prev) => ({ ...prev, email: false }));
                              setFormData((prev) => ({
                                ...prev,
                                email: userData.email,
                                otp: "",
                              }));
                            }}
                            className="bg-gray-200 text-gray-600 p-2 rounded-lg"
                          >
                            <Lock className="w-4 h-4" />
                          </motion.button>
                        </div>
                        {isEditing.email && (
                          <div className="flex gap-2">
                            <input
                              type="text"
                              name="otp"
                              value={formData.otp}
                              onChange={handleInputChange}
                              className="w-full bg-red-50 border border-red-200 rounded-lg px-3 py-3 focus:ring-2 focus:ring-red-400 outline-none text-gray-800"
                              placeholder="Enter OTP"
                            />
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              type="button"
                              onClick={handleVerifyEmailOtp}
                              disabled={!formData.otp}
                              className="bg-gradient-to-r from-red-500 to-pink-400 text-white p-2 rounded-lg disabled:opacity-50"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </motion.button>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="relative">
                        <input
                          id="email"
                          type="email"
                          value={userData.email}
                          disabled
                          className="w-full bg-red-50 border border-red-200 rounded-lg px-3 py-3 text-gray-500 pr-12"
                        />
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          type="button"
                          onClick={() =>
                            setIsEditing((prev) => ({ ...prev, email: true }))
                          }
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-red-500"
                        >
                          <Heart className="w-4 h-4" />
                        </motion.button>
                      </div>
                    )}
                  </div>
                  <div>
                    <label
                      htmlFor="phoneNumber"
                      className="block text-sm font-medium text-gray-600 mb-2"
                    >
                      Phone Number
                    </label>
                    {isEditing.phone ? (
                      <div className="flex gap-2">
                        <input
                          id="phoneNumber"
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="w-full bg-red-50 border border-red-200 rounded-lg px-3 py-3 focus:ring-2 focus:ring-red-400 outline-none text-gray-800"
                          placeholder="Enter phone number"
                        />
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          type="button"
                          onClick={handleUpdatePhone}
                          disabled={!formData.phone}
                          className="bg-gradient-to-r from-red-500 to-pink-400 text-white p-2 rounded-lg disabled:opacity-50"
                        >
                          <CheckCircle className="w-4 h-4" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          type="button"
                          onClick={() => {
                            setIsEditing((prev) => ({ ...prev, phone: false }));
                            setFormData((prev) => ({ ...prev, phone: userData.phone }));
                          }}
                          className="bg-gray-200 text-gray-600 p-2 rounded-lg"
                        >
                          <Lock className="w-4 h-4" />
                        </motion.button>
                      </div>
                    ) : (
                      <div className="relative">
                        <input
                          id="phoneNumber"
                          type="tel"
                          value={userData.phone || ""}
                          disabled
                          className="w-full bg-red-50 border border-red-200 rounded-lg px-3 py-3 text-gray-500 pr-12"
                        />
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          type="button"
                          onClick={() =>
                            setIsEditing((prev) => ({ ...prev, phone: true }))
                          }
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-red-500"
                        >
                          <Heart className="w-4 h-4" />
                        </motion.button>
                      </div>
                    )}
                  </div>
                  <div>
                    <label
                      htmlFor="location"
                      className="block text-sm font-medium text-gray-600 mb-2"
                    >
                      Location
                    </label>
                    {isEditing.location ? (
                      <div className="flex gap-2">
                        <input
                          id="location"
                          type="text"
                          name="location"
                          value={formData.location}
                          onChange={handleInputChange}
                          className="w-full bg-red-50 border border-red-200 rounded-lg px-3 py-3 focus:ring-2 focus:ring-red-400 outline-none text-gray-800"
                          placeholder="Enter your location"
                        />
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          type="button"
                          onClick={() =>
                            setIsEditing((prev) => ({ ...prev, location: false }))
                          }
                          className="bg-gray-200 text-gray-600 p-2 rounded-lg"
                        >
                          <Lock className="w-4 h-4" />
                        </motion.button>
                      </div>
                    ) : (
                      <div className="relative">
                        <input
                          id="location"
                          type="text"
                          value={userData.location || ""}
                          disabled
                          className="w-full bg-red-50 border border-red-200 rounded-lg px-3 py-3 text-gray-500 pr-12"
                        />
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          type="button"
                          onClick={() =>
                            setIsEditing((prev) => ({ ...prev, location: true }))
                          }
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-red-500"
                        >
                          <Heart className="w-4 h-4" />
                        </motion.button>
                      </div>
                    )}
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-600 mb-2">
                      Password
                    </label>
                    {isEditing.password ? (
                      <div className="space-y-4">
                        <input
                          type="password"
                          name="currentPassword"
                          value={formData.currentPassword}
                          onChange={handleInputChange}
                          className="w-full bg-red-50 border border-red-200 rounded-lg px-3 py-3 focus:ring-2 focus:ring-red-400 outline-none text-gray-800"
                          placeholder="Enter current password"
                        />
                        <input
                          type="password"
                          name="newPassword"
                          value={formData.newPassword}
                          onChange={handleInputChange}
                          className="w-full bg-red-50 border border-red-200 rounded-lg px-3 py-3 focus:ring-2 focus:ring-red-400 outline-none text-gray-800"
                          placeholder="Enter new password"
                        />
                        <input
                          type="password"
                          name="confirmNewPassword"
                          value={formData.confirmNewPassword}
                          onChange={handleInputChange}
                          className="w-full bg-red-50 border border-red-200 rounded-lg px-3 py-3 focus:ring-2 focus:ring-red-400 outline-none text-gray-800"
                          placeholder="Confirm new password"
                        />
                        <div className="flex gap-2">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            type="button"
                            onClick={handleUpdatePassword}
                            disabled={
                              !formData.currentPassword ||
                              !formData.newPassword ||
                              !formData.confirmNewPassword
                            }
                            className="bg-gradient-to-r from-red-500 to-pink-400 text-white font-semibold py-3 px-6 rounded-lg disabled:opacity-50"
                          >
                            Update Password
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            type="button"
                            onClick={() => {
                              setIsEditing((prev) => ({ ...prev, password: false }));
                              setFormData((prev) => ({
                                ...prev,
                                currentPassword: "",
                                newPassword: "",
                                confirmNewPassword: "",
                              }));
                            }}
                            className="bg-gray-200 text-gray-600 p-2 rounded-lg"
                          >
                            <Lock className="w-4 h-4" />
                          </motion.button>
                        </div>
                      </div>
                    ) : (
                      <div className="relative">
                        <input
                          type="password"
                          value="********"
                          disabled
                          className="w-full bg-red-50 border border-red-200 rounded-lg px-3 py-3 text-gray-500 pr-12"
                        />
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          type="button"
                          onClick={() =>
                            setIsEditing((prev) => ({ ...prev, password: true }))
                          }
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-red-500"
                        >
                          <Heart className="w-4 h-4" />
                        </motion.button>
                      </div>
                    )}
                  </div>
                </div>
                <div className="mt-8 flex justify-end gap-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="button"
                    onClick={handleCancel}
                    className="px-6 py-3 rounded-lg text-sm font-semibold text-gray-600 hover:bg-gray-200"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="submit"
                    className="bg-gradient-to-r from-red-500 to-pink-400 text-white font-semibold py-3 px-6 rounded-lg"
                  >
                    Save Changes
                  </motion.button>
                </div>
              </form>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/80 backdrop-blur-md p-8 rounded-xl shadow-lg mt-8"
            >
              <h3 className="text-xl font-bold text-gray-800 mb-4">Account Information</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">KYC Status</span>
                  {isLoading ? (
                    <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                  ) : (
                    <div className="flex items-center gap-2 text-green-500">
                      <Shield className="w-4 h-4" />
                      <span className="font-medium">
                        {userData.kycVerified ? "Verified" : "Not Verified"}
                      </span>
                    </div>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Account Status</span>
                  {isLoading ? (
                    <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                  ) : (
                    <div className="flex items-center gap-2 text-green-500">
                      <CheckCircle className="w-4 h-4" />
                      <span className="font-medium">
                        {userData.status === "completed" ? "Active" : "Pending"}
                      </span>
                    </div>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Certificates</span>
                  {isLoading ? (
                    <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
                  ) : (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() =>
                        copyToClipboard(
                          userData.certificates[0]?.certificateId || ""
                        )
                      }
                      className="flex items-center gap-2 text-red-500 hover:underline"
                    >
                      <Heart className="w-4 h-4" />
                      <span className="font-medium">View on Blockchain</span>
                    </motion.button>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/80 backdrop-blur-md p-6 rounded-xl shadow-lg"
            >
              <h3 className="text-xl font-bold text-gray-800 mb-4">Profile Completion</h3>
              {isLoading ? (
                <div className="h-2.5 w-full bg-gray-200 rounded-full animate-pulse"></div>
              ) : (
                <>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-gradient-to-r from-red-500 to-pink-400 h-2.5 rounded-full"
                      style={{
                        width: userData.profilePicture
                          ? userData.kycVerified
                            ? "90%"
                            : "75%"
                          : "60%",
                      }}
                    ></div>
                  </div>
                  <p className="text-right text-sm text-gray-600 mt-2">
                    {userData.profilePicture
                      ? userData.kycVerified
                        ? "90% Complete"
                        : "75% Complete"
                      : "60% Complete"}
                  </p>
                </>
              )}
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/80 backdrop-blur-md p-6 rounded-xl shadow-lg"
            >
              <h3 className="text-xl font-bold text-gray-800 mb-4">Impact Stats</h3>
              {isLoading ? (
                <div className="grid grid-cols-3 gap-4">
                  <div className="h-12 w-full bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-12 w-full bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-12 w-full bg-gray-200 rounded animate-pulse"></div>
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-3xl font-bold text-red-500">{userData.livesTouched}</p>
                    <p className="text-sm text-gray-600">Lives Helped</p>
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-red-500">{userData.donationCount}</p>
                    <p className="text-sm text-gray-600">Donations</p>
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-red-500">{userData.trustScore}</p>
                    <p className="text-sm text-gray-600">Trust Score</p>
                  </div>
                </div>
              )}
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/80 backdrop-blur-md p-6 rounded-xl shadow-lg"
            >
              <h3 className="text-xl font-bold text-gray-800 mb-4">Badges Earned</h3>
              {isLoading ? (
                <div className="flex justify-center gap-4">
                  <div className="h-12 w-12 bg-gray-200 rounded-full animate-pulse"></div>
                  <div className="h-12 w-12 bg-gray-200 rounded-full animate-pulse"></div>
                  <div className="h-12 w-12 bg-gray-200 rounded-full animate-pulse"></div>
                </div>
              ) : userData.certificates && userData.certificates.length > 0 ? (
                <div className="flex justify-center gap-4">
                  {userData.certificates.map((certificate, index) => (
                    <motion.div
                      key={index}
                      whileHover={{ scale: 1.1 }}
                      className="p-3 bg-red-100 rounded-full"
                      title={`Certificate ${certificate.certificateId}`}
                    >
                      <Shield
                        className={`w-6 h-6 ${
                          index % 3 === 0
                            ? "text-yellow-500"
                            : index % 3 === 1
                            ? "text-gray-400"
                            : "text-orange-400"
                        }`}
                      />
                    </motion.div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600 text-center">No badges earned yet.</p>
              )}
            </motion.div>
          </div>
        </div>
      </motion.main>
    </div>
  );
};

export default Profile;