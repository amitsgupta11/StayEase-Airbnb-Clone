import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { adminService } from "../../services/admin.service.js";
import { formatPrice, formatDate } from "../../utils/helpers.js";
import LoadingPage from "../../components/ui/LoadingPage.jsx";

const STATUS_COLORS = { pending:"bg-yellow-100 text-yellow-700", confirmed:"bg-green-100 text-green-700", cancelled:"bg-red-100 text-red-700", completed:"bg-blue-100 text-blue-700" };

export default function AdminDashboardPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminService.getDashboard().then(r => setData(r.data.data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingPage/>;

  const { stats, recentBookings, bookingStats } = data;

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold dark:text-white mb-8">Admin Dashboard</h1>

      {/* Stats cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-10">
        {[
          { label:"Users",    value:stats.totalUsers,    icon:"👥", color:"bg-blue-50 dark:bg-blue-900/20" },
          { label:"Listings", value:stats.totalListings, icon:"🏠", color:"bg-green-50 dark:bg-green-900/20" },
          { label:"Bookings", value:stats.totalBookings, icon:"📅", color:"bg-purple-50 dark:bg-purple-900/20" },
          { label:"Reviews",  value:stats.totalReviews,  icon:"⭐", color:"bg-yellow-50 dark:bg-yellow-900/20" },
          { label:"Revenue",  value:formatPrice(stats.revenue||0), icon:"💰", color:"bg-rose-50 dark:bg-rose-900/20" },
        ].map(s => (
          <div key={s.label} className={`card p-4 text-center ${s.color}`}>
            <p className="text-3xl mb-2">{s.icon}</p>
            <p className="text-xl font-bold dark:text-white">{s.value}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Booking status breakdown */}
      {bookingStats?.length > 0 && (
        <div className="card p-6 mb-8">
          <h2 className="font-semibold dark:text-white mb-4">Booking Status Breakdown</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {bookingStats.map(s => (
              <div key={s._id} className="text-center p-3 rounded-xl bg-gray-50 dark:bg-gray-700">
                <span className={`badge text-xs capitalize ${STATUS_COLORS[s._id] || "bg-gray-100 text-gray-600"}`}>{s._id}</span>
                <p className="text-xl font-bold dark:text-white mt-2">{s.count}</p>
                <p className="text-xs text-gray-400">{formatPrice(s.revenue || 0)}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent bookings */}
      <div className="card p-6 mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-semibold dark:text-white">Recent Bookings</h2>
          <Link to="/admin/listings" className="text-sm text-primary hover:underline">View all</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-400 border-b border-gray-100 dark:border-gray-700">
                <th className="pb-3 font-medium">Listing</th>
                <th className="pb-3 font-medium">Guest</th>
                <th className="pb-3 font-medium">Dates</th>
                <th className="pb-3 font-medium">Status</th>
                <th className="pb-3 font-medium text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
              {recentBookings?.map(b => (
                <tr key={b._id}>
                  <td className="py-3 dark:text-gray-300">{b.listing?.title?.slice(0,30)}...</td>
                  <td className="py-3 dark:text-gray-300">{b.guest?.name}</td>
                  <td className="py-3 text-gray-400">{formatDate(b.checkIn)}</td>
                  <td className="py-3"><span className={`badge text-xs capitalize ${STATUS_COLORS[b.status]}`}>{b.status}</span></td>
                  <td className="py-3 text-right font-medium dark:text-white">{formatPrice(b.pricing?.totalPrice)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {[
          { to:"/admin/users",    label:"Manage Users",    icon:"👥", desc:"View, edit, delete users" },
          { to:"/admin/listings", label:"Manage Listings", icon:"🏠", desc:"Review all listings" },
          { to:"/listings",       label:"Browse Listings", icon:"🔍", desc:"See public listing view" },
        ].map(l => (
          <Link key={l.to} to={l.to} className="card p-5 hover:shadow-hover transition-shadow">
            <p className="text-3xl mb-2">{l.icon}</p>
            <p className="font-semibold dark:text-white">{l.label}</p>
            <p className="text-xs text-gray-400 mt-1">{l.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
