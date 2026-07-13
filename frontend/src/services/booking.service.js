import api from "./api.js";
export const bookingService = {
  create:       (data) => api.post("/bookings", data),
  getById:      (id)   => api.get(`/bookings/${id}`),
  cancel:       (id, data) => api.put(`/bookings/${id}/cancel`, data),
  getHostBookings: ()  => api.get("/bookings/host/incoming"),
};
