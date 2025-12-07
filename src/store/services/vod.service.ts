import { baseApi } from "./baseApi";

export const vodApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getVOD: builder.query({
      query: () => "/vod",
      providesTags: ["VOD"],
    }),
  }),
});

export const { useGetVODQuery } = vodApi;
