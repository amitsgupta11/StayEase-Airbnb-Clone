import api from "./api.js";
export const listingService = {
  getAll:       (params) => api.get("/listings", { params }),
  getById:      (id)     => api.get(`/listings/${id}`),
  create:       (data)   => api.post("/listings", data, { headers:{"Content-Type":"multipart/form-data"} }),
  update:       (id,data)=> api.put(`/listings/${id}`, data),
  delete:       (id)     => api.delete(`/listings/${id}`),
  addImages:    (id,data)=> api.post(`/listings/${id}/images`, data, { headers:{"Content-Type":"multipart/form-data"} }),
  deleteImage:  (id,imgId)=> api.delete(`/listings/${id}/images/${imgId}`),
  getHostListings: ()    => api.get("/listings/host/my-listings"),
};
