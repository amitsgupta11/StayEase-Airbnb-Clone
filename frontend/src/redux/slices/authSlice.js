import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: { user: null, accessToken: null, isAuthenticated: false, loading: false },
  reducers: {
    setCredentials: (state, { payload }) => {
      state.user = payload.user;
      state.accessToken = payload.accessToken;
      state.isAuthenticated = true;
    },
    updateUser: (state, { payload }) => { state.user = { ...state.user, ...payload }; },
    updateToken: (state, { payload }) => { state.accessToken = payload; },
    logout: (state) => { state.user = null; state.accessToken = null; state.isAuthenticated = false; },
    setLoading: (state, { payload }) => { state.loading = payload; },
  },
});

export const { setCredentials, updateUser, updateToken, logout, setLoading } = authSlice.actions;
export default authSlice.reducer;
