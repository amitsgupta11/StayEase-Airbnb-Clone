import { Router } from "express";
import { getWishlist, toggleWishlist } from "../controllers/wishlist.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
const router = Router();
router.use(protect);
router.get("/",    getWishlist);
router.post("/",   toggleWishlist);
export default router;
