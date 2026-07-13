import mongoose from "mongoose";

const listingSchema = new mongoose.Schema({
  host: { type: mongoose.Schema.Types.ObjectId, ref:"User", required: true },
  title: { type: String, required: true, trim: true, minlength:10, maxlength:100 },
  description: { type: String, required: true, minlength:20, maxlength:2000 },
  propertyType: { type: String, required: true,
    enum:["apartment","house","villa","cabin","loft","studio","resort","cottage","hotel"] },
  images: [{ url:{ type:String, required:true }, public_id:{ type:String, required:true } }],
  pricePerNight: { type: Number, required: true, min: 1 },
  cleaningFee:   { type: Number, default: 0, min: 0 },
  maxGuests:     { type: Number, required: true, min: 1 },
  bedrooms:      { type: Number, required: true, min: 0 },
  beds:          { type: Number, required: true, min: 1 },
  bathrooms:     { type: Number, required: true, min: 0 },
  amenities: [{ type: String }],
  location: {
    address: { type: String, default: "" },
    city:    { type: String, required: true, trim: true },
    state:   { type: String, default: "" },
    country: { type: String, required: true, trim: true },
    zipCode: { type: String, default: "" },
    coordinates: { lat:{ type:Number, default:0 }, lng:{ type:Number, default:0 } },
  },
  avgRating:   { type: Number, default: 0, min: 0, max: 5 },
  reviewCount: { type: Number, default: 0 },
  isActive:    { type: Boolean, default: true },
}, { timestamps: true, toJSON:{ virtuals:true }, toObject:{ virtuals:true } });

listingSchema.index({ "location.city":1 });
listingSchema.index({ "location.country":1 });
listingSchema.index({ pricePerNight:1 });
listingSchema.index({ propertyType:1 });
listingSchema.index({ isActive:1, host:1 });
listingSchema.index({ title:"text", description:"text", "location.city":"text" });

export default mongoose.model("Listing", listingSchema);
