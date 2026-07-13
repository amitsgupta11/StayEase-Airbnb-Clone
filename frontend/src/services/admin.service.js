import api from "./api.js";
export const adminService = {
  getDashboard:  ()     => api.get("/admin/dashboard"),
  getUsers:      (params)=> api.get("/admin/users", { params }),
  deleteUser:    (id)   => api.delete(`/admin/users/${id}`),
  updateRole:    (id, role) => api.put(`/admin/users/${id}/role`, { role }),
  getListings:   (params)=> api.get("/admin/listings", { params }),
  getBookings:   ()     => api.get("/admin/bookings"),
};
