const express = require("express");
const mongoose = require("mongoose");
const nodemailer = require("nodemailer");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");
const crypto = require("crypto");
const { ethers } = require("ethers");
require("dotenv").config();

const BloodChainABI = require("./BloodChain.json").abi;
const { z } = require("zod");
const { calculateRewards } = require("./utils/rewards");

const app = express();

// ============ MIDDLEWARE (MUST BE BEFORE ROUTES) ============
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:3000"],
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logger
app.use((req, res, next) => {
  console.log(`📥 ${req.method} ${req.url}`);
  next();
});

// ============ BLOCKCHAIN SETUP ============
const provider = new ethers.JsonRpcProvider(
  process.env.HARDHAT_RPC_URL || "http://127.0.0.1:8545"
);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

const getContract = (signer) => {
  return new ethers.Contract(
    process.env.CONTRACT_ADDRESS,
    BloodChainABI,
    signer
  );
};

// ============ MONGODB CONNECTION ============
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    process.exit(1);
  }
};
connectDB();

// === SCHEMAS ===
const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: function () {
      return ["Donor", "Admin"].includes(this.role);
    },
  },
  lastName: {
    type: String,
    required: function () {
      return ["Donor", "Admin"].includes(this.role);
    },
  },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  role: {
    type: String,
    required: true,
    enum: ["Donor", "Hospital", "BloodBank", "Admin"],
  },
  otp: { type: String },
  otpExpires: { type: Date },
  isVerified: { type: Boolean, default: false },
  walletAddress: { type: String },
  createdAt: { type: Date, default: Date.now },
  donorInfo: {
    bloodGroup: {
      type: String,
      enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
    },
    donationCount: { type: Number, default: 0 },
    lastDonationDate: { type: Date },
    medicalConditions: { type: String },
    rewards: {
      points: { type: Number, default: 0 },
      badges: [{ type: String }],
    },
  },
  hospitalInfo: {
    name: String,
    location: String,
    bedCount: Number,
    contactNumber: String,
  },
  bloodBankInfo: {
    name: String,
    location: String,
    bloodStorageCapacity: Number,
    contactNumber: String,
  },
  adminInfo: { name: String, contactNumber: String },
});

const bloodInventorySchema = new mongoose.Schema({
  bloodBankId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  bloodType: {
    type: String,
    enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
    required: true,
  },
  units: { type: Number, required: true },
  expiryDate: { type: Date, required: true },
  demand: {
    type: String,
    enum: ["Critical", "High", "Medium", "Low"],
    default: "Low",
  },
});

const requestSchema = new mongoose.Schema({
  hospitalId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  bloodBankId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  bloodType: {
    type: String,
    enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
    required: true,
  },
  quantity: { type: Number, required: true },
  status: {
    type: String,
    enum: ["Pending", "Approved", "Rejected", "Fulfilled"],
    default: "Pending",
  },
  createdAt: { type: Date, default: Date.now },
  blockchainId: { type: String }, // New
});

const transactionSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["Donation", "Transfer", "Usage"],
    required: true,
  },
  donorId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  hospitalId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  bloodBankId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  bloodType: {
    type: String,
    enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
    required: true,
  },
  quantity: { type: Number, required: true },
  status: {
    type: String,
    enum: ["Scheduled", "Confirmed", "In Transit", "Used"],
    default: "Confirmed",
  },
  timestamp: { type: Date, default: Date.now },
  txHash: { type: String },
  ipfsHash: { type: String },
  unitId: { type: String },
});

const campaignSchema = new mongoose.Schema({
  hospitalId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  title: { type: String, required: true },
  status: { type: String, enum: ["active", "completed"], default: "active" },
  severity: {
    type: String,
    enum: ["critical", "high", "medium"],
    required: true,
  },
  unitsNeeded: { type: Number, required: true },
  unitsReceived: { type: Number, default: 0 },
  unitsCommitted: { type: Number, default: 0 },
  location: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  deadline: { type: String, required: true },
  bloodTypes: [{ type: String }],
  description: { type: String, required: true },
  donors: { type: Number, default: 0 },
  blockchainId: { type: String },
  verified: { type: Boolean, default: false },
});

const commitmentSchema = new mongoose.Schema({
  campaignId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Campaign",
    required: true,
  },
  donorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  bloodType: { type: String, required: true },
  units: { type: Number, default: 1 },
  status: {
    type: String,
    enum: ["committed", "donated"],
    default: "committed",
  },
  createdAt: { type: Date, default: Date.now },
});

const eventSchema = new mongoose.Schema({
  type: { type: String, required: true },
  title: { type: String, required: true },
  desc: { type: String, required: true },
  time: { type: Date, default: Date.now },
  status: { type: String },
  campaignId: { type: mongoose.Schema.Types.ObjectId, ref: "Campaign" },
  icon: { type: String },
});

const User = mongoose.model("User", userSchema);
const BloodInventory = mongoose.model("BloodInventory", bloodInventorySchema);
const Request = mongoose.model("Request", requestSchema);
const Transaction = mongoose.model("Transaction", transactionSchema);
const Campaign = mongoose.model("Campaign", campaignSchema);
const Commitment = mongoose.model("Commitment", commitmentSchema);
const Event = mongoose.model("Event", eventSchema);

// === VALIDATION ===
const RecordDonationSchema = z.object({
  donorId: z.string().min(1, "Donor ID required"),
  bloodType: z.enum(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]),
  units: z.coerce.number().int().min(1).max(10),
  ipfsHash: z.string().optional(),
});

// === EMAIL ===
const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false, // For development only
  },
});

// ✅ Verify transporter configuration on startup
transporter.verify((error, success) => {
  if (error) {
    console.error("❌ Email configuration error:", error);
    console.log("\n⚠️  Please check your EMAIL_USER and EMAIL_PASS in .env");
  } else {
    console.log("✅ Email service ready");
  }
});

const generateOTP = () => crypto.randomBytes(3).toString("hex").toUpperCase();

