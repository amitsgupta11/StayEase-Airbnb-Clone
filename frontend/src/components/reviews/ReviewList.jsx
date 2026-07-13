import { useEffect, useState } from "react";
import { reviewService } from "../../services/review.service.js";
import StarRating from "../ui/StarRating.jsx";
import { getInitials, formatDate } from "../../utils/helpers.js";

export default function ReviewList({ listingId, avgRating, reviewCount }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    reviewService.getByListing(listingId).then(({ data }) => setReviews(data.data.reviews)).finally(() => setLoading(false));
  }, [listingId]);

  if (loading) return <p className="text-sm text-gray-400">Loading reviews...</p>;

  return (
    <div>
      <h3 className="font-semibold text-lg mb-4 dark:text-white flex items-center gap-2">
        <StarRating rating={avgRating} showValue={false}/> {avgRating?.toFixed(1)} · {reviewCount} review{reviewCount!==1?"s":""}
      </h3>
      {reviews.length === 0 ? (
        <p className="text-gray-400 text-sm">No reviews yet. Be the first to review this stay!</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reviews.map(r => (
            <div key={r._id} className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
                  {r.author?.avatar?.url ? <img src={r.author.avatar.url} className="w-full h-full rounded-full object-cover" alt=""/> : getInitials(r.author?.name)}
                </div>
                <div>
                  <p className="font-medium text-sm dark:text-white">{r.author?.name}</p>
                  <p className="text-xs text-gray-400">{formatDate(r.createdAt)}</p>
                </div>
              </div>
              <StarRating rating={r.rating} showValue={false} size={12}/>
              <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{r.comment}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
