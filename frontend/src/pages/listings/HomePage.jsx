import { useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiArrowRight } from "react-icons/fi";
import SearchBar from "../../components/listings/SearchBar.jsx";
import ListingCard from "../../components/listings/ListingCard.jsx";
import { useListings } from "../../hooks/useListings.js";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const DESTINATIONS = [
  { name:"Goa", emoji:"🏖️", subtitle:"Beach vibes", query:"Goa" },
  { name:"Manali", emoji:"🏔️", subtitle:"Snow & adventure", query:"Manali" },
  { name:"Udaipur", emoji:"🏰", subtitle:"Royal heritage", query:"Udaipur" },
  { name:"Kerala", emoji:"🌿", subtitle:"Backwaters", query:"Kerala" },
  { name:"Leh", emoji:"⛰️", subtitle:"High altitude", query:"Leh" },
  { name:"Coorg", emoji:"☕", subtitle:"Coffee estates", query:"Coorg" },
];

export default function HomePage() {
  const { listings, loading, fetchListings } = useListings();

  useEffect(() => { fetchListings({ limit:8, sortBy:"rating", order:"desc" }); }, []);

  return (
    <div>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-primary via-rose-500 to-orange-400 text-white py-24 px-4 overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_30%_50%,white,transparent_60%)]"/>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight"
            initial={{ opacity:0, y:30 }} animate={{ opacity:1, y:0 }}>
            Find your perfect stay
          </motion.h1>
          <motion.p className="text-lg md:text-xl opacity-90 mb-10"
            initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.1 }}>
            Discover unique homes, villas & experiences across India
          </motion.p>
          <SearchBar />
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Popular destinations */}
        <section className="mb-14">
          <h2 className="section-title">Popular Destinations</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            {DESTINATIONS.map((d, i) => (
              <motion.div key={d.name} initial={{ opacity:0, scale:0.9 }} animate={{ opacity:1, scale:1 }} transition={{ delay:i*0.05 }}>
                <Link to={`/listings?city=${d.query}`}
                  className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-gray-50 dark:bg-gray-800 hover:bg-primary-light dark:hover:bg-gray-700 transition-colors text-center group">
                  <span className="text-3xl">{d.emoji}</span>
                  <div>
                    <p className="font-semibold text-sm dark:text-white">{d.name}</p>
                    <p className="text-xs text-gray-400">{d.subtitle}</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Featured listings */}
        <section className="mb-14">
          <div className="flex items-center justify-between mb-6">
            <h2 className="section-title mb-0">Top-rated Stays</h2>
            <Link to="/listings" className="flex items-center gap-1 text-primary text-sm font-medium hover:underline">
              View all <FiArrowRight size={14}/>
            </Link>
          </div>
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i}><Skeleton height={200} borderRadius={16}/><Skeleton count={3} className="mt-2"/></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {listings.map(l => <ListingCard key={l._id} listing={l}/>)}
            </div>
          )}
        </section>

        {/* Become a host CTA */}
        <section className="bg-gradient-to-r from-gray-900 to-gray-700 text-white rounded-3xl p-10 md:p-16 flex flex-col md:flex-row items-center gap-8">
          <div className="flex-1">
            <h2 className="text-3xl font-bold mb-3">Become a Host</h2>
            <p className="opacity-80 mb-6">Earn extra income by sharing your space. Join thousands of hosts on StayEase.</p>
            <Link to="/host" className="btn-primary inline-block">Get started</Link>
          </div>
          <div className="text-7xl">🏠</div>
        </section>
      </div>
    </div>
  );
}
