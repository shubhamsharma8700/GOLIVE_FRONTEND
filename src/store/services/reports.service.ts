import { adminBaseApi } from "./adminBaseApi";

export interface AnalyticsReportSummary {
  totalViews: number;
  avgViewers: number;
  totalWatchTime: number;
  avgWatchTimePerSession: number;
  totalEvents: number;
  totalViewers: number;
  totalSessions: number;
  paidViewers: number;
  totalRevenue: number;
  totalRevenueCurrency?: string;
}

export interface ViewershipPoint {
  month: string;
  anonymous: number;
  registered: number;
  total: number;
}

export interface RegistrationSourcePoint {
  source: string;
  count: number;
  color: string;
  percentage: number;
}

export interface TopVideoPoint {
  name: string;
  views: number;
  completionRate: number;
}

export interface DailyEngagementPoint {
  day: string;
  views: number;
  avgTime: string;
}

export interface PeakHourPoint {
  hour: string;
  viewers: number;
}

export interface TopEventComparisonPoint {
  name: string;
  viewers: number;
  peakConcurrent: number;
  avgWatchTime: number;
}

export interface EventEngagementPoint {
  name: string;
  viewers: number;
  engagement: number;
  completionRate: number;
  size: number;
}

export interface AnalyticsReportCharts {
  viewershipData: ViewershipPoint[];
  registrationSourceData: RegistrationSourcePoint[];
  topVideosData: TopVideoPoint[];
  dailyEngagementData: DailyEngagementPoint[];
  peakHoursData: PeakHourPoint[];
  topEventsComparison: TopEventComparisonPoint[];
  eventEngagementData: EventEngagementPoint[];
}

export interface AnalyticsTopEvent {
  eventId: string;
  name: string;
  date: string | null;
  type: string;
  status: string;
  viewers: number;
  uniqueViewers: number;
  peakConcurrent: number;
  avgWatchTime: number;
  duration: string;
  engagement: number;
  completionRate: number;
  size: number;
  revenueUsd?: number;
}

export interface AnalyticsReportResponse {
  success: boolean;
  filter: {
    eventId: string;
  };
  summary: AnalyticsReportSummary;
  charts: AnalyticsReportCharts;
  topEvents: AnalyticsTopEvent[];
}

export const reportsApi = adminBaseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAnalyticsReport: builder.mutation<AnalyticsReportResponse, { eventId?: string }>({
      query: (body) => ({
        url: "/analyticsReport",
        method: "POST",
        body: { eventId: body.eventId ?? "all" },
      }),
      invalidatesTags: ["Reports"],
    }),
  }),
});

export const { useGetAnalyticsReportMutation } = reportsApi;
