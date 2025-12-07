import { baseApi } from "./baseApi";

export const reportsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardSummary: builder.query({
      query: () => "/reports/summary",
      providesTags: ["Reports"],
    }),
  }),
});

export const { useGetDashboardSummaryQuery } = reportsApi;
