import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  listing: { type: mongoose.Schema.Types.ObjectId, ref:"Listing", required: true },
  guest:   { type: mongoose.Schema.Types.ObjectId, ref:"User", required: true },
  host:    { type: mongoose.Schema.Types.ObjectId, ref:"User", required: true },
  checkIn:  { type: Date, required: true },
  checkOut: { type: Date, required: true },
  guests: {
    adults:   { type: Number, default: 1, min: 1 },
    children: { type: Number, default: 0, min: 0 },
    infants:  { type: Number, default: 0, min: 0 },
  },
  pricing: {
    pricePerNight: Number,
    nights:     Number,
    subtotal:   Number,
    cleaningFee:Number,
    serviceFee: Number,
    taxes:      Number,
    totalPrice: { type: Number, required: true },
  },
  status: { type: String, enum:["pending","confirmed","cancelled","completed"], default:"pending" },
  cancelledBy: { type: mongoose.Schema.Types.ObjectId, ref:"User" },
  cancellationReason: { type: String, default: "" },
  cancelledAt: Date,
  specialRequests: { type: String, default: "", maxlength: 500 },
}, { timestamps: true });

bookingSchema.pre("save", function(next) {
  if (this.checkOut <= this.checkIn) return next(new Error("Check-out must be after check-in"));
  next();
});
bookingSchema.index({ guest:1, status:1 });
bookingSchema.index({ listing:1, checkIn:1, checkOut:1 });
bookingSchema.index({ host:1, status:1 });

export default mongoose.model("Booking", bookingSchema);
