import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { userService } from "../../services/user.service.js";
import ListingCard from "../../components/listings/ListingCard.jsx";
import LoadingPage from "../../components/ui/LoadingPage.jsx";

export default function WishlistPage() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    userService.getWishlist().then(({ data }) => setListings(data.data.wishlist.listings)).finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingPage/>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold dark:text-white mb-8">Your Wishlist</h1>
      {listings.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-5xl mb-4">❤️</p>
          <p className="font-semibold dark:text-white">No saved listings yet</p>
          <Link to="/listings" className="btn-primary inline-block mt-4">Explore stays</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {listings.map(l => <ListingCard key={l._id} listing={l}/>)}
        </div>
      )}
    </div>
  );
}
