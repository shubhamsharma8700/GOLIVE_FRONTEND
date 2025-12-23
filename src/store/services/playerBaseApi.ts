// src/store/services/playerBaseApi.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const playerBaseApi = createApi({
  reducerPath: "playerApi",

  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL,
    prepareHeaders: (headers) => {
      headers.set("Content-Type", "application/json");
      return headers;
    },
  }),

  tagTypes: ["Player", "Payments", "Analytics"],

  endpoints: () => ({}),
});
