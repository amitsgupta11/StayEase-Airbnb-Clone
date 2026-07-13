import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
  listing: { type: mongoose.Schema.Types.ObjectId, ref:"Listing", required: true },
  author:  { type: mongoose.Schema.Types.ObjectId, ref:"User", required: true },
  booking: { type: mongoose.Schema.Types.ObjectId, ref:"Booking", required: true },
  rating:  { type: Number, required: true, min:1, max:5 },
  comment: { type: String, required: true, minlength:10, maxlength:1000, trim: true },
  categories: {
    cleanliness:   { type: Number, min:1, max:5 },
    accuracy:      { type: Number, min:1, max:5 },
    communication: { type: Number, min:1, max:5 },
    location:      { type: Number, min:1, max:5 },
    checkIn:       { type: Number, min:1, max:5 },
    value:         { type: Number, min:1, max:5 },
  },
}, { timestamps: true });

reviewSchema.index({ listing:1, author:1 }, { unique: true });

reviewSchema.post("save", async function() { await updateRating(this.listing); });
reviewSchema.post("deleteOne", { document:true }, async function() { await updateRating(this.listing); });

async function updateRating(listingId) {
  const Review = mongoose.model("Review");
  const Listing = mongoose.model("Listing");
  const stats = await Review.aggregate([
    { $match: { listing: listingId } },
    { $group: { _id:"$listing", avgRating:{ $avg:"$rating" }, reviewCount:{ $sum:1 } } },
  ]);
  if (stats.length > 0) {
    await Listing.findByIdAndUpdate(listingId, {
      avgRating: Math.round(stats[0].avgRating * 10) / 10,
      reviewCount: stats[0].reviewCount,
    });
  } else {
    await Listing.findByIdAndUpdate(listingId, { avgRating:0, reviewCount:0 });
  }
}

export default mongoose.model("Review", reviewSchema);
