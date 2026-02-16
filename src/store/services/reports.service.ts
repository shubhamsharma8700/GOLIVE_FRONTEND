import { adminBaseApi } from "./adminBaseApi";

export const reportsApi = adminBaseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAnalyticsReport: builder.mutation<
      { [key: string]: unknown },
      { eventId?: string }
    >({
      query: (body) => ({
        url: "/analyticsReport",
        method: "POST",
        body: body.eventId ? { eventId: body.eventId } : {},
      }),
      invalidatesTags: ["Reports"],
    }),
  }),
});

export const { useGetAnalyticsReportMutation } = reportsApi;
