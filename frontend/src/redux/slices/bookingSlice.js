import { createSlice } from "@reduxjs/toolkit";

const bookingSlice = createSlice({
  name: "booking",
  initialState: { checkIn: null, checkOut: null, guests:{ adults:1, children:0, infants:0 }, priceDetails: null },
  reducers: {
    setDates:      (state, { payload }) => { state.checkIn = payload.checkIn; state.checkOut = payload.checkOut; },
    setGuests:     (state, { payload }) => { state.guests = payload; },
    setPriceDetails:(state, { payload }) => { state.priceDetails = payload; },
    clearBooking:  (state) => { state.checkIn = null; state.checkOut = null; state.guests = { adults:1, children:0, infants:0 }; state.priceDetails = null; },
  },
});

export const { setDates, setGuests, setPriceDetails, clearBooking } = bookingSlice.actions;
export default bookingSlice.reducer;
