import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { toggleItem, setWishlist } from "../redux/slices/wishlistSlice.js";
import { userService } from "../services/user.service.js";

export const useWishlist = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { listings } = useSelector(s => s.wishlist);
  const { isAuthenticated } = useSelector(s => s.auth);

  const isWishlisted = (id) => listings.includes(id);

  const toggleWishlist = async (listingId) => {
    if (!isAuthenticated) { toast.error("Please login to save listings"); navigate("/login"); return; }
    dispatch(toggleItem(listingId));
    try {
      const { data } = await userService.toggleWishlist(listingId);
      toast.success(data.data.added ? "Saved to wishlist ❤️" : "Removed from wishlist");
    } catch {
      dispatch(toggleItem(listingId)); // Revert on error
      toast.error("Failed to update wishlist");
    }
  };

  const loadWishlist = async () => {
    if (!isAuthenticated) return;
    try {
      const { data } = await userService.getWishlist();
      dispatch(setWishlist(data.data.wishlist.listings.map(l => l._id || l)));
    } catch {}
  };

  return { isWishlisted, toggleWishlist, loadWishlist, wishlistCount: listings.length };
};
