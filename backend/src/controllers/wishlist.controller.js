import Wishlist from "../models/Wishlist.model.js";
import { sendSuccess, AppError } from "../utils/response.utils.js";

export const getWishlist = async (req, res, next) => {
  try {
    const wishlist = await Wishlist.findOne({ user:req.user._id }).populate("listings","title images location pricePerNight avgRating reviewCount");
    sendSuccess(res, { data:{ wishlist: wishlist || { listings:[] } } });
  } catch(e) { next(e); }
};

export const toggleWishlist = async (req, res, next) => {
  try {
    const { listingId } = req.body;
    let wishlist = await Wishlist.findOne({ user:req.user._id });
    if (!wishlist) wishlist = await Wishlist.create({ user:req.user._id, listings:[] });
    const idx = wishlist.listings.findIndex(id => id.toString()===listingId);
    let added;
    if (idx > -1) { wishlist.listings.splice(idx, 1); added = false; }
    else          { wishlist.listings.push(listingId); added = true; }
    await wishlist.save();
    sendSuccess(res, { message: added?"Added to wishlist.":"Removed from wishlist.", data:{ added } });
  } catch(e) { next(e); }
};
