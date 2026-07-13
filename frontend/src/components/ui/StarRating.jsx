import { FiStar } from "react-icons/fi";
import { FaStar, FaStarHalfAlt } from "react-icons/fa";

export default function StarRating({ rating=0, size=14, showValue=true }) {
  const stars = Array.from({ length: 5 }, (_, i) => {
    if (i < Math.floor(rating)) return "full";
    if (i < rating) return "half";
    return "empty";
  });
  return (
    <span className="flex items-center gap-1">
      {stars.map((s, i) => (
        s==="full"  ? <FaStar key={i} size={size} className="text-primary"/> :
        s==="half"  ? <FaStarHalfAlt key={i} size={size} className="text-primary"/> :
                      <FiStar key={i} size={size} className="text-gray-300"/>
      ))}
      {showValue && <span className="text-sm font-medium ml-1">{Number(rating).toFixed(1)}</span>}
    </span>
  );
}
