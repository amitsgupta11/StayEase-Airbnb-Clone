import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiHeart } from "react-icons/fi";
import { FaHeart } from "react-icons/fa";
import { useWishlist } from "../../hooks/useWishlist.js";
import StarRating from "../ui/StarRating.jsx";
import { formatPrice, truncate } from "../../utils/helpers.js";

export default function ListingCard({ listing }) {
  const { isWishlisted, toggleWishlist } = useWishlist();
  const wishlisted = isWishlisted(listing._id);
  const img = listing.images?.[0]?.url;

  return (
    <motion.div className="group" initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.3 }}>
      <Link to={`/listings/${listing._id}`} className="block">
        {/* Image */}
        <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-800 mb-3">
          {img
            ? <img src={img} alt={listing.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"/>
            : <div className="w-full h-full flex items-center justify-center text-5xl">🏠</div>
          }
          <div className="absolute top-3 left-3">
            <span className="badge bg-white/90 dark:bg-gray-800/90 text-dark dark:text-white text-xs capitalize px-2 py-1 rounded-full">
              {listing.propertyType}
            </span>
          </div>
          <button
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleWishlist(listing._id); }}
            className="absolute top-3 right-3 p-2 rounded-full bg-white/80 hover:bg-white transition-colors shadow-sm">
            {wishlisted
              ? <FaHeart size={16} className="text-primary"/>
              : <FiHeart size={16} className="text-gray-600"/>}
          </button>
        </div>
      </Link>

      {/* Info */}
      <Link to={`/listings/${listing._id}`}>
        <div className="flex justify-between items-start">
          <h3 className="font-semibold text-sm dark:text-white leading-tight pr-2">
            {truncate(listing.title, 40)}
          </h3>
          {listing.avgRating > 0 && <StarRating rating={listing.avgRating} showValue={false} size={12}/>}
        </div>
        <p className="text-sm text-gray-400 mt-0.5">{listing.location?.city}, {listing.location?.country}</p>
        <p className="text-sm text-gray-400">{listing.bedrooms} bed{listing.bedrooms!==1?"s":""} · {listing.bathrooms} bath{listing.bathrooms!==1?"s":""} · {listing.maxGuests} guests</p>
        <p className="text-sm mt-1">
          <span className="font-bold text-dark dark:text-white">{formatPrice(listing.pricePerNight)}</span>
          <span className="text-gray-400"> / night</span>
        </p>
      </Link>
    </motion.div>
  );
}
