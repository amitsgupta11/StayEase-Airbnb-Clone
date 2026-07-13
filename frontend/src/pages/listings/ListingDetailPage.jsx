import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css"; import "swiper/css/navigation"; import "swiper/css/pagination";
import { motion } from "framer-motion";
import { FiHeart, FiShare2, FiMapPin, FiUsers, FiHome, FiDroplet } from "react-icons/fi";
import { FaHeart } from "react-icons/fa";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import StarRating from "../../components/ui/StarRating.jsx";
import LoadingPage from "../../components/ui/LoadingPage.jsx";
import ReviewList from "../../components/reviews/ReviewList.jsx";
import { useListings } from "../../hooks/useListings.js";
import { useWishlist } from "../../hooks/useWishlist.js";
import { formatPrice, AMENITY_ICONS, calculatePricing, getNights } from "../../utils/helpers.js";

export default function ListingDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentListing, loading, fetchListingById } = useListings();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const { isAuthenticated } = useSelector(s => s.auth);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(1);

  useEffect(() => { fetchListingById(id); }, [id]);

  if (loading || !currentListing) return <LoadingPage/>;
  const l = currentListing;

  const nights = checkIn && checkOut ? getNights(checkIn, checkOut) : 0;
  const pricing = nights > 0 ? calculatePricing(l.pricePerNight, nights, l.cleaningFee) : null;

  const handleReserve = () => {
    if (!isAuthenticated) { toast.error("Please log in to book"); navigate("/login"); return; }
    if (!checkIn || !checkOut) { toast.error("Select check-in and check-out dates"); return; }
    navigate(`/book/${id}`, { state: { checkIn, checkOut, guests } });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Title row */}
      <div className="flex justify-between items-start mb-4">
        <h1 className="text-2xl md:text-3xl font-bold dark:text-white">{l.title}</h1>
        <div className="flex gap-2 flex-shrink-0">
          <button className="flex items-center gap-1 text-sm font-medium underline dark:text-white"><FiShare2/> Share</button>
          <button onClick={() => toggleWishlist(l._id)} className="flex items-center gap-1 text-sm font-medium underline dark:text-white">
            {isWishlisted(l._id) ? <FaHeart className="text-primary"/> : <FiHeart/>} Save
          </button>
        </div>
      </div>
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        {l.avgRating > 0 && <><StarRating rating={l.avgRating}/> · {l.reviewCount} reviews ·</>}
        <FiMapPin size={14}/> {l.location?.city}, {l.location?.country}
      </div>

      {/* Image gallery */}
      <div className="rounded-2xl overflow-hidden mb-8">
        {l.images?.length > 0 ? (
          <Swiper modules={[Navigation, Pagination]} navigation pagination={{ clickable:true }} className="h-[300px] md:h-[450px]">
            {l.images.map((img, i) => (
              <SwiperSlide key={i}><img src={img.url} alt={`${l.title} ${i+1}`} className="w-full h-full object-cover"/></SwiperSlide>
            ))}
          </Swiper>
        ) : (
          <div className="h-[300px] md:h-[450px] bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-7xl">🏠</div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Left: details */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between pb-6 border-b border-gray-200 dark:border-gray-700">
            <div>
              <h2 className="font-semibold text-lg dark:text-white capitalize">{l.propertyType} hosted by {l.host?.name}</h2>
              <p className="text-sm text-gray-500">{l.maxGuests} guests · {l.bedrooms} bedrooms · {l.beds} beds · {l.bathrooms} baths</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center font-bold flex-shrink-0">
              {l.host?.avatar?.url ? <img src={l.host.avatar.url} className="w-full h-full rounded-full object-cover" alt=""/> : l.host?.name?.[0]}
            </div>
          </div>

          <div className="py-6 border-b border-gray-200 dark:border-gray-700">
            <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line leading-relaxed">{l.description}</p>
          </div>

          <div className="py-6 border-b border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold text-lg mb-4 dark:text-white">What this place offers</h3>
            <div className="grid grid-cols-2 gap-3">
              {l.amenities?.map(a => (
                <div key={a} className="flex items-center gap-3 text-sm dark:text-gray-300">
                  <span className="text-lg">{AMENITY_ICONS[a] || "✓"}</span> {a}
                </div>
              ))}
            </div>
          </div>

          <div className="py-6">
            <ReviewList listingId={l._id} avgRating={l.avgRating} reviewCount={l.reviewCount}/>
          </div>
        </div>

        {/* Right: booking card */}
        <div>
          <motion.div className="card p-6 sticky top-24" initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}>
            <div className="flex items-baseline gap-1 mb-4">
              <span className="text-2xl font-bold dark:text-white">{formatPrice(l.pricePerNight)}</span>
              <span className="text-gray-400 text-sm">/ night</span>
            </div>

            <div className="border border-gray-300 dark:border-gray-600 rounded-xl overflow-hidden mb-3">
              <div className="grid grid-cols-2">
                <div className="p-3 border-r border-b border-gray-300 dark:border-gray-600">
                  <label className="text-[10px] font-bold uppercase text-gray-500">Check-in</label>
                  <input type="date" className="w-full text-sm outline-none bg-transparent dark:text-white" value={checkIn}
                    min={new Date().toISOString().split("T")[0]}
                    onChange={e => setCheckIn(e.target.value)}/>
                </div>
                <div className="p-3 border-b border-gray-300 dark:border-gray-600">
                  <label className="text-[10px] font-bold uppercase text-gray-500">Check-out</label>
                  <input type="date" className="w-full text-sm outline-none bg-transparent dark:text-white" value={checkOut}
                    min={checkIn || new Date().toISOString().split("T")[0]}
                    onChange={e => setCheckOut(e.target.value)}/>
                </div>
              </div>
              <div className="p-3">
                <label className="text-[10px] font-bold uppercase text-gray-500">Guests</label>
                <select className="w-full text-sm outline-none bg-transparent dark:text-white dark:bg-gray-800" value={guests} onChange={e => setGuests(Number(e.target.value))}>
                  {Array.from({ length: l.maxGuests }, (_, i) => i+1).map(n => (
                    <option key={n} value={n}>{n} guest{n>1?"s":""}</option>
                  ))}
                </select>
              </div>
            </div>

            <button onClick={handleReserve} className="btn-primary w-full mb-4">Reserve</button>

            {pricing && (
              <div className="space-y-2 text-sm dark:text-gray-300">
                <div className="flex justify-between"><span className="underline">{formatPrice(l.pricePerNight)} × {nights} nights</span><span>{formatPrice(pricing.subtotal)}</span></div>
                {pricing.cleaningFee > 0 && <div className="flex justify-between"><span className="underline">Cleaning fee</span><span>{formatPrice(pricing.cleaningFee)}</span></div>}
                <div className="flex justify-between"><span className="underline">Service fee</span><span>{formatPrice(pricing.serviceFee)}</span></div>
                <div className="flex justify-between"><span className="underline">Taxes</span><span>{formatPrice(pricing.taxes)}</span></div>
                <div className="flex justify-between font-bold pt-3 border-t border-gray-200 dark:border-gray-700">
                  <span>Total</span><span>{formatPrice(pricing.totalPrice)}</span>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
