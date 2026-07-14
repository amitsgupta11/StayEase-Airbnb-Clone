import crypto from "crypto";
import User from "../models/User.model.js";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
  setRefreshTokenCookie,
  clearRefreshTokenCookie,
} from "../utils/jwt.utils.js";
import { sendSuccess, AppError } from "../utils/response.utils.js";
import { sendPasswordResetEmail } from "../utils/email.utils.js";

const safeUser = (u) => ({
  _id: u._id,
  name: u.name,
  email: u.email,
  role: u.role,
  avatar: u.avatar,
  isVerified: u.isVerified,
  phone: u.phone,
  bio: u.bio,
});

// ─── REGISTER ─────────────────────────────────────────────────────────────────
export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(new AppError("Email already registered.", 400));
    }

    // Create user — isVerified: true so email verification not needed
    const user = await User.create({
      name,
      email,
      password,
      isVerified: true, // Skip email verification for production
    });

    // Generate tokens
    const accessToken = generateAccessToken(user._id, user.role);
    const refreshToken = generateRefreshToken(user._id);

    // Save refresh token
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    // Set cookie
    setRefreshTokenCookie(res, refreshToken);

    // Return success — no email sending
    sendSuccess(res, {
      statusCode: 201,
      message: "Account created successfully!",
      data: { user: safeUser(user), accessToken },
    });
  } catch (error) {
    next(error);
  }
};

// ─── LOGIN ────────────────────────────────────────────────────────────────────
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select("+password");
    if (!user || !(await user.comparePassword(password))) {
      return next(new AppError("Invalid email or password.", 401));
    }

    const accessToken = generateAccessToken(user._id, user.role);
    const refreshToken = generateRefreshToken(user._id);
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    setRefreshTokenCookie(res, refreshToken);

    sendSuccess(res, {
      message: "Logged in successfully.",
      data: { user: safeUser(user), accessToken },
    });
  } catch (error) {
    next(error);
  }
};

// ─── LOGOUT ───────────────────────────────────────────────────────────────────
export const logout = async (req, res, next) => {
  try {
    await User.findByIdAndUpdate(req.user._id, { refreshToken: "" });
    clearRefreshTokenCookie(res);
    sendSuccess(res, { message: "Logged out successfully." });
  } catch (error) {
    next(error);
  }
};

// ─── REFRESH TOKEN ────────────────────────────────────────────────────────────
export const refreshToken = async (req, res, next) => {
  try {
    const token = req.cookies.refreshToken;
    if (!token) return next(new AppError("No refresh token.", 401));

    const decoded = verifyRefreshToken(token);
    const user = await User.findById(decoded.id).select("+refreshToken");
    if (!user || user.refreshToken !== token) {
      return next(new AppError("Invalid refresh token.", 401));
    }

    const newAccess = generateAccessToken(user._id, user.role);
    const newRefresh = generateRefreshToken(user._id);
    user.refreshToken = newRefresh;
    await user.save({ validateBeforeSave: false });
    setRefreshTokenCookie(res, newRefresh);

    sendSuccess(res, {
      message: "Token refreshed.",
      data: { accessToken: newAccess },
    });
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      clearRefreshTokenCookie(res);
      return next(new AppError("Session expired.", 401));
    }
    next(error);
  }
};

// ─── FORGOT PASSWORD ──────────────────────────────────────────────────────────
export const forgotPassword = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return sendSuccess(res, { message: "If that email exists, a reset link was sent." });
    }

    const token = crypto.randomBytes(32).toString("hex");
    user.resetPasswordToken = token;
    user.resetPasswordExpires = new Date(Date.now() + 10 * 60 * 1000);
    await user.save({ validateBeforeSave: false });

    try {
      await sendPasswordResetEmail(req.body.email, user.name, token);
    } catch (e) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
      await user.save({ validateBeforeSave: false });
      return next(new AppError("Failed to send reset email.", 500));
    }

    sendSuccess(res, { message: "Reset link sent to your email." });
  } catch (error) {
    next(error);
  }
};

// ─── RESET PASSWORD ───────────────────────────────────────────────────────────
export const resetPassword = async (req, res, next) => {
  try {
    const user = await User.findOne({
      resetPasswordToken: req.params.token,
      resetPasswordExpires: { $gt: Date.now() },
    });
    if (!user) return next(new AppError("Invalid or expired reset token.", 400));

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    user.refreshToken = "";
    await user.save();

    clearRefreshTokenCookie(res);
    sendSuccess(res, { message: "Password reset successfully. Please log in." });
  } catch (error) {
    next(error);
  }
};

// ─── VERIFY EMAIL ─────────────────────────────────────────────────────────────
export const verifyEmail = async (req, res, next) => {
  try {
    const user = await User.findOne({
      verifyToken: req.params.token,
      verifyTokenExpires: { $gt: Date.now() },
    }).select("+verifyToken +verifyTokenExpires");

    if (!user) return next(new AppError("Invalid or expired verification link.", 400));

    user.isVerified = true;
    user.verifyToken = undefined;
    user.verifyTokenExpires = undefined;
    await user.save({ validateBeforeSave: false });

    sendSuccess(res, { message: "Email verified successfully!" });
  } catch (error) {
    next(error);
  }
};