// ✅ Improved sendOTPEmail with error handling
const sendOTPEmail = async (email, otp) => {
  try {
    console.log(`📧 Attempting to send OTP to ${email}...`);

    const mailOptions = {
      from: `"BloodChain Platform" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "🩸 BloodChain - OTP Verification Code",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
            .otp-box { background: white; border: 2px dashed #dc2626; padding: 20px; text-align: center; margin: 20px 0; border-radius: 8px; }
            .otp-code { font-size: 32px; font-weight: bold; color: #dc2626; letter-spacing: 8px; }
            .footer { text-align: center; margin-top: 20px; color: #6b7280; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🩸 BloodChain</h1>
              <p>Verify Your Email Address</p>
            </div>
            <div class="content">
              <p>Hello,</p>
              <p>Thank you for registering with BloodChain. Please use the following OTP to complete your verification:</p>
              
              <div class="otp-box">
                <div class="otp-code">${otp}</div>
              </div>
              
              <p><strong>This code will expire in 10 minutes.</strong></p>
              
              <p>If you didn't request this code, please ignore this email.</p>
              
              <div class="footer">
                <p>© 2025 BloodChain. All rights reserved.</p>
                <p>This is an automated email. Please do not reply.</p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `Your BloodChain OTP verification code is: ${otp}\n\nThis code will expire in 10 minutes.\n\nIf you didn't request this code, please ignore this email.`,
    };

    const info = await transporter.sendMail(mailOptions);

    console.log("✅ Email sent successfully!");
    console.log("📬 Message ID:", info.messageId);
    console.log("📨 Accepted:", info.accepted);
    console.log("❌ Rejected:", info.rejected);

    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("❌ Email sending failed:");
    console.error("Error code:", error.code);
    console.error("Error message:", error.message);
    console.error("Error response:", error.response);

    // Throw error to be caught by signup route
    throw new Error(`Failed to send OTP email: ${error.message}`);
  }
};

// ============ MIDDLEWARE ============
const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        error: "No token provided",
        message: "Authorization header missing or malformed",
      });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;

    const user = await User.findById(req.userId).select("-password");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    req.userRole = user.role;
    req.user = user;
    next();
  } catch (error) {
    console.error("🔒 Auth error:", error.message);
    return res.status(401).json({
      error: "Invalid token",
      message: error.message,
    });
  }
};

const adminMiddleware = (req, res, next) => {
  if (req.userRole !== "Admin") {
    return res.status(403).json({ error: "Admin access required" });
  }
  next();
};

const hospitalMiddleware = (req, res, next) => {
  if (req.userRole !== "Hospital") {
    return res.status(403).json({ error: "Hospital access required" });
  }
  next();
};

const donorMiddleware = (req, res, next) => {
  if (req.userRole !== "Donor") {
    return res.status(403).json({ error: "Donor access required" });
  }
  next();
};

// ============ HEALTH CHECK ============
app.get("/", (req, res) => {
  res.json({
    status: "running",
    message: "BloodChain API v1.0",
    endpoints: [
      "/api/auth/*",
      "/api/donor/*",
      "/api/hospital/*",
      "/api/bloodbank/*",
    ],
  });
});

app.get("/health", (req, res) => {
  res.json({
    status: "healthy",
    mongodb:
      mongoose.connection.readyState === 1 ? "connected" : "disconnected",
    blockchain: wallet.address ? "connected" : "disconnected",
  });
});

// ============ AUTH ROUTES ============

// Test route
app.get("/api/auth/test", (req, res) => {
  res.json({ message: "Auth routes working!" });
});

// Signup
// Signup Route (IMPROVED)
app.post("/api/auth/signup", async (req, res) => {
  const { firstName, lastName, email, role } = req.body;

  console.log("📝 Signup request:", { firstName, lastName, email, role });

  // Validation
  if (!email || !role) {
    return res.status(400).json({ error: "Email and role are required" });
  }

  if (!["Donor", "Hospital", "BloodBank", "Admin"].includes(role)) {
    return res.status(400).json({ error: "Invalid role" });
  }

  if (role === "Donor" && (!firstName || !lastName)) {
    return res.status(400).json({
      error: "First name and last name are required for donors",
    });
  }

  if (!/\S+@\S+\.\S+/.test(email)) {
    return res.status(400).json({ error: "Invalid email format" });
  }

  try {
    // Check existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already registered" });
    }

    // Generate OTP
    const otp = generateOTP();
    console.log(`🔐 Generated OTP for ${email}: ${otp}`);

    const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

    // Create user
    const user = new User({
      firstName: role === "Donor" || role === "Admin" ? firstName : undefined,
      lastName: role === "Donor" || role === "Admin" ? lastName : undefined,
      email,
      role,
      otp,
      otpExpires,
      adminInfo:
        role === "Admin" ? { name: `${firstName} ${lastName}` } : undefined,
    });

    await user.save();
    console.log(`✅ User created with ID: ${user._id}`);

    // ✅ Send OTP email with error handling
    try {
      const emailResult = await sendOTPEmail(email, otp);
      console.log("✅ OTP email sent successfully:", emailResult);

      res.status(200).json({
        success: true,
        message: "OTP sent to your email",
        email,
        role,
        // ⚠️ REMOVE IN PRODUCTION
        ...(process.env.NODE_ENV === "development" && { otp }), // Only for testing
      });
    } catch (emailError) {
      console.error("❌ Email sending failed:", emailError.message);

      // Delete the user since OTP couldn't be sent
      await User.deleteOne({ _id: user._id });
      console.log("🗑️  User deleted due to email failure");

      return res.status(500).json({
        error: "Failed to send OTP email",
        details: "Please check your email configuration",
        // Show OTP in development mode as fallback
        ...(process.env.NODE_ENV === "development" && {
          otp,
          message:
            "Email service unavailable. Use this OTP (dev mode only): " + otp,
        }),
      });
    }
  } catch (error) {
    console.error("❌ Signup error:", error);
    res.status(500).json({
      error: "Server error",
      details: error.message,
    });
  }
});

