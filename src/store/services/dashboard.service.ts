import { adminBaseApi } from "./adminBaseApi";

export interface DashboardCard {
  title: string;
  value: string;
  change: string;
  icon: string;
  color: string;
}

export interface DashboardEventPoint {
  name: string;
  events: number;
}

export interface DashboardEngagementPoint {
  name: string;
  viewers: number;
}

export interface DashboardAnalyticsResponse {
  year: string;
  timezone: string;
  cards: DashboardCard[];
  eventData: DashboardEventPoint[];
  engagementData: DashboardEngagementPoint[];
}

export const dashboardApi = adminBaseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardAnalytics: builder.query<DashboardAnalyticsResponse, void>({
      query: () => "/dashboard/analytics",
      providesTags: ["Dashboard"],
    }),
  }),
});

export const { useGetDashboardAnalyticsQuery } = dashboardApi;
