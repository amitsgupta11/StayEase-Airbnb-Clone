import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FiTrash2, FiEye } from "react-icons/fi";
import { Link } from "react-router-dom";
import { adminService } from "../../services/admin.service.js";
import { listingService } from "../../services/listing.service.js";
import { formatPrice, formatDate, truncate } from "../../utils/helpers.js";
import LoadingPage from "../../components/ui/LoadingPage.jsx";

export default function AdminListingsPage() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminService.getListings().then(r => setListings(r.data.data.listings)).finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Permanently delete this listing?")) return;
    try {
      await listingService.delete(id);
      setListings(p => p.filter(l => l._id !== id));
      toast.success("Listing deleted");
    } catch (e) { toast.error(e.response?.data?.message || "Failed"); }
  };

  if (loading) return <LoadingPage/>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold dark:text-white mb-8">Manage Listings ({listings.length})</h1>
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-400 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                <th className="px-4 py-3 font-medium">Listing</th>
                <th className="px-4 py-3 font-medium">Host</th>
                <th className="px-4 py-3 font-medium">Location</th>
                <th className="px-4 py-3 font-medium">Price</th>
                <th className="px-4 py-3 font-medium">Rating</th>
                <th className="px-4 py-3 font-medium">Created</th>
                <th className="px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
              {listings.map(l => (
                <tr key={l._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                        {l.images?.[0]?.url ? <img src={l.images[0].url} className="w-full h-full object-cover" alt=""/> : <span className="flex h-full items-center justify-center text-lg">🏠</span>}
                      </div>
                      <span className="font-medium dark:text-white">{truncate(l.title, 35)}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-500 dark:text-gray-400">{l.host?.name}</td>
                  <td className="px-4 py-3 text-gray-500 dark:text-gray-400">{l.location?.city}, {l.location?.country}</td>
                  <td className="px-4 py-3 font-medium dark:text-white">{formatPrice(l.pricePerNight)}</td>
                  <td className="px-4 py-3 text-gray-500">{l.avgRating > 0 ? `⭐ ${l.avgRating}` : "—"}</td>
                  <td className="px-4 py-3 text-gray-400 text-xs">{formatDate(l.createdAt)}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <Link to={`/listings/${l._id}`} className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-gray-500"><FiEye size={14}/></Link>
                      <button onClick={() => handleDelete(l._id)} className="p-1.5 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg text-red-500"><FiTrash2 size={14}/></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
