import { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useListings } from "../../hooks/useListings.js";
import { bookingService } from "../../services/booking.service.js";
import LoadingPage from "../../components/ui/LoadingPage.jsx";
import { formatPrice, formatDate, calculatePricing, getNights } from "../../utils/helpers.js";

export default function BookingPage() {
  const { listingId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { currentListing, loading, fetchListingById } = useListings();
  const [submitting, setSubmitting] = useState(false);
  const [specialRequests, setSpecialRequests] = useState("");

  const { checkIn, checkOut, guests } = location.state || {};

  useEffect(() => {
    if (!checkIn || !checkOut) { navigate(`/listings/${listingId}`); return; }
    fetchListingById(listingId);
  }, [listingId]);

  if (loading || !currentListing) return <LoadingPage/>;

  const nights = getNights(checkIn, checkOut);
  const pricing = calculatePricing(currentListing.pricePerNight, nights, currentListing.cleaningFee);

  const handleConfirm = async () => {
    setSubmitting(true);
    try {
      const { data } = await bookingService.create({
        listingId, checkIn, checkOut,
        guests: { adults: guests || 1, children: 0, infants: 0 },
        specialRequests,
      });
      toast.success("Booking confirmed! 🎉");
      navigate(`/booking/${data.data.booking._id}`);
    } catch (e) {
      toast.error(e.response?.data?.message || "Booking failed");
    } finally { setSubmitting(false); }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold dark:text-white mb-8">Confirm and pay</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <div className="card p-5 mb-6">
            <div className="flex gap-4">
              <img src={currentListing.images?.[0]?.url} alt="" className="w-20 h-20 rounded-xl object-cover bg-gray-100"/>
              <div>
                <p className="font-semibold text-sm dark:text-white">{currentListing.title}</p>
                <p className="text-xs text-gray-400">{currentListing.location?.city}, {currentListing.location?.country}</p>
              </div>
            </div>
          </div>

          <h3 className="font-semibold dark:text-white mb-3">Your trip</h3>
          <div className="space-y-2 text-sm dark:text-gray-300 mb-6">
            <div className="flex justify-between"><span>Dates</span><span>{formatDate(checkIn)} – {formatDate(checkOut)}</span></div>
            <div className="flex justify-between"><span>Guests</span><span>{guests} guest{guests>1?"s":""}</span></div>
          </div>

          <h3 className="font-semibold dark:text-white mb-2">Special requests</h3>
          <textarea className="input-field" rows={3} placeholder="Any special requirements?"
            value={specialRequests} onChange={e => setSpecialRequests(e.target.value)} maxLength={500}/>
        </div>

        <div>
          <div className="card p-6">
            <h3 className="font-semibold dark:text-white mb-4">Price details</h3>
            <div className="space-y-2 text-sm dark:text-gray-300">
              <div className="flex justify-between"><span>{formatPrice(currentListing.pricePerNight)} × {nights} nights</span><span>{formatPrice(pricing.subtotal)}</span></div>
              {pricing.cleaningFee > 0 && <div className="flex justify-between"><span>Cleaning fee</span><span>{formatPrice(pricing.cleaningFee)}</span></div>}
              <div className="flex justify-between"><span>Service fee</span><span>{formatPrice(pricing.serviceFee)}</span></div>
              <div className="flex justify-between"><span>Taxes (18% GST)</span><span>{formatPrice(pricing.taxes)}</span></div>
              <div className="flex justify-between font-bold text-base pt-3 border-t border-gray-200 dark:border-gray-700">
                <span>Total (INR)</span><span>{formatPrice(pricing.totalPrice)}</span>
              </div>
            </div>
            <button onClick={handleConfirm} disabled={submitting} className="btn-primary w-full mt-6 disabled:opacity-60">
              {submitting ? "Confirming..." : "Confirm booking"}
            </button>
            <p className="text-xs text-gray-400 text-center mt-3">You won't be charged yet — this is a demo booking flow.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
