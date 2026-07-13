import { format, differenceInDays, parseISO } from "date-fns";

export const formatDate = (date) => format(new Date(date), "MMM d, yyyy");
export const formatDateShort = (date) => format(new Date(date), "MMM d");
export const getNights = (checkIn, checkOut) => Math.max(1, differenceInDays(new Date(checkOut), new Date(checkIn)));
export const formatPrice = (price) => `₹${Number(price).toLocaleString("en-IN")}`;

export const calculatePricing = (pricePerNight, nights, cleaningFee = 0) => {
  const subtotal = pricePerNight * nights;
  const serviceFee = Math.round(subtotal * 0.14);
  const taxes = Math.round((subtotal + cleaningFee + serviceFee) * 0.18);
  const totalPrice = subtotal + cleaningFee + serviceFee + taxes;
  return { pricePerNight, nights, subtotal, cleaningFee, serviceFee, taxes, totalPrice };
};

export const truncate = (str, n) => str?.length > n ? str.slice(0, n) + "..." : str;

export const getInitials = (name) => name?.split(" ").map(w => w[0]).join("").toUpperCase().slice(0,2) || "?";

export const AMENITY_ICONS = {
  "WiFi": "📶", "Air conditioning": "❄️", "Heating": "🔥", "Kitchen": "🍳",
  "Washer": "🫧", "Dryer": "👕", "Free parking": "🚗", "Pool": "🏊",
  "Hot tub": "♨️", "Gym": "💪", "BBQ grill": "🔥", "Beachfront": "🏖️",
  "Breakfast": "🍳", "Pet friendly": "🐾", "TV": "📺", "Workspace": "💻",
};

export const PROPERTY_TYPES = ["apartment","house","villa","cabin","loft","studio","resort","cottage","hotel"];
export const AMENITIES_LIST = Object.keys(AMENITY_ICONS);
