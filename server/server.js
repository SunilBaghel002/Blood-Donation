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
const { calculateRewards } = require("./utils/reward");

const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use((req, res, next) => {
  console.log(`Request: ${req.method} ${req.url}`);
  if (req.url.startsWith("http://") || req.url.startsWith("https://")) {
    return res.status(400).json({ error: "Invalid URL" });
  }
  next();
});

const getContract = (wallet) => {
  return new ethers.Contract(
    "0x5FbDB2315678afecb367f032d93F642f64180aa3", // deployed address
    BloodChainABI,
    wallet
  );
};

// MongoDB Connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};
connectDB();

// Schemas
const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: function () {
      return this.role === "Donor";
    },
  },
  lastName: {
    type: String,
    required: function () {
      return this.role === "Donor";
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
    name: { type: String },
    location: { type: String },
    bedCount: { type: Number },
    contactNumber: { type: String },
  },
  bloodBankInfo: {
    name: { type: String },
    location: { type: String },
    bloodStorageCapacity: { type: Number },
    contactNumber: { type: String },
  },
  adminInfo: {
    name: { type: String },
    contactNumber: { type: String },
  },
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
  status: { type: String }, // critical, success, info
  campaignId: { type: mongoose.Schema.Types.ObjectId, ref: "Campaign" },
  icon: { type: String }, // string for icon name
});

const User = mongoose.model("User", userSchema);
const BloodInventory = mongoose.model("BloodInventory", bloodInventorySchema);
const Request = mongoose.model("Request", requestSchema);
const Transaction = mongoose.model("Transaction", transactionSchema);
const Campaign = mongoose.model("Campaign", campaignSchema);
const Commitment = mongoose.model("Commitment", commitmentSchema);
const Event = mongoose.model("Event", eventSchema);

// Validation schema
const RecordDonationSchema = z.object({
  donorId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid donor ID"),
  bloodType: z.enum(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]),
  units: z.number().int().positive().max(10), // max 10 units per donation
  ipfsHash: z.string().optional(), // optional photo
});

// Nodemailer Setup
const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Generate OTP
const generateOTP = () => {
  return crypto.randomBytes(3).toString("hex").toUpperCase();
};

