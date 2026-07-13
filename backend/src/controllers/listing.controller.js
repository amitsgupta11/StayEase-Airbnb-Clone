import Listing from "../models/Listing.model.js";
import { uploadToCloudinary, deleteFromCloudinary, deleteMultipleFromCloudinary } from "../utils/cloudinary.utils.js";
import { sendSuccess, AppError } from "../utils/response.utils.js";

export const getAllListings = async (req, res, next) => {
  try {
    const { city, country, propertyType, minPrice, maxPrice, bedrooms, bathrooms,
            guests, amenities, sortBy="createdAt", order="desc", page=1, limit=12, search } = req.query;

    const filter = { isActive: true };
    if (city) filter["location.city"] = { $regex: city, $options:"i" };
    if (country) filter["location.country"] = { $regex: country, $options:"i" };
    if (propertyType) filter.propertyType = propertyType;
    if (minPrice || maxPrice) {
      filter.pricePerNight = {};
      if (minPrice) filter.pricePerNight.$gte = Number(minPrice);
      if (maxPrice) filter.pricePerNight.$lte = Number(maxPrice);
    }
    if (bedrooms) filter.bedrooms = { $gte: Number(bedrooms) };
    if (bathrooms) filter.bathrooms = { $gte: Number(bathrooms) };
    if (guests) filter.maxGuests = { $gte: Number(guests) };
    if (amenities) filter.amenities = { $all: amenities.split(",") };
    if (search) filter.$text = { $search: search };

    const sort = {};
    if (sortBy==="price") sort.pricePerNight = order==="asc"?1:-1;
    else if (sortBy==="rating") sort.avgRating = order==="asc"?1:-1;
    else sort.createdAt = order==="asc"?1:-1;

    const skip = (Number(page)-1) * Number(limit);
    const [listings, total] = await Promise.all([
      Listing.find(filter).populate("host","name avatar").sort(sort).skip(skip).limit(Number(limit)).lean(),
      Listing.countDocuments(filter),
    ]);

    sendSuccess(res, { data:{ listings }, pagination:{ page:Number(page), limit:Number(limit), total, pages:Math.ceil(total/Number(limit)) } });
  } catch(e) { next(e); }
};

export const getListingById = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id).populate("host","name avatar bio createdAt");
    if (!listing || !listing.isActive) return next(new AppError("Listing not found.", 404));
    sendSuccess(res, { data:{ listing } });
  } catch(e) { next(e); }
};

export const createListing = async (req, res, next) => {
  try {
    const { title,description,propertyType,pricePerNight,cleaningFee,maxGuests,bedrooms,beds,bathrooms,amenities,location } = req.body;
    let images = [];
    if (req.files?.length) {
      images = await Promise.all(req.files.map(f => uploadToCloudinary(f.buffer)));
    }
    const listing = await Listing.create({
      host: req.user._id, title, description, propertyType,
      pricePerNight:Number(pricePerNight), cleaningFee:Number(cleaningFee)||0,
      maxGuests:Number(maxGuests), bedrooms:Number(bedrooms), beds:Number(beds), bathrooms:Number(bathrooms),
      amenities: typeof amenities==="string"?JSON.parse(amenities):(amenities||[]),
      location: typeof location==="string"?JSON.parse(location):location, images,
    });
    if (req.user.role === "user") await req.user.updateOne({ role:"host" });
    sendSuccess(res, { statusCode:201, message:"Listing created.", data:{ listing } });
  } catch(e) { next(e); }
};

export const updateListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) return next(new AppError("Listing not found.", 404));
    if (listing.host.toString() !== req.user._id.toString()) return next(new AppError("Access denied.", 403));
    const updates = { ...req.body };
    if (typeof updates.amenities==="string") updates.amenities = JSON.parse(updates.amenities);
    if (typeof updates.location==="string") updates.location = JSON.parse(updates.location);
    const updated = await Listing.findByIdAndUpdate(req.params.id, { $set:updates }, { new:true, runValidators:true });
    sendSuccess(res, { message:"Listing updated.", data:{ listing:updated } });
  } catch(e) { next(e); }
};

export const deleteListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) return next(new AppError("Listing not found.", 404));
    if (listing.host.toString() !== req.user._id.toString() && req.user.role !== "admin")
      return next(new AppError("Access denied.", 403));
    await deleteMultipleFromCloudinary(listing.images.map(i => i.public_id));
    await Listing.findByIdAndDelete(req.params.id);
    sendSuccess(res, { message:"Listing deleted." });
  } catch(e) { next(e); }
};

export const addListingImages = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) return next(new AppError("Not found.", 404));
    if (listing.host.toString() !== req.user._id.toString()) return next(new AppError("Access denied.", 403));
    if (!req.files?.length) return next(new AppError("No images.", 400));
    const newImgs = await Promise.all(req.files.map(f => uploadToCloudinary(f.buffer)));
    listing.images.push(...newImgs);
    await listing.save();
    sendSuccess(res, { message:"Images added.", data:{ images:listing.images } });
  } catch(e) { next(e); }
};

export const deleteListingImage = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) return next(new AppError("Not found.", 404));
    if (listing.host.toString() !== req.user._id.toString()) return next(new AppError("Access denied.", 403));
    const img = listing.images.id(req.params.imageId);
    if (!img) return next(new AppError("Image not found.", 404));
    await deleteFromCloudinary(img.public_id);
    listing.images.pull(req.params.imageId);
    await listing.save();
    sendSuccess(res, { message:"Image deleted.", data:{ images:listing.images } });
  } catch(e) { next(e); }
};

export const getHostListings = async (req, res, next) => {
  try {
    const listings = await Listing.find({ host:req.user._id }).sort({ createdAt:-1 });
    sendSuccess(res, { data:{ listings } });
  } catch(e) { next(e); }
};
