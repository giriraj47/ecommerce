const userModel = require("../models/user.model");
const blacklistModel = require("../models/blacklist.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const {
  sendRegistrationEmail,
  forgetPasswordEmail,
} = require("../services/email.service");

async function register(req, res) {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res
        .status(409)
        .json({ message: "User already exists with this email" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await userModel.create({
      name,
      email,
      password: hashedPassword,
    });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    res.status(201).json({
      message: "User created successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });

    await sendRegistrationEmail(email, name);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await userModel.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ message: "No user exists with this email" });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    res.status(200).json({
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

async function logout(req, res) {
  try {
    // 1. Clear JWT token (Email/Password Login)
    const token = req.cookies.token;
    if (token) {
      await blacklistModel.create({ token });
      res.clearCookie("token");
    }

    // 2. Clear Passport Session (Google OAuth)
    if (req.logout) {
      req.logout((err) => {
        if (err) return res.status(500).json({ message: "Logout error" });

        // Destroy the session on the server
        req.session.destroy((err) => {
          if (err)
            return res
              .status(500)
              .json({ message: "Session destruction error" });

          // Clear the session cookie
          res.clearCookie("connect.sid");
          return res.status(200).json({ message: "Logout successful" });
        });
      });
    } else {
      return res.status(200).json({ message: "Logout successful" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

async function getCurrentUser(req, res) {
  try {
    const userId = req.user.id;

    if (!userId) {
      return res.status(401).json({ message: "No user found" });
    }

    const user = await userModel.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "User fetched successfully",
      user,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

async function updateProfile(req, res) {
  try {
    const { name, password } = req.body;

    if (!name || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await userModel.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    if (name) user.name = name;
    if (password) user.password = hashedPassword;

    await user.save();

    res.status(200).json({
      message: "Profile updated successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

async function deleteUser(req, res) {
  try {
    const user = await userModel.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await user.deleteOne();

    return res.status(200).json({
      message: "User deleted successfully",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

async function forgetPassword(req, res) {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  const user = await userModel.findOne({ email });
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "15m",
  });

  await userModel.findByIdAndUpdate(user._id, {
    resetPasswordToken: token,
    resetPasswordExpires: Date.now() + 1000 * 60 * 15,
  });

  const link = `http://localhost:5173/reset-password?token=${token}`;

  await forgetPasswordEmail(email, user.name, link);

  return res.status(200).json({
    message: "Email sent successfully",
  });
}

async function resetPassword(req, res) {
  const { password, confirmPassword, token } = req.body;

  if (!token || !password || !confirmPassword) {
    return res.status(400).json({ message: "All fields are required" });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ message: "Passwords do not match" });
  }

  const user = await userModel.findOne({
    resetPasswordToken: token,
    resetPasswordExpires: { $gt: Date.now() },
  });

  if (!user) {
    return res.status(404).json({ message: "Token is invalid or expired" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await userModel.findByIdAndUpdate(user._id, {
    password: hashedPassword,
    resetPasswordToken: null,
    resetPasswordExpires: null,
  });

  return res.status(200).json({
    message: "Password reset successfully",
  });
}

module.exports = {
  register,
  login,
  logout,
  getCurrentUser,
  updateProfile,
  deleteUser,
  forgetPassword,
  resetPassword,
};
