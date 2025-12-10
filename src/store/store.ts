import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import eventReducer from "./slices/eventSlice"; // Event Slice
import { baseApi } from "./services/baseApi"; // RTK Query API

export const store = configureStore({
  reducer: {
    auth: authReducer,
    eventForm: eventReducer, // Register event form reducer
    [baseApi.reducerPath]: baseApi.reducer, // RTK Query
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Needed for: Dates, File, FormData, non-serializable RTK Query data
    }).concat(baseApi.middleware),
});

// Typed Hooks Support
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
