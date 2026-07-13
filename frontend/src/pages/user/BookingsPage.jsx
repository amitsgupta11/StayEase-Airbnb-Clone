import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { userService } from "../../services/user.service.js";
import { bookingService } from "../../services/booking.service.js";
import { formatDate, formatPrice } from "../../utils/helpers.js";
import LoadingPage from "../../components/ui/LoadingPage.jsx";

const STATUS_COLORS = { pending:"bg-yellow-100 text-yellow-700", confirmed:"bg-green-100 text-green-700", cancelled:"bg-red-100 text-red-700", completed:"bg-blue-100 text-blue-700" };

export default function BookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => userService.getBookings().then(({ data }) => setBookings(data.data.bookings)).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);

  const handleCancel = async (id) => {
    if (!confirm("Cancel this booking?")) return;
    try {
      await bookingService.cancel(id, { reason: "Cancelled by guest" });
      toast.success("Booking cancelled");
      load();
    } catch (e) { toast.error(e.response?.data?.message || "Failed to cancel"); }
  };

  if (loading) return <LoadingPage/>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold dark:text-white mb-8">My Bookings</h1>
      {bookings.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-5xl mb-4">🧳</p>
          <p className="font-semibold dark:text-white">No bookings yet</p>
          <Link to="/listings" className="btn-primary inline-block mt-4">Explore stays</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map(b => (
            <div key={b._id} className="card p-5 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              <img src={b.listing?.images?.[0]?.url} className="w-full sm:w-24 h-24 rounded-xl object-cover bg-gray-100" alt=""/>
              <div className="flex-1">
                <p className="font-semibold dark:text-white">{b.listing?.title}</p>
                <p className="text-sm text-gray-400">{formatDate(b.checkIn)} – {formatDate(b.checkOut)}</p>
                <span className={`badge text-xs capitalize mt-1 ${STATUS_COLORS[b.status]}`}>{b.status}</span>
              </div>
              <div className="text-right">
                <p className="font-bold dark:text-white">{formatPrice(b.pricing?.totalPrice)}</p>
                {(b.status==="pending"||b.status==="confirmed") && (
                  <button onClick={() => handleCancel(b._id)} className="text-xs text-red-500 hover:underline mt-1">Cancel booking</button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