// Verify OTP
app.post("/api/auth/verify-otp", async (req, res) => {
  const { email, otp } = req.body;

  console.log("🔍 Verify OTP:", { email, otp });

  if (!email || !otp) {
    return res.status(400).json({ error: "Email and OTP are required" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (user.isVerified) {
      return res.status(400).json({ error: "User already verified" });
    }

    if (user.otp !== otp.toUpperCase() || user.otpExpires < Date.now()) {
      return res.status(400).json({ error: "Invalid or expired OTP" });
    }

    user.otp = null;
    user.otpExpires = null;
    user.isVerified = true;
    await user.save();

    res.status(200).json({
      message: "OTP verified successfully",
      role: user.role,
    });
  } catch (error) {
    console.error("❌ OTP verification error:", error);
    res.status(500).json({ error: "Server error", details: error.message });
  }
});

// Complete Signup
app.post("/api/auth/complete-signup", async (req, res) => {
  const { email, password, confirmPassword } = req.body;

  console.log("🔒 Complete signup:", { email });

  if (!email || !password || !confirmPassword) {
    return res.status(400).json({ error: "All fields are required" });
  }

  if (password.length < 8) {
    return res.status(400).json({
      error: "Password must be at least 8 characters",
    });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ error: "Passwords do not match" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (!user.isVerified) {
      return res.status(400).json({ error: "User not verified" });
    }

    if (user.password) {
      return res.status(400).json({ error: "Password already set" });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    await user.save();

    res.status(200).json({
      message: "Password set successfully",
      role: user.role,
      email: user.email,
    });
  } catch (error) {
    console.error("❌ Complete signup error:", error);
    res.status(500).json({ error: "Server error", details: error.message });
  }
});

// Submit Questionnaire
app.post("/api/auth/submit-questionnaire", async (req, res) => {
  const { email, role, questionnaire } = req.body;

  console.log("📋 Questionnaire:", { email, role });

  if (!email || !role || !questionnaire) {
    return res.status(400).json({
      error: "Email, role, and questionnaire data are required",
    });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (!user.isVerified) {
      return res.status(400).json({ error: "User not verified" });
    }

    if (!user.password) {
      return res.status(400).json({ error: "Password not set" });
    }

    // Update user based on role
    if (role === "Donor") {
      const { bloodGroup, donationCount, lastDonationDate, medicalConditions } =
        questionnaire;

      if (
        !bloodGroup ||
        !["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].includes(bloodGroup)
      ) {
        return res.status(400).json({ error: "Invalid blood group" });
      }

      user.donorInfo = {
        bloodGroup,
        donationCount: Number(donationCount) || 0,
        lastDonationDate: lastDonationDate
          ? new Date(lastDonationDate)
          : undefined,
        medicalConditions,
        rewards: { points: 0, badges: [] },
      };
    } else if (role === "Hospital") {
      const { name, location, bedCount, contactNumber } = questionnaire;

      if (!name || !location || !bedCount || !contactNumber) {
        return res
          .status(400)
          .json({ error: "All hospital fields are required" });
      }

      user.hospitalInfo = {
        name,
        location,
        bedCount: Number(bedCount),
        contactNumber,
      };
    } else if (role === "BloodBank") {
      const { name, location, bloodStorageCapacity, contactNumber } =
        questionnaire;

      if (!name || !location || !bloodStorageCapacity || !contactNumber) {
        return res
          .status(400)
          .json({ error: "All blood bank fields are required" });
      }

      user.bloodBankInfo = {
        name,
        location,
        bloodStorageCapacity: Number(bloodStorageCapacity),
        contactNumber,
      };
    } else if (role === "Admin") {
      const { contactNumber } = questionnaire;

      if (!contactNumber) {
        return res
          .status(400)
          .json({ error: "Contact number is required for admin" });
      }

      user.adminInfo = {
        ...user.adminInfo,
        contactNumber,
      };
    } else {
      return res.status(400).json({ error: "Invalid role" });
    }

    await user.save();

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });

    res.status(200).json({
      message: "Questionnaire submitted successfully",
      token,
      user: {
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
        donorInfo: user.donorInfo,
        hospitalInfo: user.hospitalInfo,
        bloodBankInfo: user.bloodBankInfo,
        adminInfo: user.adminInfo,
      },
    });
  } catch (error) {
    console.error("❌ Questionnaire error:", error);
    res.status(500).json({ error: "Server error", details: error.message });
  }
});

// Login
app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;

  console.log("🔐 Login attempt:", { email });

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    if (!user.isVerified) {
      return res.status(400).json({ error: "User not verified" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
        walletAddress: user.walletAddress,
        donorInfo: user.donorInfo,
        hospitalInfo: user.hospitalInfo,
        bloodBankInfo: user.bloodBankInfo,
        adminInfo: user.adminInfo,
      },
    });
  } catch (error) {
    console.error("❌ Login error:", error);
    res.status(500).json({ error: "Server error", details: error.message });
  }
});

// Get Current User
app.get("/api/auth/me", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select(
      "-password -otp -otpExpires"
    );
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json({ user });
  } catch (error) {
    console.error("❌ Get user error:", error);
    res.status(500).json({ error: "Server error", details: error.message });
  }
});

// ============ CONNECT WALLET (FIXED) ============
app.post("/api/auth/connect-wallet", authMiddleware, async (req, res) => {
  const { walletAddress } = req.body;

  console.log("💳 Connect wallet request:", {
    userId: req.userId,
    walletAddress,
  });

  if (!walletAddress || !/^0x[a-fA-F0-9]{40}$/.test(walletAddress)) {
    return res.status(400).json({
      error: "Valid wallet address required",
      received: walletAddress,
    });
  }

  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Check if wallet already used by another user
    const existingWallet = await User.findOne({
      walletAddress,
      _id: { $ne: req.userId },
    });

    if (existingWallet) {
      return res.status(400).json({
        error: "Wallet address already connected to another account",
      });
    }

    user.walletAddress = walletAddress;
    await user.save();

    console.log("✅ Wallet connected:", { userId: req.userId, walletAddress });

    res.json({
      message: "Wallet connected successfully",
      walletAddress,
      user: {
        email: user.email,
        role: user.role,
        walletAddress: user.walletAddress,
      },
    });
  } catch (error) {
    console.error("❌ Connect wallet error:", error);
    res.status(500).json({
      error: "Server error",
      details: error.message,
    });
  }
});

// Admin Routes
app.get(
  "/api/admin/users",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const users = await User.find().select("-password -otp -otpExpires");
      res.status(200).json({ users });
    } catch (error) {
      console.error("Get all users error:", error);
      res.status(500).json({ error: "Server error" });
    }
  }
);

