import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { FiPlus, FiEdit2, FiTrash2, FiEye } from "react-icons/fi";
import { listingService } from "../../services/listing.service.js";
import { bookingService } from "../../services/booking.service.js";
import { formatPrice, formatDate, truncate } from "../../utils/helpers.js";
import LoadingPage from "../../components/ui/LoadingPage.jsx";

const STATUS_COLORS = { pending:"bg-yellow-100 text-yellow-700", confirmed:"bg-green-100 text-green-700", cancelled:"bg-red-100 text-red-700", completed:"bg-blue-100 text-blue-700" };

export default function HostDashboardPage() {
  const [listings, setListings] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("listings");

  const loadData = async () => {
    setLoading(true);
    try {
      const [lRes, bRes] = await Promise.all([listingService.getHostListings(), bookingService.getHostBookings()]);
      setListings(lRes.data.data.listings);
      setBookings(bRes.data.data.bookings);
    } catch { toast.error("Failed to load data"); }
    finally { setLoading(false); }
  };

  useEffect(() => { loadData(); }, []);

  const handleDelete = async (id) => {
    if (!confirm("Delete this listing permanently?")) return;
    try {
      await listingService.delete(id);
      toast.success("Listing deleted");
      setListings(p => p.filter(l => l._id !== id));
    } catch { toast.error("Failed to delete listing"); }
  };

  if (loading) return <LoadingPage/>;

  const totalRevenue = bookings.filter(b => b.status === "confirmed" || b.status === "completed")
    .reduce((sum, b) => sum + (b.pricing?.totalPrice || 0), 0);

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold dark:text-white">Host Dashboard</h1>
        <Link to="/host/listings/new" className="btn-primary flex items-center gap-2">
          <FiPlus size={16}/> New Listing
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label:"Total Listings", value: listings.length, icon:"🏠" },
          { label:"Total Bookings", value: bookings.length, icon:"📅" },
          { label:"Active Bookings", value: bookings.filter(b=>b.status==="confirmed").length, icon:"✅" },
          { label:"Revenue", value: formatPrice(totalRevenue), icon:"💰" },
        ].map(s => (
          <div key={s.label} className="card p-4 text-center">
            <p className="text-3xl mb-1">{s.icon}</p>
            <p className="text-xl font-bold dark:text-white">{s.value}</p>
            <p className="text-xs text-gray-400">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-gray-200 dark:border-gray-700 mb-6">
        {["listings","bookings"].map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`pb-3 text-sm font-medium capitalize border-b-2 ${tab===t ? "border-primary text-primary" : "border-transparent text-gray-400"}`}>
            {t}
          </button>
        ))}
      </div>

      {tab === "listings" ? (
        listings.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-5xl mb-4">🏠</p>
            <p className="font-semibold dark:text-white mb-2">No listings yet</p>
            <Link to="/host/listings/new" className="btn-primary inline-block">Create your first listing</Link>
          </div>
        ) : (
          <div className="space-y-4">
            {listings.map(l => (
              <div key={l._id} className="card p-4 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                <div className="w-full sm:w-20 h-20 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                  {l.images?.[0]?.url
                    ? <img src={l.images[0].url} className="w-full h-full object-cover" alt=""/>
                    : <div className="w-full h-full flex items-center justify-center text-2xl">🏠</div>}
                </div>
                <div className="flex-1">
                  <p className="font-semibold dark:text-white">{truncate(l.title, 50)}</p>
                  <p className="text-sm text-gray-400">{l.location?.city}, {l.location?.country}</p>
                  <p className="text-sm font-medium text-primary mt-1">{formatPrice(l.pricePerNight)} / night</p>
                </div>
                <div className="flex gap-2">
                  <Link to={`/listings/${l._id}`} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400" title="View">
                    <FiEye size={16}/>
                  </Link>
                  <Link to={`/host/listings/${l._id}/edit`} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400" title="Edit">
                    <FiEdit2 size={16}/>
                  </Link>
                  <button onClick={() => handleDelete(l._id)} className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500" title="Delete">
                    <FiTrash2 size={16}/>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )
      ) : (
        bookings.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-5xl mb-4">📅</p>
            <p className="font-semibold dark:text-white">No bookings yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map(b => (
              <div key={b._id} className="card p-4 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                <div className="flex-1">
                  <p className="font-semibold dark:text-white text-sm">{b.listing?.title}</p>
                  <p className="text-xs text-gray-400 mt-0.5">Guest: {b.guest?.name} · {b.guest?.email}</p>
                  <p className="text-xs text-gray-400">{formatDate(b.checkIn)} – {formatDate(b.checkOut)}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`badge text-xs capitalize ${STATUS_COLORS[b.status]}`}>{b.status}</span>
                  <p className="font-bold dark:text-white text-sm">{formatPrice(b.pricing?.totalPrice)}</p>
                </div>
              </div>
            ))}
          </div>
        )
      )}
    </div>
  );
}
