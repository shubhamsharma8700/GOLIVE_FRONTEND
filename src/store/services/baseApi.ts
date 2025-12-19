import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { RootState } from "../store";

export const baseApi = createApi({
  reducerPath: "api",

  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_API_URL}`, 
    // credentials: "include", // important if backend sets cookies

    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;

      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      headers.set("Content-Type", "application/json");
      return headers;
    },
  }),

  tagTypes: [
    "Auth",
    "Admin",
    "Events",
    "Users",
    "Viewers",
    "VOD",
    "Analytics",
    "Player",
    "Payments",
  ],

  endpoints: () => ({}),
});