app.post(
  "/api/admin/grant-role",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    const { userWallet, role } = req.body; // e.g., "DONOR_ROLE"
    if (!userWallet || !role)
      return res.status(400).json({ error: "userWallet and role required" });

    try {
      const adminWallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
      const contract = getContract(adminWallet);
      const roleBytes = ethers.id(role);
      const tx = await contract.grantRoleToUser(roleBytes, userWallet);
      const receipt = await tx.wait();
      if (receipt.status !== 1) throw new Error("Role grant failed");

      res.json({ message: "Role granted", txHash: receipt.transactionHash });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

app.put(
  "/api/admin/users/:id",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    const { id } = req.params;
    const {
      firstName,
      lastName,
      email,
      role,
      donorInfo,
      hospitalInfo,
      bloodBankInfo,
      adminInfo,
    } = req.body;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid user ID" });
    }
    try {
      const user = await User.findById(id);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      if (email && email !== user.email) {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
          return res.status(400).json({ error: "Email already in use" });
        }
        user.email = email;
      }
      if (role && !["Donor", "Hospital", "BloodBank", "Admin"].includes(role)) {
        return res.status(400).json({ error: "Invalid role" });
      }
      if (role === "Donor" || role === "Admin") {
        if (!firstName || !lastName) {
          return res
            .status(400)
            .json({ error: "First name and last name are required" });
        }
        user.firstName = firstName;
        user.lastName = lastName;
      }
      if (role) user.role = role;
      if (donorInfo) {
        if (
          donorInfo.bloodGroup &&
          !["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].includes(
            donorInfo.bloodGroup
          )
        ) {
          return res.status(400).json({ error: "Invalid blood group" });
        }
        user.donorInfo = {
          ...user.donorInfo,
          ...donorInfo,
          donationCount:
            Number(donorInfo.donationCount) ||
            user.donorInfo.donationCount ||
            0,
          lastDonationDate: donorInfo.lastDonationDate
            ? new Date(donorInfo.lastDonationDate)
            : user.donorInfo.lastDonationDate,
          rewards: user.donorInfo.rewards || { points: 0, badges: [] },
        };
      }
      if (hospitalInfo) {
        if (
          !hospitalInfo.name ||
          !hospitalInfo.location ||
          !hospitalInfo.bedCount ||
          !hospitalInfo.contactNumber
        ) {
          return res
            .status(400)
            .json({ error: "All hospital fields are required" });
        }
        user.hospitalInfo = {
          ...user.hospitalInfo,
          ...hospitalInfo,
          bedCount: Number(hospitalInfo.bedCount),
        };
      }
      if (bloodBankInfo) {
        if (
          !bloodBankInfo.name ||
          !bloodBankInfo.location ||
          !bloodBankInfo.bloodStorageCapacity ||
          !bloodBankInfo.contactNumber
        ) {
          return res
            .status(400)
            .json({ error: "All blood bank fields are required" });
        }
        user.bloodBankInfo = {
          ...user.bloodBankInfo,
          ...bloodBankInfo,
          bloodStorageCapacity: Number(bloodBankInfo.bloodStorageCapacity),
        };
      }
      if (adminInfo) {
        if (!adminInfo.contactNumber) {
          return res
            .status(400)
            .json({ error: "Contact number is required for admin" });
        }
        user.adminInfo = {
          ...user.adminInfo,
          ...adminInfo,
          name: user.adminInfo?.name || `${firstName} ${lastName}`,
        };
      }
      await user.save();
      res.status(200).json({ message: "User updated successfully", user });
    } catch (error) {
      console.error("Update user error:", error);
      res.status(500).json({ error: "Server error" });
    }
  }
);

app.delete(
  "/api/admin/users/:id",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid user ID" });
    }
    try {
      const user = await User.findById(id);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      await User.deleteOne({ _id: id });
      res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
      console.error("Delete user error:", error);
      res.status(500).json({ error: "Server error" });
    }
  }
);

app.get(
  "/api/admin/inventory",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const inventory = await BloodInventory.find().populate(
        "bloodBankId",
        "bloodBankInfo.name"
      );
      res.status(200).json({ inventory });
    } catch (error) {
      console.error("Get all inventory error:", error);
      res.status(500).json({ error: "Server error" });
    }
  }
);

app.get(
  "/api/admin/requests",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const requests = await Request.find()
        .populate("hospitalId", "hospitalInfo.name")
        .populate("bloodBankId", "bloodBankInfo.name");
      res.status(200).json({ requests });
    } catch (error) {
      console.error("Get all requests error:", error);
      res.status(500).json({ error: "Server error" });
    }
  }
);

app.get(
  "/api/admin/transactions",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const transactions = await Transaction.find()
        .populate("donorId", "firstName lastName")
        .populate("hospitalId", "hospitalInfo.name")
        .populate("bloodBankId", "bloodBankInfo.name");
      res.status(200).json({ transactions });
    } catch (error) {
      console.error("Get all transactions error:", error);
      res.status(500).json({ error: "Server error" });
    }
  }
);

