import { baseApi } from "./baseApi";

export const viewersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getViewers: builder.query({
      query: () => "/viewers",
      providesTags: ["Viewers"],
    }),
  }),
});

export const { useGetViewersQuery } = viewersApi;
