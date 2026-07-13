import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { FiSliders, FiX } from "react-icons/fi";
import ListingCard from "../../components/listings/ListingCard.jsx";
import FilterBar from "../../components/listings/FilterBar.jsx";
import { useListings } from "../../hooks/useListings.js";
import { PROPERTY_TYPES, AMENITIES_LIST } from "../../utils/helpers.js";
import Skeleton from "react-loading-skeleton";

export default function ListingsPage() {
  const [searchParams] = useSearchParams();
  const { listings, loading, pagination, fetchListings } = useListings();
  const [showFilters, setShowFilters] = useState(false);
  const [localFilters, setLocalFilters] = useState({
    city: searchParams.get("city") || "",
    propertyType: searchParams.get("propertyType") || "",
    minPrice: "", maxPrice: "", bedrooms: "", guests: searchParams.get("guests") || "",
  });
  const [page, setPage] = useState(1);

  const runSearch = (extra = {}) => {
    const params = { ...localFilters, ...extra, page };
    Object.keys(params).forEach(k => !params[k] && delete params[k]);
    fetchListings(params);
  };

  useEffect(() => { runSearch(); }, [page]);
  useEffect(() => { runSearch(); }, []);

  const applyFilters = () => { setPage(1); runSearch(); setShowFilters(false); };
  const clearAll = () => {
    setLocalFilters({ city:"", propertyType:"", minPrice:"", maxPrice:"", bedrooms:"", guests:"" });
    setPage(1);
    fetchListings({ page:1 });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between gap-4 mb-4">
        <div className="flex-1 overflow-hidden">
          <FilterBar onFilter={(f) => { setLocalFilters(p=>({...p,...f})); runSearch(f); }}/>
        </div>
        <button onClick={() => setShowFilters(true)}
          className="flex items-center gap-2 border border-gray-300 dark:border-gray-700 rounded-full px-4 py-2 text-sm font-medium hover:shadow-card dark:text-white flex-shrink-0">
          <FiSliders size={14}/> Filters
        </button>
      </div>

      <p className="text-sm text-gray-400 mb-4">
        {pagination?.total ?? 0} stays found
      </p>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i}><Skeleton height={200} borderRadius={16}/><Skeleton count={3} className="mt-2"/></div>
          ))}
        </div>
      ) : listings.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-5xl mb-4">🔍</p>
          <p className="text-lg font-semibold dark:text-white">No stays found</p>
          <p className="text-gray-400 text-sm">Try adjusting your filters</p>
          <button onClick={clearAll} className="btn-outline mt-4">Clear filters</button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {listings.map(l => <ListingCard key={l._id} listing={l}/>)}
          </div>
          {pagination?.pages > 1 && (
            <div className="flex justify-center gap-2 mt-10">
              {Array.from({ length: pagination.pages }, (_, i) => i+1).map(p => (
                <button key={p} onClick={() => setPage(p)}
                  className={`w-9 h-9 rounded-full text-sm font-medium ${p===page ? "bg-primary text-white" : "hover:bg-gray-100 dark:hover:bg-gray-800 dark:text-white"}`}>
                  {p}
                </button>
              ))}
            </div>
          )}
        </>
      )}

      {/* Filter Drawer */}
      {showFilters && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/40" onClick={() => setShowFilters(false)}>
          <div className="bg-white dark:bg-gray-800 rounded-t-3xl md:rounded-3xl w-full md:max-w-md max-h-[85vh] overflow-y-auto p-6" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-lg dark:text-white">Filters</h3>
              <button onClick={() => setShowFilters(false)}><FiX size={20} className="dark:text-white"/></button>
            </div>

            <div className="space-y-5">
              <div>
                <label className="text-sm font-medium dark:text-white block mb-2">City</label>
                <input className="input-field" value={localFilters.city}
                  onChange={e => setLocalFilters(p=>({...p, city:e.target.value}))} placeholder="e.g. Goa"/>
              </div>

              <div>
                <label className="text-sm font-medium dark:text-white block mb-2">Property Type</label>
                <div className="flex flex-wrap gap-2">
                  {PROPERTY_TYPES.map(t => (
                    <button key={t} onClick={() => setLocalFilters(p=>({...p, propertyType: p.propertyType===t ? "" : t}))}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium capitalize border ${localFilters.propertyType===t ? "bg-primary text-white border-primary" : "border-gray-300 dark:border-gray-600 dark:text-gray-300"}`}>
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium dark:text-white block mb-2">Min Price</label>
                  <input type="number" className="input-field" value={localFilters.minPrice}
                    onChange={e => setLocalFilters(p=>({...p, minPrice:e.target.value}))} placeholder="₹0"/>
                </div>
                <div>
                  <label className="text-sm font-medium dark:text-white block mb-2">Max Price</label>
                  <input type="number" className="input-field" value={localFilters.maxPrice}
                    onChange={e => setLocalFilters(p=>({...p, maxPrice:e.target.value}))} placeholder="₹50000"/>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium dark:text-white block mb-2">Bedrooms (min)</label>
                <div className="flex gap-2">
                  {[1,2,3,4,"5+"].map(n => (
                    <button key={n} onClick={() => setLocalFilters(p=>({...p, bedrooms: p.bedrooms==String(n).replace("+","") ? "" : String(n).replace("+","")}))}
                      className={`w-10 h-10 rounded-full text-sm font-medium border ${localFilters.bedrooms===String(n).replace("+","") ? "bg-primary text-white border-primary" : "border-gray-300 dark:border-gray-600 dark:text-gray-300"}`}>
                      {n}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-8">
              <button onClick={clearAll} className="btn-ghost flex-1 border border-gray-300 dark:border-gray-600">Clear all</button>
              <button onClick={applyFilters} className="btn-primary flex-1">Show results</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
