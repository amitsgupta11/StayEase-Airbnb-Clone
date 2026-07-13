import { Router } from "express";
import { createReview, getListingReviews, updateReview, deleteReview } from "../controllers/review.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
const router = Router();
router.get("/listing/:listingId", getListingReviews);
router.post("/",         protect, createReview);
router.put("/:id",       protect, updateReview);
router.delete("/:id",    protect, deleteReview);
export default router;
