import { createSlice } from "@reduxjs/toolkit";

const listingSlice = createSlice({
  name: "listings",
  initialState: {
    listings: [], currentListing: null, pagination: null,
    filters: { city:"", country:"", propertyType:"", minPrice:"", maxPrice:"", bedrooms:"", bathrooms:"", guests:"", amenities:"", sortBy:"createdAt", order:"desc" },
    loading: false, error: null,
  },
  reducers: {
    setListings:  (state, { payload }) => { state.listings = payload.listings; state.pagination = payload.pagination; },
    setCurrentListing: (state, { payload }) => { state.currentListing = payload; },
    setFilters:   (state, { payload }) => { state.filters = { ...state.filters, ...payload }; },
    clearFilters: (state) => { state.filters = { city:"", country:"", propertyType:"", minPrice:"", maxPrice:"", bedrooms:"", bathrooms:"", guests:"", amenities:"", sortBy:"createdAt", order:"desc" }; },
    setLoading:   (state, { payload }) => { state.loading = payload; },
    setError:     (state, { payload }) => { state.error = payload; },
  },
});

export const { setListings, setCurrentListing, setFilters, clearFilters, setLoading, setError } = listingSlice.actions;
export default listingSlice.reducer;
