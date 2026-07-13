import User from "../models/User.model.js";
import Booking from "../models/Booking.model.js";
import { sendSuccess, AppError } from "../utils/response.utils.js";
import { uploadAvatar, deleteFromCloudinary } from "../utils/cloudinary.utils.js";

export const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    sendSuccess(res, { data:{ user } });
  } catch(e) { next(e); }
};

export const updateProfile = async (req, res, next) => {
  try {
    const { name, phone, bio } = req.body;
    const user = await User.findByIdAndUpdate(req.user._id, { name, phone, bio }, { new:true, runValidators:true });
    sendSuccess(res, { message:"Profile updated.", data:{ user } });
  } catch(e) { next(e); }
};

export const uploadProfileImage = async (req, res, next) => {
  try {
    if (!req.file) return next(new AppError("No image uploaded.", 400));
    const user = await User.findById(req.user._id);
    if (user.avatar?.public_id) await deleteFromCloudinary(user.avatar.public_id);
    const result = await uploadAvatar(req.file.buffer);
    user.avatar = result;
    await user.save({ validateBeforeSave: false });
    sendSuccess(res, { message:"Avatar updated.", data:{ avatar: result } });
  } catch(e) { next(e); }
};

export const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id).select("+password");
    if (!(await user.comparePassword(currentPassword)))
      return next(new AppError("Current password is incorrect.", 400));
    user.password = newPassword;
    await user.save();
    sendSuccess(res, { message:"Password changed successfully." });
  } catch(e) { next(e); }
};

export const getUserBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ guest: req.user._id })
      .populate("listing","title images location pricePerNight")
      .sort({ createdAt:-1 });
    sendSuccess(res, { data:{ bookings } });
  } catch(e) { next(e); }
};

export const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select("name avatar bio createdAt");
    if (!user) return next(new AppError("User not found.", 404));
    sendSuccess(res, { data:{ user } });
  } catch(e) { next(e); }
};
