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
  timezone?: string;
  cards: DashboardCard[];
  eventData: DashboardEventPoint[];
  engagementData: DashboardEngagementPoint[];
  previousGoLiveEvents?: DashboardEventItem[];
  events?: DashboardEventItem[];
  summary?: DashboardSummary;
}

export interface DashboardEventItem {
  eventId: string;
  title: string;
  startTime: string | null;
  endTime: string | null;
  status: string;
  eventType: string;
  thumbnailUrl: string;
  totalViewers: number;
  peakViewers: number;
  avgWatchTime: string;
}

export interface DashboardSummary {
  totalEvents: number;
  totalViews: number;
  totalAdmins: number;
  ytdRevenue: number;
  previousYtdRevenue: number;
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
