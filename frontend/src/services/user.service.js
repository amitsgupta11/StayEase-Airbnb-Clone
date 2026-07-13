import api from "./api.js";
export const userService = {
  getProfile:    ()     => api.get("/users/profile"),
  updateProfile: (data) => api.put("/users/profile", data),
  uploadAvatar:  (data) => api.post("/users/avatar", data, { headers:{"Content-Type":"multipart/form-data"} }),
  changePassword:(data) => api.put("/users/change-password", data),
  getBookings:   ()     => api.get("/users/bookings"),
  getWishlist:   ()     => api.get("/wishlist"),
  toggleWishlist:(listingId) => api.post("/wishlist", { listingId }),
};
