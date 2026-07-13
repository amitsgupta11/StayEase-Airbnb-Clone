import { verifyAccessToken } from "../utils/jwt.utils.js";
import { AppError } from "../utils/response.utils.js";
import User from "../models/User.model.js";

export const protect = async (req, res, next) => {
  try {
    let token;
    if (req.headers.authorization?.startsWith("Bearer "))
      token = req.headers.authorization.split(" ")[1];
    if (!token) return next(new AppError("Authentication required.", 401));
    const decoded = verifyAccessToken(token);
    const user = await User.findById(decoded.id);
    if (!user) return next(new AppError("User no longer exists.", 401));
    req.user = user;
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") return next(new AppError("Token expired.", 401));
    if (err.name === "JsonWebTokenError") return next(new AppError("Invalid token.", 401));
    next(err);
  }
};

export const restrictTo = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role))
    return next(new AppError(`Access denied. Required: ${roles.join(" or ")}`, 403));
  next();
};

export const optionalAuth = async (req, res, next) => {
  try {
    let token;
    if (req.headers.authorization?.startsWith("Bearer "))
      token = req.headers.authorization.split(" ")[1];
    if (token) {
      const decoded = verifyAccessToken(token);
      const user = await User.findById(decoded.id);
      if (user) req.user = user;
    }
    next();
  } catch { next(); }
};
