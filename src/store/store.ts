// src/store/index.ts
import { configureStore } from "@reduxjs/toolkit";

import authReducer from "./slices/authSlice";
import eventReducer from "./slices/eventSlice";

// RTK Query base APIs
import { adminBaseApi } from "./services/adminBaseApi";
import { playerBaseApi } from "./services/playerBaseApi"; // used for playback + analytics

export const store = configureStore({
  reducer: {
    // Redux slices
    auth: authReducer,
    eventForm: eventReducer,

    // RTK Query reducers
    [adminBaseApi.reducerPath]: adminBaseApi.reducer,
    [playerBaseApi.reducerPath]: playerBaseApi.reducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // required for RTK Query, Dates, etc.
    }).concat(
      adminBaseApi.middleware,
      playerBaseApi.middleware
    ),
});

// Typed hooks
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
