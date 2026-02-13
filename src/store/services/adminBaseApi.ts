import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { RootState } from "../store";
import { setToken, logout } from "../slices/authSlice";

/* -------------------------------------------------------
   BASE QUERY
------------------------------------------------------- */

const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_URL,
  credentials: "include", // needed for refresh cookie
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.token;

    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    headers.set("Content-Type", "application/json");
    return headers;
  },
});

/* -------------------------------------------------------
   BASE QUERY WITH REAUTH
------------------------------------------------------- */

const baseQueryWithReauth: typeof baseQuery = async (
  args,
  api,
  extraOptions
) => {
  let result = await baseQuery(args, api, extraOptions);

  // Access token expired
  if (result.error?.status === 401) {
    // Attempt refresh
    const refreshResult = await baseQuery(
      {
        url: "/admin/refresh",
        method: "POST",
      },
      api,
      extraOptions
    );

    if (refreshResult.data && (refreshResult.data as { token?: string })?.token) {
      // Save new access token
      api.dispatch(setToken((refreshResult.data as { token: string }).token));

      // Retry original request
      result = await baseQuery(args, api, extraOptions);
    } else {
      // Refresh failed → logout
      api.dispatch(logout());
    }
  }

  return result;
};

/* -------------------------------------------------------
   API
------------------------------------------------------- */

export const adminBaseApi = createApi({
  reducerPath: "adminApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Auth", "Admin", "Events", "Users", "Viewers", "Dashboard"],
  endpoints: () => ({}),
});
