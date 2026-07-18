import Booking from "../models/Booking.model.js";
import Listing from "../models/Listing.model.js";
import { sendSuccess, AppError } from "../utils/response.utils.js";
import { sendBookingConfirmationEmail } from "../utils/email.utils.js";

// Helper — calculate nights between 2 dates
const differenceInDays = (dateA, dateB) => {
  const ms = Math.abs(new Date(dateA) - new Date(dateB));
  return Math.ceil(ms / (1000 * 60 * 60 * 24));
};

// ─── CREATE BOOKING ───────────────────────────────────────────────────────────
export const createBooking = async (req, res, next) => {
  try {
    const { listingId, checkIn, checkOut, guests, specialRequests } = req.body;

    // Get listing
    const listing = await Listing.findById(listingId).populate("host", "_id name");
    if (!listing || !listing.isActive) {
      return next(new AppError("Listing not found.", 404));
    }

    const checkInDate  = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    // Validate dates
    if (checkOutDate <= checkInDate) {
      return next(new AppError("Check-out must be after check-in.", 400));
    }

    // Validate guests
    const totalGuests = (guests?.adults || 1) + (guests?.children || 0);
    if (totalGuests > listing.maxGuests) {
      return next(new AppError(`Max ${listing.maxGuests} guests allowed.`, 400));
    }

    // Calculate pricing
    const nights     = differenceInDays(checkOutDate, checkInDate);
    const subtotal   = listing.pricePerNight * nights;
    const cleaningFee= listing.cleaningFee || 0;
    const serviceFee = Math.round(subtotal * 0.14);
    const taxes      = Math.round((subtotal + cleaningFee + serviceFee) * 0.18);
    const totalPrice = subtotal + cleaningFee + serviceFee + taxes;

    // Create booking
    const booking = await Booking.create({
      listing:  listingId,
      guest:    req.user._id,
      host:     listing.host._id,
      checkIn:  checkInDate,
      checkOut: checkOutDate,
      guests:   guests || { adults: 1, children: 0, infants: 0 },
      pricing: {
        pricePerNight: listing.pricePerNight,
        nights,
        subtotal,
        cleaningFee,
        serviceFee,
        taxes,
        totalPrice,
      },
      status: "confirmed",
      specialRequests: specialRequests || "",
    });

    // Send confirmation email (don't fail if email fails)
    try {
      await sendBookingConfirmationEmail(req.user.email, req.user.name, booking);
    } catch (e) {
      console.log("Booking email skipped:", e.message);
    }

    sendSuccess(res, {
      statusCode: 201,
      message: "Booking confirmed! 🎉",
      data: { booking },
    });
  } catch (error) {
    next(error);
  }
};

// ─── GET BOOKING BY ID ────────────────────────────────────────────────────────
export const getBookingById = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate("listing", "title images location pricePerNight")
      .populate("guest",   "name email avatar")
      .populate("host",    "name email avatar");

    if (!booking) return next(new AppError("Booking not found.", 404));

    const isGuest = booking.guest._id.toString() === req.user._id.toString();
    const isHost  = booking.host._id.toString()  === req.user._id.toString();
    if (!isGuest && !isHost && req.user.role !== "admin") {
      return next(new AppError("Access denied.", 403));
    }

    sendSuccess(res, { data: { booking } });
  } catch (error) {
    next(error);
  }
};

// ─── CANCEL BOOKING ───────────────────────────────────────────────────────────
export const cancelBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return next(new AppError("Booking not found.", 404));

    if (
      booking.guest.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return next(new AppError("Access denied.", 403));
    }

    if (booking.status === "cancelled") {
      return next(new AppError("Already cancelled.", 400));
    }
    if (booking.status === "completed") {
      return next(new AppError("Cannot cancel completed booking.", 400));
    }

    booking.status             = "cancelled";
    booking.cancelledBy        = req.user._id;
    booking.cancellationReason = req.body.reason || "Cancelled by guest";
    booking.cancelledAt        = new Date();
    await booking.save();

    sendSuccess(res, { message: "Booking cancelled.", data: { booking } });
  } catch (error) {
    next(error);
  }
};

// ─── GET HOST BOOKINGS ────────────────────────────────────────────────────────
export const getHostBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ host: req.user._id })
      .populate("listing", "title images location")
      .populate("guest",   "name email avatar")
      .sort({ createdAt: -1 });

    sendSuccess(res, { data: { bookings } });
  } catch (error) {
    next(error);
  }
};

// ─── UPDATE BOOKING STATUS ────────────────────────────────────────────────────
export const updateBookingStatus = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return next(new AppError("Booking not found.", 404));

    if (
      booking.host.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return next(new AppError("Access denied.", 403));
    }

    const { status } = req.body;
    if (!["confirmed", "cancelled", "completed"].includes(status)) {
      return next(new AppError("Invalid status.", 400));
    }

    booking.status = status;
    await booking.save();

    sendSuccess(res, { message: `Booking ${status}.`, data: { booking } });
  } catch (error) {
    next(error);
  }
};
