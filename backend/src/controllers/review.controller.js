import Review from "../models/Review.model.js";
import Booking from "../models/Booking.model.js";
import { sendSuccess, AppError } from "../utils/response.utils.js";

export const createReview = async (req, res, next) => {
  try {
    const { listingId, bookingId, rating, comment, categories } = req.body;
    const booking = await Booking.findOne({ _id:bookingId, guest:req.user._id, listing:listingId, status:"completed" });
    if (!booking) return next(new AppError("You can only review completed stays.", 403));
    const exists = await Review.findOne({ listing:listingId, author:req.user._id });
    if (exists) return next(new AppError("You already reviewed this listing.", 400));
    const review = await Review.create({ listing:listingId, author:req.user._id, booking:bookingId, rating, comment, categories });
    await review.populate("author","name avatar");
    sendSuccess(res, { statusCode:201, message:"Review submitted.", data:{ review } });
  } catch(e) { next(e); }
};

export const getListingReviews = async (req, res, next) => {
  try {
    const { page=1, limit=10 } = req.query;
    const skip = (Number(page)-1)*Number(limit);
    const [reviews, total] = await Promise.all([
      Review.find({ listing:req.params.listingId }).populate("author","name avatar").sort({ createdAt:-1 }).skip(skip).limit(Number(limit)),
      Review.countDocuments({ listing:req.params.listingId }),
    ]);
    sendSuccess(res, { data:{ reviews }, pagination:{ page:Number(page), limit:Number(limit), total, pages:Math.ceil(total/Number(limit)) } });
  } catch(e) { next(e); }
};

export const updateReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return next(new AppError("Review not found.", 404));
    if (review.author.toString()!==req.user._id.toString()) return next(new AppError("Access denied.", 403));
    const { rating, comment, categories } = req.body;
    if (rating) review.rating = rating;
    if (comment) review.comment = comment;
    if (categories) review.categories = categories;
    await review.save();
    sendSuccess(res, { message:"Review updated.", data:{ review } });
  } catch(e) { next(e); }
};

export const deleteReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return next(new AppError("Review not found.", 404));
    if (review.author.toString()!==req.user._id.toString() && req.user.role!=="admin")
      return next(new AppError("Access denied.", 403));
    await review.deleteOne();
    sendSuccess(res, { message:"Review deleted." });
  } catch(e) { next(e); }
};
