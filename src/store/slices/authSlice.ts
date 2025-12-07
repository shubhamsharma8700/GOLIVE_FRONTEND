import { createSlice } from "@reduxjs/toolkit";

const savedToken = localStorage.getItem("token");

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    token: savedToken || null,
    isLoggedIn: !!savedToken,
  },

  reducers: {
    setCredentials: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isLoggedIn = true;

      // persist token
      localStorage.setItem("token", action.payload.token);
    },

    setProfile: (state, action) => {
      state.user = action.payload;
      state.isLoggedIn = true;
    },

    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isLoggedIn = false;
      localStorage.removeItem("token");
    },
  },
});

export const { setCredentials, logout, setProfile } = authSlice.actions;
export default authSlice.reducer;
