import User from "../models/User.model.js";
import Listing from "../models/Listing.model.js";
import Booking from "../models/Booking.model.js";
import Review from "../models/Review.model.js";
import { sendSuccess, AppError } from "../utils/response.utils.js";

export const getDashboard = async (req, res, next) => {
  try {
    const [totalUsers, totalListings, totalBookings, totalReviews,
           recentBookings, bookingStats] = await Promise.all([
      User.countDocuments(),
      Listing.countDocuments(),
      Booking.countDocuments(),
      Review.countDocuments(),
      Booking.find().populate("listing","title").populate("guest","name email").sort({ createdAt:-1 }).limit(5),
      Booking.aggregate([
        { $group:{ _id:"$status", count:{ $sum:1 }, revenue:{ $sum:"$pricing.totalPrice" } } }
      ]),
    ]);
    const revenue = bookingStats.reduce((acc, s) => acc + (s.revenue||0), 0);
    sendSuccess(res, { data:{ stats:{ totalUsers, totalListings, totalBookings, totalReviews, revenue }, recentBookings, bookingStats } });
  } catch(e) { next(e); }
};

export const getAllUsers = async (req, res, next) => {
  try {
    const { page=1, limit=20 } = req.query;
    const skip = (Number(page)-1)*Number(limit);
    const [users, total] = await Promise.all([
      User.find().sort({ createdAt:-1 }).skip(skip).limit(Number(limit)),
      User.countDocuments(),
    ]);
    sendSuccess(res, { data:{ users }, pagination:{ page:Number(page), limit:Number(limit), total, pages:Math.ceil(total/Number(limit)) } });
  } catch(e) { next(e); }
};

export const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return next(new AppError("User not found.", 404));
    if (user.role==="admin") return next(new AppError("Cannot delete admin.", 403));
    await User.findByIdAndDelete(req.params.id);
    sendSuccess(res, { message:"User deleted." });
  } catch(e) { next(e); }
};

export const updateUserRole = async (req, res, next) => {
  try {
    const { role } = req.body;
    if (!["user","host","admin"].includes(role)) return next(new AppError("Invalid role.", 400));
    const user = await User.findByIdAndUpdate(req.params.id, { role }, { new:true });
    if (!user) return next(new AppError("User not found.", 404));
    sendSuccess(res, { message:"Role updated.", data:{ user } });
  } catch(e) { next(e); }
};

export const getAllListingsAdmin = async (req, res, next) => {
  try {
    const { page=1, limit=20 } = req.query;
    const skip = (Number(page)-1)*Number(limit);
    const [listings, total] = await Promise.all([
      Listing.find().populate("host","name email").sort({ createdAt:-1 }).skip(skip).limit(Number(limit)),
      Listing.countDocuments(),
    ]);
    sendSuccess(res, { data:{ listings }, pagination:{ page:Number(page), limit:Number(limit), total, pages:Math.ceil(total/Number(limit)) } });
  } catch(e) { next(e); }
};

export const getAllBookingsAdmin = async (req, res, next) => {
  try {
    const bookings = await Booking.find().populate("listing","title").populate("guest","name email").sort({ createdAt:-1 }).limit(50);
    sendSuccess(res, { data:{ bookings } });
  } catch(e) { next(e); }
};
