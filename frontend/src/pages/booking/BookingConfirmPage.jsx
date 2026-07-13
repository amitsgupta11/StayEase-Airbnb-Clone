import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { FiCheckCircle } from "react-icons/fi";
import { bookingService } from "../../services/booking.service.js";
import LoadingPage from "../../components/ui/LoadingPage.jsx";
import { formatPrice, formatDate } from "../../utils/helpers.js";

export default function BookingConfirmPage() {
  const { id } = useParams();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    bookingService.getById(id).then(({ data }) => setBooking(data.data.booking)).finally(() => setLoading(false));
  }, [id]);

  if (loading) return <LoadingPage/>;
  if (!booking) return <p className="text-center py-20">Booking not found</p>;

  return (
    <div className="max-w-2xl mx-auto px-4 py-16 text-center">
      <FiCheckCircle className="text-6xl text-green-500 mx-auto mb-4"/>
      <h1 className="text-2xl font-bold dark:text-white mb-2">Booking Confirmed!</h1>
      <p className="text-gray-400 mb-8">Your reservation is all set. A confirmation email has been sent.</p>

      <div className="card p-6 text-left">
        <div className="flex gap-4 mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
          <img src={booking.listing?.images?.[0]?.url} className="w-20 h-20 rounded-xl object-cover bg-gray-100" alt=""/>
          <div>
            <p className="font-semibold dark:text-white">{booking.listing?.title}</p>
            <p className="text-sm text-gray-400">{booking.listing?.location?.city}</p>
          </div>
        </div>
        <div className="space-y-2 text-sm dark:text-gray-300">
          <div className="flex justify-between"><span>Check-in</span><span className="font-medium">{formatDate(booking.checkIn)}</span></div>
          <div className="flex justify-between"><span>Check-out</span><span className="font-medium">{formatDate(booking.checkOut)}</span></div>
          <div className="flex justify-between"><span>Status</span><span className="badge bg-green-100 text-green-700 capitalize">{booking.status}</span></div>
          <div className="flex justify-between font-bold text-base pt-3 border-t border-gray-200 dark:border-gray-700">
            <span>Total paid</span><span>{formatPrice(booking.pricing?.totalPrice)}</span>
          </div>
        </div>
      </div>

      <div className="flex gap-3 justify-center mt-8">
        <Link to="/my-bookings" className="btn-outline">View my bookings</Link>
        <Link to="/listings" className="btn-primary">Explore more stays</Link>
      </div>
    </div>
  );
}
