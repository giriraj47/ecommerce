const jwt = require("jsonwebtoken");
const blacklistModel = require("../models/blacklist.model");

async function authUser(req, res, next) {
  // 1. Check if user is authenticated via Passport (Google OAuth)
  if (req.isAuthenticated && req.isAuthenticated()) {
    return next();
  }

  // 2. Check if user is authenticated via JWT (Email/Password)
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({
      message: "Unauthorized: No token or session found",
    });
  }

  const isTokenBlacklisted = await blacklistModel.findOne({ token });

  if (isTokenBlacklisted) {
    return res.status(401).json({
      message: "Token is blacklisted",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decoded);

    req.user = decoded;

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid token",
      error: error.message,
    });
  }
}

module.exports = { authUser };
