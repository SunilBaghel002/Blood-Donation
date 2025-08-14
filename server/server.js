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

// User Schema
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

const User = mongoose.model("User", userSchema);

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
  return crypto.randomBytes(3).toString("hex").toUpperCase(); // 6-digit OTP
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

// API Routes

// Step 1: Initiate Signup (Store details and send OTP)
app.post("/api/auth/signup", async (req, res) => {
  const { firstName, lastName, email, role } = req.body;

  // Validation
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
    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already registered" });
    }

    // Generate OTP
    const otp = generateOTP();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Create user with unverified status
    const user = new User({
      firstName: role === "Donor" ? firstName : undefined,
      lastName: role === "Donor" ? lastName : undefined,
      email,
      role,
      otp,
      otpExpires,
    });

    await user.save();

    // Send OTP email
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

// Step 3: Complete Signup (Set Password)
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

    // Hash password
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

    // Validate and update role-specific info
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

    // Generate JWT
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

    // Generate JWT
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

// Connect Wallet (Placeholder)
app.post("/api/auth/connect-wallet", async (req, res) => {
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

// Serve Frontend
// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
// });

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