// Send OTP Email
const sendOTPEmail = async (email, otp) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "BloodChain OTP Verification",
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
        <h2 style="color: #dc2626;">BloodChain OTP Verification</h2>
        <p>Your OTP for account verification is:</p>
        <h3 style="color: #dc2626; font-size: 24px;">${otp}</h3>
        <p>This OTP is valid for 10 minutes. Please do not share it.</p>
        <p style="margin-top: 20px;">Thank you for joining BloodChain!</p>
      </div>
    `,
  };
  await transporter.sendMail(mailOptions);
};

// Authentication Middleware
const authMiddleware = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "No token provided" });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ error: "User not found" });
    req.userRole = user.role;
    req.user = user;
    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    return res.status(401).json({ error: "Invalid token" });
  }
};

// Admin Role Middleware
const adminMiddleware = async (req, res, next) => {
  if (req.userRole !== "Admin") {
    return res
      .status(403)
      .json({ error: "Access denied: Admin role required" });
  }
  next();
};

// Hospital Role Middleware
const hospitalMiddleware = async (req, res, next) => {
  if (req.userRole !== "Hospital") {
    return res
      .status(403)
      .json({ error: "Access denied: Hospital role required" });
  }
  next();
};

// Donor Role Middleware
const donorMiddleware = async (req, res, next) => {
  if (req.userRole !== "Donor") {
    return res
      .status(403)
      .json({ error: "Access denied: Donor role required" });
  }
  next();
};

// API Routes

// Step 1: Initiate Signup
app.post("/api/auth/signup", async (req, res) => {
  const { firstName, lastName, email, role } = req.body;
  if (!email || !role) {
    return res.status(400).json({ error: "Email and role are required" });
  }
  if (!["Donor", "Hospital", "BloodBank", "Admin"].includes(role)) {
    return res.status(400).json({ error: "Invalid role" });
  }
  if (role === "Donor" && (!firstName || !lastName)) {
    return res
      .status(400)
      .json({ error: "First name and last name are required for donors" });
  }
  if (role === "Admin" && (!firstName || !lastName)) {
    return res
      .status(400)
      .json({ error: "First name and last name are required for admins" });
  }
  if (!/\S+@\S+\.\S+/.test(email)) {
    return res.status(400).json({ error: "Invalid email format" });
  }
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already registered" });
    }
    const otp = generateOTP();
    console.log("otp is", otp);
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000);
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
    await sendOTPEmail(email, otp);
    res.status(200).json({ message: "OTP sent to your email", email, role });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Step 2: Verify OTP
app.post("/api/auth/verify-otp", async (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) {
    return res.status(400).json({ error: "Email and OTP are required" });
  }
  if (!/^\w{6}$/.test(otp)) {
    return res.status(400).json({ error: "OTP must be a 6-character code" });
  }
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    if (user.isVerified) {
      return res.status(400).json({ error: "User already verified" });
    }
    if (user.otp !== otp || user.otpExpires < Date.now()) {
      return res.status(400).json({ error: "Invalid or expired OTP" });
    }
    user.otp = null;
    user.otpExpires = null;
    user.isVerified = true;
    await user.save();
    res
      .status(200)
      .json({ message: "OTP verified successfully", role: user.role });
  } catch (error) {
    console.error("OTP verification error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Step 3: Complete Signup
app.post("/api/auth/complete-signup", async (req, res) => {
  const { email, password, confirmPassword } = req.body;
  if (!email || !password || !confirmPassword) {
    return res.status(400).json({ error: "All fields are required" });
  }
  if (password.length < 8) {
    return res
      .status(400)
      .json({ error: "Password must be at least 8 characters" });
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
      message: "Password set successfully. Please complete the questionnaire.",
      role: user.role,
      email: user.email,
    });
  } catch (error) {
    console.error("Complete signup error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Step 4: Submit Questionnaire
app.post("/api/auth/submit-questionnaire", async (req, res) => {
  const { email, role, questionnaire } = req.body;
  if (!email || !role || !questionnaire) {
    return res
      .status(400)
      .json({ error: "Email, role, and questionnaire data are required" });
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
      expiresIn: "1h",
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
    console.error("Questionnaire submission error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Login
app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;
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
      expiresIn: "1h",
    });
    res.status(200).json({
      message: "Login successful",
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
    console.error("Login error:", error);
    res.status(500).json({ error: "Server error" });
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
    console.error("Get user error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Connect Wallet
app.post("/api/auth/connect-wallet", authMiddleware, async (req, res) => {
  const { email, walletAddress } = req.body;
  if (!email || !walletAddress) {
    return res
      .status(400)
      .json({ error: "Email and wallet address are required" });
  }
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    user.walletAddress = walletAddress;
    await user.save();
    res
      .status(200)
      .json({ message: "Wallet connected successfully", walletAddress });
  } catch (error) {
    console.error("Wallet connection error:", error);
    res.status(500).json({ error: "Server error" });
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
app.post("/api/bloodbank/record-donation", authMiddleware, async (req, res) => {
  // 1. Validate role
  if (req.userRole !== "BloodBank") {
    return res.status(403).json({ error: "Access denied: BloodBank role required" });
  }

  // 2. Validate input
  const parseResult = RecordDonationSchema.safeParse(req.body);
  if (!parseResult.success) {
    return res.status(400).json({
      error: "Validation failed",
      details: parseResult.error.format(),
    });
  }

  const { donorId, bloodType, units, ipfsHash = "" } = parseResult.data;

  let transaction, receipt;
  const session = await mongoose.startSession();

  try {
    await session.withTransaction(async () => {
      // --- 1. Validate donor ---
      const donor = await User.findById(donorId).session(session);
      if (!donor || donor.role !== "Donor") {
        throw new Error("Invalid donor");
      }
      if (!donor.walletAddress) {
        throw new Error("Donor wallet not connected");
      }

      // --- 2. Update donor rewards ---
      const { newPoints, newBadges } = calculateRewards(
        donor.donorInfo.rewards.points,
        units * 10,
        donor.donorInfo.rewards.badges
      );

      donor.donorInfo.donationCount += 1;
      donor.donorInfo.lastDonationDate = new Date();
      donor.donorInfo.rewards.points = newPoints;
      donor.donorInfo.rewards.badges = newBadges;
      await donor.save({ session });

      // --- 3. Update inventory ---
      let inventory = await BloodInventory.findOne({
        bloodBankId: req.userId,
        bloodType,
      }).session(session);

      const expiryDate = new Date(Date.now() + 42 * 24 * 60 * 60 * 1000); // 42 days

      if (inventory) {
        inventory.units += units;
        inventory.expiryDate = expiryDate;
      } else {
        inventory = new BloodInventory({
          bloodBankId: req.userId,
          bloodType,
          units,
          expiryDate,
          demand: "Low",
        });
      }

      // Update demand level
      inventory.demand =
        inventory.units < 10 ? "Critical" :
        inventory.units < 20 ? "High" :
        inventory.units < 50 ? "Medium" : "Low";

      await inventory.save({ session });

      // --- 4. Call Blockchain ---
      const bloodBankWallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
      const contract = new ethers.Contract(
        process.env.CONTRACT_ADDRESS,
        BloodChainABI,
        bloodBankWallet
      );

      const tx = await contract.recordDonation(
        donor.walletAddress,
        bloodType,
        units,
        ipfsHash,
        42, // shelf life in days
        { gasLimit: 500000 }
      );

      receipt = await tx.wait();
      if (receipt.status !== 1) {
        throw new Error("Blockchain transaction failed");
      }

      // --- 5. Save transaction ---
      transaction = new Transaction({
        type: "Donation",
        donorId,
        bloodBankId: req.userId,
        bloodType,
        quantity: units,
        status: "Confirmed",
        txHash: receipt.transactionHash,
        blockchainId: receipt.transactionHash,
        ipfsHash,
        unitId: null, // will be filled by event listener or contract call
      });
      await transaction.save({ session });

      // --- 6. Emit real-time event (optional) ---
      // io.to(`bloodbank_${req.userId}`).emit("donationRecorded", { transaction });
    });

    // --- Success Response ---
    res.status(200).json({
      message: "Donation recorded successfully on blockchain and database",
      data: {
        transactionId: transaction._id,
        txHash: receipt.transactionHash,
        unitId: transaction.unitId,
        donor: {
          name: `${donor.firstName} ${donor.lastName}`,
          wallet: donor.walletAddress,
          newPoints: donor.donorInfo.rewards.points,
          newBadges: donor.donorInfo.rewards.badges,
        },
        inventory: {
          bloodType,
          units: inventory.units,
          demand: inventory.demand,
        },
      },
    });
  } catch (error) {
    console.error("Record donation error:", error.message);
    res.status(500).json({
      error: "Failed to record donation",
      details: error.message,
    });
  } finally {
    session.endSession();
  }
});

// Hospital Routes - Existing
app.post("/api/hospital/request-blood", authMiddleware, async (req, res) => {
  const { bloodBankId, bloodType, quantity } = req.body;
  if (!bloodBankId || !bloodType || !quantity) {
    return res
      .status(400)
      .json({ error: "Blood bank ID, blood type, and quantity are required" });
  }
  if (!["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].includes(bloodType)) {
    return res.status(400).json({ error: "Invalid blood type" });
  }
  if (!Number.isInteger(quantity) || quantity < 1) {
    return res
      .status(400)
      .json({ error: "Quantity must be a positive integer" });
  }
  try {
    if (req.userRole !== "Hospital") {
      return res.status(403).json({ error: "Access denied" });
    }
    const bloodBank = await User.findById(bloodBankId);
    if (!bloodBank || bloodBank.role !== "BloodBank") {
      return res.status(400).json({ error: "Invalid blood bank" });
    }
    const request = new Request({
      hospitalId: req.userId,
      bloodBankId,
      bloodType,
      quantity,
      status: "Pending",
    });
    await request.save();
    res.status(200).json({ request });
  } catch (error) {
    console.error("Request blood error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

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
      const donorsTotal = campaigns.reduce((sum, c) => sum + c.donors, 0);
      const completed = campaigns.filter(
        (c) => c.status === "completed"
      ).length;
      const verified = campaigns.filter((c) => c.verified).length;
      res.status(200).json({
        active,
        required,
        received,
        donors: donorsTotal,
        completed,
        verified,
      });
    } catch (error) {
      console.error("Get stats error:", error);
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
      // Key metrics - computed or mock
      const totalDonors = campaigns.reduce((sum, c) => sum + c.donors, 0);
      const avgResponse = "2.3h"; // mock
      const successRate =
        campaigns.length > 0
          ? Math.round(
              (campaigns.filter((c) => c.status === "completed").length /
                campaigns.length) *
                100
            ) + "%"
          : "0%";
      const activeNow = campaigns.filter((c) => c.status === "active").length;

      // Blood type distribution - aggregate commitments
      const distribution = await Commitment.aggregate([
        { $match: { campaignId: { $in: campaigns.map((c) => c._id) } } },
        {
          $group: {
            _id: "$bloodType",
            units: { $sum: "$units" },
            percent: { $sum: 1 },
          },
        },
        {
          $project: {
            type: "$_id",
            units: 1,
            percent: {
              $round: [
                {
                  $multiply: [
                    { $divide: ["$percent", { $sum: "$percent" }] },
                    100,
                  ],
                },
                0,
              ],
            },
          },
        },
      ]);
      // Fill with defaults if empty
      const bloodDist = [
        {
          type: "O+",
          units: distribution.find((d) => d.type === "O+")?.units || 96,
          percent: distribution.find((d) => d.type === "O+")?.percent || 35,
        },
        {
          type: "A+",
          units: distribution.find((d) => d.type === "A+")?.units || 77,
          percent: distribution.find((d) => d.type === "A+")?.percent || 28,
        },
        {
          type: "B+",
          units: distribution.find((d) => d.type === "B+")?.units || 55,
          percent: distribution.find((d) => d.type === "B+")?.percent || 20,
        },
        {
          type: "AB+",
          units: distribution.find((d) => d.type === "AB+")?.units || 47,
          percent: distribution.find((d) => d.type === "AB+")?.percent || 17,
        },
      ];

      res.status(200).json({
        campaignsProgress: campaigns.map((c) => ({
          ...c.toObject(),
          progress: Math.round((c.unitsReceived / c.unitsNeeded) * 100),
        })),
        keyMetrics: [
          {
            label: "Total Donors",
            value: totalDonors.toString(),
            trend: "+15%",
            color: "from-blue-500 to-cyan-600",
          },
          {
            label: "Avg Response",
            value: avgResponse,
            trend: "Fast",
            color: "from-purple-500 to-pink-600",
          },
          {
            label: "Success Rate",
            value: successRate,
            trend: "High",
            color: "from-green-500 to-emerald-600",
          },
          {
            label: "Active Now",
            value: activeNow.toString(),
            trend: "Live",
            color: "from-orange-500 to-red-600",
          },
        ],
        bloodDistribution: bloodDist,
      });
    } catch (error) {
      console.error("Get analytics error:", error);
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
  if (!requestId || !["Approved", "Rejected"].includes(action)) {
    return res
      .status(400)
      .json({ error: "Request ID and valid action are required" });
  }
  try {
    if (req.userRole !== "BloodBank") {
      return res.status(403).json({ error: "Access denied" });
    }
    const request = await Request.findById(requestId);
    if (!request || request.bloodBankId.toString() !== req.userId) {
      return res.status(400).json({ error: "Invalid request" });
    }
    if (request.status !== "Pending") {
      return res.status(400).json({ error: "Request already processed" });
    }
    request.status = action;
    if (action === "Approved") {
      const inventory = await BloodInventory.findOne({
        bloodBankId: req.userId,
        bloodType: request.bloodType,
      });
      if (!inventory || inventory.units < request.quantity) {
        return res.status(400).json({ error: "Insufficient inventory" });
      }
      inventory.units -= request.quantity;
      inventory.demand =
        inventory.units < 10
          ? "Critical"
          : inventory.units < 20
          ? "High"
          : inventory.units < 50
          ? "Medium"
          : "Low";
      await inventory.save();
      const transaction = new Transaction({
        type: "Transfer",
        hospitalId: request.hospitalId,
        bloodBankId: req.userId,
        bloodType: request.bloodType,
        quantity: request.quantity,
        status: "In Transit",
        txHash: `0x${crypto.randomBytes(32).toString("hex")}`,
      });
      await transaction.save();
    }
    await request.save();
    res
      .status(200)
      .json({ message: `Request ${action.toLowerCase()} successfully` });
  } catch (error) {
    console.error("Request action error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