// Blood Bank Routes
app.get("/api/bloodbank/donors", authMiddleware, async (req, res) => {
  try {
    if (req.userRole !== "BloodBank") {
      return res.status(403).json({ error: "Access denied" });
    }
    const donors = await User.find({ role: "Donor" }).select(
      "firstName lastName donorInfo"
    );
    res.status(200).json({ donors });
  } catch (error) {
    console.error("Get donors error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

app.get("/api/bloodbank/inventory", authMiddleware, async (req, res) => {
  try {
    if (req.userRole !== "BloodBank") {
      return res.status(403).json({ error: "Access denied" });
    }
    const inventory = await BloodInventory.find({ bloodBankId: req.userId });
    res.status(200).json({ inventory });
  } catch (error) {
    console.error("Get inventory error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

app.get("/api/bloodbank/requests", authMiddleware, async (req, res) => {
  try {
    if (req.userRole !== "BloodBank") {
      return res.status(403).json({ error: "Access denied" });
    }
    const requests = await Request.find({ bloodBankId: req.userId }).populate(
      "hospitalId",
      "hospitalInfo.name"
    );
    res.status(200).json({ requests });
  } catch (error) {
    console.error("Get requests error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

app.get("/api/bloodbank/registered", authMiddleware, async (req, res) => {
  try {
    const bloodBanks = await User.find({
      role: "BloodBank",
      bloodBankInfo: { $ne: null },
    }).select(
      "bloodBankInfo.name bloodBankInfo.location bloodBankInfo.contactNumber"
    );
    res.status(200).json({ bloodBanks });
  } catch (error) {
    console.error("Get registered blood banks error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Improved endpoint
// server.js or routes/bloodbank.js
app.post("/api/bloodbank/record-donation", authMiddleware, async (req, res) => {
  if (req.userRole !== "BloodBank") {
    return res.status(403).json({ error: "BloodBank only" });
  }

  const parseResult = RecordDonationSchema.safeParse(req.body);
  if (!parseResult.success) {
    return res.status(400).json({
      error: "Invalid input",
      details: parseResult.error.format(),
    });
  }

  const { donorId, bloodType, units, ipfsHash = "" } = parseResult.data;

  let session;
  let receipt;
  let donor;
  let inventory;

  try {
    session = await mongoose.startSession();
    await session.withTransaction(async () => {
      // 1. Find Donor
      donor = await User.findById(donorId).session(session);
      if (!donor || donor.role !== "Donor") throw new Error("Invalid donor");
      if (!donor.walletAddress) throw new Error("Donor wallet not connected");

      // 2. Update Donor
      const oldPoints = donor.donorInfo?.rewards?.points || 0;
      const oldBadges = donor.donorInfo?.rewards?.badges || [];
      const { newPoints, newBadges } = calculateRewards(
        oldPoints,
        units * 10,
        oldBadges
      );

      donor.donorInfo = {
        ...donor.donorInfo,
        donationCount: (donor.donorInfo?.donationCount || 0) + 1,
        lastDonationDate: new Date(),
        rewards: { points: newPoints, badges: newBadges },
      };
      await donor.save({ session });

      // 3. Update Inventory
      const expiryDate = new Date(Date.now() + 42 * 24 * 60 * 60 * 1000);
      inventory = await BloodInventory.findOneAndUpdate(
        { bloodBankId: req.userId, bloodType },
        { $inc: { units } },
        { upsert: true, new: true, session }
      );

      if (!inventory.expiryDate) {
        inventory.expiryDate = expiryDate;
      }

      // Update demand
      const total = inventory.units;
      inventory.demand =
        total < 10
          ? "Critical"
          : total < 20
          ? "High"
          : total < 50
          ? "Medium"
          : "Low";
      await inventory.save({ session });

      // 4. Blockchain
      const contract = getContract(wallet);
      const tx = await contract.recordDonation(
        donor.walletAddress,
        bloodType,
        units,
        ipfsHash,
        Math.floor(expiryDate.getTime() / 1000),
        { gasLimit: 600000 }
      );
      receipt = await tx.wait();
      if (receipt.status !== 1) throw new Error("Tx failed");

      // 5. Save Transaction
      const transaction = new Transaction({
        type: "Donation",
        donorId,
        bloodBankId: req.userId,
        bloodType,
        quantity: units,
        status: "Confirmed",
        txHash: receipt.transactionHash,
        ipfsHash,
      });
      await transaction.save({ session });
    });

    res.json({
      success: true,
      message: "Donation recorded",
      txHash: receipt.transactionHash,
      donor: {
        points: donor.donorInfo.rewards.points,
        badges: donor.donorInfo.rewards.badges,
        total: donor.donorInfo.donationCount,
      },
      inventory: {
        bloodType: inventory.bloodType,
        units: inventory.units,
        demand: inventory.demand,
      },
    });
  } catch (error) {
    console.error("Record Donation Error:", error.message);
    res.status(500).json({ error: error.message });
  } finally {
    if (session) session.endSession();
  }
});
// Hospital Routes - Existing
// Hospital Routes - FIXED request-blood endpoint
app.post(
  "/api/hospital/request-blood",
  authMiddleware,
  hospitalMiddleware,
  async (req, res) => {
    const { bloodBankId, bloodType, quantity } = req.body;

    console.log("📥 Blood request received:", {
      bloodBankId,
      bloodType,
      quantity,
    });

    // Validation
    if (!bloodBankId || !bloodType || !quantity) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    if (
      !["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].includes(bloodType)
    ) {
      return res.status(400).json({ error: "Invalid blood type" });
    }

    if (quantity < 1 || quantity > 100) {
      return res
        .status(400)
        .json({ error: "Quantity must be between 1 and 100" });
    }

    if (!mongoose.Types.ObjectId.isValid(bloodBankId)) {
      return res.status(400).json({ error: "Invalid blood bank ID" });
    }

    try {
      // Verify blood bank exists
      const bloodBank = await User.findById(bloodBankId);
      if (!bloodBank || bloodBank.role !== "BloodBank") {
        return res.status(400).json({ error: "Blood bank not found" });
      }

      // Check if blood bank has inventory for requested blood type
      const inventory = await BloodInventory.findOne({
        bloodBankId: bloodBankId,
        bloodType: bloodType,
      });

      if (!inventory || inventory.units < quantity) {
        console.log("⚠️ Insufficient inventory:", {
          available: inventory?.units || 0,
          requested: quantity,
        });
        // Still allow request but warn
      }

      // Create the request in database first
      const request = new Request({
        hospitalId: req.userId,
        bloodBankId: bloodBankId,
        bloodType,
        quantity: parseInt(quantity),
        status: "Pending",
      });

      await request.save();
      console.log("✅ Request saved to database:", request._id);

      // Try blockchain transaction if both parties have wallets
      let txHash = null;
      try {
        const hospital = await User.findById(req.userId);

        if (hospital?.walletAddress && bloodBank?.walletAddress) {
          const contract = getContract(wallet);

          // Check if contract has the createRequest function
          if (contract.createRequest) {
            const tx = await contract.createRequest(
              bloodBank.walletAddress, // Use wallet address, not MongoDB ID
              bloodType,
              quantity,
              { gasLimit: 300000 }
            );
            const receipt = await tx.wait();

            if (receipt.status === 1) {
              txHash = receipt.hash || receipt.transactionHash;
              request.blockchainId = txHash;
              await request.save();
              console.log("✅ Blockchain transaction successful:", txHash);
            }
          } else {
            console.log(
              "ℹ️ Contract does not have createRequest function, skipping blockchain"
            );
          }
        } else {
          console.log("ℹ️ Wallet addresses not available, skipping blockchain");
        }
      } catch (blockchainError) {
        console.error(
          "⚠️ Blockchain error (non-fatal):",
          blockchainError.message
        );
        // Don't fail the request, just log the blockchain error
      }

      // Populate the response
      const populatedRequest = await Request.findById(request._id).populate(
        "bloodBankId",
        "bloodBankInfo.name"
      );

      res.status(201).json({
        success: true,
        message: "Blood request submitted successfully",
        request: {
          _id: populatedRequest._id,
          hospitalId: populatedRequest.hospitalId,
          bloodBankId: populatedRequest.bloodBankId,
          bloodType: populatedRequest.bloodType,
          quantity: populatedRequest.quantity,
          status: populatedRequest.status,
          createdAt: populatedRequest.createdAt,
          blockchainId: txHash,
        },
        txHash,
      });
    } catch (error) {
      console.error("❌ Request blood error:", error);
      res.status(500).json({
        error: "Failed to submit blood request",
        details: error.message,
      });
    }
  }
);

app.get("/api/hospital/requests", authMiddleware, async (req, res) => {
  try {
    if (req.userRole !== "Hospital") {
      return res.status(403).json({ error: "Access denied" });
    }
    const requests = await Request.find({ hospitalId: req.userId }).populate(
      "bloodBankId",
      "bloodBankInfo.name"
    );
    res.status(200).json({ requests });
  } catch (error) {
    console.error("Get requests error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

app.get("/api/hospital/inventory", authMiddleware, async (req, res) => {
  try {
    if (req.userRole !== "Hospital") {
      return res.status(403).json({ error: "Access denied" });
    }
    const inventory = await BloodInventory.find({ hospitalId: req.userId });
    res.status(200).json({ inventory });
  } catch (error) {
    console.error("Get inventory error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

app.get("/api/hospital/transactions", authMiddleware, async (req, res) => {
  try {
    if (req.userRole !== "Hospital") {
      return res.status(403).json({ error: "Access denied" });
    }
    const transactions = await Transaction.find({ hospitalId: req.userId });
    res.status(200).json({ transactions });
  } catch (error) {
    console.error("Get transactions error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Hospital Dashboard Routes
app.post(
  "/api/hospital/campaigns",
  authMiddleware,
  hospitalMiddleware,
  async (req, res) => {
    const {
      title,
      severity,
      unitsNeeded,
      location,
      deadline,
      bloodTypes,
      description,
    } = req.body;
    if (
      !title ||
      !severity ||
      !unitsNeeded ||
      !location ||
      !deadline ||
      !description
    ) {
      return res.status(400).json({ error: "Required fields missing" });
    }
    if (!["critical", "high", "medium"].includes(severity)) {
      return res.status(400).json({ error: "Invalid severity" });
    }
    try {
      const blockchainId = `0x${crypto
        .randomBytes(10)
        .toString("hex")}...${crypto.randomBytes(4).toString("hex")}`;
      const campaign = new Campaign({
        hospitalId: req.userId,
        title,
        severity,
        unitsNeeded: parseInt(unitsNeeded),
        location,
        deadline,
        bloodTypes: bloodTypes || [],
        description,
        blockchainId,
        verified: false,
      });
      await campaign.save();

      // Add event
      const event = new Event({
        type: "campaign",
        title: "New Emergency Campaign",
        desc: `${title} activated`,
        status: severity,
        campaignId: campaign._id,
        icon: "AlertTriangle",
      });
      await event.save();

      const populated = await Campaign.findById(campaign._id).populate(
        "hospitalId",
        "hospitalInfo.name"
      );
      res.status(201).json({ campaign: populated });
    } catch (error) {
      console.error("Create campaign error:", error);
      res.status(500).json({ error: "Server error" });
    }
  }
);

app.get(
  "/api/hospital/campaigns",
  authMiddleware,
  hospitalMiddleware,
  async (req, res) => {
    try {
      const campaigns = await Campaign.find({ hospitalId: req.userId })
        .sort({ createdAt: -1 })
        .populate("hospitalId", "hospitalInfo.name");
      res.status(200).json({ campaigns });
    } catch (error) {
      console.error("Get campaigns error:", error);
      res.status(500).json({ error: "Server error" });
    }
  }
);

app.put(
  "/api/hospital/campaigns/:id",
  authMiddleware,
  hospitalMiddleware,
  async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid campaign ID" });
    }
    try {
      const campaign = await Campaign.findOne({
        _id: id,
        hospitalId: req.userId,
      });
      if (!campaign) {
        return res.status(404).json({ error: "Campaign not found" });
      }
      Object.assign(campaign, req.body);
      await campaign.save();
      const populated = await Campaign.findById(campaign._id).populate(
        "hospitalId",
        "hospitalInfo.name"
      );
      res.status(200).json({ campaign: populated });
    } catch (error) {
      console.error("Update campaign error:", error);
      res.status(500).json({ error: "Server error" });
    }
  }
);

app.delete(
  "/api/hospital/campaigns/:id",
  authMiddleware,
  hospitalMiddleware,
  async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid campaign ID" });
    }
    try {
      const campaign = await Campaign.findOneAndDelete({
        _id: id,
        hospitalId: req.userId,
      });
      if (!campaign) {
        return res.status(404).json({ error: "Campaign not found" });
      }
      res.status(200).json({ message: "Campaign deleted successfully" });
    } catch (error) {
      console.error("Delete campaign error:", error);
      res.status(500).json({ error: "Server error" });
    }
  }
);

app.get(
  "/api/hospital/stats",
  authMiddleware,
  hospitalMiddleware,
  async (req, res) => {
    try {
      const campaigns = await Campaign.find({ hospitalId: req.userId });
      const active = campaigns.filter((c) => c.status === "active").length;
      const required = campaigns.reduce((sum, c) => sum + c.unitsNeeded, 0);
      const received = campaigns.reduce((sum, c) => sum + c.unitsReceived, 0);
      const donorsTotal = campaigns.reduce((sum, c) => sum + c.donors, 0); // Fixed
      const completed = campaigns.filter(
        (c) => c.status === "completed"
      ).length;
      const verified = campaigns.filter((c) => c.verified).length;

      res.json({
        active,
        required,
        received,
        donors: donorsTotal,
        completed,
        verified,
      });
    } catch (error) {
      res.status(500).json({ error: "Server error" });
    }
  }
);

app.get(
  "/api/hospital/timeline",
  authMiddleware,
  hospitalMiddleware,
  async (req, res) => {
    try {
      const events = await Event.find({}).sort({ time: -1 }).limit(5);
      res.status(200).json({ timelineEvents: events });
    } catch (error) {
      console.error("Get timeline error:", error);
      res.status(500).json({ error: "Server error" });
    }
  }
);

app.get(
  "/api/hospital/analytics",
  authMiddleware,
  hospitalMiddleware,
  async (req, res) => {
    try {
      const campaigns = await Campaign.find({ hospitalId: req.userId });
      const distribution = await Commitment.aggregate([
        { $match: { campaignId: { $in: campaigns.map((c) => c._id) } } },
        { $group: { _id: "$bloodType", units: { $sum: "$units" } } },
      ]);

      const bloodDist = [
        {
          type: "O+",
          units: distribution.find((d) => d._id === "O+")?.units || 96,
          percent: 35,
        },
        {
          type: "A+",
          units: distribution.find((d) => d._id === "A+")?.units || 77,
          percent: 28,
        },
        {
          type: "B+",
          units: distribution.find((d) => d._id === "B+")?.units || 55,
          percent: 20,
        },
        {
          type: "AB+",
          units: distribution.find((d) => d._id === "AB+")?.units || 47,
          percent: 17,
        },
      ];

      res.json({ bloodDistribution: bloodDist, keyMetrics: [] });
    } catch (error) {
      res.status(500).json({ error: "Server error" });
    }
  }
);

// Donor Routes - Existing
app.post("/api/donor/schedule", authMiddleware, async (req, res) => {
  const { bloodBankId, date, time } = req.body;
  if (!bloodBankId || !date || !time) {
    return res
      .status(400)
      .json({ error: "Blood bank ID, date, and time are required" });
  }
  try {
    if (req.userRole !== "Donor") {
      return res.status(403).json({ error: "Access denied" });
    }
    const bloodBank = await User.findById(bloodBankId);
    if (!bloodBank || bloodBank.role !== "BloodBank") {
      return res.status(400).json({ error: "Invalid blood bank" });
    }
    const scheduleDate = new Date(`${date}T${time}`);
    if (isNaN(scheduleDate.getTime()) || scheduleDate < Date.now()) {
      return res.status(400).json({ error: "Invalid or past date/time" });
    }
    const transaction = new Transaction({
      type: "Donation",
      donorId: req.userId,
      bloodBankId,
      bloodType: (await User.findById(req.userId)).donorInfo.bloodGroup,
      quantity: 1,
      status: "Scheduled",
      timestamp: scheduleDate,
    });
    await transaction.save();
    res
      .status(200)
      .json({ message: "Donation scheduled successfully", transaction });
  } catch (error) {
    console.error("Schedule donation error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

app.get("/api/donor/history", authMiddleware, async (req, res) => {
  try {
    if (req.userRole !== "Donor") {
      return res.status(403).json({ error: "Access denied" });
    }
    const transactions = await Transaction.find({
      donorId: req.userId,
    }).populate("hospitalId", "hospitalInfo.name");
    res.status(200).json({ history: transactions });
  } catch (error) {
    console.error("Get donation history error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

app.get("/api/donor/rewards", authMiddleware, async (req, res) => {
  try {
    if (req.userRole !== "Donor") {
      return res.status(403).json({ error: "Access denied" });
    }
    const user = await User.findById(req.userId);
    res.status(200).json({ rewards: user.donorInfo.rewards });
  } catch (error) {
    console.error("Get rewards error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Donor Dashboard Routes
app.get(
  "/api/donor/disasters",
  authMiddleware,
  donorMiddleware,
  async (req, res) => {
    try {
      const campaigns = await Campaign.find({ status: "active" })
        .populate("hospitalId", "hospitalInfo.name location")
        .sort({ createdAt: -1 });
      const disasters = campaigns.map((c) => ({
        id: c._id,
        type: c.title.split(" - ")[0] || "Emergency",
        location: c.location,
        severity: c.severity,
        unitsNeeded: c.unitsNeeded,
        unitsCollected: c.unitsReceived,
        distance: `${Math.floor(Math.random() * 100)} km`, // Mock distance
        timePosted: `${Math.floor(Math.random() * 24) + 1} hours ago`, // Mock time
        deadline: c.deadline,
        bloodTypes: c.bloodTypes,
        coordinates: {
          lat: 23.0225 + Math.random() * 10,
          lng: 72.5714 + Math.random() * 10,
        }, // Mock
        description: c.description,
        hospitals: [c.hospitalId?.hospitalInfo?.name || c.location],
        blockchainId: c.blockchainId,
        verified: c.verified,
      }));
      res.status(200).json({ disasters });
    } catch (error) {
      console.error("Get disasters error:", error);
      res.status(500).json({ error: "Server error" });
    }
  }
);

app.post(
  "/api/donor/commit/:campaignId",
  authMiddleware,
  donorMiddleware,
  async (req, res) => {
    const { campaignId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(campaignId)) {
      return res.status(400).json({ error: "Invalid campaign ID" });
    }
    try {
      const campaign = await Campaign.findById(campaignId);
      if (!campaign || campaign.status !== "active") {
        return res.status(404).json({ error: "Invalid or inactive campaign" });
      }
      const user = await User.findById(req.userId);
      const bloodType = user.donorInfo.bloodGroup;
      if (!bloodType) {
        return res.status(400).json({ error: "Donor blood group not set" });
      }
      // Check if already committed (simple check)
      const existing = await Commitment.findOne({
        campaignId,
        donorId: req.userId,
        status: "committed",
      });
      if (existing) {
        return res
          .status(400)
          .json({ error: "Already committed to this campaign" });
      }
      const commitment = new Commitment({
        campaignId,
        donorId: req.userId,
        bloodType,
        units: 1,
      });
      await commitment.save();
      campaign.unitsCommitted += 1;
      campaign.donors += 1;
      await campaign.save();

      // Add event
      const event = new Event({
        type: "donation",
        title: "Donation Committed",
        desc: `${user.firstName} ${user.lastName} committed to ${campaign.title}`,
        status: "success",
        campaignId: campaign._id,
        icon: "Droplet",
      });
      await event.save();

      res.status(200).json({ message: "Commitment registered successfully" });
    } catch (error) {
      console.error("Commit donation error:", error);
      res.status(500).json({ error: "Server error" });
    }
  }
);

app.get(
  "/api/donor/stats",
  authMiddleware,
  donorMiddleware,
  async (req, res) => {
    try {
      const activeCampaigns = await Campaign.find({ status: "active" });
      const activeCount = activeCampaigns.length;
      const unitsNeeded = activeCampaigns.reduce(
        (sum, c) => sum + c.unitsNeeded,
        0
      );
      const unitsCollected = activeCampaigns.reduce(
        (sum, c) => sum + c.unitsReceived,
        0
      );
      const activeDonors = activeCampaigns.reduce(
        (sum, c) => sum + c.donors,
        0
      );
      res.status(200).json({
        activeDisasters: activeCount.toString(),
        unitsNeeded: unitsNeeded.toString(),
        unitsCollected: unitsCollected.toString(),
        activeDonors: activeDonors.toLocaleString(),
      });
    } catch (error) {
      console.error("Get donor stats error:", error);
      res.status(500).json({ error: "Server error" });
    }
  }
);

app.get(
  "/api/donor/timeline",
  authMiddleware,
  donorMiddleware,
  async (req, res) => {
    try {
      const events = await Event.find({}).sort({ time: -1 }).limit(6);
      // Map to include category, unitsCollected if applicable
      const timelineEvents = events.map((e) => ({
        id: e._id,
        type: e.type,
        title: e.title,
        description: e.desc,
        time: `${Math.floor(Math.random() * 24)}h ago`, // Mock relative time
        category: e.status,
        icon: e.icon || "AlertCircle",
        location: "Various", // Mock
        unitsCollected: Math.floor(Math.random() * 100), // Mock
      }));
      res.status(200).json({ timelineEvents });
    } catch (error) {
      console.error("Get donor timeline error:", error);
      res.status(500).json({ error: "Server error" });
    }
  }
);

// Reward Routes
app.post("/api/rewards/issue", authMiddleware, async (req, res) => {
  const { recipientId, points } = req.body;
  if (!recipientId || !points) {
    return res
      .status(400)
      .json({ error: "Recipient ID and points are required" });
  }
  try {
    if (!["Hospital", "BloodBank"].includes(req.userRole)) {
      return res.status(403).json({ error: "Access denied" });
    }
    const recipient = await User.findById(recipientId);
    if (!recipient || recipient.role !== "Donor") {
      return res.status(400).json({ error: "Invalid recipient" });
    }
    recipient.donorInfo.rewards.points += points;
    if (
      points >= 10 &&
      !recipient.donorInfo.rewards.badges.includes("Bronze Donor")
    ) {
      recipient.donorInfo.rewards.badges.push("Bronze Donor");
    }
    await recipient.save();
    res.status(200).json({ message: "Reward issued successfully" });
  } catch (error) {
    console.error("Issue reward error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Approve/Reject Request
app.post("/api/bloodbank/request-action", authMiddleware, async (req, res) => {
  const { requestId, action } = req.body;
  
  console.log("📥 Request action received:", { requestId, action });

  // Validation
  if (!requestId || !action) {
    return res.status(400).json({ error: "Request ID and action are required" });
  }

  if (!["Approved", "Rejected"].includes(action)) {
    return res.status(400).json({ error: "Invalid action. Must be 'Approved' or 'Rejected'" });
  }

  if (!mongoose.Types.ObjectId.isValid(requestId)) {
    return res.status(400).json({ error: "Invalid request ID format" });
  }

  try {
    // Find the request
    const request = await Request.findById(requestId)
      .populate("hospitalId", "hospitalInfo.name walletAddress")
      .populate("bloodBankId", "bloodBankInfo.name walletAddress");

    if (!request) {
      return res.status(404).json({ error: "Request not found" });
    }

    // Verify blood bank ownership
    if (request.bloodBankId._id.toString() !== req.userId) {
      return res.status(403).json({ error: "You can only approve/reject your own requests" });
    }

    // Check if already processed
    if (request.status !== "Pending") {
      return res.status(400).json({ 
        error: `Request already ${request.status.toLowerCase()}` 
      });
    }

    let txHash = null;

    // Handle Approval
    if (action === "Approved") {
      // Check inventory
      const inventory = await BloodInventory.findOne({
        bloodBankId: req.userId,
        bloodType: request.bloodType,
      });

      if (!inventory) {
        return res.status(400).json({ 
          error: `No ${request.bloodType} blood in inventory` 
        });
      }

      if (inventory.units < request.quantity) {
        return res.status(400).json({ 
          error: `Insufficient stock. Available: ${inventory.units}, Requested: ${request.quantity}` 
        });
      }

      // Try blockchain transaction (optional, non-blocking)
      try {
        const bloodBank = await User.findById(req.userId);
        const hospital = await User.findById(request.hospitalId._id);

        if (bloodBank?.walletAddress && hospital?.walletAddress) {
          const contract = getContract(wallet);

          // Check if contract has the approveRequest function
          if (contract.approveRequest && typeof contract.approveRequest === "function") {
            // Try to call with wallet addresses instead of ObjectId
            const tx = await contract.approveRequest(
              hospital.walletAddress,
              request.bloodType,
              request.quantity,
              { gasLimit: 300000 }
            );
            const receipt = await tx.wait();

            if (receipt.status === 1) {
              txHash = receipt.hash || receipt.transactionHash;
              console.log("✅ Blockchain approval successful:", txHash);
            }
          } else {
            console.log("ℹ️ Contract does not have approveRequest function, skipping blockchain");
          }
        } else {
          console.log("ℹ️ Wallet addresses not available for blockchain transaction");
        }
      } catch (blockchainError) {
        console.error("⚠️ Blockchain error (non-fatal):", blockchainError.message);
        // Don't fail the approval, just log the error
      }

      // Update inventory (reduce units)
      inventory.units -= request.quantity;
      
      // Update demand based on new inventory level
      const total = inventory.units;
      inventory.demand =
        total < 10
          ? "Critical"
          : total < 20
          ? "High"
          : total < 50
          ? "Medium"
          : "Low";
      
      await inventory.save();
      console.log(`✅ Inventory updated: ${request.bloodType} - ${inventory.units} units remaining`);

      // Create transaction record
      const transaction = new Transaction({
        type: "Transfer",
        hospitalId: request.hospitalId._id,
        bloodBankId: req.userId,
        bloodType: request.bloodType,
        quantity: request.quantity,
        status: "In Transit",
        txHash: txHash,
        timestamp: new Date(),
      });
      await transaction.save();
      console.log("✅ Transaction record created:", transaction._id);
    }

    // Update request status
    request.status = action;
    if (txHash) {
      request.blockchainId = txHash;
    }
    await request.save();

    console.log(`✅ Request ${action}:`, requestId);

    res.status(200).json({
      success: true,
      message: `Request ${action.toLowerCase()} successfully`,
      request: {
        _id: request._id,
        status: request.status,
        bloodType: request.bloodType,
        quantity: request.quantity,
        hospitalName: request.hospitalId.hospitalInfo?.name || "Unknown",
      },
      txHash,
      ...(action === "Approved" && {
        inventory: {
          bloodType: request.bloodType,
          remainingUnits: (await BloodInventory.findOne({
            bloodBankId: req.userId,
            bloodType: request.bloodType,
          }))?.units || 0,
        },
      }),
    });

  } catch (error) {
    console.error("❌ Request action error:", error);
    res.status(500).json({
      error: "Failed to process request",
      details: error.message,
    });
  }
});

app.get("/api/bloodbank/transactions", authMiddleware, async (req, res) => {
  try {
    if (req.userRole !== "BloodBank") {
      return res.status(403).json({ error: "Access denied" });
    }

    const transactions = await Transaction.find({ bloodBankId: req.userId })
      .populate("donorId", "firstName lastName donorInfo.bloodGroup")
      .populate("hospitalId", "hospitalInfo.name")
      .sort({ timestamp: -1 })
      .limit(50);

    res.status(200).json({ transactions });
  } catch (error) {
    console.error("❌ Get transactions error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

app.use((err, req, res, next) => {
  console.error("💥 Unhandled error:", err);
  res.status(500).json({
    error: "Internal server error",
    message: err.message,
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    error: "Route not found",
    path: req.url,
    method: req.method,
  });
});

// ============ START SERVER ============
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════╗
║   🩸 BloodChain API Server Running     ║
║   Port: ${PORT}                           ║
║   Environment: ${process.env.NODE_ENV || "development"}             ║
║   MongoDB: ${
    mongoose.connection.readyState === 1 ? "✅ Connected" : "❌ Disconnected"
  }             ║
║   Blockchain: ✅ Ready                 ║
╚════════════════════════════════════════╝
  `);
});

// Graceful shutdown
process.on("SIGINT", async () => {
  console.log("\n🛑 Shutting down gracefully...");
  await mongoose.connection.close();
  process.exit(0);
});
