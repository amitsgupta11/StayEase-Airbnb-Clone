import api from "./api.js";
export const reviewService = {
  getByListing: (listingId, params) => api.get(`/reviews/listing/${listingId}`, { params }),
  create:       (data)  => api.post("/reviews", data),
  update:       (id, data) => api.put(`/reviews/${id}`, data),
  delete:       (id)    => api.delete(`/reviews/${id}`),
};
