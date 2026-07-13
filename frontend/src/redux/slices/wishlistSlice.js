import { createSlice } from "@reduxjs/toolkit";

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState: { listings: [] },
  reducers: {
    setWishlist: (state, { payload }) => { state.listings = payload; },
    toggleItem:  (state, { payload }) => {
      const idx = state.listings.findIndex(id => id === payload);
      if (idx > -1) state.listings.splice(idx, 1); else state.listings.push(payload);
    },
  },
});

export const { setWishlist, toggleItem } = wishlistSlice.actions;
export default wishlistSlice.reducer;
