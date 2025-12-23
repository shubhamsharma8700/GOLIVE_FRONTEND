// src/store/index.ts
import { configureStore } from "@reduxjs/toolkit";

// Redux slices
import authReducer from "./slices/authSlice";
import eventFormReducer from "./slices/eventFormSlice";
import eventViewSlice from "./slices/eventViewSlice";

// RTK Query base APIs
import { adminBaseApi } from "./services/adminBaseApi";
import { playerBaseApi } from "./services/playerBaseApi";

export const store = configureStore({
  reducer: {
    // Redux slices
    auth: authReducer,
    eventForm: eventFormReducer,
    eventView: eventViewSlice,

    // RTK Query reducers
    [adminBaseApi.reducerPath]: adminBaseApi.reducer,
    [playerBaseApi.reducerPath]: playerBaseApi.reducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // required for RTK Query
    }).concat(adminBaseApi.middleware, playerBaseApi.middleware),
});

/* =====================================================
   TYPES (USED BY TYPED HOOKS)
===================================================== */

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
