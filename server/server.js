const express = require("express");
const mongoose = require("mongoose");
const nodemailer = require("nodemailer");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");
const crypto = require("crypto");

dotenv.config();

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
// app.use(express.static(path.join(__dirname, 'client', 'dist')));

// MongoDB Connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
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
    enum: ["Donor", "Hospital", "BloodBank"],
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
    enum: ["Confirmed", "In Transit", "Used"],
    default: "Confirmed",
  },
  timestamp: { type: Date, default: Date.now },
  txHash: { type: String },
});

const User = mongoose.model("User", userSchema);
const BloodInventory = mongoose.model("BloodInventory", bloodInventorySchema);
const Request = mongoose.model("Request", requestSchema);
const Transaction = mongoose.model("Transaction", transactionSchema);

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
    next();
  } catch (error) {
    return res.status(401).json({ error: "Invalid token" });
  }
};

// API Routes

// Step 1: Initiate Signup
app.post("/api/auth/signup", async (req, res) => {
  const { firstName, lastName, email, role } = req.body;
  if (!email || !role) {
    return res.status(400).json({ error: "Email and role are required" });
  }
  if (!["Donor", "Hospital", "BloodBank"].includes(role)) {
    return res.status(400).json({ error: "Invalid role" });
  }
  if (role === "Donor" && (!firstName || !lastName)) {
    return res
      .status(400)
      .json({ error: "First name and last name are required for donors" });
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
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000);
    const user = new User({
      firstName: role === "Donor" ? firstName : undefined,
      lastName: role === "Donor" ? lastName : undefined,
      email,
      role,
      otp,
      otpExpires,
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

// Blood Bank Routes
app.get("/api/bloodbank/donors", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (user.role !== "BloodBank") {
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
    const user = await User.findById(req.userId);
    if (user.role !== "BloodBank") {
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
    const user = await User.findById(req.userId);
    if (user.role !== "BloodBank") {
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

// Hospital Routes
app.get("/api/hospital/requests", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (user.role !== "Hospital") {
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
    const user = await User.findById(req.userId);
    if (user.role !== "Hospital") {
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
    const user = await User.findById(req.userId);
    if (user.role !== "Hospital") {
      return res.status(403).json({ error: "Access denied" });
    }
    const transactions = await Transaction.find({ hospitalId: req.userId });
    res.status(200).json({ transactions });
  } catch (error) {
    console.error("Get transactions error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

app.post("/api/hospital/request-blood", authMiddleware, async (req, res) => {
  const { bloodType, quantity } = req.body;
  if (!bloodType || !quantity) {
    return res
      .status(400)
      .json({ error: "Blood type and quantity are required" });
  }
  try {
    const user = await User.findById(req.userId);
    if (user.role !== "Hospital") {
      return res.status(403).json({ error: "Access denied" });
    }
    const request = new Request({
      hospitalId: req.userId,
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

// Donor Routes
app.get("/api/donor/history", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (user.role !== "Donor") {
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
    const user = await User.findById(req.userId);
    if (user.role !== "Donor") {
      return res.status(403).json({ error: "Access denied" });
    }
    res.status(200).json({ rewards: user.donorInfo.rewards });
  } catch (error) {
    console.error("Get rewards error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Reward Routes
app.post("/api/rewards/issue", authMiddleware, async (req, res) => {
  const { recipientId, points } = req.body;
  if (!recipientId || !points) {
    return res
      .status(400)
      .json({ error: "Recipient ID and points are required" });
  }
  try {
    const user = await User.findById(req.userId);
    if (!["Hospital", "BloodBank"].includes(user.role)) {
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

// Serve Frontend
// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
// });

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
