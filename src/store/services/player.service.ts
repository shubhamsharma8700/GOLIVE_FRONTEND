import { baseApi } from "./baseApi";

export const playerApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPlayerEvent: builder.query({
      query: (id) => `/player/${id}`,
      providesTags: ["Player"],
    }),
  }),
});

export const { useGetPlayerEventQuery } = playerApi;
