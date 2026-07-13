import { createSlice } from "@reduxjs/toolkit";

const uiSlice = createSlice({
  name: "ui",
  initialState: { darkMode: false, searchOpen: false, mobileMenuOpen: false },
  reducers: {
    toggleDarkMode:    (state) => { state.darkMode = !state.darkMode; },
    setDarkMode:       (state, { payload }) => { state.darkMode = payload; },
    setSearchOpen:     (state, { payload }) => { state.searchOpen = payload; },
    setMobileMenuOpen: (state, { payload }) => { state.mobileMenuOpen = payload; },
  },
});

export const { toggleDarkMode, setDarkMode, setSearchOpen, setMobileMenuOpen } = uiSlice.actions;
export default uiSlice.reducer;
