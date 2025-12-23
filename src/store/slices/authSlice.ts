import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

/* =====================================================
   TYPES
===================================================== */

export interface AuthUser {
  id: string;
  name: string;
  email: string;
}

export interface AuthState {
  user: AuthUser | null;
  token: string | null;
}

/* =====================================================
   INITIAL STATE
===================================================== */

// Persist ONLY the access token (refresh token lives in http-only cookie)
const savedToken = localStorage.getItem("accessToken");

const initialState: AuthState = {
  user: null,
  token: savedToken,
};

/* =====================================================
   SLICE
===================================================== */

const authSlice = createSlice({
  name: "auth",
  initialState,

  reducers: {
    /**
     * Used on LOGIN
     * Stores user + access token
     */
    setCredentials: (
      state,
      action: PayloadAction<{ user: AuthUser; token: string }>
    ) => {
      state.user = action.payload.user;
      state.token = action.payload.token;

      localStorage.setItem("accessToken", action.payload.token);
    },

    /**
     * Used on TOKEN REFRESH
     * Updates ONLY the access token
     */
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
      localStorage.setItem("accessToken", action.payload);
    },

    /**
     * Used after /admin/profile
     * Keeps user data in sync
     */
    setProfile: (state, action: PayloadAction<AuthUser>) => {
      state.user = action.payload;
    },

    /**
     * Used on LOGOUT or refresh failure
     * Clears everything
     */
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem("accessToken");
    },
  },
});

/* =====================================================
   EXPORTS
===================================================== */

export const {
  setCredentials,
  setToken,
  setProfile,
  logout,
} = authSlice.actions;

export default authSlice.reducer;
